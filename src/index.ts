/* global parcel,self,postMessage */

import {
  Vector3,
  Quaternion,
  Vector2,
  Color3,
  Matrix,
} from "@babylonjs/core/Maths/math";

import { Animation } from "@babylonjs/core/Animations/animation";
import { emojis as emojiList } from "./helpers";
import { Feature } from "./feature";

import Parcel from "./parcel";
import { Space } from "./parcel";

function getGlobal():typeof globalThis | (Window & typeof globalThis) | null {
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

// the grid is usually `global` and the iframe when the script is not hosted is usually `self`;
// Even though `window` will always be null, getGlobal() doesn't return it just in case, because we don't want
// to override the setInterval of the window (could affect render).
const G:typeof globalThis | (Window & typeof globalThis) | null = getGlobal();
if (G) {

  G.setInterval = (function (setInterval:Function) {
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
  })(G.setInterval) as any;

  G.emojis = emojiList;
  G.animations = [];
}

const scriptingEngine = {
  Parcel,
  Space,
  Feature,
  Animation,
  Vector3,
  Quaternion,
  Vector2,
  Color3,
  Matrix,
};
export default scriptingEngine;

if (typeof self !== "undefined") {
  Object.assign(self, {
    Parcel,
    Space,
    Feature,
    Animation,
    Vector3,
    Quaternion,
    Vector2,
    Color3,
    Matrix,
  }); // eslint-disable-line
}
