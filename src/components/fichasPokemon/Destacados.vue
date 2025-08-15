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
        <section class="destacados">

            <div class="item">
                <label>BH: </label>
                <input type="number" v-model.number="ficha.derivados.bh" :readonly="!ficha.manual.bh" />
                <!--  
                <input type="checkbox" v-model="ficha.manual.bh" />
                 -->
            </div>

            <div class="item CA">CA:
                <input v-model.number="ficha.derivados.ca" :readonly="!ficha.manual.ca" />
                <!--  
   <input type="checkbox" v-model="ficha.manual.ca">
                  -->

                <select v-if="ficha.pokedex.calculosCA.length > 1" v-model="ficha.derivados.caElegida">
                    <option v-for="(calculo, i) in ficha.pokedex.calculosCA" :value="i">{{ calculo }}</option>
                </select>
                <p v-else>
                    {{ ficha.pokedex.calculosCA[0] }}
                </p>
            </div>

            <div class="item"><label>INIT: </label>
                <!--   
                <button @click="bajarGrado('Init')" :disabled="gradoActual('Init') <= 1" title="Disminuir grado"> -</button>
                -->
                <input v-model.number="ficha.derivados.init" :readonly="!ficha.manual.init" />
                <span>{{ grados[gradoActual('Init')] }}</span>
                <!--   <button @click="subirGrado('Init')" :disabled="gradoActual('Init') >= grados.length - 1 ||
                    mejorasUsadas >= ficha.derivados.cantidadMejorasHab
                    " :title="gradoActual('Init') >= grados.length - 1
                        ? 'Ya está en el grado máximo'
                        : mejorasUsadas >= ficha.derivados.cantidadMejorasHab
                            ? 'No quedan mejoras disponibles'
                            : 'Aumentar grado'
                        ">
                    +
                </button>
                
                <input type="checkbox" v-model="ficha.manual.init" />
                -->
            </div>

            <div class="item"> 
                <label>VIT:
                    <!-- <input type="checkbox" v-model="ficha.manual.vit" /> -->
                </label>

                <input v-model.number="ficha.derivados.vit" :readonly="!ficha.manual.vit" />
            </div>

            <div class="item"> 
                <label>PV:
                    <!-- <input type="checkbox" v-model="ficha.manual.pvMax" /> -->

                </label>
                <input v-model.number="ficha.derivados.pv" /> /
                <input v-model.number="ficha.derivados.pvMax" :readonly="!ficha.manual.pvMax" />
            </div>

            <div class="item">Escudo:
                <input v-model.number="ficha.derivados.escudo" />
            </div>

            <div class="item"> 
                <label>PP:
                    <!-- <input type="checkbox" v-model="ficha.manual.ppMax" /> -->
                </label>

                <input v-model.number="ficha.derivados.pp" /> /
                <input v-model.number="ficha.derivados.ppMax" :readonly="!ficha.manual.ppMax" />

            </div>

            <div class="item">Fatiga:
                <input type="number" v-model.number="ficha.derivados.fatiga" />
            </div>
        </section>

    </div>
</template>

<style scoped>
.central {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
    padding: 5px 10px;
    width: fit-content;
    height: fit-content;
    margin: 40px 0 0px 0;
    display: flex;
    gap: 10px;
}

input {
    font-size: larger;
    background-color: transparent;
    padding: 4px;
    border: none;
    border-bottom: 1px solid;
    color: var(--color-texto);
    width: 40px;
    text-align: center;
}

.destacados {
    display: flex;
    gap: 10px 30px;
    justify-content: space-between;
}

.item {
    display: flex;
    align-items: center;
    min-width: fit-content;
}
</style>
