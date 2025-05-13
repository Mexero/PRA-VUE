<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

import DarkIcon from '@/assets/icons/DarkIcon.webp' //Modonoche
import LightIcon from '@/assets/icons/LightIcon.webp' //ModoNoche

import menu from '../localData/json/datosMenuHeader.json' //Info submenus

const oscuro = ref(false)
const icono = ref(LightIcon)

onMounted(() => {
    oscuro.value = localStorage.getItem('modoOscuro') === 'true'
    icono.value = oscuro.value ? DarkIcon : LightIcon

    handleResize() // Establecer visibilidad inicial
    window.addEventListener('resize', handleResize)
})


onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})

const menuVisible = ref(false)

function toggleMenu() {
    menuVisible.value = !menuVisible.value
}

function handleResize() {
    if (window.innerWidth > 750) {
        menuVisible.value = true // Mostrar menú en pantallas grandes
    } else {
        menuVisible.value = false // Ocultarlo en pantallas pequeñas
    }
}



//TOGGLE MODO OSCURO. TAMBIEN HAY UNA PARTE EN App.vue Y LOS COLORES ESTÁN ALLÍ DUPLICADOS
function toggleModo() {
    oscuro.value = !oscuro.value
    localStorage.setItem('modoOscuro', oscuro.value)
    icono.value = oscuro.value ? DarkIcon : LightIcon

    const root = document.documentElement
    root.style.setProperty('--color-texto', oscuro.value ? 'white' : 'black')
    root.style.setProperty('--color-icon', oscuro.value ? 'invert(100%)' : 'invert(0%)')
    root.style.setProperty('--color-fondo', oscuro.value ? '#17171e' : '#FCFCFC')
    root.style.setProperty('--color-header', oscuro.value ? '#202030' : '#B4D4FF')
    root.style.setProperty('--color-oscuro1', oscuro.value ? '#1B1B26' : '#F8F8F8')
    root.style.setProperty('--color-hoverBloque', oscuro.value ? '#293141' : '#EEF5FF')
    root.style.setProperty('--color-sombraTexto', oscuro.value ? '#ff0051' : '#F8F8F8')
    root.style.setProperty('--color-principal1', oscuro.value ? '#ff0051' : '#94c4ff')
    root.style.setProperty('--color-principal2', oscuro.value ? '#dd576d' : '#b2d7ff')
    root.style.setProperty('--color-segundario', oscuro.value ? '#ff8f8f' : '#529CE6')
    root.style.setProperty('--color-segundario2', oscuro.value ? '#ffffff' : '#73BDFF')
    root.style.setProperty('--color-tabla1', oscuro.value ? '#a92e4d' : '#76aef1')
    root.style.setProperty('--color-tabla2', oscuro.value ? '#de4a54' : '#b7dbf4')
    root.style.setProperty('--color-fondoTexto', oscuro.value ? '#293141' : '#EEF5FF')
    root.style.setProperty('--color-BloqueDescargas', oscuro.value ? '#ff0051' : '#A1E3F9')
    root.style.setProperty('--color-hoverBloqueDescargas', oscuro.value ? '#293141' : '#EEF5FF')
}

//METODOS PARA SUBMENUS


const openIndex = ref(null)
const route = useRoute()

//Cambia los menus al clicar otro o clicar para cerrar
function toggleSubmenu(index) {
    openIndex.value = openIndex.value === index ? null : index
}

// Cierra submenus al cambiar de ruta
watch(() => route.fullPath, () => {
    openIndex.value = null
})

</script>

<template>
    <header>
        <img src="../assets/img/logo.webp" alt="">

        <h1>Pokémon Roleplaying Adventures</h1>

        <div id="modoNoche" @click="toggleModo">
            <img src="../assets/icons/DarkIcon.webp" alt="Imagen modo oscuro">
        </div>
    </header>

    <nav>
        <div id="botonMenu" aria-label="Abrir menú" @click="toggleMenu">
            <img src="../assets/icons/menu.svg" alt="">
        </div>
        <transition name="slideMenu">
            <ul v-if="menuVisible" id="menu" :class="{ visible: menuVisible }">
                <li class="abrirMenu">
                    <RouterLink to="/">
                        <div class="divMenu">Inicio</div>
                    </RouterLink>
                </li>

                <li class="abrirMenu" v-for="(section, index) in menu" :key="index"
                    v-click-outside="() => openIndex = null">
                    <div class="divMenu" @click.stop="toggleSubmenu(index)">
                        {{ section.title }}
                    </div>

                    <transition name="slide">
                        <ul class="subMenu" v-if="openIndex === index" v-click-outside="() => openIndex = null">
                            <li v-for="(subsection, subindex) in section.submenu" :key="subindex">
                                <RouterLink :to="subsection.route">{{ subsection.name }}</RouterLink>
                            </li>
                        </ul>
                    </transition>
                </li>

                <li id="buscador">
                    <form method="get" id="buscar">
                        <fieldset id="barraBuscar">
                            <input type="text" id="search-input" placeholder="Buscar" aria-label="Buscar" />
                            <button type="submit" class="search-button" aria-label="Buscar">
                                <img src="../assets/icons/lupa.svg" alt="Icono de búsqueda" />
                            </button>
                        </fieldset>
                    </form>
                </li>
            </ul>
        </transition>
    </nav>
</template>


<style scoped>
/* Transición para submenús tipo slide */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.2s ease-in-out;
    overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
    max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
    max-height: 385px;
}

#botonMenu {
    display: none;
}

nav {
    background-color: var(--color-principal1);
    position: sticky;
    height: 40px;
    /* LA ALTURA FIJA HACE QUE NO SE MUEVA EL CONTENIDO DE LA PAGINA AL DESPLEGARSE LOS MENUS */
    top: 0;
    z-index: 100;
    letter-spacing: 1.3px;
    color: var(--color-texto);
    display: flex;
}

#menu {
    display: flex;
    height: 40px;
    width: 100%;

}

ul {
    list-style: none;
}

nav a,
nav div {
    font-size: 20px;
    letter-spacing: 1.5px;
    font-family: "Staatliches", sans-serif;
}

.abrirMenu {
    flex: 1;
    border-left: 1px solid black;

}

.abrirMenu:first-child {
    border: none;
}

.divMenu {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 100%;
}

.subMenu {
    display: flex;
    flex-direction: column;
    width: 260px;
    left: auto;
    position: absolute;
}

.subMenu li a {
    border-bottom: 1px solid var(--color-segundario2);
    background-color: var(--color-principal2);
    height: 35px;
    display: flex;
    width: 260px;
    padding-left: 5px;
    align-items: center;
}

.subMenu li:nth-child(5) a {
    font-size: 17px;
}

.subMenu li:last-child a {
    border-radius: 0 0 5px 5px;
    border: none;
}

.divMenu:hover,
.subMenu li a:hover,
.search-button:hover {
    background-color: var(--color-segundario);
    cursor: pointer;
}

/* ======================= BARRA DE BUSCAR DEL NAV PRINCIPAL ======================= */
#buscador {
    flex: 2;
}

#barraBuscar {
    display: flex;
    flex-direction: row;
    border: none;
}

#search-input {
    width: 100%;
    height: 40px;
    padding-left: 10px;
    border: none;
}

#search-input:focus {
    outline: none;
}

.search-button {
    height: 40px;
    background-color: var(--color-principal1);
    border: none;
}

.search-button img {
    width: 40px;
    height: 40px;
    padding: 5px;
}


@media screen and (max-width: 750px) {
    #botonMenu {
        display: block;
    }

    #botonMenu img {
        width: 40px;
    }

    #menu {
        display: none;
    }

    #menu.visible {
        background-color: var(--color-principal1);
        top: 40px;
        position: absolute;
        display: flex;
        flex-direction: column;
        height: fit-content;
    }

    .abrirMenu {
        border: none;
    }

    .divMenu {
        background-color: var(--color-principal1);
        justify-content: flex-start;
        padding-left: 10px;
        border-top: 1px solid black;
    }

    .subMenu {
        position: absolute;
        top: auto;
        width: 100%;
        left: 100px;
    }

    .subMenu a {
        width: 100%;
    }

    /* Transición del menú principal */
    .slideMenu-enter-active,
    .slideMenu-leave-active {
        transition: max-height 0.2s ease-in-out;
        overflow: hidden;
    }

    .slideMenu-enter-from,
    .slideMenu-leave-to {
        max-height: 0;
    }

    .slideMenu-enter-to,
    .slideMenu-leave-from {
        max-height: 280px;
    }
}

/* ======================= HEADER ======================= */
header {
    background-color: var(--color-header);
    height: 110px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 20px;
}

header h1 {
    font-size: 35px;
    letter-spacing: 3px;
    margin-left: 30px;
    color: var(--color-texto);
    text-shadow: 1px 1px var(--color-sombraTexto);
    font-family: "Staatliches", sans-serif;
}

header img {
    width: 80px;
}

/* ================== Icono cambio de modo ======================*/
#modoNoche {
    position: absolute;
    top: 5px;
    right: 0px;
    width: 30px;
    height: 30px;

}

#modoNoche:hover {
    cursor: pointer;
}

#modoNoche img {
    width: 30px;
    filter: var(--color-icon);
    transition: transform 0.1s ease-out;
}

#modoNoche:hover img {
    transform: scale(0.90);
}
</style>
