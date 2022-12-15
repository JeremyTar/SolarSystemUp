import * as THREE from "three"
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
// IMPORT SHADERS

import SolarSysteme from "./Planete.js"

window.addEventListener('DOMContentLoaded', () => {
  console.log("dom loaded")
  const loader = document.getElementById("loader")
  loader.style.transform = "translateY(2000px)"
  setTimeout(() => {
    loader.style.display = "none"
  }, 5000)

});



async function getInfo(url) {
  let json = await fetch(url)
  return await json.json()
}

// GET INFORMATIONS FOR COMPLET OUR CLASS

let callAPI = await getInfo("https://api.le-systeme-solaire.net/rest/bodies?filter[]=isPlanet,eq,true")
callAPI.bodies.forEach(element => {
  for (const i in SolarSysteme) {
    if(SolarSysteme[i].name == "Soleil") {
      let caracteristique = {
        "Température moyenne": 5500.000000001,
        "Rotation Orbitale": "225 Millions d'années", 
        "Période de rotation": "?",
        "Diamètre": "1,3927 million"
      }
      SolarSysteme[i].caracteristique = caracteristique
    }
    if (element.name == SolarSysteme[i].name) {
      let caracteristique = {
        "Température moyenne": element.avgTemp - 273.15,
        "Rotation Orbitale": element.sideralOrbit,
        "Période de rotation": element.sideralRotation,
        "Diamètre": element.meanRadius * 2,
      }
      SolarSysteme[i].caracteristique = caracteristique
    }
  }
})

// INDEX VARIABLES + FUNCTION
/*
*   initLoop()
*   buildPlanete(element); element = class Planete
*   BuildPositionPlanete(allplanete) / (not use) Display planete at 380 deg ; allplanete = SolarSysteme
*   createPlanete(element)
*   createShadersAtmosphere(element)
*   createAtmosphere(element)
*   createBump(element) / (not working)
*   createRing(element, size) 
*   create3DText(element)
*   changePlanete(etat) / mouv index
*   buildText(element) / remove and generate text in panel
*/

let index = 3
let Myloop
let oldPlanete
let currentPlanete
let myText

// RENDER LOOP 

function initLoop() {
  currentPlanete.rotation.y += 0.001
  renderer.setSize(size.width, size.height);
  renderer.render(scene, camera);
  Myloop = requestAnimationFrame(initLoop)
}

function buildPlanete(element) {
  const base = createPlanete(element);
  const shadersAtmos = createShadersAtmosphere(element.maping.shaders)
  base.add(shadersAtmos)
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
    const ring = createRing(element.maping.ring.map, element.maping.ring.position.size)
    ring.rotation.x += element.maping.ring.position.x
    base.add(ring)
  }
  return base
}

// function BuildPositionPlanete(allplanete) {
//   let nbrOfElement = 0
//   for (const i in allplanete) {
//     nbrOfElement++
//   }
//   const degrees = 360 / nbrOfElement
//   ratioDegres = degrees
//   let currentDegrees = 0
//   for (const i in allplanete) {
//     allplanete[i].mesh.position.x = Math.cos(currentDegrees) * 200
//     allplanete[i].mesh.position.z = Math.sin(currentDegrees) * 200
//     if(allplanete[i].name == "La Terre") {
//       let positionLookAt = new THREE.Vector3(
//         Math.cos(currentDegrees) + 15,
//         0,
//         Math.sin(currentDegrees) -2        
//       )
//       camera.lookAt(positionLookAt)
//     }
//     currentDegrees += degrees
//   }
//   return
// }

function createPlanete(element) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(10, 64, 32),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load(element.maping.base),
    })
  );
}

function createShadersAtmosphere(element) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(element.atmosSize,64,32),
    new THREE.ShaderMaterial({
      vertexShader : element.vertexAtmos,
      fragmentShader: element.fragmentAtmos,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })
  )
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

function createRing(element, size) {
  const texture = new THREE.TextureLoader().load(element)
  const ringGeometry = new THREE.RingGeometry(size.begin, size.end, 64);
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    transparent: true,
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
    textMesh.position.x -= center.x
    textMesh.position.y += 15
    myText = textMesh
    scene.add(textMesh)

  }, (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded')
  }, (err) => {
    console.log(err)
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
  oldPlanete = currentPlanete
  currentPlanete = SolarSysteme[Object.keys(SolarSysteme)[index]].mesh
  buildText(SolarSysteme[Object.keys(SolarSysteme)[index]])
  scene.remove(oldPlanete)
  scene.add(currentPlanete)
  scene.remove(myText)
  create3DText(SolarSysteme[Object.keys(SolarSysteme)[index]])
}

function buildTableAtmos() {
  let table = document.getElementById("tableAtmos")
  let child = table.lastElementChild; 
  while (child) {
      table.removeChild(child);
      child = table.lastElementChild;
  }
  for(const i in SolarSysteme[Object.keys(SolarSysteme)[index]].atmosphereCompo) {
    const tr = document.createElement("tr")
    const th = document.createElement("th")
    th.innerText = i
    const td = document.createElement("td")
    if(SolarSysteme[Object.keys(SolarSysteme)[index]].atmosphereCompo[i] == "Traces") {
      td.innerText = SolarSysteme[Object.keys(SolarSysteme)[index]].atmosphereCompo[i]
    } else {
      td.innerText = SolarSysteme[Object.keys(SolarSysteme)[index]].atmosphereCompo[i] + " %"
    }
    tr.appendChild(th)
    tr.appendChild(td)
    table.appendChild(tr)
  }
}


function  buildTableCaracteristique() {
  let tablePlanet = document.getElementById("tablePlanet")
  let childPlanet = tablePlanet.lastElementChild; 
  while (childPlanet) {
      tablePlanet.removeChild(childPlanet);
      childPlanet = tablePlanet.lastElementChild;
  }
  for(const i in SolarSysteme[Object.keys(SolarSysteme)[index]].caracteristique) {
      const trPlanet = document.createElement("tr")
      const thPlanet = document.createElement("th")
      thPlanet.innerText = i
      const tdPlanet = document.createElement("td")
      switch (i) {
        case "Température moyenne" :
          let temp = SolarSysteme[Object.keys(SolarSysteme)[index]].caracteristique[i]
          let tempSplit = temp.toString().split(".")
          let decimal = tempSplit[1].split("")
          let finalTemp = tempSplit[0] + "." + decimal[0] + decimal[1]
          tdPlanet.innerText = finalTemp + "°C"
          break
        case "Rotation Orbitale" :
          if(SolarSysteme[Object.keys(SolarSysteme)[index]].name == "Soleil") {
            tdPlanet.innerText = SolarSysteme[Object.keys(SolarSysteme)[index]].caracteristique[i]
          } else {
            tdPlanet.innerText = SolarSysteme[Object.keys(SolarSysteme)[index]].caracteristique[i] + " Jours"
          }
          break
        case "Période de rotation" :
          tdPlanet.innerText = SolarSysteme[Object.keys(SolarSysteme)[index]].caracteristique[i] + " Heures"
          break
        case "Diamètre" :
          if(SolarSysteme[Object.keys(SolarSysteme)[index]].name == "Soleil") {
            tdPlanet.innerText = SolarSysteme[Object.keys(SolarSysteme)[index]].caracteristique[i] + " de Km"
          } else {
            tdPlanet.innerText = SolarSysteme[Object.keys(SolarSysteme)[index]].caracteristique[i] + " Km"
          }
      }
      trPlanet.appendChild(thPlanet)
      trPlanet.appendChild(tdPlanet)
      tablePlanet.appendChild(trPlanet)
  }
}

function buildText(element) {
  //Build description
  const description = document.getElementById('descriptionPlanete')
  description.innerText = element.description
  buildTableAtmos()
  buildTableCaracteristique()
}

// inti Scene //
/*
*   sizing
*   scene
*   camera
*   renderer
*   light
*   build planete and put un array
*   build text
*   run initloop
*/

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

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("three"),
  antialias: true,
});

const ambientLight = new THREE.AmbientLight(0x404040, 3.5, 50);
const PointLight = new THREE.PointLight(0xffffff, 1, 50)
PointLight.position.set(0, 50, 0)
scene.add(ambientLight, PointLight);

const groupSolarSysteme = new THREE.Group()
for (const i in SolarSysteme) {
  SolarSysteme[i].mesh = buildPlanete(SolarSysteme[i])
  groupSolarSysteme.add(SolarSysteme[i].mesh)
}
buildText(SolarSysteme[Object.keys(SolarSysteme)[index]])
currentPlanete = SolarSysteme[Object.keys(SolarSysteme)[index]].mesh
scene.add(currentPlanete)
create3DText(SolarSysteme[Object.keys(SolarSysteme)[index]])
camera.position.z = 50
camera.position.y += 2
initLoop()


// BUTTON PART
/* Emit variable
*  Make eventListener
*/

let previousButton = document.getElementById("before")
let afterButton = document.getElementById("after")
let elementButtonOpen = document.getElementById("openPeriodique")
let elementButtonClose = document.getElementById("closePeriodique")
let tableau = document.getElementById("periodique")

previousButton.addEventListener("click", () => {
  changePlanete("before")
})
afterButton.addEventListener("click", () => {
  changePlanete("after")
})
elementButtonOpen.addEventListener('click', () => {
  if(tableau.style.display == 'block') {
    return
  }
  tableau.style.display = 'block'
})
elementButtonClose.addEventListener('click', () => {
  if(tableau.style.display == 'none') {
    return
  }
  tableau.style.display = 'none'
})

// RESPONSIVE THREE

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});