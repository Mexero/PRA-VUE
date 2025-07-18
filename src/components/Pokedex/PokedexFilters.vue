<template>
    <div class="filters-container" ref="container">
        <SearchFilter v-model="busqueda" />
        <TypeFilter :selected-types="tiposFiltrados" @cambiar-tipos="cambiarTipos" />
        <filtroHabilidad :dbCargada="dbCargada" :habilidad="filtroHabilidad" @cambiarHabilidad="cambiarHabilidad" />
        <FiltroTamano v-model="tamano" />
        <FiltroSentidos v-model="sentido" />
        <FiltroNatHab v-model="natHab" />
        <div>
            <button @click="enviarFiltros">Filtrar</button>
            <button @click="limpiarFiltros">Limpiar Filtros</button>
        </div>
    </div>
</template>

<script setup>
import SearchFilter from '@/components/Pokedex/SearchFilter.vue';
import TypeFilter from '@/components/Pokedex/TypeFilter.vue';
import FiltroHabilidad from './FiltroHabilidad.vue';
import FiltroTamano from './FiltroTamano.vue';
import FiltroSentidos from './FiltroSentidos.vue';
import FiltroNatHab from './FiltroNatHab.vue';

import { watch, ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    dbCargada: Boolean,
    searchTerm: String,
    selectedTypes: Array,
    filtroHabilidad: String,
    filtroTamano: String,
    filtroSentido: String,
    filtroNatHabil: String,
})

const container = ref(null)

const emit = defineEmits(['manejar-filtros', 'cerrar-filtros'])

const busqueda = ref(props.searchTerm)
const tiposFiltrados = ref([...props.selectedTypes])
const habilidad = ref(props.filtroHabilidad)
const tamano = ref(props.filtroTamano)
const sentido = ref(props.filtroSentido)
const natHab = ref(props.filtroNatHabil)


//Actualizar filtros hacia abajo
watch(() => [
    props.searchTerm,
    props.selectedTypes,
    props.filtroHabilidad,
    props.filtroTamano,
    props.filtroSentido,
    props.filtroNatHabil
],
    () => {
        busqueda.value = props.searchTerm
        tiposFiltrados.value = [...props.selectedTypes]
        habilidad.value = props.filtroHabilidad
        tamano.value = props.filtroTamano
        sentido.value = props.filtroSentido
        natHab.value = props.filtroNatHabil
    },
    { immediate: true }
)

function enviarFiltros() {
    emit('manejar-filtros', busqueda.value, tiposFiltrados.value, habilidad.value, tamano.value, sentido.value, natHab.value)
}

function limpiarFiltros() {
    busqueda.value = null
    tiposFiltrados.value = []
    habilidad.value = null
    tamano.value = null
    sentido.value = null
    natHab.value = null
}

function cambiarTipos(tipos) {
    tiposFiltrados.value = tipos
}

function cambiarHabilidad(hab) {
    habilidad.value = hab
}


// Cerrar dropdown al hacer clic fuera
let ignoreNextClick = true
const handleClickOutside = (event) => {
    if (ignoreNextClick) {
        ignoreNextClick = false
        return
    }
    if (container.value && !container.value.contains(event.target)) {
        emit('cerrar-filtros')
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.filters-container {
    padding: 30px;
    margin-bottom: 20px;
}
</style>