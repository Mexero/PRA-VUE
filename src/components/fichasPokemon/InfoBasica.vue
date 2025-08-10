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
const nombreFicha = ref(props.ficha.nombre)
const mostrarLista = ref(false)

const nivelTemp = ref(props.ficha.nivel)

const especiesFiltradas = computed(() =>
    props.especiesPokes.filter(d =>
        d.toLowerCase().includes(especieElegida.value.toLowerCase()))
)

watch(() => props.ficha.nombre,
    (nuevo) => {
        nombreFicha.value = nuevo
    }
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
    setTimeout(() => {
        mostrarLista.value = false
    }, 150)
}
</script>

<template>
    <section class="info-basica-grid">
        <div class="nombre" style="position: relative;">
            <label for="Nombre">Nombre:</label>
            <input name="Nombre" v-model="nombreFicha" @keydown.enter.prevent="emit('cambiarNombre', nombreFicha)" />
            <button @click="emit('cambiarNombre', nombreFicha)">Cambiar</button>
        </div>

        <div class="especie" style="position: relative;" v-click-outside="ocultarLista">
            <label for="Especie">Especie:</label>
            <input name="Especie" v-model="especieElegida" placeholder="Buscar especie..." @focus="mostrarLista = true"
                @keydown.enter.prevent="seleccionarEspecie()" />
            <ul v-if="mostrarLista && especiesFiltradas.length">
                <li v-for="especie in especiesFiltradas" :key="especie"
                    @mousedown.prevent="seleccionarEspecie(especie)">
                    {{ especie }}
                </li>
            </ul>
            <button @click="CambiarEspecie(especieElegida)">Cambiar</button>

        </div>
        <div class="nivel">
            <label for="Nivel">Nivel:</label>
            <input type="number" name="Nivel" v-model.number="nivelTemp" min="0" />
            <button @click="cambiarNivel">Cambiar</button>
        </div>
        <div class="tipos">
            <label for="Tipos">Tipos:</label>
            <input name="Tipos" class="NombreTipos" v-model="ficha.pokedex.tipos[0]" readonly />
            <template v-if="ficha.pokedex.tipos[1]">/
                <input class="NombreTipos" v-model="ficha.pokedex.tipos[1]" readonly />
            </template>
        </div>
    </section>
</template>

<style scoped>
.info-basica-grid {
    border-bottom: 1px solid rgba(150, 150, 150, 0.798);
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.nombre {
    display: flex;
    align-items: center;
    gap: 5px;
}

.nivel {
    display: flex;
    align-items: center;
    gap: 5px;
}

.especie {
    display: flex;
    align-items: center;
    gap: 5px;
}

.tipos {
    display: flex;
    align-items: center;
    gap: 5px;
}

.tipos {
    flex-wrap: nowrap;
}

input {
    font-size: large;
    background-color: transparent;
    padding: 4px;
    border: none;
    border-bottom: 1px solid;
    color: var(--color-texto);
}

label {
    font-weight: bold;
}

.info-basica-grid input:focus {
    outline: none;
}

.info-basica-grid input[name="Nombre"] {
    width: 50%;
}

.info-basica-grid input[name="Especie"] {
    width: 50%;
}

.info-basica-grid input[name="Nivel"] {
    width: 30px;
}


@media (max-width: 750px) {
    .info-basica-grid {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto auto auto;
        grid-template-areas:
            "nombre nivel"
            "especie especie"
            "tipos tipos";
        gap: 10px;
    }

    .info-basica-grid .nivel {
        justify-content: flex-end;
    }

    .info-basica-grid input[name="Nombre"] {
        width: 100%;
    }

    .info-basica-grid input[name="Especie"] {
        width: 60%;
    }


}

/* Quitar flechas en input[type="number"] para Chrome, Safari, Edge */
.info-basica-grid input[type="number"]::-webkit-inner-spin-button,
.info-basica-grid input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Quitar flechas en input[type="number"] para Firefox y estándar */
.info-basica-grid input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
}

button {

    padding: 5px;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    border: none;
    border-radius: 6px;
    cursor: pointer;

}

.NombreTipos {
    width: 100px;
}

ul {
    position: absolute;
    z-index: 10;
    background: var(--color-principal1);
    border: 1px solid #ccc;
    margin: 0;
    padding: 4px;
    list-style: none;
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
    top: 40px;
}

li {
    padding: 4px 8px;
    cursor: pointer;
}

li:hover {
    background: var(--color-principal2);

}
</style>