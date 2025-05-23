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
                    que ya conocíamos, el clásico Dragones y Mazmorras (D&D) de 5ª edición.
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
                <div >
                    <p>
                        Puedes unirte a nuestra comunidad de discord para saber más, preguntarnos directamente tus dudas
                        y hacer amigos con los que jugar ¿A que estas esperando?
                    </p>
                    <p>
                        Tambien podras compartir con todos tus propias historias, opiniones, arte y mucho más :D
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
main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
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

#infoNosotros {
    width: 90%;
    max-width: 1700px;
    max-height: 650px;
    margin-top: 60px;
    display: flex;
    align-self: center;
    overflow: hidden;
    border-radius: 10px;
    background-color: var(--color-fondoTexto);
    border: 1px solid var(--color-principal1);
    box-shadow: 0px 0px 4px var(--color-principal1);
    color: var(--color-texto);
}

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

#imgInfoNosotros {
    overflow: hidden;
    width: 60%;
}

#imgInfoNosotros img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

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
        overflow: hidden;
        width: 100%;
        max-height: 300px;

    }

    #imgInfoNosotros img {
        object-position: top;

    }
}




/* ======================= SECCIÓN INFO =======================  */


/* ======================= ARTICLE REDES ======================= */

#infoBloque {
    width: 90%;
    max-width: 1700px;
    max-height: 650px;
    margin-top: 60px;
    display: flex;
    align-self: center;
    color: var(--color-texto);
    gap: 20px;
}

#infoContacto {
    display: flex;
    flex-direction: column;
    align-self: center;
    width: 70%;
    min-width: 280px;
    padding: 24px 20px;
    border-radius: 15px;
    background-color: var(--color-fondoTexto);
    border: 1px solid var(--color-principal1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);

}

#infoContacto > div:first-child {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 10px;
}

#infoContacto img,
#infoContacto a {
    width: 48px;
    height: 48px;
    display: inline-block;
    transition: transform 0.2s;
}


#infoContacto a:hover img {
    transform: scale(1.15) rotate(-8deg);
    filter: drop-shadow(0 0 6px var(--color-principal1));
}

#infoContacto > div:last-child p {
    text-align: justify;
    font-size: 1rem;
    color: var(--color-texto, #e0e0e0);
    margin: 10px 0 0 0;
    line-height: 1.6;
}

@media (max-width: 900px) {
    #infoContacto {
        width: 90%;
        max-width: 100%;
        padding: 16px 8px;
    }
    #infoContacto h2 {
        font-size: 1.1rem;
    }
    #infoContacto img,
    #infoContacto a {
        width: 38px;
        height: 38px;
    }
}
/* ======================= ARTICLE DESCARGAS ======================= */
#descargaPDF {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40%;
    min-width: 250px;
    padding: 24px 20px;
    border-radius: 15px;
    background-color: var(--color-fondoTexto);
    border: 1px solid var(--color-principal1);
    gap: 18px;
}

#descargaPDF h2 {
    font-size: 1.3rem;
    color: var(--color-principal1);
    margin-bottom: 18px;
    font-weight: 700;
    text-align: center;
}

#descargaPDF a {
    width: 100%;
    text-decoration: none;
}

#descargaPDF div {
    width: 100%;
    background-color: var(--color-principal1);
    border-radius: 8px;
    padding: 12px 0;
    margin-bottom: 10px;
    text-align: center;
    font-size: 1.1rem;
    font-weight: 600;
    transition: background 0.2s, color 0.2s, transform 0.15s;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

#descargaPDF div:hover {
    background-color: var(--color-hoverBloque);
    transform: scale(1.04);
}

@media (max-width: 900px) {
    #descargaPDF {
        max-width: 100%;
        padding: 16px 8px;
    }
    #descargaPDF h2 {
        font-size: 1.1rem;
    }
    #descargaPDF div {
        font-size: 1rem;
        padding: 10px 0;
    }
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
</style>