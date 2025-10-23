<template>
    <div class="buscador">
        <input v-model="valor" placeholder="Buscar Habilidad..."
            @keydown.enter.prevent="emitirSeleccion(sugerencias[0].nombre)" />
        <div v-if="sugerencias.length" class="sugerencias-wrapper">
            <table class="sugerencias">
                <tbody>
                    <tr v-for="h in sugerencias" :key="h" @mousedown.prevent="emitirSeleccion(h.nombre)">
                        <td>{{ h.nombre }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup>
import { ref, computed } from 'vue'

const props = defineProps([
    'habilidades'])
const emit = defineEmits(['seleccion'])

const valor = ref('')

const sugerencias = computed(() =>
    props.habilidades.filter(h =>
        h.nombre.toLowerCase().includes(valor.value.toLowerCase())
    )
)

function emitirSeleccion(nombre) {
    emit('seleccion', nombre)
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
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .buscador input {
        padding: 6px 10px;
        font-size: 16px;
        flex-shrink: 0;
    }

    .sugerencias-wrapper {
        overflow-y: auto;
        flex: 1;
        min-height: 0;
    }

    .sugerencias th,
    .sugerencias td {
        padding: 8px 10px;
    }
}
</style>
