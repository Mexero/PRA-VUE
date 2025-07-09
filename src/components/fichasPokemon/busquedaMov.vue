<template>
    <div class="buscador">
        <div v-if="movimientos.length" class="sugerencias-wrapper">
            <table class="sugerencias">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Coste</th>
                        <th>Etiquetas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="m in movimientos" :key="m" @mousedown.prevent="emitirSeleccion(m.nombre)">
                        <td>{{ m.nombre }}</td>
                        <td>{{ m.tipo }}</td>
                        <td>{{ m.coste }}</td>
                        <td>{{ m.etiquetas ?? "—" }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'

const props = defineProps(['movimientos'])
const emit = defineEmits(['seleccion'])

const valor = ref('')

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
