import * as THREE from "three";

export function createActors(scene, heightAt) {
  const actors = [];
  const materials = {
    cloak: new THREE.MeshStandardMaterial({ color: 0x465b4c, roughness: 1 }),
    leather: new THREE.MeshStandardMaterial({ color: 0x49382b, roughness: 1 }),
    skin: new THREE.MeshStandardMaterial({ color: 0xc99d78, roughness: 1 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x8d8062, metalness: .22, roughness: .72 }),
    gold: new THREE.MeshBasicMaterial({ color: 0xe8c77d })
  };

  // Maelis espera junto a la plaza, cerca del antiguo pozo.
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.34, .52, 1.35, 7), materials.cloak);
  body.position.y = .95; group.add(body);
  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(.43, 8, 6), materials.cloak);
  shoulders.scale.set(1, .48, .72); shoulders.position.y = 1.48; group.add(shoulders);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.27, 8, 6), materials.skin);
  head.position.y = 1.88; group.add(head);
  const hood = new THREE.Mesh(new THREE.SphereGeometry(.31, 8, 6), materials.leather);
  hood.scale.set(1.05, .72, 1.05); hood.position.set(0, 2.02, -.045); group.add(hood);
  const belt = new THREE.Mesh(new THREE.TorusGeometry(.37, .055, 5, 8), materials.leather);
  belt.rotation.x = Math.PI / 2; belt.position.y = .72; group.add(belt);

  const staff = new THREE.Mesh(new THREE.CylinderGeometry(.045, .065, 2.25, 6), materials.leather);
  staff.position.set(.62, 1.12, -.05); staff.rotation.z = -.08; group.add(staff);
  const staffGem = new THREE.Mesh(new THREE.OctahedronGeometry(.16, 0), materials.gold);
  staffGem.position.set(.62, 2.28, -.05); group.add(staffGem);

  const marker = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.28, .045, 6, 18), materials.gold);
  ring.rotation.x = Math.PI / 2; marker.add(ring);
  const point = new THREE.Mesh(new THREE.SphereGeometry(.075, 7, 5), materials.gold);
  point.position.y = .18; marker.add(point);
  marker.position.y = 2.85; group.add(marker);

  const groundY = heightAt(-19, 1);
  group.position.set(-19, groundY, 1);
  group.rotation.y = -.55;
  scene.add(group);

  const glow = new THREE.PointLight(0xd9b878, .45, 5);
  glow.position.set(-19, groundY + 2.5, 1); scene.add(glow);

  actors.push({
    id: "maelis",
    name: "Maelis, guardiana del valle",
    position: group.position,
    group,
    marker,
    glow,
    dialogue: [
      "Viajero… llegaste a Piedra Clara justo cuando el valle comienza a despertar.",
      "Hace seiscientos años, la Cicatriz del Alba rasgó estas tierras. De ella nacieron las Astillas del Alba, fragmentos de un poder que nunca debió despertar.",
      "Si buscas respuestas, cruza el viejo puente. Al oeste aguarda el Bosque de los Susurros; más allá, las ruinas del santuario todavía conservan una de las brasas."
    ]
  });

  return {
    actors,
    nearest(position, maxDistance = 4.8) {
      let result = null, best = maxDistance;
      for (const actor of actors) {
        const dx = position.x - actor.position.x;
        const dz = position.z - actor.position.z;
        const distance = Math.hypot(dx, dz);
        if (distance < best) { best = distance; result = actor; }
      }
      return result;
    },
    update(time, playerPosition) {
      for (const actor of actors) {
        actor.marker.position.y = 2.85 + Math.sin(time * 2.2) * .12;
        actor.marker.rotation.y = time * .65;
        actor.glow.intensity = .35 + (Math.sin(time * 2) + 1) * .12;
      }
    }
  };
}
