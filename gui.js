const uuid = require("uuid/v4");
const EventEmitter = require("events");
class FeatureBasicGUI {
  billBoardMode = 1;
  constructor(feature, options = { billBoardMode: 2 }) {
    this.feature = feature;
    this.uuid = uuid();
    this._listOfControls = [];
    this.showing = false;

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

  addButton(text = null, positionInGrid = [0, 0], id = null) {
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

  addText(text = null, positionInGrid = [0, 0], id = null) {
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

  _replacesOldControl(control) {
    // Replace a control if the position is the same as another.
    let controlToReplace = this.getControlByPosition(control.positionInGrid);
    if (controlToReplace) {
      let i = this._listOfControls.indexOf(controlToReplace);
      this._listOfControls[i] = control;
      return true;
    }
    return false;
  }

  get defaultControl() {
    return { type: "text", text: "Text", id: null, positionInGrid: [0, 0] };
  }

  getControlById(id) {
    return this._listOfControls.find((control) => control.id == id);
  }

  getControlByUuid(uuid) {
    return this._listOfControls.find((control) => control.uuid == uuid);
  }

  getControlByPosition(positionInGrid) {
    return this._listOfControls.find(
      (control) =>
        control.positionInGrid[0] == positionInGrid[0] &&
        control.positionInGrid[1] == positionInGrid[1]
    );
  }

  get listOfControls() {
    const _listOfControls = Array.from(this._listOfControls);

    return _listOfControls.map((control) => {
      return control.summary;
    });
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
      gui: {
        uuid: this.uuid,
        listOfControls: this.listOfControls,
        billBoardMode: this.billBoardMode,
      },
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

class guiControl extends EventEmitter {
  constructor(gui, options) {
    super();
    if (!options) {
      options = {
        type: "text",
        id: null,
        text: "Text",
        positionInGrid: [0, 0],
      };
    }
    this.gui = gui;
    this._uuid = uuid();
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
    if (this.gui && this.gui._listOfControls.length > 0) {
      this.gui._listOfControls.splice(
        this.gui._listOfControls.indexOf(this),
        1
      );
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

module.exports = FeatureBasicGUI;