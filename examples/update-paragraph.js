const Parcel = require('../index').Parcel

const p = new Parcel(76)

p.fetch()
  .then(() => {
    let i = 1

    console.log(p.features)

    setInterval(() => {
      let sign = p.getFeatureById('hello-sign')

      sign.set({
        text: `update #${i}`
      })

      i++
    }, 1500)

    p.listen()
  })
