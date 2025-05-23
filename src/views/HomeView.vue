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
                            <img src="../assets/icons/MovIcon.svg" alt="">

                            <span class="textoBloqueG"> Movimientos</span>

                        </div>
                    </RouterLink>
                </div>
            </div>

            <div class="filaMenuPlayer">
                <div class="pareja">
                    <RouterLink to="#"> <!-- Falta poner este link -->
                        <div class="bloque">
                            <img src="../assets/icons/ReglasIcon.svg" alt="">
                            <span class="textoBloque"> Reglas</span>

                        </div>
                    </RouterLink>
                    <RouterLink to="/capitulos"> <!-- CAMBIAR LINK A REGLAS -->
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
                            <img src="../assets/icons/DotesIcon.svg" alt="">
                            <span class="textoBloque"> Dotes </span>
                        </div>
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- ============ INFO "SOBRE NOSOTROS" ============= -->

        <section id="infoNosotros">

            <div id=imgInfoNosotros>
                <img src="../assets/img/literalmentenosotros.webp" alt="">
            </div>
            <div class="textoInfo">
                <h2>¿Quienes somos?</h2>
                <p>
                    Somos un grupito de amigos que comenzó a jugar rol por Discord desde hace ya algunos años. Empezamos
                    a jugar una campaña de Pokémon y, como no encontramos un sistema que nos convencía, adaptamos uno
                    que ya conocíamos, el clásico Dragones y Mazmorras (D&D) 5ª edición.
                </p>
                <p>
                    Tras las primeras partidas haciendo malabares para que no desentonaran un "Artificiero", un "Pícaro"
                    y un "Bardo" en el mundo de Pokémon, nuestro querido DJ llego una tarde diciendo "Chavales, mirar
                    esto" y de alguna forma que no entendemos, el que decía nunca tener tiempo libre ya había escrito
                    300 páginas de su propio sistema de rolplay de Pokémon.
                </p>
                <p>

                    Desde entonces jugamos la camñana con ese sistema. Ayudando a mejorar, añadir, corregir y pulir lo
                    que ahora se llama <strong>Pokémon Roleplaying Adventure</strong> (o <strong>PRA</strong> para
                    abreviar). Y finalmente, tras un par de años, lo hicimos público para aquellos fans del rol y
                    Pokémon.
                </p>
            </div>

        </section>


        <section id="infoBloque">

            <!-- ============ INFO "CONTACTOS" ============= -->
            <article id="infoContacto">
                <div>
                    <h2>¡Unete a nuestra comunidad!</h2>
                    <RouterLink to=""><img src="../assets/icons/discord.webp" alt=""></RouterLink>
                </div>
                <div>
                    <p>
                        En nuestra comunidad de Discord podrás mantenerte al día con las novedades del sistema,
                        compartir historias, personajes, arte, y conocer a otros fans del rol y Pokémon que comparten tu
                        pasión. ¡Únete y sé parte de la aventura!
                    </p>
                </div>

            </article>

            <!-- ============ INFO "DESCAGARS" ============= -->

            <article id="descargaPDF">
                <h2>Descarga las ultimas versiones</h2>
                <RouterLink to="" target="_blank">
                    <div>PDF Base</div>
                </RouterLink>
                <RouterLink to="" target="_blank">
                    <div>PDF Pokedex</div>
                </RouterLink>
                <RouterLink to="" target="_blank">
                    <div>PDF Pokedex DM</div>
                </RouterLink>
            </article>
        </section>


        <!--  ============ PREGUNTAS FRECUENTES =============  -->

        <section id="infoFAQ">

            <article id="FAQ">
                <h2>FAQ</h2>
                <div>
                    <h3>¿Todo el contenido es gratis?</h3>
                    <p>Si.</p> <!-- No nos podemos permitir una demanda de Nintendo  -->
                </div>
                <div>
                    <h3>¿Cómo empezar a jugar?</h3>
                    <p>
                        Puedes comenzar leyendo el sistema de <strong>Pokémon Roleplaying Adventure</strong> en esta
                        misma pagina web o abrir y descargar el PDF de la ultima version. Despues solo convence algunos
                        amigos de jugar o pregunta en nuestro Discord si algun DJ busca jugadores.
                    </p>
                </div>

                <div>
                    <h3>¿Puedo contribuir al proyecto?</h3>
                    <p>
                        Sí, puedes contribuir de varias formas. Desde compartir tu opinión sobre el sistema hasta
                        ayudarnos a mejorar con tus sugerencias. En nuestro Discord puedes darnos feedback, reportar
                        erratas, bugs o problemas de balance. La opinión de los jugadores es muy importante para
                        nosotros.

                        También, puedes apoyarnos con pequeñas donaciones que nos ayudan a mantener esta página web.
                    </p>
                </div>

            </article>
        </section>

    </main>
</template>


<style scoped>
main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

h2 {
    font-size: 26px;
}

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
    background-color: var(--color-secundario);
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



/* ======================= SECCIÓN INFO NOSOTROS Y BLOQUES ======================= */

#infoNosotros,
#infoContacto,
#descargaPDF {
    background-color: var(--color-fondoTexto);
    border: 1px solid var(--color-principal1);
    color: var(--color-texto);
    box-shadow: 0px 0px 4px var(--color-principal1);

}

#infoNosotros,
#infoBloque {
    width: 90%;
    max-width: 1700px;
    max-height: 650px;
    margin-top: 60px;
    display: flex;
    align-self: center;
}

#infoNosotros,
#infoContacto {
    border-radius: 10px;
}

#infoBloque {
    gap: 30px;
}

/* Contacto */
#infoContacto {
    width: 70%;
    min-width: 280px;
    padding: 24px 20px;
    font-size: 22px;
}

#infoContacto h2 {
    font-size: 30px;
}

#infoContacto p {
    margin-top: 16px;
    text-align: justify;
    line-height: 1.5;
}

#infoContacto div {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: center;
}

#infoContacto img,
#infoContacto a {
    width: 50px;
    height: 50px;
    transition: transform 0.2s;
}

#infoContacto a:hover img {
    transform: scale(1.15) rotate(-8deg);
    filter: drop-shadow(0 0 6px var(--color-principal1));
}

/* Descargas */
#descargaPDF {
    width: 30%;
    min-width: 280px;
    height: fit-content;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 15px;
    gap: 10px;
}

#descargaPDF a {
    width: 100%;
}

#descargaPDF div {
    width: 100%;
    background-color: var(--color-principal1);
    border-radius: 5px;
    padding: 5px 0;
    text-align: center;
    font-size: 20px;
    transition: all 0.15s;
    cursor: pointer;
}

#descargaPDF h2 {
    text-align: center;
}

#descargaPDF div:hover {
    transform: scale(1.03);
}

/* Texto info */
.textoInfo {
    padding: 30px 20px;
    width: 90%;
}

.textoInfo p {
    line-height: 30px;
    padding: 15px;
    font-size: 18px;
    text-align: justify;
}

/* Imagen info */
#imgInfoNosotros {
    overflow: hidden;
    width: 60%;
}

#imgInfoNosotros img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ======================= SECCIÓN INFO MOVIL =======================  */

@media screen and (max-width:1050px) {
    .textoInfo p {
        line-height: 25px;
        font-size: 15px;
    }
}

@media screen and (max-width:750px) {
    #infoNosotros {
        flex-direction: column;
        max-height: none;
    }

    .textoInfo {
        padding: 10px;
        width: 100%;
    }

    .textoInfo p {
        padding: 10px;
        font-size: 16px;
    }

    #imgInfoNosotros {
        width: 100%;
        max-height: 300px;
    }

    #imgInfoNosotros img {
        object-position: top;
    }
}

@media (max-width: 690px) {
    #infoBloque {
        flex-direction: column;
        max-height: none;
    }

    #infoContacto,
    #descargaPDF {
        width: 100%;
    }
}

/* ======================= SECTION PREGUNTAS FRECUENTES ======================= */
#infoFAQ {
    color: var(--color-texto);
    margin-top: 60px;
}

#FAQ h2 {
    padding: 10px 30px;
}

#FAQ div {
    background-color: var(--color-oscuro1);
    border-bottom: 1px solid gray;
    padding: 10px 30px;
    font-size: 20px;
}

#FAQ p {
    padding: 10px;
}

@media (max-width: 690px) {
    #FAQ div {
        padding: 10px;

        font-size: 16px;
    }

    #FAQ p {
        padding: 5px;
    }
}
</style>