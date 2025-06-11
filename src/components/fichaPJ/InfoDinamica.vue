<template>
    <section class="info-dinamica">
        <h3>Cosas que cambian</h3>
        <div class="changing-grid">
            <div class="item">PV: <input v-model.number="ficha.pv" /> / <input v-model.number="ficha.derivados.pvMax" />
            </div>
            <div class="item">Escudo: <input v-model.number="ficha.escudo" /></div>
            <div class="item">PP: <input v-model.number="ficha.derivados.pp" /> / <input
                    v-model.number="ficha.derivados.ppMax" /></div>
            <div class="item">Fatiga: <input v-model.number="ficha.fatiga" /></div>
        </div>
    </section>
</template>

<script setup>
defineProps(['ficha'])
</script>

<style scoped>
.changing-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}
</style>
