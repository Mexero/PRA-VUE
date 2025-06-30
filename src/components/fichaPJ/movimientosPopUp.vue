<script setup>
import { ref } from 'vue'
import busquedaMov from './busquedaMov.vue'

const props = defineProps([
    'ficha',
    'movimientos',
    'movimientosCompletos'
])

const isOpen = ref(false)
const añadirExtra = ref(false)
const movimientoSeleccionado = ref(null)

function togglePopup() {
    isOpen.value = !isOpen.value
}

function closePopup() {
    isOpen.value = false
    movimientoSeleccionado.value = null
}

function manejarSeleccion(nombre) {
    movimientoSeleccionado.value = nombre
}

function manejarSugerencias(lista) {
    if (lista.length > 0) {
        movimientoSeleccionado.value = lista[0]
    } else {
        movimientoSeleccionado.value = null
    }
}

function añadirMovimiento() {
    const final = movimientoSeleccionado.value
    if (!final) return

    if (!props.ficha.personaliz.movimientosAprendidos.includes(final)) {
        props.ficha.personaliz.movimientosAprendidos.push(final)
    }

    if (añadirExtra.value && !props.ficha.personaliz.movimientosExtra.includes(final)) {
        props.ficha.personaliz.movimientosExtra.push(final)
    }

    movimientoSeleccionado.value = null
}
</script>

<template>
    <div>
        <button @click="togglePopup" class="btn">
            Añadir movimiento
        </button>

        <div v-if="isOpen" class="modal-overlay" @click="closePopup">
            <div class="modal-content" @click.stop>
                <label>
                    ¿Extra? <input type="checkbox" v-model="añadirExtra" />
                </label>

                <div class="ventana">
                    <div class="cuerpo">
                        <busquedaMov :movimientos="movimientos" @seleccion="manejarSeleccion"
                            @sugerencias="manejarSugerencias" />

                        <div class="preview">
                            <template v-if="movimientoSeleccionado">
                                <span>{{ movimientoSeleccionado }}</span>
                                <button @click="añadirMovimiento">Añadir</button>
                            </template>
                            <template v-else>
                                <span>Selecciona un movimiento</span>
                            </template>
                        </div>
                    </div>
                </div>

                <button @click="closePopup" class="close-btn">Cerrar</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn {
    padding: 10px 16px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-content {
    background: white;
    width: 75vw;
    height: 75vh;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.ventana {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    overflow: hidden;
}

.cuerpo {
    display: flex;
    gap: 16px;
    height: 100%;
}

.preview {
    width: 200px;
    background: #f9f9f9;
    border: 1px solid #bbb;
    border-radius: 6px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
}

.preview button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    align-self: flex-end;
}

.preview button:hover {
    background-color: #3e9442;
}

.close-btn {
    margin-top: 20px;
    padding: 8px 12px;
    background-color: #e11d48;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>
