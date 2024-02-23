import * as THREE from "three";
import './style.css'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // gsap 
import gsap from 'gsap'
//
const loader = new THREE.TextureLoader()
const cross = loader.load('./star.png')
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//scene 
const scene = new THREE.Scene()

// Create Torus 
const geometry = new THREE.TorusGeometry(0.8, 0.2, 10, 100)
const material = new THREE.PointsMaterial({
  size: 0.005,
  color: "#fffffff",
  // roughness: ,
})

const particleMaterial = new THREE.PointsMaterial({
  size: 0.02,
  map: cross,
  transparent: true,
  blending: THREE.AdditiveBlending
})


// 2create particle
const particleGeomety = new THREE.BufferGeometry;
const particleCnt = 1000;
const posArry = new Float32Array(particleCnt * 3); //xyz,xyz,..

for (let i = 0; i < particleCnt * 3; i++) {
  // posArry[i] = Math.random()
  // posArry[i] = Math.random() - 0.5
  posArry[i] = (Math.random() - 0.5) * 3
}
particleGeomety.setAttribute('position', new THREE.BufferAttribute(posArry, 3))


//mesh

const mesh = new THREE.Points(geometry, material)
const particleMesh = new THREE.Points(particleGeomety, particleMaterial)

scene.add(mesh, particleMesh)



// light
const light = new THREE.PointLight(0xffffff, 70, 100, 1.7)
light.position.set(10, 10, 10)
light.intensity = 0
scene.add(light)




// camera so we can see in broswerr
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100) // 50 is also good, adding aspect ration 
camera.position.z = 4
scene.add(camera)
// to render to screne we do a canvas and add impolrted in index js 

// renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas })

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//resize 
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  // update camera 

  camera.aspect = sizes.width / sizes.height // this is  calculation for the size of canvas 
  camera.updateProjectionMatrix() // this was needed to get render working
  renderer.setSize(sizes.width, sizes.height) // sets canvas size 
})
// controls 

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false // so that object cannot be dragged 
controls.enableZoom = false // stops from zoooming
controls.autoRotate = true
controls.autoRotateSpeed = 1


// rerender canvas 

const loop = () => {
  // mesh.rotation.x += 0.1 // test , adding Gsap after this to make sure it will work 
  // mesh.position.x += 0.01 // this speed depends on computer
  // adding gsap 
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
  // adding gsap controls
  controls.update()
}

loop()

// timeline syncronise multoiple animation together

const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 }) // zoom and come out 
tl.fromTo('nav', { y: "-100" }, { y: "0" }) // nav drop from top 
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 }) // revaeal title 

// mouse animation 

let mouseDown = false
let rgb = []
window.addEventListener('mousedown', () => (mouseDown = true)) // hold animation left click is hold down
window.addEventListener('mouseup', () => (mouseDown = false))
// change coloir when holding the mouse button 
window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ] // added 150 for blue in z
    // console.log(rgb)
    // animate mouse down function
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)// new THREE.Color(`rgb(0,100,150)`)
    gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b })
  }

})

