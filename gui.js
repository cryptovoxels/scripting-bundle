const uuid = require("uuid/v4");
const EventEmitter = require("events");

class FeatureBasicGUI extends EventEmitter {
  constructor(feature) {
    super();
    this.feature = feature;
    this.uuid = uuid();
    this.listOfControls = [];
    this.showing = false;
  }

  addButton(text = null, id = null, positionInGrid = [0, 0]) {
    if (!id) {
      id = "unknown" + this.listOfControls.length + 1;
    }
    if (!text) {
      text = "Text";
    }
    const control = { type: "button", id, text, positionInGrid };
    if(this.replacesOldControl(control)){
      return control
    }
    this.listOfControls.push(control);
    return control;
  }

  addText(text = null, positionInGrid = [0, 0]) {
    if (!text) {
      text = "Text";
    }
    const control = { type: "text", text, positionInGrid };
    if(this.replacesOldControl(control)){
      return control
    }
    this.listOfControls.push(control);
    return control;
  }

  replacesOldControl(control) {
    // Replace a control if the position is the same as another.
    let controlToReplace = this.getControlByPosition(control.positionInGrid);
    if (controlToReplace) {
      let i = this.listOfControls.indexOf(controlToReplace);
      this.listOfControls[i] = control;
      return true;
    }
    return false
  }

  get defaultControl() {
    return { type: "text", text: "Text", positionInGrid: [0, 0] };
  }

  removeControl(id) {
    let c = this.getControlById(id);
    this.listOfControls.splice(this.listOfControls.indexOf(c), 1);
  }

  getControlById(id) {
    return this.listOfControls.find((control) => control.id == id);
  }
  getControlByPosition(positionInGrid) {
    return this.listOfControls.find(
      (control) =>
        control.positionInGrid[0] == positionInGrid[0] &&
        control.positionInGrid[1] == positionInGrid[1]
    );
  }

  show() {
    if (!this.listOfControls || !this.listOfControls.length) {
      this.listOfControls[0] = this.defaultControl;
    }
    this.feature.parcel.broadcast({
      type: "create-feature-gui",
      uuid: this.feature.uuid,
      gui: { uuid: this.uuid, listOfControls: this.listOfControls },
    });
    this.showing = true;
  }

  hide() {
    this.feature.parcel.broadcast({
      type: "destroy-feature-gui",
      uuid: this.feature.uuid,
    });
    this.showing = false;
    this.feature.guiShowing = null;
  }

  update(){
    this.show()
  }
}

module.exports = FeatureBasicGUI;
