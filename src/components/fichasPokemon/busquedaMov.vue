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
                    <tr v-for="m in movimientos"
                        :key="m.nombre"
                        @mousedown.prevent="emitirSeleccion(m.nombre)"
                        :class="{ seleccionado: m.nombre === seleccionado }"
                    >
                        <td>{{ m.nombre }}</td>
                        <td>{{ m.tipo }}</td>
                        <td>{{ m.coste }}</td>
                        <td>{{ m.etiquetas ?? '—' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'

const props = defineProps(['movimientos', 'seleccionado'])
const emit = defineEmits(['seleccion'])

const valor = ref('')

function emitirSeleccion(nombre) {
    emit('seleccion', nombre)
    valor.value = ''
}
</script>

<style scoped>
.buscador{
    width: 60%;
    overflow: auto;
}
.sugerencias{
    min-width: 100%;
   border-collapse: collapse;

}
td{
    padding: 5px ;
}
tr:hover{
    background-color: var(--color-principal2);
    cursor: pointer;
}

.sugerencias thead th {
    position: sticky;
    top: 0;
    background-color: var(--color-principal1);
    z-index: 1;
}

.sugerencias th {
    padding: 8px 12px;
}

.seleccionado {
    background-color: var(--color-principal2) !important;
}


</style>
