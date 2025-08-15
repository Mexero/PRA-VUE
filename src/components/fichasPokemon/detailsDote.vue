<template>
    <details class="dote">
        <summary class="titulo">
            <span>{{ dote.Nombre }}</span>
            <button @mousedown.prevent.stop="$emit('eliminar')" class="borrar-btn" title="Eliminar Dote">x</button>
        </summary>
        <div class="contenidoDote">
            <p><strong>Tipo:</strong> {{ dote.Tipo }}</p>
            <p v-if="dote.Nivel !== null"><strong>Nivel:</strong> {{ dote.Nivel }}</p>
            <p v-if="dote.Prerrequisitos !== null"><strong>Prerrequisitos:</strong> {{ dote.Prerrequisitos }}</p>
            <div>
                <p><strong>Descripción:</strong></p>
                <div class="descripcion">
                    <template v-for="bloque in Array.isArray(dote.Descripcion) ? dote.Descripcion : [dote.Descripcion]">
                        <p v-if="!bloque.tipo" v-html="bloque"></p>
                        <ul v-else-if="bloque.tipo === 'listaU'" class="list">
                            <li v-for="(item, j) in bloque.contenido" :key="j" v-html="item"></li>
                        </ul>
                        <ol v-else-if="bloque.tipo === 'listaO'" class="list">
                            <li v-for="(item, j) in bloque.contenido" :key="j" v-html="item"></li>
                        </ol>
                    </template>
                </div>
            </div>
        </div>
    </details>
</template>

<script setup>
const props = defineProps(['dote'])
</script>

<style scoped>
.dote {
    margin: 10px 0;
    border: 1px solid var(--color-principal2);
}

.titulo {
    font-weight: bold;
    background-color: var(--color-principal2);
    padding:  0 0 0 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
            cursor: pointer;

    
}

.descripcion {
    padding: 10px;
    color: var(--color-texto);
}

.descripcion p,
.descripcion li {
    text-align: justify;
}

li {
    margin: 10px 0 0 25px;
}

.borrar-btn {
    background-color: transparent;
    border: none;
    color: var(--color-texto);
    cursor: pointer;
    font-weight: bold;
    font-size: 30px;
    line-height: 25px;
    border-left: 1px solid;
    width: 40px;
    height: 30px;
    padding-bottom: 5px;
    background-color: var(--color-principal1);
}

.borrar-btn:hover {
    background-color: var(--color-principal2);
}

.contenidoDote {
    width: 650px;
    padding: 10px;
}

@media screen and (max-width: 1460px) {
    .contenidoDote {
    width: 760px;
}
}
</style>