// const uuid = require('uuid/v4')
const B = require('babylonjs')
const _ = require('lodash')

class Feature {
  constructor (parcel, obj) {
    this.parcel = parcel
    this.uuid = obj.uuid
    this._content = obj

    let mutated = _.throttle(() => {
      let s = Object.assign({}, this._content)

      this._position.toArray(s.position)
      this._rotation.toArray(s.rotation)
      this._scale.toArray(s.scale)

      // console.log(`Mutated`)

      this.set(s)
    }, 10, { leading: false, trailing: true })

    let handler = attr => {
      return {
        set (target, key, value) {
          // console.log(`Setting ${attr}.${key} as ${value}`)
          target[key] = value
          mutated()
          return value
        }
      }
    }

    this._position = new B.Vector3()
    this.position = new Proxy(this._position, handler('position'))

    this._rotation = new B.Vector3()
    this.rotation = new Proxy(this._rotation, handler('rotation'))

    this._scale = new B.Vector3()
    this.scale = new Proxy(this._scale, handler('scale'))

    this.updateVectors()
  }

  get id () {
    return this._content.id
  }

  get type () {
    return this._content.type
  }

  get description () {
    return this._content
  }

  set (dict) {
    Object.assign(this._content, dict)

    this.updateVectors()
    this.save()
  }

  updateVectors () {
    this._position.set(this._content.position[0], this._content.position[1], this._content.position[2])
    this._rotation.set(this._content.rotation[0], this._content.rotation[1], this._content.rotation[2])
    this._scale.set(this._content.scale[0], this._content.scale[1], this._content.scale[2])
  }

  save () {
    this.parcel.broadcast({
      type: 'update',
      uuid: this.uuid,
      content: this._content
    })
  }
}

module.exports = Feature
