<template>
    <div class="central">
        <section class="destacados">
            <div class="item">
                <label>bh: <input type="checkbox" v-model="ficha.manual.bh" /></label>
                <input type="number" v-model.number="ficha.derivados.bh" :readonly="!ficha.manual.bh" />
            </div>
            <div class="item">CA: <input v-model.number="ficha.derivados.ca" /></div>
            <div class="item"><label>INIT: <input type="checkbox" v-model="ficha.manual.init" /></label>
                <button @click="bajarGrado('Init')" :disabled="gradoActual('Init') <= 1" title="Disminuir grado">
                    -
                </button>
                <input v-model.number="ficha.derivados.init" :readonly="!ficha.manual.init" />
                <span>{{ grados[gradoActual('Init')] }}</span>
                <button @click="subirGrado('Init')" :disabled="gradoActual('Init') >= grados.length - 1 ||
                    mejorasUsadas >= ficha.derivados.cantidadMejorasHab
                    " :title="gradoActual('Init') >= grados.length - 1
                        ? 'Ya está en el grado máximo'
                        : mejorasUsadas >= ficha.derivados.cantidadMejorasHab
                            ? 'No quedan mejoras disponibles'
                            : 'Aumentar grado'
                        ">
                    +
                </button>
            </div>
            <div class="item"> <label>VIT: <input type="checkbox" v-model="ficha.manual.vit" /></label>
                <input v-model.number="ficha.derivados.vit" :readonly="!ficha.manual.vit" />

            </div>

        </section>

        <section class="info-dinamica">
            <div class="item"> <label>PV: <input type="checkbox" v-model="ficha.manual.pvMax" /></label>
                <div><input v-model.number="ficha.derivados.pv" /> /
                    <input v-model.number="ficha.derivados.pvMax" :readonly="!ficha.manual.pvMax" />
                </div>
            </div>
            <div class="item">Escudo: <div><input v-model.number="ficha.derivados.escudo" /></div>
            </div>
            <div class="item"> <label>PP: <input type="checkbox" v-model="ficha.manual.ppMax" /></label>
                <div><input v-model.number="ficha.derivados.pp" /> /
                    <input v-model.number="ficha.derivados.ppMax" :readonly="!ficha.manual.ppMax" />
                </div>
            </div>
            <div class="item">Fatiga: <div><input type="number" v-model.number="ficha.derivados.fatiga" /></div>
            </div>
        </section>
    </div>
</template>

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

<style scoped>
.central {
    display: flex;
    gap: 40px;

}

.item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
}

.info-dinamica,
.destacados {
    display: grid;
    grid-template: repeat(2, 1fr) / repeat(2, 1fr);
    gap: 12px;
    flex-grow: 1;
}

.info-dinamica div,
.destacados div {
    align-self: center;
    justify-self: center;
}

.info-dinamica .item div {
    display: flex;
    flex-direction: row;
}

.info-dinamica .item div input {
    width: 25px;
}

.central {
    display: flex;
    justify-content: space-evenly;
}
</style>
