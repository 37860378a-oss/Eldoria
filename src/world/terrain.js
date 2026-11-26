import * as THREE from "three";

const WORLD_SIZE = 550;

function smooth01(t) {
  t = THREE.MathUtils.clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
}

function plateau(x, z, cx, cz, radius, height, edge = 5) {
  const d = Math.hypot(x - cx, z - cz);
  return height * (1 - smooth01((d - radius) / edge));
}

function noise(x, z, s, p = 0) {
  return Math.sin((x + p) * s) * Math.cos((z - p) * s * 0.83);
}

function baseHeight(x, z) {
  const broad = noise(x, z, 0.026, 11) * 2;
  const rolling = noise(x + 31, z - 17, 0.057, 4) * 0.68;
  const ridge = Math.pow(Math.abs(noise(x - 13, z + 27, 0.018, 8)), 1.7) * 1.7;
  const a = 7.2 * Math.exp(-(((x - 55) ** 2) / 1050 + ((z - 48) ** 2) / 1350));
  const b = 5.4 * Math.exp(-(((x + 66) ** 2) / 1550 + ((z - 56) ** 2) / 1200));
  const c = 3.8 * Math.exp(-(((x - 48) ** 2) / 1900 + ((z + 67) ** 2) / 1500));
  const flat = Math.exp(-(((x + 28) ** 2) / 1050 + ((z - 1) ** 2) / 900));
  const edge = Math.max(Math.abs(x), Math.abs(z));
  const rim = smooth01((edge - 155) / 120);
  const mountainRim = rim * rim * (27 + 10 * Math.abs(Math.sin(x * 0.031 + z * 0.019)) + 5 * Math.abs(Math.sin(z * 0.057 - x * 0.023)));
  const mesas = plateau(x, z, 142, -108, 25, 13, 7) + plateau(x, z, -145, 132, 22, 10, 6);
  return (broad + rolling + ridge + a + b + c) * (1 - flat * 0.94) + mountainRim + mesas;
}

export function terrainHeight(x, z) {
  return baseHeight(x, z);
}

// Textura procedural y repetible: tierra cálida como base y césped apagado
// en manchas naturales. No depende de imágenes externas ni de mapas PBR verdes.
function createGroundTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d");
  const image = context.createImageData(size, size);

  const dirt = [139, 112, 79];
  const grass = [111, 124, 83];
  const darkSoil = [105, 82, 58];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      // Frecuencias enteras para que los bordes de la textura encajen.
      const broad = Math.sin(u * Math.PI * 6 + Math.sin(v * Math.PI * 4)) *
        Math.cos(v * Math.PI * 6 - Math.sin(u * Math.PI * 4));
      const medium = Math.sin(u * Math.PI * 22 + v * Math.PI * 14) *
        Math.cos(v * Math.PI * 18 - u * Math.PI * 12);
      const fine = Math.sin(u * Math.PI * 118 + v * Math.PI * 92) *
        Math.cos(v * Math.PI * 106 - u * Math.PI * 86);
      const patch = broad * 0.72 + medium * 0.28;
      const grassMix = smooth01((patch + 0.18) * 1.35) * 0.48;
      const soilMix = smooth01((-patch - 0.48) * 1.1) * 0.24;
      const grain = fine * 5.5 + medium * 3.2;
      const index = (y * size + x) * 4;

      for (let channel = 0; channel < 3; channel++) {
        let value = dirt[channel] * (1 - grassMix - soilMix) +
          grass[channel] * grassMix + darkSoil[channel] * soilMix;
        value += grain;
        image.data[index + channel] = Math.max(0, Math.min(255, value));
      }
      image.data[index + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  texture.anisotropy = 8;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

export function createTerrain(scene) {
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 420, 420);
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.attributes.position;

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    positions.setY(i, terrainHeight(x, z));
  }

  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    map: createGroundTexture(),
    color: 0xffffff,
    roughness: 1,
    metalness: 0
  });

  const ground = new THREE.Mesh(geometry, material);
  ground.receiveShadow = true;
  scene.add(ground);
  return { heightAt: terrainHeight, update() {} };
}
