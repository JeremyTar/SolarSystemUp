import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"

// import { vertexShader } from "./shaders/vertex.glsl"

import SolarSysteme from "./Planete.js"

let PlanetSee = {}
let index = 3
let Myloop 
let initPlanet
let positionPlanet = {x: 15, y: 5}

function initLoop() {
  initPlanet.rotation.y += 0.001
  renderer.setSize(size.width, size.height);
  renderer.render(scene, camera);
  Myloop = requestAnimationFrame(initLoop)
}

function moveCameraLoopOut() {
  y += 0.01;
  if(y < yFinal) {
    camera.rotation.y = y
  }
  if(y > yFinal) {
    renderer.setAnimationLoop(null)
  }
  renderer.render(scene, camera)
}

function moveCameraLoopAdd() {
  y -= 0.01
  if(y > yInitial) {
    camera.rotation.y = y
  }
  if(y < yInitial) {
    camera.rotation.y = 0
    renderer.setAnimationLoop(null)
  }
  renderer.render(scene, camera)
}

function buildPlanete(element) {
  console.log(element)
  const base = createPlanete(element.maping.base);
  if (element.maping.atmosphere) {
    const atmosphere = createAtmosphere(element.maping.atmosphere);
    base.add(atmosphere)
  }
  if (element.maping.bump) {
    const bump = createBump(element.maping.bump)
    base.bumpMap = bump
    base.bumpScale = 0.13
  }
  if (element.maping.ring) {
    const ring = createRing(element.maping.ring.map)
    ring.rotation.x += element.maping.ring.position.x
    base.add(ring)
  }
  base.position.x = positionPlanet.x
  base.position.y = positionPlanet.y
  return base
}

function createPlanete(element) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(10, 64, 32),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load(element),
    })
  );
}

function createAtmosphere(element) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(10.1, 32, 16),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load(element),
      transparent: true,
      opacity: 0.5,
    })
  );
}

function createBump(element) {
  return new THREE.TextureLoader().load(element)
}

function createRing(element) {
  const texture = new THREE.TextureLoader().load(element)
  const ringGeometry = new THREE.RingGeometry(12, 15, 64);
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    transparent: false,
    side: THREE.DoubleSide,
    opacity: 1
  })
  return new THREE.Mesh(ringGeometry, material)
}

function create3DText(element) {
  const loader = new FontLoader()
  const text = element.name
  loader.load("./style/font/Space Age_Regular.json", (font) => {
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 3,
      height: 2,
      curveSegments: 3,
      bevelEnabled: false,
    })
    textGeometry.computeBoundingBox()
    const center = textGeometry.boundingBox.getCenter(new THREE.Vector3());
    const textMesh = new THREE.Mesh(textGeometry, new THREE.MeshPhongMaterial({
      flatShading: true,
      map: new THREE.TextureLoader().load(element.maping.base)
    }))
    textMesh.position.y = positionPlanet.y + 15
    textMesh.position.x -= center.x
    textMesh.position.x += positionPlanet.x
    scene.add(textMesh)

  }, (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded')
  }, (err) => {
    console.log(err)
    return 
  })

}

function changePlanete(etat) {
  if (etat === "before") {
    if (index == 0) {
      index = 8
    } else {
      index--
    }
  } else if(etat === "after" ) {
    if (index == 8) {
      index = 0
    } else {
      index++
    }
  } else {
    console.log("bad entrie for index statut")
    return
  }
  renderer.setAnimationLoop(moveCameraLoopOut)
  setTimeout(() => {
    console.log("apparition")
        cleanScene()
        window.cancelAnimationFrame(Myloop)
        initPlanet = buildPlanete(SolarSysteme[Object.keys(SolarSysteme)[index]])
        scene.add(initPlanet)
        create3DText(SolarSysteme[Object.keys(SolarSysteme)[index]])
        renderer.setAnimationLoop(moveCameraLoopAdd)
        setTimeout(() => {
          initLoop()
        }, 1000)      
  }, 2000)
}

function cleanScene() {
  for(let i = scene.children.length - 1; i > 1 ; i--) {
    const object = scene.children[i]
    object.geometry.dispose();
    object.material.dispose();
    scene.remove(object);    
  }
}



// inti Scene //
const size = {
  width: window.innerWidth,
  height: window.innerHeight
}

const scene = new THREE.Scene();
scene.background = new THREE.TextureLoader().load("./assets/background/8k_stars_milky_way.jpg");
const camera = new THREE.PerspectiveCamera(
  50,
  size.width / size.height,
  1,
  1000
);
camera.position.z = 50;
camera.position.y = 10
const yFinal = 1
const yInitial = 0
let y = camera.rotation.x
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("three"),
  antialias: true,
});

const ambientLight = new THREE.AmbientLight(0x404040, 1, 1000);
const PointLight = new THREE.PointLight( 0xffffff, 2, 100 )
PointLight.position.set(0, 10, 50)
scene.add(ambientLight, PointLight);

initPlanet = buildPlanete(SolarSysteme[Object.keys(SolarSysteme)[index]])

console.log(initPlanet)

scene.add(initPlanet)
create3DText(SolarSysteme[Object.keys(SolarSysteme)[index]])
initLoop()

let previousButton = document.getElementById("before")
let afterButton = document.getElementById("after")

previousButton.addEventListener("click", () => {
  changePlanete("before")
})
afterButton.addEventListener("click", () => {
  changePlanete("after")
})

window.addEventListener('resize', () =>
{
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

