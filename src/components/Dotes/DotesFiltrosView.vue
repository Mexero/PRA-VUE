<script setup>

import { debounce } from 'lodash';
import { ref, watch } from 'vue';

import Slider from '@/components/sliderView.vue'

const props = defineProps([
    'datosCargados',
    'tipos',
    'filtroTipos',
    'filtroPrerrequisitos',
    'filtroNivelMin',
    'filtroNivelMax',
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

//Nivel
function emitirNivel(valorMin, valorMax) {
    nivelMin.value = valorMin;
    nivelMax.value = valorMax;
    actualizarFiltros('nivelMin', nivelMin.value);
    actualizarFiltros('nivelMax', nivelMax.value);
}

// =============== DATOS SLIDER ================
const allowedValues = [
    0, 6, 9, 11, 12, 18
];

const nivelMin = ref(allowedValues[0]);
const nivelMax = ref(allowedValues[allowedValues.length - 1]);

// =============== HABLAR SLIDER ================
let limpiarSliderFlag = ref(false);

watch(
    () => [props.filtroNivelMin, props.filtroNivelMax],
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

                    <div id="filtroPrerrequisitos">
                        <h3>Prerrequisitos</h3>
                        <div>
                            <label v-for="opcion in ['Si', 'No', 'Todos']" :key="opcion">
                                <input type="radio" name="tienePrerrequisitos" :value="opcion"
                                    :checked="filtroPrerrequisitos === opcion"
                                    @change="actualizarFiltros('prerrequisitos', opcion)" />
                                {{ opcion }}
                            </label>
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

                    <h3>Nivel</h3>

                    <Slider :allowedValues="allowedValues" :limpiar="limpiarSliderFlag" :min="nivelMin" :max="nivelMax"
                        @actualizarMinMax="emitirNivel" />
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

#filtroPrerrequisitos div {
    gap: 8px;
    flex-wrap: wrap;
}

#filtroTipos div {
    margin: 10px 5px;
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
}

input[type="text"] {
    padding: 7px;
    border-radius: 5px;
    font-size: 17px;
    outline: none;
    margin-right: 20px;
}

input[type="text"]:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}

#filtroPrerrequisitos div {
    padding: 8px 0;
    display: flex;
    gap: 20px;
}

.filtros button {
    border: none;
    padding: 10px;
    width: 150px;
    cursor: pointer;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    font-size: 17px;
}

/*Contenedor de los botones*/
.botones {
    display: flex;
    gap: 5px;
}

.filtros button:hover {
    background-color: var(--color-secundario);
}


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
    #filtroPrerrequisitos div {
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