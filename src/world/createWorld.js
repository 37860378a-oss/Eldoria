import { createTerrain } from "./terrain.js";
import { createVillage } from "./village.js";
import { createNature } from "./nature.js";

export function createWorld(scene) {
  const terrain = createTerrain(scene);
  createVillage(scene, terrain.heightAt);
  createNature(scene, terrain.heightAt);
  return terrain;
}
