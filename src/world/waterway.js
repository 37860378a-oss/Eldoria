import * as THREE from "three";

const waterMaterial = new THREE.MeshStandardMaterial({
  color: 0x397f91, roughness: 0.24, metalness: 0.08,
  transparent: true, opacity: 0.88, side: THREE.DoubleSide
});
const shallowMaterial = new THREE.MeshStandardMaterial({
  color: 0x79a99a, roughness: 0.48, transparent: true, opacity: 0.28,
  side: THREE.DoubleSide
});
const stoneMaterial = new THREE.MeshStandardMaterial({
  color: 0x777b70, roughness: 1, flatShading: true
});

function makeChannel(scene, heightAt) {
  // Brazo sinuoso: nace en la laguna, pasa bajo el puente y llega al muelle.
  const points = [
    [-5,-58],[-1,-53],[3,-48],[5,-43],[4,-38],
    [2,-34],[-1,-31],[-5,-29],[-9,-27],[-12,-24.2]
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

function makeLagoon(scene,heightAt) {
  // Laguna ovalada conectada al brazo; malla adaptada al relieve del terreno.
  const cx=-2,cz=-62,rx=17,rz=11.5,segments=96,rings=12;
  const vertices=[],indices=[],uvs=[];
  for(let r=0;r<=rings;r++) {
    const radius=r/rings;
    for(let i=0;i<=segments;i++) {
      const a=i/segments*Math.PI*2;
      const x=cx+Math.cos(a)*rx*radius,z=cz+Math.sin(a)*rz*radius;
      vertices.push(x,heightAt(x,z)+0.09,z);uvs.push(.5+Math.cos(a)*radius*.5,.5+Math.sin(a)*radius*.5);
      if(r<rings&&i<segments) {
        const k=r*(segments+1)+i;
        indices.push(k,k+1,k+segments+1,k+1,k+segments+2,k+segments+1);
      }
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
  g.setAttribute("uv",new THREE.Float32BufferAttribute(uvs,2));
  g.setIndex(indices);g.computeVertexNormals();
  const pond=new THREE.Mesh(g,waterMaterial);pond.receiveShadow=true;scene.add(pond);

  // Franja somera muy sutil que suaviza la transición entre agua y orilla.
  const rim=new THREE.Mesh(g,shallowMaterial);rim.scale.set(1.035,1,1.035);
  rim.position.y=-0.035;scene.add(rim);
}

function addShoreStones(scene,heightAt) {
  const geo=new THREE.DodecahedronGeometry(1,0), dummy=new THREE.Object3D();
  const stones=new THREE.InstancedMesh(geo,stoneMaterial,46);
  let n=0;
  for(let i=0;i<46;i++) {
    const a=i/46*Math.PI*2, x=-2+Math.cos(a)*(17.6+Math.sin(i*4)*1.1);
    const z=-62+Math.sin(a)*(12+Math.cos(i*3)*.8);
    dummy.position.set(x,heightAt(x,z)+.22,z);
    dummy.rotation.set(i*.31,i*.73,i*.19);
    const s=.35+(i%5)*.11;dummy.scale.set(s,s*.55,s*.8);
    dummy.updateMatrix();stones.setMatrixAt(n++,dummy.matrix);
  }
  stones.count=n;stones.instanceMatrix.needsUpdate=true;scene.add(stones);
}

export function createWaterway(scene,heightAt) {
  makeLagoon(scene,heightAt);
  makeChannel(scene,heightAt);
  addShoreStones(scene,heightAt);
  return { update() {} };
}
