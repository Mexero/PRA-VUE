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
                            <img src="../../public/assets/icons/ClasesIcon.webp" alt="">
                            <span class="textoBloque">Clases</span>
                        </div>
                    </RouterLink>
                    <RouterLink to="/pokedex">

                        <div class="bloque">
                            <img src="../../public/assets/icons/PokedexIcon.webp" alt="">
                            <span class="textoBloque"> Pokédex</span>
                        </div>
                    </RouterLink>
                </div>
                <div class="pareja">

                    <RouterLink to="/habilidades">
                        <div class="bloque">
                            <img src="../../public/assets/icons/HabIcon.svg" alt="">

                            <span class="textoBloqueG"> Habilidades </span>
                        </div>
                    </RouterLink>
                    <RouterLink to="/movimientos">
                        <div class="bloque">
                            <img src="../../public/assets/icons/MovIcon.svg" alt="">

                            <span class="textoBloqueG"> Movimientos</span>

                        </div>
                    </RouterLink>
                </div>
            </div>

            <div class="filaMenuPlayer">
                <div class="pareja">
                    <RouterLink to="/reglas">
                        <div class="bloque">
                            <img src="../../public/assets/icons/ReglasIcon.svg" alt="">
                            <span class="textoBloque"> Reglas</span>

                        </div>
                    </RouterLink>
                    <RouterLink to="/reglas">
                        <div class="bloque">
                            <img src="../../public/assets/icons/EstadosIcon.webp" alt="">
                            <span class="textoBloque"> Estados</span>
                        </div>
                    </RouterLink>
                </div>
                <div class="pareja">
                    <RouterLink to="/objetos">
                        <div class="bloque">
                            <img src="../../public/assets/icons/ObjetosIcon.webp" alt="">
                            <span class="textoBloque"> Objetos </span>
                        </div>
                    </RouterLink>
                    <RouterLink to="/dotes">
                        <div class="bloque">
                            <img src="../../public/assets/icons/DotesIcon.svg" alt="">
                            <span class="textoBloque"> Dotes </span>
                        </div>
                    </RouterLink>
                </div>
            </div>
        </section>

        <section id="infoBloque">

            <!-- ============ INFO "CONTACTOS" ============= -->
            <article id="infoContacto">
                <div>
                    <h2>¡Unete a nuestra comunidad!</h2>
                    <RouterLink to=""><img src="../../public/assets/icons/discord.webp" alt=""></RouterLink>
                </div>
                <div>
                    <p>
                        En nuestra comunidad de Discord podrás mantenerte al día con las novedades del sistema,
                        compartir historias, personajes, arte,y conocer a otros fans del rol y Pokémon que comparten tu
                        pasión. ¡Únete y sé parte de la aventura!
                    </p>
                </div>

            </article>
            <article class="descargaPDF" id="inicioRapido">
                <h2>
                    Inicio rapido
                </h2>
                <p>
                    Aqui puedes ver un resumen rapido del sistema
                </p>
                <div class="PDFlinks">
                    <RouterLink to="" target="_blank">
                        <div>PDF Resumen del sistema</div>
                    </RouterLink>
                    <RouterLink to="" target="_blank">
                        <div>PDF Combate rapido</div>
                    </RouterLink>
                </div>
            </article>

            <!-- ============ INFO "DESCAGARS" ============= -->

            <article class="descargaPDF" id="descargaLibro">
                <h2>Descarga las ultimas versiones</h2>
                <div class="PDFlinks">
                    <RouterLink to="" target="_blank">
                        <div>PDF Base</div>
                    </RouterLink>
                    <RouterLink to="" target="_blank">
                        <div>PDF Pokedex</div>
                    </RouterLink>
                    <RouterLink to="" target="_blank">
                        <div>PDF Pokedex DM</div>
                    </RouterLink>
                </div>
            </article>
        </section>

        <!-- ============ INFO "SOBRE NOSOTROS" ============= -->

        <section id="infoNosotros">

            <div id=imgInfoNosotros>
                <img src="../../public/assets/img/literalmentenosotros.webp" alt="">
            </div>
            <div class="textoInfo">
                <h2>¿Quienes somos?</h2>
                <p>
                    Somos un grupito de amigos que comenzó a jugar rol por Discord desde hace algunos años. Empezamos
                    a jugar una campaña de Pokémon y, como no encontramos un sistema que nos terminara de convencer
                    adaptamos uno con el que éramos muy cercanos, el clásico Dragones y Mazmorras (D&D) 5ª edición.
                </p>
                <p>
                    Tras las primeras partidas haciendo malabares para que no desentonaran un "Artificiero", un "Pícaro"
                    y un "Bardo" en el mundo de Pokémon, nuestro querido DJ llegó diciendo "Chavales, mirad
                    esto" y, de alguna forma que no entendemos, el que decía nunca tener tiempo libre ya había escrito
                    300 páginas de su propio sistema de roleplay de Pokémon.
                </p>
                <p>
                    Desde entonces, jugamos la campaña con ese sistema. Ayudando a mejorar, añadir, corregir y pulir lo
                    que ahora se llama <strong>Pokémon Roleplaying Adventure</strong> (o <strong>PRA</strong> para
                    abreviar). Y, finalmente, tras un par de años, lo hicimos público para aquellos fans del rol y
                    Pokémon que quisieran jugarlo.
                </p>
            </div>

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
                    <h3>¿Cómo empiezo a jugar?</h3>
                    <p>
                        Puedes comenzar leyendo el sistema de <strong>Pokémon Roleplaying Adventure</strong> en esta
                        misma pagina web o abrir y descargar el PDF de la ultima versión. Después, convence a algunos
                        amigos de jugar o pregunta en nuestro Discord si algún DJ busca jugadores.
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
                        <!--Y a comprar peluches de fuecoco-->
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
.descargaPDF {
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
    overflow: hidden;
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
.descargaPDF {
    width: 30%;
    min-width: 280px;
    min-height: fit-content;
    padding: 20px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: center;
    box-shadow: 5px 5px 10px black;

}

.PDFlinks {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    gap: 10px;
}

.descargaPDF a {
    width: 100%;
}

.PDFlinks div {
    width: 100%;
    background-color: var(--color-principal1);
    border-radius: 8px;
    padding: 10px 0;
    text-align: center;
    font-size: 20px;
    transition: all 0.15s;
    cursor: pointer;
}

.PDFlinks div:hover {
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

@media (max-width: 1300px) {
    #infoBloque {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-template-areas:
            "inicioRapido descargaLibro"
            "infoContacto infoContacto";
        gap: 30px;
        width: 90%;
        max-width: 1700px;
        margin-top: 60px;
        align-self: center;
    }

    #infoContacto {
        grid-area: infoContacto;
    }

    #inicioRapido {
        grid-area: inicioRapido;
    }

    .descargaPDF {
        grid-area: descargaLibro;
    }

    #infoContacto,
    .descargaPDF {
        width: 100%;
    }
}

@media (max-width: 690px) {

    .descargaPDF h2,
    .descargaPDF p {
        margin-bottom: 10px;
    }

    .PDFlinks div {
        margin: 2px 0;
    }

    #infoBloque {
        max-height: none;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        grid-template-areas:
            "inicioRapido"
            "descargaLibro"
            "infoContacto";
        gap: 40px;
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