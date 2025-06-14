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
            <div class="item" v-for="(dote, i) in slotsNormales" :key="'normal-' + i">
                <template v-if="dote">
                    <input v-model="ficha.personaliz.dotes[i]" />
                    <button @click="eliminarDote(i)" class="borrar-btn">X</button>
                </template>
                <template v-else>
                    <div>
                        <input v-model="busquedasNormales[i].valor" placeholder="Buscar dote..."
                            @focus="busquedasNormales[i].mostrar = true" @blur="ocultarConDelay(i)"
                            @keydown.enter.prevent="seleccionarDote(i)" />
                        <ul v-if="busquedasNormales[i].mostrar && sugerenciasNormales(i).length" class="sugerencias">
                            <li v-for="d in sugerenciasNormales(i)" :key="d.Nombre"
                                @mousedown.prevent="seleccionarDote(i, d.Nombre)">
                                {{ d.Nombre }}
                            </li>
                        </ul>
                    </div>
                </template>
            </div>
        </div>

        <!-- Dotes extra -->
        <div class="feats-list" v-if="ficha.manual.dotesExtra">
            <h4>Dotes Extra</h4>
            <div class="item" v-for="(dote, i) in ficha.personaliz.dotesExtra" :key="'extra-' + i">
                <input v-model="ficha.personaliz.dotesExtra[i]" />
                <button @click="eliminarDoteExtra(i)" class="borrar-btn">X</button>
            </div>

            <div class="item">
                <input v-model="busquedaExtra.valor" placeholder="Buscar dote extra..."
                    @focus="busquedaExtra.mostrar = true" @blur="ocultarExtraConDelay"
                    @keydown.enter.prevent="seleccionarDoteExtra" />
                <ul v-if="busquedaExtra.mostrar && sugerenciasExtra.length" class="sugerencias">
                    <li v-for="d in sugerenciasExtra" :key="'extra-' + d.Nombre"
                        @mousedown.prevent="seleccionarDoteExtra(d.Nombre)">
                        {{ d.Nombre }}
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps(['ficha', 'dotes'])
const ficha = props.ficha
const dotes = props.dotes

const slotsNormales = computed(() => {
    const total = ficha.derivados.cantidadDotes
    const actuales = ficha.personaliz.dotes
    return [...actuales, ...Array(total - actuales.length).fill("")]
})

const busquedasNormales = ref([])

watch(slotsNormales, (nuevos) => {
    busquedasNormales.value = nuevos.map((_, i) =>
        busquedasNormales.value[i] || { valor: '', mostrar: false }
    )
}, { immediate: true })

function sugerenciasNormales(index) {
    const texto = busquedasNormales.value[index].valor.toLowerCase()
    const usados = [...ficha.personaliz.dotes, ...(ficha.personaliz.dotesExtra || [])]
    return dotes.filter(
        d => d.Nombre.toLowerCase().includes(texto) && !usados.includes(d.Nombre)
    )
}

function seleccionarDote(index, nombre = null) {
    const final = nombre || sugerenciasNormales(index)[0]?.Nombre
    if (!final) return
    ficha.personaliz.dotes[index] = final
    busquedasNormales.value[index].valor = ''
    busquedasNormales.value[index].mostrar = false
}

function eliminarDote(index) {
    ficha.personaliz.dotes[index] = ''
}

function ocultarConDelay(index) {
    setTimeout(() => busquedasNormales.value[index].mostrar = false, 200)
}

// ======== Extra ========

const busquedaExtra = ref({ valor: '', mostrar: false })

const sugerenciasExtra = computed(() => {
    const texto = busquedaExtra.value.valor.toLowerCase()
    const usados = [...ficha.personaliz.dotes, ...(ficha.personaliz.dotesExtra || [])]
    return dotes.filter(
        d => d.Nombre.toLowerCase().includes(texto) && !usados.includes(d.Nombre)
    )
})

function seleccionarDoteExtra(nombre = null) {
    const final = nombre || sugerenciasExtra.value[0]?.Nombre
    if (!final) return
    if (!ficha.personaliz.dotesExtra.includes(final)) {
        ficha.personaliz.dotesExtra.push(final)
    }
    busquedaExtra.value.valor = ''
    busquedaExtra.value.mostrar = false
}

function eliminarDoteExtra(index) {
    ficha.personaliz.dotesExtra.splice(index, 1)
}

function ocultarExtraConDelay() {
    setTimeout(() => busquedaExtra.value.mostrar = false, 200)
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
