<script setup>
defineProps([
    'datosCargados',
    'datos',
    'seleccionado',
    'columnas',
    'clavesColumnas'
]);
const emit = defineEmits(['seleccionar', 'ordenar']);

function mostrarDato(dato, columna) {
    if (!dato) return "—"
    if (["descripción", "descripciones", "tipos"].includes(columna.toLowerCase())) return descripcionAcortado(dato)
    if (!Array.isArray(dato)) return dato
    if (!dato.length) return "—"
    if (dato.length === 1) return dato[0]
    return dato.slice(0, -1).join(', ') + ' y ' + dato[dato.length - 1];
}

function descripcionAcortado(dato) {
    let display = Array.isArray(dato) ? dato[0] : dato
    return display;
}


</script>

<template>
    <div class="div-tabla">
        <table class="tabla">
            <thead>
                <tr>
                    <th v-for="(columna, i) of columnas" @click="emit('ordenar', clavesColumnas[i])">
                        {{ columna }}
                        <img src="/assets/icons/filtroFelcha.svg" alt="icono filtro" />
                    </th>
                </tr>
            </thead>
            <tbody v-if="datosCargados && datos.length !== 0">
                <tr v-for="(fila, index) in datos" :key="index" @click="emit('seleccionar', fila)" :class="{
                    activo:
                        seleccionado &&
                        seleccionado.Nombre === fila[clavesColumnas[0]],
                }">
                    <td v-for="columna of clavesColumnas" v-html="mostrarDato(fila[columna], columna)"></td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td :colspan="columnas.length" class="textoCentrado">
                        <div>
                            Resultados no encontrados :&lpar;
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<style scoped>
thead {
    background-color: var(--color-tituloTabla);
    position: sticky;
    top: 0;
    cursor: pointer;
    z-index: 10;
    font-size: 18px;
    box-shadow: 0 1px 0 var(--color-texto);
}

.div-tabla {
    width: 100%;
    height: fit-content;
    max-height: 65vh;
    overflow-y: auto;
    box-shadow:
        -2px 3px 6px rgb(0, 0, 0, 0.3),
        2px 3px 6px rgba(0, 0, 0, 0.3);
}

/* Personalizar la barra de scroll */
.div-tabla {
    scrollbar-width: thin;
    scrollbar-color: var(--color-principal1) #f1f1f1; /* thumb track */
}

.div-tabla::-webkit-scrollbar {
    width: 12px;
    height: 12px;
}

.div-tabla::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 6px;
    border: 1px solid #ddd;
}

.div-tabla::-webkit-scrollbar-thumb {
    background: var(--color-principal1);
    border-radius: 6px;
    border: 1px solid #f1f1f1;
}

.div-tabla::-webkit-scrollbar-thumb:hover {
    background: var(--color-principal1);
}

.div-tabla::-webkit-scrollbar-corner {
    background: #f1f1f1;
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
}

.tabla th {
    min-width: 120px;
    padding: 10px 5px;
}

th:nth-child(n+2), td:nth-child(n+2) {
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
    .tabla th {
        min-width: 20px;
    }

    .tabla th,
    .tabla td {
        padding: 7px 0;
        font-size: 11px;
    }

    .tabla td {
        padding: 5px 2px;
        word-wrap: break-word;
    }

    /* Permitir salto de línea en la columna de nombre */
    .tabla td:first-child {

        word-wrap: break-word;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
}
</style>