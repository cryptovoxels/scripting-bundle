# Cryptovoxels scripting engine

[Cryptovoxels](https://www.cryptovoxels.com/) is a voxel-based world
built on top of the ethereum blockchain. This scripting engine is
for adding interactivity to your Cryptovoxel parcels.

Scripts are written in world using the HTML editing UI `?ui=html`, and
run in a webworker on the domain `untrusted.cryptovoxels.com`. Your
scripts are run in the browser so there is no consistency between
users, they each run their own version of the scripts. This will be
fixed in the future.

## Historical engine

This used to be the engine for the websocket / node.js based scripting
engine. This may return in the future, but for now, that engine is
deprecated.
