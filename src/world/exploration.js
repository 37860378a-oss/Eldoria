import * as THREE from "three";

const stoneMat=new THREE.MeshStandardMaterial({color:0x77796f,roughness:.96,flatShading:true});
const wornMat=new THREE.MeshStandardMaterial({color:0x938b73,roughness:1,flatShading:true});
const darkStone=new THREE.MeshStandardMaterial({color:0x4c5a52,roughness:1});
const crystalMat=new THREE.MeshStandardMaterial({color:0x6dc8bd,emissive:0x236e69,emissiveIntensity:1.1,roughness:.24});
const barkMat=new THREE.MeshStandardMaterial({color:0x51402d,roughness:1});
const leafMats=[0x355b3e,0x416d47,0x587a4a].map(color=>new THREE.MeshStandardMaterial({color,roughness:.94}));
const roadMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,vertexColors:true,side:THREE.DoubleSide});

function seeded(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function makeTrail(scene,heightAt,points,width,bridgeExit=false){
  const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,0,z)),false,"centripetal");
  const segments=160,verts=[],colors=[],indices=[],uv=[];
  const edge=new THREE.Color(0x71865a),center=new THREE.Color(0x927b59);
  for(let i=0;i<=segments;i++){
    const t=i/segments,p=curve.getPoint(t),tan=curve.getTangent(t).normalize(),side=new THREE.Vector3(-tan.z,0,tan.x);
    for(let j=0;j<7;j++){
      const f=-1.28+j*(2.56/6),x=p.x+side.x*width*.5*f,z=p.z+side.z*width*.5*f;
      const blend=THREE.MathUtils.smoothstep(Math.abs(f),.82,1.28);
      const col=center.clone().lerp(edge,blend);
      const bridgeBlend=bridgeExit?THREE.MathUtils.smoothstep(z,-44,-37.2):0;
      verts.push(x,heightAt(x,z)+.055+bridgeBlend*.78,z);colors.push(col.r,col.g,col.b);uv.push(t*18,j/6);
      if(i<segments&&j<6){const a=i*7+j;indices.push(a,a+1,a+7,a+1,a+8,a+7);}
    }
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(verts,3));geo.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));geo.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
  const mesh=new THREE.Mesh(geo,roadMat);mesh.receiveShadow=true;scene.add(mesh);
}
function addStone(scene,geo,material,x,y,z,sx,sy,sz,rotation=0){
  const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.rotation.y=rotation;scene.add(m);return m;
}
function createRuins(scene,heightAt){
  const x=43,z=-76,ground=heightAt(x,z),group=new THREE.Group();
  const base=new THREE.Mesh(new THREE.CylinderGeometry(8.6,9.2,.65,12),darkStone);base.position.y=.28;group.add(base);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(7.2,.24,6,48),wornMat);ring.rotation.x=Math.PI/2;ring.position.y=.68;group.add(ring);
  const pillarGeo=new THREE.BoxGeometry(1.15,1,1.15);
  const pillars=[[-6.2,0,-4.4],[-6.6,0,2.8],[-1.5,0,6.6],[5.3,0,4.8],[6.4,0,-2.7],[1.8,0,-6.2]];
  pillars.forEach(([px,,pz],i)=>{
    const h=2.8+(i%3)*.65;
    const pillar=new THREE.Mesh(pillarGeo,stoneMat);pillar.position.set(px,h*.5+.62,pz);pillar.scale.set(1,h,1);pillar.rotation.y=i*.23;group.add(pillar);
    const cap=new THREE.Mesh(new THREE.BoxGeometry(1.55,.34,1.5),wornMat);cap.position.set(px,h+.68,pz);cap.rotation.y=i*.23;group.add(cap);
  });
  // Un dintel caído y fragmentos alrededor cuentan que el santuario se quebró hace siglos.
  const lintel=new THREE.Mesh(new THREE.BoxGeometry(7.8,.65,1.25),wornMat);lintel.position.set(-3.7,1.15,-4.4);lintel.rotation.z=-.28;lintel.rotation.y=.18;group.add(lintel);
  const altar=new THREE.Mesh(new THREE.CylinderGeometry(1.7,2.1,1.15,8),wornMat);altar.position.set(0,1.02,0);group.add(altar);
  const crystal=new THREE.Mesh(new THREE.OctahedronGeometry(.85,1),crystalMat);crystal.position.set(0,2.45,0);group.add(crystal);
  const glow=new THREE.PointLight(0x6dc8bd,1.7,16);glow.position.set(0,3.2,0);group.add(glow);
  const rubbleGeo=new THREE.DodecahedronGeometry(1,0);
  const random=seeded(773);
  for(let i=0;i<28;i++){
    const a=random()*Math.PI*2,r=8.5+random()*4,s=.35+random()*.9;
    const rock=new THREE.Mesh(rubbleGeo,i%3===0?wornMat:stoneMat);
    rock.position.set(Math.cos(a)*r,.25+s*.25,Math.sin(a)*r);rock.scale.set(s*1.4,s*.55,s);rock.rotation.set(random(),random()*3,random());group.add(rock);
  }
  group.position.set(x,ground,z);scene.add(group);
  return {group,crystal,glow,baseY:crystal.position.y};
}
function createWhisperGrove(scene,heightAt){
  const random=seeded(1917),trunks=[],crowns=[[],[],[]],motes=[];
  const center={x:-65,z:-70};
  for(let i=0;i<34;i++){
    const a=random()*Math.PI*2,r=5+Math.sqrt(random())*21,x=center.x+Math.cos(a)*r,z=center.z+Math.sin(a)*r;
    const ground=heightAt(x,z),h=8+random()*4.5,scale=.8+random()*.5,rad=.27+random()*.15;
    const embed=.4;
    trunks.push({x,y:ground+(h*.5-embed*.5)*scale,z,sx:rad*scale,sy:(h+embed)*scale,sz:rad*scale,ry:random()*6.28});
    const type=Math.floor(random()*3),count=4+Math.floor(random()*3),phase=random()*6.28;
    for(let j=0;j<count;j++){
      const angle=j/count*Math.PI*2+random()*.5,spread=1.5+random()*1.3;
      crowns[type].push({x:x+Math.cos(angle)*spread,y:ground+h*scale*(.68+random()*.25),z:z+Math.sin(angle)*spread,
        sx:spread*(.9+random()*.5),sy:spread*(.9+random()*.45),sz:spread*(.9+random()*.5),phase,wind:.7+random()*.8});
    }
  }
  const trunkMesh=new THREE.InstancedMesh(new THREE.CylinderGeometry(.14,.36,1,7),barkMat,trunks.length),dummy=new THREE.Object3D();
  trunks.forEach((e,i)=>{dummy.position.set(e.x,e.y,e.z);dummy.rotation.y=e.ry;dummy.scale.set(e.sx,e.sy,e.sz);dummy.updateMatrix();trunkMesh.setMatrixAt(i,dummy.matrix);});scene.add(trunkMesh);
  const crownGroups=crowns.map((entries,i)=>{
    if(!entries.length)return null;
    const mesh=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),leafMats[i],entries.length);
    entries.forEach((e,j)=>{dummy.position.set(e.x,e.y,e.z);dummy.scale.set(e.sx,e.sy,e.sz);dummy.updateMatrix();mesh.setMatrixAt(j,dummy.matrix);});scene.add(mesh);return {mesh,entries};
  }).filter(Boolean);
  const fernGeo=new THREE.ConeGeometry(.28,1.15,5),fernMat=new THREE.MeshStandardMaterial({color:0x547a4a,roughness:1});
  const ferns=new THREE.InstancedMesh(fernGeo,fernMat,80);
  for(let i=0;i<80;i++){
    const a=random()*Math.PI*2,r=4+random()*24,x=center.x+Math.cos(a)*r,z=center.z+Math.sin(a)*r,s=.45+random()*.7;
    dummy.position.set(x,heightAt(x,z)+s*.48,z);dummy.rotation.set((random()-.5)*.25,random()*6.28,(random()-.5)*.25);dummy.scale.set(s,s,s);dummy.updateMatrix();ferns.setMatrixAt(i,dummy.matrix);
    motes.push({x,y:heightAt(x,z)+1.5+random()*3,z,phase:random()*6.28});
  }
  scene.add(ferns);
  const moteGeo=new THREE.SphereGeometry(.075,6,5),moteMat=new THREE.MeshBasicMaterial({color:0xb9dba0});
  const moteMesh=new THREE.InstancedMesh(moteGeo,moteMat,motes.length);
  motes.forEach((e,i)=>{dummy.position.set(e.x,e.y,e.z);dummy.scale.setScalar(.5+random());dummy.updateMatrix();moteMesh.setMatrixAt(i,dummy.matrix);});scene.add(moteMesh);
  return {crownGroups,motes,moteMesh,update(time){
    crownGroups.forEach(g=>{g.entries.forEach((e,i)=>{dummy.position.set(e.x+Math.sin(time*.55+e.phase)*.15*e.wind,e.y,e.z+Math.cos(time*.5+e.phase)*.12*e.wind);dummy.rotation.z=Math.sin(time*.6+e.phase)*.025;dummy.scale.set(e.sx,e.sy,e.sz);dummy.updateMatrix();g.mesh.setMatrixAt(i,dummy.matrix);});g.mesh.instanceMatrix.needsUpdate=true;});
    motes.forEach((e,i)=>{dummy.position.set(e.x+Math.sin(time*.4+e.phase)*.35,e.y+Math.sin(time*.8+e.phase)*.5,e.z+Math.cos(time*.35+e.phase)*.35);dummy.updateMatrix();moteMesh.setMatrixAt(i,dummy.matrix);});moteMesh.instanceMatrix.needsUpdate=true;
  }};
}
export function createExploration(scene,heightAt){
  const mainTrail=[[8.2,-37.2],[12,-45],[17,-51],[24,-58],[32,-66],[41,-74]];
  const forestTrail=[[17,-51],[8,-58],[-5,-62],[-20,-64],[-36,-67],[-53,-70],[-65,-72]];
  makeTrail(scene,heightAt,mainTrail,4.3,true);makeTrail(scene,heightAt,forestTrail,3.6);
  const ruins=createRuins(scene,heightAt),grove=createWhisperGrove(scene,heightAt);
  const regionAt=(x,z)=>{
    if(Math.hypot((x-43)/19,(z+76)/17)<1.35)return "Santuario de las Primeras Brasas";
    if(Math.hypot((x+65)/31,(z+70)/27)<1.05)return "Bosque de los Susurros";
    if(z>-43&&x>-78&&x<30)return "Piedra Clara";
    return "Tierras de la Marca";
  };
  return {regionAt,update(time){grove.update(time);ruins.crystal.position.y=ruins.baseY+Math.sin(time*1.4)*.12;ruins.crystal.rotation.y=time*.22;ruins.glow.intensity=1.35+Math.sin(time*2)*.35;}};
}
