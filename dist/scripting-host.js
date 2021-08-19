/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 170:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/* global postMessage */
// const uuid = require('uuid/v4')
var throttle = __webpack_require__(96);

var EventEmitter = __webpack_require__(187);

var Feature = /*#__PURE__*/function (_EventEmitter) {
  "use strict";

  _inherits(Feature, _EventEmitter);

  var _super = _createSuper(Feature);

  function Feature(parcel, obj) {
    var _this;

    _classCallCheck(this, Feature);

    _this = _super.call(this);
    _this.metadata = {};
    _this.parcel = parcel;
    _this.uuid = obj.uuid;
    _this._content = obj;
    var mutated = throttle(function () {
      var s = {
        position: _this._content.position,
        rotation: _this._content.rotation,
        scale: _this._content.scale
      };

      _this._position.toArray(s.position);

      _this._rotation.toArray(s.rotation);

      _this._scale.toArray(s.scale); // console.log(`Mutated`)


      _this.set(s);
    }, 10, {
      leading: false,
      trailing: true
    });

    var handler = function handler(attr) {
      return {
        set: function set(target, key, value) {
          target[key] = value;
          mutated();
          return value;
        }
      };
    };

    _this._position = new Vector3();
    _this.position = new Proxy(_this._position, handler("position"));
    _this._rotation = new Vector3();
    _this.rotation = new Proxy(_this._rotation, handler("rotation"));
    _this._scale = new Vector3();
    _this.scale = new Proxy(_this._scale, handler("scale"));

    _this.updateVectors();

    return _this;
  }

  _createClass(Feature, [{
    key: "id",
    get: function get() {
      return this._content.id;
    }
  }, {
    key: "type",
    get: function get() {
      return this._content.type;
    }
  }, {
    key: "description",
    get: function get() {
      return this._content;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._content[key];
    }
  }, {
    key: "getSummary",
    value: function getSummary() {
      return "position: ".concat(this.position.toArray());
    }
  }, {
    key: "set",
    value: function set(dict) {
      Object.assign(this._content, dict);
      var keys = Array.from(Object.keys(dict)) || [];

      if (keys.includes("position") || keys.includes("scale") || keys.includes("rotation")) {
        this.updateVectors();
      }

      this.save(dict);
    }
  }, {
    key: "updateVectors",
    value: function updateVectors() {
      this._position.set(this._content.position[0], this._content.position[1], this._content.position[2]);

      this._rotation.set(this._content.rotation[0], this._content.rotation[1], this._content.rotation[2]);

      this._scale.set(this._content.scale[0], this._content.scale[1], this._content.scale[2]);
    }
  }, {
    key: "clone",
    value: function clone() {
      var d = JSON.parse(JSON.stringify(this.description));
      delete d.id;
      delete d.uuid;
      var c = this.parcel.createFeature(this.type);
      c.set(d);
      return c;
    }
  }, {
    key: "save",
    value: function save(dict) {
      this.parcel.broadcast({
        type: "update",
        uuid: this.uuid,
        content: dict
      });
    }
  }, {
    key: "createAnimation",
    value: function createAnimation(key) {
      return new Animation(null, key, 30, Animation.ANIMATIONTYPE_VECTOR3);
    }
  }, {
    key: "startAnimations",
    value: function startAnimations(animationArray) {
      var _this2 = this;

      var animations = animationArray.map(function (a) {
        var animation = a.clone();

        animation._keys.unshift({
          frame: 0,
          value: _this2[animation.targetProperty].clone()
        });

        return animation.serialize();
      });
      this.parcel.broadcast({
        type: "animate",
        uuid: this.uuid,
        animations: animations
      });
    }
  }, {
    key: "remove",
    value: function remove() {
      this.parcel.removeFeature(this);
    }
  }]);

  return Feature;
}(EventEmitter);

var Audio = /*#__PURE__*/function (_Feature) {
  "use strict";

  _inherits(Audio, _Feature);

  var _super2 = _createSuper(Audio);

  function Audio() {
    _classCallCheck(this, Audio);

    return _super2.apply(this, arguments);
  }

  _createClass(Audio, [{
    key: "play",
    value: function play() {
      this.parcel.broadcast({
        type: "play",
        uuid: this.uuid
      });
    }
  }, {
    key: "pause",
    value: function pause() {
      this.parcel.broadcast({
        type: "pause",
        uuid: this.uuid
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      this.parcel.broadcast({
        type: "stop",
        uuid: this.uuid
      });
    }
  }]);

  return Audio;
}(Feature);

var TextInput = /*#__PURE__*/function (_Feature2) {
  "use strict";

  _inherits(TextInput, _Feature2);

  var _super3 = _createSuper(TextInput);

  function TextInput(parcel, obj) {
    var _this3;

    _classCallCheck(this, TextInput);

    _this3 = _super3.call(this, parcel, obj);

    _this3.on("changed", function (e) {
      _this3.text = e.text;
    });

    return _this3;
  }

  return TextInput;
}(Feature);

var SliderInput = /*#__PURE__*/function (_Feature3) {
  "use strict";

  _inherits(SliderInput, _Feature3);

  var _super4 = _createSuper(SliderInput);

  function SliderInput(parcel, obj) {
    var _this4;

    _classCallCheck(this, SliderInput);

    _this4 = _super4.call(this, parcel, obj);

    _this4.on("changed", function (e) {
      _this4.value = e.value;
    });

    return _this4;
  }

  return SliderInput;
}(Feature);

var Video = /*#__PURE__*/function (_Feature4) {
  "use strict";

  _inherits(Video, _Feature4);

  var _super5 = _createSuper(Video);

  function Video() {
    _classCallCheck(this, Video);

    return _super5.apply(this, arguments);
  }

  _createClass(Video, [{
    key: "play",
    value: function play() {
      this.parcel.broadcast({
        type: "play",
        uuid: this.uuid
      });
    }
  }, {
    key: "pause",
    value: function pause() {
      this.parcel.broadcast({
        type: "pause",
        uuid: this.uuid
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      this.parcel.broadcast({
        type: "stop",
        uuid: this.uuid
      });
    }
  }]);

  return Video;
}(Feature);

var Youtube = /*#__PURE__*/function (_Feature5) {
  "use strict";

  _inherits(Youtube, _Feature5);

  var _super6 = _createSuper(Youtube);

  function Youtube() {
    _classCallCheck(this, Youtube);

    return _super6.apply(this, arguments);
  }

  _createClass(Youtube, [{
    key: "play",
    value: function play() {
      this.parcel.broadcast({
        type: "play",
        uuid: this.uuid
      });
    }
  }, {
    key: "pause",
    value: function pause() {
      this.parcel.broadcast({
        type: "pause",
        uuid: this.uuid
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      this.parcel.broadcast({
        type: "stop",
        uuid: this.uuid
      });
    }
  }]);

  return Youtube;
}(Feature);

var VidScreen = /*#__PURE__*/function (_Feature6) {
  "use strict";

  _inherits(VidScreen, _Feature6);

  var _super7 = _createSuper(VidScreen);

  function VidScreen(parcel, obj) {
    var _this5;

    _classCallCheck(this, VidScreen);

    _this5 = _super7.call(this, parcel, obj);

    _this5.on("start", function () {
      return _this5.start();
    });

    _this5.on("stop", function () {
      return _this5.stop();
    });

    return _this5;
  }

  _createClass(VidScreen, [{
    key: "start",
    value: function start() {
      var _this6 = this;

      this.screen = new Uint8Array(64 * 64 * 3);
      this.screenWidth = 64;
      this.screenHeight = 64;
      this._interval = setInterval(function () {
        _this6.emit("frame");

        postMessage({
          type: "screen",
          uuid: _this6.uuid,
          screen: _this6.screen
        });
      }, 1000 / 30);
    }
  }, {
    key: "stop",
    value: function stop() {
      clearInterval(this._interval);
    }
  }]);

  return VidScreen;
}(Feature);

Feature.create = function (parcel, obj) {
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
  } else {
    return new Feature(parcel, obj);
  }
};

module.exports = Feature;

/***/ }),

/***/ 465:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var EventEmitter = __webpack_require__(187);

var Player = /*#__PURE__*/function (_EventEmitter) {
  "use strict";

  _inherits(Player, _EventEmitter);

  var _super = _createSuper(Player);

  function Player(description, parcel) {
    var _this;

    _classCallCheck(this, Player);

    _this = _super.call(this);
    Object.assign(_assertThisInitialized(_this), description);
    _this.parcel = parcel;
    _this.uuid = description && description.uuid;
    _this.name = description && description.name;
    _this.wallet = description && description.wallet;
    _this.position = new Vector3();
    _this.rotation = new Vector3();
    _this.collectibles = description && description.collectibles;
    return _this;
  } // get name () {
  //   return this.user.name
  // }
  // get wallet () {
  //   return this.user.wallet
  // }
  // get uuid () {
  //   return this.uuid
  // }


  _createClass(Player, [{
    key: "teleportTo",
    value: function teleportTo(coords) {
      var _this2 = this;

      if (!coords || coords == "") {
        return;
      } // Avoid spamming of teleport


      if (this._numTeleport++ > 5) {
        setTimeout(function () {
          _this2._numTeleport = 0;
        }, 4000);
        return;
      }

      this._numTeleport++;
      this.parcel.broadcast({
        type: "teleport-player",
        uuid: this.uuid,
        coordinates: coords
      });
    }
  }, {
    key: "hasWearable",
    value: function hasWearable(tokenId) {
      var collectionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      return !!this.collectibles.find(function (c) {
        var collection_id = c.collection_id || 1;
        return c.wearable_id == tokenId && collectionId == collection_id;
      });
    }
  }, {
    key: "isAnonymous",
    get: function get() {
      return this.name.toLowerCase() == "Anonymous".toLowerCase();
    }
  }, {
    key: "onMove",
    value: function onMove(msg) {
      this.position.set(msg.position[0], msg.position[1], msg.position[2]);
      this.rotation.set(msg.rotation[0], msg.rotation[1], msg.rotation[2]);
      this.emit("move", msg);
    }
  }]);

  return Player;
}(EventEmitter);

module.exports = Player;

/***/ }),

/***/ 952:
/***/ ((module) => {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// const ndarray = require('ndarray')
// const zlib = require('zlib')
var Blocks = function Blocks(index, transparent, color) {
  return index + (transparent ? 0 : 1 << 15) + (color << 6);
};

Blocks.empty = 0;

var VoxelField = /*#__PURE__*/function () {
  "use strict";

  function VoxelField(parcel) {
    _classCallCheck(this, VoxelField);

    this.parcel = parcel;
    var voxelSize = 0.5;
    var width = (parcel.x2 - parcel.x1) / voxelSize;
    var height = (parcel.y2 - parcel.y1) / voxelSize;
    var depth = (parcel.z2 - parcel.z1) / voxelSize;
    this.resolution = [width, height, depth];
    /*
     this.field = ndarray(new Uint16Array(width * height * depth), this.resolution)
     if (this.parcel.voxels) {
      // Inflate voxel field
      const buffer = Buffer.from(this.parcel.voxels, 'base64')
      const inflated = zlib.inflateSync(buffer)
      inflated.copy(Buffer.from(this.field.data.buffer))
    }
     */
  }

  _createClass(VoxelField, [{
    key: "width",
    get: function get() {
      return this.resolution[0];
    }
  }, {
    key: "height",
    get: function get() {
      return this.resolution[1];
    }
  }, {
    key: "depth",
    get: function get() {
      return this.resolution[2];
    }
  }, {
    key: "serialize",
    value: function serialize() {
      console.log("Not implemented");
      /*
       const buffer = Buffer.from(this.field.data.buffer)
      const deflated = zlib.deflateSync(buffer)
       const voxels = deflated.toString('base64')
      const features = this.featuresList.map(f => f.serialize)
       const content = {
        features,
        voxels
      }
       return content
      */
    }
  }]);

  return VoxelField;
}();

module.exports = {
  Blocks: Blocks,
  VoxelField: VoxelField
};

/***/ }),

/***/ 187:
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ 96:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;


/***/ }),

/***/ 75:
/***/ ((module) => {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ 217:
/***/ ((module) => {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),

/***/ 171:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var rng = __webpack_require__(217);
var bytesToUuid = __webpack_require__(75);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// UNUSED EXPORTS: default

;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/arrayTools.js
/**
 * Class containing a set of static utilities functions for arrays.
 */
var ArrayTools = /** @class */ (function () {
    function ArrayTools() {
    }
    /**
     * Returns an array of the given size filled with element built from the given constructor and the paramters
     * @param size the number of element to construct and put in the array
     * @param itemBuilder a callback responsible for creating new instance of item. Called once per array entry.
     * @returns a new array filled with new objects
     */
    ArrayTools.BuildArray = function (size, itemBuilder) {
        var a = [];
        for (var i = 0; i < size; ++i) {
            a.push(itemBuilder());
        }
        return a;
    };
    return ArrayTools;
}());

//# sourceMappingURL=arrayTools.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Maths/math.scalar.js
/**
 * Scalar computation library
 */
var Scalar = /** @class */ (function () {
    function Scalar() {
    }
    /**
     * Boolean : true if the absolute difference between a and b is lower than epsilon (default = 1.401298E-45)
     * @param a number
     * @param b number
     * @param epsilon (default = 1.401298E-45)
     * @returns true if the absolute difference between a and b is lower than epsilon (default = 1.401298E-45)
     */
    Scalar.WithinEpsilon = function (a, b, epsilon) {
        if (epsilon === void 0) { epsilon = 1.401298E-45; }
        var num = a - b;
        return -epsilon <= num && num <= epsilon;
    };
    /**
     * Returns a string : the upper case translation of the number i to hexadecimal.
     * @param i number
     * @returns the upper case translation of the number i to hexadecimal.
     */
    Scalar.ToHex = function (i) {
        var str = i.toString(16);
        if (i <= 15) {
            return ("0" + str).toUpperCase();
        }
        return str.toUpperCase();
    };
    /**
     * Returns -1 if value is negative and +1 is value is positive.
     * @param value the value
     * @returns the value itself if it's equal to zero.
     */
    Scalar.Sign = function (value) {
        value = +value; // convert to a number
        if (value === 0 || isNaN(value)) {
            return value;
        }
        return value > 0 ? 1 : -1;
    };
    /**
     * Returns the value itself if it's between min and max.
     * Returns min if the value is lower than min.
     * Returns max if the value is greater than max.
     * @param value the value to clmap
     * @param min the min value to clamp to (default: 0)
     * @param max the max value to clamp to (default: 1)
     * @returns the clamped value
     */
    Scalar.Clamp = function (value, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        return Math.min(max, Math.max(min, value));
    };
    /**
     * the log2 of value.
     * @param value the value to compute log2 of
     * @returns the log2 of value.
     */
    Scalar.Log2 = function (value) {
        return Math.log(value) * Math.LOG2E;
    };
    /**
    * Loops the value, so that it is never larger than length and never smaller than 0.
    *
    * This is similar to the modulo operator but it works with floating point numbers.
    * For example, using 3.0 for t and 2.5 for length, the result would be 0.5.
    * With t = 5 and length = 2.5, the result would be 0.0.
    * Note, however, that the behaviour is not defined for negative numbers as it is for the modulo operator
    * @param value the value
    * @param length the length
    * @returns the looped value
    */
    Scalar.Repeat = function (value, length) {
        return value - Math.floor(value / length) * length;
    };
    /**
     * Normalize the value between 0.0 and 1.0 using min and max values
     * @param value value to normalize
     * @param min max to normalize between
     * @param max min to normalize between
     * @returns the normalized value
     */
    Scalar.Normalize = function (value, min, max) {
        return (value - min) / (max - min);
    };
    /**
    * Denormalize the value from 0.0 and 1.0 using min and max values
    * @param normalized value to denormalize
    * @param min max to denormalize between
    * @param max min to denormalize between
    * @returns the denormalized value
    */
    Scalar.Denormalize = function (normalized, min, max) {
        return (normalized * (max - min) + min);
    };
    /**
    * Calculates the shortest difference between two given angles given in degrees.
    * @param current current angle in degrees
    * @param target target angle in degrees
    * @returns the delta
    */
    Scalar.DeltaAngle = function (current, target) {
        var num = Scalar.Repeat(target - current, 360.0);
        if (num > 180.0) {
            num -= 360.0;
        }
        return num;
    };
    /**
    * PingPongs the value t, so that it is never larger than length and never smaller than 0.
    * @param tx value
    * @param length length
    * @returns The returned value will move back and forth between 0 and length
    */
    Scalar.PingPong = function (tx, length) {
        var t = Scalar.Repeat(tx, length * 2.0);
        return length - Math.abs(t - length);
    };
    /**
    * Interpolates between min and max with smoothing at the limits.
    *
    * This function interpolates between min and max in a similar way to Lerp. However, the interpolation will gradually speed up
    * from the start and slow down toward the end. This is useful for creating natural-looking animation, fading and other transitions.
    * @param from from
    * @param to to
    * @param tx value
    * @returns the smooth stepped value
    */
    Scalar.SmoothStep = function (from, to, tx) {
        var t = Scalar.Clamp(tx);
        t = -2.0 * t * t * t + 3.0 * t * t;
        return to * t + from * (1.0 - t);
    };
    /**
    * Moves a value current towards target.
    *
    * This is essentially the same as Mathf.Lerp but instead the function will ensure that the speed never exceeds maxDelta.
    * Negative values of maxDelta pushes the value away from target.
    * @param current current value
    * @param target target value
    * @param maxDelta max distance to move
    * @returns resulting value
    */
    Scalar.MoveTowards = function (current, target, maxDelta) {
        var result = 0;
        if (Math.abs(target - current) <= maxDelta) {
            result = target;
        }
        else {
            result = current + Scalar.Sign(target - current) * maxDelta;
        }
        return result;
    };
    /**
    * Same as MoveTowards but makes sure the values interpolate correctly when they wrap around 360 degrees.
    *
    * Variables current and target are assumed to be in degrees. For optimization reasons, negative values of maxDelta
    *  are not supported and may cause oscillation. To push current away from a target angle, add 180 to that angle instead.
    * @param current current value
    * @param target target value
    * @param maxDelta max distance to move
    * @returns resulting angle
    */
    Scalar.MoveTowardsAngle = function (current, target, maxDelta) {
        var num = Scalar.DeltaAngle(current, target);
        var result = 0;
        if (-maxDelta < num && num < maxDelta) {
            result = target;
        }
        else {
            target = current + num;
            result = Scalar.MoveTowards(current, target, maxDelta);
        }
        return result;
    };
    /**
     * Creates a new scalar with values linearly interpolated of "amount" between the start scalar and the end scalar.
     * @param start start value
     * @param end target value
     * @param amount amount to lerp between
     * @returns the lerped value
     */
    Scalar.Lerp = function (start, end, amount) {
        return start + ((end - start) * amount);
    };
    /**
    * Same as Lerp but makes sure the values interpolate correctly when they wrap around 360 degrees.
    * The parameter t is clamped to the range [0, 1]. Variables a and b are assumed to be in degrees.
    * @param start start value
    * @param end target value
    * @param amount amount to lerp between
    * @returns the lerped value
    */
    Scalar.LerpAngle = function (start, end, amount) {
        var num = Scalar.Repeat(end - start, 360.0);
        if (num > 180.0) {
            num -= 360.0;
        }
        return start + num * Scalar.Clamp(amount);
    };
    /**
    * Calculates the linear parameter t that produces the interpolant value within the range [a, b].
    * @param a start value
    * @param b target value
    * @param value value between a and b
    * @returns the inverseLerp value
    */
    Scalar.InverseLerp = function (a, b, value) {
        var result = 0;
        if (a != b) {
            result = Scalar.Clamp((value - a) / (b - a));
        }
        else {
            result = 0.0;
        }
        return result;
    };
    /**
     * Returns a new scalar located for "amount" (float) on the Hermite spline defined by the scalars "value1", "value3", "tangent1", "tangent2".
     * @see http://mathworld.wolfram.com/HermitePolynomial.html
     * @param value1 spline value
     * @param tangent1 spline value
     * @param value2 spline value
     * @param tangent2 spline value
     * @param amount input value
     * @returns hermite result
     */
    Scalar.Hermite = function (value1, tangent1, value2, tangent2, amount) {
        var squared = amount * amount;
        var cubed = amount * squared;
        var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
        var part2 = (-2.0 * cubed) + (3.0 * squared);
        var part3 = (cubed - (2.0 * squared)) + amount;
        var part4 = cubed - squared;
        return (((value1 * part1) + (value2 * part2)) + (tangent1 * part3)) + (tangent2 * part4);
    };
    /**
    * Returns a random float number between and min and max values
    * @param min min value of random
    * @param max max value of random
    * @returns random value
    */
    Scalar.RandomRange = function (min, max) {
        if (min === max) {
            return min;
        }
        return ((Math.random() * (max - min)) + min);
    };
    /**
    * This function returns percentage of a number in a given range.
    *
    * RangeToPercent(40,20,60) will return 0.5 (50%)
    * RangeToPercent(34,0,100) will return 0.34 (34%)
    * @param number to convert to percentage
    * @param min min range
    * @param max max range
    * @returns the percentage
    */
    Scalar.RangeToPercent = function (number, min, max) {
        return ((number - min) / (max - min));
    };
    /**
    * This function returns number that corresponds to the percentage in a given range.
    *
    * PercentToRange(0.34,0,100) will return 34.
    * @param percent to convert to number
    * @param min min range
    * @param max max range
    * @returns the number
    */
    Scalar.PercentToRange = function (percent, min, max) {
        return ((max - min) * percent + min);
    };
    /**
     * Returns the angle converted to equivalent value between -Math.PI and Math.PI radians.
     * @param angle The angle to normalize in radian.
     * @return The converted angle.
     */
    Scalar.NormalizeRadians = function (angle) {
        // More precise but slower version kept for reference.
        // angle = angle % Tools.TwoPi;
        // angle = (angle + Tools.TwoPi) % Tools.TwoPi;
        //if (angle > Math.PI) {
        //	angle -= Tools.TwoPi;
        //}
        angle -= (Scalar.TwoPi * Math.floor((angle + Math.PI) / Scalar.TwoPi));
        return angle;
    };
    /**
     * Two pi constants convenient for computation.
     */
    Scalar.TwoPi = Math.PI * 2;
    return Scalar;
}());

//# sourceMappingURL=math.scalar.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Maths/math.js


/**
 * Constant used to convert a value to gamma space
 * @ignorenaming
 */
var ToGammaSpace = 1 / 2.2;
/**
 * Constant used to convert a value to linear space
 * @ignorenaming
 */
var ToLinearSpace = 2.2;
/**
 * Constant used to define the minimal number value in Babylon.js
 * @ignorenaming
 */
var Epsilon = 0.001;

/**
 * Class used to hold a RBG color
 */
var Color3 = /** @class */ (function () {
    /**
     * Creates a new Color3 object from red, green, blue values, all between 0 and 1
     * @param r defines the red component (between 0 and 1, default is 0)
     * @param g defines the green component (between 0 and 1, default is 0)
     * @param b defines the blue component (between 0 and 1, default is 0)
     */
    function Color3(
    /**
     * Defines the red component (between 0 and 1, default is 0)
     */
    r, 
    /**
     * Defines the green component (between 0 and 1, default is 0)
     */
    g, 
    /**
     * Defines the blue component (between 0 and 1, default is 0)
     */
    b) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        this.r = r;
        this.g = g;
        this.b = b;
    }
    /**
     * Creates a string with the Color3 current values
     * @returns the string representation of the Color3 object
     */
    Color3.prototype.toString = function () {
        return "{R: " + this.r + " G:" + this.g + " B:" + this.b + "}";
    };
    /**
     * Returns the string "Color3"
     * @returns "Color3"
     */
    Color3.prototype.getClassName = function () {
        return "Color3";
    };
    /**
     * Compute the Color3 hash code
     * @returns an unique number that can be used to hash Color3 objects
     */
    Color3.prototype.getHashCode = function () {
        var hash = this.r || 0;
        hash = (hash * 397) ^ (this.g || 0);
        hash = (hash * 397) ^ (this.b || 0);
        return hash;
    };
    // Operators
    /**
     * Stores in the given array from the given starting index the red, green, blue values as successive elements
     * @param array defines the array where to store the r,g,b components
     * @param index defines an optional index in the target array to define where to start storing values
     * @returns the current Color3 object
     */
    Color3.prototype.toArray = function (array, index) {
        if (index === void 0) { index = 0; }
        array[index] = this.r;
        array[index + 1] = this.g;
        array[index + 2] = this.b;
        return this;
    };
    /**
     * Returns a new Color4 object from the current Color3 and the given alpha
     * @param alpha defines the alpha component on the new Color4 object (default is 1)
     * @returns a new Color4 object
     */
    Color3.prototype.toColor4 = function (alpha) {
        if (alpha === void 0) { alpha = 1; }
        return new Color4(this.r, this.g, this.b, alpha);
    };
    /**
     * Returns a new array populated with 3 numeric elements : red, green and blue values
     * @returns the new array
     */
    Color3.prototype.asArray = function () {
        var result = new Array();
        this.toArray(result, 0);
        return result;
    };
    /**
     * Returns the luminance value
     * @returns a float value
     */
    Color3.prototype.toLuminance = function () {
        return this.r * 0.3 + this.g * 0.59 + this.b * 0.11;
    };
    /**
     * Multiply each Color3 rgb values by the given Color3 rgb values in a new Color3 object
     * @param otherColor defines the second operand
     * @returns the new Color3 object
     */
    Color3.prototype.multiply = function (otherColor) {
        return new Color3(this.r * otherColor.r, this.g * otherColor.g, this.b * otherColor.b);
    };
    /**
     * Multiply the rgb values of the Color3 and the given Color3 and stores the result in the object "result"
     * @param otherColor defines the second operand
     * @param result defines the Color3 object where to store the result
     * @returns the current Color3
     */
    Color3.prototype.multiplyToRef = function (otherColor, result) {
        result.r = this.r * otherColor.r;
        result.g = this.g * otherColor.g;
        result.b = this.b * otherColor.b;
        return this;
    };
    /**
     * Determines equality between Color3 objects
     * @param otherColor defines the second operand
     * @returns true if the rgb values are equal to the given ones
     */
    Color3.prototype.equals = function (otherColor) {
        return otherColor && this.r === otherColor.r && this.g === otherColor.g && this.b === otherColor.b;
    };
    /**
     * Determines equality between the current Color3 object and a set of r,b,g values
     * @param r defines the red component to check
     * @param g defines the green component to check
     * @param b defines the blue component to check
     * @returns true if the rgb values are equal to the given ones
     */
    Color3.prototype.equalsFloats = function (r, g, b) {
        return this.r === r && this.g === g && this.b === b;
    };
    /**
     * Multiplies in place each rgb value by scale
     * @param scale defines the scaling factor
     * @returns the updated Color3
     */
    Color3.prototype.scale = function (scale) {
        return new Color3(this.r * scale, this.g * scale, this.b * scale);
    };
    /**
     * Multiplies the rgb values by scale and stores the result into "result"
     * @param scale defines the scaling factor
     * @param result defines the Color3 object where to store the result
     * @returns the unmodified current Color3
     */
    Color3.prototype.scaleToRef = function (scale, result) {
        result.r = this.r * scale;
        result.g = this.g * scale;
        result.b = this.b * scale;
        return this;
    };
    /**
     * Scale the current Color3 values by a factor and add the result to a given Color3
     * @param scale defines the scale factor
     * @param result defines color to store the result into
     * @returns the unmodified current Color3
     */
    Color3.prototype.scaleAndAddToRef = function (scale, result) {
        result.r += this.r * scale;
        result.g += this.g * scale;
        result.b += this.b * scale;
        return this;
    };
    /**
     * Clamps the rgb values by the min and max values and stores the result into "result"
     * @param min defines minimum clamping value (default is 0)
     * @param max defines maximum clamping value (default is 1)
     * @param result defines color to store the result into
     * @returns the original Color3
     */
    Color3.prototype.clampToRef = function (min, max, result) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        result.r = Scalar.Clamp(this.r, min, max);
        result.g = Scalar.Clamp(this.g, min, max);
        result.b = Scalar.Clamp(this.b, min, max);
        return this;
    };
    /**
     * Creates a new Color3 set with the added values of the current Color3 and of the given one
     * @param otherColor defines the second operand
     * @returns the new Color3
     */
    Color3.prototype.add = function (otherColor) {
        return new Color3(this.r + otherColor.r, this.g + otherColor.g, this.b + otherColor.b);
    };
    /**
     * Stores the result of the addition of the current Color3 and given one rgb values into "result"
     * @param otherColor defines the second operand
     * @param result defines Color3 object to store the result into
     * @returns the unmodified current Color3
     */
    Color3.prototype.addToRef = function (otherColor, result) {
        result.r = this.r + otherColor.r;
        result.g = this.g + otherColor.g;
        result.b = this.b + otherColor.b;
        return this;
    };
    /**
     * Returns a new Color3 set with the subtracted values of the given one from the current Color3
     * @param otherColor defines the second operand
     * @returns the new Color3
     */
    Color3.prototype.subtract = function (otherColor) {
        return new Color3(this.r - otherColor.r, this.g - otherColor.g, this.b - otherColor.b);
    };
    /**
     * Stores the result of the subtraction of given one from the current Color3 rgb values into "result"
     * @param otherColor defines the second operand
     * @param result defines Color3 object to store the result into
     * @returns the unmodified current Color3
     */
    Color3.prototype.subtractToRef = function (otherColor, result) {
        result.r = this.r - otherColor.r;
        result.g = this.g - otherColor.g;
        result.b = this.b - otherColor.b;
        return this;
    };
    /**
     * Copy the current object
     * @returns a new Color3 copied the current one
     */
    Color3.prototype.clone = function () {
        return new Color3(this.r, this.g, this.b);
    };
    /**
     * Copies the rgb values from the source in the current Color3
     * @param source defines the source Color3 object
     * @returns the updated Color3 object
     */
    Color3.prototype.copyFrom = function (source) {
        this.r = source.r;
        this.g = source.g;
        this.b = source.b;
        return this;
    };
    /**
     * Updates the Color3 rgb values from the given floats
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @returns the current Color3 object
     */
    Color3.prototype.copyFromFloats = function (r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    };
    /**
     * Updates the Color3 rgb values from the given floats
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @returns the current Color3 object
     */
    Color3.prototype.set = function (r, g, b) {
        return this.copyFromFloats(r, g, b);
    };
    /**
     * Compute the Color3 hexadecimal code as a string
     * @returns a string containing the hexadecimal representation of the Color3 object
     */
    Color3.prototype.toHexString = function () {
        var intR = (this.r * 255) | 0;
        var intG = (this.g * 255) | 0;
        var intB = (this.b * 255) | 0;
        return "#" + Scalar.ToHex(intR) + Scalar.ToHex(intG) + Scalar.ToHex(intB);
    };
    /**
     * Computes a new Color3 converted from the current one to linear space
     * @returns a new Color3 object
     */
    Color3.prototype.toLinearSpace = function () {
        var convertedColor = new Color3();
        this.toLinearSpaceToRef(convertedColor);
        return convertedColor;
    };
    /**
     * Converts the Color3 values to linear space and stores the result in "convertedColor"
     * @param convertedColor defines the Color3 object where to store the linear space version
     * @returns the unmodified Color3
     */
    Color3.prototype.toLinearSpaceToRef = function (convertedColor) {
        convertedColor.r = Math.pow(this.r, ToLinearSpace);
        convertedColor.g = Math.pow(this.g, ToLinearSpace);
        convertedColor.b = Math.pow(this.b, ToLinearSpace);
        return this;
    };
    /**
     * Computes a new Color3 converted from the current one to gamma space
     * @returns a new Color3 object
     */
    Color3.prototype.toGammaSpace = function () {
        var convertedColor = new Color3();
        this.toGammaSpaceToRef(convertedColor);
        return convertedColor;
    };
    /**
     * Converts the Color3 values to gamma space and stores the result in "convertedColor"
     * @param convertedColor defines the Color3 object where to store the gamma space version
     * @returns the unmodified Color3
     */
    Color3.prototype.toGammaSpaceToRef = function (convertedColor) {
        convertedColor.r = Math.pow(this.r, ToGammaSpace);
        convertedColor.g = Math.pow(this.g, ToGammaSpace);
        convertedColor.b = Math.pow(this.b, ToGammaSpace);
        return this;
    };
    /**
     * Creates a new Color3 from the string containing valid hexadecimal values
     * @param hex defines a string containing valid hexadecimal values
     * @returns a new Color3 object
     */
    Color3.FromHexString = function (hex) {
        if (hex.substring(0, 1) !== "#" || hex.length !== 7) {
            return new Color3(0, 0, 0);
        }
        var r = parseInt(hex.substring(1, 3), 16);
        var g = parseInt(hex.substring(3, 5), 16);
        var b = parseInt(hex.substring(5, 7), 16);
        return Color3.FromInts(r, g, b);
    };
    /**
     * Creates a new Color3 from the starting index of the given array
     * @param array defines the source array
     * @param offset defines an offset in the source array
     * @returns a new Color3 object
     */
    Color3.FromArray = function (array, offset) {
        if (offset === void 0) { offset = 0; }
        return new Color3(array[offset], array[offset + 1], array[offset + 2]);
    };
    /**
     * Creates a new Color3 from integer values (< 256)
     * @param r defines the red component to read from (value between 0 and 255)
     * @param g defines the green component to read from (value between 0 and 255)
     * @param b defines the blue component to read from (value between 0 and 255)
     * @returns a new Color3 object
     */
    Color3.FromInts = function (r, g, b) {
        return new Color3(r / 255.0, g / 255.0, b / 255.0);
    };
    /**
     * Creates a new Color3 with values linearly interpolated of "amount" between the start Color3 and the end Color3
     * @param start defines the start Color3 value
     * @param end defines the end Color3 value
     * @param amount defines the gradient value between start and end
     * @returns a new Color3 object
     */
    Color3.Lerp = function (start, end, amount) {
        var result = new Color3(0.0, 0.0, 0.0);
        Color3.LerpToRef(start, end, amount, result);
        return result;
    };
    /**
     * Creates a new Color3 with values linearly interpolated of "amount" between the start Color3 and the end Color3
     * @param left defines the start value
     * @param right defines the end value
     * @param amount defines the gradient factor
     * @param result defines the Color3 object where to store the result
     */
    Color3.LerpToRef = function (left, right, amount, result) {
        result.r = left.r + ((right.r - left.r) * amount);
        result.g = left.g + ((right.g - left.g) * amount);
        result.b = left.b + ((right.b - left.b) * amount);
    };
    /**
     * Returns a Color3 value containing a red color
     * @returns a new Color3 object
     */
    Color3.Red = function () { return new Color3(1, 0, 0); };
    /**
     * Returns a Color3 value containing a green color
     * @returns a new Color3 object
     */
    Color3.Green = function () { return new Color3(0, 1, 0); };
    /**
     * Returns a Color3 value containing a blue color
     * @returns a new Color3 object
     */
    Color3.Blue = function () { return new Color3(0, 0, 1); };
    /**
     * Returns a Color3 value containing a black color
     * @returns a new Color3 object
     */
    Color3.Black = function () { return new Color3(0, 0, 0); };
    Object.defineProperty(Color3, "BlackReadOnly", {
        /**
          * Gets a Color3 value containing a black color that must not be updated
          */
        get: function () {
            return Color3._BlackReadOnly;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a Color3 value containing a white color
     * @returns a new Color3 object
     */
    Color3.White = function () { return new Color3(1, 1, 1); };
    /**
     * Returns a Color3 value containing a purple color
     * @returns a new Color3 object
     */
    Color3.Purple = function () { return new Color3(0.5, 0, 0.5); };
    /**
     * Returns a Color3 value containing a magenta color
     * @returns a new Color3 object
     */
    Color3.Magenta = function () { return new Color3(1, 0, 1); };
    /**
     * Returns a Color3 value containing a yellow color
     * @returns a new Color3 object
     */
    Color3.Yellow = function () { return new Color3(1, 1, 0); };
    /**
     * Returns a Color3 value containing a gray color
     * @returns a new Color3 object
     */
    Color3.Gray = function () { return new Color3(0.5, 0.5, 0.5); };
    /**
     * Returns a Color3 value containing a teal color
     * @returns a new Color3 object
     */
    Color3.Teal = function () { return new Color3(0, 1.0, 1.0); };
    /**
     * Returns a Color3 value containing a random color
     * @returns a new Color3 object
     */
    Color3.Random = function () { return new Color3(Math.random(), Math.random(), Math.random()); };
    // Statics
    Color3._BlackReadOnly = Color3.Black();
    return Color3;
}());

/**
 * Class used to hold a RBGA color
 */
var Color4 = /** @class */ (function () {
    /**
     * Creates a new Color4 object from red, green, blue values, all between 0 and 1
     * @param r defines the red component (between 0 and 1, default is 0)
     * @param g defines the green component (between 0 and 1, default is 0)
     * @param b defines the blue component (between 0 and 1, default is 0)
     * @param a defines the alpha component (between 0 and 1, default is 1)
     */
    function Color4(
    /**
     * Defines the red component (between 0 and 1, default is 0)
     */
    r, 
    /**
     * Defines the green component (between 0 and 1, default is 0)
     */
    g, 
    /**
     * Defines the blue component (between 0 and 1, default is 0)
     */
    b, 
    /**
     * Defines the alpha component (between 0 and 1, default is 1)
     */
    a) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        if (a === void 0) { a = 1; }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    // Operators
    /**
     * Adds in place the given Color4 values to the current Color4 object
     * @param right defines the second operand
     * @returns the current updated Color4 object
     */
    Color4.prototype.addInPlace = function (right) {
        this.r += right.r;
        this.g += right.g;
        this.b += right.b;
        this.a += right.a;
        return this;
    };
    /**
     * Creates a new array populated with 4 numeric elements : red, green, blue, alpha values
     * @returns the new array
     */
    Color4.prototype.asArray = function () {
        var result = new Array();
        this.toArray(result, 0);
        return result;
    };
    /**
     * Stores from the starting index in the given array the Color4 successive values
     * @param array defines the array where to store the r,g,b components
     * @param index defines an optional index in the target array to define where to start storing values
     * @returns the current Color4 object
     */
    Color4.prototype.toArray = function (array, index) {
        if (index === void 0) { index = 0; }
        array[index] = this.r;
        array[index + 1] = this.g;
        array[index + 2] = this.b;
        array[index + 3] = this.a;
        return this;
    };
    /**
     * Determines equality between Color4 objects
     * @param otherColor defines the second operand
     * @returns true if the rgba values are equal to the given ones
     */
    Color4.prototype.equals = function (otherColor) {
        return otherColor && this.r === otherColor.r && this.g === otherColor.g && this.b === otherColor.b && this.a === otherColor.a;
    };
    /**
     * Creates a new Color4 set with the added values of the current Color4 and of the given one
     * @param right defines the second operand
     * @returns a new Color4 object
     */
    Color4.prototype.add = function (right) {
        return new Color4(this.r + right.r, this.g + right.g, this.b + right.b, this.a + right.a);
    };
    /**
     * Creates a new Color4 set with the subtracted values of the given one from the current Color4
     * @param right defines the second operand
     * @returns a new Color4 object
     */
    Color4.prototype.subtract = function (right) {
        return new Color4(this.r - right.r, this.g - right.g, this.b - right.b, this.a - right.a);
    };
    /**
     * Subtracts the given ones from the current Color4 values and stores the results in "result"
     * @param right defines the second operand
     * @param result defines the Color4 object where to store the result
     * @returns the current Color4 object
     */
    Color4.prototype.subtractToRef = function (right, result) {
        result.r = this.r - right.r;
        result.g = this.g - right.g;
        result.b = this.b - right.b;
        result.a = this.a - right.a;
        return this;
    };
    /**
     * Creates a new Color4 with the current Color4 values multiplied by scale
     * @param scale defines the scaling factor to apply
     * @returns a new Color4 object
     */
    Color4.prototype.scale = function (scale) {
        return new Color4(this.r * scale, this.g * scale, this.b * scale, this.a * scale);
    };
    /**
     * Multiplies the current Color4 values by scale and stores the result in "result"
     * @param scale defines the scaling factor to apply
     * @param result defines the Color4 object where to store the result
     * @returns the current unmodified Color4
     */
    Color4.prototype.scaleToRef = function (scale, result) {
        result.r = this.r * scale;
        result.g = this.g * scale;
        result.b = this.b * scale;
        result.a = this.a * scale;
        return this;
    };
    /**
     * Scale the current Color4 values by a factor and add the result to a given Color4
     * @param scale defines the scale factor
     * @param result defines the Color4 object where to store the result
     * @returns the unmodified current Color4
     */
    Color4.prototype.scaleAndAddToRef = function (scale, result) {
        result.r += this.r * scale;
        result.g += this.g * scale;
        result.b += this.b * scale;
        result.a += this.a * scale;
        return this;
    };
    /**
     * Clamps the rgb values by the min and max values and stores the result into "result"
     * @param min defines minimum clamping value (default is 0)
     * @param max defines maximum clamping value (default is 1)
     * @param result defines color to store the result into.
     * @returns the cuurent Color4
     */
    Color4.prototype.clampToRef = function (min, max, result) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        result.r = Scalar.Clamp(this.r, min, max);
        result.g = Scalar.Clamp(this.g, min, max);
        result.b = Scalar.Clamp(this.b, min, max);
        result.a = Scalar.Clamp(this.a, min, max);
        return this;
    };
    /**
      * Multipy an Color4 value by another and return a new Color4 object
      * @param color defines the Color4 value to multiply by
      * @returns a new Color4 object
      */
    Color4.prototype.multiply = function (color) {
        return new Color4(this.r * color.r, this.g * color.g, this.b * color.b, this.a * color.a);
    };
    /**
     * Multipy a Color4 value by another and push the result in a reference value
     * @param color defines the Color4 value to multiply by
     * @param result defines the Color4 to fill the result in
     * @returns the result Color4
     */
    Color4.prototype.multiplyToRef = function (color, result) {
        result.r = this.r * color.r;
        result.g = this.g * color.g;
        result.b = this.b * color.b;
        result.a = this.a * color.a;
        return result;
    };
    /**
     * Creates a string with the Color4 current values
     * @returns the string representation of the Color4 object
     */
    Color4.prototype.toString = function () {
        return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
    };
    /**
     * Returns the string "Color4"
     * @returns "Color4"
     */
    Color4.prototype.getClassName = function () {
        return "Color4";
    };
    /**
     * Compute the Color4 hash code
     * @returns an unique number that can be used to hash Color4 objects
     */
    Color4.prototype.getHashCode = function () {
        var hash = this.r || 0;
        hash = (hash * 397) ^ (this.g || 0);
        hash = (hash * 397) ^ (this.b || 0);
        hash = (hash * 397) ^ (this.a || 0);
        return hash;
    };
    /**
     * Creates a new Color4 copied from the current one
     * @returns a new Color4 object
     */
    Color4.prototype.clone = function () {
        return new Color4(this.r, this.g, this.b, this.a);
    };
    /**
     * Copies the given Color4 values into the current one
     * @param source defines the source Color4 object
     * @returns the current updated Color4 object
     */
    Color4.prototype.copyFrom = function (source) {
        this.r = source.r;
        this.g = source.g;
        this.b = source.b;
        this.a = source.a;
        return this;
    };
    /**
     * Copies the given float values into the current one
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @param a defines the alpha component to read from
     * @returns the current updated Color4 object
     */
    Color4.prototype.copyFromFloats = function (r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        return this;
    };
    /**
     * Copies the given float values into the current one
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @param a defines the alpha component to read from
     * @returns the current updated Color4 object
     */
    Color4.prototype.set = function (r, g, b, a) {
        return this.copyFromFloats(r, g, b, a);
    };
    /**
     * Compute the Color4 hexadecimal code as a string
     * @returns a string containing the hexadecimal representation of the Color4 object
     */
    Color4.prototype.toHexString = function () {
        var intR = (this.r * 255) | 0;
        var intG = (this.g * 255) | 0;
        var intB = (this.b * 255) | 0;
        var intA = (this.a * 255) | 0;
        return "#" + Scalar.ToHex(intR) + Scalar.ToHex(intG) + Scalar.ToHex(intB) + Scalar.ToHex(intA);
    };
    /**
     * Computes a new Color4 converted from the current one to linear space
     * @returns a new Color4 object
     */
    Color4.prototype.toLinearSpace = function () {
        var convertedColor = new Color4();
        this.toLinearSpaceToRef(convertedColor);
        return convertedColor;
    };
    /**
     * Converts the Color4 values to linear space and stores the result in "convertedColor"
     * @param convertedColor defines the Color4 object where to store the linear space version
     * @returns the unmodified Color4
     */
    Color4.prototype.toLinearSpaceToRef = function (convertedColor) {
        convertedColor.r = Math.pow(this.r, ToLinearSpace);
        convertedColor.g = Math.pow(this.g, ToLinearSpace);
        convertedColor.b = Math.pow(this.b, ToLinearSpace);
        convertedColor.a = this.a;
        return this;
    };
    /**
     * Computes a new Color4 converted from the current one to gamma space
     * @returns a new Color4 object
     */
    Color4.prototype.toGammaSpace = function () {
        var convertedColor = new Color4();
        this.toGammaSpaceToRef(convertedColor);
        return convertedColor;
    };
    /**
     * Converts the Color4 values to gamma space and stores the result in "convertedColor"
     * @param convertedColor defines the Color4 object where to store the gamma space version
     * @returns the unmodified Color4
     */
    Color4.prototype.toGammaSpaceToRef = function (convertedColor) {
        convertedColor.r = Math.pow(this.r, ToGammaSpace);
        convertedColor.g = Math.pow(this.g, ToGammaSpace);
        convertedColor.b = Math.pow(this.b, ToGammaSpace);
        convertedColor.a = this.a;
        return this;
    };
    // Statics
    /**
     * Creates a new Color4 from the string containing valid hexadecimal values
     * @param hex defines a string containing valid hexadecimal values
     * @returns a new Color4 object
     */
    Color4.FromHexString = function (hex) {
        if (hex.substring(0, 1) !== "#" || hex.length !== 9) {
            return new Color4(0.0, 0.0, 0.0, 0.0);
        }
        var r = parseInt(hex.substring(1, 3), 16);
        var g = parseInt(hex.substring(3, 5), 16);
        var b = parseInt(hex.substring(5, 7), 16);
        var a = parseInt(hex.substring(7, 9), 16);
        return Color4.FromInts(r, g, b, a);
    };
    /**
     * Creates a new Color4 object set with the linearly interpolated values of "amount" between the left Color4 object and the right Color4 object
     * @param left defines the start value
     * @param right defines the end value
     * @param amount defines the gradient factor
     * @returns a new Color4 object
     */
    Color4.Lerp = function (left, right, amount) {
        var result = new Color4(0.0, 0.0, 0.0, 0.0);
        Color4.LerpToRef(left, right, amount, result);
        return result;
    };
    /**
     * Set the given "result" with the linearly interpolated values of "amount" between the left Color4 object and the right Color4 object
     * @param left defines the start value
     * @param right defines the end value
     * @param amount defines the gradient factor
     * @param result defines the Color4 object where to store data
     */
    Color4.LerpToRef = function (left, right, amount, result) {
        result.r = left.r + (right.r - left.r) * amount;
        result.g = left.g + (right.g - left.g) * amount;
        result.b = left.b + (right.b - left.b) * amount;
        result.a = left.a + (right.a - left.a) * amount;
    };
    /**
     * Creates a new Color4 from a Color3 and an alpha value
     * @param color3 defines the source Color3 to read from
     * @param alpha defines the alpha component (1.0 by default)
     * @returns a new Color4 object
     */
    Color4.FromColor3 = function (color3, alpha) {
        if (alpha === void 0) { alpha = 1.0; }
        return new Color4(color3.r, color3.g, color3.b, alpha);
    };
    /**
     * Creates a new Color4 from the starting index element of the given array
     * @param array defines the source array to read from
     * @param offset defines the offset in the source array
     * @returns a new Color4 object
     */
    Color4.FromArray = function (array, offset) {
        if (offset === void 0) { offset = 0; }
        return new Color4(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
    };
    /**
     * Creates a new Color3 from integer values (< 256)
     * @param r defines the red component to read from (value between 0 and 255)
     * @param g defines the green component to read from (value between 0 and 255)
     * @param b defines the blue component to read from (value between 0 and 255)
     * @param a defines the alpha component to read from (value between 0 and 255)
     * @returns a new Color3 object
     */
    Color4.FromInts = function (r, g, b, a) {
        return new Color4(r / 255.0, g / 255.0, b / 255.0, a / 255.0);
    };
    /**
     * Check the content of a given array and convert it to an array containing RGBA data
     * If the original array was already containing count * 4 values then it is returned directly
     * @param colors defines the array to check
     * @param count defines the number of RGBA data to expect
     * @returns an array containing count * 4 values (RGBA)
     */
    Color4.CheckColors4 = function (colors, count) {
        // Check if color3 was used
        if (colors.length === count * 3) {
            var colors4 = [];
            for (var index = 0; index < colors.length; index += 3) {
                var newIndex = (index / 3) * 4;
                colors4[newIndex] = colors[index];
                colors4[newIndex + 1] = colors[index + 1];
                colors4[newIndex + 2] = colors[index + 2];
                colors4[newIndex + 3] = 1.0;
            }
            return colors4;
        }
        return colors;
    };
    return Color4;
}());

/**
 * Class representing a vector containing 2 coordinates
 */
var Vector2 = /** @class */ (function () {
    /**
     * Creates a new Vector2 from the given x and y coordinates
     * @param x defines the first coordinate
     * @param y defines the second coordinate
     */
    function Vector2(
    /** defines the first coordinate */
    x, 
    /** defines the second coordinate */
    y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    /**
     * Gets a string with the Vector2 coordinates
     * @returns a string with the Vector2 coordinates
     */
    Vector2.prototype.toString = function () {
        return "{X: " + this.x + " Y:" + this.y + "}";
    };
    /**
     * Gets class name
     * @returns the string "Vector2"
     */
    Vector2.prototype.getClassName = function () {
        return "Vector2";
    };
    /**
     * Gets current vector hash code
     * @returns the Vector2 hash code as a number
     */
    Vector2.prototype.getHashCode = function () {
        var hash = this.x || 0;
        hash = (hash * 397) ^ (this.y || 0);
        return hash;
    };
    // Operators
    /**
     * Sets the Vector2 coordinates in the given array or Float32Array from the given index.
     * @param array defines the source array
     * @param index defines the offset in source array
     * @returns the current Vector2
     */
    Vector2.prototype.toArray = function (array, index) {
        if (index === void 0) { index = 0; }
        array[index] = this.x;
        array[index + 1] = this.y;
        return this;
    };
    /**
     * Copy the current vector to an array
     * @returns a new array with 2 elements: the Vector2 coordinates.
     */
    Vector2.prototype.asArray = function () {
        var result = new Array();
        this.toArray(result, 0);
        return result;
    };
    /**
     * Sets the Vector2 coordinates with the given Vector2 coordinates
     * @param source defines the source Vector2
     * @returns the current updated Vector2
     */
    Vector2.prototype.copyFrom = function (source) {
        this.x = source.x;
        this.y = source.y;
        return this;
    };
    /**
     * Sets the Vector2 coordinates with the given floats
     * @param x defines the first coordinate
     * @param y defines the second coordinate
     * @returns the current updated Vector2
     */
    Vector2.prototype.copyFromFloats = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    /**
     * Sets the Vector2 coordinates with the given floats
     * @param x defines the first coordinate
     * @param y defines the second coordinate
     * @returns the current updated Vector2
     */
    Vector2.prototype.set = function (x, y) {
        return this.copyFromFloats(x, y);
    };
    /**
     * Add another vector with the current one
     * @param otherVector defines the other vector
     * @returns a new Vector2 set with the addition of the current Vector2 and the given one coordinates
     */
    Vector2.prototype.add = function (otherVector) {
        return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
    };
    /**
     * Sets the "result" coordinates with the addition of the current Vector2 and the given one coordinates
     * @param otherVector defines the other vector
     * @param result defines the target vector
     * @returns the unmodified current Vector2
     */
    Vector2.prototype.addToRef = function (otherVector, result) {
        result.x = this.x + otherVector.x;
        result.y = this.y + otherVector.y;
        return this;
    };
    /**
     * Set the Vector2 coordinates by adding the given Vector2 coordinates
     * @param otherVector defines the other vector
     * @returns the current updated Vector2
     */
    Vector2.prototype.addInPlace = function (otherVector) {
        this.x += otherVector.x;
        this.y += otherVector.y;
        return this;
    };
    /**
     * Gets a new Vector2 by adding the current Vector2 coordinates to the given Vector3 x, y coordinates
     * @param otherVector defines the other vector
     * @returns a new Vector2
     */
    Vector2.prototype.addVector3 = function (otherVector) {
        return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
    };
    /**
     * Gets a new Vector2 set with the subtracted coordinates of the given one from the current Vector2
     * @param otherVector defines the other vector
     * @returns a new Vector2
     */
    Vector2.prototype.subtract = function (otherVector) {
        return new Vector2(this.x - otherVector.x, this.y - otherVector.y);
    };
    /**
     * Sets the "result" coordinates with the subtraction of the given one from the current Vector2 coordinates.
     * @param otherVector defines the other vector
     * @param result defines the target vector
     * @returns the unmodified current Vector2
     */
    Vector2.prototype.subtractToRef = function (otherVector, result) {
        result.x = this.x - otherVector.x;
        result.y = this.y - otherVector.y;
        return this;
    };
    /**
     * Sets the current Vector2 coordinates by subtracting from it the given one coordinates
     * @param otherVector defines the other vector
     * @returns the current updated Vector2
     */
    Vector2.prototype.subtractInPlace = function (otherVector) {
        this.x -= otherVector.x;
        this.y -= otherVector.y;
        return this;
    };
    /**
     * Multiplies in place the current Vector2 coordinates by the given ones
     * @param otherVector defines the other vector
     * @returns the current updated Vector2
     */
    Vector2.prototype.multiplyInPlace = function (otherVector) {
        this.x *= otherVector.x;
        this.y *= otherVector.y;
        return this;
    };
    /**
     * Returns a new Vector2 set with the multiplication of the current Vector2 and the given one coordinates
     * @param otherVector defines the other vector
     * @returns a new Vector2
     */
    Vector2.prototype.multiply = function (otherVector) {
        return new Vector2(this.x * otherVector.x, this.y * otherVector.y);
    };
    /**
     * Sets "result" coordinates with the multiplication of the current Vector2 and the given one coordinates
     * @param otherVector defines the other vector
     * @param result defines the target vector
     * @returns the unmodified current Vector2
     */
    Vector2.prototype.multiplyToRef = function (otherVector, result) {
        result.x = this.x * otherVector.x;
        result.y = this.y * otherVector.y;
        return this;
    };
    /**
     * Gets a new Vector2 set with the Vector2 coordinates multiplied by the given floats
     * @param x defines the first coordinate
     * @param y defines the second coordinate
     * @returns a new Vector2
     */
    Vector2.prototype.multiplyByFloats = function (x, y) {
        return new Vector2(this.x * x, this.y * y);
    };
    /**
     * Returns a new Vector2 set with the Vector2 coordinates divided by the given one coordinates
     * @param otherVector defines the other vector
     * @returns a new Vector2
     */
    Vector2.prototype.divide = function (otherVector) {
        return new Vector2(this.x / otherVector.x, this.y / otherVector.y);
    };
    /**
     * Sets the "result" coordinates with the Vector2 divided by the given one coordinates
     * @param otherVector defines the other vector
     * @param result defines the target vector
     * @returns the unmodified current Vector2
     */
    Vector2.prototype.divideToRef = function (otherVector, result) {
        result.x = this.x / otherVector.x;
        result.y = this.y / otherVector.y;
        return this;
    };
    /**
     * Divides the current Vector2 coordinates by the given ones
     * @param otherVector defines the other vector
     * @returns the current updated Vector2
     */
    Vector2.prototype.divideInPlace = function (otherVector) {
        return this.divideToRef(otherVector, this);
    };
    /**
     * Gets a new Vector2 with current Vector2 negated coordinates
     * @returns a new Vector2
     */
    Vector2.prototype.negate = function () {
        return new Vector2(-this.x, -this.y);
    };
    /**
     * Multiply the Vector2 coordinates by scale
     * @param scale defines the scaling factor
     * @returns the current updated Vector2
     */
    Vector2.prototype.scaleInPlace = function (scale) {
        this.x *= scale;
        this.y *= scale;
        return this;
    };
    /**
     * Returns a new Vector2 scaled by "scale" from the current Vector2
     * @param scale defines the scaling factor
     * @returns a new Vector2
     */
    Vector2.prototype.scale = function (scale) {
        var result = new Vector2(0, 0);
        this.scaleToRef(scale, result);
        return result;
    };
    /**
     * Scale the current Vector2 values by a factor to a given Vector2
     * @param scale defines the scale factor
     * @param result defines the Vector2 object where to store the result
     * @returns the unmodified current Vector2
     */
    Vector2.prototype.scaleToRef = function (scale, result) {
        result.x = this.x * scale;
        result.y = this.y * scale;
        return this;
    };
    /**
     * Scale the current Vector2 values by a factor and add the result to a given Vector2
     * @param scale defines the scale factor
     * @param result defines the Vector2 object where to store the result
     * @returns the unmodified current Vector2
     */
    Vector2.prototype.scaleAndAddToRef = function (scale, result) {
        result.x += this.x * scale;
        result.y += this.y * scale;
        return this;
    };
    /**
     * Gets a boolean if two vectors are equals
     * @param otherVector defines the other vector
     * @returns true if the given vector coordinates strictly equal the current Vector2 ones
     */
    Vector2.prototype.equals = function (otherVector) {
        return otherVector && this.x === otherVector.x && this.y === otherVector.y;
    };
    /**
     * Gets a boolean if two vectors are equals (using an epsilon value)
     * @param otherVector defines the other vector
     * @param epsilon defines the minimal distance to consider equality
     * @returns true if the given vector coordinates are close to the current ones by a distance of epsilon.
     */
    Vector2.prototype.equalsWithEpsilon = function (otherVector, epsilon) {
        if (epsilon === void 0) { epsilon = Epsilon; }
        return otherVector && Scalar.WithinEpsilon(this.x, otherVector.x, epsilon) && Scalar.WithinEpsilon(this.y, otherVector.y, epsilon);
    };
    /**
     * Gets a new Vector2 from current Vector2 floored values
     * @returns a new Vector2
     */
    Vector2.prototype.floor = function () {
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    };
    /**
     * Gets a new Vector2 from current Vector2 floored values
     * @returns a new Vector2
     */
    Vector2.prototype.fract = function () {
        return new Vector2(this.x - Math.floor(this.x), this.y - Math.floor(this.y));
    };
    // Properties
    /**
     * Gets the length of the vector
     * @returns the vector length (float)
     */
    Vector2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    /**
     * Gets the vector squared length
     * @returns the vector squared length (float)
     */
    Vector2.prototype.lengthSquared = function () {
        return (this.x * this.x + this.y * this.y);
    };
    // Methods
    /**
     * Normalize the vector
     * @returns the current updated Vector2
     */
    Vector2.prototype.normalize = function () {
        var len = this.length();
        if (len === 0) {
            return this;
        }
        var num = 1.0 / len;
        this.x *= num;
        this.y *= num;
        return this;
    };
    /**
     * Gets a new Vector2 copied from the Vector2
     * @returns a new Vector2
     */
    Vector2.prototype.clone = function () {
        return new Vector2(this.x, this.y);
    };
    // Statics
    /**
     * Gets a new Vector2(0, 0)
     * @returns a new Vector2
     */
    Vector2.Zero = function () {
        return new Vector2(0, 0);
    };
    /**
     * Gets a new Vector2(1, 1)
     * @returns a new Vector2
     */
    Vector2.One = function () {
        return new Vector2(1, 1);
    };
    /**
     * Gets a new Vector2 set from the given index element of the given array
     * @param array defines the data source
     * @param offset defines the offset in the data source
     * @returns a new Vector2
     */
    Vector2.FromArray = function (array, offset) {
        if (offset === void 0) { offset = 0; }
        return new Vector2(array[offset], array[offset + 1]);
    };
    /**
     * Sets "result" from the given index element of the given array
     * @param array defines the data source
     * @param offset defines the offset in the data source
     * @param result defines the target vector
     */
    Vector2.FromArrayToRef = function (array, offset, result) {
        result.x = array[offset];
        result.y = array[offset + 1];
    };
    /**
     * Gets a new Vector2 located for "amount" (float) on the CatmullRom spline defined by the given four Vector2
     * @param value1 defines 1st point of control
     * @param value2 defines 2nd point of control
     * @param value3 defines 3rd point of control
     * @param value4 defines 4th point of control
     * @param amount defines the interpolation factor
     * @returns a new Vector2
     */
    Vector2.CatmullRom = function (value1, value2, value3, value4, amount) {
        var squared = amount * amount;
        var cubed = amount * squared;
        var x = 0.5 * ((((2.0 * value2.x) + ((-value1.x + value3.x) * amount)) +
            (((((2.0 * value1.x) - (5.0 * value2.x)) + (4.0 * value3.x)) - value4.x) * squared)) +
            ((((-value1.x + (3.0 * value2.x)) - (3.0 * value3.x)) + value4.x) * cubed));
        var y = 0.5 * ((((2.0 * value2.y) + ((-value1.y + value3.y) * amount)) +
            (((((2.0 * value1.y) - (5.0 * value2.y)) + (4.0 * value3.y)) - value4.y) * squared)) +
            ((((-value1.y + (3.0 * value2.y)) - (3.0 * value3.y)) + value4.y) * cubed));
        return new Vector2(x, y);
    };
    /**
     * Returns a new Vector2 set with same the coordinates than "value" ones if the vector "value" is in the square defined by "min" and "max".
     * If a coordinate of "value" is lower than "min" coordinates, the returned Vector2 is given this "min" coordinate.
     * If a coordinate of "value" is greater than "max" coordinates, the returned Vector2 is given this "max" coordinate
     * @param value defines the value to clamp
     * @param min defines the lower limit
     * @param max defines the upper limit
     * @returns a new Vector2
     */
    Vector2.Clamp = function (value, min, max) {
        var x = value.x;
        x = (x > max.x) ? max.x : x;
        x = (x < min.x) ? min.x : x;
        var y = value.y;
        y = (y > max.y) ? max.y : y;
        y = (y < min.y) ? min.y : y;
        return new Vector2(x, y);
    };
    /**
     * Returns a new Vector2 located for "amount" (float) on the Hermite spline defined by the vectors "value1", "value3", "tangent1", "tangent2"
     * @param value1 defines the 1st control point
     * @param tangent1 defines the outgoing tangent
     * @param value2 defines the 2nd control point
     * @param tangent2 defines the incoming tangent
     * @param amount defines the interpolation factor
     * @returns a new Vector2
     */
    Vector2.Hermite = function (value1, tangent1, value2, tangent2, amount) {
        var squared = amount * amount;
        var cubed = amount * squared;
        var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
        var part2 = (-2.0 * cubed) + (3.0 * squared);
        var part3 = (cubed - (2.0 * squared)) + amount;
        var part4 = cubed - squared;
        var x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
        var y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
        return new Vector2(x, y);
    };
    /**
     * Returns a new Vector2 located for "amount" (float) on the linear interpolation between the vector "start" adn the vector "end".
     * @param start defines the start vector
     * @param end defines the end vector
     * @param amount defines the interpolation factor
     * @returns a new Vector2
     */
    Vector2.Lerp = function (start, end, amount) {
        var x = start.x + ((end.x - start.x) * amount);
        var y = start.y + ((end.y - start.y) * amount);
        return new Vector2(x, y);
    };
    /**
     * Gets the dot product of the vector "left" and the vector "right"
     * @param left defines first vector
     * @param right defines second vector
     * @returns the dot product (float)
     */
    Vector2.Dot = function (left, right) {
        return left.x * right.x + left.y * right.y;
    };
    /**
     * Returns a new Vector2 equal to the normalized given vector
     * @param vector defines the vector to normalize
     * @returns a new Vector2
     */
    Vector2.Normalize = function (vector) {
        var newVector = vector.clone();
        newVector.normalize();
        return newVector;
    };
    /**
     * Gets a new Vector2 set with the minimal coordinate values from the "left" and "right" vectors
     * @param left defines 1st vector
     * @param right defines 2nd vector
     * @returns a new Vector2
     */
    Vector2.Minimize = function (left, right) {
        var x = (left.x < right.x) ? left.x : right.x;
        var y = (left.y < right.y) ? left.y : right.y;
        return new Vector2(x, y);
    };
    /**
     * Gets a new Vecto2 set with the maximal coordinate values from the "left" and "right" vectors
     * @param left defines 1st vector
     * @param right defines 2nd vector
     * @returns a new Vector2
     */
    Vector2.Maximize = function (left, right) {
        var x = (left.x > right.x) ? left.x : right.x;
        var y = (left.y > right.y) ? left.y : right.y;
        return new Vector2(x, y);
    };
    /**
     * Gets a new Vector2 set with the transformed coordinates of the given vector by the given transformation matrix
     * @param vector defines the vector to transform
     * @param transformation defines the matrix to apply
     * @returns a new Vector2
     */
    Vector2.Transform = function (vector, transformation) {
        var r = Vector2.Zero();
        Vector2.TransformToRef(vector, transformation, r);
        return r;
    };
    /**
     * Transforms the given vector coordinates by the given transformation matrix and stores the result in the vector "result" coordinates
     * @param vector defines the vector to transform
     * @param transformation defines the matrix to apply
     * @param result defines the target vector
     */
    Vector2.TransformToRef = function (vector, transformation, result) {
        var m = transformation.m;
        var x = (vector.x * m[0]) + (vector.y * m[4]) + m[12];
        var y = (vector.x * m[1]) + (vector.y * m[5]) + m[13];
        result.x = x;
        result.y = y;
    };
    /**
     * Determines if a given vector is included in a triangle
     * @param p defines the vector to test
     * @param p0 defines 1st triangle point
     * @param p1 defines 2nd triangle point
     * @param p2 defines 3rd triangle point
     * @returns true if the point "p" is in the triangle defined by the vertors "p0", "p1", "p2"
     */
    Vector2.PointInTriangle = function (p, p0, p1, p2) {
        var a = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        var sign = a < 0 ? -1 : 1;
        var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
        var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
        return s > 0 && t > 0 && (s + t) < 2 * a * sign;
    };
    /**
     * Gets the distance between the vectors "value1" and "value2"
     * @param value1 defines first vector
     * @param value2 defines second vector
     * @returns the distance between vectors
     */
    Vector2.Distance = function (value1, value2) {
        return Math.sqrt(Vector2.DistanceSquared(value1, value2));
    };
    /**
     * Returns the squared distance between the vectors "value1" and "value2"
     * @param value1 defines first vector
     * @param value2 defines second vector
     * @returns the squared distance between vectors
     */
    Vector2.DistanceSquared = function (value1, value2) {
        var x = value1.x - value2.x;
        var y = value1.y - value2.y;
        return (x * x) + (y * y);
    };
    /**
     * Gets a new Vector2 located at the center of the vectors "value1" and "value2"
     * @param value1 defines first vector
     * @param value2 defines second vector
     * @returns a new Vector2
     */
    Vector2.Center = function (value1, value2) {
        var center = value1.add(value2);
        center.scaleInPlace(0.5);
        return center;
    };
    /**
     * Gets the shortest distance (float) between the point "p" and the segment defined by the two points "segA" and "segB".
     * @param p defines the middle point
     * @param segA defines one point of the segment
     * @param segB defines the other point of the segment
     * @returns the shortest distance
     */
    Vector2.DistanceOfPointFromSegment = function (p, segA, segB) {
        var l2 = Vector2.DistanceSquared(segA, segB);
        if (l2 === 0.0) {
            return Vector2.Distance(p, segA);
        }
        var v = segB.subtract(segA);
        var t = Math.max(0, Math.min(1, Vector2.Dot(p.subtract(segA), v) / l2));
        var proj = segA.add(v.multiplyByFloats(t, t));
        return Vector2.Distance(p, proj);
    };
    return Vector2;
}());

/**
 * Classed used to store (x,y,z) vector representation
 * A Vector3 is the main object used in 3D geometry
 * It can represent etiher the coordinates of a point the space, either a direction
 * Reminder: js uses a left handed forward facing system
 */
var Vector3 = /** @class */ (function () {
    /**
     * Creates a new Vector3 object from the given x, y, z (floats) coordinates.
     * @param x defines the first coordinates (on X axis)
     * @param y defines the second coordinates (on Y axis)
     * @param z defines the third coordinates (on Z axis)
     */
    function Vector3(
    /**
     * Defines the first coordinates (on X axis)
     */
    x, 
    /**
     * Defines the second coordinates (on Y axis)
     */
    y, 
    /**
     * Defines the third coordinates (on Z axis)
     */
    z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * Creates a string representation of the Vector3
     * @returns a string with the Vector3 coordinates.
     */
    Vector3.prototype.toString = function () {
        return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + "}";
    };
    /**
     * Gets the class name
     * @returns the string "Vector3"
     */
    Vector3.prototype.getClassName = function () {
        return "Vector3";
    };
    /**
     * Creates the Vector3 hash code
     * @returns a number which tends to be unique between Vector3 instances
     */
    Vector3.prototype.getHashCode = function () {
        var hash = this.x || 0;
        hash = (hash * 397) ^ (this.y || 0);
        hash = (hash * 397) ^ (this.z || 0);
        return hash;
    };
    // Operators
    /**
     * Creates an array containing three elements : the coordinates of the Vector3
     * @returns a new array of numbers
     */
    Vector3.prototype.asArray = function () {
        var result = [];
        this.toArray(result, 0);
        return result;
    };
    /**
     * Populates the given array or Float32Array from the given index with the successive coordinates of the Vector3
     * @param array defines the destination array
     * @param index defines the offset in the destination array
     * @returns the current Vector3
     */
    Vector3.prototype.toArray = function (array, index) {
        if (index === void 0) { index = 0; }
        array[index] = this.x;
        array[index + 1] = this.y;
        array[index + 2] = this.z;
        return this;
    };
    /**
     * Converts the current Vector3 into a quaternion (considering that the Vector3 contains Euler angles representation of a rotation)
     * @returns a new Quaternion object, computed from the Vector3 coordinates
     */
    Vector3.prototype.toQuaternion = function () {
        return Quaternion.RotationYawPitchRoll(this.y, this.x, this.z);
    };
    /**
     * Adds the given vector to the current Vector3
     * @param otherVector defines the second operand
     * @returns the current updated Vector3
     */
    Vector3.prototype.addInPlace = function (otherVector) {
        return this.addInPlaceFromFloats(otherVector.x, otherVector.y, otherVector.z);
    };
    /**
     * Adds the given coordinates to the current Vector3
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the current updated Vector3
     */
    Vector3.prototype.addInPlaceFromFloats = function (x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    };
    /**
     * Gets a new Vector3, result of the addition the current Vector3 and the given vector
     * @param otherVector defines the second operand
     * @returns the resulting Vector3
     */
    Vector3.prototype.add = function (otherVector) {
        return new Vector3(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
    };
    /**
     * Adds the current Vector3 to the given one and stores the result in the vector "result"
     * @param otherVector defines the second operand
     * @param result defines the Vector3 object where to store the result
     * @returns the current Vector3
     */
    Vector3.prototype.addToRef = function (otherVector, result) {
        return result.copyFromFloats(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
    };
    /**
     * Subtract the given vector from the current Vector3
     * @param otherVector defines the second operand
     * @returns the current updated Vector3
     */
    Vector3.prototype.subtractInPlace = function (otherVector) {
        this.x -= otherVector.x;
        this.y -= otherVector.y;
        this.z -= otherVector.z;
        return this;
    };
    /**
     * Returns a new Vector3, result of the subtraction of the given vector from the current Vector3
     * @param otherVector defines the second operand
     * @returns the resulting Vector3
     */
    Vector3.prototype.subtract = function (otherVector) {
        return new Vector3(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
    };
    /**
     * Subtracts the given vector from the current Vector3 and stores the result in the vector "result".
     * @param otherVector defines the second operand
     * @param result defines the Vector3 object where to store the result
     * @returns the current Vector3
     */
    Vector3.prototype.subtractToRef = function (otherVector, result) {
        return this.subtractFromFloatsToRef(otherVector.x, otherVector.y, otherVector.z, result);
    };
    /**
     * Returns a new Vector3 set with the subtraction of the given floats from the current Vector3 coordinates
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the resulting Vector3
     */
    Vector3.prototype.subtractFromFloats = function (x, y, z) {
        return new Vector3(this.x - x, this.y - y, this.z - z);
    };
    /**
     * Subtracts the given floats from the current Vector3 coordinates and set the given vector "result" with this result
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @param result defines the Vector3 object where to store the result
     * @returns the current Vector3
     */
    Vector3.prototype.subtractFromFloatsToRef = function (x, y, z, result) {
        return result.copyFromFloats(this.x - x, this.y - y, this.z - z);
    };
    /**
     * Gets a new Vector3 set with the current Vector3 negated coordinates
     * @returns a new Vector3
     */
    Vector3.prototype.negate = function () {
        return new Vector3(-this.x, -this.y, -this.z);
    };
    /**
     * Multiplies the Vector3 coordinates by the float "scale"
     * @param scale defines the multiplier factor
     * @returns the current updated Vector3
     */
    Vector3.prototype.scaleInPlace = function (scale) {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        return this;
    };
    /**
     * Returns a new Vector3 set with the current Vector3 coordinates multiplied by the float "scale"
     * @param scale defines the multiplier factor
     * @returns a new Vector3
     */
    Vector3.prototype.scale = function (scale) {
        return new Vector3(this.x * scale, this.y * scale, this.z * scale);
    };
    /**
     * Multiplies the current Vector3 coordinates by the float "scale" and stores the result in the given vector "result" coordinates
     * @param scale defines the multiplier factor
     * @param result defines the Vector3 object where to store the result
     * @returns the current Vector3
     */
    Vector3.prototype.scaleToRef = function (scale, result) {
        return result.copyFromFloats(this.x * scale, this.y * scale, this.z * scale);
    };
    /**
     * Scale the current Vector3 values by a factor and add the result to a given Vector3
     * @param scale defines the scale factor
     * @param result defines the Vector3 object where to store the result
     * @returns the unmodified current Vector3
     */
    Vector3.prototype.scaleAndAddToRef = function (scale, result) {
        return result.addInPlaceFromFloats(this.x * scale, this.y * scale, this.z * scale);
    };
    /**
     * Returns true if the current Vector3 and the given vector coordinates are strictly equal
     * @param otherVector defines the second operand
     * @returns true if both vectors are equals
     */
    Vector3.prototype.equals = function (otherVector) {
        return otherVector && this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z;
    };
    /**
     * Returns true if the current Vector3 and the given vector coordinates are distant less than epsilon
     * @param otherVector defines the second operand
     * @param epsilon defines the minimal distance to define values as equals
     * @returns true if both vectors are distant less than epsilon
     */
    Vector3.prototype.equalsWithEpsilon = function (otherVector, epsilon) {
        if (epsilon === void 0) { epsilon = Epsilon; }
        return otherVector && Scalar.WithinEpsilon(this.x, otherVector.x, epsilon) && Scalar.WithinEpsilon(this.y, otherVector.y, epsilon) && Scalar.WithinEpsilon(this.z, otherVector.z, epsilon);
    };
    /**
     * Returns true if the current Vector3 coordinates equals the given floats
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns true if both vectors are equals
     */
    Vector3.prototype.equalsToFloats = function (x, y, z) {
        return this.x === x && this.y === y && this.z === z;
    };
    /**
     * Multiplies the current Vector3 coordinates by the given ones
     * @param otherVector defines the second operand
     * @returns the current updated Vector3
     */
    Vector3.prototype.multiplyInPlace = function (otherVector) {
        this.x *= otherVector.x;
        this.y *= otherVector.y;
        this.z *= otherVector.z;
        return this;
    };
    /**
     * Returns a new Vector3, result of the multiplication of the current Vector3 by the given vector
     * @param otherVector defines the second operand
     * @returns the new Vector3
     */
    Vector3.prototype.multiply = function (otherVector) {
        return this.multiplyByFloats(otherVector.x, otherVector.y, otherVector.z);
    };
    /**
     * Multiplies the current Vector3 by the given one and stores the result in the given vector "result"
     * @param otherVector defines the second operand
     * @param result defines the Vector3 object where to store the result
     * @returns the current Vector3
     */
    Vector3.prototype.multiplyToRef = function (otherVector, result) {
        return result.copyFromFloats(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z);
    };
    /**
     * Returns a new Vector3 set with the result of the mulliplication of the current Vector3 coordinates by the given floats
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the new Vector3
     */
    Vector3.prototype.multiplyByFloats = function (x, y, z) {
        return new Vector3(this.x * x, this.y * y, this.z * z);
    };
    /**
     * Returns a new Vector3 set with the result of the division of the current Vector3 coordinates by the given ones
     * @param otherVector defines the second operand
     * @returns the new Vector3
     */
    Vector3.prototype.divide = function (otherVector) {
        return new Vector3(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z);
    };
    /**
     * Divides the current Vector3 coordinates by the given ones and stores the result in the given vector "result"
     * @param otherVector defines the second operand
     * @param result defines the Vector3 object where to store the result
     * @returns the current Vector3
     */
    Vector3.prototype.divideToRef = function (otherVector, result) {
        return result.copyFromFloats(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z);
    };
    /**
     * Divides the current Vector3 coordinates by the given ones.
     * @param otherVector defines the second operand
     * @returns the current updated Vector3
     */
    Vector3.prototype.divideInPlace = function (otherVector) {
        return this.divideToRef(otherVector, this);
    };
    /**
     * Updates the current Vector3 with the minimal coordinate values between its and the given vector ones
     * @param other defines the second operand
     * @returns the current updated Vector3
     */
    Vector3.prototype.minimizeInPlace = function (other) {
        return this.minimizeInPlaceFromFloats(other.x, other.y, other.z);
    };
    /**
     * Updates the current Vector3 with the maximal coordinate values between its and the given vector ones.
     * @param other defines the second operand
     * @returns the current updated Vector3
     */
    Vector3.prototype.maximizeInPlace = function (other) {
        return this.maximizeInPlaceFromFloats(other.x, other.y, other.z);
    };
    /**
     * Updates the current Vector3 with the minimal coordinate values between its and the given coordinates
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the current updated Vector3
     */
    Vector3.prototype.minimizeInPlaceFromFloats = function (x, y, z) {
        if (x < this.x) {
            this.x = x;
        }
        if (y < this.y) {
            this.y = y;
        }
        if (z < this.z) {
            this.z = z;
        }
        return this;
    };
    /**
     * Updates the current Vector3 with the maximal coordinate values between its and the given coordinates.
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the current updated Vector3
     */
    Vector3.prototype.maximizeInPlaceFromFloats = function (x, y, z) {
        if (x > this.x) {
            this.x = x;
        }
        if (y > this.y) {
            this.y = y;
        }
        if (z > this.z) {
            this.z = z;
        }
        return this;
    };
    /**
     * Due to float precision, scale of a mesh could be uniform but float values are off by a small fraction
     * Check if is non uniform within a certain amount of decimal places to account for this
     * @param epsilon the amount the values can differ
     * @returns if the the vector is non uniform to a certain number of decimal places
     */
    Vector3.prototype.isNonUniformWithinEpsilon = function (epsilon) {
        var absX = Math.abs(this.x);
        var absY = Math.abs(this.y);
        if (!Scalar.WithinEpsilon(absX, absY, epsilon)) {
            return true;
        }
        var absZ = Math.abs(this.z);
        if (!Scalar.WithinEpsilon(absX, absZ, epsilon)) {
            return true;
        }
        if (!Scalar.WithinEpsilon(absY, absZ, epsilon)) {
            return true;
        }
        return false;
    };
    Object.defineProperty(Vector3.prototype, "isNonUniform", {
        /**
         * Gets a boolean indicating that the vector is non uniform meaning x, y or z are not all the same
         */
        get: function () {
            var absX = Math.abs(this.x);
            var absY = Math.abs(this.y);
            if (absX !== absY) {
                return true;
            }
            var absZ = Math.abs(this.z);
            if (absX !== absZ) {
                return true;
            }
            if (absY !== absZ) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets a new Vector3 from current Vector3 floored values
     * @returns a new Vector3
     */
    Vector3.prototype.floor = function () {
        return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    };
    /**
     * Gets a new Vector3 from current Vector3 floored values
     * @returns a new Vector3
     */
    Vector3.prototype.fract = function () {
        return new Vector3(this.x - Math.floor(this.x), this.y - Math.floor(this.y), this.z - Math.floor(this.z));
    };
    // Properties
    /**
     * Gets the length of the Vector3
     * @returns the length of the Vecto3
     */
    Vector3.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
    /**
     * Gets the squared length of the Vector3
     * @returns squared length of the Vector3
     */
    Vector3.prototype.lengthSquared = function () {
        return (this.x * this.x + this.y * this.y + this.z * this.z);
    };
    /**
     * Normalize the current Vector3.
     * Please note that this is an in place operation.
     * @returns the current updated Vector3
     */
    Vector3.prototype.normalize = function () {
        return this.normalizeFromLength(this.length());
    };
    /**
     * Reorders the x y z properties of the vector in place
     * @param order new ordering of the properties (eg. for vector 1,2,3 with "ZYX" will produce 3,2,1)
     * @returns the current updated vector
     */
    Vector3.prototype.reorderInPlace = function (order) {
        var _this = this;
        order = order.toLowerCase();
        if (order === "xyz") {
            return this;
        }
        MathTmp.Vector3[0].copyFrom(this);
        ["x", "y", "z"].forEach(function (val, i) {
            _this[val] = MathTmp.Vector3[0][order[i]];
        });
        return this;
    };
    /**
     * Rotates the vector around 0,0,0 by a quaternion
     * @param quaternion the rotation quaternion
     * @param result vector to store the result
     * @returns the resulting vector
     */
    Vector3.prototype.rotateByQuaternionToRef = function (quaternion, result) {
        quaternion.toRotationMatrix(MathTmp.Matrix[0]);
        Vector3.TransformCoordinatesToRef(this, MathTmp.Matrix[0], result);
        return result;
    };
    /**
     * Rotates a vector around a given point
     * @param quaternion the rotation quaternion
     * @param point the point to rotate around
     * @param result vector to store the result
     * @returns the resulting vector
     */
    Vector3.prototype.rotateByQuaternionAroundPointToRef = function (quaternion, point, result) {
        this.subtractToRef(point, MathTmp.Vector3[0]);
        MathTmp.Vector3[0].rotateByQuaternionToRef(quaternion, MathTmp.Vector3[0]);
        point.addToRef(MathTmp.Vector3[0], result);
        return result;
    };
    /**
     * Normalize the current Vector3 with the given input length.
     * Please note that this is an in place operation.
     * @param len the length of the vector
     * @returns the current updated Vector3
     */
    Vector3.prototype.normalizeFromLength = function (len) {
        if (len === 0 || len === 1.0) {
            return this;
        }
        return this.scaleInPlace(1.0 / len);
    };
    /**
     * Normalize the current Vector3 to a new vector
     * @returns the new Vector3
     */
    Vector3.prototype.normalizeToNew = function () {
        var normalized = new Vector3(0, 0, 0);
        this.normalizeToRef(normalized);
        return normalized;
    };
    /**
     * Normalize the current Vector3 to the reference
     * @param reference define the Vector3 to update
     * @returns the updated Vector3
     */
    Vector3.prototype.normalizeToRef = function (reference) {
        var len = this.length();
        if (len === 0 || len === 1.0) {
            return reference.copyFromFloats(this.x, this.y, this.z);
        }
        return this.scaleToRef(1.0 / len, reference);
    };
    /**
     * Creates a new Vector3 copied from the current Vector3
     * @returns the new Vector3
     */
    Vector3.prototype.clone = function () {
        return new Vector3(this.x, this.y, this.z);
    };
    /**
     * Copies the given vector coordinates to the current Vector3 ones
     * @param source defines the source Vector3
     * @returns the current updated Vector3
     */
    Vector3.prototype.copyFrom = function (source) {
        return this.copyFromFloats(source.x, source.y, source.z);
    };
    /**
     * Copies the given floats to the current Vector3 coordinates
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the current updated Vector3
     */
    Vector3.prototype.copyFromFloats = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    };
    /**
     * Copies the given floats to the current Vector3 coordinates
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the current updated Vector3
     */
    Vector3.prototype.set = function (x, y, z) {
        return this.copyFromFloats(x, y, z);
    };
    /**
     * Copies the given float to the current Vector3 coordinates
     * @param v defines the x, y and z coordinates of the operand
     * @returns the current updated Vector3
     */
    Vector3.prototype.setAll = function (v) {
        this.x = this.y = this.z = v;
        return this;
    };
    // Statics
    /**
     * Get the clip factor between two vectors
     * @param vector0 defines the first operand
     * @param vector1 defines the second operand
     * @param axis defines the axis to use
     * @param size defines the size along the axis
     * @returns the clip factor
     */
    Vector3.GetClipFactor = function (vector0, vector1, axis, size) {
        var d0 = Vector3.Dot(vector0, axis) - size;
        var d1 = Vector3.Dot(vector1, axis) - size;
        var s = d0 / (d0 - d1);
        return s;
    };
    /**
     * Get angle between two vectors
     * @param vector0 angle between vector0 and vector1
     * @param vector1 angle between vector0 and vector1
     * @param normal direction of the normal
     * @return the angle between vector0 and vector1
     */
    Vector3.GetAngleBetweenVectors = function (vector0, vector1, normal) {
        var v0 = vector0.normalizeToRef(MathTmp.Vector3[1]);
        var v1 = vector1.normalizeToRef(MathTmp.Vector3[2]);
        var dot = Vector3.Dot(v0, v1);
        var n = MathTmp.Vector3[3];
        Vector3.CrossToRef(v0, v1, n);
        if (Vector3.Dot(n, normal) > 0) {
            return Math.acos(dot);
        }
        return -Math.acos(dot);
    };
    /**
     * Returns a new Vector3 set from the index "offset" of the given array
     * @param array defines the source array
     * @param offset defines the offset in the source array
     * @returns the new Vector3
     */
    Vector3.FromArray = function (array, offset) {
        if (offset === void 0) { offset = 0; }
        return new Vector3(array[offset], array[offset + 1], array[offset + 2]);
    };
    /**
     * Returns a new Vector3 set from the index "offset" of the given Float32Array
     * This function is deprecated. Use FromArray instead
     * @param array defines the source array
     * @param offset defines the offset in the source array
     * @returns the new Vector3
     */
    Vector3.FromFloatArray = function (array, offset) {
        return Vector3.FromArray(array, offset);
    };
    /**
     * Sets the given vector "result" with the element values from the index "offset" of the given array
     * @param array defines the source array
     * @param offset defines the offset in the source array
     * @param result defines the Vector3 where to store the result
     */
    Vector3.FromArrayToRef = function (array, offset, result) {
        result.x = array[offset];
        result.y = array[offset + 1];
        result.z = array[offset + 2];
    };
    /**
     * Sets the given vector "result" with the element values from the index "offset" of the given Float32Array
     * This function is deprecated.  Use FromArrayToRef instead.
     * @param array defines the source array
     * @param offset defines the offset in the source array
     * @param result defines the Vector3 where to store the result
     */
    Vector3.FromFloatArrayToRef = function (array, offset, result) {
        return Vector3.FromArrayToRef(array, offset, result);
    };
    /**
     * Sets the given vector "result" with the given floats.
     * @param x defines the x coordinate of the source
     * @param y defines the y coordinate of the source
     * @param z defines the z coordinate of the source
     * @param result defines the Vector3 where to store the result
     */
    Vector3.FromFloatsToRef = function (x, y, z, result) {
        result.copyFromFloats(x, y, z);
    };
    /**
     * Returns a new Vector3 set to (0.0, 0.0, 0.0)
     * @returns a new empty Vector3
     */
    Vector3.Zero = function () {
        return new Vector3(0.0, 0.0, 0.0);
    };
    /**
     * Returns a new Vector3 set to (1.0, 1.0, 1.0)
     * @returns a new unit Vector3
     */
    Vector3.One = function () {
        return new Vector3(1.0, 1.0, 1.0);
    };
    /**
     * Returns a new Vector3 set to (0.0, 1.0, 0.0)
     * @returns a new up Vector3
     */
    Vector3.Up = function () {
        return new Vector3(0.0, 1.0, 0.0);
    };
    Object.defineProperty(Vector3, "UpReadOnly", {
        /**
         * Gets a up Vector3 that must not be updated
         */
        get: function () {
            return Vector3._UpReadOnly;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a new Vector3 set to (0.0, -1.0, 0.0)
     * @returns a new down Vector3
     */
    Vector3.Down = function () {
        return new Vector3(0.0, -1.0, 0.0);
    };
    /**
     * Returns a new Vector3 set to (0.0, 0.0, 1.0)
     * @returns a new forward Vector3
     */
    Vector3.Forward = function () {
        return new Vector3(0.0, 0.0, 1.0);
    };
    /**
     * Returns a new Vector3 set to (0.0, 0.0, -1.0)
     * @returns a new forward Vector3
     */
    Vector3.Backward = function () {
        return new Vector3(0.0, 0.0, -1.0);
    };
    /**
     * Returns a new Vector3 set to (1.0, 0.0, 0.0)
     * @returns a new right Vector3
     */
    Vector3.Right = function () {
        return new Vector3(1.0, 0.0, 0.0);
    };
    /**
     * Returns a new Vector3 set to (-1.0, 0.0, 0.0)
     * @returns a new left Vector3
     */
    Vector3.Left = function () {
        return new Vector3(-1.0, 0.0, 0.0);
    };
    /**
     * Returns a new Vector3 set with the result of the transformation by the given matrix of the given vector.
     * This method computes tranformed coordinates only, not transformed direction vectors (ie. it takes translation in account)
     * @param vector defines the Vector3 to transform
     * @param transformation defines the transformation matrix
     * @returns the transformed Vector3
     */
    Vector3.TransformCoordinates = function (vector, transformation) {
        var result = Vector3.Zero();
        Vector3.TransformCoordinatesToRef(vector, transformation, result);
        return result;
    };
    /**
     * Sets the given vector "result" coordinates with the result of the transformation by the given matrix of the given vector
     * This method computes tranformed coordinates only, not transformed direction vectors (ie. it takes translation in account)
     * @param vector defines the Vector3 to transform
     * @param transformation defines the transformation matrix
     * @param result defines the Vector3 where to store the result
     */
    Vector3.TransformCoordinatesToRef = function (vector, transformation, result) {
        Vector3.TransformCoordinatesFromFloatsToRef(vector.x, vector.y, vector.z, transformation, result);
    };
    /**
     * Sets the given vector "result" coordinates with the result of the transformation by the given matrix of the given floats (x, y, z)
     * This method computes tranformed coordinates only, not transformed direction vectors
     * @param x define the x coordinate of the source vector
     * @param y define the y coordinate of the source vector
     * @param z define the z coordinate of the source vector
     * @param transformation defines the transformation matrix
     * @param result defines the Vector3 where to store the result
     */
    Vector3.TransformCoordinatesFromFloatsToRef = function (x, y, z, transformation, result) {
        var m = transformation.m;
        var rx = x * m[0] + y * m[4] + z * m[8] + m[12];
        var ry = x * m[1] + y * m[5] + z * m[9] + m[13];
        var rz = x * m[2] + y * m[6] + z * m[10] + m[14];
        var rw = 1 / (x * m[3] + y * m[7] + z * m[11] + m[15]);
        result.x = rx * rw;
        result.y = ry * rw;
        result.z = rz * rw;
    };
    /**
     * Returns a new Vector3 set with the result of the normal transformation by the given matrix of the given vector
     * This methods computes transformed normalized direction vectors only (ie. it does not apply translation)
     * @param vector defines the Vector3 to transform
     * @param transformation defines the transformation matrix
     * @returns the new Vector3
     */
    Vector3.TransformNormal = function (vector, transformation) {
        var result = Vector3.Zero();
        Vector3.TransformNormalToRef(vector, transformation, result);
        return result;
    };
    /**
     * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given vector
     * This methods computes transformed normalized direction vectors only (ie. it does not apply translation)
     * @param vector defines the Vector3 to transform
     * @param transformation defines the transformation matrix
     * @param result defines the Vector3 where to store the result
     */
    Vector3.TransformNormalToRef = function (vector, transformation, result) {
        this.TransformNormalFromFloatsToRef(vector.x, vector.y, vector.z, transformation, result);
    };
    /**
     * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given floats (x, y, z)
     * This methods computes transformed normalized direction vectors only (ie. it does not apply translation)
     * @param x define the x coordinate of the source vector
     * @param y define the y coordinate of the source vector
     * @param z define the z coordinate of the source vector
     * @param transformation defines the transformation matrix
     * @param result defines the Vector3 where to store the result
     */
    Vector3.TransformNormalFromFloatsToRef = function (x, y, z, transformation, result) {
        var m = transformation.m;
        result.x = x * m[0] + y * m[4] + z * m[8];
        result.y = x * m[1] + y * m[5] + z * m[9];
        result.z = x * m[2] + y * m[6] + z * m[10];
    };
    /**
     * Returns a new Vector3 located for "amount" on the CatmullRom interpolation spline defined by the vectors "value1", "value2", "value3", "value4"
     * @param value1 defines the first control point
     * @param value2 defines the second control point
     * @param value3 defines the third control point
     * @param value4 defines the fourth control point
     * @param amount defines the amount on the spline to use
     * @returns the new Vector3
     */
    Vector3.CatmullRom = function (value1, value2, value3, value4, amount) {
        var squared = amount * amount;
        var cubed = amount * squared;
        var x = 0.5 * ((((2.0 * value2.x) + ((-value1.x + value3.x) * amount)) +
            (((((2.0 * value1.x) - (5.0 * value2.x)) + (4.0 * value3.x)) - value4.x) * squared)) +
            ((((-value1.x + (3.0 * value2.x)) - (3.0 * value3.x)) + value4.x) * cubed));
        var y = 0.5 * ((((2.0 * value2.y) + ((-value1.y + value3.y) * amount)) +
            (((((2.0 * value1.y) - (5.0 * value2.y)) + (4.0 * value3.y)) - value4.y) * squared)) +
            ((((-value1.y + (3.0 * value2.y)) - (3.0 * value3.y)) + value4.y) * cubed));
        var z = 0.5 * ((((2.0 * value2.z) + ((-value1.z + value3.z) * amount)) +
            (((((2.0 * value1.z) - (5.0 * value2.z)) + (4.0 * value3.z)) - value4.z) * squared)) +
            ((((-value1.z + (3.0 * value2.z)) - (3.0 * value3.z)) + value4.z) * cubed));
        return new Vector3(x, y, z);
    };
    /**
     * Returns a new Vector3 set with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max"
     * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
     * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
     * @param value defines the current value
     * @param min defines the lower range value
     * @param max defines the upper range value
     * @returns the new Vector3
     */
    Vector3.Clamp = function (value, min, max) {
        var v = new Vector3();
        Vector3.ClampToRef(value, min, max, v);
        return v;
    };
    /**
     * Sets the given vector "result" with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max"
     * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
     * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
     * @param value defines the current value
     * @param min defines the lower range value
     * @param max defines the upper range value
     * @param result defines the Vector3 where to store the result
     */
    Vector3.ClampToRef = function (value, min, max, result) {
        var x = value.x;
        x = (x > max.x) ? max.x : x;
        x = (x < min.x) ? min.x : x;
        var y = value.y;
        y = (y > max.y) ? max.y : y;
        y = (y < min.y) ? min.y : y;
        var z = value.z;
        z = (z > max.z) ? max.z : z;
        z = (z < min.z) ? min.z : z;
        result.copyFromFloats(x, y, z);
    };
    /**
     * Returns a new Vector3 located for "amount" (float) on the Hermite interpolation spline defined by the vectors "value1", "tangent1", "value2", "tangent2"
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent vector
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent vector
     * @param amount defines the amount on the interpolation spline (between 0 and 1)
     * @returns the new Vector3
     */
    Vector3.Hermite = function (value1, tangent1, value2, tangent2, amount) {
        var squared = amount * amount;
        var cubed = amount * squared;
        var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
        var part2 = (-2.0 * cubed) + (3.0 * squared);
        var part3 = (cubed - (2.0 * squared)) + amount;
        var part4 = cubed - squared;
        var x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
        var y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
        var z = (((value1.z * part1) + (value2.z * part2)) + (tangent1.z * part3)) + (tangent2.z * part4);
        return new Vector3(x, y, z);
    };
    /**
     * Returns a new Vector3 located for "amount" (float) on the linear interpolation between the vectors "start" and "end"
     * @param start defines the start value
     * @param end defines the end value
     * @param amount max defines amount between both (between 0 and 1)
     * @returns the new Vector3
     */
    Vector3.Lerp = function (start, end, amount) {
        var result = new Vector3(0, 0, 0);
        Vector3.LerpToRef(start, end, amount, result);
        return result;
    };
    /**
     * Sets the given vector "result" with the result of the linear interpolation from the vector "start" for "amount" to the vector "end"
     * @param start defines the start value
     * @param end defines the end value
     * @param amount max defines amount between both (between 0 and 1)
     * @param result defines the Vector3 where to store the result
     */
    Vector3.LerpToRef = function (start, end, amount, result) {
        result.x = start.x + ((end.x - start.x) * amount);
        result.y = start.y + ((end.y - start.y) * amount);
        result.z = start.z + ((end.z - start.z) * amount);
    };
    /**
     * Returns the dot product (float) between the vectors "left" and "right"
     * @param left defines the left operand
     * @param right defines the right operand
     * @returns the dot product
     */
    Vector3.Dot = function (left, right) {
        return (left.x * right.x + left.y * right.y + left.z * right.z);
    };
    /**
     * Returns a new Vector3 as the cross product of the vectors "left" and "right"
     * The cross product is then orthogonal to both "left" and "right"
     * @param left defines the left operand
     * @param right defines the right operand
     * @returns the cross product
     */
    Vector3.Cross = function (left, right) {
        var result = Vector3.Zero();
        Vector3.CrossToRef(left, right, result);
        return result;
    };
    /**
     * Sets the given vector "result" with the cross product of "left" and "right"
     * The cross product is then orthogonal to both "left" and "right"
     * @param left defines the left operand
     * @param right defines the right operand
     * @param result defines the Vector3 where to store the result
     */
    Vector3.CrossToRef = function (left, right, result) {
        var x = left.y * right.z - left.z * right.y;
        var y = left.z * right.x - left.x * right.z;
        var z = left.x * right.y - left.y * right.x;
        result.copyFromFloats(x, y, z);
    };
    /**
     * Returns a new Vector3 as the normalization of the given vector
     * @param vector defines the Vector3 to normalize
     * @returns the new Vector3
     */
    Vector3.Normalize = function (vector) {
        var result = Vector3.Zero();
        Vector3.NormalizeToRef(vector, result);
        return result;
    };
    /**
     * Sets the given vector "result" with the normalization of the given first vector
     * @param vector defines the Vector3 to normalize
     * @param result defines the Vector3 where to store the result
     */
    Vector3.NormalizeToRef = function (vector, result) {
        vector.normalizeToRef(result);
    };
    /**
     * Project a Vector3 onto screen space
     * @param vector defines the Vector3 to project
     * @param world defines the world matrix to use
     * @param transform defines the transform (view x projection) matrix to use
     * @param viewport defines the screen viewport to use
     * @returns the new Vector3
     */
    Vector3.Project = function (vector, world, transform, viewport) {
        var cw = viewport.width;
        var ch = viewport.height;
        var cx = viewport.x;
        var cy = viewport.y;
        var viewportMatrix = MathTmp.Matrix[1];
        Matrix.FromValuesToRef(cw / 2.0, 0, 0, 0, 0, -ch / 2.0, 0, 0, 0, 0, 0.5, 0, cx + cw / 2.0, ch / 2.0 + cy, 0.5, 1, viewportMatrix);
        var matrix = MathTmp.Matrix[0];
        world.multiplyToRef(transform, matrix);
        matrix.multiplyToRef(viewportMatrix, matrix);
        return Vector3.TransformCoordinates(vector, matrix);
    };
    /** @hidden */
    Vector3._UnprojectFromInvertedMatrixToRef = function (source, matrix, result) {
        Vector3.TransformCoordinatesToRef(source, matrix, result);
        var m = matrix.m;
        var num = source.x * m[3] + source.y * m[7] + source.z * m[11] + m[15];
        if (Scalar.WithinEpsilon(num, 1.0)) {
            result.scaleInPlace(1.0 / num);
        }
    };
    /**
     * Unproject from screen space to object space
     * @param source defines the screen space Vector3 to use
     * @param viewportWidth defines the current width of the viewport
     * @param viewportHeight defines the current height of the viewport
     * @param world defines the world matrix to use (can be set to Identity to go to world space)
     * @param transform defines the transform (view x projection) matrix to use
     * @returns the new Vector3
     */
    Vector3.UnprojectFromTransform = function (source, viewportWidth, viewportHeight, world, transform) {
        var matrix = MathTmp.Matrix[0];
        world.multiplyToRef(transform, matrix);
        matrix.invert();
        source.x = source.x / viewportWidth * 2 - 1;
        source.y = -(source.y / viewportHeight * 2 - 1);
        var vector = new Vector3();
        Vector3._UnprojectFromInvertedMatrixToRef(source, matrix, vector);
        return vector;
    };
    /**
     * Unproject from screen space to object space
     * @param source defines the screen space Vector3 to use
     * @param viewportWidth defines the current width of the viewport
     * @param viewportHeight defines the current height of the viewport
     * @param world defines the world matrix to use (can be set to Identity to go to world space)
     * @param view defines the view matrix to use
     * @param projection defines the projection matrix to use
     * @returns the new Vector3
     */
    Vector3.Unproject = function (source, viewportWidth, viewportHeight, world, view, projection) {
        var result = Vector3.Zero();
        Vector3.UnprojectToRef(source, viewportWidth, viewportHeight, world, view, projection, result);
        return result;
    };
    /**
     * Unproject from screen space to object space
     * @param source defines the screen space Vector3 to use
     * @param viewportWidth defines the current width of the viewport
     * @param viewportHeight defines the current height of the viewport
     * @param world defines the world matrix to use (can be set to Identity to go to world space)
     * @param view defines the view matrix to use
     * @param projection defines the projection matrix to use
     * @param result defines the Vector3 where to store the result
     */
    Vector3.UnprojectToRef = function (source, viewportWidth, viewportHeight, world, view, projection, result) {
        Vector3.UnprojectFloatsToRef(source.x, source.y, source.z, viewportWidth, viewportHeight, world, view, projection, result);
    };
    /**
     * Unproject from screen space to object space
     * @param sourceX defines the screen space x coordinate to use
     * @param sourceY defines the screen space y coordinate to use
     * @param sourceZ defines the screen space z coordinate to use
     * @param viewportWidth defines the current width of the viewport
     * @param viewportHeight defines the current height of the viewport
     * @param world defines the world matrix to use (can be set to Identity to go to world space)
     * @param view defines the view matrix to use
     * @param projection defines the projection matrix to use
     * @param result defines the Vector3 where to store the result
     */
    Vector3.UnprojectFloatsToRef = function (sourceX, sourceY, sourceZ, viewportWidth, viewportHeight, world, view, projection, result) {
        var matrix = MathTmp.Matrix[0];
        world.multiplyToRef(view, matrix);
        matrix.multiplyToRef(projection, matrix);
        matrix.invert();
        var screenSource = MathTmp.Vector3[0];
        screenSource.x = sourceX / viewportWidth * 2 - 1;
        screenSource.y = -(sourceY / viewportHeight * 2 - 1);
        screenSource.z = 2 * sourceZ - 1.0;
        Vector3._UnprojectFromInvertedMatrixToRef(screenSource, matrix, result);
    };
    /**
     * Gets the minimal coordinate values between two Vector3
     * @param left defines the first operand
     * @param right defines the second operand
     * @returns the new Vector3
     */
    Vector3.Minimize = function (left, right) {
        var min = left.clone();
        min.minimizeInPlace(right);
        return min;
    };
    /**
     * Gets the maximal coordinate values between two Vector3
     * @param left defines the first operand
     * @param right defines the second operand
     * @returns the new Vector3
     */
    Vector3.Maximize = function (left, right) {
        var max = left.clone();
        max.maximizeInPlace(right);
        return max;
    };
    /**
     * Returns the distance between the vectors "value1" and "value2"
     * @param value1 defines the first operand
     * @param value2 defines the second operand
     * @returns the distance
     */
    Vector3.Distance = function (value1, value2) {
        return Math.sqrt(Vector3.DistanceSquared(value1, value2));
    };
    /**
     * Returns the squared distance between the vectors "value1" and "value2"
     * @param value1 defines the first operand
     * @param value2 defines the second operand
     * @returns the squared distance
     */
    Vector3.DistanceSquared = function (value1, value2) {
        var x = value1.x - value2.x;
        var y = value1.y - value2.y;
        var z = value1.z - value2.z;
        return (x * x) + (y * y) + (z * z);
    };
    /**
     * Returns a new Vector3 located at the center between "value1" and "value2"
     * @param value1 defines the first operand
     * @param value2 defines the second operand
     * @returns the new Vector3
     */
    Vector3.Center = function (value1, value2) {
        var center = value1.add(value2);
        center.scaleInPlace(0.5);
        return center;
    };
    /**
     * Given three orthogonal normalized left-handed oriented Vector3 axis in space (target system),
     * RotationFromAxis() returns the rotation Euler angles (ex : rotation.x, rotation.y, rotation.z) to apply
     * to something in order to rotate it from its local system to the given target system
     * Note: axis1, axis2 and axis3 are normalized during this operation
     * @param axis1 defines the first axis
     * @param axis2 defines the second axis
     * @param axis3 defines the third axis
     * @returns a new Vector3
     */
    Vector3.RotationFromAxis = function (axis1, axis2, axis3) {
        var rotation = Vector3.Zero();
        Vector3.RotationFromAxisToRef(axis1, axis2, axis3, rotation);
        return rotation;
    };
    /**
     * The same than RotationFromAxis but updates the given ref Vector3 parameter instead of returning a new Vector3
     * @param axis1 defines the first axis
     * @param axis2 defines the second axis
     * @param axis3 defines the third axis
     * @param ref defines the Vector3 where to store the result
     */
    Vector3.RotationFromAxisToRef = function (axis1, axis2, axis3, ref) {
        var quat = MathTmp.Quaternion[0];
        Quaternion.RotationQuaternionFromAxisToRef(axis1, axis2, axis3, quat);
        quat.toEulerAnglesToRef(ref);
    };
    Vector3._UpReadOnly = Vector3.Up();
    return Vector3;
}());

/**
 * Vector4 class created for EulerAngle class conversion to Quaternion
 */
var Vector4 = /** @class */ (function () {
    /**
     * Creates a Vector4 object from the given floats.
     * @param x x value of the vector
     * @param y y value of the vector
     * @param z z value of the vector
     * @param w w value of the vector
     */
    function Vector4(
    /** x value of the vector */
    x, 
    /** y value of the vector */
    y, 
    /** z value of the vector */
    z, 
    /** w value of the vector */
    w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /**
     * Returns the string with the Vector4 coordinates.
     * @returns a string containing all the vector values
     */
    Vector4.prototype.toString = function () {
        return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + " W:" + this.w + "}";
    };
    /**
     * Returns the string "Vector4".
     * @returns "Vector4"
     */
    Vector4.prototype.getClassName = function () {
        return "Vector4";
    };
    /**
     * Returns the Vector4 hash code.
     * @returns a unique hash code
     */
    Vector4.prototype.getHashCode = function () {
        var hash = this.x || 0;
        hash = (hash * 397) ^ (this.y || 0);
        hash = (hash * 397) ^ (this.z || 0);
        hash = (hash * 397) ^ (this.w || 0);
        return hash;
    };
    // Operators
    /**
     * Returns a new array populated with 4 elements : the Vector4 coordinates.
     * @returns the resulting array
     */
    Vector4.prototype.asArray = function () {
        var result = new Array();
        this.toArray(result, 0);
        return result;
    };
    /**
     * Populates the given array from the given index with the Vector4 coordinates.
     * @param array array to populate
     * @param index index of the array to start at (default: 0)
     * @returns the Vector4.
     */
    Vector4.prototype.toArray = function (array, index) {
        if (index === undefined) {
            index = 0;
        }
        array[index] = this.x;
        array[index + 1] = this.y;
        array[index + 2] = this.z;
        array[index + 3] = this.w;
        return this;
    };
    /**
     * Adds the given vector to the current Vector4.
     * @param otherVector the vector to add
     * @returns the updated Vector4.
     */
    Vector4.prototype.addInPlace = function (otherVector) {
        this.x += otherVector.x;
        this.y += otherVector.y;
        this.z += otherVector.z;
        this.w += otherVector.w;
        return this;
    };
    /**
     * Returns a new Vector4 as the result of the addition of the current Vector4 and the given one.
     * @param otherVector the vector to add
     * @returns the resulting vector
     */
    Vector4.prototype.add = function (otherVector) {
        return new Vector4(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z, this.w + otherVector.w);
    };
    /**
     * Updates the given vector "result" with the result of the addition of the current Vector4 and the given one.
     * @param otherVector the vector to add
     * @param result the vector to store the result
     * @returns the current Vector4.
     */
    Vector4.prototype.addToRef = function (otherVector, result) {
        result.x = this.x + otherVector.x;
        result.y = this.y + otherVector.y;
        result.z = this.z + otherVector.z;
        result.w = this.w + otherVector.w;
        return this;
    };
    /**
     * Subtract in place the given vector from the current Vector4.
     * @param otherVector the vector to subtract
     * @returns the updated Vector4.
     */
    Vector4.prototype.subtractInPlace = function (otherVector) {
        this.x -= otherVector.x;
        this.y -= otherVector.y;
        this.z -= otherVector.z;
        this.w -= otherVector.w;
        return this;
    };
    /**
     * Returns a new Vector4 with the result of the subtraction of the given vector from the current Vector4.
     * @param otherVector the vector to add
     * @returns the new vector with the result
     */
    Vector4.prototype.subtract = function (otherVector) {
        return new Vector4(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z, this.w - otherVector.w);
    };
    /**
     * Sets the given vector "result" with the result of the subtraction of the given vector from the current Vector4.
     * @param otherVector the vector to subtract
     * @param result the vector to store the result
     * @returns the current Vector4.
     */
    Vector4.prototype.subtractToRef = function (otherVector, result) {
        result.x = this.x - otherVector.x;
        result.y = this.y - otherVector.y;
        result.z = this.z - otherVector.z;
        result.w = this.w - otherVector.w;
        return this;
    };
    /**
     * Returns a new Vector4 set with the result of the subtraction of the given floats from the current Vector4 coordinates.
     */
    /**
     * Returns a new Vector4 set with the result of the subtraction of the given floats from the current Vector4 coordinates.
     * @param x value to subtract
     * @param y value to subtract
     * @param z value to subtract
     * @param w value to subtract
     * @returns new vector containing the result
     */
    Vector4.prototype.subtractFromFloats = function (x, y, z, w) {
        return new Vector4(this.x - x, this.y - y, this.z - z, this.w - w);
    };
    /**
     * Sets the given vector "result" set with the result of the subtraction of the given floats from the current Vector4 coordinates.
     * @param x value to subtract
     * @param y value to subtract
     * @param z value to subtract
     * @param w value to subtract
     * @param result the vector to store the result in
     * @returns the current Vector4.
     */
    Vector4.prototype.subtractFromFloatsToRef = function (x, y, z, w, result) {
        result.x = this.x - x;
        result.y = this.y - y;
        result.z = this.z - z;
        result.w = this.w - w;
        return this;
    };
    /**
     * Returns a new Vector4 set with the current Vector4 negated coordinates.
     * @returns a new vector with the negated values
     */
    Vector4.prototype.negate = function () {
        return new Vector4(-this.x, -this.y, -this.z, -this.w);
    };
    /**
     * Multiplies the current Vector4 coordinates by scale (float).
     * @param scale the number to scale with
     * @returns the updated Vector4.
     */
    Vector4.prototype.scaleInPlace = function (scale) {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        this.w *= scale;
        return this;
    };
    /**
     * Returns a new Vector4 set with the current Vector4 coordinates multiplied by scale (float).
     * @param scale the number to scale with
     * @returns a new vector with the result
     */
    Vector4.prototype.scale = function (scale) {
        return new Vector4(this.x * scale, this.y * scale, this.z * scale, this.w * scale);
    };
    /**
     * Sets the given vector "result" with the current Vector4 coordinates multiplied by scale (float).
     * @param scale the number to scale with
     * @param result a vector to store the result in
     * @returns the current Vector4.
     */
    Vector4.prototype.scaleToRef = function (scale, result) {
        result.x = this.x * scale;
        result.y = this.y * scale;
        result.z = this.z * scale;
        result.w = this.w * scale;
        return this;
    };
    /**
     * Scale the current Vector4 values by a factor and add the result to a given Vector4
     * @param scale defines the scale factor
     * @param result defines the Vector4 object where to store the result
     * @returns the unmodified current Vector4
     */
    Vector4.prototype.scaleAndAddToRef = function (scale, result) {
        result.x += this.x * scale;
        result.y += this.y * scale;
        result.z += this.z * scale;
        result.w += this.w * scale;
        return this;
    };
    /**
     * Boolean : True if the current Vector4 coordinates are stricly equal to the given ones.
     * @param otherVector the vector to compare against
     * @returns true if they are equal
     */
    Vector4.prototype.equals = function (otherVector) {
        return otherVector && this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z && this.w === otherVector.w;
    };
    /**
     * Boolean : True if the current Vector4 coordinates are each beneath the distance "epsilon" from the given vector ones.
     * @param otherVector vector to compare against
     * @param epsilon (Default: very small number)
     * @returns true if they are equal
     */
    Vector4.prototype.equalsWithEpsilon = function (otherVector, epsilon) {
        if (epsilon === void 0) { epsilon = Epsilon; }
        return otherVector
            && Scalar.WithinEpsilon(this.x, otherVector.x, epsilon)
            && Scalar.WithinEpsilon(this.y, otherVector.y, epsilon)
            && Scalar.WithinEpsilon(this.z, otherVector.z, epsilon)
            && Scalar.WithinEpsilon(this.w, otherVector.w, epsilon);
    };
    /**
     * Boolean : True if the given floats are strictly equal to the current Vector4 coordinates.
     * @param x x value to compare against
     * @param y y value to compare against
     * @param z z value to compare against
     * @param w w value to compare against
     * @returns true if equal
     */
    Vector4.prototype.equalsToFloats = function (x, y, z, w) {
        return this.x === x && this.y === y && this.z === z && this.w === w;
    };
    /**
     * Multiplies in place the current Vector4 by the given one.
     * @param otherVector vector to multiple with
     * @returns the updated Vector4.
     */
    Vector4.prototype.multiplyInPlace = function (otherVector) {
        this.x *= otherVector.x;
        this.y *= otherVector.y;
        this.z *= otherVector.z;
        this.w *= otherVector.w;
        return this;
    };
    /**
     * Returns a new Vector4 set with the multiplication result of the current Vector4 and the given one.
     * @param otherVector vector to multiple with
     * @returns resulting new vector
     */
    Vector4.prototype.multiply = function (otherVector) {
        return new Vector4(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z, this.w * otherVector.w);
    };
    /**
     * Updates the given vector "result" with the multiplication result of the current Vector4 and the given one.
     * @param otherVector vector to multiple with
     * @param result vector to store the result
     * @returns the current Vector4.
     */
    Vector4.prototype.multiplyToRef = function (otherVector, result) {
        result.x = this.x * otherVector.x;
        result.y = this.y * otherVector.y;
        result.z = this.z * otherVector.z;
        result.w = this.w * otherVector.w;
        return this;
    };
    /**
     * Returns a new Vector4 set with the multiplication result of the given floats and the current Vector4 coordinates.
     * @param x x value multiply with
     * @param y y value multiply with
     * @param z z value multiply with
     * @param w w value multiply with
     * @returns resulting new vector
     */
    Vector4.prototype.multiplyByFloats = function (x, y, z, w) {
        return new Vector4(this.x * x, this.y * y, this.z * z, this.w * w);
    };
    /**
     * Returns a new Vector4 set with the division result of the current Vector4 by the given one.
     * @param otherVector vector to devide with
     * @returns resulting new vector
     */
    Vector4.prototype.divide = function (otherVector) {
        return new Vector4(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z, this.w / otherVector.w);
    };
    /**
     * Updates the given vector "result" with the division result of the current Vector4 by the given one.
     * @param otherVector vector to devide with
     * @param result vector to store the result
     * @returns the current Vector4.
     */
    Vector4.prototype.divideToRef = function (otherVector, result) {
        result.x = this.x / otherVector.x;
        result.y = this.y / otherVector.y;
        result.z = this.z / otherVector.z;
        result.w = this.w / otherVector.w;
        return this;
    };
    /**
     * Divides the current Vector3 coordinates by the given ones.
     * @param otherVector vector to devide with
     * @returns the updated Vector3.
     */
    Vector4.prototype.divideInPlace = function (otherVector) {
        return this.divideToRef(otherVector, this);
    };
    /**
     * Updates the Vector4 coordinates with the minimum values between its own and the given vector ones
     * @param other defines the second operand
     * @returns the current updated Vector4
     */
    Vector4.prototype.minimizeInPlace = function (other) {
        if (other.x < this.x) {
            this.x = other.x;
        }
        if (other.y < this.y) {
            this.y = other.y;
        }
        if (other.z < this.z) {
            this.z = other.z;
        }
        if (other.w < this.w) {
            this.w = other.w;
        }
        return this;
    };
    /**
     * Updates the Vector4 coordinates with the maximum values between its own and the given vector ones
     * @param other defines the second operand
     * @returns the current updated Vector4
     */
    Vector4.prototype.maximizeInPlace = function (other) {
        if (other.x > this.x) {
            this.x = other.x;
        }
        if (other.y > this.y) {
            this.y = other.y;
        }
        if (other.z > this.z) {
            this.z = other.z;
        }
        if (other.w > this.w) {
            this.w = other.w;
        }
        return this;
    };
    /**
     * Gets a new Vector4 from current Vector4 floored values
     * @returns a new Vector4
     */
    Vector4.prototype.floor = function () {
        return new Vector4(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z), Math.floor(this.w));
    };
    /**
     * Gets a new Vector4 from current Vector3 floored values
     * @returns a new Vector4
     */
    Vector4.prototype.fract = function () {
        return new Vector4(this.x - Math.floor(this.x), this.y - Math.floor(this.y), this.z - Math.floor(this.z), this.w - Math.floor(this.w));
    };
    // Properties
    /**
     * Returns the Vector4 length (float).
     * @returns the length
     */
    Vector4.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    };
    /**
     * Returns the Vector4 squared length (float).
     * @returns the length squared
     */
    Vector4.prototype.lengthSquared = function () {
        return (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    };
    // Methods
    /**
     * Normalizes in place the Vector4.
     * @returns the updated Vector4.
     */
    Vector4.prototype.normalize = function () {
        var len = this.length();
        if (len === 0) {
            return this;
        }
        return this.scaleInPlace(1.0 / len);
    };
    /**
     * Returns a new Vector3 from the Vector4 (x, y, z) coordinates.
     * @returns this converted to a new vector3
     */
    Vector4.prototype.toVector3 = function () {
        return new Vector3(this.x, this.y, this.z);
    };
    /**
     * Returns a new Vector4 copied from the current one.
     * @returns the new cloned vector
     */
    Vector4.prototype.clone = function () {
        return new Vector4(this.x, this.y, this.z, this.w);
    };
    /**
     * Updates the current Vector4 with the given one coordinates.
     * @param source the source vector to copy from
     * @returns the updated Vector4.
     */
    Vector4.prototype.copyFrom = function (source) {
        this.x = source.x;
        this.y = source.y;
        this.z = source.z;
        this.w = source.w;
        return this;
    };
    /**
     * Updates the current Vector4 coordinates with the given floats.
     * @param x float to copy from
     * @param y float to copy from
     * @param z float to copy from
     * @param w float to copy from
     * @returns the updated Vector4.
     */
    Vector4.prototype.copyFromFloats = function (x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    };
    /**
     * Updates the current Vector4 coordinates with the given floats.
     * @param x float to set from
     * @param y float to set from
     * @param z float to set from
     * @param w float to set from
     * @returns the updated Vector4.
     */
    Vector4.prototype.set = function (x, y, z, w) {
        return this.copyFromFloats(x, y, z, w);
    };
    /**
     * Copies the given float to the current Vector3 coordinates
     * @param v defines the x, y, z and w coordinates of the operand
     * @returns the current updated Vector3
     */
    Vector4.prototype.setAll = function (v) {
        this.x = this.y = this.z = this.w = v;
        return this;
    };
    // Statics
    /**
     * Returns a new Vector4 set from the starting index of the given array.
     * @param array the array to pull values from
     * @param offset the offset into the array to start at
     * @returns the new vector
     */
    Vector4.FromArray = function (array, offset) {
        if (!offset) {
            offset = 0;
        }
        return new Vector4(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
    };
    /**
     * Updates the given vector "result" from the starting index of the given array.
     * @param array the array to pull values from
     * @param offset the offset into the array to start at
     * @param result the vector to store the result in
     */
    Vector4.FromArrayToRef = function (array, offset, result) {
        result.x = array[offset];
        result.y = array[offset + 1];
        result.z = array[offset + 2];
        result.w = array[offset + 3];
    };
    /**
     * Updates the given vector "result" from the starting index of the given Float32Array.
     * @param array the array to pull values from
     * @param offset the offset into the array to start at
     * @param result the vector to store the result in
     */
    Vector4.FromFloatArrayToRef = function (array, offset, result) {
        Vector4.FromArrayToRef(array, offset, result);
    };
    /**
     * Updates the given vector "result" coordinates from the given floats.
     * @param x float to set from
     * @param y float to set from
     * @param z float to set from
     * @param w float to set from
     * @param result the vector to the floats in
     */
    Vector4.FromFloatsToRef = function (x, y, z, w, result) {
        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
    };
    /**
     * Returns a new Vector4 set to (0.0, 0.0, 0.0, 0.0)
     * @returns the new vector
     */
    Vector4.Zero = function () {
        return new Vector4(0.0, 0.0, 0.0, 0.0);
    };
    /**
     * Returns a new Vector4 set to (1.0, 1.0, 1.0, 1.0)
     * @returns the new vector
     */
    Vector4.One = function () {
        return new Vector4(1.0, 1.0, 1.0, 1.0);
    };
    /**
     * Returns a new normalized Vector4 from the given one.
     * @param vector the vector to normalize
     * @returns the vector
     */
    Vector4.Normalize = function (vector) {
        var result = Vector4.Zero();
        Vector4.NormalizeToRef(vector, result);
        return result;
    };
    /**
     * Updates the given vector "result" from the normalization of the given one.
     * @param vector the vector to normalize
     * @param result the vector to store the result in
     */
    Vector4.NormalizeToRef = function (vector, result) {
        result.copyFrom(vector);
        result.normalize();
    };
    /**
     * Returns a vector with the minimum values from the left and right vectors
     * @param left left vector to minimize
     * @param right right vector to minimize
     * @returns a new vector with the minimum of the left and right vector values
     */
    Vector4.Minimize = function (left, right) {
        var min = left.clone();
        min.minimizeInPlace(right);
        return min;
    };
    /**
     * Returns a vector with the maximum values from the left and right vectors
     * @param left left vector to maximize
     * @param right right vector to maximize
     * @returns a new vector with the maximum of the left and right vector values
     */
    Vector4.Maximize = function (left, right) {
        var max = left.clone();
        max.maximizeInPlace(right);
        return max;
    };
    /**
     * Returns the distance (float) between the vectors "value1" and "value2".
     * @param value1 value to calulate the distance between
     * @param value2 value to calulate the distance between
     * @return the distance between the two vectors
     */
    Vector4.Distance = function (value1, value2) {
        return Math.sqrt(Vector4.DistanceSquared(value1, value2));
    };
    /**
     * Returns the squared distance (float) between the vectors "value1" and "value2".
     * @param value1 value to calulate the distance between
     * @param value2 value to calulate the distance between
     * @return the distance between the two vectors squared
     */
    Vector4.DistanceSquared = function (value1, value2) {
        var x = value1.x - value2.x;
        var y = value1.y - value2.y;
        var z = value1.z - value2.z;
        var w = value1.w - value2.w;
        return (x * x) + (y * y) + (z * z) + (w * w);
    };
    /**
     * Returns a new Vector4 located at the center between the vectors "value1" and "value2".
     * @param value1 value to calulate the center between
     * @param value2 value to calulate the center between
     * @return the center between the two vectors
     */
    Vector4.Center = function (value1, value2) {
        var center = value1.add(value2);
        center.scaleInPlace(0.5);
        return center;
    };
    /**
     * Returns a new Vector4 set with the result of the normal transformation by the given matrix of the given vector.
     * This methods computes transformed normalized direction vectors only.
     * @param vector the vector to transform
     * @param transformation the transformation matrix to apply
     * @returns the new vector
     */
    Vector4.TransformNormal = function (vector, transformation) {
        var result = Vector4.Zero();
        Vector4.TransformNormalToRef(vector, transformation, result);
        return result;
    };
    /**
     * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given vector.
     * This methods computes transformed normalized direction vectors only.
     * @param vector the vector to transform
     * @param transformation the transformation matrix to apply
     * @param result the vector to store the result in
     */
    Vector4.TransformNormalToRef = function (vector, transformation, result) {
        var m = transformation.m;
        var x = (vector.x * m[0]) + (vector.y * m[4]) + (vector.z * m[8]);
        var y = (vector.x * m[1]) + (vector.y * m[5]) + (vector.z * m[9]);
        var z = (vector.x * m[2]) + (vector.y * m[6]) + (vector.z * m[10]);
        result.x = x;
        result.y = y;
        result.z = z;
        result.w = vector.w;
    };
    /**
     * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given floats (x, y, z, w).
     * This methods computes transformed normalized direction vectors only.
     * @param x value to transform
     * @param y value to transform
     * @param z value to transform
     * @param w value to transform
     * @param transformation the transformation matrix to apply
     * @param result the vector to store the results in
     */
    Vector4.TransformNormalFromFloatsToRef = function (x, y, z, w, transformation, result) {
        var m = transformation.m;
        result.x = (x * m[0]) + (y * m[4]) + (z * m[8]);
        result.y = (x * m[1]) + (y * m[5]) + (z * m[9]);
        result.z = (x * m[2]) + (y * m[6]) + (z * m[10]);
        result.w = w;
    };
    /**
     * Creates a new Vector4 from a Vector3
     * @param source defines the source data
     * @param w defines the 4th component (default is 0)
     * @returns a new Vector4
     */
    Vector4.FromVector3 = function (source, w) {
        if (w === void 0) { w = 0; }
        return new Vector4(source.x, source.y, source.z, w);
    };
    return Vector4;
}());

/**
 * Size containing widht and height
 */
var Size = /** @class */ (function () {
    /**
     * Creates a Size object from the given width and height (floats).
     * @param width width of the new size
     * @param height height of the new size
     */
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    /**
     * Returns a string with the Size width and height
     * @returns a string with the Size width and height
     */
    Size.prototype.toString = function () {
        return "{W: " + this.width + ", H: " + this.height + "}";
    };
    /**
     * "Size"
     * @returns the string "Size"
     */
    Size.prototype.getClassName = function () {
        return "Size";
    };
    /**
     * Returns the Size hash code.
     * @returns a hash code for a unique width and height
     */
    Size.prototype.getHashCode = function () {
        var hash = this.width || 0;
        hash = (hash * 397) ^ (this.height || 0);
        return hash;
    };
    /**
     * Updates the current size from the given one.
     * @param src the given size
     */
    Size.prototype.copyFrom = function (src) {
        this.width = src.width;
        this.height = src.height;
    };
    /**
     * Updates in place the current Size from the given floats.
     * @param width width of the new size
     * @param height height of the new size
     * @returns the updated Size.
     */
    Size.prototype.copyFromFloats = function (width, height) {
        this.width = width;
        this.height = height;
        return this;
    };
    /**
     * Updates in place the current Size from the given floats.
     * @param width width to set
     * @param height height to set
     * @returns the updated Size.
     */
    Size.prototype.set = function (width, height) {
        return this.copyFromFloats(width, height);
    };
    /**
     * Multiplies the width and height by numbers
     * @param w factor to multiple the width by
     * @param h factor to multiple the height by
     * @returns a new Size set with the multiplication result of the current Size and the given floats.
     */
    Size.prototype.multiplyByFloats = function (w, h) {
        return new Size(this.width * w, this.height * h);
    };
    /**
     * Clones the size
     * @returns a new Size copied from the given one.
     */
    Size.prototype.clone = function () {
        return new Size(this.width, this.height);
    };
    /**
     * True if the current Size and the given one width and height are strictly equal.
     * @param other the other size to compare against
     * @returns True if the current Size and the given one width and height are strictly equal.
     */
    Size.prototype.equals = function (other) {
        if (!other) {
            return false;
        }
        return (this.width === other.width) && (this.height === other.height);
    };
    Object.defineProperty(Size.prototype, "surface", {
        /**
         * The surface of the Size : width * height (float).
         */
        get: function () {
            return this.width * this.height;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Create a new size of zero
     * @returns a new Size set to (0.0, 0.0)
     */
    Size.Zero = function () {
        return new Size(0.0, 0.0);
    };
    /**
     * Sums the width and height of two sizes
     * @param otherSize size to add to this size
     * @returns a new Size set as the addition result of the current Size and the given one.
     */
    Size.prototype.add = function (otherSize) {
        var r = new Size(this.width + otherSize.width, this.height + otherSize.height);
        return r;
    };
    /**
     * Subtracts the width and height of two
     * @param otherSize size to subtract to this size
     * @returns a new Size set as the subtraction result of  the given one from the current Size.
     */
    Size.prototype.subtract = function (otherSize) {
        var r = new Size(this.width - otherSize.width, this.height - otherSize.height);
        return r;
    };
    /**
     * Creates a new Size set at the linear interpolation "amount" between "start" and "end"
     * @param start starting size to lerp between
     * @param end end size to lerp between
     * @param amount amount to lerp between the start and end values
     * @returns a new Size set at the linear interpolation "amount" between "start" and "end"
     */
    Size.Lerp = function (start, end, amount) {
        var w = start.width + ((end.width - start.width) * amount);
        var h = start.height + ((end.height - start.height) * amount);
        return new Size(w, h);
    };
    return Size;
}());

/**
 * Class used to store quaternion data
 * @see https://en.wikipedia.org/wiki/Quaternion
 * @see http://doc.babylonjs.com/features/position,_rotation,_scaling
 */
var Quaternion = /** @class */ (function () {
    /**
     * Creates a new Quaternion from the given floats
     * @param x defines the first component (0 by default)
     * @param y defines the second component (0 by default)
     * @param z defines the third component (0 by default)
     * @param w defines the fourth component (1.0 by default)
     */
    function Quaternion(
    /** defines the first component (0 by default) */
    x, 
    /** defines the second component (0 by default) */
    y, 
    /** defines the third component (0 by default) */
    z, 
    /** defines the fourth component (1.0 by default) */
    w) {
        if (x === void 0) { x = 0.0; }
        if (y === void 0) { y = 0.0; }
        if (z === void 0) { z = 0.0; }
        if (w === void 0) { w = 1.0; }
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /**
     * Gets a string representation for the current quaternion
     * @returns a string with the Quaternion coordinates
     */
    Quaternion.prototype.toString = function () {
        return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + " W:" + this.w + "}";
    };
    /**
     * Gets the class name of the quaternion
     * @returns the string "Quaternion"
     */
    Quaternion.prototype.getClassName = function () {
        return "Quaternion";
    };
    /**
     * Gets a hash code for this quaternion
     * @returns the quaternion hash code
     */
    Quaternion.prototype.getHashCode = function () {
        var hash = this.x || 0;
        hash = (hash * 397) ^ (this.y || 0);
        hash = (hash * 397) ^ (this.z || 0);
        hash = (hash * 397) ^ (this.w || 0);
        return hash;
    };
    /**
     * Copy the quaternion to an array
     * @returns a new array populated with 4 elements from the quaternion coordinates
     */
    Quaternion.prototype.asArray = function () {
        return [this.x, this.y, this.z, this.w];
    };
    /**
     * Check if two quaternions are equals
     * @param otherQuaternion defines the second operand
     * @return true if the current quaternion and the given one coordinates are strictly equals
     */
    Quaternion.prototype.equals = function (otherQuaternion) {
        return otherQuaternion && this.x === otherQuaternion.x && this.y === otherQuaternion.y && this.z === otherQuaternion.z && this.w === otherQuaternion.w;
    };
    /**
     * Clone the current quaternion
     * @returns a new quaternion copied from the current one
     */
    Quaternion.prototype.clone = function () {
        return new Quaternion(this.x, this.y, this.z, this.w);
    };
    /**
     * Copy a quaternion to the current one
     * @param other defines the other quaternion
     * @returns the updated current quaternion
     */
    Quaternion.prototype.copyFrom = function (other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        this.w = other.w;
        return this;
    };
    /**
     * Updates the current quaternion with the given float coordinates
     * @param x defines the x coordinate
     * @param y defines the y coordinate
     * @param z defines the z coordinate
     * @param w defines the w coordinate
     * @returns the updated current quaternion
     */
    Quaternion.prototype.copyFromFloats = function (x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    };
    /**
     * Updates the current quaternion from the given float coordinates
     * @param x defines the x coordinate
     * @param y defines the y coordinate
     * @param z defines the z coordinate
     * @param w defines the w coordinate
     * @returns the updated current quaternion
     */
    Quaternion.prototype.set = function (x, y, z, w) {
        return this.copyFromFloats(x, y, z, w);
    };
    /**
     * Adds two quaternions
     * @param other defines the second operand
     * @returns a new quaternion as the addition result of the given one and the current quaternion
     */
    Quaternion.prototype.add = function (other) {
        return new Quaternion(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);
    };
    /**
     * Add a quaternion to the current one
     * @param other defines the quaternion to add
     * @returns the current quaternion
     */
    Quaternion.prototype.addInPlace = function (other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        this.w += other.w;
        return this;
    };
    /**
     * Subtract two quaternions
     * @param other defines the second operand
     * @returns a new quaternion as the subtraction result of the given one from the current one
     */
    Quaternion.prototype.subtract = function (other) {
        return new Quaternion(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w);
    };
    /**
     * Multiplies the current quaternion by a scale factor
     * @param value defines the scale factor
     * @returns a new quaternion set by multiplying the current quaternion coordinates by the float "scale"
     */
    Quaternion.prototype.scale = function (value) {
        return new Quaternion(this.x * value, this.y * value, this.z * value, this.w * value);
    };
    /**
     * Scale the current quaternion values by a factor and stores the result to a given quaternion
     * @param scale defines the scale factor
     * @param result defines the Quaternion object where to store the result
     * @returns the unmodified current quaternion
     */
    Quaternion.prototype.scaleToRef = function (scale, result) {
        result.x = this.x * scale;
        result.y = this.y * scale;
        result.z = this.z * scale;
        result.w = this.w * scale;
        return this;
    };
    /**
     * Multiplies in place the current quaternion by a scale factor
     * @param value defines the scale factor
     * @returns the current modified quaternion
     */
    Quaternion.prototype.scaleInPlace = function (value) {
        this.x *= value;
        this.y *= value;
        this.z *= value;
        this.w *= value;
        return this;
    };
    /**
     * Scale the current quaternion values by a factor and add the result to a given quaternion
     * @param scale defines the scale factor
     * @param result defines the Quaternion object where to store the result
     * @returns the unmodified current quaternion
     */
    Quaternion.prototype.scaleAndAddToRef = function (scale, result) {
        result.x += this.x * scale;
        result.y += this.y * scale;
        result.z += this.z * scale;
        result.w += this.w * scale;
        return this;
    };
    /**
     * Multiplies two quaternions
     * @param q1 defines the second operand
     * @returns a new quaternion set as the multiplication result of the current one with the given one "q1"
     */
    Quaternion.prototype.multiply = function (q1) {
        var result = new Quaternion(0, 0, 0, 1.0);
        this.multiplyToRef(q1, result);
        return result;
    };
    /**
     * Sets the given "result" as the the multiplication result of the current one with the given one "q1"
     * @param q1 defines the second operand
     * @param result defines the target quaternion
     * @returns the current quaternion
     */
    Quaternion.prototype.multiplyToRef = function (q1, result) {
        var x = this.x * q1.w + this.y * q1.z - this.z * q1.y + this.w * q1.x;
        var y = -this.x * q1.z + this.y * q1.w + this.z * q1.x + this.w * q1.y;
        var z = this.x * q1.y - this.y * q1.x + this.z * q1.w + this.w * q1.z;
        var w = -this.x * q1.x - this.y * q1.y - this.z * q1.z + this.w * q1.w;
        result.copyFromFloats(x, y, z, w);
        return this;
    };
    /**
     * Updates the current quaternion with the multiplication of itself with the given one "q1"
     * @param q1 defines the second operand
     * @returns the currentupdated quaternion
     */
    Quaternion.prototype.multiplyInPlace = function (q1) {
        this.multiplyToRef(q1, this);
        return this;
    };
    /**
     * Conjugates (1-q) the current quaternion and stores the result in the given quaternion
     * @param ref defines the target quaternion
     * @returns the current quaternion
     */
    Quaternion.prototype.conjugateToRef = function (ref) {
        ref.copyFromFloats(-this.x, -this.y, -this.z, this.w);
        return this;
    };
    /**
     * Conjugates in place (1-q) the current quaternion
     * @returns the current updated quaternion
     */
    Quaternion.prototype.conjugateInPlace = function () {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    };
    /**
     * Conjugates in place (1-q) the current quaternion
     * @returns a new quaternion
     */
    Quaternion.prototype.conjugate = function () {
        var result = new Quaternion(-this.x, -this.y, -this.z, this.w);
        return result;
    };
    /**
     * Gets length of current quaternion
     * @returns the quaternion length (float)
     */
    Quaternion.prototype.length = function () {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
    };
    /**
     * Normalize in place the current quaternion
     * @returns the current updated quaternion
     */
    Quaternion.prototype.normalize = function () {
        var len = this.length();
        if (len === 0) {
            return this;
        }
        var inv = 1.0 / len;
        this.x *= inv;
        this.y *= inv;
        this.z *= inv;
        this.w *= inv;
        return this;
    };
    /**
     * Returns a new Vector3 set with the Euler angles translated from the current quaternion
     * @param order is a reserved parameter and is ignore for now
     * @returns a new Vector3 containing the Euler angles
     */
    Quaternion.prototype.toEulerAngles = function (order) {
        if (order === void 0) { order = "YZX"; }
        var result = Vector3.Zero();
        this.toEulerAnglesToRef(result);
        return result;
    };
    /**
     * Sets the given vector3 "result" with the Euler angles translated from the current quaternion
     * @param result defines the vector which will be filled with the Euler angles
     * @param order is a reserved parameter and is ignore for now
     * @returns the current unchanged quaternion
     */
    Quaternion.prototype.toEulerAnglesToRef = function (result) {
        var qz = this.z;
        var qx = this.x;
        var qy = this.y;
        var qw = this.w;
        var sqw = qw * qw;
        var sqz = qz * qz;
        var sqx = qx * qx;
        var sqy = qy * qy;
        var zAxisY = qy * qz - qx * qw;
        var limit = .4999999;
        if (zAxisY < -limit) {
            result.y = 2 * Math.atan2(qy, qw);
            result.x = Math.PI / 2;
            result.z = 0;
        }
        else if (zAxisY > limit) {
            result.y = 2 * Math.atan2(qy, qw);
            result.x = -Math.PI / 2;
            result.z = 0;
        }
        else {
            result.z = Math.atan2(2.0 * (qx * qy + qz * qw), (-sqz - sqx + sqy + sqw));
            result.x = Math.asin(-2.0 * (qz * qy - qx * qw));
            result.y = Math.atan2(2.0 * (qz * qx + qy * qw), (sqz - sqx - sqy + sqw));
        }
        return this;
    };
    /**
     * Updates the given rotation matrix with the current quaternion values
     * @param result defines the target matrix
     * @returns the current unchanged quaternion
     */
    Quaternion.prototype.toRotationMatrix = function (result) {
        Matrix.FromQuaternionToRef(this, result);
        return this;
    };
    /**
     * Updates the current quaternion from the given rotation matrix values
     * @param matrix defines the source matrix
     * @returns the current updated quaternion
     */
    Quaternion.prototype.fromRotationMatrix = function (matrix) {
        Quaternion.FromRotationMatrixToRef(matrix, this);
        return this;
    };
    // Statics
    /**
     * Creates a new quaternion from a rotation matrix
     * @param matrix defines the source matrix
     * @returns a new quaternion created from the given rotation matrix values
     */
    Quaternion.FromRotationMatrix = function (matrix) {
        var result = new Quaternion();
        Quaternion.FromRotationMatrixToRef(matrix, result);
        return result;
    };
    /**
     * Updates the given quaternion with the given rotation matrix values
     * @param matrix defines the source matrix
     * @param result defines the target quaternion
     */
    Quaternion.FromRotationMatrixToRef = function (matrix, result) {
        var data = matrix.m;
        var m11 = data[0], m12 = data[4], m13 = data[8];
        var m21 = data[1], m22 = data[5], m23 = data[9];
        var m31 = data[2], m32 = data[6], m33 = data[10];
        var trace = m11 + m22 + m33;
        var s;
        if (trace > 0) {
            s = 0.5 / Math.sqrt(trace + 1.0);
            result.w = 0.25 / s;
            result.x = (m32 - m23) * s;
            result.y = (m13 - m31) * s;
            result.z = (m21 - m12) * s;
        }
        else if (m11 > m22 && m11 > m33) {
            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
            result.w = (m32 - m23) / s;
            result.x = 0.25 * s;
            result.y = (m12 + m21) / s;
            result.z = (m13 + m31) / s;
        }
        else if (m22 > m33) {
            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
            result.w = (m13 - m31) / s;
            result.x = (m12 + m21) / s;
            result.y = 0.25 * s;
            result.z = (m23 + m32) / s;
        }
        else {
            s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
            result.w = (m21 - m12) / s;
            result.x = (m13 + m31) / s;
            result.y = (m23 + m32) / s;
            result.z = 0.25 * s;
        }
    };
    /**
     * Returns the dot product (float) between the quaternions "left" and "right"
     * @param left defines the left operand
     * @param right defines the right operand
     * @returns the dot product
     */
    Quaternion.Dot = function (left, right) {
        return (left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w);
    };
    /**
     * Checks if the two quaternions are close to each other
     * @param quat0 defines the first quaternion to check
     * @param quat1 defines the second quaternion to check
     * @returns true if the two quaternions are close to each other
     */
    Quaternion.AreClose = function (quat0, quat1) {
        var dot = Quaternion.Dot(quat0, quat1);
        return dot >= 0;
    };
    /**
     * Creates an empty quaternion
     * @returns a new quaternion set to (0.0, 0.0, 0.0)
     */
    Quaternion.Zero = function () {
        return new Quaternion(0.0, 0.0, 0.0, 0.0);
    };
    /**
     * Inverse a given quaternion
     * @param q defines the source quaternion
     * @returns a new quaternion as the inverted current quaternion
     */
    Quaternion.Inverse = function (q) {
        return new Quaternion(-q.x, -q.y, -q.z, q.w);
    };
    /**
     * Inverse a given quaternion
     * @param q defines the source quaternion
     * @param result the quaternion the result will be stored in
     * @returns the result quaternion
     */
    Quaternion.InverseToRef = function (q, result) {
        result.set(-q.x, -q.y, -q.z, q.w);
        return result;
    };
    /**
     * Creates an identity quaternion
     * @returns the identity quaternion
     */
    Quaternion.Identity = function () {
        return new Quaternion(0.0, 0.0, 0.0, 1.0);
    };
    /**
     * Gets a boolean indicating if the given quaternion is identity
     * @param quaternion defines the quaternion to check
     * @returns true if the quaternion is identity
     */
    Quaternion.IsIdentity = function (quaternion) {
        return quaternion && quaternion.x === 0 && quaternion.y === 0 && quaternion.z === 0 && quaternion.w === 1;
    };
    /**
     * Creates a quaternion from a rotation around an axis
     * @param axis defines the axis to use
     * @param angle defines the angle to use
     * @returns a new quaternion created from the given axis (Vector3) and angle in radians (float)
     */
    Quaternion.RotationAxis = function (axis, angle) {
        return Quaternion.RotationAxisToRef(axis, angle, new Quaternion());
    };
    /**
     * Creates a rotation around an axis and stores it into the given quaternion
     * @param axis defines the axis to use
     * @param angle defines the angle to use
     * @param result defines the target quaternion
     * @returns the target quaternion
     */
    Quaternion.RotationAxisToRef = function (axis, angle, result) {
        var sin = Math.sin(angle / 2);
        axis.normalize();
        result.w = Math.cos(angle / 2);
        result.x = axis.x * sin;
        result.y = axis.y * sin;
        result.z = axis.z * sin;
        return result;
    };
    /**
     * Creates a new quaternion from data stored into an array
     * @param array defines the data source
     * @param offset defines the offset in the source array where the data starts
     * @returns a new quaternion
     */
    Quaternion.FromArray = function (array, offset) {
        if (!offset) {
            offset = 0;
        }
        return new Quaternion(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
    };
    /**
     * Create a quaternion from Euler rotation angles
     * @param x Pitch
     * @param y Yaw
     * @param z Roll
     * @returns the new Quaternion
     */
    Quaternion.FromEulerAngles = function (x, y, z) {
        var q = new Quaternion();
        Quaternion.RotationYawPitchRollToRef(y, x, z, q);
        return q;
    };
    /**
     * Updates a quaternion from Euler rotation angles
     * @param x Pitch
     * @param y Yaw
     * @param z Roll
     * @param result the quaternion to store the result
     * @returns the updated quaternion
     */
    Quaternion.FromEulerAnglesToRef = function (x, y, z, result) {
        Quaternion.RotationYawPitchRollToRef(y, x, z, result);
        return result;
    };
    /**
     * Create a quaternion from Euler rotation vector
     * @param vec the Euler vector (x Pitch, y Yaw, z Roll)
     * @returns the new Quaternion
     */
    Quaternion.FromEulerVector = function (vec) {
        var q = new Quaternion();
        Quaternion.RotationYawPitchRollToRef(vec.y, vec.x, vec.z, q);
        return q;
    };
    /**
     * Updates a quaternion from Euler rotation vector
     * @param vec the Euler vector (x Pitch, y Yaw, z Roll)
     * @param result the quaternion to store the result
     * @returns the updated quaternion
     */
    Quaternion.FromEulerVectorToRef = function (vec, result) {
        Quaternion.RotationYawPitchRollToRef(vec.y, vec.x, vec.z, result);
        return result;
    };
    /**
     * Creates a new quaternion from the given Euler float angles (y, x, z)
     * @param yaw defines the rotation around Y axis
     * @param pitch defines the rotation around X axis
     * @param roll defines the rotation around Z axis
     * @returns the new quaternion
     */
    Quaternion.RotationYawPitchRoll = function (yaw, pitch, roll) {
        var q = new Quaternion();
        Quaternion.RotationYawPitchRollToRef(yaw, pitch, roll, q);
        return q;
    };
    /**
     * Creates a new rotation from the given Euler float angles (y, x, z) and stores it in the target quaternion
     * @param yaw defines the rotation around Y axis
     * @param pitch defines the rotation around X axis
     * @param roll defines the rotation around Z axis
     * @param result defines the target quaternion
     */
    Quaternion.RotationYawPitchRollToRef = function (yaw, pitch, roll, result) {
        // Produces a quaternion from Euler angles in the z-y-x orientation (Tait-Bryan angles)
        var halfRoll = roll * 0.5;
        var halfPitch = pitch * 0.5;
        var halfYaw = yaw * 0.5;
        var sinRoll = Math.sin(halfRoll);
        var cosRoll = Math.cos(halfRoll);
        var sinPitch = Math.sin(halfPitch);
        var cosPitch = Math.cos(halfPitch);
        var sinYaw = Math.sin(halfYaw);
        var cosYaw = Math.cos(halfYaw);
        result.x = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);
        result.y = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);
        result.z = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);
        result.w = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);
    };
    /**
     * Creates a new quaternion from the given Euler float angles expressed in z-x-z orientation
     * @param alpha defines the rotation around first axis
     * @param beta defines the rotation around second axis
     * @param gamma defines the rotation around third axis
     * @returns the new quaternion
     */
    Quaternion.RotationAlphaBetaGamma = function (alpha, beta, gamma) {
        var result = new Quaternion();
        Quaternion.RotationAlphaBetaGammaToRef(alpha, beta, gamma, result);
        return result;
    };
    /**
     * Creates a new quaternion from the given Euler float angles expressed in z-x-z orientation and stores it in the target quaternion
     * @param alpha defines the rotation around first axis
     * @param beta defines the rotation around second axis
     * @param gamma defines the rotation around third axis
     * @param result defines the target quaternion
     */
    Quaternion.RotationAlphaBetaGammaToRef = function (alpha, beta, gamma, result) {
        // Produces a quaternion from Euler angles in the z-x-z orientation
        var halfGammaPlusAlpha = (gamma + alpha) * 0.5;
        var halfGammaMinusAlpha = (gamma - alpha) * 0.5;
        var halfBeta = beta * 0.5;
        result.x = Math.cos(halfGammaMinusAlpha) * Math.sin(halfBeta);
        result.y = Math.sin(halfGammaMinusAlpha) * Math.sin(halfBeta);
        result.z = Math.sin(halfGammaPlusAlpha) * Math.cos(halfBeta);
        result.w = Math.cos(halfGammaPlusAlpha) * Math.cos(halfBeta);
    };
    /**
     * Creates a new quaternion containing the rotation value to reach the target (axis1, axis2, axis3) orientation as a rotated XYZ system (axis1, axis2 and axis3 are normalized during this operation)
     * @param axis1 defines the first axis
     * @param axis2 defines the second axis
     * @param axis3 defines the third axis
     * @returns the new quaternion
     */
    Quaternion.RotationQuaternionFromAxis = function (axis1, axis2, axis3) {
        var quat = new Quaternion(0.0, 0.0, 0.0, 0.0);
        Quaternion.RotationQuaternionFromAxisToRef(axis1, axis2, axis3, quat);
        return quat;
    };
    /**
     * Creates a rotation value to reach the target (axis1, axis2, axis3) orientation as a rotated XYZ system (axis1, axis2 and axis3 are normalized during this operation) and stores it in the target quaternion
     * @param axis1 defines the first axis
     * @param axis2 defines the second axis
     * @param axis3 defines the third axis
     * @param ref defines the target quaternion
     */
    Quaternion.RotationQuaternionFromAxisToRef = function (axis1, axis2, axis3, ref) {
        var rotMat = MathTmp.Matrix[0];
        Matrix.FromXYZAxesToRef(axis1.normalize(), axis2.normalize(), axis3.normalize(), rotMat);
        Quaternion.FromRotationMatrixToRef(rotMat, ref);
    };
    /**
     * Interpolates between two quaternions
     * @param left defines first quaternion
     * @param right defines second quaternion
     * @param amount defines the gradient to use
     * @returns the new interpolated quaternion
     */
    Quaternion.Slerp = function (left, right, amount) {
        var result = Quaternion.Identity();
        Quaternion.SlerpToRef(left, right, amount, result);
        return result;
    };
    /**
     * Interpolates between two quaternions and stores it into a target quaternion
     * @param left defines first quaternion
     * @param right defines second quaternion
     * @param amount defines the gradient to use
     * @param result defines the target quaternion
     */
    Quaternion.SlerpToRef = function (left, right, amount, result) {
        var num2;
        var num3;
        var num4 = (((left.x * right.x) + (left.y * right.y)) + (left.z * right.z)) + (left.w * right.w);
        var flag = false;
        if (num4 < 0) {
            flag = true;
            num4 = -num4;
        }
        if (num4 > 0.999999) {
            num3 = 1 - amount;
            num2 = flag ? -amount : amount;
        }
        else {
            var num5 = Math.acos(num4);
            var num6 = (1.0 / Math.sin(num5));
            num3 = (Math.sin((1.0 - amount) * num5)) * num6;
            num2 = flag ? ((-Math.sin(amount * num5)) * num6) : ((Math.sin(amount * num5)) * num6);
        }
        result.x = (num3 * left.x) + (num2 * right.x);
        result.y = (num3 * left.y) + (num2 * right.y);
        result.z = (num3 * left.z) + (num2 * right.z);
        result.w = (num3 * left.w) + (num2 * right.w);
    };
    /**
     * Interpolate between two quaternions using Hermite interpolation
     * @param value1 defines first quaternion
     * @param tangent1 defines the incoming tangent
     * @param value2 defines second quaternion
     * @param tangent2 defines the outgoing tangent
     * @param amount defines the target quaternion
     * @returns the new interpolated quaternion
     */
    Quaternion.Hermite = function (value1, tangent1, value2, tangent2, amount) {
        var squared = amount * amount;
        var cubed = amount * squared;
        var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
        var part2 = (-2.0 * cubed) + (3.0 * squared);
        var part3 = (cubed - (2.0 * squared)) + amount;
        var part4 = cubed - squared;
        var x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
        var y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
        var z = (((value1.z * part1) + (value2.z * part2)) + (tangent1.z * part3)) + (tangent2.z * part4);
        var w = (((value1.w * part1) + (value2.w * part2)) + (tangent1.w * part3)) + (tangent2.w * part4);
        return new Quaternion(x, y, z, w);
    };
    return Quaternion;
}());

/**
 * Class used to store matrix data (4x4)
 */
var Matrix = /** @class */ (function () {
    /**
     * Creates an empty matrix (filled with zeros)
     */
    function Matrix() {
        this._isIdentity = false;
        this._isIdentityDirty = true;
        this._isIdentity3x2 = true;
        this._isIdentity3x2Dirty = true;
        /**
         * Gets the update flag of the matrix which is an unique number for the matrix.
         * It will be incremented every time the matrix data change.
         * You can use it to speed the comparison between two versions of the same matrix.
         */
        this.updateFlag = -1;
        this._m = new Float32Array(16);
        this._updateIdentityStatus(false);
    }
    Object.defineProperty(Matrix.prototype, "m", {
        /**
         * Gets the internal data of the matrix
         */
        get: function () { return this._m; },
        enumerable: true,
        configurable: true
    });
    /** @hidden */
    Matrix.prototype._markAsUpdated = function () {
        this.updateFlag = Matrix._updateFlagSeed++;
        this._isIdentity = false;
        this._isIdentity3x2 = false;
        this._isIdentityDirty = true;
        this._isIdentity3x2Dirty = true;
    };
    /** @hidden */
    Matrix.prototype._updateIdentityStatus = function (isIdentity, isIdentityDirty, isIdentity3x2, isIdentity3x2Dirty) {
        if (isIdentityDirty === void 0) { isIdentityDirty = false; }
        if (isIdentity3x2 === void 0) { isIdentity3x2 = false; }
        if (isIdentity3x2Dirty === void 0) { isIdentity3x2Dirty = true; }
        this.updateFlag = Matrix._updateFlagSeed++;
        this._isIdentity = isIdentity;
        this._isIdentity3x2 = isIdentity || isIdentity3x2;
        this._isIdentityDirty = this._isIdentity ? false : isIdentityDirty;
        this._isIdentity3x2Dirty = this._isIdentity3x2 ? false : isIdentity3x2Dirty;
    };
    // Properties
    /**
     * Check if the current matrix is identity
     * @returns true is the matrix is the identity matrix
     */
    Matrix.prototype.isIdentity = function () {
        if (this._isIdentityDirty) {
            this._isIdentityDirty = false;
            var m = this._m;
            this._isIdentity = (m[0] === 1.0 && m[1] === 0.0 && m[2] === 0.0 && m[3] === 0.0 &&
                m[4] === 0.0 && m[5] === 1.0 && m[6] === 0.0 && m[7] === 0.0 &&
                m[8] === 0.0 && m[9] === 0.0 && m[10] === 1.0 && m[11] === 0.0 &&
                m[12] === 0.0 && m[13] === 0.0 && m[14] === 0.0 && m[15] === 1.0);
        }
        return this._isIdentity;
    };
    /**
     * Check if the current matrix is identity as a texture matrix (3x2 store in 4x4)
     * @returns true is the matrix is the identity matrix
     */
    Matrix.prototype.isIdentityAs3x2 = function () {
        if (this._isIdentity3x2Dirty) {
            this._isIdentity3x2Dirty = false;
            if (this._m[0] !== 1.0 || this._m[5] !== 1.0 || this._m[15] !== 1.0) {
                this._isIdentity3x2 = false;
            }
            else if (this._m[1] !== 0.0 || this._m[2] !== 0.0 || this._m[3] !== 0.0 ||
                this._m[4] !== 0.0 || this._m[6] !== 0.0 || this._m[7] !== 0.0 ||
                this._m[8] !== 0.0 || this._m[9] !== 0.0 || this._m[10] !== 0.0 || this._m[11] !== 0.0 ||
                this._m[12] !== 0.0 || this._m[13] !== 0.0 || this._m[14] !== 0.0) {
                this._isIdentity3x2 = false;
            }
            else {
                this._isIdentity3x2 = true;
            }
        }
        return this._isIdentity3x2;
    };
    /**
     * Gets the determinant of the matrix
     * @returns the matrix determinant
     */
    Matrix.prototype.determinant = function () {
        if (this._isIdentity === true) {
            return 1;
        }
        var m = this._m;
        var m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3];
        var m10 = m[4], m11 = m[5], m12 = m[6], m13 = m[7];
        var m20 = m[8], m21 = m[9], m22 = m[10], m23 = m[11];
        var m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];
        // https://en.wikipedia.org/wiki/Laplace_expansion
        // to compute the deterrminant of a 4x4 Matrix we compute the cofactors of any row or column,
        // then we multiply each Cofactor by its corresponding matrix value and sum them all to get the determinant
        // Cofactor(i, j) = sign(i,j) * det(Minor(i, j))
        // where
        //  - sign(i,j) = (i+j) % 2 === 0 ? 1 : -1
        //  - Minor(i, j) is the 3x3 matrix we get by removing row i and column j from current Matrix
        //
        // Here we do that for the 1st row.
        var det_22_33 = m22 * m33 - m32 * m23;
        var det_21_33 = m21 * m33 - m31 * m23;
        var det_21_32 = m21 * m32 - m31 * m22;
        var det_20_33 = m20 * m33 - m30 * m23;
        var det_20_32 = m20 * m32 - m22 * m30;
        var det_20_31 = m20 * m31 - m30 * m21;
        var cofact_00 = +(m11 * det_22_33 - m12 * det_21_33 + m13 * det_21_32);
        var cofact_01 = -(m10 * det_22_33 - m12 * det_20_33 + m13 * det_20_32);
        var cofact_02 = +(m10 * det_21_33 - m11 * det_20_33 + m13 * det_20_31);
        var cofact_03 = -(m10 * det_21_32 - m11 * det_20_32 + m12 * det_20_31);
        return m00 * cofact_00 + m01 * cofact_01 + m02 * cofact_02 + m03 * cofact_03;
    };
    // Methods
    /**
     * Returns the matrix as a Float32Array
     * @returns the matrix underlying array
     */
    Matrix.prototype.toArray = function () {
        return this._m;
    };
    /**
     * Returns the matrix as a Float32Array
    * @returns the matrix underlying array.
    */
    Matrix.prototype.asArray = function () {
        return this._m;
    };
    /**
     * Inverts the current matrix in place
     * @returns the current inverted matrix
     */
    Matrix.prototype.invert = function () {
        this.invertToRef(this);
        return this;
    };
    /**
     * Sets all the matrix elements to zero
     * @returns the current matrix
     */
    Matrix.prototype.reset = function () {
        Matrix.FromValuesToRef(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, this);
        this._updateIdentityStatus(false);
        return this;
    };
    /**
     * Adds the current matrix with a second one
     * @param other defines the matrix to add
     * @returns a new matrix as the addition of the current matrix and the given one
     */
    Matrix.prototype.add = function (other) {
        var result = new Matrix();
        this.addToRef(other, result);
        return result;
    };
    /**
     * Sets the given matrix "result" to the addition of the current matrix and the given one
     * @param other defines the matrix to add
     * @param result defines the target matrix
     * @returns the current matrix
     */
    Matrix.prototype.addToRef = function (other, result) {
        var m = this._m;
        var resultM = result._m;
        var otherM = other.m;
        for (var index = 0; index < 16; index++) {
            resultM[index] = m[index] + otherM[index];
        }
        result._markAsUpdated();
        return this;
    };
    /**
     * Adds in place the given matrix to the current matrix
     * @param other defines the second operand
     * @returns the current updated matrix
     */
    Matrix.prototype.addToSelf = function (other) {
        var m = this._m;
        var otherM = other.m;
        for (var index = 0; index < 16; index++) {
            m[index] += otherM[index];
        }
        this._markAsUpdated();
        return this;
    };
    /**
     * Sets the given matrix to the current inverted Matrix
     * @param other defines the target matrix
     * @returns the unmodified current matrix
     */
    Matrix.prototype.invertToRef = function (other) {
        if (this._isIdentity === true) {
            Matrix.IdentityToRef(other);
            return this;
        }
        // the inverse of a Matrix is the transpose of cofactor matrix divided by the determinant
        var m = this._m;
        var m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3];
        var m10 = m[4], m11 = m[5], m12 = m[6], m13 = m[7];
        var m20 = m[8], m21 = m[9], m22 = m[10], m23 = m[11];
        var m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];
        var det_22_33 = m22 * m33 - m32 * m23;
        var det_21_33 = m21 * m33 - m31 * m23;
        var det_21_32 = m21 * m32 - m31 * m22;
        var det_20_33 = m20 * m33 - m30 * m23;
        var det_20_32 = m20 * m32 - m22 * m30;
        var det_20_31 = m20 * m31 - m30 * m21;
        var cofact_00 = +(m11 * det_22_33 - m12 * det_21_33 + m13 * det_21_32);
        var cofact_01 = -(m10 * det_22_33 - m12 * det_20_33 + m13 * det_20_32);
        var cofact_02 = +(m10 * det_21_33 - m11 * det_20_33 + m13 * det_20_31);
        var cofact_03 = -(m10 * det_21_32 - m11 * det_20_32 + m12 * det_20_31);
        var det = m00 * cofact_00 + m01 * cofact_01 + m02 * cofact_02 + m03 * cofact_03;
        if (det === 0) {
            // not invertible
            other.copyFrom(this);
            return this;
        }
        var detInv = 1 / det;
        var det_12_33 = m12 * m33 - m32 * m13;
        var det_11_33 = m11 * m33 - m31 * m13;
        var det_11_32 = m11 * m32 - m31 * m12;
        var det_10_33 = m10 * m33 - m30 * m13;
        var det_10_32 = m10 * m32 - m30 * m12;
        var det_10_31 = m10 * m31 - m30 * m11;
        var det_12_23 = m12 * m23 - m22 * m13;
        var det_11_23 = m11 * m23 - m21 * m13;
        var det_11_22 = m11 * m22 - m21 * m12;
        var det_10_23 = m10 * m23 - m20 * m13;
        var det_10_22 = m10 * m22 - m20 * m12;
        var det_10_21 = m10 * m21 - m20 * m11;
        var cofact_10 = -(m01 * det_22_33 - m02 * det_21_33 + m03 * det_21_32);
        var cofact_11 = +(m00 * det_22_33 - m02 * det_20_33 + m03 * det_20_32);
        var cofact_12 = -(m00 * det_21_33 - m01 * det_20_33 + m03 * det_20_31);
        var cofact_13 = +(m00 * det_21_32 - m01 * det_20_32 + m02 * det_20_31);
        var cofact_20 = +(m01 * det_12_33 - m02 * det_11_33 + m03 * det_11_32);
        var cofact_21 = -(m00 * det_12_33 - m02 * det_10_33 + m03 * det_10_32);
        var cofact_22 = +(m00 * det_11_33 - m01 * det_10_33 + m03 * det_10_31);
        var cofact_23 = -(m00 * det_11_32 - m01 * det_10_32 + m02 * det_10_31);
        var cofact_30 = -(m01 * det_12_23 - m02 * det_11_23 + m03 * det_11_22);
        var cofact_31 = +(m00 * det_12_23 - m02 * det_10_23 + m03 * det_10_22);
        var cofact_32 = -(m00 * det_11_23 - m01 * det_10_23 + m03 * det_10_21);
        var cofact_33 = +(m00 * det_11_22 - m01 * det_10_22 + m02 * det_10_21);
        Matrix.FromValuesToRef(cofact_00 * detInv, cofact_10 * detInv, cofact_20 * detInv, cofact_30 * detInv, cofact_01 * detInv, cofact_11 * detInv, cofact_21 * detInv, cofact_31 * detInv, cofact_02 * detInv, cofact_12 * detInv, cofact_22 * detInv, cofact_32 * detInv, cofact_03 * detInv, cofact_13 * detInv, cofact_23 * detInv, cofact_33 * detInv, other);
        return this;
    };
    /**
     * add a value at the specified position in the current Matrix
     * @param index the index of the value within the matrix. between 0 and 15.
     * @param value the value to be added
     * @returns the current updated matrix
     */
    Matrix.prototype.addAtIndex = function (index, value) {
        this._m[index] += value;
        this._markAsUpdated();
        return this;
    };
    /**
     * mutiply the specified position in the current Matrix by a value
     * @param index the index of the value within the matrix. between 0 and 15.
     * @param value the value to be added
     * @returns the current updated matrix
     */
    Matrix.prototype.multiplyAtIndex = function (index, value) {
        this._m[index] *= value;
        this._markAsUpdated();
        return this;
    };
    /**
     * Inserts the translation vector (using 3 floats) in the current matrix
     * @param x defines the 1st component of the translation
     * @param y defines the 2nd component of the translation
     * @param z defines the 3rd component of the translation
     * @returns the current updated matrix
     */
    Matrix.prototype.setTranslationFromFloats = function (x, y, z) {
        this._m[12] = x;
        this._m[13] = y;
        this._m[14] = z;
        this._markAsUpdated();
        return this;
    };
    /**
     * Adds the translation vector (using 3 floats) in the current matrix
     * @param x defines the 1st component of the translation
     * @param y defines the 2nd component of the translation
     * @param z defines the 3rd component of the translation
     * @returns the current updated matrix
     */
    Matrix.prototype.addTranslationFromFloats = function (x, y, z) {
        this._m[12] += x;
        this._m[13] += y;
        this._m[14] += z;
        this._markAsUpdated();
        return this;
    };
    /**
     * Inserts the translation vector in the current matrix
     * @param vector3 defines the translation to insert
     * @returns the current updated matrix
     */
    Matrix.prototype.setTranslation = function (vector3) {
        return this.setTranslationFromFloats(vector3.x, vector3.y, vector3.z);
    };
    /**
     * Gets the translation value of the current matrix
     * @returns a new Vector3 as the extracted translation from the matrix
     */
    Matrix.prototype.getTranslation = function () {
        return new Vector3(this._m[12], this._m[13], this._m[14]);
    };
    /**
     * Fill a Vector3 with the extracted translation from the matrix
     * @param result defines the Vector3 where to store the translation
     * @returns the current matrix
     */
    Matrix.prototype.getTranslationToRef = function (result) {
        result.x = this._m[12];
        result.y = this._m[13];
        result.z = this._m[14];
        return this;
    };
    /**
     * Remove rotation and scaling part from the matrix
     * @returns the updated matrix
     */
    Matrix.prototype.removeRotationAndScaling = function () {
        var m = this.m;
        Matrix.FromValuesToRef(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, m[12], m[13], m[14], m[15], this);
        this._updateIdentityStatus(m[12] === 0 && m[13] === 0 && m[14] === 0 && m[15] === 1);
        return this;
    };
    /**
     * Multiply two matrices
     * @param other defines the second operand
     * @returns a new matrix set with the multiplication result of the current Matrix and the given one
     */
    Matrix.prototype.multiply = function (other) {
        var result = new Matrix();
        this.multiplyToRef(other, result);
        return result;
    };
    /**
     * Copy the current matrix from the given one
     * @param other defines the source matrix
     * @returns the current updated matrix
     */
    Matrix.prototype.copyFrom = function (other) {
        other.copyToArray(this._m);
        var o = other;
        this._updateIdentityStatus(o._isIdentity, o._isIdentityDirty, o._isIdentity3x2, o._isIdentity3x2Dirty);
        return this;
    };
    /**
     * Populates the given array from the starting index with the current matrix values
     * @param array defines the target array
     * @param offset defines the offset in the target array where to start storing values
     * @returns the current matrix
     */
    Matrix.prototype.copyToArray = function (array, offset) {
        if (offset === void 0) { offset = 0; }
        for (var index = 0; index < 16; index++) {
            array[offset + index] = this._m[index];
        }
        return this;
    };
    /**
     * Sets the given matrix "result" with the multiplication result of the current Matrix and the given one
     * @param other defines the second operand
     * @param result defines the matrix where to store the multiplication
     * @returns the current matrix
     */
    Matrix.prototype.multiplyToRef = function (other, result) {
        if (this._isIdentity) {
            result.copyFrom(other);
            return this;
        }
        if (other._isIdentity) {
            result.copyFrom(this);
            return this;
        }
        this.multiplyToArray(other, result._m, 0);
        result._markAsUpdated();
        return this;
    };
    /**
     * Sets the Float32Array "result" from the given index "offset" with the multiplication of the current matrix and the given one
     * @param other defines the second operand
     * @param result defines the array where to store the multiplication
     * @param offset defines the offset in the target array where to start storing values
     * @returns the current matrix
     */
    Matrix.prototype.multiplyToArray = function (other, result, offset) {
        var m = this._m;
        var otherM = other.m;
        var tm0 = m[0], tm1 = m[1], tm2 = m[2], tm3 = m[3];
        var tm4 = m[4], tm5 = m[5], tm6 = m[6], tm7 = m[7];
        var tm8 = m[8], tm9 = m[9], tm10 = m[10], tm11 = m[11];
        var tm12 = m[12], tm13 = m[13], tm14 = m[14], tm15 = m[15];
        var om0 = otherM[0], om1 = otherM[1], om2 = otherM[2], om3 = otherM[3];
        var om4 = otherM[4], om5 = otherM[5], om6 = otherM[6], om7 = otherM[7];
        var om8 = otherM[8], om9 = otherM[9], om10 = otherM[10], om11 = otherM[11];
        var om12 = otherM[12], om13 = otherM[13], om14 = otherM[14], om15 = otherM[15];
        result[offset] = tm0 * om0 + tm1 * om4 + tm2 * om8 + tm3 * om12;
        result[offset + 1] = tm0 * om1 + tm1 * om5 + tm2 * om9 + tm3 * om13;
        result[offset + 2] = tm0 * om2 + tm1 * om6 + tm2 * om10 + tm3 * om14;
        result[offset + 3] = tm0 * om3 + tm1 * om7 + tm2 * om11 + tm3 * om15;
        result[offset + 4] = tm4 * om0 + tm5 * om4 + tm6 * om8 + tm7 * om12;
        result[offset + 5] = tm4 * om1 + tm5 * om5 + tm6 * om9 + tm7 * om13;
        result[offset + 6] = tm4 * om2 + tm5 * om6 + tm6 * om10 + tm7 * om14;
        result[offset + 7] = tm4 * om3 + tm5 * om7 + tm6 * om11 + tm7 * om15;
        result[offset + 8] = tm8 * om0 + tm9 * om4 + tm10 * om8 + tm11 * om12;
        result[offset + 9] = tm8 * om1 + tm9 * om5 + tm10 * om9 + tm11 * om13;
        result[offset + 10] = tm8 * om2 + tm9 * om6 + tm10 * om10 + tm11 * om14;
        result[offset + 11] = tm8 * om3 + tm9 * om7 + tm10 * om11 + tm11 * om15;
        result[offset + 12] = tm12 * om0 + tm13 * om4 + tm14 * om8 + tm15 * om12;
        result[offset + 13] = tm12 * om1 + tm13 * om5 + tm14 * om9 + tm15 * om13;
        result[offset + 14] = tm12 * om2 + tm13 * om6 + tm14 * om10 + tm15 * om14;
        result[offset + 15] = tm12 * om3 + tm13 * om7 + tm14 * om11 + tm15 * om15;
        return this;
    };
    /**
     * Check equality between this matrix and a second one
     * @param value defines the second matrix to compare
     * @returns true is the current matrix and the given one values are strictly equal
     */
    Matrix.prototype.equals = function (value) {
        var other = value;
        if (!other) {
            return false;
        }
        if (this._isIdentity || other._isIdentity) {
            if (!this._isIdentityDirty && !other._isIdentityDirty) {
                return this._isIdentity && other._isIdentity;
            }
        }
        var m = this.m;
        var om = other.m;
        return (m[0] === om[0] && m[1] === om[1] && m[2] === om[2] && m[3] === om[3] &&
            m[4] === om[4] && m[5] === om[5] && m[6] === om[6] && m[7] === om[7] &&
            m[8] === om[8] && m[9] === om[9] && m[10] === om[10] && m[11] === om[11] &&
            m[12] === om[12] && m[13] === om[13] && m[14] === om[14] && m[15] === om[15]);
    };
    /**
     * Clone the current matrix
     * @returns a new matrix from the current matrix
     */
    Matrix.prototype.clone = function () {
        var matrix = new Matrix();
        matrix.copyFrom(this);
        return matrix;
    };
    /**
     * Returns the name of the current matrix class
     * @returns the string "Matrix"
     */
    Matrix.prototype.getClassName = function () {
        return "Matrix";
    };
    /**
     * Gets the hash code of the current matrix
     * @returns the hash code
     */
    Matrix.prototype.getHashCode = function () {
        var hash = this._m[0] || 0;
        for (var i = 1; i < 16; i++) {
            hash = (hash * 397) ^ (this._m[i] || 0);
        }
        return hash;
    };
    /**
     * Decomposes the current Matrix into a translation, rotation and scaling components
     * @param scale defines the scale vector3 given as a reference to update
     * @param rotation defines the rotation quaternion given as a reference to update
     * @param translation defines the translation vector3 given as a reference to update
     * @returns true if operation was successful
     */
    Matrix.prototype.decompose = function (scale, rotation, translation) {
        if (this._isIdentity) {
            if (translation) {
                translation.setAll(0);
            }
            if (scale) {
                scale.setAll(1);
            }
            if (rotation) {
                rotation.copyFromFloats(0, 0, 0, 1);
            }
            return true;
        }
        var m = this._m;
        if (translation) {
            translation.copyFromFloats(m[12], m[13], m[14]);
        }
        scale = scale || MathTmp.Vector3[0];
        scale.x = Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
        scale.y = Math.sqrt(m[4] * m[4] + m[5] * m[5] + m[6] * m[6]);
        scale.z = Math.sqrt(m[8] * m[8] + m[9] * m[9] + m[10] * m[10]);
        if (this.determinant() <= 0) {
            scale.y *= -1;
        }
        if (scale.x === 0 || scale.y === 0 || scale.z === 0) {
            if (rotation) {
                rotation.copyFromFloats(0.0, 0.0, 0.0, 1.0);
            }
            return false;
        }
        if (rotation) {
            var sx = 1 / scale.x, sy = 1 / scale.y, sz = 1 / scale.z;
            Matrix.FromValuesToRef(m[0] * sx, m[1] * sx, m[2] * sx, 0.0, m[4] * sy, m[5] * sy, m[6] * sy, 0.0, m[8] * sz, m[9] * sz, m[10] * sz, 0.0, 0.0, 0.0, 0.0, 1.0, MathTmp.Matrix[0]);
            Quaternion.FromRotationMatrixToRef(MathTmp.Matrix[0], rotation);
        }
        return true;
    };
    /**
     * Gets specific row of the matrix
     * @param index defines the number of the row to get
     * @returns the index-th row of the current matrix as a new Vector4
     */
    Matrix.prototype.getRow = function (index) {
        if (index < 0 || index > 3) {
            return null;
        }
        var i = index * 4;
        return new Vector4(this._m[i + 0], this._m[i + 1], this._m[i + 2], this._m[i + 3]);
    };
    /**
     * Sets the index-th row of the current matrix to the vector4 values
     * @param index defines the number of the row to set
     * @param row defines the target vector4
     * @returns the updated current matrix
     */
    Matrix.prototype.setRow = function (index, row) {
        return this.setRowFromFloats(index, row.x, row.y, row.z, row.w);
    };
    /**
     * Compute the transpose of the matrix
     * @returns the new transposed matrix
     */
    Matrix.prototype.transpose = function () {
        return Matrix.Transpose(this);
    };
    /**
     * Compute the transpose of the matrix and store it in a given matrix
     * @param result defines the target matrix
     * @returns the current matrix
     */
    Matrix.prototype.transposeToRef = function (result) {
        Matrix.TransposeToRef(this, result);
        return this;
    };
    /**
     * Sets the index-th row of the current matrix with the given 4 x float values
     * @param index defines the row index
     * @param x defines the x component to set
     * @param y defines the y component to set
     * @param z defines the z component to set
     * @param w defines the w component to set
     * @returns the updated current matrix
     */
    Matrix.prototype.setRowFromFloats = function (index, x, y, z, w) {
        if (index < 0 || index > 3) {
            return this;
        }
        var i = index * 4;
        this._m[i + 0] = x;
        this._m[i + 1] = y;
        this._m[i + 2] = z;
        this._m[i + 3] = w;
        this._markAsUpdated();
        return this;
    };
    /**
     * Compute a new matrix set with the current matrix values multiplied by scale (float)
     * @param scale defines the scale factor
     * @returns a new matrix
     */
    Matrix.prototype.scale = function (scale) {
        var result = new Matrix();
        this.scaleToRef(scale, result);
        return result;
    };
    /**
     * Scale the current matrix values by a factor to a given result matrix
     * @param scale defines the scale factor
     * @param result defines the matrix to store the result
     * @returns the current matrix
     */
    Matrix.prototype.scaleToRef = function (scale, result) {
        for (var index = 0; index < 16; index++) {
            result._m[index] = this._m[index] * scale;
        }
        result._markAsUpdated();
        return this;
    };
    /**
     * Scale the current matrix values by a factor and add the result to a given matrix
     * @param scale defines the scale factor
     * @param result defines the Matrix to store the result
     * @returns the current matrix
     */
    Matrix.prototype.scaleAndAddToRef = function (scale, result) {
        for (var index = 0; index < 16; index++) {
            result._m[index] += this._m[index] * scale;
        }
        result._markAsUpdated();
        return this;
    };
    /**
     * Writes to the given matrix a normal matrix, computed from this one (using values from identity matrix for fourth row and column).
     * @param ref matrix to store the result
     */
    Matrix.prototype.toNormalMatrix = function (ref) {
        var tmp = MathTmp.Matrix[0];
        this.invertToRef(tmp);
        tmp.transposeToRef(ref);
        var m = ref._m;
        Matrix.FromValuesToRef(m[0], m[1], m[2], 0.0, m[4], m[5], m[6], 0.0, m[8], m[9], m[10], 0.0, 0.0, 0.0, 0.0, 1.0, ref);
    };
    /**
     * Gets only rotation part of the current matrix
     * @returns a new matrix sets to the extracted rotation matrix from the current one
     */
    Matrix.prototype.getRotationMatrix = function () {
        var result = new Matrix();
        this.getRotationMatrixToRef(result);
        return result;
    };
    /**
     * Extracts the rotation matrix from the current one and sets it as the given "result"
     * @param result defines the target matrix to store data to
     * @returns the current matrix
     */
    Matrix.prototype.getRotationMatrixToRef = function (result) {
        var scale = MathTmp.Vector3[0];
        if (!this.decompose(scale)) {
            Matrix.IdentityToRef(result);
            return this;
        }
        var m = this._m;
        var sx = 1 / scale.x, sy = 1 / scale.y, sz = 1 / scale.z;
        Matrix.FromValuesToRef(m[0] * sx, m[1] * sx, m[2] * sx, 0.0, m[4] * sy, m[5] * sy, m[6] * sy, 0.0, m[8] * sz, m[9] * sz, m[10] * sz, 0.0, 0.0, 0.0, 0.0, 1.0, result);
        return this;
    };
    /**
     * Toggles model matrix from being right handed to left handed in place and vice versa
     */
    Matrix.prototype.toggleModelMatrixHandInPlace = function () {
        var m = this._m;
        m[2] *= -1;
        m[6] *= -1;
        m[8] *= -1;
        m[9] *= -1;
        m[14] *= -1;
        this._markAsUpdated();
    };
    /**
     * Toggles projection matrix from being right handed to left handed in place and vice versa
     */
    Matrix.prototype.toggleProjectionMatrixHandInPlace = function () {
        var m = this._m;
        m[8] *= -1;
        m[9] *= -1;
        m[10] *= -1;
        m[11] *= -1;
        this._markAsUpdated();
    };
    // Statics
    /**
     * Creates a matrix from an array
     * @param array defines the source array
     * @param offset defines an offset in the source array
     * @returns a new Matrix set from the starting index of the given array
     */
    Matrix.FromArray = function (array, offset) {
        if (offset === void 0) { offset = 0; }
        var result = new Matrix();
        Matrix.FromArrayToRef(array, offset, result);
        return result;
    };
    /**
     * Copy the content of an array into a given matrix
     * @param array defines the source array
     * @param offset defines an offset in the source array
     * @param result defines the target matrix
     */
    Matrix.FromArrayToRef = function (array, offset, result) {
        for (var index = 0; index < 16; index++) {
            result._m[index] = array[index + offset];
        }
        result._markAsUpdated();
    };
    /**
     * Stores an array into a matrix after having multiplied each component by a given factor
     * @param array defines the source array
     * @param offset defines the offset in the source array
     * @param scale defines the scaling factor
     * @param result defines the target matrix
     */
    Matrix.FromFloat32ArrayToRefScaled = function (array, offset, scale, result) {
        for (var index = 0; index < 16; index++) {
            result._m[index] = array[index + offset] * scale;
        }
        result._markAsUpdated();
    };
    Object.defineProperty(Matrix, "IdentityReadOnly", {
        /**
         * Gets an identity matrix that must not be updated
         */
        get: function () {
            return Matrix._identityReadOnly;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Stores a list of values (16) inside a given matrix
     * @param initialM11 defines 1st value of 1st row
     * @param initialM12 defines 2nd value of 1st row
     * @param initialM13 defines 3rd value of 1st row
     * @param initialM14 defines 4th value of 1st row
     * @param initialM21 defines 1st value of 2nd row
     * @param initialM22 defines 2nd value of 2nd row
     * @param initialM23 defines 3rd value of 2nd row
     * @param initialM24 defines 4th value of 2nd row
     * @param initialM31 defines 1st value of 3rd row
     * @param initialM32 defines 2nd value of 3rd row
     * @param initialM33 defines 3rd value of 3rd row
     * @param initialM34 defines 4th value of 3rd row
     * @param initialM41 defines 1st value of 4th row
     * @param initialM42 defines 2nd value of 4th row
     * @param initialM43 defines 3rd value of 4th row
     * @param initialM44 defines 4th value of 4th row
     * @param result defines the target matrix
     */
    Matrix.FromValuesToRef = function (initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44, result) {
        var m = result._m;
        m[0] = initialM11;
        m[1] = initialM12;
        m[2] = initialM13;
        m[3] = initialM14;
        m[4] = initialM21;
        m[5] = initialM22;
        m[6] = initialM23;
        m[7] = initialM24;
        m[8] = initialM31;
        m[9] = initialM32;
        m[10] = initialM33;
        m[11] = initialM34;
        m[12] = initialM41;
        m[13] = initialM42;
        m[14] = initialM43;
        m[15] = initialM44;
        result._markAsUpdated();
    };
    /**
     * Creates new matrix from a list of values (16)
     * @param initialM11 defines 1st value of 1st row
     * @param initialM12 defines 2nd value of 1st row
     * @param initialM13 defines 3rd value of 1st row
     * @param initialM14 defines 4th value of 1st row
     * @param initialM21 defines 1st value of 2nd row
     * @param initialM22 defines 2nd value of 2nd row
     * @param initialM23 defines 3rd value of 2nd row
     * @param initialM24 defines 4th value of 2nd row
     * @param initialM31 defines 1st value of 3rd row
     * @param initialM32 defines 2nd value of 3rd row
     * @param initialM33 defines 3rd value of 3rd row
     * @param initialM34 defines 4th value of 3rd row
     * @param initialM41 defines 1st value of 4th row
     * @param initialM42 defines 2nd value of 4th row
     * @param initialM43 defines 3rd value of 4th row
     * @param initialM44 defines 4th value of 4th row
     * @returns the new matrix
     */
    Matrix.FromValues = function (initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44) {
        var result = new Matrix();
        var m = result._m;
        m[0] = initialM11;
        m[1] = initialM12;
        m[2] = initialM13;
        m[3] = initialM14;
        m[4] = initialM21;
        m[5] = initialM22;
        m[6] = initialM23;
        m[7] = initialM24;
        m[8] = initialM31;
        m[9] = initialM32;
        m[10] = initialM33;
        m[11] = initialM34;
        m[12] = initialM41;
        m[13] = initialM42;
        m[14] = initialM43;
        m[15] = initialM44;
        result._markAsUpdated();
        return result;
    };
    /**
     * Creates a new matrix composed by merging scale (vector3), rotation (quaternion) and translation (vector3)
     * @param scale defines the scale vector3
     * @param rotation defines the rotation quaternion
     * @param translation defines the translation vector3
     * @returns a new matrix
     */
    Matrix.Compose = function (scale, rotation, translation) {
        var result = new Matrix();
        Matrix.ComposeToRef(scale, rotation, translation, result);
        return result;
    };
    /**
     * Sets a matrix to a value composed by merging scale (vector3), rotation (quaternion) and translation (vector3)
     * @param scale defines the scale vector3
     * @param rotation defines the rotation quaternion
     * @param translation defines the translation vector3
     * @param result defines the target matrix
     */
    Matrix.ComposeToRef = function (scale, rotation, translation, result) {
        var m = result._m;
        var x = rotation.x, y = rotation.y, z = rotation.z, w = rotation.w;
        var x2 = x + x, y2 = y + y, z2 = z + z;
        var xx = x * x2, xy = x * y2, xz = x * z2;
        var yy = y * y2, yz = y * z2, zz = z * z2;
        var wx = w * x2, wy = w * y2, wz = w * z2;
        var sx = scale.x, sy = scale.y, sz = scale.z;
        m[0] = (1 - (yy + zz)) * sx;
        m[1] = (xy + wz) * sx;
        m[2] = (xz - wy) * sx;
        m[3] = 0;
        m[4] = (xy - wz) * sy;
        m[5] = (1 - (xx + zz)) * sy;
        m[6] = (yz + wx) * sy;
        m[7] = 0;
        m[8] = (xz + wy) * sz;
        m[9] = (yz - wx) * sz;
        m[10] = (1 - (xx + yy)) * sz;
        m[11] = 0;
        m[12] = translation.x;
        m[13] = translation.y;
        m[14] = translation.z;
        m[15] = 1;
        result._markAsUpdated();
    };
    /**
     * Creates a new identity matrix
     * @returns a new identity matrix
     */
    Matrix.Identity = function () {
        var identity = Matrix.FromValues(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
        identity._updateIdentityStatus(true);
        return identity;
    };
    /**
     * Creates a new identity matrix and stores the result in a given matrix
     * @param result defines the target matrix
     */
    Matrix.IdentityToRef = function (result) {
        Matrix.FromValuesToRef(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, result);
        result._updateIdentityStatus(true);
    };
    /**
     * Creates a new zero matrix
     * @returns a new zero matrix
     */
    Matrix.Zero = function () {
        var zero = Matrix.FromValues(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        zero._updateIdentityStatus(false);
        return zero;
    };
    /**
     * Creates a new rotation matrix for "angle" radians around the X axis
     * @param angle defines the angle (in radians) to use
     * @return the new matrix
     */
    Matrix.RotationX = function (angle) {
        var result = new Matrix();
        Matrix.RotationXToRef(angle, result);
        return result;
    };
    /**
     * Creates a new matrix as the invert of a given matrix
     * @param source defines the source matrix
     * @returns the new matrix
     */
    Matrix.Invert = function (source) {
        var result = new Matrix();
        source.invertToRef(result);
        return result;
    };
    /**
     * Creates a new rotation matrix for "angle" radians around the X axis and stores it in a given matrix
     * @param angle defines the angle (in radians) to use
     * @param result defines the target matrix
     */
    Matrix.RotationXToRef = function (angle, result) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);
        Matrix.FromValuesToRef(1.0, 0.0, 0.0, 0.0, 0.0, c, s, 0.0, 0.0, -s, c, 0.0, 0.0, 0.0, 0.0, 1.0, result);
        result._updateIdentityStatus(c === 1 && s === 0);
    };
    /**
     * Creates a new rotation matrix for "angle" radians around the Y axis
     * @param angle defines the angle (in radians) to use
     * @return the new matrix
     */
    Matrix.RotationY = function (angle) {
        var result = new Matrix();
        Matrix.RotationYToRef(angle, result);
        return result;
    };
    /**
     * Creates a new rotation matrix for "angle" radians around the Y axis and stores it in a given matrix
     * @param angle defines the angle (in radians) to use
     * @param result defines the target matrix
     */
    Matrix.RotationYToRef = function (angle, result) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);
        Matrix.FromValuesToRef(c, 0.0, -s, 0.0, 0.0, 1.0, 0.0, 0.0, s, 0.0, c, 0.0, 0.0, 0.0, 0.0, 1.0, result);
        result._updateIdentityStatus(c === 1 && s === 0);
    };
    /**
     * Creates a new rotation matrix for "angle" radians around the Z axis
     * @param angle defines the angle (in radians) to use
     * @return the new matrix
     */
    Matrix.RotationZ = function (angle) {
        var result = new Matrix();
        Matrix.RotationZToRef(angle, result);
        return result;
    };
    /**
     * Creates a new rotation matrix for "angle" radians around the Z axis and stores it in a given matrix
     * @param angle defines the angle (in radians) to use
     * @param result defines the target matrix
     */
    Matrix.RotationZToRef = function (angle, result) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);
        Matrix.FromValuesToRef(c, s, 0.0, 0.0, -s, c, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, result);
        result._updateIdentityStatus(c === 1 && s === 0);
    };
    /**
     * Creates a new rotation matrix for "angle" radians around the given axis
     * @param axis defines the axis to use
     * @param angle defines the angle (in radians) to use
     * @return the new matrix
     */
    Matrix.RotationAxis = function (axis, angle) {
        var result = new Matrix();
        Matrix.RotationAxisToRef(axis, angle, result);
        return result;
    };
    /**
     * Creates a new rotation matrix for "angle" radians around the given axis and stores it in a given matrix
     * @param axis defines the axis to use
     * @param angle defines the angle (in radians) to use
     * @param result defines the target matrix
     */
    Matrix.RotationAxisToRef = function (axis, angle, result) {
        var s = Math.sin(-angle);
        var c = Math.cos(-angle);
        var c1 = 1 - c;
        axis.normalize();
        var m = result._m;
        m[0] = (axis.x * axis.x) * c1 + c;
        m[1] = (axis.x * axis.y) * c1 - (axis.z * s);
        m[2] = (axis.x * axis.z) * c1 + (axis.y * s);
        m[3] = 0.0;
        m[4] = (axis.y * axis.x) * c1 + (axis.z * s);
        m[5] = (axis.y * axis.y) * c1 + c;
        m[6] = (axis.y * axis.z) * c1 - (axis.x * s);
        m[7] = 0.0;
        m[8] = (axis.z * axis.x) * c1 - (axis.y * s);
        m[9] = (axis.z * axis.y) * c1 + (axis.x * s);
        m[10] = (axis.z * axis.z) * c1 + c;
        m[11] = 0.0;
        m[12] = 0.0;
        m[13] = 0.0;
        m[14] = 0.0;
        m[15] = 1.0;
        result._markAsUpdated();
    };
    /**
     * Takes normalised vectors and returns a rotation matrix to align "from" with "to".
     * Taken from http://www.iquilezles.org/www/articles/noacos/noacos.htm
     * @param from defines the vector to align
     * @param to defines the vector to align to
     * @param result defines the target matrix
     */
    Matrix.RotationAlignToRef = function (from, to, result) {
        var v = Vector3.Cross(to, from);
        var c = Vector3.Dot(to, from);
        var k = 1 / (1 + c);
        var m = result._m;
        m[0] = v.x * v.x * k + c;
        m[1] = v.y * v.x * k - v.z;
        m[2] = v.z * v.x * k + v.y;
        m[3] = 0;
        m[4] = v.x * v.y * k + v.z;
        m[5] = v.y * v.y * k + c;
        m[6] = v.z * v.y * k - v.x;
        m[7] = 0;
        m[8] = v.x * v.z * k - v.y;
        m[9] = v.y * v.z * k + v.x;
        m[10] = v.z * v.z * k + c;
        m[11] = 0;
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;
        result._markAsUpdated();
    };
    /**
     * Creates a rotation matrix
     * @param yaw defines the yaw angle in radians (Y axis)
     * @param pitch defines the pitch angle in radians (X axis)
     * @param roll defines the roll angle in radians (X axis)
     * @returns the new rotation matrix
     */
    Matrix.RotationYawPitchRoll = function (yaw, pitch, roll) {
        var result = new Matrix();
        Matrix.RotationYawPitchRollToRef(yaw, pitch, roll, result);
        return result;
    };
    /**
     * Creates a rotation matrix and stores it in a given matrix
     * @param yaw defines the yaw angle in radians (Y axis)
     * @param pitch defines the pitch angle in radians (X axis)
     * @param roll defines the roll angle in radians (X axis)
     * @param result defines the target matrix
     */
    Matrix.RotationYawPitchRollToRef = function (yaw, pitch, roll, result) {
        Quaternion.RotationYawPitchRollToRef(yaw, pitch, roll, MathTmp.Quaternion[0]);
        MathTmp.Quaternion[0].toRotationMatrix(result);
    };
    /**
     * Creates a scaling matrix
     * @param x defines the scale factor on X axis
     * @param y defines the scale factor on Y axis
     * @param z defines the scale factor on Z axis
     * @returns the new matrix
     */
    Matrix.Scaling = function (x, y, z) {
        var result = new Matrix();
        Matrix.ScalingToRef(x, y, z, result);
        return result;
    };
    /**
     * Creates a scaling matrix and stores it in a given matrix
     * @param x defines the scale factor on X axis
     * @param y defines the scale factor on Y axis
     * @param z defines the scale factor on Z axis
     * @param result defines the target matrix
     */
    Matrix.ScalingToRef = function (x, y, z, result) {
        Matrix.FromValuesToRef(x, 0.0, 0.0, 0.0, 0.0, y, 0.0, 0.0, 0.0, 0.0, z, 0.0, 0.0, 0.0, 0.0, 1.0, result);
        result._updateIdentityStatus(x === 1 && y === 1 && z === 1);
    };
    /**
     * Creates a translation matrix
     * @param x defines the translation on X axis
     * @param y defines the translation on Y axis
     * @param z defines the translationon Z axis
     * @returns the new matrix
     */
    Matrix.Translation = function (x, y, z) {
        var result = new Matrix();
        Matrix.TranslationToRef(x, y, z, result);
        return result;
    };
    /**
     * Creates a translation matrix and stores it in a given matrix
     * @param x defines the translation on X axis
     * @param y defines the translation on Y axis
     * @param z defines the translationon Z axis
     * @param result defines the target matrix
     */
    Matrix.TranslationToRef = function (x, y, z, result) {
        Matrix.FromValuesToRef(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, x, y, z, 1.0, result);
        result._updateIdentityStatus(x === 0 && y === 0 && z === 0);
    };
    /**
     * Returns a new Matrix whose values are the interpolated values for "gradient" (float) between the ones of the matrices "startValue" and "endValue".
     * @param startValue defines the start value
     * @param endValue defines the end value
     * @param gradient defines the gradient factor
     * @returns the new matrix
     */
    Matrix.Lerp = function (startValue, endValue, gradient) {
        var result = new Matrix();
        Matrix.LerpToRef(startValue, endValue, gradient, result);
        return result;
    };
    /**
     * Set the given matrix "result" as the interpolated values for "gradient" (float) between the ones of the matrices "startValue" and "endValue".
     * @param startValue defines the start value
     * @param endValue defines the end value
     * @param gradient defines the gradient factor
     * @param result defines the Matrix object where to store data
     */
    Matrix.LerpToRef = function (startValue, endValue, gradient, result) {
        var resultM = result._m;
        var startM = startValue.m;
        var endM = endValue.m;
        for (var index = 0; index < 16; index++) {
            resultM[index] = startM[index] * (1.0 - gradient) + endM[index] * gradient;
        }
        result._markAsUpdated();
    };
    /**
     * Builds a new matrix whose values are computed by:
     * * decomposing the the "startValue" and "endValue" matrices into their respective scale, rotation and translation matrices
     * * interpolating for "gradient" (float) the values between each of these decomposed matrices between the start and the end
     * * recomposing a new matrix from these 3 interpolated scale, rotation and translation matrices
     * @param startValue defines the first matrix
     * @param endValue defines the second matrix
     * @param gradient defines the gradient between the two matrices
     * @returns the new matrix
     */
    Matrix.DecomposeLerp = function (startValue, endValue, gradient) {
        var result = new Matrix();
        Matrix.DecomposeLerpToRef(startValue, endValue, gradient, result);
        return result;
    };
    /**
     * Update a matrix to values which are computed by:
     * * decomposing the the "startValue" and "endValue" matrices into their respective scale, rotation and translation matrices
     * * interpolating for "gradient" (float) the values between each of these decomposed matrices between the start and the end
     * * recomposing a new matrix from these 3 interpolated scale, rotation and translation matrices
     * @param startValue defines the first matrix
     * @param endValue defines the second matrix
     * @param gradient defines the gradient between the two matrices
     * @param result defines the target matrix
     */
    Matrix.DecomposeLerpToRef = function (startValue, endValue, gradient, result) {
        var startScale = MathTmp.Vector3[0];
        var startRotation = MathTmp.Quaternion[0];
        var startTranslation = MathTmp.Vector3[1];
        startValue.decompose(startScale, startRotation, startTranslation);
        var endScale = MathTmp.Vector3[2];
        var endRotation = MathTmp.Quaternion[1];
        var endTranslation = MathTmp.Vector3[3];
        endValue.decompose(endScale, endRotation, endTranslation);
        var resultScale = MathTmp.Vector3[4];
        Vector3.LerpToRef(startScale, endScale, gradient, resultScale);
        var resultRotation = MathTmp.Quaternion[2];
        Quaternion.SlerpToRef(startRotation, endRotation, gradient, resultRotation);
        var resultTranslation = MathTmp.Vector3[5];
        Vector3.LerpToRef(startTranslation, endTranslation, gradient, resultTranslation);
        Matrix.ComposeToRef(resultScale, resultRotation, resultTranslation, result);
    };
    /**
     * Gets a new rotation matrix used to rotate an entity so as it looks at the target vector3, from the eye vector3 position, the up vector3 being oriented like "up"
     * This function works in left handed mode
     * @param eye defines the final position of the entity
     * @param target defines where the entity should look at
     * @param up defines the up vector for the entity
     * @returns the new matrix
     */
    Matrix.LookAtLH = function (eye, target, up) {
        var result = new Matrix();
        Matrix.LookAtLHToRef(eye, target, up, result);
        return result;
    };
    /**
     * Sets the given "result" Matrix to a rotation matrix used to rotate an entity so that it looks at the target vector3, from the eye vector3 position, the up vector3 being oriented like "up".
     * This function works in left handed mode
     * @param eye defines the final position of the entity
     * @param target defines where the entity should look at
     * @param up defines the up vector for the entity
     * @param result defines the target matrix
     */
    Matrix.LookAtLHToRef = function (eye, target, up, result) {
        var xAxis = MathTmp.Vector3[0];
        var yAxis = MathTmp.Vector3[1];
        var zAxis = MathTmp.Vector3[2];
        // Z axis
        target.subtractToRef(eye, zAxis);
        zAxis.normalize();
        // X axis
        Vector3.CrossToRef(up, zAxis, xAxis);
        var xSquareLength = xAxis.lengthSquared();
        if (xSquareLength === 0) {
            xAxis.x = 1.0;
        }
        else {
            xAxis.normalizeFromLength(Math.sqrt(xSquareLength));
        }
        // Y axis
        Vector3.CrossToRef(zAxis, xAxis, yAxis);
        yAxis.normalize();
        // Eye angles
        var ex = -Vector3.Dot(xAxis, eye);
        var ey = -Vector3.Dot(yAxis, eye);
        var ez = -Vector3.Dot(zAxis, eye);
        Matrix.FromValuesToRef(xAxis.x, yAxis.x, zAxis.x, 0.0, xAxis.y, yAxis.y, zAxis.y, 0.0, xAxis.z, yAxis.z, zAxis.z, 0.0, ex, ey, ez, 1.0, result);
    };
    /**
     * Gets a new rotation matrix used to rotate an entity so as it looks at the target vector3, from the eye vector3 position, the up vector3 being oriented like "up"
     * This function works in right handed mode
     * @param eye defines the final position of the entity
     * @param target defines where the entity should look at
     * @param up defines the up vector for the entity
     * @returns the new matrix
     */
    Matrix.LookAtRH = function (eye, target, up) {
        var result = new Matrix();
        Matrix.LookAtRHToRef(eye, target, up, result);
        return result;
    };
    /**
     * Sets the given "result" Matrix to a rotation matrix used to rotate an entity so that it looks at the target vector3, from the eye vector3 position, the up vector3 being oriented like "up".
     * This function works in right handed mode
     * @param eye defines the final position of the entity
     * @param target defines where the entity should look at
     * @param up defines the up vector for the entity
     * @param result defines the target matrix
     */
    Matrix.LookAtRHToRef = function (eye, target, up, result) {
        var xAxis = MathTmp.Vector3[0];
        var yAxis = MathTmp.Vector3[1];
        var zAxis = MathTmp.Vector3[2];
        // Z axis
        eye.subtractToRef(target, zAxis);
        zAxis.normalize();
        // X axis
        Vector3.CrossToRef(up, zAxis, xAxis);
        var xSquareLength = xAxis.lengthSquared();
        if (xSquareLength === 0) {
            xAxis.x = 1.0;
        }
        else {
            xAxis.normalizeFromLength(Math.sqrt(xSquareLength));
        }
        // Y axis
        Vector3.CrossToRef(zAxis, xAxis, yAxis);
        yAxis.normalize();
        // Eye angles
        var ex = -Vector3.Dot(xAxis, eye);
        var ey = -Vector3.Dot(yAxis, eye);
        var ez = -Vector3.Dot(zAxis, eye);
        Matrix.FromValuesToRef(xAxis.x, yAxis.x, zAxis.x, 0.0, xAxis.y, yAxis.y, zAxis.y, 0.0, xAxis.z, yAxis.z, zAxis.z, 0.0, ex, ey, ez, 1.0, result);
    };
    /**
     * Create a left-handed orthographic projection matrix
     * @param width defines the viewport width
     * @param height defines the viewport height
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @returns a new matrix as a left-handed orthographic projection matrix
     */
    Matrix.OrthoLH = function (width, height, znear, zfar) {
        var matrix = new Matrix();
        Matrix.OrthoLHToRef(width, height, znear, zfar, matrix);
        return matrix;
    };
    /**
     * Store a left-handed orthographic projection to a given matrix
     * @param width defines the viewport width
     * @param height defines the viewport height
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param result defines the target matrix
     */
    Matrix.OrthoLHToRef = function (width, height, znear, zfar, result) {
        var n = znear;
        var f = zfar;
        var a = 2.0 / width;
        var b = 2.0 / height;
        var c = 2.0 / (f - n);
        var d = -(f + n) / (f - n);
        Matrix.FromValuesToRef(a, 0.0, 0.0, 0.0, 0.0, b, 0.0, 0.0, 0.0, 0.0, c, 0.0, 0.0, 0.0, d, 1.0, result);
        result._updateIdentityStatus(a === 1 && b === 1 && c === 1 && d === 0);
    };
    /**
     * Create a left-handed orthographic projection matrix
     * @param left defines the viewport left coordinate
     * @param right defines the viewport right coordinate
     * @param bottom defines the viewport bottom coordinate
     * @param top defines the viewport top coordinate
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @returns a new matrix as a left-handed orthographic projection matrix
     */
    Matrix.OrthoOffCenterLH = function (left, right, bottom, top, znear, zfar) {
        var matrix = new Matrix();
        Matrix.OrthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, matrix);
        return matrix;
    };
    /**
     * Stores a left-handed orthographic projection into a given matrix
     * @param left defines the viewport left coordinate
     * @param right defines the viewport right coordinate
     * @param bottom defines the viewport bottom coordinate
     * @param top defines the viewport top coordinate
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param result defines the target matrix
     */
    Matrix.OrthoOffCenterLHToRef = function (left, right, bottom, top, znear, zfar, result) {
        var n = znear;
        var f = zfar;
        var a = 2.0 / (right - left);
        var b = 2.0 / (top - bottom);
        var c = 2.0 / (f - n);
        var d = -(f + n) / (f - n);
        var i0 = (left + right) / (left - right);
        var i1 = (top + bottom) / (bottom - top);
        Matrix.FromValuesToRef(a, 0.0, 0.0, 0.0, 0.0, b, 0.0, 0.0, 0.0, 0.0, c, 0.0, i0, i1, d, 1.0, result);
        result._markAsUpdated();
    };
    /**
     * Creates a right-handed orthographic projection matrix
     * @param left defines the viewport left coordinate
     * @param right defines the viewport right coordinate
     * @param bottom defines the viewport bottom coordinate
     * @param top defines the viewport top coordinate
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @returns a new matrix as a right-handed orthographic projection matrix
     */
    Matrix.OrthoOffCenterRH = function (left, right, bottom, top, znear, zfar) {
        var matrix = new Matrix();
        Matrix.OrthoOffCenterRHToRef(left, right, bottom, top, znear, zfar, matrix);
        return matrix;
    };
    /**
     * Stores a right-handed orthographic projection into a given matrix
     * @param left defines the viewport left coordinate
     * @param right defines the viewport right coordinate
     * @param bottom defines the viewport bottom coordinate
     * @param top defines the viewport top coordinate
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param result defines the target matrix
     */
    Matrix.OrthoOffCenterRHToRef = function (left, right, bottom, top, znear, zfar, result) {
        Matrix.OrthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, result);
        result._m[10] *= -1; // No need to call _markAsUpdated as previous function already called it and let _isIdentityDirty to true
    };
    /**
     * Creates a left-handed perspective projection matrix
     * @param width defines the viewport width
     * @param height defines the viewport height
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @returns a new matrix as a left-handed perspective projection matrix
     */
    Matrix.PerspectiveLH = function (width, height, znear, zfar) {
        var matrix = new Matrix();
        var n = znear;
        var f = zfar;
        var a = 2.0 * n / width;
        var b = 2.0 * n / height;
        var c = (f + n) / (f - n);
        var d = -2.0 * f * n / (f - n);
        Matrix.FromValuesToRef(a, 0.0, 0.0, 0.0, 0.0, b, 0.0, 0.0, 0.0, 0.0, c, 1.0, 0.0, 0.0, d, 0.0, matrix);
        matrix._updateIdentityStatus(false);
        return matrix;
    };
    /**
     * Creates a left-handed perspective projection matrix
     * @param fov defines the horizontal field of view
     * @param aspect defines the aspect ratio
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @returns a new matrix as a left-handed perspective projection matrix
     */
    Matrix.PerspectiveFovLH = function (fov, aspect, znear, zfar) {
        var matrix = new Matrix();
        Matrix.PerspectiveFovLHToRef(fov, aspect, znear, zfar, matrix);
        return matrix;
    };
    /**
     * Stores a left-handed perspective projection into a given matrix
     * @param fov defines the horizontal field of view
     * @param aspect defines the aspect ratio
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param result defines the target matrix
     * @param isVerticalFovFixed defines it the fov is vertically fixed (default) or horizontally
     */
    Matrix.PerspectiveFovLHToRef = function (fov, aspect, znear, zfar, result, isVerticalFovFixed) {
        if (isVerticalFovFixed === void 0) { isVerticalFovFixed = true; }
        var n = znear;
        var f = zfar;
        var t = 1.0 / (Math.tan(fov * 0.5));
        var a = isVerticalFovFixed ? (t / aspect) : t;
        var b = isVerticalFovFixed ? t : (t * aspect);
        var c = (f + n) / (f - n);
        var d = -2.0 * f * n / (f - n);
        Matrix.FromValuesToRef(a, 0.0, 0.0, 0.0, 0.0, b, 0.0, 0.0, 0.0, 0.0, c, 1.0, 0.0, 0.0, d, 0.0, result);
        result._updateIdentityStatus(false);
    };
    /**
     * Creates a right-handed perspective projection matrix
     * @param fov defines the horizontal field of view
     * @param aspect defines the aspect ratio
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @returns a new matrix as a right-handed perspective projection matrix
     */
    Matrix.PerspectiveFovRH = function (fov, aspect, znear, zfar) {
        var matrix = new Matrix();
        Matrix.PerspectiveFovRHToRef(fov, aspect, znear, zfar, matrix);
        return matrix;
    };
    /**
     * Stores a right-handed perspective projection into a given matrix
     * @param fov defines the horizontal field of view
     * @param aspect defines the aspect ratio
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param result defines the target matrix
     * @param isVerticalFovFixed defines it the fov is vertically fixed (default) or horizontally
     */
    Matrix.PerspectiveFovRHToRef = function (fov, aspect, znear, zfar, result, isVerticalFovFixed) {
        //alternatively this could be expressed as:
        //    m = PerspectiveFovLHToRef
        //    m[10] *= -1.0;
        //    m[11] *= -1.0;
        if (isVerticalFovFixed === void 0) { isVerticalFovFixed = true; }
        var n = znear;
        var f = zfar;
        var t = 1.0 / (Math.tan(fov * 0.5));
        var a = isVerticalFovFixed ? (t / aspect) : t;
        var b = isVerticalFovFixed ? t : (t * aspect);
        var c = -(f + n) / (f - n);
        var d = -2 * f * n / (f - n);
        Matrix.FromValuesToRef(a, 0.0, 0.0, 0.0, 0.0, b, 0.0, 0.0, 0.0, 0.0, c, -1.0, 0.0, 0.0, d, 0.0, result);
        result._updateIdentityStatus(false);
    };
    /**
     * Stores a perspective projection for WebVR info a given matrix
     * @param fov defines the field of view
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param result defines the target matrix
     * @param rightHanded defines if the matrix must be in right-handed mode (false by default)
     */
    Matrix.PerspectiveFovWebVRToRef = function (fov, znear, zfar, result, rightHanded) {
        if (rightHanded === void 0) { rightHanded = false; }
        var rightHandedFactor = rightHanded ? -1 : 1;
        var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
        var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
        var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
        var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
        var xScale = 2.0 / (leftTan + rightTan);
        var yScale = 2.0 / (upTan + downTan);
        var m = result._m;
        m[0] = xScale;
        m[1] = m[2] = m[3] = m[4] = 0.0;
        m[5] = yScale;
        m[6] = m[7] = 0.0;
        m[8] = ((leftTan - rightTan) * xScale * 0.5);
        m[9] = -((upTan - downTan) * yScale * 0.5);
        m[10] = -zfar / (znear - zfar);
        m[11] = 1.0 * rightHandedFactor;
        m[12] = m[13] = m[15] = 0.0;
        m[14] = -(2.0 * zfar * znear) / (zfar - znear);
        result._markAsUpdated();
    };
    /**
     * Computes a complete transformation matrix
     * @param viewport defines the viewport to use
     * @param world defines the world matrix
     * @param view defines the view matrix
     * @param projection defines the projection matrix
     * @param zmin defines the near clip plane
     * @param zmax defines the far clip plane
     * @returns the transformation matrix
     */
    Matrix.GetFinalMatrix = function (viewport, world, view, projection, zmin, zmax) {
        var cw = viewport.width;
        var ch = viewport.height;
        var cx = viewport.x;
        var cy = viewport.y;
        var viewportMatrix = Matrix.FromValues(cw / 2.0, 0.0, 0.0, 0.0, 0.0, -ch / 2.0, 0.0, 0.0, 0.0, 0.0, zmax - zmin, 0.0, cx + cw / 2.0, ch / 2.0 + cy, zmin, 1.0);
        var matrix = MathTmp.Matrix[0];
        world.multiplyToRef(view, matrix);
        matrix.multiplyToRef(projection, matrix);
        return matrix.multiply(viewportMatrix);
    };
    /**
     * Extracts a 2x2 matrix from a given matrix and store the result in a Float32Array
     * @param matrix defines the matrix to use
     * @returns a new Float32Array array with 4 elements : the 2x2 matrix extracted from the given matrix
     */
    Matrix.GetAsMatrix2x2 = function (matrix) {
        var m = matrix.m;
        return new Float32Array([m[0], m[1], m[4], m[5]]);
    };
    /**
     * Extracts a 3x3 matrix from a given matrix and store the result in a Float32Array
     * @param matrix defines the matrix to use
     * @returns a new Float32Array array with 9 elements : the 3x3 matrix extracted from the given matrix
     */
    Matrix.GetAsMatrix3x3 = function (matrix) {
        var m = matrix.m;
        return new Float32Array([
            m[0], m[1], m[2],
            m[4], m[5], m[6],
            m[8], m[9], m[10]
        ]);
    };
    /**
     * Compute the transpose of a given matrix
     * @param matrix defines the matrix to transpose
     * @returns the new matrix
     */
    Matrix.Transpose = function (matrix) {
        var result = new Matrix();
        Matrix.TransposeToRef(matrix, result);
        return result;
    };
    /**
     * Compute the transpose of a matrix and store it in a target matrix
     * @param matrix defines the matrix to transpose
     * @param result defines the target matrix
     */
    Matrix.TransposeToRef = function (matrix, result) {
        var rm = result._m;
        var mm = matrix.m;
        rm[0] = mm[0];
        rm[1] = mm[4];
        rm[2] = mm[8];
        rm[3] = mm[12];
        rm[4] = mm[1];
        rm[5] = mm[5];
        rm[6] = mm[9];
        rm[7] = mm[13];
        rm[8] = mm[2];
        rm[9] = mm[6];
        rm[10] = mm[10];
        rm[11] = mm[14];
        rm[12] = mm[3];
        rm[13] = mm[7];
        rm[14] = mm[11];
        rm[15] = mm[15];
        // identity-ness does not change when transposing
        result._updateIdentityStatus(matrix._isIdentity, matrix._isIdentityDirty);
    };
    /**
     * Computes a reflection matrix from a plane
     * @param plane defines the reflection plane
     * @returns a new matrix
     */
    Matrix.Reflection = function (plane) {
        var matrix = new Matrix();
        Matrix.ReflectionToRef(plane, matrix);
        return matrix;
    };
    /**
     * Computes a reflection matrix from a plane
     * @param plane defines the reflection plane
     * @param result defines the target matrix
     */
    Matrix.ReflectionToRef = function (plane, result) {
        plane.normalize();
        var x = plane.normal.x;
        var y = plane.normal.y;
        var z = plane.normal.z;
        var temp = -2 * x;
        var temp2 = -2 * y;
        var temp3 = -2 * z;
        Matrix.FromValuesToRef(temp * x + 1, temp2 * x, temp3 * x, 0.0, temp * y, temp2 * y + 1, temp3 * y, 0.0, temp * z, temp2 * z, temp3 * z + 1, 0.0, temp * plane.d, temp2 * plane.d, temp3 * plane.d, 1.0, result);
    };
    /**
     * Sets the given matrix as a rotation matrix composed from the 3 left handed axes
     * @param xaxis defines the value of the 1st axis
     * @param yaxis defines the value of the 2nd axis
     * @param zaxis defines the value of the 3rd axis
     * @param result defines the target matrix
     */
    Matrix.FromXYZAxesToRef = function (xaxis, yaxis, zaxis, result) {
        Matrix.FromValuesToRef(xaxis.x, xaxis.y, xaxis.z, 0.0, yaxis.x, yaxis.y, yaxis.z, 0.0, zaxis.x, zaxis.y, zaxis.z, 0.0, 0.0, 0.0, 0.0, 1.0, result);
    };
    /**
     * Creates a rotation matrix from a quaternion and stores it in a target matrix
     * @param quat defines the quaternion to use
     * @param result defines the target matrix
     */
    Matrix.FromQuaternionToRef = function (quat, result) {
        var xx = quat.x * quat.x;
        var yy = quat.y * quat.y;
        var zz = quat.z * quat.z;
        var xy = quat.x * quat.y;
        var zw = quat.z * quat.w;
        var zx = quat.z * quat.x;
        var yw = quat.y * quat.w;
        var yz = quat.y * quat.z;
        var xw = quat.x * quat.w;
        result._m[0] = 1.0 - (2.0 * (yy + zz));
        result._m[1] = 2.0 * (xy + zw);
        result._m[2] = 2.0 * (zx - yw);
        result._m[3] = 0.0;
        result._m[4] = 2.0 * (xy - zw);
        result._m[5] = 1.0 - (2.0 * (zz + xx));
        result._m[6] = 2.0 * (yz + xw);
        result._m[7] = 0.0;
        result._m[8] = 2.0 * (zx + yw);
        result._m[9] = 2.0 * (yz - xw);
        result._m[10] = 1.0 - (2.0 * (yy + xx));
        result._m[11] = 0.0;
        result._m[12] = 0.0;
        result._m[13] = 0.0;
        result._m[14] = 0.0;
        result._m[15] = 1.0;
        result._markAsUpdated();
    };
    Matrix._updateFlagSeed = 0;
    Matrix._identityReadOnly = Matrix.Identity();
    return Matrix;
}());

/**
 * Represens a plane by the equation ax + by + cz + d = 0
 */
var Plane = /** @class */ (function () {
    /**
     * Creates a Plane object according to the given floats a, b, c, d and the plane equation : ax + by + cz + d = 0
     * @param a a component of the plane
     * @param b b component of the plane
     * @param c c component of the plane
     * @param d d component of the plane
     */
    function Plane(a, b, c, d) {
        this.normal = new Vector3(a, b, c);
        this.d = d;
    }
    /**
     * @returns the plane coordinates as a new array of 4 elements [a, b, c, d].
     */
    Plane.prototype.asArray = function () {
        return [this.normal.x, this.normal.y, this.normal.z, this.d];
    };
    // Methods
    /**
     * @returns a new plane copied from the current Plane.
     */
    Plane.prototype.clone = function () {
        return new Plane(this.normal.x, this.normal.y, this.normal.z, this.d);
    };
    /**
     * @returns the string "Plane".
     */
    Plane.prototype.getClassName = function () {
        return "Plane";
    };
    /**
     * @returns the Plane hash code.
     */
    Plane.prototype.getHashCode = function () {
        var hash = this.normal.getHashCode();
        hash = (hash * 397) ^ (this.d || 0);
        return hash;
    };
    /**
     * Normalize the current Plane in place.
     * @returns the updated Plane.
     */
    Plane.prototype.normalize = function () {
        var norm = (Math.sqrt((this.normal.x * this.normal.x) + (this.normal.y * this.normal.y) + (this.normal.z * this.normal.z)));
        var magnitude = 0.0;
        if (norm !== 0) {
            magnitude = 1.0 / norm;
        }
        this.normal.x *= magnitude;
        this.normal.y *= magnitude;
        this.normal.z *= magnitude;
        this.d *= magnitude;
        return this;
    };
    /**
     * Applies a transformation the plane and returns the result
     * @param transformation the transformation matrix to be applied to the plane
     * @returns a new Plane as the result of the transformation of the current Plane by the given matrix.
     */
    Plane.prototype.transform = function (transformation) {
        var transposedMatrix = MathTmp.Matrix[0];
        Matrix.TransposeToRef(transformation, transposedMatrix);
        var m = transposedMatrix.m;
        var x = this.normal.x;
        var y = this.normal.y;
        var z = this.normal.z;
        var d = this.d;
        var normalX = x * m[0] + y * m[1] + z * m[2] + d * m[3];
        var normalY = x * m[4] + y * m[5] + z * m[6] + d * m[7];
        var normalZ = x * m[8] + y * m[9] + z * m[10] + d * m[11];
        var finalD = x * m[12] + y * m[13] + z * m[14] + d * m[15];
        return new Plane(normalX, normalY, normalZ, finalD);
    };
    /**
     * Calcualtte the dot product between the point and the plane normal
     * @param point point to calculate the dot product with
     * @returns the dot product (float) of the point coordinates and the plane normal.
     */
    Plane.prototype.dotCoordinate = function (point) {
        return ((((this.normal.x * point.x) + (this.normal.y * point.y)) + (this.normal.z * point.z)) + this.d);
    };
    /**
     * Updates the current Plane from the plane defined by the three given points.
     * @param point1 one of the points used to contruct the plane
     * @param point2 one of the points used to contruct the plane
     * @param point3 one of the points used to contruct the plane
     * @returns the updated Plane.
     */
    Plane.prototype.copyFromPoints = function (point1, point2, point3) {
        var x1 = point2.x - point1.x;
        var y1 = point2.y - point1.y;
        var z1 = point2.z - point1.z;
        var x2 = point3.x - point1.x;
        var y2 = point3.y - point1.y;
        var z2 = point3.z - point1.z;
        var yz = (y1 * z2) - (z1 * y2);
        var xz = (z1 * x2) - (x1 * z2);
        var xy = (x1 * y2) - (y1 * x2);
        var pyth = (Math.sqrt((yz * yz) + (xz * xz) + (xy * xy)));
        var invPyth;
        if (pyth !== 0) {
            invPyth = 1.0 / pyth;
        }
        else {
            invPyth = 0.0;
        }
        this.normal.x = yz * invPyth;
        this.normal.y = xz * invPyth;
        this.normal.z = xy * invPyth;
        this.d = -((this.normal.x * point1.x) + (this.normal.y * point1.y) + (this.normal.z * point1.z));
        return this;
    };
    /**
     * Checks if the plane is facing a given direction
     * @param direction the direction to check if the plane is facing
     * @param epsilon value the dot product is compared against (returns true if dot <= epsilon)
     * @returns True is the vector "direction"  is the same side than the plane normal.
     */
    Plane.prototype.isFrontFacingTo = function (direction, epsilon) {
        var dot = Vector3.Dot(this.normal, direction);
        return (dot <= epsilon);
    };
    /**
     * Calculates the distance to a point
     * @param point point to calculate distance to
     * @returns the signed distance (float) from the given point to the Plane.
     */
    Plane.prototype.signedDistanceTo = function (point) {
        return Vector3.Dot(point, this.normal) + this.d;
    };
    // Statics
    /**
     * Creates a plane from an  array
     * @param array the array to create a plane from
     * @returns a new Plane from the given array.
     */
    Plane.FromArray = function (array) {
        return new Plane(array[0], array[1], array[2], array[3]);
    };
    /**
     * Creates a plane from three points
     * @param point1 point used to create the plane
     * @param point2 point used to create the plane
     * @param point3 point used to create the plane
     * @returns a new Plane defined by the three given points.
     */
    Plane.FromPoints = function (point1, point2, point3) {
        var result = new Plane(0.0, 0.0, 0.0, 0.0);
        result.copyFromPoints(point1, point2, point3);
        return result;
    };
    /**
     * Creates a plane from an origin point and a normal
     * @param origin origin of the plane to be constructed
     * @param normal normal of the plane to be constructed
     * @returns a new Plane the normal vector to this plane at the given origin point.
     * Note : the vector "normal" is updated because normalized.
     */
    Plane.FromPositionAndNormal = function (origin, normal) {
        var result = new Plane(0.0, 0.0, 0.0, 0.0);
        normal.normalize();
        result.normal = normal;
        result.d = -(normal.x * origin.x + normal.y * origin.y + normal.z * origin.z);
        return result;
    };
    /**
     * Calculates the distance from a plane and a point
     * @param origin origin of the plane to be constructed
     * @param normal normal of the plane to be constructed
     * @param point point to calculate distance to
     * @returns the signed distance between the plane defined by the normal vector at the "origin"" point and the given other point.
     */
    Plane.SignedDistanceToPlaneFromPositionAndNormal = function (origin, normal, point) {
        var d = -(normal.x * origin.x + normal.y * origin.y + normal.z * origin.z);
        return Vector3.Dot(point, normal) + d;
    };
    return Plane;
}());

/**
 * Class used to represent a viewport on screen
 */
var Viewport = /** @class */ (function () {
    /**
     * Creates a Viewport object located at (x, y) and sized (width, height)
     * @param x defines viewport left coordinate
     * @param y defines viewport top coordinate
     * @param width defines the viewport width
     * @param height defines the viewport height
     */
    function Viewport(
    /** viewport left coordinate */
    x, 
    /** viewport top coordinate */
    y, 
    /**viewport width */
    width, 
    /** viewport height */
    height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /**
     * Creates a new viewport using absolute sizing (from 0-> width, 0-> height instead of 0->1)
     * @param renderWidth defines the rendering width
     * @param renderHeight defines the rendering height
     * @returns a new Viewport
     */
    Viewport.prototype.toGlobal = function (renderWidth, renderHeight) {
        return new Viewport(this.x * renderWidth, this.y * renderHeight, this.width * renderWidth, this.height * renderHeight);
    };
    /**
     * Stores absolute viewport value into a target viewport (from 0-> width, 0-> height instead of 0->1)
     * @param renderWidth defines the rendering width
     * @param renderHeight defines the rendering height
     * @param ref defines the target viewport
     * @returns the current viewport
     */
    Viewport.prototype.toGlobalToRef = function (renderWidth, renderHeight, ref) {
        ref.x = this.x * renderWidth;
        ref.y = this.y * renderHeight;
        ref.width = this.width * renderWidth;
        ref.height = this.height * renderHeight;
        return this;
    };
    /**
     * Returns a new Viewport copied from the current one
     * @returns a new Viewport
     */
    Viewport.prototype.clone = function () {
        return new Viewport(this.x, this.y, this.width, this.height);
    };
    return Viewport;
}());

/**
 * Reprasents a camera frustum
 */
var Frustum = /** @class */ (function () {
    function Frustum() {
    }
    /**
     * Gets the planes representing the frustum
     * @param transform matrix to be applied to the returned planes
     * @returns a new array of 6 Frustum planes computed by the given transformation matrix.
     */
    Frustum.GetPlanes = function (transform) {
        var frustumPlanes = [];
        for (var index = 0; index < 6; index++) {
            frustumPlanes.push(new Plane(0.0, 0.0, 0.0, 0.0));
        }
        Frustum.GetPlanesToRef(transform, frustumPlanes);
        return frustumPlanes;
    };
    /**
     * Gets the near frustum plane transformed by the transform matrix
     * @param transform transformation matrix to be applied to the resulting frustum plane
     * @param frustumPlane the resuling frustum plane
     */
    Frustum.GetNearPlaneToRef = function (transform, frustumPlane) {
        var m = transform.m;
        frustumPlane.normal.x = m[3] + m[2];
        frustumPlane.normal.y = m[7] + m[6];
        frustumPlane.normal.z = m[11] + m[10];
        frustumPlane.d = m[15] + m[14];
        frustumPlane.normalize();
    };
    /**
     * Gets the far frustum plane transformed by the transform matrix
     * @param transform transformation matrix to be applied to the resulting frustum plane
     * @param frustumPlane the resuling frustum plane
     */
    Frustum.GetFarPlaneToRef = function (transform, frustumPlane) {
        var m = transform.m;
        frustumPlane.normal.x = m[3] - m[2];
        frustumPlane.normal.y = m[7] - m[6];
        frustumPlane.normal.z = m[11] - m[10];
        frustumPlane.d = m[15] - m[14];
        frustumPlane.normalize();
    };
    /**
     * Gets the left frustum plane transformed by the transform matrix
     * @param transform transformation matrix to be applied to the resulting frustum plane
     * @param frustumPlane the resuling frustum plane
     */
    Frustum.GetLeftPlaneToRef = function (transform, frustumPlane) {
        var m = transform.m;
        frustumPlane.normal.x = m[3] + m[0];
        frustumPlane.normal.y = m[7] + m[4];
        frustumPlane.normal.z = m[11] + m[8];
        frustumPlane.d = m[15] + m[12];
        frustumPlane.normalize();
    };
    /**
     * Gets the right frustum plane transformed by the transform matrix
     * @param transform transformation matrix to be applied to the resulting frustum plane
     * @param frustumPlane the resuling frustum plane
     */
    Frustum.GetRightPlaneToRef = function (transform, frustumPlane) {
        var m = transform.m;
        frustumPlane.normal.x = m[3] - m[0];
        frustumPlane.normal.y = m[7] - m[4];
        frustumPlane.normal.z = m[11] - m[8];
        frustumPlane.d = m[15] - m[12];
        frustumPlane.normalize();
    };
    /**
     * Gets the top frustum plane transformed by the transform matrix
     * @param transform transformation matrix to be applied to the resulting frustum plane
     * @param frustumPlane the resuling frustum plane
     */
    Frustum.GetTopPlaneToRef = function (transform, frustumPlane) {
        var m = transform.m;
        frustumPlane.normal.x = m[3] - m[1];
        frustumPlane.normal.y = m[7] - m[5];
        frustumPlane.normal.z = m[11] - m[9];
        frustumPlane.d = m[15] - m[13];
        frustumPlane.normalize();
    };
    /**
     * Gets the bottom frustum plane transformed by the transform matrix
     * @param transform transformation matrix to be applied to the resulting frustum plane
     * @param frustumPlane the resuling frustum plane
     */
    Frustum.GetBottomPlaneToRef = function (transform, frustumPlane) {
        var m = transform.m;
        frustumPlane.normal.x = m[3] + m[1];
        frustumPlane.normal.y = m[7] + m[5];
        frustumPlane.normal.z = m[11] + m[9];
        frustumPlane.d = m[15] + m[13];
        frustumPlane.normalize();
    };
    /**
     * Sets the given array "frustumPlanes" with the 6 Frustum planes computed by the given transformation matrix.
     * @param transform transformation matrix to be applied to the resulting frustum planes
     * @param frustumPlanes the resuling frustum planes
     */
    Frustum.GetPlanesToRef = function (transform, frustumPlanes) {
        // Near
        Frustum.GetNearPlaneToRef(transform, frustumPlanes[0]);
        // Far
        Frustum.GetFarPlaneToRef(transform, frustumPlanes[1]);
        // Left
        Frustum.GetLeftPlaneToRef(transform, frustumPlanes[2]);
        // Right
        Frustum.GetRightPlaneToRef(transform, frustumPlanes[3]);
        // Top
        Frustum.GetTopPlaneToRef(transform, frustumPlanes[4]);
        // Bottom
        Frustum.GetBottomPlaneToRef(transform, frustumPlanes[5]);
    };
    return Frustum;
}());

/** Defines supported spaces */
var Space;
(function (Space) {
    /** Local (object) space */
    Space[Space["LOCAL"] = 0] = "LOCAL";
    /** World space */
    Space[Space["WORLD"] = 1] = "WORLD";
    /** Bone space */
    Space[Space["BONE"] = 2] = "BONE";
})(Space || (Space = {}));
/** Defines the 3 main axes */
var Axis = /** @class */ (function () {
    function Axis() {
    }
    /** X axis */
    Axis.X = new Vector3(1.0, 0.0, 0.0);
    /** Y axis */
    Axis.Y = new Vector3(0.0, 1.0, 0.0);
    /** Z axis */
    Axis.Z = new Vector3(0.0, 0.0, 1.0);
    return Axis;
}());

/** Class used to represent a Bezier curve */
var BezierCurve = /** @class */ (function () {
    function BezierCurve() {
    }
    /**
     * Returns the cubic Bezier interpolated value (float) at "t" (float) from the given x1, y1, x2, y2 floats
     * @param t defines the time
     * @param x1 defines the left coordinate on X axis
     * @param y1 defines the left coordinate on Y axis
     * @param x2 defines the right coordinate on X axis
     * @param y2 defines the right coordinate on Y axis
     * @returns the interpolated value
     */
    BezierCurve.Interpolate = function (t, x1, y1, x2, y2) {
        // Extract X (which is equal to time here)
        var f0 = 1 - 3 * x2 + 3 * x1;
        var f1 = 3 * x2 - 6 * x1;
        var f2 = 3 * x1;
        var refinedT = t;
        for (var i = 0; i < 5; i++) {
            var refinedT2 = refinedT * refinedT;
            var refinedT3 = refinedT2 * refinedT;
            var x = f0 * refinedT3 + f1 * refinedT2 + f2 * refinedT;
            var slope = 1.0 / (3.0 * f0 * refinedT2 + 2.0 * f1 * refinedT + f2);
            refinedT -= (x - t) * slope;
            refinedT = Math.min(1, Math.max(0, refinedT));
        }
        // Resolve cubic bezier for the given x
        return 3 * Math.pow(1 - refinedT, 2) * refinedT * y1 +
            3 * (1 - refinedT) * Math.pow(refinedT, 2) * y2 +
            Math.pow(refinedT, 3);
    };
    return BezierCurve;
}());

/**
 * Defines potential orientation for back face culling
 */
var Orientation;
(function (Orientation) {
    /**
     * Clockwise
     */
    Orientation[Orientation["CW"] = 0] = "CW";
    /** Counter clockwise */
    Orientation[Orientation["CCW"] = 1] = "CCW";
})(Orientation || (Orientation = {}));
/**
 * Defines angle representation
 */
var Angle = /** @class */ (function () {
    /**
     * Creates an Angle object of "radians" radians (float).
     * @param radians the angle in radians
     */
    function Angle(radians) {
        this._radians = radians;
        if (this._radians < 0.0) {
            this._radians += (2.0 * Math.PI);
        }
    }
    /**
     * Get value in degrees
     * @returns the Angle value in degrees (float)
     */
    Angle.prototype.degrees = function () {
        return this._radians * 180.0 / Math.PI;
    };
    /**
     * Get value in radians
     * @returns the Angle value in radians (float)
     */
    Angle.prototype.radians = function () {
        return this._radians;
    };
    /**
     * Gets a new Angle object valued with the angle value in radians between the two given vectors
     * @param a defines first vector
     * @param b defines second vector
     * @returns a new Angle
     */
    Angle.BetweenTwoPoints = function (a, b) {
        var delta = b.subtract(a);
        var theta = Math.atan2(delta.y, delta.x);
        return new Angle(theta);
    };
    /**
     * Gets a new Angle object from the given float in radians
     * @param radians defines the angle value in radians
     * @returns a new Angle
     */
    Angle.FromRadians = function (radians) {
        return new Angle(radians);
    };
    /**
     * Gets a new Angle object from the given float in degrees
     * @param degrees defines the angle value in degrees
     * @returns a new Angle
     */
    Angle.FromDegrees = function (degrees) {
        return new Angle(degrees * Math.PI / 180.0);
    };
    return Angle;
}());

/**
 * This represents an arc in a 2d space.
 */
var Arc2 = /** @class */ (function () {
    /**
     * Creates an Arc object from the three given points : start, middle and end.
     * @param startPoint Defines the start point of the arc
     * @param midPoint Defines the midlle point of the arc
     * @param endPoint Defines the end point of the arc
     */
    function Arc2(
    /** Defines the start point of the arc */
    startPoint, 
    /** Defines the mid point of the arc */
    midPoint, 
    /** Defines the end point of the arc */
    endPoint) {
        this.startPoint = startPoint;
        this.midPoint = midPoint;
        this.endPoint = endPoint;
        var temp = Math.pow(midPoint.x, 2) + Math.pow(midPoint.y, 2);
        var startToMid = (Math.pow(startPoint.x, 2) + Math.pow(startPoint.y, 2) - temp) / 2.;
        var midToEnd = (temp - Math.pow(endPoint.x, 2) - Math.pow(endPoint.y, 2)) / 2.;
        var det = (startPoint.x - midPoint.x) * (midPoint.y - endPoint.y) - (midPoint.x - endPoint.x) * (startPoint.y - midPoint.y);
        this.centerPoint = new Vector2((startToMid * (midPoint.y - endPoint.y) - midToEnd * (startPoint.y - midPoint.y)) / det, ((startPoint.x - midPoint.x) * midToEnd - (midPoint.x - endPoint.x) * startToMid) / det);
        this.radius = this.centerPoint.subtract(this.startPoint).length();
        this.startAngle = Angle.BetweenTwoPoints(this.centerPoint, this.startPoint);
        var a1 = this.startAngle.degrees();
        var a2 = Angle.BetweenTwoPoints(this.centerPoint, this.midPoint).degrees();
        var a3 = Angle.BetweenTwoPoints(this.centerPoint, this.endPoint).degrees();
        // angles correction
        if (a2 - a1 > +180.0) {
            a2 -= 360.0;
        }
        if (a2 - a1 < -180.0) {
            a2 += 360.0;
        }
        if (a3 - a2 > +180.0) {
            a3 -= 360.0;
        }
        if (a3 - a2 < -180.0) {
            a3 += 360.0;
        }
        this.orientation = (a2 - a1) < 0 ? Orientation.CW : Orientation.CCW;
        this.angle = Angle.FromDegrees(this.orientation === Orientation.CW ? a1 - a3 : a3 - a1);
    }
    return Arc2;
}());

/**
 * Represents a 2D path made up of multiple 2D points
 */
var Path2 = /** @class */ (function () {
    /**
     * Creates a Path2 object from the starting 2D coordinates x and y.
     * @param x the starting points x value
     * @param y the starting points y value
     */
    function Path2(x, y) {
        this._points = new Array();
        this._length = 0.0;
        /**
         * If the path start and end point are the same
         */
        this.closed = false;
        this._points.push(new Vector2(x, y));
    }
    /**
     * Adds a new segment until the given coordinates (x, y) to the current Path2.
     * @param x the added points x value
     * @param y the added points y value
     * @returns the updated Path2.
     */
    Path2.prototype.addLineTo = function (x, y) {
        if (this.closed) {
            return this;
        }
        var newPoint = new Vector2(x, y);
        var previousPoint = this._points[this._points.length - 1];
        this._points.push(newPoint);
        this._length += newPoint.subtract(previousPoint).length();
        return this;
    };
    /**
     * Adds _numberOfSegments_ segments according to the arc definition (middle point coordinates, end point coordinates, the arc start point being the current Path2 last point) to the current Path2.
     * @param midX middle point x value
     * @param midY middle point y value
     * @param endX end point x value
     * @param endY end point y value
     * @param numberOfSegments (default: 36)
     * @returns the updated Path2.
     */
    Path2.prototype.addArcTo = function (midX, midY, endX, endY, numberOfSegments) {
        if (numberOfSegments === void 0) { numberOfSegments = 36; }
        if (this.closed) {
            return this;
        }
        var startPoint = this._points[this._points.length - 1];
        var midPoint = new Vector2(midX, midY);
        var endPoint = new Vector2(endX, endY);
        var arc = new Arc2(startPoint, midPoint, endPoint);
        var increment = arc.angle.radians() / numberOfSegments;
        if (arc.orientation === Orientation.CW) {
            increment *= -1;
        }
        var currentAngle = arc.startAngle.radians() + increment;
        for (var i = 0; i < numberOfSegments; i++) {
            var x = Math.cos(currentAngle) * arc.radius + arc.centerPoint.x;
            var y = Math.sin(currentAngle) * arc.radius + arc.centerPoint.y;
            this.addLineTo(x, y);
            currentAngle += increment;
        }
        return this;
    };
    /**
     * Closes the Path2.
     * @returns the Path2.
     */
    Path2.prototype.close = function () {
        this.closed = true;
        return this;
    };
    /**
     * Gets the sum of the distance between each sequential point in the path
     * @returns the Path2 total length (float).
     */
    Path2.prototype.length = function () {
        var result = this._length;
        if (!this.closed) {
            var lastPoint = this._points[this._points.length - 1];
            var firstPoint = this._points[0];
            result += (firstPoint.subtract(lastPoint).length());
        }
        return result;
    };
    /**
     * Gets the points which construct the path
     * @returns the Path2 internal array of points.
     */
    Path2.prototype.getPoints = function () {
        return this._points;
    };
    /**
     * Retreives the point at the distance aways from the starting point
     * @param normalizedLengthPosition the length along the path to retreive the point from
     * @returns a new Vector2 located at a percentage of the Path2 total length on this path.
     */
    Path2.prototype.getPointAtLengthPosition = function (normalizedLengthPosition) {
        if (normalizedLengthPosition < 0 || normalizedLengthPosition > 1) {
            return Vector2.Zero();
        }
        var lengthPosition = normalizedLengthPosition * this.length();
        var previousOffset = 0;
        for (var i = 0; i < this._points.length; i++) {
            var j = (i + 1) % this._points.length;
            var a = this._points[i];
            var b = this._points[j];
            var bToA = b.subtract(a);
            var nextOffset = (bToA.length() + previousOffset);
            if (lengthPosition >= previousOffset && lengthPosition <= nextOffset) {
                var dir = bToA.normalize();
                var localOffset = lengthPosition - previousOffset;
                return new Vector2(a.x + (dir.x * localOffset), a.y + (dir.y * localOffset));
            }
            previousOffset = nextOffset;
        }
        return Vector2.Zero();
    };
    /**
     * Creates a new path starting from an x and y position
     * @param x starting x value
     * @param y starting y value
     * @returns a new Path2 starting at the coordinates (x, y).
     */
    Path2.StartingAt = function (x, y) {
        return new Path2(x, y);
    };
    return Path2;
}());

/**
 * Represents a 3D path made up of multiple 3D points
 */
var Path3D = /** @class */ (function () {
    /**
    * new Path3D(path, normal, raw)
    * Creates a Path3D. A Path3D is a logical math object, so not a mesh.
    * please read the description in the tutorial : https://doc.babylonjs.com/how_to/how_to_use_path3d
    * @param path an array of Vector3, the curve axis of the Path3D
    * @param firstNormal (options) Vector3, the first wanted normal to the curve. Ex (0, 1, 0) for a vertical normal.
    * @param raw (optional, default false) : boolean, if true the returned Path3D isn't normalized. Useful to depict path acceleration or speed.
    */
    function Path3D(
    /**
     * an array of Vector3, the curve axis of the Path3D
     */
    path, firstNormal, raw) {
        if (firstNormal === void 0) { firstNormal = null; }
        this.path = path;
        this._curve = new Array();
        this._distances = new Array();
        this._tangents = new Array();
        this._normals = new Array();
        this._binormals = new Array();
        for (var p = 0; p < path.length; p++) {
            this._curve[p] = path[p].clone(); // hard copy
        }
        this._raw = raw || false;
        this._compute(firstNormal);
    }
    /**
     * Returns the Path3D array of successive Vector3 designing its curve.
     * @returns the Path3D array of successive Vector3 designing its curve.
     */
    Path3D.prototype.getCurve = function () {
        return this._curve;
    };
    /**
     * Returns an array populated with tangent vectors on each Path3D curve point.
     * @returns an array populated with tangent vectors on each Path3D curve point.
     */
    Path3D.prototype.getTangents = function () {
        return this._tangents;
    };
    /**
     * Returns an array populated with normal vectors on each Path3D curve point.
     * @returns an array populated with normal vectors on each Path3D curve point.
     */
    Path3D.prototype.getNormals = function () {
        return this._normals;
    };
    /**
     * Returns an array populated with binormal vectors on each Path3D curve point.
     * @returns an array populated with binormal vectors on each Path3D curve point.
     */
    Path3D.prototype.getBinormals = function () {
        return this._binormals;
    };
    /**
     * Returns an array populated with distances (float) of the i-th point from the first curve point.
     * @returns an array populated with distances (float) of the i-th point from the first curve point.
     */
    Path3D.prototype.getDistances = function () {
        return this._distances;
    };
    /**
     * Forces the Path3D tangent, normal, binormal and distance recomputation.
     * @param path path which all values are copied into the curves points
     * @param firstNormal which should be projected onto the curve
     * @returns the same object updated.
     */
    Path3D.prototype.update = function (path, firstNormal) {
        if (firstNormal === void 0) { firstNormal = null; }
        for (var p = 0; p < path.length; p++) {
            this._curve[p].x = path[p].x;
            this._curve[p].y = path[p].y;
            this._curve[p].z = path[p].z;
        }
        this._compute(firstNormal);
        return this;
    };
    // private function compute() : computes tangents, normals and binormals
    Path3D.prototype._compute = function (firstNormal) {
        var l = this._curve.length;
        // first and last tangents
        this._tangents[0] = this._getFirstNonNullVector(0);
        if (!this._raw) {
            this._tangents[0].normalize();
        }
        this._tangents[l - 1] = this._curve[l - 1].subtract(this._curve[l - 2]);
        if (!this._raw) {
            this._tangents[l - 1].normalize();
        }
        // normals and binormals at first point : arbitrary vector with _normalVector()
        var tg0 = this._tangents[0];
        var pp0 = this._normalVector(tg0, firstNormal);
        this._normals[0] = pp0;
        if (!this._raw) {
            this._normals[0].normalize();
        }
        this._binormals[0] = Vector3.Cross(tg0, this._normals[0]);
        if (!this._raw) {
            this._binormals[0].normalize();
        }
        this._distances[0] = 0.0;
        // normals and binormals : next points
        var prev; // previous vector (segment)
        var cur; // current vector (segment)
        var curTang; // current tangent
        // previous normal
        var prevBinor; // previous binormal
        for (var i = 1; i < l; i++) {
            // tangents
            prev = this._getLastNonNullVector(i);
            if (i < l - 1) {
                cur = this._getFirstNonNullVector(i);
                this._tangents[i] = prev.add(cur);
                this._tangents[i].normalize();
            }
            this._distances[i] = this._distances[i - 1] + prev.length();
            // normals and binormals
            // http://www.cs.cmu.edu/afs/andrew/scs/cs/15-462/web/old/asst2camera.html
            curTang = this._tangents[i];
            prevBinor = this._binormals[i - 1];
            this._normals[i] = Vector3.Cross(prevBinor, curTang);
            if (!this._raw) {
                this._normals[i].normalize();
            }
            this._binormals[i] = Vector3.Cross(curTang, this._normals[i]);
            if (!this._raw) {
                this._binormals[i].normalize();
            }
        }
    };
    // private function getFirstNonNullVector(index)
    // returns the first non null vector from index : curve[index + N].subtract(curve[index])
    Path3D.prototype._getFirstNonNullVector = function (index) {
        var i = 1;
        var nNVector = this._curve[index + i].subtract(this._curve[index]);
        while (nNVector.length() === 0 && index + i + 1 < this._curve.length) {
            i++;
            nNVector = this._curve[index + i].subtract(this._curve[index]);
        }
        return nNVector;
    };
    // private function getLastNonNullVector(index)
    // returns the last non null vector from index : curve[index].subtract(curve[index - N])
    Path3D.prototype._getLastNonNullVector = function (index) {
        var i = 1;
        var nLVector = this._curve[index].subtract(this._curve[index - i]);
        while (nLVector.length() === 0 && index > i + 1) {
            i++;
            nLVector = this._curve[index].subtract(this._curve[index - i]);
        }
        return nLVector;
    };
    // private function normalVector(v0, vt, va) :
    // returns an arbitrary point in the plane defined by the point v0 and the vector vt orthogonal to this plane
    // if va is passed, it returns the va projection on the plane orthogonal to vt at the point v0
    Path3D.prototype._normalVector = function (vt, va) {
        var normal0;
        var tgl = vt.length();
        if (tgl === 0.0) {
            tgl = 1.0;
        }
        if (va === undefined || va === null) {
            var point;
            if (!Scalar.WithinEpsilon(Math.abs(vt.y) / tgl, 1.0, Epsilon)) { // search for a point in the plane
                point = new Vector3(0.0, -1.0, 0.0);
            }
            else if (!Scalar.WithinEpsilon(Math.abs(vt.x) / tgl, 1.0, Epsilon)) {
                point = new Vector3(1.0, 0.0, 0.0);
            }
            else if (!Scalar.WithinEpsilon(Math.abs(vt.z) / tgl, 1.0, Epsilon)) {
                point = new Vector3(0.0, 0.0, 1.0);
            }
            else {
                point = Vector3.Zero();
            }
            normal0 = Vector3.Cross(vt, point);
        }
        else {
            normal0 = Vector3.Cross(vt, va);
            Vector3.CrossToRef(normal0, vt, normal0);
        }
        normal0.normalize();
        return normal0;
    };
    return Path3D;
}());

/**
 * A Curve3 object is a logical object, so not a mesh, to handle curves in the 3D geometric space.
 * A Curve3 is designed from a series of successive Vector3.
 * @see https://doc.babylonjs.com/how_to/how_to_use_curve3
 */
var Curve3 = /** @class */ (function () {
    /**
     * A Curve3 object is a logical object, so not a mesh, to handle curves in the 3D geometric space.
     * A Curve3 is designed from a series of successive Vector3.
     * Tuto : https://doc.babylonjs.com/how_to/how_to_use_curve3#curve3-object
     * @param points points which make up the curve
     */
    function Curve3(points) {
        this._length = 0.0;
        this._points = points;
        this._length = this._computeLength(points);
    }
    /**
     * Returns a Curve3 object along a Quadratic Bezier curve : https://doc.babylonjs.com/how_to/how_to_use_curve3#quadratic-bezier-curve
     * @param v0 (Vector3) the origin point of the Quadratic Bezier
     * @param v1 (Vector3) the control point
     * @param v2 (Vector3) the end point of the Quadratic Bezier
     * @param nbPoints (integer) the wanted number of points in the curve
     * @returns the created Curve3
     */
    Curve3.CreateQuadraticBezier = function (v0, v1, v2, nbPoints) {
        nbPoints = nbPoints > 2 ? nbPoints : 3;
        var bez = new Array();
        var equation = function (t, val0, val1, val2) {
            var res = (1.0 - t) * (1.0 - t) * val0 + 2.0 * t * (1.0 - t) * val1 + t * t * val2;
            return res;
        };
        for (var i = 0; i <= nbPoints; i++) {
            bez.push(new Vector3(equation(i / nbPoints, v0.x, v1.x, v2.x), equation(i / nbPoints, v0.y, v1.y, v2.y), equation(i / nbPoints, v0.z, v1.z, v2.z)));
        }
        return new Curve3(bez);
    };
    /**
     * Returns a Curve3 object along a Cubic Bezier curve : https://doc.babylonjs.com/how_to/how_to_use_curve3#cubic-bezier-curve
     * @param v0 (Vector3) the origin point of the Cubic Bezier
     * @param v1 (Vector3) the first control point
     * @param v2 (Vector3) the second control point
     * @param v3 (Vector3) the end point of the Cubic Bezier
     * @param nbPoints (integer) the wanted number of points in the curve
     * @returns the created Curve3
     */
    Curve3.CreateCubicBezier = function (v0, v1, v2, v3, nbPoints) {
        nbPoints = nbPoints > 3 ? nbPoints : 4;
        var bez = new Array();
        var equation = function (t, val0, val1, val2, val3) {
            var res = (1.0 - t) * (1.0 - t) * (1.0 - t) * val0 + 3.0 * t * (1.0 - t) * (1.0 - t) * val1 + 3.0 * t * t * (1.0 - t) * val2 + t * t * t * val3;
            return res;
        };
        for (var i = 0; i <= nbPoints; i++) {
            bez.push(new Vector3(equation(i / nbPoints, v0.x, v1.x, v2.x, v3.x), equation(i / nbPoints, v0.y, v1.y, v2.y, v3.y), equation(i / nbPoints, v0.z, v1.z, v2.z, v3.z)));
        }
        return new Curve3(bez);
    };
    /**
     * Returns a Curve3 object along a Hermite Spline curve : https://doc.babylonjs.com/how_to/how_to_use_curve3#hermite-spline
     * @param p1 (Vector3) the origin point of the Hermite Spline
     * @param t1 (Vector3) the tangent vector at the origin point
     * @param p2 (Vector3) the end point of the Hermite Spline
     * @param t2 (Vector3) the tangent vector at the end point
     * @param nbPoints (integer) the wanted number of points in the curve
     * @returns the created Curve3
     */
    Curve3.CreateHermiteSpline = function (p1, t1, p2, t2, nbPoints) {
        var hermite = new Array();
        var step = 1.0 / nbPoints;
        for (var i = 0; i <= nbPoints; i++) {
            hermite.push(Vector3.Hermite(p1, t1, p2, t2, i * step));
        }
        return new Curve3(hermite);
    };
    /**
     * Returns a Curve3 object along a CatmullRom Spline curve :
     * @param points (array of Vector3) the points the spline must pass through. At least, four points required
     * @param nbPoints (integer) the wanted number of points between each curve control points
     * @param closed (boolean) optional with default false, when true forms a closed loop from the points
     * @returns the created Curve3
     */
    Curve3.CreateCatmullRomSpline = function (points, nbPoints, closed) {
        var catmullRom = new Array();
        var step = 1.0 / nbPoints;
        var amount = 0.0;
        if (closed) {
            var pointsCount = points.length;
            for (var i = 0; i < pointsCount; i++) {
                amount = 0;
                for (var c = 0; c < nbPoints; c++) {
                    catmullRom.push(Vector3.CatmullRom(points[i % pointsCount], points[(i + 1) % pointsCount], points[(i + 2) % pointsCount], points[(i + 3) % pointsCount], amount));
                    amount += step;
                }
            }
            catmullRom.push(catmullRom[0]);
        }
        else {
            var totalPoints = new Array();
            totalPoints.push(points[0].clone());
            Array.prototype.push.apply(totalPoints, points);
            totalPoints.push(points[points.length - 1].clone());
            for (var i = 0; i < totalPoints.length - 3; i++) {
                amount = 0;
                for (var c = 0; c < nbPoints; c++) {
                    catmullRom.push(Vector3.CatmullRom(totalPoints[i], totalPoints[i + 1], totalPoints[i + 2], totalPoints[i + 3], amount));
                    amount += step;
                }
            }
            i--;
            catmullRom.push(Vector3.CatmullRom(totalPoints[i], totalPoints[i + 1], totalPoints[i + 2], totalPoints[i + 3], amount));
        }
        return new Curve3(catmullRom);
    };
    /**
     * @returns the Curve3 stored array of successive Vector3
     */
    Curve3.prototype.getPoints = function () {
        return this._points;
    };
    /**
     * @returns the computed length (float) of the curve.
     */
    Curve3.prototype.length = function () {
        return this._length;
    };
    /**
     * Returns a new instance of Curve3 object : var curve = curveA.continue(curveB);
     * This new Curve3 is built by translating and sticking the curveB at the end of the curveA.
     * curveA and curveB keep unchanged.
     * @param curve the curve to continue from this curve
     * @returns the newly constructed curve
     */
    Curve3.prototype.continue = function (curve) {
        var lastPoint = this._points[this._points.length - 1];
        var continuedPoints = this._points.slice();
        var curvePoints = curve.getPoints();
        for (var i = 1; i < curvePoints.length; i++) {
            continuedPoints.push(curvePoints[i].subtract(curvePoints[0]).add(lastPoint));
        }
        var continuedCurve = new Curve3(continuedPoints);
        return continuedCurve;
    };
    Curve3.prototype._computeLength = function (path) {
        var l = 0;
        for (var i = 1; i < path.length; i++) {
            l += (path[i].subtract(path[i - 1])).length();
        }
        return l;
    };
    return Curve3;
}());

// Vertex formats
/**
 * Contains position and normal vectors for a vertex
 */
var PositionNormalVertex = /** @class */ (function () {
    /**
     * Creates a PositionNormalVertex
     * @param position the position of the vertex (defaut: 0,0,0)
     * @param normal the normal of the vertex (defaut: 0,1,0)
     */
    function PositionNormalVertex(
    /** the position of the vertex (defaut: 0,0,0) */
    position, 
    /** the normal of the vertex (defaut: 0,1,0) */
    normal) {
        if (position === void 0) { position = Vector3.Zero(); }
        if (normal === void 0) { normal = Vector3.Up(); }
        this.position = position;
        this.normal = normal;
    }
    /**
     * Clones the PositionNormalVertex
     * @returns the cloned PositionNormalVertex
     */
    PositionNormalVertex.prototype.clone = function () {
        return new PositionNormalVertex(this.position.clone(), this.normal.clone());
    };
    return PositionNormalVertex;
}());

/**
 * Contains position, normal and uv vectors for a vertex
 */
var PositionNormalTextureVertex = /** @class */ (function () {
    /**
     * Creates a PositionNormalTextureVertex
     * @param position the position of the vertex (defaut: 0,0,0)
     * @param normal the normal of the vertex (defaut: 0,1,0)
     * @param uv the uv of the vertex (default: 0,0)
     */
    function PositionNormalTextureVertex(
    /** the position of the vertex (defaut: 0,0,0) */
    position, 
    /** the normal of the vertex (defaut: 0,1,0) */
    normal, 
    /** the uv of the vertex (default: 0,0) */
    uv) {
        if (position === void 0) { position = Vector3.Zero(); }
        if (normal === void 0) { normal = Vector3.Up(); }
        if (uv === void 0) { uv = Vector2.Zero(); }
        this.position = position;
        this.normal = normal;
        this.uv = uv;
    }
    /**
     * Clones the PositionNormalTextureVertex
     * @returns the cloned PositionNormalTextureVertex
     */
    PositionNormalTextureVertex.prototype.clone = function () {
        return new PositionNormalTextureVertex(this.position.clone(), this.normal.clone(), this.uv.clone());
    };
    return PositionNormalTextureVertex;
}());

// Temporary pre-allocated objects for engine internal use
// usage in any internal function :
// var tmp = Tmp.Vector3[0];   <= gets access to the first pre-created Vector3
// There's a Tmp array per object type : int, float, Vector2, Vector3, Vector4, Quaternion, Matrix
/**
 * @hidden
 */
var Tmp = /** @class */ (function () {
    function Tmp() {
    }
    Tmp.Color3 = ArrayTools.BuildArray(3, Color3.Black);
    Tmp.Color4 = ArrayTools.BuildArray(3, function () { return new Color4(0, 0, 0, 0); });
    Tmp.Vector2 = ArrayTools.BuildArray(3, Vector2.Zero); // 3 temp Vector2 at once should be enough
    Tmp.Vector3 = ArrayTools.BuildArray(13, Vector3.Zero); // 13 temp Vector3 at once should be enough
    Tmp.Vector4 = ArrayTools.BuildArray(3, Vector4.Zero); // 3 temp Vector4 at once should be enough
    Tmp.Quaternion = ArrayTools.BuildArray(2, Quaternion.Zero); // 2 temp Quaternion at once should be enough
    Tmp.Matrix = ArrayTools.BuildArray(8, Matrix.Identity); // 8 temp Matrices at once should be enough
    return Tmp;
}());

/**
 * @hidden
 * Same as Tmp but not exported to keep it only for math functions to avoid conflicts
 */
var MathTmp = /** @class */ (function () {
    function MathTmp() {
    }
    MathTmp.Vector3 = ArrayTools.BuildArray(6, Vector3.Zero);
    MathTmp.Matrix = ArrayTools.BuildArray(2, Matrix.Identity);
    MathTmp.Quaternion = ArrayTools.BuildArray(3, Quaternion.Zero);
    return MathTmp;
}());
//# sourceMappingURL=math.js.map
;// CONCATENATED MODULE: ./node_modules/tslib/tslib.es6.js
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/observable.js
/**
 * A class serves as a medium between the observable and its observers
 */
var EventState = /** @class */ (function () {
    /**
     * Create a new EventState
     * @param mask defines the mask associated with this state
     * @param skipNextObservers defines a flag which will instruct the observable to skip following observers when set to true
     * @param target defines the original target of the state
     * @param currentTarget defines the current target of the state
     */
    function EventState(mask, skipNextObservers, target, currentTarget) {
        if (skipNextObservers === void 0) { skipNextObservers = false; }
        this.initalize(mask, skipNextObservers, target, currentTarget);
    }
    /**
     * Initialize the current event state
     * @param mask defines the mask associated with this state
     * @param skipNextObservers defines a flag which will instruct the observable to skip following observers when set to true
     * @param target defines the original target of the state
     * @param currentTarget defines the current target of the state
     * @returns the current event state
     */
    EventState.prototype.initalize = function (mask, skipNextObservers, target, currentTarget) {
        if (skipNextObservers === void 0) { skipNextObservers = false; }
        this.mask = mask;
        this.skipNextObservers = skipNextObservers;
        this.target = target;
        this.currentTarget = currentTarget;
        return this;
    };
    return EventState;
}());

/**
 * Represent an Observer registered to a given Observable object.
 */
var Observer = /** @class */ (function () {
    /**
     * Creates a new observer
     * @param callback defines the callback to call when the observer is notified
     * @param mask defines the mask of the observer (used to filter notifications)
     * @param scope defines the current scope used to restore the JS context
     */
    function Observer(
    /**
     * Defines the callback to call when the observer is notified
     */
    callback, 
    /**
     * Defines the mask of the observer (used to filter notifications)
     */
    mask, 
    /**
     * Defines the current scope used to restore the JS context
     */
    scope) {
        if (scope === void 0) { scope = null; }
        this.callback = callback;
        this.mask = mask;
        this.scope = scope;
        /** @hidden */
        this._willBeUnregistered = false;
        /**
         * Gets or sets a property defining that the observer as to be unregistered after the next notification
         */
        this.unregisterOnNextCall = false;
    }
    return Observer;
}());

/**
 * Represent a list of observers registered to multiple Observables object.
 */
var MultiObserver = /** @class */ (function () {
    function MultiObserver() {
    }
    /**
     * Release associated resources
     */
    MultiObserver.prototype.dispose = function () {
        if (this._observers && this._observables) {
            for (var index = 0; index < this._observers.length; index++) {
                this._observables[index].remove(this._observers[index]);
            }
        }
        this._observers = null;
        this._observables = null;
    };
    /**
     * Raise a callback when one of the observable will notify
     * @param observables defines a list of observables to watch
     * @param callback defines the callback to call on notification
     * @param mask defines the mask used to filter notifications
     * @param scope defines the current scope used to restore the JS context
     * @returns the new MultiObserver
     */
    MultiObserver.Watch = function (observables, callback, mask, scope) {
        if (mask === void 0) { mask = -1; }
        if (scope === void 0) { scope = null; }
        var result = new MultiObserver();
        result._observers = new Array();
        result._observables = observables;
        for (var _i = 0, observables_1 = observables; _i < observables_1.length; _i++) {
            var observable = observables_1[_i];
            var observer = observable.add(callback, mask, false, scope);
            if (observer) {
                result._observers.push(observer);
            }
        }
        return result;
    };
    return MultiObserver;
}());

/**
 * The Observable class is a simple implementation of the Observable pattern.
 *
 * There's one slight particularity though: a given Observable can notify its observer using a particular mask value, only the Observers registered with this mask value will be notified.
 * This enable a more fine grained execution without having to rely on multiple different Observable objects.
 * For instance you may have a given Observable that have four different types of notifications: Move (mask = 0x01), Stop (mask = 0x02), Turn Right (mask = 0X04), Turn Left (mask = 0X08).
 * A given observer can register itself with only Move and Stop (mask = 0x03), then it will only be notified when one of these two occurs and will never be for Turn Left/Right.
 */
var Observable = /** @class */ (function () {
    /**
     * Creates a new observable
     * @param onObserverAdded defines a callback to call when a new observer is added
     */
    function Observable(onObserverAdded) {
        this._observers = new Array();
        this._eventState = new EventState(0);
        if (onObserverAdded) {
            this._onObserverAdded = onObserverAdded;
        }
    }
    /**
     * Create a new Observer with the specified callback
     * @param callback the callback that will be executed for that Observer
     * @param mask the mask used to filter observers
     * @param insertFirst if true the callback will be inserted at the first position, hence executed before the others ones. If false (default behavior) the callback will be inserted at the last position, executed after all the others already present.
     * @param scope optional scope for the callback to be called from
     * @param unregisterOnFirstCall defines if the observer as to be unregistered after the next notification
     * @returns the new observer created for the callback
     */
    Observable.prototype.add = function (callback, mask, insertFirst, scope, unregisterOnFirstCall) {
        if (mask === void 0) { mask = -1; }
        if (insertFirst === void 0) { insertFirst = false; }
        if (scope === void 0) { scope = null; }
        if (unregisterOnFirstCall === void 0) { unregisterOnFirstCall = false; }
        if (!callback) {
            return null;
        }
        var observer = new Observer(callback, mask, scope);
        observer.unregisterOnNextCall = unregisterOnFirstCall;
        if (insertFirst) {
            this._observers.unshift(observer);
        }
        else {
            this._observers.push(observer);
        }
        if (this._onObserverAdded) {
            this._onObserverAdded(observer);
        }
        return observer;
    };
    /**
     * Create a new Observer with the specified callback and unregisters after the next notification
     * @param callback the callback that will be executed for that Observer
     * @returns the new observer created for the callback
     */
    Observable.prototype.addOnce = function (callback) {
        return this.add(callback, undefined, undefined, undefined, true);
    };
    /**
     * Remove an Observer from the Observable object
     * @param observer the instance of the Observer to remove
     * @returns false if it doesn't belong to this Observable
     */
    Observable.prototype.remove = function (observer) {
        if (!observer) {
            return false;
        }
        var index = this._observers.indexOf(observer);
        if (index !== -1) {
            this._deferUnregister(observer);
            return true;
        }
        return false;
    };
    /**
     * Remove a callback from the Observable object
     * @param callback the callback to remove
     * @param scope optional scope. If used only the callbacks with this scope will be removed
     * @returns false if it doesn't belong to this Observable
    */
    Observable.prototype.removeCallback = function (callback, scope) {
        for (var index = 0; index < this._observers.length; index++) {
            if (this._observers[index].callback === callback && (!scope || scope === this._observers[index].scope)) {
                this._deferUnregister(this._observers[index]);
                return true;
            }
        }
        return false;
    };
    Observable.prototype._deferUnregister = function (observer) {
        var _this = this;
        observer.unregisterOnNextCall = false;
        observer._willBeUnregistered = true;
        setTimeout(function () {
            _this._remove(observer);
        }, 0);
    };
    // This should only be called when not iterating over _observers to avoid callback skipping.
    // Removes an observer from the _observer Array.
    Observable.prototype._remove = function (observer) {
        if (!observer) {
            return false;
        }
        var index = this._observers.indexOf(observer);
        if (index !== -1) {
            this._observers.splice(index, 1);
            return true;
        }
        return false;
    };
    /**
     * Moves the observable to the top of the observer list making it get called first when notified
     * @param observer the observer to move
     */
    Observable.prototype.makeObserverTopPriority = function (observer) {
        this._remove(observer);
        this._observers.unshift(observer);
    };
    /**
     * Moves the observable to the bottom of the observer list making it get called last when notified
     * @param observer the observer to move
     */
    Observable.prototype.makeObserverBottomPriority = function (observer) {
        this._remove(observer);
        this._observers.push(observer);
    };
    /**
     * Notify all Observers by calling their respective callback with the given data
     * Will return true if all observers were executed, false if an observer set skipNextObservers to true, then prevent the subsequent ones to execute
     * @param eventData defines the data to send to all observers
     * @param mask defines the mask of the current notification (observers with incompatible mask (ie mask & observer.mask === 0) will not be notified)
     * @param target defines the original target of the state
     * @param currentTarget defines the current target of the state
     * @returns false if the complete observer chain was not processed (because one observer set the skipNextObservers to true)
     */
    Observable.prototype.notifyObservers = function (eventData, mask, target, currentTarget) {
        if (mask === void 0) { mask = -1; }
        if (!this._observers.length) {
            return true;
        }
        var state = this._eventState;
        state.mask = mask;
        state.target = target;
        state.currentTarget = currentTarget;
        state.skipNextObservers = false;
        state.lastReturnValue = eventData;
        for (var _i = 0, _a = this._observers; _i < _a.length; _i++) {
            var obs = _a[_i];
            if (obs._willBeUnregistered) {
                continue;
            }
            if (obs.mask & mask) {
                if (obs.scope) {
                    state.lastReturnValue = obs.callback.apply(obs.scope, [eventData, state]);
                }
                else {
                    state.lastReturnValue = obs.callback(eventData, state);
                }
                if (obs.unregisterOnNextCall) {
                    this._deferUnregister(obs);
                }
            }
            if (state.skipNextObservers) {
                return false;
            }
        }
        return true;
    };
    /**
     * Calling this will execute each callback, expecting it to be a promise or return a value.
     * If at any point in the chain one function fails, the promise will fail and the execution will not continue.
     * This is useful when a chain of events (sometimes async events) is needed to initialize a certain object
     * and it is crucial that all callbacks will be executed.
     * The order of the callbacks is kept, callbacks are not executed parallel.
     *
     * @param eventData The data to be sent to each callback
     * @param mask is used to filter observers defaults to -1
     * @param target defines the callback target (see EventState)
     * @param currentTarget defines he current object in the bubbling phase
     * @returns {Promise<T>} will return a Promise than resolves when all callbacks executed successfully.
     */
    Observable.prototype.notifyObserversWithPromise = function (eventData, mask, target, currentTarget) {
        var _this = this;
        if (mask === void 0) { mask = -1; }
        // create an empty promise
        var p = Promise.resolve(eventData);
        // no observers? return this promise.
        if (!this._observers.length) {
            return p;
        }
        var state = this._eventState;
        state.mask = mask;
        state.target = target;
        state.currentTarget = currentTarget;
        state.skipNextObservers = false;
        // execute one callback after another (not using Promise.all, the order is important)
        this._observers.forEach(function (obs) {
            if (state.skipNextObservers) {
                return;
            }
            if (obs._willBeUnregistered) {
                return;
            }
            if (obs.mask & mask) {
                if (obs.scope) {
                    p = p.then(function (lastReturnedValue) {
                        state.lastReturnValue = lastReturnedValue;
                        return obs.callback.apply(obs.scope, [eventData, state]);
                    });
                }
                else {
                    p = p.then(function (lastReturnedValue) {
                        state.lastReturnValue = lastReturnedValue;
                        return obs.callback(eventData, state);
                    });
                }
                if (obs.unregisterOnNextCall) {
                    _this._deferUnregister(obs);
                }
            }
        });
        // return the eventData
        return p.then(function () { return eventData; });
    };
    /**
     * Notify a specific observer
     * @param observer defines the observer to notify
     * @param eventData defines the data to be sent to each callback
     * @param mask is used to filter observers defaults to -1
     */
    Observable.prototype.notifyObserver = function (observer, eventData, mask) {
        if (mask === void 0) { mask = -1; }
        var state = this._eventState;
        state.mask = mask;
        state.skipNextObservers = false;
        observer.callback(eventData, state);
    };
    /**
     * Gets a boolean indicating if the observable has at least one observer
     * @returns true is the Observable has at least one Observer registered
     */
    Observable.prototype.hasObservers = function () {
        return this._observers.length > 0;
    };
    /**
    * Clear the list of observers
    */
    Observable.prototype.clear = function () {
        this._observers = new Array();
        this._onObserverAdded = null;
    };
    /**
     * Clone the current observable
     * @returns a new observable
     */
    Observable.prototype.clone = function () {
        var result = new Observable();
        result._observers = this._observers.slice(0);
        return result;
    };
    /**
     * Does this observable handles observer registered with a given mask
     * @param mask defines the mask to be tested
     * @return whether or not one observer registered with the given mask is handeled
    **/
    Observable.prototype.hasSpecificMask = function (mask) {
        if (mask === void 0) { mask = -1; }
        for (var _i = 0, _a = this._observers; _i < _a.length; _i++) {
            var obs = _a[_i];
            if (obs.mask & mask || obs.mask === mask) {
                return true;
            }
        }
        return false;
    };
    return Observable;
}());

//# sourceMappingURL=observable.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/filesInputStore.js
/**
 * Class used to help managing file picking and drag'n'drop
 * File Storage
 */
var FilesInputStore = /** @class */ (function () {
    function FilesInputStore() {
    }
    /**
     * List of files ready to be loaded
     */
    FilesInputStore.FilesToLoad = {};
    return FilesInputStore;
}());

//# sourceMappingURL=filesInputStore.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Engines/constants.js
/** Defines the cross module used constants to avoid circular dependncies */
var Constants = /** @class */ (function () {
    function Constants() {
    }
    /** Defines that alpha blending is disabled */
    Constants.ALPHA_DISABLE = 0;
    /** Defines that alpha blending to SRC ALPHA * SRC + DEST */
    Constants.ALPHA_ADD = 1;
    /** Defines that alpha blending to SRC ALPHA * SRC + (1 - SRC ALPHA) * DEST */
    Constants.ALPHA_COMBINE = 2;
    /** Defines that alpha blending to DEST - SRC * DEST */
    Constants.ALPHA_SUBTRACT = 3;
    /** Defines that alpha blending to SRC * DEST */
    Constants.ALPHA_MULTIPLY = 4;
    /** Defines that alpha blending to SRC ALPHA * SRC + (1 - SRC) * DEST */
    Constants.ALPHA_MAXIMIZED = 5;
    /** Defines that alpha blending to SRC + DEST */
    Constants.ALPHA_ONEONE = 6;
    /** Defines that alpha blending to SRC + (1 - SRC ALPHA) * DEST */
    Constants.ALPHA_PREMULTIPLIED = 7;
    /**
     * Defines that alpha blending to SRC + (1 - SRC ALPHA) * DEST
     * Alpha will be set to (1 - SRC ALPHA) * DEST ALPHA
     */
    Constants.ALPHA_PREMULTIPLIED_PORTERDUFF = 8;
    /** Defines that alpha blending to CST * SRC + (1 - CST) * DEST */
    Constants.ALPHA_INTERPOLATE = 9;
    /**
     * Defines that alpha blending to SRC + (1 - SRC) * DEST
     * Alpha will be set to SRC ALPHA + (1 - SRC ALPHA) * DEST ALPHA
     */
    Constants.ALPHA_SCREENMODE = 10;
    /** Defines that the ressource is not delayed*/
    Constants.DELAYLOADSTATE_NONE = 0;
    /** Defines that the ressource was successfully delay loaded */
    Constants.DELAYLOADSTATE_LOADED = 1;
    /** Defines that the ressource is currently delay loading */
    Constants.DELAYLOADSTATE_LOADING = 2;
    /** Defines that the ressource is delayed and has not started loading */
    Constants.DELAYLOADSTATE_NOTLOADED = 4;
    // Depht or Stencil test Constants.
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn */
    Constants.NEVER = 0x0200;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn */
    Constants.ALWAYS = 0x0207;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value */
    Constants.LESS = 0x0201;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value */
    Constants.EQUAL = 0x0202;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value */
    Constants.LEQUAL = 0x0203;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value */
    Constants.GREATER = 0x0204;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value */
    Constants.GEQUAL = 0x0206;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value */
    Constants.NOTEQUAL = 0x0205;
    // Stencil Actions Constants.
    /** Passed to stencilOperation to specify that stencil value must be kept */
    Constants.KEEP = 0x1E00;
    /** Passed to stencilOperation to specify that stencil value must be replaced */
    Constants.REPLACE = 0x1E01;
    /** Passed to stencilOperation to specify that stencil value must be incremented */
    Constants.INCR = 0x1E02;
    /** Passed to stencilOperation to specify that stencil value must be decremented */
    Constants.DECR = 0x1E03;
    /** Passed to stencilOperation to specify that stencil value must be inverted */
    Constants.INVERT = 0x150A;
    /** Passed to stencilOperation to specify that stencil value must be incremented with wrapping */
    Constants.INCR_WRAP = 0x8507;
    /** Passed to stencilOperation to specify that stencil value must be decremented with wrapping */
    Constants.DECR_WRAP = 0x8508;
    /** Texture is not repeating outside of 0..1 UVs */
    Constants.TEXTURE_CLAMP_ADDRESSMODE = 0;
    /** Texture is repeating outside of 0..1 UVs */
    Constants.TEXTURE_WRAP_ADDRESSMODE = 1;
    /** Texture is repeating and mirrored */
    Constants.TEXTURE_MIRROR_ADDRESSMODE = 2;
    /** ALPHA */
    Constants.TEXTUREFORMAT_ALPHA = 0;
    /** LUMINANCE */
    Constants.TEXTUREFORMAT_LUMINANCE = 1;
    /** LUMINANCE_ALPHA */
    Constants.TEXTUREFORMAT_LUMINANCE_ALPHA = 2;
    /** RGB */
    Constants.TEXTUREFORMAT_RGB = 4;
    /** RGBA */
    Constants.TEXTUREFORMAT_RGBA = 5;
    /** RED */
    Constants.TEXTUREFORMAT_RED = 6;
    /** RED (2nd reference) */
    Constants.TEXTUREFORMAT_R = 6;
    /** RG */
    Constants.TEXTUREFORMAT_RG = 7;
    /** RED_INTEGER */
    Constants.TEXTUREFORMAT_RED_INTEGER = 8;
    /** RED_INTEGER (2nd reference) */
    Constants.TEXTUREFORMAT_R_INTEGER = 8;
    /** RG_INTEGER */
    Constants.TEXTUREFORMAT_RG_INTEGER = 9;
    /** RGB_INTEGER */
    Constants.TEXTUREFORMAT_RGB_INTEGER = 10;
    /** RGBA_INTEGER */
    Constants.TEXTUREFORMAT_RGBA_INTEGER = 11;
    /** UNSIGNED_BYTE */
    Constants.TEXTURETYPE_UNSIGNED_BYTE = 0;
    /** UNSIGNED_BYTE (2nd reference) */
    Constants.TEXTURETYPE_UNSIGNED_INT = 0;
    /** FLOAT */
    Constants.TEXTURETYPE_FLOAT = 1;
    /** HALF_FLOAT */
    Constants.TEXTURETYPE_HALF_FLOAT = 2;
    /** BYTE */
    Constants.TEXTURETYPE_BYTE = 3;
    /** SHORT */
    Constants.TEXTURETYPE_SHORT = 4;
    /** UNSIGNED_SHORT */
    Constants.TEXTURETYPE_UNSIGNED_SHORT = 5;
    /** INT */
    Constants.TEXTURETYPE_INT = 6;
    /** UNSIGNED_INT */
    Constants.TEXTURETYPE_UNSIGNED_INTEGER = 7;
    /** UNSIGNED_SHORT_4_4_4_4 */
    Constants.TEXTURETYPE_UNSIGNED_SHORT_4_4_4_4 = 8;
    /** UNSIGNED_SHORT_5_5_5_1 */
    Constants.TEXTURETYPE_UNSIGNED_SHORT_5_5_5_1 = 9;
    /** UNSIGNED_SHORT_5_6_5 */
    Constants.TEXTURETYPE_UNSIGNED_SHORT_5_6_5 = 10;
    /** UNSIGNED_INT_2_10_10_10_REV */
    Constants.TEXTURETYPE_UNSIGNED_INT_2_10_10_10_REV = 11;
    /** UNSIGNED_INT_24_8 */
    Constants.TEXTURETYPE_UNSIGNED_INT_24_8 = 12;
    /** UNSIGNED_INT_10F_11F_11F_REV */
    Constants.TEXTURETYPE_UNSIGNED_INT_10F_11F_11F_REV = 13;
    /** UNSIGNED_INT_5_9_9_9_REV */
    Constants.TEXTURETYPE_UNSIGNED_INT_5_9_9_9_REV = 14;
    /** FLOAT_32_UNSIGNED_INT_24_8_REV */
    Constants.TEXTURETYPE_FLOAT_32_UNSIGNED_INT_24_8_REV = 15;
    /** nearest is mag = nearest and min = nearest and mip = linear */
    Constants.TEXTURE_NEAREST_SAMPLINGMODE = 1;
    /** Bilinear is mag = linear and min = linear and mip = nearest */
    Constants.TEXTURE_BILINEAR_SAMPLINGMODE = 2;
    /** Trilinear is mag = linear and min = linear and mip = linear */
    Constants.TEXTURE_TRILINEAR_SAMPLINGMODE = 3;
    /** nearest is mag = nearest and min = nearest and mip = linear */
    Constants.TEXTURE_NEAREST_NEAREST_MIPLINEAR = 1;
    /** Bilinear is mag = linear and min = linear and mip = nearest */
    Constants.TEXTURE_LINEAR_LINEAR_MIPNEAREST = 2;
    /** Trilinear is mag = linear and min = linear and mip = linear */
    Constants.TEXTURE_LINEAR_LINEAR_MIPLINEAR = 3;
    /** mag = nearest and min = nearest and mip = nearest */
    Constants.TEXTURE_NEAREST_NEAREST_MIPNEAREST = 4;
    /** mag = nearest and min = linear and mip = nearest */
    Constants.TEXTURE_NEAREST_LINEAR_MIPNEAREST = 5;
    /** mag = nearest and min = linear and mip = linear */
    Constants.TEXTURE_NEAREST_LINEAR_MIPLINEAR = 6;
    /** mag = nearest and min = linear and mip = none */
    Constants.TEXTURE_NEAREST_LINEAR = 7;
    /** mag = nearest and min = nearest and mip = none */
    Constants.TEXTURE_NEAREST_NEAREST = 8;
    /** mag = linear and min = nearest and mip = nearest */
    Constants.TEXTURE_LINEAR_NEAREST_MIPNEAREST = 9;
    /** mag = linear and min = nearest and mip = linear */
    Constants.TEXTURE_LINEAR_NEAREST_MIPLINEAR = 10;
    /** mag = linear and min = linear and mip = none */
    Constants.TEXTURE_LINEAR_LINEAR = 11;
    /** mag = linear and min = nearest and mip = none */
    Constants.TEXTURE_LINEAR_NEAREST = 12;
    /** Explicit coordinates mode */
    Constants.TEXTURE_EXPLICIT_MODE = 0;
    /** Spherical coordinates mode */
    Constants.TEXTURE_SPHERICAL_MODE = 1;
    /** Planar coordinates mode */
    Constants.TEXTURE_PLANAR_MODE = 2;
    /** Cubic coordinates mode */
    Constants.TEXTURE_CUBIC_MODE = 3;
    /** Projection coordinates mode */
    Constants.TEXTURE_PROJECTION_MODE = 4;
    /** Skybox coordinates mode */
    Constants.TEXTURE_SKYBOX_MODE = 5;
    /** Inverse Cubic coordinates mode */
    Constants.TEXTURE_INVCUBIC_MODE = 6;
    /** Equirectangular coordinates mode */
    Constants.TEXTURE_EQUIRECTANGULAR_MODE = 7;
    /** Equirectangular Fixed coordinates mode */
    Constants.TEXTURE_FIXED_EQUIRECTANGULAR_MODE = 8;
    /** Equirectangular Fixed Mirrored coordinates mode */
    Constants.TEXTURE_FIXED_EQUIRECTANGULAR_MIRRORED_MODE = 9;
    // Texture rescaling mode
    /** Defines that texture rescaling will use a floor to find the closer power of 2 size */
    Constants.SCALEMODE_FLOOR = 1;
    /** Defines that texture rescaling will look for the nearest power of 2 size */
    Constants.SCALEMODE_NEAREST = 2;
    /** Defines that texture rescaling will use a ceil to find the closer power of 2 size */
    Constants.SCALEMODE_CEILING = 3;
    /**
     * The dirty texture flag value
     */
    Constants.MATERIAL_TextureDirtyFlag = 1;
    /**
     * The dirty light flag value
     */
    Constants.MATERIAL_LightDirtyFlag = 2;
    /**
     * The dirty fresnel flag value
     */
    Constants.MATERIAL_FresnelDirtyFlag = 4;
    /**
     * The dirty attribute flag value
     */
    Constants.MATERIAL_AttributesDirtyFlag = 8;
    /**
     * The dirty misc flag value
     */
    Constants.MATERIAL_MiscDirtyFlag = 16;
    /**
     * The all dirty flag value
     */
    Constants.MATERIAL_AllDirtyFlag = 31;
    /**
     * Returns the triangle fill mode
     */
    Constants.MATERIAL_TriangleFillMode = 0;
    /**
     * Returns the wireframe mode
     */
    Constants.MATERIAL_WireFrameFillMode = 1;
    /**
     * Returns the point fill mode
     */
    Constants.MATERIAL_PointFillMode = 2;
    /**
     * Returns the point list draw mode
     */
    Constants.MATERIAL_PointListDrawMode = 3;
    /**
     * Returns the line list draw mode
     */
    Constants.MATERIAL_LineListDrawMode = 4;
    /**
     * Returns the line loop draw mode
     */
    Constants.MATERIAL_LineLoopDrawMode = 5;
    /**
     * Returns the line strip draw mode
     */
    Constants.MATERIAL_LineStripDrawMode = 6;
    /**
     * Returns the triangle strip draw mode
     */
    Constants.MATERIAL_TriangleStripDrawMode = 7;
    /**
     * Returns the triangle fan draw mode
     */
    Constants.MATERIAL_TriangleFanDrawMode = 8;
    /**
     * Stores the clock-wise side orientation
     */
    Constants.MATERIAL_ClockWiseSideOrientation = 0;
    /**
     * Stores the counter clock-wise side orientation
     */
    Constants.MATERIAL_CounterClockWiseSideOrientation = 1;
    /**
     * Nothing
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_NothingTrigger = 0;
    /**
     * On pick
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnPickTrigger = 1;
    /**
     * On left pick
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnLeftPickTrigger = 2;
    /**
     * On right pick
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnRightPickTrigger = 3;
    /**
     * On center pick
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnCenterPickTrigger = 4;
    /**
     * On pick down
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnPickDownTrigger = 5;
    /**
     * On double pick
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnDoublePickTrigger = 6;
    /**
     * On pick up
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnPickUpTrigger = 7;
    /**
     * On pick out.
     * This trigger will only be raised if you also declared a OnPickDown
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnPickOutTrigger = 16;
    /**
     * On long press
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnLongPressTrigger = 8;
    /**
     * On pointer over
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnPointerOverTrigger = 9;
    /**
     * On pointer out
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnPointerOutTrigger = 10;
    /**
     * On every frame
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnEveryFrameTrigger = 11;
    /**
     * On intersection enter
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnIntersectionEnterTrigger = 12;
    /**
     * On intersection exit
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnIntersectionExitTrigger = 13;
    /**
     * On key down
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnKeyDownTrigger = 14;
    /**
     * On key up
     * @see http://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnKeyUpTrigger = 15;
    /**
     * Billboard mode will only apply to Y axis
     */
    Constants.PARTICLES_BILLBOARDMODE_Y = 2;
    /**
     * Billboard mode will apply to all axes
     */
    Constants.PARTICLES_BILLBOARDMODE_ALL = 7;
    /**
     * Special billboard mode where the particle will be biilboard to the camera but rotated to align with direction
     */
    Constants.PARTICLES_BILLBOARDMODE_STRETCHED = 8;
    /**
     * Gets or sets base Assets URL
     */
    Constants.PARTICLES_BaseAssetsUrl = "https://assets.babylonjs.com/particles";
    /** Default culling strategy : this is an exclusion test and it's the more accurate.
     *  Test order :
     *  Is the bounding sphere outside the frustum ?
     *  If not, are the bounding box vertices outside the frustum ?
     *  It not, then the cullable object is in the frustum.
     */
    Constants.MESHES_CULLINGSTRATEGY_STANDARD = 0;
    /** Culling strategy : Bounding Sphere Only.
     *  This is an exclusion test. It's faster than the standard strategy because the bounding box is not tested.
     *  It's also less accurate than the standard because some not visible objects can still be selected.
     *  Test : is the bounding sphere outside the frustum ?
     *  If not, then the cullable object is in the frustum.
     */
    Constants.MESHES_CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY = 1;
    /** Culling strategy : Optimistic Inclusion.
     *  This in an inclusion test first, then the standard exclusion test.
     *  This can be faster when a cullable object is expected to be almost always in the camera frustum.
     *  This could also be a little slower than the standard test when the tested object center is not the frustum but one of its bounding box vertex is still inside.
     *  Anyway, it's as accurate as the standard strategy.
     *  Test :
     *  Is the cullable object bounding sphere center in the frustum ?
     *  If not, apply the default culling strategy.
     */
    Constants.MESHES_CULLINGSTRATEGY_OPTIMISTIC_INCLUSION = 2;
    /** Culling strategy : Optimistic Inclusion then Bounding Sphere Only.
     *  This in an inclusion test first, then the bounding sphere only exclusion test.
     *  This can be the fastest test when a cullable object is expected to be almost always in the camera frustum.
     *  This could also be a little slower than the BoundingSphereOnly strategy when the tested object center is not in the frustum but its bounding sphere still intersects it.
     *  It's less accurate than the standard strategy and as accurate as the BoundingSphereOnly strategy.
     *  Test :
     *  Is the cullable object bounding sphere center in the frustum ?
     *  If not, apply the Bounding Sphere Only strategy. No Bounding Box is tested here.
     */
    Constants.MESHES_CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY = 3;
    /**
     * No logging while loading
     */
    Constants.SCENELOADER_NO_LOGGING = 0;
    /**
     * Minimal logging while loading
     */
    Constants.SCENELOADER_MINIMAL_LOGGING = 1;
    /**
     * Summary logging while loading
     */
    Constants.SCENELOADER_SUMMARY_LOGGING = 2;
    /**
     * Detailled logging while loading
     */
    Constants.SCENELOADER_DETAILED_LOGGING = 3;
    return Constants;
}());

//# sourceMappingURL=constants.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/domManagement.js
/**
 * Sets of helpers dealing with the DOM and some of the recurrent functions needed in
 * Babylon.js
 */
var DomManagement = /** @class */ (function () {
    function DomManagement() {
    }
    /**
     * Checks if the window object exists
     * @returns true if the window object exists
     */
    DomManagement.IsWindowObjectExist = function () {
        return (typeof window) !== "undefined";
    };
    /**
     * Extracts text content from a DOM element hierarchy
     * @param element defines the root element
     * @returns a string
     */
    DomManagement.GetDOMTextContent = function (element) {
        var result = "";
        var child = element.firstChild;
        while (child) {
            if (child.nodeType === 3) {
                result += child.textContent;
            }
            child = (child.nextSibling);
        }
        return result;
    };
    return DomManagement;
}());

//# sourceMappingURL=domManagement.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/logger.js
/**
 * Logger used througouht the application to allow configuration of
 * the log level required for the messages.
 */
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger._AddLogEntry = function (entry) {
        Logger._LogCache = entry + Logger._LogCache;
        if (Logger.OnNewCacheEntry) {
            Logger.OnNewCacheEntry(entry);
        }
    };
    Logger._FormatMessage = function (message) {
        var padStr = function (i) { return (i < 10) ? "0" + i : "" + i; };
        var date = new Date();
        return "[" + padStr(date.getHours()) + ":" + padStr(date.getMinutes()) + ":" + padStr(date.getSeconds()) + "]: " + message;
    };
    Logger._LogDisabled = function (message) {
        // nothing to do
    };
    Logger._LogEnabled = function (message) {
        var formattedMessage = Logger._FormatMessage(message);
        console.log("BJS - " + formattedMessage);
        var entry = "<div style='color:white'>" + formattedMessage + "</div><br>";
        Logger._AddLogEntry(entry);
    };
    Logger._WarnDisabled = function (message) {
        // nothing to do
    };
    Logger._WarnEnabled = function (message) {
        var formattedMessage = Logger._FormatMessage(message);
        console.warn("BJS - " + formattedMessage);
        var entry = "<div style='color:orange'>" + formattedMessage + "</div><br>";
        Logger._AddLogEntry(entry);
    };
    Logger._ErrorDisabled = function (message) {
        // nothing to do
    };
    Logger._ErrorEnabled = function (message) {
        Logger.errorsCount++;
        var formattedMessage = Logger._FormatMessage(message);
        console.error("BJS - " + formattedMessage);
        var entry = "<div style='color:red'>" + formattedMessage + "</div><br>";
        Logger._AddLogEntry(entry);
    };
    Object.defineProperty(Logger, "LogCache", {
        /**
         * Gets current log cache (list of logs)
         */
        get: function () {
            return Logger._LogCache;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clears the log cache
     */
    Logger.ClearLogCache = function () {
        Logger._LogCache = "";
        Logger.errorsCount = 0;
    };
    Object.defineProperty(Logger, "LogLevels", {
        /**
         * Sets the current log level (MessageLogLevel / WarningLogLevel / ErrorLogLevel)
         */
        set: function (level) {
            if ((level & Logger.MessageLogLevel) === Logger.MessageLogLevel) {
                Logger.Log = Logger._LogEnabled;
            }
            else {
                Logger.Log = Logger._LogDisabled;
            }
            if ((level & Logger.WarningLogLevel) === Logger.WarningLogLevel) {
                Logger.Warn = Logger._WarnEnabled;
            }
            else {
                Logger.Warn = Logger._WarnDisabled;
            }
            if ((level & Logger.ErrorLogLevel) === Logger.ErrorLogLevel) {
                Logger.Error = Logger._ErrorEnabled;
            }
            else {
                Logger.Error = Logger._ErrorDisabled;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * No log
     */
    Logger.NoneLogLevel = 0;
    /**
     * Only message logs
     */
    Logger.MessageLogLevel = 1;
    /**
     * Only warning logs
     */
    Logger.WarningLogLevel = 2;
    /**
     * Only error logs
     */
    Logger.ErrorLogLevel = 4;
    /**
     * All logs
     */
    Logger.AllLogLevel = 7;
    Logger._LogCache = "";
    /**
     * Gets a value indicating the number of loading errors
     * @ignorenaming
     */
    Logger.errorsCount = 0;
    /**
     * Log a message to the console
     */
    Logger.Log = Logger._LogEnabled;
    /**
     * Write a warning message to the console
     */
    Logger.Warn = Logger._WarnEnabled;
    /**
     * Write an error message to the console
     */
    Logger.Error = Logger._ErrorEnabled;
    return Logger;
}());

//# sourceMappingURL=logger.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/typeStore.js
/** @hidden */
var _TypeStore = /** @class */ (function () {
    function _TypeStore() {
    }
    /** @hidden */
    _TypeStore.GetClass = function (fqdn) {
        if (this.RegisteredTypes && this.RegisteredTypes[fqdn]) {
            return this.RegisteredTypes[fqdn];
        }
        return null;
    };
    /** @hidden */
    _TypeStore.RegisteredTypes = {};
    return _TypeStore;
}());

//# sourceMappingURL=typeStore.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/deepCopier.js
var cloneValue = function (source, destinationObject) {
    if (!source) {
        return null;
    }
    if (source.getClassName && source.getClassName() === "Mesh") {
        return null;
    }
    if (source.getClassName && source.getClassName() === "SubMesh") {
        return source.clone(destinationObject);
    }
    else if (source.clone) {
        return source.clone();
    }
    return null;
};
/**
 * Class containing a set of static utilities functions for deep copy.
 */
var DeepCopier = /** @class */ (function () {
    function DeepCopier() {
    }
    /**
     * Tries to copy an object by duplicating every property
     * @param source defines the source object
     * @param destination defines the target object
     * @param doNotCopyList defines a list of properties to avoid
     * @param mustCopyList defines a list of properties to copy (even if they start with _)
     */
    DeepCopier.DeepCopy = function (source, destination, doNotCopyList, mustCopyList) {
        for (var prop in source) {
            if (prop[0] === "_" && (!mustCopyList || mustCopyList.indexOf(prop) === -1)) {
                continue;
            }
            if (doNotCopyList && doNotCopyList.indexOf(prop) !== -1) {
                continue;
            }
            var sourceValue = source[prop];
            var typeOfSourceValue = typeof sourceValue;
            if (typeOfSourceValue === "function") {
                continue;
            }
            try {
                if (typeOfSourceValue === "object") {
                    if (sourceValue instanceof Array) {
                        destination[prop] = [];
                        if (sourceValue.length > 0) {
                            if (typeof sourceValue[0] == "object") {
                                for (var index = 0; index < sourceValue.length; index++) {
                                    var clonedValue = cloneValue(sourceValue[index], destination);
                                    if (destination[prop].indexOf(clonedValue) === -1) { // Test if auto inject was not done
                                        destination[prop].push(clonedValue);
                                    }
                                }
                            }
                            else {
                                destination[prop] = sourceValue.slice(0);
                            }
                        }
                    }
                    else {
                        destination[prop] = cloneValue(sourceValue, destination);
                    }
                }
                else {
                    destination[prop] = sourceValue;
                }
            }
            catch (e) {
                // Just ignore error (it could be because of a read-only property)
            }
        }
    };
    return DeepCopier;
}());

//# sourceMappingURL=deepCopier.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/precisionDate.js

/**
 * Class containing a set of static utilities functions for precision date
 */
var PrecisionDate = /** @class */ (function () {
    function PrecisionDate() {
    }
    Object.defineProperty(PrecisionDate, "Now", {
        /**
         * Gets either window.performance.now() if supported or Date.now() else
         */
        get: function () {
            if (DomManagement.IsWindowObjectExist() && window.performance && window.performance.now) {
                return window.performance.now();
            }
            return Date.now();
        },
        enumerable: true,
        configurable: true
    });
    return PrecisionDate;
}());

//# sourceMappingURL=precisionDate.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/devTools.js
/** @hidden */
var _DevTools = /** @class */ (function () {
    function _DevTools() {
    }
    _DevTools.WarnImport = function (name) {
        return name + " needs to be imported before as it contains a side-effect required by your code.";
    };
    return _DevTools;
}());

//# sourceMappingURL=devTools.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/webRequest.js
/**
 * Extended version of XMLHttpRequest with support for customizations (headers, ...)
 */
var WebRequest = /** @class */ (function () {
    function WebRequest() {
        this._xhr = new XMLHttpRequest();
    }
    WebRequest.prototype._injectCustomRequestHeaders = function () {
        for (var key in WebRequest.CustomRequestHeaders) {
            var val = WebRequest.CustomRequestHeaders[key];
            if (val) {
                this._xhr.setRequestHeader(key, val);
            }
        }
    };
    Object.defineProperty(WebRequest.prototype, "onprogress", {
        /**
         * Gets or sets a function to be called when loading progress changes
         */
        get: function () {
            return this._xhr.onprogress;
        },
        set: function (value) {
            this._xhr.onprogress = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "readyState", {
        /**
         * Returns client's state
         */
        get: function () {
            return this._xhr.readyState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "status", {
        /**
         * Returns client's status
         */
        get: function () {
            return this._xhr.status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "statusText", {
        /**
         * Returns client's status as a text
         */
        get: function () {
            return this._xhr.statusText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "response", {
        /**
         * Returns client's response
         */
        get: function () {
            return this._xhr.response;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "responseURL", {
        /**
         * Returns client's response url
         */
        get: function () {
            return this._xhr.responseURL;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "responseText", {
        /**
         * Returns client's response as text
         */
        get: function () {
            return this._xhr.responseText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "responseType", {
        /**
         * Gets or sets the expected response type
         */
        get: function () {
            return this._xhr.responseType;
        },
        set: function (value) {
            this._xhr.responseType = value;
        },
        enumerable: true,
        configurable: true
    });
    WebRequest.prototype.addEventListener = function (type, listener, options) {
        this._xhr.addEventListener(type, listener, options);
    };
    WebRequest.prototype.removeEventListener = function (type, listener, options) {
        this._xhr.removeEventListener(type, listener, options);
    };
    /**
     * Cancels any network activity
     */
    WebRequest.prototype.abort = function () {
        this._xhr.abort();
    };
    /**
     * Initiates the request. The optional argument provides the request body. The argument is ignored if request method is GET or HEAD
     * @param body defines an optional request body
     */
    WebRequest.prototype.send = function (body) {
        if (WebRequest.CustomRequestHeaders) {
            this._injectCustomRequestHeaders();
        }
        this._xhr.send(body);
    };
    /**
     * Sets the request method, request URL
     * @param method defines the method to use (GET, POST, etc..)
     * @param url defines the url to connect with
     */
    WebRequest.prototype.open = function (method, url) {
        for (var _i = 0, _a = WebRequest.CustomRequestModifiers; _i < _a.length; _i++) {
            var update = _a[_i];
            update(this._xhr);
        }
        return this._xhr.open(method, url, true);
    };
    /**
     * Custom HTTP Request Headers to be sent with XMLHttpRequests
     * i.e. when loading files, where the server/service expects an Authorization header
     */
    WebRequest.CustomRequestHeaders = {};
    /**
     * Add callback functions in this array to update all the requests before they get sent to the network
     */
    WebRequest.CustomRequestModifiers = new Array();
    return WebRequest;
}());

//# sourceMappingURL=webRequest.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/tools.js













/** Class used to store color4 gradient */
var ColorGradient = /** @class */ (function () {
    function ColorGradient() {
    }
    /**
     * Will get a color picked randomly between color1 and color2.
     * If color2 is undefined then color1 will be used
     * @param result defines the target Color4 to store the result in
     */
    ColorGradient.prototype.getColorToRef = function (result) {
        if (!this.color2) {
            result.copyFrom(this.color1);
            return;
        }
        Color4.LerpToRef(this.color1, this.color2, Math.random(), result);
    };
    return ColorGradient;
}());

/** Class used to store color 3 gradient */
var Color3Gradient = /** @class */ (function () {
    function Color3Gradient() {
    }
    return Color3Gradient;
}());

/** Class used to store factor gradient */
var FactorGradient = /** @class */ (function () {
    function FactorGradient() {
    }
    /**
     * Will get a number picked randomly between factor1 and factor2.
     * If factor2 is undefined then factor1 will be used
     * @returns the picked number
     */
    FactorGradient.prototype.getFactor = function () {
        if (this.factor2 === undefined) {
            return this.factor1;
        }
        return Scalar.Lerp(this.factor1, this.factor2, Math.random());
    };
    return FactorGradient;
}());

/**
 * @ignore
 * Application error to support additional information when loading a file
 */
var LoadFileError = /** @class */ (function (_super) {
    __extends(LoadFileError, _super);
    /**
     * Creates a new LoadFileError
     * @param message defines the message of the error
     * @param request defines the optional web request
     */
    function LoadFileError(message, 
    /** defines the optional web request */
    request) {
        var _this = _super.call(this, message) || this;
        _this.request = request;
        _this.name = "LoadFileError";
        LoadFileError._setPrototypeOf(_this, LoadFileError.prototype);
        return _this;
    }
    // See https://stackoverflow.com/questions/12915412/how-do-i-extend-a-host-object-e-g-error-in-typescript
    // and https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Polyfill for Object.setPrototypeOf if necessary.
    LoadFileError._setPrototypeOf = Object.setPrototypeOf || (function (o, proto) { o.__proto__ = proto; return o; });
    return LoadFileError;
}(Error));

/**
 * Class used to define a retry strategy when error happens while loading assets
 */
var RetryStrategy = /** @class */ (function () {
    function RetryStrategy() {
    }
    /**
     * Function used to defines an exponential back off strategy
     * @param maxRetries defines the maximum number of retries (3 by default)
     * @param baseInterval defines the interval between retries
     * @returns the strategy function to use
     */
    RetryStrategy.ExponentialBackoff = function (maxRetries, baseInterval) {
        if (maxRetries === void 0) { maxRetries = 3; }
        if (baseInterval === void 0) { baseInterval = 500; }
        return function (url, request, retryIndex) {
            if (request.status !== 0 || retryIndex >= maxRetries || url.indexOf("file:") !== -1) {
                return -1;
            }
            return Math.pow(2, retryIndex) * baseInterval;
        };
    };
    return RetryStrategy;
}());

/**
 * Class containing a set of static utilities functions
 */
var Tools = /** @class */ (function () {
    function Tools() {
    }
    /**
     * Read the content of a byte array at a specified coordinates (taking in account wrapping)
     * @param u defines the coordinate on X axis
     * @param v defines the coordinate on Y axis
     * @param width defines the width of the source data
     * @param height defines the height of the source data
     * @param pixels defines the source byte array
     * @param color defines the output color
     */
    Tools.FetchToRef = function (u, v, width, height, pixels, color) {
        var wrappedU = ((Math.abs(u) * width) % width) | 0;
        var wrappedV = ((Math.abs(v) * height) % height) | 0;
        var position = (wrappedU + wrappedV * width) * 4;
        color.r = pixels[position] / 255;
        color.g = pixels[position + 1] / 255;
        color.b = pixels[position + 2] / 255;
        color.a = pixels[position + 3] / 255;
    };
    /**
     * Interpolates between a and b via alpha
     * @param a The lower value (returned when alpha = 0)
     * @param b The upper value (returned when alpha = 1)
     * @param alpha The interpolation-factor
     * @return The mixed value
     */
    Tools.Mix = function (a, b, alpha) {
        return a * (1 - alpha) + b * alpha;
    };
    /**
     * Tries to instantiate a new object from a given class name
     * @param className defines the class name to instantiate
     * @returns the new object or null if the system was not able to do the instantiation
     */
    Tools.Instantiate = function (className) {
        if (Tools.RegisteredExternalClasses && Tools.RegisteredExternalClasses[className]) {
            return Tools.RegisteredExternalClasses[className];
        }
        var internalClass = _TypeStore.GetClass(className);
        if (internalClass) {
            return internalClass;
        }
        Logger.Warn(className + " not found, you may have missed an import.");
        var arr = className.split(".");
        var fn = (window || this);
        for (var i = 0, len = arr.length; i < len; i++) {
            fn = fn[arr[i]];
        }
        if (typeof fn !== "function") {
            return null;
        }
        return fn;
    };
    /**
     * Provides a slice function that will work even on IE
     * @param data defines the array to slice
     * @param start defines the start of the data (optional)
     * @param end defines the end of the data (optional)
     * @returns the new sliced array
     */
    Tools.Slice = function (data, start, end) {
        if (data.slice) {
            return data.slice(start, end);
        }
        return Array.prototype.slice.call(data, start, end);
    };
    /**
     * Polyfill for setImmediate
     * @param action defines the action to execute after the current execution block
     */
    Tools.SetImmediate = function (action) {
        if (DomManagement.IsWindowObjectExist() && window.setImmediate) {
            window.setImmediate(action);
        }
        else {
            setTimeout(action, 1);
        }
    };
    /**
     * Function indicating if a number is an exponent of 2
     * @param value defines the value to test
     * @returns true if the value is an exponent of 2
     */
    Tools.IsExponentOfTwo = function (value) {
        var count = 1;
        do {
            count *= 2;
        } while (count < value);
        return count === value;
    };
    /**
     * Returns the nearest 32-bit single precision float representation of a Number
     * @param value A Number.  If the parameter is of a different type, it will get converted
     * to a number or to NaN if it cannot be converted
     * @returns number
     */
    Tools.FloatRound = function (value) {
        if (Math.fround) {
            return Math.fround(value);
        }
        return (Tools._tmpFloatArray[0] = value);
    };
    /**
     * Find the next highest power of two.
     * @param x Number to start search from.
     * @return Next highest power of two.
     */
    Tools.CeilingPOT = function (x) {
        x--;
        x |= x >> 1;
        x |= x >> 2;
        x |= x >> 4;
        x |= x >> 8;
        x |= x >> 16;
        x++;
        return x;
    };
    /**
     * Find the next lowest power of two.
     * @param x Number to start search from.
     * @return Next lowest power of two.
     */
    Tools.FloorPOT = function (x) {
        x = x | (x >> 1);
        x = x | (x >> 2);
        x = x | (x >> 4);
        x = x | (x >> 8);
        x = x | (x >> 16);
        return x - (x >> 1);
    };
    /**
     * Find the nearest power of two.
     * @param x Number to start search from.
     * @return Next nearest power of two.
     */
    Tools.NearestPOT = function (x) {
        var c = Tools.CeilingPOT(x);
        var f = Tools.FloorPOT(x);
        return (c - x) > (x - f) ? f : c;
    };
    /**
     * Get the closest exponent of two
     * @param value defines the value to approximate
     * @param max defines the maximum value to return
     * @param mode defines how to define the closest value
     * @returns closest exponent of two of the given value
     */
    Tools.GetExponentOfTwo = function (value, max, mode) {
        if (mode === void 0) { mode = Constants.SCALEMODE_NEAREST; }
        var pot;
        switch (mode) {
            case Constants.SCALEMODE_FLOOR:
                pot = Tools.FloorPOT(value);
                break;
            case Constants.SCALEMODE_NEAREST:
                pot = Tools.NearestPOT(value);
                break;
            case Constants.SCALEMODE_CEILING:
            default:
                pot = Tools.CeilingPOT(value);
                break;
        }
        return Math.min(pot, max);
    };
    /**
     * Extracts the filename from a path
     * @param path defines the path to use
     * @returns the filename
     */
    Tools.GetFilename = function (path) {
        var index = path.lastIndexOf("/");
        if (index < 0) {
            return path;
        }
        return path.substring(index + 1);
    };
    /**
     * Extracts the "folder" part of a path (everything before the filename).
     * @param uri The URI to extract the info from
     * @param returnUnchangedIfNoSlash Do not touch the URI if no slashes are present
     * @returns The "folder" part of the path
     */
    Tools.GetFolderPath = function (uri, returnUnchangedIfNoSlash) {
        if (returnUnchangedIfNoSlash === void 0) { returnUnchangedIfNoSlash = false; }
        var index = uri.lastIndexOf("/");
        if (index < 0) {
            if (returnUnchangedIfNoSlash) {
                return uri;
            }
            return "";
        }
        return uri.substring(0, index + 1);
    };
    /**
     * Convert an angle in radians to degrees
     * @param angle defines the angle to convert
     * @returns the angle in degrees
     */
    Tools.ToDegrees = function (angle) {
        return angle * 180 / Math.PI;
    };
    /**
     * Convert an angle in degrees to radians
     * @param angle defines the angle to convert
     * @returns the angle in radians
     */
    Tools.ToRadians = function (angle) {
        return angle * Math.PI / 180;
    };
    /**
     * Encode a buffer to a base64 string
     * @param buffer defines the buffer to encode
     * @returns the encoded string
     */
    Tools.EncodeArrayBufferTobase64 = function (buffer) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        var bytes = new Uint8Array(buffer);
        while (i < bytes.length) {
            chr1 = bytes[i++];
            chr2 = i < bytes.length ? bytes[i++] : Number.NaN; // Not sure if the index
            chr3 = i < bytes.length ? bytes[i++] : Number.NaN; // checks are needed here
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }
        return "data:image/png;base64," + output;
    };
    /**
     * Extracts minimum and maximum values from a list of indexed positions
     * @param positions defines the positions to use
     * @param indices defines the indices to the positions
     * @param indexStart defines the start index
     * @param indexCount defines the end index
     * @param bias defines bias value to add to the result
     * @return minimum and maximum values
     */
    Tools.ExtractMinAndMaxIndexed = function (positions, indices, indexStart, indexCount, bias) {
        if (bias === void 0) { bias = null; }
        var minimum = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        var maximum = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        for (var index = indexStart; index < indexStart + indexCount; index++) {
            var offset = indices[index] * 3;
            var x = positions[offset];
            var y = positions[offset + 1];
            var z = positions[offset + 2];
            minimum.minimizeInPlaceFromFloats(x, y, z);
            maximum.maximizeInPlaceFromFloats(x, y, z);
        }
        if (bias) {
            minimum.x -= minimum.x * bias.x + bias.y;
            minimum.y -= minimum.y * bias.x + bias.y;
            minimum.z -= minimum.z * bias.x + bias.y;
            maximum.x += maximum.x * bias.x + bias.y;
            maximum.y += maximum.y * bias.x + bias.y;
            maximum.z += maximum.z * bias.x + bias.y;
        }
        return {
            minimum: minimum,
            maximum: maximum
        };
    };
    /**
     * Extracts minimum and maximum values from a list of positions
     * @param positions defines the positions to use
     * @param start defines the start index in the positions array
     * @param count defines the number of positions to handle
     * @param bias defines bias value to add to the result
     * @param stride defines the stride size to use (distance between two positions in the positions array)
     * @return minimum and maximum values
     */
    Tools.ExtractMinAndMax = function (positions, start, count, bias, stride) {
        if (bias === void 0) { bias = null; }
        var minimum = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        var maximum = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        if (!stride) {
            stride = 3;
        }
        for (var index = start, offset = start * stride; index < start + count; index++, offset += stride) {
            var x = positions[offset];
            var y = positions[offset + 1];
            var z = positions[offset + 2];
            minimum.minimizeInPlaceFromFloats(x, y, z);
            maximum.maximizeInPlaceFromFloats(x, y, z);
        }
        if (bias) {
            minimum.x -= minimum.x * bias.x + bias.y;
            minimum.y -= minimum.y * bias.x + bias.y;
            minimum.z -= minimum.z * bias.x + bias.y;
            maximum.x += maximum.x * bias.x + bias.y;
            maximum.y += maximum.y * bias.x + bias.y;
            maximum.z += maximum.z * bias.x + bias.y;
        }
        return {
            minimum: minimum,
            maximum: maximum
        };
    };
    /**
     * Returns an array if obj is not an array
     * @param obj defines the object to evaluate as an array
     * @param allowsNullUndefined defines a boolean indicating if obj is allowed to be null or undefined
     * @returns either obj directly if obj is an array or a new array containing obj
     */
    Tools.MakeArray = function (obj, allowsNullUndefined) {
        if (allowsNullUndefined !== true && (obj === undefined || obj == null)) {
            return null;
        }
        return Array.isArray(obj) ? obj : [obj];
    };
    /**
     * Gets the pointer prefix to use
     * @returns "pointer" if touch is enabled. Else returns "mouse"
     */
    Tools.GetPointerPrefix = function () {
        var eventPrefix = "pointer";
        // Check if pointer events are supported
        if (DomManagement.IsWindowObjectExist() && !window.PointerEvent && !navigator.pointerEnabled) {
            eventPrefix = "mouse";
        }
        return eventPrefix;
    };
    /**
     * Queue a new function into the requested animation frame pool (ie. this function will be executed byt the browser for the next frame)
     * @param func - the function to be called
     * @param requester - the object that will request the next frame. Falls back to window.
     * @returns frame number
     */
    Tools.QueueNewFrame = function (func, requester) {
        if (!DomManagement.IsWindowObjectExist()) {
            return setTimeout(func, 16);
        }
        if (!requester) {
            requester = window;
        }
        if (requester.requestAnimationFrame) {
            return requester.requestAnimationFrame(func);
        }
        else if (requester.msRequestAnimationFrame) {
            return requester.msRequestAnimationFrame(func);
        }
        else if (requester.webkitRequestAnimationFrame) {
            return requester.webkitRequestAnimationFrame(func);
        }
        else if (requester.mozRequestAnimationFrame) {
            return requester.mozRequestAnimationFrame(func);
        }
        else if (requester.oRequestAnimationFrame) {
            return requester.oRequestAnimationFrame(func);
        }
        else {
            return window.setTimeout(func, 16);
        }
    };
    /**
     * Ask the browser to promote the current element to fullscreen rendering mode
     * @param element defines the DOM element to promote
     */
    Tools.RequestFullscreen = function (element) {
        var requestFunction = element.requestFullscreen || element.msRequestFullscreen || element.webkitRequestFullscreen || element.mozRequestFullScreen;
        if (!requestFunction) {
            return;
        }
        requestFunction.call(element);
    };
    /**
     * Asks the browser to exit fullscreen mode
     */
    Tools.ExitFullscreen = function () {
        var anyDoc = document;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (anyDoc.mozCancelFullScreen) {
            anyDoc.mozCancelFullScreen();
        }
        else if (anyDoc.webkitCancelFullScreen) {
            anyDoc.webkitCancelFullScreen();
        }
        else if (anyDoc.msCancelFullScreen) {
            anyDoc.msCancelFullScreen();
        }
    };
    /**
     * Sets the cors behavior on a dom element. This will add the required Tools.CorsBehavior to the element.
     * @param url define the url we are trying
     * @param element define the dom element where to configure the cors policy
     */
    Tools.SetCorsBehavior = function (url, element) {
        if (url && url.indexOf("data:") === 0) {
            return;
        }
        if (Tools.CorsBehavior) {
            if (typeof (Tools.CorsBehavior) === 'string' || Tools.CorsBehavior instanceof String) {
                element.crossOrigin = Tools.CorsBehavior;
            }
            else {
                var result = Tools.CorsBehavior(url);
                if (result) {
                    element.crossOrigin = result;
                }
            }
        }
    };
    // External files
    /**
     * Removes unwanted characters from an url
     * @param url defines the url to clean
     * @returns the cleaned url
     */
    Tools.CleanUrl = function (url) {
        url = url.replace(/#/mg, "%23");
        return url;
    };
    /**
     * Loads an image as an HTMLImageElement.
     * @param input url string, ArrayBuffer, or Blob to load
     * @param onLoad callback called when the image successfully loads
     * @param onError callback called when the image fails to load
     * @param offlineProvider offline provider for caching
     * @returns the HTMLImageElement of the loaded image
     */
    Tools.LoadImage = function (input, onLoad, onError, offlineProvider) {
        var url;
        var usingObjectURL = false;
        if (input instanceof ArrayBuffer) {
            url = URL.createObjectURL(new Blob([input]));
            usingObjectURL = true;
        }
        else if (input instanceof Blob) {
            url = URL.createObjectURL(input);
            usingObjectURL = true;
        }
        else {
            url = Tools.CleanUrl(input);
            url = Tools.PreprocessUrl(input);
        }
        var img = new Image();
        Tools.SetCorsBehavior(url, img);
        var loadHandler = function () {
            img.removeEventListener("load", loadHandler);
            img.removeEventListener("error", errorHandler);
            onLoad(img);
            // Must revoke the URL after calling onLoad to avoid security exceptions in
            // certain scenarios (e.g. when hosted in vscode).
            if (usingObjectURL && img.src) {
                URL.revokeObjectURL(img.src);
            }
        };
        var errorHandler = function (err) {
            img.removeEventListener("load", loadHandler);
            img.removeEventListener("error", errorHandler);
            Logger.Error("Error while trying to load image: " + input);
            if (onError) {
                onError("Error while trying to load image: " + input, err);
            }
            if (usingObjectURL && img.src) {
                URL.revokeObjectURL(img.src);
            }
        };
        img.addEventListener("load", loadHandler);
        img.addEventListener("error", errorHandler);
        var noOfflineSupport = function () {
            img.src = url;
        };
        var loadFromOfflineSupport = function () {
            if (offlineProvider) {
                offlineProvider.loadImage(url, img);
            }
        };
        if (url.substr(0, 5) !== "data:" && offlineProvider && offlineProvider.enableTexturesOffline) {
            offlineProvider.open(loadFromOfflineSupport, noOfflineSupport);
        }
        else {
            if (url.indexOf("file:") !== -1) {
                var textureName = decodeURIComponent(url.substring(5).toLowerCase());
                if (FilesInputStore.FilesToLoad[textureName]) {
                    try {
                        var blobURL;
                        try {
                            blobURL = URL.createObjectURL(FilesInputStore.FilesToLoad[textureName]);
                        }
                        catch (ex) {
                            // Chrome doesn't support oneTimeOnly parameter
                            blobURL = URL.createObjectURL(FilesInputStore.FilesToLoad[textureName]);
                        }
                        img.src = blobURL;
                        usingObjectURL = true;
                    }
                    catch (e) {
                        img.src = "";
                    }
                    return img;
                }
            }
            noOfflineSupport();
        }
        return img;
    };
    /**
     * Loads a file
     * @param url url string, ArrayBuffer, or Blob to load
     * @param onSuccess callback called when the file successfully loads
     * @param onProgress callback called while file is loading (if the server supports this mode)
     * @param offlineProvider defines the offline provider for caching
     * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer
     * @param onError callback called when the file fails to load
     * @returns a file request object
     */
    Tools.LoadFile = function (url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError) {
        url = Tools.CleanUrl(url);
        url = Tools.PreprocessUrl(url);
        // If file and file input are set
        if (url.indexOf("file:") !== -1) {
            var fileName = decodeURIComponent(url.substring(5).toLowerCase());
            if (FilesInputStore.FilesToLoad[fileName]) {
                return Tools.ReadFile(FilesInputStore.FilesToLoad[fileName], onSuccess, onProgress, useArrayBuffer);
            }
        }
        var loadUrl = Tools.BaseUrl + url;
        var aborted = false;
        var fileRequest = {
            onCompleteObservable: new Observable(),
            abort: function () { return aborted = true; },
        };
        var requestFile = function () {
            var request = new WebRequest();
            var retryHandle = null;
            fileRequest.abort = function () {
                aborted = true;
                if (request.readyState !== (XMLHttpRequest.DONE || 4)) {
                    request.abort();
                }
                if (retryHandle !== null) {
                    clearTimeout(retryHandle);
                    retryHandle = null;
                }
            };
            var retryLoop = function (retryIndex) {
                request.open('GET', loadUrl);
                if (useArrayBuffer) {
                    request.responseType = "arraybuffer";
                }
                if (onProgress) {
                    request.addEventListener("progress", onProgress);
                }
                var onLoadEnd = function () {
                    request.removeEventListener("loadend", onLoadEnd);
                    fileRequest.onCompleteObservable.notifyObservers(fileRequest);
                    fileRequest.onCompleteObservable.clear();
                };
                request.addEventListener("loadend", onLoadEnd);
                var onReadyStateChange = function () {
                    if (aborted) {
                        return;
                    }
                    // In case of undefined state in some browsers.
                    if (request.readyState === (XMLHttpRequest.DONE || 4)) {
                        // Some browsers have issues where onreadystatechange can be called multiple times with the same value.
                        request.removeEventListener("readystatechange", onReadyStateChange);
                        if ((request.status >= 200 && request.status < 300) || (request.status === 0 && (!DomManagement.IsWindowObjectExist() || Tools.IsFileURL()))) {
                            onSuccess(!useArrayBuffer ? request.responseText : request.response, request.responseURL);
                            return;
                        }
                        var retryStrategy = Tools.DefaultRetryStrategy;
                        if (retryStrategy) {
                            var waitTime = retryStrategy(loadUrl, request, retryIndex);
                            if (waitTime !== -1) {
                                // Prevent the request from completing for retry.
                                request.removeEventListener("loadend", onLoadEnd);
                                request = new WebRequest();
                                retryHandle = setTimeout(function () { return retryLoop(retryIndex + 1); }, waitTime);
                                return;
                            }
                        }
                        var e = new LoadFileError("Error status: " + request.status + " " + request.statusText + " - Unable to load " + loadUrl, request);
                        if (onError) {
                            onError(request, e);
                        }
                        else {
                            throw e;
                        }
                    }
                };
                request.addEventListener("readystatechange", onReadyStateChange);
                request.send();
            };
            retryLoop(0);
        };
        // Caching all files
        if (offlineProvider && offlineProvider.enableSceneOffline) {
            var noOfflineSupport_1 = function (request) {
                if (request && request.status > 400) {
                    if (onError) {
                        onError(request);
                    }
                }
                else {
                    if (!aborted) {
                        requestFile();
                    }
                }
            };
            var loadFromOfflineSupport = function () {
                // TODO: database needs to support aborting and should return a IFileRequest
                if (aborted) {
                    return;
                }
                if (offlineProvider) {
                    offlineProvider.loadFile(url, function (data) {
                        if (!aborted) {
                            onSuccess(data);
                        }
                        fileRequest.onCompleteObservable.notifyObservers(fileRequest);
                    }, onProgress ? function (event) {
                        if (!aborted) {
                            onProgress(event);
                        }
                    } : undefined, noOfflineSupport_1, useArrayBuffer);
                }
            };
            offlineProvider.open(loadFromOfflineSupport, noOfflineSupport_1);
        }
        else {
            requestFile();
        }
        return fileRequest;
    };
    /**
     * Load a script (identified by an url). When the url returns, the
     * content of this file is added into a new script element, attached to the DOM (body element)
     * @param scriptUrl defines the url of the script to laod
     * @param onSuccess defines the callback called when the script is loaded
     * @param onError defines the callback to call if an error occurs
     * @param scriptId defines the id of the script element
     */
    Tools.LoadScript = function (scriptUrl, onSuccess, onError, scriptId) {
        if (!DomManagement.IsWindowObjectExist()) {
            return;
        }
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', scriptUrl);
        if (scriptId) {
            script.id = scriptId;
        }
        script.onload = function () {
            if (onSuccess) {
                onSuccess();
            }
        };
        script.onerror = function (e) {
            if (onError) {
                onError("Unable to load script '" + scriptUrl + "'", e);
            }
        };
        head.appendChild(script);
    };
    /**
     * Load an asynchronous script (identified by an url). When the url returns, the
     * content of this file is added into a new script element, attached to the DOM (body element)
     * @param scriptUrl defines the url of the script to laod
     * @param scriptId defines the id of the script element
     * @returns a promise request object
     */
    Tools.LoadScriptAsync = function (scriptUrl, scriptId) {
        return new Promise(function (resolve, reject) {
            if (!DomManagement.IsWindowObjectExist()) {
                resolve(false);
                return;
            }
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', scriptUrl);
            if (scriptId) {
                script.id = scriptId;
            }
            script.onload = function () {
                resolve(true);
            };
            script.onerror = function (e) {
                resolve(false);
            };
            head.appendChild(script);
        });
    };
    /**
     * Loads a file from a blob
     * @param fileToLoad defines the blob to use
     * @param callback defines the callback to call when data is loaded
     * @param progressCallback defines the callback to call during loading process
     * @returns a file request object
     */
    Tools.ReadFileAsDataURL = function (fileToLoad, callback, progressCallback) {
        var reader = new FileReader();
        var request = {
            onCompleteObservable: new Observable(),
            abort: function () { return reader.abort(); },
        };
        reader.onloadend = function (e) {
            request.onCompleteObservable.notifyObservers(request);
        };
        reader.onload = function (e) {
            //target doesn't have result from ts 1.3
            callback(e.target['result']);
        };
        reader.onprogress = progressCallback;
        reader.readAsDataURL(fileToLoad);
        return request;
    };
    /**
     * Loads a file
     * @param fileToLoad defines the file to load
     * @param callback defines the callback to call when data is loaded
     * @param progressCallBack defines the callback to call during loading process
     * @param useArrayBuffer defines a boolean indicating that data must be returned as an ArrayBuffer
     * @returns a file request object
     */
    Tools.ReadFile = function (fileToLoad, callback, progressCallBack, useArrayBuffer) {
        var reader = new FileReader();
        var request = {
            onCompleteObservable: new Observable(),
            abort: function () { return reader.abort(); },
        };
        reader.onloadend = function (e) { return request.onCompleteObservable.notifyObservers(request); };
        reader.onerror = function (e) {
            Logger.Log("Error while reading file: " + fileToLoad.name);
            callback(JSON.stringify({ autoClear: true, clearColor: [1, 0, 0], ambientColor: [0, 0, 0], gravity: [0, -9.807, 0], meshes: [], cameras: [], lights: [] }));
        };
        reader.onload = function (e) {
            //target doesn't have result from ts 1.3
            callback(e.target['result']);
        };
        if (progressCallBack) {
            reader.onprogress = progressCallBack;
        }
        if (!useArrayBuffer) {
            // Asynchronous read
            reader.readAsText(fileToLoad);
        }
        else {
            reader.readAsArrayBuffer(fileToLoad);
        }
        return request;
    };
    /**
     * Creates a data url from a given string content
     * @param content defines the content to convert
     * @returns the new data url link
     */
    Tools.FileAsURL = function (content) {
        var fileBlob = new Blob([content]);
        var url = window.URL || window.webkitURL;
        var link = url.createObjectURL(fileBlob);
        return link;
    };
    /**
     * Format the given number to a specific decimal format
     * @param value defines the number to format
     * @param decimals defines the number of decimals to use
     * @returns the formatted string
     */
    Tools.Format = function (value, decimals) {
        if (decimals === void 0) { decimals = 2; }
        return value.toFixed(decimals);
    };
    /**
     * Checks if a given vector is inside a specific range
     * @param v defines the vector to test
     * @param min defines the minimum range
     * @param max defines the maximum range
     */
    Tools.CheckExtends = function (v, min, max) {
        min.minimizeInPlace(v);
        max.maximizeInPlace(v);
    };
    /**
     * Tries to copy an object by duplicating every property
     * @param source defines the source object
     * @param destination defines the target object
     * @param doNotCopyList defines a list of properties to avoid
     * @param mustCopyList defines a list of properties to copy (even if they start with _)
     */
    Tools.DeepCopy = function (source, destination, doNotCopyList, mustCopyList) {
        DeepCopier.DeepCopy(source, destination, doNotCopyList, mustCopyList);
    };
    /**
     * Gets a boolean indicating if the given object has no own property
     * @param obj defines the object to test
     * @returns true if object has no own property
     */
    Tools.IsEmpty = function (obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    };
    /**
     * Checks for a matching suffix at the end of a string (for ES5 and lower)
     * @param str Source string
     * @param suffix Suffix to search for in the source string
     * @returns Boolean indicating whether the suffix was found (true) or not (false)
     */
    Tools.EndsWith = function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };
    /**
     * Function used to register events at window level
     * @param events defines the events to register
     */
    Tools.RegisterTopRootEvents = function (events) {
        for (var index = 0; index < events.length; index++) {
            var event = events[index];
            window.addEventListener(event.name, event.handler, false);
            try {
                if (window.parent) {
                    window.parent.addEventListener(event.name, event.handler, false);
                }
            }
            catch (e) {
                // Silently fails...
            }
        }
    };
    /**
     * Function used to unregister events from window level
     * @param events defines the events to unregister
     */
    Tools.UnregisterTopRootEvents = function (events) {
        for (var index = 0; index < events.length; index++) {
            var event = events[index];
            window.removeEventListener(event.name, event.handler);
            try {
                if (window.parent) {
                    window.parent.removeEventListener(event.name, event.handler);
                }
            }
            catch (e) {
                // Silently fails...
            }
        }
    };
    /**
     * Dumps the current bound framebuffer
     * @param width defines the rendering width
     * @param height defines the rendering height
     * @param engine defines the hosting engine
     * @param successCallback defines the callback triggered once the data are available
     * @param mimeType defines the mime type of the result
     * @param fileName defines the filename to download. If present, the result will automatically be downloaded
     */
    Tools.DumpFramebuffer = function (width, height, engine, successCallback, mimeType, fileName) {
        if (mimeType === void 0) { mimeType = "image/png"; }
        // Read the contents of the framebuffer
        var numberOfChannelsByLine = width * 4;
        var halfHeight = height / 2;
        //Reading datas from WebGL
        var data = engine.readPixels(0, 0, width, height);
        //To flip image on Y axis.
        for (var i = 0; i < halfHeight; i++) {
            for (var j = 0; j < numberOfChannelsByLine; j++) {
                var currentCell = j + i * numberOfChannelsByLine;
                var targetLine = height - i - 1;
                var targetCell = j + targetLine * numberOfChannelsByLine;
                var temp = data[currentCell];
                data[currentCell] = data[targetCell];
                data[targetCell] = temp;
            }
        }
        // Create a 2D canvas to store the result
        if (!Tools._ScreenshotCanvas) {
            Tools._ScreenshotCanvas = document.createElement('canvas');
        }
        Tools._ScreenshotCanvas.width = width;
        Tools._ScreenshotCanvas.height = height;
        var context = Tools._ScreenshotCanvas.getContext('2d');
        if (context) {
            // Copy the pixels to a 2D canvas
            var imageData = context.createImageData(width, height);
            var castData = (imageData.data);
            castData.set(data);
            context.putImageData(imageData, 0, 0);
            Tools.EncodeScreenshotCanvasData(successCallback, mimeType, fileName);
        }
    };
    /**
     * Converts the canvas data to blob.
     * This acts as a polyfill for browsers not supporting the to blob function.
     * @param canvas Defines the canvas to extract the data from
     * @param successCallback Defines the callback triggered once the data are available
     * @param mimeType Defines the mime type of the result
     */
    Tools.ToBlob = function (canvas, successCallback, mimeType) {
        if (mimeType === void 0) { mimeType = "image/png"; }
        // We need HTMLCanvasElement.toBlob for HD screenshots
        if (!canvas.toBlob) {
            //  low performance polyfill based on toDataURL (https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
            canvas.toBlob = function (callback, type, quality) {
                var _this = this;
                setTimeout(function () {
                    var binStr = atob(_this.toDataURL(type, quality).split(',')[1]), len = binStr.length, arr = new Uint8Array(len);
                    for (var i = 0; i < len; i++) {
                        arr[i] = binStr.charCodeAt(i);
                    }
                    callback(new Blob([arr]));
                });
            };
        }
        canvas.toBlob(function (blob) {
            successCallback(blob);
        }, mimeType);
    };
    /**
     * Encodes the canvas data to base 64 or automatically download the result if filename is defined
     * @param successCallback defines the callback triggered once the data are available
     * @param mimeType defines the mime type of the result
     * @param fileName defines he filename to download. If present, the result will automatically be downloaded
     */
    Tools.EncodeScreenshotCanvasData = function (successCallback, mimeType, fileName) {
        if (mimeType === void 0) { mimeType = "image/png"; }
        if (successCallback) {
            var base64Image = Tools._ScreenshotCanvas.toDataURL(mimeType);
            successCallback(base64Image);
        }
        else {
            this.ToBlob(Tools._ScreenshotCanvas, function (blob) {
                //Creating a link if the browser have the download attribute on the a tag, to automatically start download generated image.
                if (("download" in document.createElement("a"))) {
                    if (!fileName) {
                        var date = new Date();
                        var stringDate = (date.getFullYear() + "-" + (date.getMonth() + 1)).slice(2) + "-" + date.getDate() + "_" + date.getHours() + "-" + ('0' + date.getMinutes()).slice(-2);
                        fileName = "screenshot_" + stringDate + ".png";
                    }
                    Tools.Download(blob, fileName);
                }
                else {
                    var url = URL.createObjectURL(blob);
                    var newWindow = window.open("");
                    if (!newWindow) {
                        return;
                    }
                    var img = newWindow.document.createElement("img");
                    img.onload = function () {
                        // no longer need to read the blob so it's revoked
                        URL.revokeObjectURL(url);
                    };
                    img.src = url;
                    newWindow.document.body.appendChild(img);
                }
            }, mimeType);
        }
    };
    /**
     * Downloads a blob in the browser
     * @param blob defines the blob to download
     * @param fileName defines the name of the downloaded file
     */
    Tools.Download = function (blob, fileName) {
        if (navigator && navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
            return;
        }
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = fileName;
        a.addEventListener("click", function () {
            if (a.parentElement) {
                a.parentElement.removeChild(a);
            }
        });
        a.click();
        window.URL.revokeObjectURL(url);
    };
    /**
     * Captures a screenshot of the current rendering
     * @see http://doc.babylonjs.com/how_to/render_scene_on_a_png
     * @param engine defines the rendering engine
     * @param camera defines the source camera
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param successCallback defines the callback receives a single parameter which contains the
     * screenshot as a string of base64-encoded characters. This string can be assigned to the
     * src parameter of an <img> to display it
     * @param mimeType defines the MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     */
    Tools.CreateScreenshot = function (engine, camera, size, successCallback, mimeType) {
        if (mimeType === void 0) { mimeType = "image/png"; }
        throw _DevTools.WarnImport("ScreenshotTools");
    };
    /**
     * Generates an image screenshot from the specified camera.
     * @see http://doc.babylonjs.com/how_to/render_scene_on_a_png
     * @param engine The engine to use for rendering
     * @param camera The camera to use for rendering
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param successCallback The callback receives a single parameter which contains the
     * screenshot as a string of base64-encoded characters. This string can be assigned to the
     * src parameter of an <img> to display it
     * @param mimeType The MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     * @param samples Texture samples (default: 1)
     * @param antialiasing Whether antialiasing should be turned on or not (default: false)
     * @param fileName A name for for the downloaded file.
     */
    Tools.CreateScreenshotUsingRenderTarget = function (engine, camera, size, successCallback, mimeType, samples, antialiasing, fileName) {
        if (mimeType === void 0) { mimeType = "image/png"; }
        if (samples === void 0) { samples = 1; }
        if (antialiasing === void 0) { antialiasing = false; }
        throw _DevTools.WarnImport("ScreenshotTools");
    };
    /**
     * Implementation from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
     * Be aware Math.random() could cause collisions, but:
     * "All but 6 of the 128 bits of the ID are randomly generated, which means that for any two ids, there's a 1 in 2^^122 (or 5.3x10^^36) chance they'll collide"
     * @returns a pseudo random id
     */
    Tools.RandomId = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    /**
    * Test if the given uri is a base64 string
    * @param uri The uri to test
    * @return True if the uri is a base64 string or false otherwise
    */
    Tools.IsBase64 = function (uri) {
        return uri.length < 5 ? false : uri.substr(0, 5) === "data:";
    };
    /**
    * Decode the given base64 uri.
    * @param uri The uri to decode
    * @return The decoded base64 data.
    */
    Tools.DecodeBase64 = function (uri) {
        var decodedString = atob(uri.split(",")[1]);
        var bufferLength = decodedString.length;
        var bufferView = new Uint8Array(new ArrayBuffer(bufferLength));
        for (var i = 0; i < bufferLength; i++) {
            bufferView[i] = decodedString.charCodeAt(i);
        }
        return bufferView.buffer;
    };
    /**
     * Gets the absolute url.
     * @param url the input url
     * @return the absolute url
     */
    Tools.GetAbsoluteUrl = function (url) {
        var a = document.createElement("a");
        a.href = url;
        return a.href;
    };
    Object.defineProperty(Tools, "errorsCount", {
        /**
         * Gets a value indicating the number of loading errors
         * @ignorenaming
         */
        get: function () {
            return Logger.errorsCount;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Log a message to the console
     * @param message defines the message to log
     */
    Tools.Log = function (message) {
        Logger.Log(message);
    };
    /**
     * Write a warning message to the console
     * @param message defines the message to log
     */
    Tools.Warn = function (message) {
        Logger.Warn(message);
    };
    /**
     * Write an error message to the console
     * @param message defines the message to log
     */
    Tools.Error = function (message) {
        Logger.Error(message);
    };
    Object.defineProperty(Tools, "LogCache", {
        /**
         * Gets current log cache (list of logs)
         */
        get: function () {
            return Logger.LogCache;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clears the log cache
     */
    Tools.ClearLogCache = function () {
        Logger.ClearLogCache();
    };
    Object.defineProperty(Tools, "LogLevels", {
        /**
         * Sets the current log level (MessageLogLevel / WarningLogLevel / ErrorLogLevel)
         */
        set: function (level) {
            Logger.LogLevels = level;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if the loaded document was accessed via `file:`-Protocol.
     * @returns boolean
     */
    Tools.IsFileURL = function () {
        return location.protocol === "file:";
    };
    Object.defineProperty(Tools, "PerformanceLogLevel", {
        /**
         * Sets the current performance log level
         */
        set: function (level) {
            if ((level & Tools.PerformanceUserMarkLogLevel) === Tools.PerformanceUserMarkLogLevel) {
                Tools.StartPerformanceCounter = Tools._StartUserMark;
                Tools.EndPerformanceCounter = Tools._EndUserMark;
                return;
            }
            if ((level & Tools.PerformanceConsoleLogLevel) === Tools.PerformanceConsoleLogLevel) {
                Tools.StartPerformanceCounter = Tools._StartPerformanceConsole;
                Tools.EndPerformanceCounter = Tools._EndPerformanceConsole;
                return;
            }
            Tools.StartPerformanceCounter = Tools._StartPerformanceCounterDisabled;
            Tools.EndPerformanceCounter = Tools._EndPerformanceCounterDisabled;
        },
        enumerable: true,
        configurable: true
    });
    Tools._StartPerformanceCounterDisabled = function (counterName, condition) {
    };
    Tools._EndPerformanceCounterDisabled = function (counterName, condition) {
    };
    Tools._StartUserMark = function (counterName, condition) {
        if (condition === void 0) { condition = true; }
        if (!Tools._performance) {
            if (!DomManagement.IsWindowObjectExist()) {
                return;
            }
            Tools._performance = window.performance;
        }
        if (!condition || !Tools._performance.mark) {
            return;
        }
        Tools._performance.mark(counterName + "-Begin");
    };
    Tools._EndUserMark = function (counterName, condition) {
        if (condition === void 0) { condition = true; }
        if (!condition || !Tools._performance.mark) {
            return;
        }
        Tools._performance.mark(counterName + "-End");
        Tools._performance.measure(counterName, counterName + "-Begin", counterName + "-End");
    };
    Tools._StartPerformanceConsole = function (counterName, condition) {
        if (condition === void 0) { condition = true; }
        if (!condition) {
            return;
        }
        Tools._StartUserMark(counterName, condition);
        if (console.time) {
            console.time(counterName);
        }
    };
    Tools._EndPerformanceConsole = function (counterName, condition) {
        if (condition === void 0) { condition = true; }
        if (!condition) {
            return;
        }
        Tools._EndUserMark(counterName, condition);
        if (console.time) {
            console.timeEnd(counterName);
        }
    };
    Object.defineProperty(Tools, "Now", {
        /**
         * Gets either window.performance.now() if supported or Date.now() else
         */
        get: function () {
            return PrecisionDate.Now;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method will return the name of the class used to create the instance of the given object.
     * It will works only on Javascript basic data types (number, string, ...) and instance of class declared with the @className decorator.
     * @param object the object to get the class name from
     * @param isType defines if the object is actually a type
     * @returns the name of the class, will be "object" for a custom data type not using the @className decorator
     */
    Tools.GetClassName = function (object, isType) {
        if (isType === void 0) { isType = false; }
        var name = null;
        if (!isType && object.getClassName) {
            name = object.getClassName();
        }
        else {
            if (object instanceof Object) {
                var classObj = isType ? object : Object.getPrototypeOf(object);
                name = classObj.constructor["__bjsclassName__"];
            }
            if (!name) {
                name = typeof object;
            }
        }
        return name;
    };
    /**
     * Gets the first element of an array satisfying a given predicate
     * @param array defines the array to browse
     * @param predicate defines the predicate to use
     * @returns null if not found or the element
     */
    Tools.First = function (array, predicate) {
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var el = array_1[_i];
            if (predicate(el)) {
                return el;
            }
        }
        return null;
    };
    /**
     * This method will return the name of the full name of the class, including its owning module (if any).
     * It will works only on Javascript basic data types (number, string, ...) and instance of class declared with the @className decorator or implementing a method getClassName():string (in which case the module won't be specified).
     * @param object the object to get the class name from
     * @param isType defines if the object is actually a type
     * @return a string that can have two forms: "moduleName.className" if module was specified when the class' Name was registered or "className" if there was not module specified.
     * @ignorenaming
     */
    Tools.getFullClassName = function (object, isType) {
        if (isType === void 0) { isType = false; }
        var className = null;
        var moduleName = null;
        if (!isType && object.getClassName) {
            className = object.getClassName();
        }
        else {
            if (object instanceof Object) {
                var classObj = isType ? object : Object.getPrototypeOf(object);
                className = classObj.constructor["__bjsclassName__"];
                moduleName = classObj.constructor["__bjsmoduleName__"];
            }
            if (!className) {
                className = typeof object;
            }
        }
        if (!className) {
            return null;
        }
        return ((moduleName != null) ? (moduleName + ".") : "") + className;
    };
    /**
     * Returns a promise that resolves after the given amount of time.
     * @param delay Number of milliseconds to delay
     * @returns Promise that resolves after the given amount of time
     */
    Tools.DelayAsync = function (delay) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, delay);
        });
    };
    /**
     * Gets the current gradient from an array of IValueGradient
     * @param ratio defines the current ratio to get
     * @param gradients defines the array of IValueGradient
     * @param updateFunc defines the callback function used to get the final value from the selected gradients
     */
    Tools.GetCurrentGradient = function (ratio, gradients, updateFunc) {
        for (var gradientIndex = 0; gradientIndex < gradients.length - 1; gradientIndex++) {
            var currentGradient = gradients[gradientIndex];
            var nextGradient = gradients[gradientIndex + 1];
            if (ratio >= currentGradient.gradient && ratio <= nextGradient.gradient) {
                var scale = (ratio - currentGradient.gradient) / (nextGradient.gradient - currentGradient.gradient);
                updateFunc(currentGradient, nextGradient, scale);
                return;
            }
        }
        // Use last index if over
        var lastIndex = gradients.length - 1;
        updateFunc(gradients[lastIndex], gradients[lastIndex], 1.0);
    };
    /**
     * Gets or sets the base URL to use to load assets
     */
    Tools.BaseUrl = "";
    /**
     * Enable/Disable Custom HTTP Request Headers globally.
     * default = false
     * @see CustomRequestHeaders
     */
    Tools.UseCustomRequestHeaders = false;
    /**
     * Custom HTTP Request Headers to be sent with XMLHttpRequests
     * i.e. when loading files, where the server/service expects an Authorization header
     */
    Tools.CustomRequestHeaders = WebRequest.CustomRequestHeaders;
    /**
     * Gets or sets the retry strategy to apply when an error happens while loading an asset
     */
    Tools.DefaultRetryStrategy = RetryStrategy.ExponentialBackoff();
    /**
     * Default behaviour for cors in the application.
     * It can be a string if the expected behavior is identical in the entire app.
     * Or a callback to be able to set it per url or on a group of them (in case of Video source for instance)
     */
    Tools.CorsBehavior = "anonymous";
    /**
     * Gets or sets a global variable indicating if fallback texture must be used when a texture cannot be loaded
     * @ignorenaming
     */
    Tools.UseFallbackTexture = true;
    /**
     * Use this object to register external classes like custom textures or material
     * to allow the laoders to instantiate them
     */
    Tools.RegisteredExternalClasses = {};
    /**
     * Texture content used if a texture cannot loaded
     * @ignorenaming
     */
    Tools.fallbackTexture = "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBmRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAExAAIAAAAQAAAATgAAAAAAAABgAAAAAQAAAGAAAAABcGFpbnQubmV0IDQuMC41AP/bAEMABAIDAwMCBAMDAwQEBAQFCQYFBQUFCwgIBgkNCw0NDQsMDA4QFBEODxMPDAwSGBITFRYXFxcOERkbGRYaFBYXFv/bAEMBBAQEBQUFCgYGChYPDA8WFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFv/AABEIAQABAAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APH6KKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76CiiigD5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BQooooA+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/voKKKKAPl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76CiiigD5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BQooooA+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/voKKKKAPl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76P//Z";
    Tools._tmpFloatArray = new Float32Array(1);
    /**
     * Extracts text content from a DOM element hierarchy
     * Back Compat only, please use DomManagement.GetDOMTextContent instead.
     */
    Tools.GetDOMTextContent = DomManagement.GetDOMTextContent;
    /**
     * Gets or sets a function used to pre-process url before using them to load assets
     */
    Tools.PreprocessUrl = function (url) {
        return url;
    };
    // Logs
    /**
     * No log
     */
    Tools.NoneLogLevel = Logger.NoneLogLevel;
    /**
     * Only message logs
     */
    Tools.MessageLogLevel = Logger.MessageLogLevel;
    /**
     * Only warning logs
     */
    Tools.WarningLogLevel = Logger.WarningLogLevel;
    /**
     * Only error logs
     */
    Tools.ErrorLogLevel = Logger.ErrorLogLevel;
    /**
     * All logs
     */
    Tools.AllLogLevel = Logger.AllLogLevel;
    /**
     * Checks if the window object exists
     * Back Compat only, please use DomManagement.IsWindowObjectExist instead.
     */
    Tools.IsWindowObjectExist = DomManagement.IsWindowObjectExist;
    // Performances
    /**
     * No performance log
     */
    Tools.PerformanceNoneLogLevel = 0;
    /**
     * Use user marks to log performance
     */
    Tools.PerformanceUserMarkLogLevel = 1;
    /**
     * Log performance to the console
     */
    Tools.PerformanceConsoleLogLevel = 2;
    /**
     * Starts a performance counter
     */
    Tools.StartPerformanceCounter = Tools._StartPerformanceCounterDisabled;
    /**
     * Ends a specific performance coutner
     */
    Tools.EndPerformanceCounter = Tools._EndPerformanceCounterDisabled;
    return Tools;
}());

/**
 * This class is used to track a performance counter which is number based.
 * The user has access to many properties which give statistics of different nature.
 *
 * The implementer can track two kinds of Performance Counter: time and count.
 * For time you can optionally call fetchNewFrame() to notify the start of a new frame to monitor, then call beginMonitoring() to start and endMonitoring() to record the lapsed time. endMonitoring takes a newFrame parameter for you to specify if the monitored time should be set for a new frame or accumulated to the current frame being monitored.
 * For count you first have to call fetchNewFrame() to notify the start of a new frame to monitor, then call addCount() how many time required to increment the count value you monitor.
 */
var PerfCounter = /** @class */ (function () {
    /**
     * Creates a new counter
     */
    function PerfCounter() {
        this._startMonitoringTime = 0;
        this._min = 0;
        this._max = 0;
        this._average = 0;
        this._lastSecAverage = 0;
        this._current = 0;
        this._totalValueCount = 0;
        this._totalAccumulated = 0;
        this._lastSecAccumulated = 0;
        this._lastSecTime = 0;
        this._lastSecValueCount = 0;
    }
    Object.defineProperty(PerfCounter.prototype, "min", {
        /**
         * Returns the smallest value ever
         */
        get: function () {
            return this._min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerfCounter.prototype, "max", {
        /**
         * Returns the biggest value ever
         */
        get: function () {
            return this._max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerfCounter.prototype, "average", {
        /**
         * Returns the average value since the performance counter is running
         */
        get: function () {
            return this._average;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerfCounter.prototype, "lastSecAverage", {
        /**
         * Returns the average value of the last second the counter was monitored
         */
        get: function () {
            return this._lastSecAverage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerfCounter.prototype, "current", {
        /**
         * Returns the current value
         */
        get: function () {
            return this._current;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerfCounter.prototype, "total", {
        /**
         * Gets the accumulated total
         */
        get: function () {
            return this._totalAccumulated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerfCounter.prototype, "count", {
        /**
         * Gets the total value count
         */
        get: function () {
            return this._totalValueCount;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Call this method to start monitoring a new frame.
     * This scenario is typically used when you accumulate monitoring time many times for a single frame, you call this method at the start of the frame, then beginMonitoring to start recording and endMonitoring(false) to accumulated the recorded time to the PerfCounter or addCount() to accumulate a monitored count.
     */
    PerfCounter.prototype.fetchNewFrame = function () {
        this._totalValueCount++;
        this._current = 0;
        this._lastSecValueCount++;
    };
    /**
     * Call this method to monitor a count of something (e.g. mesh drawn in viewport count)
     * @param newCount the count value to add to the monitored count
     * @param fetchResult true when it's the last time in the frame you add to the counter and you wish to update the statistics properties (min/max/average), false if you only want to update statistics.
     */
    PerfCounter.prototype.addCount = function (newCount, fetchResult) {
        if (!PerfCounter.Enabled) {
            return;
        }
        this._current += newCount;
        if (fetchResult) {
            this._fetchResult();
        }
    };
    /**
     * Start monitoring this performance counter
     */
    PerfCounter.prototype.beginMonitoring = function () {
        if (!PerfCounter.Enabled) {
            return;
        }
        this._startMonitoringTime = PrecisionDate.Now;
    };
    /**
     * Compute the time lapsed since the previous beginMonitoring() call.
     * @param newFrame true by default to fetch the result and monitor a new frame, if false the time monitored will be added to the current frame counter
     */
    PerfCounter.prototype.endMonitoring = function (newFrame) {
        if (newFrame === void 0) { newFrame = true; }
        if (!PerfCounter.Enabled) {
            return;
        }
        if (newFrame) {
            this.fetchNewFrame();
        }
        var currentTime = PrecisionDate.Now;
        this._current = currentTime - this._startMonitoringTime;
        if (newFrame) {
            this._fetchResult();
        }
    };
    PerfCounter.prototype._fetchResult = function () {
        this._totalAccumulated += this._current;
        this._lastSecAccumulated += this._current;
        // Min/Max update
        this._min = Math.min(this._min, this._current);
        this._max = Math.max(this._max, this._current);
        this._average = this._totalAccumulated / this._totalValueCount;
        // Reset last sec?
        var now = PrecisionDate.Now;
        if ((now - this._lastSecTime) > 1000) {
            this._lastSecAverage = this._lastSecAccumulated / this._lastSecValueCount;
            this._lastSecTime = now;
            this._lastSecAccumulated = 0;
            this._lastSecValueCount = 0;
        }
    };
    /**
     * Gets or sets a global boolean to turn on and off all the counters
     */
    PerfCounter.Enabled = true;
    return PerfCounter;
}());

/**
 * Use this className as a decorator on a given class definition to add it a name and optionally its module.
 * You can then use the Tools.getClassName(obj) on an instance to retrieve its class name.
 * This method is the only way to get it done in all cases, even if the .js file declaring the class is minified
 * @param name The name of the class, case should be preserved
 * @param module The name of the Module hosting the class, optional, but strongly recommended to specify if possible. Case should be preserved.
 */
function className(name, module) {
    return function (target) {
        target["__bjsclassName__"] = name;
        target["__bjsmoduleName__"] = (module != null) ? module : null;
    };
}
/**
 * An implementation of a loop for asynchronous functions.
 */
var AsyncLoop = /** @class */ (function () {
    /**
     * Constructor.
     * @param iterations the number of iterations.
     * @param func the function to run each iteration
     * @param successCallback the callback that will be called upon succesful execution
     * @param offset starting offset.
     */
    function AsyncLoop(
    /**
     * Defines the number of iterations for the loop
     */
    iterations, func, successCallback, offset) {
        if (offset === void 0) { offset = 0; }
        this.iterations = iterations;
        this.index = offset - 1;
        this._done = false;
        this._fn = func;
        this._successCallback = successCallback;
    }
    /**
     * Execute the next iteration. Must be called after the last iteration was finished.
     */
    AsyncLoop.prototype.executeNext = function () {
        if (!this._done) {
            if (this.index + 1 < this.iterations) {
                ++this.index;
                this._fn(this);
            }
            else {
                this.breakLoop();
            }
        }
    };
    /**
     * Break the loop and run the success callback.
     */
    AsyncLoop.prototype.breakLoop = function () {
        this._done = true;
        this._successCallback();
    };
    /**
     * Create and run an async loop.
     * @param iterations the number of iterations.
     * @param fn the function to run each iteration
     * @param successCallback the callback that will be called upon succesful execution
     * @param offset starting offset.
     * @returns the created async loop object
     */
    AsyncLoop.Run = function (iterations, fn, successCallback, offset) {
        if (offset === void 0) { offset = 0; }
        var loop = new AsyncLoop(iterations, fn, successCallback, offset);
        loop.executeNext();
        return loop;
    };
    /**
     * A for-loop that will run a given number of iterations synchronous and the rest async.
     * @param iterations total number of iterations
     * @param syncedIterations number of synchronous iterations in each async iteration.
     * @param fn the function to call each iteration.
     * @param callback a success call back that will be called when iterating stops.
     * @param breakFunction a break condition (optional)
     * @param timeout timeout settings for the setTimeout function. default - 0.
     * @returns the created async loop object
     */
    AsyncLoop.SyncAsyncForLoop = function (iterations, syncedIterations, fn, callback, breakFunction, timeout) {
        if (timeout === void 0) { timeout = 0; }
        return AsyncLoop.Run(Math.ceil(iterations / syncedIterations), function (loop) {
            if (breakFunction && breakFunction()) {
                loop.breakLoop();
            }
            else {
                setTimeout(function () {
                    for (var i = 0; i < syncedIterations; ++i) {
                        var iteration = (loop.index * syncedIterations) + i;
                        if (iteration >= iterations) {
                            break;
                        }
                        fn(iteration);
                        if (breakFunction && breakFunction()) {
                            loop.breakLoop();
                            break;
                        }
                    }
                    loop.executeNext();
                }, timeout);
            }
        }, callback);
    };
    return AsyncLoop;
}());

//# sourceMappingURL=tools.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/andOrNotEvaluator.js
/**
 * Class used to evalaute queries containing `and` and `or` operators
 */
var AndOrNotEvaluator = /** @class */ (function () {
    function AndOrNotEvaluator() {
    }
    /**
     * Evaluate a query
     * @param query defines the query to evaluate
     * @param evaluateCallback defines the callback used to filter result
     * @returns true if the query matches
     */
    AndOrNotEvaluator.Eval = function (query, evaluateCallback) {
        if (!query.match(/\([^\(\)]*\)/g)) {
            query = AndOrNotEvaluator._HandleParenthesisContent(query, evaluateCallback);
        }
        else {
            query = query.replace(/\([^\(\)]*\)/g, function (r) {
                // remove parenthesis
                r = r.slice(1, r.length - 1);
                return AndOrNotEvaluator._HandleParenthesisContent(r, evaluateCallback);
            });
        }
        if (query === "true") {
            return true;
        }
        if (query === "false") {
            return false;
        }
        return AndOrNotEvaluator.Eval(query, evaluateCallback);
    };
    AndOrNotEvaluator._HandleParenthesisContent = function (parenthesisContent, evaluateCallback) {
        evaluateCallback = evaluateCallback || (function (r) {
            return r === "true" ? true : false;
        });
        var result;
        var or = parenthesisContent.split("||");
        for (var i in or) {
            if (or.hasOwnProperty(i)) {
                var ori = AndOrNotEvaluator._SimplifyNegation(or[i].trim());
                var and = ori.split("&&");
                if (and.length > 1) {
                    for (var j = 0; j < and.length; ++j) {
                        var andj = AndOrNotEvaluator._SimplifyNegation(and[j].trim());
                        if (andj !== "true" && andj !== "false") {
                            if (andj[0] === "!") {
                                result = !evaluateCallback(andj.substring(1));
                            }
                            else {
                                result = evaluateCallback(andj);
                            }
                        }
                        else {
                            result = andj === "true" ? true : false;
                        }
                        if (!result) { // no need to continue since 'false && ... && ...' will always return false
                            ori = "false";
                            break;
                        }
                    }
                }
                if (result || ori === "true") { // no need to continue since 'true || ... || ...' will always return true
                    result = true;
                    break;
                }
                // result equals false (or undefined)
                if (ori !== "true" && ori !== "false") {
                    if (ori[0] === "!") {
                        result = !evaluateCallback(ori.substring(1));
                    }
                    else {
                        result = evaluateCallback(ori);
                    }
                }
                else {
                    result = ori === "true" ? true : false;
                }
            }
        }
        // the whole parenthesis scope is replaced by 'true' or 'false'
        return result ? "true" : "false";
    };
    AndOrNotEvaluator._SimplifyNegation = function (booleanString) {
        booleanString = booleanString.replace(/^[\s!]+/, function (r) {
            // remove whitespaces
            r = r.replace(/[\s]/g, function () { return ""; });
            return r.length % 2 ? "!" : "";
        });
        booleanString = booleanString.trim();
        if (booleanString === "!true") {
            booleanString = "false";
        }
        else if (booleanString === "!false") {
            booleanString = "true";
        }
        return booleanString;
    };
    return AndOrNotEvaluator;
}());

//# sourceMappingURL=andOrNotEvaluator.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/tags.js


/**
 * Class used to store custom tags
 */
var Tags = /** @class */ (function () {
    function Tags() {
    }
    /**
     * Adds support for tags on the given object
     * @param obj defines the object to use
     */
    Tags.EnableFor = function (obj) {
        obj._tags = obj._tags || {};
        obj.hasTags = function () {
            return Tags.HasTags(obj);
        };
        obj.addTags = function (tagsString) {
            return Tags.AddTagsTo(obj, tagsString);
        };
        obj.removeTags = function (tagsString) {
            return Tags.RemoveTagsFrom(obj, tagsString);
        };
        obj.matchesTagsQuery = function (tagsQuery) {
            return Tags.MatchesQuery(obj, tagsQuery);
        };
    };
    /**
     * Removes tags support
     * @param obj defines the object to use
     */
    Tags.DisableFor = function (obj) {
        delete obj._tags;
        delete obj.hasTags;
        delete obj.addTags;
        delete obj.removeTags;
        delete obj.matchesTagsQuery;
    };
    /**
     * Gets a boolean indicating if the given object has tags
     * @param obj defines the object to use
     * @returns a boolean
     */
    Tags.HasTags = function (obj) {
        if (!obj._tags) {
            return false;
        }
        return !Tools.IsEmpty(obj._tags);
    };
    /**
     * Gets the tags available on a given object
     * @param obj defines the object to use
     * @param asString defines if the tags must be returned as a string instead of an array of strings
     * @returns the tags
     */
    Tags.GetTags = function (obj, asString) {
        if (asString === void 0) { asString = true; }
        if (!obj._tags) {
            return null;
        }
        if (asString) {
            var tagsArray = [];
            for (var tag in obj._tags) {
                if (obj._tags.hasOwnProperty(tag) && obj._tags[tag] === true) {
                    tagsArray.push(tag);
                }
            }
            return tagsArray.join(" ");
        }
        else {
            return obj._tags;
        }
    };
    /**
     * Adds tags to an object
     * @param obj defines the object to use
     * @param tagsString defines the tag string. The tags 'true' and 'false' are reserved and cannot be used as tags.
     * A tag cannot start with '||', '&&', and '!'. It cannot contain whitespaces
     */
    Tags.AddTagsTo = function (obj, tagsString) {
        if (!tagsString) {
            return;
        }
        if (typeof tagsString !== "string") {
            return;
        }
        var tags = tagsString.split(" ");
        tags.forEach(function (tag, index, array) {
            Tags._AddTagTo(obj, tag);
        });
    };
    /**
     * @hidden
     */
    Tags._AddTagTo = function (obj, tag) {
        tag = tag.trim();
        if (tag === "" || tag === "true" || tag === "false") {
            return;
        }
        if (tag.match(/[\s]/) || tag.match(/^([!]|([|]|[&]){2})/)) {
            return;
        }
        Tags.EnableFor(obj);
        obj._tags[tag] = true;
    };
    /**
     * Removes specific tags from a specific object
     * @param obj defines the object to use
     * @param tagsString defines the tags to remove
     */
    Tags.RemoveTagsFrom = function (obj, tagsString) {
        if (!Tags.HasTags(obj)) {
            return;
        }
        var tags = tagsString.split(" ");
        for (var t in tags) {
            Tags._RemoveTagFrom(obj, tags[t]);
        }
    };
    /**
     * @hidden
     */
    Tags._RemoveTagFrom = function (obj, tag) {
        delete obj._tags[tag];
    };
    /**
     * Defines if tags hosted on an object match a given query
     * @param obj defines the object to use
     * @param tagsQuery defines the tag query
     * @returns a boolean
     */
    Tags.MatchesQuery = function (obj, tagsQuery) {
        if (tagsQuery === undefined) {
            return true;
        }
        if (tagsQuery === "") {
            return Tags.HasTags(obj);
        }
        return AndOrNotEvaluator.Eval(tagsQuery, function (r) { return Tags.HasTags(obj) && obj._tags[r]; });
    };
    return Tags;
}());

//# sourceMappingURL=tags.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Misc/decorators.js



var __decoratorInitialStore = {};
var __mergedStore = {};
var _copySource = function (creationFunction, source, instanciate) {
    var destination = creationFunction();
    // Tags
    if (Tags) {
        Tags.AddTagsTo(destination, source.tags);
    }
    var classStore = getMergedStore(destination);
    // Properties
    for (var property in classStore) {
        var propertyDescriptor = classStore[property];
        var sourceProperty = source[property];
        var propertyType = propertyDescriptor.type;
        if (sourceProperty !== undefined && sourceProperty !== null && property !== "uniqueId") {
            switch (propertyType) {
                case 0: // Value
                case 6: // Mesh reference
                case 11: // Camera reference
                    destination[property] = sourceProperty;
                    break;
                case 1: // Texture
                    destination[property] = (instanciate || sourceProperty.isRenderTarget) ? sourceProperty : sourceProperty.clone();
                    break;
                case 2: // Color3
                case 3: // FresnelParameters
                case 4: // Vector2
                case 5: // Vector3
                case 7: // Color Curves
                case 10: // Quaternion
                case 12: // Matrix
                    destination[property] = instanciate ? sourceProperty : sourceProperty.clone();
                    break;
            }
        }
    }
    return destination;
};
function getDirectStore(target) {
    var classKey = target.getClassName();
    if (!__decoratorInitialStore[classKey]) {
        __decoratorInitialStore[classKey] = {};
    }
    return __decoratorInitialStore[classKey];
}
/**
 * Return the list of properties flagged as serializable
 * @param target: host object
 */
function getMergedStore(target) {
    var classKey = target.getClassName();
    if (__mergedStore[classKey]) {
        return __mergedStore[classKey];
    }
    __mergedStore[classKey] = {};
    var store = __mergedStore[classKey];
    var currentTarget = target;
    var currentKey = classKey;
    while (currentKey) {
        var initialStore = __decoratorInitialStore[currentKey];
        for (var property in initialStore) {
            store[property] = initialStore[property];
        }
        var parent_1 = void 0;
        var done = false;
        do {
            parent_1 = Object.getPrototypeOf(currentTarget);
            if (!parent_1.getClassName) {
                done = true;
                break;
            }
            if (parent_1.getClassName() !== currentKey) {
                break;
            }
            currentTarget = parent_1;
        } while (parent_1);
        if (done) {
            break;
        }
        currentKey = parent_1.getClassName();
        currentTarget = parent_1;
    }
    return store;
}
function generateSerializableMember(type, sourceName) {
    return function (target, propertyKey) {
        var classStore = getDirectStore(target);
        if (!classStore[propertyKey]) {
            classStore[propertyKey] = { type: type, sourceName: sourceName };
        }
    };
}
function generateExpandMember(setCallback, targetKey) {
    if (targetKey === void 0) { targetKey = null; }
    return function (target, propertyKey) {
        var key = targetKey || ("_" + propertyKey);
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return this[key];
            },
            set: function (value) {
                if (this[key] === value) {
                    return;
                }
                this[key] = value;
                target[setCallback].apply(this);
            },
            enumerable: true,
            configurable: true
        });
    };
}
function expandToProperty(callback, targetKey) {
    if (targetKey === void 0) { targetKey = null; }
    return generateExpandMember(callback, targetKey);
}
function serialize(sourceName) {
    return generateSerializableMember(0, sourceName); // value member
}
function serializeAsTexture(sourceName) {
    return generateSerializableMember(1, sourceName); // texture member
}
function serializeAsColor3(sourceName) {
    return generateSerializableMember(2, sourceName); // color3 member
}
function serializeAsFresnelParameters(sourceName) {
    return generateSerializableMember(3, sourceName); // fresnel parameters member
}
function serializeAsVector2(sourceName) {
    return generateSerializableMember(4, sourceName); // vector2 member
}
function serializeAsVector3(sourceName) {
    return generateSerializableMember(5, sourceName); // vector3 member
}
function serializeAsMeshReference(sourceName) {
    return generateSerializableMember(6, sourceName); // mesh reference member
}
function serializeAsColorCurves(sourceName) {
    return generateSerializableMember(7, sourceName); // color curves
}
function serializeAsColor4(sourceName) {
    return generateSerializableMember(8, sourceName); // color 4
}
function serializeAsImageProcessingConfiguration(sourceName) {
    return generateSerializableMember(9, sourceName); // image processing
}
function serializeAsQuaternion(sourceName) {
    return generateSerializableMember(10, sourceName); // quaternion member
}
function serializeAsMatrix(sourceName) {
    return generateSerializableMember(12, sourceName); // matrix member
}
/**
 * Decorator used to define property that can be serialized as reference to a camera
 * @param sourceName defines the name of the property to decorate
 */
function serializeAsCameraReference(sourceName) {
    return generateSerializableMember(11, sourceName); // camera reference member
}
/**
 * Class used to help serialization objects
 */
var SerializationHelper = /** @class */ (function () {
    function SerializationHelper() {
    }
    /**
     * Appends the serialized animations from the source animations
     * @param source Source containing the animations
     * @param destination Target to store the animations
     */
    SerializationHelper.AppendSerializedAnimations = function (source, destination) {
        if (source.animations) {
            destination.animations = [];
            for (var animationIndex = 0; animationIndex < source.animations.length; animationIndex++) {
                var animation = source.animations[animationIndex];
                destination.animations.push(animation.serialize());
            }
        }
    };
    /**
     * Static function used to serialized a specific entity
     * @param entity defines the entity to serialize
     * @param serializationObject defines the optional target obecjt where serialization data will be stored
     * @returns a JSON compatible object representing the serialization of the entity
     */
    SerializationHelper.Serialize = function (entity, serializationObject) {
        if (!serializationObject) {
            serializationObject = {};
        }
        // Tags
        if (Tags) {
            serializationObject.tags = Tags.GetTags(entity);
        }
        var serializedProperties = getMergedStore(entity);
        // Properties
        for (var property in serializedProperties) {
            var propertyDescriptor = serializedProperties[property];
            var targetPropertyName = propertyDescriptor.sourceName || property;
            var propertyType = propertyDescriptor.type;
            var sourceProperty = entity[property];
            if (sourceProperty !== undefined && sourceProperty !== null) {
                switch (propertyType) {
                    case 0: // Value
                        serializationObject[targetPropertyName] = sourceProperty;
                        break;
                    case 1: // Texture
                        serializationObject[targetPropertyName] = sourceProperty.serialize();
                        break;
                    case 2: // Color3
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 3: // FresnelParameters
                        serializationObject[targetPropertyName] = sourceProperty.serialize();
                        break;
                    case 4: // Vector2
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 5: // Vector3
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 6: // Mesh reference
                        serializationObject[targetPropertyName] = sourceProperty.id;
                        break;
                    case 7: // Color Curves
                        serializationObject[targetPropertyName] = sourceProperty.serialize();
                        break;
                    case 8: // Color 4
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 9: // Image Processing
                        serializationObject[targetPropertyName] = sourceProperty.serialize();
                        break;
                    case 10: // Quaternion
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 11: // Camera reference
                        serializationObject[targetPropertyName] = sourceProperty.id;
                    case 12: // Matrix
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                }
            }
        }
        return serializationObject;
    };
    /**
     * Creates a new entity from a serialization data object
     * @param creationFunction defines a function used to instanciated the new entity
     * @param source defines the source serialization data
     * @param scene defines the hosting scene
     * @param rootUrl defines the root url for resources
     * @returns a new entity
     */
    SerializationHelper.Parse = function (creationFunction, source, scene, rootUrl) {
        if (rootUrl === void 0) { rootUrl = null; }
        var destination = creationFunction();
        if (!rootUrl) {
            rootUrl = "";
        }
        // Tags
        if (Tags) {
            Tags.AddTagsTo(destination, source.tags);
        }
        var classStore = getMergedStore(destination);
        // Properties
        for (var property in classStore) {
            var propertyDescriptor = classStore[property];
            var sourceProperty = source[propertyDescriptor.sourceName || property];
            var propertyType = propertyDescriptor.type;
            if (sourceProperty !== undefined && sourceProperty !== null) {
                var dest = destination;
                switch (propertyType) {
                    case 0: // Value
                        dest[property] = sourceProperty;
                        break;
                    case 1: // Texture
                        if (scene) {
                            dest[property] = SerializationHelper._TextureParser(sourceProperty, scene, rootUrl);
                        }
                        break;
                    case 2: // Color3
                        dest[property] = Color3.FromArray(sourceProperty);
                        break;
                    case 3: // FresnelParameters
                        dest[property] = SerializationHelper._FresnelParametersParser(sourceProperty);
                        break;
                    case 4: // Vector2
                        dest[property] = Vector2.FromArray(sourceProperty);
                        break;
                    case 5: // Vector3
                        dest[property] = Vector3.FromArray(sourceProperty);
                        break;
                    case 6: // Mesh reference
                        if (scene) {
                            dest[property] = scene.getLastMeshByID(sourceProperty);
                        }
                        break;
                    case 7: // Color Curves
                        dest[property] = SerializationHelper._ColorCurvesParser(sourceProperty);
                        break;
                    case 8: // Color 4
                        dest[property] = Color4.FromArray(sourceProperty);
                        break;
                    case 9: // Image Processing
                        dest[property] = SerializationHelper._ImageProcessingConfigurationParser(sourceProperty);
                        break;
                    case 10: // Quaternion
                        dest[property] = Quaternion.FromArray(sourceProperty);
                        break;
                    case 11: // Camera reference
                        if (scene) {
                            dest[property] = scene.getCameraByID(sourceProperty);
                        }
                    case 12: // Matrix
                        dest[property] = Matrix.FromArray(sourceProperty);
                        break;
                }
            }
        }
        return destination;
    };
    /**
     * Clones an object
     * @param creationFunction defines the function used to instanciate the new object
     * @param source defines the source object
     * @returns the cloned object
     */
    SerializationHelper.Clone = function (creationFunction, source) {
        return _copySource(creationFunction, source, false);
    };
    /**
     * Instanciates a new object based on a source one (some data will be shared between both object)
     * @param creationFunction defines the function used to instanciate the new object
     * @param source defines the source object
     * @returns the new object
     */
    SerializationHelper.Instanciate = function (creationFunction, source) {
        return _copySource(creationFunction, source, true);
    };
    /** hidden */
    SerializationHelper._ImageProcessingConfigurationParser = function (sourceProperty) {
        throw _DevTools.WarnImport("ImageProcessingConfiguration");
    };
    /** hidden */
    SerializationHelper._FresnelParametersParser = function (sourceProperty) {
        throw _DevTools.WarnImport("FresnelParameters");
    };
    /** hidden */
    SerializationHelper._ColorCurvesParser = function (sourceProperty) {
        throw _DevTools.WarnImport("ColorCurves");
    };
    /** hidden */
    SerializationHelper._TextureParser = function (sourceProperty, scene, rootUrl) {
        throw _DevTools.WarnImport("Texture");
    };
    return SerializationHelper;
}());

//# sourceMappingURL=decorators.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Animations/animationKey.js
/**
 * Enum for the animation key frame interpolation type
 */
var AnimationKeyInterpolation;
(function (AnimationKeyInterpolation) {
    /**
     * Do not interpolate between keys and use the start key value only. Tangents are ignored
     */
    AnimationKeyInterpolation[AnimationKeyInterpolation["STEP"] = 1] = "STEP";
})(AnimationKeyInterpolation || (AnimationKeyInterpolation = {}));
//# sourceMappingURL=animationKey.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Animations/animationRange.js
/**
 * Represents the range of an animation
 */
var AnimationRange = /** @class */ (function () {
    /**
     * Initializes the range of an animation
     * @param name The name of the animation range
     * @param from The starting frame of the animation
     * @param to The ending frame of the animation
     */
    function AnimationRange(
    /**The name of the animation range**/
    name, 
    /**The starting frame of the animation */
    from, 
    /**The ending frame of the animation*/
    to) {
        this.name = name;
        this.from = from;
        this.to = to;
    }
    /**
     * Makes a copy of the animation range
     * @returns A copy of the animation range
     */
    AnimationRange.prototype.clone = function () {
        return new AnimationRange(this.name, this.from, this.to);
    };
    return AnimationRange;
}());

//# sourceMappingURL=animationRange.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Engines/engineStore.js
/**
 * The engine store class is responsible to hold all the instances of Engine and Scene created
 * during the life time of the application.
 */
var EngineStore = /** @class */ (function () {
    function EngineStore() {
    }
    Object.defineProperty(EngineStore, "LastCreatedEngine", {
        /**
         * Gets the latest created engine
         */
        get: function () {
            if (this.Instances.length === 0) {
                return null;
            }
            return this.Instances[this.Instances.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EngineStore, "LastCreatedScene", {
        /**
         * Gets the latest created scene
         */
        get: function () {
            return this._LastCreatedScene;
        },
        enumerable: true,
        configurable: true
    });
    /** Gets the list of created engines */
    EngineStore.Instances = new Array();
    /** @hidden */
    EngineStore._LastCreatedScene = null;
    return EngineStore;
}());

//# sourceMappingURL=engineStore.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/node.js







/**
 * Node is the basic class for all scene objects (Mesh, Light, Camera.)
 */
var Node = /** @class */ (function () {
    /**
     * Creates a new Node
     * @param name the name and id to be given to this node
     * @param scene the scene this node will be added to
     * @param addToRootNodes the node will be added to scene.rootNodes
     */
    function Node(name, scene, addToRootNodes) {
        if (scene === void 0) { scene = null; }
        if (addToRootNodes === void 0) { addToRootNodes = true; }
        /**
         * Gets or sets a string used to store user defined state for the node
         */
        this.state = "";
        /**
         * Gets or sets an object used to store user defined information for the node
         */
        this.metadata = null;
        /**
         * For internal use only. Please do not use.
         */
        this.reservedDataStore = null;
        /**
         * Gets or sets a boolean used to define if the node must be serialized
         */
        this.doNotSerialize = false;
        /** @hidden */
        this._isDisposed = false;
        /**
         * Gets a list of Animations associated with the node
         */
        this.animations = new Array();
        this._ranges = {};
        /**
         * Callback raised when the node is ready to be used
         */
        this.onReady = null;
        this._isEnabled = true;
        this._isParentEnabled = true;
        this._isReady = true;
        /** @hidden */
        this._currentRenderId = -1;
        this._parentUpdateId = -1;
        /** @hidden */
        this._childUpdateId = -1;
        /** @hidden */
        this._waitingParentId = null;
        /** @hidden */
        this._cache = {};
        this._parentNode = null;
        this._children = null;
        /** @hidden */
        this._worldMatrix = Matrix.Identity();
        /** @hidden */
        this._worldMatrixDeterminant = 0;
        /** @hidden */
        this._worldMatrixDeterminantIsDirty = true;
        /** @hidden */
        this._sceneRootNodesIndex = -1;
        this._animationPropertiesOverride = null;
        /** @hidden */
        this._isNode = true;
        /**
        * An event triggered when the mesh is disposed
        */
        this.onDisposeObservable = new Observable();
        this._onDisposeObserver = null;
        // Behaviors
        this._behaviors = new Array();
        this.name = name;
        this.id = name;
        this._scene = (scene || EngineStore.LastCreatedScene);
        this.uniqueId = this._scene.getUniqueId();
        this._initCache();
        if (addToRootNodes) {
            this.addToSceneRootNodes();
        }
    }
    /**
     * Add a new node constructor
     * @param type defines the type name of the node to construct
     * @param constructorFunc defines the constructor function
     */
    Node.AddNodeConstructor = function (type, constructorFunc) {
        this._NodeConstructors[type] = constructorFunc;
    };
    /**
     * Returns a node constructor based on type name
     * @param type defines the type name
     * @param name defines the new node name
     * @param scene defines the hosting scene
     * @param options defines optional options to transmit to constructors
     * @returns the new constructor or null
     */
    Node.Construct = function (type, name, scene, options) {
        var constructorFunc = this._NodeConstructors[type];
        if (!constructorFunc) {
            return null;
        }
        return constructorFunc(name, scene, options);
    };
    /**
     * Gets a boolean indicating if the node has been disposed
     * @returns true if the node was disposed
     */
    Node.prototype.isDisposed = function () {
        return this._isDisposed;
    };
    Object.defineProperty(Node.prototype, "parent", {
        get: function () {
            return this._parentNode;
        },
        /**
         * Gets or sets the parent of the node (without keeping the current position in the scene)
         * @see https://doc.babylonjs.com/how_to/parenting
         */
        set: function (parent) {
            if (this._parentNode === parent) {
                return;
            }
            var previousParentNode = this._parentNode;
            // Remove self from list of children of parent
            if (this._parentNode && this._parentNode._children !== undefined && this._parentNode._children !== null) {
                var index = this._parentNode._children.indexOf(this);
                if (index !== -1) {
                    this._parentNode._children.splice(index, 1);
                }
                if (!parent && !this._isDisposed) {
                    this.addToSceneRootNodes();
                }
            }
            // Store new parent
            this._parentNode = parent;
            // Add as child to new parent
            if (this._parentNode) {
                if (this._parentNode._children === undefined || this._parentNode._children === null) {
                    this._parentNode._children = new Array();
                }
                this._parentNode._children.push(this);
                if (!previousParentNode) {
                    this.removeFromSceneRootNodes();
                }
            }
            // Enabled state
            this._syncParentEnabledState();
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.addToSceneRootNodes = function () {
        if (this._sceneRootNodesIndex === -1) {
            this._sceneRootNodesIndex = this._scene.rootNodes.length;
            this._scene.rootNodes.push(this);
        }
    };
    Node.prototype.removeFromSceneRootNodes = function () {
        if (this._sceneRootNodesIndex !== -1) {
            var rootNodes = this._scene.rootNodes;
            var lastIdx = rootNodes.length - 1;
            rootNodes[this._sceneRootNodesIndex] = rootNodes[lastIdx];
            rootNodes[this._sceneRootNodesIndex]._sceneRootNodesIndex = this._sceneRootNodesIndex;
            this._scene.rootNodes.pop();
            this._sceneRootNodesIndex = -1;
        }
    };
    Object.defineProperty(Node.prototype, "animationPropertiesOverride", {
        /**
         * Gets or sets the animation properties override
         */
        get: function () {
            if (!this._animationPropertiesOverride) {
                return this._scene.animationPropertiesOverride;
            }
            return this._animationPropertiesOverride;
        },
        set: function (value) {
            this._animationPropertiesOverride = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets a string idenfifying the name of the class
     * @returns "Node" string
     */
    Node.prototype.getClassName = function () {
        return "Node";
    };
    Object.defineProperty(Node.prototype, "onDispose", {
        /**
         * Sets a callback that will be raised when the node will be disposed
         */
        set: function (callback) {
            if (this._onDisposeObserver) {
                this.onDisposeObservable.remove(this._onDisposeObserver);
            }
            this._onDisposeObserver = this.onDisposeObservable.add(callback);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the scene of the node
     * @returns a scene
     */
    Node.prototype.getScene = function () {
        return this._scene;
    };
    /**
     * Gets the engine of the node
     * @returns a Engine
     */
    Node.prototype.getEngine = function () {
        return this._scene.getEngine();
    };
    /**
     * Attach a behavior to the node
     * @see http://doc.babylonjs.com/features/behaviour
     * @param behavior defines the behavior to attach
     * @param attachImmediately defines that the behavior must be attached even if the scene is still loading
     * @returns the current Node
     */
    Node.prototype.addBehavior = function (behavior, attachImmediately) {
        var _this = this;
        if (attachImmediately === void 0) { attachImmediately = false; }
        var index = this._behaviors.indexOf(behavior);
        if (index !== -1) {
            return this;
        }
        behavior.init();
        if (this._scene.isLoading && !attachImmediately) {
            // We defer the attach when the scene will be loaded
            this._scene.onDataLoadedObservable.addOnce(function () {
                behavior.attach(_this);
            });
        }
        else {
            behavior.attach(this);
        }
        this._behaviors.push(behavior);
        return this;
    };
    /**
     * Remove an attached behavior
     * @see http://doc.babylonjs.com/features/behaviour
     * @param behavior defines the behavior to attach
     * @returns the current Node
     */
    Node.prototype.removeBehavior = function (behavior) {
        var index = this._behaviors.indexOf(behavior);
        if (index === -1) {
            return this;
        }
        this._behaviors[index].detach();
        this._behaviors.splice(index, 1);
        return this;
    };
    Object.defineProperty(Node.prototype, "behaviors", {
        /**
         * Gets the list of attached behaviors
         * @see http://doc.babylonjs.com/features/behaviour
         */
        get: function () {
            return this._behaviors;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets an attached behavior by name
     * @param name defines the name of the behavior to look for
     * @see http://doc.babylonjs.com/features/behaviour
     * @returns null if behavior was not found else the requested behavior
     */
    Node.prototype.getBehaviorByName = function (name) {
        for (var _i = 0, _a = this._behaviors; _i < _a.length; _i++) {
            var behavior = _a[_i];
            if (behavior.name === name) {
                return behavior;
            }
        }
        return null;
    };
    /**
     * Returns the latest update of the World matrix
     * @returns a Matrix
     */
    Node.prototype.getWorldMatrix = function () {
        if (this._currentRenderId !== this._scene.getRenderId()) {
            this.computeWorldMatrix();
        }
        return this._worldMatrix;
    };
    /** @hidden */
    Node.prototype._getWorldMatrixDeterminant = function () {
        if (this._worldMatrixDeterminantIsDirty) {
            this._worldMatrixDeterminantIsDirty = false;
            this._worldMatrixDeterminant = this._worldMatrix.determinant();
        }
        return this._worldMatrixDeterminant;
    };
    Object.defineProperty(Node.prototype, "worldMatrixFromCache", {
        /**
         * Returns directly the latest state of the mesh World matrix.
         * A Matrix is returned.
         */
        get: function () {
            return this._worldMatrix;
        },
        enumerable: true,
        configurable: true
    });
    // override it in derived class if you add new variables to the cache
    // and call the parent class method
    /** @hidden */
    Node.prototype._initCache = function () {
        this._cache = {};
        this._cache.parent = undefined;
    };
    /** @hidden */
    Node.prototype.updateCache = function (force) {
        if (!force && this.isSynchronized()) {
            return;
        }
        this._cache.parent = this.parent;
        this._updateCache();
    };
    /** @hidden */
    Node.prototype._getActionManagerForTrigger = function (trigger, initialCall) {
        if (initialCall === void 0) { initialCall = true; }
        if (!this.parent) {
            return null;
        }
        return this.parent._getActionManagerForTrigger(trigger, false);
    };
    // override it in derived class if you add new variables to the cache
    // and call the parent class method if !ignoreParentClass
    /** @hidden */
    Node.prototype._updateCache = function (ignoreParentClass) {
    };
    // override it in derived class if you add new variables to the cache
    /** @hidden */
    Node.prototype._isSynchronized = function () {
        return true;
    };
    /** @hidden */
    Node.prototype._markSyncedWithParent = function () {
        if (this._parentNode) {
            this._parentUpdateId = this._parentNode._childUpdateId;
        }
    };
    /** @hidden */
    Node.prototype.isSynchronizedWithParent = function () {
        if (!this._parentNode) {
            return true;
        }
        if (this._parentUpdateId !== this._parentNode._childUpdateId) {
            return false;
        }
        return this._parentNode.isSynchronized();
    };
    /** @hidden */
    Node.prototype.isSynchronized = function () {
        if (this._cache.parent != this._parentNode) {
            this._cache.parent = this._parentNode;
            return false;
        }
        if (this._parentNode && !this.isSynchronizedWithParent()) {
            return false;
        }
        return this._isSynchronized();
    };
    /**
     * Is this node ready to be used/rendered
     * @param completeCheck defines if a complete check (including materials and lights) has to be done (false by default)
     * @return true if the node is ready
     */
    Node.prototype.isReady = function (completeCheck) {
        if (completeCheck === void 0) { completeCheck = false; }
        return this._isReady;
    };
    /**
     * Is this node enabled?
     * If the node has a parent, all ancestors will be checked and false will be returned if any are false (not enabled), otherwise will return true
     * @param checkAncestors indicates if this method should check the ancestors. The default is to check the ancestors. If set to false, the method will return the value of this node without checking ancestors
     * @return whether this node (and its parent) is enabled
     */
    Node.prototype.isEnabled = function (checkAncestors) {
        if (checkAncestors === void 0) { checkAncestors = true; }
        if (checkAncestors === false) {
            return this._isEnabled;
        }
        if (!this._isEnabled) {
            return false;
        }
        return this._isParentEnabled;
    };
    /** @hidden */
    Node.prototype._syncParentEnabledState = function () {
        this._isParentEnabled = this._parentNode ? this._parentNode.isEnabled() : true;
        if (this._children) {
            this._children.forEach(function (c) {
                c._syncParentEnabledState(); // Force children to update accordingly
            });
        }
    };
    /**
     * Set the enabled state of this node
     * @param value defines the new enabled state
     */
    Node.prototype.setEnabled = function (value) {
        this._isEnabled = value;
        this._syncParentEnabledState();
    };
    /**
     * Is this node a descendant of the given node?
     * The function will iterate up the hierarchy until the ancestor was found or no more parents defined
     * @param ancestor defines the parent node to inspect
     * @returns a boolean indicating if this node is a descendant of the given node
     */
    Node.prototype.isDescendantOf = function (ancestor) {
        if (this.parent) {
            if (this.parent === ancestor) {
                return true;
            }
            return this.parent.isDescendantOf(ancestor);
        }
        return false;
    };
    /** @hidden */
    Node.prototype._getDescendants = function (results, directDescendantsOnly, predicate) {
        if (directDescendantsOnly === void 0) { directDescendantsOnly = false; }
        if (!this._children) {
            return;
        }
        for (var index = 0; index < this._children.length; index++) {
            var item = this._children[index];
            if (!predicate || predicate(item)) {
                results.push(item);
            }
            if (!directDescendantsOnly) {
                item._getDescendants(results, false, predicate);
            }
        }
    };
    /**
     * Will return all nodes that have this node as ascendant
     * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered
     * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
     * @return all children nodes of all types
     */
    Node.prototype.getDescendants = function (directDescendantsOnly, predicate) {
        var results = new Array();
        this._getDescendants(results, directDescendantsOnly, predicate);
        return results;
    };
    /**
     * Get all child-meshes of this node
     * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered (Default: false)
     * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
     * @returns an array of AbstractMesh
     */
    Node.prototype.getChildMeshes = function (directDescendantsOnly, predicate) {
        var results = [];
        this._getDescendants(results, directDescendantsOnly, function (node) {
            return ((!predicate || predicate(node)) && (node.cullingStrategy !== undefined));
        });
        return results;
    };
    /**
     * Get all direct children of this node
     * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
     * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered (Default: true)
     * @returns an array of Node
     */
    Node.prototype.getChildren = function (predicate, directDescendantsOnly) {
        if (directDescendantsOnly === void 0) { directDescendantsOnly = true; }
        return this.getDescendants(directDescendantsOnly, predicate);
    };
    /** @hidden */
    Node.prototype._setReady = function (state) {
        if (state === this._isReady) {
            return;
        }
        if (!state) {
            this._isReady = false;
            return;
        }
        if (this.onReady) {
            this.onReady(this);
        }
        this._isReady = true;
    };
    /**
     * Get an animation by name
     * @param name defines the name of the animation to look for
     * @returns null if not found else the requested animation
     */
    Node.prototype.getAnimationByName = function (name) {
        for (var i = 0; i < this.animations.length; i++) {
            var animation = this.animations[i];
            if (animation.name === name) {
                return animation;
            }
        }
        return null;
    };
    /**
     * Creates an animation range for this node
     * @param name defines the name of the range
     * @param from defines the starting key
     * @param to defines the end key
     */
    Node.prototype.createAnimationRange = function (name, from, to) {
        // check name not already in use
        if (!this._ranges[name]) {
            this._ranges[name] = Node._AnimationRangeFactory(name, from, to);
            for (var i = 0, nAnimations = this.animations.length; i < nAnimations; i++) {
                if (this.animations[i]) {
                    this.animations[i].createRange(name, from, to);
                }
            }
        }
    };
    /**
     * Delete a specific animation range
     * @param name defines the name of the range to delete
     * @param deleteFrames defines if animation frames from the range must be deleted as well
     */
    Node.prototype.deleteAnimationRange = function (name, deleteFrames) {
        if (deleteFrames === void 0) { deleteFrames = true; }
        for (var i = 0, nAnimations = this.animations.length; i < nAnimations; i++) {
            if (this.animations[i]) {
                this.animations[i].deleteRange(name, deleteFrames);
            }
        }
        this._ranges[name] = null; // said much faster than 'delete this._range[name]'
    };
    /**
     * Get an animation range by name
     * @param name defines the name of the animation range to look for
     * @returns null if not found else the requested animation range
     */
    Node.prototype.getAnimationRange = function (name) {
        return this._ranges[name];
    };
    /**
     * Gets the list of all animation ranges defined on this node
     * @returns an array
     */
    Node.prototype.getAnimationRanges = function () {
        var animationRanges = [];
        var name;
        for (name in this._ranges) {
            animationRanges.push(this._ranges[name]);
        }
        return animationRanges;
    };
    /**
     * Will start the animation sequence
     * @param name defines the range frames for animation sequence
     * @param loop defines if the animation should loop (false by default)
     * @param speedRatio defines the speed factor in which to run the animation (1 by default)
     * @param onAnimationEnd defines a function to be executed when the animation ended (undefined by default)
     * @returns the object created for this animation. If range does not exist, it will return null
     */
    Node.prototype.beginAnimation = function (name, loop, speedRatio, onAnimationEnd) {
        var range = this.getAnimationRange(name);
        if (!range) {
            return null;
        }
        return this._scene.beginAnimation(this, range.from, range.to, loop, speedRatio, onAnimationEnd);
    };
    /**
     * Serialize animation ranges into a JSON compatible object
     * @returns serialization object
     */
    Node.prototype.serializeAnimationRanges = function () {
        var serializationRanges = [];
        for (var name in this._ranges) {
            var localRange = this._ranges[name];
            if (!localRange) {
                continue;
            }
            var range = {};
            range.name = name;
            range.from = localRange.from;
            range.to = localRange.to;
            serializationRanges.push(range);
        }
        return serializationRanges;
    };
    /**
     * Computes the world matrix of the node
     * @param force defines if the cache version should be invalidated forcing the world matrix to be created from scratch
     * @returns the world matrix
     */
    Node.prototype.computeWorldMatrix = function (force) {
        if (!this._worldMatrix) {
            this._worldMatrix = Matrix.Identity();
        }
        return this._worldMatrix;
    };
    /**
     * Releases resources associated with this node.
     * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
     * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
     */
    Node.prototype.dispose = function (doNotRecurse, disposeMaterialAndTextures) {
        if (disposeMaterialAndTextures === void 0) { disposeMaterialAndTextures = false; }
        this._isDisposed = true;
        if (!doNotRecurse) {
            var nodes = this.getDescendants(true);
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                node.dispose(doNotRecurse, disposeMaterialAndTextures);
            }
        }
        if (!this.parent) {
            this.removeFromSceneRootNodes();
        }
        else {
            this.parent = null;
        }
        // Callback
        this.onDisposeObservable.notifyObservers(this);
        this.onDisposeObservable.clear();
        // Behaviors
        for (var _a = 0, _b = this._behaviors; _a < _b.length; _a++) {
            var behavior = _b[_a];
            behavior.detach();
        }
        this._behaviors = [];
    };
    /**
     * Parse animation range data from a serialization object and store them into a given node
     * @param node defines where to store the animation ranges
     * @param parsedNode defines the serialization object to read data from
     * @param scene defines the hosting scene
     */
    Node.ParseAnimationRanges = function (node, parsedNode, scene) {
        if (parsedNode.ranges) {
            for (var index = 0; index < parsedNode.ranges.length; index++) {
                var data = parsedNode.ranges[index];
                node.createAnimationRange(data.name, data.from, data.to);
            }
        }
    };
    /**
 * Return the minimum and maximum world vectors of the entire hierarchy under current node
 * @param includeDescendants Include bounding info from descendants as well (true by default)
 * @param predicate defines a callback function that can be customize to filter what meshes should be included in the list used to compute the bounding vectors
 * @returns the new bounding vectors
 */
    Node.prototype.getHierarchyBoundingVectors = function (includeDescendants, predicate) {
        if (includeDescendants === void 0) { includeDescendants = true; }
        if (predicate === void 0) { predicate = null; }
        // Ensures that all world matrix will be recomputed.
        this.getScene().incrementRenderId();
        this.computeWorldMatrix(true);
        var min;
        var max;
        var thisAbstractMesh = this;
        if (thisAbstractMesh.getBoundingInfo && thisAbstractMesh.subMeshes) {
            // If this is an abstract mesh get its bounding info
            var boundingInfo = thisAbstractMesh.getBoundingInfo();
            min = boundingInfo.boundingBox.minimumWorld;
            max = boundingInfo.boundingBox.maximumWorld;
        }
        else {
            min = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            max = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        }
        if (includeDescendants) {
            var descendants = this.getDescendants(false);
            for (var _i = 0, descendants_1 = descendants; _i < descendants_1.length; _i++) {
                var descendant = descendants_1[_i];
                var childMesh = descendant;
                childMesh.computeWorldMatrix(true);
                // Filters meshes based on custom predicate function.
                if (predicate && !predicate(childMesh)) {
                    continue;
                }
                //make sure we have the needed params to get mix and max
                if (!childMesh.getBoundingInfo || childMesh.getTotalVertices() === 0) {
                    continue;
                }
                var childBoundingInfo = childMesh.getBoundingInfo();
                var boundingBox = childBoundingInfo.boundingBox;
                var minBox = boundingBox.minimumWorld;
                var maxBox = boundingBox.maximumWorld;
                Tools.CheckExtends(minBox, min, max);
                Tools.CheckExtends(maxBox, min, max);
            }
        }
        return {
            min: min,
            max: max
        };
    };
    /** @hidden */
    Node._AnimationRangeFactory = function (name, from, to) {
        throw _DevTools.WarnImport("AnimationRange");
    };
    Node._NodeConstructors = {};
    __decorate([
        serialize()
    ], Node.prototype, "name", void 0);
    __decorate([
        serialize()
    ], Node.prototype, "id", void 0);
    __decorate([
        serialize()
    ], Node.prototype, "uniqueId", void 0);
    __decorate([
        serialize()
    ], Node.prototype, "state", void 0);
    __decorate([
        serialize()
    ], Node.prototype, "metadata", void 0);
    return Node;
}());

//# sourceMappingURL=node.js.map
;// CONCATENATED MODULE: ./node_modules/@babylonjs/core/Animations/animation.js







/**
 * @hidden
 */
var _IAnimationState = /** @class */ (function () {
    function _IAnimationState() {
    }
    return _IAnimationState;
}());

/**
 * Class used to store any kind of animation
 */
var Animation = /** @class */ (function () {
    /**
     * Initializes the animation
     * @param name Name of the animation
     * @param targetProperty Property to animate
     * @param framePerSecond The frames per second of the animation
     * @param dataType The data type of the animation
     * @param loopMode The loop mode of the animation
     * @param enableBlending Specifies if blending should be enabled
     */
    function Animation(
    /**Name of the animation */
    name, 
    /**Property to animate */
    targetProperty, 
    /**The frames per second of the animation */
    framePerSecond, 
    /**The data type of the animation */
    dataType, 
    /**The loop mode of the animation */
    loopMode, 
    /**Specifies if blending should be enabled */
    enableBlending) {
        this.name = name;
        this.targetProperty = targetProperty;
        this.framePerSecond = framePerSecond;
        this.dataType = dataType;
        this.loopMode = loopMode;
        this.enableBlending = enableBlending;
        /**
         * @hidden Internal use only
         */
        this._runtimeAnimations = new Array();
        /**
         * The set of event that will be linked to this animation
         */
        this._events = new Array();
        /**
         * Stores the blending speed of the animation
         */
        this.blendingSpeed = 0.01;
        /**
         * Stores the animation ranges for the animation
         */
        this._ranges = {};
        this.targetPropertyPath = targetProperty.split(".");
        this.dataType = dataType;
        this.loopMode = loopMode === undefined ? Animation.ANIMATIONLOOPMODE_CYCLE : loopMode;
    }
    /**
     * @hidden Internal use
     */
    Animation._PrepareAnimation = function (name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction) {
        var dataType = undefined;
        if (!isNaN(parseFloat(from)) && isFinite(from)) {
            dataType = Animation.ANIMATIONTYPE_FLOAT;
        }
        else if (from instanceof Quaternion) {
            dataType = Animation.ANIMATIONTYPE_QUATERNION;
        }
        else if (from instanceof Vector3) {
            dataType = Animation.ANIMATIONTYPE_VECTOR3;
        }
        else if (from instanceof Vector2) {
            dataType = Animation.ANIMATIONTYPE_VECTOR2;
        }
        else if (from instanceof Color3) {
            dataType = Animation.ANIMATIONTYPE_COLOR3;
        }
        else if (from instanceof Size) {
            dataType = Animation.ANIMATIONTYPE_SIZE;
        }
        if (dataType == undefined) {
            return null;
        }
        var animation = new Animation(name, targetProperty, framePerSecond, dataType, loopMode);
        var keys = [{ frame: 0, value: from }, { frame: totalFrame, value: to }];
        animation.setKeys(keys);
        if (easingFunction !== undefined) {
            animation.setEasingFunction(easingFunction);
        }
        return animation;
    };
    /**
     * Sets up an animation
     * @param property The property to animate
     * @param animationType The animation type to apply
     * @param framePerSecond The frames per second of the animation
     * @param easingFunction The easing function used in the animation
     * @returns The created animation
     */
    Animation.CreateAnimation = function (property, animationType, framePerSecond, easingFunction) {
        var animation = new Animation(property + "Animation", property, framePerSecond, animationType, Animation.ANIMATIONLOOPMODE_CONSTANT);
        animation.setEasingFunction(easingFunction);
        return animation;
    };
    /**
     * Create and start an animation on a node
     * @param name defines the name of the global animation that will be run on all nodes
     * @param node defines the root node where the animation will take place
     * @param targetProperty defines property to animate
     * @param framePerSecond defines the number of frame per second yo use
     * @param totalFrame defines the number of frames in total
     * @param from defines the initial value
     * @param to defines the final value
     * @param loopMode defines which loop mode you want to use (off by default)
     * @param easingFunction defines the easing function to use (linear by default)
     * @param onAnimationEnd defines the callback to call when animation end
     * @returns the animatable created for this animation
     */
    Animation.CreateAndStartAnimation = function (name, node, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd) {
        var animation = Animation._PrepareAnimation(name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
        if (!animation) {
            return null;
        }
        return node.getScene().beginDirectAnimation(node, [animation], 0, totalFrame, (animation.loopMode === 1), 1.0, onAnimationEnd);
    };
    /**
     * Create and start an animation on a node and its descendants
     * @param name defines the name of the global animation that will be run on all nodes
     * @param node defines the root node where the animation will take place
     * @param directDescendantsOnly if true only direct descendants will be used, if false direct and also indirect (children of children, an so on in a recursive manner) descendants will be used
     * @param targetProperty defines property to animate
     * @param framePerSecond defines the number of frame per second to use
     * @param totalFrame defines the number of frames in total
     * @param from defines the initial value
     * @param to defines the final value
     * @param loopMode defines which loop mode you want to use (off by default)
     * @param easingFunction defines the easing function to use (linear by default)
     * @param onAnimationEnd defines the callback to call when an animation ends (will be called once per node)
     * @returns the list of animatables created for all nodes
     * @example https://www.babylonjs-playground.com/#MH0VLI
     */
    Animation.CreateAndStartHierarchyAnimation = function (name, node, directDescendantsOnly, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd) {
        var animation = Animation._PrepareAnimation(name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
        if (!animation) {
            return null;
        }
        var scene = node.getScene();
        return scene.beginDirectHierarchyAnimation(node, directDescendantsOnly, [animation], 0, totalFrame, (animation.loopMode === 1), 1.0, onAnimationEnd);
    };
    /**
     * Creates a new animation, merges it with the existing animations and starts it
     * @param name Name of the animation
     * @param node Node which contains the scene that begins the animations
     * @param targetProperty Specifies which property to animate
     * @param framePerSecond The frames per second of the animation
     * @param totalFrame The total number of frames
     * @param from The frame at the beginning of the animation
     * @param to The frame at the end of the animation
     * @param loopMode Specifies the loop mode of the animation
     * @param easingFunction (Optional) The easing function of the animation, which allow custom mathematical formulas for animations
     * @param onAnimationEnd Callback to run once the animation is complete
     * @returns Nullable animation
     */
    Animation.CreateMergeAndStartAnimation = function (name, node, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd) {
        var animation = Animation._PrepareAnimation(name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
        if (!animation) {
            return null;
        }
        node.animations.push(animation);
        return node.getScene().beginAnimation(node, 0, totalFrame, (animation.loopMode === 1), 1.0, onAnimationEnd);
    };
    /**
     * Transition property of an host to the target Value
     * @param property The property to transition
     * @param targetValue The target Value of the property
     * @param host The object where the property to animate belongs
     * @param scene Scene used to run the animation
     * @param frameRate Framerate (in frame/s) to use
     * @param transition The transition type we want to use
     * @param duration The duration of the animation, in milliseconds
     * @param onAnimationEnd Callback trigger at the end of the animation
     * @returns Nullable animation
     */
    Animation.TransitionTo = function (property, targetValue, host, scene, frameRate, transition, duration, onAnimationEnd) {
        if (onAnimationEnd === void 0) { onAnimationEnd = null; }
        if (duration <= 0) {
            host[property] = targetValue;
            if (onAnimationEnd) {
                onAnimationEnd();
            }
            return null;
        }
        var endFrame = frameRate * (duration / 1000);
        transition.setKeys([{
                frame: 0,
                value: host[property].clone ? host[property].clone() : host[property]
            },
            {
                frame: endFrame,
                value: targetValue
            }]);
        if (!host.animations) {
            host.animations = [];
        }
        host.animations.push(transition);
        var animation = scene.beginAnimation(host, 0, endFrame, false);
        animation.onAnimationEnd = onAnimationEnd;
        return animation;
    };
    Object.defineProperty(Animation.prototype, "runtimeAnimations", {
        /**
         * Return the array of runtime animations currently using this animation
         */
        get: function () {
            return this._runtimeAnimations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "hasRunningRuntimeAnimations", {
        /**
         * Specifies if any of the runtime animations are currently running
         */
        get: function () {
            for (var _i = 0, _a = this._runtimeAnimations; _i < _a.length; _i++) {
                var runtimeAnimation = _a[_i];
                if (!runtimeAnimation.isStopped) {
                    return true;
                }
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    // Methods
    /**
     * Converts the animation to a string
     * @param fullDetails support for multiple levels of logging within scene loading
     * @returns String form of the animation
     */
    Animation.prototype.toString = function (fullDetails) {
        var ret = "Name: " + this.name + ", property: " + this.targetProperty;
        ret += ", datatype: " + (["Float", "Vector3", "Quaternion", "Matrix", "Color3", "Vector2"])[this.dataType];
        ret += ", nKeys: " + (this._keys ? this._keys.length : "none");
        ret += ", nRanges: " + (this._ranges ? Object.keys(this._ranges).length : "none");
        if (fullDetails) {
            ret += ", Ranges: {";
            var first = true;
            for (var name in this._ranges) {
                if (first) {
                    ret += ", ";
                    first = false;
                }
                ret += name;
            }
            ret += "}";
        }
        return ret;
    };
    /**
     * Add an event to this animation
     * @param event Event to add
     */
    Animation.prototype.addEvent = function (event) {
        this._events.push(event);
    };
    /**
     * Remove all events found at the given frame
     * @param frame The frame to remove events from
     */
    Animation.prototype.removeEvents = function (frame) {
        for (var index = 0; index < this._events.length; index++) {
            if (this._events[index].frame === frame) {
                this._events.splice(index, 1);
                index--;
            }
        }
    };
    /**
     * Retrieves all the events from the animation
     * @returns Events from the animation
     */
    Animation.prototype.getEvents = function () {
        return this._events;
    };
    /**
     * Creates an animation range
     * @param name Name of the animation range
     * @param from Starting frame of the animation range
     * @param to Ending frame of the animation
     */
    Animation.prototype.createRange = function (name, from, to) {
        // check name not already in use; could happen for bones after serialized
        if (!this._ranges[name]) {
            this._ranges[name] = new AnimationRange(name, from, to);
        }
    };
    /**
     * Deletes an animation range by name
     * @param name Name of the animation range to delete
     * @param deleteFrames Specifies if the key frames for the range should also be deleted (true) or not (false)
     */
    Animation.prototype.deleteRange = function (name, deleteFrames) {
        if (deleteFrames === void 0) { deleteFrames = true; }
        var range = this._ranges[name];
        if (!range) {
            return;
        }
        if (deleteFrames) {
            var from = range.from;
            var to = range.to;
            // this loop MUST go high to low for multiple splices to work
            for (var key = this._keys.length - 1; key >= 0; key--) {
                if (this._keys[key].frame >= from && this._keys[key].frame <= to) {
                    this._keys.splice(key, 1);
                }
            }
        }
        this._ranges[name] = null; // said much faster than 'delete this._range[name]'
    };
    /**
     * Gets the animation range by name, or null if not defined
     * @param name Name of the animation range
     * @returns Nullable animation range
     */
    Animation.prototype.getRange = function (name) {
        return this._ranges[name];
    };
    /**
     * Gets the key frames from the animation
     * @returns The key frames of the animation
     */
    Animation.prototype.getKeys = function () {
        return this._keys;
    };
    /**
     * Gets the highest frame rate of the animation
     * @returns Highest frame rate of the animation
     */
    Animation.prototype.getHighestFrame = function () {
        var ret = 0;
        for (var key = 0, nKeys = this._keys.length; key < nKeys; key++) {
            if (ret < this._keys[key].frame) {
                ret = this._keys[key].frame;
            }
        }
        return ret;
    };
    /**
     * Gets the easing function of the animation
     * @returns Easing function of the animation
     */
    Animation.prototype.getEasingFunction = function () {
        return this._easingFunction;
    };
    /**
     * Sets the easing function of the animation
     * @param easingFunction A custom mathematical formula for animation
     */
    Animation.prototype.setEasingFunction = function (easingFunction) {
        this._easingFunction = easingFunction;
    };
    /**
     * Interpolates a scalar linearly
     * @param startValue Start value of the animation curve
     * @param endValue End value of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated scalar value
     */
    Animation.prototype.floatInterpolateFunction = function (startValue, endValue, gradient) {
        return Scalar.Lerp(startValue, endValue, gradient);
    };
    /**
     * Interpolates a scalar cubically
     * @param startValue Start value of the animation curve
     * @param outTangent End tangent of the animation
     * @param endValue End value of the animation curve
     * @param inTangent Start tangent of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated scalar value
     */
    Animation.prototype.floatInterpolateFunctionWithTangents = function (startValue, outTangent, endValue, inTangent, gradient) {
        return Scalar.Hermite(startValue, outTangent, endValue, inTangent, gradient);
    };
    /**
     * Interpolates a quaternion using a spherical linear interpolation
     * @param startValue Start value of the animation curve
     * @param endValue End value of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated quaternion value
     */
    Animation.prototype.quaternionInterpolateFunction = function (startValue, endValue, gradient) {
        return Quaternion.Slerp(startValue, endValue, gradient);
    };
    /**
     * Interpolates a quaternion cubically
     * @param startValue Start value of the animation curve
     * @param outTangent End tangent of the animation curve
     * @param endValue End value of the animation curve
     * @param inTangent Start tangent of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated quaternion value
     */
    Animation.prototype.quaternionInterpolateFunctionWithTangents = function (startValue, outTangent, endValue, inTangent, gradient) {
        return Quaternion.Hermite(startValue, outTangent, endValue, inTangent, gradient).normalize();
    };
    /**
     * Interpolates a Vector3 linearl
     * @param startValue Start value of the animation curve
     * @param endValue End value of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated scalar value
     */
    Animation.prototype.vector3InterpolateFunction = function (startValue, endValue, gradient) {
        return Vector3.Lerp(startValue, endValue, gradient);
    };
    /**
     * Interpolates a Vector3 cubically
     * @param startValue Start value of the animation curve
     * @param outTangent End tangent of the animation
     * @param endValue End value of the animation curve
     * @param inTangent Start tangent of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns InterpolatedVector3 value
     */
    Animation.prototype.vector3InterpolateFunctionWithTangents = function (startValue, outTangent, endValue, inTangent, gradient) {
        return Vector3.Hermite(startValue, outTangent, endValue, inTangent, gradient);
    };
    /**
     * Interpolates a Vector2 linearly
     * @param startValue Start value of the animation curve
     * @param endValue End value of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated Vector2 value
     */
    Animation.prototype.vector2InterpolateFunction = function (startValue, endValue, gradient) {
        return Vector2.Lerp(startValue, endValue, gradient);
    };
    /**
     * Interpolates a Vector2 cubically
     * @param startValue Start value of the animation curve
     * @param outTangent End tangent of the animation
     * @param endValue End value of the animation curve
     * @param inTangent Start tangent of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated Vector2 value
     */
    Animation.prototype.vector2InterpolateFunctionWithTangents = function (startValue, outTangent, endValue, inTangent, gradient) {
        return Vector2.Hermite(startValue, outTangent, endValue, inTangent, gradient);
    };
    /**
     * Interpolates a size linearly
     * @param startValue Start value of the animation curve
     * @param endValue End value of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated Size value
     */
    Animation.prototype.sizeInterpolateFunction = function (startValue, endValue, gradient) {
        return Size.Lerp(startValue, endValue, gradient);
    };
    /**
     * Interpolates a Color3 linearly
     * @param startValue Start value of the animation curve
     * @param endValue End value of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated Color3 value
     */
    Animation.prototype.color3InterpolateFunction = function (startValue, endValue, gradient) {
        return Color3.Lerp(startValue, endValue, gradient);
    };
    /**
     * @hidden Internal use only
     */
    Animation.prototype._getKeyValue = function (value) {
        if (typeof value === "function") {
            return value();
        }
        return value;
    };
    /**
     * @hidden Internal use only
     */
    Animation.prototype._interpolate = function (currentFrame, state) {
        if (state.loopMode === Animation.ANIMATIONLOOPMODE_CONSTANT && state.repeatCount > 0) {
            return state.highLimitValue.clone ? state.highLimitValue.clone() : state.highLimitValue;
        }
        var keys = this._keys;
        if (keys.length === 1) {
            return this._getKeyValue(keys[0].value);
        }
        var startKeyIndex = state.key;
        if (keys[startKeyIndex].frame >= currentFrame) {
            while (startKeyIndex - 1 >= 0 && keys[startKeyIndex].frame >= currentFrame) {
                startKeyIndex--;
            }
        }
        for (var key = startKeyIndex; key < keys.length; key++) {
            var endKey = keys[key + 1];
            if (endKey.frame >= currentFrame) {
                state.key = key;
                var startKey = keys[key];
                var startValue = this._getKeyValue(startKey.value);
                if (startKey.interpolation === AnimationKeyInterpolation.STEP) {
                    return startValue;
                }
                var endValue = this._getKeyValue(endKey.value);
                var useTangent = startKey.outTangent !== undefined && endKey.inTangent !== undefined;
                var frameDelta = endKey.frame - startKey.frame;
                // gradient : percent of currentFrame between the frame inf and the frame sup
                var gradient = (currentFrame - startKey.frame) / frameDelta;
                // check for easingFunction and correction of gradient
                var easingFunction = this.getEasingFunction();
                if (easingFunction != null) {
                    gradient = easingFunction.ease(gradient);
                }
                switch (this.dataType) {
                    // Float
                    case Animation.ANIMATIONTYPE_FLOAT:
                        var floatValue = useTangent ? this.floatInterpolateFunctionWithTangents(startValue, startKey.outTangent * frameDelta, endValue, endKey.inTangent * frameDelta, gradient) : this.floatInterpolateFunction(startValue, endValue, gradient);
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return floatValue;
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return state.offsetValue * state.repeatCount + floatValue;
                        }
                        break;
                    // Quaternion
                    case Animation.ANIMATIONTYPE_QUATERNION:
                        var quatValue = useTangent ? this.quaternionInterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this.quaternionInterpolateFunction(startValue, endValue, gradient);
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return quatValue;
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return quatValue.addInPlace(state.offsetValue.scale(state.repeatCount));
                        }
                        return quatValue;
                    // Vector3
                    case Animation.ANIMATIONTYPE_VECTOR3:
                        var vec3Value = useTangent ? this.vector3InterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this.vector3InterpolateFunction(startValue, endValue, gradient);
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return vec3Value;
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return vec3Value.add(state.offsetValue.scale(state.repeatCount));
                        }
                    // Vector2
                    case Animation.ANIMATIONTYPE_VECTOR2:
                        var vec2Value = useTangent ? this.vector2InterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this.vector2InterpolateFunction(startValue, endValue, gradient);
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return vec2Value;
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return vec2Value.add(state.offsetValue.scale(state.repeatCount));
                        }
                    // Size
                    case Animation.ANIMATIONTYPE_SIZE:
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return this.sizeInterpolateFunction(startValue, endValue, gradient);
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return this.sizeInterpolateFunction(startValue, endValue, gradient).add(state.offsetValue.scale(state.repeatCount));
                        }
                    // Color3
                    case Animation.ANIMATIONTYPE_COLOR3:
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return this.color3InterpolateFunction(startValue, endValue, gradient);
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return this.color3InterpolateFunction(startValue, endValue, gradient).add(state.offsetValue.scale(state.repeatCount));
                        }
                    // Matrix
                    case Animation.ANIMATIONTYPE_MATRIX:
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                if (Animation.AllowMatricesInterpolation) {
                                    return this.matrixInterpolateFunction(startValue, endValue, gradient, state.workValue);
                                }
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return startValue;
                        }
                    default:
                        break;
                }
                break;
            }
        }
        return this._getKeyValue(keys[keys.length - 1].value);
    };
    /**
     * Defines the function to use to interpolate matrices
     * @param startValue defines the start matrix
     * @param endValue defines the end matrix
     * @param gradient defines the gradient between both matrices
     * @param result defines an optional target matrix where to store the interpolation
     * @returns the interpolated matrix
     */
    Animation.prototype.matrixInterpolateFunction = function (startValue, endValue, gradient, result) {
        if (Animation.AllowMatrixDecomposeForInterpolation) {
            if (result) {
                Matrix.DecomposeLerpToRef(startValue, endValue, gradient, result);
                return result;
            }
            return Matrix.DecomposeLerp(startValue, endValue, gradient);
        }
        if (result) {
            Matrix.LerpToRef(startValue, endValue, gradient, result);
            return result;
        }
        return Matrix.Lerp(startValue, endValue, gradient);
    };
    /**
     * Makes a copy of the animation
     * @returns Cloned animation
     */
    Animation.prototype.clone = function () {
        var clone = new Animation(this.name, this.targetPropertyPath.join("."), this.framePerSecond, this.dataType, this.loopMode);
        clone.enableBlending = this.enableBlending;
        clone.blendingSpeed = this.blendingSpeed;
        if (this._keys) {
            clone.setKeys(this._keys);
        }
        if (this._ranges) {
            clone._ranges = {};
            for (var name in this._ranges) {
                var range = this._ranges[name];
                if (!range) {
                    continue;
                }
                clone._ranges[name] = range.clone();
            }
        }
        return clone;
    };
    /**
     * Sets the key frames of the animation
     * @param values The animation key frames to set
     */
    Animation.prototype.setKeys = function (values) {
        this._keys = values.slice(0);
    };
    /**
     * Serializes the animation to an object
     * @returns Serialized object
     */
    Animation.prototype.serialize = function () {
        var serializationObject = {};
        serializationObject.name = this.name;
        serializationObject.property = this.targetProperty;
        serializationObject.framePerSecond = this.framePerSecond;
        serializationObject.dataType = this.dataType;
        serializationObject.loopBehavior = this.loopMode;
        serializationObject.enableBlending = this.enableBlending;
        serializationObject.blendingSpeed = this.blendingSpeed;
        var dataType = this.dataType;
        serializationObject.keys = [];
        var keys = this.getKeys();
        for (var index = 0; index < keys.length; index++) {
            var animationKey = keys[index];
            var key = {};
            key.frame = animationKey.frame;
            switch (dataType) {
                case Animation.ANIMATIONTYPE_FLOAT:
                    key.values = [animationKey.value];
                    break;
                case Animation.ANIMATIONTYPE_QUATERNION:
                case Animation.ANIMATIONTYPE_MATRIX:
                case Animation.ANIMATIONTYPE_VECTOR3:
                case Animation.ANIMATIONTYPE_COLOR3:
                    key.values = animationKey.value.asArray();
                    break;
            }
            serializationObject.keys.push(key);
        }
        serializationObject.ranges = [];
        for (var name in this._ranges) {
            var source = this._ranges[name];
            if (!source) {
                continue;
            }
            var range = {};
            range.name = name;
            range.from = source.from;
            range.to = source.to;
            serializationObject.ranges.push(range);
        }
        return serializationObject;
    };
    Object.defineProperty(Animation, "ANIMATIONTYPE_FLOAT", {
        /**
         * Get the float animation type
         */
        get: function () {
            return Animation._ANIMATIONTYPE_FLOAT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation, "ANIMATIONTYPE_VECTOR3", {
        /**
         * Get the Vector3 animation type
         */
        get: function () {
            return Animation._ANIMATIONTYPE_VECTOR3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation, "ANIMATIONTYPE_VECTOR2", {
        /**
         * Get the Vector2 animation type
         */
        get: function () {
            return Animation._ANIMATIONTYPE_VECTOR2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation, "ANIMATIONTYPE_SIZE", {
        /**
         * Get the Size animation type
         */
        get: function () {
            return Animation._ANIMATIONTYPE_SIZE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation, "ANIMATIONTYPE_QUATERNION", {
        /**
         * Get the Quaternion animation type
         */
        get: function () {
            return Animation._ANIMATIONTYPE_QUATERNION;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation, "ANIMATIONTYPE_MATRIX", {
        /**
         * Get the Matrix animation type
         */
        get: function () {
            return Animation._ANIMATIONTYPE_MATRIX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation, "ANIMATIONTYPE_COLOR3", {
        /**
         * Get the Color3 animation type
         */
        get: function () {
            return Animation._ANIMATIONTYPE_COLOR3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation, "ANIMATIONLOOPMODE_RELATIVE", {
        /**
         * Get the Relative Loop Mode
         */
        get: function () {
            return Animation._ANIMATIONLOOPMODE_RELATIVE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation, "ANIMATIONLOOPMODE_CYCLE", {
        /**
         * Get the Cycle Loop Mode
         */
        get: function () {
            return Animation._ANIMATIONLOOPMODE_CYCLE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation, "ANIMATIONLOOPMODE_CONSTANT", {
        /**
         * Get the Constant Loop Mode
         */
        get: function () {
            return Animation._ANIMATIONLOOPMODE_CONSTANT;
        },
        enumerable: true,
        configurable: true
    });
    /** @hidden */
    Animation._UniversalLerp = function (left, right, amount) {
        var constructor = left.constructor;
        if (constructor.Lerp) { // Lerp supported
            return constructor.Lerp(left, right, amount);
        }
        else if (constructor.Slerp) { // Slerp supported
            return constructor.Slerp(left, right, amount);
        }
        else if (left.toFixed) { // Number
            return left * (1.0 - amount) + amount * right;
        }
        else { // Blending not supported
            return right;
        }
    };
    /**
     * Parses an animation object and creates an animation
     * @param parsedAnimation Parsed animation object
     * @returns Animation object
     */
    Animation.Parse = function (parsedAnimation) {
        var animation = new Animation(parsedAnimation.name, parsedAnimation.property, parsedAnimation.framePerSecond, parsedAnimation.dataType, parsedAnimation.loopBehavior);
        var dataType = parsedAnimation.dataType;
        var keys = [];
        var data;
        var index;
        if (parsedAnimation.enableBlending) {
            animation.enableBlending = parsedAnimation.enableBlending;
        }
        if (parsedAnimation.blendingSpeed) {
            animation.blendingSpeed = parsedAnimation.blendingSpeed;
        }
        for (index = 0; index < parsedAnimation.keys.length; index++) {
            var key = parsedAnimation.keys[index];
            var inTangent;
            var outTangent;
            switch (dataType) {
                case Animation.ANIMATIONTYPE_FLOAT:
                    data = key.values[0];
                    if (key.values.length >= 1) {
                        inTangent = key.values[1];
                    }
                    if (key.values.length >= 2) {
                        outTangent = key.values[2];
                    }
                    break;
                case Animation.ANIMATIONTYPE_QUATERNION:
                    data = Quaternion.FromArray(key.values);
                    if (key.values.length >= 8) {
                        var _inTangent = Quaternion.FromArray(key.values.slice(4, 8));
                        if (!_inTangent.equals(Quaternion.Zero())) {
                            inTangent = _inTangent;
                        }
                    }
                    if (key.values.length >= 12) {
                        var _outTangent = Quaternion.FromArray(key.values.slice(8, 12));
                        if (!_outTangent.equals(Quaternion.Zero())) {
                            outTangent = _outTangent;
                        }
                    }
                    break;
                case Animation.ANIMATIONTYPE_MATRIX:
                    data = Matrix.FromArray(key.values);
                    break;
                case Animation.ANIMATIONTYPE_COLOR3:
                    data = Color3.FromArray(key.values);
                    break;
                case Animation.ANIMATIONTYPE_VECTOR3:
                default:
                    data = Vector3.FromArray(key.values);
                    break;
            }
            var keyData = {};
            keyData.frame = key.frame;
            keyData.value = data;
            if (inTangent != undefined) {
                keyData.inTangent = inTangent;
            }
            if (outTangent != undefined) {
                keyData.outTangent = outTangent;
            }
            keys.push(keyData);
        }
        animation.setKeys(keys);
        if (parsedAnimation.ranges) {
            for (index = 0; index < parsedAnimation.ranges.length; index++) {
                data = parsedAnimation.ranges[index];
                animation.createRange(data.name, data.from, data.to);
            }
        }
        return animation;
    };
    /**
     * Appends the serialized animations from the source animations
     * @param source Source containing the animations
     * @param destination Target to store the animations
     */
    Animation.AppendSerializedAnimations = function (source, destination) {
        SerializationHelper.AppendSerializedAnimations(source, destination);
    };
    /**
     * Use matrix interpolation instead of using direct key value when animating matrices
     */
    Animation.AllowMatricesInterpolation = false;
    /**
     * When matrix interpolation is enabled, this boolean forces the system to use Matrix.DecomposeLerp instead of Matrix.Lerp. Interpolation is more precise but slower
     */
    Animation.AllowMatrixDecomposeForInterpolation = true;
    // Statics
    /**
     * Float animation type
     */
    Animation._ANIMATIONTYPE_FLOAT = 0;
    /**
     * Vector3 animation type
     */
    Animation._ANIMATIONTYPE_VECTOR3 = 1;
    /**
     * Quaternion animation type
     */
    Animation._ANIMATIONTYPE_QUATERNION = 2;
    /**
     * Matrix animation type
     */
    Animation._ANIMATIONTYPE_MATRIX = 3;
    /**
     * Color3 animation type
     */
    Animation._ANIMATIONTYPE_COLOR3 = 4;
    /**
     * Vector2 animation type
     */
    Animation._ANIMATIONTYPE_VECTOR2 = 5;
    /**
     * Size animation type
     */
    Animation._ANIMATIONTYPE_SIZE = 6;
    /**
     * Relative Loop Mode
     */
    Animation._ANIMATIONLOOPMODE_RELATIVE = 0;
    /**
     * Cycle Loop Mode
     */
    Animation._ANIMATIONLOOPMODE_CYCLE = 1;
    /**
     * Constant Loop Mode
     */
    Animation._ANIMATIONLOOPMODE_CONSTANT = 2;
    return Animation;
}());

_TypeStore.RegisteredTypes["BABYLON.Animation"] = Animation;
Node._AnimationRangeFactory = function (name, from, to) { return new AnimationRange(name, from, to); };
//# sourceMappingURL=animation.js.map
;// CONCATENATED MODULE: ./index.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* global parcel,self,postMessage */



var throttle = __webpack_require__(96);

var uuid = __webpack_require__(171);

var EventEmitter = __webpack_require__(187);

var Feature = __webpack_require__(170);

var _require = __webpack_require__(952),
    VoxelField = _require.VoxelField;

var Player = __webpack_require__(465);

function getGlobal() {
  if (typeof __webpack_require__.g !== "undefined") {
    return __webpack_require__.g;
  } else if (typeof self !== "undefined") {
    return self;
  } else {
    return null;
  }
} // the grid is usually `global` and the iframe when the script is not hosted is usually `self`;
// Even though `window` will always be null, getGlobal() doesn't return it just in case, because we don't want
// to override the setInterval of the window (could affect render).


var G = getGlobal();

if (G) {
  G.setInterval = function (setInterval) {
    return function (func, time) {
      var t = time;

      if (isNaN(parseInt(time, 10))) {
        console.error("setInterval interval is invalid");
        return;
      }

      if (parseInt(time, 10) < 30) {
        t = 30;
        console.log("setInterval minimum is 30ms");
      }

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      return setInterval.call.apply(setInterval, [G, func, t].concat(args));
    };
  }(G.setInterval);
}

var Parcel = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Parcel, _EventEmitter);

  var _super = _createSuper(Parcel);

  function Parcel(id) {
    var _this;

    _classCallCheck(this, Parcel);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "fetchSnapshots", throttle(function () {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      _this._fetchSnapshots(callback);
    }, 500, {
      leading: false,
      trailing: true
    }));

    _defineProperty(_assertThisInitialized(_this), "setSnapshot", throttle(function (index) {
      _this._setSnapshot(index);
    }, 500, {
      leading: false,
      trailing: true
    }));

    _this.id = id;
    _this.players = [];
    _this.featuresList = [];
    return _this;
  }

  _createClass(Parcel, [{
    key: "listen",
    value: function listen(port) {}
  }, {
    key: "onMessage",
    value: function onMessage(ws, msg) {
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
        var f = this.getFeatureByUuid(msg.uuid);
        var player;

        if (!f) {
          player = this.getPlayerByUuid(msg.uuid);
        }

        if (!f && !player) {
          console.log("cant find feature or player " + msg.uuid);
          return;
        }

        var e = Object.assign({}, msg.event, {
          player: ws.player
        }, !!player && {
          targetPlayer: player
        });

        if (e.point) {
          e.point = Vector3.FromArray(e.point);
          e.normal = Vector3.FromArray(e.normal);
        }

        !!f && f.emit("click", e);
        !!player && player.emit("click", e);
      } else if (msg.type === "trigger") {
        var _f = this.getFeatureByUuid(msg.uuid);

        if (!_f) {
          console.log("cant find feature " + msg.uuid);
          return;
        }

        var _e = Object.assign({}, msg.event, {
          player: ws.player
        });

        _f.emit("trigger", _e);
      } else if (msg.type === "keys") {
        var _f2 = this.getFeatureByUuid(msg.uuid);

        if (!_f2) return;

        _f2.emit("keys", msg.event);
      } else if (msg.type === "start") {
        var _f3 = this.getFeatureByUuid(msg.uuid);

        if (!_f3) return;

        _f3.emit("start");
      } else if (msg.type === "stop") {
        var _f4 = this.getFeatureByUuid(msg.uuid);

        if (!_f4) return;

        _f4.emit("stop");
      } else if (msg.type === "changed") {
        var _f5 = this.getFeatureByUuid(msg.uuid);

        if (!_f5) return;

        _f5.emit("changed", msg.event);
      }
    }
  }, {
    key: "join",
    value: function join(player) {
      if (!player.wallet) {
        return;
      }

      var p = this.players.find(function (p) {
        return p.wallet === player.wallet && p.uuid === player.uuid;
      });

      if (p) {
        return;
      }

      this.emit("playerenter", {
        player: player instanceof Player ? player : new Player(player, this)
      });

      if (!player instanceof Player) {
        return;
      }

      this.players.push(player);
    }
  }, {
    key: "leave",
    value: function leave(player) {
      var p = this.getPlayerByWallet(player.wallet);
      var i = this.players.indexOf(p);
      this.players.splice(i, 1);
      this.emit("playerleave", {
        player: player instanceof Player ? player : new Player(player, this)
      });
    }
  }, {
    key: "broadcast",
    value: function broadcast(message) {
      var packet = JSON.stringify(message); // console.log('broadcast', packet)

      postMessage(packet);
    }
  }, {
    key: "fetch",
    value: function fetch() {}
  }, {
    key: "debug",
    value: function debug() {
      if (typeof document === "undefined") {
        return;
      }

      if (!this.featuresList) {
        return;
      } // console.log('debug')


      var ul = document.querySelector("#debug");
      ul.innerHTML = this.featuresList.map(function (f) {
        return "\n        <li>\n          ".concat(f.type).concat(f.id ? "#" + f.id : "", "<br />\n          <small>").concat(f.uuid, "</small>\n        </li>\n       ");
      }).join("");
    }
  }, {
    key: "parse",
    value: function parse(parcel) {
      var _this2 = this;

      Object.assign(this, parcel); // Create features array

      this.featuresList = Array.from(parcel.features).map(function (f) {
        return !!f && Feature.create(_this2, f);
      });
      this.voxels = new VoxelField(this);
    }
  }, {
    key: "getPlayerByUuid",
    value: function getPlayerByUuid(uuid) {
      return this.players.find(function (p) {
        return p.uuid === uuid;
      });
    }
  }, {
    key: "getPlayerByWallet",
    value: function getPlayerByWallet(wallet) {
      return this.players.find(function (p) {
        return p.wallet === wallet;
      });
    }
  }, {
    key: "getFeatureByUuid",
    value: function getFeatureByUuid(uuid) {
      return this.featuresList.find(function (f) {
        return f.uuid === uuid;
      });
    }
  }, {
    key: "getFeatureById",
    value: function getFeatureById(id) {
      return this.featuresList.find(function (f) {
        return f.id === id;
      });
    }
  }, {
    key: "getFeatures",
    value: function getFeatures() {
      return this.featuresList;
    }
  }, {
    key: "getFeaturesByType",
    value: function getFeaturesByType(type) {
      return this.featuresList.filter(function (f) {
        return f.type === type;
      });
    }
  }, {
    key: "getPlayers",
    value: function getPlayers() {
      return this.players;
    }
    /* Thottled functions */

  }, {
    key: "_fetchSnapshots",
    value: function _fetchSnapshots() {
      var _this3 = this;

      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var api_url = "https://www.cryptovoxels.com/api/parcels/".concat(this.id, "/snapshots.json");
      var promise;

      if (typeof __webpack_require__.g == "undefined" || !__webpack_require__.g.fetchJson) {
        /* fetch doesn't work nicely on the grid. So we use 'fetchJson' when on scripthost, and fetch() when local */
        promise = fetch(api_url).then(function (r) {
          return r.json();
        });
      } else {
        promise = fetchJson(api_url);
      }

      promise.then(function (r) {
        if (!r.success) {
          _this3.snapshots = [];
        } else {
          _this3.snapshots = r.snapshots;
        }

        if (callback) {
          callback(r.snapshots);
        }
      });
    }
  }, {
    key: "_setSnapshot",
    value: function _setSnapshot(snapshot_id) {
      if (!this.snapshots) {
        console.error("Call parcel.fetchSnapshots first");
        return;
      }

      if (this.snapshots.length == 0) {
        console.error("No snapshots for this parcel");
        return;
      }

      var snapshot = this.snapshots.find(function (s) {
        return s.id == snapshot_id;
      });

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
      var p = Object.assign({}, this, snapshot);
      delete p.players;
      delete p.featuresList;
      p.features = p.content.features;
      p.voxels = p.content.voxels;
      p.palette = p.content.palette;
      p.tileset = p.content.tileset;
      this.broadcast({
        type: "snapshot",
        parcel: p
      });
    }
  }, {
    key: "createFeature",
    value: function createFeature(type, description) {
      var feature = Feature.create(this, Object.assign({
        position: Vector3.Zero(),
        rotation: Vector3.Zero(),
        scale: new Vector3(1, 1, 1),
        type: type,
        uuid: uuid()
      }, description || {}));
      this.featuresList.push(feature);
      this.broadcast({
        type: "create",
        uuid: feature.uuid,
        content: feature._content
      });
      return feature;
    }
  }, {
    key: "removeFeature",
    value: function removeFeature(f) {
      this.broadcast({
        type: "remove",
        uuid: f.uuid
      });
      var i = this.featuresList.indexOf(f);

      if (i > -1) {
        this.featuresList.splice(i);
      }
    }
  }, {
    key: "start",
    value: function start() {
      var _this4 = this;

      // fake websocket
      var ws = {
        readyState: 1
      };

      self.onmessage = function (e) {
        if (!e.data.player) {
          return;
        }

        var oldPlayer = _this4.players.find(function (p) {
          return p.wallet == e.data.player.wallet;
        });

        if (oldPlayer) {
          // we have an old player (perfect)
          ws.player = oldPlayer instanceof Player ? oldPlayer : new Player(oldPlayer, _this4);
        } // We don't have a new player:


        if (e.data.type !== "join") {
          parcel.onMessage(ws, e.data);
          return;
        } // A previous player is re-joining and socket Id is already registered


        if (oldPlayer && e.data.player.wallet === oldPlayer.wallet) {
          ws.player = new Player(e.data.player, _this4);

          var i = _this4.players.indexOf(oldPlayer);

          if (i !== -1) {
            _this4.players[i] = ws.player;
          }
        } else {
          // We do not have that player
          ws.player = new Player(e.data.player, _this4);

          _this4.join(ws.player);
        }
      };
    }
  }]);

  return Parcel;
}(EventEmitter);

var index_Space = /*#__PURE__*/function (_Parcel) {
  _inherits(Space, _Parcel);

  var _super2 = _createSuper(Space);

  function Space(id) {
    _classCallCheck(this, Space);

    return _super2.call(this, id);
  }

  _createClass(Space, [{
    key: "_fetchSnapshots",
    value: function _fetchSnapshots() {}
  }, {
    key: "_setSnapshot",
    value: function _setSnapshot() {}
  }]);

  return Space;
}(Parcel);

/* harmony default export */ const index = ({
  Parcel: Parcel,
  Space: index_Space,
  Feature: Feature,
  Animation: Animation,
  VoxelField: VoxelField,
  Vector3: Vector3,
  Quaternion: Quaternion,
  Vector2: Vector2,
  Color3: Color3,
  Matrix: Matrix
});

if (typeof self !== "undefined") {
  Object.assign(self, {
    Parcel: Parcel,
    Space: index_Space,
    Feature: Feature,
    Animation: Animation,
    VoxelField: VoxelField,
    Vector3: Vector3,
    Quaternion: Quaternion,
    Vector2: Vector2,
    Color3: Color3,
    Matrix: Matrix
  }); // eslint-disable-line
}
})();

/******/ })()
;