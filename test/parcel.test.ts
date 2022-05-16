import { Vector3 } from "@babylonjs/core";
import assert from "assert";
import scriptingEngine from "../src/index"
import { Player } from "../src/player";
const Parcel = scriptingEngine.Parcel
import * as p from './parcel.json'
//@ts-ignore
const json = p.default.parcel

describe('Test Parcel', function() {
  let parcel:InstanceType<typeof Parcel>;

  beforeAll(()=>{
    parcel = new Parcel(2)
  })
  it('Parcel Object has id 2', function() {
    expect(parcel.id).toEqual(2)
  }); 

  it('Parse parcel', function() {
    parcel.parse(json)
    expect(parcel.id).toEqual(2);
    expect(parcel.x1).toEqual(-20)
    expect(parcel.y1).toEqual(0)
    expect(parcel.z1).toEqual(2)
    expect(parcel.x2).toEqual(-2)
    expect(parcel.y2).toEqual(8)
    expect(parcel.z2).toEqual(17)

    expect(parcel.address).toEqual('72 Block Fork')
    expect(parcel.owner).toEqual('0x2D891ED45C4C3EAB978513DF4B92a35Cf131d2e2')

    assert.ok(parcel.getFeatureByUuid('faf05014-9a08-4aeb-89c6-02da0bb8e237'))
    assert.ok(parcel.getFeatureById('boop'))
    assert.equal(1, parcel.getFeaturesByType('richtext').length)
    assert.equal(9, parcel.getFeatures().length)
  }); 

  it('createFeature / removeFeature', () => {
    parcel.broadcast = () => {}
  
    assert.equal(9, parcel.getFeatures().length)
  
    const f = parcel.createFeature('image')
    let uuid = f.uuid
    assert.ok(f.uuid)
    assert.deepEqual(Vector3.Zero().asArray(), f.position.asArray())
    assert.deepEqual(Vector3.Zero().asArray(), f.rotation.asArray())
    assert.deepEqual([1,1,1], f.scale.asArray())
    f.remove()
  
    assert.equal(9, parcel.getFeatures().length)
    assert.equal(-1, parcel.getFeatures().indexOf(f))
    assert.equal(undefined, parcel.getFeatureByUuid(uuid))
  })

  test('getFeatureByUuid', () => {
    assert.ok(parcel.getFeatureByUuid('8f4e097d-d560-409c-a3b5-4638f1897469'))
    assert.ok(!parcel.getFeatureByUuid('boopboop'))
  })

  test('getFeatureById', () => {
    assert.ok(parcel.getFeatureById('boompity'))
    assert.ok(!parcel.getFeatureById('zingzong'))
  })

  test('getFeatures', () => {
    assert.equal(9, parcel.getFeatures().length)
  })

  test('getFeaturesByType', () => {
    assert.equal(3, parcel.getFeaturesByType('image').length)
    assert.equal(1, parcel.getFeaturesByType('richtext').length)
  })

  test('getPlayers', () => {
    assert.equal(0, parcel.getPlayers().size)

    let p = new Player({wallet:'ded',uuid:'wdwdwd',_token:'lol'},parcel)
    //@ts-ignore
    parcel.newFunction = (player:Player)=>{
      //@ts-ignore
      parcel.join(player)
    }
    //@ts-ignore
    parcel.newFunction(p)
    //@ts-ignore
    parcel.newFunction = null
    
    assert.equal(1, parcel.getPlayers().size)
  })
  
  
});
