class HUD {
  //r is radius of planetarium
  constructor(scene, camera, r) {
    let scope = this
    this.r = r
    this.scene = scene

    this.texts = []

    this.texts.push(new Text3D('North Celestial Pole', new THREE.Vector3(0, 0, r)))
    this.texts.push(new Text3D('South Celestial Pole', new THREE.Vector3(0, 0, -r)))
    this.texts.push(new Text3D('1st Point of Aries', new THREE.Vector3(r, 0, 0)))
    this.texts.push(new Text3D('1st Point of Libra', new THREE.Vector3(-r, 0, 50000)))
    this.texts.push(new Text3D('Celestial Equator', new THREE.Vector3(0, -r, 50000)))
    this.texts.push(new Text3D('Celestial Equator', new THREE.Vector3(0, r, 50000)))
    this.texts.push(new Text3D('Ecliptic', new THREE.Vector3(0, -r, 500000)))
    this.texts.push(new Text3D('Ecliptic', new THREE.Vector3(0, r, -450000)))
    
    this.coordinateLabel = new Text3D('ra , dec', new THREE.Vector3(0, 0, 0))
    this.coordinateLabel.setScreenPosition(20, 20)
    this.coordinateLabel.DOMelement.style.top = 'auto'
    this.coordinateLabel.DOMelement.style.bottom = '20px'
    this.coordinateLabel.hidden = true
    
    document.addEventListener('mousemove', function(e){
      let x = (event.clientX / window.innerWidth) * 2 - 1
      let y = - (event.clientY / window.innerHeight) * 2 + 1
      
      var v = new THREE.Vector3( x, y, -1)
      v.unproject(camera);
      
      const theta = Math.acos(v.z / Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2)))
      const phi = Math.atan2(v.y, v.x)
      
      scope.coordinateLabel.DOMelement.innerHTML = "RA: " + (phi * 180 / Math.PI) + " DEC: " + (theta * -180 / Math.PI + 90) 
    })

    this.equator = this.createEllipse(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), r, 0xe8c03e)
    this.ecliptic = this.createEllipse(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-23.4 * Math.PI / 180, 0, 0), r, 0xff1e5a) 
    this.celestialMeridian = this.createEllipse(new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.PI / 2, 0, 0), r, 0x5988ff)
    this.scene.add(this.equator) 
    this.scene.add(this.ecliptic)
    this.scene.add(this.celestialMeridian)
    
    this.ticks = []
    
    //right ascenion lines (0.0001 stops floating point errors)
    for(let theta = Math.PI / 18; theta < Math.PI - 0.0001; theta = theta + Math.PI / 18) {
      let tick = this.createEllipse(new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.PI / 2, 0, theta), r, 0x42ffc0)
      tick.material.transparent = true
      tick.material.opacity = 0.4
      this.scene.add(tick)
      this.ticks.push(tick)
    }
    
    for(let theta = -Math.PI / 2; theta < Math.PI / 2; theta = theta + Math.PI / 18) {
      const sign = theta < 0 ? 1 : -1
      const h = r * Math.cos(theta) * sign
      const ellipseRadius = r * Math.sin(theta)
      let tick = this.createEllipse(new THREE.Vector3(0, 0, h), new THREE.Vector3(0, 0, 0), ellipseRadius, 0x42ffc0)
      tick.material.transparent = true
      tick.material.opacity = 0.4
      this.scene.add(tick)
      this.ticks.push(tick)
    }
  }  
  
  hide() {
    for (let i = 0; i < this.texts.length; ++i) {
      this.texts[i].hidden = true
    }
    this.coordinateLabel.DOMelement.style.display = 'none'
    
    this.equator.visible = false
    this.ecliptic.visible = false
    this.celestialMeridian.visible = false
    for (let i = 0; i < this.ticks.length; ++i) {
      this.ticks[i].visible = false
    }
    
  }
  
  show(){
    for (let i = 0; i < this.texts.length; ++i) {
      this.texts[i].hidden = false
    }
    this.coordinateLabel.DOMelement.style.display = 'block'
    
    this.equator.visible = true
    this.ecliptic.visible = true
    this.celestialMeridian.visible = true
    for (let i = 0; i < this.ticks.length; ++i) {
      this.ticks[i].visible = true
    }
    
  }  
 
  createEllipse(center, rotation, radius, colour) {
    const ellipseCurve = new THREE.EllipseCurve(0, 0, radius - radius / 20, radius - 5000, 0, 2 * Math.PI, false, 0)
    const path = new THREE.Path(ellipseCurve.getPoints(90))
    let geometry = path.createPointsGeometry(90)

    geometry.translate(center.x, center.y, center.z)
    geometry.rotateX(rotation.x)
    geometry.rotateY(rotation.y)
    geometry.rotateZ(rotation.z)

    const material = new THREE.LineBasicMaterial({
      color: colour
    })
    return new THREE.Line(geometry, material)
  }

  update(camera) {
    for (let i = 0; i < this.texts.length; ++i) {
      this.texts[i].projectPosition(camera)
    }
    
    this.coordinateLabel.innerHTML = ""
  }
}

class Text3D {
  constructor(text, pos) {
    this.hidden = false
    this.text = text
    this.pos = pos
    this.screenPosition = new THREE.Vector2(0, 0)

    this.DOMelement = document.createElement('div')
    this.DOMelement.style.position = 'absolute'
    this.DOMelement.style.zIndex = '10'
    this.DOMelement.style.weight = "bold"
    this.DOMelement.style.color = "whitesmoke"
    this.DOMelement.style.fontSize = "14pt"
    this.DOMelement.style.overflow = 'hidden'
    //this.DOMelement.style.fontFamily = "Arial"
    this.DOMelement.innerHTML = this.text

    this.setScreenPosition(0, 0)
    document.body.appendChild(this.DOMelement)

  }

  show() {
    this.DOMelement.style.display = 'block'
  }

  hide() {
    this.DOMelement.style.display = 'none'
  }

  //sets position of DOM element on the screen
  setScreenPosition(x, y) {
    this.screenPosition.set(x, y)
    this.DOMelement.style.top = this.screenPosition.y + 'px'
    this.DOMelement.style.left = this.screenPosition.x + 'px'
  }

  //sets position of DOM element from 2D projection of a 3D position using the scenes camera
  projectPosition(camera) {
    var vector = this.pos.clone().project(camera);

    vector.x = (vector.x + 1) / 2 * window.innerWidth;
    vector.y = -(vector.y - 1) / 2 * window.innerHeight;

    if (vector.z < 1 && !this.hidden) {
      this.show()
    } else {
      this.hide()
    }

    this.setScreenPosition(vector.x, vector.y)
  }
}
