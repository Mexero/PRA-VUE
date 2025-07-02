<template>
    <section class="feats">
        <h3>
            Dotes ({{ dotesUsados }} / {{ ficha.derivados.cantidadDotes }})
            <DotesPopUp :dotes="dotes" :ficha="ficha" :extra="true" :posicion="0" />
        </h3>

        <!-- Dotes normales -->
        <div class="feats-list">
            <div class="item" v-if="dotesCargadas" v-for="(dote, i) in slotsDote" :key="'normal-' + i">
                <template v-if="dote">
                    <template v-if="doteData(ficha.personaliz.dotes[i])">
                        <DoteDetails :dote="doteData(ficha.personaliz.dotes[i])" @eliminaDote="eliminarDote(i)" />
                        <button @click="ficha.personaliz.dotes[i] = ''" class="borrar-btn">X</button>
                    </template>
                </template>
                <template v-else>
                    <DotesPopUp :dotes="dotes" :ficha="ficha" :extra="false" :posicion="i" />
                </template>

            </div>
        </div>

        <!-- Dotes extra -->
        <div class="feats-list" v-if="ficha.personaliz.dotesExtra.length">
            <h4>Dotes Extra</h4>

            <div class="item" v-for="(dote, i) in ficha.personaliz.dotesExtra" :key="'extra-' + i">
                <template v-if="doteData(dote)">
                    <DoteDetails :dote="doteData(dote)" @eliminaDote="eliminarDoteExtra(i)" />
                    <button @click="ficha.personaliz.dotesExtra.splice(i, 1)" class="borrar-btn">X</button>
                </template>
                <template v-else>
                    No se han encontrado datos de la Dote {{ dote }}. Se recomienda borrarla.
                    <button @click="ficha.personaliz.dotesExtra.splice(i, 1)" class="borrar-btn">X</button>
                </template>
            </div>
        </div>

    </section>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import DotesPopUp from './DotesPopUp.vue'
import DoteDetails from './detailsDote.vue'

const { ficha, dotes, dotesCargadas } = defineProps([
    'ficha',
    'dotes',
    'dotesCargadas'
])

const doteData = (nombre) => dotes.find(d => d.Nombre === nombre) || null

const slotsDote = computed(() => {
    const total = ficha.derivados.cantidadDotes
    const usados = ficha.personaliz.dotes
    return [...usados, ...Array(total - usados.length).fill("")]
})

//Contar dotes
const dotesUsados = ref(0)

watch(
    () => [dotesCargadas, ficha.personaliz.dotes],
    () => {
        if (dotesCargadas) {
            let cont = 0;
            for (let dote of ficha.personaliz.dotes) {
                if (!dote || !doteData(dote)) {
                    cont++;
                }
            }
            dotesUsados.value = ficha.personaliz.dotes.length - cont;
        }
    },
    { deep: true }
);

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