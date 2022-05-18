import { Vector3 } from "@babylonjs/core";
import assert from "assert";
import Parcel from "../src/parcel";

import * as p from './parcel.json'
import { overrideParcel } from "./test_lib";
//@ts-ignore
const json = p.default.parcel

describe('Test Parcel', function() {
  let parcel:Parcel & {receiveMsg: (obj: any) => any};
  const playerDetails = {wallet:'ded',uuid:'wdwdwd',_token:'ded'}
  beforeAll(()=>{
    parcel = overrideParcel(new Parcel(2))
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

  test('Player joins and leave', () => {
    assert.equal(0, parcel.getPlayers().length)

    parcel.receiveMsg({type:'join',player:playerDetails})
    assert.equal(1, parcel.getPlayers().length)

    parcel.receiveMsg({type:'playeraway',player:playerDetails})

    assert.equal(0, parcel.getPlayers().length)
  })

  test('Parcel events', (done) => {
    const getplayer = ()=>{
      return parcel.getPlayerByUuid(playerDetails.uuid)
    }
    parcel.on('join',()=>{
      assert.equal(1, parcel.getPlayers().length)
    })
    parcel.on('playernearby',()=>{
      let p =getplayer()
      assert.ok(p)
      expect(p.isWithinParcel).toBeFalsy()
    })
    parcel.on('playerenter',()=>{
      let p =getplayer()
      assert.ok(p)
      expect(p.isWithinParcel).toBeTruthy()
    })
    parcel.on('playerleave',()=>{
      let p =getplayer()
      assert.ok(p)
      expect(p.isWithinParcel).toBeFalsy()
    })
    // player re-enters the parcel
    parcel.on('playerenter',()=>{
      let p =getplayer()
      assert.ok(p)
      expect(p.isWithinParcel).toBeTruthy()
    })
    parcel.on('playeraway',()=>{
      let p =getplayer()
      assert.ok(p)
      expect(p.isWithinParcel).toBeFalsy()
      setTimeout(()=>{
        let p =getplayer()
        expect(p).toBeUndefined()
        done()
      },100)
    })

    parcel.receiveMsg({type:'join',player:playerDetails})
    parcel.receiveMsg({type:'playernearby',player:playerDetails})
    parcel.receiveMsg({type:'playerenter',player:playerDetails})
    parcel.receiveMsg({type:'playerleave',player:playerDetails})
    parcel.receiveMsg({type:'playerenter',player:playerDetails})
    parcel.receiveMsg({type:'playeraway',player:playerDetails})
  })
  
  
});
