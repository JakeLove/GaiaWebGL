class App {
	constructor() {
		let scope = this;
		
		this.planetarium = false

		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000000);
		this.camera.position.z = 10000;

		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
		this.renderer.domElement.style.opacity = 0;

		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.1;
		this.controls.rotateSpeed = 0.1;

		this.socket = io.connect();
		this.socket.emit('star_req', {});

		this.socket.on('star_data', function(data) {
			unfade(app.renderer.domElement);
			unfade(document.getElementById('settingsBox'));
			scope.setGeometry(data);
		});

		window.addEventListener('resize', this.resize.bind(this), false);

		this.render();
	}

	render() {
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.render.bind(this));
	}

	resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
	switchMode() {
		this.planetarium = !this.planetarium
		
		if(this.planetarium) {
			this.gaia.geometry.addAttribute('position', new THREE.BufferAttribute(this.planetariumVertexArray, 3));
			this.camera.x = 0
			this.camera.y = 0
			this.camera.z = 1
			
			this.controls.enableZoom = false
		} else {
			this.gaia.geometry.addAttribute('position', new THREE.BufferAttribute(this.gaiaVertexArray, 3));
			this.controls.enableZoom = true
		}
	}

	setGeometry(vertexArrayBuffer) {
		this.gaiaVertexArray = new Float32Array(vertexArrayBuffer);
		this.planetariumVertexArray = new Float32Array(this.gaiaVertexArray.length)

		for (let i = 0; i < this.gaiaVertexArray.length; i = i + 3) {
			const x = this.gaiaVertexArray[i];
			const y = this.gaiaVertexArray[i + 1];
			const z = this.gaiaVertexArray[i + 2];
			
			let s = new THREE.Spherical().setFromVector3(new THREE.Vector3(x, y, z));
			
			s.radius = 1000000
			
			const v2 = new THREE.Vector3().setFromSpherical(s);

			this.planetariumVertexArray[i] = v2.x;
			this.planetariumVertexArray[i + 1] = v2.y;
			this.planetariumVertexArray[i + 2] = v2.z;
		}

		let gaiaMaterial = new THREE.PointsMaterial({
			depthWrite: false,
			size: 1,
			transparent: true,
			sizeAttenuation: false,
			map: new THREE.TextureLoader().load('textures/star.png')
		});

		let gaiaGeometry = new THREE.BufferGeometry().addAttribute('position', new THREE.BufferAttribute(this.gaiaVertexArray, 3));
		this.gaia = new THREE.Points(gaiaGeometry, gaiaMaterial);
		this.scene.add(this.gaia);
	}
}

app = new App();
