import { EventEmitter } from "events";
import FeatureBasicGUI from "../gui";
import * as uuid from "uuid";
/* @internal */
export type guiControlOptions = {
  type: "button" | "text";
  id?: string;
  text?: string;
  fontSizePx?: string;
  height?: string | number;
  positionInGrid?: [number, number];
};
/* @internal */
export class guiControl extends EventEmitter {
  id?: string;
  private _uuid: string;
  gui: FeatureBasicGUI;
  type: "button" | "text";
  positionInGrid: [number, number];
  text?: string;
  constructor(gui: FeatureBasicGUI, options: guiControlOptions) {
    super();
    if (!options) {
      options = {
        type: "text",
        id: undefined,
        text: "Text",
        positionInGrid: [0, 0],
      };
    }
    this.gui = gui;
    //@ts-expect-error
    this._uuid = uuid.default ? uuid.default.v4() : uuid.v4();
    this.type = options.type || "text";
    this.id = options.id;
    this.text = options.text || "Text";
    this.positionInGrid = options.positionInGrid || [0, 0];
  }

  get uuid() {
    return this._uuid;
  }

  get summary() {
    return {
      uuid: this._uuid,
      type: this.type,
      id: this.id,
      text: this.text,
      positionInGrid: this.positionInGrid,
    };
  }

  remove() {
    if (this.gui && this.gui.listOfControls.length > 0) {
      this.gui.listOfControls.splice(this.gui.listOfControls.indexOf(this), 1);
    }
    this.gui.show();
  }

  update() {
    if (this.gui && this.gui.showing) {
      this.gui.feature.parcel.broadcast({
        type: "update-feature-gui",
        uuid: this.gui.feature.uuid,
        control: this.summary,
      });
    }
  }
}
