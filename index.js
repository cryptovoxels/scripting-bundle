import { Vector3, Quaternion, Vector2, Color3, Matrix } from './vendor/babylonjs/Maths/math'
import { Animation } from './vendor/babylonjs/Animations/animation'

const EventEmitter = require('events')
const Feature = require('./feature')
const { VoxelField } = require('./voxel-field')
const Player = require('./player')

class Parcel extends EventEmitter {
  // featuresList: Array<Feature>
  // field: ndarray

  constructor (id) {
    super()

    this.id = id

    this.clients = []
    this.players = []
    this.featureList = []
  }

  listen (port) {
  }

  onMessage (ws, msg) {
    if (msg.type === 'join') {
      ws.player = new Player(msg.player)

      this.join(ws.player)
      return
    }

    if (!ws.player) {
      return
    }

    if (msg.type === 'leave') {
      this.leave(ws.player)
    } else if (msg.type === 'move') {
      ws.player.onMove(msg)
    } else if (msg.type === 'click') {
      let f = this.getFeatureByUuid(msg.uuid)

      if (!f) {
        console.log('cant find feature ' + msg.uuid)
        return
      }

      f.emit('click', Object.assign({}, msg.event, { player: ws.player }))
    } else if (msg.type === 'keys') {
      let f = this.getFeatureByUuid(msg.uuid)
      if (!f) return
      f.emit('keys', msg.event)
    } else if (msg.type === 'start') {
      let f = this.getFeatureByUuid(msg.uuid)
      if (!f) return
      f.emit('start')
    } else if (msg.type === 'stop') {
      let f = this.getFeatureByUuid(msg.uuid)
      if (!f) return
      f.emit('stop')
    } else if (msg.type === 'changed') {
      let f = this.getFeatureByUuid(msg.uuid)
      if (!f) return
      f.emit('changed', msg.event)
    }
  }

  join (player) {
    this.players.push(player)
    this.emit('playerenter', player)
  }

  leave (player) {
    let i = this.players.indexOf(player)

    if (i >= 0) {
      this.players.splice(i)
    }

    this.emit('playerleave', player)
  }

  broadcast (message) {
    let packet = JSON.stringify(message)

    // console.log(message)

    this.clients.forEach(ws => {
      try {
        ws.send(packet)
      } catch (e) {
        // can be caused by disconnected clients we somehow missed
      }
    })
  }

  fetch () {
  }

  debug () {
    if (typeof document === 'undefined') {
      return
    }

    if (!this.featuresList) {
      return
    }

    // console.log('debug')

    let ul = document.querySelector('#debug')
    ul.innerHTML =
      this.featuresList.map(f => `
        <li>
          ${f.type}${f.id ? ('#' + f.id) : ''}<br />
          <small>${f.uuid}</small>
        </li>
       `).join('')
  }

  parse (parcel) {
    Object.assign(this, parcel)

    // Create features array
    this.featuresList = Array.from(parcel.features).map(f => Feature.create(this, f))
    this.voxels = new VoxelField(this)
  }

  getFeatureByUuid (uuid) {
    return this.featuresList.find(f => f.uuid === uuid)
  }

  getFeatureById (id) {
    return this.featuresList.find(f => f.id === id)
  }

  getFeatures () {
    return this.featuresList
  }

  getFeaturesByType (type) {
    return this.featuresList.filter(f => f.type === type)
  }

  getPlayers () {
    return this.players
  }
}

module.exports = {
  Parcel,
  Feature,
  VoxelField,
  Animation,
  Vector3,
  Quaternion,
  Vector2,
  Color3,
  Matrix
}

if (typeof self !== 'undefined') {
  Object.assign(self, module.exports) // eslint-disable-line
}
