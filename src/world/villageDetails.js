import * as THREE from "three";

const wood = new THREE.MeshStandardMaterial({ color: 0x65472f, roughness: 1 });
const iron = new THREE.MeshStandardMaterial({ color: 0x343b3a, roughness: 0.85 });
const barrelMat = new THREE.MeshStandardMaterial({ color: 0x805a38, roughness: 1 });
const crateMat = new THREE.MeshStandardMaterial({ color: 0x9a7548, roughness: 1 });
const lanternGlow = new THREE.MeshStandardMaterial({ color: 0xffc66d, emissive: 0xff9b35, emissiveIntensity: 0.8, roughness: 0.6 });

function addInstances(scene, geometry, material, entries) {
  if (!entries.length) return;
  const mesh = new THREE.InstancedMesh(geometry, material, entries.length), dummy = new THREE.Object3D();
  entries.forEach((entry,index)=>{
    dummy.position.set(entry.x,entry.y,entry.z);dummy.rotation.set(entry.rx||0,entry.ry||0,entry.rz||0);
    dummy.scale.set(entry.sx||1,entry.sy||1,entry.sz||1);dummy.updateMatrix();mesh.setMatrixAt(index,dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate=true;mesh.frustumCulled=true;scene.add(mesh);
}
function addWaystone(scene,heightAt,x,z,rotation=0){
  const stone=new THREE.MeshStandardMaterial({color:0x827d6b,roughness:1,flatShading:true});
  const group=new THREE.Group();
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.42,.58,.48,6),stone);base.position.y=.24;group.add(base);
  const marker=new THREE.Mesh(new THREE.BoxGeometry(.38,1.55,.28),stone);marker.position.y=1.18;group.add(marker);
  const cap=new THREE.Mesh(new THREE.ConeGeometry(.31,.38,6),stone);cap.position.y=2.12;group.add(cap);
  group.rotation.y=rotation;group.position.set(x,heightAt(x,z),z);scene.add(group);
}
export function createVillageDetails(scene,heightAt){
  // Faroles laterales: nunca en el centro de los senderos.
  const lanterns=[[-47,-2],[-40,-8],[-32,-10],[-23,-6],[-16,3],[-22,14],[-36,14],[-44,9],[7,-15],[12,-41],[29,-51],[43,-56]];
  const posts=lanterns.map(([x,z])=>({x,y:heightAt(x,z)+1.25,z,sx:.16,sy:1.25,sz:.16}));
  const lamps=lanterns.map(([x,z])=>({x,y:heightAt(x,z)+2.55,z,sx:.34,sy:.38,sz:.34}));
  addInstances(scene,new THREE.CylinderGeometry(.13,.19,2.5,5),wood,posts);
  addInstances(scene,new THREE.BoxGeometry(1,1,1),lanternGlow,lamps);

  const barrels=[[-54,18,.9],[-31,23,.82],[-53,-18,.88],[-3,18,.78],[-2,-17,.82],[16,-43,.76]]
    .map(([x,z,scale])=>({x,y:heightAt(x,z)+.48*scale,z,sx:scale,sy:scale,sz:scale,ry:(x*13+z*7)%6}));
  addInstances(scene,new THREE.CylinderGeometry(.38,.43,.96,8),barrelMat,barrels);
  const crates=[[-56,13],[-29,25],[-50,-20],[-1,14],[19,-45]].map(([x,z],i)=>{
    const scale=i%2?.82:.95;return{x,y:heightAt(x,z)+.43*scale,z,sx:scale,sy:scale,sz:scale,ry:i*.47};
  });
  addInstances(scene,new THREE.BoxGeometry(.9,.86,.9),crateMat,crates);

  const signMaterial=new THREE.MeshStandardMaterial({color:0x765334,roughness:1});
  for(const [x,z,rotation] of [[-44,-8,.18],[12,-16,-.25]]){
    const sign=new THREE.Group(),post=new THREE.Mesh(new THREE.CylinderGeometry(.11,.15,2.5,5),wood);
    post.position.y=1.25;sign.add(post);
    const board=new THREE.Mesh(new THREE.BoxGeometry(1.65,.62,.16),signMaterial);board.position.set(.55,2,0);sign.add(board);
    const trim=new THREE.Mesh(new THREE.BoxGeometry(1.78,.09,.2),iron);trim.position.set(.55,2.34,0);sign.add(trim);
    sign.rotation.y=rotation;sign.position.set(x,heightAt(x,z),z);scene.add(sign);
  }

  // Mojones de piedra que anuncian los dos caminos de salida y les dan un destino legible.
  addWaystone(scene,heightAt,61,34,-.15);
  addWaystone(scene,heightAt,59,-59,.2);
}
