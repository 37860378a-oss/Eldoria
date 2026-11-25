import * as THREE from "three";

const WORLD_SIZE=220;
const LAKES=[
  {x:-69,z:38,rx:17,rz:12,offset:-.9},
  {x:69,z:61,rx:13,rz:10,offset:-.85}
];

function noise(x,z,s,p=0){
  return Math.sin((x+p)*s)*Math.cos((z-p)*s*.83);
}

function baseHeight(x,z){
  const broad=noise(x,z,.026,11)*2;
  const rolling=noise(x+31,z-17,.057,4)*.68;
  const ridge=Math.pow(Math.abs(noise(x-13,z+27,.018,8)),1.7)*1.7;
  const a=7.2*Math.exp(-(((x-55)**2)/1050+((z-48)**2)/1350));
  const b=5.4*Math.exp(-(((x+66)**2)/1550+((z-56)**2)/1200));
  const c=3.8*Math.exp(-(((x-48)**2)/1900+((z+67)**2)/1500));
  const flat=Math.exp(-(((x+28)**2)/1050+((z-1)**2)/900));
  return (broad+rolling+ridge+a+b+c)*(1-flat*.94);
}

function depression(x,z,l){
  const d=((x-l.x)**2)/(l.rx*l.rx)+((z-l.z)**2)/(l.rz*l.rz);
  return d<1.45?3.6*Math.exp(-d*1.15):0;
}

export function terrainHeight(x,z){
  let h=baseHeight(x,z)-4.25*Math.exp(-((z+25)**2)/43);
  for(const lake of LAKES) h-=depression(x,z,lake);
  return h;
}

function groundTexture(){
  const c=document.createElement("canvas");
  c.width=c.height=256;
  const ctx=c.getContext("2d");
  const img=ctx.createImageData(256,256);
  let seed=9137;
  const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<img.data.length;i+=4){
    const s=Math.floor(rnd()*34);
    img.data[i]=83+s;
    img.data[i+1]=112+s;
    img.data[i+2]=62+Math.floor(s*.48);
    img.data[i+3]=255;
  }
  ctx.putImageData(img,0,0);
  for(let i=0;i<230;i++){
    const x=rnd()*256,y=rnd()*256,r=4+rnd()*15;
    ctx.fillStyle=rnd()>.5?"rgba(174,158,103,.15)":"rgba(35,83,43,.2)";
    ctx.beginPath();
    ctx.ellipse(x,y,r*1.7,r,rnd()*3,0,Math.PI*2);
    ctx.fill();
  }
  const texture=new THREE.CanvasTexture(c);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(9,9);
  texture.anisotropy=2;
  return texture;
}

function waterMaterial(color){
  return new THREE.MeshStandardMaterial({
    color,
    roughness:.22,
    metalness:.04,
    transparent:true,
    opacity:.93,
    side:THREE.DoubleSide
  });
}

export function createTerrain(scene){
  const geometry=new THREE.PlaneGeometry(WORLD_SIZE,WORLD_SIZE,180,180);
  geometry.rotateX(-Math.PI/2);
  const positions=geometry.attributes.position;
  const colors=[];
  const meadow=new THREE.Color(0x78985b);
  const light=new THREE.Color(0xa4ae72);
  const earth=new THREE.Color(0x9a8966);

  for(let i=0;i<positions.count;i++){
    const x=positions.getX(i),z=positions.getZ(i);
    const h=terrainHeight(x,z);
    positions.setY(i,h);
    const variation=(Math.sin(x*.11)+Math.cos(z*.13))*.04;
    const color=meadow.clone().lerp(
      light,
      THREE.MathUtils.clamp(.36+h*.03+variation,0,.8)
    );
    if(h>5) color.lerp(earth,.18);
    if(Math.abs(z+25)<8) color.lerp(earth,.24);
    colors.push(color.r,color.g,color.b);
  }

  geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));
  geometry.computeVertexNormals();
  scene.add(new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({map:groundTexture(),vertexColors:true,roughness:1})
  ));

  // Río longitudinal este-oeste, con el lecho excavado bajo las orillas.
  const river=new THREE.Mesh(
    new THREE.PlaneGeometry(240,9.6,1,1),
    waterMaterial(0x347f91)
  );
  river.rotation.x=-Math.PI/2;
  river.position.set(0,-1.45,-25);
  scene.add(river);

  const bankMaterial=new THREE.MeshStandardMaterial({color:0x9c916b,roughness:1});
  for(const z of [-32.4,-17.6]){
    const bank=new THREE.Mesh(
      new THREE.BoxGeometry(240,.34,1.5),
      bankMaterial
    );
    bank.position.set(0,-.55,z);
    scene.add(bank);
  }

  const lakes=[];
  for(const lakeData of LAKES){
    const level=baseHeight(lakeData.x,lakeData.z)+lakeData.offset;

    // Superficie elíptica: evita el aspecto de una lámina rectangular flotante.
    const lake=new THREE.Mesh(
      new THREE.CircleGeometry(1,64),
      waterMaterial(0x3e8994)
    );
    lake.rotation.x=-Math.PI/2;
    lake.position.set(lakeData.x,level,lakeData.z);
    lake.scale.set(lakeData.rx*1.04,lakeData.rz*1.04,1);
    scene.add(lake);

    const shore=new THREE.Mesh(
      new THREE.RingGeometry(.9,1.16,64),
      new THREE.MeshStandardMaterial({
        color:0x9c936e,
        roughness:1,
        side:THREE.DoubleSide
      })
    );
    shore.rotation.x=-Math.PI/2;
    shore.position.set(lakeData.x,level-.08,lakeData.z);
    shore.scale.set(lakeData.rx,lakeData.rz,1);
    scene.add(shore);
    lakes.push(lake);
  }

  return {heightAt:terrainHeight,water:river,lakes};
}
