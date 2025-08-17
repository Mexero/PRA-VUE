<script setup>
import { ref, watch, computed } from 'vue'
import DotesPopUp from './DotesPopUp.vue'
import DoteDetails from './detailsDote.vue'

const { ficha, dotes, dotesCargadas } = defineProps([
    'ficha',
    'dotes',
    'dotesCargadas'
])

function eliminarDote(i) {
    // Elimina la dote en la posición i
    ficha.personaliz.dotes.splice(i, 1, "");
}

function eliminarDoteExtra(i) {
    // Elimina la dote extra en la posición i
    ficha.personaliz.dotesExtra.splice(i, 1);
}

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
<template>
    <section class="feats">
        <div class="tituloYAñadir">
            <h3>
                Dotes ({{ dotesUsados }} / {{ ficha.derivados.cantidadDotes }})
            </h3>
            <div class="botones-dotes">
                <DotesPopUp :dotes="dotes" :ficha="ficha" :extra="true" :posicion="0" />
            </div>
        </div>
        <div class="feats-list">
            <div class="item" v-if="dotesCargadas" v-for="(dote, i) in slotsDote" :key="'normal-' + i">
                <template v-if="dote">
                    <template v-if="doteData(ficha.personaliz.dotes[i])">
                        <DoteDetails :dote="doteData(ficha.personaliz.dotes[i])" @eliminar="eliminarDote(i)" />
                    </template>
                </template>
                <template v-else>
                    <DotesPopUp :dotes="dotes" :ficha="ficha" :extra="false" :posicion="i" />
                </template>

            </div>
        </div>

        <!-- Dotes extra -->
        <div class="feats-list" v-if="ficha.personaliz.dotesExtra.length">
            <h4>Dotes Extra:</h4>

            <div class="item" v-for="(dote, i) in ficha.personaliz.dotesExtra" :key="'extra-' + i">
                <template v-if="doteData(dote)">
                    <DoteDetails :dote="doteData(dote)" @eliminar="eliminarDoteExtra(i)" />
                </template>
                <template v-else>
                    No se han encontrado datos de la Dote {{ dote }}. Se recomienda borrarla.
                    <button @click="eliminarDoteExtra(i)" class="borrar-btn">x</button>
                </template>
            </div>
        </div>

    </section>
</template>

<style scoped>
.feats {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
    padding: 5px;
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;

}

.tituloYAñadir {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.botones-dotes {
    display: flex;
    gap: 10px;
}


.feats-list {
    height: fit-content;
}
</style>