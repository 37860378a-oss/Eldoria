import * as THREE from "three";

const mats = {
  wall: new THREE.MeshStandardMaterial({ color: 0xc0ad86, roughness: 1 }),
  plaster: new THREE.MeshStandardMaterial({ color: 0xd0c19b, roughness: 1 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x624a34, roughness: 1 }),
  darkWood: new THREE.MeshStandardMaterial({ color: 0x3e3429, roughness: 1 }),
  roof: new THREE.MeshStandardMaterial({ color: 0x795447, roughness: 1, flatShading: true }),
  roofLight: new THREE.MeshStandardMaterial({ color: 0x967052, roughness: 1, flatShading: true }),
  stone: new THREE.MeshStandardMaterial({ color: 0x858477, roughness: 1, flatShading: true }),
  glow: new THREE.MeshStandardMaterial({ color: 0xe0b96d, emissive: 0x8c5724, emissiveIntensity: 0.35 }),
  chimney: new THREE.MeshStandardMaterial({ color: 0x887d68, roughness: 1 })
};

function box(parent, w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

function makeHouse(scene, x, z, width, depth, height, heightAt, roofMat = mats.roof, variant = 0) {
  const group = new THREE.Group();

  // Cimiento de piedra y paredes de revoque cálido.
  box(group, width + 0.5, 0.48, depth + 0.5, mats.stone, 0, 0.22, 0);
  box(group, width, height, depth, mats.plaster, 0, height / 2 + 0.42, 0);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(width, depth) * 0.78, height * 0.72, 4), roofMat);
  roof.position.y = height + height * 0.34 + 0.42;
  roof.rotation.y = Math.PI / 4;
  roof.scale.z = depth / width;
  group.add(roof);

  // Estructura de madera visible en la fachada.
  const front = depth / 2 + 0.065;
  const beamWidth = 0.18;
  box(group, beamWidth, height * 0.88, 0.16, mats.wood, -width * 0.43, height * 0.46 + 0.42, front);
  box(group, beamWidth, height * 0.88, 0.16, mats.wood, width * 0.43, height * 0.46 + 0.42, front);
  box(group, width * 0.9, 0.18, 0.16, mats.wood, 0, height * 0.83 + 0.42, front);
  box(group, width * 0.9, 0.15, 0.16, mats.wood, 0, 0.55, front);

  // Puerta, ventanas cálidas y postigos laterales.
  box(group, width * 0.16, height * 0.52, 0.13, mats.darkWood, 0, height * 0.26 + 0.42, front + 0.04);
  for (const side of [-1, 1]) {
    const windowX = side * width * 0.28;
    box(group, width * 0.17, height * 0.24, 0.09, mats.glow, windowX, height * 0.62 + 0.42, front + 0.05);
    box(group, 0.12, height * 0.3, 0.12, mats.darkWood, windowX - width * 0.11, height * 0.62 + 0.42, front + 0.09);
    box(group, 0.12, height * 0.3, 0.12, mats.darkWood, windowX + width * 0.11, height * 0.62 + 0.42, front + 0.09);
  }

  // Pequeño alero sobre la entrada y dos soportes.
  box(group, width * 0.42, 0.18, 1.25, mats.wood, 0, height * 0.59 + 0.42, front + 0.48);
  for (const side of [-1, 1]) {
    box(group, 0.14, height * 0.62, 0.14, mats.darkWood, side * width * 0.19, height * 0.3 + 0.42, front + 0.92);
  }

  // Chimenea sencilla, alternada para que el conjunto no sea repetitivo.
  if (variant % 2 === 0) {
    const chimney = box(group, 0.72, 2.15, 0.72, mats.chimney, width * 0.27, height + 0.95, -depth * 0.18);
    chimney.rotation.z = 0.02;
    box(group, 0.9, 0.18, 0.9, mats.darkWood, width * 0.27, height + 2.05, -depth * 0.18);
  }

  group.position.set(x, heightAt(x, z), z);
  scene.add(group);
  return group;
}

export function createVillage(scene, heightAt) {
  const village = new THREE.Group();
  const baseY = (x, z) => heightAt(x, z);
  makeHouse(village, -28, 6, 10, 8, 5.4, baseY, mats.roofLight, 0); // posada
  makeHouse(village, -12, 7, 8, 7, 4.7, baseY, mats.roof, 1); // herrería
  makeHouse(village, -37, -7, 7, 7, 4.2, baseY, mats.roofLight, 2);
  makeHouse(village, -17, -10, 8, 6, 4.3, baseY, mats.roof, 3);
  makeHouse(village, -42, 12, 7, 8, 4.6, baseY, mats.roofLight, 4);
  makeHouse(village, -5, 13, 7, 7, 4.2, baseY, mats.roof, 5);

  const square = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 9.5, 0.24, 8), mats.stone);
  square.position.set(-25, baseY(-25, 0) + 0.1, 0);
  village.add(square);

  const well = new THREE.Group();
  const wellBase = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.4, 1, 8), mats.stone);
  wellBase.position.y = 0.5;
  well.add(wellBase);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.4, 4), mats.roof);
  cap.position.y = 2.0;
  cap.rotation.y = Math.PI / 4;
  well.add(cap);
  box(well, 0.16, 1.5, 0.16, mats.wood, -1.15, 1.3, 0);
  box(well, 0.16, 1.5, 0.16, mats.wood, 1.15, 1.3, 0);
  box(well, 2.5, 0.14, 0.14, mats.wood, 0, 2.8, 0);
  well.position.set(-25, baseY(-25, 0) + 0.25, 0);
  village.add(well);

  // Puente de piedra: tablero y apoyos bajos que cruzan el río.
  box(village, 10, 0.9, 19, mats.stone, 8, 0.7, -25);
  for (const z of [-33, -17]) {
    box(village, 10.8, 1.15, 1.3, mats.wall, 8, 1.1, z);
  }
  for (const side of [-1, 1]) {
    box(village, 0.55, 0.8, 18, mats.wall, side < 0 ? 3.3 : 12.7, 1.45, -25);
  }

  scene.add(village);
}
