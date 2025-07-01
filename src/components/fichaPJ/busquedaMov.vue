<template>
    <div class="buscador">
        <input v-model="valor" placeholder="Buscar movimiento..."
            @keydown.enter.prevent="emitirSeleccion(sugerencias[0].nombre)" />
        <div v-if="sugerencias.length" class="sugerencias-wrapper">
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
                    <tr v-for="m in sugerencias" :key="m" @mousedown.prevent="emitirSeleccion(m.nombre)">
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
import { ref, computed } from 'vue'

const props = defineProps(['movimientos'])
const emit = defineEmits(['seleccion'])

const valor = ref('')

const sugerencias = computed(() =>
    props.movimientos.filter(m =>
        m.nombre.toLowerCase().includes(valor.value.toLowerCase())
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
