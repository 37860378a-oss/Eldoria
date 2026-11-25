# Eldoria

**MMORPG 3D de fantasía y mundo abierto.**

Eldoria es un proyecto de MMORPG online construido desde cero con HTML, CSS, JavaScript modular y Three.js. Su mundo combina exploración, culturas en conflicto, magia antigua y regiones con identidad propia.

## Visión del proyecto

- Mundo 3D persistente y explorable.
- Fantasía estilizada con texturas pintadas a mano e inspiración en los MMORPG clásicos.
- Arquitectura modular: cada sistema tendrá sus propios archivos.
- Rendimiento como prioridad para PC modestas y dispositivos Android.
- Progresión, combate, profesiones, comercio, misiones y juego online como objetivos de desarrollo.

## Lore oficial

La historia, geografía, culturas, magia y dirección artística del mundo están definidas en la **[Biblia de mundo y lore](docs/lore/LORE.md)**.

La primera aventura comienza en el Valle de Eldoria, en la aldea de Piedra Clara, donde una serie de sucesos extraños revela el despertar de una antigua cámara vinculada a la Cicatriz del Alba.

## Diseño de personajes

- [Pueblos jugables](docs/lore/PEOPLES.md): cinco pueblos con culturas y ventajas contextuales equilibradas.
- [Clases y caminos de aventura](docs/lore/CLASSES.md): ocho clases iniciales, roles de grupo y orden de implementación.
- [Geografía y estructura del mundo](docs/world/WORLD_MAP.md): regiones, conexiones, rutas y criterios de mundo persistente.
- [Valle de Eldoria](docs/world/ELDORIA_VALLEY.md): diseño detallado de la primera región jugable.
- [Índice de documentación](docs/README.md): acceso a los documentos principales.

## Estructura de desarrollo

El proyecto se construirá por etapas pequeñas y verificables. Primero se establecerán los cimientos visuales y técnicos; después se incorporarán regiones, personajes, criaturas, sistemas de juego y finalmente la infraestructura online.

## Prototipo actual

Ya existe una primera escena 3D modular del Valle de Eldoria: terreno procedural, río, puente, vegetación, edificios iniciales de Piedra Clara, personaje de prueba, cámara de exploración e interfaz básica.

Para ejecutarlo, descarga el repositorio y sirve la carpeta raíz mediante un servidor HTTP local (por ejemplo, la extensión Live Server de Visual Studio Code o `python -m http.server 8000`). Luego abre `http://localhost:8000`. Se requiere conexión a internet para cargar Three.js desde CDN.

**Controles:** WASD o flechas para moverse, mouse para mirar y Shift para correr. Haz clic en «Entrar al valle» para comenzar y vuelve a hacer clic en la escena si necesitas recuperar el control de cámara.

## Estado

**Etapa actual:** primer prototipo de exploración 3D. Pendiente de prueba en el equipo del usuario y ajuste visual/rendimiento.

---

*Eldoria — Mientras una sola brasa recuerde el fuego, la noche no habrá vencido.*
