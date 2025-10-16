<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'

import vClickOutside from '@/directives/clickOutside.js'
import tablaTipos from '@/localData/json/tablaTipos.json'

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
const nivelCambiado = computed(() => nivelTemp.value !== props.ficha.nivel)
const especieCambiada = computed(() => especieElegida.value !== props.ficha.pokedex.especie)

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

function normalizeType(type) {
    return type
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
}

const tooltipTipos = ref(null);
const pos = ref({ x: 0, y: 0 });
const tooltipEl = ref(null);

function mostrarDebilidadesConjuntas(tipos) {
    const multipliers = {};
    const tiposDisponibles = Object.keys(tablaTipos);

    tiposDisponibles.forEach(tipo => (multipliers[tipo] = 1));

    tipos.forEach(tipo => {
        const key = normalizeType(tipo);
        tiposDisponibles.forEach(tipo => {
            const mult = tablaTipos[normalizeType(tipo)]?.[key] ?? 1;
            multipliers[tipo] *= mult;
        });
    });

    const debiles = [];
    const resistentes = [];
    const inmunes = [];

    Object.entries(multipliers).forEach(([atk, mult]) => {
        if (mult === 0) inmunes.push(atk);
        else if (mult > 1) debiles.push(`${atk}`);
        else if (mult < 1) resistentes.push(`${atk}`);
    });

    tooltipTipos.value = { debiles, resistentes, inmunes };
}

function updatePosition(e) {
    const el = tooltipEl.value;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    let x = e.clientX + 15;
    let y = e.clientY + 15;

    if (x + rect.width > window.innerWidth) {
        x = window.innerWidth - rect.width - 5;
    }
    if (y + rect.height > window.innerHeight) {
        y = window.innerHeight - rect.height - 5;
    }

    pos.value = { x, y };
}

onMounted(() => {
    window.addEventListener("mousemove", updatePosition);
});

onBeforeUnmount(() => {
    window.removeEventListener("mousemove", updatePosition);
});

const typeMap = {
    normal: 'normal',
    fuego: 'fire',
    agua: 'water',
    planta: 'grass',
    electrico: 'electric',
    hielo: 'ice',
    lucha: 'fighting',
    veneno: 'poison',
    tierra: 'ground',
    volador: 'flying',
    psiquico: 'psychic',
    bicho: 'bug',
    roca: 'rock',
    fantasma: 'ghost',
    dragon: 'dragon',
    siniestro: 'dark',
    acero: 'steel',
    hada: 'fairy'
}
</script>

<template>
    <section class="info-basica">
        <div class="nombre" style="position: relative;">
            <label for="Nombre">Nombre:</label>
            <input name="Nombre" v-model="nombreFicha" @blur="emit('cambiarNombre', nombreFicha)"
                @keydown.enter.prevent="emit('cambiarNombre', nombreFicha)" />
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
            <button class="especie-icon-btn" v-if="especieCambiada" @click="CambiarEspecie(especieElegida)"
                aria-label="Confirmar cambio de especie">
                <svg class="especie-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9 16.2L5.5 12.7 4.1 14.1 9 19 20.3 7.7 18.9 6.3z" />
                </svg>
            </button>

        </div>
        <div class="nivel">
            <div class="nivel-input">
                <label for="Nivel">Nivel:</label>
                <input type="number" name="Nivel" v-model.number="nivelTemp" min="0" />
            </div>
            <button class="nivel-icon-btn" v-if="nivelCambiado" @click="cambiarNivel"
                aria-label="Confirmar cambios de nivel">
                <svg class="nivel-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9 16.2L5.5 12.7 4.1 14.1 9 19 20.3 7.7 18.9 6.3z" />
                </svg>
            </button>
        </div>
        <div class="tipos" @mouseenter="mostrarDebilidadesConjuntas(ficha.pokedex.tipos)"
            @click="mostrarDebilidadesConjuntas(ficha.pokedex.tipos)" @mouseleave="tooltipTipos = null">


            <p class="NombreTipos" :class="'type-' + normalizeType(ficha.pokedex.tipos[0])"> {{ ficha.pokedex.tipos[0]
            }}
            </p>

            <p v-if="ficha.pokedex.tipos[1]" class="NombreTipos"
                :class="'type-' + normalizeType(ficha.pokedex.tipos[1])"> {{
                    ficha.pokedex.tipos[1] }}
            </p>
        </div>
        <div v-if="tooltipTipos" class="tooltip" :style="{ top: pos.y + 'px', left: pos.x + 'px' }" ref="tooltipEl">
            <div v-if="tooltipTipos.debiles.length">
                <span>Súper efectivo:</span>
                <div class="container-tipos">
                    <img v-for="tipo in tooltipTipos.debiles" :src="`/assets/icons/${typeMap[tipo]}.svg`" :alt="tipo"
                        class="tipo-icon" :class="'type-' + normalizeType(tipo)" />
                </div>
            </div>
            <div v-if="tooltipTipos.resistentes.length">
                <span>Poco efectivo:</span>
                <div class="container-tipos">
                    <img v-for="tipo in tooltipTipos.resistentes" :src="`/assets/icons/${typeMap[tipo]}.svg`"
                        :alt="tipo" class="tipo-icon" :class="'type-' + normalizeType(tipo)" />
                </div>
            </div>
            <div v-if="tooltipTipos.inmunes.length">
                <span>Inmune:</span>
                <div class="container-tipos">
                    <img v-for="tipo in tooltipTipos.inmunes" :src="`/assets/icons/${typeMap[tipo]}.svg`" :alt="tipo"
                        class="tipo-icon" :class="'type-' + normalizeType(tipo)" />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
@import url(../../css/typeColors.css);

.nivel-icon {
    width: 27px;
    height: 27px;

}

.nivel-icon-btn {
    background-color: var(--color-principal1);
    border: none;
    cursor: pointer;
    padding: 0px 3px;
}

.nivel-icon-btn:hover {
    background-color: var(--color-principal2);
}

.especie-icon {
    width: 27px;
    height: 27px;
}

.especie-icon-btn {
    background-color: var(--color-principal1);
    border: none;
    cursor: pointer;
    padding: 0px 3px;
}

.especie-icon-btn:hover {
    background-color: var(--color-principal2);
}

.info-basica {
    border-bottom: 1px solid rgba(150, 150, 150, 0.798);
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
}

.info-basica div {
    flex-wrap: nowrap;
}

.nombre,
.nivel,
.especie,
.tipos {
    display: flex;
    align-items: center;
    gap: 8px;
}

.tipos {
    flex-wrap: nowrap;
    border-radius: 5px;
}

input {
    font-size: large;
    background-color: transparent;
    padding: 4px 6px;
    border: none;
    border-bottom: 1px solid;
    color: var(--color-texto);
    width: 140px;
    text-align: center;
}

label {
    font-weight: bold;
    white-space: nowrap;
}

input:focus {
    outline: none;
}

input[name="Nivel"] {
    width: 45px;
    font-size: 16px;
    padding: 2px;
}

.NombreTipos {
    padding: 6px 10px;
    text-align: center;
    width: 100px;
    border-radius: 8px;
    font-weight: bold;
    color: black;
    text-transform: capitalize;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}


/* Botón */
button {
    padding: 6px 10px;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    flex-shrink: 0;
}

button:hover {
    background: var(--color-principal2);
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
    border-radius: 4px;
}

li {
    padding: 4px 8px;
    cursor: pointer;
}

li:hover {
    background: var(--color-principal2);
}

/* Quitar flechas en number inputs */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;

}

.tooltip {
    position: fixed;
    background: var(--color-fondo);
    color: var(--color-texto);
    padding: 4px 12px 8px 8px;
    border-radius: 8px;
    max-width: 250px;
    z-index: 10;
    pointer-events: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

}

.tooltip>div {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 6px;
}

.tooltip span {
    font-weight: bold;
    min-width: 110px;
    text-align: right;
}

.container-tipos {
    display: flex;
    flex-wrap: wrap !important;
    gap: 4px;
    max-width: 155px;
}

.tipo-icon {
    padding: 5px;
    border-radius: 50%;
    width: 25px;
    height: 25px;
}

@media screen and (max-width: 1040px) {
    .info-basica {
        border-bottom: 1px solid rgba(150, 150, 150, 0.798);
        padding-bottom: 20px;
        display: grid;
        grid-template-areas:
            "nombre especie nivel tipos";
        grid-template-columns: auto auto auto;
        gap: 10px;
        align-items: center;
    }

    .tipos {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 4px;
        max-width: 155px;
    }

    .nombre {
        grid-area: nombre;
    }

    .nivel {
        grid-area: nivel;
        justify-self: end;
    }

    .especie {
        grid-area: especie;
    }

    .tipos {
        grid-area: tipos;
        justify-self: end;
    }
}

@media screen and (max-width: 750px) {
    .info-basica {
        grid-template-areas: "nombre  nivel" "especie tipos";
        grid-template-columns: auto auto auto;
        gap: 10px;
        align-items: center;
    }
}

/*
@media screen and (max-width: 768px) {
    .info-basica {
        grid-template-areas:
            "nombre nivel"
            "especie especie"
            "tipos tipos";
        gap: 12px 15px;
    }

    .nombre input,
    .especie input {
        width: 120px;
        font-size: 16px;
    }

    .nivel input {
        width: 40px;
    }
}

@media screen and (max-width: 480px) {
    .info-basica {
        grid-template-areas:
            "nombre"
            "nivel"
            "especie"
            "tipos";
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .nivel {
        justify-self: start;
    }

    .nombre input,
    .especie input {
        width: 100%;
        max-width: 200px;
    }
}

/*
@media screen and (max-width: 1410px) {
    .info-basica {
        display: grid;
        grid-template-areas:
            "nombre nivel"
            "especie tipos ";
        grid-template-columns: 1fr 1fr;
        gap: 20px 0;
    }

    .nombre {
        grid-area: nombre;
        width: 200px;
    }

    .especie {
        grid-area: especie;
    }

    .nivel {
        grid-area: nivel;
        margin-left: auto;
    }

    .tipos {
        grid-area: tipos;
        margin-left: auto;
    }



}

@media screen and (max-width: 920px) {
    .info-basica {
        display: grid;
        grid-template-areas:
            "nombre nivel"
            "especie especie"
            "tipos tipos";
        grid-template-columns: auto;
        grid-template-rows: 30px;

    }

    .tipos {
        margin-left: 0;
    }

    .nivel {
        flex-direction: column;
    }

}

@media screen and (max-width: 545px) {
    .info-basica {
        display: grid;
        grid-template-areas:
            "nombre"
            "especie"
            "nivel"
            "tipos";
        grid-template-columns: 100%;
        grid-template-rows: 30px;

    }

    .nivel-input {
        display: flex;
        align-items: center;
    }

    .nivel {
        flex-direction: row;
        margin-left: 0;
    }
}
    */
</style>