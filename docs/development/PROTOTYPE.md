# Prototipo 3D de Eldoria

## Versión 0.9 — Distribución de Piedra Clara

### Ajustes
- Se alinearon los faroles junto a los bordes de los caminos de la aldea y de los accesos al puente.
- Se aumentó la cantidad de faroles y se evitó ubicarlos en el centro de la calzada.
- Se redistribuyeron las cinco casas en parcelas más amplias, con mayor separación entre viviendas y cercos.
- Se conserva la plaza central como referencia de organización de Piedra Clara.
- Los detalles repetidos siguen usando `THREE.InstancedMesh` para cuidar el rendimiento.

### Funcionamiento conservado
- Movimiento con WASD o flechas y Shift para correr.
- Cámara en tercera persona con el mouse.
- El controlador reconoce el tablero del puente como superficie transitable.
- Los caminos son capas visuales sobre el terreno, no obstáculos físicos.

### Ejecutar
Descargar la rama `desarrollo-lore`, extraer el ZIP, abrir `index.html` con Live Server en Visual Studio Code. Se necesita conexión a internet para cargar Three.js desde jsDelivr.

### Comprobaciones
1. Recorrer la aldea y revisar la alineación de los faroles.
2. Confirmar que las casas y sus cercos ya no se amontonan.
3. Revisar que las parcelas mantengan espacio para caminar entre ellas.
4. Cruzar el puente y comprobar los accesos.
5. Comprobar el rendimiento en el equipo objetivo.

La versión está integrada en GitHub, pero necesita validación visual y de movimiento en el navegador del usuario.
