class App {
	constructor() {
		let app = this

		this.scene = new THREE.Scene()

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000000)
		this.camera.position.z = 10000

		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		})
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		document.body.appendChild(this.renderer.domElement)
		this.renderer.domElement.style.opacity = 1

		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.1;
		this.controls.rotateSpeed = 0.1;

		this.socket = io.connect();
		this.socket.emit('star_req', {});

		this.socket.on('star_data', this.setGeometry.bind(this))

		window.addEventListener('resize', this.resize.bind(this), false);

		this.render();
	}

	render() {
		this.renderer.render(this.scene, this.camera)
		requestAnimationFrame(this.render.bind(this));
	}

	resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	setGeometry(vertexArray) {
		let gaiaMaterial = new THREE.PointsMaterial( { color: 0xFFFFFF } )
		let gaiaGeometry = new THREE.BufferGeometry();
		gaiaGeometry.addAttribute('position', new THREE.BufferAttribute( new Float32Array(vertexArray), 3 ) );
		let gaia = new THREE.Points( gaiaGeometry, gaiaMaterial );
		this.scene.add(gaia);

	}
}

app = new App()