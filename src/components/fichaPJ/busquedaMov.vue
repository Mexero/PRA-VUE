<template>
    <div class="buscador">
        <input v-model="valor" placeholder="Buscar movimiento..."
            @keydown.enter.prevent="emitirSeleccion(sugerencias[0])" />
        <ul v-if="sugerencias.length" class="sugerencias">
            <li v-for="m in sugerencias" :key="m" @mousedown.prevent="emitirSeleccion(m)">
                {{ m }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps(['movimientos'])
const emit = defineEmits(['seleccion', 'sugerencias'])

const valor = ref('')

const sugerencias = computed(() =>
    props.movimientos.filter(m =>
        m.toLowerCase().includes(valor.value.toLowerCase())
    )
)

watch(sugerencias, (nuevas) => {
    emit('sugerencias', nuevas)
})

function emitirSeleccion(nombre) {
    emit('seleccion', nombre)
    valor.value = ''
}
</script>

<style scoped>
.buscador {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
    border: 1px solid #eee;
    border-radius: 6px;
    overflow: hidden;
}

.buscador input {
    padding: 10px;
    border: none;
    border-bottom: 1px solid #ccc;
    font-size: 14px;
    outline: none;
}

.sugerencias {
    flex: 1;
    overflow-y: auto;
    list-style: none;
    margin: 0;
    padding: 0;
    background: #fafafa;
}

.sugerencias li {
    padding: 8px 12px;
    cursor: pointer;
    transition: background 0.2s;
}

.sugerencias li:hover {
    background-color: #e6e6e6;
}
</style>
