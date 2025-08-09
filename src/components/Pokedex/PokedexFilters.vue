<template>
    <div class="filters-container" ref="container">
        <FiltroBusqueda v-model="busqueda" />
        <FiltroTipos :selected-types="tiposFiltrados" @cambiar-tipos="cambiarTipos" />
        <div class="grid">
            <filtroHabilidad :dbCargada="dbCargada" :habilidad="habilidad" @cambiarHabilidad="cambiarHabilidad" />
            <FiltroTamano v-model="tamano" />
            <FiltroSentidos v-model="sentido" />
            <FiltroNatHab v-model="natHab" />
            <FiltroVit v-model="vitalidad" />
            <FiltroNivMin v-model="nivMin" />
        </div>
        <FiltroVels :vels="vels" @cambiar-vels="cambiarVels" />
        <FiltroMovs :movs="movs" :db-cargada="dbCargada" @cambiar-movs="cambiarMovs" />
        <div class="btns">
            <button @click="enviarFiltros">Filtrar</button>
            <button @click="limpiarFiltros">Limpiar Filtros</button>
        </div>
    </div>
</template>

<script setup>
import FiltroBusqueda from '@/components/Pokedex/FiltroBusqueda.vue';
import FiltroTipos from '@/components/Pokedex/FiltroTipos.vue';
import FiltroHabilidad from './FiltroHabilidad.vue';
import FiltroTamano from './FiltroTamano.vue';
import FiltroSentidos from './FiltroSentidos.vue';
import FiltroNatHab from './FiltroNatHab.vue';
import FiltroVit from './FiltroVit.vue';
import FiltroNivMin from './FiltroNivMin.vue';
import FiltroVels from './FiltroVels.vue';
import FiltroMovs from './FiltroMovs.vue';

import { watch, ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    dbCargada: Boolean,
    searchTerm: String,
    selectedTypes: Array,
    filtroHabilidad: String,
    filtroTamano: String,
    filtroSentido: String,
    filtroNatHabil: String,
    filtroVitalidad: Number,
    filtroNivelMin: Number,
    filtroVelocidades: Array,
    filtroMovimientos: Array
})

const container = ref(null)

const emit = defineEmits(['manejar-filtros', 'cerrar-filtros'])

const busqueda = ref(props.searchTerm)
const tiposFiltrados = ref([...props.selectedTypes])
const habilidad = ref(props.filtroHabilidad)
const tamano = ref(props.filtroTamano)
const sentido = ref(props.filtroSentido)
const natHab = ref(props.filtroNatHabil)
const vitalidad = ref(props.filtroVitalidad)
const nivMin = ref(props.filtroNivelMin)
const vels = ref([...props.filtroVelocidades])
const movs = ref([...props.filtroMovimientos])



//Actualizar filtros hacia abajo
watch(() => [
    props.searchTerm,
    props.selectedTypes,
    props.filtroHabilidad,
    props.filtroTamano,
    props.filtroSentido,
    props.filtroNatHabil,
    props.filtroVitalidad,
    props.filtroNivelMin,
    props.filtroVelocidades,
    props.filtroMovimientos
],
    () => {
        busqueda.value = props.searchTerm
        tiposFiltrados.value = [...props.selectedTypes]
        habilidad.value = props.filtroHabilidad
        tamano.value = props.filtroTamano
        sentido.value = props.filtroSentido
        natHab.value = props.filtroNatHabil
        vitalidad.value = props.filtroVitalidad
        nivMin.value = props.filtroNivelMin
        vels.value = [...props.filtroVelocidades]
        movs.value = [...props.filtroMovimientos]
    },
    { immediate: true }
)

function enviarFiltros() {
    emit('manejar-filtros', busqueda.value, tiposFiltrados.value, habilidad.value, tamano.value, sentido.value,
        natHab.value, vitalidad.value, nivMin.value, vels.value, movs.value)
}

function limpiarFiltros() {
    busqueda.value = null
    tiposFiltrados.value = []
    habilidad.value = null
    tamano.value = null
    sentido.value = null
    natHab.value = null
    vitalidad.value = null
    nivMin.value = null
    vels.value = []
    movs.value = []
}

function cambiarTipos(tipos) {
    tiposFiltrados.value = tipos
}

function cambiarVels(velocs) {
    vels.value = velocs
}

function cambiarMovs(movimientos) {
    movs.value = movimientos
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
    background: var(--color-fondo);
    height: calc(100% - 40px);
    margin: 30px 10px 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Grid de filtros secundarios */
.grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(200px, 1fr));
    gap: 15px;
}

@media (max-width: 1400px) {
    .grid {
        grid-template-columns: repeat(3, minmax(200px, 1fr));
    }
}

@media (max-width: 750px) {
    .filters-container {
        padding-top: 20px;
    }

    .grid {
        grid-template-columns: repeat(2, minmax(200px, 1fr));
    }
}

@media (max-width: 500px) {
    .grid {
        grid-template-columns: auto;
    }

    .filters-container {
        height: fit-content;
    }
}

/* Botones */
.filters-container button {
    padding: 10px 18px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.filters-container button:first-of-type {
    background: var(--color-principal1);
    color: var(--color-texto);
    margin-right: 10px;
}

.filters-container button:first-of-type:hover {
    background: var(--color-principal2);
}

.filters-container button:last-of-type {
    background: #f5f5f5;
    color: #333;
}

.filters-container button:last-of-type:hover {
    background: #e2e2e2;
}

.btns {
    margin-top: auto;
    display: flex;
    gap: 10px;
    padding-bottom: 10px;
}
</style>