import * as THREE from "three";
import { createWorld } from "./world/createWorld.js";
import { createPlayerController } from "./player/controller.js";
import { createHud } from "./ui/hud.js";

const sceneRoot = document.querySelector("#scene");
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "low-power" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
sceneRoot.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const skyDay = new THREE.Color(0x91b8c1);
const skyHorizon = new THREE.Color(0xc2c7a9);
scene.background = null;
scene.fog = new THREE.Fog(skyHorizon.clone(), 115, 270);

// Cielo panorámico procedural: azul en altura, horizonte cálido, nubes y sol.
function createSkyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048; canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "#315d83");
  gradient.addColorStop(.28, "#6798b5");
  gradient.addColorStop(.55, "#a9c5c9");
  gradient.addColorStop(.72, "#e0c9a6");
  gradient.addColorStop(1, "#83969a");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);

  // Nubes suaves en capas, con variación de tamaño y transparencia.
  let seed = 82471;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let layer = 0; layer < 3; layer++) {
    for (let i = 0; i < 115; i++) {
      const x = random() * w, y = h * (.27 + random() * .34);
      const rx = 24 + random() * (layer === 0 ? 105 : 165);
      const ry = 8 + random() * 24;
      const alpha = .025 + random() * .075;
      ctx.save(); ctx.translate(x, y); ctx.scale(1, .7 + random() * .5);
      ctx.filter = "blur(" + (10 + random() * 18) + "px)";
      ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
      ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, (random() - .5) * .18, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }
  // Resplandor y disco solar cerca del horizonte.
  const sx = w * .73, sy = h * .48;
  const glow = ctx.createRadialGradient(sx, sy, 5, sx, sy, 190);
  glow.addColorStop(0, "rgba(255,244,211,.65)");
  glow.addColorStop(.25, "rgba(255,224,177,.23)");
  glow.addColorStop(1, "rgba(255,224,177,0)");
  ctx.fillStyle = glow; ctx.fillRect(sx - 200, sy - 200, 400, 400);
  ctx.fillStyle = "#fff2cf"; ctx.beginPath(); ctx.arc(sx, sy, 19, 0, Math.PI * 2); ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.needsUpdate = true;
  return texture;
}
const skyTexture = createSkyTexture();
const skyDome = new THREE.Mesh(
  new THREE.SphereGeometry(900, 48, 32),
  new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide, depthWrite: false, fog: false })
);
skyDome.frustumCulled = false;
skyDome.renderOrder = -1000;
scene.add(skyDome);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 500000);
const world = createWorld(scene);
// walkHeightAt incluye el tablero del puente para que el personaje no pase por debajo.
const player = createPlayerController(scene, camera, world.walkHeightAt);
const hud = createHud(player, world);

const ambient = new THREE.HemisphereLight(0xe6f0d9, 0x6a624c, 1.45);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffe5bf, 2.35);
sun.position.copy(sunDirection).multiplyScalar(120);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -95;
sun.shadow.camera.right = 95;
sun.shadow.camera.top = 95;
sun.shadow.camera.bottom = -95;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 260;
sun.shadow.bias = -0.00025;
scene.add(sun);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

let active = false;
const intro = document.querySelector("#intro");
const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
  active = true; intro.classList.add("hidden"); player.start();
  renderer.domElement.requestPointerLock?.(); hud.setStatus("Explorando el Valle de Eldoria");
});
document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement !== renderer.domElement && active) hud.setStatus("Exploración libre · clic para recuperar la cámara");
});
renderer.domElement.addEventListener("click", () => {
  if (active && document.pointerLockElement !== renderer.domElement) renderer.domElement.requestPointerLock?.();
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.elapsedTime;
  const delta = Math.min(clock.getDelta(), 0.04);
  player.update(delta);
  world.nature?.update?.(elapsed);
  world.update?.(elapsed);
  // Variación lenta de luz y color para dar sensación de cielo vivo sin cielos HDR pesados.
  const daylight = 0.5 + 0.5 * Math.sin(elapsed * 0.018 + 0.6);
  const skyTint = skyHorizon.clone().lerp(skyDay, daylight);
  scene.fog.color.copy(skyTint);
  skyDome.position.copy(camera.position);
  sun.position.set(-55 + Math.sin(elapsed * 0.018) * 22, 72 + daylight * 22, 35);
  sun.intensity = 1.55 + daylight * 0.8;
  ambient.intensity = 1.15 + daylight * 0.35;
  renderer.render(scene, camera);
  hud.update();
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25)); renderer.setSize(window.innerWidth, window.innerHeight);
});
