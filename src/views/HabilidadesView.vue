<template>
    <h1 class="titulo">Habilidades</h1>
    <main class="cuerpo">
        <div id="filtroTabla">
            <Filtros :datosCargados="datosCargados" :filtroTransformacion="filtroTransformacion"
                :filtroLegendaria="filtroLegendaria" @limpiarFiltros="limpiarFiltros"
                @actualizarFiltros="manejarFiltros" />

            <Tabla :datos="filtrados" :datosCargados="datosCargados" :seleccionado="seleccionado" :columnas="columnas"
                :clavesColumnas="clavesColumnas" @seleccionar="seleccionarRegla" @ordenar="ordenarPor" />
        </div>
        <Seleccionado :datosCargados="datosCargados" :habilidad="seleccionado" />
    </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import worker from '../sqlWorker.js';

import Tabla from "@/components/Habilidades/TablaView.vue"
import Seleccionado from "@/components/Habilidades/HabilidadesSeleccionado.vue"
import Filtros from "@/components/Habilidades/HabilidadesFiltrosView.vue"


const route = useRoute();
const router = useRouter();

// ======================== DATOS ========================

//Datos para la tabla
const columnas = ['Nombre', 'Descripción', 'Legen.', 'Transf.']
const clavesColumnas = ['nombre', 'descripcion', 'legendaria', 'transformacion']

//Datos principales
const datos = ref([]);
const datosCargados = ref(false);
const seleccionado = ref(route.query.seleccionado ?? undefined);

//Filtros
const filtroLegendaria = ref(route.query.legendaria ?? null);
const filtroTransformacion = ref(route.query.transformacion ?? null);
const filtroNombre = ref(route.query.nombre ?? null);

//Orden de tabla
const ordenColumna = ref(route.query.ordenColumna ?? "nombre");
const ordenAscendente = ref(route.query.ordenAscendente !== "false");

// =================== CARGAR DATOS AL ABRIR ==================
function cargarDatos() {
    worker.postMessage({
        type: 'query',
        query: 'SELECT * FROM Pokemexe_Habilidades',
        params: []
    });
}

onMounted(async () => {
    worker.postMessage({ type: 'init' });

    worker.onmessage = (e) => {
        if (e.data.type === 'ready') {
            cargarDatos();
        }
        if (e.data.type === 'result') {
            datos.value = (e.data.result?.[0]?.values || []).map((row) => {
                return {
                    id: row[0],
                    nombre: row[1],
                    descripcion: row[2],
                    EST: row[3],
                    coste: row[4],
                    legendaria: row[5] === "Legendaria" ? true : false,
                    transformacion: row[6] === "Transformación" ? true : false
                };
            });
            console.log(datos.value)

            if (datos.value.length > 0) {
                if (seleccionado.value) {
                    seleccionarRegla(
                        datos.value.find((dato) => dato.nombre === seleccionado.value)
                    );
                } else {
                    seleccionarRegla(filtrados.value[0]);
                }
                datosCargados.value = true;
            }
        }

        if (e.data.type === 'error') {
            console.error("Error en SQLite:", e.data.error);
        }
    };
});

// ===================== SELECCIONAR HABILIDADES PARA EL CUADRO ===================
function seleccionarRegla(objeto) {
    seleccionado.value = objeto;
}

// ========== FILTROS Y ORDENAMIENTOS EN RUTA. CAMBIAR

//Modifica filtros
function manejarFiltros({ clave, valor }) {
    switch (clave) {
        case 'nombre':
            filtroNombre.value = valor;
            break;
        case 'legendaria':
            filtroLegendaria.value = valor;
            break;
        case 'transformacion':
            filtroTransformacion.value = valor;
            break;
    }
}

// Limpia filtros
function limpiarFiltros() {
    filtroLegendaria.value = null;
    filtroTransformacion.value = null;
    filtroNombre.value = null;
    ordenColumna.value = "nombre";
    ordenAscendente.value = true;
}

//Cambia la ruta
watch(
    [
        seleccionado,
        filtroLegendaria,
        filtroTransformacion,
        filtroNombre,
        ordenColumna,
        ordenAscendente,
    ],
    () => {
        router.replace({ query: construirQuery() });
    },
    { deep: true }
);

//Aplica filtros desde la ruta
watch(
    () => route.query,
    (query) => {
        aplicarQuery(query);
    },
    { immediate: true }
);

function construirQuery() {
    return {
        legendaria: filtroLegendaria.value ?? undefined,
        transformacion: filtroTransformacion.value ?? undefined,
        nombre: filtroNombre.value ?? undefined,
        ordenColumna: ordenColumna.value ?? undefined,
        ordenAscendente: ordenColumna.value ? ordenAscendente.value : undefined,
        seleccionado: seleccionado.value?.nombre || undefined,
    };
}

function aplicarQuery(query) {
    filtroLegendaria.value = query.legendaria ?? null;
    filtroTransformacion.value = query.transformacion ?? null;
    filtroNombre.value = query.nombre ?? null;

    ordenColumna.value = query.ordenColumna ?? null;
    ordenAscendente.value = query.ordenAscendente !== "false";

    if (datosCargados.value)
        if (query.seleccionado) seleccionado.value = datos.value.find((o) => o.nombre === query.seleccionado);
        else seleccionado.value = filtrados.value[0];
}

// =============== CAMBIAR ORDENACIÓN ==================
function ordenarPor(columna) {
    if (ordenColumna.value === columna) {
        ordenAscendente.value = !ordenAscendente.value;
    } else {
        ordenColumna.value = columna;
        ordenAscendente.value = true;
    }
}

// ========================= APLICAR FILTROS A TABLA Y ORDENAR ===========================
const filtrados = computed(() => {
    let resultado = datos.value.filter((dato) => {
        const nombre = dato.nombre.toLowerCase();

        return (
            (!filtroLegendaria.value || ["Todas", null].includes(filtroLegendaria.value) || (filtroLegendaria.value === "Legendaria" && dato.legendaria) || (filtroLegendaria.value === "No Legendaria" && !dato.legendaria)) &&
            (!filtroTransformacion.value || ["Todas", null].includes(filtroTransformacion.value) || (filtroTransformacion.value === "Transformación" && dato.transformacion) || (filtroTransformacion.value === "No transformación" && !dato.transformacion)) &&
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


<style scoped>
.titulo {
    letter-spacing: 5px;
    font-family: "Staatliches", sans-serif;
    color: var(--color-texto);
    font-size: 50px;
    padding: 10px 0 0px 2%;
}

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

@media screen and (max-width: 890px) {
    .cuerpo {
        display: flex;
        flex-direction: column-reverse;
        margin: 0 auto;
        width: 95%;
        height: auto;
    }

    #filtroTabla {
        width: 100%;
        margin: 0 auto;
    }
}
</style>