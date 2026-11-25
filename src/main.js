import * as THREE from "three";
import { Sky } from "https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/objects/Sky.js";
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
scene.fog = new THREE.Fog(skyDay.clone(), 115, 270);

// Cúpula atmosférica física: dispersión de Rayleigh, bruma y disco solar.
const sky = new Sky();
sky.scale.setScalar(450000);
sky.material.uniforms.turbidity.value = 8;
sky.material.uniforms.rayleigh.value = 2.2;
sky.material.uniforms.mieCoefficient.value = 0.005;
sky.material.uniforms.mieDirectionalG.value = 0.82;
scene.add(sky);
const sunDirection = new THREE.Vector3();
const sunSpherical = new THREE.Spherical(1, THREE.MathUtils.degToRad(72), THREE.MathUtils.degToRad(215));
sunDirection.setFromSpherical(sunSpherical).normalize();
sky.material.uniforms.sunPosition.value.copy(sunDirection);

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
  scene.background.copy(skyTint);
  scene.fog.color.copy(skyTint);
  sun.position.set(-55 + Math.sin(elapsed * 0.018) * 22, 72 + daylight * 22, 35);
  sunDirection.set(sun.position.x, sun.position.y, sun.position.z).normalize();
  sky.material.uniforms.sunPosition.value.copy(sunDirection);
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
