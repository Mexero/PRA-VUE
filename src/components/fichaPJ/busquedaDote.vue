<template>
    <div style="position: relative;">
        <input v-model="valor" placeholder="Buscar dote..." @focus="mostrar = true" @blur="ocultar"
            @keydown.enter.prevent="seleccionar()" />
        <ul v-if="mostrar && sugerencias.length" class="sugerencias">
            <li v-for="d in sugerencias" :key="d.Nombre" @mousedown.prevent="seleccionar(d.Nombre)">
                {{ d.Nombre }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['dotes', 'usados'])
const emit = defineEmits(['select'])

const valor = ref('')
const mostrar = ref(false)

const sugerencias = computed(() =>
    props.dotes.filter(d =>
        d.Nombre.toLowerCase().includes(valor.value.toLowerCase()) &&
        !props.usados.includes(d.Nombre)
    )
)

function seleccionar(nombre = null) {
    const final = nombre || sugerencias.value[0]?.Nombre
    if (!final) return
    emit('select', final)
    valor.value = ''
    mostrar.value = false
    document.activeElement.blur() // Aquí se quita el focus del input sin usar ref
}

function ocultar() {
    setTimeout(() => (mostrar.value = false), 200)
}
</script>

<style scoped>
.sugerencias {
    border: 1px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
    background: white;
    list-style: none;
    padding: 0;
    margin: 0;
    position: absolute;
    z-index: 10;
    top: 30px;
    left: 0;
    width: 250px;
}

.sugerencias li {
    padding: 5px 10px;
    cursor: pointer;
}

.sugerencias li:hover {
    background-color: #eee;
}
</style>