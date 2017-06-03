let cluster = require('cluster')
let fs = require('fs');

if (cluster.isMaster) {
	fs.readdir("gaia_results", (err, files)=>{ 
		let dataset = []	
		let filePool = files


		while(filePool.length > 0) {
			const buffer32 = fs.readFileSync("gaia_results/" + filePool.shift())
			const gaiaSubset = Array.from(new Float32Array(buffer32.buffer, buffer32.offset, buffer32.byteLength/4))
			dataset = dataset.concat(gaiaSubset)
			if (filePool.length % 100 === 0) {
				console.log(filePool.length + " files left.")
			}
		}

		fs.writeFileSync("stars.dat", new Buffer(new Float32Array(dataset).buffer));
		console.log(dataset)
		console.log("done")
	})
} 
