# Prototipo 3D de Eldoria
## Versión 0.6 — Conexión de caminos y superficies de agua

Esta revisión corrige la continuidad de los caminos alrededor del puente y mejora la forma de las lagunas.

### Cambios
- Eliminada la cinta de camino duplicada que se superponía al acceso del puente.
- El camino norte termina en la cabecera norte del puente.
- El camino sur comienza en la cabecera opuesta.
- Añadidas rampas graduales en ambos accesos para conectar el terreno con el tablero elevado.
- El tablero del puente queda como única superficie de cruce sobre el río.
- Las lagunas ahora usan superficies elípticas, en lugar de planos rectangulares.
- Se conserva el relieve excavado del río y de las cuencas.

### Ejecutar
Descargar la rama `desarrollo-lore`, extraer el ZIP, abrir `index.html` con Live Server en Visual Studio Code. Requiere conexión para cargar Three.js desde jsDelivr.

### Pruebas visuales pendientes
1. Comprobar que el río tenga agua visible y un lecho claramente más bajo que las orillas.
2. Recorrer el camino desde la plaza hasta el puente y confirmar que llega a la cabecera norte.
3. Cruzar el puente y comprobar la continuidad con el camino de salida sur.
4. Revisar que las lagunas tengan forma ovalada y estén contenidas en sus depresiones.
5. Comprobar que no aparezcan caminos duplicados ni superficies superpuestas.
6. Comprobar el rendimiento en el equipo objetivo.

Esta versión todavía requiere validación en el navegador del usuario; no se considera probada hasta completar esas verificaciones.
