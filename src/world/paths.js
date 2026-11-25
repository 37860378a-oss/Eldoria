import * as THREE from "three";

function makeRoadTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#a88d62"; ctx.fillRect(0, 0, 256, 256);
  let seed = 7241;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 1900; i++) {
    const v = Math.floor(105 + rand() * 75);
    ctx.fillStyle = `rgba(${v},${Math.floor(v * 0.82)},${Math.floor(v * 0.58)},${0.08 + rand() * 0.2})`;
    const r = 0.5 + rand() * 2.4;
    ctx.beginPath(); ctx.ellipse(rand() * 256, rand() * 256, r * 1.7, r, rand() * 3, 0, Math.PI * 2); ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1); texture.anisotropy = 2;
  return texture;
}

function createRibbon(scene, heightAt, points, width, material, lift = 0.12) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, "centripetal");
  const divisions = Math.max(32, points.length * 16), vertices = [], uvs = [], indices = [];
  for (let i = 0; i <= divisions; i++) {
    const t = i / divisions, p = curve.getPoint(t), tangent = curve.getTangent(t).normalize();
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const taper = Math.min(1, 0.82 + Math.min(t, 1 - t) * 2.5);
    for (const sign of [-1, 1]) {
      const x = p.x + side.x * width * 0.5 * taper * sign;
      const z = p.z + side.z * width * 0.5 * taper * sign;
      vertices.push(x, heightAt(x, z) + lift, z);
      uvs.push(t * 5, sign * 0.5 + 0.5);
    }
    if (i < divisions) {
      const a = i * 2; indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices); geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, material);
  mesh.material.side = THREE.DoubleSide; scene.add(mesh);
}

export function createPaths(scene, heightAt) {
  const road = new THREE.MeshStandardMaterial({ map: makeRoadTexture(), color: 0xffffff, roughness: 1, side: THREE.DoubleSide });
  // Anillo peatonal alrededor de la plaza y calle ancha hasta el puente.
  createRibbon(scene, heightAt, [
    [-42, 1], [-39, -4], [-34, -7], [-27, -8], [-20, -6], [-16, -2], [-16, 4], [-21, 8], [-29, 10], [-37, 8], [-42, 1]
  ], 3.2, road, 0.16);
  createRibbon(scene, heightAt, [
    [-17, -3], [-12, -7], [-8, -11], [-4, -15], [0, -19], [4, -23], [7.5, -27], [8.2, -31], [8.2, -36]
  ], 5.4, road, 0.19);
  createRibbon(scene, heightAt, [
    [8.2, -36], [12, -40], [18, -44], [25, -48], [33, -52], [42, -55]
  ], 3.8, road, 0.18);
  createRibbon(scene, heightAt, [
    [-17, 5], [-12, 8], [-7, 11], [-2, 14], [4, 17], [11, 21]
  ], 2.8, road, 0.15);
}
