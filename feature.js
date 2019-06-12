const uuid = require('uuid/v4')

class Feature {
  constructor (parcel, obj) {
    this.parcel = parcel
    this.uuid = obj.uuid
    this.content = obj
  }

  get id () {
    return this.content.id
  }

  set (dict) {
    Object.assign(this.content, dict)
    this.save()
  }

  save () {
    this.parcel.broadcast({
      type: 'feature-update',
      uuid: this.uuid,
      content: this.content
    })
  }
}

module.exports = Feature
