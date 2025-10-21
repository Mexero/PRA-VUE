<script setup>
const props = defineProps([
    'ficha',
    'habilidades',
    'habilidadesCargadas'
])

import { ref, watch, computed } from 'vue';
import HabsPopUp from './HabsPopUp.vue';


const habsBase = ref(actualizarHabilidades(props.ficha?.pokedex.habilidades));
const habsOcultas = ref(actualizarHabilidades(props.ficha?.pokedex.habilidadesOcultas));
const habsExtra = ref(actualizarHabilidades(props.ficha?.personaliz.habilidadesExtra));

// Opciones de habilidades opcionales (si hay varias, usar un select único)
const opcionesOpcionales = computed(() => {
    return (habsBase.value || []).filter(h => h.esOpcional).map(h => h.nombre)
})

// Lista mostrada: solo la habilidad opcional elegida + el resto de no opcionales
const habBaseMostradas = computed(() => {
    const todas = habsBase.value || []
    const noOpcionales = todas.filter(h => !h.esOpcional)
    const opciones = opcionesOpcionales.value
    let seleccion = props.ficha.personaliz.habOpcionalElegida
    if ((!seleccion || !opciones.includes(seleccion)) && opciones.length) {
        seleccion = opciones[0]
        props.ficha.personaliz.habOpcionalElegida = seleccion
    }
    const seleccionada = todas.find(h => h.nombre === seleccion)
    return seleccionada ? [seleccionada, ...noOpcionales] : noOpcionales
})

watch(() => [
    props.ficha.pokedex.habilidades,
    props.ficha.pokedex.habilidadesOcultas,
    props.ficha.personaliz.habilidadesExtra,
    props.habilidadesCargadas],
    () => {
        if (props.habilidadesCargadas) {
            habsBase.value = actualizarHabilidades(props.ficha.pokedex.habilidades);
            habsOcultas.value = actualizarHabilidades(props.ficha.pokedex.habilidadesOcultas);
            habsExtra.value = actualizarHabilidadesExtra(props.ficha.personaliz.habilidadesExtra);
            // Asegurar selección válida si cambia el conjunto de opcionales
            const opciones = opcionesOpcionales.value
            if (opciones.length) {
                if (!props.ficha.personaliz.habOpcionalElegida || !opciones.includes(props.ficha.personaliz.habOpcionalElegida)) {
                    props.ficha.personaliz.habOpcionalElegida = opciones[0]
                }
            } else {
                props.ficha.personaliz.habOpcionalElegida = ''
            }
        }
    }, { deep: true });

function actualizarHabilidades(habilidades) {
    if (!props.habilidadesCargadas || !habilidades) return []
    return habilidades.map(hab => {
        const match = props.habilidades.find(h => h.nombre === hab.nombre);
        return {
            nombre: hab.nombre,
            esOpcional: hab.esOpcional,
            descripcion: match ? match.descripcion : ['No se ha encontrado descripción para esta habilidad...']
        };
    });
}

function actualizarHabilidadesExtra(habilidades) {
    if (!props.habilidadesCargadas || !habilidades) return []
    return habilidades.map(nombreHab => {
        const match = props.habilidades.find(h => h.nombre === nombreHab);
        return {
            nombre: nombreHab,
            esOpcional: false,
            descripcion: match ? match.descripcion : ['No se ha encontrado descripción para esta habilidad...']
        };
    });
}

function ocultaDesbloqueada(nombre) {
    const desbloqueadas = props.ficha.personaliz?.habilidadesOcultasDesbloqueadas || [];
    return !desbloqueadas.includes(nombre);
}

// Eliminar una dote extra por índice
function eliminarHabExtra(index) {
    props.ficha.personaliz.habilidadesExtra.splice(index, 1)
}

</script>

<template>
    <section class="habilidades">
        <div class="tituloYAñadir">
            <h3>Habilidades
            </h3>
            <HabsPopUp :habilidades="habilidades" :ficha="ficha" :habilidadesCargadas="habilidadesCargadas" />
        </div>

        <div class="habilidades-list">
            <!-- Habilidades base -->
            <details class="item" v-for="(hab, i) in habBaseMostradas" :key="i">
                <summary>
                    <template v-if="hab.esOpcional && opcionesOpcionales.length > 1">
                        <span class="tituloHab">{{ hab.nombre }}</span>
                        <select v-model="props.ficha.personaliz.habOpcionalElegida" class="opcional-select">
                            <option v-for="opt in opcionesOpcionales" :key="opt" :value="opt">{{ opt }}</option>
                        </select>
                    </template>
                    <template v-else>{{ hab.nombre }}</template>
                </summary>
                <div class="descripcion">
                    <p v-for="parrafo in hab.descripcion" v-html="parrafo"></p>
                </div>
            </details>
            <!-- Habilidades ocultas -->
            <details class="item" v-for="(hab, i) in habsOcultas" :key="i"
                :class="{ 'ocultaBloqueada': ocultaDesbloqueada(hab.nombre) }">

                <summary>
                    {{ hab.nombre }}
                    <label class="ocultaToggle" :title="`Habilidad Oculta`">
                        <span class="label">Habilidad Oculta</span>

                        <input type="checkbox" :value="hab.nombre"
                            v-model="props.ficha.personaliz.habilidadesOcultasDesbloqueadas" aria-label="Habilidad oculta" />
                        <span class="toggle" aria-hidden="true"></span>
                    </label>
                </summary>
                <div class="descripcion">
                    <p v-for="parrafo in hab.descripcion" v-html="parrafo"></p>
                </div>
            </details>
            <!-- Habilidades extra -->
            <template v-if="ficha.personaliz.habilidadesExtra.length">
                <h4>Habilidades extra:</h4>
                <details class="item" v-for="(hab, i) in habsExtra" :key="'extra-' + i">
                    <summary class="tituloHabExtra">
                        <span>{{ hab.nombre }}</span>
                        <button @mousedown.prevent.stop="eliminarHabExtra(i)" class="borrar-btn">×</button>
                    </summary>
                    <div class="descripcion">
                        <p v-for="parrafo in hab.descripcion" v-html="parrafo"></p>
                    </div>
                </details>
            </template>
        </div>
    </section>
</template>

<style scoped>
h3{
    letter-spacing: 1px;
}

.habilidades {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 8px;
    padding: 8px;
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    background: var(--color-fondoTexto);
}

.habilidades-list {
    width: 100%;
    margin: 0 auto;
}

.tituloYAñadir {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--color-principal2);
}

.item {
    margin: 8px 0;
}

.borrar-btn {
    background-color: transparent;
    border: none;
    color: var(--color-texto);
    cursor: pointer;
    font-weight: bold;
    font-size: 24px;
    line-height: 20px;
    border-left: 1px solid;
    width: 28px;
    height: 28px;
    padding-bottom: 4px;
    background-color: var(--color-principal1);
    border-radius: 4px;
    transition: all 0.2s ease;
}

.borrar-btn:hover {
    background-color: var(--color-principal2);
    transform: scale(1.05);
}

details {
    border: 1px solid var(--color-principal2);
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.2s ease;
}

details:hover {
    border-color: var(--color-principal1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

summary {
    background-color: var(--color-principal2);
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

summary:hover {
    background-color: var(--color-principal1);
}

.tituloHab { 
    flex: 1; 
    font-weight: 500;
}

.opcional-select {
    margin: 0 8px 0 12px;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid var(--color-principal2);
    background: var(--color-fondoTexto);
    color: var(--color-texto);
    font-size: 0.9em;
    transition: all 0.2s ease;
}

.opcional-select:hover {
    border-color: var(--color-principal1);
}

/* Toggle estilizado para habilidades ocultas */
.ocultaToggle {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-right: 8px;
    user-select: none;
}

.ocultaToggle input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.ocultaToggle .toggle {
    width: 44px;
    height: 22px;
    background: #e53935;
    border-radius: 11px;
    position: relative;
    transition: all 0.3s ease;
    border: 1px solid #b71c1c;
}

.ocultaToggle .toggle::after {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    background: #ffffff;
    border-radius: 50%;
    top: 1px;
    left: 1px;
    transition: transform 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.ocultaToggle input:checked + .toggle {
    background: #2e7d32;
    border-color: #1b5e20;
}

.ocultaToggle input:checked + .toggle::after {
    transform: translateX(22px);
}

.ocultaToggle .label {
    font-size: 11px;
    opacity: 0.9;
    font-weight: 500;
}

/* Accesibilidad: foco visible */
.ocultaToggle input:focus-visible + .toggle {
    outline: 2px solid #000;
    outline-offset: 2px;
}

.descripcion {
    padding: 12px;
    line-height: 1.5;
    background: var(--color-fondoTexto);
}

.descripcion p {
    margin: 0 0 8px 0;
    font-size: 0.9em;
}

.descripcion p:last-child {
    margin-bottom: 0;
}

.habOpcional {
    font-style: italic;
}

/* Responsive mejoras */
@media screen and (max-width: 768px) {
   
    
    .item {
        margin: 6px 0;
    }
    
    .borrar-btn {
        font-size: 20px;
        width: 24px;
        height: 24px;
    }
}



</style>