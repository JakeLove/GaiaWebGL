GAIA Data Parser + WebGl Viewer using Node.js

Packages used:
	-express 		(http server)
	-socketio 		(node websocket API)
	-csv 			(csv parser)
	-concat-stream	(function to concat arrays from a stream into a single object)
	-cluster		(multicore processing for csv's)

To setup:
	-install relevant packages (see above)
	-put all your GAIA source files (csv format) into the gaia_sources folder
	-run gaia.js to parse the files into float32Array binaries, this will take a very long time due to the size of the GAIA archive. Can be paused / restarted at any time and progress will be saved
	-run fileConcat.js to merge the float32 binaries into a single file
	-run server.js once gaia.js has finished process the GAIA archive
	-finally, access your servers IP in a WebGL compatible browser