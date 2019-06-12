const Parcel = require('../index').Parcel
const Blocks = require('../index').Blocks

const p = new Parcel(1)

p.fetch()
  .then(() => {
    let i = 0

    setInterval(() => {
      p.fillField((x, y, z) => {
        if (x === i % 10) {
          return Blocks(1)
        } else {
          return Blocks.empty
        }
      })

      i++
    }, 1500)

    p.listen()
  })
