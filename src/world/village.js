import * as THREE from "three";

const mats = {
  plaster: new THREE.MeshStandardMaterial({ color: 0xd1bd91, roughness: 1 }),
  timber: new THREE.MeshStandardMaterial({ color: 0x59432f, roughness: 1 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x342c23, roughness: 1 }),
  roof: [0x765044, 0x8b6247, 0x6e5140].map(color => new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true })),
  stone: new THREE.MeshStandardMaterial({ color: 0x888477, roughness: 1, flatShading: true }),
  window: new THREE.MeshStandardMaterial({ color: 0xe8bd69, emissive: 0x8c5724, emissiveIntensity: 0.22 }),
  fence: new THREE.MeshStandardMaterial({ color: 0x765b3c, roughness: 1 })
};

function block(parent, w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

function makeHouse(scene, x, z, width, depth, height, heightAt, variant, rotation = 0) {
  const group = new THREE.Group();
  block(group, width + 0.55, 0.42, depth + 0.55, mats.stone, 0, 0.21, 0);
  block(group, width, height, depth, mats.plaster, 0, height / 2 + 0.42, 0);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(width, depth) * 0.77, height * 0.7, 4), mats.roof[variant % mats.roof.length]);
  roof.position.y = height + height * 0.33 + 0.42;
  roof.rotation.y = Math.PI / 4;
  roof.scale.z = depth / width;
  group.add(roof);

  const front = depth / 2 + 0.07;
  block(group, width * 0.17, height * 0.53, 0.14, mats.dark, 0, height * 0.265 + 0.42, front + 0.04);
  for (const side of [-1, 1]) {
    const wx = side * width * 0.29;
    block(group, width * 0.18, height * 0.25, 0.1, mats.window, wx, height * 0.62 + 0.42, front + 0.05);
    block(group, 0.12, height * 0.31, 0.13, mats.dark, wx - width * 0.12, height * 0.62 + 0.42, front + 0.09);
    block(group, 0.12, height * 0.31, 0.13, mats.dark, wx + width * 0.12, height * 0.62 + 0.42, front + 0.09);
  }
  block(group, width * 0.43, 0.16, 1.05, mats.timber, 0, height * 0.61 + 0.42, front + 0.42);
  for (const side of [-1, 1]) {
    block(group, 0.14, height * 0.6, 0.14, mats.timber, side * width * 0.2, height * 0.3 + 0.42, front + 0.8);
    block(group, 0.16, height * 0.88, 0.16, mats.timber, side * width * 0.44, height * 0.46 + 0.42, front);
  }
  block(group, width * 0.92, 0.18, 0.16, mats.timber, 0, height * 0.84 + 0.42, front);
  if (variant % 2 === 0) {
    block(group, 0.62, 1.85, 0.62, mats.stone, width * 0.25, height + 0.88, -depth * 0.18);
  }

  group.rotation.y = rotation;
  group.position.set(x, heightAt(x, z), z);
  scene.add(group);
}

function addFence(scene, heightAt, x, z, w, d, openingSide = "south") {
  const group = new THREE.Group();
  const postGeo = new THREE.BoxGeometry(0.22, 1.05, 0.22);
  const railX = new THREE.BoxGeometry(w, 0.13, 0.13);
  const railZ = new THREE.BoxGeometry(0.13, 0.13, d);
  const post = (px, pz) => {
    const m = new THREE.Mesh(postGeo, mats.fence);
    m.position.set(px, 0.52, pz); group.add(m);
  };
  const rail = (geo, px, pz) => {
    const m = new THREE.Mesh(geo, mats.fence);
    m.position.set(px, 0.42, pz); group.add(m);
  };
  const halfW = w / 2, halfD = d / 2;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) post(sx * halfW, sz * halfD);
  rail(railZ, -halfW, 0); rail(railZ, halfW, 0);
  if (openingSide === "south") {
    rail(new THREE.BoxGeometry(w * 0.35, 0.13, 0.13), -w * 0.325, halfD);
    rail(new THREE.BoxGeometry(w * 0.35, 0.13, 0.13), w * 0.325, halfD);
  } else rail(railX, 0, halfD);
  rail(railX, 0, -halfD);
  group.position.set(x, heightAt(x, z), z);
  scene.add(group);
}

function createCurvedBridge(scene, heightAt) {
  // El cauce corre de este a oeste: el puente cruza de norte a sur.
  const points = [
    new THREE.Vector3(8.2, 0, -37),
    new THREE.Vector3(7.2, 0, -32),
    new THREE.Vector3(6.7, 0, -27),
    new THREE.Vector3(7.5, 0, -22),
    new THREE.Vector3(9.2, 0, -17)
  ];
  const curve = new THREE.CatmullRomCurve3(points);
  const divisions = 32, halfWidth = 4.1;
  const vertices = [], indices = [];
  for (let i = 0; i <= divisions; i++) {
    const t = i / divisions;
    const p = curve.getPoint(t), tangent = curve.getTangent(t).normalize();
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    for (const sign of [-1, 1]) {
      const x = p.x + side.x * halfWidth * sign;
      const z = p.z + side.z * halfWidth * sign;
      vertices.push(x, heightAt(x, z) + 0.68 + 4.25 * Math.exp(-((z + 25) ** 2) / 43), z);
    }
    if (i < divisions) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const deckGeo = new THREE.BufferGeometry();
  deckGeo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  deckGeo.setIndex(indices); deckGeo.computeVertexNormals();
  const deck = new THREE.Mesh(deckGeo, mats.stone);
  deck.material.side = THREE.DoubleSide;
  scene.add(deck);

  const railMat = mats.fence;
  for (const sideSign of [-1, 1]) {
    const railPoints = [];
    for (let i = 0; i <= divisions; i++) {
      const t = i / divisions, p = curve.getPoint(t), tangent = curve.getTangent(t).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const x = p.x + side.x * (halfWidth * 0.92) * sideSign;
      const z = p.z + side.z * (halfWidth * 0.92) * sideSign;
      railPoints.push(new THREE.Vector3(x, heightAt(x, z) + 1.48 + 4.25 * Math.exp(-((z + 25) ** 2) / 43), z));
    }
    const rail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPoints), divisions, 0.13, 5, false), railMat);
    scene.add(rail);
  }
  // Accesos de piedra bajos en ambas orillas.
  for (const z of [-37.2, -16.8]) {
    const landing = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.48, 2.2), mats.stone);
    landing.position.set(z < -25 ? 8.2 : 9.2, heightAt(z < -25 ? 8.2 : 9.2, z) + 0.38 + 4.25 * Math.exp(-((z + 25) ** 2) / 43), z);
    scene.add(landing);
  }
}

export function createVillage(scene, heightAt) {
  // Cinco parcelas amplias, distribuidas en torno a la plaza con mayor distancia
  // entre viviendas y cercos para que la aldea respire y cada casa tenga su patio.
  const plots = [
    { x: -56, z: 24, w: 9, d: 8, h: 5.1, r: 0.15 },
    { x: -25, z: 31, w: 8, d: 7, h: 4.6, r: 0 },
    { x: -65, z: -3, w: 8, d: 7, h: 4.4, r: Math.PI },
    { x: 8, z: 25, w: 7, d: 7, h: 4.2, r: -0.25 },
    { x: -2, z: -4, w: 7, d: 7, h: 4.2, r: Math.PI + 0.2 }
  ];
  plots.forEach((p, i) => {
    makeHouse(scene, p.x, p.z, p.w, p.d, p.h, heightAt, i, p.r);
    addFence(scene, heightAt, p.x, p.z, p.w + 5, p.d + 5, "south");
  });

  const plaza = new THREE.Mesh(new THREE.CircleGeometry(8.2, 32), mats.stone);
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(-29, heightAt(-29, 1) + 0.18, 1);
  scene.add(plaza);

  const well = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.4, 0.9, 8), mats.stone);
  base.position.y = 0.55; well.add(base);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.75, 1.25, 4), mats.roof[0]);
  roof.position.y = 2.0; roof.rotation.y = Math.PI / 4; well.add(roof);
  block(well, 0.14, 1.5, 0.14, mats.timber, -1.15, 1.25, 0);
  block(well, 0.14, 1.5, 0.14, mats.timber, 1.15, 1.25, 0);
  block(well, 2.45, 0.14, 0.14, mats.timber, 0, 2.65, 0);
  well.position.set(-29, heightAt(-29, 1) + 0.28, 1);
  scene.add(well);

  createCurvedBridge(scene, heightAt);
}
