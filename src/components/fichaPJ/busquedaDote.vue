<template>
    <div class="buscador">
        <input v-model="valor" placeholder="Buscar Dotes..."
            @keydown.enter.prevent="emitirSeleccion(sugerencias[0].Nombre)" />
        <div v-if="sugerencias.length" class="sugerencias-wrapper">
            <table class="sugerencias">
                <thead>
                    <tr>
                        <th>Nombre</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d in sugerencias" :key="d" @mousedown.prevent="emitirSeleccion(d.Nombre)">
                        <td>{{ d.Nombre }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup>
import { ref, computed } from 'vue'

const props = defineProps([
    'dotes'])
const emit = defineEmits(['seleccion'])

const valor = ref('')

const sugerencias = computed(() =>
    props.dotes.filter(d =>
        d.Nombre.toLowerCase().includes(valor.value.toLowerCase())
    )
)

function emitirSeleccion(nombre) {
    emit('seleccion', nombre)
    valor.value = ''
}
</script>

<style scoped>
.sugerencias-wrapper {
    flex: 1;
    overflow-y: auto;
    max-height: 300px;
    border-top: 1px solid #ccc;
}

.sugerencias {
    font-size: 14px;
    width: 100%;
    border-collapse: collapse;
}

.sugerencias th,
.sugerencias td {
    padding: 8px 12px;
    text-align: left;
}

.sugerencias td {
    cursor: pointer;
    transition: background 0.2s;
}

.sugerencias tr:hover {
    background-color: #e6e6e6;
}
</style>
