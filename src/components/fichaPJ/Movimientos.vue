<template>
    <section class="moves">
        <h3>Movimientos
            <movimientosPopUp :movimientos="movimientos" :ficha="ficha" :movimientosCompletos="movimientosCompletos" />
        </h3>
        <div class="moves-grid">
            <!--Movimientos Aprendidos-->
            <template v-for="(mov, i) in movimientosCompletos" :key="i">
                <div v-if="ficha.personaliz.movimientosAprendidos.includes(mov.nombre)" class="movimiento">
                    <h4>
                        {{ mov.nombre }}
                        <button @click="eliminarMov(mov.nombre, 'aprendidos')" class="borrar-btn">X</button>
                    </h4>
                    <div class="mov-data">
                        <p><strong>Tipo: </strong>{{ mov.tipo }}</p>
                        <p><strong>Acción: </strong>{{ mov.accion }}</p>
                        <p><strong>Coste: </strong>{{ mov.coste }}</p>
                        <p><strong>Rango: </strong>{{ mov.rango }}</p>
                        <p v-if="mov.danno"><strong>Daño: </strong>{{ mov.danno }}</p>
                        <p v-if="mov.etiquetas"><strong>Etiquetas: </strong>{{ mov.etiquetas }}</p>
                        <p v-if="mov.ataque"><strong>Bono Tirada: </strong> +{{ ficha.derivados.bh }}</p>
                        <p v-if="mov.salvacion"><strong>Salvación: </strong>
                            {{ mov.dc }} CD {{ 10 + ficha.derivados.bh }} </p>
                    </div>
                    <div class="descripcion">
                        <p class="tituloDesc"><strong>Descripción:</strong></p>
                        <p v-for="parrafo in mov.descripcion" v-html="parrafo"></p>
                    </div>
                    <div v-if="mov.statsAso"><strong>Estadísticas asociadas: </strong> {{ mov.statsAso }}</div>
                </div>
            </template>
            <!--Movimientos Extra-->
            <template v-for="(mov, i) in movimientosCompletos" :key="i">
                <div v-if="ficha.personaliz.movimientosExtra.includes(mov.nombre)" class="movimiento">
                    <h4>
                        {{ mov.nombre }} (Extra)
                        <button @click="eliminarMov(mov.nombre, 'extra')" class="borrar-btn">X</button>
                    </h4>
                    <div class="mov-data">
                        <p><strong>Tipo: </strong>{{ mov.tipo }}</p>
                        <p><strong>Acción: </strong>{{ mov.accion }}</p>
                        <p><strong>Coste: </strong>{{ mov.coste }}</p>
                        <p><strong>Rango: </strong>{{ mov.rango }}</p>
                        <p v-if="mov.danno"><strong>Daño: </strong>{{ mov.danno }}</p>
                        <p v-if="mov.etiquetas"><strong>Etiquetas: </strong>{{ mov.etiquetas }}</p>
                        <p v-if="mov.ataque"><strong>Bono Tirada: </strong> +{{ ficha.derivados.bh }}</p>
                        <p v-if="mov.salvacion"><strong>Salvación: </strong>
                            {{ mov.dc }} CD {{ 10 + ficha.derivados.bh }} </p>
                    </div>
                    <div class="descripcion">
                        <p class="tituloDesc"><strong>Descripción:</strong></p>
                        <p v-for="parrafo in mov.descripcion" v-html="parrafo"></p>
                    </div>
                    <div v-if="mov.statsAso"><strong>Estadísticas asociadas: </strong> {{ mov.statsAso }}</div>
                </div>
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

import worker from '../../sqlWorker.js';
import movimientosPopUp from './movimientosPopUp.vue';

const movimientosCompletos = ref([]);
const movimientosAprendidos = ref([]);
const movimientosExtra = ref([]);
const modificandoMovimientosCompletos = ref(false)


//Cargar movimiento
function cargarMovimiento(movimiento) {
    if (!props.movimientosCargados) return;
    if (!movimiento || !props.movimientos.includes(movimiento)
        || movimientosCompletos.value.find(mov => mov.nombre === movimiento)) return;

    worker.postMessage({
        type: 'query',
        query: `
            SELECT 
                Nombre, Tipo, Tiempo_de_uso, Coste, Dano, Rango, Etiquetas, Descripcion, 
                Stat_Asociado_1, Stat_Asociado_2, Stat_Asociado_3, Stat_Asociado_4,
                At, Salvacion, DC
            FROM pokemexe_movimientos
            WHERE Nombre = ?
        `,
        params: [movimiento],
        origin: "cargarMovimiento"
    });

}

worker.addEventListener("message", (event) => {
    if (event.data.type === 'result' && event.data.origin === 'cargarMovimiento') {
        const row = event.data.result?.[0]?.values?.[0];
        if (row) {
            movimientosCompletos.value.push({
                nombre: row[0],
                tipo: row[1],
                accion: row[2],
                coste: row[3],
                danno: row[4] !== "" ? row[4] : null,
                rango: row[5] !== "" ? row[5] : null,
                etiquetas: row[6] !== "" ? row[6] : null,
                descripcion: row[7].split('\n'),
                statsAso: [row[8], row[9], row[10], row[11]].filter(stat => stat !== ""),
                ataque: row[12],
                salvacion: row[13],
                dc: row[14]
            });
        }
    }

    if (event.data.type === 'error') {
        console.error("Error al seleccionar movimiento:", event.data.error);
    }
})


//Cargar todo al abrir y al cambiar los movimientos
watch(
    () => [
        props.movimientosCargados,
        props.ficha.personaliz.movimientosAprendidos,
        props.ficha.personaliz.movimientosExtra
    ],
    () => {
        //Cargar todos los movimientos
        if (props.movimientosCargados) {
            modificandoMovimientosCompletos.value = true;
            const movimientos = [...new Set([
                ...props.ficha.personaliz.movimientosAprendidos,
                ...props.ficha.personaliz.movimientosExtra
            ])];
            for (const movimiento of movimientos) {
                cargarMovimiento(movimiento);
            }
            modificandoMovimientosCompletos.value = false;

        }
    },
    { deep: true, immediate: true }
);

//Cuando cambian los movs cargados, se modifican los a mostrar
watch(() => movimientosCompletos.value,
    (movimientos) => {
        if (props.movimientosCargados && !modificandoMovimientosCompletos.value) {
            console.log('completos', movimientosCompletos.value)
            movimientosAprendidos.value = props.ficha.personaliz.movimientosAprendidos
                .map(nombre => movimientos.find(mov => mov.nombre === nombre))
                .filter(Boolean);
            movimientosExtra.value = props.ficha.personaliz.movimientosExtra
                .map(nombre => movimientos.find(mov => mov.nombre === nombre))
                .filter(Boolean);
        }
    },
    { deep: true, immediate: true }
);


// Eliminar un movimiento
function eliminarMov(movimiento, lista) {
    //Eliminarlo de los cargados


    //Eliminarlo de la lista
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
.moves-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
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
    min-height: 100px;
    text-align: justify;
    padding: 10px;
}

.mov-data {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.tituloDesc {
    padding: 0;
}

p {
    padding-bottom: 10px;
}
</style>
