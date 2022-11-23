class Planete {
  mesh = {};
  text = {};
  constructor(id, idName, map) {
    this.id = id
    this.name = idName
    this.maping = map
  }
}

const SolarSysteme = {
  Soleil: new Planete(0, "Soleil", { base: "./assets/map/Map_sun.jpg"}),
  Mercure: new Planete(1, "Mercure", { base: "./assets/map/Map_mercure.jpg"}),
  Venus: new Planete(2, "Venus", {
    base: "./assets/map/Map_venus.jpg",
    atmosphere: "./assets/map/Map_venus_atmosphere.jpg"
  }),
  Terre: new Planete(3, "Terre", {
    base: "./assets/map/Map_earth.jpg",
    atmosphere: "./assets/map/Map_earth_clouds.jpg",
    bump: " ./assets/map/Map_earth_bump.jpg"
  }),
  Mars: new Planete(4, "Mars", {
    base: "./assets/map/Map_mars.jpg"
  }),
  Jupiter: new Planete(5, "Jupiter", {
    base: "./assets/map/Map_jupiter.jpg"
  }),
  Saturne: new Planete(6, "Saturne", {
    base: "./assets/map/Map_saturne.jpg",
    ring: { map: "./assets/map/Map_saturnerings_polar.jpg", position: {x : 90} }
  }),
  Uranus: new Planete(7, "Uranus", {
    base: "./assets/map/Map_uranus.jpg",
    ring: { map: "./assets/map/Map_uranus_ringpolar.jpg", position: {x : 0} }
  }),
  Neptune: new Planete(8, "Neptune", {
    base: "./assets/map/Map_neptune.jpg"
  }),
}

export default SolarSysteme