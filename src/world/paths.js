import * as THREE from "three";

function createRibbon(scene, heightAt, points, width, material, lift = 0.13) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    false,
    "centripetal"
  );
  const divisions = Math.max(24, points.length * 12);
  const vertices = [];
  const uvs = [];
  const indices = [];
  const colors = [];
  const edge = new THREE.Color(0x8f805e);
  const center = new THREE.Color(0xb6a078);

  for (let i = 0; i <= divisions; i++) {
    const t = i / divisions;
    const point = curve.getPoint(t);
    const tangent = curve.getTangent(t).normalize();
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const taper = Math.min(1, 0.72 + Math.min(t, 1 - t) * 2.8);
    const halfWidth = width * 0.5 * taper;

    for (const direction of [-1, 1]) {
      const x = point.x + side.x * halfWidth * direction;
      const z = point.z + side.z * halfWidth * direction;
      vertices.push(x, heightAt(x, z) + lift, z);
      uvs.push(t * 8, direction * 0.5 + 0.5);
      const color = edge.clone().lerp(center, direction === -1 ? 0.18 : 0.82);
      colors.push(color.r, color.g, color.b);
    }
    if (i < divisions) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = false;
  scene.add(mesh);
  return mesh;
}

export function createPaths(scene, heightAt) {
  const earthMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    vertexColors: true,
    roughness: 1,
    side: THREE.DoubleSide
  });

  // Camino principal desde Piedra Clara hasta el puente, con una curva suave.
  createRibbon(scene, heightAt, [
    [-24, -4], [-19, -7], [-14, -10], [-9, -13],
    [-5, -16], [0, -19], [4, -22], [8, -25]
  ], 4.1, earthMaterial, 0.15);

  // Continuación al otro lado del río para sugerir que el valle sigue explorándose.
  createRibbon(scene, heightAt, [
    [8, -25], [13, -28], [18, -32], [23, -37], [30, -42], [38, -47]
  ], 3.2, earthMaterial, 0.17);

  // Sendero secundario hacia las lomas del este.
  createRibbon(scene, heightAt, [
    [34, 7], [39, 11], [45, 15], [52, 20], [58, 27]
  ], 2.7, earthMaterial, 0.14);
}
