import * as THREE from "three";
function roadTexture(){
 const c=document.createElement("canvas");c.width=c.height=256;const ctx=c.getContext("2d");ctx.fillStyle="#a88d62";ctx.fillRect(0,0,256,256);let seed=7241;
 const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<2200;i++){const v=Math.floor(105+rnd()*75),r=.5+rnd()*2.4;ctx.fillStyle="rgba("+v+","+Math.floor(v*.82)+","+Math.floor(v*.58)+","+(0.08+rnd()*.2)+")";ctx.beginPath();ctx.ellipse(rnd()*256,rnd()*256,r*1.7,r,rnd()*3,0,Math.PI*2);ctx.fill();}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,1);t.anisotropy=2;return t;
}
function ribbon(scene,heightAt,points,width,mat,lift=.2){
 const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,0,z)),false,"centripetal"),n=Math.max(48,points.length*20),v=[],uv=[],idx=[];
 for(let i=0;i<=n;i++){const t=i/n,p=curve.getPoint(t),tan=curve.getTangent(t).normalize(),side=new THREE.Vector3(-tan.z,0,tan.x).normalize();for(const sign of [-1,1]){const x=p.x+side.x*width*.5*sign,z=p.z+side.z*width*.5*sign;v.push(x,heightAt(x,z)+lift,z);uv.push(t*8,sign*.5+.5);}if(i<n){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}}
 const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(v,3));g.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();const mesh=new THREE.Mesh(g,mat);mesh.material.side=THREE.DoubleSide;mesh.renderOrder=2;scene.add(mesh);
}
export function createPaths(scene,heightAt){
 const road=new THREE.MeshStandardMaterial({map:roadTexture(),roughness:1,side:THREE.DoubleSide});
 ribbon(scene,heightAt,[[-49,2],[-44,-3],[-39,-6],[-33,-7],[-27,-6],[-22,-3],[-18,1],[-18,6],[-22,10],[-29,12],[-37,10],[-43,6]],4.2,road);
 ribbon(scene,heightAt,[[-18,-3],[-12,-7],[-7,-12],[-2,-17],[3,-22],[7,-27],[8,-32],[8,-36]],5.8,road,.22);
 // El puente cruza de norte a sur. Las dos aproximaciones llegan exactamente a sus extremos.
 ribbon(scene,heightAt,[[8,-16],[8,-19],[7,-23],[7,-27],[8,-32],[8,-36]],4.4,road,.82);
 ribbon(scene,heightAt,[[8,-36],[8,-40],[13,-44],[20,-48],[29,-52],[39,-55]],4.2,road,.2);
 ribbon(scene,heightAt,[[-18,6],[-12,10],[-7,15],[-1,19],[6,23],[14,27]],3.2,road,.18);
 ribbon(scene,heightAt,[[8,-16],[13,-20],[19,-24],[26,-28],[34,-31],[43,-34],[52,-36]],3.6,road,.18);
}