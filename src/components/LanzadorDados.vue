<template>
    <div class="lanzador-widget" :class="{ abierto }">
        <div class="abrir-cerrar" @click="abierto = !abierto">
            <img src="/assets/icons/d20.svg" alt="d20" width="15" height="15">
        </div>

        <div class="panel">
            <h3>Lanzador de Dados</h3>

            <!-- Tirador manual -->
            <div class="tirador">
                Lanzar:
                <input type="number" v-model.number="numDados" min="1" />

                <select v-model="tipoDado">
                    <option v-for="d in tiposDados" :key="d" :value="d">{{ d }}</option>
                </select>

                +
                <input type="number" v-model.number="modificador" />

                <button
                    @click="tirarManual(`${numDados}${tipoDado}${modificador >= 0 ? '+' : ''}${modificador}`, 'Manual', $event, true)">
                    <img src="/assets/icons/d20.svg" alt="d20">
                </button>
            </div>

            <!-- Historial -->
            <div class="historial-tiradas" ref="historialRef">
                <ul>
                    <li v-for="(tirada, index) in historialTiradas" :key="index" :class="[
                        tirada.tipo,
                        { critico: tirada.roll?.critico },
                        { super: tirada.roll?.efectividad === 'Súper efectivo' },
                        { extremo: tirada.roll?.efectividad === 'Extremadamente efectivo' }
                    ]">
                        <strong>
                            {{ tirada.origin }}
                        </strong>

                        <span :title="tirada.title">
                            {{ tirada.notation }} →
                            <strong>{{ tirada.total }}</strong>
                        </span>

                        <button @click="repetirTirada(tirada, $event)">
                            <img src="/assets/icons/d20.svg" alt="d20">
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const historialTiradas = ref([])

const numDados = ref(1)
const tiposDados = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20']
const tipoDado = ref('d6')
const modificador = ref(0)

const abierto = ref(false)
const historialRef = ref(null)

/* ================================   UTILIDADES   ================================ */

function interpretarTirada(notation) {
    const regex = /^(\d+)d(\d+)(.*)$/i
    const match = notation.match(regex)
    if (!match) throw new Error('Notación inválida')

    const numDados = parseInt(match[1], 10)
    const carasDados = parseInt(match[2], 10)
    let resto = match[3] || ''

    const termRegex = /([+-]+)\s*(\d+)/gi
    let totalMod = 0

    resto.replace(termRegex, (_, signos, num) => {
        const negativo = ((signos.match(/-/g) || []).length % 2) === 1
        totalMod += (negativo ? -1 : 1) * parseInt(num, 10)
    })

    return { numDados, carasDados, modificador: totalMod }
}

/* ================================   TIRADA NORMAL   ================================ */

function lanzarDados(notation) {
    const { numDados, carasDados, modificador } = interpretarTirada(notation)

    const resultados = []
    let total = 0

    for (let i = 0; i < numDados; i++) {
        const r = Math.floor(Math.random() * carasDados) + 1
        resultados.push(r)
        total += r
    }

    total += modificador
    if (modificador) resultados.push(modificador)

    return {
        resultados,
        total,
        title: `${resultados.join(' + ')} = ${total}`
    }
}

/* ================================   TIRADA DE DAÑO   ================================ */

function lanzarDadosDanio({ tirada, critico, efectividad }) {
    const { numDados, carasDados, modificador } = interpretarTirada(tirada)

    let dadosFinales = critico ? numDados * 2 : numDados
    let multDados = 1
    let multFinal = 1

    switch (efectividad) {
        case 'Muy poco efectivo': multFinal = 0.5; break
        case 'Poco efectivo': multDados = 0.5; break
        case 'Súper efectivo': multDados = 2; break
        case 'Extremadamente efectivo': multFinal = 2; break
    }

    const resultados = []
    let suma = 0

    for (let i = 0; i < dadosFinales; i++) {
        const r = Math.floor(Math.random() * carasDados) + 1
        resultados.push(r)
        suma += r
    }

    const total = Math.floor((suma * multDados + modificador) * multFinal)

    let formula = `(${resultados.join(' + ')})`
    if (multDados !== 1) formula = `(${formula} × ${multDados})`
    if (modificador) formula += ` ${modificador >= 0 ? '+' : '-'} ${Math.abs(modificador)}`
    if (multFinal !== 1) formula = `(${formula}) × ${multFinal}`
    formula += ` = ${total}`

    return { resultados, total, formula }
}

/* ================================   HISTORIAL================================ */

function agregarTirada(tirada) {
    historialTiradas.value.push(tirada)
    nextTick(() => {
        if (historialRef.value) {
            historialRef.value.scrollTop = historialRef.value.scrollHeight
        }
    })
}

/* ================================   REPETIR================================ */

function repetirTirada(tirada, event) {
    const img = event?.currentTarget?.querySelector('img')
    if (img) spinImage(img, 600)

    const roll = tirada.roll

    if (roll.kind === 'danio') {
        const r = lanzarDadosDanio(roll)

        agregarTirada({
            tipo: 'danio',
            origin: tirada.origin,
            notation: roll.tirada,
            total: r.total,
            title: r.formula,
            roll
        })
    } else {
        const r = lanzarDados(roll.notation)

        agregarTirada({
            tipo: 'normal',
            origin: tirada.origin,
            notation: roll.notation,
            total: r.total,
            title: r.title,
            roll
        })
    }
}

/* ================================   MENSAJES EXTERNOS   ================================ */

function manejarMensaje(evento) {
    const m = evento.data
    if (!m || m.type !== 'lanzarDados') return

    if (!abierto.value) abierto.value = true

    if (m.tirada && m.efectividad !== undefined) {
        const r = lanzarDadosDanio({
            tirada: m.tirada,
            critico: m.critico,
            efectividad: m.efectividad
        })

        agregarTirada({
            tipo: 'danio',
            origin: m.origin,
            notation: m.tirada,
            total: r.total,
            title: r.formula,
            roll: {
                kind: 'danio',
                tirada: m.tirada,
                critico: m.critico,
                efectividad: m.efectividad
            }
        })
    }

    else if (m.dice) {
        const r = lanzarDados(m.dice)

        agregarTirada({
            tipo: 'normal',
            origin: m.origin,
            notation: m.dice,
            total: r.total,
            title: r.title,
            roll: {
                kind: 'normal',
                notation: m.dice
            }
        })
    }
}

/* ================================   MANUAL================================ */

function tirarManual(
    notation,
    origin = 'Manual',
    event = null,
    deLanzador = false,
    critico = false,
    efectividad = null
) {
    if (event && deLanzador) {
        spinImage(event.currentTarget.querySelector('img'), 600)
    }

    if (efectividad !== null) {
        const r = lanzarDadosDanio({ tirada: notation, critico, efectividad })

        agregarTirada({
            tipo: 'danio',
            origin,
            notation,
            total: r.total,
            title: r.formula,
            roll: {
                kind: 'danio',
                tirada: notation,
                critico,
                efectividad
            }
        })
    } else {
        const r = lanzarDados(notation)

        agregarTirada({
            tipo: 'normal',
            origin,
            notation,
            total: r.total,
            title: r.title,
            roll: {
                kind: 'normal',
                notation
            }
        })
    }
}

function spinImage(img, duration) {
    img.classList.add('spinning')
    setTimeout(() => img.classList.remove('spinning'), duration)
}

onMounted(() => window.addEventListener('message', manejarMensaje))
onUnmounted(() => window.removeEventListener('message', manejarMensaje))
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

/* Animación crítica */
@keyframes critFlash {
    0% {
        background: #ff000033;
    }

    100% {
        background: transparent;
    }
}

@keyframes superGlow {
    0% {
        box-shadow: 0 0 5px gold;
    }

    100% {
        box-shadow: 0 0 20px gold;
    }
}

li.critico {
    animation: critFlash 0.6s ease-in-out;
}

li.super {
    animation: superGlow 0.6s ease-in-out;
}

li.extremo {
    animation: superGlow 0.6s ease-in-out;
    background: #ff990022;
}

/* Spin */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.spinning {
    animation: spin 0.6s linear;
}

.historial-tiradas {
    max-height: 200px;
    overflow-y: auto;
}
</style>
