# Valle de Eldoria
## Diseño de la primera región jugable — versión 0.1

El Valle de Eldoria es la región de inicio y el primer entorno que se construirá en 3D. Debe enseñar al jugador a moverse, explorar, combatir, hablar con personajes, recolectar recursos y reconocer el lenguaje visual del mundo sin convertir la zona en un tutorial artificial.

## 1. Identidad del valle

Un valle templado de colinas verdes, praderas, arroyos y bosques mixtos. Un río ancho cruza la región de noroeste a sureste, alimenta granjas y molinos y condiciona los caminos. Las colinas no son montañas abruptas: forman lomadas suaves con afloramientos de piedra, árboles aislados y ruinas visibles desde lejos.

**Paleta:** verdes variados, tierra ocre, piedra gris cálida, madera envejecida, agua azul verdosa y flores en pequeños grupos. Las zonas afectadas por la Cicatriz introducen cristal oscuro y reflejos azul pálido, siempre como acento y no como color dominante.

**Sensación:** rural, acogedora y antigua; el peligro se insinúa en los bordes y bajo la superficie.

## 2. Estructura espacial

El valle se organiza alrededor de Piedra Clara y del río. Las rutas forman un circuito comprensible para que el jugador pueda orientarse por puntos de referencia.

### Sectores del valle

1. **Piedra Clara — núcleo inicial**
   - Plaza, pozo, fogón, tablón de anuncios y posada.
   - Herrería, carpintería, granja y pequeñas viviendas.
   - Puente de piedra al norte y camino comercial al sur.
   - Primera zona segura, con guardias y servicios básicos.

2. **Ribera de los Sauces — oeste**
   - Senderos junto al río, sauces, juncos y pequeños embarcaderos.
   - Peces, plantas comunes y animales tranquilos.
   - Molino de agua y una cabaña de pescadores.
   - Encuentros sencillos y primeras tareas de recolección.

3. **Campos de Trigal — sur**
   - Parcelas cultivadas, cercas, graneros, carros y molinos de viento pequeños.
   - Granja de la familia Veller (nombre provisional).
   - Problemas de animales, herramientas perdidas y rutas de carretas.
   - Criaturas menores en los bordes de los campos.

4. **Bosquecillo del Puente — norte**
   - Arboleda mixta, rocas cubiertas de musgo y senderos estrechos.
   - Restos de una calzada antigua y señales de criaturas alteradas.
   - Lugar de rastreo y primeros combates opcionales.

5. **Colinas de la Atalaya — este**
   - Elevaciones suaves con vistas al valle.
   - Torre de vigilancia derruida y ruinas antiguas sobre una loma.
   - Cuevas pequeñas y afloramientos minerales.
   - La primera cámara vinculada a la Astilla se encuentra bajo las ruinas, pero su entrada no está abierta al principio.

6. **Vado de las Caravanas — sureste**
   - Cruce de caminos y paso poco profundo del río.
   - Restos del campamento de la caravana desaparecida.
   - Huellas, ruedas rotas y señales de lucha.
   - Acceso futuro hacia el Camino Real y las regiones orientales.

### Relaciones de orientación

- La plaza de Piedra Clara es el punto de referencia central.
- El río y el puente ayudan a reconocer norte y oeste.
- La torre se ve desde los campos y desde la plaza en días despejados.
- El humo de la posada y la herrería permite reconocer el pueblo desde el camino.
- Las ruinas se ven desde lejos, pero no se puede llegar directamente por el camino principal.

## 3. Plano lógico de la región

Esquema de relaciones, no escala final:

```text
                         NORTE
                           ^
               BOSQUECILLO DEL PUENTE
                       |                         PUENTE       sendero viejo
                       |           \
RIBERA DE LOS SAUCES -- PIEDRA CLARA -- COLINAS DE LA ATALAYA
       |               plaza/posada          | torre
    molino                 |                 | ruinas
       |              camino del sur         |
       |                 |                   |
                  CAMPOS DE TRIGAL ---- VADO DE LAS CARAVANAS
                                             /
                            camino comercial
                                  v
                                  SUR
```

## 4. Piedra Clara: distribución del asentamiento

La aldea debe ser pequeña, legible y reconocible desde cualquier entrada.

- **Plaza del Pozo:** centro social, tablón, fogón y punto de encuentro.
- **El Ciervo Dormido:** posada de dos plantas con establo y patio trasero.
- **Herrería de Odran:** yunque exterior, cobertizo, pila de enfriamiento y depósito de carbón.
- **Taller de carpintería:** troncos apilados, banco de trabajo y piezas de carros.
- **Granja ribereña:** casa, corral, huerto, granero y acceso al agua.
- **Puente Viejo:** puente de piedra con marcas de desgaste y cristales que aparecen durante la primera cadena.
- **Puesto de guardia:** empalizada baja y pequeño almacén junto al camino.
- **Viviendas:** casas de madera y piedra, techos de teja y paja, cercas, leña y objetos cotidianos.

La arquitectura no debe repetirse como una fila de copias. Se reutilizarán módulos básicos, pero se variarán tejados, anexos, chimeneas, cercas, materiales y orientación.

## 5. Puntos de interés y secretos

- **El Molino de los Sauces:** mecanismo parcialmente averiado; introduce interacciones con objetos del entorno.
- **La Atalaya Rota:** mirador y refugio de animales; contiene una pista sobre la antigua calzada.
- **Piedras de los Tres Ecos:** tres monolitos desgastados cerca de un arroyo. Cada uno responde de forma distinta a la luz y al sonido.
- **La Cámara Enterrada:** primera cámara antigua bajo las ruinas de la colina. Su acceso se habilita al completar la investigación de la caravana.
- **Cueva del Tejón:** pequeña cueva opcional con minerales comunes y rastros de fauna.

## 6. Criaturas y vida ambiental

La región debe parecer habitada incluso cuando no hay combate:
- Conejos, ciervos, aves, peces y animales de granja.
- Lobos que patrullan bordes del bosque y evitan las zonas pobladas.
- Jabalíes que defienden su espacio si se los acorrala.
- Sabuesos de bruma en sectores alterados, especialmente cerca de la caravana.
- Cuervos de ojos dorados como señal ambiental de actividad extraña.

Las criaturas no deben aparecer en grupos aleatorios idénticos. Cada especie tendrá zonas, horarios aproximados, distancias de huida y respuestas simples. Los animales pacíficos no atacarán al jugador sin motivo.

## 7. Misiones iniciales

### Tramo A — Llegada
1. Llegar a Piedra Clara y hablar con Mara Venn.
2. Conocer a Odran y entregar un objeto de trabajo.
3. Ayudar a Eira Solverde a reunir hierbas comunes.
4. Llevar un mensaje de Tomas al puesto de guardia.

### Tramo B — Señales
5. Investigar por qué los animales evitan el pozo.
6. Examinar los cristales del Puente Viejo.
7. Seguir huellas hacia el Bosquecillo del Puente.
8. Encontrar restos del campamento de la caravana.

### Tramo C — Rescate
9. Localizar a los supervivientes.
10. Defender el refugio de criaturas alteradas.
11. Guiar a los supervivientes hasta el vado o despejar un camino seguro.

### Tramo D — La cámara
12. Reunir información sobre los símbolos con Odran y Eira.
13. Encontrar la entrada a la cámara bajo las ruinas.
14. Investigar el mecanismo y descubrir la Astilla del Alba.
15. Tomar una decisión inicial: sellarla provisionalmente, entregarla a una autoridad local o mantenerla oculta mientras se busca más información.

La decisión no debe bloquear el avance del personaje ni crear una elección irreversible sin explicación. Puede modificar diálogos, reputación y eventos posteriores.

## 8. Ritmo y densidad de contenido

La aldea debe estar a pocos minutos de los primeros puntos de interés a pie. El jugador no debería atravesar grandes espacios vacíos para encontrar una misión. Los puntos de interés se verán desde caminos y elevaciones, pero no todos estarán señalizados con marcadores de interfaz.

La primera región se construirá en tres anillos:
- **Anillo seguro:** Piedra Clara, granjas y caminos cercanos.
- **Anillo de exploración:** ribera, bosquecillo, colinas y cuevas.
- **Anillo de misterio:** campamento de la caravana, ruinas y cámara.

Los límites serán naturales, no muros invisibles. Guardias, terreno, criaturas y señales advertirán sobre zonas peligrosas.

## 9. Lista de construcción para el primer mapa 3D

Orden recomendado:
1. Bloqueo de terreno con colinas, río y vado.
2. Caminos principales y puente.
3. Bloqueo de Piedra Clara con volúmenes simples de edificios.
4. Bosques y vegetación por grupos, no por objetos dispersos al azar.
5. Molino, torre y ruinas como siluetas reconocibles.
6. Materiales y texturas pintadas a mano.
7. Agua, iluminación y ambiente.
8. NPC y fauna con rutinas sencillas.
9. Misiones e interacciones.
10. Cámara enterrada como primera mazmorra pequeña.

## 10. Criterios de aceptación

El primer mapa se considerará listo para pruebas cuando:
- El jugador pueda recorrer el circuito completo sin atravesar terreno ni caer fuera del mundo.
- Se distingan Piedra Clara, el río, el puente, la torre y las ruinas desde puntos de observación.
- Las rutas conduzcan de forma natural a los lugares de misión.
- La aldea tenga siluetas de edificios variadas y accesos visibles.
- La vegetación no bloquee caminos ni sature el rendimiento.
- El mapa pueda cargarse por sectores sin congelaciones graves.
- Un jugador nuevo pueda orientarse sin depender constantemente del minimapa.

Este diseño define la primera región. Las coordenadas, dimensiones y densidades definitivas se ajustarán con pruebas reales de movimiento y rendimiento.
