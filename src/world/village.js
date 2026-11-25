import * as THREE from "three";

const mats = {
  plaster: new THREE.MeshStandardMaterial({ color: 0xd1bd91, roughness: 1 }),
  timber: new THREE.MeshStandardMaterial({ color: 0x59432f, roughness: 1 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x342c23, roughness: 1 }),
  roof: [0x765044, 0x8b6247, 0x6e5140].map(color => new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true })),
  stone: new THREE.MeshStandardMaterial({ color: 0x888477, roughness: 1, flatShading: true }),
  window: new THREE.MeshStandardMaterial({ color: 0xe8bd69, emissive: 0x8c5724, emissiveIntensity: 0.22 }),
  fence: new THREE.MeshStandardMaterial({ color: 0x765b3c, roughness: 1 })
};

function block(parent, w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

function makeHouse(scene, x, z, width, depth, height, heightAt, variant, rotation = 0) {
  const group = new THREE.Group();
  block(group, width + 0.55, 0.42, depth + 0.55, mats.stone, 0, 0.21, 0);
  block(group, width, height, depth, mats.plaster, 0, height / 2 + 0.42, 0);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(width, depth) * 0.77, height * 0.7, 4), mats.roof[variant % mats.roof.length]);
  roof.position.y = height + height * 0.33 + 0.42;
  roof.rotation.y = Math.PI / 4;
  roof.scale.z = depth / width;
  group.add(roof);

  const front = depth / 2 + 0.07;
  block(group, width * 0.17, height * 0.53, 0.14, mats.dark, 0, height * 0.265 + 0.42, front + 0.04);
  for (const side of [-1, 1]) {
    const wx = side * width * 0.29;
    block(group, width * 0.18, height * 0.25, 0.1, mats.window, wx, height * 0.62 + 0.42, front + 0.05);
    block(group, 0.12, height * 0.31, 0.13, mats.dark, wx - width * 0.12, height * 0.62 + 0.42, front + 0.09);
    block(group, 0.12, height * 0.31, 0.13, mats.dark, wx + width * 0.12, height * 0.62 + 0.42, front + 0.09);
  }
  block(group, width * 0.43, 0.16, 1.05, mats.timber, 0, height * 0.61 + 0.42, front + 0.42);
  for (const side of [-1, 1]) {
    block(group, 0.14, height * 0.6, 0.14, mats.timber, side * width * 0.2, height * 0.3 + 0.42, front + 0.8);
    block(group, 0.16, height * 0.88, 0.16, mats.timber, side * width * 0.44, height * 0.46 + 0.42, front);
  }
  block(group, width * 0.92, 0.18, 0.16, mats.timber, 0, height * 0.84 + 0.42, front);
  if (variant % 2 === 0) {
    block(group, 0.62, 1.85, 0.62, mats.stone, width * 0.25, height + 0.88, -depth * 0.18);
  }

  group.rotation.y = rotation;
  group.position.set(x, heightAt(x, z), z);
  scene.add(group);
}

function addFence(scene, heightAt, x, z, w, d, openingSide = "south") {
  const group = new THREE.Group();
  const postGeo = new THREE.BoxGeometry(0.22, 1.05, 0.22);
  const railX = new THREE.BoxGeometry(w, 0.13, 0.13);
  const railZ = new THREE.BoxGeometry(0.13, 0.13, d);
  const post = (px, pz) => {
    const m = new THREE.Mesh(postGeo, mats.fence);
    m.position.set(px, 0.52, pz); group.add(m);
  };
  const rail = (geo, px, pz) => {
    const m = new THREE.Mesh(geo, mats.fence);
    m.position.set(px, 0.42, pz); group.add(m);
  };
  const halfW = w / 2, halfD = d / 2;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) post(sx * halfW, sz * halfD);
  rail(railZ, -halfW, 0); rail(railZ, halfW, 0);
  if (openingSide === "south") {
    rail(new THREE.BoxGeometry(w * 0.35, 0.13, 0.13), -w * 0.325, halfD);
    rail(new THREE.BoxGeometry(w * 0.35, 0.13, 0.13), w * 0.325, halfD);
  } else rail(railX, 0, halfD);
  rail(railX, 0, -halfD);
  group.position.set(x, heightAt(x, z), z);
  scene.add(group);
}

function createWatchBridge(scene, heightAt) {
  // Puente romano-medieval de mampostería: arco único, tablero de dovelas
  // y pretiles gemelos. Cada tramo sigue exactamente la misma curva.
  const startZ=-37.2,endZ=-16.8,centerX=8.2,halfWidth=4.1;
  const archHeight=3.65,segments=34;
  const stoneA=new THREE.MeshStandardMaterial({color:0x77796f,roughness:.96,flatShading:true});
  const stoneB=new THREE.MeshStandardMaterial({color:0x918d80,roughness:.98,flatShading:true});
  const capMat=new THREE.MeshStandardMaterial({color:0xa19b8b,roughness:.94,flatShading:true});
  const deckY=(t,x)=>heightAt(x,startZ+(endZ-startZ)*t)+.48+archHeight*Math.sin(Math.PI*t);
  // Dovelas anchas a lo largo de todo el tablero; las juntas hacen visible la piedra.
  for(let i=0;i<segments;i++){
    const t=(i+.5)/segments,z=startZ+(endZ-startZ)*t;
    const slope=(deckY(Math.min(1,t+.002),centerX)-deckY(Math.max(0,t-.002),centerX))/
      ((endZ-startZ)*.004);
    const slab=new THREE.Mesh(new THREE.BoxGeometry(8.15,.58,(endZ-startZ)/segments+.055),i%3===0?stoneB:stoneA);
    slab.position.set(centerX,deckY(t,centerX)-.27,z);
    slab.rotation.x=-Math.atan(slope);
    slab.castShadow=true;slab.receiveShadow=true;scene.add(slab);
  }
  // Pretiles de piedra idénticos a ambos lados, con bloques y albardilla.
  for(const side of [-1,1]){
    for(let i=0;i<segments;i++){
      const t=(i+.5)/segments,z=startZ+(endZ-startZ)*t;
      const x=centerX+side*3.78,y=deckY(t,x);
      const block=new THREE.Mesh(new THREE.BoxGeometry(.62,1.05,(endZ-startZ)/segments+.04),i%4===0?stoneB:stoneA);
      block.position.set(x,y+.34,z);
      const slope=(deckY(Math.min(1,t+.002),x)-deckY(Math.max(0,t-.002),x))/((endZ-startZ)*.004);
      block.rotation.x=-Math.atan(slope);block.castShadow=true;block.receiveShadow=true;scene.add(block);
      const cap=new THREE.Mesh(new THREE.BoxGeometry(.78,.2,(endZ-startZ)/segments+.08),capMat);
      cap.position.set(x,y+.96,z);cap.rotation.x=-Math.atan(slope);cap.castShadow=true;scene.add(cap);
    }
  }
  // Entradas ensanchadas y simétricas, asentadas en el camino.
  for(const z of [startZ+.42,endZ-.42]){
    const t=(z-startZ)/(endZ-startZ),landing=new THREE.Mesh(new THREE.BoxGeometry(8.7,.5,1.15),stoneB);
    landing.position.set(centerX,deckY(t,centerX)-.22,z);landing.castShadow=true;landing.receiveShadow=true;scene.add(landing);
  }
}

function createRiverDock(scene,heightAt) {
  // Muelle de madera sobre la orilla norte, perpendicular al cauce.
  const wood=new THREE.MeshStandardMaterial({color:0x705238,roughness:1});
  const wornWood=new THREE.MeshStandardMaterial({color:0x92704a,roughness:1});
  const iron=new THREE.MeshStandardMaterial({color:0x343b38,metalness:.25,roughness:.8});
  const stoneStep=new THREE.MeshStandardMaterial({color:0x888477,roughness:1,flatShading:true});
  const x=-12,shoreZ=-17.2,endZ=-24.1,waterY=-2.85;
  const shoreY=heightAt(x,shoreZ)+.12;
  const deckY=t=>shoreY+(waterY+.3-shoreY)*t;
  // Dos largueros inferiores siguen la ligera pendiente del muelle.
  for(const side of [-1,1]){
    const rail=new THREE.Mesh(new THREE.BoxGeometry(.22,.28,7.15),wood);
    rail.position.set(x+side*1.72,(shoreY+waterY+.3)*.5-.22,(shoreZ+endZ)*.5);
    rail.rotation.x=-Math.atan2(waterY+.3-shoreY,endZ-shoreZ);scene.add(rail);
  }
  // Tablones transversales con pequeñas separaciones.
  for(let i=0;i<18;i++){
    const t=i/17,z=shoreZ+(endZ-shoreZ)*t,y=deckY(t);
    const plank=new THREE.Mesh(new THREE.BoxGeometry(4.05,.2,.34),i%4===0?wornWood:wood);
    plank.position.set(x,y,z);plank.rotation.x=-Math.atan2(waterY+.3-shoreY,endZ-shoreZ);
    plank.castShadow=true;plank.receiveShadow=true;scene.add(plank);
  }
  // Pilotes de apoyo, visibles bajo la plataforma.
  for(const px of [-1.72,1.72]) for(const t of [.48,.78,1]){
    const z=shoreZ+(endZ-shoreZ)*t,y=deckY(t)-1.35;
    const post=new THREE.Mesh(new THREE.CylinderGeometry(.16,.22,2.7,7),wood);
    post.position.set(x+px,y,z);post.rotation.z=(px<0?-.025:.025);post.castShadow=true;scene.add(post);
    const collar=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.14,7),iron);
    collar.position.set(x+px,deckY(t)-.05,z);scene.add(collar);
  }
  // Bolardos gemelos y una escalera corta que baja al agua.
  for(const px of [-1.72,1.72]){
    const bollard=new THREE.Mesh(new THREE.CylinderGeometry(.13,.17,.85,7),wornWood);
    bollard.position.set(x+px,deckY(1)+.5,endZ);scene.add(bollard);
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,.12,7),wood);
    cap.position.set(x+px,deckY(1)+.94,endZ);scene.add(cap);
  }
  for(let i=0;i<4;i++){
    const step=new THREE.Mesh(new THREE.BoxGeometry(1.5,.16,.42),stoneStep);
    step.position.set(x,shoreY-.12-i*.2,shoreZ-.55-i*.42);scene.add(step);
  }
}
function createWatchKeep(scene, heightAt) {
  // Un solo edificio: casa de guardia de piedra con torre integrada en una esquina.
  const group = new THREE.Group();
  const stone = new THREE.MeshStandardMaterial({ color: 0x77766d, roughness: .96, flatShading: true });
  const paleStone = new THREE.MeshStandardMaterial({ color: 0x9a9582, roughness: .95, flatShading: true });
  const timber = new THREE.MeshStandardMaterial({ color: 0x493629, roughness: 1 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x59463a, roughness: 1, flatShading: true });
  const iron = new THREE.MeshStandardMaterial({ color: 0x343b38, metalness: .35, roughness: .72 });
  const windowMat = new THREE.MeshStandardMaterial({ color: 0xd8a85f, emissive: 0x6b3d16, emissiveIntensity: .35 });
  const add = (geo, mat, x, y, z, sx=1, sy=1, sz=1) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x,y,z); m.scale.set(sx,sy,sz); group.add(m); return m;
  };
  // Cuerpo principal de la casa de guardia.
  add(new THREE.BoxGeometry(8.2,.55,7.1),stone,0,.28,0);
  add(new THREE.BoxGeometry(7.5,4.25,6.4),paleStone,0,2.65,0);
  add(new THREE.BoxGeometry(8.15,.22,6.95),timber,0,4.82,0);
  const roof = add(new THREE.ConeGeometry(5.35,2.6,4),roofMat,0,6.05,0);
  roof.rotation.y=Math.PI/4;
  // Puerta y dintel orientados hacia el camino, al sur.
  add(new THREE.BoxGeometry(1.35,2.45,.22),timber,0,1.52,3.27);
  add(new THREE.BoxGeometry(1.05,2.12,.12),iron,0,1.48,3.4);
  add(new THREE.BoxGeometry(1.8,.28,.42),stone,0,2.83,3.28);
  add(new THREE.SphereGeometry(.09,8,6),windowMat,.38,1.48,3.49);
  for(const x of [-2.35,2.35]){
    add(new THREE.BoxGeometry(.72,1.12,.16),windowMat,x,3.05,3.27);
    add(new THREE.BoxGeometry(.12,1.35,.2),timber,x,3.05,3.36);
    add(new THREE.BoxGeometry(.85,.12,.2),timber,x,3.05,3.36);
  }
  // Torre octogonal integrada en la esquina posterior izquierda.
  const tx=-3.05,tz=-2.05;
  add(new THREE.CylinderGeometry(1.72,2.05,9.2,8),stone,tx,5.05,tz);
  add(new THREE.CylinderGeometry(2.18,2.18,.48,8),paleStone,tx,9.72,tz);
  add(new THREE.CylinderGeometry(1.92,2.12,1.35,8),roofMat,tx,10.55,tz);
  // Almenas alrededor de la plataforma superior.
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4, x=tx+Math.cos(a)*1.92, z=tz+Math.sin(a)*1.92;
    const merlon=add(new THREE.BoxGeometry(.52,.82,.48),paleStone,x,10.72,z);
    merlon.rotation.y=a;
  }
  // Ventanas estrechas de vigilancia.
  for(const y of [4.4,7.2]){
    for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
      const x=tx+Math.cos(a)*1.78,z=tz+Math.sin(a)*1.78;
      const slit=add(new THREE.BoxGeometry(.18,.82,.12),iron,x,y,z);
      slit.rotation.y=a;
    }
  }
  // Bandera discreta sobre la torre.
  const pole=add(new THREE.CylinderGeometry(.045,.055,2.4,6),timber,tx,12.35,tz);
  const flag=add(new THREE.BoxGeometry(1.15,.62,.055),new THREE.MeshStandardMaterial({color:0x8c493b,roughness:1,side:THREE.DoubleSide}),tx+.55,12.72,tz);
  flag.rotation.y=-.12;
  group.position.set(-25,heightAt(-25,-8),-8);
  group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  scene.add(group);
}

export function createVillage(scene, heightAt) {
  // Las viviendas y sus cercos fueron retirados para abrir el valle.

  const plaza = new THREE.Mesh(new THREE.CircleGeometry(8.2, 32), mats.stone);
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(-29, heightAt(-29, 1) + 0.18, 1);
  scene.add(plaza);

  const well = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.4, 0.9, 8), mats.stone);
  base.position.y = 0.55; well.add(base);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.75, 1.25, 4), mats.roof[0]);
  roof.position.y = 2.0; roof.rotation.y = Math.PI / 4; well.add(roof);
  block(well, 0.14, 1.5, 0.14, mats.timber, -1.15, 1.25, 0);
  block(well, 0.14, 1.5, 0.14, mats.timber, 1.15, 1.25, 0);
  block(well, 2.45, 0.14, 0.14, mats.timber, 0, 2.65, 0);
  well.position.set(-29, heightAt(-29, 1) + 0.28, 1);
  scene.add(well);

  createWatchKeep(scene, heightAt);
  createWatchBridge(scene, heightAt);
  createRiverDock(scene, heightAt);
}
