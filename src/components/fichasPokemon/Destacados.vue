<script setup>
import { computed } from 'vue'

const props = defineProps(['ficha', 'grados'])

const mejorasUsadas = computed(() => props.ficha.personaliz.mejorasHab.length)



function gradoActual(checkName) {
    const mejoras = props.ficha.personaliz.mejorasHab.filter(m => m === checkName).length
    const totalGrado = Math.min(1 + mejoras, props.grados.length - 1)

    const check = props.ficha.personaliz.checks.find(ch => ch.check === checkName)
    if (check) {
        check.grado = props.grados[totalGrado]
    }
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
    <div class="central">
        <div class="col-izq">
            <div class="box ca-box">
                <div class="ca-label">EVASION</div>
                <input v-model.number="ficha.derivados.ca" :readonly="!ficha.manual.ca" />
                <div class="ca-calc">
                    <select v-if="ficha.pokedex.calculosCA.length > 1" v-model="ficha.derivados.caElegida">
                        <option v-for="(calculo, i) in ficha.pokedex.calculosCA" :value="i">{{ calculo }}</option>
                    </select>
                    <span v-else>{{ ficha.pokedex.calculosCA[0] }}</span>
                </div>
            </div>
            <div class="box pp-box">
                <div class="pp-label">PP</div>
                <div class="pp-inputs">
                    <input v-model.number="ficha.derivados.pp" /> /
                    <input v-model.number="ficha.derivados.ppMax" :readonly="!ficha.manual.ppMax" />
                </div>
            </div>

        </div>
        <div class="col-der">
            <div class="box pv-box">
                <div class="pv-row">
                    <span>MAX PV</span>
                    <input v-model.number="ficha.derivados.pvMax" :readonly="!ficha.manual.pvMax" />
                </div>
                <div class="pv-row">
                    <span>PV:</span>
                    <input v-model.number="ficha.derivados.pv" />
                </div>
                <div class="pv-row vit">
                    <span>Vitalidad</span>
                    <input v-model.number="ficha.derivados.vit" :readonly="!ficha.manual.vit" />
                </div>
            </div>
            <div class="box escudo-box">
                <span>Escudo</span>
                <input v-model.number="ficha.derivados.escudo" />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Layout principal */
.central {
    border-radius: 5px;
   
    margin: 40px 0 0px 0;
    width: fit-content;
    display: flex;
    gap: 15px;
}

.col-izq {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.col-der {
    display: flex;
    flex-direction: column;
}

.box {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
    padding: 10px;
}

.ca-box {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.ca-calc {
    margin-top: 6px;
}

.pp-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 7px 10px;
}

.pp-label {
    text-align: center;
    margin-bottom: 4px;
}

.pp-inputs {
    display: flex;
    align-items: center;
    gap: 8px;
}

.pv-box {
    border-bottom: 1px solid rgba(150, 150, 150, 0.5);
    border-radius: 8px 8px 0 0;
    padding-bottom: 12px;
    margin-bottom: 0;
    gap: 10px;
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

.pv-row {
    display: flex;
    align-items: center;
    margin-left: 10px;
    margin-bottom: 4px;
}

.vit input {
    border: none;
    width: 30px;
}

.escudo-box {
    border-radius: 0 0 8px 8px;
    border-top: none;
    margin-top: 0;
    padding-top: 12px;
    gap: 10px;
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
</style>
