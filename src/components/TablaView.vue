<script setup>
defineProps([
    'datosCargados',
    'datos',
    'seleccionado',
    'columnas'
]);
const emit = defineEmits(['seleccionar', 'ordenar']);
</script>

<template>
    <div class="div-tabla">
        <table class="tabla">
            <thead>
                <tr>
                    <th v-for="columna of columnas" @click="emit('ordenar', columna)">
                        {{ columna }}
                        <img src="../../../public/assets/icons/filtroFelcha.svg" alt="icono filtro" />
                    </th>
                </tr>
            </thead>
            <tbody v-if="datosCargados && datos.length !== 0">
                <tr v-for="(fila, index) in datos" :key="index" @click="emit('seleccionar', fila)" :class="{
                    activo:
                        seleccionado &&
                        seleccionado.Nombre === fila[columnas[0]],
                }">
                    <td v-for="columna of columnas">{{ fila[columna] ?? "—" }}</td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="4" class="textoCentrado">
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