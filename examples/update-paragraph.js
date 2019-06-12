const Parcel = require('../index').Parcel

const p = new Parcel(2)

p.fetch()
  .then(() => {
    let i = 1

    setInterval(() => {
      let sign = p.getFeatureById('hello-sign')

      sign.set({
        text: `update #${i}`
      })

      i++
    }, 5000)

    p.listen()
  })
