import { createTerrain } from "./terrain.js";
import { createVillage } from "./village.js";
import { createNature } from "./nature.js";
import { createPaths } from "./paths.js";
import { createVillageDetails } from "./villageDetails.js";
import { createVillageBuildings } from "./villageBuildings.js";
import { createExploration } from "./exploration.js";
import { createActors } from "./actors.js";
import { createEnvironment } from "./environment.js";
import { createWaterway } from "./waterway.js";

export function createWorld(scene) {
  const terrain = createTerrain(scene);
  const waterway = createWaterway(scene, terrain.heightAt);
  createPaths(scene, terrain.heightAt);
  createVillage(scene, terrain.heightAt);
  createVillageDetails(scene, terrain.heightAt);
  const buildings = createVillageBuildings(scene, terrain.heightAt);
  const nature = createNature(scene, terrain.heightAt);
  const exploration = createExploration(scene, terrain.heightAt);
  const actors = createActors(scene, terrain.heightAt);
  const environment = createEnvironment(scene, terrain.heightAt);

  const walkHeightAt = terrain.heightAt;

  return { ...terrain, waterway, nature, environment, buildings, walkHeightAt, exploration, actors, regionAt: exploration.regionAt, update(time) { terrain.update(time); waterway.update(time); exploration.update(time); environment.update(time); buildings?.update?.(time); } };
}
