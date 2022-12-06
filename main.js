import * as THREE from "three"
import {
  FontLoader
} from "three/examples/jsm/loaders/FontLoader.js"
import {
  TextGeometry
} from "three/examples/jsm/geometries/TextGeometry.js"

// import { vertexShader } from "./shaders/vertex.glsl"

import SolarSysteme from "./Planete.js"
import { Group } from "three"
console.log(SolarSysteme)

async function getInfo(url) {
  let json = await fetch(url)
  return await json.json()
}

let callAPI = await getInfo("https://api.le-systeme-solaire.net/rest/bodies?filter[]=isPlanet,eq,true")
callAPI.bodies.forEach(element => {
  for (const i in SolarSysteme) {
    if (element.name == SolarSysteme[i].name) {
      let caracteristique = {
        avgTemp: element.avgTemp - 273.15,
        sideralOrbit: element.sideralOrbit,
        sideralRotation: element.sideralRotation,
        diametre: element.meanRadius * 2,
      }
      SolarSysteme[i].caracteristique = caracteristique
    }
  }
});

let index = 3
let Myloop
let currentPlanete
let ratioDegres



// let positionPlanet = {x: 0, y:0}

function initLoop() {
  currentPlanete.rotation.y += 0.001
  renderer.setSize(size.width, size.height);
  renderer.render(scene, camera);
  Myloop = requestAnimationFrame(initLoop)
}



function loopForAnimationMouv() {
  // if (positionX >= destinationX) {
  //   camera.position.x -= 1
  //   positionX -= 1
  // } else if (positionX <= destinationX) {
  //   camera.position.x += 1
  //   positionX += 1
  // } else if (positionX == destinationX) {
  // }

  // // if(positionZ >= currentPlanete.position.z) {
  // //   camera.position.z -= 1
  // //   positionZ -= positionZ - 1
  // // } else if (positionZ <= currentPlanete.position.z) {
  // //   camera.position.z += 1
  // //   positionZ += 1
  // // } else if(positionZ == currentPlanete.position.z) { }

  // console.log(positionX)
  // console.log(destinationX)
  // camera.lookAt(currentPlanete.position.x, currentPlanete.position.y, currentPlanete.position.z)

  // if (positionZ == destinationZ && positionX == destinationX ) {
  //   renderer.setAnimationLoop(null)
  // }
  // renderer.render(scene, camera)
  let currentDegres = 0
  while(currentDegres < ratioDegres) {
    currentDegres += 0.001
    groupSolarSysteme.rotation.y += 0.001
    console.log(currentDegres)
  }
  renderer.setAnimationLoop(null)
}




// function moveCameraLoopOut() {
//   y += 0.01;
//   if(y < yFinal) {
//     camera.rotation.y = y
//   }
//   if(y > yFinal) {
//     renderer.setAnimationLoop(null)
//   }
//   renderer.render(scene, camera)
// }

// function moveCameraLoopAdd() {
//   y -= 0.01
//   if(y > yInitial) {
//     camera.rotation.y = y
//   }
//   if(y < yInitial) {
//     camera.rotation.y = 0
//     renderer.setAnimationLoop(null)
//   }
//   renderer.render(scene, camera)
// }


function roundPosition(position) {
  return Number.parseFloat(position).toFixed(2)

}

function buildPlanete(element) {
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
  // base.position.x = positionPlanet.x
  // base.position.y = positionPlanet.y
  return base
}

function BuildPositionPlanete(allplanete) {
  let nbrOfElement = 0
  for (const i in allplanete) {
    nbrOfElement++
  }
  const degrees = 360 / nbrOfElement
  ratioDegres = degrees
  let currentDegrees = 0
  for (const i in allplanete) {
    allplanete[i].mesh.position.x = Math.cos(currentDegrees) * 200
    allplanete[i].mesh.position.z = Math.sin(currentDegrees) * 200
    if(allplanete[i].name == "La Terre") {
      let positionLookAt = new THREE.Vector3(
        Math.cos(currentDegrees) + 15,
        0,
        Math.sin(currentDegrees) -2        
      )
      camera.lookAt(positionLookAt)
    }
    currentDegrees += degrees
  }
  return
}

function createPlanete(element) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(10, 64, 32),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load(element),
      side: THREE.DoubleSide,
    })
  );
}

function createAtmosphere(element) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(0.51, 32, 16),
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
  const ringGeometry = new THREE.RingGeometry(0.5, 0.6, 64);
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
  } else if (etat === "after") {
    if (index == 8) {
      index = 0
    } else {
      index++
    }
  } else {
    console.log("bad entrie for index status")
    return
  }
  // oldPlanete = currentPlanete
  currentPlanete = SolarSysteme[Object.keys(SolarSysteme)[index]].mesh
  // destinationX = Math.round(SolarSysteme[Object.keys(SolarSysteme)[index]].mesh.position.x)
  // destinationZ = Math.round(SolarSysteme[Object.keys(SolarSysteme)[index]].mesh.position.z)
  renderer.setAnimationLoop(loopForAnimationMouv)

  // renderer.setAnimationLoop(moveCameraLoopOut)
  // setTimeout(() => {
  //       cleanScene()
  //       window.cancelAnimationFrame(Myloop)
  //       initPlanet = buildPlanete(SolarSysteme[Object.keys(SolarSysteme)[index]])
  //       scene.add(initPlanet)
  //       create3DText(SolarSysteme[Object.keys(SolarSysteme)[index]])
  //       renderer.setAnimationLoop(moveCameraLoopAdd)
  //       setTimeout(() => {
  //         initLoop()
  //         buildText(SolarSysteme[Object.keys(SolarSysteme)[index]])
  //       }, 1000)      
  // }, 2000)
}

function cleanScene() {
  for (let i = scene.children.length - 1; i > 1; i--) {
    const object = scene.children[i]
    object.geometry.dispose();
    object.material.dispose();
    scene.remove(object);
  }
}

function buildText(element) {
  const title = document.getElementById('titlePlanete')
  title.innerText = element.name

  const description = document.getElementById('descriptionPlanete')
  description.innerText = element.description

  const temp = document.getElementById('temparaturePlanete')
  let tempfull = element.caracteristique.avgTemp
  let tempcut = tempfull.toString().split("0")
  temp.innerText = " " + tempcut[0] + " °C"

  const sidRotate = document.getElementById('sideralRotationPlanete')
  sidRotate.innerText = " " + element.caracteristique.sideralRotation + ' heures'

  const orBRotate = document.getElementById('OrbitaleRotationPlanete')
  orBRotate.innerText = " " + element.caracteristique.sideralOrbit + " jours"

  const diametre = document.getElementById('diametrePlanete')
  diametre.innerText = " " + element.caracteristique.diametre + " km"
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

// camera.position.x = 8
// camera.position.y = 0
// camera.position.z = 0


// const yFinal = 1
// const yInitial = 0
let y = camera.rotation.x
let positionX = Math.round(camera.position.x)
let positionZ = Math.round(camera.position.z)
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("three"),
  antialias: true,
});

const ambientLight = new THREE.AmbientLight(0x404040, 1, 1000);
const PointLight = new THREE.PointLight(0xffffff, 2, 250)
PointLight.position.set(0, 10, 0)
scene.add(ambientLight, PointLight);

const groupSolarSysteme = new THREE.Group()
for (const i in SolarSysteme) {
  SolarSysteme[i].mesh = buildPlanete(SolarSysteme[i])
  groupSolarSysteme.add(SolarSysteme[i].mesh)
}
BuildPositionPlanete(SolarSysteme)
scene.add(groupSolarSysteme)
buildText(SolarSysteme[Object.keys(SolarSysteme)[index]])
currentPlanete = SolarSysteme[Object.keys(SolarSysteme)[index]].mesh
console.log(currentPlanete)
camera.position.z = 100
camera.position.x = 100
initLoop()


let previousButton = document.getElementById("before")
let afterButton = document.getElementById("after")

previousButton.addEventListener("click", () => {
  changePlanete("before")
})
afterButton.addEventListener("click", () => {
  changePlanete("after")
})

window.addEventListener('resize', () => {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});