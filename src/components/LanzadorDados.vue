<template>
    <div class="lanzador-widget" :class="{ abierto }">
        <div class="abrir-cerrar" @click="abierto = !abierto" role="button" aria-label="Abrir/Cerrar lanzador">
            <img src="/assets/icons/d20.svg" alt="d20" width="15" height="15">
        </div>
        <div class="panel">
            <h3>Lanzador de Dados</h3>
            <!-- Tirador manual -->
            <div class="tirador">
                Lanzar:
                <input type="number" v-model.number="numDados" min="0" max="100" />

                <select v-model="tipoDado">
                    <option v-for="d in tiposDados" :key="d" :value="d">{{ d }}</option>
                </select>
                +
                <input type="number" v-model.number="modificador" />
                <button
                    @click="tirarManual(`${numDados}${tipoDado}${modificador >= 0 ? '+' : ''}${modificador}`, 'Manual', $event, true)"
                    type="button" aria-label="Lanzar manual">
                    <img src="/assets/icons/d20.svg" alt="d20">
                </button>
            </div>

            <!-- Historial de tiradas -->
            <div class="historial-tiradas" ref="historialRef">
                <ul>
                    <li v-for="(tirada, index) in historialTiradas" :key="index">
                        <template v-if="tirada.origin === 'Manual'">
                            <strong>{{ tirada.origin }}</strong>
                            <span>{{ tirada.notation }} →
                                <span :title="tirada.results.join(' + ')">{{ tirada.total }} </span>
                            </span>
                            <button @click="tirarManual(tirada.notation, tirada.origin, $event)" type="button"
                                aria-label="Repetir tirada">
                                <img src="/assets/icons/d20.svg" alt="d20">
                            </button>
                        </template>
                        <div v-else>
                            <div><strong>{{ tirada.origin }}</strong></div>
                            <span>{{ tirada.notation }} →
                                <span :title="tirada.results.join(' + ')">{{ tirada.total }} </span>
                                <button @click="tirarManual(tirada.notation, tirada.origin, $event)" type="button"
                                    aria-label="Repetir tirada">
                                    <img src="/assets/icons/d20.svg" alt="d20">
                                </button>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const historialTiradas = ref([])

// Tirador manual
const numDados = ref(1)
const tiposDados = ['d4', 'd6', 'd10', 'd12', 'd20']
const tipoDado = ref('d6')
const modificador = ref(0)

// Estado de abrir/cerrar panel
const abierto = ref(false)

const historialRef = ref(null)


function interpretarTirada(notation) {
    const regex = /^(\d+)d(\d+)(.*)$/i
    const match = notation.match(regex)
    if (!match) throw new Error("Notación de dados inválida")

    const numDados = parseInt(match[1], 10)
    const carasDados = parseInt(match[2], 10)
    let resto = match[3] || ""

    const termRegex = /([+-]+)\s*(\d+)(?:\s*[xX×*]\s*(\d+))?/gi
    let totalMod = 0

    resto.replace(termRegex, (_, signos, num, mult) => {
        const signoNegativo = ((signos.match(/-/g) || []).length % 2) === 1
        const signo = signoNegativo ? -1 : 1
        const valor = parseInt(num, 10)
        const multiplicador = mult ? parseInt(mult, 10) : 1
        totalMod += signo * valor * multiplicador
        return ""
    })

    const notacionFinal =
        totalMod === 0
            ? `${numDados}d${carasDados}`
            : `${numDados}d${carasDados}${totalMod >= 0 ? "+" : ""}${totalMod}`

    return { numDados, carasDados, modificador: totalMod, notacionFinal }
}
function lanzarDados(notation) {
    const { numDados, carasDados, modificador, notacionFinal } = interpretarTirada(notation)
    const resultados = []
    let total = 0

    for (let i = 0; i < numDados; i++) {
        const tirada = Math.floor(Math.random() * carasDados) + 1
        resultados.push(tirada)
        total += tirada
    }

    total += modificador
    if (modificador) resultados.push(modificador)

    return { resultados, total, notation: notacionFinal }
}

function agregarTirada(tirada) {
    historialTiradas.value.push(tirada)

    nextTick(() => {
        if (historialRef.value) {
            historialRef.value.scrollTop = historialRef.value.scrollHeight
        }
    })
}


function tirarManual(notation, origen = null, event = null, deLanzador = false) {
    if (event && event.currentTarget && deLanzador) {
        const img = event.currentTarget.querySelector('img')
        spinImage(img, 600)
    }

    const { resultados, total, notation: notacionFinal } = lanzarDados(notation)
    agregarTirada({
        origin: origen || 'Manual',
        notation: notacionFinal,
        results: resultados,
        total
    })
}

function spinImage(img, duration = 600) {
    if (!img) return
    img.classList.remove('spinning')
    void img.offsetWidth
    img.classList.add('spinning')
    setTimeout(() => {
        img.classList.remove('spinning')
    }, duration)
}

function manejarMensaje(evento) {
    const mensaje = evento.data
    if (!mensaje || mensaje.type !== "lanzarDados") return

    if (!abierto.value) abierto.value = true
    const { origin, dice } = mensaje
    try {
        const { resultados, total, notation: notacionFinal } = lanzarDados(dice)
        agregarTirada({
            origin,
            notation: notacionFinal,
            results: resultados,
            total
        })
    } catch (error) {
        console.error("Error al lanzar los dados:", error.message)
    }
}

// Montar y desmontar oyente de eventos
onMounted(() => {
    window.addEventListener('message', manejarMensaje)
})

onUnmounted(() => {
    window.removeEventListener('message', manejarMensaje)
})
</script>

<style scoped>
.lanzador-widget {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 300px;
    transition: transform 0.3s;
    transform: translateY(100%);
    z-index: 9999;
    font-family: sans-serif;
}

.lanzador-widget.abierto {
    transform: translateY(0);
}

.abrir-cerrar {
    position: absolute;
    top: -30px;
    right: 0;
    background: var(--color-principal1);
    padding: 5px 10px;
    border-radius: 8px 8px 0 0;
    cursor: pointer;
    font-weight: bold;
    user-select: none;
}

.abrir-cerrar img {
    width: 15px;
    height: 15px;
    display: inline-block;
}

.panel {
    background: var(--color-fondo);
    border: 1px solid #8c8c8c;
    border-radius: 8px 0 0 0;
    padding: 1rem;
    color: var(--color-texto);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.tirador {
    margin-bottom: 1rem;
}

.tirador select,
.tirador input {
    margin-right: 0.3rem;
}

input[type="number"] {
    color: var(--color-texto);
    width: 3ch;
    border: none;
    border-bottom: 1px solid #555;
    background: transparent;
    padding: 2px;
    font-size: 0.9rem;
    text-align: center;
    outline: none;
}

input[type="number"]:focus {
    border-bottom: 1px solid #000;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

select {
    color: var(--color-texto);
    border: none;
    border-bottom: 1px solid #555;
    background: transparent;
    padding: 2px;
    font-size: 0.9rem;
    text-align: center;
    outline: none;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
}

select option {
    color: initial;
}

select option:focus {
    color: initial;
}

select:focus {
    border-bottom: 1px solid #000;
}

select {
    background-image: linear-gradient(45deg, transparent 50%, #555 50%),
        linear-gradient(135deg, #555 50%, transparent 50%);
    background-position: right 6px top 50%, right 0 top 50%;
    background-size: 6px 6px, 6px 6px;
    background-repeat: no-repeat;
    padding-right: 16px;
}

input[type="number"] {
    -moz-appearance: textfield;
}

button {
    width: 1.5em;
    height: 1.5em;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

button img {
    width: 1em;
    height: 1em;
    display: inline-block;
    transform-origin: center center;
    will-change: transform;
    filter: var(--color-icon);
}

.historial-tiradas {
    color: var(--color-texto);
    max-height: 200px;
    overflow-y: auto;
    margin-top: 0.5rem;
    border-top: 1px solid #ccc;
    padding-right: 4px;
}

.historial-tiradas ul {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    list-style: none;
    padding-left: 0;
    margin: 0;
}

.historial-tiradas li {
    background-color: var(--color-fondo);
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0.4rem 0.6rem;
    margin: 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.1s;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@-webkit-keyframes spin {
    to {
        -webkit-transform: rotate(360deg);
    }
}

.spinning {
    animation: spin 0.6s linear;
    -webkit-animation: spin 0.6s linear;
}
</style>
