import * as THREE from "three";
import { createWorld } from "./world/createWorld.js";
import { createPlayerController } from "./player/controller.js";
import { createHud } from "./ui/hud.js";

const sceneRoot = document.querySelector("#scene");
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "low-power" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
sceneRoot.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9db9b0);
scene.fog = new THREE.Fog(0x9db9b0, 95, 235);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 320);
const world = createWorld(scene);
const player = createPlayerController(scene, camera, world.heightAt);
const hud = createHud(player);

const ambient = new THREE.HemisphereLight(0xe6f0d9, 0x6a624c, 1.55);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffe2b1, 2.0);
sun.position.set(-55, 90, 35);
scene.add(sun);

let active = false;
const intro = document.querySelector("#intro");
const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
  active = true;
  intro.classList.add("hidden");
  player.start();
  renderer.domElement.requestPointerLock?.();
  hud.setStatus("Explorando el Valle de Eldoria");
});

document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement !== renderer.domElement && active) {
    hud.setStatus("Exploración libre · clic para recuperar la cámara");
  }
});
renderer.domElement.addEventListener("click", () => {
  if (active && document.pointerLockElement !== renderer.domElement) {
    renderer.domElement.requestPointerLock?.();
  }
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.04);
  if (active) player.update(delta);
  renderer.render(scene, camera);
  hud.update();
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
  renderer.setSize(window.innerWidth, window.innerHeight);
});
