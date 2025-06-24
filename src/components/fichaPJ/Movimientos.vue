<template>
    <section class="moves">
        <h3>Movimientos</h3>
        <div class="moves-grid">
            <div v-for="(mov, i) in ficha.movimientos" :key="i">
                <input v-model="mov.nombre" placeholder="Nombre" />
                <input v-model="mov.tipo" placeholder="Tipo" />
                <input v-model="mov.dano" placeholder="Daño" />
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps(['ficha'])
</script>

<style scoped>
.moves-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 8px;
    background: #d5f5e3;
    border-radius: 8px;
    padding: 12px;
    font-weight: 600;
    color: #196f3d;
    text-align: center;
}

.moves-grid div {
    background: #4eb67b;
    border-radius: 8px;
    min-height: 100px;
}
</style>
