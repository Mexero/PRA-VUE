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

// Mapa de colores por tipo (coincide con src/css/typeColors.css)
const typeColorMap = {
    normal: '#A8A878',
    fuego: '#F08030',
    agua: '#6890F0',
    planta: '#78C850',
    electrico: '#F8D030',
    hielo: '#98D8D8',
    lucha: '#C03028',
    veneno: '#A040A0',
    tierra: '#E0C068',
    volador: '#A890F0',
    psiquico: '#F85888',
    bicho: '#A8B820',
    roca: '#B8A038',
    fantasma: '#705898',
    dragon: '#7038F8',
    siniestro: '#705848',
    acero: '#B8B8D0',
    hada: '#EE99AC',
    variable: '#ccdee9'
}

function normalizeTypeName(tipo) {
    if (!tipo || typeof tipo !== 'string') return ''
    // pasar a minúsculas y eliminar acentos
    const sinAcentos = tipo.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return sinAcentos.toLowerCase().trim()
}

function hexToRgb(hex) {
    const h = hex.replace('#', '')
    const bigint = parseInt(h, 16)
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    }
}

function getContrastTextColor(bgHex) {
    // YIQ contrast
    const { r, g, b } = hexToRgb(bgHex)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 140 ? '#000000' : '#FFFFFF'
}

function getMoveType(nombre) {
    const mov = getMovimientoCompleto(nombre) || props.movimientos.find(m => m.nombre === nombre)
    if (!mov || !mov.tipo) return null
    return normalizeTypeName(mov.tipo)
}

function getMoveStyle(nombre) {
    const tipo = getMoveType(nombre)
    const color = tipo && typeColorMap[tipo] ? typeColorMap[tipo] : null
    if (!color) return {}
    const text = getContrastTextColor(color)
    return { '--mov-color': color, '--mov-text': text }
}

// Iconos por tipo (en /public/assets/icons)
const typeIconMap = {
    normal: 'normal.svg',
    fuego: 'fire.svg',
    agua: 'water.svg',
    planta: 'grass.svg',
    electrico: 'electric.svg',
    hielo: 'ice.svg',
    lucha: 'fighting.svg',
    veneno: 'poison.svg',
    tierra: 'ground.svg',
    volador: 'flying.svg',
    psiquico: 'psychic.svg',
    bicho: 'bug.svg',
    roca: 'rock.svg',
    fantasma: 'ghost.svg',
    dragon: 'dragon.svg',
    siniestro: 'dark.svg',
    acero: 'steel.svg',
    hada: 'fairy.svg'
}

function getTypeIcon(tipo) {
    const norm = normalizeTypeName(tipo)
    const file = typeIconMap[norm]
    if (!file) return null
    return `/assets/icons/${file}`
}

function capitalize(word) {
    if (!word || typeof word !== 'string') return ''
    return word.charAt(0).toUpperCase() + word.slice(1)
}

function getMoveTypeName(nombre) {
    const mov = getMovimientoCompleto(nombre) || props.movimientos.find(m => m.nombre === nombre)
    if (!mov || !mov.tipo) return ''
    const norm = normalizeTypeName(mov.tipo)
    // mantener estilo capitalizado sin acentos
    return capitalize(norm)
}

function getTypeIconByMove(nombre) {
    const mov = getMovimientoCompleto(nombre) || props.movimientos.find(m => m.nombre === nombre)
    if (!mov || !mov.tipo) return null
    return getTypeIcon(mov.tipo)
}

function getTypeIconStyleByMove(nombre) {
    const url = getTypeIconByMove(nombre)
    if (!url) return {}
    return { '--type-icon-url': `url(${url})` }
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
            <draggable v-model="ficha.personaliz.movimientosAprendidos" group="movimientos" item-key="nombre">
                <template #item="{ element: mov, index: i }">
                    <details class="movimiento" :style="getMoveStyle(mov)">
                        <summary class="movimiento-summary">
                            <span class="mov-left">
                             
                                {{ mov }}
                            </span>
                            <span class="mov-right">
                                {{ getMoveTypeName(mov) }}
                                <span v-if="getTypeIconByMove(mov)" class="type-icon-mask"
                                    :style="getTypeIconStyleByMove(mov)"></span>
                                <button @click="eliminarMov(mov, 'aprendidos')" class="borrar-btn">×</button>
                            </span>
                        </summary>
                        <MovsData v-if="getMovimientoCompleto(mov)" :ficha="ficha" :mov="getMovimientoCompleto(mov)" />
                    </details>
                </template>
            </draggable>

            <!-- Movimientos Extra -->
            <draggable v-model="ficha.personaliz.movimientosExtra" group="movimientos" item-key="nombre"
                handle=".movimiento-summary" :animation="200">
                <template #item="{ element: mov, index: i }">
                    <details class="movimiento" :style="getMoveStyle(mov)">
                        <summary class="movimiento-summary">
                            <span class="mov-left">
                              
                                {{ mov }} (Extra)
                            </span>
                            <span class="mov-right">
                                {{ getMoveTypeName(mov) }}
                                <span v-if="getTypeIconByMove(mov)" class="type-icon-mask"
                                    :style="getTypeIconStyleByMove(mov)"></span>
                                <button @click="eliminarMov(mov, 'extra')" class="borrar-btn">×</button>
                            </span>
                        </summary>
                        <MovsData v-if="getMovimientoCompleto(mov)" :ficha="ficha" :mov="getMovimientoCompleto(mov)" />
                    </details>
                </template>
            </draggable>
        </div>
    </section>
</template>

<style scoped>
h3{
    letter-spacing: 1px;
}
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
    border: 1px solid var(--mov-color, var(--color-principal2));
    margin: 10px 0;
}

.movimiento summary {
    background-color: var(--mov-color, var(--color-principal2));
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 0 10px;
    cursor: pointer;
    color: var(--mov-text, var(--color-texto));
}

.movimiento-summary {
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.borrar-btn {
    background-color: transparent;
    border: none;
    color: var(--mov-text, var(--color-texto));
    cursor: pointer;
    font-weight: bold;
    font-size: 30px;
    line-height: 25px;
    border-left: 1px solid var(--mov-text, currentColor);
    width: 40px;
    height: 30px;
    padding-bottom: 5px;
    background-color: color-mix(in srgb, var(--mov-color, var(--color-principal1)) 85%, #0000);
}

.borrar-btn:hover {
    background-color: var(--mov-color, var(--color-principal2));
}


.type-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
    filter: drop-shadow(0 1px 1px rgba(0,0,0,0.15));
}

.type-icon-mask {
    width: 18px;
    height: 18px;
    display: inline-block;
    background: var(--mov-text, currentColor);
    -webkit-mask: var(--type-icon-url) no-repeat center / contain;
    mask: var(--type-icon-url) no-repeat center / contain;
}

.mov-left,
.mov-right {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.mov-right {
    margin-left: auto;
}
</style>
