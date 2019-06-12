const test = require('tape')
const Parcel = require('./index')
const json = require('./parcel.json').parcel

test('fetch', async (t) => {
  let p = new Parcel(2)

  p.parse = () => {
    t.ok(true)
    t.end()
  }

  await p.fetch()
})

test('parse', (t) => {
  let p = new Parcel(2)

  p.parse(json)

  t.equal(p.x1, -20)
  t.equal(p.y1, 0)
  t.equal(p.z1, 2)
  t.equal(p.x2, -2)
  t.equal(p.y2, 8)
  t.equal(p.z2, 17)
  t.ok(p.address)
  t.ok(p.owner)
  t.equal(p.colors, 174)

  t.end()
})
