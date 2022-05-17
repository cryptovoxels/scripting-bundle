import { Animation, Vector3 } from "@babylonjs/core";
import assert from "assert";
import Parcel from "../src/parcel";
import {fn} from 'jest-mock'
import * as p from './parcel.json'
import { overrideParcel } from "./test_lib";
//@ts-ignore
const json = p.default.parcel

describe('Test Feature', function() {
  let parcel:Parcel & {receiveMsg: (obj: any) => any};
  const playerDetails = {wallet:'ded',uuid:'wdwdwd',_token:'ded'}
  beforeAll(()=>{
    parcel = overrideParcel(new Parcel(2))

    parcel.broadcast=fn()
    global.postMessage=()=>{}
  })

  it('Parse features', function() {
    parcel.parse(json)
    assert.equal(9, parcel.getFeatures().length)

    const f= parcel.getFeatureByUuid('faf05014-9a08-4aeb-89c6-02da0bb8e237')
    assert.ok(f)
    assert.deepEqual(f.position.asArray(),[
      -3.75,
      2.25,
      -3.75
    ])
    assert.deepEqual(f.rotation.asArray(),[
      0,
      4.71238898038469,
      0
    ])
  }); 

  it('Feature- set new position', () => {
    const f= parcel.getFeatureByUuid('faf05014-9a08-4aeb-89c6-02da0bb8e237')
    assert.ok(f)
    f.position.set(2,2,2)
    //broadcast is not called yet
    assert.deepEqual(f.position.asArray(),[
      2,
      2,
      2
    ])
    f.position.x = 5
    assert.deepEqual(f.position.asArray(),[
      5,
      2,
      2
    ])
      // Test clone
    assert.deepEqual(f.position.clone().asArray(),[
      5,
      2,
      2
    ])

    f.set({position:[1,1,1]})
    expect(parcel.broadcast).toHaveBeenCalled()
    assert.deepEqual(f.position.asArray(),[1,1,1])
  })
  it('Feature- create Animation', () => {
    const f= parcel.getFeatureByUuid('faf05014-9a08-4aeb-89c6-02da0bb8e237')
    assert.ok(f)
    const newAnimation =f.createAnimation('position')
    expect(newAnimation).toBeInstanceOf(Animation)
    expect(newAnimation.name).toEqual(`scripting/animation/faf05014-9a08-4aeb-89c6-02da0bb8e237`)

    newAnimation.setKeys([{
      frame: 30, // standard is 30 fps (means it take 1 second)
      value: f.position.add( new Vector3(0,10,0) )
    }])
    f.startAnimations([newAnimation])
    expect(parcel.broadcast).toHaveBeenCalled()
  })
  it('Feature- create basic gui', () => {
    const f= parcel.getFeatureByUuid('faf05014-9a08-4aeb-89c6-02da0bb8e237')
    assert.ok(f)
    const newGUI =f.createBasicGui('myId')
    assert.ok(newGUI)
    assert.ok(newGUI.uuid)
    expect(newGUI.id).toEqual('myId')
    const button = newGUI.addButton('Click me',[1,1],'lol')
    expect(newGUI.listOfControls.length).toEqual(1)
    expect(button.id).toEqual('lol')
    assert.deepEqual(button.positionInGrid,[1,1])
    expect(button.text).toEqual('Click me')
    newGUI.show()
    expect(parcel.broadcast).toHaveBeenCalled()

    f.removeGui()
    expect(f.gui).toBeUndefined()
  })

});
