<script setup>
import { ref } from 'vue'
import busquedaHab from './busquedaHab.vue'

const props = defineProps([
    'ficha',
    'habilidades',
    'habilidadesCargadas'
])

const isOpen = ref(false)
const habilidadSeleccionada = ref(null)

function togglePopup() {
    isOpen.value = !isOpen.value
}

function closePopup() {
    isOpen.value = false
    habilidadSeleccionada.value = null
}

function mostrarHab(habilidad) {
    habilidadSeleccionada.value = props.habilidades.find(h => h.nombre === habilidad)
}


function añadirHab() {
    const final = habilidadSeleccionada.value
    if (!final || !props.habilidadesCargadas) return

    if (!props.ficha.pokedex.habilidades.find(hab => hab === final.nombre) &&
        !props.ficha.pokedex.habilidadesOcultas.find(hab => hab === final.nombre) &&
        !props.ficha.personaliz.habilidadesExtra.find(hab => hab === final.nombre)) {
        props.ficha.personaliz.habilidadesExtra.push(final.nombre)
    }

    habilidadSeleccionada.value = null
}
</script>

<template>
    <div>
        <button @click="togglePopup" class="btn">
            Añadir Habilidad
        </button>

        <div v-if="isOpen" class="modal-overlay" @click="closePopup">
            <div class="modal-content" @click.stop>


                <div class="ventana">
                    <div class="cuerpo">
                        <busquedaHab :habilidades="habilidades" @seleccion="mostrarHab" />

                        <div class="preview">
                            <template v-if="habilidadSeleccionada">
                                <div class="tarjetaHab">
                                    <p>{{ habilidadSeleccionada.nombre }}</p>
                                    <div class="descripcion">
                                        <p class="tituloDesc"><strong>Descripción:</strong></p>
                                        <p v-for="parrafo in habilidadSeleccionada.descripcion" v-html="parrafo"></p>
                                    </div>
                                </div>
                                <button @click="añadirHab"
                                    :disabled="ficha.pokedex.habilidades.find(hab => hab === habilidadSeleccionada.nombre) ||
                                        ficha.pokedex.habilidadesOcultas.find(hab => hab === habilidadSeleccionada.nombre) ||
                                        ficha.personaliz.habilidadesExtra.find(hab => hab === habilidadSeleccionada.nombre)">
                                    Añadir</button>
                            </template>
                            <template v-else>
                                <span>Selecciona una Habilidad</span>
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

.tarjetaHab {
    font-size: 10px;
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

.preview button[disabled] {
    background-color: red !important;
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
