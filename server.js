//node imports
let fs = require('fs');

//external imports
let socket = require('socket.io');
let express = require('express');

//file server
let app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index.html');
});

console.log("Starting Gaia Star Map Server!");

let server = app.listen(80, function() {
  const host = server.address().address;
  const port = server.address().port;
});



const starDataPath='stars.dat'
let gaiaVertexArray

fs.readFile(starDataPath, (err, buffer) => {
    gaiaVertexArray = new Float32Array(buffer.buffer, buffer.offset, buffer.byteLength/4)
});


let io = socket.listen(server)

io.on('connection', function(socket) {
	socket.on('star_req', function(data) {
		socket.emit('star_data', gaiaVertexArray.buffer)
	})
})