/* global parcel,self,postMessage */

import { Vector3, Quaternion, Vector2, Color3, Matrix } from './vendor/babylonjs/Maths/math'
import { Animation } from './vendor/babylonjs/Animations/animation'

const uuid = require('uuid/v4')
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

    this.players = []
    this.featuresList = []
  }

  listen (port) {
  }

  onMessage (ws, msg) {
    // console.log('onMessage', ws, msg)

    if (msg.type === 'playerenter') {
      ws.player = new Player(msg.player)

      this.join(ws.player)
      return
    }

    if (!ws.player) {
      return
    }

    if (msg.type === 'playerleave') {
      this.leave(ws.player)
    } else if (msg.type === 'move') {
      ws.player.onMove(msg)
    } else if (msg.type === 'click') {
      const f = this.getFeatureByUuid(msg.uuid)

      if (!f) {
        console.log('cant find feature ' + msg.uuid)
        return
      }

      const e = Object.assign({}, msg.event, { player: ws.player })

      if (e.point) {
        e.point = Vector3.FromArray(e.point)
        e.normal = Vector3.FromArray(e.normal)
      }

      f.emit('click', e)
    } else if (msg.type === 'keys') {
      const f = this.getFeatureByUuid(msg.uuid)
      if (!f) return
      f.emit('keys', msg.event)
    } else if (msg.type === 'start') {
      const f = this.getFeatureByUuid(msg.uuid)
      if (!f) return
      f.emit('start')
    } else if (msg.type === 'stop') {
      const f = this.getFeatureByUuid(msg.uuid)
      if (!f) return
      f.emit('stop')
    } else if (msg.type === 'changed') {
      const f = this.getFeatureByUuid(msg.uuid)
      if (!f) return
      f.emit('changed', msg.event)
    }
  }

  join (player) {
    this.players.push(player)
    this.emit('playerenter', { player })
  }

  leave (player) {
    const i = this.players.indexOf(player)

    if (i >= 0) {
      this.players.splice(i)
    }

    this.emit('playerleave', { player })
  }

  broadcast (message) {
    const packet = JSON.stringify(message)

    // console.log('broadcast', packet)
    postMessage(packet)
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

    const ul = document.querySelector('#debug')
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

  createFeature (type, description) {
    const feature = Feature.create(this, Object.assign({
      position: Vector3.Zero(),
      rotation: Vector3.Zero(),
      scale: new Vector3(1, 1, 1),
      type,
      uuid: uuid()
    }, description || {}))

    this.featuresList.push(feature)

    this.broadcast({
      type: 'create',
      uuid: feature.uuid,
      content: feature._content
    })

    return feature
  }

  removeFeature (f) {
    this.broadcast({
      type: 'remove',
      uuid: f.uuid
    })

    this.featuresList = this.featuresList.filter(p => p.uuid !== f.uuid)
    // const i = this.featuresList.indexOf(f)

    // if (i > -1) {
    //   this.featuresList.splice(i)
    // }
  }

  start () {
    // fake websocket
    const ws = {
      readyState: 1
    }

    self.onmessage = (e) => {
      if (e.data.type === 'join') {
        // console.log('onmessage', JSON.stringify(e))

        if (e.data.player) {
          ws.player = e.data.player
        }

        parcel.onMessage(ws, e.data)
        // parcel.clients.push(ws)
      } else {
        parcel.onMessage(ws, e.data)
      }
    }
  }
}

module.exports = {
  Parcel,
  Feature,
  Animation,
  VoxelField,
  Vector3,
  Quaternion,
  Vector2,
  Color3,
  Matrix
}

if (typeof self !== 'undefined') {
  Object.assign(self, module.exports) // eslint-disable-line
}
