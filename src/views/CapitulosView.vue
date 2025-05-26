<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref } from 'vue'
import indiceCapitulos from '../localData/json/indiceCapitulos.json' //Info menu indice de capitulos


function toggleSubmenu(indice) {
    openIndex.value = openIndex.value === indice ? null : indice
}
function toggleMenu() {
    openMobileCap.value = !openMobileCap.value
}


//METODOS PARA SUBMENUS
const openIndex = ref(null)
const openMobileCap = ref(false)

</script>

<template>
            <h1 class="mainTitulo" id="chapterStart">Capítulos</h1>


    <nav id="CapMovil">
        <div class="navLogic" v-click-outside="() => openMobileCap = false">
            <Transition :name="'slideMovilMenu'">
                <div id="desplegarMenu" v-if="openMobileCap">

                    <ul>
                        <li class="abrirMenuCap" v-for="(capitulo, indice) in indiceCapitulos" :key="indice">

                            <div @click.stop="toggleSubmenu(indice)">
                                <RouterLink :to="capitulo.ruta"> {{ capitulo.capitulo }} </RouterLink>
                            </div>

                            <Transition :name="'slideSeccion'">
                                <ul v-if="openIndex === indice">
                                    <li class="subMenuCap" v-for="(seccion, subindice) in capitulo.secciones"
                                        :key="subindice">
                                        <RouterLink :to="seccion.ruta">{{ seccion.nombre }}</RouterLink>
                                    </li>
                                </ul>
                            </Transition>
                        </li>
                    </ul>

                </div>
            </Transition>
        </div>
        <div id="iconoAbrirMenuCapitulos" aria-label="Abrir menú" @click.stop="toggleMenu"
            :class="{ rotado: openMobileCap }"> <img src="../assets/icons/flechaDobleIcon.png" alt="icono flechas">
        </div>
    </nav>


    <main id="mainCaps">
        <aside>
            <nav id="menuCapitulos">
                <ul>
                    <li class="abrirMenuCap" v-for="(capitulo, indice) in indiceCapitulos" :key="indice">

                        <div @click.stop="toggleSubmenu(indice)">
                            <RouterLink :to="capitulo.ruta">
                                {{ capitulo.capitulo }}
                            </RouterLink>
                        </div>

                        <Transition :name="'slideSeccion'">
                            <ul v-if="openIndex === indice">

                                <li class="subMenuCap" v-for="(seccion, subindice) in capitulo.secciones"
                                    :key="subindice">
                                    <RouterLink :to="seccion.ruta">{{ seccion.nombre }}</RouterLink>
                                </li>

                            </ul>
                        </Transition>
                    </li>
                </ul>
            </nav>
        </aside>
        <section>
            <div id="capitulos">
                <RouterView />
            </div>

        </section>
    </main>
</template>

<style>
#mainCaps {
    display: flex;
    flex-direction: row;
    width: 100%;
    min-height: 100vh;
}

/* === Menu principal escritorio ===*/
section {
    overflow: hidden;
}

aside {
    padding: 10px 0;
}

.weight {
    font-weight: bold;
}

#menuCapitulos {
    width: 230px;
    height: fit-content;
    max-height: 85vh;
    margin-left: 20px;
    position: sticky;
    top: 60px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    border-radius: 5px;
    background-color: var(--color-principal1);
}

/* === SubMenus escritorio ===*/
.abrirMenuCap div a {
    width: 100%;
    max-height: fit-content;
    padding: 10px 5px;
    display: flex;
    cursor: pointer;
    border-bottom: 1px solid var(--color-secundario);
}

.abrirMenuCap:last-child a {
    border: none;
}

.abrirMenuCap div:hover,
.subMenuCap a:hover,
#iconoAbrirMenuCapitulos:hover {
    background-color: var(--color-secundario);

}

.subMenuCap a {
    padding: 10px 15px;
    background-color: var(--color-principal2);
    display: flex;
    width: 100%;
}

/* === Menu principal Movil ===*/
#CapMovil {
    display: none;
    height: 0;
    margin-top: 10px;
    z-index: 9;
    position: sticky;
    top: 50px;
}

#CapMovil ul li {
    background-color: var(--color-principal1);
}

#desplegarMenu {

    display: flex;
    height: fit-content;
    max-height: 80vh;
    position: sticky;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
}

#desplegarMenu .abrirMenuCap {
    width: 270px;
}

#desplegarMenu ul {
    list-style: none;
}

#iconoAbrirMenuCapitulos {
    display: none;
    cursor: pointer;
    width: 40px;
    height: 40px;
    background-color: var(--color-principal1);
}

#iconoAbrirMenuCapitulos img {
    width: 40px;
    padding: 6px;
}

/* === SubMenus escritorio ===*/
@media screen and (max-width:1000px) {

    #menuCapitulos {
        display: none;
    }

    #CapMovil {
        display: flex;
    }

    #iconoAbrirMenuCapitulos {
        display: flex;
    }

}

/* === Transicion icono flecha menu movil cap === */
#iconoAbrirMenuCapitulos img {
    transition: all 0.6s ease-in-out;
}

.rotado img {
    transform: rotateY(180deg);
}


/* === Transicion Submenus === */
.slideSeccion-enter-active,
.slideSeccion-leave-active {
    transition: all 0.4s ease-in-out;
    overflow: hidden;
}

.slideSeccion-enter-from,
.slideSeccion-leave-to {
    max-height: 0px;

}

.slideSeccion-leave-from,
.slideSeccion-enter-to {
    max-height: 500px;
}


/* === Transicion del menu modo movil */
.slideMovilMenu-enter-active,
.slideMovilMenu-leave-active {
    transition: all 0.4s ease-in-out;
}

.slideMovilMenu-enter-from,
.slideMovilMenu-leave-to {
    max-width: 0;
}

.slideMovilMenu-enter-to,
.slideMovilMenu-leave-from {
    max-width: 350px;
}

/* ======================= CAPITULOS ======================= */
#capitulos {
    display: flex;
    flex-direction: column;
    height: fit-content;
    overflow: hidden;
    border-radius: 10px;
    padding: 20px;
    margin: 10px 20px 40px 20px;
    background-color: var(--color-fondoTexto);
}

#capitulos h1,
#capitulos h2,
#capitulos h3 {
    color: var(--color-texto);
}

#capitulos h1 {
    font-size: 36px;
}

#capitulos h2 {
    font-size: 28px;
}

#capitulos p {
    text-align: justify;
    color: var(--color-texto);
    letter-spacing: 1px;
    line-height: 22px;
    margin: 10px 0 15px 0;
    font-size: 17px;
}

#capitulos strong {
    text-decoration: underline;
}

#capitulos li {
    margin-left: 15px;
    color: var(--color-texto);
}

.detailsBloque {
    padding: 0 15px;
}

#capitulos details {
    padding-top: 35px;
}


#capitulos summary {
    border-radius: 5px;
    font-size: 25px;
    font-weight: bold;
    padding: 10px 0 10px 10px;
    cursor: pointer;
    color: var(--color-texto);
    background-color: var(--color-principal1);
}

.consejoCapitulo {
    margin-top: 10px;
    padding: 1px 20px;
    border-radius: 10px;
    color: var(--color-texto);
    background-color: var(--color-principal2);
}

.consejoCapitulo p {
    padding: 0;
    margin: 0;
}

.centrarTiposImg {
    overflow: scroll;
    overflow-y: hidden;
    overflow-x: auto;
}

.centrarTiposImg img {
    display: block;
    margin: 0 auto;
}

.enlaceObjetos {
    background-color: var(--color-principal1);
    border-radius: 5px;
    width: fit-content;
}

.enlaceObjetos a {
    font-weight: bold;
    text-decoration: underline;
    padding: 5px 10px;
    display: flex;
}

/* ======================= TABLAS DE CAPITULOS ======================= */


.tablaAdaptable {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
}

.tablaCapitulos {
    min-width: 550px;
    text-align: center;
    margin: 0 auto;
    border-collapse: collapse;
    color: var(--color-texto);
}

.tablaCapitulos th,
.tablaCapitulos td {
    padding: 5px 10px;
}

th {
    background-color: var(--color-tituloTabla);
    font-size: 18px;
}

.tablaCapitulos tr:nth-child(odd) {
    background-color: var(--color-tabla1);
}

.tablaCapitulos tr:nth-child(even) {
    background-color: var(--color-tabla2);
}

.consejoCapitulo tr td {
    padding: 5px 10px;
}

.subDetails {
    width: 98%;
    margin: 0 auto;
    padding: 10px 0 !important;
}

.subDetails p {
    font-size: 15px !important;
}

.subSummary {
    background-color: var(--color-tabla1) !important;
    font-size: 20px !important;
    font-weight: lighter;
}

@media screen and (max-width:1000px) {
    #capitulos h1 {
        font-size: 33px;
    }

    #capitulos h2 {
        font-size: 25px;
    }

    #capitulos p {
        letter-spacing: 0.8px;
        line-height: 18px;
        font-size: 15px;
    }

    #capitulos summary {
        font-size: 22px;
    }

    th {
        font-size: 16px;
    }

    .subSummary {
        background-color: var(--color-tabla1) !important;
        font-size: 17px !important;
        font-weight: lighter;
    }

    .subDetails p {
        font-size: 13px !important;
    }
}
</style>
