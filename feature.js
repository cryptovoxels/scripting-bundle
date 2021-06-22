/* global postMessage */

// const uuid = require('uuid/v4')
const throttle = require("lodash.throttle");
const EventEmitter = require("events");

class Feature extends EventEmitter {
  constructor(parcel, obj) {
    super();
    this.metadata = {};
    this.parcel = parcel;
    this.uuid = obj.uuid;
    this._content = obj;
    const mutated = throttle(
      () => {
        const s = {
          position: this._content.position,
          rotation: this._content.rotation,
          scale: this._content.scale,
        };

        this._position.toArray(s.position);

        this._rotation.toArray(s.rotation);

        this._scale.toArray(s.scale); // console.log(`Mutated`)

        this.set(s);
      },
      10,
      {
        leading: false,
        trailing: true,
      }
    );

    const handler = (attr) => ({
      set(target, key, value) {
        target[key] = value;
        mutated();
        return value;
      },
    });
    this._position = new _math.Vector3();
    this.position = new Proxy(this._position, handler("position"));
    this._rotation = new _math.Vector3();
    this.rotation = new Proxy(this._rotation, handler("rotation"));
    this._scale = new _math.Vector3();
    this.scale = new Proxy(this._scale, handler("scale"));
    this.updateVectors();
  }
  get id() {
    return this._content.id;
  }
  get type() {
    return this._content.type;
  }
  get description() {
    return this._content;
  }
  get(key) {
    return this._content[key];
  }
  getSummary() {
    return `position: ${this.position.toArray()}`;
  }
  set(dict) {
    Object.assign(this._content, dict);
    let keys = Array.from(Object.keys(dict)) || [];
    if (
      keys.includes("position") ||
      keys.includes("scale") ||
      keys.includes("rotation")
    ) {
      this.updateVectors();
    }
    this.save(dict);
  }
  updateVectors() {
    this._position.set(
      this._content.position[0],
      this._content.position[1],
      this._content.position[2]
    );
    this._rotation.set(
      this._content.rotation[0],
      this._content.rotation[1],
      this._content.rotation[2]
    );
    this._scale.set(
      this._content.scale[0],
      this._content.scale[1],
      this._content.scale[2]
    );
  }
  clone() {
    let d = JSON.parse(JSON.stringify(this.description));
    delete d.id;
    delete d.uuid;
    let c = this.parcel.createFeature(this.type);
    c.set(d);
    return c;
  }
  drag(
    player,
    clone = true,
    REFRESH_RATE = 50,
    DISTANCE_TO_PLAYER = 0.5,
    UP_DOWN_CONSTANT = -0.65
  ) {
    function moveObject(player) {
      // calculates new position of object
      const playerRotation = player.rotation;

      const xDelta =
        DISTANCE_TO_PLAYER *
        Math.cos(-playerRotation.y + Math.PI / 2 + Math.PI);
      const yDelta = DISTANCE_TO_PLAYER * Math.tan(playerRotation.x);
      const zDelta =
        DISTANCE_TO_PLAYER *
        Math.sin(-playerRotation.y + Math.PI / 2 + Math.PI);

      const position = [
        player.position.x - xDelta,
        player.position.y - yDelta + UP_DOWN_CONSTANT,
        player.position.z - zDelta,
      ];

      return position;
    }
    function setPosition(feature, player) {
      // refreshes the positions
      feature.set({ position: moveObject(player) });

      if (!feature.position || !feature.rotation) {
        parcel.removeFeature(feature);
      } else {
        setTimeout(() => {
          setPosition(feature, player);
        }, REFRESH_RATE);
      }
    }
    let movableFeature = this;
    if (clone) {
      movableFeature = parcel.createFeature("vox-model");
      const { x, y, z } = this.scale;
      movableFeature.set({ scale: [x, y, z] });
      movableFeature.set({ url: this._content.url });
      movableFeature.position = this.position;
      movableFeature.rotation = this.rotation;
    }
    setPosition(movableFeature, player);
  }

  save(dict) {
    this.parcel.broadcast({
      type: "update",
      uuid: this.uuid,
      content: dict,
    });
  }

  createAnimation(key) {
    return new _animation.Animation(
      null,
      key,
      30,
      _animation.Animation.ANIMATIONTYPE_VECTOR3
    );
  }

  startAnimations(animationArray) {
    const animations = animationArray.map((a) => {
      const animation = a.clone();

      animation._keys.unshift({
        frame: 0,
        value: this[animation.targetProperty].clone(),
      });

      return animation.serialize();
    });
    this.parcel.broadcast({
      type: "animate",
      uuid: this.uuid,
      animations,
    });
  }

  remove() {
    this.parcel.removeFeature(this);
  }
}

class Audio extends Feature {
  play() {
    this.parcel.broadcast({
      type: "play",
      uuid: this.uuid,
    });
  }

  pause() {
    this.parcel.broadcast({
      type: "pause",
      uuid: this.uuid,
    });
  }

  stop() {
    this.parcel.broadcast({
      type: "stop",
      uuid: this.uuid,
    });
  }
}

class TextInput extends Feature {
  constructor(parcel, obj) {
    super(parcel, obj);
    this.on("changed", (e) => {
      this.text = e.text;
    });
  }
}

class Video extends Feature {
  play() {
    this.parcel.broadcast({
      type: "play",
      uuid: this.uuid,
    });
  }

  pause() {
    this.parcel.broadcast({
      type: "pause",
      uuid: this.uuid,
    });
  }

  stop() {
    this.parcel.broadcast({
      type: "stop",
      uuid: this.uuid,
    });
  }
}

class Youtube extends Feature {
  play() {
    this.parcel.broadcast({
      type: "play",
      uuid: this.uuid,
    });
  }

  pause() {
    this.parcel.broadcast({
      type: "pause",
      uuid: this.uuid,
    });
  }

  stop() {
    this.parcel.broadcast({
      type: "stop",
      uuid: this.uuid,
    });
  }
}

class VidScreen extends Feature {
  constructor(parcel, obj) {
    super(parcel, obj);
    this.on("start", () => this.start());
    this.on("stop", () => this.stop());
  }

  start() {
    this.screen = new Uint8Array(64 * 64 * 3);
    this.screenWidth = 64;
    this.screenHeight = 64;
    this._interval = setInterval(() => {
      this.emit("frame");
      postMessage({
        type: "screen",
        uuid: this.uuid,
        screen: this.screen,
      });
    }, 1000 / 30);
  }

  stop() {
    clearInterval(this._interval);
  }
}

Feature.create = (parcel, obj) => {
  if (obj.type === "audio") {
    return new Audio(parcel, obj);
  } else if (obj.type === "video") {
    return new Video(parcel, obj);
  } else if (obj.type === "youtube") {
    return new Youtube(parcel, obj);
  } else if (obj.type === "vid-screen") {
    return new VidScreen(parcel, obj);
  } else if (obj.type === "text-input") {
    return new TextInput(parcel, obj);
  } else {
    return new Feature(parcel, obj);
  }
};

module.exports = Feature;
