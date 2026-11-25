import * as THREE from "three";
import { createWorld } from "./world/createWorld.js";
import { createPlayerController } from "./player/controller.js";
import { createHud } from "./ui/hud.js";
import { createDialogue } from "./ui/dialogue.js";

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
const skyNight = new THREE.Color(0x101a2b);
const skyDusk = new THREE.Color(0xb87958);
const skyCurrent = new THREE.Color(0x91b8c1);
scene.background = new THREE.Color(0x91b8c1);
scene.fog = new THREE.Fog(skyHorizon.clone(), 165, 430);
let visionDistance = 430;
let timeOfDay = 14;
let dayCycleEnabled = true;
let dayCycleSpeed = 1;
let renderScale = 1;
let graphicsQuality = "medium";

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
  texture.needsUpdate = true;
  return texture;
}
const skyTexture = createSkyTexture();
skyTexture.mapping = THREE.EquirectangularReflectionMapping;
scene.background = skyTexture;

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 500000);
const world = createWorld(scene);
// walkHeightAt incluye el tablero del puente para que el personaje no pase por debajo.
const player = createPlayerController(scene, camera, world.walkHeightAt);
const hud = createHud(player, world);
const dialogue = createDialogue(player, world.actors, hud);

const pauseMenu = document.querySelector("#pause-menu");
const visionSlider = document.querySelector("#vision-distance");
const visionValue = document.querySelector("#vision-value");
const timeSlider = document.querySelector("#time-of-day");
const timeValue = document.querySelector("#time-value");
const cycleToggle = document.querySelector("#day-cycle");
const cycleSpeedSlider = document.querySelector("#cycle-speed");
const cycleSpeedValue = document.querySelector("#cycle-speed-value");
const resolutionSelect = document.querySelector("#render-scale");
const qualitySelect = document.querySelector("#graphics-quality");
const fullscreenButton = document.querySelector("#fullscreen-button");
const clockDisplay = document.querySelector("#world-clock");
let menuOpen = false;
function setVisionDistance(value) {
  visionDistance = THREE.MathUtils.clamp(Number(value) || 430, 90, 430);
  scene.fog.near = Math.max(35, visionDistance * 0.38);
  scene.fog.far = visionDistance;
  camera.far = visionDistance + 80;
  camera.updateProjectionMatrix();
  if (visionSlider) visionSlider.value = String(visionDistance);
  if (visionValue) visionValue.textContent = Math.round(visionDistance) + " m";
}
function openPauseMenu() {
  if (menuOpen || !active) return;
  menuOpen = true; player.setPaused(true);
  if (document.pointerLockElement) document.exitPointerLock();
  pauseMenu?.classList.add("visible");
  pauseMenu?.setAttribute("aria-hidden", "false");
}
function closePauseMenu(resume = true) {
  if (!menuOpen) return;
  menuOpen = false; player.setPaused(false);
  pauseMenu?.classList.remove("visible");
  pauseMenu?.setAttribute("aria-hidden", "true");
  if (resume && active) renderer.domElement.requestPointerLock?.();
}
visionSlider?.addEventListener("input", event => setVisionDistance(event.target.value));
function formatWorldTime(hour) {
  const h = Math.floor(hour) % 24;
  const m = Math.floor((hour - Math.floor(hour)) * 60);
  return String(h).padStart(2,"0") + ":" + String(m).padStart(2,"0");
}
function setWorldTime(value) {
  timeOfDay = THREE.MathUtils.euclideanModulo(Number(value) || 0,24);
  if (timeSlider) timeSlider.value = String(timeOfDay);
  if (timeValue) timeValue.textContent = formatWorldTime(timeOfDay);
  if (clockDisplay) clockDisplay.textContent = formatWorldTime(timeOfDay);
}
function applyRenderSettings() {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5) * renderScale;
  renderer.setPixelRatio(ratio);
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.shadowMap.enabled = graphicsQuality !== "low";
  renderer.shadowMap.type = graphicsQuality === "high" ? THREE.PCFSoftShadowMap : THREE.BasicShadowMap;
  sun.shadow.mapSize.setScalar(graphicsQuality === "high" ? 1536 : graphicsQuality === "medium" ? 1024 : 512);
  sun.shadow.needsUpdate = true;
}
timeSlider?.addEventListener("input",event=>setWorldTime(event.target.value));
cycleToggle?.addEventListener("change",event=>{dayCycleEnabled=event.target.checked;});
cycleSpeedSlider?.addEventListener("input",event=>{
  dayCycleSpeed=Number(event.target.value);
  if(cycleSpeedValue) cycleSpeedValue.textContent=dayCycleSpeed.toFixed(1)+"×";
});
resolutionSelect?.addEventListener("change",event=>{renderScale=Number(event.target.value)||1;applyRenderSettings();});
qualitySelect?.addEventListener("change",event=>{graphicsQuality=event.target.value;applyRenderSettings();});
fullscreenButton?.addEventListener("click",()=>{
  if(!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
});
setWorldTime(14);
applyRenderSettings();
document.querySelector("#resume-button")?.addEventListener("click", () => closePauseMenu(true));
document.querySelector("#pause-close-button")?.addEventListener("click", () => closePauseMenu(true));
window.addEventListener("keydown", event => {
  if (event.code !== "Escape" || event.defaultPrevented || !active) return;
  event.preventDefault();
  if (menuOpen) closePauseMenu(true); else openPauseMenu();
});
setVisionDistance(visionDistance);

const ambient = new THREE.HemisphereLight(0xe6f0d9, 0x6a624c, 1.45);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffe5bf, 2.35);
sun.position.set(-55, 94, 35);
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
  world.actors.update(elapsed, player.getPosition());
  dialogue.update();
  // Variación lenta de luz y color para dar sensación de cielo vivo sin cielos HDR pesados.
  if (dayCycleEnabled) setWorldTime(timeOfDay + delta * 0.04 * dayCycleSpeed);
  const solar = Math.sin((timeOfDay - 6) / 12 * Math.PI);
  const daylight = THREE.MathUtils.clamp((solar + .12) / 1.12, 0, 1);
  const duskFactor = 1 - Math.min(1,Math.abs(timeOfDay-6)/2,Math.abs(timeOfDay-19)/2);
  skyCurrent.copy(skyNight).lerp(skyDusk,THREE.MathUtils.clamp(duskFactor,0,1)).lerp(skyDay,daylight);
  scene.fog.color.copy(skyCurrent);
  if (daylight > .12) scene.background = skyTexture;
  else scene.background = skyCurrent;
  sun.position.set(-55 + Math.cos((timeOfDay-12)/12*Math.PI)*22, 18 + daylight*82, 35);
  sun.intensity = .08 + daylight * (graphicsQuality === "high" ? 2.25 : 1.9);
  sun.color.setRGB(.48 + daylight*.52,.58 + daylight*.36,.82 + daylight*.12);
  ambient.intensity = .22 + daylight * 1.45;
  renderer.render(scene, camera);
  hud.update();
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
  applyRenderSettings();
});
