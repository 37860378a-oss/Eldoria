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

 
## Versión 1.3 — Primera expansión del mundo

- Se añadió un camino exterior que cruza el puente y se bifurca hacia dos destinos.
- El Bosque de los Susurros incorpora un pequeño claro, árboles de mayor escala, helechos y motas luminosas animadas.
- El Santuario de las Primeras Brasas contiene pilares quebrados, dinteles caídos, escombros, altar y una astilla cristalina animada.
- El HUD muestra el nombre de la región según la posición del personaje.
- Las zonas están integradas en el terreno existente y preparan puntos de interés para futuras criaturas, recursos, misiones y eventos.
- La expansión está construida como un módulo independiente para poder añadir nuevas regiones sin cargar la lógica en un único archivo.

Pendiente de validación: comprobar la conexión del camino con el extremo del puente, el relieve de las dos rutas, la visibilidad de los puntos de interés y el rendimiento en el equipo objetivo. Los destinos son zonas explorables visuales; todavía no incluyen colisiones, criaturas ni misiones.


## Versión 1.4 — Vegetación, raíces y atmósfera

- Los árboles del terreno tienen troncos más anchos, raíces expuestas que se abren sobre el suelo y variación de altura y copa.
- Se aumentó la presencia de árboles, arbustos, piedras y hierba manteniendo el uso de instancias para limitar el coste de renderizado.
- Se incorporó una cúpula de cielo atmosférico con dispersión de luz, bruma y disco solar; la luz direccional aporta sombras.
- Se mantienen zonas de exclusión para no cubrir caminos, casas ni el área del puente.
- Las texturas detalladas de corteza, hojas, hierba, tierra y piedra quedan para una pasada posterior de materiales, una vez validada la escala y distribución de la vegetación.
- Esta versión requiere prueba visual y de rendimiento en el equipo objetivo; las sombras y la densidad vegetal podrán ajustarse según el resultado.


## Versión 1.5 — Primer habitante e interacción

- Se incorporó a Maelis, guardiana de Piedra Clara, como primer personaje no jugador del mundo.
- El personaje tiene un modelo 3D de bajo coste, un indicador visual animado y una luz tenue para facilitar su localización.
- Al acercarse aparece la indicación para interactuar. La tecla **E** inicia y avanza un diálogo; **Esc** permite cerrarlo.
- El diálogo presenta la Cicatriz del Alba, las Astillas y los primeros destinos de exploración, conectando el prototipo con el lore.
- La lógica de personajes y diálogos vive en módulos separados para preparar futuras conversaciones, misiones, comerciantes y criaturas.
- No se añadió todavía combate ni persistencia online; esta etapa establece la base de interacción local.


## Versión 1.6 — Casa de guardia, puente y cauce integrados

- Se añadió un único edificio medieval junto a Maelis: casa de guardia de piedra con torre octogonal de vigilancia, almenas, saeteras, puerta reforzada y estandarte.
- El puente ahora cruza en línea recta y forma un arco elevado de medio punto en su perfil, con barandas a ambos lados y entradas de piedra.
- El nivel del río se elevó y el cauce se ensanchó con transiciones de terreno más graduales.
- Se añadieron indicadores de corriente que avanzan sobre el agua para comunicar visualmente su dirección.
- Se suavizaron las transiciones de las orillas y se ajustó el camino para que conecte con la entrada del puente.
- El perfil de altura del puente y la altura de desplazamiento del jugador comparten la misma curva para evitar que el personaje atraviese el tablero.
- Requiere validación visual en navegador: comprobar el acceso a la torre, el nivel del agua, la unión de caminos y el paso sobre el puente.


## Versión 1.7 — Muelle, puente pétreo y vegetación orgánica

- Se incorporó un muelle de madera con tablones separados, pilotes, bolardos y acceso escalonado desde la orilla.
- Se bajó el nivel del agua para mantenerlo por debajo de las piedras de ambas márgenes y evitar que la lámina invada el terreno.
- El puente se reconstruyó como un arco de mampostería: dovelas de piedra, pretiles laterales y albardillas simétricas siguiendo una curva común.
- Los árboles ahora distribuyen el follaje en grupos separados sobre las ramas, con siluetas menos esféricas y más irregulares.
- La hierba utiliza hojas alargadas individuales y un balanceo suave con variación de fase y dirección.
- El ciclo del mundo actualiza también la animación de la vegetación.
- Pendiente: validar visualmente el nivel del agua junto a las piedras, el despeje bajo el arco, la unión del muelle con la orilla y la simetría del puente en navegador.


## Versión 1.8 — Expansión geográfica y nacimiento del río

- Se amplió el terreno de 220 a 550 unidades por lado (150 % más de extensión lineal respecto al tamaño anterior).
- Se incorporó una cordillera perimetral de altura progresiva para cerrar visualmente los bordes del mapa y evitar que el paisaje termine en vacío.
- El río nace ahora en una cascada occidental que cae desde la montaña y conecta con el cauce principal.
- Se redujo la altura de la lámina de agua y se ajustó el muelle para que la cubierta quede claramente por encima del nivel del río.
- Se añadieron mesetas, llanuras, cuatro lagunas adicionales integradas mediante depresiones suaves del terreno y tres accesos de cueva en la cordillera.
- Se ampliaron las poblaciones de árboles, arbustos, rocas y hierbas. Se incorporaron árboles de follaje verde primaveral y tonos otoñales, además de pastos de distintas alturas.
- Se añadieron tres campamentos con tiendas, mantas, leña, fogones, cajas, hierbas silvestres y acumulaciones de rocas.
- Se extendieron los límites de movimiento del personaje para que pueda recorrer la nueva región.
- Pendiente de prueba visual: continuidad cascada-río, altura real del agua junto al muelle, silueta de las montañas, entradas de cuevas y rendimiento en equipos modestos.


## Versión 1.9 — Agua, partículas y opciones gráficas

- Se ajustó el renderizado del cauce para que las partículas de corriente se dibujen por encima de la lámina de agua y mantengan visibilidad durante el recorrido.
- Se reforzó la continuidad visual de la cascada con el río y se ajustó la prioridad de dibujo de sus superficies.
- Se incorporó un menú de pausa accesible con ESC, con control en tiempo real de la distancia de visión.
- La distancia elegida modifica la niebla y el recorte de cámara para reducir la carga visual en equipos modestos.
- El movimiento del personaje queda pausado mientras el menú está abierto.
- Pendiente de prueba visual: verificar el nacimiento del río, la visibilidad de las partículas y el comportamiento del menú en navegador.


## Versión 2.0 — Ambientación de Piedra Clara

- Se enriqueció el mobiliario del asentamiento con seis barriles de madera y sus aros, además de cinco cajones con refuerzos visibles.
- Los elementos se generan mediante mallas instanciadas para mantener bajo el número de llamadas de dibujo.
- Se conserva la señalización y la iluminación decorativa existentes, manteniendo despejados los recorridos principales.
- El cauce del río queda sin cambios en esta etapa; su corrección se retoma más adelante.
- Pendiente de prueba visual: revisar que los nuevos objetos apoyen correctamente sobre el terreno y no bloqueen los caminos.


## Versión 2.1 — Edificios de Piedra Clara

- Se incorporaron tres edificios diferenciados: una vivienda, una herrería y un almacén.
- Las construcciones combinan cimientos de piedra, paredes claras, vigas de madera y cubiertas inclinadas con variaciones de color y escala.
- Las fachadas incluyen accesos entreabiertos para permitir ver parte del mobiliario interior.
- La herrería incorpora horno, brasa y yunque; el almacén incluye estanterías y mercancías.
- Los edificios se generan desde un módulo independiente (`villageBuildings.js`) y se integran al crear el mundo.
- Se mantienen materiales compartidos y geometría sencilla para cuidar el rendimiento.
- Pendiente de validación visual: comprobar la ubicación de los tres edificios, que no invadan caminos ni mobiliario, y que las puertas e interiores se vean correctamente desde el recorrido del jugador.


## Versión 2.2 — Iluminación y opciones de viaje
- Se centraron las cubiertas a dos aguas sobre la estructura y se corrigió la posición de la cumbrera.
- Las puertas ahora giran desde un pivote de bisagra y conservan el acceso abierto.
- Se añadieron dos antorchas por edificio con parpadeo visual e iluminación cálida.
- El menú de pausa incorpora calidad gráfica, escala de renderizado, distancia de visión y pantalla completa.
- Se añadió reloj del mundo, ciclo día/noche configurable, control de velocidad y ajuste manual de hora.
- La escala de renderizado reduce la resolución interna del canvas; la resolución física de pantalla sigue dependiendo del navegador y del sistema operativo.


## Versión 2.3 — Valle sin agua
- Se retiraron por completo el río, las seis lagunas, la cascada, el remolino, las partículas de corriente y sus animaciones.
- Se restauró el relieve continuo del terreno: ya no quedan zanjas ni depresiones artificiales bajo las antiguas masas de agua.
- Se eliminaron las franjas de orilla y las exclusiones de vegetación que dependían del río y las lagunas.
- Se mantienen los caminos, el puente, los edificios, las antorchas, los campamentos y el resto del paisaje.


## Versión 2.4 — Laguna y brazo de río
- Se incorpora una laguna ovalada al sur del puente y un brazo sinuoso que conecta el espejo de agua con el muelle de madera.
- El cauce atraviesa la zona inferior del puente de piedra y llega hasta la punta del muelle, conservando ambas estructuras.
- Se añaden piedras de orilla instanciadas y una franja de agua somera para integrar visualmente el borde.
- Implementación aislada en `src/world/waterway.js`; el resto del terreno y los módulos existentes se mantienen.


## Versión 2.5 — Texturas más definidas y cauce sin laguna
- Se retiró la laguna y sus piedras perimetrales; se conserva únicamente el brazo de río que pasa bajo el puente y conecta con el muelle.
- Se aumentó a 1024×1024 la resolución procedural del terreno y de los caminos, con grano fino, variaciones orgánicas y filtrado mipmap/anisótropo.
- El terreno incorpora relieve de microdetalle mediante bump mapping suave para dar lectura a la superficie sin sumar geometría.
- Se mantiene la generación procedural y el uso de módulos existentes para controlar el coste de renderizado.


## Versión 2.6 — Dirección artística Hand-Painted Stylized Art
- Se establece una dirección visual global de fantasía estilizada pintada a mano.
- El terreno utiliza manchas amplias de color, pinceladas cortas y acentos orgánicos; se reduce el bump para evitar una lectura fotográfica o granulada.
- Los caminos reciben capas pictóricas de tierra, pinceladas claras y piedras pintadas.
- Piedra, revoque, madera y tejados de los edificios usan patrones ilustrados con juntas, vetas y luces pintadas.
- Se armoniza la paleta de árboles, arbustos, rocas y hierba con tonos más cálidos y siluetas facetadas.
- Se conservan geometría, distribución, módulos, puente y brazo del río. No se incorporan masas de agua nuevas.
- La generación sigue siendo procedural y no requiere descargas de texturas externas.
- Pendiente de validación visual y de rendimiento en el equipo objetivo.


## Ajuste 2.6.1 — Lectura visual de las pinceladas
- Se corrigió la multiplicación excesiva entre los mapas de color y los tintes oscuros de los materiales.
- El terreno ahora muestra los mapas pintados sin vertex colors que apaguen sus tonos.
- Se ampliaron las manchas y pinceladas para que sigan siendo visibles desde la cámara de juego.
- Los caminos usan pinceladas más grandes y contraste más claro; la vegetación lateral conserva su transición.
- Se mantiene el enfoque de rendimiento: CanvasTextures pequeñas, materiales compartidos y sin mapas de alta resolución externos.
- Pendiente de confirmación visual en el navegador del usuario.


## Revisión 2.7 — Sistema de superficies pintadas
- Se incorpora `src/world/paintedMaterials.js` como generador compartido de materiales ilustrados.
- El generador crea mapas CanvasTexture de 1024 px con pinceladas amplias, capas de color y detalles dibujados por superficie: pradera, tierra, piedra, revoque, madera y tejas.
- Terreno y caminos dejan de depender de sus generadores de ruido anteriores y usan el nuevo sistema pictórico.
- Los edificios reutilizan el mismo generador para piedra, revoque, madera y tejados, manteniendo sus modelos, UV y distribución.
- No se agregan imágenes externas ni geometría adicional; las texturas se generan localmente y se reutilizan por material.
- La validación visual y de rendimiento queda pendiente de la prueba en navegador con Live Server.


## Versión 2.8 — Biblioteca de texturas artísticas

- Se agregan seis recursos SVG originales en `assets/textures/`: césped, tierra, piedra, revoque, madera y tejas.
- Las texturas dejan de dibujarse en Canvas durante el arranque: `paintedMaterials.js` ahora carga archivos artísticos independientes mediante `THREE.TextureLoader`.
- Se mantienen las funciones de integración existentes en terreno, caminos y edificios; los modelos y la distribución del valle no se modifican.
- Las texturas se comparten por tipo para evitar duplicar recursos y reducir el coste de memoria.
- La biblioteca usa patrones ilustrados con bloques, vetas, pinceladas, luces y sombras pintadas, con una paleta de fantasía inspirada en MMORPG clásicos.
- Pendiente de validación visual y de rendimiento en el navegador del usuario. Si una textura no carga, el módulo informa el recurso concreto en la consola.


## Versión 2.9 — Integración de superficies PBR reales

- Se integraron los mapas 1K de FreeStylized para césped (`grass_07_1k`) y tierra/caminos (`ground_06_1k`).
- Three.js carga Base Color, Normal GL, Roughness y Ambient Occlusion desde sus carpetas originales en `docs/`; no se duplican los PNG de varios megabytes.
- Los mapas se comparten mediante caché, con repetición UV configurable y filtrado anisotrópico.
- El terreno y las cintas de caminos incorporan UV2 para el mapa de oclusión ambiental.
- Las texturas SVG provisionales se mantienen para piedra, revoque, madera y tejados hasta incorporar sus recursos definitivos.
- Pendiente: prueba visual en navegador y ajuste fino de escala/repetición según la cámara del juego.


## Versión 2.10 — Reconstrucción de caminos con Ground 06

- Se reemplazó la geometría anterior de las sendas por un generador común de caminos orgánicos, con curvas suaves, bordes irregulares y altura adaptada al terreno.
- Los caminos de Piedra Clara y las rutas exteriores hacia el Bosque de los Susurros y el Santuario ahora utilizan la textura PBR Ground 06: Base Color, Normal GL, Roughness y Ambient Occlusion.
- Se eliminó el material antiguo con vertex colors que teñía la superficie y ocultaba parte del mapa de tierra.
- Las coordenadas UV se calculan por distancia física para evitar repeticiones excesivas y mantener una escala coherente.
- El material PBR se comparte entre todos los tramos para reducir consumo y llamadas de dibujo.
- Se mantienen los trazados centrales y las zonas de exclusión de vegetación para conservar las conexiones existentes con el puente y los destinos.
- Pendiente de validación visual: comprobar que las uniones con el puente y el terreno no floten ni se hundan, que la escala de Ground 06 sea legible y que no aparezcan huecos en las curvas.
