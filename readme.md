# Cryptovoxels scripting engine

[Cryptovoxels](https://www.cryptovoxels.com/) is a voxel-based world
built on top of the ethereum blockchain. This scripting engine is
for adding interactivity to your Cryptovoxel parcels.

## Deploying

The scripting engine is written in node.js and needs to be deployed
to a server with SSL on the front end. It is not possible to test
locally at the moment, because the Cryptovoxels site is served over
SSL and you cannot connect to non-ssl sources.

We recommend using something like [repl.it](https://repl.it/), which allows you to live
code your scripting, and connect to it from the official client.

## Terminoloy

### Parcel

A piece of land that you own in Cryptovoxels. It is defined by a bounding box
that is stored on the blockchain. The bounding box is `x1,y1,z2,x2,y2,z2` and
is expressed in `meters`.

### Voxel field

This is the structure of your parcel, the blocks you have placed in 
### Feature

A parcel 