<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
    ficha: Object,
    mostrarMenuConfiguracion: Boolean
})
const emit = defineEmits(['update:mostrarMenuConfiguracion'])

const mostrarInterno = ref(props.mostrarMenuConfiguracion)

watch(() => props.mostrarMenuConfiguracion, (val) => {
    copiarModificadores(props.ficha.modificadores, ajustesConfiguracion)
    mostrarInterno.value = val
})

// Recursos y constantes
const statLabels = { fue: 'Fuerza', agi: 'Agilidad', res: 'Resistencia', men: 'Mente', esp: 'Espíritu', pre: 'Presencia' }
const velocidadKeys = ['Caminado', 'Trepado', 'Excavado', 'Nado', 'Vuelo', 'Levitado']

// Reactive para ajustes
const ajustesConfiguracion = reactive({
    pvMax: 0,
    ppMax: 0,
    vit: 0,
    bh: 0,
    evasion: 0,
    mejorasHab: 0,
    stats: { fue: 0, agi: 0, res: 0, men: 0, esp: 0, pre: 0 },
    velocidades: { Caminado: 0, Trepado: 0, Excavado: 0, Nado: 0, Vuelo: 0, Levitado: 0 }
})

// Función para copiar modificadores (profundamente)
function copiarModificadores(source, target) {
    Object.assign(target, source)
    target.stats = { ...source.stats }
    target.velocidades = { ...source.velocidades }
}

// Cerrar menú
function cerrarMenuConfiguracion() {
    mostrarInterno.value = false
    emit('update:mostrarMenuConfiguracion', false)
}

// Reiniciar cambios
function reiniciarCambiosConfiguracion() {
    copiarModificadores(props.ficha.modificadores, ajustesConfiguracion)
}

// Guardar cambios
function guardarCambiosConfiguracion() {
    copiarModificadores(ajustesConfiguracion, props.ficha.modificadores)
    cerrarMenuConfiguracion()
}
</script>

<template>
    <transition name="fade">
        <div v-if="mostrarInterno" class="config-panel-overlay" @click.self="cerrarMenuConfiguracion">
            <div class="config-panel">
                <!-- Header -->
                <header class="config-panel-header">
                    <h3>Configuración del Pokémon</h3>
                    <button class="close-btn" @click="cerrarMenuConfiguracion" aria-label="Cerrar">×</button>
                </header>

                <!-- Body -->
                <main class="config-panel-body">

                    <!-- Básicos -->
                    <section class="config-section">
                        <h4>Vitalidad y Recursos</h4>
                        <div class="config-list">
                            <label class="config-field-list">
                                <span>BH</span>
                                <input type="number" v-model.number="ajustesConfiguracion['bh']" placeholder="0" />
                            </label>
                            <label class="config-field-list">
                                <span>Vitalidad</span>
                                <input type="number" v-model.number="ajustesConfiguracion['vit']" placeholder="0" />
                            </label>
                            <label class="config-field-list">
                                <span>PV</span>
                                <input type="number" v-model.number="ajustesConfiguracion['pvMax']" placeholder="0" />
                            </label>
                            <label class="config-field-list">
                                <span>PP</span>
                                <input type="number" v-model.number="ajustesConfiguracion['ppMax']" placeholder="0" />
                            </label>
                            <label class="config-field-list">
                                <span>Evasión</span>
                                <input type="number" v-model.number="ajustesConfiguracion['evasion']" placeholder="0" />
                            </label>
                            <label class="config-field-list">
                                <span>Mejoras de Habilidad</span>
                                <input type="number" v-model.number="ajustesConfiguracion['mejorasHab']"
                                    placeholder="0" />
                            </label>
                        </div>
                    </section>

                    <!-- Velocidades -->
                    <section class="config-section">
                        <h4>Velocidades</h4>
                        <div class="config-list">
                            <label v-for="vel in velocidadKeys" :key="vel" class="config-field-list">
                                <span>{{ vel }}</span>
                                <input type="number" v-model.number="ajustesConfiguracion.velocidades[vel]"
                                    placeholder="0" />
                            </label>
                        </div>
                    </section>

                    <!-- Stats Derivados -->
                    <section class="config-section">
                        <h4>Stats Derivados</h4>
                        <div class="config-list">
                            <label v-for="(label, key) in statLabels" :key="key" class="config-field-list">
                                <span>{{ label }}</span>
                                <input type="number" v-model.number="ajustesConfiguracion.stats[key]" placeholder="0" />
                            </label>
                        </div>
                    </section>

                </main>

                <!-- Footer -->
                <footer class="config-panel-actions">
                    <button class="btn-reset" @click="reiniciarCambiosConfiguracion">Reiniciar</button>
                    <button class="btn-save" @click="guardarCambiosConfiguracion">Guardar cambios</button>
                </footer>
            </div>
        </div>
    </transition>
</template>


<style scoped>
.close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    color: var(--color-texto);
    font-size: 20px;
    cursor: pointer;
    line-height: 1;
}

.config-panel-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 900;
    padding: 20px;
    color: var(--color-texto);
}

.config-panel {
    width: min(900px, 95vw);
    max-height: 90vh;
    background: var(--color-fondoTexto);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: hidden;
}

.config-panel-header {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
    background: var(--color-fondoTexto);
    z-index: 1;
    color: var(--color-texto);
}

.config-panel-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    padding-right: 8px;
}

.config-section h4 {
    margin: 0 0 10px 0;
    color: var(--color-principal1);
}

.config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
}

.config-list {
    display: grid;
    grid-template-columns: auto auto;
    gap: 8px;
}

.config-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
}

.config-field input,
.config-field select,
.config-field textarea {
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.15);
    color: var(--color-texto);
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 14px;
}

.config-field textarea {
    min-height: 60px;
    resize: vertical;
}

.config-field-list {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    padding: 6px 8px;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.1);
}

.config-field-list>span:first-child {
    min-width: 100px;
    font-weight: 500;
}

.config-field-list .valor-actual {
    min-width: 50px;
    text-align: center;
    font-size: 12px;
    color: var(--color-secundario);
    font-weight: 500;
}

.config-field-list input {
    width: 60px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.15);
    color: var(--color-texto);
    border-radius: 4px;
    padding: 4px 6px;
    font-size: 13px;
    text-align: center;
}

.config-field-list select {
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.15);
    color: var(--color-texto);
    border-radius: 4px;
    padding: 4px 6px;
    font-size: 13px;

}

.config-panel-actions {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 10px;
    background: linear-gradient(180deg, transparent 0%, var(--color-fondoTexto) 40%);
}

.btn-reset,
.btn-save {
    border: none;
    border-radius: 6px;
    padding: 8px 14px;
    cursor: pointer;
    font-weight: 600;
}

.btn-reset {
    background: rgba(255, 255, 255, 0.12);
    color: var(--color-texto);
}

.btn-save {
    background: var(--color-principal1);
    color: var(--color-texto);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}


.config-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    color: var(--color-texto);
}

.config-modal {
    background: var(--color-fondoTexto);
    padding: 10px;
    border-radius: 10px;
    min-width: 320px;
    position: relative;
}

.config-checks-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
}

.config-check-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
}
</style>