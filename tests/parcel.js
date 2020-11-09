const test = require('tape')
const { Parcel } = require('../index')
const json = require('./parcel.json').parcel

test('parse', (t) => {
  const p = new Parcel(2)
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

  t.ok(p.getFeatureByUuid('faf05014-9a08-4aeb-89c6-02da0bb8e237'))
  t.ok(p.getFeatureById('boop'))
  t.equal(1, p.getFeaturesByType('richtext').length)
  t.equal(9, p.getFeatures().length)

  t.end()
})

test('onMessage', t => {
  // todo

  t.end()
})

test('createFeature / removeFeature', t => {
  const p = new Parcel(2)
  p.broadcast = () => {}
  p.parse(json)

  t.equal(9, p.getFeatures().length)

  const f = p.createFeature('image')
  t.equal(10, p.getFeatures().length)
  f.remove()

  t.equal(9, p.getFeatures().length)
  t.equal(-1, p.getFeatures().indexOf(f))

  t.end()
})

test('getFeatureByUuid', t => {
  const p = new Parcel(2)
  p.broadcast = () => {}
  p.parse(json)
  t.ok(p.getFeatureByUuid('8f4e097d-d560-409c-a3b5-4638f1897469'))
  t.notOk(p.getFeatureByUuid('boopboop'))
  t.end()
})

test('getFeatureById', t => {
  const p = new Parcel(2)
  p.broadcast = () => {}
  p.parse(json)
  t.ok(p.getFeatureById('boompity'))
  t.notOk(p.getFeatureById('zingzong'))
  t.end()
})

test('getFeatures', t => {
  const p = new Parcel(2)
  p.broadcast = () => {}
  t.equal(0, p.getFeatures().length)
  p.parse(json)
  t.equal(9, p.getFeatures().length)
  t.end()
})

test('getFeaturesByType', t => {
  const p = new Parcel(2)
  p.broadcast = () => {}
  p.parse(json)
  t.equal(3, p.getFeaturesByType('image').length)
  t.end()
})

test('getPlayers', t => {
  const p = new Parcel(2)
  p.broadcast = () => {}
  t.equal(0, p.getPlayers.length)
  t.end()
})

test('createFeature', t => {
  const p = new Parcel(2)
  p.broadcast = () => {}
  p.createFeature('image', {})
  t.equal(1, p.getFeatures().length)
  t.end()
})
