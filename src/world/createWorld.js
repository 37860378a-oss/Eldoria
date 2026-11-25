import { createTerrain } from "./terrain.js";
import { createVillage } from "./village.js";
import { createNature } from "./nature.js";
import { createPaths } from "./paths.js";
import { createVillageDetails } from "./villageDetails.js";
import { createVillageBuildings } from "./villageBuildings.js";
import { createExploration } from "./exploration.js";
import { createActors } from "./actors.js";
import { createEnvironment } from "./environment.js";

const BRIDGE_START_Z = -37.2;
const BRIDGE_END_Z = -16.8;
const BRIDGE_CENTER_X = 8.2;
function bridgeHeightAt(x,z,heightAt) {
  if(z<BRIDGE_START_Z||z>BRIDGE_END_Z||Math.abs(x-BRIDGE_CENTER_X)>4.05)return null;
  const t=(z-BRIDGE_START_Z)/(BRIDGE_END_Z-BRIDGE_START_Z);
  return heightAt(x,z)+.48+3.65*Math.sin(Math.PI*t);
}

export function createWorld(scene) {
  const terrain = createTerrain(scene);
  createPaths(scene, terrain.heightAt);
  createVillage(scene, terrain.heightAt);
  createVillageDetails(scene, terrain.heightAt);
  const buildings = createVillageBuildings(scene, terrain.heightAt);
  const nature = createNature(scene, terrain.heightAt);
  const exploration = createExploration(scene, terrain.heightAt);
  const actors = createActors(scene, terrain.heightAt);
  const environment = createEnvironment(scene, terrain.heightAt);

  // El personaje sigue el perfil del arco al cruzar el puente.
  function walkHeightAt(x,z) {
    return bridgeHeightAt(x,z,terrain.heightAt) ?? terrain.heightAt(x,z);
  }

  return { ...terrain, nature, environment, buildings, walkHeightAt, exploration, actors, regionAt: exploration.regionAt, update(time) { terrain.update(time); exploration.update(time); environment.update(time); buildings?.update?.(time); } };
}
