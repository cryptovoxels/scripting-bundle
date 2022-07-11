# Voxels.com scripting engine

[Voxels.com](https://www.voxels.com/) is a voxel-based world
built on top of the ethereum blockchain. This scripting engine is
for adding interactivity to your Voxels parcels.

Scripts are written in world using the scripting field inside the feature editor.This script is then run in a webworker on the domain `untrusted.cryptovoxels.com`. Your scripts are run in the browser so there is no consistency between users, they each run their own version of the scripts.

For consistency between users, we have a hosted Scripting serice that parcel owners can decide to use or not.

If users want to host their own scripting server, we have https://github.com/cryptovoxels/Voxels-Scripting-Server.

## Documentation
https://github.com/cryptovoxels/Voxels-Scripting-Server/docs/index.html

## Contributing

1. Clone the repo.

2. Create a branch & Make your changes

3. Run `npm run build` and `npm run format` to (1) make sure the project still builds and (2) format your code.

4. Make a pull request on github.

If you've changed code inside `src/` please run `npm run docs` and commit the changes.

Note:
If you have access to the cryptovoxels repo; you can test the build, by then running "npm run copy:voxels" after build ;
This will copy the scripting bundle to the cryptovoxels repo, and you can test it on local
