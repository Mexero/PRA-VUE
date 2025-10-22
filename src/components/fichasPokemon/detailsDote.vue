<template>
    <details class="dote">
        <summary class="titulo">
            <span>{{ dote.Nombre }}</span>
            <button @mousedown.prevent.stop="$emit('eliminar')" class="borrar-btn" title="Eliminar Dote">×</button>
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
    margin: 8px 0;
    border: 1px solid var(--color-principal1);
    border-radius: 6px;
    overflow: hidden;
}

.dote:hover {
    border-color: var(--color-principal1);
}

.titulo {
    background-color: var(--color-principal1);
    height: 32px;
    padding: 0 0 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

.titulo:hover {
    background-color: var(--color-principal2);
}

.descripcion {
    padding: 12px;
    color: var(--color-texto);
    line-height: 1.5;
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
    font-size: 24px;
    border-left: 1px solid;
    width: 40px;
    height: 32px;
    background-color: var(--color-principal1);
}
.borrar-btn:hover {
    background-color: var(--color-principal2);
}


.contenidoDote {
    padding: 12px;
    background: var(--color-fondoTexto);
}

.contenidoDote p {
    margin: 0 0 8px 0;
    font-size: 0.9em;
}

.contenidoDote p:last-child {
    margin-bottom: 0;
}

strong {
    letter-spacing: 1px;
}

/* Responsive mejoras */
@media screen and (max-width: 768px) {
    .item {
        margin: 6px 0;
    }
    
    .borrar-btn {
        font-size: 20px;
        width: 35px;
        height: 32px;
    }
}
</style>