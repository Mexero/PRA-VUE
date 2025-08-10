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
.buscador {
    width: 40%;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    position: sticky;
}

.sugerencias thead th {
    position: sticky;
    top: 0;
    background-color: var(--color-principal1);
    z-index: 1;
}

.sugerencias-wrapper {
    flex: 1 1 auto;
    overflow-y: auto;
    border-top: 1px solid #ccc;
    min-height: 0;
}

.buscador input {
    flex: 0 0 auto;
    margin-bottom: 8px;
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
    background-color: var(--color-principal2);
}
input {
    background-color: transparent;
    padding: 4px;
    border: none;
    border-bottom: 1px solid;
    color: var(--color-texto);
}
</style>
