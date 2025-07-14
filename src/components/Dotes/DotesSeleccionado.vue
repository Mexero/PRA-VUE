<template>
    <div v-if="datosCargados && dote" class="seleccionado">
        <h2>{{ dote.Nombre }}</h2>
        <p><strong>Tipo:</strong> {{ dote.Tipo }} </p>
        <p v-if="dote.Prerrequisitos"><strong>Prerrequisitos:</strong> {{ dote.Prerrequisitos }}</p>
        <p v-if="dote.Nivel"><strong>Nivel:</strong> {{ dote.Nivel }}</p>
        <p v-if="dote.Repetible"><strong>Repetible</strong></p>
        <p><strong>Descripción:</strong></p>
        <div class="descripcion">
            <BloqueTextoComplejo :dato="dote.Descripcion"></BloqueTextoComplejo>
        </div>
    </div>
    <div v-else class="seleccionado">
        <p>Cargando...</p>
    </div>
</template>

<script setup>
import BloqueTextoComplejo from '../BloqueTextoComplejo.vue';

BloqueTextoComplejo


defineProps([
    'datosCargados',
    'dote'
]);
</script>


<style scoped>
.seleccionado {
    margin-top: 40px;
    width: 40%;
    height: fit-content;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    box-shadow:
        -2px 2px 10px rgba(0, 0, 0, 0.1),
        2px -2px 10px rgba(0, 0, 0, 0.1),
        2px 2px 10px rgba(0, 0, 0, 0.1),
        -2px -2px 10px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
}

.descripcion p,
.descripcion li {
    text-align: justify;
}

li {
    margin: 10px 0 0 25px;
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