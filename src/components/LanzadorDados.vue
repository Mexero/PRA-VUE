<template>
    <div class="lanzador-widget" :class="{ abierto }">
        <!-- Pestañita lateral -->
        <div class="abrir-cerrar" @click="abierto = !abierto">
            🎲
        </div>

        <!-- Panel -->
        <div class="panel">
            <h2>Lanzador de Dados</h2>

            <!-- Tirador manual -->
            <div class="tirador">
                <h3>Tirador manual</h3>
                Lanzar:
                <select v-model.number="numDados">
                    <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>

                <select v-model="tipoDado">
                    <option v-for="d in tiposDados" :key="d" :value="d">{{ d }}</option>
                </select>
                +
                <input type="number" v-model.number="modificador" style="width: 50px;" />
                <button
                    @click="tirarManual(`${numDados}${tipoDado}${modificador >= 0 ? '+' : ''}${modificador}`)">🎲</button>
            </div>

            <!-- Historial de tiradas -->
            <div class="historial-tiradas" ref="historialRef">
                <ul>
                    <li v-for="(tirada, index) in historialTiradas" :key="index">
                        <strong>{{ tirada.origin }}</strong>: <em>{{ tirada.notation }}</em> Total:
                        <span :title="tirada.results.join(' + ')">{{ tirada.total }}</span>
                        <button @click="tirarManual(tirada.notation)">🎲</button>
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

// Referencia al contenedor del historial
const historialRef = ref(null)

function interpretarTirada(notation) {
    const regex = /^(\d+)d(\d+)([+-]\d+)?$/i
    const match = notation.match(regex)
    if (!match) throw new Error('Notación de dados inválida')

    const numDados = parseInt(match[1])
    const carasDados = parseInt(match[2])
    const modificador = match[3] ? parseInt(match[3]) : 0

    return { numDados, carasDados, modificador }
}

function lanzarDados(notation) {
    const { numDados, carasDados, modificador } = interpretarTirada(notation)
    const resultados = []
    let total = 0
    for (let i = 0; i < numDados; i++) {
        const tirada = Math.floor(Math.random() * carasDados) + 1
        resultados.push(tirada)
        total += tirada
    }
    total += modificador
    if (modificador) resultados.push(modificador)
    return { resultados, total }
}

function agregarTirada(tirada) {
    historialTiradas.value.push(tirada)

    nextTick(() => {
        if (historialRef.value) {
            historialRef.value.scrollTop = historialRef.value.scrollHeight
        }
    })
}

function tirarManual(notation) {
    const { resultados, total } = lanzarDados(notation)
    agregarTirada({
        origin: 'Manual',
        notation,
        results: resultados,
        total
    })
}

function manejarMensaje(evento) {
    const mensaje = evento.data
    if (!mensaje || mensaje.type !== 'lanzarDados') return

    if (!abierto.value) abierto.value = true
    const { origin, dice } = mensaje
    try {
        const { resultados, total } = lanzarDados(dice)
        agregarTirada({
            origin,
            notation: dice,
            results: resultados,
            total
        })
    } catch (error) {
        console.error('Error al lanzar los dados:', error.message)
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
/* Contenedor flotante */
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

/* Pestañita lateral */
.abrir-cerrar {
    position: absolute;
    top: -30px;
    right: 0;
    background: #f39c12;
    color: white;
    padding: 5px 10px;
    border-radius: 8px 8px 0 0;
    cursor: pointer;
    font-weight: bold;
    user-select: none;
}

/* Panel */
.panel {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px 8px 0 0;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

/* Tirador manual */
.tirador {
    margin-bottom: 1rem;
}

.tirador select,
.tirador input {
    margin-right: 0.3rem;
}

/* Botones */
button {
    margin-left: 0.3rem;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    border: 1px solid #999;
    cursor: pointer;
    background: #3498db;
    color: white;
}

/* Historial de tiradas */
.historial-tiradas {
    max-height: 200px;
    overflow-y: auto;
    margin-top: 0.5rem;
    border-top: 1px solid #ccc;
    padding-right: 4px;
}

/* Scroll fino: Chrome/Edge/Safari */
.historial-tiradas::-webkit-scrollbar {
    width: 6px;
}

.historial-tiradas::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
}

.historial-tiradas::-webkit-scrollbar-thumb {
    background-color: #3498db;
    border-radius: 3px;
    border: 1px solid #f0f0f0;
}

.historial-tiradas::-webkit-scrollbar-thumb:hover {
    background-color: #2980b9;
}

/* Scroll fino: Firefox */
.historial-tiradas {
    scrollbar-width: thin;
    scrollbar-color: #3498db #f0f0f0;
}

/* Lista como tarjetas */
.historial-tiradas li {
    background: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0.4rem 0.6rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.1s;
}

.historial-tiradas li:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.historial-tiradas li button {
    margin-left: 0.5rem;
    padding: 0.2rem 0.5rem;
    font-size: 0.85rem;
}

/* Última tirada arriba */
.historial-tiradas ul {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    list-style: none;
    padding-left: 0;
    margin: 0;
}
</style>
