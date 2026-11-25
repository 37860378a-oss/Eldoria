# Prototipo 3D de Eldoria

## Versión 1.0 — Senderos y despeje de la aldea

### Correcciones
- Se ampliaron las zonas libres alrededor de las cinco casas y sus cercos para impedir que árboles, arbustos y rocas invadan las construcciones.
- La vegetación ahora respeta el trazado real de los caminos, el circuito de la plaza, las entradas del puente y las salidas del valle.
- Se revisaron los senderos para que el circuito de Piedra Clara cierre sobre sí mismo y las dos rutas exteriores nazcan de conexiones reconocibles.
- Los caminos de salida terminan junto a mojones de piedra que señalan futuras zonas de exploración, en lugar de desaparecer sin referencia.

### Siguiente etapa
- La expansión del mundo continuará desde los dos mojones, manteniendo las rutas conectadas y reservando espacio para nuevos puntos de interés.
- Se mantiene el uso de instancias para vegetación y detalles repetidos, priorizando equipos modestos.

### Funcionamiento conservado
- Movimiento con WASD o flechas y Shift para correr.
- Cámara en tercera persona con el mouse.
- El controlador reconoce el tablero del puente como superficie transitable.
- Los caminos son capas visuales sobre el terreno, no obstáculos físicos.

### Ejecutar
Descargar la rama `desarrollo-lore`, extraer el ZIP, abrir `index.html` con Live Server en Visual Studio Code. Se necesita conexión a internet para cargar Three.js desde jsDelivr.

### Comprobaciones pendientes
1. Recorrer las cinco parcelas y confirmar que ninguna copa invade techos o cercos.
2. Seguir el circuito de la plaza y comprobar que cierra sin cortes.
3. Seguir los caminos al puente y a los dos mojones.
4. Comprobar rendimiento en el equipo objetivo.

La integración está hecha en GitHub; la validación visual y de movimiento debe realizarse en el navegador.
