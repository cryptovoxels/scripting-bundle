(function() {
    function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f;
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, (function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }), l, l.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s;
    }
    return e;
})()({
    1: [ function(require, module, exports) {
        "use strict";
        var _math = require("./vendor/babylonjs/Maths/math");
        var _animation = require("./vendor/babylonjs/Animations/animation");
        const throttle = require("lodash.throttle");
        const EventEmitter = require("events");
        class Feature extends EventEmitter {
            constructor(parcel, obj) {
                super();
                this.parcel = parcel;
                this.uuid = obj.uuid;
                this._content = obj;
                const mutated = throttle(() => {
                    const s = Object.assign({}, this._content);
                    this._position.toArray(s.position);
                    this._rotation.toArray(s.rotation);
                    this._scale.toArray(s.scale);
                    this.set(s);
                }, 10, {
                    leading: false,
                    trailing: true
                });
                const handler = attr => ({
                    set(target, key, value) {
                        target[key] = value;
                        mutated();
                        return value;
                    }
                });
                this._position = new _math.Vector3;
                this.position = new Proxy(this._position, handler("position"));
                this._rotation = new _math.Vector3;
                this.rotation = new Proxy(this._rotation, handler("rotation"));
                this._scale = new _math.Vector3;
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
                this.updateVectors();
                this.save();
            }
            updateVectors() {
                this._position.set(this._content.position[0], this._content.position[1], this._content.position[2]);
                this._rotation.set(this._content.rotation[0], this._content.rotation[1], this._content.rotation[2]);
                this._scale.set(this._content.scale[0], this._content.scale[1], this._content.scale[2]);
            }
            clone() {
                let d = JSON.parse(JSON.stringify(this.description));
                delete d.id;
                delete d.uuid;
                let c = this.parcel.createFeature(this.type);
                c.set(d);
                return c;
            }
            save() {
                this.parcel.broadcast({
                    type: "update",
                    uuid: this.uuid,
                    content: this._content
                });
            }
            createAnimation(key) {
                return new _animation.Animation(null, key, 30, _animation.Animation.ANIMATIONTYPE_VECTOR3);
            }
            startAnimations(animationArray) {
                const animations = animationArray.map(a => {
                    const animation = a.clone();
                    animation._keys.unshift({
                        frame: 0,
                        value: this[animation.targetProperty].clone()
                    });
                    return animation.serialize();
                });
                this.parcel.broadcast({
                    type: "animate",
                    uuid: this.uuid,
                    animations: animations
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
                    uuid: this.uuid
                });
            }
            pause() {
                this.parcel.broadcast({
                    type: "pause",
                    uuid: this.uuid
                });
            }
            stop() {
                this.parcel.broadcast({
                    type: "stop",
                    uuid: this.uuid
                });
            }
        }
        class TextInput extends Feature {
            constructor(parcel, obj) {
                super(parcel, obj);
                this.on("changed", e => {
                    this.text = e.text;
                });
            }
        }
        class Video extends Feature {
            play() {
                this.parcel.broadcast({
                    type: "play",
                    uuid: this.uuid
                });
            }
            pause() {
                this.parcel.broadcast({
                    type: "pause",
                    uuid: this.uuid
                });
            }
            stop() {
                this.parcel.broadcast({
                    type: "stop",
                    uuid: this.uuid
                });
            }
        }
        class Youtube extends Feature {
            play() {
                this.parcel.broadcast({
                    type: "play",
                    uuid: this.uuid
                });
            }
            pause() {
                this.parcel.broadcast({
                    type: "pause",
                    uuid: this.uuid
                });
            }
            stop() {
                this.parcel.broadcast({
                    type: "stop",
                    uuid: this.uuid
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
                        screen: this.screen
                    });
                }, 1e3 / 30);
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
    }, {
        "./vendor/babylonjs/Animations/animation": 9,
        "./vendor/babylonjs/Maths/math": 13,
        events: 25,
        "lodash.throttle": 3
    } ],
    2: [ function(require, module, exports) {
        "use strict";
        var _math = require("./vendor/babylonjs/Maths/math");
        var _animation = require("./vendor/babylonjs/Animations/animation");
        const uuid = require("uuid/v4");
        const EventEmitter = require("events");
        const Feature = require("./feature");
        const {VoxelField: VoxelField} = require("./voxel-field");
        const Player = require("./player");
        class Parcel extends EventEmitter {
            constructor(id) {
                super();
                this.id = id;
                this.players = [];
                this.featureList = [];
            }
            listen(port) {}
            onMessage(ws, msg) {
                if (msg.type === "playerenter") {
                    ws.player = new Player(msg.player);
                    this.join(ws.player);
                    return;
                }
                if (!ws.player) {
                    return;
                }
                if (msg.type === "playerleave") {
                    this.leave(ws.player);
                } else if (msg.type === "move") {
                    ws.player.onMove(msg);
                } else if (msg.type === "click") {
                    const f = this.getFeatureByUuid(msg.uuid);
                    if (!f) {
                        console.log("cant find feature " + msg.uuid);
                        return;
                    }
                    let e = Object.assign({}, msg.event, {
                        player: ws.player
                    });
                    if (e.point) {
                        e.point = _math.Vector3.FromArray(e.point);
                        e.normal = _math.Vector3.FromArray(e.normal);
                    }
                    f.emit("click", e);
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
                this.players.push(player);
                this.emit("playerenter", player);
            }
            leave(player) {
                const i = this.players.indexOf(player);
                if (i >= 0) {
                    this.players.splice(i);
                }
                this.emit("playerleave", player);
            }
            broadcast(message) {
                const packet = JSON.stringify(message);
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
                ul.innerHTML = this.featuresList.map(f => `\n        <li>\n          ${f.type}${f.id ? "#" + f.id : ""}<br />\n          <small>${f.uuid}</small>\n        </li>\n       `).join("");
            }
            parse(parcel) {
                Object.assign(this, parcel);
                this.featuresList = Array.from(parcel.features).map(f => Feature.create(this, f));
                this.voxels = new VoxelField(this);
            }
            getFeatureByUuid(uuid) {
                return this.featuresList.find(f => f.uuid === uuid);
            }
            getFeatureById(id) {
                return this.featuresList.find(f => f.id === id);
            }
            getFeatures() {
                return this.featuresList;
            }
            getFeaturesByType(type) {
                return this.featuresList.filter(f => f.type === type);
            }
            getPlayers() {
                return this.players;
            }
            createFeature(type, description) {
                const feature = Feature.create(this, Object.assign({
                    position: _math.Vector3.Zero(),
                    rotation: _math.Vector3.Zero(),
                    scale: new _math.Vector3(1, 1, 1),
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
            removeFeature(f) {
                this.broadcast({
                    type: "remove",
                    uuid: f.uuid
                });
                const i = this.featuresList.indexOf(f);
                if (i > -1) {
                    this.featuresList.splice(i);
                }
            }
            start() {
                let ws = {
                    readyState: 1
                };
                self.onmessage = e => {
                    if (e.data.type == "join") {
                        if (e.data.player) {
                            ws.player = e.data.player;
                        }
                        parcel.onMessage(ws, e.data);
                    } else {
                        parcel.onMessage(ws, e.data);
                    }
                };
            }
        }
        module.exports = {
            Parcel: Parcel,
            Feature: Feature,
            Animation: _animation.Animation,
            VoxelField: VoxelField,
            Vector3: _math.Vector3,
            Quaternion: _math.Quaternion,
            Vector2: _math.Vector2,
            Color3: _math.Color3,
            Matrix: _math.Matrix
        };
        if (typeof self !== "undefined") {
            Object.assign(self, module.exports);
        }
    }, {
        "./feature": 1,
        "./player": 8,
        "./vendor/babylonjs/Animations/animation": 9,
        "./vendor/babylonjs/Maths/math": 13,
        "./voxel-field": 24,
        events: 25,
        "uuid/v4": 7
    } ],
    3: [ function(require, module, exports) {
        (function(global) {
            var FUNC_ERROR_TEXT = "Expected a function";
            var NAN = 0 / 0;
            var symbolTag = "[object Symbol]";
            var reTrim = /^\s+|\s+$/g;
            var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
            var reIsBinary = /^0b[01]+$/i;
            var reIsOctal = /^0o[0-7]+$/i;
            var freeParseInt = parseInt;
            var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
            var freeSelf = typeof self == "object" && self && self.Object === Object && self;
            var root = freeGlobal || freeSelf || Function("return this")();
            var objectProto = Object.prototype;
            var objectToString = objectProto.toString;
            var nativeMax = Math.max, nativeMin = Math.min;
            var now = function() {
                return root.Date.now();
            };
            function debounce(func, wait, options) {
                var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
                if (typeof func != "function") {
                    throw new TypeError(FUNC_ERROR_TEXT);
                }
                wait = toNumber(wait) || 0;
                if (isObject(options)) {
                    leading = !!options.leading;
                    maxing = "maxWait" in options;
                    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
                    trailing = "trailing" in options ? !!options.trailing : trailing;
                }
                function invokeFunc(time) {
                    var args = lastArgs, thisArg = lastThis;
                    lastArgs = lastThis = undefined;
                    lastInvokeTime = time;
                    result = func.apply(thisArg, args);
                    return result;
                }
                function leadingEdge(time) {
                    lastInvokeTime = time;
                    timerId = setTimeout(timerExpired, wait);
                    return leading ? invokeFunc(time) : result;
                }
                function remainingWait(time) {
                    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result = wait - timeSinceLastCall;
                    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
                }
                function shouldInvoke(time) {
                    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
                    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
                }
                function timerExpired() {
                    var time = now();
                    if (shouldInvoke(time)) {
                        return trailingEdge(time);
                    }
                    timerId = setTimeout(timerExpired, remainingWait(time));
                }
                function trailingEdge(time) {
                    timerId = undefined;
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
                    var time = now(), isInvoking = shouldInvoke(time);
                    lastArgs = arguments;
                    lastThis = this;
                    lastCallTime = time;
                    if (isInvoking) {
                        if (timerId === undefined) {
                            return leadingEdge(lastCallTime);
                        }
                        if (maxing) {
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
            function throttle(func, wait, options) {
                var leading = true, trailing = true;
                if (typeof func != "function") {
                    throw new TypeError(FUNC_ERROR_TEXT);
                }
                if (isObject(options)) {
                    leading = "leading" in options ? !!options.leading : leading;
                    trailing = "trailing" in options ? !!options.trailing : trailing;
                }
                return debounce(func, wait, {
                    leading: leading,
                    maxWait: wait,
                    trailing: trailing
                });
            }
            function isObject(value) {
                var type = typeof value;
                return !!value && (type == "object" || type == "function");
            }
            function isObjectLike(value) {
                return !!value && typeof value == "object";
            }
            function isSymbol(value) {
                return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
            }
            function toNumber(value) {
                if (typeof value == "number") {
                    return value;
                }
                if (isSymbol(value)) {
                    return NAN;
                }
                if (isObject(value)) {
                    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
                    value = isObject(other) ? other + "" : other;
                }
                if (typeof value != "string") {
                    return value === 0 ? value : +value;
                }
                value = value.replace(reTrim, "");
                var isBinary = reIsBinary.test(value);
                return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
            }
            module.exports = throttle;
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {} ],
    4: [ function(require, module, exports) {
        (function(global) {
            var __extends;
            var __assign;
            var __rest;
            var __decorate;
            var __param;
            var __metadata;
            var __awaiter;
            var __generator;
            var __exportStar;
            var __values;
            var __read;
            var __spread;
            var __spreadArrays;
            var __await;
            var __asyncGenerator;
            var __asyncDelegator;
            var __asyncValues;
            var __makeTemplateObject;
            var __importStar;
            var __importDefault;
            (function(factory) {
                var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
                if (typeof define === "function" && define.amd) {
                    define("tslib", [ "exports" ], (function(exports) {
                        factory(createExporter(root, createExporter(exports)));
                    }));
                } else if (typeof module === "object" && typeof module.exports === "object") {
                    factory(createExporter(root, createExporter(module.exports)));
                } else {
                    factory(createExporter(root));
                }
                function createExporter(exports, previous) {
                    if (exports !== root) {
                        if (typeof Object.create === "function") {
                            Object.defineProperty(exports, "__esModule", {
                                value: true
                            });
                        } else {
                            exports.__esModule = true;
                        }
                    }
                    return function(id, v) {
                        return exports[id] = previous ? previous(id, v) : v;
                    };
                }
            })((function(exporter) {
                var extendStatics = Object.setPrototypeOf || {
                    __proto__: []
                } instanceof Array && function(d, b) {
                    d.__proto__ = b;
                } || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                };
                __extends = function(d, b) {
                    extendStatics(d, b);
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __);
                };
                __assign = Object.assign || function(t) {
                    for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                    }
                    return t;
                };
                __rest = function(s, e) {
                    var t = {};
                    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
                    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
                    }
                    return t;
                };
                __decorate = function(decorators, target, key, desc) {
                    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
                    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
                    return c > 3 && r && Object.defineProperty(target, key, r), r;
                };
                __param = function(paramIndex, decorator) {
                    return function(target, key) {
                        decorator(target, key, paramIndex);
                    };
                };
                __metadata = function(metadataKey, metadataValue) {
                    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
                };
                __awaiter = function(thisArg, _arguments, P, generator) {
                    return new (P || (P = Promise))((function(resolve, reject) {
                        function fulfilled(value) {
                            try {
                                step(generator.next(value));
                            } catch (e) {
                                reject(e);
                            }
                        }
                        function rejected(value) {
                            try {
                                step(generator["throw"](value));
                            } catch (e) {
                                reject(e);
                            }
                        }
                        function step(result) {
                            result.done ? resolve(result.value) : new P((function(resolve) {
                                resolve(result.value);
                            })).then(fulfilled, rejected);
                        }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                    }));
                };
                __generator = function(thisArg, body) {
                    var _ = {
                        label: 0,
                        sent: function() {
                            if (t[0] & 1) throw t[1];
                            return t[1];
                        },
                        trys: [],
                        ops: []
                    }, f, y, t, g;
                    return g = {
                        next: verb(0),
                        throw: verb(1),
                        return: verb(2)
                    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
                        return this;
                    }), g;
                    function verb(n) {
                        return function(v) {
                            return step([ n, v ]);
                        };
                    }
                    function step(op) {
                        if (f) throw new TypeError("Generator is already executing.");
                        while (_) try {
                            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
                            0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                            if (y = 0, t) op = [ op[0] & 2, t.value ];
                            switch (op[0]) {
                              case 0:
                              case 1:
                                t = op;
                                break;

                              case 4:
                                _.label++;
                                return {
                                    value: op[1],
                                    done: false
                                };

                              case 5:
                                _.label++;
                                y = op[1];
                                op = [ 0 ];
                                continue;

                              case 7:
                                op = _.ops.pop();
                                _.trys.pop();
                                continue;

                              default:
                                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                    _ = 0;
                                    continue;
                                }
                                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                                    _.label = op[1];
                                    break;
                                }
                                if (op[0] === 6 && _.label < t[1]) {
                                    _.label = t[1];
                                    t = op;
                                    break;
                                }
                                if (t && _.label < t[2]) {
                                    _.label = t[2];
                                    _.ops.push(op);
                                    break;
                                }
                                if (t[2]) _.ops.pop();
                                _.trys.pop();
                                continue;
                            }
                            op = body.call(thisArg, _);
                        } catch (e) {
                            op = [ 6, e ];
                            y = 0;
                        } finally {
                            f = t = 0;
                        }
                        if (op[0] & 5) throw op[1];
                        return {
                            value: op[0] ? op[1] : void 0,
                            done: true
                        };
                    }
                };
                __exportStar = function(m, exports) {
                    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
                };
                __values = function(o) {
                    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
                    if (m) return m.call(o);
                    return {
                        next: function() {
                            if (o && i >= o.length) o = void 0;
                            return {
                                value: o && o[i++],
                                done: !o
                            };
                        }
                    };
                };
                __read = function(o, n) {
                    var m = typeof Symbol === "function" && o[Symbol.iterator];
                    if (!m) return o;
                    var i = m.call(o), r, ar = [], e;
                    try {
                        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
                    } catch (error) {
                        e = {
                            error: error
                        };
                    } finally {
                        try {
                            if (r && !r.done && (m = i["return"])) m.call(i);
                        } finally {
                            if (e) throw e.error;
                        }
                    }
                    return ar;
                };
                __spread = function() {
                    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
                    return ar;
                };
                __spreadArrays = function() {
                    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
                    for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, 
                    k++) r[k] = a[j];
                    return r;
                };
                __await = function(v) {
                    return this instanceof __await ? (this.v = v, this) : new __await(v);
                };
                __asyncGenerator = function(thisArg, _arguments, generator) {
                    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                    var g = generator.apply(thisArg, _arguments || []), i, q = [];
                    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
                        return this;
                    }, i;
                    function verb(n) {
                        if (g[n]) i[n] = function(v) {
                            return new Promise((function(a, b) {
                                q.push([ n, v, a, b ]) > 1 || resume(n, v);
                            }));
                        };
                    }
                    function resume(n, v) {
                        try {
                            step(g[n](v));
                        } catch (e) {
                            settle(q[0][3], e);
                        }
                    }
                    function step(r) {
                        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
                    }
                    function fulfill(value) {
                        resume("next", value);
                    }
                    function reject(value) {
                        resume("throw", value);
                    }
                    function settle(f, v) {
                        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
                    }
                };
                __asyncDelegator = function(o) {
                    var i, p;
                    return i = {}, verb("next"), verb("throw", (function(e) {
                        throw e;
                    })), verb("return"), i[Symbol.iterator] = function() {
                        return this;
                    }, i;
                    function verb(n, f) {
                        i[n] = o[n] ? function(v) {
                            return (p = !p) ? {
                                value: __await(o[n](v)),
                                done: n === "return"
                            } : f ? f(v) : v;
                        } : f;
                    }
                };
                __asyncValues = function(o) {
                    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                    var m = o[Symbol.asyncIterator], i;
                    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), 
                    i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
                        return this;
                    }, i);
                    function verb(n) {
                        i[n] = o[n] && function(v) {
                            return new Promise((function(resolve, reject) {
                                v = o[n](v), settle(resolve, reject, v.done, v.value);
                            }));
                        };
                    }
                    function settle(resolve, reject, d, v) {
                        Promise.resolve(v).then((function(v) {
                            resolve({
                                value: v,
                                done: d
                            });
                        }), reject);
                    }
                };
                __makeTemplateObject = function(cooked, raw) {
                    if (Object.defineProperty) {
                        Object.defineProperty(cooked, "raw", {
                            value: raw
                        });
                    } else {
                        cooked.raw = raw;
                    }
                    return cooked;
                };
                __importStar = function(mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
                    result["default"] = mod;
                    return result;
                };
                __importDefault = function(mod) {
                    return mod && mod.__esModule ? mod : {
                        default: mod
                    };
                };
                exporter("__extends", __extends);
                exporter("__assign", __assign);
                exporter("__rest", __rest);
                exporter("__decorate", __decorate);
                exporter("__param", __param);
                exporter("__metadata", __metadata);
                exporter("__awaiter", __awaiter);
                exporter("__generator", __generator);
                exporter("__exportStar", __exportStar);
                exporter("__values", __values);
                exporter("__read", __read);
                exporter("__spread", __spread);
                exporter("__spreadArrays", __spreadArrays);
                exporter("__await", __await);
                exporter("__asyncGenerator", __asyncGenerator);
                exporter("__asyncDelegator", __asyncDelegator);
                exporter("__asyncValues", __asyncValues);
                exporter("__makeTemplateObject", __makeTemplateObject);
                exporter("__importStar", __importStar);
                exporter("__importDefault", __importDefault);
            }));
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {} ],
    5: [ function(require, module, exports) {
        var byteToHex = [];
        for (var i = 0; i < 256; ++i) {
            byteToHex[i] = (i + 256).toString(16).substr(1);
        }
        function bytesToUuid(buf, offset) {
            var i = offset || 0;
            var bth = byteToHex;
            return [ bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], "-", bth[buf[i++]], bth[buf[i++]], "-", bth[buf[i++]], bth[buf[i++]], "-", bth[buf[i++]], bth[buf[i++]], "-", bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]] ].join("");
        }
        module.exports = bytesToUuid;
    }, {} ],
    6: [ function(require, module, exports) {
        var getRandomValues = typeof crypto != "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != "undefined" && typeof window.msCrypto.getRandomValues == "function" && msCrypto.getRandomValues.bind(msCrypto);
        if (getRandomValues) {
            var rnds8 = new Uint8Array(16);
            module.exports = function whatwgRNG() {
                getRandomValues(rnds8);
                return rnds8;
            };
        } else {
            var rnds = new Array(16);
            module.exports = function mathRNG() {
                for (var i = 0, r; i < 16; i++) {
                    if ((i & 3) === 0) r = Math.random() * 4294967296;
                    rnds[i] = r >>> ((i & 3) << 3) & 255;
                }
                return rnds;
            };
        }
    }, {} ],
    7: [ function(require, module, exports) {
        var rng = require("./lib/rng");
        var bytesToUuid = require("./lib/bytesToUuid");
        function v4(options, buf, offset) {
            var i = buf && offset || 0;
            if (typeof options == "string") {
                buf = options === "binary" ? new Array(16) : null;
                options = null;
            }
            options = options || {};
            var rnds = options.random || (options.rng || rng)();
            rnds[6] = rnds[6] & 15 | 64;
            rnds[8] = rnds[8] & 63 | 128;
            if (buf) {
                for (var ii = 0; ii < 16; ++ii) {
                    buf[i + ii] = rnds[ii];
                }
            }
            return buf || bytesToUuid(rnds);
        }
        module.exports = v4;
    }, {
        "./lib/bytesToUuid": 5,
        "./lib/rng": 6
    } ],
    8: [ function(require, module, exports) {
        "use strict";
        var _math = require("./vendor/babylonjs/Maths/math");
        const EventEmitter = require("events");
        class Player extends EventEmitter {
            constructor(description) {
                super();
                Object.assign(this, description);
                this.name = description && description.name;
                this.wallet = description && description.wallet;
                this.position = new _math.Vector3;
                this.rotation = new _math.Vector3;
            }
            onMove(msg) {
                this.position.set(msg.position[0], msg.position[1], msg.position[2]);
                this.rotation.set(msg.rotation[0], msg.rotation[1], msg.rotation[2]);
                this.emit("move", msg);
            }
        }
        module.exports = Player;
    }, {
        "./vendor/babylonjs/Maths/math": 13,
        events: 25
    } ],
    9: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.Animation = exports._IAnimationState = void 0;
        var _math = require("../Maths/math");
        var _math2 = require("../Maths/math.scalar");
        var _decorators = require("../Misc/decorators");
        var _typeStore = require("../Misc/typeStore");
        var _animationKey = require("./animationKey");
        var _animationRange = require("./animationRange");
        var _node = require("../node");
        var _IAnimationState = function() {
            function _IAnimationState() {}
            return _IAnimationState;
        }();
        exports._IAnimationState = _IAnimationState;
        var Animation = function() {
            function Animation(name, targetProperty, framePerSecond, dataType, loopMode, enableBlending) {
                this.name = name;
                this.targetProperty = targetProperty;
                this.framePerSecond = framePerSecond;
                this.dataType = dataType;
                this.loopMode = loopMode;
                this.enableBlending = enableBlending;
                this._runtimeAnimations = new Array;
                this._events = new Array;
                this.blendingSpeed = .01;
                this._ranges = {};
                this.targetPropertyPath = targetProperty.split(".");
                this.dataType = dataType;
                this.loopMode = loopMode === undefined ? Animation.ANIMATIONLOOPMODE_CYCLE : loopMode;
            }
            Animation._PrepareAnimation = function(name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction) {
                var dataType = undefined;
                if (!isNaN(parseFloat(from)) && isFinite(from)) {
                    dataType = Animation.ANIMATIONTYPE_FLOAT;
                } else if (from instanceof _math.Quaternion) {
                    dataType = Animation.ANIMATIONTYPE_QUATERNION;
                } else if (from instanceof _math.Vector3) {
                    dataType = Animation.ANIMATIONTYPE_VECTOR3;
                } else if (from instanceof _math.Vector2) {
                    dataType = Animation.ANIMATIONTYPE_VECTOR2;
                } else if (from instanceof _math.Color3) {
                    dataType = Animation.ANIMATIONTYPE_COLOR3;
                } else if (from instanceof _math.Size) {
                    dataType = Animation.ANIMATIONTYPE_SIZE;
                }
                if (dataType == undefined) {
                    return null;
                }
                var animation = new Animation(name, targetProperty, framePerSecond, dataType, loopMode);
                var keys = [ {
                    frame: 0,
                    value: from
                }, {
                    frame: totalFrame,
                    value: to
                } ];
                animation.setKeys(keys);
                if (easingFunction !== undefined) {
                    animation.setEasingFunction(easingFunction);
                }
                return animation;
            };
            Animation.CreateAnimation = function(property, animationType, framePerSecond, easingFunction) {
                var animation = new Animation(property + "Animation", property, framePerSecond, animationType, Animation.ANIMATIONLOOPMODE_CONSTANT);
                animation.setEasingFunction(easingFunction);
                return animation;
            };
            Animation.CreateAndStartAnimation = function(name, node, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd) {
                var animation = Animation._PrepareAnimation(name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
                if (!animation) {
                    return null;
                }
                return node.getScene().beginDirectAnimation(node, [ animation ], 0, totalFrame, animation.loopMode === 1, 1, onAnimationEnd);
            };
            Animation.CreateAndStartHierarchyAnimation = function(name, node, directDescendantsOnly, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd) {
                var animation = Animation._PrepareAnimation(name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
                if (!animation) {
                    return null;
                }
                var scene = node.getScene();
                return scene.beginDirectHierarchyAnimation(node, directDescendantsOnly, [ animation ], 0, totalFrame, animation.loopMode === 1, 1, onAnimationEnd);
            };
            Animation.CreateMergeAndStartAnimation = function(name, node, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd) {
                var animation = Animation._PrepareAnimation(name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
                if (!animation) {
                    return null;
                }
                node.animations.push(animation);
                return node.getScene().beginAnimation(node, 0, totalFrame, animation.loopMode === 1, 1, onAnimationEnd);
            };
            Animation.TransitionTo = function(property, targetValue, host, scene, frameRate, transition, duration, onAnimationEnd) {
                if (onAnimationEnd === void 0) {
                    onAnimationEnd = null;
                }
                if (duration <= 0) {
                    host[property] = targetValue;
                    if (onAnimationEnd) {
                        onAnimationEnd();
                    }
                    return null;
                }
                var endFrame = frameRate * (duration / 1e3);
                transition.setKeys([ {
                    frame: 0,
                    value: host[property].clone ? host[property].clone() : host[property]
                }, {
                    frame: endFrame,
                    value: targetValue
                } ]);
                if (!host.animations) {
                    host.animations = [];
                }
                host.animations.push(transition);
                var animation = scene.beginAnimation(host, 0, endFrame, false);
                animation.onAnimationEnd = onAnimationEnd;
                return animation;
            };
            Object.defineProperty(Animation.prototype, "runtimeAnimations", {
                get: function() {
                    return this._runtimeAnimations;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "hasRunningRuntimeAnimations", {
                get: function() {
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
            Animation.prototype.toString = function(fullDetails) {
                var ret = "Name: " + this.name + ", property: " + this.targetProperty;
                ret += ", datatype: " + [ "Float", "Vector3", "Quaternion", "Matrix", "Color3", "Vector2" ][this.dataType];
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
            Animation.prototype.addEvent = function(event) {
                this._events.push(event);
            };
            Animation.prototype.removeEvents = function(frame) {
                for (var index = 0; index < this._events.length; index++) {
                    if (this._events[index].frame === frame) {
                        this._events.splice(index, 1);
                        index--;
                    }
                }
            };
            Animation.prototype.getEvents = function() {
                return this._events;
            };
            Animation.prototype.createRange = function(name, from, to) {
                if (!this._ranges[name]) {
                    this._ranges[name] = new _animationRange.AnimationRange(name, from, to);
                }
            };
            Animation.prototype.deleteRange = function(name, deleteFrames) {
                if (deleteFrames === void 0) {
                    deleteFrames = true;
                }
                var range = this._ranges[name];
                if (!range) {
                    return;
                }
                if (deleteFrames) {
                    var from = range.from;
                    var to = range.to;
                    for (var key = this._keys.length - 1; key >= 0; key--) {
                        if (this._keys[key].frame >= from && this._keys[key].frame <= to) {
                            this._keys.splice(key, 1);
                        }
                    }
                }
                this._ranges[name] = null;
            };
            Animation.prototype.getRange = function(name) {
                return this._ranges[name];
            };
            Animation.prototype.getKeys = function() {
                return this._keys;
            };
            Animation.prototype.getHighestFrame = function() {
                var ret = 0;
                for (var key = 0, nKeys = this._keys.length; key < nKeys; key++) {
                    if (ret < this._keys[key].frame) {
                        ret = this._keys[key].frame;
                    }
                }
                return ret;
            };
            Animation.prototype.getEasingFunction = function() {
                return this._easingFunction;
            };
            Animation.prototype.setEasingFunction = function(easingFunction) {
                this._easingFunction = easingFunction;
            };
            Animation.prototype.floatInterpolateFunction = function(startValue, endValue, gradient) {
                return _math2.Scalar.Lerp(startValue, endValue, gradient);
            };
            Animation.prototype.floatInterpolateFunctionWithTangents = function(startValue, outTangent, endValue, inTangent, gradient) {
                return _math2.Scalar.Hermite(startValue, outTangent, endValue, inTangent, gradient);
            };
            Animation.prototype.quaternionInterpolateFunction = function(startValue, endValue, gradient) {
                return _math.Quaternion.Slerp(startValue, endValue, gradient);
            };
            Animation.prototype.quaternionInterpolateFunctionWithTangents = function(startValue, outTangent, endValue, inTangent, gradient) {
                return _math.Quaternion.Hermite(startValue, outTangent, endValue, inTangent, gradient).normalize();
            };
            Animation.prototype.vector3InterpolateFunction = function(startValue, endValue, gradient) {
                return _math.Vector3.Lerp(startValue, endValue, gradient);
            };
            Animation.prototype.vector3InterpolateFunctionWithTangents = function(startValue, outTangent, endValue, inTangent, gradient) {
                return _math.Vector3.Hermite(startValue, outTangent, endValue, inTangent, gradient);
            };
            Animation.prototype.vector2InterpolateFunction = function(startValue, endValue, gradient) {
                return _math.Vector2.Lerp(startValue, endValue, gradient);
            };
            Animation.prototype.vector2InterpolateFunctionWithTangents = function(startValue, outTangent, endValue, inTangent, gradient) {
                return _math.Vector2.Hermite(startValue, outTangent, endValue, inTangent, gradient);
            };
            Animation.prototype.sizeInterpolateFunction = function(startValue, endValue, gradient) {
                return _math.Size.Lerp(startValue, endValue, gradient);
            };
            Animation.prototype.color3InterpolateFunction = function(startValue, endValue, gradient) {
                return _math.Color3.Lerp(startValue, endValue, gradient);
            };
            Animation.prototype._getKeyValue = function(value) {
                if (typeof value === "function") {
                    return value();
                }
                return value;
            };
            Animation.prototype._interpolate = function(currentFrame, state) {
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
                        if (startKey.interpolation === _animationKey.AnimationKeyInterpolation.STEP) {
                            return startValue;
                        }
                        var endValue = this._getKeyValue(endKey.value);
                        var useTangent = startKey.outTangent !== undefined && endKey.inTangent !== undefined;
                        var frameDelta = endKey.frame - startKey.frame;
                        var gradient = (currentFrame - startKey.frame) / frameDelta;
                        var easingFunction = this.getEasingFunction();
                        if (easingFunction != null) {
                            gradient = easingFunction.ease(gradient);
                        }
                        switch (this.dataType) {
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

                          case Animation.ANIMATIONTYPE_VECTOR3:
                            var vec3Value = useTangent ? this.vector3InterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this.vector3InterpolateFunction(startValue, endValue, gradient);
                            switch (state.loopMode) {
                              case Animation.ANIMATIONLOOPMODE_CYCLE:
                              case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return vec3Value;

                              case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return vec3Value.add(state.offsetValue.scale(state.repeatCount));
                            }

                          case Animation.ANIMATIONTYPE_VECTOR2:
                            var vec2Value = useTangent ? this.vector2InterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this.vector2InterpolateFunction(startValue, endValue, gradient);
                            switch (state.loopMode) {
                              case Animation.ANIMATIONLOOPMODE_CYCLE:
                              case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return vec2Value;

                              case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return vec2Value.add(state.offsetValue.scale(state.repeatCount));
                            }

                          case Animation.ANIMATIONTYPE_SIZE:
                            switch (state.loopMode) {
                              case Animation.ANIMATIONLOOPMODE_CYCLE:
                              case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return this.sizeInterpolateFunction(startValue, endValue, gradient);

                              case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return this.sizeInterpolateFunction(startValue, endValue, gradient).add(state.offsetValue.scale(state.repeatCount));
                            }

                          case Animation.ANIMATIONTYPE_COLOR3:
                            switch (state.loopMode) {
                              case Animation.ANIMATIONLOOPMODE_CYCLE:
                              case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return this.color3InterpolateFunction(startValue, endValue, gradient);

                              case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return this.color3InterpolateFunction(startValue, endValue, gradient).add(state.offsetValue.scale(state.repeatCount));
                            }

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
            Animation.prototype.matrixInterpolateFunction = function(startValue, endValue, gradient, result) {
                if (Animation.AllowMatrixDecomposeForInterpolation) {
                    if (result) {
                        _math.Matrix.DecomposeLerpToRef(startValue, endValue, gradient, result);
                        return result;
                    }
                    return _math.Matrix.DecomposeLerp(startValue, endValue, gradient);
                }
                if (result) {
                    _math.Matrix.LerpToRef(startValue, endValue, gradient, result);
                    return result;
                }
                return _math.Matrix.Lerp(startValue, endValue, gradient);
            };
            Animation.prototype.clone = function() {
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
            Animation.prototype.setKeys = function(values) {
                this._keys = values.slice(0);
            };
            Animation.prototype.serialize = function() {
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
                        key.values = [ animationKey.value ];
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
                get: function() {
                    return Animation._ANIMATIONTYPE_FLOAT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation, "ANIMATIONTYPE_VECTOR3", {
                get: function() {
                    return Animation._ANIMATIONTYPE_VECTOR3;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation, "ANIMATIONTYPE_VECTOR2", {
                get: function() {
                    return Animation._ANIMATIONTYPE_VECTOR2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation, "ANIMATIONTYPE_SIZE", {
                get: function() {
                    return Animation._ANIMATIONTYPE_SIZE;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation, "ANIMATIONTYPE_QUATERNION", {
                get: function() {
                    return Animation._ANIMATIONTYPE_QUATERNION;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation, "ANIMATIONTYPE_MATRIX", {
                get: function() {
                    return Animation._ANIMATIONTYPE_MATRIX;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation, "ANIMATIONTYPE_COLOR3", {
                get: function() {
                    return Animation._ANIMATIONTYPE_COLOR3;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation, "ANIMATIONLOOPMODE_RELATIVE", {
                get: function() {
                    return Animation._ANIMATIONLOOPMODE_RELATIVE;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation, "ANIMATIONLOOPMODE_CYCLE", {
                get: function() {
                    return Animation._ANIMATIONLOOPMODE_CYCLE;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation, "ANIMATIONLOOPMODE_CONSTANT", {
                get: function() {
                    return Animation._ANIMATIONLOOPMODE_CONSTANT;
                },
                enumerable: true,
                configurable: true
            });
            Animation._UniversalLerp = function(left, right, amount) {
                var constructor = left.constructor;
                if (constructor.Lerp) {
                    return constructor.Lerp(left, right, amount);
                } else if (constructor.Slerp) {
                    return constructor.Slerp(left, right, amount);
                } else if (left.toFixed) {
                    return left * (1 - amount) + amount * right;
                } else {
                    return right;
                }
            };
            Animation.Parse = function(parsedAnimation) {
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
                        data = _math.Quaternion.FromArray(key.values);
                        if (key.values.length >= 8) {
                            var _inTangent = _math.Quaternion.FromArray(key.values.slice(4, 8));
                            if (!_inTangent.equals(_math.Quaternion.Zero())) {
                                inTangent = _inTangent;
                            }
                        }
                        if (key.values.length >= 12) {
                            var _outTangent = _math.Quaternion.FromArray(key.values.slice(8, 12));
                            if (!_outTangent.equals(_math.Quaternion.Zero())) {
                                outTangent = _outTangent;
                            }
                        }
                        break;

                      case Animation.ANIMATIONTYPE_MATRIX:
                        data = _math.Matrix.FromArray(key.values);
                        break;

                      case Animation.ANIMATIONTYPE_COLOR3:
                        data = _math.Color3.FromArray(key.values);
                        break;

                      case Animation.ANIMATIONTYPE_VECTOR3:
                      default:
                        data = _math.Vector3.FromArray(key.values);
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
            Animation.AppendSerializedAnimations = function(source, destination) {
                _decorators.SerializationHelper.AppendSerializedAnimations(source, destination);
            };
            Animation.AllowMatricesInterpolation = false;
            Animation.AllowMatrixDecomposeForInterpolation = true;
            Animation._ANIMATIONTYPE_FLOAT = 0;
            Animation._ANIMATIONTYPE_VECTOR3 = 1;
            Animation._ANIMATIONTYPE_QUATERNION = 2;
            Animation._ANIMATIONTYPE_MATRIX = 3;
            Animation._ANIMATIONTYPE_COLOR3 = 4;
            Animation._ANIMATIONTYPE_VECTOR2 = 5;
            Animation._ANIMATIONTYPE_SIZE = 6;
            Animation._ANIMATIONLOOPMODE_RELATIVE = 0;
            Animation._ANIMATIONLOOPMODE_CYCLE = 1;
            Animation._ANIMATIONLOOPMODE_CONSTANT = 2;
            return Animation;
        }();
        exports.Animation = Animation;
        _typeStore._TypeStore.RegisteredTypes["BABYLON.Animation"] = Animation;
        _node.Node._AnimationRangeFactory = function(name, from, to) {
            return new _animationRange.AnimationRange(name, from, to);
        };
    }, {
        "../Maths/math": 13,
        "../Maths/math.scalar": 14,
        "../Misc/decorators": 17,
        "../Misc/typeStore": 22,
        "../node": 23,
        "./animationKey": 10,
        "./animationRange": 11
    } ],
    10: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.AnimationKeyInterpolation = void 0;
        var AnimationKeyInterpolation;
        exports.AnimationKeyInterpolation = AnimationKeyInterpolation;
        (function(AnimationKeyInterpolation) {
            AnimationKeyInterpolation[AnimationKeyInterpolation["STEP"] = 1] = "STEP";
        })(AnimationKeyInterpolation || (exports.AnimationKeyInterpolation = AnimationKeyInterpolation = {}));
    }, {} ],
    11: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.AnimationRange = void 0;
        var AnimationRange = function() {
            function AnimationRange(name, from, to) {
                this.name = name;
                this.from = from;
                this.to = to;
            }
            AnimationRange.prototype.clone = function() {
                return new AnimationRange(this.name, this.from, this.to);
            };
            return AnimationRange;
        }();
        exports.AnimationRange = AnimationRange;
    }, {} ],
    12: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.EngineStore = void 0;
        var EngineStore = function() {
            function EngineStore() {}
            Object.defineProperty(EngineStore, "LastCreatedEngine", {
                get: function() {
                    if (this.Instances.length === 0) {
                        return null;
                    }
                    return this.Instances[this.Instances.length - 1];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EngineStore, "LastCreatedScene", {
                get: function() {
                    return this._LastCreatedScene;
                },
                enumerable: true,
                configurable: true
            });
            EngineStore.Instances = new Array;
            EngineStore._LastCreatedScene = null;
            return EngineStore;
        }();
        exports.EngineStore = EngineStore;
    }, {} ],
    13: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.Tmp = exports.PositionNormalTextureVertex = exports.PositionNormalVertex = exports.Curve3 = exports.Path3D = exports.Path2 = exports.Arc2 = exports.Angle = exports.Orientation = exports.BezierCurve = exports.Axis = exports.Space = exports.Frustum = exports.Viewport = exports.Plane = exports.Matrix = exports.Quaternion = exports.Size = exports.Vector4 = exports.Vector3 = exports.Vector2 = exports.Color4 = exports.Color3 = exports.Epsilon = exports.ToLinearSpace = exports.ToGammaSpace = void 0;
        var _arrayTools = require("../Misc/arrayTools");
        var _math = require("./math.scalar");
        var ToGammaSpace = 1 / 2.2;
        exports.ToGammaSpace = ToGammaSpace;
        var ToLinearSpace = 2.2;
        exports.ToLinearSpace = ToLinearSpace;
        var Epsilon = .001;
        exports.Epsilon = Epsilon;
        var Color3 = function() {
            function Color3(r, g, b) {
                if (r === void 0) {
                    r = 0;
                }
                if (g === void 0) {
                    g = 0;
                }
                if (b === void 0) {
                    b = 0;
                }
                this.r = r;
                this.g = g;
                this.b = b;
            }
            Color3.prototype.toString = function() {
                return "{R: " + this.r + " G:" + this.g + " B:" + this.b + "}";
            };
            Color3.prototype.getClassName = function() {
                return "Color3";
            };
            Color3.prototype.getHashCode = function() {
                var hash = this.r || 0;
                hash = hash * 397 ^ (this.g || 0);
                hash = hash * 397 ^ (this.b || 0);
                return hash;
            };
            Color3.prototype.toArray = function(array, index) {
                if (index === void 0) {
                    index = 0;
                }
                array[index] = this.r;
                array[index + 1] = this.g;
                array[index + 2] = this.b;
                return this;
            };
            Color3.prototype.toColor4 = function(alpha) {
                if (alpha === void 0) {
                    alpha = 1;
                }
                return new Color4(this.r, this.g, this.b, alpha);
            };
            Color3.prototype.asArray = function() {
                var result = new Array;
                this.toArray(result, 0);
                return result;
            };
            Color3.prototype.toLuminance = function() {
                return this.r * .3 + this.g * .59 + this.b * .11;
            };
            Color3.prototype.multiply = function(otherColor) {
                return new Color3(this.r * otherColor.r, this.g * otherColor.g, this.b * otherColor.b);
            };
            Color3.prototype.multiplyToRef = function(otherColor, result) {
                result.r = this.r * otherColor.r;
                result.g = this.g * otherColor.g;
                result.b = this.b * otherColor.b;
                return this;
            };
            Color3.prototype.equals = function(otherColor) {
                return otherColor && this.r === otherColor.r && this.g === otherColor.g && this.b === otherColor.b;
            };
            Color3.prototype.equalsFloats = function(r, g, b) {
                return this.r === r && this.g === g && this.b === b;
            };
            Color3.prototype.scale = function(scale) {
                return new Color3(this.r * scale, this.g * scale, this.b * scale);
            };
            Color3.prototype.scaleToRef = function(scale, result) {
                result.r = this.r * scale;
                result.g = this.g * scale;
                result.b = this.b * scale;
                return this;
            };
            Color3.prototype.scaleAndAddToRef = function(scale, result) {
                result.r += this.r * scale;
                result.g += this.g * scale;
                result.b += this.b * scale;
                return this;
            };
            Color3.prototype.clampToRef = function(min, max, result) {
                if (min === void 0) {
                    min = 0;
                }
                if (max === void 0) {
                    max = 1;
                }
                result.r = _math.Scalar.Clamp(this.r, min, max);
                result.g = _math.Scalar.Clamp(this.g, min, max);
                result.b = _math.Scalar.Clamp(this.b, min, max);
                return this;
            };
            Color3.prototype.add = function(otherColor) {
                return new Color3(this.r + otherColor.r, this.g + otherColor.g, this.b + otherColor.b);
            };
            Color3.prototype.addToRef = function(otherColor, result) {
                result.r = this.r + otherColor.r;
                result.g = this.g + otherColor.g;
                result.b = this.b + otherColor.b;
                return this;
            };
            Color3.prototype.subtract = function(otherColor) {
                return new Color3(this.r - otherColor.r, this.g - otherColor.g, this.b - otherColor.b);
            };
            Color3.prototype.subtractToRef = function(otherColor, result) {
                result.r = this.r - otherColor.r;
                result.g = this.g - otherColor.g;
                result.b = this.b - otherColor.b;
                return this;
            };
            Color3.prototype.clone = function() {
                return new Color3(this.r, this.g, this.b);
            };
            Color3.prototype.copyFrom = function(source) {
                this.r = source.r;
                this.g = source.g;
                this.b = source.b;
                return this;
            };
            Color3.prototype.copyFromFloats = function(r, g, b) {
                this.r = r;
                this.g = g;
                this.b = b;
                return this;
            };
            Color3.prototype.set = function(r, g, b) {
                return this.copyFromFloats(r, g, b);
            };
            Color3.prototype.toHexString = function() {
                var intR = this.r * 255 | 0;
                var intG = this.g * 255 | 0;
                var intB = this.b * 255 | 0;
                return "#" + _math.Scalar.ToHex(intR) + _math.Scalar.ToHex(intG) + _math.Scalar.ToHex(intB);
            };
            Color3.prototype.toLinearSpace = function() {
                var convertedColor = new Color3;
                this.toLinearSpaceToRef(convertedColor);
                return convertedColor;
            };
            Color3.prototype.toLinearSpaceToRef = function(convertedColor) {
                convertedColor.r = Math.pow(this.r, ToLinearSpace);
                convertedColor.g = Math.pow(this.g, ToLinearSpace);
                convertedColor.b = Math.pow(this.b, ToLinearSpace);
                return this;
            };
            Color3.prototype.toGammaSpace = function() {
                var convertedColor = new Color3;
                this.toGammaSpaceToRef(convertedColor);
                return convertedColor;
            };
            Color3.prototype.toGammaSpaceToRef = function(convertedColor) {
                convertedColor.r = Math.pow(this.r, ToGammaSpace);
                convertedColor.g = Math.pow(this.g, ToGammaSpace);
                convertedColor.b = Math.pow(this.b, ToGammaSpace);
                return this;
            };
            Color3.FromHexString = function(hex) {
                if (hex.substring(0, 1) !== "#" || hex.length !== 7) {
                    return new Color3(0, 0, 0);
                }
                var r = parseInt(hex.substring(1, 3), 16);
                var g = parseInt(hex.substring(3, 5), 16);
                var b = parseInt(hex.substring(5, 7), 16);
                return Color3.FromInts(r, g, b);
            };
            Color3.FromArray = function(array, offset) {
                if (offset === void 0) {
                    offset = 0;
                }
                return new Color3(array[offset], array[offset + 1], array[offset + 2]);
            };
            Color3.FromInts = function(r, g, b) {
                return new Color3(r / 255, g / 255, b / 255);
            };
            Color3.Lerp = function(start, end, amount) {
                var result = new Color3(0, 0, 0);
                Color3.LerpToRef(start, end, amount, result);
                return result;
            };
            Color3.LerpToRef = function(left, right, amount, result) {
                result.r = left.r + (right.r - left.r) * amount;
                result.g = left.g + (right.g - left.g) * amount;
                result.b = left.b + (right.b - left.b) * amount;
            };
            Color3.Red = function() {
                return new Color3(1, 0, 0);
            };
            Color3.Green = function() {
                return new Color3(0, 1, 0);
            };
            Color3.Blue = function() {
                return new Color3(0, 0, 1);
            };
            Color3.Black = function() {
                return new Color3(0, 0, 0);
            };
            Object.defineProperty(Color3, "BlackReadOnly", {
                get: function() {
                    return Color3._BlackReadOnly;
                },
                enumerable: true,
                configurable: true
            });
            Color3.White = function() {
                return new Color3(1, 1, 1);
            };
            Color3.Purple = function() {
                return new Color3(.5, 0, .5);
            };
            Color3.Magenta = function() {
                return new Color3(1, 0, 1);
            };
            Color3.Yellow = function() {
                return new Color3(1, 1, 0);
            };
            Color3.Gray = function() {
                return new Color3(.5, .5, .5);
            };
            Color3.Teal = function() {
                return new Color3(0, 1, 1);
            };
            Color3.Random = function() {
                return new Color3(Math.random(), Math.random(), Math.random());
            };
            Color3._BlackReadOnly = Color3.Black();
            return Color3;
        }();
        exports.Color3 = Color3;
        var Color4 = function() {
            function Color4(r, g, b, a) {
                if (r === void 0) {
                    r = 0;
                }
                if (g === void 0) {
                    g = 0;
                }
                if (b === void 0) {
                    b = 0;
                }
                if (a === void 0) {
                    a = 1;
                }
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
            }
            Color4.prototype.addInPlace = function(right) {
                this.r += right.r;
                this.g += right.g;
                this.b += right.b;
                this.a += right.a;
                return this;
            };
            Color4.prototype.asArray = function() {
                var result = new Array;
                this.toArray(result, 0);
                return result;
            };
            Color4.prototype.toArray = function(array, index) {
                if (index === void 0) {
                    index = 0;
                }
                array[index] = this.r;
                array[index + 1] = this.g;
                array[index + 2] = this.b;
                array[index + 3] = this.a;
                return this;
            };
            Color4.prototype.equals = function(otherColor) {
                return otherColor && this.r === otherColor.r && this.g === otherColor.g && this.b === otherColor.b && this.a === otherColor.a;
            };
            Color4.prototype.add = function(right) {
                return new Color4(this.r + right.r, this.g + right.g, this.b + right.b, this.a + right.a);
            };
            Color4.prototype.subtract = function(right) {
                return new Color4(this.r - right.r, this.g - right.g, this.b - right.b, this.a - right.a);
            };
            Color4.prototype.subtractToRef = function(right, result) {
                result.r = this.r - right.r;
                result.g = this.g - right.g;
                result.b = this.b - right.b;
                result.a = this.a - right.a;
                return this;
            };
            Color4.prototype.scale = function(scale) {
                return new Color4(this.r * scale, this.g * scale, this.b * scale, this.a * scale);
            };
            Color4.prototype.scaleToRef = function(scale, result) {
                result.r = this.r * scale;
                result.g = this.g * scale;
                result.b = this.b * scale;
                result.a = this.a * scale;
                return this;
            };
            Color4.prototype.scaleAndAddToRef = function(scale, result) {
                result.r += this.r * scale;
                result.g += this.g * scale;
                result.b += this.b * scale;
                result.a += this.a * scale;
                return this;
            };
            Color4.prototype.clampToRef = function(min, max, result) {
                if (min === void 0) {
                    min = 0;
                }
                if (max === void 0) {
                    max = 1;
                }
                result.r = _math.Scalar.Clamp(this.r, min, max);
                result.g = _math.Scalar.Clamp(this.g, min, max);
                result.b = _math.Scalar.Clamp(this.b, min, max);
                result.a = _math.Scalar.Clamp(this.a, min, max);
                return this;
            };
            Color4.prototype.multiply = function(color) {
                return new Color4(this.r * color.r, this.g * color.g, this.b * color.b, this.a * color.a);
            };
            Color4.prototype.multiplyToRef = function(color, result) {
                result.r = this.r * color.r;
                result.g = this.g * color.g;
                result.b = this.b * color.b;
                result.a = this.a * color.a;
                return result;
            };
            Color4.prototype.toString = function() {
                return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
            };
            Color4.prototype.getClassName = function() {
                return "Color4";
            };
            Color4.prototype.getHashCode = function() {
                var hash = this.r || 0;
                hash = hash * 397 ^ (this.g || 0);
                hash = hash * 397 ^ (this.b || 0);
                hash = hash * 397 ^ (this.a || 0);
                return hash;
            };
            Color4.prototype.clone = function() {
                return new Color4(this.r, this.g, this.b, this.a);
            };
            Color4.prototype.copyFrom = function(source) {
                this.r = source.r;
                this.g = source.g;
                this.b = source.b;
                this.a = source.a;
                return this;
            };
            Color4.prototype.copyFromFloats = function(r, g, b, a) {
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
                return this;
            };
            Color4.prototype.set = function(r, g, b, a) {
                return this.copyFromFloats(r, g, b, a);
            };
            Color4.prototype.toHexString = function() {
                var intR = this.r * 255 | 0;
                var intG = this.g * 255 | 0;
                var intB = this.b * 255 | 0;
                var intA = this.a * 255 | 0;
                return "#" + _math.Scalar.ToHex(intR) + _math.Scalar.ToHex(intG) + _math.Scalar.ToHex(intB) + _math.Scalar.ToHex(intA);
            };
            Color4.prototype.toLinearSpace = function() {
                var convertedColor = new Color4;
                this.toLinearSpaceToRef(convertedColor);
                return convertedColor;
            };
            Color4.prototype.toLinearSpaceToRef = function(convertedColor) {
                convertedColor.r = Math.pow(this.r, ToLinearSpace);
                convertedColor.g = Math.pow(this.g, ToLinearSpace);
                convertedColor.b = Math.pow(this.b, ToLinearSpace);
                convertedColor.a = this.a;
                return this;
            };
            Color4.prototype.toGammaSpace = function() {
                var convertedColor = new Color4;
                this.toGammaSpaceToRef(convertedColor);
                return convertedColor;
            };
            Color4.prototype.toGammaSpaceToRef = function(convertedColor) {
                convertedColor.r = Math.pow(this.r, ToGammaSpace);
                convertedColor.g = Math.pow(this.g, ToGammaSpace);
                convertedColor.b = Math.pow(this.b, ToGammaSpace);
                convertedColor.a = this.a;
                return this;
            };
            Color4.FromHexString = function(hex) {
                if (hex.substring(0, 1) !== "#" || hex.length !== 9) {
                    return new Color4(0, 0, 0, 0);
                }
                var r = parseInt(hex.substring(1, 3), 16);
                var g = parseInt(hex.substring(3, 5), 16);
                var b = parseInt(hex.substring(5, 7), 16);
                var a = parseInt(hex.substring(7, 9), 16);
                return Color4.FromInts(r, g, b, a);
            };
            Color4.Lerp = function(left, right, amount) {
                var result = new Color4(0, 0, 0, 0);
                Color4.LerpToRef(left, right, amount, result);
                return result;
            };
            Color4.LerpToRef = function(left, right, amount, result) {
                result.r = left.r + (right.r - left.r) * amount;
                result.g = left.g + (right.g - left.g) * amount;
                result.b = left.b + (right.b - left.b) * amount;
                result.a = left.a + (right.a - left.a) * amount;
            };
            Color4.FromColor3 = function(color3, alpha) {
                if (alpha === void 0) {
                    alpha = 1;
                }
                return new Color4(color3.r, color3.g, color3.b, alpha);
            };
            Color4.FromArray = function(array, offset) {
                if (offset === void 0) {
                    offset = 0;
                }
                return new Color4(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
            };
            Color4.FromInts = function(r, g, b, a) {
                return new Color4(r / 255, g / 255, b / 255, a / 255);
            };
            Color4.CheckColors4 = function(colors, count) {
                if (colors.length === count * 3) {
                    var colors4 = [];
                    for (var index = 0; index < colors.length; index += 3) {
                        var newIndex = index / 3 * 4;
                        colors4[newIndex] = colors[index];
                        colors4[newIndex + 1] = colors[index + 1];
                        colors4[newIndex + 2] = colors[index + 2];
                        colors4[newIndex + 3] = 1;
                    }
                    return colors4;
                }
                return colors;
            };
            return Color4;
        }();
        exports.Color4 = Color4;
        var Vector2 = function() {
            function Vector2(x, y) {
                if (x === void 0) {
                    x = 0;
                }
                if (y === void 0) {
                    y = 0;
                }
                this.x = x;
                this.y = y;
            }
            Vector2.prototype.toString = function() {
                return "{X: " + this.x + " Y:" + this.y + "}";
            };
            Vector2.prototype.getClassName = function() {
                return "Vector2";
            };
            Vector2.prototype.getHashCode = function() {
                var hash = this.x || 0;
                hash = hash * 397 ^ (this.y || 0);
                return hash;
            };
            Vector2.prototype.toArray = function(array, index) {
                if (index === void 0) {
                    index = 0;
                }
                array[index] = this.x;
                array[index + 1] = this.y;
                return this;
            };
            Vector2.prototype.asArray = function() {
                var result = new Array;
                this.toArray(result, 0);
                return result;
            };
            Vector2.prototype.copyFrom = function(source) {
                this.x = source.x;
                this.y = source.y;
                return this;
            };
            Vector2.prototype.copyFromFloats = function(x, y) {
                this.x = x;
                this.y = y;
                return this;
            };
            Vector2.prototype.set = function(x, y) {
                return this.copyFromFloats(x, y);
            };
            Vector2.prototype.add = function(otherVector) {
                return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
            };
            Vector2.prototype.addToRef = function(otherVector, result) {
                result.x = this.x + otherVector.x;
                result.y = this.y + otherVector.y;
                return this;
            };
            Vector2.prototype.addInPlace = function(otherVector) {
                this.x += otherVector.x;
                this.y += otherVector.y;
                return this;
            };
            Vector2.prototype.addVector3 = function(otherVector) {
                return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
            };
            Vector2.prototype.subtract = function(otherVector) {
                return new Vector2(this.x - otherVector.x, this.y - otherVector.y);
            };
            Vector2.prototype.subtractToRef = function(otherVector, result) {
                result.x = this.x - otherVector.x;
                result.y = this.y - otherVector.y;
                return this;
            };
            Vector2.prototype.subtractInPlace = function(otherVector) {
                this.x -= otherVector.x;
                this.y -= otherVector.y;
                return this;
            };
            Vector2.prototype.multiplyInPlace = function(otherVector) {
                this.x *= otherVector.x;
                this.y *= otherVector.y;
                return this;
            };
            Vector2.prototype.multiply = function(otherVector) {
                return new Vector2(this.x * otherVector.x, this.y * otherVector.y);
            };
            Vector2.prototype.multiplyToRef = function(otherVector, result) {
                result.x = this.x * otherVector.x;
                result.y = this.y * otherVector.y;
                return this;
            };
            Vector2.prototype.multiplyByFloats = function(x, y) {
                return new Vector2(this.x * x, this.y * y);
            };
            Vector2.prototype.divide = function(otherVector) {
                return new Vector2(this.x / otherVector.x, this.y / otherVector.y);
            };
            Vector2.prototype.divideToRef = function(otherVector, result) {
                result.x = this.x / otherVector.x;
                result.y = this.y / otherVector.y;
                return this;
            };
            Vector2.prototype.divideInPlace = function(otherVector) {
                return this.divideToRef(otherVector, this);
            };
            Vector2.prototype.negate = function() {
                return new Vector2(-this.x, -this.y);
            };
            Vector2.prototype.scaleInPlace = function(scale) {
                this.x *= scale;
                this.y *= scale;
                return this;
            };
            Vector2.prototype.scale = function(scale) {
                var result = new Vector2(0, 0);
                this.scaleToRef(scale, result);
                return result;
            };
            Vector2.prototype.scaleToRef = function(scale, result) {
                result.x = this.x * scale;
                result.y = this.y * scale;
                return this;
            };
            Vector2.prototype.scaleAndAddToRef = function(scale, result) {
                result.x += this.x * scale;
                result.y += this.y * scale;
                return this;
            };
            Vector2.prototype.equals = function(otherVector) {
                return otherVector && this.x === otherVector.x && this.y === otherVector.y;
            };
            Vector2.prototype.equalsWithEpsilon = function(otherVector, epsilon) {
                if (epsilon === void 0) {
                    epsilon = Epsilon;
                }
                return otherVector && _math.Scalar.WithinEpsilon(this.x, otherVector.x, epsilon) && _math.Scalar.WithinEpsilon(this.y, otherVector.y, epsilon);
            };
            Vector2.prototype.floor = function() {
                return new Vector2(Math.floor(this.x), Math.floor(this.y));
            };
            Vector2.prototype.fract = function() {
                return new Vector2(this.x - Math.floor(this.x), this.y - Math.floor(this.y));
            };
            Vector2.prototype.length = function() {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            };
            Vector2.prototype.lengthSquared = function() {
                return this.x * this.x + this.y * this.y;
            };
            Vector2.prototype.normalize = function() {
                var len = this.length();
                if (len === 0) {
                    return this;
                }
                var num = 1 / len;
                this.x *= num;
                this.y *= num;
                return this;
            };
            Vector2.prototype.clone = function() {
                return new Vector2(this.x, this.y);
            };
            Vector2.Zero = function() {
                return new Vector2(0, 0);
            };
            Vector2.One = function() {
                return new Vector2(1, 1);
            };
            Vector2.FromArray = function(array, offset) {
                if (offset === void 0) {
                    offset = 0;
                }
                return new Vector2(array[offset], array[offset + 1]);
            };
            Vector2.FromArrayToRef = function(array, offset, result) {
                result.x = array[offset];
                result.y = array[offset + 1];
            };
            Vector2.CatmullRom = function(value1, value2, value3, value4, amount) {
                var squared = amount * amount;
                var cubed = amount * squared;
                var x = .5 * (2 * value2.x + (-value1.x + value3.x) * amount + (2 * value1.x - 5 * value2.x + 4 * value3.x - value4.x) * squared + (-value1.x + 3 * value2.x - 3 * value3.x + value4.x) * cubed);
                var y = .5 * (2 * value2.y + (-value1.y + value3.y) * amount + (2 * value1.y - 5 * value2.y + 4 * value3.y - value4.y) * squared + (-value1.y + 3 * value2.y - 3 * value3.y + value4.y) * cubed);
                return new Vector2(x, y);
            };
            Vector2.Clamp = function(value, min, max) {
                var x = value.x;
                x = x > max.x ? max.x : x;
                x = x < min.x ? min.x : x;
                var y = value.y;
                y = y > max.y ? max.y : y;
                y = y < min.y ? min.y : y;
                return new Vector2(x, y);
            };
            Vector2.Hermite = function(value1, tangent1, value2, tangent2, amount) {
                var squared = amount * amount;
                var cubed = amount * squared;
                var part1 = 2 * cubed - 3 * squared + 1;
                var part2 = -2 * cubed + 3 * squared;
                var part3 = cubed - 2 * squared + amount;
                var part4 = cubed - squared;
                var x = value1.x * part1 + value2.x * part2 + tangent1.x * part3 + tangent2.x * part4;
                var y = value1.y * part1 + value2.y * part2 + tangent1.y * part3 + tangent2.y * part4;
                return new Vector2(x, y);
            };
            Vector2.Lerp = function(start, end, amount) {
                var x = start.x + (end.x - start.x) * amount;
                var y = start.y + (end.y - start.y) * amount;
                return new Vector2(x, y);
            };
            Vector2.Dot = function(left, right) {
                return left.x * right.x + left.y * right.y;
            };
            Vector2.Normalize = function(vector) {
                var newVector = vector.clone();
                newVector.normalize();
                return newVector;
            };
            Vector2.Minimize = function(left, right) {
                var x = left.x < right.x ? left.x : right.x;
                var y = left.y < right.y ? left.y : right.y;
                return new Vector2(x, y);
            };
            Vector2.Maximize = function(left, right) {
                var x = left.x > right.x ? left.x : right.x;
                var y = left.y > right.y ? left.y : right.y;
                return new Vector2(x, y);
            };
            Vector2.Transform = function(vector, transformation) {
                var r = Vector2.Zero();
                Vector2.TransformToRef(vector, transformation, r);
                return r;
            };
            Vector2.TransformToRef = function(vector, transformation, result) {
                var m = transformation.m;
                var x = vector.x * m[0] + vector.y * m[4] + m[12];
                var y = vector.x * m[1] + vector.y * m[5] + m[13];
                result.x = x;
                result.y = y;
            };
            Vector2.PointInTriangle = function(p, p0, p1, p2) {
                var a = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
                var sign = a < 0 ? -1 : 1;
                var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
                var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
                return s > 0 && t > 0 && s + t < 2 * a * sign;
            };
            Vector2.Distance = function(value1, value2) {
                return Math.sqrt(Vector2.DistanceSquared(value1, value2));
            };
            Vector2.DistanceSquared = function(value1, value2) {
                var x = value1.x - value2.x;
                var y = value1.y - value2.y;
                return x * x + y * y;
            };
            Vector2.Center = function(value1, value2) {
                var center = value1.add(value2);
                center.scaleInPlace(.5);
                return center;
            };
            Vector2.DistanceOfPointFromSegment = function(p, segA, segB) {
                var l2 = Vector2.DistanceSquared(segA, segB);
                if (l2 === 0) {
                    return Vector2.Distance(p, segA);
                }
                var v = segB.subtract(segA);
                var t = Math.max(0, Math.min(1, Vector2.Dot(p.subtract(segA), v) / l2));
                var proj = segA.add(v.multiplyByFloats(t, t));
                return Vector2.Distance(p, proj);
            };
            return Vector2;
        }();
        exports.Vector2 = Vector2;
        var Vector3 = function() {
            function Vector3(x, y, z) {
                if (x === void 0) {
                    x = 0;
                }
                if (y === void 0) {
                    y = 0;
                }
                if (z === void 0) {
                    z = 0;
                }
                this.x = x;
                this.y = y;
                this.z = z;
            }
            Vector3.prototype.toString = function() {
                return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + "}";
            };
            Vector3.prototype.getClassName = function() {
                return "Vector3";
            };
            Vector3.prototype.getHashCode = function() {
                var hash = this.x || 0;
                hash = hash * 397 ^ (this.y || 0);
                hash = hash * 397 ^ (this.z || 0);
                return hash;
            };
            Vector3.prototype.asArray = function() {
                var result = [];
                this.toArray(result, 0);
                return result;
            };
            Vector3.prototype.toArray = function(array, index) {
                if (index === void 0) {
                    index = 0;
                }
                array[index] = this.x;
                array[index + 1] = this.y;
                array[index + 2] = this.z;
                return this;
            };
            Vector3.prototype.toQuaternion = function() {
                return Quaternion.RotationYawPitchRoll(this.y, this.x, this.z);
            };
            Vector3.prototype.addInPlace = function(otherVector) {
                return this.addInPlaceFromFloats(otherVector.x, otherVector.y, otherVector.z);
            };
            Vector3.prototype.addInPlaceFromFloats = function(x, y, z) {
                this.x += x;
                this.y += y;
                this.z += z;
                return this;
            };
            Vector3.prototype.add = function(otherVector) {
                return new Vector3(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
            };
            Vector3.prototype.addToRef = function(otherVector, result) {
                return result.copyFromFloats(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
            };
            Vector3.prototype.subtractInPlace = function(otherVector) {
                this.x -= otherVector.x;
                this.y -= otherVector.y;
                this.z -= otherVector.z;
                return this;
            };
            Vector3.prototype.subtract = function(otherVector) {
                return new Vector3(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
            };
            Vector3.prototype.subtractToRef = function(otherVector, result) {
                return this.subtractFromFloatsToRef(otherVector.x, otherVector.y, otherVector.z, result);
            };
            Vector3.prototype.subtractFromFloats = function(x, y, z) {
                return new Vector3(this.x - x, this.y - y, this.z - z);
            };
            Vector3.prototype.subtractFromFloatsToRef = function(x, y, z, result) {
                return result.copyFromFloats(this.x - x, this.y - y, this.z - z);
            };
            Vector3.prototype.negate = function() {
                return new Vector3(-this.x, -this.y, -this.z);
            };
            Vector3.prototype.scaleInPlace = function(scale) {
                this.x *= scale;
                this.y *= scale;
                this.z *= scale;
                return this;
            };
            Vector3.prototype.scale = function(scale) {
                return new Vector3(this.x * scale, this.y * scale, this.z * scale);
            };
            Vector3.prototype.scaleToRef = function(scale, result) {
                return result.copyFromFloats(this.x * scale, this.y * scale, this.z * scale);
            };
            Vector3.prototype.scaleAndAddToRef = function(scale, result) {
                return result.addInPlaceFromFloats(this.x * scale, this.y * scale, this.z * scale);
            };
            Vector3.prototype.equals = function(otherVector) {
                return otherVector && this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z;
            };
            Vector3.prototype.equalsWithEpsilon = function(otherVector, epsilon) {
                if (epsilon === void 0) {
                    epsilon = Epsilon;
                }
                return otherVector && _math.Scalar.WithinEpsilon(this.x, otherVector.x, epsilon) && _math.Scalar.WithinEpsilon(this.y, otherVector.y, epsilon) && _math.Scalar.WithinEpsilon(this.z, otherVector.z, epsilon);
            };
            Vector3.prototype.equalsToFloats = function(x, y, z) {
                return this.x === x && this.y === y && this.z === z;
            };
            Vector3.prototype.multiplyInPlace = function(otherVector) {
                this.x *= otherVector.x;
                this.y *= otherVector.y;
                this.z *= otherVector.z;
                return this;
            };
            Vector3.prototype.multiply = function(otherVector) {
                return this.multiplyByFloats(otherVector.x, otherVector.y, otherVector.z);
            };
            Vector3.prototype.multiplyToRef = function(otherVector, result) {
                return result.copyFromFloats(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z);
            };
            Vector3.prototype.multiplyByFloats = function(x, y, z) {
                return new Vector3(this.x * x, this.y * y, this.z * z);
            };
            Vector3.prototype.divide = function(otherVector) {
                return new Vector3(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z);
            };
            Vector3.prototype.divideToRef = function(otherVector, result) {
                return result.copyFromFloats(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z);
            };
            Vector3.prototype.divideInPlace = function(otherVector) {
                return this.divideToRef(otherVector, this);
            };
            Vector3.prototype.minimizeInPlace = function(other) {
                return this.minimizeInPlaceFromFloats(other.x, other.y, other.z);
            };
            Vector3.prototype.maximizeInPlace = function(other) {
                return this.maximizeInPlaceFromFloats(other.x, other.y, other.z);
            };
            Vector3.prototype.minimizeInPlaceFromFloats = function(x, y, z) {
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
            Vector3.prototype.maximizeInPlaceFromFloats = function(x, y, z) {
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
            Vector3.prototype.isNonUniformWithinEpsilon = function(epsilon) {
                var absX = Math.abs(this.x);
                var absY = Math.abs(this.y);
                if (!_math.Scalar.WithinEpsilon(absX, absY, epsilon)) {
                    return true;
                }
                var absZ = Math.abs(this.z);
                if (!_math.Scalar.WithinEpsilon(absX, absZ, epsilon)) {
                    return true;
                }
                if (!_math.Scalar.WithinEpsilon(absY, absZ, epsilon)) {
                    return true;
                }
                return false;
            };
            Object.defineProperty(Vector3.prototype, "isNonUniform", {
                get: function() {
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
            Vector3.prototype.floor = function() {
                return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
            };
            Vector3.prototype.fract = function() {
                return new Vector3(this.x - Math.floor(this.x), this.y - Math.floor(this.y), this.z - Math.floor(this.z));
            };
            Vector3.prototype.length = function() {
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            };
            Vector3.prototype.lengthSquared = function() {
                return this.x * this.x + this.y * this.y + this.z * this.z;
            };
            Vector3.prototype.normalize = function() {
                return this.normalizeFromLength(this.length());
            };
            Vector3.prototype.reorderInPlace = function(order) {
                var _this = this;
                order = order.toLowerCase();
                if (order === "xyz") {
                    return this;
                }
                MathTmp.Vector3[0].copyFrom(this);
                [ "x", "y", "z" ].forEach((function(val, i) {
                    _this[val] = MathTmp.Vector3[0][order[i]];
                }));
                return this;
            };
            Vector3.prototype.rotateByQuaternionToRef = function(quaternion, result) {
                quaternion.toRotationMatrix(MathTmp.Matrix[0]);
                Vector3.TransformCoordinatesToRef(this, MathTmp.Matrix[0], result);
                return result;
            };
            Vector3.prototype.rotateByQuaternionAroundPointToRef = function(quaternion, point, result) {
                this.subtractToRef(point, MathTmp.Vector3[0]);
                MathTmp.Vector3[0].rotateByQuaternionToRef(quaternion, MathTmp.Vector3[0]);
                point.addToRef(MathTmp.Vector3[0], result);
                return result;
            };
            Vector3.prototype.normalizeFromLength = function(len) {
                if (len === 0 || len === 1) {
                    return this;
                }
                return this.scaleInPlace(1 / len);
            };
            Vector3.prototype.normalizeToNew = function() {
                var normalized = new Vector3(0, 0, 0);
                this.normalizeToRef(normalized);
                return normalized;
            };
            Vector3.prototype.normalizeToRef = function(reference) {
                var len = this.length();
                if (len === 0 || len === 1) {
                    return reference.copyFromFloats(this.x, this.y, this.z);
                }
                return this.scaleToRef(1 / len, reference);
            };
            Vector3.prototype.clone = function() {
                return new Vector3(this.x, this.y, this.z);
            };
            Vector3.prototype.copyFrom = function(source) {
                return this.copyFromFloats(source.x, source.y, source.z);
            };
            Vector3.prototype.copyFromFloats = function(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
                return this;
            };
            Vector3.prototype.set = function(x, y, z) {
                return this.copyFromFloats(x, y, z);
            };
            Vector3.prototype.setAll = function(v) {
                this.x = this.y = this.z = v;
                return this;
            };
            Vector3.GetClipFactor = function(vector0, vector1, axis, size) {
                var d0 = Vector3.Dot(vector0, axis) - size;
                var d1 = Vector3.Dot(vector1, axis) - size;
                var s = d0 / (d0 - d1);
                return s;
            };
            Vector3.GetAngleBetweenVectors = function(vector0, vector1, normal) {
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
            Vector3.FromArray = function(array, offset) {
                if (offset === void 0) {
                    offset = 0;
                }
                return new Vector3(array[offset], array[offset + 1], array[offset + 2]);
            };
            Vector3.FromFloatArray = function(array, offset) {
                return Vector3.FromArray(array, offset);
            };
            Vector3.FromArrayToRef = function(array, offset, result) {
                result.x = array[offset];
                result.y = array[offset + 1];
                result.z = array[offset + 2];
            };
            Vector3.FromFloatArrayToRef = function(array, offset, result) {
                return Vector3.FromArrayToRef(array, offset, result);
            };
            Vector3.FromFloatsToRef = function(x, y, z, result) {
                result.copyFromFloats(x, y, z);
            };
            Vector3.Zero = function() {
                return new Vector3(0, 0, 0);
            };
            Vector3.One = function() {
                return new Vector3(1, 1, 1);
            };
            Vector3.Up = function() {
                return new Vector3(0, 1, 0);
            };
            Object.defineProperty(Vector3, "UpReadOnly", {
                get: function() {
                    return Vector3._UpReadOnly;
                },
                enumerable: true,
                configurable: true
            });
            Vector3.Down = function() {
                return new Vector3(0, -1, 0);
            };
            Vector3.Forward = function() {
                return new Vector3(0, 0, 1);
            };
            Vector3.Backward = function() {
                return new Vector3(0, 0, -1);
            };
            Vector3.Right = function() {
                return new Vector3(1, 0, 0);
            };
            Vector3.Left = function() {
                return new Vector3(-1, 0, 0);
            };
            Vector3.TransformCoordinates = function(vector, transformation) {
                var result = Vector3.Zero();
                Vector3.TransformCoordinatesToRef(vector, transformation, result);
                return result;
            };
            Vector3.TransformCoordinatesToRef = function(vector, transformation, result) {
                Vector3.TransformCoordinatesFromFloatsToRef(vector.x, vector.y, vector.z, transformation, result);
            };
            Vector3.TransformCoordinatesFromFloatsToRef = function(x, y, z, transformation, result) {
                var m = transformation.m;
                var rx = x * m[0] + y * m[4] + z * m[8] + m[12];
                var ry = x * m[1] + y * m[5] + z * m[9] + m[13];
                var rz = x * m[2] + y * m[6] + z * m[10] + m[14];
                var rw = 1 / (x * m[3] + y * m[7] + z * m[11] + m[15]);
                result.x = rx * rw;
                result.y = ry * rw;
                result.z = rz * rw;
            };
            Vector3.TransformNormal = function(vector, transformation) {
                var result = Vector3.Zero();
                Vector3.TransformNormalToRef(vector, transformation, result);
                return result;
            };
            Vector3.TransformNormalToRef = function(vector, transformation, result) {
                this.TransformNormalFromFloatsToRef(vector.x, vector.y, vector.z, transformation, result);
            };
            Vector3.TransformNormalFromFloatsToRef = function(x, y, z, transformation, result) {
                var m = transformation.m;
                result.x = x * m[0] + y * m[4] + z * m[8];
                result.y = x * m[1] + y * m[5] + z * m[9];
                result.z = x * m[2] + y * m[6] + z * m[10];
            };
            Vector3.CatmullRom = function(value1, value2, value3, value4, amount) {
                var squared = amount * amount;
                var cubed = amount * squared;
                var x = .5 * (2 * value2.x + (-value1.x + value3.x) * amount + (2 * value1.x - 5 * value2.x + 4 * value3.x - value4.x) * squared + (-value1.x + 3 * value2.x - 3 * value3.x + value4.x) * cubed);
                var y = .5 * (2 * value2.y + (-value1.y + value3.y) * amount + (2 * value1.y - 5 * value2.y + 4 * value3.y - value4.y) * squared + (-value1.y + 3 * value2.y - 3 * value3.y + value4.y) * cubed);
                var z = .5 * (2 * value2.z + (-value1.z + value3.z) * amount + (2 * value1.z - 5 * value2.z + 4 * value3.z - value4.z) * squared + (-value1.z + 3 * value2.z - 3 * value3.z + value4.z) * cubed);
                return new Vector3(x, y, z);
            };
            Vector3.Clamp = function(value, min, max) {
                var v = new Vector3;
                Vector3.ClampToRef(value, min, max, v);
                return v;
            };
            Vector3.ClampToRef = function(value, min, max, result) {
                var x = value.x;
                x = x > max.x ? max.x : x;
                x = x < min.x ? min.x : x;
                var y = value.y;
                y = y > max.y ? max.y : y;
                y = y < min.y ? min.y : y;
                var z = value.z;
                z = z > max.z ? max.z : z;
                z = z < min.z ? min.z : z;
                result.copyFromFloats(x, y, z);
            };
            Vector3.Hermite = function(value1, tangent1, value2, tangent2, amount) {
                var squared = amount * amount;
                var cubed = amount * squared;
                var part1 = 2 * cubed - 3 * squared + 1;
                var part2 = -2 * cubed + 3 * squared;
                var part3 = cubed - 2 * squared + amount;
                var part4 = cubed - squared;
                var x = value1.x * part1 + value2.x * part2 + tangent1.x * part3 + tangent2.x * part4;
                var y = value1.y * part1 + value2.y * part2 + tangent1.y * part3 + tangent2.y * part4;
                var z = value1.z * part1 + value2.z * part2 + tangent1.z * part3 + tangent2.z * part4;
                return new Vector3(x, y, z);
            };
            Vector3.Lerp = function(start, end, amount) {
                var result = new Vector3(0, 0, 0);
                Vector3.LerpToRef(start, end, amount, result);
                return result;
            };
            Vector3.LerpToRef = function(start, end, amount, result) {
                result.x = start.x + (end.x - start.x) * amount;
                result.y = start.y + (end.y - start.y) * amount;
                result.z = start.z + (end.z - start.z) * amount;
            };
            Vector3.Dot = function(left, right) {
                return left.x * right.x + left.y * right.y + left.z * right.z;
            };
            Vector3.Cross = function(left, right) {
                var result = Vector3.Zero();
                Vector3.CrossToRef(left, right, result);
                return result;
            };
            Vector3.CrossToRef = function(left, right, result) {
                var x = left.y * right.z - left.z * right.y;
                var y = left.z * right.x - left.x * right.z;
                var z = left.x * right.y - left.y * right.x;
                result.copyFromFloats(x, y, z);
            };
            Vector3.Normalize = function(vector) {
                var result = Vector3.Zero();
                Vector3.NormalizeToRef(vector, result);
                return result;
            };
            Vector3.NormalizeToRef = function(vector, result) {
                vector.normalizeToRef(result);
            };
            Vector3.Project = function(vector, world, transform, viewport) {
                var cw = viewport.width;
                var ch = viewport.height;
                var cx = viewport.x;
                var cy = viewport.y;
                var viewportMatrix = MathTmp.Matrix[1];
                Matrix.FromValuesToRef(cw / 2, 0, 0, 0, 0, -ch / 2, 0, 0, 0, 0, .5, 0, cx + cw / 2, ch / 2 + cy, .5, 1, viewportMatrix);
                var matrix = MathTmp.Matrix[0];
                world.multiplyToRef(transform, matrix);
                matrix.multiplyToRef(viewportMatrix, matrix);
                return Vector3.TransformCoordinates(vector, matrix);
            };
            Vector3._UnprojectFromInvertedMatrixToRef = function(source, matrix, result) {
                Vector3.TransformCoordinatesToRef(source, matrix, result);
                var m = matrix.m;
                var num = source.x * m[3] + source.y * m[7] + source.z * m[11] + m[15];
                if (_math.Scalar.WithinEpsilon(num, 1)) {
                    result.scaleInPlace(1 / num);
                }
            };
            Vector3.UnprojectFromTransform = function(source, viewportWidth, viewportHeight, world, transform) {
                var matrix = MathTmp.Matrix[0];
                world.multiplyToRef(transform, matrix);
                matrix.invert();
                source.x = source.x / viewportWidth * 2 - 1;
                source.y = -(source.y / viewportHeight * 2 - 1);
                var vector = new Vector3;
                Vector3._UnprojectFromInvertedMatrixToRef(source, matrix, vector);
                return vector;
            };
            Vector3.Unproject = function(source, viewportWidth, viewportHeight, world, view, projection) {
                var result = Vector3.Zero();
                Vector3.UnprojectToRef(source, viewportWidth, viewportHeight, world, view, projection, result);
                return result;
            };
            Vector3.UnprojectToRef = function(source, viewportWidth, viewportHeight, world, view, projection, result) {
                Vector3.UnprojectFloatsToRef(source.x, source.y, source.z, viewportWidth, viewportHeight, world, view, projection, result);
            };
            Vector3.UnprojectFloatsToRef = function(sourceX, sourceY, sourceZ, viewportWidth, viewportHeight, world, view, projection, result) {
                var matrix = MathTmp.Matrix[0];
                world.multiplyToRef(view, matrix);
                matrix.multiplyToRef(projection, matrix);
                matrix.invert();
                var screenSource = MathTmp.Vector3[0];
                screenSource.x = sourceX / viewportWidth * 2 - 1;
                screenSource.y = -(sourceY / viewportHeight * 2 - 1);
                screenSource.z = 2 * sourceZ - 1;
                Vector3._UnprojectFromInvertedMatrixToRef(screenSource, matrix, result);
            };
            Vector3.Minimize = function(left, right) {
                var min = left.clone();
                min.minimizeInPlace(right);
                return min;
            };
            Vector3.Maximize = function(left, right) {
                var max = left.clone();
                max.maximizeInPlace(right);
                return max;
            };
            Vector3.Distance = function(value1, value2) {
                return Math.sqrt(Vector3.DistanceSquared(value1, value2));
            };
            Vector3.DistanceSquared = function(value1, value2) {
                var x = value1.x - value2.x;
                var y = value1.y - value2.y;
                var z = value1.z - value2.z;
                return x * x + y * y + z * z;
            };
            Vector3.Center = function(value1, value2) {
                var center = value1.add(value2);
                center.scaleInPlace(.5);
                return center;
            };
            Vector3.RotationFromAxis = function(axis1, axis2, axis3) {
                var rotation = Vector3.Zero();
                Vector3.RotationFromAxisToRef(axis1, axis2, axis3, rotation);
                return rotation;
            };
            Vector3.RotationFromAxisToRef = function(axis1, axis2, axis3, ref) {
                var quat = MathTmp.Quaternion[0];
                Quaternion.RotationQuaternionFromAxisToRef(axis1, axis2, axis3, quat);
                quat.toEulerAnglesToRef(ref);
            };
            Vector3._UpReadOnly = Vector3.Up();
            return Vector3;
        }();
        exports.Vector3 = Vector3;
        var Vector4 = function() {
            function Vector4(x, y, z, w) {
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
            }
            Vector4.prototype.toString = function() {
                return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + " W:" + this.w + "}";
            };
            Vector4.prototype.getClassName = function() {
                return "Vector4";
            };
            Vector4.prototype.getHashCode = function() {
                var hash = this.x || 0;
                hash = hash * 397 ^ (this.y || 0);
                hash = hash * 397 ^ (this.z || 0);
                hash = hash * 397 ^ (this.w || 0);
                return hash;
            };
            Vector4.prototype.asArray = function() {
                var result = new Array;
                this.toArray(result, 0);
                return result;
            };
            Vector4.prototype.toArray = function(array, index) {
                if (index === undefined) {
                    index = 0;
                }
                array[index] = this.x;
                array[index + 1] = this.y;
                array[index + 2] = this.z;
                array[index + 3] = this.w;
                return this;
            };
            Vector4.prototype.addInPlace = function(otherVector) {
                this.x += otherVector.x;
                this.y += otherVector.y;
                this.z += otherVector.z;
                this.w += otherVector.w;
                return this;
            };
            Vector4.prototype.add = function(otherVector) {
                return new Vector4(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z, this.w + otherVector.w);
            };
            Vector4.prototype.addToRef = function(otherVector, result) {
                result.x = this.x + otherVector.x;
                result.y = this.y + otherVector.y;
                result.z = this.z + otherVector.z;
                result.w = this.w + otherVector.w;
                return this;
            };
            Vector4.prototype.subtractInPlace = function(otherVector) {
                this.x -= otherVector.x;
                this.y -= otherVector.y;
                this.z -= otherVector.z;
                this.w -= otherVector.w;
                return this;
            };
            Vector4.prototype.subtract = function(otherVector) {
                return new Vector4(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z, this.w - otherVector.w);
            };
            Vector4.prototype.subtractToRef = function(otherVector, result) {
                result.x = this.x - otherVector.x;
                result.y = this.y - otherVector.y;
                result.z = this.z - otherVector.z;
                result.w = this.w - otherVector.w;
                return this;
            };
            Vector4.prototype.subtractFromFloats = function(x, y, z, w) {
                return new Vector4(this.x - x, this.y - y, this.z - z, this.w - w);
            };
            Vector4.prototype.subtractFromFloatsToRef = function(x, y, z, w, result) {
                result.x = this.x - x;
                result.y = this.y - y;
                result.z = this.z - z;
                result.w = this.w - w;
                return this;
            };
            Vector4.prototype.negate = function() {
                return new Vector4(-this.x, -this.y, -this.z, -this.w);
            };
            Vector4.prototype.scaleInPlace = function(scale) {
                this.x *= scale;
                this.y *= scale;
                this.z *= scale;
                this.w *= scale;
                return this;
            };
            Vector4.prototype.scale = function(scale) {
                return new Vector4(this.x * scale, this.y * scale, this.z * scale, this.w * scale);
            };
            Vector4.prototype.scaleToRef = function(scale, result) {
                result.x = this.x * scale;
                result.y = this.y * scale;
                result.z = this.z * scale;
                result.w = this.w * scale;
                return this;
            };
            Vector4.prototype.scaleAndAddToRef = function(scale, result) {
                result.x += this.x * scale;
                result.y += this.y * scale;
                result.z += this.z * scale;
                result.w += this.w * scale;
                return this;
            };
            Vector4.prototype.equals = function(otherVector) {
                return otherVector && this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z && this.w === otherVector.w;
            };
            Vector4.prototype.equalsWithEpsilon = function(otherVector, epsilon) {
                if (epsilon === void 0) {
                    epsilon = Epsilon;
                }
                return otherVector && _math.Scalar.WithinEpsilon(this.x, otherVector.x, epsilon) && _math.Scalar.WithinEpsilon(this.y, otherVector.y, epsilon) && _math.Scalar.WithinEpsilon(this.z, otherVector.z, epsilon) && _math.Scalar.WithinEpsilon(this.w, otherVector.w, epsilon);
            };
            Vector4.prototype.equalsToFloats = function(x, y, z, w) {
                return this.x === x && this.y === y && this.z === z && this.w === w;
            };
            Vector4.prototype.multiplyInPlace = function(otherVector) {
                this.x *= otherVector.x;
                this.y *= otherVector.y;
                this.z *= otherVector.z;
                this.w *= otherVector.w;
                return this;
            };
            Vector4.prototype.multiply = function(otherVector) {
                return new Vector4(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z, this.w * otherVector.w);
            };
            Vector4.prototype.multiplyToRef = function(otherVector, result) {
                result.x = this.x * otherVector.x;
                result.y = this.y * otherVector.y;
                result.z = this.z * otherVector.z;
                result.w = this.w * otherVector.w;
                return this;
            };
            Vector4.prototype.multiplyByFloats = function(x, y, z, w) {
                return new Vector4(this.x * x, this.y * y, this.z * z, this.w * w);
            };
            Vector4.prototype.divide = function(otherVector) {
                return new Vector4(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z, this.w / otherVector.w);
            };
            Vector4.prototype.divideToRef = function(otherVector, result) {
                result.x = this.x / otherVector.x;
                result.y = this.y / otherVector.y;
                result.z = this.z / otherVector.z;
                result.w = this.w / otherVector.w;
                return this;
            };
            Vector4.prototype.divideInPlace = function(otherVector) {
                return this.divideToRef(otherVector, this);
            };
            Vector4.prototype.minimizeInPlace = function(other) {
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
            Vector4.prototype.maximizeInPlace = function(other) {
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
            Vector4.prototype.floor = function() {
                return new Vector4(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z), Math.floor(this.w));
            };
            Vector4.prototype.fract = function() {
                return new Vector4(this.x - Math.floor(this.x), this.y - Math.floor(this.y), this.z - Math.floor(this.z), this.w - Math.floor(this.w));
            };
            Vector4.prototype.length = function() {
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
            };
            Vector4.prototype.lengthSquared = function() {
                return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
            };
            Vector4.prototype.normalize = function() {
                var len = this.length();
                if (len === 0) {
                    return this;
                }
                return this.scaleInPlace(1 / len);
            };
            Vector4.prototype.toVector3 = function() {
                return new Vector3(this.x, this.y, this.z);
            };
            Vector4.prototype.clone = function() {
                return new Vector4(this.x, this.y, this.z, this.w);
            };
            Vector4.prototype.copyFrom = function(source) {
                this.x = source.x;
                this.y = source.y;
                this.z = source.z;
                this.w = source.w;
                return this;
            };
            Vector4.prototype.copyFromFloats = function(x, y, z, w) {
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
                return this;
            };
            Vector4.prototype.set = function(x, y, z, w) {
                return this.copyFromFloats(x, y, z, w);
            };
            Vector4.prototype.setAll = function(v) {
                this.x = this.y = this.z = this.w = v;
                return this;
            };
            Vector4.FromArray = function(array, offset) {
                if (!offset) {
                    offset = 0;
                }
                return new Vector4(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
            };
            Vector4.FromArrayToRef = function(array, offset, result) {
                result.x = array[offset];
                result.y = array[offset + 1];
                result.z = array[offset + 2];
                result.w = array[offset + 3];
            };
            Vector4.FromFloatArrayToRef = function(array, offset, result) {
                Vector4.FromArrayToRef(array, offset, result);
            };
            Vector4.FromFloatsToRef = function(x, y, z, w, result) {
                result.x = x;
                result.y = y;
                result.z = z;
                result.w = w;
            };
            Vector4.Zero = function() {
                return new Vector4(0, 0, 0, 0);
            };
            Vector4.One = function() {
                return new Vector4(1, 1, 1, 1);
            };
            Vector4.Normalize = function(vector) {
                var result = Vector4.Zero();
                Vector4.NormalizeToRef(vector, result);
                return result;
            };
            Vector4.NormalizeToRef = function(vector, result) {
                result.copyFrom(vector);
                result.normalize();
            };
            Vector4.Minimize = function(left, right) {
                var min = left.clone();
                min.minimizeInPlace(right);
                return min;
            };
            Vector4.Maximize = function(left, right) {
                var max = left.clone();
                max.maximizeInPlace(right);
                return max;
            };
            Vector4.Distance = function(value1, value2) {
                return Math.sqrt(Vector4.DistanceSquared(value1, value2));
            };
            Vector4.DistanceSquared = function(value1, value2) {
                var x = value1.x - value2.x;
                var y = value1.y - value2.y;
                var z = value1.z - value2.z;
                var w = value1.w - value2.w;
                return x * x + y * y + z * z + w * w;
            };
            Vector4.Center = function(value1, value2) {
                var center = value1.add(value2);
                center.scaleInPlace(.5);
                return center;
            };
            Vector4.TransformNormal = function(vector, transformation) {
                var result = Vector4.Zero();
                Vector4.TransformNormalToRef(vector, transformation, result);
                return result;
            };
            Vector4.TransformNormalToRef = function(vector, transformation, result) {
                var m = transformation.m;
                var x = vector.x * m[0] + vector.y * m[4] + vector.z * m[8];
                var y = vector.x * m[1] + vector.y * m[5] + vector.z * m[9];
                var z = vector.x * m[2] + vector.y * m[6] + vector.z * m[10];
                result.x = x;
                result.y = y;
                result.z = z;
                result.w = vector.w;
            };
            Vector4.TransformNormalFromFloatsToRef = function(x, y, z, w, transformation, result) {
                var m = transformation.m;
                result.x = x * m[0] + y * m[4] + z * m[8];
                result.y = x * m[1] + y * m[5] + z * m[9];
                result.z = x * m[2] + y * m[6] + z * m[10];
                result.w = w;
            };
            Vector4.FromVector3 = function(source, w) {
                if (w === void 0) {
                    w = 0;
                }
                return new Vector4(source.x, source.y, source.z, w);
            };
            return Vector4;
        }();
        exports.Vector4 = Vector4;
        var Size = function() {
            function Size(width, height) {
                this.width = width;
                this.height = height;
            }
            Size.prototype.toString = function() {
                return "{W: " + this.width + ", H: " + this.height + "}";
            };
            Size.prototype.getClassName = function() {
                return "Size";
            };
            Size.prototype.getHashCode = function() {
                var hash = this.width || 0;
                hash = hash * 397 ^ (this.height || 0);
                return hash;
            };
            Size.prototype.copyFrom = function(src) {
                this.width = src.width;
                this.height = src.height;
            };
            Size.prototype.copyFromFloats = function(width, height) {
                this.width = width;
                this.height = height;
                return this;
            };
            Size.prototype.set = function(width, height) {
                return this.copyFromFloats(width, height);
            };
            Size.prototype.multiplyByFloats = function(w, h) {
                return new Size(this.width * w, this.height * h);
            };
            Size.prototype.clone = function() {
                return new Size(this.width, this.height);
            };
            Size.prototype.equals = function(other) {
                if (!other) {
                    return false;
                }
                return this.width === other.width && this.height === other.height;
            };
            Object.defineProperty(Size.prototype, "surface", {
                get: function() {
                    return this.width * this.height;
                },
                enumerable: true,
                configurable: true
            });
            Size.Zero = function() {
                return new Size(0, 0);
            };
            Size.prototype.add = function(otherSize) {
                var r = new Size(this.width + otherSize.width, this.height + otherSize.height);
                return r;
            };
            Size.prototype.subtract = function(otherSize) {
                var r = new Size(this.width - otherSize.width, this.height - otherSize.height);
                return r;
            };
            Size.Lerp = function(start, end, amount) {
                var w = start.width + (end.width - start.width) * amount;
                var h = start.height + (end.height - start.height) * amount;
                return new Size(w, h);
            };
            return Size;
        }();
        exports.Size = Size;
        var Quaternion = function() {
            function Quaternion(x, y, z, w) {
                if (x === void 0) {
                    x = 0;
                }
                if (y === void 0) {
                    y = 0;
                }
                if (z === void 0) {
                    z = 0;
                }
                if (w === void 0) {
                    w = 1;
                }
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
            }
            Quaternion.prototype.toString = function() {
                return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + " W:" + this.w + "}";
            };
            Quaternion.prototype.getClassName = function() {
                return "Quaternion";
            };
            Quaternion.prototype.getHashCode = function() {
                var hash = this.x || 0;
                hash = hash * 397 ^ (this.y || 0);
                hash = hash * 397 ^ (this.z || 0);
                hash = hash * 397 ^ (this.w || 0);
                return hash;
            };
            Quaternion.prototype.asArray = function() {
                return [ this.x, this.y, this.z, this.w ];
            };
            Quaternion.prototype.equals = function(otherQuaternion) {
                return otherQuaternion && this.x === otherQuaternion.x && this.y === otherQuaternion.y && this.z === otherQuaternion.z && this.w === otherQuaternion.w;
            };
            Quaternion.prototype.clone = function() {
                return new Quaternion(this.x, this.y, this.z, this.w);
            };
            Quaternion.prototype.copyFrom = function(other) {
                this.x = other.x;
                this.y = other.y;
                this.z = other.z;
                this.w = other.w;
                return this;
            };
            Quaternion.prototype.copyFromFloats = function(x, y, z, w) {
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
                return this;
            };
            Quaternion.prototype.set = function(x, y, z, w) {
                return this.copyFromFloats(x, y, z, w);
            };
            Quaternion.prototype.add = function(other) {
                return new Quaternion(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);
            };
            Quaternion.prototype.addInPlace = function(other) {
                this.x += other.x;
                this.y += other.y;
                this.z += other.z;
                this.w += other.w;
                return this;
            };
            Quaternion.prototype.subtract = function(other) {
                return new Quaternion(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w);
            };
            Quaternion.prototype.scale = function(value) {
                return new Quaternion(this.x * value, this.y * value, this.z * value, this.w * value);
            };
            Quaternion.prototype.scaleToRef = function(scale, result) {
                result.x = this.x * scale;
                result.y = this.y * scale;
                result.z = this.z * scale;
                result.w = this.w * scale;
                return this;
            };
            Quaternion.prototype.scaleInPlace = function(value) {
                this.x *= value;
                this.y *= value;
                this.z *= value;
                this.w *= value;
                return this;
            };
            Quaternion.prototype.scaleAndAddToRef = function(scale, result) {
                result.x += this.x * scale;
                result.y += this.y * scale;
                result.z += this.z * scale;
                result.w += this.w * scale;
                return this;
            };
            Quaternion.prototype.multiply = function(q1) {
                var result = new Quaternion(0, 0, 0, 1);
                this.multiplyToRef(q1, result);
                return result;
            };
            Quaternion.prototype.multiplyToRef = function(q1, result) {
                var x = this.x * q1.w + this.y * q1.z - this.z * q1.y + this.w * q1.x;
                var y = -this.x * q1.z + this.y * q1.w + this.z * q1.x + this.w * q1.y;
                var z = this.x * q1.y - this.y * q1.x + this.z * q1.w + this.w * q1.z;
                var w = -this.x * q1.x - this.y * q1.y - this.z * q1.z + this.w * q1.w;
                result.copyFromFloats(x, y, z, w);
                return this;
            };
            Quaternion.prototype.multiplyInPlace = function(q1) {
                this.multiplyToRef(q1, this);
                return this;
            };
            Quaternion.prototype.conjugateToRef = function(ref) {
                ref.copyFromFloats(-this.x, -this.y, -this.z, this.w);
                return this;
            };
            Quaternion.prototype.conjugateInPlace = function() {
                this.x *= -1;
                this.y *= -1;
                this.z *= -1;
                return this;
            };
            Quaternion.prototype.conjugate = function() {
                var result = new Quaternion(-this.x, -this.y, -this.z, this.w);
                return result;
            };
            Quaternion.prototype.length = function() {
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
            };
            Quaternion.prototype.normalize = function() {
                var len = this.length();
                if (len === 0) {
                    return this;
                }
                var inv = 1 / len;
                this.x *= inv;
                this.y *= inv;
                this.z *= inv;
                this.w *= inv;
                return this;
            };
            Quaternion.prototype.toEulerAngles = function(order) {
                if (order === void 0) {
                    order = "YZX";
                }
                var result = Vector3.Zero();
                this.toEulerAnglesToRef(result);
                return result;
            };
            Quaternion.prototype.toEulerAnglesToRef = function(result) {
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
                } else if (zAxisY > limit) {
                    result.y = 2 * Math.atan2(qy, qw);
                    result.x = -Math.PI / 2;
                    result.z = 0;
                } else {
                    result.z = Math.atan2(2 * (qx * qy + qz * qw), -sqz - sqx + sqy + sqw);
                    result.x = Math.asin(-2 * (qz * qy - qx * qw));
                    result.y = Math.atan2(2 * (qz * qx + qy * qw), sqz - sqx - sqy + sqw);
                }
                return this;
            };
            Quaternion.prototype.toRotationMatrix = function(result) {
                Matrix.FromQuaternionToRef(this, result);
                return this;
            };
            Quaternion.prototype.fromRotationMatrix = function(matrix) {
                Quaternion.FromRotationMatrixToRef(matrix, this);
                return this;
            };
            Quaternion.FromRotationMatrix = function(matrix) {
                var result = new Quaternion;
                Quaternion.FromRotationMatrixToRef(matrix, result);
                return result;
            };
            Quaternion.FromRotationMatrixToRef = function(matrix, result) {
                var data = matrix.m;
                var m11 = data[0], m12 = data[4], m13 = data[8];
                var m21 = data[1], m22 = data[5], m23 = data[9];
                var m31 = data[2], m32 = data[6], m33 = data[10];
                var trace = m11 + m22 + m33;
                var s;
                if (trace > 0) {
                    s = .5 / Math.sqrt(trace + 1);
                    result.w = .25 / s;
                    result.x = (m32 - m23) * s;
                    result.y = (m13 - m31) * s;
                    result.z = (m21 - m12) * s;
                } else if (m11 > m22 && m11 > m33) {
                    s = 2 * Math.sqrt(1 + m11 - m22 - m33);
                    result.w = (m32 - m23) / s;
                    result.x = .25 * s;
                    result.y = (m12 + m21) / s;
                    result.z = (m13 + m31) / s;
                } else if (m22 > m33) {
                    s = 2 * Math.sqrt(1 + m22 - m11 - m33);
                    result.w = (m13 - m31) / s;
                    result.x = (m12 + m21) / s;
                    result.y = .25 * s;
                    result.z = (m23 + m32) / s;
                } else {
                    s = 2 * Math.sqrt(1 + m33 - m11 - m22);
                    result.w = (m21 - m12) / s;
                    result.x = (m13 + m31) / s;
                    result.y = (m23 + m32) / s;
                    result.z = .25 * s;
                }
            };
            Quaternion.Dot = function(left, right) {
                return left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
            };
            Quaternion.AreClose = function(quat0, quat1) {
                var dot = Quaternion.Dot(quat0, quat1);
                return dot >= 0;
            };
            Quaternion.Zero = function() {
                return new Quaternion(0, 0, 0, 0);
            };
            Quaternion.Inverse = function(q) {
                return new Quaternion(-q.x, -q.y, -q.z, q.w);
            };
            Quaternion.InverseToRef = function(q, result) {
                result.set(-q.x, -q.y, -q.z, q.w);
                return result;
            };
            Quaternion.Identity = function() {
                return new Quaternion(0, 0, 0, 1);
            };
            Quaternion.IsIdentity = function(quaternion) {
                return quaternion && quaternion.x === 0 && quaternion.y === 0 && quaternion.z === 0 && quaternion.w === 1;
            };
            Quaternion.RotationAxis = function(axis, angle) {
                return Quaternion.RotationAxisToRef(axis, angle, new Quaternion);
            };
            Quaternion.RotationAxisToRef = function(axis, angle, result) {
                var sin = Math.sin(angle / 2);
                axis.normalize();
                result.w = Math.cos(angle / 2);
                result.x = axis.x * sin;
                result.y = axis.y * sin;
                result.z = axis.z * sin;
                return result;
            };
            Quaternion.FromArray = function(array, offset) {
                if (!offset) {
                    offset = 0;
                }
                return new Quaternion(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
            };
            Quaternion.FromEulerAngles = function(x, y, z) {
                var q = new Quaternion;
                Quaternion.RotationYawPitchRollToRef(y, x, z, q);
                return q;
            };
            Quaternion.FromEulerAnglesToRef = function(x, y, z, result) {
                Quaternion.RotationYawPitchRollToRef(y, x, z, result);
                return result;
            };
            Quaternion.FromEulerVector = function(vec) {
                var q = new Quaternion;
                Quaternion.RotationYawPitchRollToRef(vec.y, vec.x, vec.z, q);
                return q;
            };
            Quaternion.FromEulerVectorToRef = function(vec, result) {
                Quaternion.RotationYawPitchRollToRef(vec.y, vec.x, vec.z, result);
                return result;
            };
            Quaternion.RotationYawPitchRoll = function(yaw, pitch, roll) {
                var q = new Quaternion;
                Quaternion.RotationYawPitchRollToRef(yaw, pitch, roll, q);
                return q;
            };
            Quaternion.RotationYawPitchRollToRef = function(yaw, pitch, roll, result) {
                var halfRoll = roll * .5;
                var halfPitch = pitch * .5;
                var halfYaw = yaw * .5;
                var sinRoll = Math.sin(halfRoll);
                var cosRoll = Math.cos(halfRoll);
                var sinPitch = Math.sin(halfPitch);
                var cosPitch = Math.cos(halfPitch);
                var sinYaw = Math.sin(halfYaw);
                var cosYaw = Math.cos(halfYaw);
                result.x = cosYaw * sinPitch * cosRoll + sinYaw * cosPitch * sinRoll;
                result.y = sinYaw * cosPitch * cosRoll - cosYaw * sinPitch * sinRoll;
                result.z = cosYaw * cosPitch * sinRoll - sinYaw * sinPitch * cosRoll;
                result.w = cosYaw * cosPitch * cosRoll + sinYaw * sinPitch * sinRoll;
            };
            Quaternion.RotationAlphaBetaGamma = function(alpha, beta, gamma) {
                var result = new Quaternion;
                Quaternion.RotationAlphaBetaGammaToRef(alpha, beta, gamma, result);
                return result;
            };
            Quaternion.RotationAlphaBetaGammaToRef = function(alpha, beta, gamma, result) {
                var halfGammaPlusAlpha = (gamma + alpha) * .5;
                var halfGammaMinusAlpha = (gamma - alpha) * .5;
                var halfBeta = beta * .5;
                result.x = Math.cos(halfGammaMinusAlpha) * Math.sin(halfBeta);
                result.y = Math.sin(halfGammaMinusAlpha) * Math.sin(halfBeta);
                result.z = Math.sin(halfGammaPlusAlpha) * Math.cos(halfBeta);
                result.w = Math.cos(halfGammaPlusAlpha) * Math.cos(halfBeta);
            };
            Quaternion.RotationQuaternionFromAxis = function(axis1, axis2, axis3) {
                var quat = new Quaternion(0, 0, 0, 0);
                Quaternion.RotationQuaternionFromAxisToRef(axis1, axis2, axis3, quat);
                return quat;
            };
            Quaternion.RotationQuaternionFromAxisToRef = function(axis1, axis2, axis3, ref) {
                var rotMat = MathTmp.Matrix[0];
                Matrix.FromXYZAxesToRef(axis1.normalize(), axis2.normalize(), axis3.normalize(), rotMat);
                Quaternion.FromRotationMatrixToRef(rotMat, ref);
            };
            Quaternion.Slerp = function(left, right, amount) {
                var result = Quaternion.Identity();
                Quaternion.SlerpToRef(left, right, amount, result);
                return result;
            };
            Quaternion.SlerpToRef = function(left, right, amount, result) {
                var num2;
                var num3;
                var num4 = left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
                var flag = false;
                if (num4 < 0) {
                    flag = true;
                    num4 = -num4;
                }
                if (num4 > .999999) {
                    num3 = 1 - amount;
                    num2 = flag ? -amount : amount;
                } else {
                    var num5 = Math.acos(num4);
                    var num6 = 1 / Math.sin(num5);
                    num3 = Math.sin((1 - amount) * num5) * num6;
                    num2 = flag ? -Math.sin(amount * num5) * num6 : Math.sin(amount * num5) * num6;
                }
                result.x = num3 * left.x + num2 * right.x;
                result.y = num3 * left.y + num2 * right.y;
                result.z = num3 * left.z + num2 * right.z;
                result.w = num3 * left.w + num2 * right.w;
            };
            Quaternion.Hermite = function(value1, tangent1, value2, tangent2, amount) {
                var squared = amount * amount;
                var cubed = amount * squared;
                var part1 = 2 * cubed - 3 * squared + 1;
                var part2 = -2 * cubed + 3 * squared;
                var part3 = cubed - 2 * squared + amount;
                var part4 = cubed - squared;
                var x = value1.x * part1 + value2.x * part2 + tangent1.x * part3 + tangent2.x * part4;
                var y = value1.y * part1 + value2.y * part2 + tangent1.y * part3 + tangent2.y * part4;
                var z = value1.z * part1 + value2.z * part2 + tangent1.z * part3 + tangent2.z * part4;
                var w = value1.w * part1 + value2.w * part2 + tangent1.w * part3 + tangent2.w * part4;
                return new Quaternion(x, y, z, w);
            };
            return Quaternion;
        }();
        exports.Quaternion = Quaternion;
        var Matrix = function() {
            function Matrix() {
                this._isIdentity = false;
                this._isIdentityDirty = true;
                this._isIdentity3x2 = true;
                this._isIdentity3x2Dirty = true;
                this.updateFlag = -1;
                this._m = new Float32Array(16);
                this._updateIdentityStatus(false);
            }
            Object.defineProperty(Matrix.prototype, "m", {
                get: function() {
                    return this._m;
                },
                enumerable: true,
                configurable: true
            });
            Matrix.prototype._markAsUpdated = function() {
                this.updateFlag = Matrix._updateFlagSeed++;
                this._isIdentity = false;
                this._isIdentity3x2 = false;
                this._isIdentityDirty = true;
                this._isIdentity3x2Dirty = true;
            };
            Matrix.prototype._updateIdentityStatus = function(isIdentity, isIdentityDirty, isIdentity3x2, isIdentity3x2Dirty) {
                if (isIdentityDirty === void 0) {
                    isIdentityDirty = false;
                }
                if (isIdentity3x2 === void 0) {
                    isIdentity3x2 = false;
                }
                if (isIdentity3x2Dirty === void 0) {
                    isIdentity3x2Dirty = true;
                }
                this.updateFlag = Matrix._updateFlagSeed++;
                this._isIdentity = isIdentity;
                this._isIdentity3x2 = isIdentity || isIdentity3x2;
                this._isIdentityDirty = this._isIdentity ? false : isIdentityDirty;
                this._isIdentity3x2Dirty = this._isIdentity3x2 ? false : isIdentity3x2Dirty;
            };
            Matrix.prototype.isIdentity = function() {
                if (this._isIdentityDirty) {
                    this._isIdentityDirty = false;
                    var m = this._m;
                    this._isIdentity = m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 0 && m[4] === 0 && m[5] === 1 && m[6] === 0 && m[7] === 0 && m[8] === 0 && m[9] === 0 && m[10] === 1 && m[11] === 0 && m[12] === 0 && m[13] === 0 && m[14] === 0 && m[15] === 1;
                }
                return this._isIdentity;
            };
            Matrix.prototype.isIdentityAs3x2 = function() {
                if (this._isIdentity3x2Dirty) {
                    this._isIdentity3x2Dirty = false;
                    if (this._m[0] !== 1 || this._m[5] !== 1 || this._m[15] !== 1) {
                        this._isIdentity3x2 = false;
                    } else if (this._m[1] !== 0 || this._m[2] !== 0 || this._m[3] !== 0 || this._m[4] !== 0 || this._m[6] !== 0 || this._m[7] !== 0 || this._m[8] !== 0 || this._m[9] !== 0 || this._m[10] !== 0 || this._m[11] !== 0 || this._m[12] !== 0 || this._m[13] !== 0 || this._m[14] !== 0) {
                        this._isIdentity3x2 = false;
                    } else {
                        this._isIdentity3x2 = true;
                    }
                }
                return this._isIdentity3x2;
            };
            Matrix.prototype.determinant = function() {
                if (this._isIdentity === true) {
                    return 1;
                }
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
                return m00 * cofact_00 + m01 * cofact_01 + m02 * cofact_02 + m03 * cofact_03;
            };
            Matrix.prototype.toArray = function() {
                return this._m;
            };
            Matrix.prototype.asArray = function() {
                return this._m;
            };
            Matrix.prototype.invert = function() {
                this.invertToRef(this);
                return this;
            };
            Matrix.prototype.reset = function() {
                Matrix.FromValuesToRef(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, this);
                this._updateIdentityStatus(false);
                return this;
            };
            Matrix.prototype.add = function(other) {
                var result = new Matrix;
                this.addToRef(other, result);
                return result;
            };
            Matrix.prototype.addToRef = function(other, result) {
                var m = this._m;
                var resultM = result._m;
                var otherM = other.m;
                for (var index = 0; index < 16; index++) {
                    resultM[index] = m[index] + otherM[index];
                }
                result._markAsUpdated();
                return this;
            };
            Matrix.prototype.addToSelf = function(other) {
                var m = this._m;
                var otherM = other.m;
                for (var index = 0; index < 16; index++) {
                    m[index] += otherM[index];
                }
                this._markAsUpdated();
                return this;
            };
            Matrix.prototype.invertToRef = function(other) {
                if (this._isIdentity === true) {
                    Matrix.IdentityToRef(other);
                    return this;
                }
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
            Matrix.prototype.addAtIndex = function(index, value) {
                this._m[index] += value;
                this._markAsUpdated();
                return this;
            };
            Matrix.prototype.multiplyAtIndex = function(index, value) {
                this._m[index] *= value;
                this._markAsUpdated();
                return this;
            };
            Matrix.prototype.setTranslationFromFloats = function(x, y, z) {
                this._m[12] = x;
                this._m[13] = y;
                this._m[14] = z;
                this._markAsUpdated();
                return this;
            };
            Matrix.prototype.addTranslationFromFloats = function(x, y, z) {
                this._m[12] += x;
                this._m[13] += y;
                this._m[14] += z;
                this._markAsUpdated();
                return this;
            };
            Matrix.prototype.setTranslation = function(vector3) {
                return this.setTranslationFromFloats(vector3.x, vector3.y, vector3.z);
            };
            Matrix.prototype.getTranslation = function() {
                return new Vector3(this._m[12], this._m[13], this._m[14]);
            };
            Matrix.prototype.getTranslationToRef = function(result) {
                result.x = this._m[12];
                result.y = this._m[13];
                result.z = this._m[14];
                return this;
            };
            Matrix.prototype.removeRotationAndScaling = function() {
                var m = this.m;
                Matrix.FromValuesToRef(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, m[12], m[13], m[14], m[15], this);
                this._updateIdentityStatus(m[12] === 0 && m[13] === 0 && m[14] === 0 && m[15] === 1);
                return this;
            };
            Matrix.prototype.multiply = function(other) {
                var result = new Matrix;
                this.multiplyToRef(other, result);
                return result;
            };
            Matrix.prototype.copyFrom = function(other) {
                other.copyToArray(this._m);
                var o = other;
                this._updateIdentityStatus(o._isIdentity, o._isIdentityDirty, o._isIdentity3x2, o._isIdentity3x2Dirty);
                return this;
            };
            Matrix.prototype.copyToArray = function(array, offset) {
                if (offset === void 0) {
                    offset = 0;
                }
                for (var index = 0; index < 16; index++) {
                    array[offset + index] = this._m[index];
                }
                return this;
            };
            Matrix.prototype.multiplyToRef = function(other, result) {
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
            Matrix.prototype.multiplyToArray = function(other, result, offset) {
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
            Matrix.prototype.equals = function(value) {
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
                return m[0] === om[0] && m[1] === om[1] && m[2] === om[2] && m[3] === om[3] && m[4] === om[4] && m[5] === om[5] && m[6] === om[6] && m[7] === om[7] && m[8] === om[8] && m[9] === om[9] && m[10] === om[10] && m[11] === om[11] && m[12] === om[12] && m[13] === om[13] && m[14] === om[14] && m[15] === om[15];
            };
            Matrix.prototype.clone = function() {
                var matrix = new Matrix;
                matrix.copyFrom(this);
                return matrix;
            };
            Matrix.prototype.getClassName = function() {
                return "Matrix";
            };
            Matrix.prototype.getHashCode = function() {
                var hash = this._m[0] || 0;
                for (var i = 1; i < 16; i++) {
                    hash = hash * 397 ^ (this._m[i] || 0);
                }
                return hash;
            };
            Matrix.prototype.decompose = function(scale, rotation, translation) {
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
                        rotation.copyFromFloats(0, 0, 0, 1);
                    }
                    return false;
                }
                if (rotation) {
                    var sx = 1 / scale.x, sy = 1 / scale.y, sz = 1 / scale.z;
                    Matrix.FromValuesToRef(m[0] * sx, m[1] * sx, m[2] * sx, 0, m[4] * sy, m[5] * sy, m[6] * sy, 0, m[8] * sz, m[9] * sz, m[10] * sz, 0, 0, 0, 0, 1, MathTmp.Matrix[0]);
                    Quaternion.FromRotationMatrixToRef(MathTmp.Matrix[0], rotation);
                }
                return true;
            };
            Matrix.prototype.getRow = function(index) {
                if (index < 0 || index > 3) {
                    return null;
                }
                var i = index * 4;
                return new Vector4(this._m[i + 0], this._m[i + 1], this._m[i + 2], this._m[i + 3]);
            };
            Matrix.prototype.setRow = function(index, row) {
                return this.setRowFromFloats(index, row.x, row.y, row.z, row.w);
            };
            Matrix.prototype.transpose = function() {
                return Matrix.Transpose(this);
            };
            Matrix.prototype.transposeToRef = function(result) {
                Matrix.TransposeToRef(this, result);
                return this;
            };
            Matrix.prototype.setRowFromFloats = function(index, x, y, z, w) {
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
            Matrix.prototype.scale = function(scale) {
                var result = new Matrix;
                this.scaleToRef(scale, result);
                return result;
            };
            Matrix.prototype.scaleToRef = function(scale, result) {
                for (var index = 0; index < 16; index++) {
                    result._m[index] = this._m[index] * scale;
                }
                result._markAsUpdated();
                return this;
            };
            Matrix.prototype.scaleAndAddToRef = function(scale, result) {
                for (var index = 0; index < 16; index++) {
                    result._m[index] += this._m[index] * scale;
                }
                result._markAsUpdated();
                return this;
            };
            Matrix.prototype.toNormalMatrix = function(ref) {
                var tmp = MathTmp.Matrix[0];
                this.invertToRef(tmp);
                tmp.transposeToRef(ref);
                var m = ref._m;
                Matrix.FromValuesToRef(m[0], m[1], m[2], 0, m[4], m[5], m[6], 0, m[8], m[9], m[10], 0, 0, 0, 0, 1, ref);
            };
            Matrix.prototype.getRotationMatrix = function() {
                var result = new Matrix;
                this.getRotationMatrixToRef(result);
                return result;
            };
            Matrix.prototype.getRotationMatrixToRef = function(result) {
                var scale = MathTmp.Vector3[0];
                if (!this.decompose(scale)) {
                    Matrix.IdentityToRef(result);
                    return this;
                }
                var m = this._m;
                var sx = 1 / scale.x, sy = 1 / scale.y, sz = 1 / scale.z;
                Matrix.FromValuesToRef(m[0] * sx, m[1] * sx, m[2] * sx, 0, m[4] * sy, m[5] * sy, m[6] * sy, 0, m[8] * sz, m[9] * sz, m[10] * sz, 0, 0, 0, 0, 1, result);
                return this;
            };
            Matrix.prototype.toggleModelMatrixHandInPlace = function() {
                var m = this._m;
                m[2] *= -1;
                m[6] *= -1;
                m[8] *= -1;
                m[9] *= -1;
                m[14] *= -1;
                this._markAsUpdated();
            };
            Matrix.prototype.toggleProjectionMatrixHandInPlace = function() {
                var m = this._m;
                m[8] *= -1;
                m[9] *= -1;
                m[10] *= -1;
                m[11] *= -1;
                this._markAsUpdated();
            };
            Matrix.FromArray = function(array, offset) {
                if (offset === void 0) {
                    offset = 0;
                }
                var result = new Matrix;
                Matrix.FromArrayToRef(array, offset, result);
                return result;
            };
            Matrix.FromArrayToRef = function(array, offset, result) {
                for (var index = 0; index < 16; index++) {
                    result._m[index] = array[index + offset];
                }
                result._markAsUpdated();
            };
            Matrix.FromFloat32ArrayToRefScaled = function(array, offset, scale, result) {
                for (var index = 0; index < 16; index++) {
                    result._m[index] = array[index + offset] * scale;
                }
                result._markAsUpdated();
            };
            Object.defineProperty(Matrix, "IdentityReadOnly", {
                get: function() {
                    return Matrix._identityReadOnly;
                },
                enumerable: true,
                configurable: true
            });
            Matrix.FromValuesToRef = function(initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44, result) {
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
            Matrix.FromValues = function(initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44) {
                var result = new Matrix;
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
            Matrix.Compose = function(scale, rotation, translation) {
                var result = new Matrix;
                Matrix.ComposeToRef(scale, rotation, translation, result);
                return result;
            };
            Matrix.ComposeToRef = function(scale, rotation, translation, result) {
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
            Matrix.Identity = function() {
                var identity = Matrix.FromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
                identity._updateIdentityStatus(true);
                return identity;
            };
            Matrix.IdentityToRef = function(result) {
                Matrix.FromValuesToRef(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, result);
                result._updateIdentityStatus(true);
            };
            Matrix.Zero = function() {
                var zero = Matrix.FromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                zero._updateIdentityStatus(false);
                return zero;
            };
            Matrix.RotationX = function(angle) {
                var result = new Matrix;
                Matrix.RotationXToRef(angle, result);
                return result;
            };
            Matrix.Invert = function(source) {
                var result = new Matrix;
                source.invertToRef(result);
                return result;
            };
            Matrix.RotationXToRef = function(angle, result) {
                var s = Math.sin(angle);
                var c = Math.cos(angle);
                Matrix.FromValuesToRef(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, result);
                result._updateIdentityStatus(c === 1 && s === 0);
            };
            Matrix.RotationY = function(angle) {
                var result = new Matrix;
                Matrix.RotationYToRef(angle, result);
                return result;
            };
            Matrix.RotationYToRef = function(angle, result) {
                var s = Math.sin(angle);
                var c = Math.cos(angle);
                Matrix.FromValuesToRef(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1, result);
                result._updateIdentityStatus(c === 1 && s === 0);
            };
            Matrix.RotationZ = function(angle) {
                var result = new Matrix;
                Matrix.RotationZToRef(angle, result);
                return result;
            };
            Matrix.RotationZToRef = function(angle, result) {
                var s = Math.sin(angle);
                var c = Math.cos(angle);
                Matrix.FromValuesToRef(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, result);
                result._updateIdentityStatus(c === 1 && s === 0);
            };
            Matrix.RotationAxis = function(axis, angle) {
                var result = new Matrix;
                Matrix.RotationAxisToRef(axis, angle, result);
                return result;
            };
            Matrix.RotationAxisToRef = function(axis, angle, result) {
                var s = Math.sin(-angle);
                var c = Math.cos(-angle);
                var c1 = 1 - c;
                axis.normalize();
                var m = result._m;
                m[0] = axis.x * axis.x * c1 + c;
                m[1] = axis.x * axis.y * c1 - axis.z * s;
                m[2] = axis.x * axis.z * c1 + axis.y * s;
                m[3] = 0;
                m[4] = axis.y * axis.x * c1 + axis.z * s;
                m[5] = axis.y * axis.y * c1 + c;
                m[6] = axis.y * axis.z * c1 - axis.x * s;
                m[7] = 0;
                m[8] = axis.z * axis.x * c1 - axis.y * s;
                m[9] = axis.z * axis.y * c1 + axis.x * s;
                m[10] = axis.z * axis.z * c1 + c;
                m[11] = 0;
                m[12] = 0;
                m[13] = 0;
                m[14] = 0;
                m[15] = 1;
                result._markAsUpdated();
            };
            Matrix.RotationAlignToRef = function(from, to, result) {
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
            Matrix.RotationYawPitchRoll = function(yaw, pitch, roll) {
                var result = new Matrix;
                Matrix.RotationYawPitchRollToRef(yaw, pitch, roll, result);
                return result;
            };
            Matrix.RotationYawPitchRollToRef = function(yaw, pitch, roll, result) {
                Quaternion.RotationYawPitchRollToRef(yaw, pitch, roll, MathTmp.Quaternion[0]);
                MathTmp.Quaternion[0].toRotationMatrix(result);
            };
            Matrix.Scaling = function(x, y, z) {
                var result = new Matrix;
                Matrix.ScalingToRef(x, y, z, result);
                return result;
            };
            Matrix.ScalingToRef = function(x, y, z, result) {
                Matrix.FromValuesToRef(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1, result);
                result._updateIdentityStatus(x === 1 && y === 1 && z === 1);
            };
            Matrix.Translation = function(x, y, z) {
                var result = new Matrix;
                Matrix.TranslationToRef(x, y, z, result);
                return result;
            };
            Matrix.TranslationToRef = function(x, y, z, result) {
                Matrix.FromValuesToRef(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1, result);
                result._updateIdentityStatus(x === 0 && y === 0 && z === 0);
            };
            Matrix.Lerp = function(startValue, endValue, gradient) {
                var result = new Matrix;
                Matrix.LerpToRef(startValue, endValue, gradient, result);
                return result;
            };
            Matrix.LerpToRef = function(startValue, endValue, gradient, result) {
                var resultM = result._m;
                var startM = startValue.m;
                var endM = endValue.m;
                for (var index = 0; index < 16; index++) {
                    resultM[index] = startM[index] * (1 - gradient) + endM[index] * gradient;
                }
                result._markAsUpdated();
            };
            Matrix.DecomposeLerp = function(startValue, endValue, gradient) {
                var result = new Matrix;
                Matrix.DecomposeLerpToRef(startValue, endValue, gradient, result);
                return result;
            };
            Matrix.DecomposeLerpToRef = function(startValue, endValue, gradient, result) {
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
            Matrix.LookAtLH = function(eye, target, up) {
                var result = new Matrix;
                Matrix.LookAtLHToRef(eye, target, up, result);
                return result;
            };
            Matrix.LookAtLHToRef = function(eye, target, up, result) {
                var xAxis = MathTmp.Vector3[0];
                var yAxis = MathTmp.Vector3[1];
                var zAxis = MathTmp.Vector3[2];
                target.subtractToRef(eye, zAxis);
                zAxis.normalize();
                Vector3.CrossToRef(up, zAxis, xAxis);
                var xSquareLength = xAxis.lengthSquared();
                if (xSquareLength === 0) {
                    xAxis.x = 1;
                } else {
                    xAxis.normalizeFromLength(Math.sqrt(xSquareLength));
                }
                Vector3.CrossToRef(zAxis, xAxis, yAxis);
                yAxis.normalize();
                var ex = -Vector3.Dot(xAxis, eye);
                var ey = -Vector3.Dot(yAxis, eye);
                var ez = -Vector3.Dot(zAxis, eye);
                Matrix.FromValuesToRef(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, ex, ey, ez, 1, result);
            };
            Matrix.LookAtRH = function(eye, target, up) {
                var result = new Matrix;
                Matrix.LookAtRHToRef(eye, target, up, result);
                return result;
            };
            Matrix.LookAtRHToRef = function(eye, target, up, result) {
                var xAxis = MathTmp.Vector3[0];
                var yAxis = MathTmp.Vector3[1];
                var zAxis = MathTmp.Vector3[2];
                eye.subtractToRef(target, zAxis);
                zAxis.normalize();
                Vector3.CrossToRef(up, zAxis, xAxis);
                var xSquareLength = xAxis.lengthSquared();
                if (xSquareLength === 0) {
                    xAxis.x = 1;
                } else {
                    xAxis.normalizeFromLength(Math.sqrt(xSquareLength));
                }
                Vector3.CrossToRef(zAxis, xAxis, yAxis);
                yAxis.normalize();
                var ex = -Vector3.Dot(xAxis, eye);
                var ey = -Vector3.Dot(yAxis, eye);
                var ez = -Vector3.Dot(zAxis, eye);
                Matrix.FromValuesToRef(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, ex, ey, ez, 1, result);
            };
            Matrix.OrthoLH = function(width, height, znear, zfar) {
                var matrix = new Matrix;
                Matrix.OrthoLHToRef(width, height, znear, zfar, matrix);
                return matrix;
            };
            Matrix.OrthoLHToRef = function(width, height, znear, zfar, result) {
                var n = znear;
                var f = zfar;
                var a = 2 / width;
                var b = 2 / height;
                var c = 2 / (f - n);
                var d = -(f + n) / (f - n);
                Matrix.FromValuesToRef(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 0, 0, 0, d, 1, result);
                result._updateIdentityStatus(a === 1 && b === 1 && c === 1 && d === 0);
            };
            Matrix.OrthoOffCenterLH = function(left, right, bottom, top, znear, zfar) {
                var matrix = new Matrix;
                Matrix.OrthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, matrix);
                return matrix;
            };
            Matrix.OrthoOffCenterLHToRef = function(left, right, bottom, top, znear, zfar, result) {
                var n = znear;
                var f = zfar;
                var a = 2 / (right - left);
                var b = 2 / (top - bottom);
                var c = 2 / (f - n);
                var d = -(f + n) / (f - n);
                var i0 = (left + right) / (left - right);
                var i1 = (top + bottom) / (bottom - top);
                Matrix.FromValuesToRef(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 0, i0, i1, d, 1, result);
                result._markAsUpdated();
            };
            Matrix.OrthoOffCenterRH = function(left, right, bottom, top, znear, zfar) {
                var matrix = new Matrix;
                Matrix.OrthoOffCenterRHToRef(left, right, bottom, top, znear, zfar, matrix);
                return matrix;
            };
            Matrix.OrthoOffCenterRHToRef = function(left, right, bottom, top, znear, zfar, result) {
                Matrix.OrthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, result);
                result._m[10] *= -1;
            };
            Matrix.PerspectiveLH = function(width, height, znear, zfar) {
                var matrix = new Matrix;
                var n = znear;
                var f = zfar;
                var a = 2 * n / width;
                var b = 2 * n / height;
                var c = (f + n) / (f - n);
                var d = -2 * f * n / (f - n);
                Matrix.FromValuesToRef(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 1, 0, 0, d, 0, matrix);
                matrix._updateIdentityStatus(false);
                return matrix;
            };
            Matrix.PerspectiveFovLH = function(fov, aspect, znear, zfar) {
                var matrix = new Matrix;
                Matrix.PerspectiveFovLHToRef(fov, aspect, znear, zfar, matrix);
                return matrix;
            };
            Matrix.PerspectiveFovLHToRef = function(fov, aspect, znear, zfar, result, isVerticalFovFixed) {
                if (isVerticalFovFixed === void 0) {
                    isVerticalFovFixed = true;
                }
                var n = znear;
                var f = zfar;
                var t = 1 / Math.tan(fov * .5);
                var a = isVerticalFovFixed ? t / aspect : t;
                var b = isVerticalFovFixed ? t : t * aspect;
                var c = (f + n) / (f - n);
                var d = -2 * f * n / (f - n);
                Matrix.FromValuesToRef(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 1, 0, 0, d, 0, result);
                result._updateIdentityStatus(false);
            };
            Matrix.PerspectiveFovRH = function(fov, aspect, znear, zfar) {
                var matrix = new Matrix;
                Matrix.PerspectiveFovRHToRef(fov, aspect, znear, zfar, matrix);
                return matrix;
            };
            Matrix.PerspectiveFovRHToRef = function(fov, aspect, znear, zfar, result, isVerticalFovFixed) {
                if (isVerticalFovFixed === void 0) {
                    isVerticalFovFixed = true;
                }
                var n = znear;
                var f = zfar;
                var t = 1 / Math.tan(fov * .5);
                var a = isVerticalFovFixed ? t / aspect : t;
                var b = isVerticalFovFixed ? t : t * aspect;
                var c = -(f + n) / (f - n);
                var d = -2 * f * n / (f - n);
                Matrix.FromValuesToRef(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, -1, 0, 0, d, 0, result);
                result._updateIdentityStatus(false);
            };
            Matrix.PerspectiveFovWebVRToRef = function(fov, znear, zfar, result, rightHanded) {
                if (rightHanded === void 0) {
                    rightHanded = false;
                }
                var rightHandedFactor = rightHanded ? -1 : 1;
                var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
                var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
                var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
                var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
                var xScale = 2 / (leftTan + rightTan);
                var yScale = 2 / (upTan + downTan);
                var m = result._m;
                m[0] = xScale;
                m[1] = m[2] = m[3] = m[4] = 0;
                m[5] = yScale;
                m[6] = m[7] = 0;
                m[8] = (leftTan - rightTan) * xScale * .5;
                m[9] = -((upTan - downTan) * yScale * .5);
                m[10] = -zfar / (znear - zfar);
                m[11] = 1 * rightHandedFactor;
                m[12] = m[13] = m[15] = 0;
                m[14] = -(2 * zfar * znear) / (zfar - znear);
                result._markAsUpdated();
            };
            Matrix.GetFinalMatrix = function(viewport, world, view, projection, zmin, zmax) {
                var cw = viewport.width;
                var ch = viewport.height;
                var cx = viewport.x;
                var cy = viewport.y;
                var viewportMatrix = Matrix.FromValues(cw / 2, 0, 0, 0, 0, -ch / 2, 0, 0, 0, 0, zmax - zmin, 0, cx + cw / 2, ch / 2 + cy, zmin, 1);
                var matrix = MathTmp.Matrix[0];
                world.multiplyToRef(view, matrix);
                matrix.multiplyToRef(projection, matrix);
                return matrix.multiply(viewportMatrix);
            };
            Matrix.GetAsMatrix2x2 = function(matrix) {
                var m = matrix.m;
                return new Float32Array([ m[0], m[1], m[4], m[5] ]);
            };
            Matrix.GetAsMatrix3x3 = function(matrix) {
                var m = matrix.m;
                return new Float32Array([ m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10] ]);
            };
            Matrix.Transpose = function(matrix) {
                var result = new Matrix;
                Matrix.TransposeToRef(matrix, result);
                return result;
            };
            Matrix.TransposeToRef = function(matrix, result) {
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
                result._updateIdentityStatus(matrix._isIdentity, matrix._isIdentityDirty);
            };
            Matrix.Reflection = function(plane) {
                var matrix = new Matrix;
                Matrix.ReflectionToRef(plane, matrix);
                return matrix;
            };
            Matrix.ReflectionToRef = function(plane, result) {
                plane.normalize();
                var x = plane.normal.x;
                var y = plane.normal.y;
                var z = plane.normal.z;
                var temp = -2 * x;
                var temp2 = -2 * y;
                var temp3 = -2 * z;
                Matrix.FromValuesToRef(temp * x + 1, temp2 * x, temp3 * x, 0, temp * y, temp2 * y + 1, temp3 * y, 0, temp * z, temp2 * z, temp3 * z + 1, 0, temp * plane.d, temp2 * plane.d, temp3 * plane.d, 1, result);
            };
            Matrix.FromXYZAxesToRef = function(xaxis, yaxis, zaxis, result) {
                Matrix.FromValuesToRef(xaxis.x, xaxis.y, xaxis.z, 0, yaxis.x, yaxis.y, yaxis.z, 0, zaxis.x, zaxis.y, zaxis.z, 0, 0, 0, 0, 1, result);
            };
            Matrix.FromQuaternionToRef = function(quat, result) {
                var xx = quat.x * quat.x;
                var yy = quat.y * quat.y;
                var zz = quat.z * quat.z;
                var xy = quat.x * quat.y;
                var zw = quat.z * quat.w;
                var zx = quat.z * quat.x;
                var yw = quat.y * quat.w;
                var yz = quat.y * quat.z;
                var xw = quat.x * quat.w;
                result._m[0] = 1 - 2 * (yy + zz);
                result._m[1] = 2 * (xy + zw);
                result._m[2] = 2 * (zx - yw);
                result._m[3] = 0;
                result._m[4] = 2 * (xy - zw);
                result._m[5] = 1 - 2 * (zz + xx);
                result._m[6] = 2 * (yz + xw);
                result._m[7] = 0;
                result._m[8] = 2 * (zx + yw);
                result._m[9] = 2 * (yz - xw);
                result._m[10] = 1 - 2 * (yy + xx);
                result._m[11] = 0;
                result._m[12] = 0;
                result._m[13] = 0;
                result._m[14] = 0;
                result._m[15] = 1;
                result._markAsUpdated();
            };
            Matrix._updateFlagSeed = 0;
            Matrix._identityReadOnly = Matrix.Identity();
            return Matrix;
        }();
        exports.Matrix = Matrix;
        var Plane = function() {
            function Plane(a, b, c, d) {
                this.normal = new Vector3(a, b, c);
                this.d = d;
            }
            Plane.prototype.asArray = function() {
                return [ this.normal.x, this.normal.y, this.normal.z, this.d ];
            };
            Plane.prototype.clone = function() {
                return new Plane(this.normal.x, this.normal.y, this.normal.z, this.d);
            };
            Plane.prototype.getClassName = function() {
                return "Plane";
            };
            Plane.prototype.getHashCode = function() {
                var hash = this.normal.getHashCode();
                hash = hash * 397 ^ (this.d || 0);
                return hash;
            };
            Plane.prototype.normalize = function() {
                var norm = Math.sqrt(this.normal.x * this.normal.x + this.normal.y * this.normal.y + this.normal.z * this.normal.z);
                var magnitude = 0;
                if (norm !== 0) {
                    magnitude = 1 / norm;
                }
                this.normal.x *= magnitude;
                this.normal.y *= magnitude;
                this.normal.z *= magnitude;
                this.d *= magnitude;
                return this;
            };
            Plane.prototype.transform = function(transformation) {
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
            Plane.prototype.dotCoordinate = function(point) {
                return this.normal.x * point.x + this.normal.y * point.y + this.normal.z * point.z + this.d;
            };
            Plane.prototype.copyFromPoints = function(point1, point2, point3) {
                var x1 = point2.x - point1.x;
                var y1 = point2.y - point1.y;
                var z1 = point2.z - point1.z;
                var x2 = point3.x - point1.x;
                var y2 = point3.y - point1.y;
                var z2 = point3.z - point1.z;
                var yz = y1 * z2 - z1 * y2;
                var xz = z1 * x2 - x1 * z2;
                var xy = x1 * y2 - y1 * x2;
                var pyth = Math.sqrt(yz * yz + xz * xz + xy * xy);
                var invPyth;
                if (pyth !== 0) {
                    invPyth = 1 / pyth;
                } else {
                    invPyth = 0;
                }
                this.normal.x = yz * invPyth;
                this.normal.y = xz * invPyth;
                this.normal.z = xy * invPyth;
                this.d = -(this.normal.x * point1.x + this.normal.y * point1.y + this.normal.z * point1.z);
                return this;
            };
            Plane.prototype.isFrontFacingTo = function(direction, epsilon) {
                var dot = Vector3.Dot(this.normal, direction);
                return dot <= epsilon;
            };
            Plane.prototype.signedDistanceTo = function(point) {
                return Vector3.Dot(point, this.normal) + this.d;
            };
            Plane.FromArray = function(array) {
                return new Plane(array[0], array[1], array[2], array[3]);
            };
            Plane.FromPoints = function(point1, point2, point3) {
                var result = new Plane(0, 0, 0, 0);
                result.copyFromPoints(point1, point2, point3);
                return result;
            };
            Plane.FromPositionAndNormal = function(origin, normal) {
                var result = new Plane(0, 0, 0, 0);
                normal.normalize();
                result.normal = normal;
                result.d = -(normal.x * origin.x + normal.y * origin.y + normal.z * origin.z);
                return result;
            };
            Plane.SignedDistanceToPlaneFromPositionAndNormal = function(origin, normal, point) {
                var d = -(normal.x * origin.x + normal.y * origin.y + normal.z * origin.z);
                return Vector3.Dot(point, normal) + d;
            };
            return Plane;
        }();
        exports.Plane = Plane;
        var Viewport = function() {
            function Viewport(x, y, width, height) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
            Viewport.prototype.toGlobal = function(renderWidth, renderHeight) {
                return new Viewport(this.x * renderWidth, this.y * renderHeight, this.width * renderWidth, this.height * renderHeight);
            };
            Viewport.prototype.toGlobalToRef = function(renderWidth, renderHeight, ref) {
                ref.x = this.x * renderWidth;
                ref.y = this.y * renderHeight;
                ref.width = this.width * renderWidth;
                ref.height = this.height * renderHeight;
                return this;
            };
            Viewport.prototype.clone = function() {
                return new Viewport(this.x, this.y, this.width, this.height);
            };
            return Viewport;
        }();
        exports.Viewport = Viewport;
        var Frustum = function() {
            function Frustum() {}
            Frustum.GetPlanes = function(transform) {
                var frustumPlanes = [];
                for (var index = 0; index < 6; index++) {
                    frustumPlanes.push(new Plane(0, 0, 0, 0));
                }
                Frustum.GetPlanesToRef(transform, frustumPlanes);
                return frustumPlanes;
            };
            Frustum.GetNearPlaneToRef = function(transform, frustumPlane) {
                var m = transform.m;
                frustumPlane.normal.x = m[3] + m[2];
                frustumPlane.normal.y = m[7] + m[6];
                frustumPlane.normal.z = m[11] + m[10];
                frustumPlane.d = m[15] + m[14];
                frustumPlane.normalize();
            };
            Frustum.GetFarPlaneToRef = function(transform, frustumPlane) {
                var m = transform.m;
                frustumPlane.normal.x = m[3] - m[2];
                frustumPlane.normal.y = m[7] - m[6];
                frustumPlane.normal.z = m[11] - m[10];
                frustumPlane.d = m[15] - m[14];
                frustumPlane.normalize();
            };
            Frustum.GetLeftPlaneToRef = function(transform, frustumPlane) {
                var m = transform.m;
                frustumPlane.normal.x = m[3] + m[0];
                frustumPlane.normal.y = m[7] + m[4];
                frustumPlane.normal.z = m[11] + m[8];
                frustumPlane.d = m[15] + m[12];
                frustumPlane.normalize();
            };
            Frustum.GetRightPlaneToRef = function(transform, frustumPlane) {
                var m = transform.m;
                frustumPlane.normal.x = m[3] - m[0];
                frustumPlane.normal.y = m[7] - m[4];
                frustumPlane.normal.z = m[11] - m[8];
                frustumPlane.d = m[15] - m[12];
                frustumPlane.normalize();
            };
            Frustum.GetTopPlaneToRef = function(transform, frustumPlane) {
                var m = transform.m;
                frustumPlane.normal.x = m[3] - m[1];
                frustumPlane.normal.y = m[7] - m[5];
                frustumPlane.normal.z = m[11] - m[9];
                frustumPlane.d = m[15] - m[13];
                frustumPlane.normalize();
            };
            Frustum.GetBottomPlaneToRef = function(transform, frustumPlane) {
                var m = transform.m;
                frustumPlane.normal.x = m[3] + m[1];
                frustumPlane.normal.y = m[7] + m[5];
                frustumPlane.normal.z = m[11] + m[9];
                frustumPlane.d = m[15] + m[13];
                frustumPlane.normalize();
            };
            Frustum.GetPlanesToRef = function(transform, frustumPlanes) {
                Frustum.GetNearPlaneToRef(transform, frustumPlanes[0]);
                Frustum.GetFarPlaneToRef(transform, frustumPlanes[1]);
                Frustum.GetLeftPlaneToRef(transform, frustumPlanes[2]);
                Frustum.GetRightPlaneToRef(transform, frustumPlanes[3]);
                Frustum.GetTopPlaneToRef(transform, frustumPlanes[4]);
                Frustum.GetBottomPlaneToRef(transform, frustumPlanes[5]);
            };
            return Frustum;
        }();
        exports.Frustum = Frustum;
        var Space;
        exports.Space = Space;
        (function(Space) {
            Space[Space["LOCAL"] = 0] = "LOCAL";
            Space[Space["WORLD"] = 1] = "WORLD";
            Space[Space["BONE"] = 2] = "BONE";
        })(Space || (exports.Space = Space = {}));
        var Axis = function() {
            function Axis() {}
            Axis.X = new Vector3(1, 0, 0);
            Axis.Y = new Vector3(0, 1, 0);
            Axis.Z = new Vector3(0, 0, 1);
            return Axis;
        }();
        exports.Axis = Axis;
        var BezierCurve = function() {
            function BezierCurve() {}
            BezierCurve.Interpolate = function(t, x1, y1, x2, y2) {
                var f0 = 1 - 3 * x2 + 3 * x1;
                var f1 = 3 * x2 - 6 * x1;
                var f2 = 3 * x1;
                var refinedT = t;
                for (var i = 0; i < 5; i++) {
                    var refinedT2 = refinedT * refinedT;
                    var refinedT3 = refinedT2 * refinedT;
                    var x = f0 * refinedT3 + f1 * refinedT2 + f2 * refinedT;
                    var slope = 1 / (3 * f0 * refinedT2 + 2 * f1 * refinedT + f2);
                    refinedT -= (x - t) * slope;
                    refinedT = Math.min(1, Math.max(0, refinedT));
                }
                return 3 * Math.pow(1 - refinedT, 2) * refinedT * y1 + 3 * (1 - refinedT) * Math.pow(refinedT, 2) * y2 + Math.pow(refinedT, 3);
            };
            return BezierCurve;
        }();
        exports.BezierCurve = BezierCurve;
        var Orientation;
        exports.Orientation = Orientation;
        (function(Orientation) {
            Orientation[Orientation["CW"] = 0] = "CW";
            Orientation[Orientation["CCW"] = 1] = "CCW";
        })(Orientation || (exports.Orientation = Orientation = {}));
        var Angle = function() {
            function Angle(radians) {
                this._radians = radians;
                if (this._radians < 0) {
                    this._radians += 2 * Math.PI;
                }
            }
            Angle.prototype.degrees = function() {
                return this._radians * 180 / Math.PI;
            };
            Angle.prototype.radians = function() {
                return this._radians;
            };
            Angle.BetweenTwoPoints = function(a, b) {
                var delta = b.subtract(a);
                var theta = Math.atan2(delta.y, delta.x);
                return new Angle(theta);
            };
            Angle.FromRadians = function(radians) {
                return new Angle(radians);
            };
            Angle.FromDegrees = function(degrees) {
                return new Angle(degrees * Math.PI / 180);
            };
            return Angle;
        }();
        exports.Angle = Angle;
        var Arc2 = function() {
            function Arc2(startPoint, midPoint, endPoint) {
                this.startPoint = startPoint;
                this.midPoint = midPoint;
                this.endPoint = endPoint;
                var temp = Math.pow(midPoint.x, 2) + Math.pow(midPoint.y, 2);
                var startToMid = (Math.pow(startPoint.x, 2) + Math.pow(startPoint.y, 2) - temp) / 2;
                var midToEnd = (temp - Math.pow(endPoint.x, 2) - Math.pow(endPoint.y, 2)) / 2;
                var det = (startPoint.x - midPoint.x) * (midPoint.y - endPoint.y) - (midPoint.x - endPoint.x) * (startPoint.y - midPoint.y);
                this.centerPoint = new Vector2((startToMid * (midPoint.y - endPoint.y) - midToEnd * (startPoint.y - midPoint.y)) / det, ((startPoint.x - midPoint.x) * midToEnd - (midPoint.x - endPoint.x) * startToMid) / det);
                this.radius = this.centerPoint.subtract(this.startPoint).length();
                this.startAngle = Angle.BetweenTwoPoints(this.centerPoint, this.startPoint);
                var a1 = this.startAngle.degrees();
                var a2 = Angle.BetweenTwoPoints(this.centerPoint, this.midPoint).degrees();
                var a3 = Angle.BetweenTwoPoints(this.centerPoint, this.endPoint).degrees();
                if (a2 - a1 > +180) {
                    a2 -= 360;
                }
                if (a2 - a1 < -180) {
                    a2 += 360;
                }
                if (a3 - a2 > +180) {
                    a3 -= 360;
                }
                if (a3 - a2 < -180) {
                    a3 += 360;
                }
                this.orientation = a2 - a1 < 0 ? Orientation.CW : Orientation.CCW;
                this.angle = Angle.FromDegrees(this.orientation === Orientation.CW ? a1 - a3 : a3 - a1);
            }
            return Arc2;
        }();
        exports.Arc2 = Arc2;
        var Path2 = function() {
            function Path2(x, y) {
                this._points = new Array;
                this._length = 0;
                this.closed = false;
                this._points.push(new Vector2(x, y));
            }
            Path2.prototype.addLineTo = function(x, y) {
                if (this.closed) {
                    return this;
                }
                var newPoint = new Vector2(x, y);
                var previousPoint = this._points[this._points.length - 1];
                this._points.push(newPoint);
                this._length += newPoint.subtract(previousPoint).length();
                return this;
            };
            Path2.prototype.addArcTo = function(midX, midY, endX, endY, numberOfSegments) {
                if (numberOfSegments === void 0) {
                    numberOfSegments = 36;
                }
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
            Path2.prototype.close = function() {
                this.closed = true;
                return this;
            };
            Path2.prototype.length = function() {
                var result = this._length;
                if (!this.closed) {
                    var lastPoint = this._points[this._points.length - 1];
                    var firstPoint = this._points[0];
                    result += firstPoint.subtract(lastPoint).length();
                }
                return result;
            };
            Path2.prototype.getPoints = function() {
                return this._points;
            };
            Path2.prototype.getPointAtLengthPosition = function(normalizedLengthPosition) {
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
                    var nextOffset = bToA.length() + previousOffset;
                    if (lengthPosition >= previousOffset && lengthPosition <= nextOffset) {
                        var dir = bToA.normalize();
                        var localOffset = lengthPosition - previousOffset;
                        return new Vector2(a.x + dir.x * localOffset, a.y + dir.y * localOffset);
                    }
                    previousOffset = nextOffset;
                }
                return Vector2.Zero();
            };
            Path2.StartingAt = function(x, y) {
                return new Path2(x, y);
            };
            return Path2;
        }();
        exports.Path2 = Path2;
        var Path3D = function() {
            function Path3D(path, firstNormal, raw) {
                if (firstNormal === void 0) {
                    firstNormal = null;
                }
                this.path = path;
                this._curve = new Array;
                this._distances = new Array;
                this._tangents = new Array;
                this._normals = new Array;
                this._binormals = new Array;
                for (var p = 0; p < path.length; p++) {
                    this._curve[p] = path[p].clone();
                }
                this._raw = raw || false;
                this._compute(firstNormal);
            }
            Path3D.prototype.getCurve = function() {
                return this._curve;
            };
            Path3D.prototype.getTangents = function() {
                return this._tangents;
            };
            Path3D.prototype.getNormals = function() {
                return this._normals;
            };
            Path3D.prototype.getBinormals = function() {
                return this._binormals;
            };
            Path3D.prototype.getDistances = function() {
                return this._distances;
            };
            Path3D.prototype.update = function(path, firstNormal) {
                if (firstNormal === void 0) {
                    firstNormal = null;
                }
                for (var p = 0; p < path.length; p++) {
                    this._curve[p].x = path[p].x;
                    this._curve[p].y = path[p].y;
                    this._curve[p].z = path[p].z;
                }
                this._compute(firstNormal);
                return this;
            };
            Path3D.prototype._compute = function(firstNormal) {
                var l = this._curve.length;
                this._tangents[0] = this._getFirstNonNullVector(0);
                if (!this._raw) {
                    this._tangents[0].normalize();
                }
                this._tangents[l - 1] = this._curve[l - 1].subtract(this._curve[l - 2]);
                if (!this._raw) {
                    this._tangents[l - 1].normalize();
                }
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
                this._distances[0] = 0;
                var prev;
                var cur;
                var curTang;
                var prevBinor;
                for (var i = 1; i < l; i++) {
                    prev = this._getLastNonNullVector(i);
                    if (i < l - 1) {
                        cur = this._getFirstNonNullVector(i);
                        this._tangents[i] = prev.add(cur);
                        this._tangents[i].normalize();
                    }
                    this._distances[i] = this._distances[i - 1] + prev.length();
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
            Path3D.prototype._getFirstNonNullVector = function(index) {
                var i = 1;
                var nNVector = this._curve[index + i].subtract(this._curve[index]);
                while (nNVector.length() === 0 && index + i + 1 < this._curve.length) {
                    i++;
                    nNVector = this._curve[index + i].subtract(this._curve[index]);
                }
                return nNVector;
            };
            Path3D.prototype._getLastNonNullVector = function(index) {
                var i = 1;
                var nLVector = this._curve[index].subtract(this._curve[index - i]);
                while (nLVector.length() === 0 && index > i + 1) {
                    i++;
                    nLVector = this._curve[index].subtract(this._curve[index - i]);
                }
                return nLVector;
            };
            Path3D.prototype._normalVector = function(vt, va) {
                var normal0;
                var tgl = vt.length();
                if (tgl === 0) {
                    tgl = 1;
                }
                if (va === undefined || va === null) {
                    var point;
                    if (!_math.Scalar.WithinEpsilon(Math.abs(vt.y) / tgl, 1, Epsilon)) {
                        point = new Vector3(0, -1, 0);
                    } else if (!_math.Scalar.WithinEpsilon(Math.abs(vt.x) / tgl, 1, Epsilon)) {
                        point = new Vector3(1, 0, 0);
                    } else if (!_math.Scalar.WithinEpsilon(Math.abs(vt.z) / tgl, 1, Epsilon)) {
                        point = new Vector3(0, 0, 1);
                    } else {
                        point = Vector3.Zero();
                    }
                    normal0 = Vector3.Cross(vt, point);
                } else {
                    normal0 = Vector3.Cross(vt, va);
                    Vector3.CrossToRef(normal0, vt, normal0);
                }
                normal0.normalize();
                return normal0;
            };
            return Path3D;
        }();
        exports.Path3D = Path3D;
        var Curve3 = function() {
            function Curve3(points) {
                this._length = 0;
                this._points = points;
                this._length = this._computeLength(points);
            }
            Curve3.CreateQuadraticBezier = function(v0, v1, v2, nbPoints) {
                nbPoints = nbPoints > 2 ? nbPoints : 3;
                var bez = new Array;
                var equation = function(t, val0, val1, val2) {
                    var res = (1 - t) * (1 - t) * val0 + 2 * t * (1 - t) * val1 + t * t * val2;
                    return res;
                };
                for (var i = 0; i <= nbPoints; i++) {
                    bez.push(new Vector3(equation(i / nbPoints, v0.x, v1.x, v2.x), equation(i / nbPoints, v0.y, v1.y, v2.y), equation(i / nbPoints, v0.z, v1.z, v2.z)));
                }
                return new Curve3(bez);
            };
            Curve3.CreateCubicBezier = function(v0, v1, v2, v3, nbPoints) {
                nbPoints = nbPoints > 3 ? nbPoints : 4;
                var bez = new Array;
                var equation = function(t, val0, val1, val2, val3) {
                    var res = (1 - t) * (1 - t) * (1 - t) * val0 + 3 * t * (1 - t) * (1 - t) * val1 + 3 * t * t * (1 - t) * val2 + t * t * t * val3;
                    return res;
                };
                for (var i = 0; i <= nbPoints; i++) {
                    bez.push(new Vector3(equation(i / nbPoints, v0.x, v1.x, v2.x, v3.x), equation(i / nbPoints, v0.y, v1.y, v2.y, v3.y), equation(i / nbPoints, v0.z, v1.z, v2.z, v3.z)));
                }
                return new Curve3(bez);
            };
            Curve3.CreateHermiteSpline = function(p1, t1, p2, t2, nbPoints) {
                var hermite = new Array;
                var step = 1 / nbPoints;
                for (var i = 0; i <= nbPoints; i++) {
                    hermite.push(Vector3.Hermite(p1, t1, p2, t2, i * step));
                }
                return new Curve3(hermite);
            };
            Curve3.CreateCatmullRomSpline = function(points, nbPoints, closed) {
                var catmullRom = new Array;
                var step = 1 / nbPoints;
                var amount = 0;
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
                } else {
                    var totalPoints = new Array;
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
            Curve3.prototype.getPoints = function() {
                return this._points;
            };
            Curve3.prototype.length = function() {
                return this._length;
            };
            Curve3.prototype.continue = function(curve) {
                var lastPoint = this._points[this._points.length - 1];
                var continuedPoints = this._points.slice();
                var curvePoints = curve.getPoints();
                for (var i = 1; i < curvePoints.length; i++) {
                    continuedPoints.push(curvePoints[i].subtract(curvePoints[0]).add(lastPoint));
                }
                var continuedCurve = new Curve3(continuedPoints);
                return continuedCurve;
            };
            Curve3.prototype._computeLength = function(path) {
                var l = 0;
                for (var i = 1; i < path.length; i++) {
                    l += path[i].subtract(path[i - 1]).length();
                }
                return l;
            };
            return Curve3;
        }();
        exports.Curve3 = Curve3;
        var PositionNormalVertex = function() {
            function PositionNormalVertex(position, normal) {
                if (position === void 0) {
                    position = Vector3.Zero();
                }
                if (normal === void 0) {
                    normal = Vector3.Up();
                }
                this.position = position;
                this.normal = normal;
            }
            PositionNormalVertex.prototype.clone = function() {
                return new PositionNormalVertex(this.position.clone(), this.normal.clone());
            };
            return PositionNormalVertex;
        }();
        exports.PositionNormalVertex = PositionNormalVertex;
        var PositionNormalTextureVertex = function() {
            function PositionNormalTextureVertex(position, normal, uv) {
                if (position === void 0) {
                    position = Vector3.Zero();
                }
                if (normal === void 0) {
                    normal = Vector3.Up();
                }
                if (uv === void 0) {
                    uv = Vector2.Zero();
                }
                this.position = position;
                this.normal = normal;
                this.uv = uv;
            }
            PositionNormalTextureVertex.prototype.clone = function() {
                return new PositionNormalTextureVertex(this.position.clone(), this.normal.clone(), this.uv.clone());
            };
            return PositionNormalTextureVertex;
        }();
        exports.PositionNormalTextureVertex = PositionNormalTextureVertex;
        var Tmp = function() {
            function Tmp() {}
            Tmp.Color3 = _arrayTools.ArrayTools.BuildArray(3, Color3.Black);
            Tmp.Color4 = _arrayTools.ArrayTools.BuildArray(3, (function() {
                return new Color4(0, 0, 0, 0);
            }));
            Tmp.Vector2 = _arrayTools.ArrayTools.BuildArray(3, Vector2.Zero);
            Tmp.Vector3 = _arrayTools.ArrayTools.BuildArray(13, Vector3.Zero);
            Tmp.Vector4 = _arrayTools.ArrayTools.BuildArray(3, Vector4.Zero);
            Tmp.Quaternion = _arrayTools.ArrayTools.BuildArray(2, Quaternion.Zero);
            Tmp.Matrix = _arrayTools.ArrayTools.BuildArray(8, Matrix.Identity);
            return Tmp;
        }();
        exports.Tmp = Tmp;
        var MathTmp = function() {
            function MathTmp() {}
            MathTmp.Vector3 = _arrayTools.ArrayTools.BuildArray(6, Vector3.Zero);
            MathTmp.Matrix = _arrayTools.ArrayTools.BuildArray(2, Matrix.Identity);
            MathTmp.Quaternion = _arrayTools.ArrayTools.BuildArray(3, Quaternion.Zero);
            return MathTmp;
        }();
    }, {
        "../Misc/arrayTools": 16,
        "./math.scalar": 14
    } ],
    14: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.Scalar = void 0;
        var Scalar = function() {
            function Scalar() {}
            Scalar.WithinEpsilon = function(a, b, epsilon) {
                if (epsilon === void 0) {
                    epsilon = 1401298e-51;
                }
                var num = a - b;
                return -epsilon <= num && num <= epsilon;
            };
            Scalar.ToHex = function(i) {
                var str = i.toString(16);
                if (i <= 15) {
                    return ("0" + str).toUpperCase();
                }
                return str.toUpperCase();
            };
            Scalar.Sign = function(value) {
                value = +value;
                if (value === 0 || isNaN(value)) {
                    return value;
                }
                return value > 0 ? 1 : -1;
            };
            Scalar.Clamp = function(value, min, max) {
                if (min === void 0) {
                    min = 0;
                }
                if (max === void 0) {
                    max = 1;
                }
                return Math.min(max, Math.max(min, value));
            };
            Scalar.Log2 = function(value) {
                return Math.log(value) * Math.LOG2E;
            };
            Scalar.Repeat = function(value, length) {
                return value - Math.floor(value / length) * length;
            };
            Scalar.Normalize = function(value, min, max) {
                return (value - min) / (max - min);
            };
            Scalar.Denormalize = function(normalized, min, max) {
                return normalized * (max - min) + min;
            };
            Scalar.DeltaAngle = function(current, target) {
                var num = Scalar.Repeat(target - current, 360);
                if (num > 180) {
                    num -= 360;
                }
                return num;
            };
            Scalar.PingPong = function(tx, length) {
                var t = Scalar.Repeat(tx, length * 2);
                return length - Math.abs(t - length);
            };
            Scalar.SmoothStep = function(from, to, tx) {
                var t = Scalar.Clamp(tx);
                t = -2 * t * t * t + 3 * t * t;
                return to * t + from * (1 - t);
            };
            Scalar.MoveTowards = function(current, target, maxDelta) {
                var result = 0;
                if (Math.abs(target - current) <= maxDelta) {
                    result = target;
                } else {
                    result = current + Scalar.Sign(target - current) * maxDelta;
                }
                return result;
            };
            Scalar.MoveTowardsAngle = function(current, target, maxDelta) {
                var num = Scalar.DeltaAngle(current, target);
                var result = 0;
                if (-maxDelta < num && num < maxDelta) {
                    result = target;
                } else {
                    target = current + num;
                    result = Scalar.MoveTowards(current, target, maxDelta);
                }
                return result;
            };
            Scalar.Lerp = function(start, end, amount) {
                return start + (end - start) * amount;
            };
            Scalar.LerpAngle = function(start, end, amount) {
                var num = Scalar.Repeat(end - start, 360);
                if (num > 180) {
                    num -= 360;
                }
                return start + num * Scalar.Clamp(amount);
            };
            Scalar.InverseLerp = function(a, b, value) {
                var result = 0;
                if (a != b) {
                    result = Scalar.Clamp((value - a) / (b - a));
                } else {
                    result = 0;
                }
                return result;
            };
            Scalar.Hermite = function(value1, tangent1, value2, tangent2, amount) {
                var squared = amount * amount;
                var cubed = amount * squared;
                var part1 = 2 * cubed - 3 * squared + 1;
                var part2 = -2 * cubed + 3 * squared;
                var part3 = cubed - 2 * squared + amount;
                var part4 = cubed - squared;
                return value1 * part1 + value2 * part2 + tangent1 * part3 + tangent2 * part4;
            };
            Scalar.RandomRange = function(min, max) {
                if (min === max) {
                    return min;
                }
                return Math.random() * (max - min) + min;
            };
            Scalar.RangeToPercent = function(number, min, max) {
                return (number - min) / (max - min);
            };
            Scalar.PercentToRange = function(percent, min, max) {
                return (max - min) * percent + min;
            };
            Scalar.NormalizeRadians = function(angle) {
                angle -= Scalar.TwoPi * Math.floor((angle + Math.PI) / Scalar.TwoPi);
                return angle;
            };
            Scalar.TwoPi = Math.PI * 2;
            return Scalar;
        }();
        exports.Scalar = Scalar;
    }, {} ],
    15: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.AndOrNotEvaluator = void 0;
        var AndOrNotEvaluator = function() {
            function AndOrNotEvaluator() {}
            AndOrNotEvaluator.Eval = function(query, evaluateCallback) {
                if (!query.match(/\([^\(\)]*\)/g)) {
                    query = AndOrNotEvaluator._HandleParenthesisContent(query, evaluateCallback);
                } else {
                    query = query.replace(/\([^\(\)]*\)/g, (function(r) {
                        r = r.slice(1, r.length - 1);
                        return AndOrNotEvaluator._HandleParenthesisContent(r, evaluateCallback);
                    }));
                }
                if (query === "true") {
                    return true;
                }
                if (query === "false") {
                    return false;
                }
                return AndOrNotEvaluator.Eval(query, evaluateCallback);
            };
            AndOrNotEvaluator._HandleParenthesisContent = function(parenthesisContent, evaluateCallback) {
                evaluateCallback = evaluateCallback || function(r) {
                    return r === "true" ? true : false;
                };
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
                                    } else {
                                        result = evaluateCallback(andj);
                                    }
                                } else {
                                    result = andj === "true" ? true : false;
                                }
                                if (!result) {
                                    ori = "false";
                                    break;
                                }
                            }
                        }
                        if (result || ori === "true") {
                            result = true;
                            break;
                        }
                        if (ori !== "true" && ori !== "false") {
                            if (ori[0] === "!") {
                                result = !evaluateCallback(ori.substring(1));
                            } else {
                                result = evaluateCallback(ori);
                            }
                        } else {
                            result = ori === "true" ? true : false;
                        }
                    }
                }
                return result ? "true" : "false";
            };
            AndOrNotEvaluator._SimplifyNegation = function(booleanString) {
                booleanString = booleanString.replace(/^[\s!]+/, (function(r) {
                    r = r.replace(/[\s]/g, (function() {
                        return "";
                    }));
                    return r.length % 2 ? "!" : "";
                }));
                booleanString = booleanString.trim();
                if (booleanString === "!true") {
                    booleanString = "false";
                } else if (booleanString === "!false") {
                    booleanString = "true";
                }
                return booleanString;
            };
            return AndOrNotEvaluator;
        }();
        exports.AndOrNotEvaluator = AndOrNotEvaluator;
    }, {} ],
    16: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.ArrayTools = void 0;
        var ArrayTools = function() {
            function ArrayTools() {}
            ArrayTools.BuildArray = function(size, itemBuilder) {
                var a = [];
                for (var i = 0; i < size; ++i) {
                    a.push(itemBuilder());
                }
                return a;
            };
            return ArrayTools;
        }();
        exports.ArrayTools = ArrayTools;
    }, {} ],
    17: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.expandToProperty = expandToProperty;
        exports.serialize = serialize;
        exports.serializeAsTexture = serializeAsTexture;
        exports.serializeAsColor3 = serializeAsColor3;
        exports.serializeAsFresnelParameters = serializeAsFresnelParameters;
        exports.serializeAsVector2 = serializeAsVector2;
        exports.serializeAsVector3 = serializeAsVector3;
        exports.serializeAsMeshReference = serializeAsMeshReference;
        exports.serializeAsColorCurves = serializeAsColorCurves;
        exports.serializeAsColor4 = serializeAsColor4;
        exports.serializeAsImageProcessingConfiguration = serializeAsImageProcessingConfiguration;
        exports.serializeAsQuaternion = serializeAsQuaternion;
        exports.serializeAsMatrix = serializeAsMatrix;
        exports.serializeAsCameraReference = serializeAsCameraReference;
        exports.SerializationHelper = void 0;
        var _tags = require("../Misc/tags");
        var _math = require("../Maths/math");
        var _devTools = require("./devTools");
        var __decoratorInitialStore = {};
        var __mergedStore = {};
        var _copySource = function(creationFunction, source, instanciate) {
            var destination = creationFunction();
            if (_tags.Tags) {
                _tags.Tags.AddTagsTo(destination, source.tags);
            }
            var classStore = getMergedStore(destination);
            for (var property in classStore) {
                var propertyDescriptor = classStore[property];
                var sourceProperty = source[property];
                var propertyType = propertyDescriptor.type;
                if (sourceProperty !== undefined && sourceProperty !== null && property !== "uniqueId") {
                    switch (propertyType) {
                      case 0:
                      case 6:
                      case 11:
                        destination[property] = sourceProperty;
                        break;

                      case 1:
                        destination[property] = instanciate || sourceProperty.isRenderTarget ? sourceProperty : sourceProperty.clone();
                        break;

                      case 2:
                      case 3:
                      case 4:
                      case 5:
                      case 7:
                      case 10:
                      case 12:
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
            return function(target, propertyKey) {
                var classStore = getDirectStore(target);
                if (!classStore[propertyKey]) {
                    classStore[propertyKey] = {
                        type: type,
                        sourceName: sourceName
                    };
                }
            };
        }
        function generateExpandMember(setCallback, targetKey) {
            if (targetKey === void 0) {
                targetKey = null;
            }
            return function(target, propertyKey) {
                var key = targetKey || "_" + propertyKey;
                Object.defineProperty(target, propertyKey, {
                    get: function() {
                        return this[key];
                    },
                    set: function(value) {
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
            if (targetKey === void 0) {
                targetKey = null;
            }
            return generateExpandMember(callback, targetKey);
        }
        function serialize(sourceName) {
            return generateSerializableMember(0, sourceName);
        }
        function serializeAsTexture(sourceName) {
            return generateSerializableMember(1, sourceName);
        }
        function serializeAsColor3(sourceName) {
            return generateSerializableMember(2, sourceName);
        }
        function serializeAsFresnelParameters(sourceName) {
            return generateSerializableMember(3, sourceName);
        }
        function serializeAsVector2(sourceName) {
            return generateSerializableMember(4, sourceName);
        }
        function serializeAsVector3(sourceName) {
            return generateSerializableMember(5, sourceName);
        }
        function serializeAsMeshReference(sourceName) {
            return generateSerializableMember(6, sourceName);
        }
        function serializeAsColorCurves(sourceName) {
            return generateSerializableMember(7, sourceName);
        }
        function serializeAsColor4(sourceName) {
            return generateSerializableMember(8, sourceName);
        }
        function serializeAsImageProcessingConfiguration(sourceName) {
            return generateSerializableMember(9, sourceName);
        }
        function serializeAsQuaternion(sourceName) {
            return generateSerializableMember(10, sourceName);
        }
        function serializeAsMatrix(sourceName) {
            return generateSerializableMember(12, sourceName);
        }
        function serializeAsCameraReference(sourceName) {
            return generateSerializableMember(11, sourceName);
        }
        var SerializationHelper = function() {
            function SerializationHelper() {}
            SerializationHelper.AppendSerializedAnimations = function(source, destination) {
                if (source.animations) {
                    destination.animations = [];
                    for (var animationIndex = 0; animationIndex < source.animations.length; animationIndex++) {
                        var animation = source.animations[animationIndex];
                        destination.animations.push(animation.serialize());
                    }
                }
            };
            SerializationHelper.Serialize = function(entity, serializationObject) {
                if (!serializationObject) {
                    serializationObject = {};
                }
                if (_tags.Tags) {
                    serializationObject.tags = _tags.Tags.GetTags(entity);
                }
                var serializedProperties = getMergedStore(entity);
                for (var property in serializedProperties) {
                    var propertyDescriptor = serializedProperties[property];
                    var targetPropertyName = propertyDescriptor.sourceName || property;
                    var propertyType = propertyDescriptor.type;
                    var sourceProperty = entity[property];
                    if (sourceProperty !== undefined && sourceProperty !== null) {
                        switch (propertyType) {
                          case 0:
                            serializationObject[targetPropertyName] = sourceProperty;
                            break;

                          case 1:
                            serializationObject[targetPropertyName] = sourceProperty.serialize();
                            break;

                          case 2:
                            serializationObject[targetPropertyName] = sourceProperty.asArray();
                            break;

                          case 3:
                            serializationObject[targetPropertyName] = sourceProperty.serialize();
                            break;

                          case 4:
                            serializationObject[targetPropertyName] = sourceProperty.asArray();
                            break;

                          case 5:
                            serializationObject[targetPropertyName] = sourceProperty.asArray();
                            break;

                          case 6:
                            serializationObject[targetPropertyName] = sourceProperty.id;
                            break;

                          case 7:
                            serializationObject[targetPropertyName] = sourceProperty.serialize();
                            break;

                          case 8:
                            serializationObject[targetPropertyName] = sourceProperty.asArray();
                            break;

                          case 9:
                            serializationObject[targetPropertyName] = sourceProperty.serialize();
                            break;

                          case 10:
                            serializationObject[targetPropertyName] = sourceProperty.asArray();
                            break;

                          case 11:
                            serializationObject[targetPropertyName] = sourceProperty.id;

                          case 12:
                            serializationObject[targetPropertyName] = sourceProperty.asArray();
                            break;
                        }
                    }
                }
                return serializationObject;
            };
            SerializationHelper.Parse = function(creationFunction, source, scene, rootUrl) {
                if (rootUrl === void 0) {
                    rootUrl = null;
                }
                var destination = creationFunction();
                if (!rootUrl) {
                    rootUrl = "";
                }
                if (_tags.Tags) {
                    _tags.Tags.AddTagsTo(destination, source.tags);
                }
                var classStore = getMergedStore(destination);
                for (var property in classStore) {
                    var propertyDescriptor = classStore[property];
                    var sourceProperty = source[propertyDescriptor.sourceName || property];
                    var propertyType = propertyDescriptor.type;
                    if (sourceProperty !== undefined && sourceProperty !== null) {
                        var dest = destination;
                        switch (propertyType) {
                          case 0:
                            dest[property] = sourceProperty;
                            break;

                          case 1:
                            if (scene) {
                                dest[property] = SerializationHelper._TextureParser(sourceProperty, scene, rootUrl);
                            }
                            break;

                          case 2:
                            dest[property] = _math.Color3.FromArray(sourceProperty);
                            break;

                          case 3:
                            dest[property] = SerializationHelper._FresnelParametersParser(sourceProperty);
                            break;

                          case 4:
                            dest[property] = _math.Vector2.FromArray(sourceProperty);
                            break;

                          case 5:
                            dest[property] = _math.Vector3.FromArray(sourceProperty);
                            break;

                          case 6:
                            if (scene) {
                                dest[property] = scene.getLastMeshByID(sourceProperty);
                            }
                            break;

                          case 7:
                            dest[property] = SerializationHelper._ColorCurvesParser(sourceProperty);
                            break;

                          case 8:
                            dest[property] = _math.Color4.FromArray(sourceProperty);
                            break;

                          case 9:
                            dest[property] = SerializationHelper._ImageProcessingConfigurationParser(sourceProperty);
                            break;

                          case 10:
                            dest[property] = _math.Quaternion.FromArray(sourceProperty);
                            break;

                          case 11:
                            if (scene) {
                                dest[property] = scene.getCameraByID(sourceProperty);
                            }

                          case 12:
                            dest[property] = _math.Matrix.FromArray(sourceProperty);
                            break;
                        }
                    }
                }
                return destination;
            };
            SerializationHelper.Clone = function(creationFunction, source) {
                return _copySource(creationFunction, source, false);
            };
            SerializationHelper.Instanciate = function(creationFunction, source) {
                return _copySource(creationFunction, source, true);
            };
            SerializationHelper._ImageProcessingConfigurationParser = function(sourceProperty) {
                throw _devTools._DevTools.WarnImport("ImageProcessingConfiguration");
            };
            SerializationHelper._FresnelParametersParser = function(sourceProperty) {
                throw _devTools._DevTools.WarnImport("FresnelParameters");
            };
            SerializationHelper._ColorCurvesParser = function(sourceProperty) {
                throw _devTools._DevTools.WarnImport("ColorCurves");
            };
            SerializationHelper._TextureParser = function(sourceProperty, scene, rootUrl) {
                throw _devTools._DevTools.WarnImport("Texture");
            };
            return SerializationHelper;
        }();
        exports.SerializationHelper = SerializationHelper;
    }, {
        "../Maths/math": 13,
        "../Misc/tags": 20,
        "./devTools": 18
    } ],
    18: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports._DevTools = void 0;
        var _DevTools = function() {
            function _DevTools() {}
            _DevTools.WarnImport = function(name) {
                return name + " needs to be imported before as it contains a side-effect required by your code.";
            };
            return _DevTools;
        }();
        exports._DevTools = _DevTools;
    }, {} ],
    19: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.Observable = exports.MultiObserver = exports.Observer = exports.EventState = void 0;
        var EventState = function() {
            function EventState(mask, skipNextObservers, target, currentTarget) {
                if (skipNextObservers === void 0) {
                    skipNextObservers = false;
                }
                this.initalize(mask, skipNextObservers, target, currentTarget);
            }
            EventState.prototype.initalize = function(mask, skipNextObservers, target, currentTarget) {
                if (skipNextObservers === void 0) {
                    skipNextObservers = false;
                }
                this.mask = mask;
                this.skipNextObservers = skipNextObservers;
                this.target = target;
                this.currentTarget = currentTarget;
                return this;
            };
            return EventState;
        }();
        exports.EventState = EventState;
        var Observer = function() {
            function Observer(callback, mask, scope) {
                if (scope === void 0) {
                    scope = null;
                }
                this.callback = callback;
                this.mask = mask;
                this.scope = scope;
                this._willBeUnregistered = false;
                this.unregisterOnNextCall = false;
            }
            return Observer;
        }();
        exports.Observer = Observer;
        var MultiObserver = function() {
            function MultiObserver() {}
            MultiObserver.prototype.dispose = function() {
                if (this._observers && this._observables) {
                    for (var index = 0; index < this._observers.length; index++) {
                        this._observables[index].remove(this._observers[index]);
                    }
                }
                this._observers = null;
                this._observables = null;
            };
            MultiObserver.Watch = function(observables, callback, mask, scope) {
                if (mask === void 0) {
                    mask = -1;
                }
                if (scope === void 0) {
                    scope = null;
                }
                var result = new MultiObserver;
                result._observers = new Array;
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
        }();
        exports.MultiObserver = MultiObserver;
        var Observable = function() {
            function Observable(onObserverAdded) {
                this._observers = new Array;
                this._eventState = new EventState(0);
                if (onObserverAdded) {
                    this._onObserverAdded = onObserverAdded;
                }
            }
            Observable.prototype.add = function(callback, mask, insertFirst, scope, unregisterOnFirstCall) {
                if (mask === void 0) {
                    mask = -1;
                }
                if (insertFirst === void 0) {
                    insertFirst = false;
                }
                if (scope === void 0) {
                    scope = null;
                }
                if (unregisterOnFirstCall === void 0) {
                    unregisterOnFirstCall = false;
                }
                if (!callback) {
                    return null;
                }
                var observer = new Observer(callback, mask, scope);
                observer.unregisterOnNextCall = unregisterOnFirstCall;
                if (insertFirst) {
                    this._observers.unshift(observer);
                } else {
                    this._observers.push(observer);
                }
                if (this._onObserverAdded) {
                    this._onObserverAdded(observer);
                }
                return observer;
            };
            Observable.prototype.addOnce = function(callback) {
                return this.add(callback, undefined, undefined, undefined, true);
            };
            Observable.prototype.remove = function(observer) {
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
            Observable.prototype.removeCallback = function(callback, scope) {
                for (var index = 0; index < this._observers.length; index++) {
                    if (this._observers[index].callback === callback && (!scope || scope === this._observers[index].scope)) {
                        this._deferUnregister(this._observers[index]);
                        return true;
                    }
                }
                return false;
            };
            Observable.prototype._deferUnregister = function(observer) {
                var _this = this;
                observer.unregisterOnNextCall = false;
                observer._willBeUnregistered = true;
                setTimeout((function() {
                    _this._remove(observer);
                }), 0);
            };
            Observable.prototype._remove = function(observer) {
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
            Observable.prototype.makeObserverTopPriority = function(observer) {
                this._remove(observer);
                this._observers.unshift(observer);
            };
            Observable.prototype.makeObserverBottomPriority = function(observer) {
                this._remove(observer);
                this._observers.push(observer);
            };
            Observable.prototype.notifyObservers = function(eventData, mask, target, currentTarget) {
                if (mask === void 0) {
                    mask = -1;
                }
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
                            state.lastReturnValue = obs.callback.apply(obs.scope, [ eventData, state ]);
                        } else {
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
            Observable.prototype.notifyObserversWithPromise = function(eventData, mask, target, currentTarget) {
                var _this = this;
                if (mask === void 0) {
                    mask = -1;
                }
                var p = Promise.resolve(eventData);
                if (!this._observers.length) {
                    return p;
                }
                var state = this._eventState;
                state.mask = mask;
                state.target = target;
                state.currentTarget = currentTarget;
                state.skipNextObservers = false;
                this._observers.forEach((function(obs) {
                    if (state.skipNextObservers) {
                        return;
                    }
                    if (obs._willBeUnregistered) {
                        return;
                    }
                    if (obs.mask & mask) {
                        if (obs.scope) {
                            p = p.then((function(lastReturnedValue) {
                                state.lastReturnValue = lastReturnedValue;
                                return obs.callback.apply(obs.scope, [ eventData, state ]);
                            }));
                        } else {
                            p = p.then((function(lastReturnedValue) {
                                state.lastReturnValue = lastReturnedValue;
                                return obs.callback(eventData, state);
                            }));
                        }
                        if (obs.unregisterOnNextCall) {
                            _this._deferUnregister(obs);
                        }
                    }
                }));
                return p.then((function() {
                    return eventData;
                }));
            };
            Observable.prototype.notifyObserver = function(observer, eventData, mask) {
                if (mask === void 0) {
                    mask = -1;
                }
                var state = this._eventState;
                state.mask = mask;
                state.skipNextObservers = false;
                observer.callback(eventData, state);
            };
            Observable.prototype.hasObservers = function() {
                return this._observers.length > 0;
            };
            Observable.prototype.clear = function() {
                this._observers = new Array;
                this._onObserverAdded = null;
            };
            Observable.prototype.clone = function() {
                var result = new Observable;
                result._observers = this._observers.slice(0);
                return result;
            };
            Observable.prototype.hasSpecificMask = function(mask) {
                if (mask === void 0) {
                    mask = -1;
                }
                for (var _i = 0, _a = this._observers; _i < _a.length; _i++) {
                    var obs = _a[_i];
                    if (obs.mask & mask || obs.mask === mask) {
                        return true;
                    }
                }
                return false;
            };
            return Observable;
        }();
        exports.Observable = Observable;
    }, {} ],
    20: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.Tags = void 0;
        var _tools = require("./tools");
        var _andOrNotEvaluator = require("./andOrNotEvaluator");
        var Tags = function() {
            function Tags() {}
            Tags.EnableFor = function(obj) {
                obj._tags = obj._tags || {};
                obj.hasTags = function() {
                    return Tags.HasTags(obj);
                };
                obj.addTags = function(tagsString) {
                    return Tags.AddTagsTo(obj, tagsString);
                };
                obj.removeTags = function(tagsString) {
                    return Tags.RemoveTagsFrom(obj, tagsString);
                };
                obj.matchesTagsQuery = function(tagsQuery) {
                    return Tags.MatchesQuery(obj, tagsQuery);
                };
            };
            Tags.DisableFor = function(obj) {
                delete obj._tags;
                delete obj.hasTags;
                delete obj.addTags;
                delete obj.removeTags;
                delete obj.matchesTagsQuery;
            };
            Tags.HasTags = function(obj) {
                if (!obj._tags) {
                    return false;
                }
                return !_tools.Tools.IsEmpty(obj._tags);
            };
            Tags.GetTags = function(obj, asString) {
                if (asString === void 0) {
                    asString = true;
                }
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
                } else {
                    return obj._tags;
                }
            };
            Tags.AddTagsTo = function(obj, tagsString) {
                if (!tagsString) {
                    return;
                }
                if (typeof tagsString !== "string") {
                    return;
                }
                var tags = tagsString.split(" ");
                tags.forEach((function(tag, index, array) {
                    Tags._AddTagTo(obj, tag);
                }));
            };
            Tags._AddTagTo = function(obj, tag) {
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
            Tags.RemoveTagsFrom = function(obj, tagsString) {
                if (!Tags.HasTags(obj)) {
                    return;
                }
                var tags = tagsString.split(" ");
                for (var t in tags) {
                    Tags._RemoveTagFrom(obj, tags[t]);
                }
            };
            Tags._RemoveTagFrom = function(obj, tag) {
                delete obj._tags[tag];
            };
            Tags.MatchesQuery = function(obj, tagsQuery) {
                if (tagsQuery === undefined) {
                    return true;
                }
                if (tagsQuery === "") {
                    return Tags.HasTags(obj);
                }
                return _andOrNotEvaluator.AndOrNotEvaluator.Eval(tagsQuery, (function(r) {
                    return Tags.HasTags(obj) && obj._tags[r];
                }));
            };
            return Tags;
        }();
        exports.Tags = Tags;
    }, {
        "./andOrNotEvaluator": 15,
        "./tools": 21
    } ],
    21: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
    }, {} ],
    22: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports._TypeStore = void 0;
        var _TypeStore = function() {
            function _TypeStore() {}
            _TypeStore.GetClass = function(fqdn) {
                if (this.RegisteredTypes && this.RegisteredTypes[fqdn]) {
                    return this.RegisteredTypes[fqdn];
                }
                return null;
            };
            _TypeStore.RegisteredTypes = {};
            return _TypeStore;
        }();
        exports._TypeStore = _TypeStore;
    }, {} ],
    23: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.Node = void 0;
        var tslib_1 = _interopRequireWildcard(require("tslib"));
        var _math = require("./Maths/math");
        var _decorators = require("./Misc/decorators");
        var _observable = require("./Misc/observable");
        var _engineStore = require("./Engines/engineStore");
        var _devTools = require("./Misc/devTools");
        var _tools = require("./Misc/tools");
        function _getRequireWildcardCache() {
            if (typeof WeakMap !== "function") return null;
            var cache = new WeakMap;
            _getRequireWildcardCache = function() {
                return cache;
            };
            return cache;
        }
        function _interopRequireWildcard(obj) {
            if (obj && obj.__esModule) {
                return obj;
            }
            var cache = _getRequireWildcardCache();
            if (cache && cache.has(obj)) {
                return cache.get(obj);
            }
            var newObj = {};
            if (obj != null) {
                var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
                        if (desc && (desc.get || desc.set)) {
                            Object.defineProperty(newObj, key, desc);
                        } else {
                            newObj[key] = obj[key];
                        }
                    }
                }
            }
            newObj.default = obj;
            if (cache) {
                cache.set(obj, newObj);
            }
            return newObj;
        }
        var Node = function() {
            function Node(name, scene, addToRootNodes) {
                if (scene === void 0) {
                    scene = null;
                }
                if (addToRootNodes === void 0) {
                    addToRootNodes = true;
                }
                this.state = "";
                this.metadata = null;
                this.reservedDataStore = null;
                this.doNotSerialize = false;
                this._isDisposed = false;
                this.animations = new Array;
                this._ranges = {};
                this.onReady = null;
                this._isEnabled = true;
                this._isParentEnabled = true;
                this._isReady = true;
                this._currentRenderId = -1;
                this._parentUpdateId = -1;
                this._childUpdateId = -1;
                this._waitingParentId = null;
                this._cache = {};
                this._parentNode = null;
                this._children = null;
                this._worldMatrix = _math.Matrix.Identity();
                this._worldMatrixDeterminant = 0;
                this._worldMatrixDeterminantIsDirty = true;
                this._sceneRootNodesIndex = -1;
                this._animationPropertiesOverride = null;
                this._isNode = true;
                this.onDisposeObservable = new _observable.Observable;
                this._onDisposeObserver = null;
                this._behaviors = new Array;
                this.name = name;
                this.id = name;
                this._scene = scene || _engineStore.EngineStore.LastCreatedScene;
                this.uniqueId = this._scene.getUniqueId();
                this._initCache();
                if (addToRootNodes) {
                    this.addToSceneRootNodes();
                }
            }
            Node.AddNodeConstructor = function(type, constructorFunc) {
                this._NodeConstructors[type] = constructorFunc;
            };
            Node.Construct = function(type, name, scene, options) {
                var constructorFunc = this._NodeConstructors[type];
                if (!constructorFunc) {
                    return null;
                }
                return constructorFunc(name, scene, options);
            };
            Node.prototype.isDisposed = function() {
                return this._isDisposed;
            };
            Object.defineProperty(Node.prototype, "parent", {
                get: function() {
                    return this._parentNode;
                },
                set: function(parent) {
                    if (this._parentNode === parent) {
                        return;
                    }
                    var previousParentNode = this._parentNode;
                    if (this._parentNode && this._parentNode._children !== undefined && this._parentNode._children !== null) {
                        var index = this._parentNode._children.indexOf(this);
                        if (index !== -1) {
                            this._parentNode._children.splice(index, 1);
                        }
                        if (!parent && !this._isDisposed) {
                            this.addToSceneRootNodes();
                        }
                    }
                    this._parentNode = parent;
                    if (this._parentNode) {
                        if (this._parentNode._children === undefined || this._parentNode._children === null) {
                            this._parentNode._children = new Array;
                        }
                        this._parentNode._children.push(this);
                        if (!previousParentNode) {
                            this.removeFromSceneRootNodes();
                        }
                    }
                    this._syncParentEnabledState();
                },
                enumerable: true,
                configurable: true
            });
            Node.prototype.addToSceneRootNodes = function() {
                if (this._sceneRootNodesIndex === -1) {
                    this._sceneRootNodesIndex = this._scene.rootNodes.length;
                    this._scene.rootNodes.push(this);
                }
            };
            Node.prototype.removeFromSceneRootNodes = function() {
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
                get: function() {
                    if (!this._animationPropertiesOverride) {
                        return this._scene.animationPropertiesOverride;
                    }
                    return this._animationPropertiesOverride;
                },
                set: function(value) {
                    this._animationPropertiesOverride = value;
                },
                enumerable: true,
                configurable: true
            });
            Node.prototype.getClassName = function() {
                return "Node";
            };
            Object.defineProperty(Node.prototype, "onDispose", {
                set: function(callback) {
                    if (this._onDisposeObserver) {
                        this.onDisposeObservable.remove(this._onDisposeObserver);
                    }
                    this._onDisposeObserver = this.onDisposeObservable.add(callback);
                },
                enumerable: true,
                configurable: true
            });
            Node.prototype.getScene = function() {
                return this._scene;
            };
            Node.prototype.getEngine = function() {
                return this._scene.getEngine();
            };
            Node.prototype.addBehavior = function(behavior, attachImmediately) {
                var _this = this;
                if (attachImmediately === void 0) {
                    attachImmediately = false;
                }
                var index = this._behaviors.indexOf(behavior);
                if (index !== -1) {
                    return this;
                }
                behavior.init();
                if (this._scene.isLoading && !attachImmediately) {
                    this._scene.onDataLoadedObservable.addOnce((function() {
                        behavior.attach(_this);
                    }));
                } else {
                    behavior.attach(this);
                }
                this._behaviors.push(behavior);
                return this;
            };
            Node.prototype.removeBehavior = function(behavior) {
                var index = this._behaviors.indexOf(behavior);
                if (index === -1) {
                    return this;
                }
                this._behaviors[index].detach();
                this._behaviors.splice(index, 1);
                return this;
            };
            Object.defineProperty(Node.prototype, "behaviors", {
                get: function() {
                    return this._behaviors;
                },
                enumerable: true,
                configurable: true
            });
            Node.prototype.getBehaviorByName = function(name) {
                for (var _i = 0, _a = this._behaviors; _i < _a.length; _i++) {
                    var behavior = _a[_i];
                    if (behavior.name === name) {
                        return behavior;
                    }
                }
                return null;
            };
            Node.prototype.getWorldMatrix = function() {
                if (this._currentRenderId !== this._scene.getRenderId()) {
                    this.computeWorldMatrix();
                }
                return this._worldMatrix;
            };
            Node.prototype._getWorldMatrixDeterminant = function() {
                if (this._worldMatrixDeterminantIsDirty) {
                    this._worldMatrixDeterminantIsDirty = false;
                    this._worldMatrixDeterminant = this._worldMatrix.determinant();
                }
                return this._worldMatrixDeterminant;
            };
            Object.defineProperty(Node.prototype, "worldMatrixFromCache", {
                get: function() {
                    return this._worldMatrix;
                },
                enumerable: true,
                configurable: true
            });
            Node.prototype._initCache = function() {
                this._cache = {};
                this._cache.parent = undefined;
            };
            Node.prototype.updateCache = function(force) {
                if (!force && this.isSynchronized()) {
                    return;
                }
                this._cache.parent = this.parent;
                this._updateCache();
            };
            Node.prototype._getActionManagerForTrigger = function(trigger, initialCall) {
                if (initialCall === void 0) {
                    initialCall = true;
                }
                if (!this.parent) {
                    return null;
                }
                return this.parent._getActionManagerForTrigger(trigger, false);
            };
            Node.prototype._updateCache = function(ignoreParentClass) {};
            Node.prototype._isSynchronized = function() {
                return true;
            };
            Node.prototype._markSyncedWithParent = function() {
                if (this._parentNode) {
                    this._parentUpdateId = this._parentNode._childUpdateId;
                }
            };
            Node.prototype.isSynchronizedWithParent = function() {
                if (!this._parentNode) {
                    return true;
                }
                if (this._parentUpdateId !== this._parentNode._childUpdateId) {
                    return false;
                }
                return this._parentNode.isSynchronized();
            };
            Node.prototype.isSynchronized = function() {
                if (this._cache.parent != this._parentNode) {
                    this._cache.parent = this._parentNode;
                    return false;
                }
                if (this._parentNode && !this.isSynchronizedWithParent()) {
                    return false;
                }
                return this._isSynchronized();
            };
            Node.prototype.isReady = function(completeCheck) {
                if (completeCheck === void 0) {
                    completeCheck = false;
                }
                return this._isReady;
            };
            Node.prototype.isEnabled = function(checkAncestors) {
                if (checkAncestors === void 0) {
                    checkAncestors = true;
                }
                if (checkAncestors === false) {
                    return this._isEnabled;
                }
                if (!this._isEnabled) {
                    return false;
                }
                return this._isParentEnabled;
            };
            Node.prototype._syncParentEnabledState = function() {
                this._isParentEnabled = this._parentNode ? this._parentNode.isEnabled() : true;
                if (this._children) {
                    this._children.forEach((function(c) {
                        c._syncParentEnabledState();
                    }));
                }
            };
            Node.prototype.setEnabled = function(value) {
                this._isEnabled = value;
                this._syncParentEnabledState();
            };
            Node.prototype.isDescendantOf = function(ancestor) {
                if (this.parent) {
                    if (this.parent === ancestor) {
                        return true;
                    }
                    return this.parent.isDescendantOf(ancestor);
                }
                return false;
            };
            Node.prototype._getDescendants = function(results, directDescendantsOnly, predicate) {
                if (directDescendantsOnly === void 0) {
                    directDescendantsOnly = false;
                }
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
            Node.prototype.getDescendants = function(directDescendantsOnly, predicate) {
                var results = new Array;
                this._getDescendants(results, directDescendantsOnly, predicate);
                return results;
            };
            Node.prototype.getChildMeshes = function(directDescendantsOnly, predicate) {
                var results = [];
                this._getDescendants(results, directDescendantsOnly, (function(node) {
                    return (!predicate || predicate(node)) && node.cullingStrategy !== undefined;
                }));
                return results;
            };
            Node.prototype.getChildren = function(predicate, directDescendantsOnly) {
                if (directDescendantsOnly === void 0) {
                    directDescendantsOnly = true;
                }
                return this.getDescendants(directDescendantsOnly, predicate);
            };
            Node.prototype._setReady = function(state) {
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
            Node.prototype.getAnimationByName = function(name) {
                for (var i = 0; i < this.animations.length; i++) {
                    var animation = this.animations[i];
                    if (animation.name === name) {
                        return animation;
                    }
                }
                return null;
            };
            Node.prototype.createAnimationRange = function(name, from, to) {
                if (!this._ranges[name]) {
                    this._ranges[name] = Node._AnimationRangeFactory(name, from, to);
                    for (var i = 0, nAnimations = this.animations.length; i < nAnimations; i++) {
                        if (this.animations[i]) {
                            this.animations[i].createRange(name, from, to);
                        }
                    }
                }
            };
            Node.prototype.deleteAnimationRange = function(name, deleteFrames) {
                if (deleteFrames === void 0) {
                    deleteFrames = true;
                }
                for (var i = 0, nAnimations = this.animations.length; i < nAnimations; i++) {
                    if (this.animations[i]) {
                        this.animations[i].deleteRange(name, deleteFrames);
                    }
                }
                this._ranges[name] = null;
            };
            Node.prototype.getAnimationRange = function(name) {
                return this._ranges[name];
            };
            Node.prototype.getAnimationRanges = function() {
                var animationRanges = [];
                var name;
                for (name in this._ranges) {
                    animationRanges.push(this._ranges[name]);
                }
                return animationRanges;
            };
            Node.prototype.beginAnimation = function(name, loop, speedRatio, onAnimationEnd) {
                var range = this.getAnimationRange(name);
                if (!range) {
                    return null;
                }
                return this._scene.beginAnimation(this, range.from, range.to, loop, speedRatio, onAnimationEnd);
            };
            Node.prototype.serializeAnimationRanges = function() {
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
            Node.prototype.computeWorldMatrix = function(force) {
                if (!this._worldMatrix) {
                    this._worldMatrix = _math.Matrix.Identity();
                }
                return this._worldMatrix;
            };
            Node.prototype.dispose = function(doNotRecurse, disposeMaterialAndTextures) {
                if (disposeMaterialAndTextures === void 0) {
                    disposeMaterialAndTextures = false;
                }
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
                } else {
                    this.parent = null;
                }
                this.onDisposeObservable.notifyObservers(this);
                this.onDisposeObservable.clear();
                for (var _a = 0, _b = this._behaviors; _a < _b.length; _a++) {
                    var behavior = _b[_a];
                    behavior.detach();
                }
                this._behaviors = [];
            };
            Node.ParseAnimationRanges = function(node, parsedNode, scene) {
                if (parsedNode.ranges) {
                    for (var index = 0; index < parsedNode.ranges.length; index++) {
                        var data = parsedNode.ranges[index];
                        node.createAnimationRange(data.name, data.from, data.to);
                    }
                }
            };
            Node.prototype.getHierarchyBoundingVectors = function(includeDescendants, predicate) {
                if (includeDescendants === void 0) {
                    includeDescendants = true;
                }
                if (predicate === void 0) {
                    predicate = null;
                }
                this.getScene().incrementRenderId();
                this.computeWorldMatrix(true);
                var min;
                var max;
                var thisAbstractMesh = this;
                if (thisAbstractMesh.getBoundingInfo && thisAbstractMesh.subMeshes) {
                    var boundingInfo = thisAbstractMesh.getBoundingInfo();
                    min = boundingInfo.boundingBox.minimumWorld;
                    max = boundingInfo.boundingBox.maximumWorld;
                } else {
                    min = new _math.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                    max = new _math.Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                }
                if (includeDescendants) {
                    var descendants = this.getDescendants(false);
                    for (var _i = 0, descendants_1 = descendants; _i < descendants_1.length; _i++) {
                        var descendant = descendants_1[_i];
                        var childMesh = descendant;
                        childMesh.computeWorldMatrix(true);
                        if (predicate && !predicate(childMesh)) {
                            continue;
                        }
                        if (!childMesh.getBoundingInfo || childMesh.getTotalVertices() === 0) {
                            continue;
                        }
                        var childBoundingInfo = childMesh.getBoundingInfo();
                        var boundingBox = childBoundingInfo.boundingBox;
                        var minBox = boundingBox.minimumWorld;
                        var maxBox = boundingBox.maximumWorld;
                        _tools.Tools.CheckExtends(minBox, min, max);
                        _tools.Tools.CheckExtends(maxBox, min, max);
                    }
                }
                return {
                    min: min,
                    max: max
                };
            };
            Node._AnimationRangeFactory = function(name, from, to) {
                throw _devTools._DevTools.WarnImport("AnimationRange");
            };
            Node._NodeConstructors = {};
            tslib_1.__decorate([ (0, _decorators.serialize)() ], Node.prototype, "name", void 0);
            tslib_1.__decorate([ (0, _decorators.serialize)() ], Node.prototype, "id", void 0);
            tslib_1.__decorate([ (0, _decorators.serialize)() ], Node.prototype, "uniqueId", void 0);
            tslib_1.__decorate([ (0, _decorators.serialize)() ], Node.prototype, "state", void 0);
            tslib_1.__decorate([ (0, _decorators.serialize)() ], Node.prototype, "metadata", void 0);
            return Node;
        }();
        exports.Node = Node;
    }, {
        "./Engines/engineStore": 12,
        "./Maths/math": 13,
        "./Misc/decorators": 17,
        "./Misc/devTools": 18,
        "./Misc/observable": 19,
        "./Misc/tools": 21,
        tslib: 4
    } ],
    24: [ function(require, module, exports) {
        "use strict";
        const Blocks = (index, transparent, color) => index + (transparent ? 0 : 1 << 15) + (color << 6);
        Blocks.empty = 0;
        class VoxelField {
            constructor(parcel) {
                this.parcel = parcel;
                const voxelSize = .5;
                const width = (parcel.x2 - parcel.x1) / voxelSize;
                const height = (parcel.y2 - parcel.y1) / voxelSize;
                const depth = (parcel.z2 - parcel.z1) / voxelSize;
                this.resolution = [ width, height, depth ];
            }
            get width() {
                return this.resolution[0];
            }
            get height() {
                return this.resolution[1];
            }
            get depth() {
                return this.resolution[2];
            }
            serialize() {
                console.log("Not implemented");
            }
        }
        module.exports = {
            Blocks: Blocks,
            VoxelField: VoxelField
        };
    }, {} ],
    25: [ function(require, module, exports) {
        var objectCreate = Object.create || objectCreatePolyfill;
        var objectKeys = Object.keys || objectKeysPolyfill;
        var bind = Function.prototype.bind || functionBindPolyfill;
        function EventEmitter() {
            if (!this._events || !Object.prototype.hasOwnProperty.call(this, "_events")) {
                this._events = objectCreate(null);
                this._eventsCount = 0;
            }
            this._maxListeners = this._maxListeners || undefined;
        }
        module.exports = EventEmitter;
        EventEmitter.EventEmitter = EventEmitter;
        EventEmitter.prototype._events = undefined;
        EventEmitter.prototype._maxListeners = undefined;
        var defaultMaxListeners = 10;
        var hasDefineProperty;
        try {
            var o = {};
            if (Object.defineProperty) Object.defineProperty(o, "x", {
                value: 0
            });
            hasDefineProperty = o.x === 0;
        } catch (err) {
            hasDefineProperty = false;
        }
        if (hasDefineProperty) {
            Object.defineProperty(EventEmitter, "defaultMaxListeners", {
                enumerable: true,
                get: function() {
                    return defaultMaxListeners;
                },
                set: function(arg) {
                    if (typeof arg !== "number" || arg < 0 || arg !== arg) throw new TypeError('"defaultMaxListeners" must be a positive number');
                    defaultMaxListeners = arg;
                }
            });
        } else {
            EventEmitter.defaultMaxListeners = defaultMaxListeners;
        }
        EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
            if (typeof n !== "number" || n < 0 || isNaN(n)) throw new TypeError('"n" argument must be a positive number');
            this._maxListeners = n;
            return this;
        };
        function $getMaxListeners(that) {
            if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
            return that._maxListeners;
        }
        EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
            return $getMaxListeners(this);
        };
        function emitNone(handler, isFn, self) {
            if (isFn) handler.call(self); else {
                var len = handler.length;
                var listeners = arrayClone(handler, len);
                for (var i = 0; i < len; ++i) listeners[i].call(self);
            }
        }
        function emitOne(handler, isFn, self, arg1) {
            if (isFn) handler.call(self, arg1); else {
                var len = handler.length;
                var listeners = arrayClone(handler, len);
                for (var i = 0; i < len; ++i) listeners[i].call(self, arg1);
            }
        }
        function emitTwo(handler, isFn, self, arg1, arg2) {
            if (isFn) handler.call(self, arg1, arg2); else {
                var len = handler.length;
                var listeners = arrayClone(handler, len);
                for (var i = 0; i < len; ++i) listeners[i].call(self, arg1, arg2);
            }
        }
        function emitThree(handler, isFn, self, arg1, arg2, arg3) {
            if (isFn) handler.call(self, arg1, arg2, arg3); else {
                var len = handler.length;
                var listeners = arrayClone(handler, len);
                for (var i = 0; i < len; ++i) listeners[i].call(self, arg1, arg2, arg3);
            }
        }
        function emitMany(handler, isFn, self, args) {
            if (isFn) handler.apply(self, args); else {
                var len = handler.length;
                var listeners = arrayClone(handler, len);
                for (var i = 0; i < len; ++i) listeners[i].apply(self, args);
            }
        }
        EventEmitter.prototype.emit = function emit(type) {
            var er, handler, len, args, i, events;
            var doError = type === "error";
            events = this._events;
            if (events) doError = doError && events.error == null; else if (!doError) return false;
            if (doError) {
                if (arguments.length > 1) er = arguments[1];
                if (er instanceof Error) {
                    throw er;
                } else {
                    var err = new Error('Unhandled "error" event. (' + er + ")");
                    err.context = er;
                    throw err;
                }
                return false;
            }
            handler = events[type];
            if (!handler) return false;
            var isFn = typeof handler === "function";
            len = arguments.length;
            switch (len) {
              case 1:
                emitNone(handler, isFn, this);
                break;

              case 2:
                emitOne(handler, isFn, this, arguments[1]);
                break;

              case 3:
                emitTwo(handler, isFn, this, arguments[1], arguments[2]);
                break;

              case 4:
                emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
                break;

              default:
                args = new Array(len - 1);
                for (i = 1; i < len; i++) args[i - 1] = arguments[i];
                emitMany(handler, isFn, this, args);
            }
            return true;
        };
        function _addListener(target, type, listener, prepend) {
            var m;
            var events;
            var existing;
            if (typeof listener !== "function") throw new TypeError('"listener" argument must be a function');
            events = target._events;
            if (!events) {
                events = target._events = objectCreate(null);
                target._eventsCount = 0;
            } else {
                if (events.newListener) {
                    target.emit("newListener", type, listener.listener ? listener.listener : listener);
                    events = target._events;
                }
                existing = events[type];
            }
            if (!existing) {
                existing = events[type] = listener;
                ++target._eventsCount;
            } else {
                if (typeof existing === "function") {
                    existing = events[type] = prepend ? [ listener, existing ] : [ existing, listener ];
                } else {
                    if (prepend) {
                        existing.unshift(listener);
                    } else {
                        existing.push(listener);
                    }
                }
                if (!existing.warned) {
                    m = $getMaxListeners(target);
                    if (m && m > 0 && existing.length > m) {
                        existing.warned = true;
                        var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + ' "' + String(type) + '" listeners ' + "added. Use emitter.setMaxListeners() to " + "increase limit.");
                        w.name = "MaxListenersExceededWarning";
                        w.emitter = target;
                        w.type = type;
                        w.count = existing.length;
                        if (typeof console === "object" && console.warn) {
                            console.warn("%s: %s", w.name, w.message);
                        }
                    }
                }
            }
            return target;
        }
        EventEmitter.prototype.addListener = function addListener(type, listener) {
            return _addListener(this, type, listener, false);
        };
        EventEmitter.prototype.on = EventEmitter.prototype.addListener;
        EventEmitter.prototype.prependListener = function prependListener(type, listener) {
            return _addListener(this, type, listener, true);
        };
        function onceWrapper() {
            if (!this.fired) {
                this.target.removeListener(this.type, this.wrapFn);
                this.fired = true;
                switch (arguments.length) {
                  case 0:
                    return this.listener.call(this.target);

                  case 1:
                    return this.listener.call(this.target, arguments[0]);

                  case 2:
                    return this.listener.call(this.target, arguments[0], arguments[1]);

                  case 3:
                    return this.listener.call(this.target, arguments[0], arguments[1], arguments[2]);

                  default:
                    var args = new Array(arguments.length);
                    for (var i = 0; i < args.length; ++i) args[i] = arguments[i];
                    this.listener.apply(this.target, args);
                }
            }
        }
        function _onceWrap(target, type, listener) {
            var state = {
                fired: false,
                wrapFn: undefined,
                target: target,
                type: type,
                listener: listener
            };
            var wrapped = bind.call(onceWrapper, state);
            wrapped.listener = listener;
            state.wrapFn = wrapped;
            return wrapped;
        }
        EventEmitter.prototype.once = function once(type, listener) {
            if (typeof listener !== "function") throw new TypeError('"listener" argument must be a function');
            this.on(type, _onceWrap(this, type, listener));
            return this;
        };
        EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
            if (typeof listener !== "function") throw new TypeError('"listener" argument must be a function');
            this.prependListener(type, _onceWrap(this, type, listener));
            return this;
        };
        EventEmitter.prototype.removeListener = function removeListener(type, listener) {
            var list, events, position, i, originalListener;
            if (typeof listener !== "function") throw new TypeError('"listener" argument must be a function');
            events = this._events;
            if (!events) return this;
            list = events[type];
            if (!list) return this;
            if (list === listener || list.listener === listener) {
                if (--this._eventsCount === 0) this._events = objectCreate(null); else {
                    delete events[type];
                    if (events.removeListener) this.emit("removeListener", type, list.listener || listener);
                }
            } else if (typeof list !== "function") {
                position = -1;
                for (i = list.length - 1; i >= 0; i--) {
                    if (list[i] === listener || list[i].listener === listener) {
                        originalListener = list[i].listener;
                        position = i;
                        break;
                    }
                }
                if (position < 0) return this;
                if (position === 0) list.shift(); else spliceOne(list, position);
                if (list.length === 1) events[type] = list[0];
                if (events.removeListener) this.emit("removeListener", type, originalListener || listener);
            }
            return this;
        };
        EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
            var listeners, events, i;
            events = this._events;
            if (!events) return this;
            if (!events.removeListener) {
                if (arguments.length === 0) {
                    this._events = objectCreate(null);
                    this._eventsCount = 0;
                } else if (events[type]) {
                    if (--this._eventsCount === 0) this._events = objectCreate(null); else delete events[type];
                }
                return this;
            }
            if (arguments.length === 0) {
                var keys = objectKeys(events);
                var key;
                for (i = 0; i < keys.length; ++i) {
                    key = keys[i];
                    if (key === "removeListener") continue;
                    this.removeAllListeners(key);
                }
                this.removeAllListeners("removeListener");
                this._events = objectCreate(null);
                this._eventsCount = 0;
                return this;
            }
            listeners = events[type];
            if (typeof listeners === "function") {
                this.removeListener(type, listeners);
            } else if (listeners) {
                for (i = listeners.length - 1; i >= 0; i--) {
                    this.removeListener(type, listeners[i]);
                }
            }
            return this;
        };
        EventEmitter.prototype.listeners = function listeners(type) {
            var evlistener;
            var ret;
            var events = this._events;
            if (!events) ret = []; else {
                evlistener = events[type];
                if (!evlistener) ret = []; else if (typeof evlistener === "function") ret = [ evlistener.listener || evlistener ]; else ret = unwrapListeners(evlistener);
            }
            return ret;
        };
        EventEmitter.listenerCount = function(emitter, type) {
            if (typeof emitter.listenerCount === "function") {
                return emitter.listenerCount(type);
            } else {
                return listenerCount.call(emitter, type);
            }
        };
        EventEmitter.prototype.listenerCount = listenerCount;
        function listenerCount(type) {
            var events = this._events;
            if (events) {
                var evlistener = events[type];
                if (typeof evlistener === "function") {
                    return 1;
                } else if (evlistener) {
                    return evlistener.length;
                }
            }
            return 0;
        }
        EventEmitter.prototype.eventNames = function eventNames() {
            return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
        };
        function spliceOne(list, index) {
            for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) list[i] = list[k];
            list.pop();
        }
        function arrayClone(arr, n) {
            var copy = new Array(n);
            for (var i = 0; i < n; ++i) copy[i] = arr[i];
            return copy;
        }
        function unwrapListeners(arr) {
            var ret = new Array(arr.length);
            for (var i = 0; i < ret.length; ++i) {
                ret[i] = arr[i].listener || arr[i];
            }
            return ret;
        }
        function objectCreatePolyfill(proto) {
            var F = function() {};
            F.prototype = proto;
            return new F;
        }
        function objectKeysPolyfill(obj) {
            var keys = [];
            for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
            }
            return k;
        }
        function functionBindPolyfill(context) {
            var fn = this;
            return function() {
                return fn.apply(context, arguments);
            };
        }
    }, {} ]
}, {}, [ 2 ]);