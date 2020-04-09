import { Vector3 } from '../vendor/babylonjs/Maths/math'
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
  t.ok(f.position instanceof Vector3)
  t.equal(f.position.x, 1)
  t.equal(f.position.y, 2)
  t.equal(f.position.z, 3)
  t.end()
})

test('rotation', t => {
  let f = new Feature({}, desc)
  t.ok(f.rotation instanceof Vector3)
  t.equal(f.rotation.x, 0)
  t.equal(f.rotation.y, 0)
  t.equal(f.rotation.z, 0)
  t.end()
})

test('scale', t => {
  let f = new Feature({}, desc)
  t.ok(f.scale instanceof Vector3)
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
  f.rotation.addInPlace(new Vector3(10, 10, 10))
  t.plan(1)
})

test('vec3 copyFrom', (t) => {
  let p = {
    broadcast: (mesg) => {
      t.equal(mesg.type, 'update')
    }
  }

  let z = new Vector3(100, 100, 100)
  let f = new Feature(p, desc)
  f.position.copyFrom(z)
  t.plan(1)
})

test('create', t => {
  let f = Feature.create({}, Object.assign({}, desc, { type: 'audio' }))
  t.equal(f.constructor.name, 'Audio')

  f = Feature.create({}, Object.assign({}, desc, { type: 'sign' }))
  t.equal(f.constructor.name, 'Feature')
  t.end()
})

test('play', t => {
  t.plan(1)

  let p = {
    broadcast: (mesg) => {
      t.equal(mesg.type, 'play')
    }
  }

  let f = Feature.create(p, Object.assign({}, desc, { type: 'audio' }))
  f.play()
})

test('animation', t => {
  t.plan(1)

  let p = {
    broadcast: (mesg) => {
      t.equal(mesg.type, 'animate')
    }
  }

  let f = Feature.create(p, desc)

  let a1 = f.createAnimation('rotation')

  // Keyframe 0 is automatically created from current location

  a1.setKeys([
    {
      frame: 100,
      value: f.rotation.add(new Vector3(Math.PI, 0, 0))
    }
  ])

  let a2 = f.createAnimation('position')
  a2.setKeys([
    {
      frame: 100,
      value: f.position.add(new Vector3(5, 1, 1))
    }
  ])

  f.startAnimations([a1, a2])
  t.end()
})

test('play', t => {
  t.plan(1)

  let p = {
    broadcast: (mesg) => {
      t.equal(mesg.type, 'play')
    }
  }

  let f = Feature.create(p, Object.assign({}, desc, { type: 'audio', url: 'http://example.com/song.mp3' }))
  t.equal('http://example.com/song.mp3', f.get('url'))
})
