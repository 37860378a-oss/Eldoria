import * as THREE from "three";
import { createSurfaceMaterial } from "./paintedMaterials.js";

let sharedRoadMaterial = null;
export function getRoadMaterial() {
  if (!sharedRoadMaterial) {
    sharedRoadMaterial = createSurfaceMaterial("earth", {
      repeatX: 1, repeatY: 1, roughness: 1, normalScale: 0.28, aoIntensity: 0.42
    });
    sharedRoadMaterial.side = THREE.DoubleSide;
  }
  return sharedRoadMaterial;
}

export function createTrail(scene, heightAt, points, width, options = {}) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, "centripetal"
  );
  const segments = Math.max(150, points.length * 38);
  const bands = [-1.16, -1, -0.78, -0.5, 0, 0.5, 0.78, 1, 1.16];
  const vertices = [], uvs = [], indices = [];
  const lateral = new THREE.Vector3();
  const ramp = options.bridgeExit ? (z) => THREE.MathUtils.smoothstep(z, -44, -37.2) : null;
  let distance = 0;
  let previous = curve.getPoint(0);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = curve.getPoint(t);
    if (i > 0) distance += point.distanceTo(previous);
    previous.copy(point);
    const tangent = curve.getTangent(t).normalize();
    lateral.set(-tangent.z, 0, tangent.x).normalize();
    const wobble = Math.sin(distance * 0.47) * 0.055 + Math.sin(distance * 0.19 + 1.7) * 0.035;
    const edgeNoise = Math.sin(distance * 1.13 + 0.8) * 0.10;

    for (let j = 0; j < bands.length; j++) {
      const band = bands[j], edgeFactor = Math.abs(band);
      const irregularWidth = 1 + wobble + (edgeFactor > 0.78 ? edgeNoise : 0);
      const offset = band * width * 0.5 * irregularWidth;
      const x = point.x + lateral.x * offset, z = point.z + lateral.z * offset;
      const bridgeLift = ramp ? 0.78 * ramp(z) : 0;
      vertices.push(x, heightAt(x, z) + 0.075 + bridgeLift, z);
      uvs.push(distance / 8.0, (band + 1.16) * width / 7.0);
      if (i < segments && j < bands.length - 1) {
        const a = i * bands.length + j;
        indices.push(a, a + 1, a + bands.length, a + 1, a + bands.length + 1, a + bands.length);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(uvs.slice(), 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, options.material || getRoadMaterial());
  mesh.receiveShadow = true;
  mesh.castShadow = false;
  mesh.renderOrder = 1;
  scene.add(mesh);
  return mesh;
}

export function createPaths(scene, heightAt) {
  const roadMaterial = getRoadMaterial();
  createTrail(scene, heightAt,
    [[-49, 2], [-44, -3], [-39, -6], [-33, -7], [-27, -6], [-22, -3],
      [-18, 1], [-18, 6], [-22, 10], [-29, 12], [-37, 10], [-43, 6], [-49, 2]],
    4.2, { material: roadMaterial });
  createTrail(scene, heightAt,
    [[-18, -3], [-12, -7], [-7, -10], [-2, -12], [3, -13], [7, -14], [8.2, -16.8]],
    4.6, { material: roadMaterial });
}
