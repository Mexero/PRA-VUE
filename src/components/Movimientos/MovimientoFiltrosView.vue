<script setup>

import { debounce } from 'lodash';
import { ref, watch } from 'vue';

import Slider from '@/components/sliderView.vue'

const props = defineProps([
    'datosCargados',
    'etiquetas',
    'tipos',
    'filtroTipos',
    'filtroAccion',
    'filtroEtiquetas',
    'filtroPPMin',
    'filtroPPMax',
    'filtroNombre'
]);

const emit = defineEmits(['actualizarFiltros', 'limpiarFiltros']);

const mostrarFiltros = ref(false);
const nombre = ref(props.filtroNombre ?? undefined) //El valor de nombre precargado

// ====== LIMPIAR FILTROS =======

function limpiarFiltros() {
    nombre.value = undefined;
    emit('limpiarFiltros')
}

watch(() => props.filtroNombre, (nom) => {
    nombre.value = nom;
});

// ====== MANDAR AL PADRE QUE ACTUALICE FILTRO =======

function actualizarFiltros(clave, valor) {
    if (clave === 'nombre') {
        emitirNombreDebounced(valor);
    } else {
        emit('actualizarFiltros', { clave, valor });
    }
}
// Solo para el filtro de nombre (versión debounced)
const emitirNombreDebounced = debounce((valor) => {
    emit('actualizarFiltros', { clave: 'nombre', valor });
}, 100);

//Tipos
function toggleTipo(event, tipo) {
    const seleccionadas = new Set(props.filtroTipos);
    if (event.target.checked) {
        seleccionadas.add(tipo);
    } else {
        seleccionadas.delete(tipo);
    }
    emit('actualizarFiltros', { clave: 'tipos', valor: Array.from(seleccionadas) });
}

//Etiquetas
function toggleEtiqueta(event, etiqueta) {
    const seleccionadas = new Set(props.filtroEtiquetas);
    if (event.target.checked) {
        seleccionadas.add(etiqueta);
    } else {
        seleccionadas.delete(etiqueta);
    }
    emit('actualizarFiltros', { clave: 'etiquetas', valor: Array.from(seleccionadas) });
}

//Coste en PP
function emitirPP(valorMin, valorMax) {
    PPMin.value = valorMin;
    PPMax.value = valorMax;
    actualizarFiltros('PPMin', PPMin.value);
    actualizarFiltros('PPMax', PPMax.value);
}

// =============== DATOS SLIDER ================
const allowedValues = [0, 1, 2, 3, 4, 5, 6];

const PPMin = ref(allowedValues[0]);
const PPMax = ref(allowedValues[allowedValues.length - 1]);

// =============== HABLAR SLIDER ================
let limpiarSliderFlag = ref(false);

watch(
    () => [props.filtroPPMin, props.filtroPPMax],
    ([min, max]) => {
        if (typeof max !== "number" && !min && !max) {
            limpiarSliderFlag.value = !limpiarSliderFlag.value;
        }
    }
);
</script>

<template>
    <div class="filtros">
        <div class="botones">
            <div>
                <button @click="mostrarFiltros = !mostrarFiltros">
                    {{ mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros" }}
                </button>
            </div>
        </div>

        <transition name="slideFiltros">
            <div v-if="mostrarFiltros" id="mostrarFiltros">
                <div class="paddingBloque">
                    <input type="text" placeholder="Buscar por nombre" v-model="nombre"
                        @input="actualizarFiltros('nombre', nombre)" />

                    <button @click="limpiarFiltros">Limpiar filtros</button>
                    <div id="filtroAccion">
                        <h3>Acción</h3>
                        <div>
                            <div>
                                <label v-for="opcion in ['Acción', 'Reacción', 'Ambos']" :key="opcion">
                                    <input type="radio" name="tieneAccion" :value="opcion"
                                        :checked="filtroAccion === opcion.toLocaleLowerCase()"
                                        @change="actualizarFiltros('accion', opcion.toLowerCase())" />
                                    {{ opcion }}
                                </label>
                            </div>
                        </div>
                    </div>
                    <details>
                        <summary>Tipos</summary>
                        <div id="filtroTipos">
                            <label v-for="tipo in tipos" :key="tipo">
                                <input type="checkbox" :value="tipo" :checked="filtroTipos.includes(tipo)"
                                    @change="event => toggleTipo(event, tipo)" />
                                {{ tipo }}
                            </label>
                        </div>
                    </details>
                    <details>
                        <summary>Etiquetas</summary>
                        <div id="filtroEtiquetas">
                            <label v-for="etiqueta in etiquetas" :key="etiqueta">
                                <input type="checkbox" :value="etiqueta" :checked="filtroEtiquetas.includes(etiqueta)"
                                    @change="event => toggleEtiqueta(event, etiqueta)" />
                                {{ etiqueta }}
                            </label>
                        </div>
                    </details>
                    <h3>Coste en PP</h3>
                    <Slider :allowedValues="allowedValues" :limpiar="limpiarSliderFlag" @actualizarMinMax="emitirPP"
                        :min="PPMin" :max="PPMax" />
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
/* ===== TITULOS ===== */
h3 {
    width: fit-content;
    margin-bottom: 8px;
    font-size: 18px;
    color: var(--color-texto);
}

/* ===== CONTENEDORES ===== */
.filtros {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.paddingBloque {
    padding: 15px;
}

#parFiltros {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
}

/* ===== BOTONES ===== */
.filtros button {
    border: none;
    padding: 10px 14px;
    cursor: pointer;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    font-size: 15px;
    transition: background-color 0.2s ease, transform 0.1s ease;
}

.filtros button:hover {
    background-color: var(--color-secundario);
    transform: translateY(-1px);
}

.botones {
    display: flex;
    gap: 8px;
}

/* ===== INPUTS ===== */
input[type="text"] {
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 15px;
    outline: none;
    margin-right: 10px;
    border: 1px solid #ccc;
    background-color: var(--color-fondoTexto);
    color: var(--color-texto);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input[type="text"]:focus {
    border-color: var(--color-principal1);
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
}

/* ===== CHECKBOXES Y RADIOS ===== */
label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--color-texto);
}

input[type="checkbox"],
input[type="radio"] {
    accent-color: var(--color-principal1);
    transform: scale(1.1);
}

/* ===== FILTROS TIPOS Y ETIQUETAS ===== */
#filtroTipos,
#filtroEtiquetas {
    margin: 10px 5px;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    width: fit-content;
}

/* ===== DETAILS ===== */
details {
    margin: 12px 0;
    border: 1px solid var(--color-principal1);
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--color-fondoTexto);
    transition: box-shadow 0.2s ease-in-out;
}

details:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

details summary {
    background-color: var(--color-principal1);
    color: var(--color-texto);
    font-size: 16px;
    font-weight: bold;
    padding: 10px 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    list-style: none;
}

details summary::marker,
details summary::-webkit-details-marker {
    display: none;
}

/* Icono flecha */
details summary::after {
    content: "▼";
    font-size: 0.9em;
    transition: transform 0.2s ease;
}

details[open] summary::after {
    transform: rotate(-180deg);
}

details>div {
    padding: 10px 14px;
    animation: abrirDetalles 0.25s ease;
}

@keyframes abrirDetalles {
    from {
        opacity: 0;
        transform: translateY(-3px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ===== PANEL MOSTRAR FILTROS ===== */
#mostrarFiltros {
    color: var(--color-texto);
    background-color: var(--color-fondoTexto);
    width: 100%;
    border-radius: 0 10px 0 0;
    font-size: 15px;
    box-shadow:
        -2px 2px 10px rgba(0, 0, 0, 0.1),
        2px -2px 10px rgba(0, 0, 0, 0.1),
        2px 2px 10px rgba(0, 0, 0, 0.1),
        -2px -2px 10px rgba(0, 0, 0, 0.1);
}

/* ===== SLIDE ANIMATION ===== */
.slideFiltros-enter-active,
.slideFiltros-leave-active {
    transition: all 0.3s ease-in-out;
    overflow: hidden;
}

.slideFiltros-enter-from,
.slideFiltros-leave-to {
    max-height: 0;
    opacity: 0.5;
    padding: 0;
}

.slideFiltros-enter-to,
.slideFiltros-leave-from {
    max-height: 450px;
    opacity: 1;
}

/* ===== RESPONSIVE ===== */
@media screen and (max-width: 1170px) {
    #filtroTipos div {
        grid-template-columns: repeat(3, auto);
    }
}

@media screen and (max-width: 960px) {
    #filtroTipos div {
        grid-template-columns: repeat(2, auto);
    }
}

@media screen and (max-width: 890px) {
    .filtros {
        width: 100%;
        padding: 0;
    }

    .paddingBloque {
        padding: 10px;
    }

    .paddingBloque button {
        width: fit-content;
        margin-top: 10px;
    }

    #filtroTipos div {
        grid-template-columns: repeat(2, auto) !important;
        gap: 8px;
        flex-wrap: wrap;
    }

    .slideFiltros-enter-to,
    .slideFiltros-leave-from {
        max-height: 600px;
    }
}
</style>