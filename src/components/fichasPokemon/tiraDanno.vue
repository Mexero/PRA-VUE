<script setup>
import { ref } from 'vue'

const props = defineProps({
    tirada: String,
    origin: String,
    tipoDaño: String,
    critico: {
        type: Number,
        default: 20
    }
})

const mostrarModal = ref(false)
const efectividad = ref('Normal')
const esCritico = ref(false)

const opcionesEfectividad = [
    'Muy poco efectivo',
    'Poco efectivo',
    'Normal',
    'Súper efectivo',
    'Extremadamente efectivo'
]

function enviarTirada() {
    window.postMessage({
        type: 'lanzarDados',
        origin: props.origin,
        tirada: props.tirada,
        critico: esCritico.value,
        efectividad: efectividad.value
    })
    mostrarModal.value = false
}
</script>

<template>
    <div class="tira-dano-container">
        <button class="tira-btn" @click="mostrarModal = true" title="Tirar daño">
            <img class="icono-danio" src="/assets/icons/explosion.svg" alt="Daño" :class="{}" />
        </button>

        <!-- Modal -->
        <div v-if="mostrarModal" class="modal-overlay" @click.self="mostrarModal = false">
            <div class="modal">
                <h4>Configurar tirada</h4>
                <button class="close-btn" @click="mostrarModal = false">×</button>

                <!-- Efectividad -->
                <div class="modal-section">
                    <label>Efectividad:</label>
                    <select v-model="efectividad">
                        <option v-for="op in opcionesEfectividad" :key="op">{{ op }}</option>
                    </select>
                </div>

                <!-- Crítico -->
                <div class="modal-section checkbox-inline">
                    <input type="checkbox" v-model="esCritico" />
                    <label>Crítico</label>
                </div>

                <!-- Acciones -->
                <div class="modal-actions">
                    <button @click="enviarTirada">Confirmar</button>
                    <button @click="mostrarModal = false">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.icono-danio {
    width: 20px;
    height: 20px;
    display: inline-block;
    transform-origin: center center;
    will-change: transform;
    filter: var(--color-icon);
}

/* ====== Botón principal ====== */
.tira-btn {
    background: none;
    color: var(--color-texto);
    border: none;
    border-radius: 5px;
    padding: 4px 8px;
    cursor: pointer;
}

/* ====== Overlay y modal ====== */
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.35);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
}

.modal {
    background-color: var(--color-fondoTexto);
    padding: 20px;
    border-radius: 10px;
    min-width: 280px;
    position: relative;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    border: none;
    background: none;
    font-size: 20px;
    cursor: pointer;
}

/* ====== Secciones ====== */
.modal-section {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
}

.modal-section label {
    margin-bottom: 5px;
    font-weight: 500;
}

/* Checkbox inline */
.modal-section.checkbox-inline {
    flex-direction: row;
    align-items: center;
    gap: 8px;
}

.modal-section input[type="checkbox"] {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid var(--color-principal2);
    accent-color: var(--color-principal1);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.modal-section input[type="checkbox"]:hover {
    transform: scale(1.1);
}

/* ====== Select mejorado ====== */
.modal-section select {
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid var(--color-principal2);
    background-color: var(--color-fondoTexto);
    color: var(--color-texto);
    font-size: 0.95em;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20fill='none'%20stroke='%23333'%20stroke-width='2'%20viewBox='0%200%204%205'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cpath%20d='M0%200l2%202%202-2'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 12px;
}

.modal-section select:focus {
    outline: 2px solid var(--color-principal1);
    border-color: var(--color-principal1);
}

/* ====== Botones del modal ====== */
.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 15px;
}

.modal-actions button {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

/* Confirmar */
.modal-actions button:first-child {
    background-color: var(--color-principal1);
    color: var(--color-texto);
}

.modal-actions button:first-child:hover {
    background-color: var(--color-principal2);
}

/* Cancelar */
.modal-actions button:last-child {
    background-color: var(--color-fondoTexto);
    color: var(--color-texto);
    border: 1px solid var(--color-principal2);
}

.modal-actions button:last-child:hover {
    background-color: var(--color-principal2);
    color: var(--color-texto);
}
</style>