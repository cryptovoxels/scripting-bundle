/* global parcel,self,postMessage */

import {
  Vector3,
  Quaternion,
  Vector2,
  Color3,
  Matrix,
} from "@babylonjs/core/Maths/math";

import { Animation } from "@babylonjs/core/Animations/animation";
const throttle = require('lodash.throttle')
const uuid = require("uuid/v4");
const EventEmitter = require("events");
const Feature = require("./feature");
const emojis = require("./helpers.js").emojis;
const animations = require("./helpers.js").animations;

const { VoxelField } = require("./voxel-field");
const Player = require("./player");

function getGlobal() {
  if (typeof global !== "undefined") {
    return global;
  } else if (typeof self !== "undefined") {
    return self;
  } else {
    return null;
  }
}
// the grid is usually `global` and the iframe when the script is not hosted is usually `self`;
// Even though `window` will always be null, getGlobal() doesn't return it just in case, because we don't want
// to override the setInterval of the window (could affect render).
const G = getGlobal();
if (G) {
  G.setInterval = (function (setInterval) {
    return function (func, time, ...args) {
      let t = time;
      if (isNaN(parseInt(time, 10))) {
        console.error("setInterval interval is invalid");
        return;
      }
      if (parseInt(time, 10) < 30) {
        t = 30;
        console.log("setInterval minimum is 30ms");
      }
      return setInterval.call(G, func, t, ...args);
    };
  })(G.setInterval);

  G.emojis = emojis
  G.animations = animations
}

class Parcel extends EventEmitter {
  constructor(id) {
    super();
    this.id = id;
    this.players = [];
    this.featuresList = [];
  }

  listen(port) {}

  onMessage(ws, msg) {
    //  if(msg.type=='click'){console.log('onMessage', msg)}
    if (msg.type === "playerenter") {
      this.join(msg.player);
      return;
    }

    if (!ws.player) {
      return;
    }

    if (msg.type === "playerleave") {
      this.leave(ws.player);
    } else if (msg.type === "move") {
      if (!ws.player.onMove) {
        return;
      }
      ws.player.onMove(msg);
    } else if (msg.type === "click") {
      const f = this.getFeatureByUuid(msg.uuid);
      let player;
      if (!f) {
        player = this.getPlayerByUuid(msg.uuid);
      }

      if (!f && !player) {
        console.log("cant find feature or player " + msg.uuid);
        return;
      }

      const e = Object.assign(
        {},
        msg.event,
        {
          player: ws.player,
        },
        !!player && { targetPlayer: player }
      );

      if (e.point) {
        e.point = Vector3.FromArray(e.point);
        e.normal = Vector3.FromArray(e.normal);
      }

      !!f && f.emit("click", e);
      !!player && player.emit("click", e);
    } else if (msg.type === "trigger") {
      const f = this.getFeatureByUuid(msg.uuid);

      if (!f) {
        console.log("cant find feature " + msg.uuid);
        return;
      }

      const e = Object.assign({}, msg.event, {
        player: ws.player,
      });

      f.emit("trigger", e);
    } else if (msg.type === "keys") {
      const f = this.getFeatureByUuid(msg.uuid);
      if (!f) return;
      f.emit("keys", msg.event);
    } else if (msg.type === "start") {
      const f = this.getFeatureByUuid(msg.uuid);
      if (!f) return;
      f.emit("start");
    } else if (msg.type === "stop") {
      const f = this.getFeatureByUuid(msg.uuid);
      if (!f) return;
      f.emit("stop");
    } else if (msg.type === "changed") {
      const f = this.getFeatureByUuid(msg.uuid);
      if (!f) return;
      f.emit("changed", msg.event);
    }
  }

  join(player) {
    if (!player.wallet) {
      return;
    }
    let p = this.players.find(
      (p) => p.wallet === player.wallet && p.uuid === player.uuid
    );
    if (p) {
      return;
    }
    this.emit("playerenter", {
      player: player instanceof Player ? player : new Player(player, this),
    });
    if (!player instanceof Player) {
      return;
    }
    this.players.push(player);
  }

  leave(player) {
    let p = this.getPlayerByWallet(player.wallet);
    const i = this.players.indexOf(p);

    this.players.splice(i, 1);

    this.emit("playerleave", {
      player: player instanceof Player ? player : new Player(player, this),
    });
  }

  broadcast(message) {
    const packet = JSON.stringify(message); // console.log('broadcast', packet)

    postMessage(packet);
  }

  fetch() {}

  debug() {
    if (typeof document === "undefined") {
      return;
    }

    if (!this.featuresList) {
      return;
    } // console.log('debug')

    const ul = document.querySelector("#debug");
    ul.innerHTML = this.featuresList
      .map(
        (f) => `
        <li>
          ${f.type}${f.id ? "#" + f.id : ""}<br />
          <small>${f.uuid}</small>
        </li>
       `
      )
      .join("");
  }

  parse(parcel) {
    Object.assign(this, parcel); // Create features array
    this.featuresList = Array.from(parcel.features).map(
      (f) => !!f && Feature.create(this, f)
    );
    this.voxels = new VoxelField(this);
  }

  getPlayerByUuid(uuid) {
    return this.players.find((p) => p.uuid === uuid);
  }

  getPlayerByWallet(wallet) {
    return this.players.find((p) => p.wallet === wallet);
  }

  getFeatureByUuid(uuid) {
    return this.featuresList.find((f) => f.uuid === uuid);
  }

  getFeatureById(id) {
    return this.featuresList.find((f) => f.id === id);
  }

  getFeatures() {
    return this.featuresList;
  }

  getFeaturesByType(type) {
    return this.featuresList.filter((f) => f.type === type);
  }

  getPlayers() {
    return this.players;
  }
  /* Thottled functions */
  fetchSnapshots = throttle(
    (callback = null) => {
      this._fetchSnapshots(callback);
    },
    500,
    {
      leading: false,
      trailing: true,
    }
  );
  setSnapshot = throttle(
    (index) => {
      this._setSnapshot(index);
    },
    500,
    {
      leading: false,
      trailing: true,
    }
  );

  _fetchSnapshots(callback = null) {
    const api_url = `https://www.cryptovoxels.com/api/parcels/${this.id}/snapshots.json`;
    let promise;
    if (typeof global == "undefined" || !global.fetchJson) {
      /* fetch doesn't work nicely on the grid. So we use 'fetchJson' when on scripthost, and fetch() when local */
      promise = fetch(api_url).then((r) => r.json());
    } else {
      promise = fetchJson(api_url);
    }
    promise.then((r) => {
      if (!r.success) {
        this.snapshots = [];
      } else {
        this.snapshots = r.snapshots;
      }

      if (callback) {
        callback(r.snapshots);
      }
    });
  }

  _setSnapshot(snapshot_id) {
    if (!this.snapshots) {
      console.error("Call parcel.fetchSnapshots first");
      return;
    }
    if (this.snapshots.length == 0) {
      console.error("No snapshots for this parcel");
      return;
    }
    const snapshot = this.snapshots.find((s) => s.id == snapshot_id);

    if (!snapshot) {
      console.error("Could not find snapshot given ID");
      return;
    }

    if (!("content" in snapshot) || snapshot.is_snapshot !== true) {
      console.error("Not a valid snapshot");
      return;
    }

    if (!snapshot.content.voxels) {
      console.error("Snapshot has no voxels");
      return;
    }

    delete snapshot.id;
    let p = Object.assign({}, this, snapshot);
    delete p.players;
    delete p.featuresList;
    p.features = p.content.features;
    p.voxels = p.content.voxels;
    p.palette = p.content.palette;
    p.tileset = p.content.tileset;

    this.broadcast({
      type: "snapshot",
      parcel: p,
    });
  }

  createFeature(type, description) {
    const feature = Feature.create(
      this,
      Object.assign(
        {
          position: Vector3.Zero(),
          rotation: Vector3.Zero(),
          scale: new Vector3(1, 1, 1),
          type,
          uuid: uuid(),
        },
        description || {}
      )
    );
    this.featuresList.push(feature);
    this.broadcast({
      type: "create",
      uuid: feature.uuid,
      content: feature._content,
    });
    return feature;
  }

  removeFeature(f) {
    this.broadcast({
      type: "remove",
      uuid: f.uuid,
    });
    const i = this.featuresList.indexOf(f);

    if (i > -1) {
      this.featuresList.splice(i);
    }
  }

  start() {
    // fake websocket
    const ws = {
      readyState: 1,
    };

    self.onmessage = (e) => {
      if (!e.data.player) {
        return;
      }

      let oldPlayer = this.players.find(
        (p) => p.wallet == e.data.player.wallet
      );
      if (oldPlayer) {
        // we have an old player (perfect)
        ws.player =
          oldPlayer instanceof Player ? oldPlayer : new Player(oldPlayer, this);
      }

      // We don't have a new player:
      if (e.data.type !== "join") {
        parcel.onMessage(ws, e.data);
        return;
      }
      // A previous player is re-joining and socket Id is already registered
      if (oldPlayer && e.data.player.wallet === oldPlayer.wallet) {
        ws.player = new Player(e.data.player, this);
        let i = this.players.indexOf(oldPlayer);
        if (i !== -1) {
          this.players[i] = ws.player;
        }
      } else {
        // We do not have that player
        ws.player = new Player(e.data.player, this);
        this.join(ws.player);
      }
    };
  }
}
class Space extends Parcel {
  constructor(id) {
    super(id);
  }

  _fetchSnapshots() {}
  _setSnapshot() {}
}

export default {
  Parcel,
  Space,
  Feature,
  Animation,
  VoxelField,
  Vector3,
  Quaternion,
  Vector2,
  Color3,
  Matrix,
};

if (typeof self !== "undefined") {
  Object.assign(self, {
    Parcel,
    Space,
    Feature,
    Animation,
    VoxelField,
    Vector3,
    Quaternion,
    Vector2,
    Color3,
    Matrix,
  }); // eslint-disable-line
}
