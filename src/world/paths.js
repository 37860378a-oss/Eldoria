import * as THREE from "three";

function roadTexture(){
  const c=document.createElement("canvas");c.width=c.height=512;
  const ctx=c.getContext("2d");ctx.fillStyle="#9c835d";ctx.fillRect(0,0,512,512);
  let seed=7241;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<5200;i++){
    const v=Math.floor(88+rnd()*88),r=.4+rnd()*3.4;
    ctx.fillStyle="rgba("+v+","+Math.floor(v*.82)+","+Math.floor(v*.58)+","+(0.06+rnd()*.2)+")";
    ctx.beginPath();ctx.ellipse(rnd()*512,rnd()*512,r*1.8,r,rnd()*3,0,Math.PI*2);ctx.fill();
  }
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,1);t.anisotropy=4;return t;
}
function smooth(t){t=THREE.MathUtils.clamp(t,0,1);return t*t*(3-2*t);}
function ribbon(scene,heightAt,points,width,material,options={}){
  const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,0,z)),false,"centripetal");
  const segments=Math.max(90,points.length*30),vertices=[],uv=[],indices=[],colors=[];
  const bands=[-1.45,-1.12,-1,-.88,.88,1,1.12,1.45];
  const grass=new THREE.Color(0x78985b),dust=new THREE.Color(0x9b835e);
  for(let i=0;i<=segments;i++){
    const t=i/segments,p=curve.getPoint(t),tangent=curve.getTangent(t).normalize();
    const side=new THREE.Vector3(-tangent.z,0,tangent.x).normalize();
    for(let j=0;j<bands.length;j++){
      const f=bands[j],x=p.x+side.x*width*.5*f,z=p.z+side.z*width*.5*f;
      const edge=Math.abs(f),blend=smooth((edge-.88)/.57);
      let y=heightAt(x,z)+.045+(options.ramp?(.48+4.25*Math.exp(-((z+25)**2)/43))*options.ramp(z):0);
      y+=Math.sin(i*.31+j*.7)*.006;
      vertices.push(x,y,z);uv.push(t*12,j/(bands.length-1));
      const color=dust.clone().lerp(grass,blend);colors.push(color.r,color.g,color.b);
      if(i<segments&&j<bands.length-1){const a=i*bands.length+j;indices.push(a,a+1,a+bands.length,a+1,a+bands.length+1,a+bands.length);}
    }
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
  geometry.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,material);mesh.material.side=THREE.DoubleSide;mesh.receiveShadow=true;scene.add(mesh);
}
const northBridgeRamp=()=>0;
export function createPaths(scene,heightAt){
  const road=new THREE.MeshStandardMaterial({map:roadTexture(),vertexColors:true,roughness:1,side:THREE.DoubleSide});
  ribbon(scene,heightAt,[[-49,2],[-44,-3],[-39,-6],[-33,-7],[-27,-6],[-22,-3],[-18,1],[-18,6],[-22,10],[-29,12],[-37,10],[-43,6],[-49,2]],4.2,road);
  ribbon(scene,heightAt,[[-18,-3],[-12,-7],[-7,-10],[-2,-12],[3,-13],[7,-14],[8.2,-16.8]],4.8,road);
}
