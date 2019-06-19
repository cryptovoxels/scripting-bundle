const B = require('babylonjs')
const uuid = require('uuid/v4')
const test = require('tape')
const { Feature } = require('../index')

let desc = {
  uuid: uuid(),
  position: [1, 2, 3],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  type: 'sign',
  text: 'hello world',
  id: 'dorp'
}

test('ctor', async (t) => {
  let p = {}

  let f = new Feature(p, desc)
  t.equal(f.id, 'dorp')
  t.equal(f.uuid, desc.uuid)
  t.equal(f.type, 'sign')
  t.end()
})

test('set', (t) => {
  let p = {
    broadcast: (mesg) => {
      t.equal(mesg.type, 'update')
      t.end()
    }
  }

  let f = new Feature(p, desc)
  f.set({ text: 'hi2u' })
  t.equal(f.description.text, 'hi2u')
})

test('position', t => {
  let f = new Feature({}, desc)
  t.ok(f.position instanceof B.Vector3)
  t.equal(f.position.x, 1)
  t.equal(f.position.y, 2)
  t.equal(f.position.z, 3)
  t.end()
})

test('rotation', t => {
  let f = new Feature({}, desc)
  t.ok(f.rotation instanceof B.Vector3)
  t.equal(f.rotation.x, 0)
  t.equal(f.rotation.y, 0)
  t.equal(f.rotation.z, 0)
  t.end()
})

test('scale', t => {
  let f = new Feature({}, desc)
  t.ok(f.scale instanceof B.Vector3)
  t.equal(f.scale.x, 1)
  t.equal(f.scale.y, 1)
  t.equal(f.scale.z, 1)
  t.end()
})

test('vec3 proxies', (t) => {
  let p = {
    broadcast: (mesg) => {
      t.equal(mesg.type, 'update')
    }
  }

  let f = new Feature(p, desc)
  f.position.x += 10
  f.scale.set(4, 5, 6)
  f.rotation.addInPlace(new B.Vector3(10, 10, 10))
  t.plan(1)
})
