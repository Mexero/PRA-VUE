<script setup>
import { ref, watch } from 'vue';
import draggable from 'vuedraggable';

const props = defineProps([
    'ficha',
    'movimientos',
    'movimientosCargados',
])

import movimientosPopUp from './movimientosPopUp.vue';
import MovsData from './MovsData.vue';

const movimientosCompletos = ref([]);
const modificandoMovimientosCompletos = ref(false)

function getMovimientoCompleto(nombre) {
    return movimientosCompletos.value.find(mov => mov.nombre === nombre);
}

watch(
    () => [
        props.movimientosCargados,
        props.ficha.personaliz.movimientosAprendidos,
        props.ficha.personaliz.movimientosExtra
    ],
    () => {
        if (props.movimientosCargados) {
            modificandoMovimientosCompletos.value = true;
            const movimientos = [...new Set([
                ...props.ficha.personaliz.movimientosAprendidos,
                ...props.ficha.personaliz.movimientosExtra
            ])];
            movimientosCompletos.value = movimientosCompletos.value.filter(
                mov => movimientos.includes(mov.nombre)
            )
            modificandoMovimientosCompletos.value = false;
        }
    },
    { deep: true, immediate: true }
);

function eliminarMov(movimiento, lista) {
    if (lista === 'aprendidos') {
        const index = props.ficha.personaliz.movimientosAprendidos.indexOf(movimiento);
        if (index !== -1) {
            props.ficha.personaliz.movimientosAprendidos.splice(index, 1);
        }
    }
    if (lista === 'extra') {
        const index = props.ficha.personaliz.movimientosExtra.indexOf(movimiento);
        if (index !== -1) {
            props.ficha.personaliz.movimientosExtra.splice(index, 1);
        }
    }
}
</script>

<template>
    <section class="moves">
        <div class="moves-header">
            <h3>Movimientos ( {{ ficha.personaliz.movimientosAprendidos.length }} / {{ ficha.derivados.cantidadMovs }})
            </h3>
            <movimientosPopUp :movimientos="movimientos" :ficha="ficha" :movimientosCompletos="movimientosCompletos"
                :movimientosCargados="movimientosCargados" />
        </div>
        <div class="moves-list">
            <!-- Movimientos Aprendidos -->
            <draggable v-model="ficha.personaliz.movimientosAprendidos" group="movimientos" item-key="nombre"
                handle=".movimiento-summary" :animation="200">
                <template #item="{ element: mov, index: i }">
                    <details class="movimiento">
                        <summary class="movimiento-summary">
                            {{ mov }}
                            <button @click="eliminarMov(mov, 'aprendidos')" class="borrar-btn">x</button>
                        </summary>
                        <MovsData v-if="getMovimientoCompleto(mov)" :ficha="ficha" :mov="getMovimientoCompleto(mov)" />
                    </details>
                </template>
            </draggable>

            <!-- Movimientos Extra -->
            <draggable v-model="ficha.personaliz.movimientosExtra" group="movimientos" item-key="nombre"
                handle=".movimiento-summary" :animation="200">
                <template #item="{ element: mov, index: i }">
                    <details class="movimiento">
                        <summary class="movimiento-summary">
                            {{ mov }} (Extra)
                            <button @click="eliminarMov(mov, 'extra')" class="borrar-btn">x</button>
                        </summary>
                        <MovsData v-if="getMovimientoCompleto(mov)" :ficha="ficha" :mov="getMovimientoCompleto(mov)" />
                    </details>
                </template>
            </draggable>
        </div>
    </section>
</template>

<style scoped>
.moves {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
    padding: 5px;
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
}

.moves-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 5px;
}

.movimiento {
    max-width: 670px;
    border: 1px solid var(--color-principal2);
    margin: 10px 0;
}

.movimiento summary {
    background-color: var(--color-principal2);
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 0 10px;
    cursor: pointer;
}

.movimiento-summary {
    cursor: grab;
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

@media screen and (max-width: 1460px) {
    .movimiento {
        max-width: 760px;

    }
}
</style>
