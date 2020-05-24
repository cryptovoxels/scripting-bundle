const Parcel = require('../index').Parcel

const p = new Parcel(2)

p.fetch()
  .then(() => {
    setInterval(() => {
      const sign = p.getFeatureById('hello-sign')

      sign.set({
        text: `${p.getPlayers().length} players`,
        fontSize: 20
      })
    }, 1000)

    const port = p.listen()
    console.log(`Listening for connections on port ${port}`)
  })
