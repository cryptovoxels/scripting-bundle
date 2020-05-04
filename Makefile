

all:
	browserify index.js -t babelify -o bundle.js
	terser -o bundle.min.js -- bundle.js
	cp bundle.min.js ../cryptovoxels/dist/scripting-host.js 
	ls -lah bundle.min.js

 
