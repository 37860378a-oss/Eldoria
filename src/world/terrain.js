import * as THREE from "three";

const WORLD_SIZE = 220;

function smoothNoise(x, z, scale, phase = 0) {
  return Math.sin((x + phase) * scale) * Math.cos((z - phase) * scale * 0.83);
}

export function terrainHeight(x, z) {
  // Ondulaciones amplias y suaves: el relieve se lee desde lejos sin crear picos bruscos.
  const broad = smoothNoise(x, z, 0.026, 11) * 2.25;
  const rolling = smoothNoise(x + 31, z - 17, 0.057, 4) * 0.78;
  const ridge = Math.pow(Math.abs(smoothNoise(x - 13, z + 27, 0.018, 8)), 1.7) * 2.0;

  const hillA = 8.2 * Math.exp(-(((x - 55) ** 2) / 1050 + ((z - 48) ** 2) / 1350));
  const hillB = 6.1 * Math.exp(-(((x + 66) ** 2) / 1550 + ((z - 56) ** 2) / 1200));
  const hillC = 4.4 * Math.exp(-(((x - 48) ** 2) / 1900 + ((z + 67) ** 2) / 1500));

  // Piedra Clara y el cauce conservan superficies transitables y legibles.
  const villageFlat = Math.exp(-(((x + 24) ** 2) / 850 + (z ** 2) / 650));
  const riverFlat = Math.exp(-((z + 25) ** 2) / 185);
  const naturalRelief = (broad + rolling + ridge) * (1 - villageFlat * 0.94) * (1 - riverFlat * 0.97);

  return naturalRelief + hillA + hillB + hillC;
}

function createGroundTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  const image = context.createImageData(size, size);
  let seed = 9137;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let i = 0; i < image.data.length; i += 4) {
    const shade = Math.floor(random() * 28);
    image.data[i] = 105 + shade;
    image.data[i + 1] = 125 + shade;
    image.data[i + 2] = 77 + Math.floor(shade * 0.55);
    image.data[i + 3] = 255;
  }
  context.putImageData(image, 0, 0);

  // Manchas suaves que rompen el aspecto plano sin recurrir a una textura pesada.
  for (let i = 0; i < 95; i++) {
    const x = random() * size;
    const y = random() * size;
    const radius = 3 + random() * 13;
    context.fillStyle = random() > 0.5 ? "rgba(166,157,105,0.12)" : "rgba(49,91,55,0.13)";
    context.beginPath();
    context.ellipse(x, y, radius * 1.5, radius, random() * Math.PI, 0, Math.PI * 2);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.anisotropy = 2;
  return texture;
}

export function createTerrain(scene) {
  const segments = 132;
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, segments, segments);
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.attributes.position;
  const colors = [];
  const meadow = new THREE.Color(0x78945d);
  const sunlit = new THREE.Color(0x9eaa70);
  const earth = new THREE.Color(0x9b8d68);
  const shadow = new THREE.Color(0x55734e);

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    const h = terrainHeight(x, z);
    positions.setY(i, h);

    const variation = (Math.sin(x * 0.11) + Math.cos(z * 0.13) + Math.sin((x - z) * 0.07)) * 0.045;
    const color = meadow.clone().lerp(sunlit, THREE.MathUtils.clamp(0.35 + h * 0.035 + variation, 0, 0.88));
    if (h > 5.2) color.lerp(earth, THREE.MathUtils.clamp((h - 5.2) * 0.045, 0, 0.32));
    if (h < -1.2) color.lerp(shadow, 0.22);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  const ground = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      map: createGroundTexture(),
      vertexColors: true,
      roughness: 1,
      flatShading: false
    })
  );
  ground.receiveShadow = false;
  scene.add(ground);

  // Cauce ligeramente irregular con una superficie de agua sencilla y económica.
  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x609fa0,
    roughness: 0.28,
    metalness: 0.04,
    transparent: true,
    opacity: 0.86
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(240, 13.5, 36, 3), waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 0.16, -25);
  scene.add(water);

  const bankMaterial = new THREE.MeshStandardMaterial({ color: 0x9b9a70, roughness: 1 });
  for (const z of [-32.4, -17.6]) {
    const bank = new THREE.Mesh(new THREE.BoxGeometry(220, 0.32, 1.5), bankMaterial);
    bank.position.set(0, 0.04, z);
    scene.add(bank);
  }

  return { heightAt: terrainHeight };
}
