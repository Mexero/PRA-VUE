<template>
    <section class="stats">
        <div class="item" v-for="stat in ['fue', 'agi', 'res', 'men', 'esp', 'pre']" :key="stat">
            {{ stat.toUpperCase() }}:
            <span>{{ ficha.derivados.stats[stat] }}</span>
            <span v-if="['fue', 'agi', 'res', 'esp'].includes(stat)">({{ ficha.derivados.salvaciones[stat] || 0
                }})</span>
            <button @click="cambiarMejoraEST(stat, -1)">−</button>
            <span> Mejora: {{Array.isArray(ficha.personaliz.mejorasEst)
                ? ficha.personaliz.mejorasEst.filter(s => s === stat).length
                : 0}} </span>
            <button @click="cambiarMejoraEST(stat, 1)">+</button>
        </div>
    </section>
</template>

<script setup>
const props = defineProps(['ficha'])
const ficha = props.ficha

//cambiar Mejoras de EST
function cambiarMejoraEST(stat, delta) {
    const mejoras = ficha.personaliz.mejorasEst;
    const max = ficha.derivados.cantidadMejorasEST;

    if (delta > 0) {
        while (delta > 0 && mejoras.length < max) {
            mejoras.push(stat);
            delta--;
        }
    } else if (delta < 0) {
        let eliminadas = 0;
        for (let i = mejoras.length - 1; i >= 0 && eliminadas < -delta; i--) {
            if (mejoras[i] === stat) {
                mejoras.splice(i, 1);
                eliminadas++;
            }
        }
    }
}
</script>

<style scoped>
.stats {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-auto-flow: column;
    gap: 8px;
    margin-right: 20px;
}

.stats .item {
    height: 65px;
}
</style>
