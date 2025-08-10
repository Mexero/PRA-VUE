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

<template>
    <section class="others">
        <h3>Otros</h3>
        <div class="others-list">
            <!-- Otros campos readonly -->
            <div class="fila1">
                <div class="item">Dieta: <input v-model="ficha.pokedex.otros.dieta" readonly /></div>
                <div class="item">Tamaño: <input v-model="ficha.pokedex.otros.tamano" readonly /></div>
                <div class="item">Sexo: <input v-model="ficha.pokedex.otros.sexo" readonly /></div>

                <!-- Naturaleza con buscador -->
                <div class="item naturaleza-wrapper" ref="wrapperRef">
                    Naturaleza:
                    <div class="input-container">
                        <input :value="inputNaturaleza" @focus="mostrarLista"
                            @input="actualizarInput($event.target.value)" @keydown.enter.prevent="confirmarNaturaleza"
                            placeholder="Buscar naturaleza..." />
                        <ul v-if="mostrarSugerencias" class="suggestions">
                            <li v-for="(item, index) in resultados" :key="index" @click="seleccionarNaturaleza(item)">
                                {{ item.naturaleza }}
                            </li>
                        </ul>
                    </div>
                    <!--  <button @click="confirmarNaturaleza">Cambiar</button> -->
                </div>

                <div class="item">Teratipo: <input v-model="ficha.personaliz.teratipo" /></div>
            </div>
            <div class="fila2">
                <div class="item item-inline">
                    Sentidos:
                    <input v-model="ficha.derivados.sentidos" readonly
                        :size="Math.max(1,0.84 * String(ficha.derivados.sentidos || '').length)" />
                </div>
                <div class="item item-inline">
                    Evolución:
                    <input v-model="ficha.pokedex.otros.evolucion" readonly
                        :size="Math.max(1, 0.80 * String(ficha.pokedex.otros.evolucion || '').length)" />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.others {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 30px;

}

.fila1 {
    display: flex;
    padding: 5px 0;
    justify-content: space-between;
}

.fila1 input {
    width: 90px;
    text-align: center;
}


.fila2 {
    display: flex;
    gap: 20px;
    max-width: 1350px;
    
}

.item-inline {
    display: flex;
    align-items: center;
    gap: 8px;
    scrollbar-color: var(--color-principal1);
}

.fila2 input {
    overflow-x: auto;
    font-size: medium;
    min-width: 100px;
max-width: 1102px;
}

.input-container {
    display: inline-block;
    position: relative;
}


input {
    font-size: large;
    background-color: transparent;
    padding: 4px;
    border: none;
    border-bottom: 1px solid;
    color: var(--color-texto);
}

.suggestions {
    position: absolute;
    top: 30;
    background-color: var(--color-principal1);
    border: 1px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
    z-index: 20;
    list-style: none;
    padding: 0;
    min-width: 150px;
}

.suggestions li {
    padding: 5px 10px;
    cursor: pointer;
}

.suggestions li:hover {
    background-color: var(--color-principal2);
}

</style>
