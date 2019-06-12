const uuid = require('uuid/v4')
const B = require('babylonjs')
const _ = require('lodash')

class Feature {
  constructor (parcel, obj) {
    this.parcel = parcel
    this.uuid = obj.uuid
    this.content = obj

    this.mutated = _.throttle(() => {
      let s = Object.assign({}, this.content)

      this._position.toArray(s.position)
      this._rotation.toArray(s.rotation)
      this._scale.toArray(s.scale)

      console.log(`Mutated`)

      this.set(s)
    }, 10)

    let handler = attr => {
      return {
        set (target, key, value) {
          console.log(`Setting ${attr}.${key} as ${value}`)
          target[key] = value
          this.mutated()
          return value
        }
      }
    }

    this._position = new B.Vector3()
    this.position = Proxy(this._position, handler)

    this._rotation = new B.Vector3()
    this.rotation = Proxy(this._rotation, handler)

    this._scale = new B.Vector3()
    this.scale = Proxy(this._scale, handler)

    this.updateVectors()
  }

  get id () {
    return this.content.id
  }

  set (dict) {
    Object.assign(this.content, dict)

    this.updateVectors()
    this.save()
  }

  updateVectors () {
    this._position.set(this.content.position[0], this.content.position[1], this.content.position[2])
    this._rotation.set(this.content.position[0], this.content.position[1], this.content.position[2])
    this._scale.set(this.content.scale[0], this.content.scale[1], this.content.scale[2])
  }

  save () {
    this.parcel.broadcast({
      type: 'update',
      uuid: this.uuid,
      content: this.content
    })
  }
}

module.exports = Feature
