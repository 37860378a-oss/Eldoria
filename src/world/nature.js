import * as THREE from "three";

const trunkMat = new THREE.MeshStandardMaterial({ color: 0x66503a, roughness: 1 });
const leafMats = [0x496f46, 0x5d8050, 0x78915a, 0x3f6849].map(color =>
  new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true })
);
const shrubMats = [0x55794b, 0x718b50, 0x3e6846].map(color =>
  new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true })
);
const rockMat = new THREE.MeshStandardMaterial({ color: 0x888875, roughness: 1, flatShading: true });
const grassMats = [0x8b9b5b, 0xa1a66a, 0x718c51].map(color =>
  new THREE.MeshStandardMaterial({ color, roughness: 1, side: THREE.DoubleSide })
);

function seeded(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function distanceToSegment(px, pz, ax, az, bx, bz) {
  const dx = bx - ax;
  const dz = bz - az;
  const lengthSq = dx * dx + dz * dz;
  const t = lengthSq === 0 ? 0 : THREE.MathUtils.clamp(((px - ax) * dx + (pz - az) * dz) / lengthSq, 0, 1);
  const x = ax + dx * t;
  const z = az + dz * t;
  return Math.hypot(px - x, pz - z);
}

function nearTrail(x, z) {
  const trails = [
    [-24, -4, -19, -7], [-19, -7, -14, -10], [-14, -10, -9, -13],
    [-9, -13, -5, -16], [-5, -16, 0, -19], [0, -19, 4, -22],
    [4, -22, 8, -25], [8, -25, 13, -28], [13, -28, 18, -32],
    [18, -32, 23, -37], [23, -37, 30, -42], [30, -42, 38, -47],
    [34, 7, 39, 11], [39, 11, 45, 15], [45, 15, 52, 20], [52, 20, 58, 27]
  ];
  return trails.some(([ax, az, bx, bz]) => distanceToSegment(x, z, ax, az, bx, bz) < 3.8);
}

function clearForNature(x, z) {
  if (Math.abs(z + 25) < 11.5) return false; // cauce y ribera
  if (x > -47 && x < 1 && z > -15 && z < 20) return false; // Piedra Clara
  if (x > 1 && x < 15 && z > -36 && z < -14) return false; // puente
  if (nearTrail(x, z)) return false;
  return true;
}

function addInstances(scene, geometry, material, entries) {
  if (!entries.length) return;
  const mesh = new THREE.InstancedMesh(geometry, material, entries.length);
  const dummy = new THREE.Object3D();
  entries.forEach((entry, index) => {
    dummy.position.set(entry.x, entry.y, entry.z);
    dummy.rotation.set(entry.rx || 0, entry.ry || 0, entry.rz || 0);
    dummy.scale.set(entry.sx ?? entry.scale, entry.sy ?? entry.scale, entry.sz ?? entry.scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = true;
  scene.add(mesh);
}

export function createNature(scene, heightAt) {
  const random = seeded(4812);
  const treeTrunks = [];
  const treeCrowns = leafMats.map(() => []);
  const shrubs = shrubMats.map(() => []);
  const rocks = [];
  const grass = grassMats.map(() => []);

  // Árboles en pequeños grupos visuales, con huecos para caminos y construcciones.
  let attempts = 0;
  while (treeTrunks.length < 112 && attempts < 900) {
    attempts++;
    const x = (random() - 0.5) * 190;
    const z = (random() - 0.5) * 190;
    if (!clearForNature(x, z)) continue;

    const scale = 0.72 + random() * 0.68;
    const y = heightAt(x, z);
    const rotation = random() * Math.PI * 2;
    const crownType = Math.floor(random() * leafMats.length);
    treeTrunks.push({ x, y: y + 1.55 * scale, z, scale, ry: rotation, sx: scale, sy: scale, sz: scale });
    treeCrowns[crownType].push({
      x, y: y + 3.35 * scale, z, sx: scale * (0.9 + random() * 0.2),
      sy: scale * (1.08 + random() * 0.22), sz: scale * (0.9 + random() * 0.2), ry: rotation
    });
  }

  const trunkGeo = new THREE.CylinderGeometry(0.22, 0.38, 3.2, 5);
  const crownGeo = new THREE.IcosahedronGeometry(1.8, 1);
  addInstances(scene, trunkGeo, trunkMat, treeTrunks);
  treeCrowns.forEach((entries, index) => addInstances(scene, crownGeo, leafMats[index], entries));

  // Arbustos bajos: rellenan bordes de bosque sin tapar la vista del jugador.
  const shrubGeo = new THREE.IcosahedronGeometry(0.78, 0);
  let shrubCount = 0;
  attempts = 0;
  while (shrubCount < 92 && attempts < 700) {
    attempts++;
    const x = (random() - 0.5) * 188;
    const z = (random() - 0.5) * 188;
    if (!clearForNature(x, z) || random() < 0.28) continue;
    const scale = 0.48 + random() * 0.55;
    const materialIndex = Math.floor(random() * shrubMats.length);
    shrubs[materialIndex].push({
      x, y: heightAt(x, z) + scale * 0.42, z,
      sx: scale * 1.25, sy: scale * 0.8, sz: scale,
      ry: random() * Math.PI * 2
    });
    shrubCount++;
  }
  shrubs.forEach((entries, index) => addInstances(scene, shrubGeo, shrubMats[index], entries));

  // Rocas agrupadas en las laderas y fuera de los senderos.
  const rockGeo = new THREE.DodecahedronGeometry(1, 0);
  for (let i = 0; i < 38; i++) {
    const x = (random() - 0.5) * 190;
    const z = (random() - 0.5) * 180;
    if (!clearForNature(x, z)) continue;
    const scale = 0.42 + random() * 0.95;
    rocks.push({
      x, y: heightAt(x, z) + scale * 0.28, z,
      sx: scale * 1.2, sy: scale * 0.65, sz: scale,
      rx: random(), ry: random() * 3, rz: random()
    });
  }
  addInstances(scene, rockGeo, rockMat, rocks);

  // Pequeños penachos de hierba en manchas, con geometría compartida.
  const bladeGeo = new THREE.ConeGeometry(0.12, 0.62, 3);
  let grassCount = 0;
  attempts = 0;
  while (grassCount < 150 && attempts < 1000) {
    attempts++;
    const x = (random() - 0.5) * 180;
    const z = (random() - 0.5) * 180;
    if (!clearForNature(x, z) || random() < 0.42) continue;
    const scale = 0.45 + random() * 0.65;
    const index = Math.floor(random() * grassMats.length);
    grass[index].push({
      x, y: heightAt(x, z) + 0.25 * scale, z,
      sx: scale, sy: scale, sz: scale,
      ry: random() * Math.PI * 2
    });
    grassCount++;
  }
  grass.forEach((entries, index) => addInstances(scene, bladeGeo, grassMats[index], entries));
}
