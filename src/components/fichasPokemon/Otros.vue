<template>
    <section class="others">
        <h3>Otros</h3>
        <div class="others-list">
            <!-- Otros campos readonly -->
            <div class="item">Dieta: <input v-model="ficha.pokedex.otros.dieta" readonly /></div>
            <div class="item">Tamaño: <input v-model="ficha.pokedex.otros.tamano" readonly /></div>
            <div class="item">Sexo: <input v-model="ficha.pokedex.otros.sexo" readonly /></div>
            <div class="item">Sentidos: <input v-model="ficha.derivados.sentidos" readonly /></div>

            <!-- Naturaleza con buscador -->
            <div class="item naturaleza-wrapper" ref="wrapperRef">
                Naturaleza:
                <div class="input-container">
                    <input :value="inputNaturaleza" @focus="mostrarLista" @input="actualizarInput($event.target.value)"
                        @keydown.enter.prevent="confirmarNaturaleza" placeholder="Buscar naturaleza..." />
                    <ul v-if="mostrarSugerencias" class="suggestions">
                        <li v-for="(item, index) in resultados" :key="index" @click="seleccionarNaturaleza(item)">
                            {{ item.naturaleza }}
                        </li>
                    </ul>
                </div>
                <button @click="confirmarNaturaleza">Cambiar</button>
            </div>

            <div class="item">Teratipo: <input v-model="ficha.personaliz.teratipo" /></div>
            <div class="item">
                Evolución:
                <textarea v-model="ficha.pokedex.otros.evolucion" readonly></textarea>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const { ficha, naturalezas } = defineProps(['ficha', 'naturalezas'])

const inputNaturaleza = ref('')
const mostrarSugerencias = ref(false)
const resultados = ref([])
const wrapperRef = ref(null)

function sincronizarInputConFicha() {
    inputNaturaleza.value = ficha.personaliz.naturaleza?.naturaleza || ''
}

sincronizarInputConFicha()

watch(() => ficha.personaliz.naturaleza, () => {
    sincronizarInputConFicha()
}, { deep: true })

function mostrarLista() {
    filtrarNaturalezas()
    mostrarSugerencias.value = true
}

function filtrarNaturalezas() {
    const texto = inputNaturaleza.value.toLowerCase()
    resultados.value = texto
        ? naturalezas.filter(n => n.naturaleza.toLowerCase().includes(texto))
        : [...naturalezas]
}

function actualizarInput(valor) {
    inputNaturaleza.value = valor
    filtrarNaturalezas()
}

function confirmarNaturaleza() {
    const encontrada = naturalezas.find(
        n => n.naturaleza.toLowerCase() === inputNaturaleza.value.toLowerCase()
    )
    if (encontrada) {
        seleccionarNaturaleza(encontrada)
    } else {
        mostrarSugerencias.value = false
        quitarFoco()
    }
}

function seleccionarNaturaleza(item) {
    ficha.personaliz.naturaleza = {
        naturaleza: item.naturaleza,
        check: item.check
    }
    inputNaturaleza.value = item.naturaleza
    resultados.value = []
    mostrarSugerencias.value = false
    quitarFoco()
}

function quitarFoco() {
    if (document && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
    }
}

// Cerrar sugerencias si clic fuera del wrapper
function clickFuera(event) {
    if (wrapperRef.value && !wrapperRef.value.contains(event.target)) {
        mostrarSugerencias.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', clickFuera)
})
onBeforeUnmount(() => {
    document.removeEventListener('click', clickFuera)
})
</script>

<style scoped>
.others-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.others-list div {
    width: 18%;
}

.item {
    flex: 1 1 30%;
    min-width: 150px;
    position: relative;
}

.naturaleza-wrapper {
    position: relative;
}

.input-container {
    display: inline-block;
    position: relative;
    width: 200px;
    margin-left: 5px;
}

.input-container input {
    width: 100%;
    box-sizing: border-box;
    padding: 5px;
}

.suggestions {
    position: absolute;
    top: 0;
    left: 100%;
    margin-left: 5px;
    background: white;
    border: 1px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
    z-index: 20;
    list-style: none;
    padding: 0;
    width: 180px;
}

.suggestions li {
    padding: 5px 10px;
    cursor: pointer;
}

.suggestions li:hover {
    background-color: #bde4ff;
}

button {
    margin-left: 10px;
    cursor: pointer;
    padding: 5px 10px;
}
</style>
