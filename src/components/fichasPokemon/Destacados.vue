<script setup>
import { computed } from 'vue'

const props = defineProps(['ficha', 'grados'])

const mejorasUsadas = computed(() => props.ficha.personaliz.mejorasHab.length)



function gradoActual(checkName) {
    const mejoras = props.ficha.personaliz.mejorasHab.filter(m => m === checkName).length
    const totalGrado = Math.min(1 + mejoras, props.grados.length - 1)
    return totalGrado
}

function subirGrado(checkName) {
    const actualGrado = gradoActual(checkName)

    if (actualGrado >= props.grados.length - 1) return

    if (mejorasUsadas.value < props.ficha.derivados.cantidadMejorasHab) {
        props.ficha.personaliz.mejorasHab.push(checkName)
    }
}

function bajarGrado(checkName) {
    const idx = props.ficha.personaliz.mejorasHab.lastIndexOf(checkName)
    if (idx !== -1) {
        props.ficha.personaliz.mejorasHab.splice(idx, 1)
    }
}

</script>

<template>
        <section class="central">
            <!-- Este componente ahora está vacío ya que PP se movió a EstadisticasDerivadas -->
            <!-- Se mantiene por compatibilidad pero puede ser eliminado si no se necesita -->
        </section>
</template>

<style scoped>
/* Layout principal */
.central {
    border-radius: 5px;
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
}

.ca-calc {
    margin-top: 6px;
}

.pp-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 5px;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
    font-weight: bold;
}

.pp-inputs{
    display: flex;
    align-items: center;
    gap: 5px;
}

.pp-inputs input{
    width: 40px;
    border-bottom: 1px solid rgba(150, 150, 150, 0.798);
}
.pp-inputs input:last-child{
    width: 40px;
    border-bottom: none;
}


input {
    font-size: larger;
    background-color: transparent;
    padding: 4px;
    border: none;
    border-bottom: 1px solid;
    color: var(--color-texto);
    width: 50px;
    text-align: center;
}


input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
}

/*
@media screen and (max-width: 700px) {
    .central {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        min-width: 0;
    }

    .col-izq,
    .col-der {
        flex-direction: row;
        gap: 12px;
        justify-content: space-between;
    }

    .box {
        min-width: 0;
        width: 100%;
    }
}
    */
</style>
