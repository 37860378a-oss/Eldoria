# Prototipo 3D de Eldoria

## Versión 1.1 — Corrección de la aldea y trazado de caminos

### Correcciones de distribución
- Se retiró la parcela que estaba demasiado cerca del cauce y se reubicó al oeste de Piedra Clara y se alejó de la franja del río y de sus bancos.
- Se actualizaron las zonas de exclusión de vegetación para que coincidan con la nueva parcela.
- Se eliminaron las dos salidas exteriores provisionales y los mojones asociados: no se mostrarán caminos que terminen sin conectar con una zona jugable.
- Se conserva únicamente el circuito de la plaza y el acceso principal al puente, que forman un recorrido reconocible.

### Criterio para la próxima expansión
Los caminos exteriores volverán cuando se construyan primero sus destinos (ruinas, granja, campamento o asentamiento) y puedan conectarse desde el origen hasta el destino. No se crearán senderos aislados como decoración.

### Funcionamiento
- Movimiento con WASD o flechas y Shift para correr.
- Cámara en tercera persona con el mouse.
- El controlador reconoce el tablero del puente como superficie transitable.
- Los caminos son capas visuales sobre el terreno, no obstáculos físicos.

### Ejecutar y validar
Descargar la rama `desarrollo-lore`, extraer el ZIP y abrir `index.html` con Live Server. Se necesita conexión a internet para cargar Three.js desde jsDelivr.

Validar la nueva posición de la casa oeste, la distancia al río, el circuito de la plaza y la continuidad hasta el puente. La revisión visual final debe hacerse en el navegador.
