# Prototipo 3D de Eldoria
## Versión 0.3 — Vegetación y Piedra Clara

Esta versión incorpora variedad ambiental y más identidad visual en los edificios, manteniendo geometrías compartidas e instancias para cuidar el rendimiento.

## Ejecutar en Windows

1. Descarga la rama `desarrollo-lore` como ZIP y descomprime la carpeta.
2. Abre la carpeta en Visual Studio Code.
3. Inicia Live Server desde `index.html`.
4. Abre la dirección local que muestra Live Server.

Se necesita conexión a internet para cargar Three.js desde jsDelivr.

## Novedades

- Árboles de distintas copas y tamaños, distribuidos de forma reproducible.
- Arbustos bajos y manchas de hierba para dar variedad a las praderas.
- Rocas colocadas fuera de caminos, aldea y cauce.
- Vegetación apartada de la plaza, las casas, el puente y los senderos.
- Uso de `InstancedMesh` para agrupar elementos repetidos y reducir llamadas de dibujo.
- Casas con cimientos de piedra, vigas de madera, postigos, aleros y chimeneas alternadas.

## Controles

- **W, A, S, D** o flechas: movimiento.
- **Mouse:** girar la cámara.
- **Shift:** correr.
- **Clic en la escena:** recuperar la cámara.

## Prueba recomendada

Recorre la plaza y los caminos. Comprueba que las casas se distingan mejor, que la vegetación no invada el sendero ni tape el puente y que el rendimiento siga siendo fluido.

Si aparece un error, envía el texto de F12 → Console y describe qué aparece en pantalla.
