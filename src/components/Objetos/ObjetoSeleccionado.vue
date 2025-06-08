<template>
    <div v-if="datosCargados && objeto" class="seleccionado">
        <h2>{{ objeto.Nombre }}</h2>
        <p><strong>Tipo:</strong> {{ objeto.Tipo }}</p>
        <p><strong>Rareza:</strong> {{ objeto.Rareza }}</p>
        <p><strong>Coste:</strong> {{ objeto.Coste }}$</p>
        <p><strong>Descripción:</strong> {{ objeto.Descripcion }}</p>
    </div>
    <div v-else class="seleccionado">
        <p>Cargando...</p>
    </div>
</template>

<script setup>
defineProps([
    'datosCargados',
    'objeto'
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