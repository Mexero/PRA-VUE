<template>
    <button @click="enviarTirada"><img width="15px" height="15px" src="/assets/icons/d20.svg" alt="d20"></button>
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
    height: 15px;
    width: 15px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background 0.2s;
}

img {
    filter: var(--color-icon)
}

button:hover {
    background: lightgray;
}
</style>
