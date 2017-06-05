<<<<<<< Updated upstream
class App {
	constructor() {
		let scope = this

		this.r = 1000000
		this.scene = new THREE.Scene()
		this.scene.background = new THREE.Color(0x000013)

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000000)
		this.camera.up.set(0, 0, 1);
		this.camera.position.y = 1000000

		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		})
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		document.body.appendChild(this.renderer.domElement)
		this.renderer.domElement.style.opacity = 0

		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
		this.controls.enableDamping = true
		this.controls.dampingFactor = 0.1
		this.controls.rotateSpeed = 0.1

		this.socket = io.connect()

		this.socket.emit('star_req', {});

// 		unfade(scope.renderer.domElement)
// 		unfade(document.getElementById('settings'))
// 		unfade(document.getElementById('about'))
		this.socket.on('star_data', function(data) {
			unfade(scope.renderer.domElement)
			unfade(document.getElementById('settings'))
			unfade(document.getElementById('about'))
			scope.setGeometry(data)

			this.disconnect()
		})

		window.addEventListener('resize', this.resize.bind(this), false)

		this.HUD = new HUD(this.scene, this.camera, this.r)		
		this.useHUD = true		
		this.HUD.hide()

		this.render()
	}

	render() {
		this.controls.update()
		this.HUD.update(this.camera)
		this.renderer.render(this.scene, this.camera)
		requestAnimationFrame(this.render.bind(this))
	}

	resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}
	
	toggleHUD() {
		this.useHUD = document.getElementById('HUDCheckbox').checked
		if(this.useHUD && this.usePlanetarium) {
			this.HUD.show()
		} else {
			this.HUD.hide()
		}
	}

	updateSettings() {
		this.usePlanetarium = document.getElementById('planetariumCheckbox').checked
		if (this.usePlanetarium) {
			this.gaia.geometry.addAttribute('position', new THREE.BufferAttribute(this.planetariumVertexArray, 3))
			this.gaia.material.color.setHex(0xaaa892)
			
			if(this.useHUD) {
				this.HUD.show()
			}
			
			this.camera.position.set(0.001, 0, 0)	

			this.controls.enableZoom = false
		} else {
			this.gaia.geometry.addAttribute('position', new THREE.BufferAttribute(this.gaiaVertexArray, 3))
			this.controls.enableZoom = true
			this.gaia.material.color.setHex(0xf9f5d9)
			
			this.camera.position.set(0, 1000000, 0)
			
			this.HUD.hide()
		}
	}

	setGeometry(vertexArrayBuffer) {
		this.gaiaVertexArray = new Float32Array(vertexArrayBuffer)
		this.planetariumVertexArray = new Float32Array(this.gaiaVertexArray.length)

		for (let i = 0; i < this.gaiaVertexArray.length; i = i + 3) {
			const x = this.gaiaVertexArray[i]
			const y = this.gaiaVertexArray[i + 1]
			const z = this.gaiaVertexArray[i + 2]

			let s = new THREE.Spherical().setFromVector3(new THREE.Vector3(x, y, z))

			s.radius = this.r

			const v2 = new THREE.Vector3().setFromSpherical(s)

			this.planetariumVertexArray[i] = v2.x
			this.planetariumVertexArray[i + 1] = v2.y
			this.planetariumVertexArray[i + 2] = v2.z
		}

		let gaiaMaterial = new THREE.PointsMaterial({
			color: 0xf9f5d9,
			depthWrite: false,
			size: 1,
			transparent: true,
			sizeAttenuation: false,
			map: new THREE.TextureLoader().load('textures/star.png')
		})

		let gaiaGeometry = new THREE.BufferGeometry().addAttribute('position', new THREE.BufferAttribute(this.gaiaVertexArray, 3))
		this.gaia = new THREE.Points(gaiaGeometry, gaiaMaterial)
		this.scene.add(this.gaia)
	}
}

app = new App()
=======
class App {
	constructor() {
		let scope = this

		this.r = 1000000
		this.scene = new THREE.Scene()
		this.scene.background = new THREE.Color(0x000013)

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000000)
		this.camera.up.set(0, 0, 1);
		this.camera.position.y = 1000000

		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		})
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		document.body.appendChild(this.renderer.domElement)
		this.renderer.domElement.style.opacity = 0

		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
		this.controls.enableDamping = true
		this.controls.dampingFactor = 0.1
		this.controls.rotateSpeed = 0.1

		this.socket = io.connect()

		this.socket.emit('star_req', {});

// 		unfade(scope.renderer.domElement)
// 		unfade(document.getElementById('settings'))
// 		unfade(document.getElementById('about'))
		this.socket.on('star_data', function(data) {
			unfade(scope.renderer.domElement)
			unfade(document.getElementById('settings'))
			unfade(document.getElementById('about'))
			scope.setGeometry(data)

			this.disconnect()
		})

		window.addEventListener('resize', this.resize.bind(this), false)

		this.HUD = new HUD(this.scene, this.camera, this.r)		
		this.useHUD = true		
		this.HUD.hide()

		this.render()
	}

	render() {
		this.controls.update()
		this.HUD.update(this.camera)
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		this.renderer.render(this.scene, this.camera)
		requestAnimationFrame(this.render.bind(this))
	}

	resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}
	
	toggleHUD() {
		this.useHUD = document.getElementById('HUDCheckbox').checked
		if(this.useHUD && this.usePlanetarium) {
			this.HUD.show()
		} else {
			this.HUD.hide()
		}
	}

	updateSettings() {
		this.usePlanetarium = document.getElementById('planetariumCheckbox').checked
		if (this.usePlanetarium) {
			this.gaia.geometry.addAttribute('position', new THREE.BufferAttribute(this.planetariumVertexArray, 3))
			this.gaia.material.color.setHex(0xaaa892)
			
			if(this.useHUD) {
				this.HUD.show()
			}
			
			this.camera.position.set(0.001, 0, 0)	

			this.controls.enableZoom = false
		} else {
			this.gaia.geometry.addAttribute('position', new THREE.BufferAttribute(this.gaiaVertexArray, 3))
			this.controls.enableZoom = true
			this.gaia.material.color.setHex(0xf9f5d9)
			
			this.camera.position.set(0, 1000000, 0)
			
			this.HUD.hide()
		}
	}

	setGeometry(vertexArrayBuffer) {
		this.gaiaVertexArray = new Float32Array(vertexArrayBuffer)
		this.planetariumVertexArray = new Float32Array(this.gaiaVertexArray.length)

		for (let i = 0; i < this.gaiaVertexArray.length; i = i + 3) {
			const x = this.gaiaVertexArray[i]
			const y = this.gaiaVertexArray[i + 1]
			const z = this.gaiaVertexArray[i + 2]

			let s = new THREE.Spherical().setFromVector3(new THREE.Vector3(x, y, z))

			s.radius = this.r

			const v2 = new THREE.Vector3().setFromSpherical(s)

			this.planetariumVertexArray[i] = v2.x
			this.planetariumVertexArray[i + 1] = v2.y
			this.planetariumVertexArray[i + 2] = v2.z
		}

		let gaiaMaterial = new THREE.PointsMaterial({
			color: 0xf9f5d9,
			depthWrite: false,
			size: 1,
			transparent: true,
			sizeAttenuation: false,
			map: new THREE.TextureLoader().load('textures/star.png')
		})

		let gaiaGeometry = new THREE.BufferGeometry().addAttribute('position', new THREE.BufferAttribute(this.gaiaVertexArray, 3))
		this.gaia = new THREE.Points(gaiaGeometry, gaiaMaterial)
		this.scene.add(this.gaia)
	}
}

app = new App()
>>>>>>> Stashed changes
