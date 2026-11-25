import * as THREE from "three";

const mats = {
  wall: new THREE.MeshStandardMaterial({ color: 0xc0ad86, roughness: 1 }),
  plaster: new THREE.MeshStandardMaterial({ color: 0xd0c19b, roughness: 1 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x624a34, roughness: 1 }),
  darkWood: new THREE.MeshStandardMaterial({ color: 0x3e3429, roughness: 1 }),
  roof: new THREE.MeshStandardMaterial({ color: 0x795447, roughness: 1, flatShading: true }),
  roofLight: new THREE.MeshStandardMaterial({ color: 0x967052, roughness: 1, flatShading: true }),
  stone: new THREE.MeshStandardMaterial({ color: 0x858477, roughness: 1, flatShading: true }),
  glow: new THREE.MeshStandardMaterial({ color: 0xe0b96d, emissive: 0x8c5724, emissiveIntensity: 0.35 })
};

function box(parent, w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}
function makeHouse(scene, x, z, width, depth, height, heightAt, roofMat = mats.roof) {
  const group = new THREE.Group();
  box(group, width, height, depth, mats.plaster, 0, height / 2, 0);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(width, depth) * 0.78, height * 0.72, 4), roofMat);
  roof.position.y = height + height * 0.34;
  roof.rotation.y = Math.PI / 4;
  roof.scale.z = depth / width;
  group.add(roof);
  box(group, width * 0.16, height * 0.52, 0.12, mats.darkWood, 0, height * 0.26, depth / 2 + 0.07);
  box(group, width * 0.17, height * 0.24, 0.08, mats.glow, -width * 0.28, height * 0.62, depth / 2 + 0.08);
  box(group, width * 0.17, height * 0.24, 0.08, mats.glow, width * 0.28, height * 0.62, depth / 2 + 0.08);
  group.position.set(x, heightAt(x, z), z);
  scene.add(group);
  return group;
}

export function createVillage(scene, heightAt) {
  const village = new THREE.Group();
  const baseY = (x, z) => heightAt(x, z);
  makeHouse(village, -28, 6, 10, 8, 5.4, baseY, mats.roofLight); // posada
  makeHouse(village, -12, 7, 8, 7, 4.7, baseY); // herrería
  makeHouse(village, -37, -7, 7, 7, 4.2, baseY, mats.roofLight);
  makeHouse(village, -17, -10, 8, 6, 4.3, baseY);
  makeHouse(village, -42, 12, 7, 8, 4.6, baseY);
  makeHouse(village, -5, 13, 7, 7, 4.2, baseY, mats.roofLight);
  const square = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 9.5, 0.24, 8), mats.stone);
  square.position.set(-25, baseY(-25, 0) + 0.1, 0);
  village.add(square);
  const well = new THREE.Group();
  const wellBase = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.4, 1, 8), mats.stone);
  wellBase.position.y = 0.5;
  well.add(wellBase);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.4, 4), mats.roof);
  cap.position.y = 2.0; cap.rotation.y = Math.PI / 4; well.add(cap);
  box(well, 0.16, 1.5, 0.16, mats.wood, -1.15, 1.3, 0);
  box(well, 0.16, 1.5, 0.16, mats.wood, 1.15, 1.3, 0);
  box(well, 2.5, 0.14, 0.14, mats.wood, 0, 2.8, 0);
  well.position.set(-25, baseY(-25, 0) + 0.25, 0);
  village.add(well);

  // Puente de piedra: tablero y apoyos bajos que cruzan el río.
  const bridgeMat = mats.stone;
  const deck = box(village, 10, 0.9, 19, bridgeMat, 8, 0.7, -25);
  for (let z of [-33, -17]) {
    box(village, 10.8, 1.15, 1.3, mats.wall, 8, 1.1, z);
  }
  const parapetMat = mats.wall;
  for (let side of [-1, 1]) {
    box(village, 0.55, 0.8, 18, parapetMat, 3.3, 1.45, -25);
    box(village, 0.55, 0.8, 18, parapetMat, 12.7, 1.45, -25);
  }

  // Camino de tierra: piezas cortas siguiendo el acceso desde el pueblo al puente.
  const pathMat = new THREE.MeshStandardMaterial({ color: 0xb19b70, roughness: 1 });
  for (let i = 0; i < 22; i++) {
    const t = i / 21;
    const x = -23 + 31 * t;
    const z = -4 - 21 * t;
    const path = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.12, 2.5), pathMat);
    path.position.set(x, baseY(x, z) + 0.09, z);
    path.rotation.y = Math.atan2(21, 31);
    village.add(path);
  }
  scene.add(village);
}
