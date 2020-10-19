

all:
	browserify index.js -t babelify -o bundle.js
	terser -o bundle.min.js -- bundle.js
	terser --comments false -b -o bundle.max.js -- bundle.js 
	cp bundle.max.js ../cryptovoxels/dist/scripting-host.js 
	cp bundle.max.js ../grid/
	ls -lah bundle.min.js

