import * as THREE from "three";

// Mapas PBR originales de FreeStylized. Se cargan desde docs para evitar
// duplicar archivos pesados; las texturas se comparten entre superficies.
const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();

const PBR_SURFACES = {
  grass: {
    folder: "grass_07_1k",
    prefix: "grass_07"
  },
  earth: {
    folder: "ground_06_1k",
    prefix: "ground_06"
  }
};

const LEGACY_SURFACES = new Set(["stone", "plaster", "wood", "roof"]);

function loadTexture(url, color = false) {
  const key = `${url}|${color ? "color" : "data"}`;
  if (textureCache.has(key)) return textureCache.get(key);

  const texture = textureLoader.load(
    url,
    loaded => {
      if (color) loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.wrapS = THREE.RepeatWrapping;
      loaded.wrapT = THREE.RepeatWrapping;
      loaded.anisotropy = 8;
      loaded.magFilter = THREE.LinearFilter;
      loaded.minFilter = THREE.LinearMipmapLinearFilter;
      loaded.generateMipmaps = true;
      loaded.needsUpdate = true;
    },
    undefined,
    error => console.error("[Eldoria] Error al cargar textura:", url, error)
  );

  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(key, texture);
  return texture;
}

function setRepeat(texture, repeatX, repeatY) {
  if (texture) texture.repeat.set(repeatX, repeatY);
}

export function createSurfaceMaterial(kind, {
  repeatX = 1,
  repeatY = repeatX,
  roughness = 1,
  normalScale = 0.55,
  aoIntensity = 0.65
} = {}) {
  const definition = PBR_SURFACES[kind];
  if (!definition) {
    console.warn(`[Eldoria] Superficie PBR desconocida: ${kind}`);
    return new THREE.MeshStandardMaterial({ color: 0xffffff, roughness });
  }

  const base = `../../docs/${definition.folder}/${definition.prefix}`;
  const colorMap = loadTexture(
    new URL(`${base}_baseColor_1k.png`, import.meta.url).href,
    true
  );
  const normalMap = loadTexture(
    new URL(`${base}_normal_gl_1k.png`, import.meta.url).href
  );
  const roughnessMap = loadTexture(
    new URL(`${base}_roughness_1k.png`, import.meta.url).href
  );
  const aoMap = loadTexture(
    new URL(`${base}_ambientOcclusion_1k.png`, import.meta.url).href
  );

  for (const texture of [colorMap, normalMap, roughnessMap, aoMap]) {
    setRepeat(texture, repeatX, repeatY);
  }

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: colorMap,
    normalMap,
    normalScale: new THREE.Vector2(normalScale, normalScale),
    roughnessMap,
    roughness,
    aoMap,
    aoMapIntensity,
    metalness: 0
  });
  return material;
}

// Compatibilidad para piedra, revoque, madera y tejados hasta recibir
// sus mapas definitivos. Se conserva el generador SVG anterior.
const legacyLoader = new THREE.TextureLoader();
const legacyCache = new Map();
const VALID_LEGACY = LEGACY_SURFACES;

export function createPaintedTexture(kind, seed = 1) {
  const surface = VALID_LEGACY.has(kind) ? kind : "stone";
  if (legacyCache.has(surface)) return legacyCache.get(surface);

  const url = new URL(`../../assets/textures/${surface}.svg`, import.meta.url).href;
  const texture = legacyLoader.load(
    url,
    loaded => {
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.wrapS = loaded.wrapT = THREE.RepeatWrapping;
      loaded.anisotropy = 8;
      loaded.magFilter = THREE.LinearFilter;
      loaded.minFilter = THREE.LinearMipmapLinearFilter;
      loaded.generateMipmaps = true;
      loaded.needsUpdate = true;
    },
    undefined,
    error => console.error(`[Eldoria] No se pudo cargar la textura "${surface}":`, error)
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  legacyCache.set(surface, texture);
  return texture;
}
