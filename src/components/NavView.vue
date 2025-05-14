<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { ref, watch, Transition } from 'vue'
import menu from '../localData/json/datosMenuHeader.json' //Info submenus

const menuVisible = ref(true)

function toggleMenu() {
    menuVisible.value = !menuVisible.value
}

function toggleSubmenu(index) {
    openIndex.value = openIndex.value === index ? null : index
}

//METODOS PARA SUBMENUS
const openIndex = ref(null)
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

                <Transition :name="'slideSubMenu' + (index + 1)">
                    <ul class="subMenu" v-if="openIndex === index" v-click-outside="() => openIndex = null">
                        <li v-for="(subsection, subindex) in section.submenu" :key="subindex">
                            <RouterLink :to="subsection.route">{{ subsection.name }}</RouterLink>
                        </li>
                    </ul>
                </Transition>
            </li>

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

        <div id="botonMenu" aria-label="Abrir menú" @click="toggleMenu">
            <img src="../assets/icons/menu.svg" alt="">
        </div>
        <Transition :name="menuMovil"> <!-- No funciona-->

            <ul v-if="!menuVisible" class="menu" :class="{ visible: menuVisible }">
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

                    <Transition :name="'slideSubMenu' + (index + 1)">
                        <ul class="subMenu" v-if="openIndex === index" v-click-outside="() => openIndex = null">
                            <li v-for="(subsection, subindex) in section.submenu" :key="subindex">
                                <RouterLink :to="subsection.route">{{ subsection.name }}</RouterLink>
                            </li>
                        </ul>
                    </Transition>
                </li>

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
    </nav>
</template>

<style scoped>
/* ====== Principal ====== */
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

/* ====== Menus primarios ====== */

#modoMovil {
    display: none;
}

.menu {
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

.divMenu:hover,
.subMenu li a:hover,
.search-button:hover {
    background-color: var(--color-segundario);
    cursor: pointer;
}

/* ======================= BARRA DE BUSCAR DEL NAV PRINCIPAL ======================= */
.buscador {
    flex: 2;
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


@media screen and (max-width: 750px) {
    #modoMovil {
        display: block;
    }

    #modoEscritorio {
        display: none;
    }

    #botonMenu img {
        width: 40px;
    }


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
        background-color: var(--color-principal1);
        justify-content: flex-start;
        padding-left: 10px;
        border-top: 1px solid black;
    }

    .subMenu {
        width: 100%;
        position: absolute;
        top: auto;
        left: 120px;
        transform: translateY(-39px);
    }

    .subMenu li a {
        height: 40px;
        width: 100%;

    }
}

.menuMovil-enter-active,
.menuMovil-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.menuMovil-enter-from,
.menuMovil-leave-to {
    max-height: 0;
}

.menuMovil-enter-to,
.menuMovil-leave-from {
    max-height: 280px;
}


/* ===== Transicion para cada submenu ===== */
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