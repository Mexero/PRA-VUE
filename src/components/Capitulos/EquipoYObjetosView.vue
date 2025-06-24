<template>
    <h1>Capítulo 9: Equipo y Objetos</h1>

    <p>
        A lo largo de sus aventuras y dependiendo de su campaña, los entrenadores
        podrían necesitar usar Poké Balls para capturar a sus futuros compañeros
        Pokémon, medicinas para recuperarse de las batallas y equipo para poder
        explorar la naturaleza cómodamente. Este capítulo trata sobre las reglas que
        rigen a estos y otros objetos de los que los entrenadores y Pokémon podrán
        hacer uso.
    </p>

    <h2>Los objetos en tu Campaña</h2>
    <p>
        Dependiendo del contexto de tu campaña es posible que tengas acceso a
        diferentes objetos, de cuya existencia y accesibilidad te informará tu DJ.
        Más abajo, encontrarás tablas con los precios y rarezas recomendadas para
        múltiples objetos. Estos son sólo recomendaciones y, al final, el que tendrá
        la última palabra será el DJ.
    </p>

    <p>
        Es muy probable, por ejemplo, que en algunas localizaciones puedan
        encontrarse algunos objetos raros que tengan sentidos con el entorno que no
        estén disponibles en otros lugares. Por ejemplo, si llegáis a una ciudad
        costera es muy posible que podáis encontrar Buceo Balls, pero si os
        encontráis en mitad del desierto es muy difícil que encontréis un vendedor
        bien surtido de las mismas.
    </p>
    <h2>Los Tipos de Objetos</h2>
    <p>
        Dentro del Mundo Pokémon hay múltiples tipos de objetos que no existen en el
        mundo real y, otros, que son diferentes. En los siguientes apartados
        trataremos los distintos tipos de objetos que podrás encontrar y sus efectos
    </p>
    <h2>Materiales de Fabricación</h2>
    <p>
        A lo largo del capítulo habrá múltiples situaciones en las que se haga
        referencia a crear objetos con Herramientas. Los personajes poseen estas
        habilidades deberían poder tener acceso a usarla.
    </p>
    <p>
        Para potenciar que puedan usar sus habilidades de creación existen los
        <strong>Materiales de Fabricación</strong>. Cada tipo de Materiales de
        Fabricación tiene un valor monetario asociado pero no podrán venderse, sino
        que este referencia la cantidad del valor que reduce del costo de
        fabricación de un objeto. Por ejemplo, sería difícil vender las piezas de un
        aparato roto, pero un Inventor podría usarlas para sus Invenciones o para
        hacer Poké Balls.
    </p>

    <details open id="apartado1">
        <summary>Poké Balls</summary>
        <div class="detailsBloque">
            <p>
                Las <strong>Poké Balls</strong> son dispositivos tecnológicos de tamaño
                Enano diseñados para capturar y transformar en energía a los Pokémon.
                Las Poké Ball hacen naturalmente algo más amistosos a los Pokémon, pero
                no doblegan su voluntad, por lo que haberlos capturado no implica que te
                obedezcan o, en casos más extremos, que no te ataquen tan pronto como te
                vean.
            </p>

            <p>
                Las Poké Balls vienen en diversas variedades, algunas son simplemente
                mejores que otras pero la mayoría son más o menos útiles según el
                contexto. Puedes encontrar las reglas de cómo usar las Poké Balls en más
                detalle en el Capítulo 6: Pokémon, en la sección titulada Capturar. En
                resumen, capturar con una Poké Ball se reduce a hacer una Tirada de
                Trato Pokémon al lanzarla contra una dificultad que depende del nivel
                del Pokémon, su estado actual y su Especie. Si pasas la Tirada, el
                Pokémon queda capturado y, si la fallas, el Pokémon escapará, rompiendo
                la Poké Ball en el proceso.
            </p>

            <p>
                Las Poké Balls pueden ser fabricadas por algunos personajes con ciertas
                Clases o con ciertas Dotes haciendo uso de sus Herramientas de Poké
                Balls. Cuando un personaje fabrica Poké Balls, debe tomar una Acción
                Extendida que dura 30 minutos por cada 1000$ que estas Poké Balls
                cuestan y consume materiales por valor de tres cuartas partes del coste
                de dichas Poké Balls a no ser que el Rasgo o Dote que les permite
                fabricarlas especifique otros costes. Al final de la Acción Extendida,
                el personaje hace una Tirada de Habilidad de Conocimiento de Poké Ball
                (Mente) por cada Poké Ball que ha preparado. Si la falla, la Poké Ball
                no funciona. La dificultad de dichas Tiradas varía en función de la
                rareza de la Poké Ball. Si es Común, la dificultad es 10, si es Poco
                Común, 15, si es Rara, 20 y, si es Muy Rara, 25.
            </p>
            <p>
                Una Poké Ball rota debido a fallar en la captura de un Pokémon puede
                usarse como materiales para fabricar Poké Balls por valor igual a un
                cuarto de su coste.
            </p>

            <div class="enlaceObjetos">
                <router-link :to="{
                    path: '/objetos',
                    query: { tipos: 'Poké ball', seleccionado: 'Poké Ball' },
                }">
                    Ver todas las Poké Balls
                </router-link>
            </div>
        </div>
    </details>

    <details open id="apartado2">
        <summary>Medicina</summary>
        <div class="detailsBloque">
            <p>
                Durante sus aventuras, tanto entrenadores como Pokémon perderán PV e
                irán fatigándose hasta no poder seguir más o, incluso, quedar heridos.
                Para evitar esto es que existen las <strong>Medicinas</strong>. Las
                Medicinas son objetos Enanos y, aunque algunas están diseñadas para
                poder usarse durante la acción del combate, como las Pociones, otras,
                como los Remedios, sólo pueden usarse en los tiempos de descanso, lo
                cual compensan con su precio reducido y mayor efectividad.
            </p>

            <p>
                Estas Medicinas pueden ser preparadas por algunos personajes con ciertas
                Clases o con ciertas Dotes haciendo uso de sus
                <strong>Herramientas de Medicinas</strong>. Cuando un personaje prepara
                Medicinas, debe tomar una Acción Extendida que dura 30 minutos por cada
                1000$ que estas Medicinas cuestan y consume materiales por valor de tres
                cuartas partes del coste de dichas Medicinas a no ser que el Rasgo o
                Dote que les permite prepararlas especifique otros costes. Al final de
                la Acción Extendida, el personaje hace una Tirada de Habilidad de
                Conocimiento Médico (Mente) por cada Medicina que ha preparado. Si la
                falla, la Medicina no sirve de nada. La dificultad de dichas Tiradas
                varía en función de la rareza de la Medicina. Si es Común, la dificultad
                es 10, si es Poco Común, 15, si es Rara, 20 y, si es Muy Rara, 25.
            </p>

            <p>
                Las Bayas que poseen un efecto similar al de una Medicina equivalen a
                materiales para el preparado de dichas Medicinas por valor igual al de
                su coste de compra. Además, algunos químicos y Plantas también podrían
                servir como materiales para preparar Medicinas.
            </p>

            <div class="enlaceObjetos">
                <router-link :to="{
                    path: '/objetos',
                    query: { tipos: 'Medicina', seleccionado: 'Poción' },
                }">
                    Ver todas las Medicinas
                </router-link>
            </div>
        </div>
    </details>

    <details open id="apartado3">
        <summary>Potenciadores</summary>
        <div class="detailsBloque">
            <p>
                Tal y como su nombre indica, los Potenciadores son objetos Enanos que
                mejoran características tanto de entrenadores como de Pokémon. Los hay
                de tres tipos principales: Objetos X, Grageas y Vitaminas.
            </p>

            <p>
                Las grageas y objetos X tienen una duración corta, pero son
                considerablemente más baratas que las proteínas, que poseen efectos algo
                más limitados pero duran por todo el día. Todos los Potenciadores pueden
                consumirse con una Acción y otorgan su efecto inmediatamente. Además,
                una criatura no puede estar bajo los efectos de dos o más Potenciadores
                a la vez. Si una criatura consume un Potenciador estando bajo los
                efectos de otro, se beneficia sólo del consumido más recientemente.
            </p>
            <p>
                Estos Potenciadores pueden ser preparados por algunos personajes con
                ciertas Clases o con ciertas Dotes haciendo uso de sus Herramientas de
                Química. Cuando un personaje prepara Potenciadores, debe tomar una
                Acción Extendida que dura 30 minutos por cada 1000$ que estos
                Potenciadores cuestan y consume materiales por valor de tres cuartas
                partes del coste de dichos Potenciadores a no ser que el Rasgo o Dote
                que les permite prepararlos especifique otros costes. Al final de la
                Acción Extendida, el personaje hace una Tirada de Habilidad de
                Conocimiento de Química (Mente) por cada Potenciador que ha preparado.
                Si la falla, el Potenciador no sirve de nada. La dificultad de dichas
                Tiradas varía en función de la rareza del Potenciador. Si es Común, la
                dificultad es 10, si es Poco Común, 15, si es Raro, 20 y, si es Muy
                Raro, 25.
            </p>
            <div class="enlaceObjetos">
                <router-link :to="{
                    path: '/objetos',
                    query: { tipos: 'Potenciador', seleccionado: 'Ataque X' },
                }">
                    Ver todos los Potenciadores
                </router-link>
            </div>
        </div>
    </details>

    <details open id="apartado4">
        <summary>Plantas y Bayas</summary>
        <div class="detailsBloque">
            <p>
                Cuando estéis en la naturaleza quizás los entrenadores o vuestros
                Pokémon podréis encontrar ciertas plantas que poder utilizar. Estas
                plantas pasan por hierbas y raíces que podrían ser de utilidad para
                fabricar Medicina, Potenciadores o Comidas para crear o reparar Poké
                Balls o Bayas con utilidad de por sí. Las Plantas recolectables son, en
                general, objetos Enanos.
            </p>
            <p>
                Cuando acampáis o mientras viajáis por la naturaleza a cambio de viajar
                a la mitad de Velocidad, podéis intentar recolectar plantas y frutos
                como Acción Extendida. Para hacerlo, los que busquen recursos hacen una
                Tirada de Habilidad grupal de Supervivencia (Espíritu). En función del
                resultado, del entorno y de las criaturas que busquen, el DJ dice que
                encontráis. Además, también es posible obtener copias de una Planta
                usando un Kit de Botánica.
            </p>

            <p>
                Las Bayas usualmente se utilizan para hacer comidas y medicinas, que
                potencian sus efectos. Aun así, estas tienen también valor por sí
                mismas. Todas las bayas pueden ser consumidas como Acción, lo que otorga
                un beneficio que dura hasta el final del día o hasta que se utilice por
                primera vez. Este beneficio cuenta como un beneficio otorgado por una
                comida. En la siguiente tabla están enlistadas las bayas en base a su
                rareza, junto a sus descripciones y el tipo de comidas y medicinas que
                pueden producirse con estas.
            </p>
            <div class="enlaceObjetos">
                <router-link :to="{
                    path: '/objetos',
                    query: { tipos: 'Baya,Planta', seleccionado: 'Hierba blanca' },
                }">
                    Ver todas las Plantas y Bayas
                </router-link>
            </div>
        </div>
    </details>

    <details open id="apartado5">
        <summary>Comida</summary>
        <div class="detailsBloque">
            <p>
                Algunos de los alimentos del mundo Pokémon, como las Bayas, tienen
                propiedades restauradoras y potenciadoras. Usualmente, estos alimentos
                son utilizados para crear Medicinas y Potenciadores, pero también hay
                formas de usarlos para crear Comida especialmente nutritiva, la cual
                posee efectos extra. La Comida es un objeto de tamaño Enano.
            </p>
            <p>
                Estas Comidas pueden comprarse ya preparadas o pueden ser hechas por
                algunos entrenadores con ciertas Clases o con ciertas Dotes haciendo uso
                de sus Utensilios de cocina. Cuando un personaje cocina Comidas, debe
                tomar una Acción Extendida que dura 30 minutos por cada 1000$ que estas
                Comidas cuestan y consume materiales por valor de tres cuartas partes
                del coste de dichas Comidas a no ser que el Rasgo o Dote que les permite
                prepararlos especifique otros costes. Al final de la Acción Extendida,
                el personaje hace una Tirada de Habilidad de Conocimiento de Cocina
                (Espíritu) por cada Comida que ha preparado. Si la falla, la Comida no
                otorga beneficio alguno, pero puede comerse. La dificultad de dichas
                Tiradas varía en función de la rareza de la Comida. Si es Común, la
                dificultad es 10, si es Poco Común, 15, si es Raro, 20, y, si es Muy
                Raro, 25.
            </p>

            <p>
                Algunas comidas otorgan un beneficio temporal cuando se comen como una
                Acción Extendida de mínimo 5 minutos, el cual desaparece si no se ha
                usado al final del día, tiene un sólo uso y no puede acumularse con los
                efectos de otras Comidas. Si consumes una Comida que da un beneficio
                temporal cuando se está bajo los efectos de otra, debes elegir con cual
                beneficio quedarte. La siguiente tabla contiene todas las comidas que
                otorgan uno de estos beneficios temporales. Los nombres son
                recomendaciones, puedes darle los que desees para adaptarse a la comida
                que cocines.
            </p>
            <div class="enlaceObjetos">
                <router-link :to="{
                    path: '/objetos',
                    query: { tipos: 'Comida', seleccionado: 'Tapa estado' },
                }">
                    Ver todas las Comida
                </router-link>
            </div>
        </div>
    </details>

    <details open id="apartado6">
        <summary>Objetos Evolutivos</summary>
        <div class="detailsBloque">
            <p>
                Algunos Pokémon requieren de objetos para poder evolucionar. Estos
                objetos suelen ser raros de encontrar, por lo que es probable que los
                Pokémon que los requieren tarden algo más en poder evolucionar que los
                que no necesitan de dichos objetos.
            </p>
            <p>
                Cuando un Pokémon requiere de un Objeto Evolutivo no es mala idea ir
                buscando lugares donde poder encontrarlo, como tiendas especializadas o
                entornos naturales en los que podrían aparecer. Si el plan es comprar el
                objeto, es bueno ir planificando el ahorro, puesto que el precio
                recomendado de estos objetos oscila alrededor de los 10.000$ si son
                piedras evolutivas o 15.000$ si son otro tipo de objeto. Usualmente, los
                objetos evolutivos son objetos de tamaño Enano.
            </p>
            <p>
                Por otro lado, algunos Pokémon que requieren de objetos evolutivos,
                principalmente los que requieren de piedras evolutivas, podrían no
                requerir de éstas en ciertos entornos. Por ejemplo, quizás Eevee no
                necesite de una piedra hoja para evolucionar si visitas una selva
                especialmente frondosa. Por otro lado, algunos objetos que claramente
                podrían ser fabricados, como los Confites, el Magmatizador o el Disco
                Extraño, podrían ser creados por personajes que sean hábiles en unas
                herramientas adecuadas para producirlos y puedan fabricar objetos raros.
            </p>
            <div class="enlaceObjetos">
                <router-link :to="{
                    path: '/objetos',
                    query: { tipos: 'Objeto evolutivo', seleccionado: 'Piedra agua' },
                }">
                    Ver todos los Objetos Evolutivos
                </router-link>
            </div>
        </div>
    </details>

    <details open id="apartado7">
        <summary>Máquinas Técnicas</summary>
        <div class="detailsBloque">
            <p>
                El que son, como funcionan o incluso si existen las Máquinas Técnicas
                (MTs) dependerá del mundo en el que transcurra vuestra campaña, aunque
                usualmente serán objetos Enanos. Vuestro DJ explicará como funcionan, si
                es que las podéis encontrar, y el que son exactamente estas MTs. Quizás
                de una lista de MTs disponibles, aunque en general puede haber MTs de
                cualquier Movimiento que no tenga la etiqueta de Legendario, y os diga
                dónde podéis encontrarlas o quizás las recibáis como recompensa. Lo que
                es seguro es que los entrenadores que busquen hacer más fuertes a su
                equipo Pokémon buscarán estas MTs para poder defenderse de otros tipos o
                aprender Movimientos que aporten utilidad que de otra forma no podrían
                aprender.
            </p>
            <p>
                Las Mts funcionan como objetos consumibles que enseñan un Movimiento, el
                asociado a dicha MT, al Pokémon sobre el que se usan como Acción
                Extendida. Una criatura sólo puede aprender un Movimiento mediante MT si
                este Movimiento está en su lista de Movimientos Enseñables.
            </p>
            <p>
                El precio y rareza de cada MT viene asociado a la cantidad de PP que
                consume al usarse. Las MT de Movimientos que no consumen PP y de 1 PP
                son poco comunes y su precio ronda los 2.500$ y 5.000$, respectivamente.
                Las de Movimientos de 3 PP son raras y cuestan unos 10.000$ y las de 4
                PP son muy raras y cuestan unos 20.000$
            </p>
            <div class="consejoCapitulo">
                <p>
                    <strong>Nota:</strong> Si tu DJ dictamina que no existen las MTs en su
                    Mundo Pokémon, siempre existe la posibilidad de que encuentres algún
                    tutor de Movimientos que supla la labor que tienen las MTs. También es
                    posible que simplemente no encontréis muchas formas de enseñar
                    Movimientos a lo largo de la campaña, lo que puede hacer que cuando
                    finalmente encontréis una forma de aprenderlos esta sea aún más
                    especial. Recuerda que la experiencia de rol no tiene que ser un calco
                    de la de jugar a uno de los juegos de la saga principal.
                </p>
            </div>
        </div>
    </details>

    <details open id="apartado8">
        <summary>Amuletos</summary>
        <div class="detailsBloque">
            <p>
                Los Amuletos son colgantes, abalorios o complementos de tamaño Enano que
                están imbuidos con energía de los Pokémon de alguna forma. Una criatura
                puede llevar múltiples Amuletos encima pero sólo puede ligarse a uno. Al
                ligarse a un amuleto, una criatura gana un beneficio.
            </p>
            <p>
                Para ligarse a un Amuleto debes llevarlo puesto mientras tomas una
                Acción Extendida que dura 1 hora. Cuando te quitas un Amuleto, te
                desligas de él. En las siguientes tablas encontrarás los amuletos
                existentes, junto a un precio recomendado para estos, aunque este podría
                variar.
            </p>
            <p>
                Todos los amuletos se consideran objetos raros de encontrar y, de hecho,
                en contadas ocasiones encontrarás muchos amuletos a la venta. En su
                lugar, lo más probable es que los recibas como recompensa por ayudar a
                alguien o que los encuentres extraviados en algún lugar que investigues.
                Eso sí, no será muy complicado encontrar compradores, ya sea entre
                coleccionistas u otros entrenadores, puesto que el uso de amuletos está
                permitido en los combates reglados generalmente y ofrecen un aumento de
                poder considerable si se compaginan con las Habilidades y Movimientos
                adecuados.
            </p>

            <div class="enlaceObjetos">
                <router-link :to="{
                    path: '/objetos',
                    query: { tipos: 'Amuleto', seleccionado: 'Agua mística' },
                }">
                    Ver todos los Amuletos
                </router-link>
            </div>
        </div>
    </details>

    <details open id="apartado9">
        <summary>Equipo</summary>
        <div class="detailsBloque">
            <p>
                Similares a los Amuletos pero distintos en su naturaleza, no hay un
                límite a la cantidad de Piezas de Equipo que una criatura puede usar,
                más allá de que es complicado que se use, por ejemplo, una capucha y un
                casco a la vez. La mayoría de Piezas de Equipo equipos son Enanos
            </p>
            <p>
                Las Piezas de Equipo pueden equiparse y desequiparse como Acción y sólo
                pueden equiparse si fueron diseñados para una criatura de la misma
                especie. Los equipos suelen comprarse en tiendas especializadas que,
                usualmente, sólo se encuentran en grandes ciudades o en localizaciones
                particulares.
            </p>
            <div class="enlaceObjetos">
                <router-link :to="{
                    path: '/objetos',
                    query: { tipos: 'Equipo', seleccionado: 'Botas gruesas' },
                }">
                    Ver todas las Piezas de Equipo
                </router-link>
            </div>
        </div>
    </details>

    <details open id="apartado10">
        <summary>Objetos de Entrenador</summary>
        <div class="detailsBloque">
            <p>
                No es extraño que los entrenadores viajen por el mundo en busca de
                aventuras y nuevos desafíos con los que poder superarse. En estos
                viajes, todos los entrenadores necesitarán de equipaje. Es natural dar
                por hecho que todos los entrenadores llevan consigo al menos una mochila
                con unos cuantos cambios de ropa y materiales de aseo básicos. Sin
                embargo, se presentarán múltiples situaciones en las que los
                entrenadores requieran objetos especializados. Para saber si un
                entrenador tiene los objetos que necesita, te fijas en si posee
                siguientes <strong>Kits</strong>:
            </p>

            <p>
                <strong>Kit de acampada</strong>: Contiene todo lo necesario para
                acampar, incluido un hornito portátil, un saco de dormir y una tienda de
                campaña para 2, entre otros. Este kit tiene un valor total de 1.000$. Su
                Carga es de 30.
            </p>
            <p>
                <strong>Kit de explorador</strong>: Tiene todo lo necesario para salir a
                explorar en la naturaleza, como equipo de escalada, una linterna, … Este
                kit tiene un valor total de 1.000$. Su carga es de 25.
            </p>

            <p>
                <strong>Kit de primeros auxilios</strong>: Contiene vendas y productos
                médicos mundanos que pueden usarse como Acción Extendida sobre una
                criatura a 0 PV. Para hacerlo, el entrenador realiza una Tirada de
                Conocimiento Médico (Mente) CD 10. Si la pasa, la criatura recupera 1 PV
                y deja de estar inconsciente. Este kit tiene 10 usos y un valor total
                del 500$ y su Carga es de 25.
            </p>

            <p>
                <strong>Kit de miscelánea</strong>: Este kit representa un conjunto de
                objetos normales varios que un entrenador podría o no tener, como un
                traje de baño si proviene de un lugar sin costa o una cartera de
                repuesto. Este kit tiene 10 usos y decir que tienes un objeto que no
                está claro si tendrías te cuesta una cantidad de puntos a discreción de
                tu DJ y que variarán según la conveniencia del objeto en la situación en
                la que decides que lo tienes. Tu DJ también podría decir que no es
                posible que tengas un objeto, incluso si intentas usar este Kit, en cuyo
                caso no gastas usos. Este kit vale 1.000$. Su Carga es de 25.
            </p>

            <p>
                Por otro lado, algunos entrenadores no sólo llevan su equipaje encima,
                sino que también llevan Herramientas que pueden usar para crear objetos
                Ya se ha hablado de algunas de estas Herramientas en los apartados
                anteriores, pero quedan en esta sección resumidas:
            </p>

            <p>
                <strong>Herramientas de Medicinas</strong>: Pueden ser usadas para
                preparar y estudiar Medicinas y venenos. Estas herramientas tienen un
                valor de 500$. Es un objeto Pequeño.
            </p>
            <p>
                <strong>Herramientas de Poké Ball</strong>: Pueden ser usadas para
                fabricar y estudiar Poké Balls. Estas herramientas tienen un valor de
                500$. Es un objeto Pequeño
            </p>
            <p>
                <strong>Herramientas de Química</strong>: Pueden ser usadas para
                fabricar Potenciadores y estudiar químicos, venenos y Potenciadores.
                Estas herramientas tienen un valor de 500$. Es un objeto Pequeño.
            </p>

            <p>
                <strong>Herramientas de Inventor</strong>: Los inventores las usan para
                crear sus Invenciones. Estas herramientas tienen un valor de 500$. Es un
                objeto Pequeño.
            </p>

            <p>
                <strong>Utensilios de Cocina</strong>: Pueden ser usadas para cocinar
                comida para todo un grupo como Acción Extendida y puede crear Comidas de
                rareza común. Estos utensilios tienen un valor de 500$. Es un objeto
                Pequeño.
            </p>

            <p>
                <strong>Kit de Botánica</strong>: Puede ser usado para plantar Plantas y
                Bayas
            </p>
            <p>
                Además existen objetos menos comunes, que los entrenadores podrían llegar a obtener y, en algunos
                casos comprar. Todos estos son objetos Enanos.
            </p>
            <p>
                Por ultimo, también existen objetos consumibles. Estos tienen
                un único uso y usualmente pueden comprarse en tiendas o fabricarse
                con Herramientas de Inventor si se conocen las
                invenciones adecuadas. Los objetos consumibles son elementos esenciales
                en el arsenal de cualquier Entrenador, ya que pueden marcar la
                diferencia entre la victoria y la derrota en un enfrentamiento. Su
                disponibilidad en las tiendas puede ser limitada, así que no tengas miedo de
                gastar el dinero en estas cuando las veas.
            </p>

            <div class="enlaceObjetos">
                <router-link :to="{
                    path: '/objetos',
                    query: {
                        tipos: 'Objetos de entrenador,Objetos de entrenador (Consumible)',
                        seleccionado: 'Kit de botánica',
                    },
                }">
                    Ver todos los Objetos de Entrenador
                </router-link>
            </div>
        </div>
    </details>
    <details open id="apartado11">
        <summary>Armas</summary>
        <div class="detailsBloque">
            <p>
                Puede que en la versión del Mundo Pokémon de tu campaña existan las
                armas. Esto no significa que necesariamente tengas que apuñalar o
                disparar con una pistola a tus Pokémon. Quizás las armas que se usen
                sean un poco anacrónicas para nuestro mundo porque estas sean las únicas
                que se sabe cómo potenciar con el poder de los Pokémon, por dar algún
                argumento. Además, las armas podrían ser caricaturescas, como por
                ejemplo un martillo que sea como el de Tinkaton o estrellas ninja que
                sean como estrellas del Movimiento Meteoros.
            </p>
            <h2>¿Cómo funcionan las armas?</h2>
            <p>
                Cada arma tienen 4 Movimientos asociados. 1
                Movimiento Estándar, que hace más daño y tiene más efectos a más PP se
                usan con este, dos Movimientos Especiales, que representan propiedades
                únicas del arma y un Movimiento Especial Superior. Una persona hábil con
                un arma conoce uno o varios de dichos Movimientos y puede usarlos cuando
                la tiene en sus manos. Por último, las armas son objetos Pequeños.
            </p>

            <h2>Crear armas</h2>
            <p>
                No existe una lista de armas. En su lugar, puedes crear
                armas eligiendo un tipo entre Normal, Lucha, Acero y Roca, el cual debe
                tener sentido con el material del que está hecha el arma, y eligiendo
                los Movimientos de Armas que tengan sentido para la idea que tienes, los
                cuales puedes encontrar en la siguiente lista: Movimientos Estándar:
                Tirar, Golpear, Tajar, Disparar. Movimientos Especiales: Ataque doble,
                Doble lanzamiento, Floritura, Quebrar, Barrido, Hender, Lacerar, Ataque
                distante, Disparo ágil, Disparo a las piernas, Bloquear. Movimientos
                Especiales Superiores: Abrir herida, Riposte, Vaciar recámara,
                Contusión, Ataque múltiple, Rociar, Disparo perforante
            </p>
            <h2>Precio de las armas</h2>
            <p>
                El precio de las armas dependerá de cómo se vean
                estas y de qué tan raras son en el Mundo de tu campaña pero un buen
                precio es 3.000$. Si usas armas que se lanza, como cuchillos o estrellas
                ninja, considera que tu arma son 10 de estos. Si tu arma usa munición de
                algún tipo, las piezas de munición que usas cuestan 25$ y gastas una
                pieza por cada Movimiento que usas.
            </p>
            <h2>Fabricar armas</h2>
            <p>
                Si tu DJ lo permite y eres hábil con un tipo de arma que
                no es tecnológicamente muy avanzada, como las armas de fuego, puedes
                fabricar este arma o munición para esta como Acción Extendida. Cuando lo
                haces, esta te cuesta materiales igual a su valor. Un Inventor puede
                usar sus Herramientas de Inventor para crear armas más avanzadas.
            </p>
            <p>
                Encontrarás las descripciones de estos Movimientos en el Capítulo 12:
                Movimientos, en la lista de Movimientos de Armas. Además, el tipo de
                estos Movimientos dependerá del material del arma pero deberá ser uno de
                los siguientes: Normal, Lucha, A cero o Roca.
            </p>
            <h2>Ejemplos de armas</h2>
            <p>Aquí dejamos un par de ejemplos para que te hagas una idea de cuáles podrían ser las armas que uses como
                guía a la hora de saber cómo diseñar armas</p>
            <div class="ejemploArma">
                <div class="arma">
                    <p><span class="weight">Bate de béisbol</span></p>
                    <p><span class="weight">Tipo asociado:</span> Normal.</p>
                    <p><span class="weight">Movimiento Estándar:</span> Golpear</p>
                    <p><span class="weight">Movimientos Especiales:</span> Quebrar, Barrido</p>
                    <p><span class="weight">Movimiento Especial Superior:</span> Contusión</p>
                </div>
                <div class="arma">
                    <p><span class="weight">Estrellas Ninja</span></p>
                    <p><span class="weight">Tipo asociado:</span> Acero.</p>
                    <p><span class="weight">Movimiento Estándar:</span> Lanzar</p>
                    <p><span class="weight">Movimientos Especiales:</span> Disparo ágil, Doble
                        lanzamiento</p>
                    <p><span class="weight">Movimiento Especial Superior:</span> Rociar</p>
                </div>
                <div class="arma">
                    <p><span class="weight">Sable</span></p>
                    <p><span class="weight">Tipo asociado:</span> Acero.</p>
                    <p><span class="weight">Movimiento Estándar:</span> Tajar</p>
                    <p><span class="weight">Movimientos Especiales:</span> Lacerar, Bloquear</p>
                    <p><span class="weight">Movimiento Especial Superior:</span> Riposte</p>
                </div>
                <div class="arma">
                    <p><span class="weight">Hacha de Cleavor</span></p>
                    <p><span class="weight">Tipo asociado:</span> Roca.</p>
                    <p><span class="weight">Movimiento Estándar:</span> Tajar</p>
                    <p><span class="weight">Movimientos Especiales:</span> Lacerar, Hendir</p>
                    <p><span class="weight">Movimiento Especial Superior:</span> Abrir herida</p>
                </div>
            </div>
        </div>


    </details>

    <details open id="apartado12">
        <summary>Fósiles</summary>
        <div class="detailsBloque">
            <p>
                Los Fósiles son rocas que conservan el ADN o algún rastro de estructuras
                biológicas de una especie Pokémon del pasado. Estos fósiles pueden
                restaurarse en facilidades adecuadas, usualmente como un favor o pagando
                un precio alto.
            </p>
            <p>
                Tu DJ decide cuánto tardan en traer a la vida y el nivel de los Pokémon
                creados con un fósil, pero lo normal es que vuelvan siendo nivel 4 y que
                tarden uno o dos días en restaurarlos.
            </p>
            <p>
                Si en tus campañas tu DJ decide que hay Pokémon que vienen del pasado
                que usualmente no provienen de este, como los Pokémon paradoja del
                pasado, puede elegir crear fósiles para estos, así que, cuando entres a
                una cueva, presta atención, quizás te encuentres con alguna sorpresa.
            </p>
            <div class="enlaceObjetos">
                <router-link :to="{
                    path: '/objetos',
                    query: { tipos: 'Fósil', seleccionado: 'Ámbar Viejo' },
                }">
                    Ver todos los Fósiles
                </router-link>
            </div>
        </div>
    </details>

    <details open id="apartado13">
        <summary>Objetos Míticos</summary>
        <div class="detailsBloque">
            <p>
                Los objetos míticos son objetos únicos o inusitadamente raros. En muchas
                ocasiones, serán el centro de alguna trama de una campaña. Tu DJ puede
                inventar otros o modificar los de la tabla inferior, pero estos son una
                guía de algunos objetos que podrían aparecer a lo largo de las aventuras
                de tu campaña.
            </p>
            <div class="enlaceObjetos">
                <router-link :to="{
                    path: '/objetos',
                    query: { tipos: 'Objetos míticos', seleccionado: 'Arca de Zygarde' },
                }">
                    Ver todos los Objetos Míticos
                </router-link>
            </div>
        </div>
    </details>

    <details open id="apartado14">
        <summary>Objetos de Transformaciones y Movimientos Especiales</summary>
        <div class="detailsBloque">
            <p>
                La Megaevolución, los Movimientos Z, el Dinamax y la Teracristalización
                requieren de objetos especiales, difíciles de conseguir y muy caros de
                comprar. En esta sección trataremos estos objetos, sus rarezas y sus
                precios.
            </p>
            <h2>Megaevolución</h2>
            <p>
                La Megaevolución requiere, entre otros, de dos objetos:
                Una Megapiedra de la especie del Pokémon, un objeto Enano, y un Mega
                abalorio, un objeto Enano. Tanto la Megapiedra como el Mega abalorio son
                de rareza Muy Rara, pero las primeras cuestan, de poder comprarse,
                25.000$ y las segundas 50.000$.
            </p>
            <h2>Movimientos Z</h2>
            <p>
                Los Movimientos Z requieren, entre otros, de dos objetos:
                Un Cristal Z de la especie del Pokémon, un objeto Enano, y una Pulsera
                Z, otro objeto Enano. Tanto los Cristales Z como la Pulsera Z son de
                rareza Muy Rara, pero los primeros cuestan, de poder comprarse, 25.000$
                y las Pulseras Z 50.000$, que son mucho más raras.
            </p>
            <p>
                Hay dos tipos de Cristales Z, los asociados a un Tipo Elemental, que
                pueden ser usados por todo Pokémon que conozca al menos un Movimiento de
                dicho Tipo, y los asociados a una Especie Pokémon, que sólo pueden ser
                usados por miembros de dicha especie. Los segundos son los más raros y
                podrían llegar a ser más caros si se encuentran a la venta.
            </p>
            <h2>Dinamax y Gigamax</h2>
            <p>
                Para usar el Dinamax o el Gigamax el entrenador debe
                tener una Maxi muñequera, un objeto Enano. Esta es un objeto Raro que
                usualmente tiene valor de 15.000$. Para que los Pokémon puedan usar el
                Dinamax requieren de Energía Dinamax. Podrán encontrar fuentes de esta
                energía para absorber y, además, objetos que al ser consumidos o tocados
                imbuyen de energía. Los precios de estos objetos rondarán los 5.000$.
            </p>
            <h2>Teracristalización</h2>
            <p>
                Teracristalización Para usar la Teracristalización es necesario un Orbe
                Teracristal, un objeto Raro y Enano hecho con cristales imbuidos de
                energía teracristal y por valor de 20.000$
            </p>
            <p>
                Los Pokémon requieren tener energía terastal para poder Teracristalizar
                y esta puede obtenerse del entorno o de un Teralito, un cristal de
                energía terastal que contiene energía de un Tipo Elemental o de Tipo
                Astral. Los Teralitos de Tipo Elemental son Raros y tienen un valor de
                10.000$ y los de Tipo Astral son Muy Raros y tienen valor de 15.000$.
                Para utilizarse, los Teralitos deben punzar de forma indolora sobre el
                Pokémon que los absorberá como Acción Extendida. Esta punzada no causa
                dolor, pero el Teralito debe mantenerse
            </p>
            <h2>Fabricar Objetos</h2>
            <p>
                Los Mega Abalorios, Las Pulseras Z, las Maximuñequeras
                y los Orbes Teracristal no existen de forma natural, sino que son
                creados a partir de materiales tan raros como estos objetos. Estos
                materiales son una Piedra Activadora para los Mega abalorios, Piedras
                Mágicas Brillantes para la Pulsera Z, una Estrella Deseo para la Maxi
                muñequera y cristales terastal para el Orbe Teracristal. Estos
                materiales tienen un coste equivalente al 75% del coste del objeto final
                y pueden ser llevados a artesanos para que los transformen en sus
                objetos asociados o, alternativamente, si un Inventor supera una Tirada
                de Conocimiento Tecnológico CD 35 para los Mega Abalorios y las Pulseras
                Z ó CD 25 para la Maximuñequera y el Orbe Teracristal, sabe cómo
                convertirlos en sus objetos asociados como una Acción Extendida que
                requiere materiales comunes extra por valor de un 10% del valor del
                objeto a fabricar.
            </p>
        </div>
    </details>
</template>

<style scoped>
.ejemploArma {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 20px;
}

.arma {
    width: 400px;
    border-radius: 5px;
    padding: 5px 10px;
    background-color: var(--color-secundario);
}
</style>