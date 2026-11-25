import * as THREE from "three";

const wood=new THREE.MeshStandardMaterial({color:0x65472f,roughness:1});
const cloth=new THREE.MeshStandardMaterial({color:0x9a7652,roughness:1,side:THREE.DoubleSide});
const blanket=new THREE.MeshStandardMaterial({color:0x8a5141,roughness:1,side:THREE.DoubleSide});
const stone=new THREE.MeshStandardMaterial({color:0x77786d,roughness:1,flatShading:true});
const dark=new THREE.MeshStandardMaterial({color:0x252c29,roughness:1});
const herbMats=[0x6c934a,0x829c55,0xa0a65b].map(color=>new THREE.MeshStandardMaterial({color,roughness:1}));

function campfire(group){
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.72,.16,6,12),stone);
  ring.rotation.x=Math.PI/2;ring.position.y=.18;group.add(ring);
  const ash=new THREE.Mesh(new THREE.CircleGeometry(.55,12),dark);
  ash.rotation.x=-Math.PI/2;ash.position.y=.16;group.add(ash);
  const flameMat=new THREE.MeshBasicMaterial({color:0xffa64d});
  const flame=new THREE.Mesh(new THREE.ConeGeometry(.28,.9,6),flameMat);
  flame.position.y=.62;group.add(flame);
  for(let i=0;i<3;i++){
    const log=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,1.35,6),wood);
    log.rotation.z=Math.PI/2;log.rotation.y=i*Math.PI/3;log.position.set(0,.2,0);group.add(log);
  }
}
function addTent(group,x,z,colorMat){
  const tent=new THREE.Mesh(new THREE.ConeGeometry(2.35,2.7,4),colorMat);
  tent.position.set(x,1.35,z);tent.rotation.y=Math.PI/4;tent.scale.set(1.25,1,1);tent.castShadow=true;group.add(tent);
  const flap=new THREE.Mesh(new THREE.PlaneGeometry(.95,1.45),wood);
  flap.position.set(x, .78,z+1.72);group.add(flap);
  const ridge=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,3.8,5),wood);
  ridge.rotation.z=Math.PI/2;ridge.position.set(x,2.5,z);group.add(ridge);
}
function addCamp(scene,heightAt,x,z,seed){
  const group=new THREE.Group();
  const mats=[cloth,blanket];
  addTent(group,-3,0,mats[seed%2]);
  addTent(group,3,-1,mats[(seed+1)%2]);
  campfire(group);
  for(let i=0;i<3;i++){
    const log=new THREE.Mesh(new THREE.CylinderGeometry(.16,.2,2.4,7),wood);
    log.rotation.z=Math.PI/2;log.rotation.y=i*.4;log.position.set(-2.4,.22,3+i*.48);group.add(log);
  }
  for(let i=0;i<3;i++){
    const roll=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,1.55,8),blanket);
    roll.rotation.z=Math.PI/2;roll.position.set(4.3,.3,2.2+i*.72);group.add(roll);
    const bed=new THREE.Mesh(new THREE.BoxGeometry(1.7,.12,2.25),i%2?cloth:blanket);
    bed.position.set(4.2,.12,3.25+i*.72);group.add(bed);
  }
  const crate=new THREE.Mesh(new THREE.BoxGeometry(.9,.75,.8),wood);
  crate.position.set(-5,.38,2.5);group.add(crate);
  group.position.set(x,heightAt(x,z),z);
  group.rotation.y=seed*.71;
  scene.add(group);
}
export function createEnvironment(scene,heightAt){
  addCamp(scene,heightAt,88,-92,1);
  addCamp(scene,heightAt,-128,92,2);
  addCamp(scene,heightAt,174,112,3);

  const random=(()=>{let s=91827;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};})();
  const herbGeo=new THREE.ConeGeometry(.16,1.05,5),herbs=[[],[],[]];
  const rocks=[],mounds=[];
  for(let i=0;i<240;i++){
    const x=(random()-.5)*500,z=(random()-.5)*500;
    if(Math.abs(z+25)<17)continue;
    const y=heightAt(x,z),type=Math.floor(random()*3),s=.45+random()*.7;
    for(let j=0;j<4;j++){
      const a=random()*Math.PI*2,r=random()*1.2;
      herbs[type].push({x:x+Math.cos(a)*r,y:y+s*.28,z:z+Math.sin(a)*r,scale:s*(.7+random()*.5),ry:a});
    }
    if(i%3===0){
      const mound=new THREE.Mesh(new THREE.DodecahedronGeometry(1,1),stone);
      mound.position.set(x,y+.45,z);mound.scale.set(1.5+random()*2,.55+random()*.65,1.2+random()*1.8);
      mound.rotation.set(random(),random()*3,random());mound.castShadow=true;scene.add(mound);
    }else{
      const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(1,0),stone);
      rock.position.set(x,y+.25,z);rock.scale.set(.5+random()*1.3,.35+random()*.6,.5+random()*1.2);
      rock.rotation.set(random(),random()*3,random());rock.castShadow=true;rocks.push(rock);scene.add(rock);
    }
  }
  const dummy=new THREE.Object3D(),groups=herbs.map((entries,i)=>{
    const mesh=new THREE.InstancedMesh(herbGeo,herbMats[i],entries.length);
    entries.forEach((e,j)=>{dummy.position.set(e.x,e.y,e.z);dummy.rotation.set(0,e.ry,0);dummy.scale.set(.8,e.scale,.8);dummy.updateMatrix();mesh.setMatrixAt(j,dummy.matrix);});
    mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=true;scene.add(mesh);return mesh;
  });
  return {update(time){
    groups.forEach((mesh,i)=>{const entries=herbs[i];entries.forEach((e,j)=>{dummy.position.set(e.x,e.y,e.z);dummy.rotation.set(Math.sin(time*.8+j*.31)*.09,e.ry,Math.cos(time*.95+j*.23)*.12);dummy.scale.set(.8,e.scale,.8);dummy.updateMatrix();mesh.setMatrixAt(j,dummy.matrix);});mesh.instanceMatrix.needsUpdate=true;});
  }};
}
