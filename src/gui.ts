import { Feature } from "./feature";
import { guiControl, guiControlOptions } from "./lib/guiControl";
import * as uuid from "uuid";

/* @internal */
export type GUIOptions = { billBoardMode: 1 | 2 | 0 };
/* @internal */
export default class FeatureBasicGUI {
  billBoardMode = 1;
  feature: Feature;
  uuid: string;
  id: string = undefined!;
  private _listOfControls: guiControl[];
  showing: boolean = false;
  constructor(feature: Feature, options: GUIOptions = { billBoardMode: 2 }) {
    this.feature = feature;
    //@ts-expect-error
    this.uuid = uuid.default? uuid.default.v4():uuid.v4();
    this._listOfControls = [];

    if (options) {
      if (
        options.billBoardMode == 0 || // BILLBOARD_NONE
        options.billBoardMode == 1 || // BILLBOARD_X
        options.billBoardMode == 2 // BILLBOARD_Y
      ) {
        this.billBoardMode = options.billBoardMode;
      } else {
        this.billBoardMode = 2;
      }
    }
  }

  addButton(
    text: string | null = null,
    positionInGrid: [number, number] = [0, 0],
    id: string | null = null
  ) {
    if (!id) {
      id = "unknown" + this._listOfControls.length + 1;
    }
    if (!text) {
      text = "Text";
    }
    const control = new guiControl(this, {
      type: "button",
      id,
      text,
      positionInGrid,
    });
    if (this._replacesOldControl(control)) {
      return control;
    }
    if (this._listOfControls.length > 15) {
      this._listOfControls.pop();
    }
    this._listOfControls.push(control);
    return control;
  }

  addText(
    text: string | null = null,
    positionInGrid: [number, number] = [0, 0],
    id?: string
  ) {
    if (!text) {
      text = "Text";
    }
    const control = new guiControl(this, {
      type: "text",
      id,
      text,
      positionInGrid,
    });
    if (this._replacesOldControl(control)) {
      return control;
    }
    if (this._listOfControls.length > 15) {
      this._listOfControls.pop();
    }
    this._listOfControls.push(control);
    return control;
  }

  private _replacesOldControl(control: guiControl) {
    // Replace a control if the position is the same as another.
    let controlToReplace = this.getControlByPosition(control.positionInGrid);
    if (controlToReplace) {
      let i = this._listOfControls.indexOf(controlToReplace);
      this._listOfControls[i] = control;
      return true;
    }
    return false;
  }

  get defaultControl(): guiControlOptions {
    return {
      type: "text",
      text: "Text",
      id: undefined,
      positionInGrid: [0, 0],
    };
  }

  getControlById(id: string) {
    return this._listOfControls.find((control) => control.id == id);
  }

  getControlByUuid(uuid: string) {
    return this._listOfControls.find((control) => control.uuid == uuid);
  }

  getControlByPosition(positionInGrid: [number, number]) {
    return this._listOfControls.find(
      (control) =>
        control.positionInGrid[0] == positionInGrid[0] &&
        control.positionInGrid[1] == positionInGrid[1]
    );
  }

  serialize() {
    const listOfControls = Array.from(this._listOfControls).map(
      (control) => control.summary
    );
    return {
      uuid: this.uuid,
      listOfControls: listOfControls,
      billBoardMode: this.billBoardMode,
    };
  }

  get listOfControls(): guiControl[] {
    return this._listOfControls;
  }

  show() {
    if (!this._listOfControls || !this._listOfControls.length) {
      this._listOfControls[0] = new guiControl(this, this.defaultControl);
    }
    if (this._listOfControls.length > 15) {
      this._listOfControls = this._listOfControls.slice(0, 15);
    }

    this.feature.parcel.broadcast({
      type: "create-feature-gui",
      uuid: this.feature.uuid,
      gui: this.serialize(),
    });
    this.showing = true;
  }

  destroy() {
    this.feature.parcel.broadcast({
      type: "destroy-feature-gui",
      uuid: this.feature.uuid,
    });
    this._listOfControls = [];
    this.showing = false;
  }
}
