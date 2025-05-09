<template>
    <h1>Capítulo 6: Pokémon</h1>
    <p>Las criaturas mágicas conocidas como Pokémon son, junto a los personajes, los protagonistas de las
        campañas de PRA. Para que el sistema sea lo más inmersivo posible, los Pokémon y personajes pueden
        interactuar entre sí y tienen los mismos tipos de estadísticas.</p>
    <p>
        Las Estadísticas de un Pokémon recién capturado dependen de su especie y de ciertas decisiones que puede
        que el DJ ya haya tomado o que te deje tomar por ti mismo. Por lo general, el DJ decide, al menos, el <span
            class="negrita">Nivel</span>
        del Pokémon, su <span class="negrita">Naturaleza</span>, sus <span class="negrita">Mejoras de
            Estadísticas</span>,
        los Movimientos que conoce y sexo del Pokémon y
        el Jugador se encarga del resto de decisiones a tomar. Este capítulo proporciona una guía completa sobre
        cómo gestionar tus Pokémon y las mecánicas relacionadas. Se tratarán, por lo tanto, el como interpretar y
        usar las <span class="negrita">entradas de la Pokédex</span>, el cómo hacer las <span class="negrita">fichas de
            tus
            Pokémon</span>, la progresión y <span class="negrita">subidas de nivel</span> de
        los Pokémon, los <span class="negrita">Niveles de Amistad</span> entre entrenador y Pokémon y las formas de
        <span class="negrita">capturar</span>, <span class="negrita">intercambiar</span> y
        <span class="negrita">liberar</span> Pokémon
    </p>

    <details open id="sec1">
        <summary>
            ¿Cuántos Pokémon llevo?

        </summary>
        <div class="detailsBloque">
            <p>En la mayoría de los mundos Pokémon, los
                Entrenadores pueden llevar consigo un <strong>máximo de
                    6 Pokémon</strong> mientras viajan. La razón de esta
                restricción puede variar según el mundo en el que
                juegues y las consecuencias de no cumplirla
                también dependen de esto, si es que es tan siquiera
                posible. Además, tu DJ puede decidir también
                limitar o ampliar esta limitación en función de su
                campaña, aunque se recomienda no superar esta
                cifra, puesto que tener más de seis Pokémon hace
                los combates excesivamente largos y puede hacer
                demasiado tedioso el controlar los recursos
                disponibles para cada Pokémon</p>

            <p>Por lo general, los Pokémon adicionales más allá
                del límite de 6 son automáticamente teleportados
                en sus Poké Balls a un Centro Pokémon para su
                almacenamiento o al Profesor Pokémon de turno.
                Todos los Pokémon de un Entrenador están
                registrados en un ID de Entrenador que les permite
                recuperar digitalmente a sus Pokémon y demostrar
                su propiedad.</p>
        </div>
    </details>

    <details open id="sec2">
        <summary>
            Las entradas de la Pokédex
        </summary>
        <div class="detailsBloque">
            <p>Acabas de elegir a tu primer Pokémon pero, ¿Cómo sabes que estadísticas tiene? ¿Qué Movimientos conoce?
                Para ver esta información, podrás hacer uso de su entrada en la Pokédex. En general, todos los Pokémon
                tienen unas Estadísticas Base específicas, tipos, Habilidades, y Movimientos que aprende, entre otros.
            </p>

            <p>La siguiente imagen es la entrada de la Pokédex de Pikachu y, bajo esta, está una explicación de cómo se
                debe
                leer la misma.</p>

            <div class="consejoCapitulo">
                <p>Temporal: Añadir final una vez tengamos la pokedex</p>
                <img src="/src/assets/img/temporal.jpg" alt="" width="200px">
            </div>

            <p><strong>Estadísticas Base</strong>: Se da una lista de las
                Estadísticas Base del Pokémon, es decir, las que
                tiene sin que le afecte ningún modificador,
                Habilidad o Dote.
            </p>
            <p><strong>Tiradas de Salvación</strong>: Todos los Pokémon son, al
                menos, Buenos en todas las Tiradas de Salvación.
                Si una Estadística tiene una “☆”, el Pokémon es
                Experto en la Tirada de Salvación asociada a dicha
                Estadística. Si tiene un “★”, es Maestro.</p>

            <p><strong>CA</strong>: La CA, o Clase de Armadura, es el valor que los
                ataques contra ti tienen que alcanzar para
                golpearte. Usualmente, se calcula según dice la
                Pokédex y es la suma de los valores descritos es el
                cálculo del CA de la Especie.</p>

            <p><strong>Vitalidad (VIT)</strong>: Es un valor asociado a los Puntos
                de Vida (PV) de los Pokémon.</p>

            <p><strong>Tipos</strong>: Enumera los tipos del Pokémon.</p>

            <p><strong>Habilidades</strong>: Enlista las <strong>Habilidades</strong> del Pokémon.
                Todos los Pokémon tienen todas sus Habilidades</p>

            <p><strong>Hab. Ocultas</strong>: Enlista las <strong>Habilidades Ocultas</strong> del
                Pokémon, a las que pueden acceder a sus
                Habilidades Ocultas usualmente mediante Dotes.
                Si en tu campaña no usas las Dotes, un Pokémon
                puede acceder a una de sus Habilidades Ocultas
                cambiándola por una de sus Habilidades al subir
                de Nivel cuando es de Nivel 10 o más.
            </p>

            <p><strong>Nat. Bueno</strong>: Es una lista de las Tiradas de Habilidad
                en las que el Pokémon es Naturalmente Bueno.
                Una criatura Naturalmente Bueno en una Tirada
                de Habilidad aumenta su Grado de Habilidad en
                dicha Habilidad en 1.
            </p>

            <p><strong>Velocidades</strong>: Da una lista de las velocidades del
                Pokémon. Las velocidades representan cuantos
                metros pueden moverse los Pokémon en una ronda
                de combate, ya sea corriendo, volando o nadando.
            </p>

            <p><strong>Sentidos</strong>: Describe si tiene algún sentido especial.
                Puedes leer más sobre estos en el Capítulo 9.
            </p>

            <p><strong>Niv. Min. (Nivel mínimo de aparición)</strong>: Representa el
                mínimo que puede tener el Pokémon.</p>

            <p><strong>Evoluciona de y en</strong>: Aclara de quién es evolución y
                en qué Pokémon puede <strong>Evolucionar</strong>, junto a las
                condiciones necesarias para que esto ocurra
            </p>

            <p><strong>El Tamaño</strong>, <strong>Dieta</strong>, <strong>Sexo</strong> que puede tener,
                <strong>Hábitat</strong> y
                <strong>Captura</strong> (o <strong>Ratio de Captura</strong>) son valores menos
                <strong>relevantes para la ficha y suficientemente auto</strong>
                explicativos.
            </p>

            <p><strong>Movimientos por nivel</strong>: Es una lista que describe
                qué Movimientos aprende el Pokémon al subir deNivel.
            </p>
        </div>
    </details>

    <details open id="sec3">
        <summary>
            Movimientos enseñables
        </summary>
        <div class="detailsBloque">
            <p>En la Pokédex hay una segunda sección bajo todas
                las entradas en la que se encuentran las Listas de
                Movimientos Enseñables de todos los Pokémon.
                Esta contiene los movimientos que el Pokémon
                puede aprender por MT, mediante Tutor o de
                cualquier otra forma
            </p>
        </div>
    </details>

    <details open id="sec4">
        <summary>
            Las fichas de tus Pokémon
        </summary>
        <div class="detailsBloque">
            <p>Ahora ya sabes como interpretar las entradas de
                las Pokédex pero, si te has fijado, en estas no
                aparece información sobre cuántos Puntos de Vida
                tienen tus Pokémon, por ejemplo. Este apartado
                explica como obtener el resto de valores que las
                fichas de tus Pokémon tienen, el cómo calcularlos
                y su utilidad.
            </p>

            <p>Los <strong>Puntos de Vida (PV)</strong> son una abstracción de la
                estamina y la cantidad de golpes que aún puede
                soportar un Pokémon. Ciertos efectos harán daño
                a tus Pokémon y esto reducirá sus PV. Cuando
                estos llegan a 0, caen inconscientes hasta que pase
                una cantidad de tiempo que determina tu DJ,
                usualmente unos minutos o un par de horas.
                Cuando despiertas, lo haces con 1 PV. La cantidad
                de PV que tienen los Pokémon al inicio del día, sus
                PV Máximos, se calcula de la misma forma que con
                los personajes. Es decir, con la siguiente fórmula:
            </p>

            <p>10+Nivel x (VIT+RES)</p>

            <p>El <strong>Bono de Habilidad (BH)</strong> de un Pokémon es la mitad
                de su Nivel (redondeado hacia arriba). Este
                representa lo capaz que es, tanto a la hora de
                Combatir y como a la hora de enfrentarse a
                problemas. Este BH afecta a gran cantidad de
                valores, como a los Bonos de Tiradas de Habilidad,
                Salvación y Ataque y a la CA del Pokémon
            </p>

            <p>Los bonos a las <strong>Tiradas de Salvación</strong> se calculan
                tal y como se describe en el Capítulo 2, en el
                apartado Grados de Habilidad y Bono de
                Habilidad.
            </p>

            <p>Los <strong>Puntos de Poder (PP)</strong> se calculan de la misma
                forma que para los personajes, sumando el Nivel
                del Pokémon a su Espíritu.
            </p>

            <p>Los bonos a las <strong>Tiradas de Habilidad</strong> se calculan
                tal y como se describe en el Capítulo 2, en el
                apartado Grados de Habilidad y Bono de
                Habilidad. Todos los Pokémon a Nivel 1 tienen
                Percepción e Iniciativa en Bueno y sobre esos se
                aplican las Tiradas en las que son Naturalmente
                Buenas y su Naturaleza.
            </p>

            <p>La <strong>Naturaleza</strong> de un Pokémon representa su
                personalidad, ya sea la que tiene de forma natural,
                la que las circunstancias de su entorno le han dado
                o, más usualmente, una mezcla de ambas. Cuando
                capturas un Pokémon, tu DJ te dice cual es su
                Naturaleza o te permite elegir de las que hay en la
                tabla inferior o inventar una propia. Cada
                naturaleza vuelve Naturalmente Bueno a un
                Pokémon en una Tirada de Habilidad si no lo era
                ya.
            </p>

            <div class="tablaNaturaleza">
                <table>
                    <tr>
                        <th>Naturaleza</th>
                        <td>Activa</td>
                        <td>Fuerte</td>
                        <td>Agitada</td>
                        <td>Tímida</td>
                        <td>Pícara</td>
                        <td>Cauta</td>
                        <td>Amable</td>
                        <td>Serena</td>
                        <td>Audaz</td>
                        <td>Alocada</td>
                        <td>Oblicua</td>
                        <td>Firme</td>
                        <td>Alegre</td>
                    </tr>
                    <tr>
                        <th>Habilidad</th>
                        <td>Atletismo</td>
                        <td>Combate</td>
                        <td>Acrobacias</td>
                        <td>Sigilo</td>
                        <td class="noSeparar">J. de manos</td>
                        <td>Investigación</td>
                        <td>Empatía</td>
                        <td>Percepción</td>
                        <td>Actuación</td>
                        <td>Actuación</td>
                        <td>Engaño</td>
                        <td>Intimidación</td>
                        <td>Persuasión</td>
                    </tr>

                </table>
            </div>
        </div>
    </details>

    <details open id="sec5">

        <summary>
            Progresión Pokémon
        </summary>
        <div class="detailsBloque">
            <p>De la misma forma que sus entrenadores, los
                Pokémon pueden progresar durante la aventura de
                diferentes formas. Cuando tu personaje sube de
                Nivel, puedes subir de Nivel a todos los Pokémon
                que lleve consigo si son de un Nivel inferior al que
                acabas de alcanzar. Además, cuando un Pokémon
                es varios niveles inferior a ti, este gana 1 Nivel extra
                por cada sesión que juegues en la que participe
                activamente (a discreción del DJ).</p>

            <p>Cuando un Pokémon sube de Nivel, gana PV de
                acuerdo con la fórmula, gana 1 PP extra y se
                recalculan todos los valores que dependen de su
                BH si este aumenta. También puede aprender
                Movimientos de acuerdo con su entrada de la
                Pokédex y, en ciertas ocasiones, reducir el coste en
                PP de sus Movimientos en 1 o mejorar su daño,
                conseguir Mejoras de Estadísticas y aumentar su
                Grado de Habilidad en 1 en una Habilidad. Además,
                si estáis usando las reglas de Dotes, también
                puede ganarlas en ciertos niveles.</p>

            <p>La siguiente tabla resume la cantidad de Dotes,
                Mejoras de Estadísticas (ME) y Aumentos de su
                Grado de Habilidad (AGH) que tiene un Pokémon
                según su Nivel e indica si aprende nuevos
                Movimientos.</p>
            <table class="tablaCapitulos progresionPokemon">

                <th>NIV</th>
                <th>Movimientos</th>
                <th>BH</th>
                <th>ME</th>
                <th>Dotes</th>
                <th>AGH</th>
                <tr>
                    <td>1</td>
                    <td>Movimientos</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Movimientos</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>-</td>
                    <td>2</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>Movimientos</td>
                    <td>2</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>-</td>
                    <td>3</td>
                    <td>2</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td>Movimientos</td>
                    <td>3</td>
                    <td>2</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td>-</td>
                    <td>4</td>
                    <td>2</td>
                    <td>2</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>8</td>
                    <td>Movimientos, reducción de costes en 1 PP</td>
                    <td>4</td>
                    <td>3</td>
                    <td>2</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>9</td>
                    <td>-</td>
                    <td>5</td>
                    <td>3</td>
                    <td>2</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>10</td>
                    <td>Movimientos</td>
                    <td>5</td>
                    <td>3</td>
                    <td>2</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>-</td>
                    <td>6</td>
                    <td>4</td>
                    <td>3</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>12</td>
                    <td>Movimientos, Aumento de daño</td>
                    <td>6</td>
                    <td>4</td>
                    <td>3</td>
                    <td>2</td>
                </tr>
                <tr>
                    <td>13</td>
                    <td>-</td>
                    <td>7</td>
                    <td>4</td>
                    <td>3</td>
                    <td>2</td>
                </tr>
                <tr>
                    <td>14</td>
                    <td>Movimientos</td>
                    <td>7</td>
                    <td>5</td>
                    <td>3</td>
                    <td>2</td>
                </tr>
                <tr>
                    <td>15</td>
                    <td>-</td>
                    <td>8</td>
                    <td>5</td>
                    <td>4</td>
                    <td>2</td>
                </tr>

                <tr>
                    <td>16</td>
                    <td>Movimientos, reducción de costes en 1 PP</td>
                    <td>8</td>
                    <td>5</td>
                    <td>4</td>
                    <td>2</td>
                </tr>
                <tr>
                    <td>17</td>
                    <td>-</td>
                    <td>9</td>
                    <td>6</td>
                    <td>4</td>
                    <td>2</td>
                </tr>

                <tr>
                    <td>18</td>
                    <td>Movimientos, Aumento de daño</td>
                    <td>9</td>
                    <td>6</td>
                    <td>4</td>
                    <td>3</td>
                </tr>
                <tr>
                    <td>19</td>
                    <td>-</td>
                    <td>10</td>
                    <td>6</td>
                    <td>5</td>
                    <td>3</td>
                </tr>
                <tr>
                    <td>20</td>
                    <td>Movimientos</td>
                    <td>10</td>
                    <td>7</td>
                    <td>5</td>
                    <td>3</td>
                </tr>
            </table>
        </div>
    </details>


    <details open id="sec6">
        <summary>
            Aprender Movimientos
        </summary>
        <div class="detailsBloque">
            <p>Cada vez que un Pokémon sube de Nivel, puede
                aprender nuevos Movimientos de su lista de
                Movimientos por Nivel si es de un Nivel suficiente. </p>

            <p>El <strong>máximo de Movimientos</strong> que puede conocer un
                Pokémon es igual a <strong>2 más su BH</strong> (máximo 8). </p>
            <p>Además, si la Mente de un Pokémon es de 4 o más,
                puede aprender 1 Movimiento extra o, si es de 8 o
                más, 2 Movimientos extra. </p>

            <p>Si un Pokémon ya ha alcanzado el máximo de
                Movimientos que puede conocer intenta aprender
                otro Movimiento (al subir de Nivel, usar Mts o
                mediante un tutor), puede olvidar un Movimiento
                para hacerlo.</p>

            <p>Si por algún Motivo se reduce la cantidad de
                Movimientos que puede Conocer un Pokémon,
                debe olvidar Movimientos hasta tener la cantidad
                adecuada la próxima vez que Descanse.
            </p>

            <div class="consejoCapitulo">
                <p> <strong>Consejo:</strong>
                    No hagas que tus Pokémon olviden todos sus
                    Movimientos que no les cuestan PP o, cuando se
                    queden sin PP, no podrán usar más Movimientos.</p>
            </div>
        </div>
    </details>



    <details open id="sec7">
        <summary>
            Mejoras de Daño

        </summary>
        <div class="detailsBloque">
            <p>En los Niveles 12 y 18 el daño base de los
                Movimientos que hacen daño del Pokémon
                aumenta en una cantidad igual a la Estadística
                asociada a dicho Movimiento. Es decir, si un
                Movimiento hace 4d8 + EST, pasa a hacer 4d8 + 2 x
                EST a Nivel 12 y 4d8 + 3 x EST a Nivel 18. </p>
        </div>
    </details>

    <details open id="sec8">
        <summary>
            Mejoras de Estadísticas
        </summary>
        <div class="detailsBloque">
            <p>Cada vez que un Pokémon recibe una Mejora de
                Estadísticas (ME), puedes aumentar una de sus
                Estadística en 1, hasta un máximo de 3 mejoras en
                la misma Estadística. Luego puede aplicar una
                cuarta y quinta ME para volver a aumentar esa
                Estadística en 1 más entre las dos. </p>

            <p>Al subir de Nivel, puedes cambiar que Estadística
                aumenta una de sus ME. </p>
        </div>
    </details>

    <details open id="sec9">
        <summary>
            Reentrenar
        </summary>
        <div class="detailsBloque">
            <p>Los Pokémon también pueden reenfocar su
                entrenamiento. Cada vez que un Pokémon sube de
                Nivel, puede cambiar uno de sus Aumentos de
                Grado de Habilidad y asignarlo a otra Habilidad y
                cambiar la Estadística que aumenta una de sus
                Mejoras de Estadísticas. </p>

            <p>Además, si la personalidad de un Pokémon cambia,
                ya sea por un evento específico o por un cúmulo de
                e vividos junto a su entrenador, su Jugador puede
                pedirle a su DJ cambiarle su Naturaleza.</p>
            <p>Por último, si estáis usando las Dotes y cuando el
                DJ lo indique, usualmente cuando los personajes se
                toman unos días de descanso, un Pokémon puede
                cambiar una de sus Dotes por otra.</p>
        </div>
    </details>

    <details open id="sec10">
        <summary>
            La Evolución Pokémon
        </summary>
        <div class="detailsBloque">
            <p>Además de subir de Nivel, los Pokémon pueden
                <strong>Evolucionar</strong>, un proceso casi instantáneo similar a
                una rápida metamorfosis. Los Pokémon que
                pueden evolucionar tienen en su entrada de la
                Pokédex información sobre a qué especie
                evolucionan y que requisitos tienen que cumplirse.
                Se dice que dos Pokémon comparten Familia
                Evolutiva cuando uno puede llegar a evolucionar a
                el otro eventualmente o cuando evolucionan de
                una misma especie.
            </p>

            <p>Cuando uno de tus Pokémon cumple los
                prerrequisitos para evolucionar, puedes elegir que
                evolucione. Como parte de la Acción compartida
                que entrenador y Pokémon toman para dar y
                recibir una Orden, el segundo puede evolucionar y
                automáticamente toma su nueva forma,
                adoptando sus nuevas Estadísticas, cambiando sus
                Tipos, Habilidades y otros rasgos que posea a los
                de su forma evolucionada y recuperando la mitad
                de sus PV y PP. </p>

            <p>Además, al evolucionar un Pokémon puede ganar
                Acceso a Nuevos Movimientos y perder acceso a
                otros. Cuando un Pokémon Evoluciona, reeliges
                todos los Movimientos que conoce entre los de su
                Nueva Lista de Movimientos por Nivel para los que
                es del nivel adecuado y los Movimientos de su Lista
                de Movimientos Enseñables que conocía y aún
                están en esta. </p>


            <div class="consejoCapitulo">
                <p> <strong>Nota:</strong>
                    Si quieres hacer que tu Pokémon evolucione
                    en mitad de una Escena, especialmente de un
                    combate, deberías tener su ficha preparada para
                    esto, pues el cambio de Estadísticas, Habilidades y
                    Movimientos podría ralentizar mucho la sesión.</p>
            </div>
        </div>
    </details>

    <details open id="sec11">
        <summary>
            La Amistad
        </summary>
        <div class="detailsBloque">
            <p>En el Mundo Pokémon, los entrenadores crean vínculos con sus Pokémon. Estos vínculos son ampliamente
                diversos y complejos, por lo que no siempre tienen que tener un aspecto similar entre sí y pueden
                cambiar
                con
                el paso del tiempo. La <strong>Amistad</strong> que un Pokémon siente hacia su entrenador representa lo
                cercanos que son y
                está clasificada en niveles que no son estrictos. Estos niveles van de 0 a 6 y los Pokémon recién
                capturados
                en suelen encontrarse en el nivel 2, aunque esto puede variar en función de lo que ocurriese antes de la
                captura. </p>

            <p>Los niveles de amistad pueden aumentar gracias al buen trato, el tiempo de calidad pasado juntos o la
                lucha
                contra la adversidad como un equipo, pero también puede perderse si el Pokémon se ve dejado de lado, es
                maltratado o si se le fuerza a hacer muchas cosas que no desea hacer. </p>



            <table class="tablaAmistad">
                <tr>
                    <th>Nivel 0: Odio</th>
                    <td>
                        <ul>
                            <li> El Pokémon se muestra hostil hacia su entrenador. </li>
                            <li> Puede desobedecer órdenes, atacar al entrenador o intentar huir. </li>
                            <li> Se necesita trabajar mucho en la relación para cambiar esta actitud.</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>Nivel 1: Desconfianza</th>
                    <td>
                        <ul>
                            <li> El Pokémon muestra poco interés en seguir las órdenes y es difícil de entrenar.</li>
                            <li> Aunque no ataca al entrenador, evita el contacto cercano. </li>
                        </ul>
                    </td>
                </tr>
                <tr>

                    <th>Nivel 2: Aceptación</th>
                    <td>
                        <ul>
                            <li>El Pokémon sigue las órdenes, pero de manera un tanto mecánica.</li>
                            <li>Muestra una actitud neutral hacia su entrenador, sin mucha interacción más allá
                                del entrenamiento.</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>Nivel 3: Amistad</th>
                    <td>
                        <ul>
                            <li>El Pokémon responde de manera más entusiasta a las órdenes del entrenador.</li>
                            <li>Muestra signos de apego y cuidado, aunque aún hay espacio para mejorar la
                                relación.</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>Nivel 4: Conexión</th>
                    <td>
                        <ul>
                            <li>El Pokémon ve al entrenador como su autoridad y compañero más cercano.</li>
                            <li>Existe una relación cercana con el Pokémon buscando activamente la interacción
                                y apoyo del entrenador.</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>Nivel 5: Lealtad</th>
                    <td>
                        <ul>
                            <li>El Pokémon y el entrenador se entienden y confían el uno en el otro.</li>
                            <li>El Pokémon está dispuesto a hacer cualquier cosa por el entrenador.</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>Nivel 6: Inseparables</th>
                    <td>
                        <ul>
                            <li>El Pokémon y el entrenador son inseparables.</li>
                            <li>Se comunican tan bien que el Pokémon puede recibir Órdenes con meros gestos.</li>
                            <li>El Pokémon se preocupa más por el bienestar de su entrenador que por el suyo.</li>
                        </ul>
                    </td>
                </tr>
            </table>

            <p>Es importante tener en cuenta que estas descripciones son flexibles y buscan ser una guía más que una
                regla
                estricta y sólo dictaminan como tu DJ roleará tus interacciones con tus Pokémon. Cuando necesites saber
                el
                nivel de amistad que tiene tu personaje con un Pokémon simplemente pregúntale a tu DJ, este juzgará
                vuestra
                relación y te dirá el nivel actual y podría aconsejarte sobre cosas que considera que podrían ayudar a
                mejorar vuestra relación para aumentar su nivel. </p>
        </div>
    </details>

    <details open id="sec12">
        <summary>
            Capturar
        </summary>
        <div class="detailsBloque">
            <p>A lo largo de tus aventuras, encontrarás diversas
                situaciones en las que puedas añadir nuevos
                Pokémon a tu equipo. A este acto de obtener
                nuevos compañeros Pokémon se le llama <strong>Capturar</strong>.
                Hay diferentes formas de Capturar Pokémon. </p>

            <p>El tipo de captura más común es capturar
                <strong>lanzando una Poké Ball</strong>. Las Poké Ball son esferas
                algo más pequeñas que un puño, en parte
                tecnológicas y en parte mágicas, que pueden
                contener a un Pokémon en su interior y que crean
                una conexión entre entrenador y Pokémon que les
                permite comprenderse con mayor facilidad. Para
                que una Poké Ball pueda intentar capturar a un
                Pokémon primero debe tocarlo, lo que usualmente
                se
                consigue lanzando la Poké Ball. Los
                entrenadores pueden <strong>Lanzar Poké Balls</strong> como una
                Acción a una distancia en metros igual a 5 más su
                Fuerza. Si el Pokémon no pertenece a otro
                entrenador, entra a la Poké Ball , aunque esto no
                significa que ya haya sido capturado, pues aún
                puede escapar. Luego de que el Pokémon entre a
                la Poké Ball, el entrenador debe hacer una Tirada
                de <strong>Trato Pokémon (Presencia)</strong> cuya CD se calcula
                de la siguiente forma:
            </p>

            <p>
                Ratio de Captura + Nivel + PV restantes / 10
            </p>

            <p>Esta dificultad puede aumentar o disminuir en
                función de la predisposición del Pokémon a ser
                capturado por el entrenador (a discreción del DJ).
                Si la tirada supera dicha dificultad, el Pokémon es
                capturado y queda en la Poké Ball. Si falla, el
                Pokémon escapa de esta, rompiéndola en el
                proceso y, en ciertas ocasiones, un Pokémon puede
                dejarse capturar sin necesidad de realizar una
                Tirada. </p>

            <p>También hay algunos métodos menos tradicionales
                de captura, como son restaurar fósiles o el caso de
                la eclosión de un huevo Pokémon.</p>

            <p><strong>Restaurar fósiles</strong> requiere de un equipo
                tecnológico que normalmente no estará a
                disposición de los personajes en todo momento,
                sino que lo encontrarán en lugares específicos.
                Usualmente, laboratorios dedicados a este
                objetivo. Un jugador que lleve un fósil a restaurar
                automáticamente se vuelve el entrenador del
                Pokémon restaurado y deberá aportar una Poké
                Ball para que lo contenga. </p>

            <p>Dos Pokémon de distinto sexo que pertenecen a
                Especies que tienen cierta similitud (a discreción
                del DJ) pueden reproducirse y la hembra genera un
                huevo después una jornada. Este huevo contiene
                una cría de la primera fase evolutiva de la madre y
                se abre en una cantidad de semanas igual al nivel
                mínimo en el que un Pokémon de esa Familia
                Evolutiva puede alcanzar uno de sus Estados
                finales. Cuando un Pokémon nace al <strong>eclosionar de
                    su huevo</strong>, estará especialmente predispuesto a ser
                capturado o será demasiado débil para evitar que
                ocurra, por lo que con sólo tocarlos con una Poké
                Ball quedarán capturados.</p>
        </div>
    </details>

    <details open id="sec13">
        <summary>
            Intercambiar y liberar Pokémon
        </summary>
        <div class="detailsBloque">
            <p>Algunos entrenadores pueden llegar a querer
                intercambiar sus Pokémon con los de otro
                entrenador. Llegado este caso, el DJ establece el
                cómo puede darse este intercambio. Quizás sea
                necesaria una máquina para hacerlo o quizás con
                darse las Poké Balls que contienen a los Pokémon
                sea suficiente. </p>

            <p>Además, un entrenador también puede querer
                dejar libre a un Pokémon. Cuando quiera hacerlo,
                simplemente debe romper la Poké Ball que
                usualmente contiene al Pokémon. Cuando un
                Pokémon es liberado de esta forma, este vuelve a
                considerarse un Pokémon salvaje y puede ser
                capturado por otro entrenador. </p>

        </div>
    </details>

    <details open id="sec14">
        <summary>
            Pokémon Variocolor

        </summary>
        <div class="detailsBloque">
            <p>Los Pokémon variocolor son Pokémon extremadamente raros que podrás encontrar en
                contadas ocasiones. No poseen ninguna propiedad
                destacable más allá de tener una paleta de colores
                completamente distinta a la usual y que, en
                ocasiones, brillan con tenues chispas de luz. </p>

            <p>Si encuentras uno intenta atraparlo, pues son muy codiciados. </p>
        </div>
    </details>

    <details open id="sec15">
        <summary>
            Poké-Monturas
        </summary>
        <div class="detailsBloque">
            <p>Si la fisionomía de un Pokémon lo permite y es de
                un tamaño mayor o igual al de su entrenador, este
                puede dejarse montar. Cuando esto ocurre, se
                refiere al Pokémon como <strong>Montura</strong> y al entrenador
                como <strong>Montador</strong>. Una Montura puede quedar
                Levemente sobrecargada o Sobrecargada al llevar
                a su Montador encima.</p>

            <p>Montarse o desmontarse de un Pokémon es parte
                de la Acción Compartida que se toma para dar una
                Orden al Pokémon o una Acción. Además, la
                Montura sólo puede moverse si el Montador le ha
                dado una Órden o si usa su Acción para indicarle a
                donde moverse. </p>

            <p>Si un efecto mueve al Montador o la Montura
                queda tumbada, el primero cae de la Montura,
                quedando tumbado a no ser que supere una tirada
                de Atletismo (Fuerza) o Acrobacias (Agilidad) CD
                10. </p>

            <p>Cuando una Montura carga con su entrenador,
                puede que algunos de sus Movimientos no puedan
                usarse. Por ejemplo, un Machoke que carga su
                entrenador en brazos no podría usar Tajo Cruzado
                porque no tiene las manos libres para hacerlo. </p>

            <p>Si una montura genera un ataque de oportunidad,
                este puede lanzarse contra el Montador si está a
                rango de ser atacado por un Movimiento cuerpo a
                cuerpo</p>
        </div>
    </details>

    <details open id="sec16">
        <summary>
            Megaevolución
        </summary>
        <div class="detailsBloque">
            <p>La <strong>Megaevolución</strong> es un proceso mediante el cual
                un Pokémon puede alcanzar temporalmente una
                forma evolucionada de sí mismo incluso tras haber
                alcanzado su forma final, extrayendo poder de su
                conexión con su entrenador, que es canalizada a
                través de una <strong>Megapiedra</strong> asociada a su especie
                que debe llevar el Pokémon encima y un <strong>Mega
                    abalorio</strong>, que debe llevar el entrenador, aunque en
                ocasiones extrañas puede ocurrir sin un Mega
                abalorio a un Pokémon salvaje. </p>

            <p>Para poder Megaevolucionar, la Amistad de un
                Pokémon con su entrenador debe ser de nivel 5
                como mínimo. </p>

            <p>Al igual que la evolución, como parte de la Acción
                Compartida que toman Entrenador y Pokémon
                para dar y recibir una Orden, un Pokémon puede
                Megaevolucionar a su Pokémon, el cual
                automáticamente toma su nueva forma,
                adoptando nuevas Estadísticas, pudiendo cambiar
                sus Tipos, y ganar una Habilidad, una nueva forma
                de calcular su CA, nuevas Velocidades y Sentidos.
                Esta información se encuentra detallada en las
                entradas de la Pokédex de las especies que pueden
                Megaevolucionar. </p>

            <p>Además, al Megaevolucionar un Pokémon se libera
                de todos los Estados que lo afligen, se ganan 100
                Puntos de Escudo y el daño base de todos su
                Movimientos aumenta en 2 dados. </p>

            <p>Un Pokémon Megaevolucionado vuelve a su estado
                natural al final de una Escena, cuando cae a 0 PV
                o cuando su entrenador use una Acción para que
                esto ocurra. La Megaevolución es un proceso duro,
                tanto entrenador como Pokémon, así que, cuando
                este estado acaba tanto entrenador como
                Pokémon ganan 2 Niveles de Fatiga y, además, ni
                el Pokémon puede volver a Megaevolucionar hasta
                que Descanse ni el entrenador puede hacer
                Megaevolucionar a otro Pokémon hasta lo haga.</p>

            <p>Una excepción a la regla de requerir una
                Megapiedra es el caso de Mega Rayquaza, que se
                transforma cuando va a usar Ascenso Draco pero
                antes de ejecutar el Movimiento y sin entrenador. </p>

            <p>En ciertas ocasiones, un Pokémon que tiene su
                megapiedra puede verse afectado por un evento
                que emule la energía que su entrenador le daría
                para poder Megaevolucionar. En estos casos, el
                Pokémon no puede ser capturado hasta ser
                derrotado y la Megaevolución hace que pierda
                completamente el control y empiece a atacar a
                todo a su alrededor. </p>
        </div>
    </details>

    <details open id="sec17">
        <summary>
            Regresiones Primigenias

        </summary>
        <div class="detailsBloque">
            <p>Similares a las Megaevoluciones, las <strong>Regresiones
                    Primigenias</strong> son transformaciones temporales que
                algunos Pokémon Míticos pueden alcanzar que no
                representan un potencial oculto sino un poder
                antiguo que contienen que ahora ha quedado
                dormido. Para que un Pokémon obtenga su
                Regresión Primigenia usualmente este requerirá de
                un objeto o que se de un cierto evento. </p>

            <p>Para usar su Regresión Primigenia, un Pokémon usa
                su Acción y automáticamente toma su antigua
                forma, adoptando nuevas Estadísticas, pudiendo
                cambiar sus Tipos, y ganar una Habilidad, entre
                otros rasgos. Esta información también se
                encuentra detallada en las entradas de la Pokédex
                de las especies que pueden Megaevolucionar.</p>

            <p>Además, al obtener su regresión primigenia, un
                Pokémon se libera de hasta 1 Estado que lo aflige,
                gana 100 Puntos de Escudo y el daño base de todos
                su Movimientos aumenta en un dado. Un Pokémon
                vuelve a su estado natural al final de una Escena,
                cuando cae a 0 PV, o su entrenador, si lo tiene, usa
                una Acción para que esto ocurra. Un Pokémon sólo
                puede usar su Regresión Primigenia de nuevo hasta
                que Descanse. </p>
        </div>
    </details>

    <details open id="sec18">
        <summary>
            Movimientos Z
        </summary>
        <div class="detailsBloque">

            <p>Los <strong>Movimientos Z</strong> son un tipo especial de
                Movimiento de gran poder que utiliza la conexión
                entre entrenador y Pokémon. </p>

            <p>Los Movimientos Z sólo puede usarse en ciertas
                localizaciones del Mundo Pokémon y, para hacerlo,
                son necesarias cuatro condiciones: Que el nivel de
                Amistad entre entrenador y Pokémon sea de 5 o
                más, que el Pokémon lleve encima un <strong>Cristal Z</strong>
                asociado a su especie o conozca un Movimiento del
                Tipo Elemental asociado al Cristal Z, que el
                entrenador lleve una <strong>Pulsera Z</strong> y que ambos
                conozcan la danza ritual necesaria para usarlo, la
                cual pueden aprender de otras Criaturas o de
                escritos. </p>

            <p>Si se dan todas las condiciones anteriores, un
                entrenador puede dar una Orden a su Pokémon y
                usar su Acción para hacer junto a su Pokémon la
                danza del Cristal Z que lleva encima con su Acción
                mientras el entrenador también lo hace. Esto libera
                el Movimiento Z asociado al Cristal que lleva el
                Pokémon, el cual lo usa con su Acción como un
                Movimiento normal. Puedes encontrar los
                Movimientos Z en la Lista de Movimientos Z, en el
                Capítulo 11. </p>

            <p>Los Movimientos Z que hacen daño calculan la
                cantidad de dados que lanzan en base al BH del
                Pokémon que los usa. Esto se ve reflejado en su
                daño. </p>

            <p>Tras lanzar un Movimiento Z, un Pokémon no puede
                usar otro Movimiento Z hasta que Descanse y un
                entrenador no puede participar de uno de estos
                Movimientos hasta que también lo haga. Además,
                cuando el Pokémon caiga a 0 PV o deje de
                combatir, gana 1 Nivel de Fatiga a causa del
                esfuerzo generado por liberar la energía del
                Movimiento Z. </p>

            <p>En ciertas ocasiones, como por ejemplo durante un
                torneo importante, los Movimientos Z podrán
                utilizarse fuera de las regiones a las que suelen
                estar resrtingidos. Usualmente, esto se debe a que
                de alguna forma se ha contenido parte de esa
                energía y se está liberando en esa localización o
                cuando se crea de alguna forma una energía que
                emula su efecto.</p>
        </div>
    </details>

    <details open id="sec19">
        <summary>
            Dinamax y Gigamax

        </summary>
        <div class="detailsBloque">
            <p>El <strong>Dinamax</strong> y <strong>Gigamax</strong> son dos efectos que hacen
                que un Pokémon proyecte une versión gigantesca
                de si mismo de forma temporal que emite una luz
                rojiza. Esta proyección es completamente sólida,
                los Pokémon pueden controlarla como si fuese su
                propio cuerpo y aumenta las capacidades físicas
                del Pokémon considerablemente. </p>

            <p>La diferencia entre el Dinamax y el Gigamax es que
                el Gigamax sólo puede ser usado por algunos
                Pokémon, otorgándoles además un aspecto
                especial, y los Pokémon Dinamax simplemente se
                ven más grandes que su forma normal. </p>

            <p>Para poder usar el Dinamax y el Gigamax, un
                Pokémon debe contener <strong>Energía Dinamax</strong>,
                obtenida a través de exposición a la misma y su
                entrenador que debe llevar una <strong>Maxi muñequera</strong>.
                En algunas regiones del mundo Pokémon esta
                energía se obtiene en ciertos puntos particulares o
                nodos dinamax, en otros estará siempre en el
                ambiente y en la mayoría quizás nisiquiera esté
                presente y, por lo tanto, no pueda recargarse. </p>

            <p>Para usar el Dinamax o Gigantamax, un entrenador
                usa su Acción para devolver a su Pokémon a su
                Poké Ball para que absorba la Energía Dinamax de
                forma segura y luego saca al Pokémon de la Poké
                Ball en un punto a 10 metros de si mismo, el cual
                sale ya de esta Dinamaxeado o Gigamaxeado,
                según su especie. Luego de esto, el Entrenador
                puede dar órdenes con su Acción Compartida al
                Pokémon como de costumbre. La Energía Dinamax
                provoca los siguientes cambios al Pokémon: </p>

            <ul>

                <li>
                    <p>El Pokémon gana Puntos de Escudo
                        iguales a sus PV Máximos que duran
                        indefinidamente. Cuando el Pokémon se
                        queda sin estos Puntos de Escudo o es
                        devuelto a su Poké Ball, sale de su forma
                        Dinamax o Gigantamax. </p>
                </li>

                <li>
                    <p>Al final de cada uno de sus turnos, el
                        Pokémon reduce en 2 todos los Niveles de
                        los Estados Nivelados que lo aflijen. </p>
                </li>

                <li>
                    <p>Añade 2 dados al daño base de sus Movimientos. </p>
                </li>

                <li>
                    <p>Su tamaño aumenta en 4 metros en todas sus dimensiones.</p>
                </li>

            </ul>

            <p>Tras usar su forma Dinamax, un Pokémon no puede
                usarla de nuevo hasta que Descanse y la
                Maximuñequera necesita recuperarse con Energía
                Dinamax para poder volver a usarse. Además, un
                Pokémon que ha Dinamaxeado o Gigamaxeado
                gana 1 Nivel de Fatiga cuando el combate termina.</p>

            <p>Si un entrenador usa su Acción para Dinamaxear o
                Gigamaxear a su Pokémon pero no lo devuelve a su
                Poké Ball para hacerlo o cuando un Pokémon
                recibe un impacto directo de Energía Dinamax,
                como por ejemplo cuando un nodo de esta energía
                se abre muy cerca suya, se verá abrumado por esta
                y entrará en su forma Dinamax o Gigamax de
                forma descontrolada. Cuando esto ocurre, este
                Pokémon pierde el control totalmente y su poder
                puede aumentar incluso por encima de lo normal
                cuando entra en esta forma (a discreción del DJ),
                haciéndole ganar Puntos de Superioridad. Un
                Pokémon en este estado no puede ser capturado
                hasta que deje de estar Dinaxeado o Gigamaxeado,
                se vuelve muy agresivo y no acepta órdenes.</p>
        </div>
    </details>



    <details open id="sec20">
        <summary>
            Teracristalización
        </summary>
        <div class="detailsBloque">
            <p>La <strong>Teracristalización</strong> es un tipo de transformación
                que cambia los Tipos Elementales de un Pokémon
                a un nuevo Tipo Elemental de forma temporal.
                Cuando un Pokémon usa su Teracristalización su
                piel se recubre de cristales brillantes del color que
                usualmente se asocia al Tipo Elemental que toma. </p>

            <p>Para poder usar la Teracristalización, un Pokémon
                debe contener energía terastal. La cual puede
                obtener por exposición a esta o por usar un
                <strong>Teralito</strong>, de los que encontrarás más información
                en el Capítulo 8. Un Pokémon que tiene energía
                terastal tiene un Teratipo, usualmente el del
                Teralito que se ha usado sobre él u otro que obtuvo
                por exposición a la energía terastal.
            </p>

            <p>Un entrenador que tiene un <strong>Orbe Teracristal</strong> puede
                usar su Acción para sujetarlo en una mano y usarlo
                en uno de sus Pokémon que tiene energía terastal.
                Cuando esto ocurre, el Pokémon pierde sus Tipos
                Elementales y gana el Tipo Elemental asociado a
                la energía terastal que contiene. Cuando esto
                ocurre, no pierde el bono al daño que tenía para
                sus Tipos Elementales originales y gana un bono al
                daño del Tipo Elemental del que se vuelve igual a
                su BH. </p>

            <p>Además de poder tener energía teracristal de
                Tipos Elementales, hay un Tipo extra, el Tipo
                Astral. El Tipo Astral no recibe daño extra, reduce
                daño ni es inmune al daño de ningún Tipo
                Elemental. Además, aunque un Pokémon
                Teracristalizado a este tipo no gana ningún bono al
                daño, considera que todos sus Movimientos son
                súper efectivos contra los Pokémon Teracristalizados,
                independientemente de sus Tipos elementales. </p>

            <p>Un Pokémon deja de estar teracristalizado cuando
                cae a 0 PV, cuando la Escena acaba o cuando su
                entrenador usa su Acción para hacerlo. </p>

            <p>Un Pokémon que se ha teracristalizado no puede
                volver a hacerlo hasta la siguiente Escena y un
                entrenador sólo puede usar un Orbe Teracristal
                cuando este está cargado. En las regiones con
                energía Terastal en el ambiente, como Paldea, esto
                suele tardar una Escena. </p>

            <p>En ciertas ocasiones, un Pokémon que reciba un
                impacto de energía terastal se verá abrumado por
                esta y se Teracristalizará. Cuando esto ocurre, este
                Pokémon pierde el control totalmente, no puede
                ser capturado mientras está en este estado y no
                puede recibir órdenes. Además, un Pokémon que
                Teracristaliza de esta forma puede volverse muy
                poderoso de forma temporal, ganando Puntos de
                Superioridad (a discreción del DJ). </p>
        </div>
    </details>
</template>