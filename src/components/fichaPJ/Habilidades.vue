<template>
    <section class="habilidades">
        <h3>Habilidades. Habs Extra:
            <input type="checkbox" v-model="ficha.manual.habilidadesExtra" />
        </h3>
        <div class="habilidades-list">
            <!-- Habilidades base -->
            <details class="item" v-for="(hab, i) in habsBase" :key="i">
                <summary>{{ hab.nombre }}</summary>
                <div class="descripcion">
                    <p v-for="parrafo in hab.descripcion" v-html="parrafo"></p>
                </div>
            </details>
            <!-- Habilidades ocultas -->
            <details class="item" v-for="(hab, i) in habsOcultas" :key="i"
                :class="{ 'ocultaBloqueada': ocultaDesbloqueada(hab.nombre) }">

                <summary>{{ hab.nombre }} <input type="checkbox" :value="hab.nombre"
                        v-model="props.ficha.personaliz.habilidadesOcultasDesbloqueadas" />
                </summary>
                <div class="descripcion">
                    <p v-for="parrafo in hab.descripcion" v-html="parrafo"></p>
                </div>
            </details>
            <!-- Habilidades extra -->
            <template v-if="ficha.manual.habilidadesExtra">
                <div>Habilidades extra</div>
                <details class="item" v-for="(hab, i) in habsExtra" :key="'extra-' + i">
                    <summary>{{ hab.nombre }} <button @click="eliminarHabExtra(i)" class="borrar-btn">X</button>
                    </summary>
                    <div class="descripcion">
                        <p v-for="parrafo in hab.descripcion" v-html="parrafo"></p>
                    </div>
                </details>
                <!-- Añadir nueva dote extra -->
                <BusquedaHab v-model="nuevaHabExtra" :habilidades="habilidades" @select="addHabExtra" />
            </template>
        </div>
    </section>
</template>

<script setup>
const props = defineProps([
    'ficha',
    'habilidades',
    'habilidadesCargadas'
])

import { ref, watch } from 'vue';
import BusquedaHab from './busquedaHab.vue'


const habsBase = ref(actualizarHabilidades(props.ficha?.pokedex.habilidades));
const habsOcultas = ref(actualizarHabilidades(props.ficha?.pokedex.habilidadesOcultas));
const habsExtra = ref(actualizarHabilidades(props.ficha?.personaliz.habilidadesExtra));

watch(() => [
    props.ficha.pokedex.habilidades,
    props.ficha.pokedex.habilidadesOcultas,
    props.ficha.personaliz.habilidadesExtra,
    props.habilidadesCargadas],
    () => {
        habsBase.value = actualizarHabilidades(props.ficha.pokedex.habilidades);
        habsOcultas.value = actualizarHabilidades(props.ficha.pokedex.habilidadesOcultas);
        habsExtra.value = actualizarHabilidades(props.ficha.personaliz.habilidadesExtra);
    }, { deep: true });

function actualizarHabilidades(habilidades) {
    if (!props.habilidadesCargadas || !habilidades) return []

    return habilidades.map(nombreHab => {
        const match = props.habilidades.find(h => h.nombre === nombreHab);
        return {
            nombre: nombreHab,
            descripcion: match ? match.descripcion : ['No se ha encontrado descripción para esta habilidad...']
        };
    });
}

function ocultaDesbloqueada(nombre) {
    const desbloqueadas = props.ficha.personaliz?.habilidadesOcultasDesbloqueadas || [];
    return !desbloqueadas.includes(nombre);
}

// Habilidad extra
const nuevaHabExtra = ref('')

// Añadir una dote extra desde el buscador
function addHabExtra(nombre) {
    if (!nombre) return
    if (!props.ficha.personaliz.habilidadesExtra.includes(nombre)) {
        props.ficha.personaliz.habilidadesExtra.push(nombre)
    }
    nuevaHabExtra.value = ''
}

// Eliminar una dote extra por índice
function eliminarHabExtra(index) {
    props.ficha.personaliz.habilidadesExtra.splice(index, 1)
}


</script>

<style scoped>
.habilidades-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.descripcion {
    text-align: justify;
}

.ocultaBloqueada {
    opacity: 0.6;
}

p {
    padding: 5px;
}
</style>