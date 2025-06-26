<template>
    <div v-if="datosCargados && movimiento" class="seleccionado">
        <h2>{{ movimiento.nombre }}</h2>
        <div class="datos">
            <p><strong>Tipo:</strong> {{ movimiento.tipo }}</p>
            <p><strong>Coste:</strong> {{ movimiento.coste }}</p>
            <p><strong>Rango:</strong> {{ movimiento.rango }}</p>
            <p v-if="movimiento.danno"><strong>Daño: </strong> {{ movimiento.danno }}</p>
        </div>
        <p v-if="movimiento.etiquetas"><strong>Etiquetas:</strong>
            {{ mostrarLista(movimiento.etiquetas.split(', ')) }}
        </p>
        <p v-if="movimiento.statsAso.length"><strong>Estadísticas asociadas: </strong>
            {{ mostrarLista(movimiento.statsAso) }}</p>
        <p><strong>Descripción:</strong></p>
        <div class="descripcion">
            <BloqueTextoComplejo :dato="movimiento.descripcion"></BloqueTextoComplejo>
        </div>
    </div>

    <div v-else class="seleccionado">
        <p>Cargando...</p>
    </div>
</template>

<script setup>
import BloqueTextoComplejo from '../BloqueTextoComplejo.vue';
const props = defineProps([
    'datosCargados',
    'movimiento'
]);

function mostrarLista(dato) {
    if (dato.length === 1) return dato[0]
    return dato.slice(0, -1).join(', ') + ' y ' + dato[dato.length - 1]
}
</script>


<style scoped>
.seleccionado {
    margin-top: 40px;
    width: 40%;
    height: fit-content;
    max-height: 70vh;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    box-shadow:
        -2px 2px 10px rgba(0, 0, 0, 0.1),
        2px -2px 10px rgba(0, 0, 0, 0.1),
        2px 2px 10px rgba(0, 0, 0, 0.1),
        -2px -2px 10px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    overflow-y: scroll;
    scrollbar-width: thin;
}

.datos {
    display: grid;
    grid-template-columns: repeat(2, calc((100% - 10px)/2));
    gap: 10px;
}

.descripcion {
    text-align: justify;
}

@media screen and (max-width: 890px) {
    .seleccionado {
        font-size: 15px;
        padding: 10px;
        margin: 30px 0 20px 0;
        width: 100%;
        box-sizing: border-box;
    }
}
</style>