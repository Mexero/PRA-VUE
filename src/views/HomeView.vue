<template>
  <main>
        <section id="menuPlayer">
            <div class="filaMenuPlayer">
                <div class="pareja">
                    <a href="../clases/clases.php">
                        <div class="bloque">
                            <img src="../assets/icons/ClasesIcon.webp" alt="">
                            <span class="textoBloque">Clases</span>
                        </div>
                    </a>
                    <a href="../pokedex/pokedex.php">

                        <div class="bloque">
                            <img src="../assets/icons/PokedexIcon.webp" alt="">
                            <span class="textoBloque"> Pokédex</span>
                        </div>
                    </a>
                </div>
                <div class="pareja">

                    <a href="../habilidades/habilidades.php">
                        <div class="bloque">
                            <img src="../assets/icons/HabIcon.svg" alt="">

                            <span class="textoBloqueG"> Habilidades </span>
                        </div>
                    </a>
                    <a href="../movimientos/movimientos.php">
                        <div class="bloque">
                            <img src="../assets/icons/MovIcon2.webp" alt="">

                            <span class="textoBloqueG"> Movimientos</span>

                        </div>
                    </a>
                </div>
            </div>

            <div class="filaMenuPlayer">
                <div class="pareja">
                    <a href="#"> <!-- Falta poner este link -->
                        <div class="bloque">
                            <img src="../assets/icons/ReglasIcon2.webp" alt="">
                            <span class="textoBloque"> Reglas</span>

                        </div>
                    </a>
                    <a href="../capitulos/capitulos.php?filtro=otrasReglas#sec3"> <!-- cAMBIAR LINK A REGLAS -->
                        <div class="bloque">
                            <img src="../assets/icons/EstadosIcon.webp" alt=""> 
                            <span class="textoBloque"> Estados</span>
                        </div>
                    </a>
                </div>
                <div class="pareja">
                    <a href="../objetos/objetos.php">
                        <div class="bloque">
                            <img src="../assets/icons/ObjetosIcon.webp" alt="">
                            <span class="textoBloque"> Objetos </span>
                        </div>
                    </a>
                    <a href="../dotes/dotes.php">
                        <div class="bloque">
                            <img src="../assets/icons/DotesIcon.webp" alt="">
                            <span class="textoBloque"> Dotes </span>
                        </div>
                    </a>
                </div>
            </div>
        </section>

        <!-- ============ INFO "SOBRE NOSOTROS" ============= -->

        <section id="infoNosotros">
            <div>
                <div id=imgInfoNosotros>
                    <img src="../assets/img/literalmentenosotros.jpg" alt="">
                </div>
                <div id=textoInfoNosotros>
                    <h2 class="tituloInfo">¿Quienes somos?</h2>
                    <!-- Texto de ejemplo, reemplazar en la version final -->
                    <p class="textoInfo">Un día, un grupo de amigos y yo estábamos buscando algo nuevo para jugar, y Ruben propuso: "¿Qué
                        tal un juego de rol de Pokémon?". Al principio, no había ningún sistema que nos convenciera, así
                        que decidimos crear el nuestro. Usamos dados de muchas caras y diseñamos un sistema donde tanto
                        los entrenadores como los Pokémon podían evolucionar y formar una relación más profunda.
                        Queríamos que las decisiones de los jugadores influyeran en la historia.</p>
                </div>
            </div>
        </section>

        <!-- ============ INFO "CONTACTOS" ============= -->
        <section id="bloqueInfo2">
            <article id="infoRedes">
                <div>
                    <h2 class="tituloInfo">¡Unete a nuestra comunidad!</h2>

                    <p class="textoInfo">
                        Puedes unirte a nuestra comunidad de discord para saber más, preguntarnos directamente tus dudas
                        y hacer amigos con los que jugar ¿A que estas esperando?
                        <br><br>
                        Tambien podras compartir con todos tus propias historias, opiniones, arte y mucho más :D
                    </p>
                </div>
                <a href=""><img src="../assets/icons/discord.webp" alt="" width="50px"></a>

            </article>

            <!-- ============ INFO "DESCAGARS" ============= -->

            <article id="infoDescargas">
                <h2 class="tituloInfo">Descarga las ultimas versiones</h2>
                <a href="../Libro_base.pdf" target="_blank">
                    <div>PDF Base</div>
                </a>
                <a href="">
                    <div>PDF Pokedex</div>
                </a>
                <a href="">
                    <div>PDF Pokedex DM</div>
                </a>
            </article>
        </section>


        <!--  ============ PREGUNTAS FRECUENTES =============  -->

        <section id="infoFAQ">

            <article id="FAQ">
                <h2>FAQ</h2>
                <div>
                    <h3>¿Como empezar a jugar? </h3>
                    <p>Asi y asa, aqui y alla con esto y aquello</p>
                </div>
                <div>
                    <h3>¿Todo el contenido es gratis? </h3>
                    <p>Si.</p>
                </div>
                <div>
                    <h3>¿Puedo contribuir al proyecto? </h3>
                    <p>Si, de varias formas. Desde simples reportes de erratas, bugs o problemas de balance hasta
                        pequeñas donaciones para ayudarnos a mantener esta pagina web. Más detalles en nuestro discord. </p>
                </div>
                <div>
                    <h3>¿Se guardan mis ajustes? </h3>
                    <p>Esta pagina no tiene un sistema de cuentas de usuario. Todos los ajustes estan guardados en
                        cookies, si las eliminas o estas en pesataña incognito se borraran. </p>
                </div>
                <div>
                    <h3>¿Como encuentro gente para jugar? </h3>
                    <p>En nuestro discord.</p>
                </div>
            </article>
        </section>

    </main>
</template>