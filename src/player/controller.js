import * as THREE from "three";

export function createPlayerController(scene, camera, heightAt) {
  const player = new THREE.Group();
  const tunic = new THREE.MeshStandardMaterial({ color: 0x536d55, roughness: 1 });
  const leather = new THREE.MeshStandardMaterial({ color: 0x493b30, roughness: 1 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xc99e78, roughness: 1 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.48, 0.85, 3, 6), tunic);
  body.position.y = 1.15;
  player.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 8, 6), skin);
  head.position.y = 2.0;
  player.add(head);
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.28), leather);
  pack.position.set(0, 1.25, -0.42);
  player.add(pack);
  player.position.set(-25, heightAt(-25, 3), 3);
  scene.add(player);

  const keys = new Set();
  let yaw = 0;
  let pitch = 0.22;
  let started = false;
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const desired = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();

  function keyDown(event) {
    if (["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(event.code)) {
      keys.add(event.code);
      event.preventDefault();
    }
  }
  function keyUp(event) { keys.delete(event.code); }
  function mouseMove(event) {
    if (document.pointerLockElement !== document.querySelector("#scene canvas")) return;
    yaw -= event.movementX * 0.0025;
    pitch = THREE.MathUtils.clamp(pitch + event.movementY * 0.0018, -0.12, 0.72);
  }
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  document.addEventListener("mousemove", mouseMove);
  window.addEventListener("blur", () => keys.clear());

  return {
    object: player,
    start() { started = true; },
    update(delta) {
      if (!started) {
        desired.set(player.position.x, player.position.y + 1.1, player.position.z);
      } else {
        forward.set(-Math.sin(yaw), 0, -Math.cos(yaw));
        right.set(Math.cos(yaw), 0, -Math.sin(yaw));
        const move = new THREE.Vector3();
        if (keys.has("KeyW") || keys.has("ArrowUp")) move.add(forward);
        if (keys.has("KeyS") || keys.has("ArrowDown")) move.sub(forward);
        if (keys.has("KeyD") || keys.has("ArrowRight")) move.add(right);
        if (keys.has("KeyA") || keys.has("ArrowLeft")) move.sub(right);
        if (move.lengthSq() > 0) {
          move.normalize();
          const speed = keys.has("ShiftLeft") ? 10 : 6.2;
          player.position.addScaledVector(move, speed * delta);
          player.rotation.y = Math.atan2(move.x, move.z);
        }
        player.position.x = THREE.MathUtils.clamp(player.position.x, -103, 103);
        player.position.z = THREE.MathUtils.clamp(player.position.z, -103, 103);
        // heightAt incluye el tablero del puente; los caminos siguen siendo
        // una capa visual y el personaje camina sobre el terreno que tienen debajo.
        player.position.y = heightAt(player.position.x, player.position.z);
        desired.set(player.position.x, player.position.y + 1.35, player.position.z);
      }
      const distance = 8.5;
      const horizontal = Math.cos(pitch) * distance;
      const cameraPosition = new THREE.Vector3(
        desired.x + Math.sin(yaw) * horizontal,
        desired.y + 2.2 + Math.sin(pitch) * distance,
        desired.z + Math.cos(yaw) * horizontal
      );
      camera.position.lerp(cameraPosition, 1 - Math.exp(-7 * delta));
      lookTarget.copy(desired).add(new THREE.Vector3(0, 0.45, 0));
      camera.lookAt(lookTarget);
    },
    getPosition() { return player.position; }
  };
}
