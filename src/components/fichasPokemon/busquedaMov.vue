<template>
    <div class="buscador">
        <div v-if="movimientos.length" class="sugerencias-wrapper">
            <table class="sugerencias">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Coste</th>
                        <th>Etiquetas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="m in movimientos" :key="m.nombre" @mousedown.prevent="emitirSeleccion(m.nombre)"
                        :class="{ seleccionado: m.nombre === seleccionado }">
                        <td>{{ m.nombre }}</td>
                        <td>
                            <span class="type-icon" :style="getTypeIconStyle(m.tipo)" :title="m.tipo"></span>
                        </td>
                        <td>{{ m.coste }}</td>
                        <td>{{ m.etiquetas ?? '—' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'

const props = defineProps(['movimientos', 'seleccionado'])
const emit = defineEmits(['seleccion'])

const valor = ref('')

// Mapeo de iconos por tipo (en /public/assets/icons)
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

function normalizeTypeName(tipo) {
    if (!tipo || typeof tipo !== 'string') return ''
    // pasar a minúsculas y eliminar acentos
    const sinAcentos = tipo.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return sinAcentos.toLowerCase().trim()
}

function getTypeIconStyle(tipo) {
    const norm = normalizeTypeName(tipo)
    const file = typeIconMap[norm]
    if (!file) return {}
    return { '--type-icon-url': `url(/assets/icons/${file})` }
}

function emitirSeleccion(nombre) {
    emit('seleccion', nombre)
    valor.value = ''
}
</script>

<style scoped>
.buscador {
    width: 100%;
    overflow: auto;
}

.sugerencias {
    min-width: 100%;
    border-collapse: collapse;

}

td {
    padding: 5px;
    text-align: center;
}

td:first-child {
    text-align: left;
}

tr:hover {
    background-color: var(--color-principal2);
    cursor: pointer;
}

.sugerencias thead th {
    position: sticky;
    top: 0;
    background-color: var(--color-principal1);
    z-index: 1;
}

.sugerencias th {
    padding: 8px 12px;
}

.seleccionado {
    background-color: var(--color-principal2) !important;
}

.type-icon {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: var(--color-texto);
    -webkit-mask: var(--type-icon-url) no-repeat center / contain;
    mask: var(--type-icon-url) no-repeat center / contain;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.15));
}

@media screen and (max-width: 768px) {
    .buscador {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 4px;
    }

    .sugerencias-wrapper {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
    }

    .sugerencias {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        font-size: 13px;
        padding: 4px 6px;
    }

    .type-icon {
        width: 14px;
        height: 14px;
    }
}
</style>
