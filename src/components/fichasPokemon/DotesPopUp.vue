<script setup>
import { ref, watch } from 'vue'
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

// Prevenir scroll del body cuando el modal está abierto
watch(isOpen, (newValue) => {
    if (newValue) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

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
            + Añadir Dote {{ props.extra ? 'Extra' : '' }}
        </button>

        <div v-if="isOpen" class="modal-overlay" @click="closePopup">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h2 class="modal-title">Añadir Dote {{ props.extra ? 'Extra' : '' }}</h2>
                    <button @click="closePopup" class="close-header-btn" title="Cerrar">×</button>
                </div>

                <div class="modal-body">
                    <div class="search-panel">
                        <busquedaDote :dotes="dotes" @seleccion="mostrarDote" />
                    </div>

                    <div class="info-panel">
                        <template v-if="doteSeleccionada">
                            <div class="dote-header">
                                <h3 class="dote-nombre">{{ doteSeleccionada.Nombre }}</h3>
                            </div>
                            <div class="dote-descripcion-container">
                                <div class="dote-descripcion">
                                    <BloqueTextoComplejo :dato="doteSeleccionada.Descripcion" />
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="empty-state">
                                <p>Selecciona una dote para ver su información</p>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="modal-footer">
                  
                    <button @click="closePopup" class="cancel-btn">Cerrar</button>
                    <button @click="añadirDote" class="add-btn" :disabled="!doteSeleccionada">
                        Añadir Dote
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn {
    margin: 5px 0;
    padding: 8px 16px;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
}

.btn:hover {
    background-color: var(--color-principal2);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}


.modal-content {
    background-color: var(--color-fondoTexto);
    width: 80vw;
    max-width: 1000px;
    height: 80vh;
    border-radius: 12px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}



.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: linear-gradient(135deg, var(--color-principal2), var(--color-principal1));
    border-bottom: 2px solid var(--color-principal1);
}

.modal-title {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-texto);
    letter-spacing: 0.5px;
}

.close-header-btn {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-texto);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
}

.close-header-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.modal-body {
    display: flex;
    overflow: hidden;
}

.search-panel {
    display: flex;
    flex-direction: column;
    border-right: 2px solid var(--color-principal2);
}

.info-panel {

    display: flex;
    flex-direction: column;
    background: var(--color-fondoTexto);
}

.dote-header {
    flex-shrink: 0;
    padding: 8px 12px 0 12px;
    border-bottom: 2px solid var(--color-principal2);
    background: var(--color-fondoTexto);
}

.dote-nombre {
    margin-bottom: 10px;
    font-size: 20px;
    color: var(--color-texto);
    letter-spacing: 0.5px;
}

.dote-descripcion-container {

    overflow-y: auto;
    min-height: 0;
    padding: 20px;
}

.dote-descripcion {
    line-height: 1.6;
    color: var(--color-texto);
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    text-align: center;
    color: var(--color-texto);
    opacity: 0.7;
    padding: 20px;
}

.empty-state p {
    margin: 0;
    font-size: 16px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 10px;
    background: var(--color-fondoTexto);
    border-top: 2px solid var(--color-principal2);
}

.add-btn {
    background-color: #4caf50;
    color: var(--color-texto);
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
 
}

.add-btn:hover:not(:disabled) {
    background-color: #3e9442;
}

.add-btn:disabled {
    background-color: #9e9e9e !important;
    cursor: not-allowed;
}

.cancel-btn {
    background-color: var(--color-principal1);
    color: var(--color-texto);
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.cancel-btn:hover {
    background-color: var(--color-principal2);
}



@media screen and (max-width: 600px) {
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100dvh;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        width: 100vw;
        height: 100dvh;
        border-radius: 0;
        display: flex;
        flex-direction: column;
    }

    .modal-header {
        padding: 5px 10px;
    }

    .modal-title {
        font-size: 1.2rem;
    }

    .modal-body {
        flex-direction: column-reverse;
        flex: 1;
        overflow: hidden;
    }

    .search-panel {
        width: 100%;
        height: 50%;
        border-right: none;
        border-bottom: 1px solid var(--color-principal2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .info-panel {
        width: 100%;
        height: 50%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .dote-header {
        padding: 16px 16px 0 16px;
    }

    .dote-descripcion-container {
        padding: 16px;
        flex: 1;
        overflow-y: auto;
        min-height: 0;
    }

    .modal-footer {
        padding: 10px;
        flex-shrink: 0;
        background: var(--color-fondoTexto);
        border-top: 2px solid var(--color-principal2);
    }

    .add-btn,
    .cancel-btn {
        width: 100%;
        padding: 10px 20px;
    }
}
</style>
