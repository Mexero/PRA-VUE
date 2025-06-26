<template>
    <div v-if="datosCargados && habilidad" class="seleccionado">
        <h2>{{ habilidad.nombre }}</h2>
        <p v-if="habilidad.transformacion"><strong>Habilidad de Transformación</strong></p>
        <p v-if="habilidad.legendaria"><strong>Habilidad Legendaria</strong></p>
        <p><strong>Descripción:</strong></p>
        <div class="descripcion">
            <BloqueTextoComplejo :dato="habilidad.descripcion.split('\n')"></BloqueTextoComplejo>
        </div>
    </div>

    <div v-else class="seleccionado">
        <p>Cargando...</p>
    </div>
</template>

<script setup>
import BloqueTextoComplejo from '../BloqueTextoComplejo.vue';
defineProps([
    'datosCargados',
    'habilidad'
]);

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