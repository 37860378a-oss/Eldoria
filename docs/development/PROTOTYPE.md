# Primer prototipo 3D de Eldoria
## Versión 0.1 — Valle de Eldoria

Este prototipo es el primer paso técnico del mundo de Eldoria. Su objetivo no es representar todavía el juego completo, sino validar la escena, la escala, la cámara, el movimiento y el rendimiento antes de sumar sistemas.

## Ejecutar en Windows

1. Descarga la rama `desarrollo-lore` como ZIP desde GitHub y descomprime la carpeta.
2. Abre la carpeta del proyecto en Visual Studio Code.
3. Inicia un servidor HTTP local. Puedes usar la extensión Live Server o abrir una terminal en la carpeta y ejecutar:

```bash
python -m http.server 8000
```

4. Abre `http://localhost:8000` en el navegador.

No abras `index.html` directamente con doble clic: los módulos JavaScript necesitan un servidor HTTP. Three.js se carga desde jsDelivr, por lo que hace falta conexión a internet.

## Controles

- **W, A, S, D** o flechas: movimiento.
- **Mouse:** girar la cámara mientras el puntero está capturado.
- **Shift:** correr.
- **Clic en la escena:** recuperar el control de cámara si se libera.

## Qué incluye

- Terreno ondulado generado por código y colores por vértice.
- Río transversal y bancos de ribera.
- Primer trazado del puente de piedra.
- Conjunto inicial de edificios de Piedra Clara.
- Árboles y rocas colocados con una semilla fija para repetir la distribución.
- Personaje provisional de exploración.
- Cámara en tercera persona e interfaz básica de región y coordenadas.
- Módulos separados para terreno, vegetación, aldea, jugador e interfaz.

## Qué todavía no incluye

- Modelos artísticos finales, texturas pintadas a mano ni animaciones.
- Colisiones físicas completas con edificios, árboles y límites del puente.
- NPC interactivos, criaturas, combate, inventario o misiones funcionales.
- Guardado, cuentas, servidor ni mundo persistente.
- Mapa definitivo a escala real.

## Criterios de la primera prueba

Antes de ampliar el mundo, comprobar:
1. Que el navegador cargue la escena sin errores de consola.
2. Que la cámara muestre el valle antes de pulsar «Entrar al valle».
3. Que WASD y el mouse permitan recorrer el entorno.
4. Que el personaje se mantenga sobre el terreno.
5. Que el río, el puente y los edificios sean visibles.
6. Que el rendimiento sea aceptable en el equipo de destino.

Si aparece un error, enviar el texto de la consola del navegador (F12 → Console) y describir qué se ve en pantalla. No se debe añadir más contenido hasta corregir los problemas de la prueba base.
