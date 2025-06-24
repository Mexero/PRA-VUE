<template>
    <section class="habilidades">
        <h3>Habilidades</h3>
        <div class="habilidades-list">
            <div class="item" v-for="(hab, i) in ficha.habilidades" :key="i">
                <input v-model="hab.nombre" placeholder="Nombre" />:
                <input type="number" v-model.number="hab.valor" />
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps(['ficha'])
</script>

<style scoped>
.habilidades-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
