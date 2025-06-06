<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'
import menu from '@/localData/json/datosMenuHeader.json' //Info submenus
import index from '@/localData/json/searchIndex.json' //Buscador


const menuVisible = ref(true)

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

//============== METODOS PARA SUBMENUS =================
const openIndex = ref(null)
const openMobileNav = ref(false)
const route = useRoute()

// Cierra submenus al cambiar de ruta
watch(() => route.fullPath, () => {
    openIndex.value = null
})

const onSubmit = () => {
    if (paginatedResults.value.length) {
        route.push(paginatedResults.value[0].ruta)
        resetSearch()
    }
}
//============== Buscador =================

// Estado
const query = ref('')
const results = ref([])
const currentPage = ref(1)
const pageSize = 9

// Función utilitaria para normalizar y quitar tildes
const normalize = str =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

// Función de búsqueda
const search = () => {
    const q = normalize(query.value)

    const filtered = index
        .map(item => {
            let score = 0
            if (normalize(item.nombre).includes(q)) score += 2
            if (normalize(item.tipo).includes(q)) score += 1

            return {
                ...item,
                score
            }
        })
        .filter(item => item.score)
        .sort((a, b) => b.score - a.score)

    results.value = filtered
    currentPage.value = 1
}

// Debounce
let timeout = null
const debouncedSearch = () => {
    if (query.value.trim()) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            search()
        }, 100)
    }
}

// Paginación
// Paginación
const paginatedResults = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return results.value.slice(start, start + pageSize)
})

const showPagination = computed(() => results.value.length > pageSize)

const maxPage = computed(() => Math.ceil(results.value.length / pageSize))

const nextPage = () => {
    if (currentPage.value < maxPage.value) {
        currentPage.value++
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

// Limpiar búsqueda al hacer clic
const resetSearch = () => {
    query.value = ''
    results.value = []
    currentPage.value = 1
}

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

            <!-- Formulario de busqueda interno de la pagina -->
            <li class="buscador">

                <form method="get" class="buscar" name="buscador">
                    <fieldset class="barraBuscar">
                        <input v-model="query" @input="debouncedSearch" placeholder="Buscar..." class="search-input" />
                        <RouterLink v-if="paginatedResults.length" :to="paginatedResults[0].ruta" @click="resetSearch"
                            class="search-button">
                            <img src="../../public/assets/icons/lupa.svg" alt="Icono de búsqueda" />
                        </RouterLink>
                        <div v-else class="search-button">
                            <img src="../../public/assets/icons/lupa.svg" alt="Icono de búsqueda" />
                        </div>
                    </fieldset>
                </form>
                <div class="resultBusqueda">

                    <template v-if="paginatedResults.length && query.trim()">

                        <ul>
                            <li v-for="item in paginatedResults" :key="item.ruta" @click="resetSearch">
                                <router-link :to="item.ruta">

                                    <span><strong> {{ item.tipo }}:</strong> {{ item.nombre }}</span>
                                </router-link>
                            </li>

                        </ul>
                    </template>
                    <template v-else-if="query.trim()">
                        <ul class="noResult">
                            <li>No se encontraron resultados.</li>
                        </ul>
                    </template>

                    <div v-if="showPagination && query">
                        <button @click="prevPage" :disabled="currentPage === 1">
                            ◀
                        </button>
                        <span>Página {{ currentPage }} de {{ maxPage }}</span>
                        <button @click="nextPage" :disabled="currentPage * pageSize >= results.length">
                            ▶
                        </button>
                    </div>
                </div>

            </li>
        </ul>

    </nav>

    <nav id="modoMovil">

        <div class="navLogic" v-click-outside="() => openMobileNav = false">
            <div id="botonMenu" aria-label="Abrir menú" @click="toggleMenu">
                <img src="../../public/assets/icons/menu.svg" alt="Icono Menu hamburguesa">
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
        <!-- Formulario de busqueda interno de la pagina -->
        <div class="buscador">
            <form method="get" class="buscar" name="buscador">
                <div class="barraBuscar">
                    <input v-model="query" @input="debouncedSearch" placeholder="Buscar..." class="search-input" />
                    <RouterLink v-if="paginatedResults.length" :to="paginatedResults[0].ruta" @click="resetSearch"
                        class="search-button">
                        <img src="../../public/assets/icons/lupa.svg" alt="Icono de búsqueda" />
                    </RouterLink>
                    <div v-else class="search-button">
                        <img src="../../public/assets/icons/lupa.svg" alt="Icono de búsqueda" />
                    </div>
                </div>
            </form>
        </div>
        <div class="resultBusqueda">

            <template v-if="paginatedResults.length && query.trim()">

                <ul>
                    <li v-for="item in paginatedResults" :key="item.ruta" @click="resetSearch">
                        <router-link :to="item.ruta">

                            <span><strong> {{ item.tipo }}:</strong> {{ item.nombre }}</span>
                        </router-link>
                    </li>

                </ul>
            </template>
            <template v-else-if="query.trim()">
                <ul class="noResult">
                    <li>No se encontraron resultados.</li>
                </ul>
            </template>

            <div v-if="showPagination && query">
                <button @click="prevPage" :disabled="currentPage === 1">
                    ◀
                </button>
                <span>Página {{ currentPage }} de {{ maxPage }}</span>
                <button @click="nextPage" :disabled="currentPage * pageSize >= results.length">
                    ▶
                </button>
            </div>
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

/* ====== Todos los hover ====== */
.divMenu:hover,
.subMenu li a:hover,
.search-button:hover,
#botonMenu:hover {
    background-color: var(--color-secundario);
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

.resultBusqueda {
    position: absolute;
    top: auto;
    right: 0;
    min-width: 40%;
    border-radius: 5px;
    box-shadow:
        -5px 4px 5px 0 rgba(0, 0, 0, 0.18),
        0 1.5px 6px 0 rgba(0, 0, 0, 0.10);
}

.resultBusqueda ul {
    background-color: var(--color-tabla2);
    padding: 5px 10px 0 10px;
}

.resultBusqueda span {
    font-size: 14px;
    color: black;
}

.resultBusqueda li {
    display: flex;
    height: 30px;
}

.resultBusqueda a {
    height: 30px;
    display: flex;
    width: 100%;
    cursor: pointer;
    align-items: center;
    padding: 0 5px;
}


.resultBusqueda ul li:hover {
    text-decoration: underline;
    color: black;
}

.resultBusqueda ul li:nth-child(even) {
    background-color: var(--color-tabla1);
}

.resultBusqueda ul li:nth-child(odd) {
    background-color: var(--color-tabla2);
}

.resultBusqueda div {
    background-color: var(--color-principal1);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0 0 5px 5px;
}

.resultBusqueda div span {
    color: var(--color-texto);
}

.resultBusqueda div button {
    width: 45px;
    height: 35px;
    cursor: pointer;
    background: var(--color-tituloTabla);
    color: var(--color-texto);
    border: none;
    font-size: 18px;
    font-weight: bold;
    transition: all 0.1s;
}

.resultBusqueda div button:first-child {
    border-radius: 0 0 0px 5px;
}

.resultBusqueda div button:last-child {
    border-radius: 0 0 5px 0px;
}

.resultBusqueda div button:hover:not(:disabled) {
    background: var(--color-secundario);
    color: #fff;
}

.resultBusqueda div button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--color-secundario2);
    color: #888;
}

.noResult{
        border-radius: 0 0 5px 5px;

}
@media screen and (max-width: 750px) {

    /* ====== Cambiar de modo ====== */
    #modoMovil {
        display: flex;
        justify-content: space-between;
    }

    #modoMovil .resultBusqueda {
        top: 40px;
        font-size: 14px;
        min-width: 60%;

    }

    .resultBusqueda a,
    .resultBusqueda li {
        height: auto;
    }

    .resultBusqueda a {
        padding: 6px 5px;
    }

    .navLogic {
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

    .noResult li {
        padding: 10px 0;
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