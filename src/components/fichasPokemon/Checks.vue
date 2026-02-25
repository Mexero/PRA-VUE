<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import draggable from 'vuedraggable'
import tiraDado from '../tiraDado.vue'

const props = defineProps(['ficha', 'ChecksBase'])
const emit = defineEmits(['gradoChange'])

const gradosInicial = ['N', 'B', 'E', 'M', 'L']
const gradoModal = ref({ visible: false, nombre: '', index: null })

function mostrarGradoModal(nombre, index) {
    gradoModal.value = { visible: true, nombre, index }
}
function ocultarGradoModal() { gradoModal.value.visible = false }

const nuevoCheck = ref('')
const mostrarPopup = ref(false)
const selectedSuggestionIndex = ref(-1)
const mostrarConfigChecks = ref(false)
const nuevaHabilidadPersonalizada = ref('')

const grados = ['No', 'Bueno', 'Experto', 'Maestro', 'Legendario']

// ---------- FILTRAR CHECKS DISPONIBLES PARA AGREGAR ----------
const filteredChecks = computed(() => {
    const input = nuevoCheck.value.toLowerCase()
    const usados = props.ficha.checks.checksActivos.map(c => c)
    return props.ChecksBase.map(c => c.check)
        .filter(c => !usados.includes(c))
        .filter(c => !input || c.toLowerCase().includes(input))
})

// ---------- TODOS LOS CHECKS PARA CONFIGURACIÓN ----------
const todosLosChecks = computed(() => {
    const checks = []
    // Base visibles
    props.ficha.checks.checksBase.forEach(c => {
        if (c.check !== 'Init') {
            checks.push({
                nombre: c.check,
                tipo: 'base',
                stat: getStat(c.check)
            })
        }
    })
    // Activos (otros que no sean Init)
    props.ficha.checks.checksActivos.forEach(c => {
        if (c !== 'Init' && !checks.some(x => x.nombre === c)) {
            checks.push({ nombre: c, tipo: 'activo', stat: getStat(c) })
        }
    })
    return checks
})

// ---------- FUNCIONES GRADO ----------
function getGradoBase(checkName) {
    if (checkName === 'Init') return 1
    const base = props.ficha.checks.checksBase.find(c => c.check === checkName)
    return base ? base.grado : 0
}

function getGradoActual(checkName) {
    const gradoBase = getGradoBase(checkName)
    const mejoras = props.ficha.personaliz.mejorasHab.filter(m => m === checkName).length
    return Math.min(gradoBase + mejoras, grados.length - 1)
}

// ---------- MEJORAS ----------
const mejorasUsadas = computed(() => props.ficha.personaliz.mejorasHab.length)
const mejorasDisponibles = computed(() => {
    const total = props.ficha.derivados.cantidadMejorasHab || 0
    return Math.max(0, total - mejorasUsadas.value)
})

// ---------- DETECTAR DISPOSITIVO MÓVIL ----------
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value <= 750)
const updateWindowWidth = () => { windowWidth.value = window.innerWidth }
onMounted(() => window.addEventListener('resize', updateWindowWidth))
onUnmounted(() => window.removeEventListener('resize', updateWindowWidth))

// ---------- AGREGAR CHECK ----------
function addCheck(nombre) {
    const name = nombre?.trim() || nuevoCheck.value.trim()
    if (!name) return
    if (props.ficha.checks.checksActivos.includes(name)) return
    props.ficha.checks.checksActivos.push(name)
    nuevoCheck.value = ''
    mostrarPopup.value = false
}

function selectSuggestion(op) { addCheck(op) }
function onArrowDown() { if (selectedSuggestionIndex.value < filteredChecks.value.length - 1) selectedSuggestionIndex.value++ }
function onArrowUp() { if (selectedSuggestionIndex.value > 0) selectedSuggestionIndex.value-- }
function onEnter() { if (selectedSuggestionIndex.value >= 0) selectSuggestion(filteredChecks.value[selectedSuggestionIndex.value]); else addCheck() }
function cerrarPopupExterior() { mostrarPopup.value = false }
function cerrarPopup() { mostrarPopup.value = false }

watch(mostrarPopup, isOpen => { document.body.style.overflow = isOpen ? 'hidden' : '' })

// ---------- TOGGLE CHECK VISUAL ----------
function toggleCheck(checkName) {
    const idx = props.ficha.checks.checksActivos.indexOf(checkName)
    if (idx === -1) props.ficha.checks.checksActivos.push(checkName)
    else props.ficha.checks.checksActivos.splice(idx, 1)
}

// ---------- CONFIGURACIÓN HABILIDAD ----------
function getConfiguracionHabilidad(checkName) {
    if (!props.ficha.personaliz.configuracionHabilidades) props.ficha.personaliz.configuracionHabilidades = {}
    if (!props.ficha.personaliz.configuracionHabilidades[checkName]) {
        props.ficha.personaliz.configuracionHabilidades[checkName] = {
            stat: props.ChecksBase.find(ch => ch.check === checkName)?.stat || 'fue',
            grado: getGradoBase(checkName)
        }
    }
    return props.ficha.personaliz.configuracionHabilidades[checkName]
}

function getCheckObj(checkName) {
    const activo = props.ficha.checks.checksActivos.includes(checkName)
    return activo ? { stat: getStat(checkName), grado: getGradoActual(checkName) } : getConfiguracionHabilidad(checkName)
}

function getStat(checkName) {
    return getCheckObj(checkName).stat || 'fue'
}

function updateStat(checkName, newStat) {
    const config = getConfiguracionHabilidad(checkName)
    config.stat = newStat
}

// ---------- CHECKS PERSONALIZADOS ----------
function agregarCheckPersonalizado() {
    const nombre = nuevaHabilidadPersonalizada.value.trim()
    if (!nombre || props.ficha.checks.checksActivos.includes(nombre)) return
    props.ficha.checks.checksActivos.push(nombre)
    nuevaHabilidadPersonalizada.value = ''
}

function eliminarCheckPersonalizado(nombre) {
    const idx = props.ficha.checks.checksActivos.indexOf(nombre)
    if (idx !== -1) props.ficha.checks.checksActivos.splice(idx, 1)
    props.ficha.personaliz.mejorasHab = props.ficha.personaliz.mejorasHab.filter(m => m !== nombre)
}

// ---------- GRADOS EN CONFIG ----------
function getGradoMinimo(checkName) { return getGradoBase(checkName) }
function getGradoActualConfig(checkName) { return getConfiguracionHabilidad(checkName).grado }

function isRangoOptionDisabled(checkName, optionIndex) {
    const min = getGradoMinimo(checkName)
    const actual = getGradoActualConfig(checkName)
    const gradoBase = getGradoBase(checkName)
    const max = grados.length - 1
    if (optionIndex === 0) return false
    if (optionIndex < min) return true
    if (optionIndex > max) return true
    if (optionIndex <= actual) return false
    const puntosNecesarios = Math.max(0, optionIndex - gradoBase)
    const puntosActuales = props.ficha.personaliz.mejorasHab.filter(m => m === checkName).length
    return Math.max(0, puntosNecesarios - puntosActuales) > mejorasDisponibles.value
}

function onChangeRango(checkName, targetIndex) {
    let objetivo = parseInt(targetIndex)
    if (isNaN(objetivo)) return

    const min = getGradoMinimo(checkName)
    const max = grados.length - 1
    const actual = getGradoActualConfig(checkName)
    const gradoBase = getGradoBase(checkName)
    const config = getConfiguracionHabilidad(checkName)

    // Permitir 0
    if (objetivo === 0) {
        props.ficha.personaliz.mejorasHab = props.ficha.personaliz.mejorasHab.filter(m => m !== checkName)
        config.grado = 0
        return
    }

    objetivo = Math.max(min, Math.min(max, objetivo))
    if (objetivo === actual) return

    const puntosNecesarios = Math.max(0, objetivo - gradoBase)
    let puntosActuales = props.ficha.personaliz.mejorasHab.filter(m => m === checkName).length

    // Ajustar mejoras
    if (puntosNecesarios > puntosActuales) {
        const aPoner = Math.min(puntosNecesarios - puntosActuales, mejorasDisponibles.value)
        for (let i = 0; i < aPoner; i++) props.ficha.personaliz.mejorasHab.push(checkName)
    } else if (puntosNecesarios < puntosActuales) {
        let aQuitar = puntosActuales - puntosNecesarios
        while (aQuitar > 0) {
            const idx = props.ficha.personaliz.mejorasHab.lastIndexOf(checkName)
            if (idx === -1) break
            props.ficha.personaliz.mejorasHab.splice(idx, 1)
            aQuitar--
        }
    }

    config.grado = gradoBase + props.ficha.personaliz.mejorasHab.filter(m => m === checkName).length
}
</script>

<template>
    <section class="checks">
        <div class="checks-header">
            <span>
                <h3>Tiradas de Habilidad</h3>
            </span>
            <div class="header-buttons">
                <div class="mejoras-disponibles" v-if="mejorasDisponibles > 0"
                    :title="`Mejoras disponibles: ${mejorasDisponibles}`">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-secundario)"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                    <span class="mejoras-numero">{{ mejorasDisponibles }}</span>
                </div>
                <button class="settings-btn" @click="mostrarConfigChecks = true" title="Configurar checks">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-secundario)"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 9 3.09V3a2 2 0 0 1 4 0v.09c0 .66.39 1.25 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82c.22.63.85 1.05 1.51 1.05H21a2 2 0 0 1 0 4h-.09c-.66 0-1.25.39-1.51 1z" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="checks-list">
            <draggable v-model="props.ficha.personaliz.checks" item-key="check" animation="200" ghost-class="drag-ghost"
                :disabled="isMobile">
                <template #item="{ element, index }">
                    <div class="item" v-if="element.check !== 'Init'">

                        <div class="alinear">
                            <p>{{ element.check }} <span class="stat-check">({{ element.stat.toUpperCase() }})</span>
                            </p>
                            <div class="bonosChecks">
                                <div>
                                    <span class="grado-circulo" :title="grados[getGradoActual(element.check)]"
                                        @mouseenter="mostrarGradoModal(grados[getGradoActual(element.check)], $event, index)"
                                        @mouseleave="ocultarGradoModal"
                                        @click="mostrarGradoModal(grados[getGradoActual(element.check)], $event, index)">
                                        {{ gradosInicial[getGradoActual(element.check)] }}
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
            <div class="config-modal-header">
                <h4>Configurar Habilidades</h4>
                <button class="close-btn" @click="mostrarConfigChecks = false" aria-label="Cerrar">×</button>
            </div>

            <div class="config-modal-content">
                <div class="config-checks-list">
                    <div v-for="check in todosLosChecks" :key="check.nombre" class="config-check-item">
                        <div class="skill-info">
                            <input type="checkbox"
                                :checked="ficha.personaliz.checks.some(c => c.check === check.nombre)"
                                @change="toggleCheck(check.nombre)" :disabled="false" />
                            <span class="skill-name" :class="`skill-${check.tipo}`">
                                {{ check.nombre }}

                            </span>
                            <button v-if="check.tipo === 'personalizado'"
                                @click="eliminarCheckPersonalizado(check.nombre)" class="delete-btn"
                                title="Eliminar check personalizado">×</button>
                        </div>
                        <div class="skill-controls">
                            <select :value="getStat(check.nombre)"
                                @change="updateStat(check.nombre, $event.target.value)" class="stat-select">
                                <option value="fue">Fuerza</option>
                                <option value="agi">Agilidad</option>
                                <option value="res">Resistencia</option>
                                <option value="men">Mente</option>
                                <option value="esp">Espíritu</option>
                                <option value="pre">Presencia</option>
                            </select>
                            <select :value="getGradoActualConfig(check.nombre)"
                                @change="onChangeRango(check.nombre, $event.target.value)" class="rango-select"
                                :title="`Rango de ${check.nombre}`">
                                <option v-for="(g, i) in grados" :key="g" :value="i"
                                    :disabled="isRangoOptionDisabled(check.nombre, i)">
                                    {{ g }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <!-- Sección para añadir checks personalizados -->
                <div class="add-custom-skill">
                    <h5>Añadir Habilidades</h5>
                    <div class="custom-skill-input">
                        <input type="text" v-model="nuevaHabilidadPersonalizada" placeholder="Nombre de la Habilidad..."
                            @keydown.enter="agregarCheckPersonalizado" />
                        <button @click="agregarCheckPersonalizado" class="add-btn">+</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
h3 {
    letter-spacing: 1px;
}

.checks {
    display: flex;
    width: fit-content;
    min-width: 330px;
    flex-direction: column;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
    padding: 0;
    height: 100%;
    max-height: 400px;
    overflow: hidden;
}

.item {
    display: flex;
    align-items: center;
    border-radius: 5px;
}

.bonosChecks {
    display: flex;
    align-items: center;
    white-space: nowrap;
}

.alinear {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    gap: 10px;
    text-align: left;
    padding: 5px 0 4px 0;
    font-size: 16px;
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
    padding: 0px 8px;
    overflow-y: auto;
    flex: 1;
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
    margin-right: 5px;
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
    padding: 8px;
    background: var(--color-fondoTexto);
    border-bottom: 1px solid rgba(150, 150, 150, 0.3);
    position: sticky;
    top: 0;
    flex-shrink: 0;
}

.header-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
}

.mejoras-disponibles {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px;
    border: 1px solid var(--color-secundario);
    border-radius: 6px;
    cursor: default;
}

.mejoras-numero {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-secundario);
    min-width: 16px;
    text-align: center;
}

.settings-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    margin-right: 2px;
    color: var(--color-principal2);
}

.settings-btn:hover {
    color: var(--color-principal2);
}

.config-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.config-modal {
    background: var(--color-fondoTexto);
    border-radius: 10px;
    box-shadow: 0 2px 10px lch(0% 0 0 / 0.301);
    min-width: 400px;
    max-width: 500px;
    max-height: 80vh;
    position: relative;
    display: flex;
    flex-direction: column;
}

.config-modal-header {
    padding: 15px 20px;
    border-bottom: 1px solid rgba(150, 150, 150, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    position: relative;
}

.config-modal-header h4 {
    margin: 0;
    color: var(--color-texto);
}

.config-modal-content {
    padding: 15px 20px;
    overflow-y: auto;
    flex: 1;
}

.config-checks-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 15px;
}

.add-custom-skill {
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid var(--color-principal1);
}

.add-custom-skill h5 {
    margin: 0 0 8px 0;
    color: var(--color-texto);
    font-size: 14px;
}

.custom-skill-input {
    display: flex;
    gap: 8px;
    align-items: center;
}

.custom-skill-input input {
    flex: 1;
    padding: 6px 8px;
    border: 1px solid var(--color-principal2);
    border-radius: 4px;
    background: var(--color-fondoTexto);
    color: var(--color-texto);
    font-size: 14px;
}

.add-btn {
    background: var(--color-principal1);
    color: var(--color-texto);
    border: none;
    border-radius: 4px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.add-btn:hover {
    background: var(--color-principal2);
}


.config-check-item {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    font-size: 1em;
}

.skill-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.skill-name {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 6px;
}


.delete-btn {
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.delete-btn:hover {
    background: #ff3742;
}

.skill-controls {
    display: flex;
    gap: 8px;
    align-items: center;
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

.close-btn {
    background: none;
    border: none;
    color: var(--color-texto);
    font-size: 20px;
    cursor: pointer;
    line-height: 1;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.close-btn:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.rango-select {
    margin-left: 6px;
    padding: 2px 6px;
    border-radius: 5px;
    border: 1px solid var(--color-principal1);
    background: var(--color-fondoTexto);
    color: var(--color-texto);
    font-size: 0.95em;
}

@media screen and (max-width: 1040px) {
    .checks {
        display: flex;
        width: fit-content;
        min-width: 330px;
        flex-direction: column;
        border: 1px solid rgba(150, 150, 150, 0.798);
        border-radius: 10px;
        padding: 0;
        height: 100%;
        max-height: none;
        overflow: hidden;
    }
}

@media screen and (max-width: 750px) {
    .checks {
        display: flex;
        width: fit-content;
        min-width: 100%;
        flex-direction: column;
        border: 1px solid rgba(150, 150, 150, 0.798);
        border-radius: 10px;
        padding: 0;
        height: 100%;
        max-height: none;
        overflow: hidden;
    }

    .alinear {
        font-size: 20px;
        padding: 5px 0;
    }

    .alinear input {
        font-size: 20px;
    }

    .grado-circulo {
        width: 30px;
        height: 30px;
    }

    button {
        width: 40px;
        height: 40px;
    }

    .checks-header {
        font-size: 16px;
    }
}
</style>
