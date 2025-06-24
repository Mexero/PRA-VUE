<template>
    <h1 class="titulo">Dotes</h1>
    <main class="cuerpo">
        <div id="filtroTabla">
            <Filtros :datosCargados="datosCargados" :tipos="tiposUnicos" :filtroTipos="filtroTipos"
                :filtroPrerrequisitos="filtroPrerrequisitos" :filtroNivelMin="filtroNivelMin"
                :filtroNivelMax="filtroNivelMax" :filtroNombre="filtroNombre" @limpiarFiltros="limpiarFiltros"
                @actualizarFiltros="manejarFiltros" />

            <Tabla :datos="filtrados" :datosCargados="datosCargados" :seleccionado="seleccionado" :columnas="columnas"
                :clavesColumnas="clavesColumnas" @seleccionar="seleccionarObjeto" @ordenar="ordenarPor" />
        </div>
        <Seleccionado :datosCargados="datosCargados" :dote="seleccionado" />
    </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import Tabla from "@/components/TablaView.vue"
import Seleccionado from "@/components/Dotes/DotesSeleccionado.vue"
import Filtros from "@/components/Dotes/DotesFiltrosView.vue"

const route = useRoute();
const router = useRouter();

// ======================== DATOS ========================

//Datos para la tabla
const columnas = ['Nombre', 'Tipo', 'Prerrequisitos', 'Nivel']
const clavesColumnas = ['Nombre', 'Tipo', 'Prerrequisitos', 'Nivel']

//Datos principales
const datos = ref([]);
const datosCargados = ref(false);
const seleccionado = ref(route.query.seleccionado ?? undefined);


// Formato prerrequisitos

/*
    "PrerreqComputable": {
      "Humano": true,
      "Movimiento": [],
      "Clase": [],
      "Dote": [],
      "TiradaHab:"[{TdA: "", Grado=""}],
      "Pokemon": true,
      "Tipo": [],
      "EtiquetaMov": [],
      "Velocidad": [],
      "Stats":[{"stat":"", "valorMin":}],
      "Tamaño: [] //ARRAY de TAMAÑOS VALIDOS",
          "Rango": ["Área","TdACaC","TdAR","TdA"],
          "TerrenoDif": true
    },
*/

//Filtros
const filtroTipos = ref(route.query.tipos ? route.query.tipos.split(",") : []);
const filtroPrerrequisitos = ref(route.query.prerrequisitos ?? null);
const filtroNivelMin = ref(route.query.nivelMin ? Number(route.query.nivelMin) : null);
const filtroNivelMax = ref(route.query.nivelMax ? Number(route.query.nivelMax) : null);
const filtroNombre = ref(route.query.nombre ?? null);

//Orden de tabla
const ordenColumna = ref(route.query.ordenColumna ?? null);
const ordenAscendente = ref(route.query.ordenAscendente !== "false");

// =================== CARGAR DATOS AL ABRIR ==================

onMounted(async () => {
    try {
        const res = await fetch("/data/json/dotes/dotes.json");

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

// ================ CREA EL FILTRO DE TIPOS MIRANDO LOS DE LA TABLA DIRECTAMENTE ===================
const tiposUnicos = computed(() => [
    ...new Set(datos.value.map((o) => o.Tipo).filter(Boolean)),
]);

// ========== FILTROS Y ORDENAMIENTOS EN RUTA. CAMBIAR

//Modifica filtros
function manejarFiltros({ clave, valor }) {
    switch (clave) {
        case 'nombre':
            filtroNombre.value = valor;
            break;
        case 'nivelMin':
            filtroNivelMin.value = valor;
            break;
        case 'nivelMax':
            filtroNivelMax.value = valor;
            break;
        case 'tipos':
            filtroTipos.value = valor;
            break;
        case 'prerrequisitos':
            filtroPrerrequisitos.value = valor;
            break;
    }
}

// Limpia filtros
function limpiarFiltros() {
    filtroTipos.value = [];
    filtroPrerrequisitos.value = null;
    filtroNivelMin.value = null;
    filtroNivelMax.value = null;
    filtroNombre.value = null;
    ordenColumna.value = null;
    ordenAscendente.value = true;
}

//Cambia la ruta
watch(
    [
        seleccionado,
        filtroTipos,
        filtroPrerrequisitos,
        filtroNivelMin,
        filtroNivelMax,
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
        prerrequisitos: filtroPrerrequisitos.value ?? undefined,
        nivelMin: filtroNivelMin.value ?? undefined,
        nivelMax: filtroNivelMax.value ?? undefined,
        nombre: filtroNombre.value ?? undefined,
        ordenColumna: ordenColumna.value ?? undefined,
        ordenAscendente: ordenColumna.value ? ordenAscendente.value : undefined,
        seleccionado: seleccionado.value?.Nombre || undefined,
    };
}

function aplicarQuery(query) {
    filtroTipos.value = query.tipos?.split(",") ?? [];
    filtroPrerrequisitos.value = query.prerrequisitos ?? null;
    filtroNivelMin.value = query.nivelMin ? Number(query.nivelMin) : null;
    filtroNivelMax.value = query.nivelMax ? Number(query.nivelMax) : null;
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
        const nivel = dato.Nivel ?? null;
        const nombre = dato.Nombre.toLowerCase();

        // Filtro de prerrequisitos por radio
        let pasaFiltroPrerrequisitos = true;
        if (filtroPrerrequisitos.value === "Si") {
            pasaFiltroPrerrequisitos = !!dato.Prerrequisitos && dato.Prerrequisitos.trim() !== "";
        } else if (filtroPrerrequisitos.value === "No") {
            pasaFiltroPrerrequisitos = !dato.Prerrequisitos || dato.Prerrequisitos.trim() === "";
        }
        // "Todos" deja pasaFiltroPrerrequisitos en true

        return (
            (!filtroTipos.value.length || filtroTipos.value.includes(dato.Tipo)) &&
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