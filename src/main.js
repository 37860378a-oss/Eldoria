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
scene.background = skyDay.clone();
scene.fog = new THREE.Fog(skyDay.clone(), 105, 245);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 320);
const world = createWorld(scene);
// walkHeightAt incluye el tablero del puente para que el personaje no pase por debajo.
const player = createPlayerController(scene, camera, world.walkHeightAt);
const hud = createHud(player);

const ambient = new THREE.HemisphereLight(0xe6f0d9, 0x6a624c, 1.45);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffe2b1, 2.1);
sun.position.set(-55, 90, 35);
scene.add(sun);

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
  // Variación lenta de luz y color para dar sensación de cielo vivo sin cielos HDR pesados.
  const daylight = 0.5 + 0.5 * Math.sin(elapsed * 0.018 + 0.6);
  const sky = skyHorizon.clone().lerp(skyDay, daylight);
  scene.background.copy(sky);
  scene.fog.color.copy(sky);
  sun.position.set(-55 + Math.sin(elapsed * 0.018) * 22, 72 + daylight * 22, 35);
  sun.intensity = 1.45 + daylight * 0.75;
  ambient.intensity = 1.2 + daylight * 0.3;
  renderer.render(scene, camera);
  hud.update();
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25)); renderer.setSize(window.innerWidth, window.innerHeight);
});
