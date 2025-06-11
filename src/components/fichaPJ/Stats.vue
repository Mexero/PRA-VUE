<template>
    <section class="stats">
        <div class="item" v-for="stat in ['fue', 'agi', 'res', 'men', 'esp', 'pre']" :key="stat">
            {{ stat.toUpperCase() }}:
            <span>{{ ficha.derivados.stats[stat] }}</span>
            (<span>{{ ficha.derivados.salvaciones[stat] || 0 }}</span>)
            <button @click="$emit('cambiar-mejora', stat, -1)">−</button>
            <span> Mejora: {{Array.isArray(ficha.personaliz.mejorasEst)
                ? ficha.personaliz.mejorasEst.filter(s => s === stat).length
                : 0}} </span>
            <button @click="$emit('cambiar-mejora', stat, 1)">+</button>
        </div>
    </section>
</template>

<script setup>
defineProps(['ficha'])
defineEmits(['cambiar-mejora'])
</script>

<style scoped>
.stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-flow: column;
    gap: 8px;
}
</style>
