<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
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

// Prevenir scroll del body cuando el modal está abierto
watch(isOpen, (newValue) => {
    if (newValue) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

// Asegurar que el scroll se restaure cuando el componente se destruye
onBeforeUnmount(() => {
    if (isOpen.value) {
        document.body.style.overflow = ''
    }
})

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
            Añadir Habilidad Extra
        </button>

        <div v-if="isOpen" class="modal-overlay" @click="closePopup">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h2 class="modal-title">Añadir Habilidad Extra</h2>
                    <button @click="closePopup" class="close-header-btn" title="Cerrar">×</button>
                </div>

                <div class="modal-body">
                    <div class="search-panel">
                        <busquedaHab :habilidades="habilidades" @seleccion="mostrarHab" />
                    </div>

                    <div class="info-panel">
                        <template v-if="habilidadSeleccionada">
                            <div class="habilidad-header">
                                <h3 class="habilidad-nombre">{{ habilidadSeleccionada.nombre }}</h3>
                            </div>
                            <div class="habilidad-descripcion-container">
                                <div class="habilidad-descripcion">
                                    <p v-for="parrafo in habilidadSeleccionada.descripcion" v-html="parrafo"></p>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="empty-state">
                                <p>Selecciona una habilidad para ver su información</p>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="modal-footer">

                    <button @click="closePopup" class="cancel-btn">Cerrar</button>
                    <button @click="añadirHab" class="add-btn" :disabled="!habilidadSeleccionada ||
                        ficha.pokedex.habilidades.find(hab => hab === habilidadSeleccionada?.nombre) ||
                        ficha.pokedex.habilidadesOcultas.find(hab => hab === habilidadSeleccionada?.nombre) ||
                        ficha.personaliz.habilidadesExtra.find(hab => hab === habilidadSeleccionada?.nombre)">
                        Añadir Habilidad
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn {
    padding: 8px 16px;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    border: none;
    border-radius: 6px;
    cursor: pointer;
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
    z-index: 100;
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
    padding: 5px 15px;
    background: linear-gradient(135deg, var(--color-principal2), var(--color-principal1));
    border-bottom: 2px solid var(--color-principal1);
}

.modal-title {
    margin: 0;
    font-size: 18px;
    color: var(--color-texto);
    letter-spacing: 0.5px;
}

.close-header-btn {
    background: rgba(255, 255, 255, 0.219);
    color: var(--color-texto);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
}

.close-header-btn:hover {
    background: rgba(255, 255, 255, 0.5);
}

.modal-body {
    flex: 1;
    display: flex;
    overflow: hidden;

}

.search-panel {
    width: 40%;
    display: flex;
    flex-direction: column;
    border-right: 2px solid var(--color-principal2);
}

.info-panel {
    display: flex;
    flex-direction: column;
    background: var(--color-fondoTexto);
    width: 60%;
}


.habilidad-header {
    padding: 8px 12px 0 12px;
    border-bottom: 2px solid var(--color-principal2);
    background: var(--color-fondoTexto);
}

.habilidad-nombre {
    margin-bottom: 10px;
    font-size: 20px;
    color: var(--color-texto);
    letter-spacing: 0.5px;

}

.habilidad-descripcion-container {
    overflow-y: auto;
    min-height: 0;
    padding: 20px;
}

.habilidad-descripcion {
    line-height: 1.6;
    color: var(--color-texto);
}

.habilidad-descripcion p {
    margin-bottom: 12px;
    font-size: 16px;
}

.habilidad-descripcion p:last-child {
    margin-bottom: 0;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
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
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
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
        font-size: 18px;
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

    .habilidad-header {
        padding: 16px 16px 0 16px;
    }

    .habilidad-descripcion-container {
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
