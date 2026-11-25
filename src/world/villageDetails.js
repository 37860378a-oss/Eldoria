import * as THREE from "three";

const wood = new THREE.MeshStandardMaterial({ color: 0x65472f, roughness: 1 });
const iron = new THREE.MeshStandardMaterial({ color: 0x343b3a, roughness: 0.85 });
const barrelMat = new THREE.MeshStandardMaterial({ color: 0x805a38, roughness: 1 });
const crateMat = new THREE.MeshStandardMaterial({ color: 0x9a7548, roughness: 1 });
const lanternGlow = new THREE.MeshStandardMaterial({
  color: 0xffc66d,
  emissive: 0xff9b35,
  emissiveIntensity: 0.8,
  roughness: 0.6
});

function addInstances(scene, geometry, material, entries) {
  if (!entries.length) return;
  const mesh = new THREE.InstancedMesh(geometry, material, entries.length);
  const dummy = new THREE.Object3D();
  entries.forEach((entry, index) => {
    dummy.position.set(entry.x, entry.y, entry.z);
    dummy.rotation.set(entry.rx || 0, entry.ry || 0, entry.rz || 0);
    dummy.scale.set(entry.sx || 1, entry.sy || 1, entry.sz || 1);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = true;
  scene.add(mesh);
}

export function createVillageDetails(scene, heightAt) {
  // Faroles colocados en una línea coherente junto a los bordes de los caminos.
  // Se mantienen fuera del centro de la calzada para no obstruir el recorrido.
  const lanterns = [
    [-47, -2], [-40, -8], [-32, -10], [-23, -6],
    [-16, 3], [-22, 14], [-36, 14], [-44, 9],
    [7, -15], [12, -41], [29, -51], [43, -56]
  ];

  const posts = lanterns.map(([x, z]) => ({
    x, y: heightAt(x, z) + 1.25, z,
    sx: 0.16, sy: 1.25, sz: 0.16
  }));
  const lamps = lanterns.map(([x, z]) => ({
    x, y: heightAt(x, z) + 2.55, z,
    sx: 0.34, sy: 0.38, sz: 0.34
  }));
  addInstances(scene, new THREE.CylinderGeometry(0.13, 0.19, 2.5, 5), wood, posts);
  addInstances(scene, new THREE.BoxGeometry(1, 1, 1), lanternGlow, lamps);

  const barrels = [
    [-54, 18, 0.9], [-31, 23, 0.82], [-53, -18, 0.88],
    [-3, 18, 0.78], [-2, -17, 0.82], [16, -43, 0.76]
  ].map(([x, z, scale]) => ({
    x, y: heightAt(x, z) + 0.48 * scale, z,
    sx: scale, sy: scale, sz: scale,
    ry: (x * 13 + z * 7) % 6
  }));
  addInstances(scene, new THREE.CylinderGeometry(0.38, 0.43, 0.96, 8), barrelMat, barrels);

  const crates = [
    [-56, 13], [-29, 25], [-50, -20], [-1, 14], [19, -45]
  ].map(([x, z], i) => {
    const scale = i % 2 ? 0.82 : 0.95;
    return {
      x, y: heightAt(x, z) + 0.43 * scale, z,
      sx: scale, sy: scale, sz: scale,
      ry: i * 0.47
    };
  });
  addInstances(scene, new THREE.BoxGeometry(0.9, 0.86, 0.9), crateMat, crates);

  // Carteles de madera sencillos: entrada de Piedra Clara y bifurcación del puente.
  const signMaterial = new THREE.MeshStandardMaterial({ color: 0x765334, roughness: 1 });
  for (const [x, z, rotation] of [[-44, -8, 0.18], [12, -16, -0.25]]) {
    const sign = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 2.5, 5), wood);
    post.position.y = 1.25;
    sign.add(post);
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.62, 0.16), signMaterial);
    board.position.set(0.55, 2.0, 0);
    sign.add(board);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.09, 0.2), iron);
    trim.position.set(0.55, 2.34, 0);
    sign.add(trim);
    sign.rotation.y = rotation;
    sign.position.set(x, heightAt(x, z), z);
    scene.add(sign);
  }
}
