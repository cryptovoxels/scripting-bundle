import { Vector3 } from "@babylonjs/core/Maths/math";
import { MoveMessage } from "./lib/messages";

import { CollectibleType, PlayerDescription } from "./lib/types";

import { EventEmitter } from "events";
import Parcel from "./parcel";
const throttle = require("lodash.throttle");

/* @internal */
export class Player extends EventEmitter {
  collectibles: CollectibleType[];
  private _token: string;
  private _iswithinParcel: boolean;
  uuid: string;
  parcel: Parcel;
  name: string | undefined;
  wallet: string | undefined;
  position: Vector3;
  rotation: Vector3;
  private _numTeleport: number = 0;
  constructor(description: PlayerDescription, parcel: Parcel) {
    super();
    Object.assign(this, description);
    this.parcel = parcel;
    this._token = description && description._token;
    this.uuid = description && description.uuid;
    this.name = description && description.name;
    this.wallet = description && description.wallet;
    this._iswithinParcel = false;
    this.position = new Vector3();
    this.rotation = new Vector3();
    this.collectibles = (description && description.collectibles) || [];
  }

  emote = throttle(
    (emoji: string) => {
      if (!this.isWithinParcel) {
        // don't allow this if user is outside parcel
        return;
      }

      if (!emojis.includes(emoji)) {
        return;
      }
      this.parcel.broadcast({
        type: "player-emote",
        uuid: this.uuid,
        emote: emoji,
      });
    },
    500,
    { leading: true, trailing: false }
  );

  animate = throttle((animation: string) => {}, 10000, {
    leading: true,
    trailing: false,
  });

  get isWithinParcel() {
    return this._iswithinParcel;
  }
  set isWithinParcel(within: boolean) {
    this._iswithinParcel = !!within;
  }

  get token() {
    return this._token;
  }

  _set(playerInfo: Partial<PlayerDescription> | null = null) {
    if (!playerInfo) {
      return;
    }
    if (playerInfo.name) {
      this.name = playerInfo.name;
    }
    if (playerInfo.wallet) {
      this.wallet = playerInfo.wallet;
    }
    if (typeof playerInfo._iswithinParcel !== undefined) {
      this._iswithinParcel = !!playerInfo._iswithinParcel;
    }
    if (playerInfo.collectibles) {
      this.collectibles = playerInfo.collectibles;
    }
  }

  isLoggedIn() {
    return !!this.wallet && !!this.wallet.match(/^(0x)?[0-9a-f]{40}$/i);
  }

  teleportTo(coords: string) {
    if (!this.isWithinParcel) {
      // don't allow this if user is outside parcel
      return;
    }
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
      type: "player-teleport",
      uuid: this.uuid,
      coordinates: coords,
    });
  }

  hasWearable(tokenId: number, collectionId: number = 1) {
    return !!this.collectibles.find((c) => {
      let collection_id = c.collection_id || 1;
      return c.wearable_id == tokenId && collectionId == collection_id;
    });
  }
  /**
   *
   * @param {string} contract the contract address
   * @param {string|number} tokenId the token id
   * @param {(boolean)=>void} successCallback A callback called on success and has a boolean (whether player has NFT or not) as argument
   * @param {(string)=>void} failCallback Callback called on fail. With a string as arugment (the reason)
   * @returns
   */
  hasEthereumNFT(
    contract: string,
    tokenId: string | number,
    successCallback: Function | null = null,
    failCallback: Function | null = null
  ) {
    if (!this.isLoggedIn()) {
      return false;
    }
    if (typeof tokenId !== "number" && typeof tokenId !== "string") {
      console.error("[Scripting] token id is invalid");
      return false;
    }
    if (typeof tokenId == "number") {
      tokenId = tokenId.toString();
    }

    if (
      typeof contract !== "string" ||
      (typeof contract == "string" && contract.substring(0, 2) !== "0x")
    ) {
      console.error("[Scripting] contract address is invalid");
      return false;
    }

    let api_url = `https://api.opensea.io/api/v1/asset/${contract}/${tokenId}?account_address=${this.wallet}`;
    let promise;
    if (typeof global == "undefined" || !global.fetchJson) {
      /* fetch doesn't work nicely on the grid. So we use 'fetchJson' when on scripthost, and fetch() when local */
      promise = fetch(api_url).then((r) => r.json());
    } else {
      promise = fetchJson(api_url);
    }

    promise
      .then((r) => {
        if (!r) {
          failCallback && failCallback("no data by opensea, try again later");
          return false;
        }
        let ownsAsset = true; // default is true
        if (!r.ownership) {
          // Opensea sends empty ownership when not owner
          ownsAsset = false;
        }
        if (ownsAsset && !r.ownership.owner) {
          ownsAsset = false;
        }

        if (ownsAsset) {
          ownsAsset =
            r.ownership.owner.address.toLowerCase() ==
            this.wallet?.toLowerCase();
        }

        if (successCallback) {
          successCallback(ownsAsset);
        } else {
          console.error('[Scripting] No callback given to "hasEthereumNFT"');
          console.log(`[Scripting] hasNFT = ${ownsAsset}`);
        }
        return ownsAsset;
      })
      .catch((e) => {
        failCallback && failCallback("error fetching the data");
        console.error("[Scripting]", e);
      });
  }

  get isAnonymous() {
    return !!this.isLoggedIn();
  }

  onMove = (msg: MoveMessage) => {
    if (!msg) {
      return;
    }
    this.position.set(msg.position[0], msg.position[1], msg.position[2]);
    this.rotation.set(msg.rotation[0], msg.rotation[1], msg.rotation[2]);
    this.emit("move", msg);
  };

  kick(reason: string | undefined = undefined) {
    if (!this.isWithinParcel) {
      // don't allow this if user is outside parcel
      return;
    }
    if (this.wallet == this.parcel.owner) {
      console.log("[Scripting] Cannot kick the owner");
      return;
    }
    if (this.uuid) {
      this.parcel.broadcast({
        type: "player-kick",
        uuid: this.uuid,
        reason: reason,
      });
    }
  }
}
