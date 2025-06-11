<template>
    <section class="speeds">
        <h3>Velocidades</h3>
        <div class="speeds-list">
            <div class="item" v-for="(val, tipo) in ficha.derivados.velocidades" :key="tipo">
                {{ tipo }}: <input type="number" v-model.number="ficha.derivados.velocidades[tipo]" />
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps(['ficha'])
</script>

<style scoped>
.speeds-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
