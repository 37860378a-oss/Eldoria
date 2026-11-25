import { createTerrain } from "./terrain.js";
import { createVillage } from "./village.js";
import { createNature } from "./nature.js";
import { createPaths } from "./paths.js";

export function createWorld(scene) {
  const terrain = createTerrain(scene);
  createPaths(scene, terrain.heightAt);
  createVillage(scene, terrain.heightAt);
  createNature(scene, terrain.heightAt);
  return terrain;
}
