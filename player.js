import { Vector3 } from './vendor/babylonjs/Maths/math'

const EventEmitter = require('events')

class Player extends EventEmitter {
  constructor (description) {
    super()

    Object.assign(this, description)

    this.name = description && description.name
    this.wallet = description && description.wallet
    this.position = new Vector3()
    this.rotation = new Vector3()
  }

  // get name () {
  //   return this.user.name
  // }

  // get wallet () {
  //   return this.user.wallet
  // }

  // get uuid () {
  //   return this.avatar.uuid
  // }

  onMove (msg) {
    this.position.set(msg.position[0], msg.position[1], msg.position[2])
    this.rotation.set(msg.rotation[0], msg.rotation[1], msg.rotation[2])

    this.emit('move', msg)
  }
}

module.exports = Player
