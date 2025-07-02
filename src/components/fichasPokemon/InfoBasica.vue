<template>
    <section class="info-basica">
        <div>
            <span class="label">Nombre:</span>
            <input v-model="ficha.nombre" @keyup.enter="emit('cambiarNombre', ficha.nombre)" />
        </div>

        <div>
            <span class="label">Especie:</span>
            <div style="position: relative;" v-click-outside="ocultarLista">
                <input v-model="especieElegida" placeholder="Buscar especie..." @focus="mostrarLista = true"
                    @keydown.enter.prevent="seleccionarEspecie()" />
                <button @click="CambiarEspecie(especieElegida)">Cambiar</button>
                <ul v-if="mostrarLista && especiesFiltradas.length">
                    <li v-for="especie in especiesFiltradas" :key="especie"
                        @mousedown.prevent="seleccionarEspecie(especie)">
                        {{ especie }}
                    </li>
                </ul>
            </div>
        </div>

        <div>
            <span class="label">Nivel:</span>
            <input type="number" v-model.number="nivelTemp" min="0" />
            <button @click="cambiarNivel">Cambiar</button>
        </div>

        <div>
            <span class="label">Tipos:</span>
            <input v-model="ficha.pokedex.tipos[0]" readonly />
            <template v-if="ficha.pokedex.tipos[1]">/
                <input v-model="ficha.pokedex.tipos[1]" readonly />
            </template>
        </div>
    </section>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

import vClickOutside from '@/directives/clickOutside.js'

const props = defineProps([
    'ficha',
    'especiesPokes',
    'especiesPokesCargadas'
])
const emit = defineEmits(['cambiarNombre', 'cambiarDatosEspecie'])

const especieElegida = ref(props.ficha.pokedex.especie)
const mostrarLista = ref(false)

const nivelTemp = ref(props.ficha.nivel)

const especiesFiltradas = computed(() =>
    props.especiesPokes.filter(d =>
        d.toLowerCase().includes(especieElegida.value.toLowerCase()))
)

watch(() => props.ficha.nivel,
    (nuevo) => {
        nivelTemp.value = nuevo
    }
)

watch(() => props.ficha.pokedex.especie,
    (nuevo) => {
        especieElegida.value = nuevo
    }
)

function cambiarNivel() {
    props.ficha.nivel = nivelTemp.value
}

function CambiarEspecie(especie) {
    if (!props.especiesPokes.includes(especie)) {
        especieElegida.value = props.ficha.pokedex.especie
        return;
    }
    mostrarLista.value = false
    emit('cambiarDatosEspecie', especieElegida.value)
}

function seleccionarEspecie(nombre = null) {
    const final = nombre || especiesFiltradas.value[0]
    if (!final) return
    especieElegida.value = final
    mostrarLista.value = false
    document.activeElement.blur()
}

function ocultarLista() {
    // Puede usarse en eventos como @blur o @mouseleave
    setTimeout(() => {
        mostrarLista.value = false
    }, 150)
}
</script>

<style scoped>
.info-basica {
    display: flex;
    gap: 24px;
    justify-content: space-between;
    margin-bottom: 20px;
}

.sugerencias {
    border: 1px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
    background: white;
    list-style: none;
    padding: 0;
    margin: 0;
    position: absolute;
    z-index: 10;
    top: 30px;
    left: 0;
    width: 250px;
}

.label {
    font-weight: 600;
    color: #34495e;
}

button {
    margin-left: 8px;
    padding: 4px 10px;
    font-size: 0.9em;
}

ul {
    position: absolute;
    z-index: 10;
    background: white;
    border: 1px solid #ccc;
    margin: 0;
    padding: 4px;
    list-style: none;
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
}

li {
    padding: 4px 8px;
    cursor: pointer;
}

li:hover {
    background-color: #f0f0f0;
}
</style>