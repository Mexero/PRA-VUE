<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import index from '@/localData/json/searchIndex.json' //Buscador

const router = useRouter()

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

//Enviar formulario
const handleSubmit = () => {
    if (query.value.trim()) {
        search()
        setTimeout(() => {
            if (paginatedResults.value.length) {
                router.push(paginatedResults.value[0].ruta)
                resetSearch()
            }
        }, 100)
    }
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

    <form method="get" class="buscar" name="buscador" @submit.prevent="handleSubmit">
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

</template>

<style scoped>
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

.noResult {
    border-radius: 0 0 5px 5px;

}

@media screen and (max-width: 750px) {

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


    .noResult li {
        padding: 10px 0;
    }

}
</style>