<template>
    <div v-if="datosCargados && regla" class="seleccionado">
        <h2>{{ regla.nombre }}</h2>
        <p><strong>Tipo:</strong> {{ mostrarTipos(regla.tipos) }}. </p>
        <p><strong>Descripción:</strong></p>
        <div class="descripcion">
            <BloqueTextoComplejo :dato="regla.descripciones"></BloqueTextoComplejo>
        </div>
        <p v-if="regla.origen"><strong>Origen: </strong>{{ regla.origen }}</p>
    </div>

    <div v-else class="seleccionado">
        <p>Cargando...</p>
    </div>
</template>

<script setup>
defineProps([
    'datosCargados',
    'regla'
]);

import BloqueTextoComplejo from '../BloqueTextoComplejo.vue';

function mostrarTipos(tipos) {
    if (!Array.isArray(tipos)) return '';
    if (tipos.length === 0) return '';
    if (tipos.length === 1) return tipos[0];
    return tipos.slice(0, -1).join(', ') + ' y ' + tipos[tipos.length - 1];
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