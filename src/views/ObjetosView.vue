<template>
    <h1 class="titulo">Objetos</h1>
    <main class="cuerpo">
        <div id="filtroTabla">
            <Filtros :datosCargados="datosCargados" :tipos="tiposUnicos" :rarezas="rarezasUnicas"
                :filtroTipos="filtroTipos" :filtroRarezas="filtroRarezas" :filtroPrecioMin="filtroPrecioMin"
                :filtroPrecioMax="filtroPrecioMax" :filtroNombre="filtroNombre" @limpiarFiltros="limpiarFiltros"
                @actualizarFiltros="manejarFiltros" />

            <Tabla :datos="filtrados" :datosCargados="datosCargados" :seleccionado="seleccionado" :columnas="columnas"
                :clavesColumnas="clavesColumnas" @seleccionar="seleccionarObjeto" @ordenar="ordenarPor" />
        </div>
        <Seleccionado :datosCargados="datosCargados" :objeto="seleccionado" />
    </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import Tabla from "@/components/TablaView.vue"
import Seleccionado from "@/components/Objetos/ObjetoSeleccionado.vue"
import Filtros from "@/components/Objetos/ObjetosFiltrosView.vue"

const route = useRoute();
const router = useRouter();

// ======================== DATOS ========================

//Datos para la tabla
const columnas = ['Nombre', 'Tipo', 'Rareza', 'Coste']
const clavesColumnas = ['Nombre', 'Tipo', 'Rareza', 'Coste']

//Datos principales
const datos = ref([]);
const datosCargados = ref(false);
const seleccionado = ref(route.query.seleccionado ?? undefined);

//Filtros
const filtroTipos = ref(route.query.tipos ? route.query.tipos.split(",") : []);
const filtroRarezas = ref(route.query.rareza ? route.query.rareza.split(",") : []);
const filtroPrecioMin = ref(route.query.precioMin ? Number(route.query.precioMin) : null);
const filtroPrecioMax = ref(route.query.precioMax ? Number(route.query.precioMax) : null);
const filtroNombre = ref(route.query.nombre ?? null);

//Orden de tabla
const ordenColumna = ref(route.query.ordenColumna ?? null);
const ordenAscendente = ref(route.query.ordenAscendente !== "false");

// =================== CARGAR DATOS AL ABRIR ==================

onMounted(async () => {
    try {
        const res = await fetch("/data/json/objetos/objetos.json");

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

// ================ CREA LOS FILTROS DE RAREZA Y TIPOS MIRANDO LOS DE LA TABLA DIRECTAMENTE ===================
const tiposUnicos = computed(() => [
    ...new Set(datos.value.map((o) => o.Tipo).filter(Boolean)),
]);
const rarezasUnicas = computed(() => [
    ...new Set(datos.value.map((o) => o.Rareza).filter(Boolean)),
]);


// ========== FILTROS Y ORDENAMIENTOS EN RUTA

//Modifica filtros
function manejarFiltros({ clave, valor }) {
    switch (clave) {
        case 'nombre':
            filtroNombre.value = valor;
            break;
        case 'precioMin':
            filtroPrecioMin.value = valor;
            break;
        case 'precioMax':
            filtroPrecioMax.value = valor;
            break;
        case 'tipos':
            filtroTipos.value = valor;
            break;
        case 'rarezas':
            filtroRarezas.value = valor;
            break;
    }
}

// Limpia filtros
function limpiarFiltros() {
    filtroTipos.value = [];
    filtroRarezas.value = [];
    filtroPrecioMin.value = null;
    filtroPrecioMax.value = null;
    filtroNombre.value = null;
    ordenColumna.value = null;
    ordenAscendente.value = true;
}

//Cambia la ruta
watch(
    [
        seleccionado,
        filtroTipos,
        filtroRarezas,
        filtroPrecioMin,
        filtroPrecioMax,
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
        rareza: filtroRarezas.value.length ? filtroRarezas.value.join(",") : undefined,
        precioMin: filtroPrecioMin.value ?? undefined,
        precioMax: filtroPrecioMax.value ?? undefined,
        nombre: filtroNombre.value ?? undefined,
        ordenColumna: ordenColumna.value ?? undefined,
        ordenAscendente: ordenColumna.value ? ordenAscendente.value : undefined,
        seleccionado: seleccionado.value?.Nombre || undefined,
    };
}

function aplicarQuery(query) {
    filtroTipos.value = query.tipos?.split(",") ?? [];
    filtroRarezas.value = query.rareza?.split(",") ?? [];
    filtroPrecioMin.value = query.precioMin ? Number(query.precioMin) : null;
    filtroPrecioMax.value = query.precioMax ? Number(query.precioMax) : null;
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
const filtrados = computed(() => {
    let resultado = datos.value.filter((dato) => {
        const coste = dato.Coste ?? null;
        const nombre = dato.Nombre.toLowerCase();

        //Expresión lógica infernal
        return (
            (!filtroTipos.value.length || filtroTipos.value.includes(dato.Tipo)) &&
            (!filtroRarezas.value.length ||
                filtroRarezas.value.includes(dato.Rareza)) &&
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