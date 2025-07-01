<template>
    <section class="moves">
        <h3>Movimientos ( {{ ficha.personaliz.movimientosAprendidos.length
        }} / {{ ficha.derivados.cantidadMovs }})
            <movimientosPopUp :movimientos="movimientos" :ficha="ficha" :movimientosCompletos="movimientosCompletos"
                :movimientosCargados="movimientosCargados" />
        </h3>
        <div class="moves-list">
            <!--Movimientos Aprendidos-->
            <template v-for="(mov, i) in movimientosCompletos" :key="i">
                <details v-if="ficha.personaliz.movimientosAprendidos.includes(mov.nombre)" class="movimiento">
                    <summary>
                        {{ mov.nombre }}
                        <button @click="eliminarMov(mov.nombre, 'aprendidos')" class="borrar-btn">X</button>
                    </summary>
                    <div class="mov-content">
                        <div class="mov-data">
                            <p><strong>Tipo: </strong>{{ mov.tipo }}</p>
                            <p><strong>Acción: </strong>{{ mov.accion }}</p>
                            <p><strong>Coste: </strong>{{ computarCoste(mov.coste) }}</p>
                            <p><strong>Rango: </strong>{{ mov.rango }}</p>
                            <p v-if="mov.danno"><strong>Daño: </strong>
                                {{ computarDanno(mov.danno, mayorStat(mov.statsAso)) }}
                            </p>
                            <p v-if="mov.etiquetas"><strong>Etiquetas: </strong>{{ mov.etiquetas }}</p>
                            <p v-if="mov.ataque"><strong>Bono Tirada: </strong> {{ ComputarTdA(mayorStat(mov.statsAso))
                                }}
                            </p>
                            <p v-if="mov.salvacion"><strong>Salvación: </strong>
                                CD {{ computarCD(mayorStat(mov.statsAso)) }} </p>
                        </div>
                        <div class="descripcion">
                            <p class="tituloDesc"><strong>Descripción:</strong></p>
                            <p v-for="parrafo in mov.descripcion" v-html="parrafo"></p>
                        </div>
                        <div v-if="mov.statsAso.length"><strong>Estadísticas asociadas: </strong> {{
                            formatearStats(mov.statsAso)
                            }}.</div>
                    </div>
                </details>
            </template>
            <!--Movimientos Extra-->
            <template v-for="(mov, i) in movimientosCompletos" :key="i">
                <details v-if="ficha.personaliz.movimientosExtra.includes(mov.nombre)" class="movimiento">
                    <summary>
                        {{ mov.nombre }} (Extra)
                        <button @click="eliminarMov(mov.nombre, 'aprendidos')" class="borrar-btn">X</button>
                    </summary>
                    <div class="mov-content">
                        <div class="mov-data">
                            <p><strong>Tipo: </strong>{{ mov.tipo }}</p>
                            <p><strong>Acción: </strong>{{ mov.accion }}</p>
                            <p><strong>Coste: </strong>{{ computarCoste(mov.coste) }}</p>
                            <p><strong>Rango: </strong>{{ mov.rango }}</p>
                            <p v-if="mov.danno"><strong>Daño: </strong>
                                {{ computarDanno(mov.danno, mayorStat(mov.statsAso)) }}
                            </p>
                            <p v-if="mov.etiquetas"><strong>Etiquetas: </strong>{{ mov.etiquetas }}</p>
                            <p v-if="mov.ataque"><strong>Bono Tirada: </strong> {{ ComputarTdA(mayorStat(mov.statsAso))
                                }}
                            </p>
                            <p v-if="mov.salvacion"><strong>Salvación: </strong>
                                CD {{ computarCD(mayorStat(mov.statsAso)) }} </p>
                        </div>
                        <div class="descripcion">
                            <p class="tituloDesc"><strong>Descripción:</strong></p>
                            <p v-for="parrafo in mov.descripcion" v-html="parrafo"></p>
                        </div>
                        <div v-if="mov.statsAso.length"><strong>Estadísticas asociadas: </strong> {{
                            formatearStats(mov.statsAso)
                            }}.</div>
                    </div>
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

const movimientosCompletos = ref([]);
const modificandoMovimientosCompletos = ref(false)


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

const formatearStats = (stats) => {
    if (!stats || stats.length === 0) return '';
    if (stats.length === 1) return stats[0];
    if (stats.length === 2) return `${stats[0]} y ${stats[1]}`;
    return `${stats.slice(0, -1).join(', ')} y ${stats[stats.length - 1]}`;
};

function mayorStat(stats) {
    if (!Array.isArray(stats) || stats.length === 0) return null;
    if (!props.ficha?.derivados?.stats) return null;

    let maxValor = -10;
    for (const nombre of stats) {
        const clave = nombre.toLowerCase();
        const valor = props.ficha.derivados.stats[clave];
        if (valor !== undefined && valor > maxValor) {
            maxValor = valor;
        }
    }

    return maxValor;
}

function computarDanno(cadena, stat) {
    let final = cadena.replace(/EST/g, stat)
    if (props.ficha.derivados.fatiga)
        final += " - " + props.ficha.derivados.fatiga
    return final;
}

function computarCoste(cadena) {
    const nivel = props.ficha?.nivel ?? 0;
    const descuento = nivel >= 16 ? 2 : nivel >= 8 ? 1 : 0;

    return cadena.replace(/(\d+)\s*PP\b/g, (numStr, fullString) => {
        const original = parseInt(numStr);
        const reducido = Math.max(0, original - descuento);

        if (reducido > 0) {
            return `${reducido} PP`;
        }

        const soloPP = fullString.trim().match(/^(\d+)\s*PP$/i);
        return soloPP ? "A voluntad" : "AV";
    });
}

function ComputarTdA(stat) {
    const final = props.ficha.derivados.bh + stat - props.ficha.derivados.fatiga
    return (final < 0 ? " - " : " + ") + Math.abs(final);
}

function computarCD(stat) {
    const final = 10 + props.ficha.derivados.bh + stat - props.ficha.derivados.fatiga
    return Math.max(final, 0);
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
