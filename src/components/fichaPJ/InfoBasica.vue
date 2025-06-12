<template>
    <section class="info-basica">
        <div><span class="label">Nombre:</span><input v-model="ficha.nombre" /></div>
        <div><span class="label">Especie:</span><input v-model="ficha.pokedex.especie" /></div>
        <div><span class="label">Nivel:</span><input type="number" v-model.number="ficha.nivel" min="0" /></div>
        <div><span class="label">Tipos:</span><input v-model="ficha.pokedex.tipos[0]" />/<input
                v-model="ficha.pokedex.tipos[1]" /></div>
    </section>
</template>

<script setup>
defineProps(['ficha'])
</script>

<style scoped>
.info-basica {
    display: flex;
    gap: 24px;
    justify-content: space-between;
    margin-bottom: 20px;
}

.label {
    font-weight: 600;
    color: #34495e;
}
</style>
