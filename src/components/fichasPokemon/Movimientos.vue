<template>
    <section class="moves">
        <h3>Movimientos ( {{ ficha.personaliz.movimientosAprendidos.length
        }} / {{ ficha.derivados.cantidadMovs }})
            <movimientosPopUp :movimientos="movimientos" :ficha="ficha" :movimientosCompletos="movimientosCompletos"
                :movimientosCargados="movimientosCargados" />
        </h3>
        <div class="moves-list">
            <!--Movimientos Aprendidos-->
            <template v-for="(mov, i) in ficha.personaliz.movimientosAprendidos" :key="i">
                <details class="movimiento">
                    <summary>
                        {{ mov }}
                        <button @click="eliminarMov(mov, 'aprendidos')" class="borrar-btn">X</button>
                    </summary>
                    <MovsData v-if="getMovimientoCompleto(mov)" :ficha="ficha" :mov="getMovimientoCompleto(mov)" />
                </details>
            </template>
            <!--Movimientos Extra-->
            <template v-for="(mov, i) in ficha.personaliz.movimientosExtra" :key="i">
                <details class="movimiento">
                    <summary>
                        {{ mov }} (Extra)
                        <button @click="eliminarMov(mov, 'extra')" class="borrar-btn">X</button>
                    </summary>
                    <MovsData v-if="getMovimientoCompleto(mov)" :ficha="ficha" :mov="getMovimientoCompleto(mov)" />
                </details>
            </template>
        </div>
    </section>
</template>

<script setup>
const props = defineProps([
    'ficha',
    'movimientos',
    'movimientosCargados',
])

import { ref, watch } from 'vue';

import movimientosPopUp from './movimientosPopUp.vue';
import MovsData from './MovsData.vue';

const movimientosCompletos = ref([]);
const modificandoMovimientosCompletos = ref(false)



function getMovimientoCompleto(nombre) {
    return movimientosCompletos.value.find(mov => mov.nombre === nombre);
}

//Cargar todo al abrir y al cambiar los movimientos
watch(
    () => [
        props.movimientosCargados,
        props.ficha.personaliz.movimientosAprendidos,
        props.ficha.personaliz.movimientosExtra
    ],
    () => {
        //Purgar los movimientos que no se usan
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

// Eliminar un movimiento
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

<style scoped>
.moves-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #d5f5e3;
    border-radius: 8px;
    padding: 12px;
    font-weight: 600;
    color: #196f3d;
    text-align: center;
}

.movimiento {
    background: #4eb67b;
    border-radius: 8px;
    text-align: justify;
    padding: 10px;
}
</style>
