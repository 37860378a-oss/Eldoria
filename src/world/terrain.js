import * as THREE from "three";

const WORLD_SIZE=220;
const LAKES=[
  {x:-69,z:38,rx:17,rz:12,offset:-.9},
  {x:69,z:61,rx:13,rz:10,offset:-.85}
];
function noise(x,z,s,p=0){return Math.sin((x+p)*s)*Math.cos((z-p)*s*.83);}
function baseHeight(x,z){
  const broad=noise(x,z,.026,11)*2,rolling=noise(x+31,z-17,.057,4)*.68;
  const ridge=Math.pow(Math.abs(noise(x-13,z+27,.018,8)),1.7)*1.7;
  const a=7.2*Math.exp(-(((x-55)**2)/1050+((z-48)**2)/1350));
  const b=5.4*Math.exp(-(((x+66)**2)/1550+((z-56)**2)/1200));
  const c=3.8*Math.exp(-(((x-48)**2)/1900+((z+67)**2)/1500));
  const flat=Math.exp(-(((x+28)**2)/1050+((z-1)**2)/900));
  return (broad+rolling+ridge+a+b+c)*(1-flat*.94);
}
function depression(x,z,l){const d=((x-l.x)**2)/(l.rx*l.rx)+((z-l.z)**2)/(l.rz*l.rz);return d<1.45?3.6*Math.exp(-d*1.15):0;}
export function terrainHeight(x,z){
  let h=baseHeight(x,z);
  // Cauce excavado con taludes suaves, no una zanja rectangular.
  const riverDistance=Math.abs(z+25);
  h-=3.55*Math.exp(-Math.pow(riverDistance/7.2,2));
  h-=.95*Math.exp(-Math.pow(riverDistance/15.5,2));
  for(const lake of LAKES)h-=depression(x,z,lake);
  return h;
}
function groundTexture(){
  const c=document.createElement("canvas");c.width=c.height=512;
  const ctx=c.getContext("2d"),img=ctx.createImageData(512,512);let seed=9137;
  const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<img.data.length;i+=4){const s=Math.floor(rnd()*38);img.data[i]=79+s;img.data[i+1]=105+s;img.data[i+2]=57+Math.floor(s*.5);img.data[i+3]=255;}
  ctx.putImageData(img,0,0);
  for(let i=0;i<900;i++){const x=rnd()*512,y=rnd()*512,r=2+rnd()*18;ctx.fillStyle=rnd()>.5?"rgba(178,157,104,.17)":"rgba(31,77,39,.22)";ctx.beginPath();ctx.ellipse(x,y,r*1.8,r,rnd()*3,0,Math.PI*2);ctx.fill();}
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(7,7);texture.anisotropy=4;return texture;
}
function waterMaterial(color){return new THREE.MeshStandardMaterial({color,roughness:.18,metalness:.04,transparent:true,opacity:.94,side:THREE.DoubleSide});}
export function createTerrain(scene){
  const geometry=new THREE.PlaneGeometry(WORLD_SIZE,WORLD_SIZE,260,260);geometry.rotateX(-Math.PI/2);
  const positions=geometry.attributes.position,colors=[];
  const meadow=new THREE.Color(0x78985b),light=new THREE.Color(0xa4ae72),earth=new THREE.Color(0x9a8966),wet=new THREE.Color(0x71805a);
  for(let i=0;i<positions.count;i++){
    const x=positions.getX(i),z=positions.getZ(i),h=terrainHeight(x,z),distance=Math.abs(z+25);
    positions.setY(i,h);
    const variation=(Math.sin(x*.11)+Math.cos(z*.13))*.035;
    const color=meadow.clone().lerp(light,THREE.MathUtils.clamp(.34+h*.028+variation,0,.8));
    if(h>5)color.lerp(earth,.2);
    const bank=1-THREE.MathUtils.smoothstep(distance,7.5,17.5);
    color.lerp(wet,bank*.72);
    colors.push(color.r,color.g,color.b);
  }
  geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();
  const ground=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({map:groundTexture(),vertexColors:true,roughness:1}));ground.receiveShadow=true;scene.add(ground);

  // Agua en una malla subdividida: pequeñas ondas, sin una lámina plana rígida.
  const waterGeo=new THREE.PlaneGeometry(240,12.8,220,16);waterGeo.rotateX(-Math.PI/2);
  const waterPositions=waterGeo.attributes.position,baseWater=waterPositions.array.slice();
  const river=new THREE.Mesh(waterGeo,waterMaterial(0x347f91));river.position.set(0,-.35,-25);scene.add(river);
  const bankMat=new THREE.MeshStandardMaterial({color:0x817d5e,roughness:1});
  // Orillas rocosas discontinuas que siguen el relieve en lugar de dos bordes rectos.
  const bankGroups=[];
  for(const side of [-1,1]){
    const points=[];
    for(let i=0;i<100;i++){const x=-116+i*2.35,z=-25+side*(7.0+Math.sin(i*.22)*.7);points.push(new THREE.Vector3(x,terrainHeight(x,z)+.04,z));}
    const stones=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,0),bankMat,points.length),dummy=new THREE.Object3D();
    points.forEach((p,i)=>{const s=.35+((i*17)%11)/15;dummy.position.copy(p);dummy.scale.set(s*1.8,s*.38,s*.7);dummy.rotation.y=i*.71;dummy.updateMatrix();stones.setMatrixAt(i,dummy.matrix);});
    scene.add(stones);bankGroups.push(stones);
  }
  const currentMat=new THREE.MeshBasicMaterial({color:0xc1e5e5,transparent:true,opacity:.62,depthWrite:false});
  const currentGeo=new THREE.ConeGeometry(.2,.62,3);currentGeo.rotateZ(-Math.PI/2);
  const current=new THREE.InstancedMesh(currentGeo,currentMat,22);current.frustumCulled=false;
  const currentData=[];const currentDummy=new THREE.Object3D();
  for(let i=0;i<22;i++){currentData.push({x:-112+i*10.4,z:-28+(i%3)*2.7,phase:i*.43});}
  scene.add(current);
  const lakes=[];
  for(const lakeData of LAKES){
    const level=baseHeight(lakeData.x,lakeData.z)+lakeData.offset;
    const lake=new THREE.Mesh(new THREE.CircleGeometry(1,64),waterMaterial(0x3e8994));
    lake.rotation.x=-Math.PI/2;lake.position.set(lakeData.x,level,lakeData.z);lake.scale.set(lakeData.rx*1.04,lakeData.rz*1.04,1);scene.add(lake);
    const shore=new THREE.Mesh(new THREE.RingGeometry(.9,1.16,64),new THREE.MeshStandardMaterial({color:0x9c936e,roughness:1,side:THREE.DoubleSide}));
    shore.rotation.x=-Math.PI/2;shore.position.set(lakeData.x,level-.08,lakeData.z);shore.scale.set(lakeData.rx,lakeData.rz,1);scene.add(shore);lakes.push(lake);
  }
  return {
    heightAt:terrainHeight,water:river,lakes,
    update(time){
      for(let i=0;i<waterPositions.count;i++){
        const x=baseWater[i*3],z=baseWater[i*3+2];
        waterPositions[i*3+1]=baseWater[i*3+1]+Math.sin(x*.075+time*1.15)*.045+Math.cos(z*.8+time*.8)*.025;
      }
      waterGeo.attributes.position.needsUpdate=true;waterGeo.computeVertexNormals();
      currentData.forEach((p,i)=>{const x=((p.x+112+time*2.8+p.phase*2)%228)-112;currentDummy.position.set(x,river.position.y+.18+Math.sin(x*.075+time*1.15)*.045,p.z);currentDummy.rotation.set(0,0,0);currentDummy.updateMatrix();current.setMatrixAt(i,currentDummy.matrix);});
      current.instanceMatrix.needsUpdate=true;
    }
  };
}
