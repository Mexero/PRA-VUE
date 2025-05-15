<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref } from 'vue'
import indiceCapitulos from '../localData/json/indiceCapitulos.json' //Info menu indice de capitulos


function toggleSubmenu(indice) {
    openIndex.value = openIndex.value === indice ? null : indice
}
function toggleMenu() {
    openMobileNav.value = !openMobileNav.value
}

//METODOS PARA SUBMENUS
const openIndex = ref(null)
const openMobileNav = ref(false)

</script>

<template>


    <nav id="CapMovil">
        <Transition :name="'slideMovilMenu'">
            <div id="desplegarMenu" v-if="openMobileNav">

                <ul >

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
                                    <a :href="seccion.ruta">{{ seccion.nombre }}</a>
                                </li>
                            </ul>
                        </Transition>
                    </li>
                </ul>

            </div>
        </Transition>
        <div id="iconoAbrirMenuCapitulos" @click="toggleMenu">
            <img src="../assets/icons/flechaDobleIcon.png" alt="icono flechas">
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
                                    <a :href="seccion.ruta">{{ seccion.nombre }}</a>
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
}

/* === Menu principal escritorio ===*/
section {
    overflow: hidden;
}

aside {
    padding: 40px 0;
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
    max-width: 320px;
    height: 0;
    margin-top: 10px;
    position: sticky;
    top: 50px;
    z-index: 9;
    
}

#CapMovil ul li {
    background-color: var(--color-principal1);
}

#desplegarMenu {
    width: fit-content;
    display: flex;
    height: fit-content;
    max-height: 80vh;
    position: sticky;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    white-space: nowrap;
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
    max-width: 320px;
}

/* ======================= CAPITULOS ======================= */
#capitulos {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    margin: 40px 20px;
    overflow: hidden;
    background-color: var(--color-fondoTexto);
    border-radius: 10px;
    padding: 20px;
}

#capitulos h2,
#capitulos h1 {
    color: var(--color-texto);
}

#capitulos p {
    text-align: justify;
    color: var(--color-texto);
    letter-spacing: 1px;
    line-height: 22px;
    margin: 15px 0;
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
    color: var(--color-texto);
    font-size: 25px;
    font-weight: bold;
    padding: 10px 0 10px 10px;
    cursor: pointer;
    background-color: var(--color-principal1);
}

.consejoCapitulo {
    margin-top: 10px;
    color: var(--color-texto);
    background-color: var(--color-principal2);
    padding: 1px 20px;
    border-radius: 10px;
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

/* ======================= TABLAS DE CAPITULOS ======================= */
.tablaCapitulos,
.tablaNaturaleza {
    text-align: center;
    margin: 0 auto;
    border-collapse: collapse;
    color: var(--color-texto);
}

.tablaAmistad {
    margin: 0 auto;
    border-collapse: collapse;
    color: var(--color-texto);
}

.tablaCapitulos td,
.tablaCapitulos th,
.tablaAmistad td,
.tablaAmistad th {
    padding: 8px;
}

APLICAR BORDES A LA DERECHA .tablaCapitulos tr td:first-child,
.tablaCapitulos th:first-child,
.tablaAmistad tr td:first-child,
.tablaAmistad th:first-child {
    border-right: 1px solid black;
}

.tablaCapitulos tr:nth-child(odd),
.tablaAmistad tr:nth-child(odd) {
    background-color: var(--color-tabla1);
}

.tablaCapitulos tr:nth-child(even),
.tablaAmistad tr:nth-child(even) {
    background-color: var(--color-tabla2);
}

.consejoCapitulo tr td {
    padding: 5px 10px;
}
</style>
