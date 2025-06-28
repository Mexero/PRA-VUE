<template>
    <div style="position: relative;">
        <input v-model="valor" placeholder="Buscar dote..." @focus="mostrar = true" @blur="ocultar"
            @keydown.enter.prevent="seleccionar()" />
        <ul v-if="mostrar && sugerencias.length" class="sugerencias">
            <li v-for="h in sugerencias" :key="h.nombre" @mousedown.prevent="seleccionar(h.nombre)">
                {{ h.nombre }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['habilidades'])
const emit = defineEmits(['select'])

const valor = ref('')
const mostrar = ref(false)

const sugerencias = computed(() =>
    props.habilidades.filter(h =>
        h.nombre.toLowerCase().includes(valor.value.toLowerCase())
    )
)

function seleccionar(nombre = null) {
    const final = nombre || sugerencias.value[0]?.nombre
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