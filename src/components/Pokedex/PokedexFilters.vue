<template>
    <div class="filters-container">
        <SearchFilter v-model="busqueda" />
        <TypeFilter :selected-types="tiposFiltrados" @cambiar-tipos="cambiarTipos" />
    </div>
    <button @click="enviarFiltros">Filtrar</button>
    <button @click="limpiarFiltros">Limpiar Filtros</button>
</template>

<script setup>
import SearchFilter from '@/components/Pokedex/SearchFilter.vue';
import TypeFilter from '@/components/Pokedex/TypeFilter.vue';
import { watch, ref } from 'vue';

const props = defineProps([
    'searchTerm',
    'selectedTypes'
])

const emit = defineEmits(['manejar-filtros'])

const busqueda = ref(props.searchTerm)
const tiposFiltrados = ref([...props.selectedTypes])

//Actualizar filtros hacia abajo
watch(() => [
    props.searchTerm,
    props.selectedTypes
],
    () => {
        busqueda.value = props.searchTerm
        tiposFiltrados.value = [...props.selectedTypes]
    },
    { immediate: true }
)

function enviarFiltros() {
    emit('manejar-filtros', busqueda.value, tiposFiltrados.value)
}

function limpiarFiltros() {
    busqueda.value = null
    tiposFiltrados.value = []
    enviarFiltros()
}

function cambiarTipos(tipos) {
    tiposFiltrados.value = tipos
}

</script>

<style scoped>
.filters-container {
    margin-bottom: 20px;
}
</style>