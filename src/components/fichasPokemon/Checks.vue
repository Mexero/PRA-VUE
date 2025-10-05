<script setup>
const gradosInicial = ['N', 'B', 'E', 'M', 'L']
const gradoModal = ref({ visible: false, nombre: '', index: null })

function mostrarGradoModal(nombre, event, index) {
    gradoModal.value = {
        visible: true,
        nombre,
        index
    }
}
function ocultarGradoModal() {
    gradoModal.value.visible = false
}
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'

import tiraDado from '../tiraDado.vue'

const props = defineProps(['ficha', 'ChecksBase'])
const emit = defineEmits(['gradoChange'])

const nuevoCheck = ref('')
const mostrarPopup = ref(false)
const selectedSuggestionIndex = ref(-1)
const mostrarConfigChecks = ref(false)

const filteredChecks = computed(() => {
    const input = nuevoCheck.value.toLowerCase()
    if (!input) return props.ChecksBase.map(ch => ch.check)
    return props.ChecksBase
        .map(ch => ch.check)
        .filter(c => c.toLowerCase().includes(input))
        .filter(c => !props.ficha.personaliz.checks.some(ch => ch.check === c))
})

const grados = ['No', 'Bueno', 'Experto', 'Maestro', 'Legendario']

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

function toggleCheck(checkName) {
    const idx = props.ficha.personaliz.checks.findIndex(c => c.check === checkName)
    if (idx === -1) {
        // Añadir check
        const base = props.ChecksBase.find(ch => ch.check === checkName)
        props.ficha.personaliz.checks.push({
            check: checkName,
            stat: base ? base.stat : 'fue',
            grado: 0,
            total: 0,
        })
    } else {
        // Quitar check
        props.ficha.personaliz.checks.splice(idx, 1)
        // Quitar mejoras asociadas
        props.ficha.personaliz.mejorasHab = props.ficha.personaliz.mejorasHab.filter(m => m !== checkName)
    }
}
function getCheckObj(checkName) {
    return props.ficha.personaliz.checks.find(c => c.check === checkName) || { stat: 'fue' }
}
function getStat(checkName) {
    const obj = getCheckObj(checkName)
    return obj.stat || (props.ChecksBase.find(ch => ch.check === checkName)?.stat || 'fue')
}
function updateStat(checkName, newStat) {
    const obj = getCheckObj(checkName)
    if (obj) obj.stat = newStat
}
</script>

<template>
    <section class="checks">
        <div class="checks-header">
            <span>
                <h3>Habilidades</h3>
            </span>
            <button class="settings-btn" @click="mostrarConfigChecks = true" title="Configurar checks">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 9 3.09V3a2 2 0 0 1 4 0v.09c0 .66.39 1.25 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82c.22.63.85 1.05 1.51 1.05H21a2 2 0 0 1 0 4h-.09c-.66 0-1.25.39-1.51 1z" />
                </svg>
            </button>
        </div>
        <div class="checks-list">
            <draggable v-model="props.ficha.personaliz.checks" item-key="check" animation="200"
                ghost-class="drag-ghost">
                <template #item="{ element, index }">
                    <div class="item" v-if="element.check !== 'Init'">

                        <div class="alinear">

                            <p>{{ element.check }} <span class="stat-check">({{ element.stat.toUpperCase() }})</span>
                            </p>

                            <div class="bonosChecks">
                                <div>
                                    <span class="grado-circulo" :title="grados[gradoActual(element.check)]"
                                        @mouseenter="mostrarGradoModal(grados[gradoActual(element.check)], $event, index)"
                                        @mouseleave="ocultarGradoModal"
                                        @click="mostrarGradoModal(grados[gradoActual(element.check)], $event, index)">
                                        {{ gradosInicial[gradoActual(element.check)] }}
                                    </span>
                                    <div v-if="gradoModal.visible && gradoModal.index === index" class="grado-modal">
                                        {{ gradoModal.nombre }}
                                    </div>
                                </div>
                                <div>+<input type="number" v-model.number="element.total" /></div>

                                <tiraDado :tirada='"1d20+" + (element.total)' :origin='"Tirada de " + element.check' />
                            </div>
                        </div>

                        <!--    <button class="borrar-btn"
                            v-if="!ficha.derivados.checksBase.find(c => c.check === element.check)"
                            @click="removeCheck(index)">×</button>
                            -->
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

    <!-- Modal configuración de checks -->
    <div v-if="mostrarConfigChecks" class="config-modal-overlay" @click.self="mostrarConfigChecks = false">
        <div class="config-modal">
            <h4>Configurar Checks</h4>
            <div class="config-checks-list">
                <label v-for="base in ChecksBase" :key="base.check" class="config-check-item">
                    <input type="checkbox"
                        :checked="ficha.personaliz.checks.some(c => c.check === base.check)"
                        @change="toggleCheck(base.check)"
                        :disabled="false"
                    />
                    {{ base.check }}
                    <span class="stat-check">({{ getStat(base.check).toUpperCase() }})</span>
                    <select v-if="ficha.personaliz.checks.some(c => c.check === base.check)"
                        v-model="getCheckObj(base.check).stat"
                        @change="updateStat(base.check, getCheckObj(base.check).stat)"
                        class="stat-select">
                        <option value="fue">Fuerza</option>
                        <option value="agi">Agilidad</option>
                        <option value="res">Resistencia</option>
                        <option value="men">Mente</option>
                        <option value="esp">Espiritu</option>
                        <option value="pre">Presencia</option>
                    </select>
                </label>
            </div>
            <button @click="mostrarConfigChecks = false">Cerrar</button>
        </div>
    </div>
</template>

<style scoped>
.checks {
    display: flex;
    width: 340px;
    flex-direction: column;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
    padding: 2px;
    justify-content: space-between;
}



.item {
    display: flex;
    align-items: center;
    border-radius: 5px;
}

/*
.borrar-btn {
    background-color: transparent;
    border: none;
    color: var(--color-texto);
    cursor: pointer;
    font-weight: bold;
    font-size: 30px;
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
 */
.bonosChecks {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: end;
}

.alinear {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    gap: 10px;
}

.alinear input {
    font-size: large;
    background-color: transparent;
    border: none;
    color: var(--color-texto);
    width: 25px;
    text-align: center;
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
    padding: 5px;
}

.checks-list>div {
    display: flex;
    flex-direction: column;
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

.grado-circulo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--color-principal1);
    color: var(--color-texto);
    cursor: pointer;
}

.grado-circulo:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
    background: var(--color-principal2);
}

.grado-nombre {
    display: block;
    text-align: center;
    margin-top: 2px;
    color: var(--color-texto);
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

.popup-content input {
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

.popup-content button {
    background-color: var(--color-principal1);
    border: none;
    color: var(--color-texto);
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
}

.popup-content button:hover {
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


/*
@media (max-width: 1410px) {
    .checks-list>div {
        display: grid;
        grid-template-columns: 1fr;
        width: 100%;
        gap: 10px;
    }
}

@media screen and (max-width: 545px) {
    .checks {
        width: 340px;
    }

    .movilOff {
        display: none;
    }

    .tituloYBoton {
        display: flex;
        flex-direction: column;

    }
}
*/

.grado-modal {
    background: var(--color-fondoTexto);
    color: var(--color-texto);
    border: 1px solid var(--color-principal2);
    border-radius: 8px;
    padding: 3px 10px;
    white-space: nowrap;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
    z-index: 10;
    position: absolute;
    left: auto;
    transform: translateX(-30%);
    top: auto;
    margin-top: 5px;
}

.stat-check {
    color: var(--color-principal2);
    margin-left: 4px;
}

.checks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 5px;

}

.settings-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    margin-right: 2px;
    color: var(--color-principal2, #3a7);
    transition: color 0.2s;
}

.settings-btn:hover {
    color: var(--color-principal1, #2a5);
}

.config-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.config-modal {
    background: var(--color-fondoTexto);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    min-width: 320px;
}

.config-checks-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 15px;
}

.config-check-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1em;
}

.stat-select {
    margin-left: 6px;
    padding: 2px 6px;
    border-radius: 5px;
    border: 1px solid var(--color-principal2, #3a7);
    background: var(--color-fondoTexto);
    color: var(--color-texto);
    font-size: 0.95em;
}
</style>
