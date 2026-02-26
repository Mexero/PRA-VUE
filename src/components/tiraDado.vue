<template>
    <button type="button" @click="handleClick" aria-label="Lanzar d20">
        <img src="/assets/icons/d20.svg" alt="d20" :class="{ spinning: isSpinning }" />
    </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    tirada: { type: String, required: true },
    origin: { type: String, default: 'Botón' },
    critico: { type: Number, default: 20 }
})

const isSpinning = ref(false)

function enviarTirada() {
    const mensaje = {
        type: 'lanzarDados',
        origin: props.origin,
        dice: props.tirada,
        critico: props.critico
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
    width: 20px;
    height: 20px;
    border-radius: 6px;
}

img {
    width: 20px;
    height: 20px;
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

@media screen and (max-width: 750px) {
    button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: none;
        background: none;
        cursor: pointer;
        width: 25px;
        height: 25px;
        border-radius: 6px;
    }

    img {
        width: 25px;
        height: 25px;
        display: inline-block;
        transform-origin: center center;
        will-change: transform;
        filter: var(--color-icon);
    }
}
</style>
