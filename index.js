// const fetch = require('node-fetch')
// const WebSocket = require('ws')
const EventEmitter = require('events')

const Feature = require('./feature')
const { VoxelField } = require('./voxel-field')
const Player = require('./player')

const API = 'https://www.cryptovoxels.com'

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
    // if (!port) {
    //   port = process.env.PORT || 3800
    // }

    // const wss = new WebSocket.Server({ port })

    // this.clients = []

    // wss.on('connection', (ws) => {
    //   ws.on('message', (message) => {
    //     this.onMessage(ws, JSON.parse(message))
    //   })

    //   ws.on('close', () => {
    //     let i = this.clients.indexOf(ws)

    //     if (i >= 0) {
    //       this.clients.splice(i)
    //     }

    //     if (ws.player) {
    //       this.leave(ws.player)
    //     }
    //   })

    //   this.clients.push(ws)
    // })

    // return port
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
        return
      }

      f.emit('click', Object.assign({}, msg.event, { player: ws.player }))
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
    // return fetch(`${API}/grid/parcels/${this.id}`)
    //   .then(r => r.json())
    //   .then(r => {
    //     // console.log(r)

    //     if (!r.success) {
    //       console.error('Could not fetch parcel info')
    //       return
    //     }

    //     this.parse(r.parcel)
    //   })
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
    this.featuresList = Array.from(parcel.features).map(f => new Feature(this, f))
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

  getPlayers () {
    return this.players
  }
}

module.exports = {
  Parcel,
  Feature,
  VoxelField
}

Object.assign(self, module.exports)