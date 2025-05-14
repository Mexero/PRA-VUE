<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { ref, watch, Transition } from 'vue'
import menu from '../localData/json/datosMenuHeader.json' //Info submenus

const menuVisible = ref(true)

function toggleMenu() {
    openMobileNav.value = !openMobileNav.value
}

function toggleSubmenu(index) {
    openIndex.value = openIndex.value === index ? null : index
}

//METODOS PARA SUBMENUS
const openIndex = ref(null)
const openMobileNav = ref(false)
const route = useRoute()

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

                <div class="divMenu" @click.stop="toggleSubmenu(index)">
                    {{ section.title }}
                </div>

                <!--Crea un name de Transicion diferente a cada submenu 
                    para ajustar el estilo de cada transicion por separado-->
                <Transition :name="'slideSubMenu' + (index + 1)">

                    <ul class="subMenu" v-if="openIndex === index" v-click-outside="() => openIndex = null">

                        <li v-for="(subsection, subindex) in section.submenu" :key="subindex">
                            <RouterLink :to="subsection.route">{{ subsection.name }}</RouterLink>
                        </li>

                    </ul>

                </Transition>

            </li>

            <!-- Formulario de busqueda interno de la pagina -->
            <li class="buscador">
                <form method="get" class="buscar">
                    <fieldset class="barraBuscar">
                        <input type="text" class="search-input" placeholder="Buscar" aria-label="Buscar" />
                        <button type="submit" class="search-button" aria-label="Buscar">
                            <img src="../assets/icons/lupa.svg" alt="Icono de búsqueda" />
                        </button>
                    </fieldset>
                </form>
            </li>
        </ul>

    </nav>

    <nav id="modoMovil">

        <div class="navLogic" v-click-outside="() => openMobileNav = false">
            <div id="botonMenu" aria-label="Abrir menú" @click="toggleMenu">
                <img src="../assets/icons/menu.svg" alt="">
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

                        <div class="divMenu" @click.stop="toggleSubmenu(index)">
                            {{ section.title }}
                        </div>

                        <!--Crea un name de Transicion diferente a cada submenu 
                    para ajustar el estilo de cada transicion por separado -->
                        <Transition :name="'slideSubMenu' + (index + 1)">

                            <ul class="subMenu" v-if="openIndex === index" v-click-outside="() => openIndex = null">

                                <li v-for="(subsection, subindex) in section.submenu" :key="subindex">
                                    <RouterLink :to="subsection.route">{{ subsection.name }}</RouterLink>
                                </li>

                            </ul>

                        </Transition>
                    </li>

                    <!-- Formulario de busqueda interno de la pagina -->
                    <li class="buscador">
                        <form method="get" class="buscar">
                            <fieldset class="barraBuscar">
                                <input type="text" class="search-input" placeholder="Buscar" aria-label="Buscar" />
                                <button type="submit" class="search-button" aria-label="Buscar">
                                    <img src="../assets/icons/lupa.svg" alt="Icono de búsqueda" />
                                </button>
                            </fieldset>
                        </form>
                    </li>
                </ul>

            </Transition>
        </div>
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
}

/* ====== Menus primarios ====== */
.menu {
    display: flex;
    height: 40px;
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
    border-left: 1px solid var(--color-segundario2);
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
    width: 260px;
    left: auto;
    position: absolute;
}

.subMenu li a {
    border-bottom: 1px solid var(--color-segundario2);
    background-color: var(--color-principal2);
    height: 40px;
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

/* ====== Todos los hover ====== */
.divMenu:hover,
.subMenu li a:hover,
.search-button:hover,
#botonMenu:hover {
    background-color: var(--color-segundario);
    cursor: pointer;
}

/* ====== Barra de buscar del menu principal ====== */
.buscador {
    flex: 2;
    border: none;
}

.barraBuscar {
    display: flex;
    flex-direction: row;
    border: none;
}

.search-input {
    width: 100%;
    height: 40px;
    padding-left: 10px;
    border: none;
}

.search-input:focus {
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

#modoMovil .navLogic {
    width: 40px;
}

@media screen and (max-width: 750px) {

    /* ====== Cambiar de modo ====== */
    #modoMovil {
        display: block;
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
    }

    .abrirMenu {
        border: none;
    }

    .divMenu {
        justify-content: flex-start;
        padding-left: 10px;
        border-top: 1px solid var(--color-segundario2);
    }

    /* ====== Sub menus ====== */
    .subMenu {
        width: 100%;
        position: absolute;
        top: auto;
        left: 110px;
        transform: translateY(-39px);
    }

    .subMenu li a {
        padding-left: 10px;
        width: 100%;
    }

    /* ====== Barra de buscar del menu principal ====== */
    .buscador {
        border-top: 1px solid var(--color-segundario2);
    }
}

/* ===== Transicion del Menu principal en modo movil ===== */
/* Es la misma transicion que los submenus, esta a parte por claridad */
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

/* ===== Transicion para cada submenu ===== */
/* Mismo efecto de transicion para todos */
.slideSubMenu1-enter-active,
.slideSubMenu1-leave-active,
.slideSubMenu2-enter-active,
.slideSubMenu2-leave-active,
.slideSubMenu3-enter-active,
.slideSubMenu3-leave-active,
.slideSubMenu4-enter-active,
.slideSubMenu4-leave-active,
.slideSubMenu5-enter-active,
.slideSubMenu5-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

/* Mismo inicio de altura para todos */
.slideSubMenu1-enter-from,
.slideSubMenu1-leave-to,
.slideSubMenu2-enter-from,
.slideSubMenu2-leave-to,
.slideSubMenu3-enter-from,
.slideSubMenu3-leave-to,
.slideSubMenu4-enter-active,
.slideSubMenu4-leave-active,
.slideSubMenu4-enter-from,
.slideSubMenu4-leave-to,
.slideSubMenu5-enter-from,
.slideSubMenu5-leave-to {
    max-height: 0;
}

/* Diferente altura para cada menu, a su altura maxima para una transicion consistente */
/*  Capitulos */
.slideSubMenu1-enter-to,
.slideSubMenu1-leave-from {
    max-height: 440px;
}

/*  Jugador */
.slideSubMenu2-enter-to,
.slideSubMenu2-leave-from {
    max-height: 120px;
}

/*  Pokemon */
.slideSubMenu3-enter-to,
.slideSubMenu3-leave-from {
    max-height: 160px;
}

/*  Reglas */
.slideSubMenu4-enter-to,
.slideSubMenu4-leave-from {
    max-height: 40px;
}

/*  Utilidades */
.slideSubMenu5-enter-to,
.slideSubMenu5-leave-from {
    max-height: 80px;
}
</style>