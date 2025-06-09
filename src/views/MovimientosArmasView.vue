<template>
    <h1 class="titulo">Movimientos de Armas</h1>
    <main class="cuerpo">
        <div id="filtroTabla">

            <Filtros :datosCargados="datosCargados" :tipos="tiposUnicos" :filtroTipos="filtroTipos"
                :filtroAccion="filtroAccion" :filtroPPMin="filtroPPMin" :filtroPPMax="filtroPPMax"
                :filtroNombre="filtroNombre" @limpiarFiltros="limpiarFiltros" @actualizarFiltros="manejarFiltros" />

            <Tabla :datos="filtrados" :datosCargados="datosCargados" :seleccionado="seleccionado" :columnas="columnas"
                :clavesColumnas="clavesColumnas" @seleccionar="seleccionarObjeto" @ordenar="ordenarPor" />
        </div>
        <Seleccionado :datosCargados="datosCargados" :mov="seleccionado" />
    </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import Tabla from "@/components/TablaView.vue"
import Seleccionado from "@/components/Movimientos/MovArmasSeleccionado.vue"
import Filtros from "@/components/Movimientos/MovArmasFiltrosView.vue"

const route = useRoute();
const router = useRouter();

// ======================== DATOS ========================

//Datos para la tabla
const columnas = ['Nombre', 'Tipo', 'Acción', 'Coste', 'Rango', 'EST']
const clavesColumnas = ['Nombre', 'TipoAtaque', 'Accion', 'Coste', 'Rango', 'StatsAsociados']
const tiposUnicos = ["Movimiento Estándar", "Movimiento Especial", "Movimiento Especial Superior"]

//Datos principales
const datos = ref([]);
const datosCargados = ref(false);
const seleccionado = ref(route.query.seleccionado ?? undefined);

//Filtros
const filtroTipos = ref(route.query.tipos ? route.query.tipos.split(",") : []);
const filtroPPMin = ref(route.query.PPMin ? Number(route.query.PPMin) : null);
const filtroPPMax = ref(route.query.PPMax ? Number(route.query.PPMax) : null);
const filtroNombre = ref(route.query.nombre ?? null);
const filtroAccion = ref(route.query.accion ?? null);

//Orden de tabla
const ordenColumna = ref(route.query.ordenColumna ?? null);
const ordenAscendente = ref(route.query.ordenAscendente !== "false");

// =================== CARGAR DATOS AL ABRIR ==================

onMounted(async () => {
    try {
        const res = await fetch("/data/json/movimientos/MovimientosArmas.json");

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        datos.value = await res.json();
        if (datos.value.length > 0) {
            if (seleccionado.value) {
                seleccionarObjeto(
                    datos.value.find((dato) => dato.Nombre === seleccionado.value)
                );
            } else {
                seleccionarObjeto(filtrados.value[0]);
            }
            datosCargados.value = true;
        } else {
            console.warn("El archivo JSON está vacío.");
        }
    } catch (error) {
        console.error("Error al cargar los objetos:", error);
    }
});

// ===================== SELECCIONAR OBJETOS PARA EL CUADRO ===================
function seleccionarObjeto(objeto) {
    seleccionado.value = objeto;
}

// ========== FILTROS Y ORDENAMIENTOS EN RUTA

//Modifica filtros
function manejarFiltros({ clave, valor }) {
    switch (clave) {
        case 'nombre':
            filtroNombre.value = valor;
            break;
        case 'PPMin':
            filtroPPMin.value = valor;
            break;
        case 'PPMax':
            filtroPPMax.value = valor;
            break;
        case 'tipos':
            filtroTipos.value = valor;
            break;
        case 'accion':
            filtroAccion.value = valor;
            break;
    }
}

// Limpia filtros
function limpiarFiltros() {
    filtroTipos.value = [];
    filtroAccion.value = null;
    filtroPPMin.value = null;
    filtroPPMax.value = null;
    filtroNombre.value = null;
    ordenColumna.value = null;
    ordenAscendente.value = true;
}

//Cambia la ruta
watch(
    [
        seleccionado,
        filtroTipos,
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
        accion: filtroAccion.value ?? undefined,
        PPMin: filtroPPMin.value ?? undefined,
        PPMax: filtroPPMax.value ?? undefined,
        nombre: filtroNombre.value ?? undefined,
        ordenColumna: ordenColumna.value ?? undefined,
        ordenAscendente: ordenColumna.value ? ordenAscendente.value : undefined,
        seleccionado: seleccionado.value?.Nombre || undefined,
    };
}

function aplicarQuery(query) {
    filtroTipos.value = query.tipos?.split(",") ?? [];
    filtroAccion.value = query.accion ?? null;
    filtroPPMin.value = query.PPMin ? Number(query.PPMin) : null;
    filtroPPMax.value = query.PPMax ? Number(query.PPMax) : null;
    filtroNombre.value = query.nombre ?? null;

    ordenColumna.value = query.ordenColumna ?? null;
    ordenAscendente.value = query.ordenAscendente !== "false";

    if (datosCargados.value)
        if (query.seleccionado) seleccionado.value = datos.value.find((o) => o.Nombre === query.seleccionado);
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

//UTILIDAD
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
        const coste = parsePP(dato.Coste);
        const nombre = dato.Nombre.toLowerCase();
        const accion = dato.Accion.toLowerCase();

        //Expresión lógica infernal
        return (
            (!filtroTipos.value.length || filtroTipos.value.includes(dato.TipoAtaque)) &&
            (!filtroAccion.value || filtroAccion.value === 'ambos' || accion === filtroAccion.value) &&
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