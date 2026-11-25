# Prototipo 3D de Eldoria
## Versión 0.4 — Piedra Clara y paisaje vivo

Esta iteración reorganiza el espacio de la aldea y el cruce del río antes de seguir agregando edificios y decoración. Se priorizan separaciones claras entre parcelas, plaza, caminos, cauce y puente.

## Cambios

- Casas separadas en parcelas con cercos perimetrales y accesos.
- Plaza central despejada con pozo; se redujo la cantidad de edificios para evitar saturar el centro.
- Camino de tierra más ancho, con textura procedural liviana y trazado curvo.
- Senderos secundarios conectados a la calle principal.
- Río a nivel más uniforme y con orillas definidas.
- Puente de piedra reconstruido con una curva suave, tablero transversal y barandas siguiendo el trazado.
- Vegetación excluida de parcelas, plaza, caminos, puente, río y orillas.
- Césped con balanceo sutil por viento.
- Ciclo lento de iluminación y color del cielo, sin texturas HDR ni efectos costosos.

## Ejecutar en Windows

1. Descarga la rama desarrollo-lore como ZIP y descomprime la carpeta.
2. Abre la carpeta en Visual Studio Code.
3. Inicia Live Server desde index.html.
4. Abre la dirección local que muestra Live Server.

Se necesita conexión a internet para cargar Three.js desde jsDelivr.

## Controles

- **W, A, S, D** o flechas: movimiento.
- **Mouse:** girar la cámara.
- **Shift:** correr.
- **Clic en la escena:** recuperar la cámara.

## Prueba recomendada

1. Mira la aldea desde un punto alto o gira alrededor de ella: comprueba que las casas tengan espacio entre sí y que la plaza quede libre.
2. Sigue el camino principal hasta el puente: debe ser continuo y no atravesar casas, cercos ni árboles.
3. Cruza el puente y comprueba que conecte ambas orillas y no quede por debajo del agua.
4. Observa el río desde ambos lados: el agua debe quedar dentro del cauce.
5. Comprueba el movimiento suave del césped y que el cambio de luz no afecte al rendimiento.

Esta versión fue actualizada en GitHub, pero todavía necesita la prueba visual en tu equipo. Si aparece un error, envía el texto de F12 → Console y una descripción del lugar donde ocurre.
