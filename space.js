const Parcel = require("./index");

class Space extends Parcel {
  constructor(id) {
    super();
    this.id = id;
    this.players = [];
    this.featuresList = [];
  }

  _fetchSnapshots() {}
  _setSnapshot() {}
}

module.exports = Space;
