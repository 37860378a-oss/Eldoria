import * as THREE from "three";

function roadTexture(){
  const c=document.createElement("canvas");
  c.width=c.height=256;
  const ctx=c.getContext("2d");
  ctx.fillStyle="#a88d62";
  ctx.fillRect(0,0,256,256);
  let seed=7241;
  const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<2200;i++){
    const v=Math.floor(105+rnd()*75),r=.5+rnd()*2.4;
    ctx.fillStyle="rgba("+v+","+Math.floor(v*.82)+","+Math.floor(v*.58)+","+(0.08+rnd()*.2)+")";
    ctx.beginPath();
    ctx.ellipse(rnd()*256,rnd()*256,r*1.7,r,rnd()*3,0,Math.PI*2);
    ctx.fill();
  }
  const t=new THREE.CanvasTexture(c);
  t.colorSpace=THREE.SRGBColorSpace;
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.repeat.set(2,1);
  t.anisotropy=2;
  return t;
}

function smooth01(t){
  t=THREE.MathUtils.clamp(t,0,1);
  return t*t*(3-2*t);
}

function ribbon(scene,heightAt,points,width,material,options={}){
  const curve=new THREE.CatmullRomCurve3(
    points.map(([x,z])=>new THREE.Vector3(x,0,z)),
    false,
    "centripetal"
  );
  const segments=Math.max(48,points.length*20);
  const vertices=[],uv=[],indices=[];
  for(let i=0;i<=segments;i++){
    const t=i/segments;
    const p=curve.getPoint(t);
    const tangent=curve.getTangent(t).normalize();
    const side=new THREE.Vector3(-tangent.z,0,tangent.x).normalize();
    for(const sign of [-1,1]){
      const x=p.x+side.x*width*.5*sign;
      const z=p.z+side.z*width*.5*sign;
      let y=heightAt(x,z)+(options.lift??.2);
      if(options.ramp){
        const depression=4.25*Math.exp(-((z+25)**2)/43);
        y+=(.48+depression)*options.ramp(z);
      }
      vertices.push(x,y,z);
      uv.push(t*8,sign*.5+.5);
    }
    if(i<segments){
      const a=i*2;
      indices.push(a,a+1,a+2,a+1,a+3,a+2);
    }
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
  geometry.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,material);
  mesh.material.side=THREE.DoubleSide;
  mesh.renderOrder=2;
  scene.add(mesh);
}

const northBridgeRamp=z=>1-smooth01((z+17)/7);
const southBridgeRamp=z=>1-smooth01((-z-37)/7);

export function createPaths(scene,heightAt){
  const road=new THREE.MeshStandardMaterial({
    map:roadTexture(),
    roughness:1,
    side:THREE.DoubleSide
  });

  // Camino de la plaza y recorrido interior de Piedra Clara.
  ribbon(scene,heightAt,[
    [-49,2],[-44,-3],[-39,-6],[-33,-7],[-27,-6],
    [-22,-3],[-18,1],[-18,6],[-22,10],[-29,12],
    [-37,10],[-43,6]
  ],4.2,road);

  // Acceso norte: la elevación acompaña la pendiente del tablero.
  ribbon(scene,heightAt,[
    [-18,-3],[-12,-7],[-7,-10],[-2,-12],
    [3,-13],[7,-14],[9.2,-17]
  ],4.8,road,{ramp:northBridgeRamp});

  // Salida sur: baja gradualmente desde el extremo opuesto del puente.
  ribbon(scene,heightAt,[
    [8.2,-37],[8.2,-41],[12,-44],[19,-48],
    [28,-52],[38,-55],[48,-57]
  ],4.8,road,{ramp:southBridgeRamp});

  // Sendero de las colinas: conecta con el acceso norte a nivel del terreno.
  ribbon(scene,heightAt,[
    [5,-13],[10,-11],[17,-9],[25,-8],
    [34,-9],[43,-12],[51,-17]
  ],3.4,road);
}
