<template>
    <section class="others">
        <h3>Otros</h3>
        <div class="others-list">
            <div class="item">Dieta: <input v-model="ficha.pokedex.otros.dieta" readonly /></div>
            <div class="item">Tamaño: <input v-model="ficha.pokedex.otros.tamano" readonly /></div>
            <div class="item">Sexo: <input v-model="ficha.pokedex.otros.sexo" readonly /></div>
            <div class="item">Sentidos: <input v-model="ficha.derivados.sentidos" readonly /></div>
            <div class="item">Naturaleza: <input v-model="ficha.personaliz.naturaleza" /></div>
            <div class="item">Teratipo: <input v-model="ficha.personaliz.teratipo" /></div>
            <div class="item">Carga: <input type="number" :value="ficha.derivados.carga" readonly /></div>
            <div class="item">Evolucion: <textarea v-model="ficha.pokedex.otros.evolucion" readonly></textarea></div>

        </div>
    </section>
</template>

<script setup>
defineProps(['ficha'])
</script>

<style scoped>
.others-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.others-list div {
    width: 18%;
}

.item {
    flex: 1 1 30%;
    min-width: 150px;
}
</style>
