<template>
    <h1 class="titulo">Reglas</h1>
    <main class="cuerpo">
        <div id="filtroTabla">
            <Filtros :datosCargados="datosCargados" :filtroTipo="filtroTipo" :tiposComunes="tipoComunes"
                :tiposMenores="tiposMenores" @limpiarFiltros="limpiarFiltros" @actualizarFiltros="manejarFiltros" />

            <Tabla :datos="filtrados" :datosCargados="datosCargados" :seleccionado="seleccionado" :columnas="columnas"
                :clavesColumnas="clavesColumnas" @seleccionar="seleccionarRegla" @ordenar="ordenarPor" />
        </div>
        <Seleccionado :datosCargados="datosCargados" :regla="seleccionado" />
    </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import Tabla from "@/components/Reglas/TablaView.vue"
import Seleccionado from "@/components/Reglas/ReglasSeleccionado.vue"
import Filtros from "@/components/Reglas/ReglasFiltrosView.vue"

const route = useRoute();
const router = useRouter();

// ======================== DATOS ========================

//Datos para la tabla
const columnas = ['Nombre', 'Tipos', 'Descripción']
const clavesColumnas = ['nombre', 'tipos', 'descripciones']

//Datos principales
const datos = ref([]);
const datosCargados = ref(false);
const seleccionado = ref(route.query.seleccionado ?? undefined);

//Filtros
const filtroTipo = ref(route.query.tipos ? route.query.tipos.split(",") : []);
const filtroNombre = ref(route.query.nombre ?? null);

//Orden de tabla
const ordenColumna = ref(route.query.ordenColumna ?? null);
const ordenAscendente = ref(route.query.ordenAscendente !== "false");

//Tipos de filtrosTipos
const tipoComunes = ['Regla', 'Regla variante', 'Término', 'Clase', 'Subclase', 'Estado', 'Tirada de Habilidad']
const tiposMenores = ['Entrenador', 'Orden de Entrenador', 'Entrenamiento', 'Inventor', 'Invención', 'Velocidad', 'Sentido', 'Clima', 'Campo', 'Regla de DJ', 'Pokémon especiales', 'Efecto ambiental']


// =================== CARGAR DATOS AL ABRIR ==================

onMounted(async () => {
    try {
        const res = await fetch("/data/json/Reglas/reglas.json");

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        datos.value = await res.json();
        if (datos.value.length > 0) {
            if (seleccionado.value) {
                seleccionarRegla(
                    datos.value.find((dato) => dato.nombre === seleccionado.value)
                );
            } else {
                seleccionarRegla(filtrados.value[0]);
            }
            datosCargados.value = true;
        } else {
            console.warn("El archivo JSON está vacío.");
        }
    } catch (error) {
        console.error("Error al cargar las reglas:", error);
    }
});

// ===================== SELECCIONAR REGLAS PARA EL CUADRO ===================
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
        case 'tipos':
            filtroTipo.value = valor;
            break;
    }
}

// Limpia filtros
function limpiarFiltros() {
    filtroTipo.value = [];
    filtroNombre.value = null;
    ordenColumna.value = null;
    ordenAscendente.value = true;
}

//Cambia la ruta
watch(
    [
        seleccionado,
        filtroTipo,
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
        tipo: filtroTipo.value.length ? filtroTipo.value.join(",") : undefined,
        nombre: filtroNombre.value ?? undefined,
        ordenColumna: ordenColumna.value ?? undefined,
        ordenAscendente: ordenColumna.value ? ordenAscendente.value : undefined,
        seleccionado: seleccionado.value?.nombre || undefined,
    };
}

function aplicarQuery(query) {
    filtroTipo.value = query.tipo?.split(",") ?? [];
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
            (!filtroTipo.value.length || dato.tipos.some(tipo => filtroTipo.value.includes(tipo))) &&
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