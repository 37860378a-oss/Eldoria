import * as THREE from "three";

const waterMaterial = new THREE.MeshStandardMaterial({
  color: 0x397f91, roughness: 0.24, metalness: 0.08,
  transparent: true, opacity: 0.88, side: THREE.DoubleSide
});

function makeChannel(scene, heightAt) {
  // Brazo de río independiente, pasa bajo el puente y llega al muelle.
  const points = [
    [-5,-58],[-1,-53],[2,-48],[5,-43],[8,-39],
    [8.2,-35],[8.2,-31],[7,-28],[3,-27],[-2,-27],
    [-7,-25.5],[-12,-24.2]
  ].map(([x,z]) => new THREE.Vector3(x,0,z));
  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
  const segments = 180, across = 18, vertices = [], indices = [], uvs = [];
  for (let i=0;i<=segments;i++) {
    const t=i/segments, p=curve.getPoint(t), tangent=curve.getTangent(t).normalize();
    const side=new THREE.Vector3(-tangent.z,0,tangent.x);
    const width=3.15 + 0.7*Math.sin(Math.PI*t);
    for(let j=0;j<=across;j++) {
      const f=j/across*2-1, x=p.x+side.x*width*f, z=p.z+side.z*width*f;
      vertices.push(x,heightAt(x,z)+0.085,z); uvs.push(t*8,j/across);
      if(i<segments&&j<across) {
        const a=i*(across+1)+j;
        indices.push(a,a+1,a+across+1,a+1,a+across+2,a+across+1);
      }
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
  g.setAttribute("uv",new THREE.Float32BufferAttribute(uvs,2));
  g.setIndex(indices);g.computeVertexNormals();
  const mesh=new THREE.Mesh(g,waterMaterial);mesh.receiveShadow=true;scene.add(mesh);
}

export function createWaterway(scene,heightAt) {
  makeChannel(scene,heightAt);
  return { update() {} };
}
