import * as THREE from "three";

const trunkMat = new THREE.MeshStandardMaterial({ color: 0x59432f, roughness: 1 });
const branchMat = new THREE.MeshStandardMaterial({ color: 0x674a32, roughness: 1 });
const leafMats = [0x3f6844, 0x527b49, 0x66894f, 0x78965b].map(color => new THREE.MeshStandardMaterial({ color, roughness: .92 }));
const shrubMats = [0x55794b, 0x718b50, 0x3e6846].map(color => new THREE.MeshStandardMaterial({ color, roughness: 1 }));
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
const trails = [
  [-49,2,-44,-3],[-44,-3,-39,-6],[-39,-6,-33,-7],[-33,-7,-27,-6],[-27,-6,-22,-3],
  [-22,-3,-18,1],[-18,1,-18,6],[-18,6,-22,10],[-22,10,-29,12],[-29,12,-37,10],
  [-37,10,-43,6],[-43,6,-49,2],[-18,-3,-12,-7],[-12,-7,-7,-10],[-7,-10,-2,-12],
  [-2,-12,3,-13],[3,-13,7,-14],[7,-14,9.2,-17],
  [8.5,-38,12,-45],[12,-45,17,-51],[17,-51,24,-58],[24,-58,32,-66],[32,-66,41,-74],
  [17,-51,8,-58],[8,-58,-5,-62],[-5,-62,-20,-64],[-20,-64,-36,-67],[-36,-67,-53,-70],[-53,-70,-65,-72]
];
const houseClearZones = [
  {x:-56,z:24,rx:11.5,rz:10.5},{x:-25,z:31,rx:10.5,rz:10},
  {x:-65,z:-3,rx:11,rz:10},{x:8,z:25,rx:9.8,rz:10},{x:-2,z:-4,rx:9.8,rz:9.8}
];
function nearTrail(x,z) { return trails.some(s => distanceToSegment(x,z,s[0],s[1],s[2],s[3]) < 6); }
function clearForNature(x,z) {
  if (Math.abs(z + 25) < 15) return false;
  if (Math.hypot((x + 69) / 17, (z - 38) / 12) < 1.5) return false;
  if (Math.hypot((x - 69) / 13, (z - 61) / 10) < 1.5) return false;
  if (x > 0 && x < 16 && z > -40 && z < -14) return false;
  if (houseClearZones.some(p => ((x-p.x)/p.rx)**2 + ((z-p.z)/p.rz)**2 < 1)) return false;
  return !nearTrail(x,z);
}
function addInstances(scene,geometry,material,entries) {
  if (!entries.length) return null;
  const mesh=new THREE.InstancedMesh(geometry,material,entries.length),dummy=new THREE.Object3D();
  entries.forEach((e,i)=>{
    dummy.position.set(e.x,e.y,e.z); dummy.rotation.set(e.rx||0,e.ry||0,e.rz||0);
    dummy.scale.set(e.sx??e.scale,e.sy??e.scale,e.sz??e.scale); dummy.updateMatrix(); mesh.setMatrixAt(i,dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate=true; mesh.frustumCulled=true; scene.add(mesh); return mesh;
}
function branchEntry(x,y,z,angle,length,radius) {
  const start=new THREE.Vector3(x,y,z);
  const direction=new THREE.Vector3(Math.sin(angle),.55+Math.random()*.25,Math.cos(angle)).normalize();
  const end=start.clone().addScaledVector(direction,length);
  const mid=start.clone().add(end).multiplyScalar(.5);
  const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),direction);
  return {x:mid.x,y:mid.y,z:mid.z,sy:length*.5,sx:radius,sz:radius,q};
}

export function createNature(scene,heightAt) {
  const random=seeded(4812), trunks=[],roots=[],branches=[],crowns=leafMats.map(()=>[]), shrubs=shrubMats.map(()=>[]),rocks=[],grass=grassMats.map(()=>[]);
  const treeLeaves=[];
  let attempts=0,treeCount=0;
  while(treeCount<96&&attempts++<2200) {
    const x=(random()-.5)*198,z=(random()-.5)*198;
    if(!clearForNature(x,z)) continue;
    const scale=.88+random()*.72,ground=heightAt(x,z),height=6.1+random()*2.8;
    const trunkRadius=.38+random()*.18,phase=random()*Math.PI*2,type=Math.floor(random()*leafMats.length);
    const embed=0.85*scale;
    trunks.push({x,y:ground+(height*.5-.85)*scale,z,sx:trunkRadius*scale,sy:(height*.5+.85)*scale,sz:trunkRadius*scale,ry:random()*Math.PI});
    // Raíces visibles que nacen al nivel del suelo y se abren alrededor del tronco.
    for(let r=0;r<3+Math.floor(random()*2);r++){
      const angle=(r/4)*Math.PI*2+random()*.35,length=(1.05+random()*.7)*scale;
      const dir=new THREE.Vector3(Math.cos(angle),.12+random()*.08,Math.sin(angle)).normalize();
      const start=new THREE.Vector3(x,ground-.12*scale,z),end=start.clone().addScaledVector(dir,length);
      const mid=start.clone().add(end).multiplyScalar(.5);
      const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir);
      roots.push({x:mid.x,y:mid.y,z:mid.z,sx:.24*scale,sy:length*.5,sz:.24*scale,q});
    }
    const clusterCount=4+Math.floor(random()*3);
    for(let b=0;b<4+Math.floor(random()*2);b++){
      const angle=random()*Math.PI*2,branchY=height*(.42+random()*.34),length=1.25+random()*1.35;
      const start=new THREE.Vector3(x,ground+branchY*scale,z);
      const dir=new THREE.Vector3(Math.sin(angle)*.82,.45+random()*.35,Math.cos(angle)*.82).normalize();
      const end=start.clone().addScaledVector(dir,length*scale),mid=start.clone().add(end).multiplyScalar(.5);
      const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir);
      branches.push({x:mid.x,y:mid.y,z:mid.z,sx:.22*scale,sy:length*scale*.5,sz:.22*scale,q});
    }
    for(let c=0;c<clusterCount;c++){
      const angle=(c/clusterCount)*Math.PI*2+random()*.6;
      const y=ground+height*(.65+random()*.27)*scale;
      const radius=(1.25+random()*.65)*scale;
      const entry={x:x+Math.cos(angle)*radius*.48,y,z:z+Math.sin(angle)*radius*.48,
        sx:radius*(.85+random()*.35),sy:radius*(.82+random()*.35),sz:radius*(.85+random()*.35),phase,wind:1+random()};
      crowns[type].push(entry); treeLeaves.push({entry,baseX:entry.x,baseZ:entry.z,phase,wind:entry.wind});
    }
    treeCount++;
  }
  const trunkMesh=addInstances(scene,new THREE.CylinderGeometry(.62,1.25,1,8,1),trunkMat,trunks);
  if(trunkMesh)trunkMesh.castShadow=true;
  const rootMesh=new THREE.InstancedMesh(new THREE.CylinderGeometry(.08,.55,1,6),trunkMat,roots.length),rootDummy=new THREE.Object3D();
  roots.forEach((e,i)=>{rootDummy.position.set(e.x,e.y,e.z);rootDummy.quaternion.copy(e.q);rootDummy.scale.set(e.sx,e.sy,e.sz);rootDummy.updateMatrix();rootMesh.setMatrixAt(i,rootDummy.matrix);});
  rootMesh.instanceMatrix.needsUpdate=true;rootMesh.castShadow=true;scene.add(rootMesh);
  const branchMesh=addInstances(scene,new THREE.CylinderGeometry(.12,.48,1,5),branchMat,branches);
  if(branchMesh){
    const dummy=new THREE.Object3D();
    branches.forEach((e,i)=>{dummy.position.set(e.x,e.y,e.z);dummy.quaternion.copy(e.q);dummy.scale.set(e.sx,e.sy,e.sz);dummy.updateMatrix();branchMesh.setMatrixAt(i,dummy.matrix);});
    branchMesh.instanceMatrix.needsUpdate=true;branchMesh.castShadow=true;
  }
  const crownGroups=crowns.map((entries,i)=>{
    const mesh=addInstances(scene,new THREE.SphereGeometry(1,8,6),leafMats[i],entries);
    if(mesh)mesh.castShadow=true;
    return {mesh,entries};
  }).filter(group=>group.mesh);

  let shrubCount=0;attempts=0;
  while(shrubCount<150&&attempts++<2100){
    const x=(random()-.5)*194,z=(random()-.5)*194;if(!clearForNature(x,z)||random()<.25)continue;
    const s=.5+random()*.65,i=Math.floor(random()*shrubMats.length);
    shrubs[i].push({x,y:heightAt(x,z)+s*.42,z,sx:s*1.25,sy:s*.8,sz:s,ry:random()*Math.PI*2,phase:random()*Math.PI*2});shrubCount++;
  }
  const shrubGroups=shrubs.map((entries,i)=>({mesh:addInstances(scene,new THREE.IcosahedronGeometry(.78,1),shrubMats[i],entries),entries})).filter(group=>group.mesh);
  const rockGeo=new THREE.DodecahedronGeometry(1,0);
  for(let i=0;i<64;i++){const x=(random()-.5)*194,z=(random()-.5)*188;if(!clearForNature(x,z))continue;const s=.42+random()*.95;rocks.push({x,y:heightAt(x,z)+s*.28,z,sx:s*1.2,sy:s*.65,sz:s,rx:random(),ry:random()*3,rz:random()});}
  addInstances(scene,rockGeo,rockMat,rocks);

  const bladeGeo=new THREE.ConeGeometry(.12,.72,3),grassMeshes=[];
  let grassCount=0;attempts=0;
  while(grassCount<560&&attempts++<4200){
    const x=(random()-.5)*190,z=(random()-.5)*190;if(!clearForNature(x,z)||random()<.35)continue;
    const s=.5+random()*.75,i=Math.floor(random()*grassMats.length);
    grass[i].push({x,y:heightAt(x,z)+.3*s,z,sx:s,sy:s,sz:s,ry:random()*Math.PI*2,phase:random()*Math.PI*2});grassCount++;
  }
  grass.forEach((entries,i)=>{const mesh=addInstances(scene,bladeGeo,grassMats[i],entries);if(mesh)grassMeshes.push({mesh,entries});});

  const dummy=new THREE.Object3D();
  return {
    update(time){
      for(const group of grassMeshes){
        group.entries.forEach((e,i)=>{dummy.position.set(e.x,e.y,e.z);dummy.rotation.set(0,e.ry,Math.sin(time*1.25+e.phase)*.18);dummy.scale.set(e.sx,e.sy,e.sz);dummy.updateMatrix();group.mesh.setMatrixAt(i,dummy.matrix);});
        group.mesh.instanceMatrix.needsUpdate=true;
      }
      // Las copas se desplazan apenas alrededor del tronco, como ramas movidas por el viento.
      for(const group of crownGroups){
        group.entries.forEach((e,i)=>{
          const sway=Math.sin(time*.72+e.phase)*.13*e.wind;
          dummy.position.set(e.x+sway,e.y+Math.sin(time*.9+e.phase)*.035,e.z+Math.cos(time*.68+e.phase)*.1*e.wind);
          dummy.rotation.set(0,sway*.35,Math.sin(time*.72+e.phase)*.035);
          dummy.scale.set(e.sx,e.sy,e.sz);dummy.updateMatrix();group.mesh.setMatrixAt(i,dummy.matrix);
        });
        group.mesh.instanceMatrix.needsUpdate=true;
      }
      for(const group of shrubGroups){
        group.entries.forEach((e,i)=>{
          dummy.position.set(e.x,e.y,e.z);dummy.rotation.set(0,e.ry,Math.sin(time*.95+e.phase)*.045);
          dummy.scale.set(e.sx,e.sy,e.sz);dummy.updateMatrix();group.mesh.setMatrixAt(i,dummy.matrix);
        });
        group.mesh.instanceMatrix.needsUpdate=true;
      }
    }
  };
}
