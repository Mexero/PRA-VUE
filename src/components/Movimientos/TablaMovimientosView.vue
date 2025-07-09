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
    if (dato === true) return "✔"
    if (dato === false) return "✖"
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
                <tr v-for="(fila, index) in datos" :key="index" @click="emit('seleccionar', fila.nombre)" :class="{
                    activo:
                        seleccionado &&
                        seleccionado.nombre === fila[clavesColumnas[0]],
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
    z-index: 1;
    font-size: 18px;
}

.div-tabla {
    width: 100%;
    height: fit-content;
    max-height: 70vh;
    overflow-y: auto;
    box-shadow:
        -2px 3px 6px rgb(0, 0, 0, 0.3),
        2px 3px 6px rgba(0, 0, 0, 0.3);
}

.tabla {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    color: var(--color-texto);
    table-layout: fixed;
}

.tabla th,
.tabla td {
    padding: 6px 10px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.tabla th {
    font-weight: bold;
}

.tabla th:nth-child(1),
.tabla td:nth-child(1) {
    width: 20%;
}

.tabla th:nth-child(2),
.tabla td:nth-child(2),
.tabla th:nth-child(3),
.tabla td:nth-child(3) {
    width: 10%;
}

.tabla th:nth-child(4),
.tabla td:nth-child(4),
.tabla th:nth-child(5),
.tabla td:nth-child(5),
.tabla th:nth-child(6),
.tabla td:nth-child(6),
.tabla th:nth-child(7),
.tabla td:nth-child(7) {
    width: 17.5%;
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

    .div-tabla {
        height: 60vh;
        margin: 0 auto;
        margin-bottom: 80px;
        overflow-x: auto;
        height: fit-content;
        max-height: 70vh;

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
}
</style>