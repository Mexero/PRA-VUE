<template>
    <h1>Capítulo 2: Cómo jugar</h1>
    <p>
        Has creado tu personaje, tienes tus Pokémon listos y… ¿Cómo se juega a esto?
        Este apartado busca establecer las reglas fundamentales que se utilizarán
        durante todo el juego. Antes de entrar en los puntos específicos, damos una
        breve guía de cómo interpretar las reglas:
    </p>
    <ul>
        <li>
            <p>
                Las reglas específicas tienen prioridad sobre las generales. Es decir,
                si un efecto te dice que puedes hacer algo que, a priori, va contra una
                regla general, prevalece el efecto más específico.
            </p>
        </li>
        <li>
            <p>
                Si una regla habla de dividir un número y el resultado obtenido es un
                número decimal, siempre se redondea hacia abajo, a no ser que se
                especifique lo contrario. Es decir, 5'9999 se redondea a 5, no a 6.
            </p>
        </li>
    </ul>

    <details open id="apartado1">
        <summary>Las Escenas</summary>
        <div class="detailsBloque">
            <p>
                Las partidas que juegues estarán divididas en <strong>Escenas</strong>.
                Puedes pensar en estas Escenas como en las de una serie. Es decir, no
                tienen una duración fija, sino que están definidas por la narrativa. En
                general, si hay un corte de transición, salto de tiempo o todo el mundo
                están abandonando el lugar después de un evento, probablemente haya un
                cambio de Escena.
            </p>
            <p>
                Un ejemplo de Escena muy fácil de comprender son los combates, que a
                menudo son una Escena en si misma o una parte integral de la misma y
                cuyo final suele ir de la mano con el final de su Escena.
            </p>
        </div>
    </details>

    <details open id="apartado2">
        <summary>¿Cuánto Duran las Acciones?</summary>
        <div class="detailsBloque">
            <p>
                En la mayoría de los casos, será responsabilidad del DJ determinar
                cuánto tiempo lleva una acción. Considera que tu resultado en una tirada
                puede afectar al tiempo de duración de la acción. Por ejemplo, una
                Tirada de Sigilo más alto te permitiría pasar sigilosamente por una
                instalación vigilada de manera más rápida.
            </p>
            <p>
                Sin embargo, los tipos de acciones enumeradas en las Habilidades de los
                personajes y Pokémon proporcionan pautas generales. Las
                <strong>Acciones</strong> a secas no llevan más que unos pocos segundos
                en ejecutarse. Las <strong>Interacciones</strong> suelen ser aún más
                rápidas que suelen implicar interactuar de forma sencilla con el
                entorno, como abrir una puerta y coger algo del suelo.
            </p>
            <p>
                Por otro lado, las <strong>Acciones Extendidas</strong> toman al menos
                el tiempo suficiente como para ser imposibles de realizar en medio de un
                combate o en otras situaciones en las que no hay mucho tiempo
                disponible. Algunas Acciones Extendidas además indican su duración
                exacta y otras lo dejan a discreción del DJ. Por ejemplo, una sesión de
                entrenamiento con tus Pokémon puede durar 1 o 2 horas, pero intentar
                reparar una Poké Ball puede llevar mucho menos tiempo, unos 15 minutos o
                media hora, pero ambas son Acciones Extendidas.
            </p>
        </div>
    </details>

    <details open id="apartado3">
        <summary>Movimientos</summary>
        <div class="detailsBloque">
            <p>
                Los <strong>Movimientos</strong> son habilidades que tanto los
                personajes como los Pokémon pueden realizar. Desde el simple Arañazo que
                puede hacer un Mankey hasta el poderoso Hiperrayo de un Gyarados. La
                mayoría de Movimientos tienen una duración de Acción.
            </p>
        </div>
    </details>

    <details open id="apartado4">
        <summary>Las Estadísticas</summary>
        <div class="detailsBloque">
            <p>
                Cada personaje y Pokémon en el juego, a los que de ahora en adelante nos
                referiremos como <strong>Criaturas</strong>, tienen capacidades
                definidas por sus seis <strong>Estadísticas</strong>.
            </p>

            <p>
                Las Estadísticas son <strong>Fuerza (FUE)</strong>, que representa el
                poder físico, <strong>Agilidad (AGI)</strong>, que representa la
                destreza, Resistencia <strong>(RES)</strong>, que mide el aguante y la
                constitución física, <strong>Mente (MEN)</strong>, que mide tu habilidad
                memorística, de razonamiento, conocimientos y, de tenerlos, la fuerza de
                los poderes mentales, <strong>Espíritu (ESP)</strong>, que representa tu
                fuerza de voluntad y tu sintonía con tu entorno y el mundo natural, y
                <strong>Presencia (PRE)</strong>, que representa tu habilidad para
                influir en otros. En general, las Estadísticas suelen oscilar entre -1 y
                7.
            </p>
        </div>
    </details>

    <details open id="apartado5">
        <summary>Tiradas Naturales</summary>
        <div class="detailsBloque">
            <p>
                Cuando lanzas un d20, la <strong>Tirada Natural</strong> de dicha tirada
                es el número que obtuviste en el dado. Algunos efectos harán referencia
                a que ocurre algo si una Tirada Natural cumple cierta condición. Algunas
                de las condiciones más usuales tienen una forma abreviada de escribirse
                y estas son:
            </p>
            <p>
                La Tirada Natural es de un valor X o superior, que se escribe “La Tirada
                Natural es de X+”.
            </p>
            <p>
                La Tirada Natural es de un valor X o inferior, que se escribe “La Tirada
                Natural es de X-”.
            </p>
        </div>
    </details>

    <details open id="apartado6">
        <summary>Las Pruebas de d20</summary>
        <div class="detailsBloque">
            <p>
                Cuando un personaje o Pokémon intenta realizar una acción cuyo acierto o
                fallo pudiera tener algún tipo de relevancia, el jugador que lo controla
                realiza una <strong>Prueba de d20</strong>. Para hacerlo, tira un d20 y
                añade la Estadística pertinente y los demás bonus que sean y compara el
                total obtenido contra la
                <strong>Clase de Dificultad de la prueba (CD)</strong>. Si la tirada es
                superior o igual, el personaje realiza la acción tal y como deseaba, si
                es inferior, el DJ puede elegir entre que simplemente se falle al
                realizar la acción o que se acierte pero con una consecuencia.
            </p>

            <p>
                Es importante considerar que no todos los fallos ni aciertos son
                iguales, si un personaje intenta saltar de un acantilado a otro y falla
                por 1 o 2 esto puede representar casi resbalar pero conseguir mantenerse
                en él a costa de torcerse el tobillo y un fallo por 6 o 7 puede
                representar un tropiezo estrepitoso y una inevitable caída al vacío.
            </p>

            <p>Dentro de las Pruebas de d20 hay tres tipos:</p>
            <p>
                Las <strong>Tiradas de Habilidad</strong>, que se realizan cuando un
                personaje quiere hacer algún tipo de acción general, tienen una CD
                establecida por el DJ dependiente de la dificultad de la acción a tomar.
                Cuando el DJ te pida una Tirada de Habilidad, te dirá que Habilidad y
                que Estadística están involucradas. Para abreviar, usualmente estas se
                describen de la forma “Habilidad (Estadística)”.
            </p>

            <p>
                Las <strong>Tiradas de Ataque</strong>, que se realizan cuando se
                intenta atacar a una criatura, y cuya dificultad es la Clase de Armadura
                (CA) de la misma.
            </p>

            <p>
                Las <strong>Tiradas de Salvación</strong>, que son tiradas que realizan
                las criaturas para evitar sufrir un efecto provocado por algún tipo de
                efecto el cual define cuál es su CD. Sólo hay las Tiradas de Salvación
                de Fuerza, Agilidad, Resistencia y Espíritu.
            </p>
        </div>

        <div class="consejoCapitulo">
            <p>
                <strong>Consejo:</strong> Si el acertar o fallar una Tirada de Habilidad
                no tiene ninguna consecuencia y la acción propuesta es plausible no es
                necesario realizar ninguna tirada. Es decir, si Kurt, el personaje de
                Carlos, quiere salir a correr para quitarse el estrés, puede hacerlo.
                Si, por el contrario, está huyendo de un Donphan agresivo, debería hacer
                una tirada para comprobar si es capaz de huir sin tropezarse y
                manteniendo un ritmo superior al del Pokémon.
            </p>
        </div>
    </details>

    <details open id="apartado7">
        <summary>Nivel y Bono de Habilidad</summary>
        <div class="detailsBloque">
            <p>
                Uno de los atractivos principales del mundo Pokémon es la progresión
                dentro del mismo. Es decir, el empezar como un entrenador novato, con
                Pokémon débiles y un equipo cuestionable que poco a poco van mejorando.
            </p>

            <p>
                Este concepto de mejora de las propias capacidades viene representado
                por múltiples mecánicas que se irán presentando más adelante, pero las
                principales son el <strong>Nivel</strong>, un valor numérico que va de 1
                a 20 y que todas las criaturas tienen, el cual define el grado de
                Habilidad o Poder que posee una criatura en su conjunto, y el Bono de
                Habilidad, que se calcula como la mitad del nivel redondeada hacia
                arriba, es decir, que va de 1 a 10. Ambos números, el Nivel y el
                <strong>Bono de Habilidad</strong>, se utilizan para calcular una gran
                cantidad de valores, como los Puntos de Vida, que aparecerán en el
                siguiente capítulo, o los Bonos a las Pruebas de d20.
            </p>
        </div>
    </details>

    <details open id="apartado8">
        <summary>Grados de Habilidad</summary>
        <div class="detailsBloque">
            <p>
                El Nivel y el Bono de Habilidad definen la capacidad de una criatura y
                permite compararla con criaturas de poder similar, pero dos criaturas
                puedes habilidosas en cosas diferentes y, además, sus grados de
                habilidad no tienen porqué ser iguales entre todas las cosas que pueden
                hacer.
            </p>

            <p>
                El <strong>Grado de Habilidad</strong> representa qué tan hábil es una
                criatura en una Tirada de d20, ya sea una Tirada de Habilidad, de Ataque
                o de Salvación.
            </p>

            <p>
                Existen 5 Grados de Habilidad, cada uno asociado con un valor numérico
                que va desde 0 hasta 4:
            </p>

            <p>
                <strong>No entrenado (0)</strong>: La Criatura no tiene ningún talento
                ni conocimiento especial que lo ayude con estas Tiradas de d20. Las
                Criaturas sólo añaden la Estadística pertinente a estas Tiradas al
                hacerlas.
            </p>

            <p>
                <strong>Bueno (1)</strong>: La Criatura es buena al hacer dicha Tirada.
                La Criatura añade su Bono de Habilidad (BH) alresultado de la Tirada de
                d20.
            </p>

            <p>
                <strong>Experto (2)</strong>: La Criatura es destaca al hacer dicha
                Tirada de Habilidad. La Criatura añade su Bono de Habilidad (BH) + 2 a
                la Tirada de d20.
            </p>
            <p>
                <strong>Maestro (3)</strong>: La Criatura es extremadamente buena al
                hacer dicha Tirada de Habilidad. La Criatura añade su Bono de Habilidad
                (BH) + 4 a la Tirada de d20.
            </p>

            <p>
                <strong>Lengendario (4)</strong>: La Criatura posee una habilidad
                increible para hacer dicha Tirada de Habilidad. La Criatura añade su
                Bono de Habilidad (BH) + 6 a la Tirada de d20.
            </p>

            <p>
                Cuando un efecto dice que un grado de Habilidad aumenta en 1 quiere
                decir que pasa al siguiente grado. Por ejemplo, si tu Grado de Habilidad
                en una Tirada de d20 es de No entrenado, se vuelve Bueno y si es de
                Experto, se vuelve Maestro.
            </p>
        </div>
    </details>

    <details open id="apartado9">
        <summary>Tiradas de Habilidad Habituales</summary>
        <div class="detailsBloque">
            <p>
                Las Tiradas de Habilidad están asociadas al tipo de capacidades
                necesarias para realizar una Acción.
            </p>
            <p>
                Las Tiradas de Habilidad no siempre tienen asociada a la misma
                Estadística, pero si que suele haber una Estadística con la que suelen
                hacerse.
            </p>
            <p>
                Las Habilidades asociadas usualmente a <strong>Fuerza </strong> son:
            </p>
            <ul>
                <li>
                    <p>
                        <strong>Atletismo</strong> mide las habilidades atléticas, como la
                        capacidad para correr distancias prolongadas, lanzar algo o levantar
                        objetos pesados.
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Combate</strong> representa tu maestría a la hora de hacer
                        pelear cuerpo a cuerpo, haciendo agarres, evadiéndolos o empujando a
                        rivales. En ocasiones, Combate también se usa con Agilidad.
                    </p>
                </li>
            </ul>
            <p>
                Las Habilidades asociadas usualmente a <strong>Agilidad</strong> son:
            </p>
            <ul>
                <li>
                    <p>
                        <strong>Acrobacias</strong> mide tu habilidad para hacer piruetas
                        complicadas o escurrirte por lugares estrechos.
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Juego de Manos</strong> mide tu habilidad para hacer
                        movimientos sutiles, como hacer trucos de magia o para robar algo.
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Sigilo</strong> mide qué tan fácilmente puedes ocultar tu
                        presencia de otros.
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Iniciativa</strong> mide tu habilidad para entrar en combate
                        y actuar antes que los demás. Esta Habilidad puede usarse sólo con
                        Agilidad o Espíritu (tu elección al hacer la Tirada).
                    </p>
                </li>
            </ul>
            <p>Las Habilidades asociadas usualmente a <strong>Mente</strong>son:</p>
            <ul>
                <li>
                    <p>
                        <strong>Investigación</strong> mide tu habilidad para deducir o
                        encontrar información de detalles de una escena.
                    </p>
                </li>

                <li>
                    <p>
                        Las tiradas de <strong>Conocimiento</strong> representan la cantidad
                        de información que conoces sobre un área específica. Los varios
                        tipos de tiradas de Conocimiento son:
                    </p>
                    <ul>
                        <p>
                            <li>
                                <p>Conocimiento Pokémon</p>
                            </li>
                        </p>
                        <li>
                            <p>Conocimiento de Historia</p>
                        </li>
                        <li>
                            <p>Conocimiento Tecnológico</p>
                        </li>
                        <li>
                            <p>Conocimiento Químico</p>
                        </li>
                        <li>
                            <p>Conocimiento de Poké Balls</p>
                        </li>
                        <li>
                            <p>Conocimiento Natural</p>
                        </li>
                        <li>
                            <p>Conocimiento Médico</p>
                        </li>
                        <li>
                            <p>Conocimiento de Ocultismo</p>
                        </li>
                        <li>
                            <p>Conocimiento de Cocina</p>
                        </li>
                    </ul>
                </li>
            </ul>
            <p>
                Las Habilidades asociadas usualmente a <strong>Espíritu</strong> son:
            </p>
            <ul>
                <li>
                    <p>
                        <strong>Empatía</strong> mide que tan fácilmente puedes leer y
                        comprender los sentimientos de otros, incluso si buscan ocultarlos.
                    </p>
                </li>

                <li>
                    <p>
                        <strong>Percepción</strong> caracteriza tu habilidad no sólo de
                        percibir tu entorno mediante tus sentidos sino también la de fijarte
                        en detalles relevantes.
                    </p>
                </li>

                <li>
                    <p>
                        <strong>Supervivencia</strong> es la habilidad de desenvolverte en
                        la naturaleza, ya sea para encender una fogata u orientarte en mitad
                        del bosque.
                    </p>
                </li>
            </ul>

            <p>
                Las Habilidades asociadas usualmente a <strong>Presencia</strong> son:
            </p>
            <ul>
                <li>
                    <p>
                        <strong>Actuación:</strong> Mide tus habilidades para interpretar
                        algo, ya sea tocar una canción o hacer como que no te duele el pie
                        después de patear una mesa.
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Engaño:</strong> Mide qué tan bien puedes convencer a
                        alguien de algo en lo que no crees, ya sea mediante tus palabras, tu
                        lenguaje corporal o una mezcla de ambos.
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Intimidación:</strong> Representa lo hábil que se es para
                        imponerse sobre otros, amedrentándolos de hacer algo con tu mera
                        presencia.
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Persuasión:</strong> Es la habilidad para convencer a otros
                        de hacer algo para lo que en un principio no están completamente
                        predispuestos.
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Trato Pokémon:</strong> Representa la habilidad del
                        entrenador para establecer relaciones con los Pokémon, hacer que
                        estos se sientan cómodos a su alrededor y que sigan sus órdenes.
                    </p>
                </li>
            </ul>
        </div>
    </details>

    <details open id="apartado10">
        <summary>Ventaja y Desventaja</summary>
        <div class="detailsBloque">
            <p>
                Algunas veces un efecto te dice que tienes <strong>Ventaja</strong> o
                <strong>Desventaja</strong> en una Prueba de d20. Cuando esto suceda,
                tira un segundo d20 al hacer la tirada. Usa el mayor resultado si tienes
                Ventaja y el menor si tienes Desventaja. Por ejemplo, si tienes
                desventaja y sacas 17 y 5, usas el 5. Si, en cambio, tienes ventaja y
                sacas esos mismos números, usas el 17.
            </p>

            <p>
                Si dos situaciones favorables garantizan una Ventaja sigues tirando un
                solo d20 adicional. Lo mismo ocurre con la Desventaja.
            </p>

            <p>
                Si tienes tanto Ventaja como Desventaja en una Prueba de d20, se
                considera que no tienes ninguna de las dos y tiras un único d20. Esto se
                cumple incluso si hay más efectos que te otorgan Ventaja que Desventaja
                y viceversa.
            </p>
        </div>
    </details>

    <details open id="apartado11">
        <summary>Tiradas Enfrentadas</summary>
        <div class="detailsBloque">
            <p>
                No todas las Tiradas de Habilidad se realizan contra un CD. En muchas
                ocasiones, intentarás una acción que está directamente en conflicto con
                la de otra persona, como pasar desapercibido ante un guardia vigilante o
                mentirle a alguien. En ese caso, tanto tú como tu oponente realizan una
                Tirada de Habilidad y comparan los resultados. En los ejemplos
                anteriores, se pondrían a prueba Sigilo contra Percepción y Engaño
                contra Empatía, respectivamente. Quien saque un resultado más alto gana
                la Tirada enfrentada.
            </p>

            <p>
                En caso de empate, gana el defensor, es decir, la persona que mantiene
                el status quo. Por lo tanto, en los ejemplos anteriores, el guardia que
                está vigilando y la persona que intenta detectar una mentira se
                consideran los defensores.
            </p>
        </div>
    </details>

    <details open id="apartado12">
        <summary>Tiradas en Grupo</summary>
        <div class="detailsBloque">
            <p>
                Las criaturas pueden, y a menudo deben, cooperar en las Tiradas de
                Habilidad. Hay dos formas de hacerlo.
            </p>

            <p>
                La primera forma es a través de las
                <strong> Tiradas de Habilidad en Grupo </strong>, que se utilizan para
                actividades en las que varios participantes pueden contribuir de manera
                equitativa a una tarea sin un actor principal. A menudo, estas Tiradas
                de Habilidad son demasiado difíciles para que una sola persona o Pokémon
                las maneje por sí solo o tratan una tarea que debe realizar todo el
                grupo. Un buen ejemplo de esto sería cuando varios Entrenadores y
                Pokémon evitan que una roca ruede cuesta abajo o cuando todo el grupo
                tiene que pasar sigilosamente ante un guardia. En estos casos, cada
                jugador realiza su tirada por separado y se obtiene el promedio de
                estas. Si este promedio supera o iguala la CD, la tirada se supera, si
                no, se falla.
            </p>

            <p>
                La segunda forma es mediante las <strong> Tiradas con Ayuda </strong>.
                En estas hay un actor principal en la tarea y alguien más puede ayudar
                de manera secundaria. En estos casos, si la persona que ayuda es al
                menos Buena en la Habilidad del tipo de Tirada a realizar, este puede
                dar Ventaja al actor principal para hacer su tirada.
            </p>
        </div>
    </details>
</template>
