const EventEmitter = require('events')

class Player extends EventEmitter {
  constructor (description) {
    super()

    Object.assign(this, description)
  }

  get name () {
    return this.user.name
  }

  get wallet () {
    return this.user.wallet
  }

  get uuid () {
    return this.avatar.uuid
  }

  onMove () {
    this.emit('')
  }
}

module.exports = Player
