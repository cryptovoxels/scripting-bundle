export type ParcelOrSpaceId = string|number

export interface IParcel{
    x1:number,
    y1:number,
    z1:number,
    x2:number,
    y2:number,
    z2:number,
}


export type ParcelDescription ={
    id:ParcelOrSpaceId
    contributors?:string[]
    features?:FeatureDescription[]
    voxels?:string,
    palette?:string[]
    tileset?:string
}

export type ParcelContent ={
    features?:FeatureDescription[]
    voxels?:string,
    palette?:string[]
    tileset?:string
}

export type ParcelBroadcastMessage = {
    type:string,
    uuid?:string,
    content?:FeatureDescription
    parcel?:ParcelDescription
    emote?:string
    animations?:any
    coordinates?:string
    reason?:string
    gui?:guiBatchInfo
}

export type guiBatchInfo = {
    uuid: string,
    listOfControls: guiControlType[],
    billBoardMode: number,
}

export type guiControlType={
    uuid:string
    type: 'button'|'text'
    id: string|null
    text?: string
    fontSizePx?: string
    height?: string | number
    positionInGrid?: [number, number]
  }

export type FeatureDescription ={
    uuid:string,
    id?:string,
    url?:string,
    type:string,
    position:number[]
    scale:number[]
    rotation:number[]
} & Record<string,unknown>

export type CollectibleType ={
    wearable_id:number,
    collection_id?:number
    bone:string
} & Record<string,unknown>

export type PlayerDescription ={
    _token:string,
    uuid:string,
    name?:string,
    wallet?:string,
    collectibles?:CollectibleType[]
} & Record<string,unknown>

export type VidScreenKeys = {
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean,
    a: boolean,
    b: boolean,
  }

export type Snapshot={
    id:number,
    is_snapshot:boolean,
    parcel_id:number,
    content:ParcelContent,
    snapshot_name:string,
    name:string,
    updated_at:any,
    created_at:any,
    content_hash:string
}

export type AnimationTarget = 'rotation'|'position'|'scale'