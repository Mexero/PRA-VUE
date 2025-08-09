<script setup>

import { debounce } from 'lodash';
import { ref, watch } from 'vue';

const props = defineProps([
    'datosCargados',
    'tiposComunes',
    'tiposMenores',
    'filtroTipo'
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
    const seleccionadas = new Set(props.filtroTipo);
    if (event.target.checked) {
        seleccionadas.add(tipo);
    } else {
        seleccionadas.delete(tipo);
    }
    emit('actualizarFiltros', { clave: 'tipos', valor: Array.from(seleccionadas) });
}
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

                    <div id="filtroTipos">
                        <h3>Filtros comunes</h3>
                        <div>
                            <label v-for="tipo in tiposComunes" :key="tipo">
                                <input type="checkbox" :value="tipo" :checked="filtroTipo.includes(tipo)"
                                    @change="event => toggleTipo(event, tipo)" />
                                {{ tipo }}
                            </label>
                        </div>
                    </div>
                    <div id="filtroTipos">
                        <h3>Filtros poco comunes</h3>
                        <div>
                            <label v-for="tipo in tiposMenores" :key="tipo">
                                <input type="checkbox" :value="tipo" :checked="filtroTipo.includes(tipo)"
                                    @change="event => toggleTipo(event, tipo)" />
                                {{ tipo }}
                            </label>
                        </div>
                    </div>
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

/* ===== BOTONES ===== */
.botones {
    display: flex;
    gap: 8px;
}

.filtros button {
    border: none;
    padding: 10px 14px;
    cursor: pointer;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    font-size: 15px;
    transition: background-color 0.18s ease, transform 0.12s ease;
    width: 150px;
}

.filtros button:hover,
.filtros button:focus {
    background-color: var(--color-secundario);
    transform: translateY(-1px);
    outline: none;
}

/* ===== INPUTS ===== */
input[type="text"] {
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 15px;
    outline: none;
    margin-right: 10px;
    border: 1px solid #cfcfcf;
    background-color: var(--color-fondoTexto);
    color: var(--color-texto);
    transition: border-color 0.16s ease, box-shadow 0.16s ease;
}

input[type="text"]:focus {
    border-color: var(--color-principal1);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.08);
}

/* ===== CHECKBOXES Y RADIOS ===== */
label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--color-texto);
    user-select: none;
}

input[type="checkbox"],
input[type="radio"] {
    accent-color: var(--color-principal1);
    transform: scale(1.05);
}

/* ===== DETAILS / SUMMARY ===== */
details {
    margin: 12px 0;
    border: 1px solid var(--color-principal1);
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--color-fondoTexto);
    transition: box-shadow 0.18s ease-in-out, border-color 0.18s ease;
}

details:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

details summary {
    background-color: var(--color-principal1);
    color: var(--color-texto);
    font-size: 16px;
    font-weight: 700;
    padding: 10px 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    list-style: none;
    border-radius: 8px 8px 0 0;
}

details summary::marker,
details summary::-webkit-details-marker {
    display: none;
}

/* Flecha indicadora y animación */
details summary::after {
    content: "▼";
    font-size: 0.9em;
    transition: transform 0.18s ease;
    opacity: 0.95;
    margin-left: 12px;
}

details[open] summary::after {
    transform: rotate(-180deg);
}

/* Contenido interior del details */
details>div {
    padding: 10px 14px;
    animation: abrirDetalles 0.22s ease;
}

@keyframes abrirDetalles {
    from {
        opacity: 0;
        transform: translateY(-4px);
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
        -2px 2px 10px rgba(0, 0, 0, 0.06),
        2px -2px 10px rgba(0, 0, 0, 0.06),
        2px 2px 8px rgba(0, 0, 0, 0.04),
        -2px -2px 8px rgba(0, 0, 0, 0.04);
}

/* ===== SLIDE ANIMATION (Vue transition) ===== */
.slideFiltros-enter-active,
.slideFiltros-leave-active {
    transition: all 0.28s cubic-bezier(.2, .8, .2, 1);
    overflow: hidden;
}

.slideFiltros-enter-from,
.slideFiltros-leave-to {
    max-height: 0;
    opacity: 0.45;
    padding: 0;
}

.slideFiltros-enter-to,
.slideFiltros-leave-from {
    max-height: 900px;
    opacity: 1;
}

/* ===== SECCIONES DE FILTROS (unificado) ===== */
#filtroTipos,
#filtroEtiquetas,
#filtroRarezas,
#filtroPrerrequisitos {
    margin-top: 10px;
}

#filtroTipos>div,
#filtroEtiquetas>div,
#filtroRarezas>div,
#filtroPrerrequisitos>div {
    margin: 10px 5px;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    width: fit-content;
}

/* ===== RESPONSIVE ===== */
@media screen and (max-width: 1170px) {

    #filtroTipos>div,
    #filtroRarezas>div {
        gap: 12px;
    }
}

@media screen and (max-width: 960px) {

    #filtroTipos>div,
    #filtroRarezas>div {
        gap: 10px;
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

    #filtroTipos>div,
    #filtroRarezas>div,
    #filtroEtiquetas>div,
    #filtroPrerrequisitos>div {
        grid-template-columns: repeat(2, auto) !important;
        gap: 8px;
        flex-wrap: wrap;
        width: 100%;
    }

    .slideFiltros-enter-to,
    .slideFiltros-leave-from {
        max-height: 1200px;
    }
}
</style>
