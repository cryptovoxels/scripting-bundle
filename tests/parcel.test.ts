
import * as ScriptingHost from "../src/index"
import Voxels from '../src/index'
const Parcel = Voxels.Parcel
const json = require('./parcel.json').parcel

const assert = require('assert')

describe('Test Parcel', function() {
  it('Create Parcel Object', function() {
    let result = new Parcel(2)
    assert.equal(2,result.id)
  }); 

  it('Parse parcel', function() {
    const p = new Parcel(2)
    p.parse(json)
  
    assert.equal(p.x1, -20)
    assert.equal(p.y1, 0)
    assert.equal(p.z1, 2)
    assert.equal(p.x2, -2)
    assert.equal(p.y2, 8)
    assert.equal(p.z2, 17)
    assert.ok(p.address)
    assert.ok(p.owner)
  
    assert.ok(p.getFeatureByUuid('faf05014-9a08-4aeb-89c6-02da0bb8e237'))
    assert.ok(p.getFeatureById('boop'))
    assert.equal(1, p.getFeaturesByType('richtext').length)
    assert.equal(9, p.getFeatures().length)
  }); 



  it('createFeature / removeFeature', () => {
    const p = new Parcel(2)
    p.broadcast = () => {}
    p.parse(json)
  
    assert.equal(9, p.getFeatures().length)
  
    const f = p.createFeature('image')
    assert.equal(10, p.getFeatures().length)
    f.remove()
  
    assert.equal(9, p.getFeatures().length)
    assert.equal(-1, p.getFeatures().indexOf(f))
  })

  test('getFeatureByUuid', () => {
    const p = new Parcel(2)
    p.broadcast = () => {}
    p.parse(json)
    assert.ok(p.getFeatureByUuid('8f4e097d-d560-409c-a3b5-4638f1897469'))
    assert.ok(!p.getFeatureByUuid('boopboop'))
  })

  test('getFeatureById', () => {
    const p = new Parcel(2)
    p.broadcast = () => {}
    p.parse(json)
    assert.ok(p.getFeatureById('boompity'))
    assert.ok(!p.getFeatureById('zingzong'))
  })

  test('getFeatures', () => {
    const p = new Parcel(2)
    p.broadcast = () => {}
    assert.equal(0, p.getFeatures().length)
    p.parse(json)
    assert.equal(9, p.getFeatures().length)
  })

  test('getFeaturesByType', () => {
    const p = new Parcel(2)
    p.broadcast = () => {}
    p.parse(json)
    assert.equal(3, p.getFeaturesByType('image').length)
  })

  test('getPlayers', () => {
    const p = new Parcel(2)
    p.broadcast = () => {}
    assert.equal(0, p.getPlayers().size)
  })
  
  test('createFeature', () => {
    const p = new Parcel(2)
    p.broadcast = () => {}
    p.createFeature('image')
    assert.equal(1, p.getFeatures().length)
  })
  
test('removeFeature', () => {
  const p = new Parcel(2)
  p.broadcast = () => {}
  p.parse(json)

  assert.equal(9, p.getFeatures().length)
  let f = p.getFeatureByUuid('88c9d244-674f-40cd-99e2-537f4d1dc89d')
  assert.ok(f)
  if(!f){
    assert.ok(false)
  }
  p.removeFeature(f!)
  assert.equal(8, p.getFeatures().length)

  p.removeFeature(f!)
  assert.equal(8, p.getFeatures().length)

})

});
