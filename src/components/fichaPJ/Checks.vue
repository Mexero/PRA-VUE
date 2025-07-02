<template>
    <section class="checks">
        <h3>
            Tiradas de habilidad ({{ ficha.personaliz.mejorasHab.length }} / <input type="number"
                v-model="props.ficha.derivados.cantidadMejorasHab" :readonly="!ficha.manual.cantidadMejorasHab" />)
            <input type="checkbox" v-model="ficha.manual.cantidadMejorasHab" />
        </h3>

        <div class="checks-list">
            <template v-for="(check, i) in ficha.personaliz.checks">
                <div v-if="check.check !== 'Init'" class="item" :key="i">
                    <p>{{ check.check }}</p>

                    <select v-model="check.stat">
                        <option v-for="stat in Object.keys(ficha.derivados.stats)" :key="stat" :value="stat">
                            {{ stat.toUpperCase() }}
                        </option>
                    </select>

                    <div class="grado-control">
                        <button @click="bajarGrado(i)" :disabled="gradoActual(check.check) <= gradoMinimo(check.check)"
                            title="Disminuir grado">
                            -
                        </button>

                        <span>{{ grados[gradoActual(check.check)] }}</span>

                        <button @click="subirGrado(i)" :disabled="gradoActual(check.check) >= grados.length - 1 ||
                            mejorasUsadas >= ficha.derivados.cantidadMejorasHab
                            " :title="gradoActual(check.check) >= grados.length - 1
                                ? 'Ya está en el grado máximo'
                                : mejorasUsadas >= ficha.derivados.cantidadMejorasHab
                                    ? 'No quedan mejoras disponibles'
                                    : 'Aumentar grado'
                                ">
                            +
                        </button>
                    </div>

                    <label>Total:</label>
                    <input type="number" v-model.number="check.total" />

                    <button v-if="!ficha.derivados.checksBase.find((ch) => ch.check === check.check)"
                        @click="removeCheck(i)" title="Eliminar check">
                        ✕
                    </button>
                </div>
            </template>

            <div class="item nuevo-check-container">
                <input type="text" v-model="nuevoCheck" placeholder="Añadir nueva habilidad"
                    @keydown.enter.prevent="onEnter" @keydown.down.prevent="onArrowDown" @keydown.up.prevent="onArrowUp"
                    @input="filterChecks" @blur="hideSuggestionsWithDelay" @focus="showSuggestions" />
                <button @click="addCheck">Añadir</button>

                <ul v-if="mostrarSugerencias && filteredChecks.length" class="suggestions-list">
                    <li v-for="(op, idx) in filteredChecks" :key="op" @mousedown.prevent="selectSuggestion(op)"
                        :class="{ selected: idx === selectedSuggestionIndex }">
                        {{ op }}
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>


<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['ficha', 'ChecksBase'])
const emit = defineEmits(['gradoChange'])

const nuevoCheck = ref('')
const filteredChecks = ref([])
const mostrarSugerencias = ref(false)
const selectedSuggestionIndex = ref(-1)

const grados = ['no', 'bueno', 'experto', 'maestro', 'legendario']

function gradoMinimo(checkName) {
    const base = props.ficha.derivados.checksBase.find(c => c.check === checkName)
    if (!base) return 0
    return grados.indexOf(base.grado) || 0
}

function gradoActual(checkName) {
    const base = gradoMinimo(checkName)
    const mejoras = props.ficha.personaliz.mejorasHab.filter(m => m === checkName).length
    const totalGrado = Math.min(base + mejoras, grados.length - 1)

    const check = props.ficha.personaliz.checks.find(ch => ch.check === checkName)
    if (check) {
        check.grado = grados[totalGrado]
    }
    return totalGrado
}

const mejorasUsadas = computed(() => props.ficha.personaliz.mejorasHab.length)

function subirGrado(index) {
    const check = props.ficha.personaliz.checks[index]
    const actualGrado = gradoActual(check.check)

    if (actualGrado >= grados.length - 1) return

    if (mejorasUsadas.value < props.ficha.derivados.cantidadMejorasHab) {
        props.ficha.personaliz.mejorasHab.push(check.check)
    }
}

function bajarGrado(index) {
    const check = props.ficha.personaliz.checks[index]
    const idx = props.ficha.personaliz.mejorasHab.lastIndexOf(check.check)
    if (idx !== -1) {
        props.ficha.personaliz.mejorasHab.splice(idx, 1)
    }
}

function filterChecks() {
    const input = nuevoCheck.value.toLowerCase()
    filteredChecks.value = props.ChecksBase.map(ch => ch.check)
        .filter(c => c.toLowerCase().includes(input))
        .filter(c => !props.ficha.personaliz.checks.some(ch => ch.check === c))

    selectedSuggestionIndex.value = -1
    mostrarSugerencias.value = true
}

function addCheck() {
    if (!nuevoCheck.value.trim()) return

    const existe = props.ficha.personaliz.checks.some(c => c.check === nuevoCheck.value)
    if (existe) {
        nuevoCheck.value = ''
        mostrarSugerencias.value = false
        return
    }

    let esBase = props.ChecksBase.find(ch => ch.check === nuevoCheck.value)
    props.ficha.personaliz.checks.push({
        check: nuevoCheck.value,
        stat: esBase ? esBase.stat : 'fue',
        grado: 'no',
        total: 0,
    })
    nuevoCheck.value = ''
    mostrarSugerencias.value = false
    document.activeElement?.blur()
}

function removeCheck(index) {
    const check = props.ficha.personaliz.checks[index]
    props.ficha.personaliz.mejorasHab = props.ficha.personaliz.mejorasHab.filter(m => m !== check.check)
    props.ficha.personaliz.checks.splice(index, 1)
}

function selectSuggestion(op) {
    nuevoCheck.value = op
    addCheck()
}

function showSuggestions() {
    filterChecks()
    mostrarSugerencias.value = true
}

function hideSuggestionsWithDelay() {
    setTimeout(() => {
        mostrarSugerencias.value = false
    }, 150)
}

function onArrowDown() {
    if (!mostrarSugerencias.value || filteredChecks.value.length === 0) return
    if (selectedSuggestionIndex.value < filteredChecks.value.length - 1) {
        selectedSuggestionIndex.value++
    }
}

function onArrowUp() {
    if (!mostrarSugerencias.value || filteredChecks.value.length === 0) return
    if (selectedSuggestionIndex.value > 0) {
        selectedSuggestionIndex.value--
    }
}

function onEnter() {
    if (mostrarSugerencias.value && selectedSuggestionIndex.value >= 0) {
        selectSuggestion(filteredChecks.value[selectedSuggestionIndex.value])
    } else {
        addCheck()
    }
}
</script>


<style scoped>
.checks-list {
    display: grid;
    grid-template: repeat(4, auto) / repeat(2, 1fr);
    gap: 10px;
}

.item {
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
}

.nuevo-check-container {
    position: relative;
    flex-direction: column;
    width: 200px;
}

.suggestions-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
    z-index: 10;
    margin: 0;
    padding: 0;
    list-style: none;
}

.suggestions-list li {
    padding: 5px 10px;
    cursor: pointer;
}

.suggestions-list li.selected,
.suggestions-list li:hover {
    background-color: #bde4ff;
}

.grado-control {
    display: flex;
    align-items: center;
    gap: 6px;
}

.grado-control button {
    width: 24px;
    height: 24px;
    font-weight: bold;
    cursor: pointer;
}

.grado-control button:disabled {
    cursor: not-allowed;
    opacity: 0.4;
}
</style>
