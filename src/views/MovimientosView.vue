<template>
    <h1 class="titulo">Movimientos</h1>
    <main class="cuerpo">
        <div id="filtroTabla">
            <Filtros :datosCargados="datosCargados" :filtroTipos="filtroTipos" :filtroEtiquetas="filtroEtiquetas"
                :filtroAccion="filtroAccion" :filtroNombre="filtroNombre" :tipos="tipos" :etiquetas="etiquetas"
                :filtroPPMin="filtroPPMin" :filtroPPMax="filtroPPMax" @limpiarFiltros="limpiarFiltros"
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

const tipos = ["Acero", "Agua", "Bicho", "Dragón", "Eléctrico", "Fantasma", "Fuego", "Hada", "Hielo", "Lucha", "Normal", "Planta", "Psíquico", "Roca", "Siniestro", "Tierra", "Veneno", "Volador"];
const etiquetas = ["Escudo", "Por Tierra", "Potenciación", "Sonido", "Restauración", "Terreno", "Polvo", "Puño", "Mordisco", "Patada", "Explosión", "Retroceso", "Bala", "Campo", "Clima", "Danza", "Golpea varias veces", "Golpea 2 veces", "Golpea 3 veces"]

//Datos principales
const datos = ref([]);
const datosCargados = ref(false);
const seleccionadoNombre = ref(route.query.seleccionado ?? undefined);
const seleccionado = ref(seleccionarMovimiento(seleccionadoNombre.value ?? undefined));

//Filtros
const filtroTipos = ref(route.query.tipos ? route.query.tipos.split(",") : []);
const filtroEtiquetas = ref(route.query.etiquetas ? route.query.etiquetas.split(",") : []);
const filtroAccion = ref(route.query.accion ?? null);
const filtroPPMin = ref(route.query.PPMin ? Number(route.query.PPMin) : null);
const filtroPPMax = ref(route.query.PPMax ? Number(route.query.PPMax) : null);
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
                datosCargados.value = true;
                if (seleccionadoNombre.value) {
                    const movimientoEncontrado = datos.value.find((dato) => dato.nombre === seleccionadoNombre.value);
                    if (movimientoEncontrado) seleccionarMovimiento(movimientoEncontrado.nombre);
                    else {
                        seleccionadoNombre.value = datos.value[0].nombre;
                        seleccionarMovimiento(seleccionadoNombre.value);
                    }
                } else {
                    seleccionadoNombre.value = datos.value[0].nombre;
                    seleccionarMovimiento(seleccionadoNombre.value);
                }
            }
        }

        if (e.data.type === 'error') {
            console.error("Error en SQLite:", e.data.error);
        }
    };
});

// ===================== SELECCIONAR Movimientos PARA EL CUADRO ===================
function seleccionarMovimiento(movimiento) {
    if (!movimiento) return;
    if (!datosCargados.value) return;

    worker.postMessage({
        type: 'query',
        query: `
            SELECT 
                Nombre, Tipo, Tiempo_de_uso, Coste, Dano, Rango, Etiquetas, Descripcion, Stat_Asociado_1, Stat_Asociado_2, Stat_Asociado_3, Stat_Asociado_4
            FROM pokemexe_movimientos
            WHERE Nombre = ?
        `,
        params: [movimiento]
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
                seleccionadoNombre.value = seleccionado.value.nombre;
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
        case 'tipos':
            filtroTipos.value = valor;
            break;
        case 'etiquetas':
            filtroEtiquetas.value = valor;
            break;
        case 'accion':
            filtroAccion.value = valor;
            break;
        case 'PPMin':
            filtroPPMin.value = valor;
            break;
        case 'PPMax':
            filtroPPMax.value = valor;
            break;
    }
}

// Limpia filtros
function limpiarFiltros() {
    filtroNombre.value = null;
    filtroTipos.value = [];
    filtroEtiquetas.value = [];
    filtroAccion.value = null;
    filtroPPMin.value = null;
    filtroPPMax.value = null;
}

//Cambia la ruta
watch(
    [
        seleccionadoNombre,
        filtroTipos,
        filtroEtiquetas,
        filtroAccion,
        filtroPPMin,
        filtroPPMax,
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
        tipos: filtroTipos.value.length ? filtroTipos.value.join(",") : undefined,
        etiquetas: filtroEtiquetas.value.length ? filtroEtiquetas.value.join(",") : undefined,
        accion: filtroAccion.value ?? undefined,
        nombre: filtroNombre.value ?? undefined,
        PPMin: filtroPPMin.value ?? undefined,
        PPMax: filtroPPMax.value ?? undefined,
        ordenColumna: ordenColumna.value ?? undefined,
        ordenAscendente: ordenColumna.value ? ordenAscendente.value : undefined,
        seleccionado: seleccionadoNombre.value ?? undefined,
    };
}

function aplicarQuery(query) {
    filtroTipos.value = query.tipos?.split(",") ?? [];
    filtroEtiquetas.value = query.etiquetas?.split(",") ?? [];
    filtroAccion.value = query.accion ?? null;
    filtroPPMin.value = query.PPMin ? Number(query.PPMin) : null;
    filtroPPMax.value = query.PPMax ? Number(query.PPMax) : null;
    filtroNombre.value = query.nombre ?? null;

    ordenColumna.value = query.ordenColumna ?? null;
    ordenAscendente.value = query.ordenAscendente !== "false";

    if (datosCargados.value) {
        if (query.seleccionado) seleccionadoNombre.value = datos.value.find((o) => o.nombre === query.seleccionado).nombre;
        else if (filtrados.value.length) filtrados.value[0].nombre;
        else seleccionadoNombre.value = datos.value[0].nombre;
    }
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
function parsePP(coste) {
    if (!coste) return null;
    if (typeof coste === 'string' && coste.toLowerCase().includes('variable')) {
        return 'Variable';
    }
    if (typeof coste === 'string' && coste.toLowerCase().includes('a voluntad')) {
        return 'A voluntad';
    }
    const match = coste.match(/\d+/);
    return match ? parseInt(match[0]) : null;
}

const filtrados = computed(() => {
    let resultado = datos.value.filter((dato) => {
        const nombre = dato.nombre.toLowerCase();
        const coste = parsePP(dato.coste);

        return (
            (!filtroTipos.value.length || filtroTipos.value.some(tipo => dato.tipo.includes(tipo))) &&
            (!filtroEtiquetas.value.length || filtroEtiquetas.value.some(etiqueta => dato.etiquetas.toLowerCase().includes(etiqueta.toLowerCase()))) &&
            (!filtroAccion.value || filtroAccion.value === 'ambos' || dato.accion.toLowerCase() === filtroAccion.value) &&
            (filtroPPMin.value === null || coste >= filtroPPMin.value) &&
            (filtroPPMax.value === null || coste <= filtroPPMax.value) &&
            (filtroPPMin.value === null || coste >= filtroPPMin.value) &&
            (filtroPPMax.value === null || coste <= filtroPPMax.value) &&

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