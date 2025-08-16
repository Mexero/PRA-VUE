<script setup>
const props = defineProps([
    'ficha',
    'habilidades',
    'habilidadesCargadas'
])

import { ref, watch } from 'vue';
import HabsPopUp from './HabsPopUp.vue';


const habsBase = ref(actualizarHabilidades(props.ficha?.pokedex.habilidades));
const habsOcultas = ref(actualizarHabilidades(props.ficha?.pokedex.habilidadesOcultas));
const habsExtra = ref(actualizarHabilidades(props.ficha?.personaliz.habilidadesExtra));

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
            <details class="item" v-for="(hab, i) in habsBase" :key="i">
                <summary>{{ hab.nombre }}
                    <label v-if="hab.esOpcional" class="habOpcional">Elige una <input type="radio" name="opcional"
                            :value="hab.nombre" v-model="props.ficha.personaliz.habOpcionalElegida" /></label>
                </summary>
                <div class="descripcion">
                    <p v-for="parrafo in hab.descripcion" v-html="parrafo"></p>
                </div>
            </details>
            <!-- Habilidades ocultas -->
            <details class="item" v-for="(hab, i) in habsOcultas" :key="i"
                :class="{ 'ocultaBloqueada': ocultaDesbloqueada(hab.nombre) }">

                <summary>{{ hab.nombre }}

                    <div> Habilidad Oculta <input type="checkbox" :value="hab.nombre"
                            v-model="props.ficha.personaliz.habilidadesOcultasDesbloqueadas" />
                    </div>
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
                        <button @mousedown.prevent.stop="eliminarHabExtra(i)" class="borrar-btn">x</button>
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
.habilidades {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
    padding: 5px;
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
}

.habilidades-list {
    width: 640px;
    margin: 0 auto;
}

.tituloYAñadir {
    display: flex;
    justify-content: space-between;

}

.item {
    margin: 10px 0;
}

.borrar-btn {
    background-color: transparent;
    border: none;
    color: var(--color-texto);
    cursor: pointer;
    font-weight: bold;
    font-size: 30px;
    line-height: 25px;
    border-left: 1px solid;
    width: 40px;
    height: 30px;
    padding-bottom: 5px;
    background-color: var(--color-principal1);
}

.borrar-btn:hover {
    background-color: var(--color-principal2);
}

details {
    border: 1px solid var(--color-principal2);
}

summary {
    background-color: var(--color-principal2);
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    cursor: pointer;
}

.descripcion {
    padding: 10px;
}

.habOpcional {
    font-style: italic;
}

@media screen and (max-width: 1460px) {
    .habilidades-list {
        width: 790px;
    }

}
@media screen and (max-width: 920px) {
    .habilidades-list {
            width: 430px;
    }

}
@media screen and (max-width: 545px) {
    .habilidades-list {
            width: 350px;
        }
}
</style>