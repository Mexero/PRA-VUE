<template>
    <section class="feats">
        <h3>Dotes</h3>
        <div class="feats-list">
            <div class="item" v-for="(dote, i) in ficha.dotes" :key="i">
                <input v-model="ficha.dotes[i]" placeholder="Nombre de dote" />
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps(['ficha'])
</script>

<style scoped>
.feats-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
