import * as THREE from "three";

const WORLD_SIZE=550;
const RIVER_LEVEL_OFFSET=.35;
function smooth01(t){t=THREE.MathUtils.clamp(t,0,1);return t*t*(3-2*t);}
function plateau(x,z,cx,cz,radius,height,edge=5){const d=Math.hypot(x-cx,z-cz);return height*(1-smooth01((d-radius)/edge));}
const LAKES=[
  {x:-69,z:38,rx:17,rz:12,offset:-.9},
  {x:69,z:61,rx:13,rz:10,offset:-.85},
  {x:-158,z:118,rx:20,rz:15,offset:-.75},
  {x:154,z:-145,rx:17,rz:13,offset:-.8},
  {x:174,z:142,rx:15,rz:12,offset:-.7},
  {x:-48,z:168,rx:16,rz:12,offset:-.8}
];
function noise(x,z,s,p=0){return Math.sin((x+p)*s)*Math.cos((z-p)*s*.83);}
function baseHeight(x,z){
  const broad=noise(x,z,.026,11)*2,rolling=noise(x+31,z-17,.057,4)*.68;
  const ridge=Math.pow(Math.abs(noise(x-13,z+27,.018,8)),1.7)*1.7;
  const a=7.2*Math.exp(-(((x-55)**2)/1050+((z-48)**2)/1350));
  const b=5.4*Math.exp(-(((x+66)**2)/1550+((z-56)**2)/1200));
  const c=3.8*Math.exp(-(((x-48)**2)/1900+((z+67)**2)/1500));
  const flat=Math.exp(-(((x+28)**2)/1050+((z-1)**2)/900));
  const edge=Math.max(Math.abs(x),Math.abs(z));
  const rim=smooth01((edge-155)/120);
  const mountainRim=rim*rim*(27+10*Math.abs(Math.sin(x*.031+z*.019))+5*Math.abs(Math.sin(z*.057-x*.023)));
  const mesas=plateau(x,z,142,-108,25,13,7)+plateau(x,z,-145,132,22,10,6);
  return (broad+rolling+ridge+a+b+c)*(1-flat*.94)+mountainRim+mesas;
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
  const geometry=new THREE.PlaneGeometry(WORLD_SIZE,WORLD_SIZE,420,420);geometry.rotateX(-Math.PI/2);
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
  const waterGeo=new THREE.PlaneGeometry(520,12.8,420,18);waterGeo.rotateX(-Math.PI/2);
  const waterPositions=waterGeo.attributes.position,baseWater=waterPositions.array.slice();
  const riverMat=waterMaterial(0x347f91);riverMat.depthWrite=false;
  const river=new THREE.Mesh(waterGeo,riverMat);river.position.set(15,0,-25);river.renderOrder=2;scene.add(river);
  const bankMat=new THREE.MeshStandardMaterial({color:0x817d5e,roughness:1});
  // Orillas rocosas discontinuas que siguen el relieve en lugar de dos bordes rectos.
  const bankGroups=[];
  for(const side of [-1,1]){
    const points=[];
    for(let i=0;i<175;i++){const x=-245+i*2.95,z=-25+side*(7.0+Math.sin(i*.22)*.7);points.push(new THREE.Vector3(x,terrainHeight(x,z)+.04,z));}
    const stones=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,0),bankMat,points.length),dummy=new THREE.Object3D();
    points.forEach((p,i)=>{const s=.35+((i*17)%11)/15;dummy.position.copy(p);dummy.scale.set(s*1.8,s*.38,s*.7);dummy.rotation.y=i*.71;dummy.updateMatrix();stones.setMatrixAt(i,dummy.matrix);});
    scene.add(stones);bankGroups.push(stones);
  }
  const currentMat=new THREE.MeshBasicMaterial({color:0xd5f5f2,transparent:true,opacity:.82,depthWrite:false,depthTest:false});
  const currentGeo=new THREE.ConeGeometry(.2,.62,3);currentGeo.rotateZ(-Math.PI/2);
  const current=new THREE.InstancedMesh(currentGeo,currentMat,28);current.frustumCulled=false;current.renderOrder=5;
  const currentData=[];const currentDummy=new THREE.Object3D();
  for(let i=0;i<28;i++){currentData.push({x:-235+i*18.5,z:-28+(i%3)*2.7,phase:i*.43});}
  scene.add(current);
  // Cascada occidental: el río nace entre las montañas y cae directamente al cauce.
  const fallTop=terrainHeight(-248,-25)+3.2;
  const fallBottom=terrainHeight(-244,-25)+RIVER_LEVEL_OFFSET;
  const fallHeight=Math.max(8,fallTop-fallBottom);
  const fallGeo=new THREE.PlaneGeometry(13,fallHeight,8,34);
  const fallPositions=fallGeo.attributes.position,fallBase=fallPositions.array.slice();
  const fallMat=new THREE.MeshBasicMaterial({color:0x83c8d0,transparent:true,opacity:.84,side:THREE.DoubleSide,depthWrite:false,depthTest:false});
  const waterfall=new THREE.Mesh(fallGeo,fallMat);
  waterfall.rotation.y=Math.PI/2;
  waterfall.position.set(-244.2,(fallTop+fallBottom)*.5,-25);waterfall.renderOrder=4;
  scene.add(waterfall);
  const cliffMat=new THREE.MeshStandardMaterial({color:0x66685f,roughness:1,flatShading:true});
  for(const side of [-1,1]){
    const cliffRock=new THREE.Mesh(new THREE.DodecahedronGeometry(1.8,1),cliffMat);
    cliffRock.position.set(-247,fallBottom+fallHeight*.56,-25+side*7.2);
    cliffRock.scale.set(2.2,3.8,3.2);cliffRock.rotation.set(.2,side*.25,.1);cliffRock.castShadow=true;scene.add(cliffRock);
  }
  const splash=new THREE.Mesh(new THREE.CircleGeometry(5.8,32),waterMaterial(0x70b7c2));
  splash.rotation.x=-Math.PI/2;splash.position.set(-243,fallBottom+.08,-25);splash.renderOrder=3;splash.scale.set(1.25,1,1);scene.add(splash);
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
        const x=baseWater[i*3]+river.position.x,z=baseWater[i*3+2]+river.position.z;
        waterPositions[i*3+1]=terrainHeight(x,-25)+RIVER_LEVEL_OFFSET+Math.sin(x*.075+time*1.15)*.035+Math.cos(z*.8+time*.8)*.018;
      }
      waterGeo.attributes.position.needsUpdate=true;waterGeo.computeVertexNormals();
      currentData.forEach((p,i)=>{const x=((p.x+245+time*2.8+p.phase*2)%520)-245;currentDummy.position.set(x,terrainHeight(x,-25)+RIVER_LEVEL_OFFSET+.42+Math.sin(x*.075+time*1.15)*.035,p.z);currentDummy.rotation.set(0,0,0);currentDummy.updateMatrix();current.setMatrixAt(i,currentDummy.matrix);});
      current.instanceMatrix.needsUpdate=true;
      const fallAttr=fallGeo.attributes.position;
      for(let i=0;i<fallAttr.count;i++){
        const baseY=fallBase[i*3+1],x=fallBase[i*3];
        fallAttr.array[i*3+1]=baseY+Math.sin(time*3.8+x*.9)*.035;
        fallAttr.array[i*3+2]=fallBase[i*3+2]+Math.sin(time*4.4+baseY*.7)*.045;
      }
      fallAttr.needsUpdate=true;fallGeo.computeVertexNormals();
    }
  };
}
