import { createTerrain } from "./terrain.js";
import { createVillage } from "./village.js";
import { createNature } from "./nature.js";
import { createPaths } from "./paths.js";

const BRIDGE_LINE = [
  { z: -37, x: 8.2 },
  { z: -32, x: 7.2 },
  { z: -27, x: 6.7 },
  { z: -22, x: 7.5 },
  { z: -17, x: 9.2 }
];

function bridgeCenterX(z) {
  for (let i = 0; i < BRIDGE_LINE.length - 1; i++) {
    const a = BRIDGE_LINE[i], b = BRIDGE_LINE[i + 1];
    if (z >= a.z && z <= b.z) {
      const t = (z - a.z) / (b.z - a.z);
      return a.x + (b.x - a.x) * t;
    }
  }
  return null;
}

export function createWorld(scene) {
  const terrain = createTerrain(scene);
  createPaths(scene, terrain.heightAt);
  createVillage(scene, terrain.heightAt);
  const nature = createNature(scene, terrain.heightAt);

  // El personaje usa el tablero como suelo cuando está dentro del puente.
  // Fuera de su ancho vuelve a seguir la altura normal del terreno.
  function walkHeightAt(x, z) {
    const centerX = bridgeCenterX(z);
    if (centerX !== null && Math.abs(x - centerX) <= 3.85) {
      return terrain.heightAt(x, z)
        + 0.68
        + 4.25 * Math.exp(-((z + 25) ** 2) / 43);
    }
    return terrain.heightAt(x, z);
  }

  return { ...terrain, nature, walkHeightAt };
}
