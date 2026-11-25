import * as THREE from "three";

// Edificios modulares de Piedra Clara. Geometría sencilla y materiales compartidos
// para conservar un coste bajo en equipos modestos.
const stone = new THREE.MeshStandardMaterial({ color: 0x817d70, roughness: 1, flatShading: true });
const plaster = new THREE.MeshStandardMaterial({ color: 0xc8b58c, roughness: 1 });
const timber = new THREE.MeshStandardMaterial({ color: 0x59412d, roughness: 1 });
const darkWood = new THREE.MeshStandardMaterial({ color: 0x382b20, roughness: 1 });
const roofMats = [
  new THREE.MeshStandardMaterial({ color: 0x765044, roughness: 1, flatShading: true }),
  new THREE.MeshStandardMaterial({ color: 0x806044, roughness: 1, flatShading: true }),
  new THREE.MeshStandardMaterial({ color: 0x625044, roughness: 1, flatShading: true })
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
}
function addRoof(parent,w,d,eave,ridge,material) {
  const angle=Math.atan2(ridge-eave,w/2);
  const length=Math.hypot(w/2,ridge-eave)+.45;
  for(const side of [-1,1]) {
    const slab=box(parent,material,side*w*.25,(ridge+eave)/2,d/2,
      length,.24,d+.7,0,0,side*angle);
    slab.castShadow=true;
  }
  // Cumbrera de madera y aleros.
  box(parent,timber,0,ridge+.08,d/2,w*.13,.18,d+.9);
}
function addDoor(parent,w,wallY,frontZ) {
  // Marco y puerta abierta: el hueco permite ver el mobiliario interior.
  box(parent,timber,-.66,wallY*.52,frontZ,.16,wallY*.96,.22);
  box(parent,timber,.66,wallY*.52,frontZ,.16,wallY*.96,.22);
  box(parent,timber,0,wallY+.02,frontZ,1.48,.18,.22);
  const door=box(parent,darkWood,-.53,wallY*.48,frontZ-.15,.92,wallY*.88,.12);
  door.rotation.y=-.82;
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
  g.rotation.y=rotation;
  g.position.set(x,heightAt(x,z),z);
  g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  scene.add(g);
  return g;
}
const crateMaterial=new THREE.MeshStandardMaterial({color:0x987247,roughness:1});

export function createVillageBuildings(scene,heightAt) {
  // Anillo exterior de la plaza: deja libre el pozo y el eje de circulación.
  buildHouse(scene,heightAt,{x:-53,z:-4,w:8.5,d:7.5,h:4.1,roof:0,rotation:.12,type:"home"});
  buildHouse(scene,heightAt,{x:-3,z:3,w:8,d:7,h:4.5,roof:1,rotation:-.16,type:"blacksmith"});
  buildHouse(scene,heightAt,{x:-53,z:34,w:9,d:7.8,h:4.2,roof:2,rotation:.08,type:"store"});
}
