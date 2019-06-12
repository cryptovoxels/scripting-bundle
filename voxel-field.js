const ndarray = require('ndarray')
const zlib = require('zlib')

const Blocks = (index, transparent, color) => {
  return index + (transparent ? 0 : 1 << 15) + (color << 6)
}

Blocks.empty = 0

class VoxelField {
  constructor (parcel) {
    this.parcel = parcel

    let voxelSize = 0.5
    let width = (parcel.x2 - parcel.x1) / voxelSize
    let height = (parcel.y2 - parcel.y1) / voxelSize
    let depth = (parcel.z2 - parcel.z1) / voxelSize

    this.resolution = [width, height, depth]
    this.field = ndarray(new Uint16Array(width * height * depth), this.resolution)

    // Inflate voxel field
    const buffer = Buffer.from(this.parcel.voxels, 'base64')
    const inflated = zlib.inflateSync(buffer)
    inflated.copy(Buffer.from(this.field.data.buffer))
  }

  get width () {
    return this.resolution[0]
  }

  get height () {
    return this.resolution[1]
  }

  get depth () {
    return this.resolution[2]
  }

  serialize () {
    const buffer = Buffer.from(this.field.data.buffer)
    const deflated = zlib.deflateSync(buffer)

    let voxels = deflated.toString('base64')
    let features = this.featuresList.map(f => f.serialize)

    let content = {
      features,
      voxels
    }

    return content
  }
}

module.exports = {
  Blocks,
  VoxelField
}
