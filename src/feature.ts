/* global postMessage */

import { AnimationTarget, FeatureDescription } from "./lib/types";
//@ts-ignore
import throttle from "lodash.throttle";
// const throttle = require("lodash.throttle");
import { EventEmitter } from "events";
import { Animation } from "@babylonjs/core/Animations/animation";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { _validateObject } from "./lib/validation-helpers";
import FeatureBasicGUI, { GUIOptions } from "./gui";
import Parcel from "./parcel";
/* @internal */
export class Feature extends EventEmitter {
  readonly parcel: Parcel;
  private _content: FeatureDescription;
  gui?: FeatureBasicGUI;
  private _uuid: string;
  private _type: string;
  metadata: any;

  private _position: Vector3 = Vector3.Zero();
  private _rotation: Vector3 = Vector3.Zero();
  private _scale: Vector3 = new Vector3(1, 1, 1);
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;

  static create: (parcel: Parcel, obj: FeatureDescription) => Feature;
  onClick?: () => void;
  constructor(parcel: Parcel, obj: FeatureDescription) {
    super();
    this.metadata = {};
    this.parcel = parcel;
    this._type = obj.type;
    this._uuid = obj.uuid;
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

    const handler = (attr: any) => ({
      set(target: Record<string, unknown>, key: string, value: number) {
        if (typeof value !== "number") {
          console.error(`[Scripting] ${key} is not a number`);
          return false;
        }
        target[key] = value;
        mutated();
        return true;
      },
    });
    this._position = Vector3.FromArray(obj.position || [0, 0, 0]);
    this.position = new Proxy(this._position, handler("position") as any);
    this._rotation = Vector3.FromArray(obj.rotation || [0, 0, 0]);
    this.rotation = new Proxy(this._rotation, handler("rotation") as any);
    this._scale = Vector3.FromArray(obj.scale || [1, 1, 1]);
    this.scale = new Proxy(this._scale, handler("scale") as any);
    this.updateVectors();
  }

  get uuid() {
    return this._uuid;
  }

  get id() {
    return this._content.id;
  }

  get type() {
    return this._type;
  }

  get description() {
    return this._content;
  }

  get url() {
    return this._content.url;
  }

  set url(uri) {
    this.set({ url: uri });
  }

  get(key: string) {
    return this._content[key];
  }
  getSummary() {
    return `position: ${this.position.asArray()}; rotaton: ${this.rotation.asArray()};  scale: ${this.scale.asArray()};`;
  }
  set(dict: Partial<FeatureDescription>) {
    let d = _validateObject(dict);
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
  private updateVectors() {
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
    let c = this.parcel.createFeature(this.type, d, true);
    c.set(d);
    return c;
  }
  save(dict: Partial<FeatureDescription>) {
    let d = _validateObject(dict);
    this.parcel.broadcast({
      type: "update",
      uuid: this.uuid,
      content: d as any,
    });
  }

  help() {
    console.log(
      `[Scripting] Visit https://wiki.cryptovoxels.com/features/${this.type} for scripting help on this feature`
    );
  }

  createAnimation(key: AnimationTarget) {
    return new Animation(
      `scripting/animation/${this.uuid}`,
      key,
      30,
      Animation.ANIMATIONTYPE_VECTOR3
    );
  }

  startAnimations(animationArray: Animation[]) {
    const animations = animationArray.map((a) => {
      const animation = a.clone();

      animation.getKeys().unshift({
        frame: 0,
        value:
          this[
            animation.targetProperty as "position" | "scale" | "rotation"
          ].clone(),
      });

      return animation.serialize();
    });
    this.parcel.broadcast({
      type: "animate",
      uuid: this.uuid,
      animations,
    });
  }

  createBasicGui(id:string|undefined = undefined, options:undefined|GUIOptions = undefined): FeatureBasicGUI | void {
    const gui = new FeatureBasicGUI(this, options);
    gui.id = id!;
    this.gui = gui;
    return gui;
  }

  removeGui() {
    if (this.gui) {
      this.gui.destroy();
      this.gui = undefined;
    }
  }

  remove() {
    this.removeGui();
    this.parcel.removeFeature(this);
  }
}

class Audio extends Feature {
  isPlaying = false;

  onClick = () => {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  };

  play() {
    this.isPlaying = true;
    this.parcel.broadcast({
      type: "play",
      uuid: this.uuid,
    });
  }

  pause() {
    this.isPlaying = false;
    this.parcel.broadcast({
      type: "pause",
      uuid: this.uuid,
    });
  }

  stop() {
    this.isPlaying = false;
    this.parcel.broadcast({
      type: "stop",
      uuid: this.uuid,
    });
  }
  createBasicGui(id = undefined, options = undefined) {
    console.error("Gui not supported on 2D features.");
  }
}
class NftImage extends Feature {
  constructor(parcel: Parcel, obj: FeatureDescription) {
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

  private _getNftData(
    callback: Function | null = null,
    account_address: string | null = null
  ) {
    if (!this.description.url) {
      return null;
    }
    let contract = this.description.url.split("/")[4];
    let token = this.description.url.split("/")[5];
    const api_url = `https://img.cryptovoxels.com/node/opensea?contract=${contract}&token=${token}&force_update=1${
      account_address !== null ? `&account_address=${account_address}` : ""
    }`;
    let promise;
    if (typeof global == "undefined" || !global.fetchJson) {
      /* fetch doesn't work nicely on the grid. So we use 'fetchJson' when on scripthost, and fetch() when local */
      promise = fetch(api_url).then((r) => r.json());
    } else {
      promise = fetchJson(api_url);
    }
    return promise
      .then((r) => {
        if (callback) {
          callback(r);
        } else {
          console.error('[Scripting] No callback given to "getNftData"');
        }
        return r;
      })
      .catch((e) => console.error("[Scripting]", e));
  }
  createBasicGui(id = undefined, options = undefined) {
    console.error("[Scripting] Gui not supported on 2D features.");
  }
}

class TextInput extends Feature {
  text: string;
  constructor(parcel: Parcel, obj: FeatureDescription) {
    super(parcel, obj);
    this.text = obj.text as string;
    this.on("changed", (e: { text: string }) => {
      this.text = e.text;
    });
  }
  createBasicGui() {
    console.error("[Scripting] Gui not supported on 2D features.");
  }
}

class SliderInput extends Feature {
  value: number = 0.01;
  constructor(parcel: Parcel, obj: FeatureDescription) {
    super(parcel, obj);
    this.on("changed", (e: { value: number }) => {
      this.value = e.value;
    });
  }
  createBasicGui() {
    console.error("[Scripting] Gui not supported on 2D features.");
  }
}
class Video extends Feature {
  isPlaying = false;

  onClick = () => {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  };

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
    console.error("[Scripting] Gui not supported on 2D features.");
  }
}

class Youtube extends Feature {
  isPlaying = false;
  isPaused = false;

  onClick = () => {
    if (this.isPlaying) {
      if (this.isPaused) {
        this.unpause();
      } else {
        this.pause();
      }
    } else {
      this.play();
    }
  };

  play() {
    this.isPlaying = true;
    this.parcel.broadcast({
      type: "play",
      uuid: this.uuid,
    });
  }

  pause() {
    this.isPaused = true;
    this.parcel.broadcast({
      type: "pause",
      uuid: this.uuid,
    });
  }

  unpause() {
    this.isPaused = false;
    this.parcel.broadcast({
      type: "unpause",
      uuid: this.uuid,
    });
  }

  stop() {
    this.isPlaying = false;
    this.parcel.broadcast({
      type: "stop",
      uuid: this.uuid,
    });
  }
  createBasicGui() {
    console.error("[Scripting] Gui not supported on 2D features.");
  }
}

class VidScreen extends Feature {
  screen: Uint8Array = undefined!;
  screenWidth: number = 64;
  screenHeight: number = 64;
  _interval: any;
  constructor(parcel: Parcel, obj: FeatureDescription) {
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
    console.error("[Scripting] Gui not supported on 2D features.");
  }
}

Feature.create = (parcel: Parcel, obj: FeatureDescription) => {
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
