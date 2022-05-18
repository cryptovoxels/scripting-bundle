import { Vector3 } from "@babylonjs/core";
import assert from "assert";
import { Player } from "../src/player";
import Parcel from "../src/parcel";
import { fail } from "assert";
import * as p from './parcel.json'
import { overrideParcel } from "./test_lib";
import { MoveMessage } from "../src/lib/messages";
//@ts-ignore
const json = p.default.parcel
const playerDetail = {wallet:'ded',uuid:'wdwdwd',_token:'lol'}
describe('Test Player', function() {
  let parcel:Parcel & {receiveMsg: (obj: any) => any};
  let player:Player;

  beforeAll(()=>{
    parcel = overrideParcel(new Parcel(2))
    player = new Player(playerDetail,parcel)
    
  })

  it('Player Object has correct info', function() {
    expect(player.uuid).toEqual('wdwdwd')
    expect(player.wallet).toEqual('ded')
    expect(player.token).toEqual('lol')
    expect(player.collectibles.length).toEqual(0)
    expect(player.name).toEqual(undefined)

    assert.deepEqual(Vector3.Zero().asArray(), player.position.asArray())
    assert.deepEqual(Vector3.Zero().asArray(), player.rotation.asArray())


    expect(player.isWithinParcel).toEqual(false)
  }); 

  it('Player Object has joined', function() {
    parcel.receiveMsg({type:'join',player:playerDetail})

    assert.equal(1, parcel.getPlayers().length)
    const p = parcel.getPlayerByUuid(playerDetail.uuid)
    assert.ok(p)
    expect(p.uuid).toEqual('wdwdwd')
    expect(p.wallet).toEqual('ded')
    expect(p.token).toEqual('lol')
    expect(p.collectibles.length).toEqual(0)
    expect(p.name).toEqual(undefined)
    expect(p.isWithinParcel).toEqual(false)
  }); 

  it('Player Object has playerentered', function() {
    parcel.receiveMsg({type:'playerenter',player:playerDetail})
    assert.equal(1, parcel.getPlayers().length)
    const p = parcel.getPlayerByUuid(playerDetail.uuid)
    assert.ok(p)
    expect(p.isWithinParcel).toEqual(true)
  }); 

  it('Player Object has left', function() {
    parcel.receiveMsg({type:'playerleave',player:playerDetail})
    assert.equal(1, parcel.getPlayers().length)
    const p = parcel.getPlayerByUuid(playerDetail.uuid)
    assert.ok(p)
    expect(p.isWithinParcel).toEqual(false)
  }); 

  it('Player has chatted', (done)=> {
    const p = parcel.getPlayerByUuid(playerDetail.uuid)
    assert.ok(p)
    p.on('chat',(event:{text:string})=>{
      expect('I am chatting').toEqual(event.text)
      done()
    })

    parcel.receiveMsg({type:'chat',event:{text:'I am chatting'},uuid:playerDetail.uuid,player:playerDetail})
  }); 


  it('Player has moved', (done)=> {
    const p = parcel.getPlayerByUuid(playerDetail.uuid)
    const moveMsg = {
      position:[1,1,1],
      rotation:[1,0,1],
    }
    assert.ok(p)
    p.on('move',(event:MoveMessage)=>{
      assert.deepEqual([1,1,1], event.position)
      assert.deepEqual([1,0,1], event.rotation)
      done()
    })

    parcel.receiveMsg({type:'move',...moveMsg,uuid:playerDetail.uuid,player:playerDetail})
  }); 

  
  it('Player hasEthereumNFT', (done)=> {
    const p = new Player(playerDetail,parcel)
    const success = (result:boolean)=>{
      expect(result).toBeTruthy()
      done()
    }
    const shouldFail = (reason:string)=>{
      fail(reason)
    }
    p.wallet='0x0fA074262d6AF761FB57751d610dc92Bac82AEf9'
    // yup we know it's deprecated
    p.hasEthereumNFT('0x610e6a9a978fc37642bbf73345dcc5def29ade7a',53,success,shouldFail)
  },30000); 

  it('Player hasNFT', (done)=> {
    const p = new Player(playerDetail,parcel)
    const success = (result:boolean)=>{
      expect(result).toBeTruthy()
      done()
    }
    const shouldFail = (reason:string)=>{
      fail(reason)
    }
    p.wallet='0x0fA074262d6AF761FB57751d610dc92Bac82AEf9'
    p.hasNFT('eth','0x610e6a9a978fc37642bbf73345dcc5def29ade7a',53,success,shouldFail)
  },30000); 
});
