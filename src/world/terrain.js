import * as THREE from "three";

const WORLD_SIZE=550;
function smooth01(t){t=THREE.MathUtils.clamp(t,0,1);return t*t*(3-2*t);}
function plateau(x,z,cx,cz,radius,height,edge=5){const d=Math.hypot(x-cx,z-cz);return height*(1-smooth01((d-radius)/edge));}

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
export function terrainHeight(x,z){
  let h=baseHeight(x,z);
  return h;
}
function groundTexture(){
  const size=1024,c=document.createElement("canvas");c.width=c.height=size;
  const ctx=c.getContext("2d"),img=ctx.createImageData(size,size);let seed=9137;
  const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const i=(y*size+x)*4;
    const broad=Math.sin(x*.018+y*.011)*5+Math.cos(y*.023-x*.009)*4;
    const fine=(rnd()-.5)*27,grain=(rnd()-.5)*13;
    img.data[i]=Math.max(0,Math.min(255,91+broad+fine+grain));
    img.data[i+1]=Math.max(0,Math.min(255,116+broad+fine+grain));
    img.data[i+2]=Math.max(0,Math.min(255,66+broad*.55+fine*.48+grain*.5));
    img.data[i+3]=255;
  }
  ctx.putImageData(img,0,0);
  // Manchas de tierra, hierba corta y pequeñas variaciones orgánicas.
  for(let i=0;i<5200;i++){
    const x=rnd()*size,y=rnd()*size,r=1+rnd()*10;
    const dark=rnd()>.52;
    ctx.fillStyle=dark?"rgba(37,67,34,.19)":"rgba(183,164,111,.20)";
    ctx.beginPath();ctx.ellipse(x,y,r*(1.1+rnd()*1.8),r*.55,rnd()*Math.PI,0,Math.PI*2);ctx.fill();
  }
  for(let i=0;i<2600;i++){
    const x=rnd()*size,y=rnd()*size;
    ctx.fillStyle=rnd()>.5?"rgba(29,54,28,.20)":"rgba(208,190,135,.16)";
    ctx.fillRect(x,y,1+rnd()*2,1+rnd()*2);
  }
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(11,11);
  texture.anisotropy=8;texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps=true;return texture;
}
export function createTerrain(scene){
  const geometry=new THREE.PlaneGeometry(WORLD_SIZE,WORLD_SIZE,420,420);geometry.rotateX(-Math.PI/2);
  const positions=geometry.attributes.position,colors=[];
  const meadow=new THREE.Color(0x78985b),light=new THREE.Color(0xa4ae72),earth=new THREE.Color(0x9a8966);
  for(let i=0;i<positions.count;i++){
    const x=positions.getX(i),z=positions.getZ(i),h=terrainHeight(x,z);
    positions.setY(i,h);
    const variation=(Math.sin(x*.11)+Math.cos(z*.13))*.035;
    const color=meadow.clone().lerp(light,THREE.MathUtils.clamp(.34+h*.028+variation,0,.8));
    if(h>5)color.lerp(earth,.2);
    colors.push(color.r,color.g,color.b);
  }
  geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();
  const surfaceTexture=groundTexture();
  const ground=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({map:surfaceTexture,vertexColors:true,roughness:1,bumpMap:surfaceTexture,bumpScale:.075}));
  ground.receiveShadow=true;scene.add(ground);
  return {heightAt:terrainHeight,update(){}};
}
