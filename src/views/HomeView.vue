<script setup>
import { RouterLink } from 'vue-router'
</script>



<template>
    <main>
        <section id="menuPlayer">
            <div class="filaMenuPlayer">
                <div class="pareja">
                    <RouterLink to="/clases">
                        <div class="bloque">
                            <img src="../assets/icons/ClasesIcon.webp" alt="">
                            <span class="textoBloque">Clases</span>
                        </div>
                    </RouterLink>
                    <RouterLink to="/pokedex">

                        <div class="bloque">
                            <img src="../assets/icons/PokedexIcon.webp" alt="">
                            <span class="textoBloque"> Pokédex</span>
                        </div>
                    </RouterLink>
                </div>
                <div class="pareja">

                    <RouterLink to="/habilidades">
                        <div class="bloque">
                            <img src="../assets/icons/HabIcon.svg" alt="">

                            <span class="textoBloqueG"> Habilidades </span>
                        </div>
                    </RouterLink>
                    <RouterLink to="/movimientos">
                        <div class="bloque">
                            <img src="../assets/icons/MovIcon2.webp" alt="">

                            <span class="textoBloqueG"> Movimientos</span>

                        </div>
                    </RouterLink>
                </div>
            </div>

            <div class="filaMenuPlayer">
                <div class="pareja">
                    <RouterLink to="#"> <!-- Falta poner este link -->
                        <div class="bloque">
                            <img src="../assets/icons/ReglasIcon2.webp" alt="">
                            <span class="textoBloque"> Reglas</span>

                        </div>
                    </RouterLink>
                    <RouterLink to="/capitulos"> <!-- cAMBIAR LINK A REGLAS -->
                        <div class="bloque">
                            <img src="../assets/icons/EstadosIcon.webp" alt="">
                            <span class="textoBloque"> Estados</span>
                        </div>
                    </RouterLink>
                </div>
                <div class="pareja">
                    <RouterLink to="/objetos">
                        <div class="bloque">
                            <img src="../assets/icons/ObjetosIcon.webp" alt="">
                            <span class="textoBloque"> Objetos </span>
                        </div>
                    </RouterLink>
                    <RouterLink to="/dotes">
                        <div class="bloque">
                            <img src="../assets/icons/DotesIcon.webp" alt="">
                            <span class="textoBloque"> Dotes </span>
                        </div>
                    </RouterLink>
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
                    <p class="textoInfo">Un día, un grupo de amigos y yo estábamos buscando algo nuevo para jugar, y
                        Ruben propuso: "¿Qué
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
                <RouterLink to=""><img src="../assets/icons/discord.webp" alt="" width="50px"></RouterLink>

            </article>

            <!-- ============ INFO "DESCAGARS" ============= -->

            <article id="infoDescargas">
                <h2 class="tituloInfo">Descarga las ultimas versiones</h2>
                <RouterLink to="" target="_blank">
                    <div>PDF Base</div>
                </RouterLink>
                <RouterLink to="">
                    <div>PDF Pokedex</div>
                </RouterLink>
                <RouterLink to="">
                    <div>PDF Pokedex DM</div>
                </RouterLink>
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
                        pequeñas donaciones para ayudarnos a mantener esta pagina web. Más detalles en nuestro discord.
                    </p>
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


<style scoped>
/* ======================= SECTION DE BLOQUES DEL INDEX ======================= */
#menuPlayer {
    /* Margen con el header */
    margin-top: 50px;
}

/* ======================= CONTENIDO DEL SECTION MENU DEL INDEX ======================= 
Son 2 filas de 2 parejas de bloques cada uno que se acomodan segun el tamaño de la pagina */
.filaMenuPlayer,
.pareja {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
}

.filaMenuPlayer {
    margin-bottom: 20px;
}

.pareja {
    width: calc(50%-20px);
}

/* ======================= BLOQUE INDIVIDUAL DEL MENU INDEX ======================= */
.bloque {
    padding: 10px;
    min-width: 205px;
    aspect-ratio: 1/1;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    font-size: 30px;
    background-color: var(--color-oscuro1);
    border: 1px solid var(--color-principal1);
    border-radius: 10px;
}

.bloque img {
    width: 110px;
    filter: var(--color-icon);
}

.bloque:hover img {
    width: 90px;
    transition: all 0.3s ease-out;
}

.bloque:hover .textoBloqueG,
.bloque:hover .textoBloque {
    transition: all 0.3s ease-out;
    font-weight: 500;
}

.bloque:hover .textoBloque {
    font-size: 40px;
}

.bloque:hover .textoBloqueG {
    font-size: 32px;
}

.bloque:hover,
#infoDescargas div:hover {
    background-color: var(--color-hoverBloque);
    border-color: var(--color-texto);
}

#infoDescargas div:hover {
    background-color: var(--color-segundario);
    border-color: var(--color-texto);
}


/* ======================= MODO MOVIL DEL SECTION MENU DEL INDEX ======================= 
solo cambia el tamaños de los bloques y el margen con el header*/
@media screen and (max-width: 500px) {

    #menuPlayer {
        margin-top: 10px;
    }

    .bloque {
        min-width: 150px;
        font-size: 20px;
    }

    .bloque img {
        width: 80px;
        margin-bottom: 10px;
    }

    .bloque:hover img {
        width: 70px;
        transition: all 0.4s ease-out;
    }

    .bloque:hover .textoBloque {
        font-size: larger;
    }

    .bloque:hover .textoBloqueG {
        font-size: 22px;
    }

}


/* ======================= SECCIÓN INFO ======================= */
#infoNosotros,
#bloqueInfo2 {
    width: 90%;
    margin-top: 50px;
    display: flex;
    align-self: center;
}

#infoNosotros {
    overflow: hidden;
}

#infoNosotros,
#infoDescargas,
#infoRedes {
    border-radius: 15px;
    background-color: var(--color-fondoTexto);
    border: 1px solid var(--color-principal1);
    box-shadow: 0px 0px 4px var(--color-principal1);
    color: var(--color-texto);
}

#imgInfoNosotros {
    width: 100%;
    height: 200px;
    overflow: hidden;
}

#imgInfoNosotros img {
    width: 100%;
    object-fit: cover;
    object-position: top;
    display: block;
    transform: translateY(-20px);
}

.textoInfo {
    padding: 0 15px 15px 15px;
    font-size: 14px;
    text-align: justify;
}

.tituloInfo {
    margin: 10px;
    font-size: 18px;
}

/* ======================= ARTICLE REDES ======================= */
#infoRedes {
    display: flex;
}

#infoRedes a {
    margin: 45px 10px;
}

/* ======================= ARTICLE DESCARGAS ======================= */
#bloqueInfo2 {
    flex-direction: column;
    gap: 30px;
}

#infoDescargas div {
    border: 1px solid var(--color-principal1);
    background-color: var(--color-BloqueDescargas);
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
}

/* ======================= SECTION PREGUNTAS FRECUENTES ======================= */
#infoFAQ {
    color: var(--color-texto);
    margin-top: 60px;
}

#FAQ h2 {
    padding: 10px;
}

#FAQ div {
    background-color: var(--color-oscuro1);
    border-bottom: 1px solid gray;
    padding: 10px;
    font-size: 13px;
}

/* ======================= DISEÑO RESPONSIVO DE LOS SECTION DE INFORMACION Y PREGUNTAS FRECUENTES ======================= */
@media screen and (min-width:600px) {

    #infoNosotros,
    #bloqueInfo2 {
        width: 80%;
    }

    #infoNosotros div {
        display: flex;
    }

    #textoInfoNosotros {
        width: 50%;
        flex-direction: column;
        font-size: 16px;
        line-height: 30px;
    }

    #imgInfoNosotros {
        width: 50%;
        height: 100%;
    }

    #imgInfoNosotros img {
        object-position: unset;
        transform: none;
    }

    #FAQ div {
        font-size: 15px;
    }
}

@media screen and (min-width:800px) {
    #bloqueInfo2 {
        flex-direction: row;
    }

    #infoDescargas {
        width: 60%;
    }
}
</style>