import * as THREE from "three";
const WORLD_SIZE = 220;

function smoothNoise(x, z, scale, phase = 0) {
  return Math.sin((x + phase) * scale) * Math.cos((z - phase) * scale * 0.83);
}

export function terrainHeight(x, z) {
  const broad = smoothNoise(x, z, 0.026, 11) * 2.0;
  const rolling = smoothNoise(x + 31, z - 17, 0.057, 4) * 0.68;
  const ridge = Math.pow(Math.abs(smoothNoise(x - 13, z + 27, 0.018, 8)), 1.7) * 1.7;
  const hillA = 7.2 * Math.exp(-(((x - 55) ** 2) / 1050 + ((z - 48) ** 2) / 1350));
  const hillB = 5.4 * Math.exp(-(((x + 66) ** 2) / 1550 + ((z - 56) ** 2) / 1200));
  const hillC = 3.8 * Math.exp(-(((x - 48) ** 2) / 1900 + ((z + 67) ** 2) / 1500));
  const villageFlat = Math.exp(-(((x + 28) ** 2) / 1050 + ((z - 1) ** 2) / 900));
  const riverFlat = Math.exp(-((z + 25) ** 2) / 115);
  const hills = (broad + rolling + ridge + hillA + hillB + hillC) * (1 - villageFlat * 0.94);
  return hills * (1 - riverFlat * 0.995);
}

function createGroundTexture() {
  const size = 256, canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d"), img = ctx.createImageData(size, size);
  let seed = 9137;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < img.data.length; i += 4) {
    const shade = Math.floor(random() * 34);
    img.data[i] = 83 + shade; img.data[i + 1] = 112 + shade; img.data[i + 2] = 62 + Math.floor(shade * 0.48); img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  for (let i = 0; i < 160; i++) {
    const x = random() * size, y = random() * size, r = 4 + random() * 15;
    ctx.fillStyle = random() > 0.5 ? "rgba(174,158,103,0.13)" : "rgba(35,83,43,0.18)";
    ctx.beginPath(); ctx.ellipse(x, y, r * 1.7, r, random() * 3, 0, Math.PI * 2); ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(9, 9); texture.anisotropy = 2;
  return texture;
}

export function createTerrain(scene) {
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 132, 132);
  geometry.rotateX(-Math.PI / 2);
  const pos = geometry.attributes.position, colors = [];
  const meadow = new THREE.Color(0x78985b), light = new THREE.Color(0xa4ae72), earth = new THREE.Color(0x9a8966);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), h = terrainHeight(x, z);
    pos.setY(i, h);
    const variation = (Math.sin(x * 0.11) + Math.cos(z * 0.13)) * 0.04;
    const color = meadow.clone().lerp(light, THREE.MathUtils.clamp(0.36 + h * 0.03 + variation, 0, 0.8));
    if (h > 5) color.lerp(earth, 0.18);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const ground = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: createGroundTexture(), vertexColors: true, roughness: 1 }));
  scene.add(ground);

  const waterMat = new THREE.MeshStandardMaterial({ color: 0x4f9ba5, roughness: 0.2, metalness: 0.03, transparent: true, opacity: 0.9 });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(240, 13.2, 48, 4), waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -0.06, -25);
  scene.add(water);
  const bankMat = new THREE.MeshStandardMaterial({ color: 0x9b936c, roughness: 1 });
  for (const z of [-32.25, -17.75]) {
    const bank = new THREE.Mesh(new THREE.BoxGeometry(220, 0.18, 1.1), bankMat);
    bank.position.set(0, -0.03, z); scene.add(bank);
  }
  return { heightAt: terrainHeight, water };
}
