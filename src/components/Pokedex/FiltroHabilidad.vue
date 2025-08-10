<template>
    <div ref="container" class="contenedor">
        <label>Habilidad:
            <input type="text" v-model="query" @input="filtrarHabilidades" @keydown.enter="seleccionarPrimera"
                @focus="entrarInput" placeholder="Busca una habilidad..."
                :class="habilidadSeleccionada ? 'hayElegida' : ''" />
        </label>
        <ul v-if="mostrarDropdown && habilidadesFiltradas.length" class="dropdown" @click.stop>
            <li v-for="(habilidad, index) in habilidadesFiltradas" :key="index" @click="seleccionar(habilidad)">
                {{ habilidad }}
            </li>
        </ul>
    </div>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

import { initDB, queryDB } from '@/services/dbWorkerService'

//flags DB
const isReady = ref(false)
const error = ref(null)
const loading = ref(false)

const props = defineProps([
    'dbCargada',
    'habilidad'])

const emit = defineEmits(['cambiarHabilidad'])


const habilidades = ref([])
const habilidadesFiltradas = ref([])
const query = ref(props.habilidad ?? null)
const habilidadSeleccionada = ref(props.habilidad ?? null)
const mostrarDropdown = ref(false)
const container = ref(null)


watch(() => props.habilidad,
    () => {
        habilidadSeleccionada.value = props.habilidad
        query.value = props.habilidad
    })


const entrarInput = () => {
    mostrarDropdown.value = true
    filtrarHabilidades()

}


const filtrarHabilidades = () => {
    const texto = query.value?.toLowerCase().trim()
    if (!texto) {
        habilidadesFiltradas.value = habilidades.value
        return
    }
    habilidadesFiltradas.value = habilidades.value.filter((h) =>
        h.toLowerCase().includes(texto)
    )
}

const seleccionar = (habilidad) => {
    if (query.value === "" && habilidadSeleccionada.value) {
        habilidadSeleccionada.value = ""
    }
    else {
        habilidadSeleccionada.value = habilidad
        query.value = habilidad
        mostrarDropdown.value = false
    }

    emit('cambiarHabilidad', query.value)
}

const seleccionarPrimera = () => {
    if (habilidadesFiltradas.value.length > 0) {
        seleccionar(habilidadesFiltradas.value[0])
    }
}

// Cerrar dropdown al hacer clic fuera
const handleClickOutside = (event) => {
    if (container.value && !container.value.contains(event.target)) {
        mostrarDropdown.value = false
    }
}

watch(() => [props.dbCargada, isReady],
    async () => {
        if (props.dbCargada && isReady.value) habilidades.value = await handleHabs()
    }, { immediate: true, deep: true })

onMounted(async () => {
    document.addEventListener('click', handleClickOutside)
    //abrirDB
    try {
        await initDB()
        isReady.value = true
    } catch (err) {
        error.value = err.message || 'Error inicializando DB'
        console.warn(error.value)
    }
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

async function handleHabs() {
    loading.value = true
    error.value = null

    let data = []
    try {
        const res = await queryDB(`SELECT Nombre FROM habilidades`, [])

        data = (res?.[0]?.values || []).map((row) => row[0]);
    } catch (err) {
        error.value = err.message || 'Error cargando las habilidades'
        console.warn(error.value)
    } finally {
        loading.value = false
        return data
    }
}

</script>

<style scoped>
.contenedor {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

label {
    font-weight: 600;
    font-size: 0.95em;
    color: var(--color-texto);
}

input {
    width: 100%;
    padding: 10px 14px;
    border: 1.8px solid #ccc;
    border-radius: 8px;
    font-size: 0.95em;
    background-color: var(--color-fondoTarjeta);
    transition: all 0.25s ease;
    outline: none;
}

input:hover {
    border-color: #444;
}

input:focus {
    border-color: #444;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
}

.hayElegida {
    border-color: #444;
}

.dropdown {
    position: absolute;
    top: 95%;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: var(--color-fondoTarjeta);
    border: 1px solid #ccc;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
}

.dropdown li {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 0.95em;
}

.dropdown li:hover {
    background-color: #DDD;
}
</style>
