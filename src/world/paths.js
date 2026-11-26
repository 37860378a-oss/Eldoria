import * as THREE from "three";
import { createSurfaceMaterial } from "./paintedMaterials.js";

let sharedRoadMaterial = null;
export function getRoadMaterial() {
  if (!sharedRoadMaterial) {
    sharedRoadMaterial = createSurfaceMaterial("earth", {
      repeatX: 1.35, repeatY: 1.35, roughness: 1, normalScale: 0.22, aoIntensity: 0.32
    });
    sharedRoadMaterial.side = THREE.DoubleSide;
  }
  return sharedRoadMaterial;
}

export function createTrail(scene, heightAt, points, width, options = {}) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, "centripetal"
  );
  const segments = Math.max(180, points.length * 48);
  const bands = [-1.12, -1, -0.82, -0.55, 0, 0.55, 0.82, 1, 1.12];
  const vertices = [], uvs = [], indices = [];
  const lateral = new THREE.Vector3();
  let distance = 0, previous = curve.getPoint(0);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments, point = curve.getPoint(t);
    if (i > 0) distance += point.distanceTo(previous);
    previous.copy(point);
    const tangent = curve.getTangent(t).normalize();
    lateral.set(-tangent.z, 0, tangent.x).normalize();
    const centerWobble = Math.sin(distance * 0.31 + 1.2) * 0.10;
    const edgeWobble = Math.sin(distance * 0.83 + 0.7) * 0.13 + Math.sin(distance * 0.17) * 0.08;

    for (let j = 0; j < bands.length; j++) {
      const band = bands[j], edge = Math.abs(band) > 0.8 ? edgeWobble : centerWobble * 0.35;
      const offset = band * width * 0.5 * (1 + edge);
      const x = point.x + lateral.x * offset, z = point.z + lateral.z * offset;
      vertices.push(x, heightAt(x, z) + 0.095, z);
      uvs.push(distance / 6.5, (band + 1.12) * width / 6.5);
      if (i < segments && j < bands.length - 1) {
        const a = i * bands.length + j;
        indices.push(a, a + 1, a + bands.length, a + 1, a + bands.length + 1, a + bands.length);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, options.material || getRoadMaterial());
  mesh.receiveShadow = true;
  mesh.renderOrder = 1;
  scene.add(mesh);
  return mesh;
}

export function createPaths(scene, heightAt) {
  const material = getRoadMaterial();
  createTrail(scene, heightAt,
    [[-49, 2], [-44, -3], [-39, -6], [-34, -7], [-29, -6], [-25, -8],
      [-22, -11], [-17, -14], [-12, -17], [-7, -18]],
    4.6, { material });
  createTrail(scene, heightAt,
    [[-29, 8], [-30, 14], [-28, 20], [-24, 26], [-18, 31], [-10, 35], [-2, 37]],
    3.2, { material });
  // Sendero por la margen sur: se mantiene separado del cauce, sin puente.
  createTrail(scene, heightAt,
    [[-7, -18], [-2, -19], [4, -19.5], [10, -18.5], [16, -16], [22, -12]],
    3.5, { material });
}
