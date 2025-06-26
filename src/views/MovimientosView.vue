<template>
    <h1 class="titulo">Movimientos</h1>
    <main class="cuerpo">
        <div id="filtroTabla">
            <Filtros :datosCargados="datosCargados" :filtroTransformacion="filtroTransformacion"
                :filtroLegendaria="filtroLegendaria" @limpiarFiltros="limpiarFiltros"
                @actualizarFiltros="manejarFiltros" />

            <Tabla :datos="filtrados" :datosCargados="datosCargados" :seleccionado="seleccionado" :columnas="columnas"
                :clavesColumnas="clavesColumnas" @seleccionar="seleccionarMovimiento" @ordenar="ordenarPor" />
        </div>
        <Seleccionado :datosCargados="datosCargados" :movimiento="seleccionado" />
    </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import worker from '../sqlWorker.js';

import Tabla from "@/components/Movimientos/TablaMovimientosView.vue"
import Seleccionado from "@/components/Movimientos/MovimientoSeleccionado.vue"
import Filtros from "@/components/Movimientos/MovimientoFiltrosView.vue"


const route = useRoute();
const router = useRouter();

// ======================== DATOS ========================

//Datos para la tabla
const columnas = ['Nombre', 'Tipo', 'Acción', 'Coste', 'Daño', 'Rango', 'Etiquetas']
const clavesColumnas = ['nombre', 'tipo', 'accion', 'coste', 'danno', 'rango', 'etiquetas']

//Datos principales
const datos = ref([]);
const datosCargados = ref(false);
const seleccionadoNombre = ref(route.query.seleccionado ?? undefined);
const seleccionado = ref(seleccionarMovimiento(seleccionadoNombre.value ?? undefined));

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
        query: 'SELECT Nombre, Tipo, Tiempo_de_uso, Coste, Dano, Rango, Etiquetas FROM pokemexe_movimientos',
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
                    nombre: row[0],
                    tipo: row[1],
                    accion: row[2],
                    coste: row[3],
                    danno: row[4],
                    rango: row[5],
                    etiquetas: row[6]
                };
            });

            if (datos.value.length > 0) {
                if (seleccionadoNombre.value) {
                    seleccionarMovimiento(
                        datos.value.find((dato) => dato.nombre === seleccionadoNombre.value)
                    );
                } else {
                    seleccionarMovimiento(filtrados.value[0]);
                }
                datosCargados.value = true;
            }
        }

        if (e.data.type === 'error') {
            console.error("Error en SQLite:", e.data.error);
        }
    };
});

// ===================== SELECCIONAR Movimientos PARA EL CUADRO ===================
function seleccionarMovimiento(movimiento) {
    if (!movimiento?.nombre) return;

    worker.postMessage({
        type: 'query',
        query: `
            SELECT 
                Nombre, Tipo, Tiempo_de_uso, Coste, Dano, Rango, Etiquetas, Descripcion, Stat_Asociado_1, Stat_Asociado_2, Stat_Asociado_3, Stat_Asociado_4
            FROM pokemexe_movimientos
            WHERE Nombre = ?
        `,
        params: [movimiento.nombre]
    });

    worker.onmessage = (e) => {
        if (e.data.type === 'result') {
            const row = e.data.result?.[0]?.values?.[0];
            if (row) {
                seleccionado.value = {
                    nombre: row[0],
                    tipo: row[1],
                    accion: row[2],
                    coste: row[3],
                    danno: row[4] !== "" ? row[4] : null,
                    rango: row[5] !== "" ? row[5] : null,
                    etiquetas: row[6] !== "" ? row[6] : null,
                    descripcion: row[7].split('\n'),
                    statsAso: [row[8], row[9], row[10], row[11]].filter(stat => stat !== "")
                };
            }
        }

        if (e.data.type === 'error') {
            console.error("Error al seleccionar movimiento:", e.data.error);
        }
    };
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
        seleccionadoNombre,
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
        seleccionado: seleccionadoNombre.value?.nombre || undefined,
    };
}

function aplicarQuery(query) {
    filtroLegendaria.value = query.legendaria ?? null;
    filtroTransformacion.value = query.transformacion ?? null;
    filtroNombre.value = query.nombre ?? null;

    ordenColumna.value = query.ordenColumna ?? null;
    ordenAscendente.value = query.ordenAscendente !== "false";

    if (datosCargados.value)
        if (query.seleccionado) seleccionadoNombre.value = datos.value.find((o) => o.nombre === query.seleccionado);
        else seleccionadoNombre.value = filtrados.value[0].nombre;
    console.log(seleccionadoNombre)
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