class Planete {
  id;
  mesh = {};
  text = {};
  constructor(id, idName, map, MyDescription) {
    this.id = id
    this.name = idName
    this.maping = map
    this.description = MyDescription
  }
}

const SolarSysteme = {
  Soleil: new Planete(
    0,
    "Soleil",
    { base: "./assets/map/Map_sun.jpg" },
    "Le Soleil est l’étoile du Système solaire. Le Soleil fait partie de la galaxie appelée la Voie lactée et se situe à environ 8 kpc (environ 26 100 a.l.) du centre galactique."
  ),
  Mercure: new Planete(
    1,
    "Mercure",
    { base: "./assets/map/Map_mercure.jpg" },
    "Mercure est la planète la plus proche du Soleil et la moins massive du Système solaire."
  ),
  Venus: new Planete(
    2,
    "Vénus", {
    base: "./assets/map/Map_venus.jpg",
    atmosphere: "./assets/map/Map_venus_atmosphere.jpg"
  },
    "Vénus est la deuxième planète du Système solaire par ordre d'éloignement au Soleil, et la sixième plus grosse aussi bien par la masse que le diamètre."
    ),
  Terre: new Planete(3, "La Terre", {
    base: "./assets/map/Map_earth.jpg",
    atmosphere: "./assets/map/Map_earth_clouds.jpg",
    bump: " ./assets/map/Map_earth_bump.jpg"
  },
    "La Terre est la troisième planète par ordre d'éloignement au Soleil et la cinquième plus grande du Système solaire aussi bien par la masse que par le diamètre. Par ailleurs, elle est le seul objet céleste connu pour abriter la vie."
    ),
  Mars: new Planete(4, "Mars", {
    base: "./assets/map/Map_mars.jpg"
  },
  "Mars (prononcé en français : /maʁs/) est la quatrième planète du Système solaire par ordre croissant de la distance au Soleil et la deuxième par ordre croissant de la taille et de la masse."
  ),
  Jupiter: new Planete(5, "Jupiter", {
    base: "./assets/map/Map_jupiter.jpg"
  },
  "Jupiter est la cinquième planète du Système solaire par ordre d'éloignement au Soleil, et la plus grande par la taille et la masse devant Saturne, qui est comme elle une planète géante gazeuse."
  ),
  Saturne: new Planete(6, "Saturne", {
    base: "./assets/map/Map_saturne.jpg",
    ring: { map: "./assets/map/Map_saturnerings_polar.jpg", position: { x: 90 } }
  },
  "Saturne est la sixième planète du Système solaire par ordre d'éloignement au Soleil, et la deuxième plus grande par la taille et la masse après Jupiter, qui est comme elle une planète géante gazeuse."
  ),
  Uranus: new Planete(7, "Uranus", {
    base: "./assets/map/Map_uranus.jpg",
    ring: { map: "./assets/map/Map_uranus_ringpolar.jpg", position: { x: 0 } }
  },
  "Uranus est la septième planète du Système solaire par ordre d'éloignement du Soleil."
  ),
  Neptune: new Planete(8, "Neptune", {
    base: "./assets/map/Map_neptune.jpg"
  }, "Neptune est la huitième planète par ordre d'éloignement au Soleil et la plus éloignée connue du Système solaire"),
}

export default SolarSysteme