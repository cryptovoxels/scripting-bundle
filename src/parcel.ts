/* global parcel,self,postMessage */

import { Vector3 } from "@babylonjs/core/Maths/math";

import { ParcelOrSpaceId } from "./types";
import { emojis as emojiList } from "./helpers";
import { Player } from "./player";
import { Feature } from "./feature";
import { Message, SupportedMessageTypes } from "./lib/messages";
import {
  FeatureDescription,
  IParcel,
  ParcelBroadcastMessage,
  ParcelDescription,
  Snapshot,
} from "./lib/types";
import { EventEmitter } from "events";
// const throttle = require("lodash.throttle");
//@ts-ignore
import throttle from "lodash.throttle";
import * as uuid from "uuid";

function getGlobal() {
  if (typeof global !== "undefined") {
    return global;
  } else if (typeof self !== "undefined") {
    return self;
  } else {
    return null;
  }
}

// Register of the singletons we still have bound to window
declare global {
  function fetchJson(url: string): Promise<any>;
  var emojis: string[];
  var animations: any[];
  var global: typeof global;
}

type ExtendedWebSocket = WebSocket & { player: Player };

// the grid is usually `global` and the iframe when the script is not hosted is usually `self`;
// Even though `window` will always be null, getGlobal() doesn't return it just in case, because we don't want
// to override the setInterval of the window (could affect render).
const G = getGlobal();
if (G) {
  //@ts-expect-error
  G.setInterval = (function (setInterval) {
    return function (func: TimerHandler, time: number, ...args: any[]) {
      let t = time;
      if (isNaN(parseInt(time.toString(), 10))) {
        console.error("[Scripting] setInterval interval is invalid");
        return;
      }
      if (parseInt(time.toString(), 10) < 30) {
        t = 30;
        console.log("[Scripting] setInterval minimum is 30ms");
      }
      //@ts-ignore
      return setInterval.call(G, func, t, ...args);
    };
  })(G.setInterval);

  G.emojis = emojiList;
  G.animations = [];
}

class AbstractParcel extends EventEmitter implements IParcel {
  x1!: number;
  y1!: number;
  z1!: number;
  x2!: number;
  y2!: number;
  z2!: number;
  address?: string;
}

/**
 * Represents the Parcel instance.
 */
/* @internal */
export default class Parcel extends AbstractParcel {
  private _allowedUsers: string[];
  private _isPrivate: boolean = false;
  private _allowLoggedInOnly: boolean = false;
  private _initiated: boolean = false;
  /**
   * Owner of the parcel
   */
  owner: string = "";
  /**
   * A Map of all the players connected to the parcel; <token -> player>
   */
  players: Map<string, Player>;
  /**
   * A list of all the Feature objects in the parcel
   */
  featuresList: Feature[];
  id: ParcelOrSpaceId;
  /**
   * A list of all the snapshots of the parcel;
   * Is empty until fetchSnapshots() is called.
   */
  snapshots: Snapshot[];
  private _description: ParcelDescription | undefined;
  constructor(id: ParcelOrSpaceId) {
    super();
    this.id = id;
    this.players = new Map();
    this.featuresList = [];
    this._allowedUsers = [];
    this.snapshots = [];
  }
  /**
   * Returns a summary of the parcel
   * @returns the properties of the parcel object.
   */
  get summary() {
    return {
      id: this.id,
      ...this._description,
    };
  }

  private onMessage(ws: ExtendedWebSocket, msg: Message) {
    //  if(msg.type=='click'){console.log('onMessage', msg)}

    // ws.player should always be defined
    if (msg.type === "playerenter") {
      // player left the parcel
      this.onPlayerEnter(ws.player);
    } else if (msg.type === "playerleave") {
      // player left the parcel
      this.exitParcel(ws.player);
    } else if (msg.type === "playernearby") {
      // player in the area
      this.onPlayerNearby(ws.player);
      return;
    } else if (msg.type === "playeraway") {
      // player left the area
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
        console.log("[Scripting] Cant find feature or player " + msg.uuid);
        return;
      }

      const e = Object.assign(
        {},
        msg.event,
        {
          player: ws.player,
        },
        !!player && { targetPlayer: player }
      ) as Record<string, unknown>;

      if (msg.event.point) {
        e.point = Vector3.FromArray(msg.event.point);
      }
      if (msg.event.normal) {
        e.normal = Vector3.FromArray(msg.event.normal);
      }

      const guiTarget = e.guiTarget as string | undefined;
      if (f && guiTarget && f.gui) {
        const guiControl = f.gui.getControlByUuid(guiTarget);
        if (guiControl) {
          guiControl.emit("click", e);
          return;
        }
      }

      !!f && !!f.onClick && f.onClick();

      !!f && f.emit("click", e);
      !!player && player.emit("click", e);
    } else if (msg.type === "trigger") {
      const f = this.getFeatureByUuid(msg.uuid);

      if (!f) {
        console.log("[Scripting] Cant find feature " + msg.uuid);
        return;
      }

      const e = Object.assign({}, msg.event, {
        player: ws.player,
      });

      f.emit("trigger", e);
    } else if (msg.type === "keys") {
      // used by animations
      const f = this.getFeatureByUuid(msg.uuid);
      if (!f) return;
      f.emit("keys", msg.event);
    } else if (msg.type === "start") {
      // mainly used by vidScreen
      const f = this.getFeatureByUuid(msg.uuid);
      if (!f) return;
      f.emit("start");
    } else if (msg.type === "stop") {
      // mainly used by vidScreen
      const f = this.getFeatureByUuid(msg.uuid);
      if (!f) return;
      f.emit("stop");
    } else if (msg.type === "changed") {
      // Catch "Changed" values in input-text or slider-input objects
      const f = this.getFeatureByUuid(msg.uuid);
      if (!f) return;
      f.emit("changed", msg.event);
    } else if (msg.type === "chat") {
      // Catch "Chat" messages
      const a = this.getPlayerByUuid(msg.uuid);

      if (!a) return;
      a.emit("chat", msg.event);
    } else if (msg.type === "patch") {
      // parcel feature patch; These are patches from client-> server that are also sent to ScriptHost to update the feature.
      const f = this.getFeatureByUuid(msg.uuid);
      const data = msg.event;

      if (!f) return;
      let description = f.description;

      Array.from(Object.keys(data)).forEach((key) => {
        description[key] = data[key];
      });
      // update the feature (reset it)
      this.removeFeature(f, false);
      this.createFeature(description.type, description, false);
    }
  }

  private onPlayerEnter = (player: Player) => {
    // Check if player is allowed in parcel only for the `playerenter` event

    let isAllowed = this.isWalletAllowedIfPrivate(player.wallet);
    if (!isAllowed) {
      console.log("[Scripting] Wallet Not allowed in parcel");
      // if user is not allowed in parcel kick him.
      let tmpPlayer =
        player instanceof Player ? player : new Player(player, this);
      tmpPlayer.kick(
        `Parcel ${this.id} is private and you're not allowed by the owner.`
      );
      return;
    }

    if (this.allowLoggedInOnly) {
      let tmpPlayer =
        player instanceof Player ? player : new Player(player, this);

      if (!tmpPlayer.isLoggedIn()) {
        console.log("[Scripting] non-logged in users not allowed in parcel");
        tmpPlayer.kick(`Parcel ${this.id} only allows signed-in users.`);
        return;
      }
    }
    // player is inside parcel
    player.isWithinParcel = true;
    this.emit(SupportedMessageTypes.PlayerEnter, { player: player });
  };

  private onPlayerNearby = (player: Player) => {
    // player is nearby parcel
    player.isWithinParcel = false;
    this.emit(SupportedMessageTypes.PlayerNearby, { player: player });
  };

  private join(player: Player) {
    // Player here SHOULD be an object with a token and a uuid
    if (!player.token && !player.uuid) {
      console.log("[Scripting] Player is invalid");
      return;
    }

    if (this.players.has(player.token)) {
      console.log("[Scripting] Player already joined");
      return;
    }

    //nothing
    player.isWithinParcel = false;

    // Add player to list of players
    this.players.set(player.token, player);

    this.emit(SupportedMessageTypes.Join, {
      player,
    });
  }

  private exitParcel(player: Player) {
    if (!player.token) {
      console.log("[Scripting] Player has no token");
      return;
    }
    let p = this.players.get(player.token);

    if (p) {
      p.isWithinParcel = false;
      this.emit(SupportedMessageTypes.PlayerLeave, {
        player: p,
      });
    }
  }

  private leave(player: Player) {
    if (!player.token) {
      console.log("[Scripting] Player has no token");
      return;
    }
    let p = this.players.get(player.token);
    if (p) {
      p.isWithinParcel = false;
      this.emit("playeraway", {
        player: p,
      });
    }

    this.players.delete(player.token);
  }
  /**
   * Broadcast a message to the client.
   * Note: this is mainly used internally.
   * @param message
   */
  broadcast(message: ParcelBroadcastMessage) {
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
    }

    const ul = document.querySelector("#debug");
    if (!ul) {
      return;
    }

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
  /**
   * Parse a parcel object
   * @param parcel an object {id:string,features:Feature[]}
   */
  parse(parcel: ParcelDescription) {
    Object.assign(this, parcel); // Create features array
    this._description = parcel;
    if (parcel.contributors) {
      this._allowedUsers = parcel.contributors.map((c) => c.toLowerCase());
    }
    this.featuresList = Array.from(parcel.features || []).map(
      (f) => !!f && Feature.create(this, f)
    );
  }

  /**
   * Get a player by its UUID
   *
   * @param uuid a string
   * @returns a {@link Player} or Undefined
   */
  getPlayerByUuid(uuid: string) {
    if (typeof uuid !== "string") {
      return;
    }

    // Don't want to lose the reference to the object
    for (let [k, v] of this.players.entries()) {
      if (v.uuid.toLowerCase() == uuid.toLowerCase()) {
        return v;
      }
    }
  }

  /**
   * Get a player by its wallet
   *
   * @param wallet the player's wallet
   * @returns a {@link Player} object or undefined
   */
  getPlayerByWallet(wallet: string) {
    if (typeof wallet !== "string") {
      return;
    }
    // Don't want to lose the reference to the object
    for (let [k, v] of this.players.entries()) {
      if (v.wallet?.toLowerCase() == wallet?.toLowerCase()) {
        return v;
      }
    }
    return null;
  }
  /**
   * Get a feature by its UUID
   *
   * @param uuid the feature's UUID
   * @returns a {@link Feature} or Undefined
   */
  getFeatureByUuid(uuid: string) {
    return this.featuresList.find((f) => f.uuid === uuid);
  }
  /**
   * Get a feature by its ID
   *
   * @param id the feature's ID
   * @returns a {@link Feature} or undefined
   */
  getFeatureById(id: string) {
    return this.featuresList.find((f) => f.id === id);
  }
  /**
   * Get a list of all features
   * @returns {@link Feature}[]
   */
  getFeatures() {
    return this.featuresList;
  }
  /**
   * Get a list of all features of the given type
   * @returns {@link Feature}[]
   */
  getFeaturesByType(type: string) {
    return this.featuresList.filter((f) => f.type === type);
  }
  /**
   * Get a list of all players connected to the parcel
   * @returns {@link Player}[]
   */
  getPlayers() {
    return this.players;
  }
  /**
   * Get a list of all players that are within the parcel
   * A player within the parcel is player that's sent the event 'playerenter'
   * @returns {@link Player}[]
   */
  getPlayersWithinParcel() {
    let playersInside: Player[] = [];
    // Don't want to lose the reference to the object
    for (let [k, v] of this.players.entries()) {
      if (v.isWithinParcel) {
        playersInside.push(v);
      }
    }
    return playersInside;
  }

  /**
   * Throttled function to fetch the snapshots of the parcel;
   * @param callback a Callback expecting an array of objects.
   * Eg:
   * ```typescript
   * function myCallback(snapshots){
   *    parcel.setSnapshot(snapshots[0].id)
   *  }
   *
   *  feature.on('click',e=>{
   *    parcel.fetchSnapshots(myCallback)
   *  })
   * ```
   */
  fetchSnapshots = throttle(
    (callback?: (snapshots: any[]) => void) => {
      this._fetchSnapshots(callback);
    },
    500,
    {
      leading: false,
      trailing: true,
    }
  ) as (callback?: (snapshots: Snapshot[]) => void) => void;
  /**
   * Sets the parcel content to the given snapshot index.
   * This should be called after 'fetchSnaphots' has been called.
   * @param index the id of the snapshot
   */
  setSnapshot = throttle(
    (index: number) => {
      this._setSnapshot(index);
    },
    500,
    {
      leading: false,
      trailing: true,
    }
  ) as (snapshot_id: number) => void;

  private _fetchSnapshots(callback?: (snapshots: Snapshot[]) => void): void {
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
        this.snapshots = r.snapshots as Snapshot[];
      }

      if (callback) {
        callback(r.snapshots);
      }
    });
  }

  private _setSnapshot(snapshot_id: number) {
    if (this.snapshots.length == 0) {
      console.error(
        "[Scripting] No snapshots for this parcel, try calling parcel.fetchSnapshots first"
      );
      return;
    }
    const snapshot = Object.assign(
      {},
      this.snapshots.find((s) => s.id == snapshot_id)
    ) as Partial<Snapshot>;

    if (!snapshot.content) {
      console.error("[Scripting] Not a valid snapshot");
      return;
    }

    if (!snapshot.content.voxels) {
      console.error("Snapshot has no voxels");
      return;
    }

    delete snapshot.id;
    let p = Object.assign({}, this.summary) as ParcelDescription;

    this.featuresList.forEach((f) => {
      this.removeFeature(f, false);
    });

    p.features = snapshot.content.features;
    p.voxels = snapshot.content.voxels;
    p.palette = snapshot.content.palette;
    p.tileset = snapshot.content.tileset;

    this.parse(p);

    this.broadcast({
      type: "snapshot",
      parcel: p,
    });
  }
  /**
   * Create a feature
   * @param type a valid feature type, eg: 'vox-model'
   * @param description an optional object.
   * @returns {@link Feature}
   */
  createFeature(
    type: string,
    description?: FeatureDescription,
    shouldBroadcast = true
  ) {
    const feature = Feature.create(
      this,
      Object.assign(
        {
          position: Vector3.Zero().asArray(),
          rotation: Vector3.Zero().asArray(),
          scale: new Vector3(1, 1, 1).asArray(),
          type,
          //@ts-expect-error
          uuid: uuid.default? uuid.default.v4():uuid.v4(),
          createdByScripting: true,
        },
        description || {}
      )
    );
    this.featuresList.push(feature);
    if (shouldBroadcast) {
      this.broadcast({
        type: "create",
        uuid: feature.uuid,
        content: feature.description,
      });
    }
    return feature;
  }
  /**
   * Deletes a feature and removes it from the parcel
   * @param f {@link Feature}
   */
  removeFeature(f: Feature, shouldBroadcast = true) {
    if (shouldBroadcast) {
      this.broadcast({
        type: "remove",
        uuid: f.uuid,
      });
    }
    const i = this.featuresList.indexOf(f);

    if (i > -1) {
      this.featuresList.splice(i, 1);
      f.removeGui();
    }
  }

  start() {
    if (this._initiated) {
      return;
    }
    this._initiated = true;
    const ws = {
      readyState: 1,
      player: undefined,
    } as unknown as ExtendedWebSocket;

    self.onmessage = (e) => {
      const data = e.data as Message;
      if (
        data &&
        (data.target == "metamask-contentscript" ||
          data.target == "metamask-inpage" ||
          data.target == "inpage")
      ) {
        // ignore metamask messages
        return;
      }

      if (!Object.values(SupportedMessageTypes).includes(data.type)) {
        // invalid message type, ignore
        return;
      }

      //@ts-ignore
      if (!data.player && !data.player._token) {
        // no player record in the dataPacket, ignore
        return;
      }
      let oldPlayer = this.players.get(data.player._token.toLowerCase());

      if (oldPlayer) {
        // we have an old player (perfect)
        ws.player = oldPlayer;
        // update player info
        ws.player._set(data.player);
        // console.log('[Scripting] Welcome back ', oldPlayer.name || oldPlayer.wallet || oldPlayer.uuid)
      } else {
        // player is non-existant
        ws.player = new Player(data.player, this);
      }

      if (!ws.player) {
        console.log("[Scripting] Player non-existant");
      }

      // Message is not "Join", redirect to onMessage.
      if (data.type !== SupportedMessageTypes.Join) {
        this.onMessage(ws, data);
        return;
      } else {
        // Throw join event.
        this.join(ws.player);
      }
    };
  }

  /* Section to make parcels more elitist*/
  get isPrivate() {
    return this._isPrivate;
  }
  set isPrivate(state) {
    if (typeof state == "boolean") {
      this._isPrivate = state;
      if (state) {
        // if we switched it to true, then kick out all the players not allowed.
        this.players.forEach((player) => {
          if (!this.isWalletAllowedIfPrivate(player.wallet)) {
            // Player not allowed
            player.kick(
              `Parcel ${this.id} switched to private mode and you're not in the allowed list.`
            );
          }
        });
      }
    } else {
      console.error(["[Scripting] isPrivate is a boolean"]);
    }
  }

  get allowLoggedInOnly() {
    return this._allowLoggedInOnly;
  }
  set allowLoggedInOnly(state: boolean) {
    if (typeof state == "boolean") {
      this._allowLoggedInOnly = state;
    } else {
      console.error(["[Scripting] allowLoggedInOnly is a boolean"]);
    }
  }

  get allowedWallets() {
    return this._allowedUsers || [];
  }

  allow(walletOrWallets: string | string[]) {
    if (
      typeof walletOrWallets !== "string" &&
      typeof walletOrWallets !== "object"
    ) {
      console.log("[Scripting] wallet has to be a string or and array");
      return;
    }
    if (Array.isArray(walletOrWallets)) {
      walletOrWallets.forEach((w) => {
        if (typeof w == "string" && this.allowedWallets.indexOf(w) == -1) {
          this._allowedUsers.push(w.toLowerCase());
        }
      });
      return;
    }
    // Wallet is a string:
    if (this._allowedUsers.indexOf(walletOrWallets.toLowerCase()) != -1) {
      console.log("[Scripting] Wallet already allowed");
      return;
    }
    this._allowedUsers.push(walletOrWallets.toLowerCase());
  }
  disallow(wallet: string) {
    if (typeof wallet !== "string") {
      console.log("[Scripting] wallet has to be a string");
      return;
    }
    if (wallet.toLowerCase() == (this.owner ? this.owner.toLowerCase() : "")) {
      console.log("[Scripting] Cannot disallow owner");
      return;
    }

    let index = this._allowedUsers.indexOf(wallet.toLowerCase());

    if (index == -1) {
      return;
    }
    this._allowedUsers.splice(index, 1);
    let player = this.getPlayerByWallet(wallet);
    if (player) {
      player.kick(
        `You've been removed from the allowed list of Parcel ${this.id} `
      );
    }
  }

  isWalletAllowedIfPrivate(wallet?: string) {
    if (!this.isPrivate) {
      return true;
    }
    if (typeof wallet !== "string") {
      return false;
    }
    if (wallet.toLowerCase() === this.owner.toLowerCase()) {
      return true;
    }
    return this._allowedUsers.indexOf(wallet.toLowerCase()) !== -1;
  }
}

/* @internal */
export class Space extends Parcel {
  constructor(id: ParcelOrSpaceId) {
    super(id);
  }
  fetchSnapshots = (callback: Function | null = null) => {
    console.log("[Scripting] fetchsnapshot() Not supported in spaces");
  };

  setSnapshot = () => {
    console.log("[Scripting] setSnapshot() Not supported in spaces");
  };

  disallow() {
    console.log("[Scripting] Disallow() Not supported in spaces");
  }
  allow() {
    console.log("[Scripting] Allow() Not supported in spaces");
  }

  isWalletAllowedIfPrivate(wallet: string) {
    return true;
  }
}
