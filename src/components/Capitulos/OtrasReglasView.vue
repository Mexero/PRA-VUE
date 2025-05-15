<template>
    <h1>Capítulo 10: Reglas Menores</h1>
    <p>
        En este capítulo hay una miscelánea de reglas que puedes decidir implementar
        o no en tus partidas. También se aclaran algunos conceptos que, aunque
        pueden ser obvios, en ocasiones pueden llevar a confusión. Particularmente,
        destaca la Sección de Estados, que será muy importante en los Combates
        Pokémon cuando se usen Movimientos que pueden provocarlos.
    </p>

    <details open id="apartado1">
        <summary>Estados</summary>
        <div class="detailsBloque">
            <p>
                En algunas situaciones, una criatura quedará afectada por algún
                <strong>Estado</strong>. Entre estos no sólo se encuentran los que
                usualmente se ven en los juegos, sino que hay algunos otros.
            </p>

            <p>
                En general, cuando un efecto impone un Estado, este aclara cuando acaba,
                aunque algunos estados tienen otras condiciones para acabar además de
                las que se especifiquen.
            </p>

            <p>
                Muchos Estados son <strong>Estados Nivelados</strong>. Esto significa
                que cuando un efecto otorga ese Estado a una criatura, también le otorga
                una cierta cantidad de Niveles del mismo. Al final de cada uno de sus
                turnos, una criatura reduce en 1 todos los Niveles de los Estados
                Nivelados que sufre y, si estos llegan a 0, deja de sufrir ese Estado.
                Además, cuando una criatura con Niveles de un Estado gana más niveles de
                este mismo Estado estos se suman.
            </p>

            <p>
                Por ejemplo, cuando una criatura que tiene 3 Niveles de Envenenado y 1
                Nivel de Furia termina su turno reduce sus Niveles de Envenenado se
                reducen a 2 y sus Niveles de Furia a 0 y, por lo tanto, deja de estar
                Enfurecido. Si luego esta criatura gana 2 Niveles de Envenenado, la
                criatura queda con 4 Niveles de Envenenado.
            </p>

            <div class="consejoCapitulo">
                <p>
                    <strong>Nota</strong>: Como una Pokémon termina su turno al volver a
                    su Poké Ball, este reduce todos sus Niveles de Estados Nivelados en 1
                    al hacerlo.
                </p>
            </div>

            <div class="estadosBloque">
                <div class="estados helado">
                    <div class="headerEstados">
                        <img src="../../assets/icons/HeladoIcon.webp" alt="Helado icono" width="25px" />
                        <h2>Helado</h2>
                    </div>

                    <p>
                        Helado es un <strong>Estado Nivelado</strong>. Por lo tanto, una
                        criatura se considera Helada mientras tenga
                        <strong>Niveles de Helado</strong>.
                    </p>

                    <p>
                        <strong>Tiritar</strong>. Una Criatura Helada sufre desventaja en
                        sus tiradas d20 de Mente, Espíritu y Presencia.
                    </p>

                    <p>
                        <strong>Quebradizo (3+)</strong>. Una Criatura que tiene 3 o más
                        Niveles de Helado la criatura reduce su CA en 1 y no puede ver su CA
                        aumentada por efectos de Movimientos o Habilidades.
                    </p>

                    <p>
                        <strong>Inmunidad</strong>. Las criaturas Tipo Hielo no pueden estar
                        Heladas.
                    </p>
                </div>

                <div class="estados quemado">
                    <div class="headerEstados">
                        <img src="../../assets/icons/QuemadoIcon.webp" alt="Quemado icono" width="25px" />
                        <h2>Quemado</h2>
                    </div>

                    <p>
                        Quemado es un <strong>Estado Nivelado</strong>. Por lo tanto, una
                        criatura se considera Quemada mientras tenga
                        <strong>Niveles de Quemado</strong>.
                    </p>

                    <p>
                        <strong>Quemaduras</strong>. Cuando una Criatura Quemada usa un
                        Movimiento que hace daño y hace una Tirada de Ataque cuerpo a cuerpo
                        con su Fuerza o Agilidad, este Movimiento gana la Etiqueta de
                        Retroceso si no la tiene y cuando la Criatura hace daño con este
                        Movimiento pierde una cantidad de PV iguales a ⅓ del daño realizado.
                    </p>

                    <p>
                        <strong>Debilidad (3+)</strong>. Una Criatura que tiene 3 o más
                        Niveles de Quemado el daño de sus Movimientos que usan Agilidad o
                        Fuerza se reduce a la mitad y, si estos hacen Tiradas de Ataque, no
                        pueden tener Ventaja en ellas.
                    </p>

                    <p>
                        <strong>Inmunidad</strong>. Las criaturas Tipo Fuego no pueden estar
                        Quemadas.
                    </p>
                </div>

                <div class="estados paralizado">
                    <div class="headerEstados">
                        <img src="../../assets/icons/ParalizadoIcon.webp" alt="Paralizado icono" width="25px" />
                        <h2>Paralizado</h2>
                    </div>

                    <p>
                        Paralizado es un <strong>Estado Nivelado</strong>. Por lo tanto, una
                        criatura se considera Paralizada mientras tenga
                        <strong>Niveles de Parálisis</strong>.
                    </p>

                    <p>
                        <strong>Lentitud</strong>. Una Criatura Paralizada no tiene Reacción
                        y todas sus Velocidades se reducen a la mitad.
                    </p>

                    <p>
                        <strong>Inmovilidad (3+)</strong>. Una Criatura que tiene 3 o más
                        Niveles de Paralizado pierde su Velocidad de Vuelo si la tenía y no
                        puede aumentar sus Velocidades ni moverse mediante Movimientos ni
                        Habilidades.
                    </p>

                    <p>
                        <strong>Inmunidad</strong>. Las criaturas Tipo Eléctrico no pueden
                        estar Paralizadas.
                    </p>
                </div>

                <div class="estados envenenado">
                    <div class="headerEstados">
                        <img src="../../assets/icons/EnvenenadoIcon.webp" alt="Envenenado icono" width="25px" />
                        <h2>Envenenado</h2>
                    </div>
                    <p>
                        Envenenado es un <strong>Estado Nivelado</strong>. Por lo tanto, una
                        criatura se considera Envenenada mientras tenga
                        <strong>Niveles de Envenenado</strong>.
                    </p>

                    <p>
                        <strong>Toxinas</strong>. Una Criatura Paralizada no tiene Reacción
                        y todas sus Velocidades se reducen a la mitad.
                    </p>
                    <p>
                        <strong>Letal</strong>Si una criatura cae a 0 PV por estar
                        envenenada, esta deja de estarlo y pasa a requerir de tratamiento
                        médico urgente, ganando 1 Nivel de Fatiga tras cada hora que pasa en
                        este estado.
                    </p>

                    <p>
                        El tratamiento requiere de Equipo Médico o Medicinas a discreción
                        del DJ y de una Tirada de Conocimiento Médico (Mente) con CD la del
                        efecto que envenenó a la criatura.
                    </p>

                    <p>
                        <strong>Enfermizo (3+)</strong>. Una Criatura que tiene 3 o más
                        Niveles de Envenenado tiene Desventaja en Tiradas de Salvación de
                        Resistencia.
                    </p>

                    <p>
                        <strong>Inmunidad</strong>. Una Criatura de Tipo Veneno o Acero no
                        puede quedar Envenenada
                    </p>
                </div>

                <div class="estados dormido">
                    <div class="headerEstados">
                        <img src="../../assets/icons/DormidoIcon.webp" alt="Dormido icono" width="25px" />
                        <h2>Dormido</h2>
                    </div>

                    <p>
                        Dormido es un <strong>Estado Nivelado</strong>. Por lo tanto, una
                        criatura se considera Dormida mientras tenga
                        <strong>Niveles de Dormido</strong>.
                    </p>

                    <p>
                        <strong>Dormido</strong>. Cuando una Criatura queda Dormida, cae
                        Inconsciente. Si esta Criatura recibe daño mientras está Dormida, se
                        despierta automáticamente y pierde todos sus Niveles de Dormido
                        restantes.
                    </p>

                    <p>
                        <strong>Sueño profundo (3+)</strong>. Una Criatura con 5 Niveles de
                        dormido o más no empieza a perder Niveles de dormido hasta el final
                        de la Escena.
                    </p>
                </div>

                <div class="estados confuso">
                    <div class="headerEstados">
                        <img src="../../assets/icons/ConfusoIcon.webp" alt="Confuso icono" width="25px" />
                        <h2>Confuso</h2>
                    </div>

                    <p>
                        Confuso es un <strong>Estado Nivelado</strong>. Por lo tanto, una
                        criatura se considera Confusa mientras tenga
                        <strong>Niveles de Confusión</strong>.
                    </p>

                    <p>
                        <strong>Inconsistente</strong>. Una Criatura Confusa tira 1d4 al
                        inicio de cada uno de sus turnos. Si tira un 1, debe utilizar su
                        Acción para golpearse a sí mismo usando uno de sus Movimientos que
                        no le cuestan PP contra sí misma.
                    </p>

                    <p>
                        <strong>Inestable (3+)</strong>. Una Criatura que tiene 3 o más
                        Niveles de Confusión tiene Desventaja en Tiradas de Salvación de
                        Espíritu y reduce el daño de los Movimientos que usa con su Mente a
                        la mitad.
                    </p>
                </div>

                <div class="estados infatuado">
                    <div class="headerEstados">
                        <img src="../../assets/icons/InfatuadoIcon.webp" alt="Infatuado icono" width="25px" />
                        <h2>Infatuado</h2>
                    </div>

                    <p>
                        Infatuado es un <strong>Estado Nivelado</strong>. Por lo tanto, una
                        criatura se considera Infatuada mientras tenga
                        <strong>Niveles de Infatuación</strong>.
                    </p>

                    <p>
                        <strong>Amistoso</strong>. Una Criatura Infatuada no puede atacar a
                        quien la infatuó ni hacer que sea el objetivo de sus Rasgos,
                        Habilidades o Movimientos dañinos.
                    </p>

                    <p>
                        <strong>Traicionado</strong>. Si una criatura Infatuada es atacada
                        por la criatura que la infatuó o por uno de sus Pokémon, esta pierde
                        todos sus niveles de Infatuado.
                    </p>
                </div>

                <div class="estados asustado">
                    <div class="headerEstados">
                        <img src="../../assets/icons/AsustadoIcon.webp" alt="Asustado icono" width="25px" />
                        <h2>Asustado</h2>
                    </div>

                    <p>
                        Asustado es un <strong>Estado Nivelado</strong>. Por lo tanto, una
                        criatura se considera Asustada mientras tenga
                        <strong>Niveles de Asustado</strong>.
                    </p>

                    <p>
                        <strong>Miedo</strong>. Una Criatura Asustada tiene Desventaja en
                        las Tiradas de Habilidad y las Tiradas de ataque que hace mientras
                        la fuente de su miedo se encuentre en su línea de visión.
                    </p>

                    <p>
                        <strong>Terror (3+)</strong>. Una Criatura que tiene 3 o más Niveles
                        de Asustado no puede acercarse a ninguna fuente de su miedo.
                    </p>
                </div>
                <div class="estados enfurecido">
                    <div class="headerEstados">
                        <img src="../../assets/icons/EnfurecidoIcon2.webp" alt="Enfurecido icono" width="25px" />
                        <h2>Enfurecido</h2>
                    </div>
                    <p>
                        Enfurecido es un <strong>Estado Nivelado</strong>. Por lo tanto, una
                        criatura se considera Enfurecida mientras tenga
                        <strong>Niveles de Furia</strong>.
                    </p>
                    <p>
                        <strong>Violento</strong>. Una criatura Enfurecida debe usar un
                        Movimiento que haga daño con su Acción a no ser que no posea ninguno
                        y está obligada a usarlo contra una Criatura que la Enfureció o, en
                        el caso de que afecte un área, que el área esté centrada sobre una
                        criatura que la Enfureció.
                    </p>
                    <p>
                        <strong>Descontrolado (3+)</strong>. Además, si una Criatura tiene 3
                        o más Niveles de Enfurecido, debe moverse hacia una de las causas de
                        su furia.
                    </p>
                    <p>
                        <strong>Cabeza de turco</strong>. Si una Criatura no tiene forma de
                        alcanzar o no puede golpear a una Criatura con la que está
                        enfurecido, también se considera enfurecido con el aliado más
                        cercano de la segunda y si está enfurecido con un Entrenador pero no
                        puede alcanzarlo se considera enfurecido contra sus Pokémon.
                    </p>
                </div>

                <div class="estados acalorado">
                    <div class="headerEstados">
                        <img src="../../assets/icons/AcaloradoIcon.webp" alt="Acalorado icono" width="25px" />
                        <h2>Acalorado</h2>
                    </div>
                    <p>
                        <strong>Precalentado</strong>. Una criatura Acalorada que recibe
                        daño de Tipo Fuego de un efecto, recibe 4 puntos más de daño y si
                        recibe daño de Tipo Fuego recibe 4 puntos de daño menos si recibe
                        daño de Tipo Agua y deja de estar acalorada.
                    </p>
                    <p>
                        <strong>Fatigado</strong>. Una criatura que pasa una hora Acalorada
                        gana un Nivel de Fatiga.
                    </p>
                    <p>
                        <strong>Frío o calor</strong>. Una criatura Acalorada que queda
                        Helada deja de estar acalorada. Una criatura Helada que queda
                        acalorada deja de estar Helada.
                    </p>
                    <p>
                        <strong>Refrescarse</strong>Una criatura acalorada puede tomar una
                        Acción para lanzarse agua o refrescarse de alguna otra forma para
                        dejar de estarlo.
                    </p>

                    <p>
                        <strong>Inmunidad</strong>Las criaturas Tipo Fuego no pueden estar
                        Acaloradas.
                    </p>
                </div>

                <div class="estados empapado">
                    <div class="headerEstados">
                        <img src="../../assets/icons/EmpapadoIcon.webp" alt="Empapado icono" width="25px" />
                        <h2>Empapado</h2>
                    </div>
                    <p>
                        <strong>Mojado</strong>. Una criatura Empapada que recibe daño de
                        Tipo Eléctrico de un efecto, recibe 4 puntos más de daño y si recibe
                        daño de Tipo Fuego recibe 4 puntos menos de daño y deja de estar
                        Empapada.
                    </p>
                    <p>
                        <strong>Al agua Ducklet</strong>. Una criatura que se sumerge en
                        agua queda Empapada.
                    </p>
                    <p>
                        <strong>Secarse</strong>. Una criatura empapada puede tomar una
                        Acción para secarse.
                    </p>
                </div>

                <div class="estados cegado">
                    <div class="headerEstados">
                        <img src="../../assets/icons/CegadoIcon.webp" alt="Empapado icono" width="25px" />
                        <h2>Cegado</h2>
                    </div>
                    <p>
                        Cegado es un <strong>Estado Nivelado</strong>. Por lo tanto, una
                        criatura se considera Cegada mientras tenga
                        <strong>Niveles de Cegado</strong>.
                    </p>
                    <p>
                        <strong>Invidente</strong>. Una criatura Cegada no puede ver y falla
                        automáticamente cualquier Tirada de Habilidad que requiera ver.
                    </p>
                    <p>
                        <strong>Ataques empeorados</strong>. Las Tiradas de ataque que se
                        hagan contra la criatura tienen Ventaja y las Tiradas de ataque que
                        haga la criatura tienen Desventaja.
                    </p>
                </div>
            </div>
            <h2>Estados más generales:</h2>
            <div class="estadosBloque">
                <div class="estados generico">
                    <div class="headerEstados">
                        <h2>Agarrado</h2>
                    </div>
                    <p>
                        <strong>Quieto</strong>. Las Velocidades de una criatura apresada
                        son 0, y esta no puede beneficiarse de ningún bonificador a sus
                        Velocidades.
                    </p>
                    <p>
                        <strong>Soltado</strong>. Una criatura Agarrada deja de estarlo si
                        un efecto la del alcance del agarrador o del efecto que la agarra.
                    </p>
                </div>

                <div class="estados generico">
                    <div class="headerEstados">
                        <h2>Apresado</h2>
                    </div>
                    <p>
                        <strong>Quieto</strong>. Las Velocidades de una criatura apresada
                        son 0, y esta no puede beneficiarse de ningún bonificador a sus
                        Velocidades.
                    </p>
                    <p>
                        <strong>Objetivo fácil</strong>. Las Tiradas de ataque que se hagan
                        contra la criatura tienen ventaja y las que haga la criatura tienen
                        desventaja.
                    </p>
                    <p>
                        <strong>Ataques empeorados</strong>. La criatura tiene Desventaja en
                        las Tiradas de Salvación de Agilidad.
                    </p>
                    <p>
                        <strong>Sin escape</strong>. La criatura no puede ser devuelta a su
                        Poké Ball.
                    </p>
                </div>

                <div class="estados generico">
                    <div class="headerEstados">
                        <h2>Ensordecida</h2>
                    </div>
                    <p>
                        <strong>Sordo</strong>. no puede oír, falla automáticamente
                        cualquier Tirada de Habilidad que requiera escuchar.
                    </p>
                    <p>
                        <strong>“¿Qué?”</strong>. Una criatura Enosrdecida es inmune a
                        Movimientos con la etiqueta de Sonido.
                    </p>
                </div>
                <div class="estados generico">
                    <div class="headerEstados">
                        <h2>Inconsciente</h2>
                    </div>
                    <p>
                        <strong>Sin acciones</strong>. Una criatura Inconsciente no puede
                        realizar acciones de ningún tipo ni tomar reacciones, no puede
                        moverse ni hablar y no se percata de lo que la rodea.
                    </p>
                    <p>
                        <strong>Sin fuerzas</strong>. La criatura deja caer cualquier cosa
                        que sujete, cae tumbada y falla todas las Tiradas de Salvación de
                        Fuerza y Agilidad.
                    </p>
                    <p>
                        <strong>Objetivo fácil</strong>. Las Tiradas de ataque que se hagan
                        contra la criatura tienen Ventaja y cualquier ataque que golpee a la
                        criatura es un golpe crítico si el atacante está a 1 metro o menos
                        de ella.
                    </p>
                </div>
                <div class="estados generico">
                    <div class="headerEstados">
                        <h2>Sorprendido</h2>
                    </div>
                    <p>
                        <strong>Apurado</strong>. Una Criatura que empieza su turno
                        Sorprendida debe elegir entre usar una Acción o su Movimiento y no
                        tiene Reacción.
                    </p>
                    <p>
                        <strong>Defensas bajas</strong>. Además, las Tiradas de Ataque
                        contra una criatura sorprendida se hacen en Ventaja.
                    </p>
                    <p>
                        <strong>Comprender la situación</strong>. Al final de su turno, la
                        criatura deja de estar sorprendida.
                    </p>
                </div>
                <div class="estados generico">
                    <div class="headerEstados">
                        <h2>Tumbado</h2>
                    </div>
                    <p>
                        <strong>Gatear</strong>. Si su anatomía lo permite, una criatura
                        tumbada puede moverse a la mitad de su Velocidad de caminado.
                    </p>
                    <p>
                        <strong>Ataques empeorados</strong>. La criatura tiene Desventaja en
                        las Tiradas de Ataque y las Tiradas de Ataque que se hagan contra la
                        criatura tienen Ventaja.
                    </p>
                    <p>
                        <strong>Levantarse</strong>. Para levantarse, una criatura debe
                        tener alguna Velocidad que pueda usar superior a 0 y usar la mitad
                        de la más alta de sus Velocidades en su turno.
                    </p>
                </div>
            </div>
        </div>
    </details>

    <details open id="apartado2">
        <summary>Fatiga</summary>
        <div class="detailsBloque">
            <p>
                Cuando una criatura se esfuerza por demasiado rato o un combate es
                demasiado exigente, es normal que se canse y no pueda luchar más,
                incluso si sana mediante medicinas. Para representar esto existen los
                Niveles de Fatiga. Se pueden tener de 0 a 10 Niveles de Fatiga y, por
                cada Nivel de Fatiga, se tiene un -1 a todas las Tiradas de d20 y daño,
                a la CA, a la CD de los efectos que provocas a otras criaturas y a la
                cantidad de PP que tienes. Al llegar a 10 Niveles de Fatiga, caes a 0 PV
                y quedas Inconsciente y, si los superas, mueres.
            </p>

            <p>Recibes Niveles de Fatiga en las siguientes situaciones:</p>

            <ul>
                <li>
                    <p>
                        Cuando acabas un combate en el que has perdido al menos la mitad de
                        tus PV o PP máximos recibes un Nivel de Fatiga.
                    </p>
                </li>
                <li>
                    <p>Cuando caes a 0 PV recibes 1 Nivel de Fatiga.</p>
                </li>
                <li>
                    <p>
                        Cuando haces actividad extenuante por más de 1 hora seguida recibes
                        1 Nivel de Fatiga.
                    </p>
                </li>
                <li>
                    <p>Cuando pasas una noche sin dormir recibes 4 Niveles de Fatiga.</p>
                </li>
            </ul>
            <p>
                Cada vez que Descansas, reduces tus Niveles de Fatiga a 0 a no ser que
                tengas 5 o más, en cuyo caso sólo pierdes 1 Nivel de Fatiga.
            </p>
        </div>
    </details>

    <details open id="apartado3">
        <summary>Tipos de Tamaños</summary>
        <div class="detailsBloque">
            <p>
                La siguiente tabla clasifica a las criaturas y objetos en función del
                espacio mínimo en el que caben:
            </p>

            <table class="tablaAmistad progresionPokemon">
                <th>Tamaño</th>
                <th>Descripcion</th>
                <tr>
                    <td>Enano</td>
                    <td>
                        Mide menos de un tercio de lo que mide una persona en promedio en
                        todas sus dimensiones.
                    </td>
                </tr>
                <tr>
                    <td>Pequeño</td>
                    <td>
                        Mide alrededor de la mitad que una persona en promedio en la mayor
                        de sus dimensiones.
                    </td>
                </tr>
                <tr>
                    <td>Mediano</td>
                    <td>
                        Mide una cantidad similar a una persona promedio y en ninguna de sus
                        dimensiones excede demasiado a una persona promedio.
                    </td>
                </tr>
                <tr>
                    <td>Grande</td>
                    <td>Mide entre 2 y 2,5 metros en la mayor de sus dimensiones.</td>
                </tr>
                <tr>
                    <td>Enorme</td>
                    <td>Mide entre 2,5 y 3 metros en la mayor de sus dimensiones.</td>
                </tr>
                <tr>
                    <td>Colosal</td>
                    <td>Más de 3 metros en alguna de sus dimensiones.</td>
                </tr>
            </table>
        </div>
    </details>

    <details open id="apartado4">
        <summary>Cargar Peso</summary>
        <div class="detailsBloque">
            <p>
                Una criatura puede cargar una cierta cantidad de peso en función de su
                Fuerza y de su Tamaño y, usualmente, la <strong>Carga</strong> que
                representa un objeto viene determinado por su Tamaño, aunque tu DJ puede
                establecer pesos específicos para objetos en concreto. En general, un
                objeto Enano o menor representa una Carga de 1. Un objeto pequeño
                representa una Carga de 10, uno mediano una Carga de 100 y los objetos
                de Tamaño Grande o mayor tienen cada uno una Carga específica
            </p>

            <p>
                Una criatura tiene una <strong>Capacidad de Carga Máxima</strong> igual
                a 3 más su Fuerza multiplicado por un valor dependiente de su tamaño. Si
                la criatura es Enana, este valor es 1, si es Pequeña es 10, si es
                Mediana, 50, si es grande, 100, si es Enorme 500 y si es Colosal, 1000.
                Una criatura se considera Levemente Sobrecargada cuando la Carga Total,
                la suma de la Carga de todo lo que lleva encima, es superior a la mitad
                de su Capacidad de Carga Máxima, está Sobrecargada si su Carga Total
                supera las tres cuartas partes de su Capacidad de Carga Máxima.
            </p>
            <p>
                Una criatura que está Levemente Sobrecargada ve todas sus Velocidades
                reducidas a 0 y no puede usar su Velocidad de Vuelo o Levitado. Una
                criatura Sobrecargada además Tiene Desventaja en todas las Tiradas de
                d20 que involucren Fuerza y Agilidad y su CA se reduce en 2 y, por
                último, una criatura cuya Carga Total supera su Capacidad de Carga
                Máxima no puede moverse y falla todas las Tiradas de Salvación de
                Agilidad automáticamente.
            </p>
        </div>
    </details>

    <details open id="apartado5">
        <summary>Velocidades</summary>
        <div class="detailsBloque">
            <p>
                Algunos pokémon poseen diferentes formas de movimiento más allá de
                caminar. Es por esto que, por ejemplo, en las entradas de la Pokédex de
                algunos pokémon, en el apartado de velocidad tienen más de un valor. Si
                hay un valor sin aclaraciones, este representa la velocidad de caminado,
                es decir, la cantidad de metros que puede moverse en un turno. Todas las
                personas tienen una velocidad de movimiento base de 5 metros.
            </p>
            <p>
                <strong>Velocidad de excavado</strong>: La velocidad de excavado
                determina cuánto puede desplazarse un Pokémon excavando justo bajo una
                superficie de arena, nieve, barro o una sustancia similar. Una criatura
                que se mueve justo bajo tierra debe salir de la tierra para realizar
                Tiradas de Ataque y lanzar movimientos contra criaturas que no estén
                excavando a menos de 1 metro de ella y provoca Ataques de Oportunidad al
                hacerlo.
            </p>

            <p>
                Cuando una criatura excava sólo tiene cobertura media, incluso si está
                completamente cubierta.
            </p>
            <strong></strong>
            <p>
                <strong>Velocidad de vuelo</strong>: La velocidad de vuelo determina
                cuántos metros puede desplazarse una criatura en el aire.
            </p>

            <p>
                Una criatura que está haciendo uso de su velocidad de vuelo es inmune a
                los Movimientos con la etiqueta de Por Tierra y el daño de Tipo
                Eléctrico contra este se vuelve super efectivo si no lo es ya.
            </p>

            <p>
                Además, Todas las Tiradas de Ataque a rango realizadas por una criatura
                que está volando a más de 5 metros de distancia de su objetivo se hacen
                en Desventaja.
            </p>

            <p>
                <strong>Velocidad de nado</strong>: La velocidad de nado define cuán
                rápido puede moverse el Pokémon bajo el agua.
            </p>

            <p>
                <strong>Velocidad de levitado</strong>: La velocidad de levitado define
                cuán rápido se mueve el Pokémon mientras flota o levita. Cuando se
                utiliza la velocidad de levitado, la altura máxima sobre el suelo que
                puede alcanzar el Pokémon es de 1 metro, a no ser que se también tenga
                una Velocidad de vuelo, en cuyo caso no se ve afectada por las
                penalizaciones asociadas a volar.
            </p>

            <p>
                Un Pokémon que está haciendo uso de su velocidad de levitado es inmune a
                los Movimientos Por Tierra y, si cae desde una altura, desciende a una
                velocidad constante que puede controlar. Además, por cada metro que se
                mueve horizontalmente mientras cae, cae un metro si no está a 1 metro de
                altura del suelo y, como mínimo, cae 5 metros cada ronda
            </p>
        </div>
    </details>

    <details open id="apartado6">
        <summary>Correr y Terreno Difícil</summary>
        <div class="detailsBloque">
            <p>
                En tu turno, puedes tomar la Acción de <strong>Correr</strong> para
                duplicar tus velocidades de movimiento por el turno.
            </p>

            <p>
                En ocasiones, pasar caminando por un espacio será especialmente
                complejo, ya sea porque la zona esté cubierta de agua, haya muchas cosas
                en el suelo que dificulten desplazarse o por algún otro motivo. En esas
                ocasiones, este terreno se considera <strong>Terreno Difícil</strong>.
                Moverse caminando por Terreno Difícil cuesta el
                <strong> doble de Velocidad de movimiento</strong>.
            </p>
        </div>
    </details>

    <details open id="apartado7">
        <summary>Salto</summary>
        <div class="detailsBloque">
            <p>
                Una criatura puede <strong>Saltar</strong> como Acción si su Velocidad
                de Caminado no es 0 y, cuando lo hace, si ha tomado carrerilla puede
                <strong> Saltar Horizontalmente </strong> una cantidad de metros igual a
                su Fuerza (mínimo 1 m) y, si ha corrido por 2 metros o más antes, la
                distancia de salto aumenta en 2 metros (mínimo 2 m).
            </p>

            <p>
                Una criatura puede <strong>Saltar Verticalmente</strong> una cantidad de
                metros igual a su Fuerza entre 3 (mínimo medio metro).
            </p>

            <p>
                Saltar no puede provocar que una criatura se desplaza más distancia que
                su Velocidad de
                <strong>Caminado.</strong>
            </p>
        </div>
    </details>

    <details open id="apartado8">
        <summary>Oscuridad e Iluminación</summary>
        <div class="detailsBloque">
            <p>
                En ciertas ocasiones, habrá localizaciones o puntos en las que reine la
                <strong>Oscuridad</strong>. Una criatura o un objeto que está en una
                localización con Oscuridad no puede ser vista por medios tradicionales y
                trata a todas las demás criaturas que no la ven como si estuvieran
                ciegas.
            </p>

            <p>
                Una localización o punto está <strong>Mal iluminado</strong>
                cuando sólo hay luz tenue en este. Cuando una criatura intenta discernir
                un objeto o criatura Mal iluminada, esta tiene Desventaja en Tiradas de
                <strong>Percepción</strong> e <strong>Investigación</strong> para
                detectarla.
            </p>
        </div>
    </details>

    <details open id="apartado9">
        <summary>Visibilidad</summary>
        <div class="detailsBloque">
            <p>
                Cuando una criatura no ve a otra, bien porque la segunda está escondida
                o bien porque está en oscuridad o es invisible, la primera criatura
                tiene Desventaja en Tiradas de Ataque y Combate contra la criatura que
                no ve y la criatura que no es vista tiene Ventaja en Tiradas de Ataque y
                Combate contra la primera.
            </p>
        </div>
    </details>

    <details open id="apartado10">
        <summary>Sentidos</summary>
        <div class="detailsBloque">
            <p>
                Algunas criaturas poseen un <strong>Sentido</strong> extra más allá de
                los normales o tienen un sentido más desarrollado de lo normal. En esta
                sección tratamos estos sentidos especiales, los cuales siempre tienen
                asociados un radio en el que toman efecto.
            </p>

            <p>
                <strong>Visión en la oscuridad</strong>: En el radio establecido, una
                criatura con visión en la oscuridad trata las localizaciones y puntos en
                Oscuridad como Mal iluminados y las localizaciones y puntos Mal
                iluminados como si estuvieran normalmente iluminados.
            </p>

            <p>
                <strong>Electrorrecepción</strong>: Puedes sentir campos eléctricos y
                magnéticos, así como la corriente eléctrica y Movimientos de tipo
                eléctrico que se usan en un radio a tu alrededor.
            </p>

            <p>
                <strong>Sentido de la vibración</strong>: Puedes sentir las vibraciones
                del suelo, por lo que notas el movimiento de otras criaturas y sabes
                localizarlas.
            </p>

            <p>
                <strong>Ecolocalización</strong>: Puedes ver a través de infrasonidos
                que escuchas en un radio a tu alrededor. Si recibes daño de un
                Movimiento de Sonido, tu ecolocalización deja de funcionar hasta el
                final de tu próximo turno. Si estás Ensordecido no puedes usar tu
                ecolocalización.
            </p>

            <p>
                <strong>Sentido espectral</strong>: Detectas a las almas en pena, las
                criaturas Tipo Fantasma y los lugares y objetos malditos a tu alrededor.
                Como Acción Extendida, puedes comprender la maldición que aflige un
                objeto o lugar, así como comprender los motivos de las almas en pena que
                encuentres.
            </p>

            <p>
                <strong>Sentido del aura</strong>: Sientes la posición y a las almas de
                las criaturas a rango, la cual visualizas como una luz espectral que
                rodea a todo ser vivo, y que cambia en función de las emociones que
                siente y de la naturaleza de sus intenciones. Si no ves a una criatura
                con otro sentido, igualmente sientes su alma.
            </p>
        </div>
    </details>

    <details open id="apartado11">
        <summary>Agarrar</summary>
        <div class="detailsBloque">
            <p>
                Cuando quieres <strong>Agarrar</strong> a una criatura, puedes utilizar
                una Acción para intentarlo. El objetivo de tu agarre debe ser como
                máximo un tamaño mayor que tú y debe estar dentro de tu alcance.
            </p>

            <p>
                Usando al menos una extremidad libre, intentas agarrar el objetivo
                realizando una Tirada Contestada de tu Combate (Fuerza) contra su
                Salvación de Fuerza o Agilidad.
            </p>

            <p>
                Cuando te mueves, puedes arrastrar o llevar a la criatura sujeta
                contigo, pero tus velocidades se reducen a la mitad, a menos que la
                criatura sea al menos dos tamaños más pequeña que tú.
            </p>

            <p>
                <strong>Terminar un agarre</strong>. Una criatura agarrada puede
                utilizar su Acción para intentar escapar. Para hacerlo, debe tener éxito
                en la Tirada Contestada de su Salvación de Fuerza o Agilidad contra tu
                Combate (Fuerza).
            </p>
        </div>
    </details>

    <details open id="apartado12">
        <summary>Empujar</summary>
        <div class="detailsBloque">
            <p>
                Como Acción, puedes intentar empujar 1 metro o tumbar a una criatura a 1
                metro de ti. Haz una Tirada enfrentada de Combate (Fuerza) contra una
                Tirada de Salvación de Fuerza o Agilidad de la criatura a la que
                intentas afectar. Como máximo, la criatura que elijas puede ser un
                tamaño más grande que tu.
            </p>
        </div>
    </details>

    <details open id="apartado13">
        <summary>Daño por Caída</summary>
        <div class="detailsBloque">
            <p>
                Caer desde una gran altura es especialmente peligroso. Cada ronda se cae
                100 metros y, al final de una caída, recibes 1d6 de daño sin tipo por
                cada metro que has caído si caes 2 metros o más. Si recibes daño de esta
                forma, quedas tumbado al caer.
            </p>
            <p>
                Si una criatura tiene velocidad de levitado, esta lo frena durante el
                final de la caída hasta quedar a la altura a la que puede levitar y no
                recibe daño alguno.
            </p>
        </div>
    </details>

    <details open id="apartado14">
        <summary>Mantener la Respiración</summary>
        <div class="detailsBloque">
            <p>
                En ciertas ocasiones, puede ocurrir que no pueda respirarse en una
                localización, bien porque esté inundada de agua u otro líquido o porque
                el aire no tenga oxígeno. Las criaturas de Tipo Fantasma pueden
                respirar, pero no necesitan hacerlo para sobrevivir y las criaturas de
                Tipo Agua o con la Habilidad Nado rápido pueden respirar bajo el agua (y
                también fuera de esta, a no ser que el DJ dictamine lo contrario).
            </p>

            <p>
                Una criatura puede mantener su respiración una cantidad de minutos igual
                a su Resistencia. Si una criatura que está manteniendo la respiración
                habla, por ejemplo, para dar una Orden, o usa un Movimiento con la
                Etiqueta de Sonido, deja de aguantar la respiración. Una criatura que
                deja de mantener la respiración y no puede respirar, empieza a
                <strong>Ahogarse</strong>. Al final de cada uno de los turnos en los que
                una criatura está ahogándose, esta gana 1 Nivel de Fatiga y, si llega a
                11 Niveles de Fatiga, fallece ahogada.
            </p>
        </div>
    </details>

    <details open id="apartado15">
        <summary>Climas</summary>
        <div class="detailsBloque">
            <p>
                No todas las aventuras ocurren en días ideales. En muchas ocasiones, los
                entrenadores encontrarán dificultades climáticas que los forzarán a
                cambiar su actuar y plantearse nuevas estrategias para alcanzar sus
                objetivos. Principalmente, existen los siguientes cuatro climas, a los
                cuales el DJ puede añadir efectos extra en función de la intensidad o
                naturaleza de estos:
            </p>

            <p>
                <strong>Sol abrasador</strong>: El sol calcina el suelo con fuerza,
                elevando la temperatura. Las criaturas que no son de tipo Fuego que
                acaban su turno en este clima quedan Acaloradas y, si pasan más de una
                hora sin tomar refrigerios o si no se tiene ropas adecuadas, ganan un
                nivel de fatiga.
            </p>

            <p>
                <strong>Lluvia</strong>: La lluvia deja Empapadas a todas las criaturas
                bajo ella. Las Tiradas de Percepción se hacen en Desventaja si son para
                detectar a criaturas u objetos a más de 10 metros de distancia y no
                puede usarse la Ecolocalización durante la lluvia.
            </p>

            <p>
                <strong>Nevada</strong>: El frío de la nevada hace que las criaturas que
                no son de Tipo Hielo que no llevan ropas adecuadas reciban un nivel de
                fatiga por cada hora que pasan en la nieve sin calentarse de alguna
                forma. Además, si la nevada es muy intensa (discreción del DJ), las
                Tiradas de Percepción se hacen en Desventaja e incluso puede que no haya
                visibilidad a partir de cierta distancia.
            </p>

            <p>
                <strong>Tormenta de arena</strong>: La tormenta de arena bloquea la
                visibilidad y molesta a las criaturas que no se protegen del polvo. Más
                allá de 10 metros, la visibilidad queda siempre bloqueada.
            </p>
        </div>
    </details>

    <details open id="apartado16">
        <summary>Campos</summary>
        <div class="detailsBloque">
            <p>
                Algunos Movimientos o eventos pueden crear
                <strong>Campos. Los campos se extienden por el suelo y</strong>
                sólo puede haber un mismo campo a la vez, que es el último que se creó.
                Cada campo tiene efecto sobre las criaturas que lo pisan.
            </p>

            <p>
                <strong>Campo Eléctrico</strong>: Chispas eléctricas surgen del suelo.
                Todas las criaturas que inician su turno pisando un campo eléctrico
                quedan aceleradas. Cuando una criatura está acelerada de esta forma, sus
                velocidades aumentan en 2 metros y tiene una segunda Reacción por cada
                turno que toma. Además, los Movimientos de tipo Eléctrico lanzados desde
                un campo Eléctrico aumentan su daño en una cantidad igual al Bono de
                Habilidad de su usuario.
            </p>

            <p>
                <strong>Campo de hierba</strong>: Cubren la superficie afectada de
                hierba llena de vitalidad. Todas las criaturas que inician su turno
                pisando un campo de hierba reciben una Cantidad de Puntos de Escudo
                igual a su Vitalidad. Además, los Movimientos de tipo Planta lanzados
                desde un campo de hierba aumentan su daño en una cantidad igual al Bono
                de Habilidad su usuario.
            </p>

            <p>
                <strong>Campo de Niebla</strong>: El suelo emite niebla que cubre hasta
                los 2 metros de altura y que se disipa si sale del área. Dentro de la
                niebla, las criaturas no pueden ver más allá de 1 metro dentro de esta y
                no pueden quedar quemadas, dormidas, envenenadas, paralizadas, heladas,
                confundidas o asustadas y dejan de estarlo si lo están cuando entran a
                este campo. Además, los Movimientos de tipo Hada lanzados desde un campo
                de Niebla aumentan su daño en una cantidad igual al Bono de Habilidad de
                su usuario.
            </p>
            <p>
                <strong>Campo Psíquico</strong>: El suelo y el ambiente se llena de un
                color rosado que manipula la mente de las criaturas dentro de este,
                ralentizando su toma de acciones. Las criaturas que no son de tipo
                Psíquico que pisan un campo Psíquico pierden su Reacción y sólo pueden
                elegir entre usar su Movimiento o usar una Acción en su turno (las
                Acciones Compartidas pueden tomarse normalmente). Además, los
                Movimientos de tipo Psíquico lanzados desde un campo de Psíquico
                aumentan su daño en una cantidad igual al Bono de Habilidad de su
                usuario.
            </p>
        </div>
    </details>

    <details open id="apartado17">
        <summary>Pokémon que No Hacen Caso</summary>
        <div class="detailsBloque">
            <p>
                En algunas situaciones, un Pokémon no seguirá las órdenes de su
                entrenador por no respetarlo o incluso odiarlo.
            </p>
            <p>
                Si el Nivel de Amistad entre un Pokémon y su entrenador es de 0 o 1 o el
                Pokémon es de mayor Nivel que el de su entrenador y el Nivel de Amistad
                entre ambos es de 2 o inferior, cada vez que el entrenador le da una
                Órden, debe hacer una Tirada de Trato Pokémon con CD igual al Ratio de
                Captura del Pokémon más el BH del mismo. Si el entrenador falla, el
                Pokémon no hace caso, no haciendo nada o tomando otra Acción distinta (a
                discreción del DJ).
            </p>
        </div>
    </details>

    <details open id="apartado18">
        <summary>Reconocer un Huevo</summary>
        <div class="detailsBloque">
            <p>
                Cuando un Personaje encuentra un Huevo Pokémon puede intentar reconocer
                su Especie. Para hacerlo debe realizar una Tirada de Conocimiento
                Pokémon con CD igual a 10 más el Ratio de Captura del Pokémon que sale
                del huevo.
            </p>

            <p>
                Además, como Acción Extendida, un Personaje que conoce a qué Especie se
                corresponde el huevo puede realizar una Tirada de Conocimiento Pokémon
                CD 20. Si la pasa, sabe la cantidad de semanas que le quedan al huevo
                para eclosionar y, si la pasa por 5 o más, sabe la cantidad de días
                exactos. Un Personaje puede tomar esta Acción Extendida 1 vez cada Día
                para cada huevo.
            </p>
        </div>
    </details>

    <details open id="apartado19">
        <summary>Recordar Información Sobre un Pokémon</summary>
        <div class="detailsBloque">
            <p>
                Cuando un Personaje ve a un Pokémon puede pedir al DJ información sobre
                su Especie. Alguna información será obvia debido al aspecto o contexto
                en el que se encuentre a un Pokémon, en cuyo caso simplemente da esa
                información. Debido a esto, hay 3 opciones que pueden darse:
            </p>
            <ul>
                <li>
                    <p>
                        La información es obvia o ya se estableció que la conocía y
                        simplemente se la da al PJ.
                    </p>
                </li>
                <li>
                    <p>
                        Podría conocer la información, en cuyo caso el Personaje debe hacer
                        una Tirada de Conocimiento Pokémon (Mente) para recibirla.
                    </p>
                </li>
                <li>
                    <p>
                        La información es imposible de conocer, en cuyo caso el DJ se lo
                        comunica al Jugador.
                    </p>
                </li>
            </ul>

            <p>
                <strong>Clase de Dificultad</strong>. La CD de una de estas Tiradas de
                Conocimiento Pokémon es igual al Ratio de Captura del Pokémon más la
                mitad de su Nivel Mínimo (o de 25 a 35 si es un Pokémon Legendario o
                Mítico, a discreción del DJ). Además, la CD se reduce en 5 para saber
                los Tipos Elementales del Pokémon y también puede aumentar hasta en 5 si
                la información que se pide es particularmente específica (a discreción
                del DJ).
            </p>

            <div class="consejoCapitulo">
                <p>
                    <strong>Ejemplo</strong>: Un Sunkern es fácilmente reconocible como
                    Tipo Planta, así que simplemente le da esa información si la pide; no
                    es obvio cuales son sus Habilidades, por lo tanto, el Personaje debe
                    pasar Tirada de Conocimiento Pokémon CD 10 para decírselo; si el
                    personaje no está familiarizado con esta región, es imposible que sepa
                    con certeza si los Sunkern usualmente la habitan y así que le comunica
                    que no podría saberlo.
                </p>
            </div>
        </div>
    </details>

    <details open id="apartado20">
        <summary>Regla Variante: Hacer Cuidadosamente</summary>
        <div class="detailsBloque">
            <p>
                Tu DJ decide si usáis esta regla. Si decide que puede usarse, cuando hay
                una Acción que requiere una Acción para utilizarse, puedes pedir a tu DJ
                extenderla a una Acción Extendida, con una duración a determinar por tu
                DJ. Si tomas esta Acción por como Acción Extendida y esta involucra
                realizar una Tirada de d20 y sacas 10- en la Tirada Natural de dicha
                Tirada de d20, la Tirada Natural se vuelve 10.
            </p>
        </div>
    </details>

    <details open id="apartado21">
        <summary>Regla Variante: Multiclase</summary>
        <div class="detailsBloque">
            <p>
                Al inicio de la campaña, tu DJ puede definir que
                <strong>La Regla de Multiclase</strong> puede utilizarse. La Multiclase
                tiene por objetivo permitir a los personajes obtener los rasgos de más
                de una Clase para poder crear personajes que no están completamente
                representados por sólo una.
            </p>

            <p>
                Cada vez que subas de Nivel, puedes elegir tomar un Nivel en alguna de
                tus Clases o en una nueva Clase.
            </p>

            <p>
                <strong>Tomar una Nueva Clase</strong>: Cuando tomas un Nivel en una
                nueva Clase, ganas todos los Rasgos que esta te otorga a Nivel 1, pero
                aumentas tus Grados de Habilidad en ciertas Tiradas de Salvación como
                acurre al crear tu personaje.
            </p>
        </div>
    </details>
</template>

<style scoped>
/* Estilos de los bloques de estados */
.estados {
    width: 30%;
    border-radius: 10px;
    padding-bottom: 15px;
}

.estadosBloque {
    margin-top: 30px;
    gap: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

/* === REDUCIR TAMAÑO BLOQUES ESTADOS */
@media screen and (max-width: 1600px) {
    .estados {
        width: 45%;
    }
}

@media screen and (max-width: 1000px) {
    .estados {
        width: 90%;
    }
}

#capitulos .estados p,
#capitulos .estados h2 {
    color: black;
}

#capitulos .estados p {
    padding: 0px 20px;
}

#capitulos .estados h2 {
    padding: 5px;
}

.headerEstados {
    display: flex;
    align-items: center;
    border-bottom: 1px solid black;
    padding-left: 10px;
    border-radius: 10px 10px 0 0;
}

/*  === Colores estados === */
.helado .headerEstados {
    background-color: rgb(170, 255, 238);
}

.helado {
    background-color: lightcyan;
}

.quemado .headerEstados {
    background-color: rgb(255, 130, 81);
}

.quemado {
    background-color: lightsalmon;
}

.paralizado .headerEstados {
    background-color: rgb(255, 255, 55);
}

.paralizado {
    background-color: rgb(255, 255, 103);
}

.envenenado .headerEstados {
    background-color: rgb(187, 41, 255);
}

.envenenado {
    background-color: rgb(207, 104, 255);
}

.dormido .headerEstados {
    background-color: rgb(148, 140, 255);
}

.dormido {
    background-color: rgb(173, 197, 230);
}

.confuso .headerEstados {
    background-color: palevioletred;
}

.confuso {
    background-color: rgb(255, 166, 196);
}

.infatuado .headerEstados {
    background-color: rgb(255, 0, 204);
}

.infatuado {
    background-color: rgb(255, 163, 237);
}

.asustado .headerEstados {
    background-color: gray;
}

.asustado {
    background-color: lightgray;
}

.enfurecido .headerEstados {
    background-color: red;
}

.enfurecido {
    background-color: rgb(255, 72, 72);
}

.acalorado .headerEstados {
    background-color: rgb(255, 38, 0);
}

.acalorado {
    background-color: rgb(251, 101, 75);
}

.empapado .headerEstados {
    background-color: rgb(50, 163, 255);
}

.empapado .headerEstados {
    background-color: rgb(72, 135, 218);
}

.empapado {
    background-color: rgb(146, 193, 255);
}

.cegado .headerEstados {
    background-color: rgb(60, 56, 96);
}

.cegado {
    background-color: rgb(121, 118, 146);
}

.generico .headerEstados {
    background-color: rgb(125, 125, 125);
}

.generico {
    background-color: rgb(202, 202, 202);
}
</style>
