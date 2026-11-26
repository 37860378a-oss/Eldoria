import * as THREE from "three";

// Texturas PBR optimizadas para las construcciones medievales de Eldoria.
// Los mapas se cargan desde las carpetas originales del repositorio.
const loader = new THREE.TextureLoader();

function loadTexture(path, repeatX, repeatY, isColor = false) {
  const texture = loader.load(new URL(path, import.meta.url).href);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.anisotropy = 4;
  if (isColor) texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const tudorMap = loadTexture("../../tudor_wall_04_1k/tudor_wall_04_basecolor_1k.png", 2.2, 1.7, true);
const tudorNormal = loadTexture("../../tudor_wall_04_1k/tudor_wall_04_normal_gl_1k.png", 2.2, 1.7);
const tudorRoughness = loadTexture("../../tudor_wall_04_1k/tudor_wall_04_roughness_1k.png", 2.2, 1.7);
const tudorAO = loadTexture("../../tudor_wall_04_1k/tudor_wall_04_ambientocclusion_1k.png", 2.2, 1.7);

const brickMap = loadTexture("../../bricks_wall_07_1k/bricks_wall_07_baseColor_1k.png", 2.4, 1.8, true);
const brickNormal = loadTexture("../../bricks_wall_07_1k/bricks_wall_07_normal_gl_1k.png", 2.4, 1.8);
const brickRoughness = loadTexture("../../bricks_wall_07_1k/bricks_wall_07_roughness_1k.png", 2.4, 1.8);
const brickAO = loadTexture("../../bricks_wall_07_1k/bricks_wall_07_ambientOcclusion_1k.png", 2.4, 1.8);

const roofMap = loadTexture("../../roof_tiles_02_1k/roof_tiles_02_color_1k.png", 2.8, 2.2, true);
const roofNormal = loadTexture("../../roof_tiles_02_1k/roof_tiles_02_normal_gl_1k.png", 2.8, 2.2);
const roofRoughness = loadTexture("../../roof_tiles_02_1k/roof_tiles_02_roughness_1k.png", 2.8, 2.2);
const roofAO = loadTexture("../../roof_tiles_02_1k/roof_tiles_02_ambient_occlusion_1k.png", 2.8, 2.2);

export const surfaceMaterials = {
  tudor: new THREE.MeshStandardMaterial({
    map: tudorMap, normalMap: tudorNormal, roughnessMap: tudorRoughness,
    aoMap: tudorAO, roughness: 1
  }),
  brick: new THREE.MeshStandardMaterial({
    map: brickMap, normalMap: brickNormal, roughnessMap: brickRoughness,
    aoMap: brickAO, roughness: 1
  }),
  roof: new THREE.MeshStandardMaterial({
    map: roofMap, normalMap: roofNormal, roughnessMap: roofRoughness,
    aoMap: roofAO, roughness: 1
  })
};

// Three.js necesita un segundo canal UV para aplicar ambient occlusion.
export function prepareGeometry(geometry) {
  const uv = geometry.attributes.uv;
  if (uv && !geometry.attributes.uv2) geometry.setAttribute("uv2", uv.clone());
  return geometry;
}
