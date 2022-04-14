
// We're not using typescript but we can at least pretend ;)
const types = {
    url:'string',
    uuid:'string',
    id:'string',
    script:'string',
    /* objects */
    position:'object',
    rotation:'object',
    scale:'object',
    tryPosition:'object',
    tryRotation:'object',
    tryScale:'object',
    tryable:'boolean',
    /* back to normal stuff */
    collidable:'boolean',
    isTrigger:'boolean',
    proximityToTrigger:'number',
    blendMode:'string',
    opacity:'number',
    inverted:'boolean',
    triggerIsAudible:'boolean',
    link:'string',
    fontSize:'string',
    color:'string',
    background:'string',
    text:'string',
    updateDaily:'boolean',
    stretch:'boolean',
    /* media */
    autoplay:'boolean',
    loop:'boolean',
    rolloffFactor:'number',
    volume:'number',
    screenRatio:'string',
    /* nftimage */
    hasGui:'boolean',
    hasGuiResizable:'boolean',
    hasFrame:'boolean',
    emissiveColorIntensity:'number',
    // transparent:'string', // transparency can be both string or boolean, kinda stupid but ok
    sprite:'boolean',
    streaming:'boolean',

    /* particle emitters */
    emitRate:'number',
    minSize:'number',
    maxSize:'number',
    color1:'string',
    color2:'string',
    colorDead:'string',
    opacityDead:'string,',
    placeholder:'string',
    /* slider */
    minimum:'number',
    maximum:'number',
    default:'number',

  }
  
  const arrayProperties={
    position:['number','number','number'],
    rotation:['number','number','number'],
    scale:['number','number','number'],
    tryPosition:['number','number','number'],
    tryRotation:['number','number','number'],
    tryScale:['number','number','number'],
    specularColor:['number','number','number'],
  }

export function _isValidArray(array:any[],expectedLength:number=3,type:string|null=null){
    if(Array.isArray(array)){
        if(array.length == expectedLength){
            if(type){
                // same length and type define, check each value
                let pass = true
                array.forEach((v)=>{
                    if(typeof v !== type){
                        pass = false
                    }
                })
                return pass
            }
            // same length and no type defined, we pass the validation
            return true
        }
        // is array and not same length
        return false
    }
    // is not array
    return false
}

export function _isValidProperty(value:any,type:string|null=null){
    if(!type){
        return true
    }
    if(typeof(value) == type){
        return true
    }
    return false
}

export function _validateObject(object:Record<string,any>){
    let resultDict = {} as Record<string,any>

    Object.entries(object).forEach(([dictKey,value])=>{
      let currentProperty =  Object.keys(types).find((key)=>key==dictKey) as keyof typeof types
      // We found a property with same name
      if(currentProperty){
        // If the type of value is appropriate add in to the resultDict
        if(_isValidProperty(value, types[currentProperty])){
  
          switch(typeof value){
            case 'object':
              // We have an object, check if we're dealing with position,scale,rotation
              let is3DProperty =  Object.keys(arrayProperties).find((key)=>key==dictKey) as keyof typeof arrayProperties
              if(is3DProperty){
                  // we have position,scale or rotation or another array
                  let isValid = _isValidArray(object[currentProperty],arrayProperties[is3DProperty].length,'number')
                  if(isValid){
                    resultDict[currentProperty] = value
                  }else{
                    console.error(`[Scripting]${currentProperty} should be of type array of length 3`)
                  }
              }else{
                  // it's just an object;
                resultDict[dictKey] = value
              }

              break;
            default:
                // just add
              resultDict[dictKey] = value
          }
  
  
        }else{
            let is3DProperty =  Object.keys(arrayProperties).find((key)=>key==currentProperty)
            if(is3DProperty){
                console.error(`[Scripting] ${currentProperty} should be of type array of length 3`)
                
            }else{

                console.error(`[Scripting] ${currentProperty} should be of type ${types[currentProperty]}`)
            }
        }
  
      }else{
        // We found no type for that key,
        // key was probably mispecified or it's on purpose, do nothing
        // just add
        resultDict[dictKey] = value
      }
    })
    return resultDict
}
