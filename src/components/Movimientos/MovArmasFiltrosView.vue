<script setup>

import { debounce } from 'lodash';
import { ref, watch } from 'vue';

import Slider from '@/components/sliderView.vue'

const props = defineProps([
    'datosCargados',
    'tipos',
    'filtroTipos',
    'filtroAccion',
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

//Coste en PP
function emitirPP(valorMin, valorMax) {
    PPMin.value = valorMin;
    PPMax.value = valorMax;
    actualizarFiltros('PPMin', PPMin.value);
    actualizarFiltros('PPMax', PPMax.value);
}

// =============== DATOS SLIDER ================
const allowedValues = [0, 1, 2, 3, 4, 5];

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
            <button @click="mostrarFiltros = !mostrarFiltros">
                {{ mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros" }}
            </button>
            <input type="text" class="filtrosInput" placeholder="Buscar por nombre" v-model="nombre"
                @input="actualizarFiltros('nombre', nombre)" />
        </div>

        <transition name="slideFiltros">
            <div v-if="mostrarFiltros" id="mostrarFiltros">
                <div class="paddingBloque">
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
                    <div id="filtroTipos">
                        <h3>Tipos</h3>
                        <div>
                            <label v-for="tipo in tipos" :key="tipo">
                                <input type="checkbox" :value="tipo" :checked="filtroTipos.includes(tipo)"
                                    @change="event => toggleTipo(event, tipo)" />
                                {{ tipo }}
                            </label>
                        </div>
                    </div>
                    <h3>Coste en PP</h3>
                    <Slider :allowedValues="allowedValues" :limpiar="limpiarSliderFlag" @actualizarMinMax="emitirPP"
                        :min="PPMin" :max="PPMax" />
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.paddingBloque {
    padding: 15px;
}

.filtros {
    width: 100%;
    display: flex;
    flex-direction: column;
}

/* ===== Bloques de opciones ===== */
#filtroAccion div,
#filtroTipos div {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin: 10px 0;
}

.filtrosInput {
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 15px;
    outline: none;
    border: 1px solid #ccc;
    background-color: var(--color-fondoTexto);
    color: var(--color-texto);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    flex: 1;
    min-width: 0;
}

.filtrosInput:focus {
    border-color: var(--color-principal1);
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
}

/* ===== Botones ===== */
.filtros button {
    border: none;
    padding: 10px;
    width: 150px;
    cursor: pointer;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    font-size: 17px;
}

.filtros button:hover {
    background-color: var(--color-secundario);
}

/* Contenedor de los botones */
.botones {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}

/* ===== Caja de filtros visible ===== */
#mostrarFiltros {
    color: var(--color-texto);
    background-color: var(--color-fondoTexto);
    width: 100%;
    font-size: 15px;
    box-shadow:
        -2px 2px 10px rgba(0, 0, 0, 0.1),
        2px -2px 10px rgba(0, 0, 0, 0.1),
        2px 2px 10px rgba(0, 0, 0, 0.1),
        -2px -2px 10px rgba(0, 0, 0, 0.1);
}

/* ===== Transiciones ===== */
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

/* ===== Responsive ===== */
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
        margin: 10px 0 0 0;
    }

    #filtroTipos div,
    #filtroAccion div {
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
