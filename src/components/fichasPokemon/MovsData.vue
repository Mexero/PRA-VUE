<script setup>

import tiraDado from '../tiraDado.vue';

const props = defineProps([
    'ficha',
    'mov'
])

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

function normalizeType(type) {
    if (type === null) return 0
    return type
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
}

const typeMap = {
    normal: 'normal',
    fuego: 'fire',
    agua: 'water',
    planta: 'grass',
    electrico: 'electric',
    hielo: 'ice',
    lucha: 'fighting',
    veneno: 'poison',
    tierra: 'ground',
    volador: 'flying',
    psiquico: 'psychic',
    bicho: 'bug',
    roca: 'rock',
    fantasma: 'ghost',
    dragon: 'dragon',
    siniestro: 'dark',
    acero: 'steel',
    hada: 'fairy'
}
</script>

<template>
    <div class="mov-content">
        <div class="mov-data">
            <p class="tipo">
                Tipo:
                <img v-if="mov.tipo" :src="`/assets/icons/${typeMap[normalizeType(mov.tipo)]}.svg`" :alt="mov.tipo"
                    class="tipo-icon" :class="'type-' + normalizeType(mov.tipo)" />
            </p>
            <p><strong>Acción: </strong>{{ mov.accion }}</p>
            <p><strong>Coste: </strong>{{ computarCoste(mov.coste) }}</p>
            <p><strong>Rango: </strong>{{ mov.rango }}</p>
            <p v-if="mov.danno">
                <strong>Daño: </strong>
                {{ computarDanno(mov.danno, mayorStat(mov.statsAso)) }}
                <tiraDado :tirada='computarDanno(mov.danno, mayorStat(mov.statsAso)).split(" ").join("")'
                    :origin='"Daño de " + mov.nombre' />
            </p>
            <p v-if="mov.etiquetas"><strong>Etiquetas: </strong>{{ mov.etiquetas }}</p>
            <div v-if="mov.ataque">
                <span><strong>Bono Tirada: </strong> {{ ComputarTdA(mayorStat(mov.statsAso)) }}</span>
                <tiraDado :tirada='("1d20" + ComputarTdA(mayorStat(mov.statsAso))).split(" ").join("")' :origin='"TdA de " +
                    mov.nombre' />

            </div>
            <p v-if="mov.salvacion">
                <strong>Salvación: </strong> Dificultad {{ computarCD(mayorStat(mov.statsAso)) }}
            </p>
        </div>
        <div class="descripcion">
            <p class="tituloDesc"><strong>Descripción:</strong></p>
            <p v-for="parrafo in mov.descripcion" v-html="parrafo"></p>
        </div>
        <div v-if="mov.statsAso.length">
            <strong>Estadísticas asociadas: </strong> {{ formatearStats(mov.statsAso) }}.
        </div>
    </div>
</template>
<style scoped>
@import url(../../css/typeColors.css);

.mov-content {
    padding: 10px;
}

.movimiento {
    border-radius: 8px;
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

.tipo-icon {
    display: inline-block;
    padding: 3.5px;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    box-sizing: border-box;
}

.tipo {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 700;
}
</style>