<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['ficha', 'ChecksBase'])
const emit = defineEmits(['gradoChange'])

const nuevoCheck = ref('')
const filteredChecks = ref([])
const mostrarPopup = ref(false)
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

function subirGrado(checkName) {
    const actualGrado = gradoActual(checkName)
    if (actualGrado >= grados.length - 1) return
    if (props.ficha.manual.cantidadMejorasHab === true || mejorasUsadas.value < props.ficha.derivados.cantidadMejorasHab) {
        props.ficha.personaliz.mejorasHab.push(checkName)
    }
}

function bajarGrado(checkName) {
    const idx = props.ficha.personaliz.mejorasHab.lastIndexOf(checkName)
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
    mostrarPopup.value = false
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

function getCheck(checkName) {
    let check = props.ficha.personaliz.checks.find(ch => ch.check === checkName)
    if (!check) {
        return {
            check: checkName,
            stat: props.ChecksBase.find(ch => ch.check === checkName)?.stat || 'fue',
            grado: 'no',
            total: 0,
        }
    }
    return check
}

// Computed para mostrar solo las habilidades base con grado > 'no'
const habilidadesBaseMostradas = computed(() => {
    return props.ChecksBase.filter(checkBase => {
        const grado = grados[gradoActual(checkBase.check)]
        return grado !== 'no' && props.ficha.derivados.checksBase.some(cb => cb.check === checkBase.check)
    })
})
</script>


<template>
    <section class="checks">
        <div class="tituloYBoton">
            <h3>
                Tiradas de habilidad ({{ ficha.personaliz.mejorasHab.length }} /
                <input type="number" v-model="props.ficha.derivados.cantidadMejorasHab"
                    :readonly="!ficha.manual.cantidadMejorasHab" />)
                <input type="checkbox" v-model="ficha.manual.cantidadMejorasHab" true-value="true"
                    false-value="false" />
            </h3>
            <button @click="mostrarPopup.value = true">Añadir habilidad</button>
        </div>

        <div class="checks-list">
            <template v-for="checkBase in habilidadesBaseMostradas" :key="checkBase.check">
                <div class="item">
                    <p>{{ checkBase.check }}</p>
                    <select v-model="getCheck(checkBase.check).stat">
                        <option v-for="stat in Object.keys(ficha.derivados.stats)" :key="stat" :value="stat">
                            {{ stat.toUpperCase() }}
                        </option>
                    </select>
                    <div class="grado-control">
                        <div class="botonMaxMenos">
                            <button class="btn-mas" @click="subirGrado(checkBase.check)"></button>
                            <button class="btn-menos" @click="bajarGrado(checkBase.check)"></button>
                        </div>
                        <span>{{ grados[gradoActual(checkBase.check)] }}</span>
                    </div>
                    <div>
                        <label>Total:</label>
                        <input type="number" v-model.number="getCheck(checkBase.check).total" />
                    </div>
                </div>
            </template>
        </div>

        <!-- Popup para añadir habilidades -->
        <div v-if="mostrarPopup.value" class="popup-overlay">
            <div class="popup-content">
                <h4>Añadir habilidad</h4>
                <input type="text" v-model="nuevoCheck.value" @input="filterChecks" @keydown.down.prevent="onArrowDown"
                    @keydown.up.prevent="onArrowUp" @keydown.enter.prevent="onEnter"
                    placeholder="Buscar habilidad..." />
                <ul v-if="filteredChecks.value.length">
                    <li v-for="(suggestion, idx) in filteredChecks.value" :key="suggestion"
                        :class="{ selected: idx === selectedSuggestionIndex.value }"
                        @mousedown.prevent="selectSuggestion(suggestion)">
                        {{ suggestion }}
                    </li>
                </ul>
                <button @click="mostrarPopup.value = false">Cerrar</button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.checks {
    display: flex;
    align-items: center;
    flex-direction: column;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
    padding: 5px;
}

.tituloYBoton {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
}

.tituloYBoton button {
    padding: 5px;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.checks-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    gap: 10px;
    padding: 10px;
}

.item {
    display: flex;
    align-items: center;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
    padding: 5px;
    gap: 10px;
}

input {
    font-size: large;
    background-color: transparent;
    padding: 4px;
    border: none;
    border-bottom: 1px solid;
    color: var(--color-texto);
    width: 30px;
    text-align: center;
}

.botonMaxMenos {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-right: 5px;
}

.botonMaxMenos button {
    width: 10px;
    height: 10px;
    background: var(--color-principal1);
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    border: none;
}

.btn-menos {
    cursor: pointer;
    transform: rotate(180deg);
}

.btn-mas {
    cursor: pointer;
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

.grado-control {
    display: flex;

}

/* Estilos para el popup */
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.popup-content {
    background: var(--color-fondo, #fff);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    min-width: 300px;
}

.popup-content h4 {
    margin-top: 0;
}

.popup-content ul {
    list-style: none;
    padding: 0;
    margin: 10px 0;
    max-height: 150px;
    overflow-y: auto;
}

.popup-content li {
    padding: 5px 10px;
    cursor: pointer;
}

.popup-content li.selected {
    background: var(--color-principal1, #eee);
    font-weight: bold;
}

details {
    max-height: 150px;
    /* o el valor que prefieras */
    overflow-y: auto;
}
</style>
