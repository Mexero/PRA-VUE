<template>
    <section class="feats">
        <h3>
            Dotes (
            <input type="number" v-model.number="ficha.derivados.cantidadDotes"
                :readonly="!ficha.manual.cantidadDotes" />)
            Dotes Extra:
            <input type="checkbox" v-model="ficha.manual.dotesExtra" />
        </h3>

        <!-- Dotes normales -->
        <div class="feats-list">
            <div class="item" v-for="(dote, i) in slotsDote" :key="'normal-' + i">
                <template v-if="dote">
                    <template v-if="doteData(ficha.personaliz.dotes[i])">
                        <DoteDetails :dote="doteData(ficha.personaliz.dotes[i])" @eliminaDote="eliminarDote(i)" />
                        <button @click="ficha.personaliz.dotes[i] = ''" class="borrar-btn">X</button>
                    </template>
                </template>
                <template v-else>
                    <BusquedaDote :usados="usados" :dotes="dotes" @select="ficha.personaliz.dotes[i] = $event" />
                </template>

            </div>
        </div>

        <!-- Dotes extra -->
        <div class="feats-list" v-if="ficha.manual.dotesExtra">
            <h4>Dotes Extra</h4>

            <div class="item" v-for="(dote, i) in ficha.personaliz.dotesExtra" :key="'extra-' + i">
                <template v-if="doteData(dote)">
                    <DoteDetails :dote="doteData(dote)" @eliminaDote="eliminarDoteExtra(i)" />
                    <button @click="ficha.personaliz.dotesExtra.splice(i, 1)" class="borrar-btn">X</button>
                </template>
                <template v-else>
                    <input v-model="ficha.personaliz.dotesExtra[i]" />
                </template>
            </div>

            <!-- Añadir nueva dote extra -->
            <BusquedaDote v-model="nuevaDoteExtra" :dotes="dotes" :usados="usados" @select="addDoteExtra" />
        </div>

    </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import BusquedaDote from './busquedaDote.vue'
import DoteDetails from './detailsDote.vue'

const { ficha, dotes } = defineProps(['ficha', 'dotes'])

const doteData = (nombre) => dotes.find(d => d.Nombre === nombre) || null

const slotsDote = computed(() => {
    const total = ficha.derivados.cantidadDotes
    const usados = ficha.personaliz.dotes
    return [...usados, ...Array(total - usados.length).fill("")]
})

const usados = computed(() => [
    ...ficha.personaliz.dotes,
    ...(ficha.personaliz.dotesExtra || [])
])


// Dotes extra
const nuevaDoteExtra = ref('')

// Añadir una dote extra desde el buscador
function addDoteExtra(nombre) {
    if (!nombre) return
    if (!ficha.personaliz.dotesExtra.includes(nombre)) {
        ficha.personaliz.dotesExtra.push(nombre)
    }
    nuevaDoteExtra.value = ''
}

// Eliminar una dote extra por índice
function eliminarDoteExtra(index) {
    ficha.personaliz.dotesExtra.splice(index, 1)
}
</script>

<style scoped>
.feats-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

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

.borrar-btn {
    margin-left: 0.5em;
    background: transparent;
    border: none;
    color: red;
    cursor: pointer;
    font-size: 1.1em;
}
</style>