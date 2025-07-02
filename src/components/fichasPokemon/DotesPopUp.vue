<script setup>
import { ref } from 'vue'
import busquedaDote from './busquedaDote.vue'
import BloqueTextoComplejo from '../BloqueTextoComplejo.vue';


const props = defineProps([
    'ficha',
    'dotes',
    'extra',
    'posicion'
])

const isOpen = ref(false)
const doteSeleccionada = ref(null)

function togglePopup() {
    isOpen.value = !isOpen.value
}

function closePopup() {
    isOpen.value = false
    doteSeleccionada.value = null
}

function mostrarDote(dote) {
    doteSeleccionada.value = props.dotes.find(d => d.Nombre === dote)
}

function añadirDote() {
    const final = doteSeleccionada.value
    if (!final) return
    if (props.extra) {
        props.ficha.personaliz.dotesExtra.push(final.Nombre)
    }
    else {
        props.ficha.personaliz.dotes[props.posicion] = final.Nombre
    }

    doteSeleccionada.value = null
}
</script>

<template>
    <div>
        <button @click="togglePopup" class="btn">
            Añadir Dote {{ props.extra ? 'Extra' : '' }}
        </button>

        <div v-if="isOpen" class="modal-overlay" @click="closePopup">
            <div class="modal-content" @click.stop>
                <div class="ventana">
                    <div class="cuerpo">
                        <busquedaDote :dotes="dotes" @seleccion="mostrarDote" />

                        <div class="preview">
                            <template v-if="doteSeleccionada">
                                <div class="tarjetaDote">
                                    <p>{{ doteSeleccionada.Nombre }}</p>
                                    <BloqueTextoComplejo :dato="doteSeleccionada.Descripcion" />
                                </div>
                                <button @click="añadirDote">
                                    Añadir</button>
                            </template>
                            <template v-else>
                                <span>Selecciona una Dote</span>
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

.tarjetaDote {
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
