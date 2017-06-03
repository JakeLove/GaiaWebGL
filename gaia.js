let cluster = require('cluster')
let fs = require('fs');
let stream = require('stream')
let csv = require('csv');
let concat = require('concat-stream');

const RAD = Math.PI / 180;

let cs = concat((data)=>{
    console.log(data);
});

function sourceToFloat32Array(inFile, outFile, newLocation , callback = ()=>{}, args = []) {
	fs.createReadStream(inFile)
		.pipe(csv.parse({auto_parse: true}))
		.pipe(csv.transform((set)=>{
			if(!(set[8] == "" || set[0] == 'solution_id')) {
				return [set[4], set[6], set[8]]	;
			}	
		}))
		.pipe(csv.transform((set)=>{
			let ra = set[0];
			let dec = set[1];
			let r = 1000 / set[2];

			return [Math.cos(ra * RAD) * Math.cos(dec * RAD) * r, Math.sin(ra * RAD) * Math.cos(dec * RAD) * r, Math.sin(dec * RAD) * r];
		}))
		.pipe(concat((data)=>{
			fs.writeFileSync(outFile, new Buffer(new Float32Array(data).buffer));			
		}))
		.on('finish', ()=>{
			fs.rename(inFile, newLocation, ()=>{})
			console.log('Finished processing file ' + inFile);
			callback(...args);
		})
}


if (cluster.isMaster) {
	let express = require('express');
	let app = express();
	let server = app.listen(81, ()=>{
	  const host = server.address().address;
	  const port = server.address().port;
	});


	numberOfThreads = 3

	let filePool = [];
	fs.readdir("gaia_sources", (err, files)=>{ 
		filePool = files;

		for (let i = 0; i < numberOfThreads; i++) {
			let worker = cluster.fork();

			worker.on('message', function(data) {
				if (data.msg == 'fileCompleted') {
					if(filePool.length > 0){
						this.send({msg: 'nextFile', filename: filePool.shift()})
					}
				}
	    	});

	    	worker.send({msg:'nextFile', filename: filePool.shift()})
		}
	});
	

  	cluster.on('death', function(worker) {
		console.log('Worker ' + worker.pid + ' died :/');
	});
} 
else {
	process.on('message', function(data) {
		if(data.msg == 'nextFile') {
			fn = data.filename

			sourceToFloat32Array('gaia_sources/' + fn, 'gaia_results/' + fn.slice(0, -4) + '.dat', 'gaia_sources_complete/' + fn, ()=> {
				process.send({msg: 'fileCompleted', worker: cluster.worker.id})
			}, [fn]);
		} 
		else {
			console.log('Help!')
		}
	});
}