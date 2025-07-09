<template>
    <template v-for="bloque in Array.isArray(dato) ? dato : [dato]">
        <p v-if="!bloque.tipo" v-html="bloque"></p>
        <ul v-else-if="bloque.tipo === 'listaU'" class="list">
            <li v-for="(item, j) in bloque.contenido" :key="j" v-html="item">
            </li>
        </ul>
        <ol v-else-if="bloque.tipo === 'listaO'" class="list">
            <li v-for="(item, j) in bloque.contenido" :key="j" v-html="item"></li>
        </ol>
        <p v-else-if="bloque.tipo === 'pLink'">
            <template v-for="parte in Array.isArray(bloque.partes) ? bloque.partes : [bloque.partes]">
                {{ parte.previo }}
                <RouterLink :to="parte.ancla">{{ parte.anclaContenido }}</RouterLink>
                <template v-if="parte.final">{{ parte.final }}</template>
            </template>
        </p>
    </template>
</template>

<script setup>
defineProps([
    'dato'
]);
</script>

<style scoped>
ol,
ul {
    padding: 5px 0 5px 20px;
}

p {
    padding: 5px 0 5px;
}

:deep(a) {
    text-decoration: underline dotted black !important;
}
</style>