# Prototipo 3D de Eldoria

## Versión 1.2 — Paisaje integrado y vegetación viva

### Terreno, caminos y agua
- Se aumentó la resolución de la malla del terreno para conseguir un relieve más continuo.
- El cauce del río ahora se excava mediante una depresión gradual en el propio terreno; se eliminaron los bordes rectos tipo caja.
- La superficie del agua tiene subdivisiones y ondas suaves animadas.
- Se añadieron piedras de orilla colocadas siguiendo el relieve.
- Los caminos ahora siguen la altura del terreno y usan bandas laterales de transición de color para integrarse con la hierba en lugar de quedar como una cinta rígida.

### Vegetación
- Se reemplazaron las copas geométricas simples por árboles más altos con troncos, ramas y grupos de follaje con volumen.
- Las copas se balancean suavemente con el viento.
- Arbustos y hierbas tienen movimiento leve, sin animar cada objeto como una entidad independiente.
- Se mantiene el uso de instancias para reducir llamadas de dibujo y cuidar el rendimiento.

### Base técnica
- El ciclo principal actualiza el agua y la vegetación.
- Se conserva Three.js y la carga por módulos; no se cambia de motor ni se descarta el trabajo existente.
- El siguiente bloque de desarrollo deja de centrarse en decorar Piedra Clara: se ampliará el mundo jugable con destinos exteriores, regiones conectadas y sistemas propios de MMORPG.

### Ejecutar y validar
Descargar la rama `desarrollo-lore`, extraer el ZIP y abrir `index.html` con Live Server. Se necesita conexión a internet para cargar Three.js desde jsDelivr.

Esta revisión está subida al repositorio, pero todavía requiere validación visual en el navegador, especialmente en la transición de los caminos, el nivel del agua, las copas de los árboles y el rendimiento en equipos modestos.
