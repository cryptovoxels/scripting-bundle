const fetch = require('node-fetch')
const WebSocket = require('ws')

const Feature = require('./feature')
const VoxelField = require('./voxel-field')

const API = 'http://localhost:9000'

class Parcel {
  // featuresList: Array<Feature>
  // field: ndarray

  constructor (id) {
    this.id = id

    this.players = []
    this.featureList = []
  }

  listen () {
    const wss = new WebSocket.Server({ port: 8080 })

    this.clients = []

    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        console.log('received: %s', message)
      })

      ws.send('something')

      this.clients.push(ws)
    })
  }

  broadcast (message) {
    let packet = JSON.stringify(message)

    this.clients.forEach(ws => {
      ws.send(packet)
    })
  }

  fetch () {
    return fetch(`${API}/grid/parcels/${this.id}`)
      .then(r => r.json())
      .then(r => {
        console.log(r)

        if (!r.success) {
          console.error('Could not fetch parcel info')
          return
        }

        this.parse(r.parcel)
      })
  }

  parse (parcel) {
    Object.assign(this, parcel)

    // Create features array
    this.featuresList = Array.from(parcel.features).map(f => new Feature(this, f))
    this.voxels = new VoxelField(this)
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
  Parcel
}
