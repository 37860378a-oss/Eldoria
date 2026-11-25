import * as THREE from "three";

// Generador común de superficies ilustradas. Las formas grandes se leen desde
// la cámara de juego; los trazos pequeños solo aportan riqueza al acercarse.
const PALETTES = {
  grass: ["#718d4d","#8fa65e","#a8b66c","#526f3e","#c0b879","#647e48"],
  earth: ["#98784f","#b49363","#c4a477","#806344","#d1b184","#a58459"],
  stone: ["#77766c","#969183","#b6ad98","#5e625b","#c9bea5","#858477"],
  plaster: ["#c4ad80","#ddc79a","#ead6ad","#a88e68","#f0dfba","#c8b58e"],
  wood: ["#795438","#966b43","#b48654","#543c2c","#c69a61","#8a6040"],
  roof: ["#855244","#a7654e","#bd8060","#603d36","#d1936d","#95604c"]
};

function seeded(seed) {
  let value = seed >>> 0;
  return () => { value = (value * 1664525 + 1013904223) >>> 0; return value / 4294967296; };
}

function paintBrush(ctx, rnd, colors, count, minW, maxW, minH, maxH, alphaMin=.18, alphaMax=.42) {
  for (let i=0;i<count;i++) {
    const x=rnd()*1024, y=rnd()*1024, w=minW+rnd()*(maxW-minW), h=minH+rnd()*(maxH-minH);
    ctx.save(); ctx.translate(x,y); ctx.rotate((rnd()-.5)*.85);
    ctx.globalAlpha=alphaMin+rnd()*(alphaMax-alphaMin);
    ctx.fillStyle=colors[Math.floor(rnd()*colors.length)];
    ctx.beginPath();
    ctx.moveTo(-w*.52,-h*.18);
    ctx.quadraticCurveTo(-w*.25,-h*.65,w*.12,-h*.42);
    ctx.quadraticCurveTo(w*.62,-h*.28,w*.48,h*.12);
    ctx.quadraticCurveTo(w*.18,h*.55,-w*.2,h*.34);
    ctx.quadraticCurveTo(-w*.58,h*.2,-w*.52,-h*.18);
    ctx.fill();
    ctx.restore();
  }
}

function drawStone(ctx, rnd, p) {
  const cols=8, rows=9, bw=1024/cols, bh=1024/rows;
  for(let y=0;y<rows;y++) for(let x=-1;x<cols+1;x++) {
    const px=x*bw-(y%2)*bw*.5, py=y*bh, inset=4+rnd()*3;
    ctx.globalAlpha=1; ctx.fillStyle=p[0]; ctx.fillRect(px+inset,py+inset,bw-2*inset,bh-2*inset);
    ctx.globalAlpha=.55; ctx.fillStyle=p[Math.floor(rnd()*p.length)]; ctx.fillRect(px+inset+3,py+inset+3,bw-2*inset-7,bh-2*inset-7);
    ctx.globalAlpha=.8; ctx.strokeStyle=p[3]; ctx.lineWidth=5; ctx.strokeRect(px+inset,py+inset,bw-2*inset,bh-2*inset);
    ctx.globalAlpha=.75; ctx.strokeStyle=p[4]; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(px+inset+5,py+inset+5); ctx.lineTo(px+bw-inset-7,py+inset+5); ctx.stroke();
    ctx.globalAlpha=.25; ctx.strokeStyle=p[3]; ctx.lineWidth=2;
    for(let k=0;k<2;k++){const cx=px+inset+15+rnd()*(bw-35),cy=py+inset+15+rnd()*(bh-35);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+5+rnd()*15,cy+4+rnd()*9);ctx.stroke();}
  }
}
function drawWood(ctx,rnd,p) {
  for(let y=0;y<1024;y+=64) {
    ctx.globalAlpha=.9;ctx.fillStyle=p[Math.floor(rnd()*p.length)];ctx.fillRect(0,y,1024,58);
    ctx.globalAlpha=.65;ctx.strokeStyle=p[3];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,y+57);ctx.lineTo(1024,y+57);ctx.stroke();
    for(let i=0;i<24;i++){const x=rnd()*1024, yy=y+8+rnd()*42, len=18+rnd()*130;ctx.globalAlpha=.2+rnd()*.35;ctx.strokeStyle=rnd()>.5?p[4]:p[3];ctx.lineWidth=1+rnd()*3;ctx.beginPath();ctx.moveTo(x,yy);ctx.bezierCurveTo(x+len*.3,yy-4,x+len*.7,yy+4,x+len,yy);ctx.stroke();}
    if(rnd()>.35){const x=rnd()*960+20,yy=y+12+rnd()*30;ctx.globalAlpha=.5;ctx.fillStyle=p[3];ctx.beginPath();ctx.ellipse(x,yy,7,3,0,0,Math.PI*2);ctx.fill();}
  }
}
function drawRoof(ctx,rnd,p) {
  const tw=64, th=48;
  for(let y=-th;y<1024+th;y+=th) for(let x=-tw;x<1024+tw;x+=tw) {
    const px=x+((Math.floor(y/th)%2)*tw*.5);
    ctx.globalAlpha=1;ctx.fillStyle=p[3];ctx.beginPath();ctx.roundRect(px+2,y+2,tw-5,th-5,8);ctx.fill();
    ctx.globalAlpha=.95;ctx.fillStyle=p[Math.floor(rnd()*p.length)];ctx.beginPath();ctx.roundRect(px+4,y+3,tw-10,th-12,7);ctx.fill();
    ctx.globalAlpha=.8;ctx.strokeStyle=p[4];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px+10,y+7);ctx.quadraticCurveTo(px+tw*.5,y+2,px+tw-12,y+8);ctx.stroke();
    ctx.globalAlpha=.24;ctx.fillStyle=p[3];ctx.fillRect(px+9,y+th-13,tw-18,5);
  }
}
export function createPaintedTexture(kind, seed=1) {
  const size=1024, canvas=document.createElement("canvas"); canvas.width=canvas.height=size;
  const ctx=canvas.getContext("2d"), rnd=seeded(seed), p=PALETTES[kind]||PALETTES.stone;
  ctx.fillStyle=p[0];ctx.fillRect(0,0,size,size);
  if(kind==="stone") drawStone(ctx,rnd,p);
  else if(kind==="wood") drawWood(ctx,rnd,p);
  else if(kind==="roof") drawRoof(ctx,rnd,p);
  else {
    const count=kind==="grass"?460:kind==="earth"?620:520;
    paintBrush(ctx,rnd,p,count,kind==="grass"?32:24,kind==="grass"?118:94,kind==="grass"?12:9,kind==="grass"?42:34,.22,.5);
    // Trazos largos de pincel, agrupados en direcciones suaves para evitar ruido.
    for(let i=0;i<1250;i++) {
      const x=rnd()*size,y=rnd()*size,len=18+rnd()*92;
      ctx.globalAlpha=.16+rnd()*.3;ctx.strokeStyle=p[Math.floor(rnd()*p.length)];
      ctx.lineWidth=2+rnd()*7;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+len*.45,y-3+rnd()*8,x+len,y-2+rnd()*5);ctx.stroke();
    }
    if(kind==="grass") for(let i=0;i<520;i++) {
      const x=rnd()*size,y=rnd()*size;
      ctx.globalAlpha=.35;ctx.strokeStyle=rnd()>.5?"#d7d19a":"#405d36";ctx.lineWidth=2+rnd()*2;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+3+rnd()*5,y-5-rnd()*9);ctx.stroke();
    }
  }
  ctx.globalAlpha=1;
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=8;
  texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps=true;return texture;
}
