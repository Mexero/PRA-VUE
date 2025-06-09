<script setup>

import { debounce } from 'lodash';
import { ref, watch } from 'vue';

import Slider from '@/components/sliderView.vue'

const props = defineProps([
    'datosCargados',
    'tipos',
    'rarezas',
    'filtroTipos',
    'filtroRarezas',
    'filtroPrecioMin',
    'filtroPrecioMax',
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

//Rarezas
function toggleRareza(event, rareza) {
    const seleccionadas = new Set(props.filtroRarezas);
    if (event.target.checked) {
        seleccionadas.add(rareza);
    } else {
        seleccionadas.delete(rareza);
    }
    emit('actualizarFiltros', { clave: 'rarezas', valor: Array.from(seleccionadas) });
}

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

//Precios
function emitirPrecios(valorMin, valorMax) {
    precioMin.value = valorMin;
    precioMax.value = valorMax;
    actualizarFiltros('precioMin', precioMin.value);
    actualizarFiltros('precioMax', precioMax.value);
}

// =============== DATOS SLIDER ================
const allowedValues = [
    0, 100, 200, 250, 300, 400, 500, 600, 800, 1000, 1200,
    1400, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000,
    10000, 15000, 20000, 25000, 50000, 100000
];

const precioMin = ref(allowedValues[0]);
const precioMax = ref(allowedValues[allowedValues.length - 1]);

// =============== HABLAR SLIDER ================
let limpiarSliderFlag = ref(false);

watch(
    () => [props.filtroPrecioMin, props.filtroPrecioMax],
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


                    <h3>Rarezas</h3>
                    <div id="filtroRarezas">
                        <div>
                            <label v-for="rareza in rarezas" :key="rareza">
                                <input type="checkbox" :value="rareza" :checked="filtroRarezas.includes(rareza)"
                                    @change="event => toggleRareza(event, rareza)" />
                                {{ rareza }}
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

                    <h3>Coste</h3>

                    <Slider :allowedValues="allowedValues" :limpiar="limpiarSliderFlag"
                        @actualizarMinMax="emitirPrecios" />
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

#filtroTipos div {
    margin: 10px 5px;
    display: grid;
    grid-template-columns: repeat(4, auto);
    gap: 5px;
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

#filtroRarezas div {
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
    #filtroRarezas div {
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