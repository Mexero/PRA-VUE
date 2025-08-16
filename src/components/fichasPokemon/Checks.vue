<script setup>
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps(['ficha', 'ChecksBase'])
const emit = defineEmits(['gradoChange'])

const nuevoCheck = ref('')
const mostrarPopup = ref(false)
const selectedSuggestionIndex = ref(-1)

const filteredChecks = computed(() => {
    const input = nuevoCheck.value.toLowerCase()
    if (!input) return props.ChecksBase.map(ch => ch.check)
    return props.ChecksBase
        .map(ch => ch.check)
        .filter(c => c.toLowerCase().includes(input))
        .filter(c => !props.ficha.personaliz.checks.some(ch => ch.check === c))
})

const grados = ['no', 'bueno', 'experto', 'maestro', 'legendario']

function gradoMinimo(checkName) {
    const base = props.ficha.derivados.checksBase.find(c => c.check === checkName)
    return base ? base.grado : 0
}

function gradoActual(checkName) {
    const base = gradoMinimo(checkName)
    const mejoras = props.ficha.personaliz.mejorasHab.filter(m => m === checkName).length
    return Math.min(base + mejoras, grados.length - 1)
}

const mejorasUsadas = computed(() => props.ficha.personaliz.mejorasHab.length)

function subirGrado(checkName) {
    if (gradoActual(checkName) >= grados.length - 1) return
    if (props.ficha.manual.cantidadMejorasHab === true || mejorasUsadas.value < props.ficha.derivados.cantidadMejorasHab) {
        props.ficha.personaliz.mejorasHab.push(checkName)
    }
}

function bajarGrado(checkName) {
    const idx = props.ficha.personaliz.mejorasHab.lastIndexOf(checkName)
    if (idx !== -1) props.ficha.personaliz.mejorasHab.splice(idx, 1)
}

function addCheck() {
    const nombre = nuevoCheck.value.trim()
    if (!nombre) return
    if (props.ficha.personaliz.checks.some(c => c.check === nombre)) {
        nuevoCheck.value = ''
        mostrarPopup.value = false
        return
    }
    const esBase = props.ChecksBase.find(ch => ch.check === nombre)
    props.ficha.personaliz.checks.push({
        check: nombre,
        stat: esBase ? esBase.stat : 'fue',
        grado: 0,
        total: 0,
    })
    nuevoCheck.value = ''
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

function onArrowDown() {
    if (!mostrarPopup.value || filteredChecks.value.length === 0) return
    if (selectedSuggestionIndex.value < filteredChecks.value.length - 1) {
        selectedSuggestionIndex.value++
    }
}

function onArrowUp() {
    if (!mostrarPopup.value || filteredChecks.value.length === 0) return
    if (selectedSuggestionIndex.value > 0) {
        selectedSuggestionIndex.value--
    }
}

function onEnter() {
    if (mostrarPopup.value && selectedSuggestionIndex.value >= 0) {
        selectSuggestion(filteredChecks.value[selectedSuggestionIndex.value])
    } else {
        addCheck()
    }
}

function cerrarPopupExterior() {
    mostrarPopup.value = false
}

function cerrarPopup() {
    mostrarPopup.value = false
}

watch(mostrarPopup, (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
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
            <button @click="mostrarPopup = true">Añadir habilidad</button>
        </div>

        <div class="checks-list">
            <draggable v-model="props.ficha.personaliz.checks" item-key="check" animation="200"
                ghost-class="drag-ghost">
                <template #item="{ element, index }">
                    <div class="item" v-if="element.check !== 'Init'">
                        <div class="alinear">
                            <p>{{ element.check }}</p>
                            <select v-model="element.stat">
                                <option v-for="stat in Object.keys(ficha.derivados.stats)" :key="stat" :value="stat">
                                    {{ stat.toUpperCase() }}
                                </option>
                            </select>
                            <div class="grado-control">
                                <div class="botonMaxMenos">
                                    <button class="btn-mas" @click="subirGrado(element.check)"></button>
                                    <button class="btn-menos" @click="bajarGrado(element.check)"></button>
                                </div>
                                <span>{{ grados[gradoActual(element.check)] }}</span>
                            </div>

                            <label>Total:</label>
                            <input type="number" v-model.number="element.total" />

                        </div>

                        <button class="borrar-btn"
                            v-if="!ficha.derivados.checksBase.find(c => c.check === element.check)"
                            @click="removeCheck(index)">X</button>
                    </div>
                </template>
            </draggable>
        </div>
    </section>

    <!-- Popup para añadir habilidades -->
    <div v-if="mostrarPopup" class="popup-overlay" @click="cerrarPopupExterior">
        <div class="popup-content" @click.stop>
            <h4>Añadir habilidad</h4>
            <input type="text" v-model="nuevoCheck" @input="filterChecks" @keydown.down.prevent="onArrowDown"
                @keydown.up.prevent="onArrowUp" @keydown.enter.prevent="onEnter" placeholder="Buscar check..." />
            <ul v-if="filteredChecks.length">
                <li v-for="(suggestion, idx) in filteredChecks" :key="suggestion"
                    :class="{ selected: idx === selectedSuggestionIndex }"
                    @mousedown.prevent="selectSuggestion(suggestion)">
                    {{ suggestion }}
                </li>
            </ul>
            <button @click="cerrarPopup">Cerrar</button>
        </div>
    </div>
</template>

<style scoped>
.checks {
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
    padding: 5px;
    margin-bottom: 10px;
    justify-content: space-between;
}

.item {
    display: flex;
    align-items: center;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
    justify-content: space-between;
    height: 40px;
    padding-left: 10px;
}

.borrar-btn {
    background-color: transparent;
    border: none;
    color: var(--color-texto);
    cursor: pointer;
    font-weight: bold;
    font-size: 20px;
    line-height: 0px;
    height: 40px;
    width: 40px;
    padding-bottom: 5px;
    background-color: var(--color-principal1);
    border-radius: 0 5px 5px 0;
    padding-top: 5px;
}

.borrar-btn:hover {
    background-color: var(--color-principal2);
}

.alinear {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
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
    padding: 10px;
    width: 100%;
}

.checks-list>div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
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
}

input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
}

.grado-control {
    display: flex;
}

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
    background: var(--color-fondoTexto);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    min-width: 300px;
}
.popup-content input{
    width: 150px;
}
.popup-content ul {
    list-style: none;
    padding: 0;
    margin: 10px 0;
    max-height: 300px;
    overflow-y: auto;
}

.popup-content li {
    padding: 5px 10px;
    cursor: pointer;
}
.popup-content li:hover {
    background-color: var(--color-principal2);
}

.popup-content button{
    background-color: var(--color-principal1);
    border: none;
    color: var(--color-texto);
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
}
.popup-content button:hover{
        background-color: var(--color-principal2);

}
.drag-ghost {
    opacity: 0.5;
    background: var(--color-principal1, #eee);
}

details {
    max-height: 150px;
    overflow-y: auto;
}

.drag-ghost {
    opacity: 0.5;
    background-color: #ccc;
    border: 2px dashed #666;
}

 .checks {
    width: 100%;
}
@media (max-width: 1460px) {
    .checks-list>div {
        display: grid;
        grid-template-columns: 1fr;
        width: 100%;
        gap: 10px;
    }
}

</style>
