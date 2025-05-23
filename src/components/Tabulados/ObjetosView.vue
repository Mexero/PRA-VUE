<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const allowedValues = [
    0, 100, 200, 250, 300, 400, 500, 600, 800, 1000, 1200, 1400, 1500, 2000, 2500,
    3000, 4000, 5000, 6000, 8000, 10000, 15000, 20000, 25000, 50000, 100000
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
    filtroPrecioMin.value = indexToValue(minIndex.value);
    filtroPrecioMax.value = indexToValue(maxIndex.value);
}

function onNumberInput() {
    let minVal = closestAllowed(Number(filtroPrecioMin.value));
    let maxVal = closestAllowed(Number(filtroPrecioMax.value));
    let minIdx = valueToIndex(minVal);
    let maxIdx = valueToIndex(maxVal);

    if (minIdx > maxIdx) {
        const temp = minIdx;
        minIdx = maxIdx;
        maxIdx = temp;
    }
    minIndex.value = minIdx;
    maxIndex.value = maxIdx;
    filtroPrecioMin.value = minVal;
    filtroPrecioMax.value = maxVal;
}

// Inicializar valores al montar
onMounted(() => {
    if (filtroPrecioMin.value !== null)
        minIndex.value = valueToIndex(closestAllowed(filtroPrecioMin.value));
    if (filtroPrecioMax.value !== null)
        maxIndex.value = valueToIndex(closestAllowed(filtroPrecioMax.value));
});

// ======================== DATOS ========================

//Datos principales
const objetos = ref([]);
const objetoSeleccionado = ref(
    route.query.seleccionado ? route.query.seleccionado : null
);
const mostrarFiltros = ref(false);

//Filtros
const filtroTipos = ref(route.query.tipos ? route.query.tipos.split(",") : []);
const filtroRarezas = ref(
    route.query.rareza ? route.query.rareza.split(",") : []
);
const filtroPrecioMin = ref(
    route.query.precioMin ? Number(route.query.precioMin) : null
);
filtroPrecioMin.value = isNaN(filtroPrecioMin.value)
    ? null
    : filtroPrecioMin.value;
const filtroPrecioMax = ref(
    route.query.precioMax ? Number(route.query.precioMax) : null
);
filtroPrecioMax.value = isNaN(filtroPrecioMax.value)
    ? null
    : filtroPrecioMax.value;
const filtroNombre = ref(route.query.nombre || "");

//Orden de tabla
const ordenColumna = ref(route.query.ordenColumna || "");
const ordenAscendente = ref(route.query.ordenAscendente !== "false");

// =================== CARGAR DATOS AL ABRIR ==================

onMounted(async () => {
    try {
        const res = await fetch("/data/json/objetos/objetos.json");

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        objetos.value = await res.json();

        if (objetos.value.length > 0) {
            if (objetoSeleccionado.value) {
                seleccionarObjeto(
                    objetos.value.find((obj) => obj.Nombre === objetoSeleccionado.value)
                );
            } else {
                seleccionarObjeto(objetos.value[0]);
            }
        } else {
            console.warn("El archivo JSON está vacío.");
        }
    } catch (error) {
        console.error("Error al cargar los objetos:", error);
    }
});

// ===================== SELECCIONAR OBJETOS PARA EL CUADRO ===================
function seleccionarObjeto(objeto) {
    objetoSeleccionado.value = objeto;
}

// ======================== LIMPIAR FILTROS ============================
function limpiarFiltros() {
    filtroTipos.value = [];
    filtroRarezas.value = [];
    filtroPrecioMin.value = null;
    filtroPrecioMax.value = null;
    filtroNombre.value = "";
    ordenColumna.value = "";
    ordenAscendente.value = true;
}

// ================ CREA LOS FILTROS DE RAREZA Y TIPOS MIRANDO LOS DE LA TABLA DIRECTAMENTE ===================
const tiposUnicos = computed(() => [
    ...new Set(objetos.value.map((o) => o.Tipo).filter(Boolean)),
]);
const rarezasUnicas = computed(() => [
    ...new Set(objetos.value.map((o) => o.Rareza).filter(Boolean)),
]);

// ========================= PONER FILTROS EN LA URL ===========================
watch(
    [
        objetoSeleccionado,
        filtroTipos,
        filtroRarezas,
        filtroPrecioMin,
        filtroPrecioMax,
        filtroNombre,
        ordenColumna,
        ordenAscendente,
    ],
    () => {
        const query = {
            tipos: filtroTipos.value.length ? filtroTipos.value.join(",") : undefined,
            rareza: filtroRarezas.value.length
                ? filtroRarezas.value.join(",")
                : undefined,
            precioMin:
                filtroPrecioMin.value !== null ? filtroPrecioMin.value : undefined,
            precioMax:
                filtroPrecioMax.value !== null ? filtroPrecioMax.value : undefined,
            nombre: filtroNombre.value || undefined,
            ordenColumna: ordenColumna.value || undefined,
            ordenAscendente: ordenColumna.value ? ordenAscendente.value : undefined,
            seleccionado: objetoSeleccionado.value.Nombre
                ? objetoSeleccionado.value.Nombre
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
const objetosFiltrados = computed(() => {
    let resultado = objetos.value.filter((obj) => {
        const coste = obj.Coste ?? null;
        const nombre = obj.Nombre.toLowerCase();

        //Expresión lógica infernal
        return (
            (!filtroTipos.value.length || filtroTipos.value.includes(obj.Tipo)) &&
            (!filtroRarezas.value.length ||
                filtroRarezas.value.includes(obj.Rareza)) &&
            (filtroPrecioMin.value === null || coste >= filtroPrecioMin.value) &&
            (filtroPrecioMax.value === null || coste <= filtroPrecioMax.value) &&
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
        <h1 class="titulo">Objetos</h1>

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
                            <h3>Coste</h3>
                            <div id="filtroCostes">
                                <input type="number" v-model.number="filtroPrecioMin" @input="onNumberInput"
                                    :min="allowedValues[0]" :max="allowedValues[allowedValues.length - 1]"
                                    placeholder="$ min" class="input-min" />

                                <div class="slider">
                                    <div class="price-slider" :style="sliderStyle"></div>
                                    <div class="range-input">
                                        <input type="range" :min="0" :max="allowedValues.length - 1"
                                            v-model.number="minIndex" @input="onSliderInput" />
                                        <input type="range" :min="0" :max="allowedValues.length - 1"
                                            v-model.number="maxIndex" @input="onSliderInput" />
                                    </div>
                                </div>
                                <input type="number" v-model.number="filtroPrecioMax" @input="onNumberInput"
                                    :min="allowedValues[0]" :max="allowedValues[allowedValues.length - 1]"
                                    placeholder="$ max" class="input-max" />
                            </div>

                            <h3>Rarezas</h3>
                            <div id="filtroRarezas">
                                <div>
                                    <label v-for="rareza in rarezasUnicas" :key="rareza">
                                        <input type="checkbox" :value="rareza" v-model="filtroRarezas" />
                                        {{ rareza }}
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
                            <th @click="ordenarPor('Rareza')">
                                Rareza
                                <img src="../../assets/icons/filtroFelcha.svg" alt="icono filtro" />
                            </th>
                            <th @click="ordenarPor('Coste')">
                                Coste
                                <img src="../../assets/icons/filtroFelcha.svg" alt="icono filtro" />
                            </th>
                        </tr>
                    </thead>
                    <tbody v-if="objetosFiltrados.length !== 0">
                        <tr v-for="(objeto, index) in objetosFiltrados" :key="index" @click="seleccionarObjeto(objeto)"
                            :class="{
                                activo:
                                    objetoSeleccionado &&
                                    objetoSeleccionado.Nombre === objeto.Nombre,
                            }">
                            <td>{{ objeto.Nombre }}</td>
                            <td>{{ objeto.Tipo }}</td>
                            <td>{{ objeto.Rareza }}</td>
                            <td>{{ objeto.Coste ?? "—" }}$</td>
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
        <div v-if="objetoSeleccionado" class="seleccionado">
            <h2>{{ objetoSeleccionado.Nombre }}</h2>
            <p><strong>Tipo:</strong> {{ objetoSeleccionado.Tipo }}</p>
            <p><strong>Rareza:</strong> {{ objetoSeleccionado.Rareza }}</p>
            <p><strong>Coste:</strong> {{ objetoSeleccionado.Coste ?? "—" }}$</p>
            <p>
                <strong>Valor material:</strong>
                {{ objetoSeleccionado.ValorMaterial ?? "—" }}$
            </p>
            <p><strong>Descripción:</strong> {{ objetoSeleccionado.Descripcion }}</p>
        </div>
    </main>
</template>

<style scoped>
/* 
Todo:
- Filtro se cierra solo en movil
*/

.titulo{
    letter-spacing: 5px;
    font-family: "Staatliches", sans-serif;
    color:var(--color-texto);
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
    display: grid;
    grid-template-columns: repeat(4, auto);
    gap: 5px;
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

/*ontenedor de los botones*/
.botones {
    display: flex;
    gap: 5px;
}

.filtros button:hover {
    background-color: var(--color-secundario);
}

#filtroCostes {
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
    -webkit-appearance: none;
    appearance: none;
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
}

/* ================== La Tabla de objetos ===================== */
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
    min-width: 120px;
    padding: 10px 5px;
}

.tabla th:nth-child(1),
.tabla th:nth-child(2) {
    width: 30%;
}

.tabla th:nth-child(3),
.tabla th:nth-child(4) {
    width: 25%;
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
    #filtroRarezas div {
        grid-template-columns: repeat(2, auto) !important;
        gap: 8px;
        flex-wrap: wrap;
    }

    #filtroCostes {
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