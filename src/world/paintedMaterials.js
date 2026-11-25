import * as THREE from "three";

// Las superficies principales ahora son recursos artísticos SVG independientes.
// Se cargan como texturas GPU y se comparten entre todos los objetos del mundo.
const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();
const VALID_SURFACES = new Set(["grass", "earth", "stone", "plaster", "wood", "roof"]);

export function createPaintedTexture(kind, seed = 1) {
  const surface = VALID_SURFACES.has(kind) ? kind : "stone";
  if (textureCache.has(surface)) return textureCache.get(surface);

  const url = new URL(`../../assets/textures/${surface}.svg`, import.meta.url).href;
  const texture = textureLoader.load(
    url,
    loaded => {
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.wrapS = THREE.RepeatWrapping;
      loaded.wrapT = THREE.RepeatWrapping;
      loaded.anisotropy = 8;
      loaded.magFilter = THREE.LinearFilter;
      loaded.minFilter = THREE.LinearMipmapLinearFilter;
      loaded.generateMipmaps = true;
      loaded.needsUpdate = true;
    },
    undefined,
    error => console.error(`[Eldoria] No se pudo cargar la textura "${surface}":`, error)
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(surface, texture);
  return texture;
}
