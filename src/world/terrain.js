import * as THREE from "three";

export function terrainHeight(x, z) {
  const hills = Math.sin(x * 0.035) * 1.8 + Math.cos(z * 0.041) * 1.45
    + Math.sin((x + z) * 0.022) * 2.1 + Math.cos((x - z) * 0.017) * 1.2;
  const hillA = 7.5 * Math.exp(-(((x - 55) ** 2) / 950 + ((z - 48) ** 2) / 1250));
  const hillB = 5.2 * Math.exp(-(((x + 66) ** 2) / 1500 + ((z - 56) ** 2) / 1100));
  const villageFlat = Math.exp(-(((x + 24) ** 2) / 700 + ((z - 2) ** 2) / 500));
  const riverFlat = Math.exp(-((z + 25) ** 2) / 150);
  return hills * (1 - villageFlat * 0.88) * (1 - riverFlat * 0.94) + hillA + hillB;
}

export function createTerrain(scene) {
  const size = 220;
  const segments = 110;
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.attributes.position;
  const colors = [];
  const c1 = new THREE.Color(0x718e58);
  const c2 = new THREE.Color(0x8da56b);
  const c3 = new THREE.Color(0x9b956e);
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    const h = terrainHeight(x, z);
    positions.setY(i, h);
    const variation = (Math.sin(x * 0.12) + Math.cos(z * 0.14)) * 0.035;
    const color = c1.clone().lerp(c2, THREE.MathUtils.clamp(0.45 + h * 0.035 + variation, 0, 1));
    if (h > 5.5) color.lerp(c3, 0.22);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true });
  const ground = new THREE.Mesh(geometry, material);
  ground.receiveShadow = false;
  scene.add(ground);

  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(240, 13),
    new THREE.MeshStandardMaterial({ color: 0x5b9c9d, roughness: 0.32, metalness: 0.08, transparent: true, opacity: 0.88 })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 0.18, -25);
  scene.add(water);

  const bankMat = new THREE.MeshStandardMaterial({ color: 0x8a9a68, roughness: 1 });
  for (const z of [-32.2, -17.8]) {
    const bank = new THREE.Mesh(new THREE.BoxGeometry(220, 0.45, 1.2), bankMat);
    bank.position.set(0, 0.15, z);
    scene.add(bank);
  }
  return { heightAt: terrainHeight };
}
