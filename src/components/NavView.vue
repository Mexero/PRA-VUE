<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import menu from '@/localData/json/datosMenuHeader.json' //Info submenus

import Buscador from '@/components/BuscadorView.vue'

const menuVisible = ref(true)

const openIndex = ref(null)
const openMobileNav = ref(false)
const route = useRoute()

function toggleMenu() {
    openMobileNav.value = !openMobileNav.value
}

function toggleSubmenu(index) {
    openIndex.value = openIndex.value === index ? null : index
}

const root = document.documentElement;
function countSubmenu(maxSubindex) {
    root.style.setProperty('--submenu-height', maxSubindex);
}

// Cierra submenus al cambiar de ruta
watch(() => route.fullPath, () => {
    openIndex.value = null
})


</script>
<template>

    <nav id="modoEscritorio">

        <ul class="menu">

            <li class="abrirMenu">
                <RouterLink to="/">
                    <div class="divMenu">Inicio</div>
                </RouterLink>
            </li>

            <li class="abrirMenu" v-for="(section, index) in menu" :key="index"
                v-click-outside="() => openIndex = null">

                <div class="divMenu" @click.stop="toggleSubmenu(index)" @click="countSubmenu(section.submenu.length)">
                    {{ section.title }}
                </div>

                <Transition :name="'slideSubMenu'">

                    <ul class="subMenu" v-if="openIndex === index" v-click-outside="() => openIndex = null">

                        <li v-for="(subsection, subindex) in section.submenu" :key="subindex">
                            <RouterLink :to="subsection.route">{{ subsection.name }}</RouterLink>
                        </li>

                    </ul>

                </Transition>

            </li>

            <li class="buscador">
                <Buscador />
            </li>
        </ul>

    </nav>

    <nav id="modoMovil">

        <div class="navLogic" v-click-outside="() => openMobileNav = false">
            <div id="botonMenu" aria-label="Abrir menú" @click="toggleMenu">
                <img src="/assets/icons/menu.svg" alt="Icono Menu hamburguesa">
            </div>

            <Transition :name="'slideMenu'">

                <ul v-if="openMobileNav" class="menu" :class="{ visible: menuVisible }">

                    <li class="abrirMenu">
                        <RouterLink to="/">
                            <div class="divMenu">Inicio</div>
                        </RouterLink>
                    </li>

                    <li class="abrirMenu" v-for="(section, index) in menu" :key="index"
                        v-click-outside="() => openIndex = null">

                        <div class="divMenu" @click.stop="toggleSubmenu(index)"
                            @click="countSubmenu(section.submenu.length)">
                            {{ section.title }}
                        </div>
                        <Transition :name="'slideSubMenuMovil'">

                            <ul class="subMenu" v-if="openIndex === index" v-click-outside="() => openIndex = null">
                                <li v-for="(subsection, subindex) in section.submenu" :key="subindex">
                                    <RouterLink :to="subsection.route">{{ subsection.name }}</RouterLink>
                                </li>
                            </ul>

                        </Transition>
                    </li>
                </ul>
            </Transition>
        </div>
        <Buscador />
    </nav>

</template>

<style scoped>
/* ====== Principal ====== */
nav {
    position: sticky;
    top: 0;
    z-index: 100;
    letter-spacing: 1.3px;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
}

/* ====== Menus primarios ====== */
.menu {
    display: flex;
    height: 40px;
    z-index: 500;
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

/* ====== Menu principal ====== */
.abrirMenu {
    flex: 1;
    border-left: 1px solid var(--color-secundario2);
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

/* ====== Sub menus ====== */
.subMenu {
    display: flex;
    flex-direction: column;
    width: 270px;
    left: auto;
    position: absolute;
    border-radius: 0 0 5px 5px;
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2), -3px 3px 5px rgba(0, 0, 0, 0.2);
}

.subMenu li a {
    border-bottom: 1px solid var(--color-secundario2);
    background-color: var(--color-principal2);
    height: 40px;
    display: flex;
    padding-left: 5px;
    align-items: center;
    box-sizing: content-box;
}

.subMenu li:nth-child(5) a {
    font-size: 17px;
}

.subMenu li:last-child a {
    border-radius: 0 0 5px 5px;
    border: none;
}

#modoMovil .navLogic {
    width: 40px;
}

.buscador {
    flex: 2;
    border: none;
}

/* ====== Todos los hover ====== */
.divMenu:hover,
.subMenu li a:hover,
.search-button:hover,
#botonMenu:hover {
    background-color: var(--color-secundario);
    cursor: pointer;
}

/* ====== Modo movil ====== */
#modoMovil {
    display: none;
}

#botonMenu {
    width: 40px;
    height: 40px;
}

#botonMenu img {
    width: 40px;
    height: 40px;
}

@media screen and (max-width: 750px) {

    /* ====== Cambiar de modo ====== */
    #modoMovil {
        display: flex;
        justify-content: space-between;
    }

    #modoEscritorio {
        display: none;
    }

    /* ====== Menu Principal ====== */
    .menu {
        background-color: var(--color-principal1);
        top: 40px;
        position: absolute;
        display: flex;
        flex-direction: column;
        height: fit-content;
        box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.25);

    }

    .abrirMenu {
        border: none;
    }

    .divMenu {
        width: 210px;
        justify-content: flex-start;
        padding-left: 10px;
        border-top: 1px solid var(--color-secundario2);
        box-sizing: content-box;
    }

    .navLogic {
        display: flex;
        justify-content: space-between;
    }

    /* ====== Sub menus ====== */
    .subMenu {
        width: 210px;
        position: absolute;
        top: auto;
        left: 130px;
        transform: translateY(-40px);
        box-shadow: 8px 5px 5px rgba(0, 0, 0, 0.2), -4px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;

    }

    .subMenu li a {
        width: 100%;
        font-size: 17px;
        min-width: 210px;
    }

    .subMenu li:first-child a {
        border-radius: 0 5px 0 0;
    }

    .subMenu li:last-child a {
        border-radius: 0 0 5px 0;
    }

    .subMenu li:only-child a {
        border-radius: 0 5px 5px 0;
    }

    /* ====== Barra de buscar del menu principal ====== */
    .buscador {
        flex: none;
        border: none;
    }

}


/* ===== Transicion menu escritorio ===== */
.slideSubMenu-enter-active,
.slideSubMenu-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.slideSubMenu-enter-from,
.slideSubMenu-leave-to {
    max-height: 0;
}

.slideSubMenu-leave-to {
    opacity: 0.2;
}

/* Diferente altura para cada menu, a su altura maxima para una transicion consistente */
.slideSubMenu-enter-to,
.slideSubMenu-leave-from {
    max-height: calc(var(--submenu-height) * 40px);
}



/* ===== Transicion del Menu principal en modo movil ===== */
.slideMenu-enter-active,
.slideMenu-leave-active {
    transition: all 0.3s ease;
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

/* ============ Transicion Subemenus Movil ========= */
.slideSubMenuMovil-enter-active,
.slideSubMenuMovil-leave-active {
    transition: all 0.3s ease-in-out;
    overflow: hidden;
}

.slideSubMenuMovil-enter-from,
.slideSubMenuMovil-leave-to {
    max-width: 0;

}

.slideSubMenuMovil-leave-to {
    opacity: 0;
}

.slideSubMenuMovil-enter-to,
.slideSubMenuMovil-leave-from {
    max-width: 220px;
}
</style>