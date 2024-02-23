import './style.css'
import * as THREE from 'three'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui' // this is for debugging 
import gsap from 'gsap'
// import { CSSRulePlugin } from 'gsap/CSSRulePlugin';


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects ( skeleton , Mesh, scene)
const geometry = new THREE.TorusGeometry(.7, .2, 16, 100);

// Materials
const material = new THREE.PointsMaterial({
  size: 0.005,
  color: "0xff0000",
})


// 2create particle

const loader = new THREE.TextureLoader()
const cross = loader.load('./star.png')
const particleGeomety = new THREE.BufferGeometry;
const particleCnt = 500;
const posArry = new Float32Array(particleCnt * 3); //xyz,xyz,..

const particleMaterial = new THREE.PointsMaterial({
  size: 0.02,
  map: cross,
  transparent: true,
  blending: THREE.AdditiveBlending,
  //color: "blue",
})


for (let i = 0; i < particleCnt * 3; i++) {
  // posArry[i] = Math.random()
  // posArry[i] = Math.random() - 0.5
  posArry[i] = (Math.random() - 0.5) * 3
}
particleGeomety.setAttribute('position', new THREE.BufferAttribute(posArry, 3))

// Mesh
const sphere = new THREE.Points(geometry, material)
const particleMesh = new THREE.Points(particleGeomety, particleMaterial)
scene.add(sphere, particleMesh) // added 2nd particles

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.setClearColor(new THREE.Color('#21282a'), 1)




//adding mouse 
document.addEventListener('mousemove', animateParticles)
let mouseX = 0
let mouseY = 0

function animateParticles(event) {
  mouseY = (event.clientY / sizes.height) * 255 // mapping screen size to 255 value
  mouseX = (event.clientX / sizes.width) * 255
}



/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {

  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime
  //particleMesh.rotation.y = -0.1 * elapsedTime
  particleMesh.rotation.x = 0.1 * elapsedTime // fallling stars
  if (mouseX > 0) {
    //   particleMesh.rotation.x = -mouseY * (elapsedTime * 0.0008)
    particleMesh.rotation.y = mouseX * (elapsedTime * 0.0004)
  }
  if (mouseY > 0) {
    particleMesh.rotation.x = mouseY * (elapsedTime * 0.0004)
    // particleMesh.rotation.y = -mouseX * (elapsedTime * 0.0008)
  }
  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)

  controls.update()
}

tick()
// gsap.registerPlugin(CSSRulePlugin); // premium dont use this method
// add this this to css clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
// const content = CSSRulePlugin.getRule('.content:before')
// const h1 = document.querySelector('h1')
// const p = document.querySelector('p')
// const tl = gsap.timeline()

// tl.from(content, { delay: 0.5, duration: 4, cssRule: { scaleX: 0 } })
// tl.to(h1, { duration: 2, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', y: '30px' }, "-=0.3")
// tl.to(p, { duration: 4, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', y: '30px' }, "-=0.3")
