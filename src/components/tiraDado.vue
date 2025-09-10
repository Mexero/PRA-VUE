<template>
    <button @click="enviarTirada">🎲</button>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    tirada: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        default: 'Botón'
    }
})

function enviarTirada() {
    const mensaje = {
        type: 'lanzarDados',
        origin: props.origin,
        dice: props.tirada
    }
    window.postMessage(mensaje, '*')
    console.log('Mensaje enviado:', mensaje)
}
</script>

<style scoped>
button {
    border-radius: 6px;
    border: none;
    background: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background 0.2s;
}

button:hover {
    background: lightgray;
}
</style>
