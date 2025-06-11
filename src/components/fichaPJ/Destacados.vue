<template>
    <section class="destacados">
        <div class="item">
            <label><input type="checkbox" v-model="ficha.manual.bh" @change="$emit('actualizar')" /> bh:</label>
            <input type="number" v-model.number="ficha.derivados.bh" :readonly="!ficha.manual.bh" />
        </div>
        <div class="item">CA: <input v-model.number="ficha.derivados.ca" /></div>
        <div class="item">INIT: <input v-model.number="ficha.derivados.init" /></div>
        <div class="item">VIT: <input v-model.number="ficha.vit" /></div>
    </section>
</template>

<script setup>
defineProps(['ficha'])
defineEmits(['actualizar'])
</script>

<style scoped>
.destacados {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
}
</style>
