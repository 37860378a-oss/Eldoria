import * as THREE from "three";

// Materiales procedurales compartidos: detalle visible sin descargar imágenes externas.
function surfaceTexture(seed,kind){
  const size=512,canvas=document.createElement("canvas");canvas.width=canvas.height=size;
  const ctx=canvas.getContext("2d");ctx.fillStyle="#c4c4c4";ctx.fillRect(0,0,size,size);
  let value=seed>>>0;
  const rnd=()=>{value=(value*1664525+1013904223)>>>0;return value/4294967296;};
  for(let i=0;i<12500;i++){
    const v=Math.floor(166+rnd()*78),alpha=.08+rnd()*.22;
    ctx.fillStyle="rgba("+v+","+v+","+v+","+alpha+")";
    const x=rnd()*size,y=rnd()*size;
    if(kind==="wood"){
      ctx.fillRect(x,y,2+rnd()*35,.5+rnd()*1.8);
    }else if(kind==="roof"){
      ctx.fillRect(x,y,8+rnd()*18,2+rnd()*4);
    }else{
      const r=.5+rnd()*(kind==="stone"?5:2.5);
      ctx.beginPath();ctx.ellipse(x,y,r*1.4,r,rnd()*3,0,Math.PI*2);ctx.fill();
    }
  }
  if(kind==="wood"){
    for(let y=24;y<size;y+=48){ctx.strokeStyle="rgba(90,90,90,.18)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(150,y-5,330,y+5,size,y);ctx.stroke();}
  }
  if(kind==="roof"){
    for(let y=0;y<size;y+=34){ctx.strokeStyle="rgba(70,70,70,.25)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(size,y);ctx.stroke();}
  }
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(1.5,1.5);
  texture.anisotropy=8;texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps=true;return texture;
}
const stoneTexture=surfaceTexture(1201,"stone");
const plasterTexture=surfaceTexture(2203,"plaster");
const timberTexture=surfaceTexture(3307,"wood");
const roofTexture=surfaceTexture(4409,"roof");
const stone = new THREE.MeshStandardMaterial({ color: 0x817d70, map:stoneTexture, bumpMap:stoneTexture, bumpScale:.018, roughness:1, flatShading:true });
const plaster = new THREE.MeshStandardMaterial({ color: 0xc8b58c, map:plasterTexture, bumpMap:plasterTexture, bumpScale:.012, roughness:1 });
const timber = new THREE.MeshStandardMaterial({ color: 0x59412d, map:timberTexture, bumpMap:timberTexture, bumpScale:.016, roughness:1 });
const darkWood = new THREE.MeshStandardMaterial({ color: 0x382b20, map:timberTexture, bumpMap:timberTexture, bumpScale:.014, roughness:1 });
const roofMats = [
  new THREE.MeshStandardMaterial({ color: 0x765044, map:roofTexture, bumpMap:roofTexture, bumpScale:.018, roughness:1, flatShading:true }),
  new THREE.MeshStandardMaterial({ color: 0x806044, map:roofTexture, bumpMap:roofTexture, bumpScale:.06, roughness:1, flatShading:true }),
  new THREE.MeshStandardMaterial({ color: 0x625044, map:roofTexture, bumpMap:roofTexture, bumpScale:.06, roughness:1, flatShading:true })
];
const glass = new THREE.MeshStandardMaterial({ color: 0xe6b968, emissive: 0x9a642b, emissiveIntensity: 0.38 });
const interior = new THREE.MeshStandardMaterial({ color: 0x49372a, roughness: 1 });
const iron = new THREE.MeshStandardMaterial({ color: 0x343a39, metalness: .35, roughness: .8 });
const forgeGlow = new THREE.MeshStandardMaterial({ color: 0xff8738, emissive: 0xff4b0a, emissiveIntensity: 1.15 });

function mesh(parent, geometry, material, x, y, z, rx=0, ry=0, rz=0) {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(x,y,z); m.rotation.set(rx,ry,rz);
  m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
}
function box(parent, material, x,y,z,w,h,d,rx=0,ry=0,rz=0) {
  return mesh(parent,new THREE.BoxGeometry(w,h,d),material,x,y,z,rx,ry,rz);
}
function gable(parent, w, h, z, material) {
  const shape = new THREE.Shape();
  shape.moveTo(-w/2,0); shape.lineTo(w/2,0); shape.lineTo(0,h); shape.closePath();
  const geo = new THREE.ShapeGeometry(shape);
  const m = mesh(parent,geo,material,0,0,z);
  m.material.side = THREE.DoubleSide;
  return m;
}
function addRoof(parent,w,d,eave,ridge,material) {
  const angle=Math.atan2(ridge-eave,w/2);
  const length=Math.hypot(w/2,ridge-eave)+.45;
  for(const side of [-1,1]) {
    const slab=box(parent,material,side*w*.25,(ridge+eave)/2,0,
      length,.24,d+.7,0,0,side*angle);
    slab.castShadow=true;
  }
  // Cumbrera de madera y aleros.
  box(parent,timber,0,ridge+.08,0,w*.13,.18,d+.9);
}
function addDoor(parent,w,wallY,frontZ) {
  // Marco de altura humana y hoja entreabierta: el interior queda visible.
  const doorH=2.35;
  box(parent,timber,-.66,doorH/2,frontZ,.16,doorH,.22);
  box(parent,timber,.66,doorH/2,frontZ,.16,doorH,.22);
  box(parent,timber,0,doorH+.08,frontZ,1.48,.18,.22);
  const hinge = new THREE.Group();
  hinge.position.set(-.46, 0, frontZ - .15);
  parent.add(hinge);
  box(hinge,darkWood,.46,doorH/2,0,.92,doorH-.12,.12);
  hinge.rotation.y = -0.82;
}

function addTorch(parent,x,y,z) {
  const mount = new THREE.Group();
  mount.position.set(x,y,z);
  parent.add(mount);
  mesh(mount,new THREE.CylinderGeometry(.045,.055,.48,6),iron,0,-.08,-.08,Math.PI/2,0,0);
  mesh(mount,new THREE.CylinderGeometry(.12,.16,.22,7),darkWood,0,.12,0);
  const flame = mesh(mount,new THREE.ConeGeometry(.13,.42,6),new THREE.MeshBasicMaterial({color:0xffa33f}),0,.43,0);
  const glow = new THREE.PointLight(0xffa45a,1.25,9,2);
  glow.position.set(0,.45,.12); mount.add(glow);
  return {flame,glow,phase:x*1.7+z};
}

function buildHouse(scene,heightAt,{x,z,w=8,d=7,h=4.2,roof=0,rotation=0,type="home"}) {
  const g=new THREE.Group(), front=d/2;
  // Cimientos, suelo y paredes segmentadas: fachada con acceso abierto.
  box(g,stone,0,.24,0,w+.55,.48,d+.55);
  box(g,interior,0,.51,0,w-.35,.08,d-.35);
  box(g,plaster,-w/2+.16,.5+h/2,0,.32,h,d);
  box(g,plaster,w/2-.16,.5+h/2,0,.32,h,d);
  box(g,plaster,0,.5+h/2,-d/2+.16,w,h,.32);
  box(g,plaster,-w*.32,.5+h/2,front-.16,w*.36,h,.32);
  box(g,plaster,w*.32,.5+h/2,front-.16,w*.36,h,.32);
  // Vigas esquineras y travesaño superior.
  for(const sx of [-1,1]) for(const sz of [-1,1])
    box(g,timber,sx*(w/2-.24),.5+h/2,sz*(d/2-.24),.22,h+.12,.22);
  box(g,timber,0,.5+h-.08,front-.12,w,.22,.22);
  // Frontones triangulares.
  gable(g,w,.5+h*.25,-d/2+.16,plaster);
  const backGable=gable(g,w,.5+h*.25,d/2-.16,plaster); backGable.rotation.y=Math.PI;
  addRoof(g,w,d,.5+h,.5+h+h*.25,roofMats[roof%roofMats.length]);
  addDoor(g,w,.5+h,front+.05);
  // Ventanas laterales con contraventanas.
  for(const side of [-1,1]) {
    const wx=side*(w/2+.015);
    box(g,glass,wx,.5+h*.58,-.55,.08,1.05,1.15);
    box(g,timber,wx+side*.07,.5+h*.58,-1.18,.12,1.22,.12);
    box(g,timber,wx+side*.07,.5+h*.58,.08,.12,1.22,.12);
    box(g,timber,wx+side*.07,.5+h*.58,-.55,.12,.12,1.3);
  }
  // Interior visible desde la entrada.
  box(g,timber,-1.55,.88,-1.15,2.2,.16,1.25);
  box(g,interior,-1.55,1.28,-1.15,1.8,.65,.95);
  box(g,timber,1.55,.95,-1.05,1.3,.12,.75);
  for(const sx of [-.48,.48]) box(g,timber,1.55+sx,.68,-1.05,.1,.55,.1);
  if(type==="blacksmith") {
    // Horno y brasa junto al lateral, con yunque reconocible en el umbral.
    box(g,stone,2.05,1.05,-1.8,1.25,1.45,1.2);
    box(g,forgeGlow,2.05,1.05,-1.16,.72,.42,.08);
    mesh(g,new THREE.CylinderGeometry(.34,.42,.52,6),iron,-.15,.83,1.1,0,0,Math.PI/2);
    box(g,iron,-.15,1.14,1.1,.9,.16,.48);
    // Chimenea exterior.
    box(g,stone,2.5,h+1.1,-1.55,.9,2.5,.9);
  } else if(type==="store") {
    // Estanterías y sacos visibles a través de la puerta.
    for(const yy of [1.15,2.15,3.05]) {
      box(g,timber,2.1,yy,-1.6,1.65,.13,.55);
      for(const xx of [1.55,2.1,2.65]) mesh(g,new THREE.BoxGeometry(.34,.42,.34),crateMaterial,xx,yy+.27,-1.6);
    }
  }
  // Umbral pétreo y dos peldaños.
  box(g,stone,0,.32,front+.52,2.2,.3,.8);
  box(g,stone,0,.17,front+.95,2.4,.22,.48);
  const torches = [addTorch(g,-w*.32,2.75,front-.38), addTorch(g,w*.32,2.75,front-.38)];
  g.rotation.y=rotation;
  g.position.set(x,heightAt(x,z),z);
  g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  scene.add(g);
  return {group:g, torches};
}
const crateMaterial=new THREE.MeshStandardMaterial({color:0x987247,roughness:1});

export function createVillageBuildings(scene,heightAt) {
  // Anillo exterior de la plaza: deja libre el pozo y el eje de circulación.
  const buildings = [
    buildHouse(scene,heightAt,{x:-53,z:-4,w:8.5,d:7.5,h:4.1,roof:0,rotation:.12,type:"home"}),
    buildHouse(scene,heightAt,{x:-3,z:3,w:8,d:7,h:4.5,roof:1,rotation:-.16,type:"blacksmith"}),
    buildHouse(scene,heightAt,{x:-53,z:34,w:9,d:7.8,h:4.2,roof:2,rotation:.08,type:"store"})
  ];
  return {update(time) {
    for (const building of buildings) for (const torch of building.torches) {
      const flicker = .92 + Math.sin(time*8+torch.phase)*.08 + Math.sin(time*13+torch.phase)*.035;
      torch.flame.scale.set(1,flicker,1);
      torch.glow.intensity = 1.1 + flicker*.25;
    }
  }};
}
