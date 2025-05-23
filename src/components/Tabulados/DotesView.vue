<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const allowedValues = [
    0, 6, 9, 11, 12, 18
];

const minIndex = ref(0);
const maxIndex = ref(allowedValues.length - 1);

const sliderStyle = computed(() => {
    const total = allowedValues.length - 1;
    return {
        left: `${(minIndex.value / total) * 100}%`,
        right: `${100 - (maxIndex.value / total) * 100}%`,
    };
});

function closestAllowed(val) {
    return allowedValues.reduce((prev, curr) =>
        Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
    );
}

function valueToIndex(val) {
    return allowedValues.findIndex((v) => v === val);
}

function indexToValue(index) {
    return allowedValues[index];
}

// Sincronizar inputs numéricos con sliders
function onSliderInput() {
    if (minIndex.value > maxIndex.value) {
        const temp = minIndex.value;
        minIndex.value = maxIndex.value;
        maxIndex.value = temp;
    }
    filtroNivelMin.value = indexToValue(minIndex.value);
    filtroNivelMax.value = indexToValue(maxIndex.value);
}

function onNumberInput() {
    let minVal = closestAllowed(Number(filtroNivelMin.value));
    let maxVal = closestAllowed(Number(filtroNivelMax.value));
    let minIdx = valueToIndex(minVal);
    let maxIdx = valueToIndex(maxVal);

    if (minIdx > maxIdx) {
        const temp = minIdx;
        minIdx = maxIdx;
        maxIdx = temp;
    }
    minIndex.value = minIdx;
    maxIndex.value = maxIdx;
    filtroNivelMin.value = minVal;
    filtroNivelMax.value = maxVal;
}

// Inicializar valores al montar
onMounted(() => {
    if (filtroNivelMin.value !== null)
        minIndex.value = valueToIndex(closestAllowed(filtroNivelMin.value));
    if (filtroNivelMax.value !== null)
        maxIndex.value = valueToIndex(closestAllowed(filtroNivelMax.value));
});

// ======================== DATOS ========================

//Datos principales
const dotes = ref([]);


// Tipos únicos para el filtro de tipos
const tiposUnicos = computed(() => {
    const set = new Set();
    dotes.value.forEach(dot => {
        if (dot.Tipo) set.add(dot.Tipo);
    });
    return Array.from(set).sort();
});


const doteSeleccionado = ref(
    route.query.seleccionado ? route.query.seleccionado : null
);
const mostrarFiltros = ref(false);

//Filtros
const filtroTipos = ref(route.query.tipos ? route.query.tipos.split(",") : []);
const filtroPrerrequisitos = ref(route.query.prerrequisitos ? route.query.prerrequisitos : null);
const filtroNivelMin = ref(
    route.query.nivelMin ? Number(route.query.nivelMin) : null
);
filtroNivelMin.value = isNaN(filtroNivelMin.value)
    ? null
    : filtroNivelMin.value;
const filtroNivelMax = ref(
    route.query.nivelMax ? Number(route.query.nivelMax) : null
);
filtroNivelMax.value = isNaN(filtroNivelMax.value)
    ? null
    : filtroNivelMax.value;
const filtroNombre = ref(route.query.nombre || "");

//Orden de tabla
const ordenColumna = ref(route.query.ordenColumna || "");
const ordenAscendente = ref(route.query.ordenAscendente !== "false");

// =================== CARGAR DATOS AL ABRIR ==================

onMounted(async () => {
    try {
        const res = await fetch("/data/json/dotes/dotes.json");

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        dotes.value = await res.json();

        if (dotes.value.length > 0) {
            if (doteSeleccionado.value) {
                seleccionarDote(
                    dotes.value.find((dot) => dot.Nombre === doteSeleccionado.value)
                );
            } else {
                seleccionarDote(dotes.value[0]);
            }
        } else {
            console.warn("El archivo JSON está vacío.");
        }
    } catch (error) {
        console.error("Error al cargar los dotes:", error);
    }
});

// ===================== SELECCIONAR OBJETOS PARA EL CUADRO ===================
function seleccionarDote(dote) {
    doteSeleccionado.value = dote;
}

// ======================== LIMPIAR FILTROS ============================
function limpiarFiltros() {
    filtroTipos.value = [];
    filtroPrerrequisitos.value = null;
    filtroNivelMin.value = null;
    filtroNivelMax.value = null;
    filtroNombre.value = "";
    ordenColumna.value = "";
    ordenAscendente.value = true;
}


// ========================= PONER FILTROS EN LA URL ===========================
watch(
    [
        doteSeleccionado,
        filtroTipos,
        filtroPrerrequisitos,
        filtroNivelMin,
        filtroNivelMax,
        filtroNombre,
        ordenColumna,
        ordenAscendente,
    ],
    () => {
        const query = {
            tipos: filtroTipos.value.length ? filtroTipos.value.join(",") : undefined,
            prerrequisitos: filtroPrerrequisitos.value ?
                filtroPrerrequisitos.value
                : undefined,
            nivelMin:
                filtroNivelMin.value !== null ? filtroNivelMin.value : undefined,
            nivelMax:
                filtroNivelMax.value !== null ? filtroNivelMax.value : undefined,
            nombre: filtroNombre.value || undefined,
            ordenColumna: ordenColumna.value || undefined,
            ordenAscendente: ordenColumna.value ? ordenAscendente.value : undefined,
            seleccionado: doteSeleccionado.value.Nombre
                ? doteSeleccionado.value.Nombre
                : undefined,
        };
        router.replace({ query });
    },
    { deep: true }
);

// =============== LÓGICA DE CAMBIAR ORDENAMIENTO ==================
function ordenarPor(columna) {
    if (ordenColumna.value === columna) {
        ordenAscendente.value = !ordenAscendente.value;
    } else {
        ordenColumna.value = columna;
        ordenAscendente.value = true;
    }
}

// ========================= APLICAR FILTROS A TABLA Y ORDENAR ===========================
const dotesFiltrados = computed(() => {
    let resultado = dotes.value.filter((dot) => {
        const nivel = dot.Nivel ?? null;
        const nombre = dot.Nombre.toLowerCase();

        // Filtro de prerrequisitos por radio
        let pasaFiltroPrerrequisitos = true;
        if (filtroPrerrequisitos.value === "Si") {
            pasaFiltroPrerrequisitos = !!dot.Prerrequisitos && dot.Prerrequisitos.trim() !== "";
        } else if (filtroPrerrequisitos.value === "No") {
            pasaFiltroPrerrequisitos = !dot.Prerrequisitos || dot.Prerrequisitos.trim() === "";
        }
        // "Todos" deja pasaFiltroPrerrequisitos en true

        return (
            (!filtroTipos.value.length || filtroTipos.value.includes(dot.Tipo)) &&
            pasaFiltroPrerrequisitos &&
            (filtroNivelMin.value === null || nivel >= filtroNivelMin.value) &&
            (filtroNivelMax.value === null || nivel <= filtroNivelMax.value) &&
            (!filtroNombre.value || nombre.includes(filtroNombre.value.toLowerCase()))
        );
    });

    //ordenar
    if (ordenColumna.value) {
        resultado.sort((a, b) => {
            const aVal = a[ordenColumna.value];
            const bVal = b[ordenColumna.value];

            if (aVal === undefined || aVal === null) return 1;
            if (bVal === undefined || bVal === null) return -1;

            if (typeof aVal === "number" && typeof bVal === "number") {
                return ordenAscendente.value ? aVal - bVal : bVal - aVal;
            }

            return ordenAscendente.value
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }

    return resultado;
});


</script>

<template>
    <h1 class="titulo">Dotes</h1>
    <main class="cuerpo">
        <div id="filtroTabla">
            <!--FILTROS-->
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
                            <input v-model="filtroNombre" type="text" placeholder="Buscar por nombre" />

                            <button @click="limpiarFiltros">Limpiar filtros</button>
                            <h3>Nivel</h3>
                            <div id="filtroNiveles">
                                <input type="number" v-model.number="filtroNivelMin" @input="onNumberInput"
                                    :min="allowedValues[0]" :max="allowedValues[allowedValues.length - 1]"
                                    placeholder="Lv. min" class="input-min" />

                                <div class="slider">
                                    <div class="price-slider" :style="sliderStyle"></div>
                                    <div class="range-input">
                                        <input type="range" :min="0" :max="allowedValues.length - 1"
                                            v-model.number="minIndex" @input="onSliderInput" />
                                        <input type="range" :min="0" :max="allowedValues.length - 1"
                                            v-model.number="maxIndex" @input="onSliderInput" />
                                    </div>
                                </div>
                                <input type="number" v-model.number="filtroNivelMax" @input="onNumberInput"
                                    :min="allowedValues[0]" :max="allowedValues[allowedValues.length - 1]"
                                    placeholder="Lv. max" class="input-max" />
                            </div>

                            <h3>Prerrequisitos</h3>
                            <div id="filtroPrerrequisitos">
                                <div>
                                    <label>
                                        <input type="radio" name="tienePrerrequisitos" value="Si"
                                            v-model="filtroPrerrequisitos" />
                                        Si
                                    </label>
                                    <label>
                                        <input type="radio" name="tienePrerrequisitos" value="No"
                                            v-model="filtroPrerrequisitos" />
                                        No
                                    </label>
                                    <label>
                                        <input type="radio" name="tienePrerrequisitos" value="Todos"
                                            v-model="filtroPrerrequisitos" />
                                        Todos
                                    </label>
                                </div>
                            </div>


                            <div id="filtroTipos">
                                <h3>Tipos</h3>
                                <div>
                                    <label v-for="tipo in tiposUnicos" :key="tipo">
                                        <input type="checkbox" :value="tipo" v-model="filtroTipos" />
                                        {{ tipo }}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!--TABLA-->
            <div class="div-tabla">
                <table class="tabla">
                    <thead>
                        <tr>
                            <th @click="ordenarPor('Nombre')">
                                Nombre
                                <img src="../../assets/icons/filtroFelcha.svg" alt="icono filtro" />
                            </th>
                            <th @click="ordenarPor('Tipo')">
                                Tipo
                                <img src="../../assets/icons/filtroFelcha.svg" alt="icono filtro" />
                            </th>
                            <th @click="ordenarPor('Prerrequisitos')">
                                Prerrequisitos
                                <img src="../../assets/icons/filtroFelcha.svg" alt="icono filtro" />
                            </th>
                            <th @click="ordenarPor('Nivel')">
                                Nivel
                                <img src="../../assets/icons/filtroFelcha.svg" alt="icono filtro" />
                            </th>
                        </tr>
                    </thead>
                    <tbody v-if="dotesFiltrados.length !== 0">
                        <tr v-for="(dote, index) in dotesFiltrados" :key="index" @click="seleccionarDote(dote)" :class="{
                            activo:
                                doteSeleccionado &&
                                doteSeleccionado.Nombre === dote.Nombre,
                        }">
                            <td>{{ dote.Nombre }}</td>
                            <td>{{ dote.Tipo }}</td>
                            <td>{{ dote.Prerrequisitos ?? "—" }}</td>
                            <td>{{ dote.Nivel ?? "—" }}</td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="4" class="textoCentrado">
                                <div>
                                    Resultados no encontrados con los filtros actuales :&lpar;
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!--SELECCIONADO-->
        <div v-if="doteSeleccionado" class="seleccionado">
            <h2>{{ doteSeleccionado.Nombre }}</h2>
            <p><strong>Tipo:</strong> {{ doteSeleccionado.Tipo }} </p>
            <p><strong>Prerrequisitos:</strong> {{ doteSeleccionado.Prerrequisitos ?? "—" }}</p>
            <p><strong>Nivel:</strong> {{ doteSeleccionado.Nivel ?? "—" }}</p>
            <p><strong>Descripción:</strong>

                <u v-if="doteSeleccionado.Repetible">
                    <p><strong>Repetible</strong></p>
                </u>

                {{ doteSeleccionado.Descripcion }}
            </p>
        </div>
    </main>
</template>

<style scoped>
.titulo {
    letter-spacing: 5px;
    font-family: "Staatliches", sans-serif;
    color: var(--color-texto);
    font-size: 50px;
    padding: 10px 0 0px 2%;
}

.paddingBloque {
    padding: 15px;
}

/* === "Main" contiene todo === */
.cuerpo {
    display: flex;
    justify-content: space-between;
    margin: 30px auto;
    width: 95%;
    min-height: 75vh;
    letter-spacing: 0.5px;
}

#filtroTabla {
    display: flex;
    flex-direction: column;
    width: 60%;
    margin-right: 30px;
}

/* === Filtro de la tabla === */
.filtros {
    width: 100%;
    display: flex;
    flex-direction: column;
}

#filtroTipos div {
    margin: 10px 5px;
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
}

h3 {
    margin-top: 5px;
}

input[type="text"] {
    padding: 7px;
    border-radius: 5px;
    font-size: 17px;
    outline: none;
    margin-right: 20px;
}

input[type="text"]:focus,
input[type="number"]:focus {
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

/*ontenedor de los botones*/
.botones {
    display: flex;
    gap: 5px;
}

.filtros button:hover {
    background-color: var(--color-secundario);
}

#filtroNiveles {
    display: flex;
    gap: 20px;
    flex-direction: row;
    width: 100%;
}

input[type="number"] {
    width: 83px;
    padding: 3px 0;
    border-radius: 5px;
    font-size: 17px;
    outline: none;
    text-align: center;
}

.slider {
    align-self: center;
    height: 8px;
    position: relative;
    background: #e4e4e4;
    border-radius: 5px;
    width: 100%;
}

.slider .price-slider {
    height: 100%;
    left: 0;
    right: 0;
    position: absolute;
    border-radius: 5px;
    background: var(--color-principal1);
}

/* Remove Arrows/Spinners */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.range-input input {
    position: absolute;
    width: 100%;
    height: 5px;
    background: none;
    pointer-events: none;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;

}

/* Styles for the range thumb in WebKit browsers */
input[type="range"]::-webkit-slider-thumb {
    height: 20px;
    width: 20px;
    margin-top: 3px;
    border-radius: 50%;
    background: #555;
    pointer-events: auto;
    -moz-appearance: none;
    appearance: none;

    -webkit-appearance: none;
}

/* Firefox slider thumb */
.range-input input[type="range"]::-moz-range-thumb {
    height: 20px;
    width: 20px;
    transform: translateY(2px);
    border: none;
    border-radius: 50%;
    background: #555;
    pointer-events: auto;
}

/* Optional: Remove default Firefox styles */
.range-input input[type="range"]::-moz-range-track {
    background: transparent;
}

#mostrarFiltros {
    color: var(--color-texto);
    background-color: var(--color-fondoTexto);
    width: 100%;
    font-size: 15px;
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

/* ===================== Mostrar la Info de la tabla ===================== */
.seleccionado {
    margin-top: 40px;
    width: 40%;
    height: fit-content;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    white-space: pre-line;
}

/* ================== La Tabla de dotes ===================== */
thead {
    background-color: var(--color-tituloTabla);
    position: sticky;
    top: 0;
    cursor: pointer;
    z-index: 1;
    font-size: 18px;
}

.div-tabla {
    height: 70vh;
    width: 100%;
    overflow-y: auto;
}

.tabla {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    color: var(--color-texto);
}

.tabla th,
.tabla td {
    font-size: 18px;
    padding: 6px 0px 6px 10px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;

}

.tabla th {
    min-width: 100px;
    padding: 10px 5px;
}


.tabla th:nth-child(1) {
    width: 20%;

}

.tabla th:nth-child(2),
.tabla td:nth-child(2) {
    width: 15%;
    text-align: center;

}

.tabla th:nth-child(3) {
    width: 40%;
    text-align: center;
}

.tabla td:nth-child(3) {
    text-align: center;


}

.tabla th:nth-child(4),
.tabla td:nth-child(4) {
    width: 15%;
    text-align: center;
}

th img {
    transform: translateY(2px);
    width: 15px;
}

.textoCentrado div {
    text-align: center;
    font-size: 30px;
}

.tabla tbody tr:nth-child(even) {
    background-color: var(--color-tabla1);
}

.tabla tbody tr:nth-child(odd) {
    background-color: var(--color-tabla2);
}

.tabla tr.activo {
    background-color: #8f6da0fd !important;
    font-weight: bold;
}

.tabla tbody tr:hover {
    background-color: #a193a8fd;
    cursor: pointer;
}

@media screen and (max-width: 890px) {
    .cuerpo {
        display: flex;
        flex-direction: column-reverse;
        margin: 0 auto;
        width: 95%;
        height: auto;
    }

    .seleccionado {
        font-size: 15px;
        padding: 10px;
        margin: 30px 0 20px 0;
        width: 100%;
        box-sizing: border-box;
    }

    #filtroTabla {
        width: 100%;
        margin: 0 auto;
    }

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

    #filtroNiveles {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        grid-template-areas:
            "min max"
            "slider slider";
        align-items: center;
        gap: 0 10px;
        margin-bottom: 10px;
    }

    .input-min {
        grid-area: min;
        justify-self: start;
        width: 80px;
    }

    .input-max {
        grid-area: max;
        justify-self: end;
        width: 80px;
    }

    .slider {
        grid-area: slider;
        width: 100%;
        margin-top: 10px;
    }

    .div-tabla {
        height: 60vh;
        margin: 0 auto;
        margin-bottom: 80px;
        overflow-x: auto;
    }

    .tabla th {
        min-width: 20px;
        width: 30%;
    }

    .tabla th,
    .tabla td {
        font-size: 13px;
        padding: 5px 0px 5px 8px;
    }

    .tabla th {
        min-width: 90px;
        padding: 8px;
    }

    .textoCentrado div {
        font-size: 20px;
    }

    .slideFiltros-enter-to,
    .slideFiltros-leave-from {
        max-height: 600px;
    }
}
</style>