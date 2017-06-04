# GAIA WebGL
## Setup

GaiaWebGL requires [Node.js](https://nodejs.org/) v4+ to run.

Install  dependencies

```sh
$ npm install express
$ npm install socketio
$ npm install csv
$ npm install concat-stream
$ npm install cluster
$ npm install pm2
```
Place your GAIA sources files (csv format) into the *gaia_sources* folder. GAIA sources can be found [here](http://cdn.gea.esac.esa.int/Gaia/gaia_source/csv/)

Run gaia.js to parse each csv file into its own new file containing a floatArray32 buffer 
```sh
$ node gaia.js
```

(note that this program can be paused an restarted at will and progress will not be lost as completed files will move to a new folder, this step could take several hours)

Run fileConcat.js to mergre the Arrays to a single file
```sh
$ node fileConcat.js
```

## Running the Server

Start the server using pm2 process mananger
```sh
$ pm2 start server.js
```

visit page in webbrowser at https://localhost

