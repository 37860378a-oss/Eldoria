# Prototipo 3D de Eldoria
## Versión 0.7 — Paso sobre el puente y continuidad de senderos

### Correcciones
- El controlador del personaje ahora reconoce el tablero del puente como superficie transitable.
- Al caminar dentro del ancho del puente, la altura del personaje se calcula sobre el tablero y no debajo del terreno excavado.
- Fuera del puente, el personaje continúa siguiendo el relieve normal.
- Se eliminó un sendero lateral que heredaba por error la elevación de la rampa del puente y podía quedar flotando.
- Se añadió un sendero lateral conectado al acceso norte, a nivel del terreno.
- Los caminos siguen siendo capas visuales sobre el terreno, no obstáculos físicos.

### Ejecutar
Descargar la rama `desarrollo-lore`, extraer el ZIP, abrir `index.html` con Live Server en Visual Studio Code. Requiere conexión para cargar Three.js desde jsDelivr.

### Pruebas pendientes en navegador
1. Caminar por el acceso norte y subir al puente.
2. Cruzar el puente en ambos sentidos sin caer debajo del tablero.
3. Salir por el acceso sur y comprobar que el personaje vuelve gradualmente al nivel del terreno.
4. Seguir el sendero lateral y verificar que no flota ni queda enterrado.
5. Revisar la unión entre el camino de la plaza y el acceso al puente.
6. Comprobar el rendimiento en el equipo objetivo.

Esta versión requiere validación visual y de movimiento en el navegador del usuario; no se considera probada hasta completar esas verificaciones.
