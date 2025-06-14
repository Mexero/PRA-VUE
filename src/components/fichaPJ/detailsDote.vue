<template>
    <details class="dote">
        <summary class="titulo">{{ dote.Nombre }}</summary>
        <div class="contenidoDote">
            <p><strong>Tipo:</strong> {{ dote.Tipo }}</p>
            <p v-if="dote.Nivel !== null"><strong>Nivel:</strong> {{ dote.Nivel }}</p>
            <p v-if="dote.Prerrequisitos !== null"><strong>Prerrequisitos:</strong> {{ dote.Prerrequisitos }}</p>
            <p><strong>Descripción:</strong> {{ dote.Descripcion }}</p>
        </div>
    </details>
</template>

<script setup>
const props = defineProps(['dote'])
</script>

<style scoped>
.dote {
    margin-bottom: 0.5em;
}

.titulo {
    font-weight: bold;
}
</style>