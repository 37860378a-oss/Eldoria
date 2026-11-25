import * as THREE from "three";

const trunkMat = new THREE.MeshStandardMaterial({ color: 0x66503a, roughness: 1 });
const leafMats = [0x496f46, 0x5d8050, 0x78915a, 0x3f6849].map(color => new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true }));
const shrubMats = [0x55794b, 0x718b50, 0x3e6846].map(color => new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true }));
const rockMat = new THREE.MeshStandardMaterial({ color: 0x888875, roughness: 1, flatShading: true });
const grassMats = [0x8b9b5b, 0xa1a66a, 0x718c51].map(color => new THREE.MeshStandardMaterial({ color, roughness: 1, side: THREE.DoubleSide }));

function seeded(seed) {
  let value = seed >>> 0;
  return () => { value = (value * 1664525 + 1013904223) >>> 0; return value / 4294967296; };
}
function distanceToSegment(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az, len = dx * dx + dz * dz;
  const t = len === 0 ? 0 : THREE.MathUtils.clamp(((px - ax) * dx + (pz - az) * dz) / len, 0, 1);
  return Math.hypot(px - (ax + dx * t), pz - (az + dz * t));
}

// Ejes de los senderos: deben coincidir con los recorridos dibujados en paths.js.
const trails = [
  [-49,2,-44,-3],[-44,-3,-39,-6],[-39,-6,-33,-7],[-33,-7,-27,-6],
  [-27,-6,-22,-3],[-22,-3,-18,1],[-18,1,-18,6],[-18,6,-22,10],
  [-22,10,-29,12],[-29,12,-37,10],[-37,10,-43,6],[-43,6,-49,2],
  [-18,-3,-12,-7],[-12,-7,-7,-10],[-7,-10,-2,-12],[-2,-12,3,-13],
  [3,-13,7,-14],[7,-14,9.2,-17]
];
const houseClearZones = [
  {x:-56,z:24,rx:11.5,rz:10.5},
  {x:-25,z:31,rx:10.5,rz:10},
  {x:-65,z:-3,rx:11,rz:10},
  {x:8,z:25,rx:9.8,rz:10},
  {x:-2,z:-4,rx:9.8,rz:9.8}
];
function nearTrail(x, z) {
  return trails.some(s => distanceToSegment(x,z,s[0],s[1],s[2],s[3]) < 5.1);
}
function clearForNature(x, z) {
  // Mantener despejados el cauce, las lagunas, el puente y sus accesos.
  if (Math.abs(z + 25) < 15) return false;
  if (Math.hypot((x + 69) / 17, (z - 38) / 12) < 1.5) return false;
  if (Math.hypot((x - 69) / 13, (z - 61) / 10) < 1.5) return false;
  if (x > 0 && x < 16 && z > -40 && z < -14) return false;

  // Parcelas y cercos: un margen adicional evita copas y arbustos sobre techos.
  if (houseClearZones.some(p => ((x-p.x)/p.rx)**2 + ((z-p.z)/p.rz)**2 < 1)) return false;
  return !nearTrail(x, z);
}
function addInstances(scene, geometry, material, entries) {
  if (!entries.length) return null;
  const mesh = new THREE.InstancedMesh(geometry, material, entries.length);
  const dummy = new THREE.Object3D();
  entries.forEach((e, i) => {
    dummy.position.set(e.x,e.y,e.z); dummy.rotation.set(e.rx||0,e.ry||0,e.rz||0);
    dummy.scale.set(e.sx??e.scale,e.sy??e.scale,e.sz??e.scale); dummy.updateMatrix(); mesh.setMatrixAt(i,dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true; mesh.frustumCulled = true; scene.add(mesh);
  return mesh;
}

export function createNature(scene, heightAt) {
  const random = seeded(4812), trunks = [], crowns = leafMats.map(()=>[]), shrubs = shrubMats.map(()=>[]), rocks = [], grass = grassMats.map(()=>[]);
  let attempts = 0;
  while (trunks.length < 112 && attempts++ < 1400) {
    const x=(random()-.5)*190,z=(random()-.5)*190; if(!clearForNature(x,z)) continue;
    const s=.72+random()*.68,y=heightAt(x,z),rot=random()*Math.PI*2,type=Math.floor(random()*leafMats.length);
    trunks.push({x,y:y+1.55*s,z,scale:s,ry:rot,sx:s,sy:s,sz:s});
    crowns[type].push({x,y:y+3.35*s,z,sx:s*(.9+random()*.2),sy:s*(1.08+random()*.22),sz:s*(.9+random()*.2),ry:rot});
  }
  addInstances(scene,new THREE.CylinderGeometry(.22,.38,3.2,5),trunkMat,trunks);
  crowns.forEach((e,i)=>addInstances(scene,new THREE.IcosahedronGeometry(1.8,1),leafMats[i],e));

  let shrubCount=0; attempts=0;
  while(shrubCount<92&&attempts++<1200) {
    const x=(random()-.5)*188,z=(random()-.5)*188;
    if(!clearForNature(x,z)||random()<.28) continue;
    const s=.48+random()*.55,i=Math.floor(random()*shrubMats.length);
    shrubs[i].push({x,y:heightAt(x,z)+s*.42,z,sx:s*1.25,sy:s*.8,sz:s,ry:random()*Math.PI*2}); shrubCount++;
  }
  shrubs.forEach((e,i)=>addInstances(scene,new THREE.IcosahedronGeometry(.78,0),shrubMats[i],e));

  const rockGeo=new THREE.DodecahedronGeometry(1,0);
  for(let i=0;i<38;i++){
    const x=(random()-.5)*190,z=(random()-.5)*180;if(!clearForNature(x,z))continue;
    const s=.42+random()*.95;rocks.push({x,y:heightAt(x,z)+s*.28,z,sx:s*1.2,sy:s*.65,sz:s,rx:random(),ry:random()*3,rz:random()});
  }
  addInstances(scene,rockGeo,rockMat,rocks);

  const bladeGeo=new THREE.ConeGeometry(.12,.62,3), grassMeshes=[];
  let grassCount=0; attempts=0;
  while(grassCount<150&&attempts++<1600){
    const x=(random()-.5)*180,z=(random()-.5)*180;if(!clearForNature(x,z)||random()<.42)continue;
    const s=.45+random()*.65,i=Math.floor(random()*grassMats.length);
    grass[i].push({x,y:heightAt(x,z)+.25*s,z,sx:s,sy:s,sz:s,ry:random()*Math.PI*2,phase:random()*Math.PI*2});
    grassCount++;
  }
  grass.forEach((entries,i)=>{
    const mesh=addInstances(scene,bladeGeo,grassMats[i],entries);
    if(mesh)grassMeshes.push({mesh,entries});
  });

  const dummy=new THREE.Object3D();
  return {
    update(time) {
      for(const group of grassMeshes) {
        group.entries.forEach((e,i)=>{
          dummy.position.set(e.x,e.y,e.z);
          dummy.rotation.set(0,e.ry,Math.sin(time*1.35+e.phase)*.13);
          dummy.scale.set(e.sx,e.sy,e.sz); dummy.updateMatrix(); group.mesh.setMatrixAt(i,dummy.matrix);
        });
        group.mesh.instanceMatrix.needsUpdate=true;
      }
    }
  };
}
