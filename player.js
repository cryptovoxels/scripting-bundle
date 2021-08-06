
const EventEmitter = require("events");

class Player extends EventEmitter {
  constructor(description, parcel) {
    super();
    Object.assign(this, description);
    this.parcel = parcel;
    this.uuid = description && description.uuid;
    this.name = description && description.name;
    this.wallet = description && description.wallet;
    this.position = new _math.Vector3();
    this.rotation = new _math.Vector3();
    this.collectibles = description && description.collectibles;
  } // get name () {
  //   return this.user.name
  // }
  // get wallet () {
  //   return this.user.wallet
  // }
  // get uuid () {
  //   return this.uuid
  // }
  teleportTo(coords) {
    if (!coords || coords == "") {
      return;
    }
    // Avoid spamming of teleport
    if (this._numTeleport++ > 5) {
      setTimeout(() => {
        this._numTeleport = 0;
      }, 4000);
      return;
    }
    this._numTeleport++;
    this.parcel.broadcast({
      type: "teleport-player",
      uuid: this.uuid,
      coordinates: coords,
    });
  }

  hasWearable(tokenId, collectionId = 1) {
    return !!this.collectibles.find((c) => {
      let collection_id = c.collection_id || 1;
      return c.wearable_id == tokenId && collectionId == collection_id;
    });
  }

  get isAnonymous() {
    return this.name.toLowerCase() == "Anonymous".toLowerCase();
  }

  onMove(msg) {
    this.position.set(msg.position[0], msg.position[1], msg.position[2]);
    this.rotation.set(msg.rotation[0], msg.rotation[1], msg.rotation[2]);
    this.emit("move", msg);
  }
}

module.exports = Player;
