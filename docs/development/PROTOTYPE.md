# Primer prototipo 3D de Eldoria
## Versión 0.2 — Paisaje del Valle

Esta etapa mejora el relieve y la lectura visual del valle sin introducir dependencias nuevas ni aumentar de forma importante el coste de renderizado.

## Ejecutar en Windows

1. Descarga la rama `desarrollo-lore` como ZIP desde GitHub y descomprime la carpeta.
2. Abre la carpeta del proyecto en Visual Studio Code.
3. Inicia Live Server desde `index.html`.
4. Abre la dirección local que muestra Live Server.

No abras `index.html` directamente con doble clic: los módulos JavaScript necesitan un servidor HTTP. Three.js se carga desde jsDelivr, por lo que hace falta conexión a internet.

## Qué incluye esta versión

- Relieve con colinas amplias, lomas secundarias y zonas suaves para caminar.
- Superficie del terreno con variación de color y una textura procedural liviana generada en memoria.
- Río y orillas con tonos más naturales.
- Camino principal curvo entre Piedra Clara y el puente.
- Continuación del sendero al otro lado del río y un camino secundario hacia las lomas.
- Distribución fija del entorno para que las pruebas sean comparables.

## Controles

- **W, A, S, D** o flechas: movimiento.
- **Mouse:** girar la cámara mientras el puntero está capturado.
- **Shift:** correr.
- **Clic en la escena:** recuperar el control de cámara si se libera.

## Alcance y limitaciones

Todavía no son modelos artísticos finales ni hay colisiones físicas completas con edificios, árboles y límites del puente. Tampoco hay NPC interactivos, criaturas, combate, inventario, misiones, guardado, cuentas o servidor persistente.

## Prueba recomendada

Recorre el camino desde la plaza hasta el puente y continúa unos metros por la otra orilla. Observa si el terreno, el camino y el agua se ven correctamente y si el movimiento sigue siendo fluido. Si aparece un error, envía el texto de la consola del navegador (F12 → Console) y una descripción de lo que ves.
