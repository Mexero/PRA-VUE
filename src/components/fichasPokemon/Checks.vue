<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import draggable from 'vuedraggable'

import tiraDado from '../tiraDado.vue'

const props = defineProps(['ficha', 'checksBase', 'grados'])

const gradosInicial = ['N', 'B', 'E', 'M', 'L']
const gradoModal = ref({ visible: false, nombre: '', index: null })

//Flags
const mostrarConfigChecks = ref(false)


// ---------- GRADO HOVER ----------
function mostrarGradoModal(nombre, index) {
    gradoModal.value = { visible: true, nombre, index }
}
function ocultarGradoModal() {
    gradoModal.value.visible = false
}

// ---------- DATOS CHECKS ----------
const checksData = computed({
    get: () => props.ficha.checks.checksData || [],
    set: val => props.ficha.checks.checksData = val
})

const mejorasDisponibles = computed(() => {
    return (props.ficha.derivados.cantidadMejorasHab || 0)
        - (props.ficha.personaliz.mejorasHab?.length || 0)
})


// ---------- DETECTAR DISPOSITIVO MÓVIL ----------
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value <= 750)
const updateWindowWidth = () => { windowWidth.value = window.innerWidth }
onMounted(() => window.addEventListener('resize', updateWindowWidth))
onUnmounted(() => window.removeEventListener('resize', updateWindowWidth))


// ---------- TODOS LOS CHECKS PARA CONFIGURACIÓN ----------
const todosLosChecks = computed(() => {
    const mapa = new Map()

    // Base
    for (const c of props.checksBase) {
        if (c.check === 'Init') continue
        mapa.set(c.check, {
            nombre: c.check,
            tipo: 'base',
            stat: c.stat,
            visible: false,
            grado: 0
        })
    }

    for (const c of props.ficha.checks.checksData) {
        if (c.check !== "Init") {
            mapa.set(c.check, {
                nombre: c.check,
                tipo: mapa.has(c.check) ? 'base' : 'personalizado',
                stat: c.stat,
                visible: c.visible,
                grado: c.grado
            })
        }
    }

    return Array.from(mapa.values())
})

function toggleCheck(nombre) {
    const datos = props.ficha.checks.checksData
    const encontrado = datos.find(c => c.check === nombre)

    if (!encontrado) {
        datos.push({
            check: nombre,
            stat: getStat(nombre),
            grado: 0,
            bono: 0,
            visible: true
        })
    } else {
        encontrado.visible = !encontrado.visible
    }
}


function getStat(nombre) {
    const c = props.ficha.checks.checksData.find(x => x.check === nombre)
    if (c) return c.stat
    const d = props.checksBase.find(x => x.check === nombre)
    return d?.stat ?? 'fue'
}


function updateStat(nombre, stat) {
    const c = props.ficha.checks.checksData.find(x => x.check === nombre)
    if (c) c.stat = stat
    else {
        props.ficha.checks.checksData.push({
            check: nombre,
            grado: 0,
            bono: 0,
            stat: getStat(nombre),
            visible: true
        })
    }
}

function getGradoActual(nombre) {
    const c = props.ficha.checks.checksData.find(x => x.check === nombre)
    return c?.grado ?? 0
}

function cambiarGrado(nombre, gradoNuevo) {
    // Si no está en checksData, hay que meterlo
    let check = props.ficha.checks.checksData.find(c => c.check === nombre)
    if (!check) {
        const base = todosLosChecks.value.find(c => c.nombre === nombre)
        check = {
            check: nombre,
            stat: base?.stat ?? 'fue',
            grado: base?.grado ?? 0,
            bono: 0,
            visible: true
        }
        props.ficha.checks.checksData.push(check)
    }

    //Ajustar las mejoras de habilidad
    const mejoras = props.ficha.personaliz.mejorasHab
    const gradosBase = props.ficha.checks.checksBase.find(c => c.check == nombre)?.grado || 0
    const mejorasNecesarias = gradoNuevo - gradosBase

    const mejorasActuales = mejoras.filter(x => x === nombre).length
    const diferencia = mejorasNecesarias - mejorasActuales
    if (diferencia > 0) { for (let i = 0; i < diferencia; i++) { mejoras.push(nombre) } }

    if (diferencia < 0) {
        let porQuitar = Math.abs(diferencia)

        for (let i = mejoras.length - 1; i >= 0 && porQuitar > 0; i--) {
            if (mejoras[i] == nombre) {
                mejoras.splice(i, 1)
                porQuitar--
            }
        }
    }
    check.grado = gradoNuevo
}


const nuevaHabilidadPersonalizada = ref('')

function agregarCheckPersonalizado() {
    const nombre = nuevaHabilidadPersonalizada.value?.trim()
    if (!nombre) return

    const existe = props.ficha.checks.checksData.some(c => c.check === nombre)
    if (existe) return

    props.ficha.checks.checksData.push({
        check: nombre,
        stat: 'fue',
        grado: 0,
        bono: 0,
        visible: true
    })

    nuevaHabilidadPersonalizada.value = ''
}

function eliminarCheckPersonalizado(nombre) {
    const arr = props.ficha.checks.checksData
    const i = arr.findIndex(c => c.check === nombre)
    if (i !== -1) arr.splice(i, 1)
}

function desactivarOpcionGrado(nombre, optionIndex) {
    const min = props.ficha.checks.checksBase.find(c => c.check == nombre)?.grado || 0
    const actual = props.ficha.checks.checksData.find(c => c.check == nombre)?.grado || 0
    const max = (props.ficha.derivados.cantidadMejorasHab - props.ficha.personaliz.mejorasHab.length) + actual
    if (optionIndex < min) return true
    if (optionIndex > max) return true
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
            <draggable v-model="checksData" item-key="check" animation="200" ghost-class="drag-ghost"
                :disabled="isMobile">
                <template #item="{ element, index }">
                    <div class="item" v-if="element.check !== 'Init' && element.visible">

                        <div class="alinear">
                            <p>{{ element.check }} <span class="stat-check">({{ element.stat.toUpperCase() }})</span>
                            </p>
                            <div class="bonosChecks">
                                <div>
                                    <span class="grado-circulo"
                                        @mouseenter="mostrarGradoModal(grados[Math.min(4, element.grado)], index)"
                                        @mouseleave="ocultarGradoModal"
                                        @click="mostrarGradoModal(grados[Math.min(4, element.grado)], index)">
                                        {{ gradosInicial[Math.min(4, element.grado)] }}
                                    </span>
                                    <div v-if="gradoModal.visible && gradoModal.index === index" class="grado-modal">
                                        {{ gradoModal.nombre }}
                                    </div>
                                </div>
                                <div>+<input type="number" v-model.number="element.bono" /></div>

                                <tiraDado :tirada='"1d20+" + (element.bono)' :origin='"Tirada de " + element.check' />
                            </div>
                        </div>
                    </div>
                </template>
            </draggable>
        </div>
    </section>
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
                                :checked="ficha.checks.checksData.find(c => c.check === check.nombre)?.visible"
                                @change="toggleCheck(check.nombre)"
                                :disabled="ficha.checks.checksBase.some(c => c.check === check.nombre)"
                                :class="ficha.checks.checksBase.some(c => c.check === check.nombre) ? 'check-base' : ''" />
                            <span class="skill-name" :class="`skill-${check.tipo}`">
                                {{ check.nombre }}

                            </span>
                            <button
                                v-if="check.tipo === 'personalizado' && !ficha.checks.checksBase.some(c => c.check === check.nombre)"
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
                            <select :value="getGradoActual(check.nombre)"
                                @change="cambiarGrado(check.nombre, $event.target.value)" class="rango-select"
                                :title="`Rango de ${check.nombre}`">
                                <option v-for="(g, i) in grados" :key="g" :value="i"
                                    :disabled="desactivarOpcionGrado(check.nombre, i)">
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

    .check-base {
        background-color: #666 !important;
    }
}
</style>
