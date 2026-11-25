# Prototipo 3D de Eldoria

## Versión 0.8 — Ambientación de Piedra Clara

### Novedades
- Se añadió el módulo independiente `src/world/villageDetails.js`.
- Se incorporaron faroles de madera con luz cálida, barriles, cajones y carteles de orientación.
- Los elementos se distribuyen en puntos definidos alrededor de la aldea, sus accesos y el camino del puente.
- Los objetos repetidos usan `THREE.InstancedMesh` para reducir llamadas de dibujo.
- La nueva ambientación se integra desde `createWorld.js`, sin mezclarla con la lógica de terreno, caminos o control del personaje.

### Controles y funcionamiento conservados
- Movimiento con WASD o flechas.
- Shift para correr.
- Cámara en tercera persona con movimiento del mouse.
- El controlador reconoce el tablero del puente como superficie transitable.
- Los caminos continúan siendo capas visuales sobre el terreno, no obstáculos físicos.

### Ejecutar
Descargar la rama `desarrollo-lore`, extraer el ZIP, abrir `index.html` con Live Server en Visual Studio Code. Se necesita conexión a internet para cargar Three.js desde jsDelivr.

### Pruebas de esta versión
1. Recorrer Piedra Clara y comprobar que los faroles, barriles, cajones y carteles aparecen correctamente.
2. Revisar que ningún objeto quede flotando o enterrado en las zonas donde está colocado.
3. Caminar por los accesos y cruzar el puente en ambos sentidos.
4. Comprobar el rendimiento en el equipo objetivo.

Esta versión está integrada en el repositorio, pero requiere validación visual y de movimiento en el navegador del usuario. No se considera probada hasta completar esas verificaciones.
