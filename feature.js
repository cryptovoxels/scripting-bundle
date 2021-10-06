/* global postMessage */

// const uuid = require('uuid/v4')
const FeatureBasicGUI = require("./gui");
const {_validateObject,_isValidProperty } = require("./validation-helpers")
const throttle = require("lodash.throttle");
const EventEmitter = require("events");

class Feature extends EventEmitter {
  constructor(parcel, obj) {
    super();
    this.metadata = {};
    this.parcel = parcel;
    this._type = obj.type
    this._uuid = obj.uuid;
    this._content = obj;
    this.gui = null;
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
        if(typeof value!=='number'){
          console.error(`[Scripting] ${key} is not a number`)
          return
        }
        target[key] = value;
        mutated();
        return value;
      },
    });
    this._position = new Vector3();
    this.position = new Proxy(this._position, handler("position"));
    this._rotation = new Vector3();
    this.rotation = new Proxy(this._rotation, handler("rotation"));
    this._scale = new Vector3();
    this.scale = new Proxy(this._scale, handler("scale"));
    this.updateVectors();
  }

  get uuid() {
    return this._uuid;
  }

  get id() {
    return this._content.id;
  }

  get type() {
    return this._type
  }

  get description() {
    return this._content;
  }

  get url() {
    return this._content.url;
  }

  set url(uri) {
    this.set({"url":uri});
  }

  get(key) {
    return this._content[key];
  }
  getSummary() {
    return `position: ${this.position.toArray()}; rotaton: ${this.rotation.toArray()};  scale: ${this.scale.toArray()};`;
  }
  set(dict) {
    let d = _validateObject(dict)
    Object.assign(this._content, d);
    let keys = Array.from(Object.keys(d)) || [];
    if (
      keys.includes("position") ||
      keys.includes("scale") ||
      keys.includes("rotation")
    ) {
      this.updateVectors();
    }
    this.save(d);
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
  save(dict) {
    let d = _validateObject(dict)
    this.parcel.broadcast({
      type: "update",
      uuid: this.uuid,
      content: d,
    });
  }

  help(){
    console.log(`[Scripting] Visit https://wiki.cryptovoxels.com/features/${this.type} for scripting help on this feature`)
  }

  createAnimation(key) {
    return new Animation(null, key, 30, Animation.ANIMATIONTYPE_VECTOR3);
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

  createBasicGui(id = null, options = null) {
    const gui = new FeatureBasicGUI(this, options);
    gui.id = id;
    this.gui = gui;
    return gui;
  }

  removeGui() {
    if (this.gui) {
      this.gui.destroy();
      this.gui = null;
    }
  }

  remove() {
    this.removeGui();
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
  createBasicGui() {
    console.error("Gui not supported on 2D features.");
  }
}
class NftImage extends Feature {
  constructor(parcel, obj) {
    super(parcel, obj);
  }
  /* Thottled functions */
  getNftData = throttle(
    (callback = null) => {
      this._getNftData(callback);
    },
    500,
    {
      leading: false,
      trailing: true,
    }
  );

  _getNftData(callback = null) {
    if (!this._content.url) {
      return null;
    }
    let contract = this._content.url.split("/")[4];
    let token = this._content.url.split("/")[5];
    const api_url = `https://img.cryptovoxels.com/node/opensea?contract=${contract}&token=${token}&force_update=1`;
    let promise;
    if (typeof global == "undefined" || !global.fetchJson) {
      /* fetch doesn't work nicely on the grid. So we use 'fetchJson' when on scripthost, and fetch() when local */
      promise = fetch(api_url).then((r) => r.json());
    } else {
      promise = fetchJson(api_url);
    }
    return promise.then((r) => {
      if (callback) {
        callback(r);
      }
      return r;
    });
  }
  createBasicGui() {
    console.error("Gui not supported on 2D features.");
  }
}

class TextInput extends Feature {
  constructor(parcel, obj) {
    super(parcel, obj);
    this.on("changed", (e) => {
      this.text = e.text;
    });
  }
  createBasicGui() {
    console.error("Gui not supported on 2D features.");
  }
}

class SliderInput extends Feature {
  constructor(parcel, obj) {
    super(parcel, obj);
    this.on("changed", (e) => {
      this.value = e.value;
    });
  }
  createBasicGui() {
    console.error("Gui not supported on 2D features.");
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
  createBasicGui() {
    console.error("Gui not supported on 2D features.");
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
  createBasicGui() {
    console.error("Gui not supported on 2D features.");
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
  createBasicGui() {
    console.error("Gui not supported on 2D features.");
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
  } else if (obj.type === "slider-input") {
    return new SliderInput(parcel, obj);
  } else if (obj.type === "nft-image") {
    return new NftImage(parcel, obj);
  } else {
    return new Feature(parcel, obj);
  }
};

module.exports = Feature;
