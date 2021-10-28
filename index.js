/* global parcel,self,postMessage */

import {
  Vector3,
  Quaternion,
  Vector2,
  Color3,
  Matrix,
} from "@babylonjs/core/Maths/math";

import { Animation } from "@babylonjs/core/Animations/animation";
const throttle = require("lodash.throttle");

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
        console.error("[Scripting] setInterval interval is invalid");
        return;
      }
      if (parseInt(time, 10) < 30) {
        t = 30;
        console.log("[Scripting] setInterval minimum is 30ms");
      }
      return setInterval.call(G, func, t, ...args);
    };
  })(G.setInterval);

  G.emojis = emojis;
  G.animations = animations;
}

class Parcel extends EventEmitter {
  constructor(id) {
    super();
    this.id = id;
    this.players = [];
    this.featuresList = [];
    this._allowedUsers = []
    this._isPrivate = false 
    this._allowLoggedInOnly = false 
  }

  listen(port) {}

  onMessage(ws, msg) {
    //  if(msg.type=='click'){console.log('onMessage', msg)}
    if (msg.type === "playerenter") {
      this.join(msg.player,msg.type);
      return;
    }

    if (!ws.player) {
      return;
    }

    if (msg.type === "playerleave") {
      // player left the parcel
      this.exitParcel(msg.player);
    } else if (msg.type === "playernearby") {
      // player in the area
      this.join(msg.player,msg.type);
      return;
    } else if (msg.type ==="playeraway"){
      // player left the area
      this.leave(msg.player);
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
      );

      if (e.point) {
        e.point = Vector3.FromArray(e.point);
        e.normal = Vector3.FromArray(e.normal);
      }

      if (f && e.guiTarget && f.gui) {
        const guiControl = f.gui.getControlByUuid(e.guiTarget);
        if (guiControl) {
          guiControl.emit("click", e);
          return;
        }
      }

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

  join(player,event=null) {
    // Player here SHOULD be an object with a wallet and a uuid
    if (!player.wallet) {
      return;
    }


    let p = this.players.find(
      (p) => p.wallet.toLowerCase() === player.wallet?.toLowerCase() && p.uuid === player.uuid
    );

    // Check if player is allowed in parcel only for the `playerenter` event
    if(event=='playerenter'){

      let isAllowed = this.isWalletAllowedIfPrivate(player.wallet)
      if(!isAllowed){
        console.log('[Scripting] Wallet Not allowed in parcel')
        // if user is not allowed in parcel kick him.
        let tmpPlayer = player instanceof Player ? player : new Player(player, this)
        tmpPlayer.kick(`Parcel ${this.id} is private and you're not allowed by the owner.`)
        return
      }
      
      if (this.allowLoggedInOnly){
        let tmpPlayer = player instanceof Player ? player : new Player(player, this)
  
        if(!tmpPlayer.isLoggedIn()){
          console.log('[Scripting] non-logged in users not allowed in parcel')
          tmpPlayer.kick(`Parcel ${this.id} only allows signed-in users.`)
          return
        }
  
      }
      // player is inside parcel
      player._iswithinParcel=true
    }else if(event=='playernearby'){
      // player is nearby parcel
      player._iswithinParcel=false
    }else if(event=='join'){
     //nothing
     player._iswithinParcel=false
    }

    if (p) {
      p._set(player)
    }else{
      p = new Player(player,this)
      this.players.push(p);
    }

    // we never rebroadcast the join event, pointless
    if(event !=='join'){
      this.emit(event, {
        player: p,
      });
    }
  }

  exitParcel(player){
    if(!player.wallet){
      return
    }
    let p = this.players.find(
      (p) => p.wallet.toLowerCase() === player.wallet?.toLowerCase() && p.uuid === player.uuid
    );

    if(p){
      p._iswithinParcel = false
      this.emit("playerleave", {
        player: p,
      });
    }

  }

  leave(player) {
    let p = this.getPlayerByWallet(player.wallet);
    if(!p){
      return
    }
    const i = this.players.indexOf(p);

    this.players.splice(i, 1);
    player._iswithinParcel = false
    this.emit("playeraway", {
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
    if(parcel.contributors){
      this._allowedUsers=parcel.contributors.map((c)=>c.toLowerCase())
    }
    this.featuresList = Array.from(parcel.features).map(
      (f) => !!f && Feature.create(this, f)
    );
    this.voxels = new VoxelField(this);
  }

  getPlayerByUuid(uuid) {
    if(typeof uuid !=='string'){
      return
    }
    return this.players.find((p) => p.uuid === uuid);
  }

  getPlayerByWallet(wallet) {
    if(typeof wallet !=='string'){
      return
    }
    return this.players.find((p) => p.wallet.toLowerCase() === wallet.toLowerCase());
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

  getPlayersWithinParcel() {
    return this.players.filter((p)=>!!p.iswithinParcel);
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
      console.error("[Scripting] Call parcel.fetchSnapshots first");
      return;
    }
    if (this.snapshots.length == 0) {
      console.error("[Scripting] No snapshots for this parcel");
      return;
    }
    const snapshot = this.snapshots.find((s) => s.id == snapshot_id);

    if (!snapshot) {
      console.error("[Scripting] Could not find snapshot given ID");
      return;
    }

    if (!("content" in snapshot) || snapshot.is_snapshot !== true) {
      console.error("[Scripting] Not a valid snapshot");
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
          createdByScripting:true,
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
      this.featuresList.splice(i,1);
      f.removeGui();
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
        (p) => p.wallet.toLowerCase() == e.data.player.wallet?.toLowerCase()
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
      if (oldPlayer) {
        ws.player = new Player(e.data.player, this);
        this.join(ws.player,null);
      } else {
        // We do not have that player
        ws.player = new Player(e.data.player, this);
        this.join(ws.player,'join'); // don't throw an event on join, receive the proper "playerenter" or "playernearby" later
      }
    };
  }

  /* Section to make parcels more elitist*/
  get isPrivate(){
    return this._isPrivate
  }  
  set isPrivate(state){
    if(typeof state=='boolean'){
    this._isPrivate = state
    if(state){
      // if we switched it to true, then kick out all the players not allowed.
      this.players.forEach((player)=>{
        
        if(!this.isWalletAllowedIfPrivate(player.wallet)){
          // Player not allowed
            player.kick(`Parcel ${this.id} switched to private mode and you're not in the allowed list.`)
          
        }

      })

    }
    }else{
      console.error(['[Scripting] isPrivate is a boolean'])
    }
  }

  get allowLoggedInOnly(){
    return this._allowLoggedInOnly
  }  
  set allowLoggedInOnly(state){
    if(typeof state=='boolean'){
      this._allowLoggedInOnly = state
    }else{
      console.error(['[Scripting] allowLoggedInOnly is a boolean'])
    }

  }

  get allowedWallets(){
    return this._allowedUsers || []
  }

  allow(wallet){
    if(typeof wallet !== 'string' && typeof wallet !== 'object'){
      console.log('[Scripting] wallet has to be a string or and array')
      return
    }
    if(Array.isArray(wallet)){
      wallet.forEach((w)=>{
        if(typeof w == 'string' && this.allowedWallets.indexOf(wallet)==-1){
          this._allowedUsers.push(w.toLowerCase())
        }
        
      })
      return
    }
    // Wallet is a string:
    if(this._allowedUsers.indexOf(wallet.toLowerCase())!=-1){
      console.log('[Scripting] Wallet already allowed')
      return
    }
    this._allowedUsers.push(wallet.toLowerCase())
  }
  disallow(wallet){
    if(typeof wallet !== 'string'){
      console.log('[Scripting] wallet has to be a string')
      return
    }
    if(wallet.toLowerCase() == (this.owner ? this.owner.toLowerCase():'')){
      console.log('[Scripting] Cannot disallow owner')
      return
    }

    let index = this._allowedUsers.indexOf(wallet.toLowerCase())

    if(index==-1){
      return
    }
    this._allowedUsers.splice(index,1)
    let player = this.getPlayerByWallet(wallet)
    if(player){
      player.kick(`You've been removed from the allowed list of Parcel ${this.id} `)
    }
  }

  isWalletAllowedIfPrivate(wallet){
    if(!this.isPrivate){
      return true
    }
    if(typeof wallet !=='string'){
      return false
    }
    if(wallet.toLowerCase() === this.owner.toLowerCase()){
      return true
    }
    return this._allowedUsers.indexOf(wallet.toLowerCase())!==-1
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
