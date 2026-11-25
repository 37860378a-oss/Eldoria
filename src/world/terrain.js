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
  const c=document.createElement("canvas");c.width=c.height=512;
  const ctx=c.getContext("2d"),img=ctx.createImageData(512,512);let seed=9137;
  const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<img.data.length;i+=4){const s=Math.floor(rnd()*38);img.data[i]=79+s;img.data[i+1]=105+s;img.data[i+2]=57+Math.floor(s*.5);img.data[i+3]=255;}
  ctx.putImageData(img,0,0);
  for(let i=0;i<900;i++){const x=rnd()*512,y=rnd()*512,r=2+rnd()*18;ctx.fillStyle=rnd()>.5?"rgba(178,157,104,.17)":"rgba(31,77,39,.22)";ctx.beginPath();ctx.ellipse(x,y,r*1.8,r,rnd()*3,0,Math.PI*2);ctx.fill();}
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(7,7);texture.anisotropy=4;return texture;
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
  const ground=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({map:groundTexture(),vertexColors:true,roughness:1}));
  ground.receiveShadow=true;scene.add(ground);
  return {heightAt:terrainHeight,update(){}};
}
