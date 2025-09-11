<template>
    <button type="button" @click="handleClick" aria-label="Lanzar d20">
        <img src="/assets/icons/d20.svg" alt="d20" :class="{ spinning: isSpinning }" width="15" height="15" />
    </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    tirada: { type: String, required: true },
    origin: { type: String, default: 'Botón' }
})

const isSpinning = ref(false)

function enviarTirada() {
    const mensaje = {
        type: 'lanzarDados',
        origin: props.origin,
        dice: props.tirada
    }
    window.postMessage(mensaje, '*')
    console.log('Mensaje enviado:', mensaje)
}

function handleClick() {
    enviarTirada()
    isSpinning.value = true
    setTimeout(() => {
        isSpinning.value = false
    }, 600)
}
</script>

<style scoped>
button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: 6px;
}

img {
    width: 15px;
    height: 15px;
    display: inline-block;
    transform-origin: center center;
    will-change: transform;
    filter: var(--color-icon);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@-webkit-keyframes spin {
    to {
        -webkit-transform: rotate(360deg);
    }
}

.spinning {
    animation: spin 0.6s linear;
    -webkit-animation: spin 0.6s linear;
}
</style>
