<script setup>

import { debounce } from 'lodash';
import { ref, watch } from 'vue';

const props = defineProps([
    'datosCargados',
    'filtroTransformacion',
    'filtroLegendaria'
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
                    <div id="parFiltros">
                        <div id="filtroTipos">
                            <h3>Filtros Legendaria</h3>
                            <div>
                                <label v-for="opcion in ['Legendaria', 'No Legendaria', 'Todas']" :key="opcion">
                                    <input type="radio" name="legend" :value="opcion"
                                        :checked="filtroLegendaria === opcion"
                                        @change="actualizarFiltros('legendaria', opcion)" />
                                    {{ opcion }}
                                </label>
                            </div>
                        </div>
                        <div id="filtroTipos">
                            <h3>Filtros de Transformación</h3>
                            <div>
                                <label v-for="opcion in ['Transformación', 'No transformación', 'Todas']" :key="opcion">
                                    <input type="radio" name="transform" :value="opcion"
                                        :checked="filtroTransformacion === opcion"
                                        @change="actualizarFiltros('transformacion', opcion)" />
                                    {{ opcion }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
h3 {
    width: fit-content;
}

#parFiltros {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
}

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
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    width: fit-content;
}

#filtroTipos {
    width: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.filtrosInput {
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 15px;
    outline: none;
    border: 1px solid #ccc;
    background-color: var(--color-fondoTexto);
    color: var(--color-texto);
    flex: 1;
    min-width: 0;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.filtrosInput:focus {
    border-color: var(--color-principal1);
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
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

/* Contenedor del botón + buscador */
.botones {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.filtros button:hover {
    background-color: var(--color-secundario);
}

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