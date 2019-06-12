const Parcel = require('../index').Parcel

const p = new Parcel(2)

p.fetch()
  .then(() => {
    let i = 1

    setInterval(() => {
      let sign = p.getFeatureById('hello-sign')

      sign.set({
        text: `${p.getPlayers().length} players`,
        fontSize: 20
      })

      i++
    }, 1000)

    p.listen()
  })
