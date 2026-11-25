import * as THREE from "three";

const trunkMat = new THREE.MeshStandardMaterial({ color: 0x66503a, roughness: 1 });
const leafMats = [0x496f46, 0x5d8050, 0x78915a, 0x3f6849].map(color => new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true }));
const rockMat = new THREE.MeshStandardMaterial({ color: 0x888875, roughness: 1, flatShading: true });

function seeded(seed) {
  let value = seed >>> 0;
  return () => { value = (value * 1664525 + 1013904223) >>> 0; return value / 4294967296; };
}

export function createNature(scene, heightAt) {
  const random = seeded(4812);
  const trunkGeo = new THREE.CylinderGeometry(0.22, 0.38, 3.2, 5);
  const crownGeo = new THREE.IcosahedronGeometry(1.8, 1);
  const treeGroup = new THREE.Group();
  for (let i = 0; i < 125; i++) {
    const x = (random() - 0.5) * 190;
    const z = (random() - 0.5) * 190;
    if (Math.abs(z + 25) < 12 || (x > -43 && x < -5 && z > -13 && z < 20)) continue;
    const scale = 0.72 + random() * 0.72;
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.5 * scale;
    trunk.scale.setScalar(scale);
    tree.add(trunk);
    const crown = new THREE.Mesh(crownGeo, leafMats[Math.floor(random() * leafMats.length)]);
    crown.position.y = 3.45 * scale;
    crown.scale.set(1, 1.22, 1);
    crown.scale.multiplyScalar(scale);
    tree.add(crown);
    tree.position.set(x, heightAt(x, z), z);
    tree.rotation.y = random() * Math.PI * 2;
    treeGroup.add(tree);
  }
  scene.add(treeGroup);

  const rockGeo = new THREE.DodecahedronGeometry(1, 0);
  for (let i = 0; i < 34; i++) {
    const x = (random() - 0.5) * 190;
    const z = (random() - 0.5) * 180;
    if (Math.abs(z + 25) < 11) continue;
    const rock = new THREE.Mesh(rockGeo, rockMat);
    const s = 0.45 + random() * 1.1;
    rock.scale.set(s * 1.2, s * 0.65, s);
    rock.position.set(x, heightAt(x, z) + s * 0.3, z);
    rock.rotation.set(random(), random() * 3, random());
    scene.add(rock);
  }
}
