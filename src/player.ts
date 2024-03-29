import { Vector3 } from "@babylonjs/core/Maths/math";
import { MoveMessage } from "./lib/messages";

import { CollectibleType, PlayerDescription } from "./lib/types";
import fetch from "node-fetch";
import { EventEmitter } from "events";
import Parcel from "./parcel";
//@ts-ignore
import throttle from "lodash.throttle";
/* @internal */
export class Player extends EventEmitter {
  collectibles: CollectibleType[];
  private _token: string;
  private _iswithinParcel: boolean;
  readonly uuid: string;
  parcel: Parcel;
  name: string | undefined;
  wallet: string | undefined;
  position: Vector3;
  rotation: Vector3;
  constructor(description: PlayerDescription, parcel: Parcel) {
    super();
    Object.assign(this, description);
    this.parcel = parcel;
    this._token = description && description._token;
    this.uuid = description && description.uuid;
    this.name = description && description.name;
    this.wallet = description && description.wallet;
    this._iswithinParcel = false;
    this.position = Vector3.Zero();
    this.rotation = Vector3.Zero();
    this.collectibles = (description && description.collectibles) || [];
  }

  emote = throttle(
    (emoji: string) => {
      if (!this.isWithinParcel) {
        // don't allow this if user is outside parcel
        console.error("[Scripting] User outside parcel, can't emote!");
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
  /**
   * Animate the avatar
   * @deprecated
   */
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
    if (typeof playerInfo._iswithinParcel !== "undefined") {
      this.isWithinParcel = !!playerInfo._iswithinParcel;
    }
    if (playerInfo.collectibles) {
      this.collectibles = playerInfo.collectibles;
    }
  }

  isLoggedIn() {
    return !!this.wallet && !!this.wallet.match(/^(0x)?[0-9a-f]{40}$/i);
  }
  /**
   * Teleports the avatar to a coordinate
   * @param coords string of coordinates, eg: NE@47W,250N
   */
  teleportTo = throttle(
    (coords: string) => {
      if (!this.isWithinParcel) {
        // don't allow this if user is outside parcel
        return;
      }
      if (!coords || coords == "") {
        return;
      }
      this.parcel.broadcast({
        type: "player-teleport",
        uuid: this.uuid,
        coordinates: coords,
      });
    },
    1000,
    { trailing: false, leading: true }
  ) as (coords: string) => void;

  hasWearable(tokenId: number, collectionId: number = 1) {
    return !!this.collectibles.find((c) => {
      let collection_id = c.collection_id || 1;
      return c.wearable_id == tokenId && collectionId == collection_id;
    });
  }
  /**
   * @deprecated Use hasNFT() in the future.
   * @param {string} contract the contract address
   * @param {string|number} tokenId the token id
   * @param {(boolean)=>void} successCallback A callback called on success and has a boolean (whether player has NFT or not) as argument
   * @param {(string)=>void} failCallback Callback called on fail. With a string as arugment (the reason)
   * @returns
   */
  hasEthereumNFT = (
    contract: string,
    tokenId: string | number,
    successCallback: ((bool: boolean) => void) | null = null,
    failCallback: ((reason: string) => void) | null = null
  ) => {
    if (!this.isLoggedIn()) {
      failCallback && failCallback("User is not logged in");
      return false;
    }
    if (typeof tokenId !== "number" && typeof tokenId !== "string") {
      console.error("[Scripting] token id is invalid");
      failCallback && failCallback("Invalid token id");
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
    let url = `https://www.voxels.com/api/avatar/owns/eth/${contract}/${tokenId}?wallet=${this.wallet}`;
    let promise;
    if (typeof global == "undefined" || !global.fetchJson) {
      /* fetch doesn't work nicely on the grid. So we use 'fetchJson' when on scripthost, and fetch() when local */
      promise = fetch(url).then((r) => r.json());
    } else {
      promise = fetchJson(url);
    }

    promise
      .then((r: { success: boolean; ownsToken?: boolean }) => {
        if (!r) {
          failCallback && failCallback("no data by opensea, try again later");
          return false;
        }
        let ownsAsset = !!r.ownsToken;

        if (successCallback) {
          successCallback(ownsAsset);
        } else {
          console.error('[Scripting] No callback given to "hasEthereumNFT"');
          console.log(`[Scripting] hasNFT = ${ownsAsset}`);
        }
        return ownsAsset;
      })
      .catch((e) => {
        failCallback && failCallback(e.toString() || "error fetching the data");
        console.error("[Scripting]", e);
      });
  };

  /**
   * Will Fetch whether the player has the given NFT and return the value using the callbacks provided
   * @param {string} chain the chain identifier: 'eth' or 'matic'
   * @param {string} contract the contract address
   * @param {string|number} tokenId the token id
   * @param {(boolean)=>void} successCallback A callback called on success and has a boolean (whether player has NFT or not) as argument
   * @param {(string)=>void} failCallback Callback called on fail. With a string as arugment (the reason)
   * @returns
   */
  hasNFT = (
    chain: string,
    contract: string,
    tokenId: string | number,
    successCallback: ((bool: boolean) => void) | null = null,
    failCallback: ((reason: string) => void) | null = null
  ) => {
    if (!this.isLoggedIn()) {
      failCallback && failCallback("User is not logged in");
      return false;
    }
    if (typeof tokenId !== "number" && typeof tokenId !== "string") {
      console.error("[Scripting] token id is invalid");
      failCallback && failCallback("Invalid token id");
      return false;
    }
    if (typeof tokenId == "number") {
      tokenId = tokenId.toString();
    }
    if (chain !== "eth" && chain !== "matic") {
      console.error("[Scripting] chain unsupported");
      failCallback && failCallback("Invalid chain");
    }

    if (
      typeof contract !== "string" ||
      (typeof contract == "string" && contract.substring(0, 2) !== "0x")
    ) {
      console.error("[Scripting] contract address is invalid");
      return false;
    }
    let url = `https://www.voxels.com/api/avatar/owns/${chain}/${contract}/${tokenId}?wallet=${this.wallet}`;
    let promise;
    if (typeof global == "undefined" || !global.fetchJson) {
      /* fetch doesn't work nicely on the grid. So we use 'fetchJson' when on scripthost, and fetch() when local */
      promise = fetch(url).then((r) => r.json());
    } else {
      promise = fetchJson(url);
    }

    promise
      .then((r: { success: boolean; ownsToken?: boolean }) => {
        if (!r) {
          failCallback && failCallback("Could not reach API, try again later");
          return false;
        }
        let ownsAsset = !!r.ownsToken;

        if (successCallback) {
          successCallback(ownsAsset);
        } else {
          console.error('[Scripting] No callback given to "hasNFT"');
          console.log(`[Scripting] hasNFT = ${ownsAsset}`);
        }
        return ownsAsset;
      })
      .catch((e) => {
        failCallback && failCallback(e.toString() || "error fetching the data");
        console.error("[Scripting]", e);
      });
  };

  get isAnonymous() {
    return !this.isLoggedIn();
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

  ///@private
  private _askForCrypto(
    quantity: number = 0.01,
    to: string = this.parcel.owner,
    chain_id: number = 1,
    erc20Address?: string
  ) {
    this.parcel.broadcast({
      type: "player-askcrypto",
      uuid: this.uuid,
      cryptoData: { quantity, to, chain_id, erc20Address },
    });
  }

  /**
   * Asks the given player for crypto. Throttled to 1.5s
   * This function is also ONLY available when the player has recently clicked.
   * @param {number} quantity the quantity to send, default 0.01
   * @param {string} to The receiver of the crypto; leave empty for parcel owner
   * @param {string} erc20Address Optional, Address of erc20 to send.
   * @param {number} chain_id Optional,The network id if any erc20 address is given. (1=mainnet,137= polygon)
   *
   * ```ts
   * feature.on('click',e=>{
   *   e.player.askForCrypto(1,137)
   * })
   * ```
   */
  askForCrypto = throttle(
    (
      quantity: number = 0.01,
      chain_id: number = 1,
      to: string = this.parcel.owner,
      erc20Address?: string
    ) => {
      this._askForCrypto(quantity, to, chain_id, erc20Address);
    },
    1500,
    { trailing: false, leading: true }
  ) as (
    quantity: number,
    chain_id?: number,
    to?: string,
    erc20Address?: string
  ) => void;
}
