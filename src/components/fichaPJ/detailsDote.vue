<template>
    <details class="dote">
        <summary class="titulo">{{ dote.Nombre }}</summary>
        <div class="contenidoDote">
            <p><strong>Tipo:</strong> {{ dote.Tipo }}</p>
            <p v-if="dote.Nivel !== null"><strong>Nivel:</strong> {{ dote.Nivel }}</p>
            <p v-if="dote.Prerrequisitos !== null"><strong>Prerrequisitos:</strong> {{ dote.Prerrequisitos }}</p>
            <p><strong>Descripción:</strong>
            <div class="descripcion">
                <template v-for="bloque in Array.isArray(dote.Descripcion) ? dote.Descripcion : [dote.Descripcion]">
                    <p v-if="!bloque.tipo" v-html="bloque"></p>
                    <ul v-else-if="bloque.tipo === 'listaU'" class="list">
                        <li v-for="(item, j) in bloque.contenido" :key="j" v-html="item">
                        </li>
                    </ul>
                    <ol v-else-if="bloque.tipo === 'listaO'" class="list">
                        <li v-for="(item, j) in bloque.contenido" :key="j" v-html="item"></li>
                    </ol>
                </template>

            </div>
            </p>
        </div>
    </details>
</template>

<script setup>
const props = defineProps(['dote'])
</script>

<style scoped>
.dote {
    margin-bottom: 0.5em;
}

.titulo {
    font-weight: bold;
}

.descripcion p,
.descripcion li {
    text-align: justify;
}

li {
    margin: 10px 0 0 25px;
}
</style>