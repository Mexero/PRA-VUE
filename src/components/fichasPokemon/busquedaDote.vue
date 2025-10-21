<template>
    <div class="buscador">
        <input v-model="valor" placeholder="Buscar Dotes..."
            @keydown.enter.prevent="emitirSeleccion(sugerencias[0].Nombre)" />
        <div v-if="sugerencias.length" class="sugerencias-wrapper">
            <table class="sugerencias">
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
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
    position: sticky;
}

.sugerencias-wrapper {
    overflow-y: auto;
    border: 1px solid var(--color-principal2);
    border-radius: 6px;
}

.buscador input {
    padding: 8px 12px;
    border: 1px solid var(--color-principal2);
    background-color: var(--color-fondoTexto);
    color: var(--color-texto);
    font-size: 16px;
}

.buscador input:focus {
    outline: none;
    border-color: var(--color-principal1);
}

.sugerencias {
    font-size: 16px;
    width: 100%;
    border-collapse: collapse;
    border-bottom: 1px solid var(--color-principal2);
}

.sugerencias th,
.sugerencias td {
    padding: 10px 12px;
    text-align: left;
}

.sugerencias td {
    cursor: pointer;
    border-bottom: 1px solid var(--color-principal2);
    border-left: 1px solid var(--color-principal2);
}

.sugerencias tr:hover {
    background-color: var(--color-principal2);
}

.sugerencias tr:last-child td {
    border-bottom: none;
}

@media screen and (max-width: 545px) {
    .buscador {
        width: 100%;
        height: 180px;
        display: flex;
        flex-direction: column;
    }
    
    .buscador input {
        padding: 6px 10px;
        font-size: 16px;
        flex-shrink: 0;
    }
    
    .sugerencias-wrapper {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
    }
    
    .sugerencias th,
    .sugerencias td {
        padding: 8px 10px;
    }
}
</style>
