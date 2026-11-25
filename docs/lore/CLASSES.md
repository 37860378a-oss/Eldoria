# Clases y caminos de aventura
## Documento de diseño jugable — versión 0.1

Las clases representan formas de afrontar los peligros de Eldoria. No son castas ni destinos impuestos por el nacimiento. Un personaje puede aprender un oficio, cambiar de maestro o descubrir técnicas fuera de su tradición.

El objetivo inicial es ofrecer roles reconocibles para un MMORPG clásico, con identidad propia y espacio para futuras especializaciones.

## Principios de diseño

- Las ocho clases iniciales estarán disponibles para todos los pueblos.
- Cada clase debe poder jugar en solitario, aunque algunas serán más eficaces en grupo.
- Los roles de grupo se definirán con claridad: defensa, daño, apoyo y control.
- Las especializaciones se desbloquearán más adelante; no se crearán subclases vacías desde el primer prototipo.
- Las habilidades tendrán nombres y efectos legibles, con animaciones moderadas para mantener el rendimiento en PC modestos y Android.
- Ninguna clase dependerá de efectos visuales costosos para comunicar que una habilidad funcionó.

## 1. Guardián

**Rol principal:** defensa y protección.  
**Arquetipo:** combatiente disciplinado que mantiene la posición y protege a sus compañeros.  
**Armas:** espada y escudo, maza y escudo, armas de asta; algunas técnicas con arma a dos manos.

El Guardián domina la posición, el bloqueo y la provocación de enemigos. Puede resistir golpes y crear oportunidades para que el grupo actúe con seguridad.

**Identidad de juego:** atraer amenazas, proteger aliados cercanos, interrumpir ataques y controlar espacios.

**Caminos futuros posibles:**
- Bastión: máxima protección y control defensivo.
- Juramentado: defensa combinada con apoyo y protección mágica.
- Rompelineas: defensa agresiva y presión sobre varios enemigos.

## 2. Guerrero

**Rol principal:** daño físico y combate frontal.  
**Arquetipo:** luchador versátil que convierte la experiencia de batalla en fuerza.  
**Armas:** espadas, hachas, mazas, armas de asta y armas a dos manos.

El Guerrero se adapta al ritmo del combate. Puede concentrarse en un objetivo, golpear a varios enemigos o resistir lo suficiente para seguir luchando, pero no sustituye al Guardián como especialista defensivo.

**Identidad de juego:** generación y gasto de ímpetu, golpes contundentes, interrupciones y ataques de área limitados.

**Caminos futuros posibles:**
- Arma doble: velocidad y presión constante.
- Coloso: golpes pesados y daño de área.
- Veterano: equilibrio entre resistencia y daño.

## 3. Explorador

**Rol principal:** daño a distancia y utilidad de campo.  
**Arquetipo:** rastreador que conoce el terreno y prepara cada enfrentamiento.  
**Armas:** arcos, ballestas, armas ligeras y trampas.

El Explorador puede atacar desde lejos, rastrear criaturas y preparar trampas. Su conocimiento del entorno ayuda a descubrir rutas, recursos y señales que otros pasan por alto.

**Identidad de juego:** distancia, preparación, movilidad y control mediante trampas. Las mascotas, si se incorporan, serán una rama opcional y no una obligación de la clase.

**Caminos futuros posibles:**
- Tirador: precisión y daño a un objetivo.
- Trampero: control del terreno y daño preparado.
- Compañero salvaje: vínculo con una criatura aliada.

## 4. Acechador

**Rol principal:** daño físico, infiltración y utilidad.  
**Arquetipo:** especialista en aprovechar aperturas y elegir cuándo entrar en combate.  
**Armas:** dagas, espadas cortas, hojas ligeras y herramientas.

El Acechador utiliza sigilo, engaños, venenos ficticios del mundo y ataques oportunistas. No debe ser invisible de forma permanente ni dominar todos los enfrentamientos por iniciar primero.

**Identidad de juego:** posicionamiento, recursos de preparación, interrupciones y daño concentrado.

**Caminos futuros posibles:**
- Sombra: infiltración y emboscada.
- Duelista: combate cercano y movilidad.
- Saboteador: trampas, distracciones y debilitamientos.

## 5. Arcanista

**Rol principal:** daño mágico y control.  
**Arquetipo:** estudioso de las fuerzas de Aliento y Eco.  
**Armas:** bastones, varas, grimorios y focos arcanos.

El Arcanista aprende a moldear energía mediante estudio y práctica. Puede especializarse en fuego, hielo, viento, ilusiones o combinaciones limitadas. La magia poderosa exige concentración y gestión de recursos.

**Identidad de juego:** hechizos a distancia, áreas de efecto, control y vulnerabilidad cuando un enemigo logra acercarse.

**Caminos futuros posibles:**
- Llama: daño explosivo y presión de área.
- Escarcha: ralentización y control.
- Velo: ilusiones, Eco y manipulación de percepción.

## 6. Custodio

**Rol principal:** curación, apoyo y protección natural.  
**Arquetipo:** guardián de los ciclos de Raíz y conocedor de la vida.  
**Armas:** bastones, mazas ligeras, talismanes y escudos pequeños según camino.

El Custodio cura heridas, fortalece aliados y utiliza fuerzas naturales para proteger o limitar a sus enemigos. No todos pertenecen al Pacto del Verdor: existen custodios de aldeas, viajeros, estudiosos y guardianes independientes.

**Identidad de juego:** curación directa y gradual, bendiciones, limpieza de ciertos efectos y control natural moderado.

**Caminos futuros posibles:**
- Sanador: curación y apoyo de grupo.
- Guardarraíz: protección, resistencia y control.
- Cambiante: formas naturales temporales y combate cercano, si el sistema de transformaciones resulta viable.

## 7. Tejedor de Runas

**Rol principal:** apoyo, preparación y daño mágico táctico.  
**Arquetipo:** artesano que inscribe patrones de poder en objetos y superficies.  
**Armas:** martillos ligeros, bastones, focos y armas rúnicas.

El Tejedor de Runas combina conocimiento artesanal con magia estructurada. Sus runas pueden reforzar equipo, crear marcas temporales, proteger zonas o activar efectos preparados. La clase no reemplaza las profesiones de fabricación: su identidad está en usar runas durante la aventura.

**Identidad de juego:** preparación táctica, marcas, barreras y mejoras temporales. Las runas deben ser visibles y comprensibles, sin llenar la pantalla de efectos.

**Caminos futuros posibles:**
- Inscriptor: mejoras y apoyo.
- Vinculador: barreras y protección.
- Quebrarrunas: daño y debilitamiento de enemigos.

## 8. Bardo

**Rol principal:** apoyo, control y daño flexible.  
**Arquetipo:** viajero que conserva historias y altera el ánimo del combate mediante ritmo, voz e instrumentos.  
**Armas:** espadas ligeras, instrumentos, dagas y focos sonoros.

El Bardo no es un músico cómico ni un lanzador de canciones sin contexto. Sus relatos y melodías transmiten técnicas aprendidas de distintas culturas. En combate puede animar aliados, confundir enemigos y mantener la cohesión del grupo.

**Identidad de juego:** efectos de apoyo temporales, control moderado y flexibilidad. Las habilidades no reproducirán música comercial; usarán sonidos originales del juego.

**Caminos futuros posibles:**
- Trovador: apoyo y fortalecimiento de aliados.
- Ilusionista: engaño y control.
- Heraldo: inspiración y combate cercano.

## Roles de grupo

| Rol | Clases principales | Función |
|---|---|---|
| Defensa | Guardián, Guerrero (camino futuro) | Mantener amenazas y proteger |
| Daño físico | Guerrero, Explorador, Acechador | Eliminar objetivos |
| Daño mágico | Arcanista, Tejedor de Runas | Daño, control y debilitamiento |
| Curación y apoyo | Custodio, Bardo, Tejedor de Runas | Mantener al grupo y mejorar sus opciones |
| Control | Arcanista, Explorador, Acechador, Bardo | Limitar movimientos y oportunidades enemigas |

Los roles no serán exclusivos. Las especializaciones podrán ampliar las funciones secundarias sin convertir cada clase en una copia de otra.

## Recursos de combate propuestos

- **Ímpetu:** recurso de Guerrero y algunas técnicas físicas; se genera al combatir y se gasta en ataques potentes.
- **Concentración:** recurso de Explorador y Acechador para técnicas preparadas.
- **Maná:** recurso de Arcanista, Custodio y Tejedor de Runas.
- **Inspiración:** recurso del Bardo para sostener efectos y ejecutar habilidades especiales.
- **Guardia:** estado o recurso defensivo del Guardián, ligado a bloqueo, postura y protección.

Estos nombres son provisionales. La implementación debe priorizar una interfaz simple y legible.

## Progresión y aprendizaje

La clase se elige al crear el personaje, pero su identidad se desarrolla con maestros, libros, desafíos y práctica. Las habilidades básicas se aprenden durante los primeros niveles; las técnicas avanzadas requieren decisiones y aventuras concretas.

No se debe obligar al jugador a viajar a una capital lejana para aprender cada habilidad básica. Las aldeas iniciales tendrán instructores o tablones de aprendizaje suficientes para comenzar.

## Reglas de equilibrio

1. Cada clase debe tener herramientas para sobrevivir en solitario.
2. Ninguna clase debe ser la mejor en daño, defensa, curación y control al mismo tiempo.
3. El equipo mejora el estilo elegido, pero no elimina las debilidades de la clase.
4. El control de masas tendrá límites claros, especialmente en PvP.
5. Las habilidades de área tendrán costes, tiempos de reutilización o riesgos adecuados.
6. Los efectos visuales serán breves y económicos; la lectura del combate estará por encima del espectáculo.

## Orden recomendado de implementación

Para el primer prototipo no construiremos las ocho clases completas. Se implementarán tres estilos para validar el combate:
1. Guerrero: combate cuerpo a cuerpo básico.
2. Explorador: combate a distancia y objetivo seleccionado.
3. Custodio: curación y apoyo.

Después se añadirá el Guardián para validar el rol de tanque y se ampliará el resto de forma modular.
