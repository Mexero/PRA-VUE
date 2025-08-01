<template>
  <div class="moves-section">
    <div class="section-title">Movimientos</div>
    <div v-if="loading" class="loading-moves">Cargando movimientos...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else class="moves-container">
      <!-- Movimientos por nivel -->
      <div v-if="levelMoves.length > 0" class="moves-group">
        <h4 class="moves-group-title" @click="showLevelMoves = !showLevelMoves" :class="{ 'expanded': showLevelMoves }">
          <span>Movimientos por nivel</span>
          <span class="toggle-icon">{{ showLevelMoves ? '▼' : '▶' }}</span>
        </h4>
        <div v-if="[203].includes(pokeID)">A partir de nivel 12, Mew puede aprender 2 de sus Movimientos Enseñables al
          subir de Nivel.</div>
        <div v-show="showLevelMoves" class="moves-table-container">
          <table class="moves-table">
            <thead>
              <tr>
                <th>Nivel</th>
                <th v-for="(moves, index) in groupedMovesByLevel" :key="index">Movimiento {{ index + 1 }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="level in uniqueLevels" :key="level">
                <td class="level-cell">{{ level }}</td>
                <td v-for="(moves, index) in groupedMovesByLevel" :key="index" class="move-cell"
                  @mouseenter="moves[level] && handleMouseEnter($event, moves[level].nombre)"
                  @mouseleave="handleMouseLeave" @click="moves[level] && copyMoveDescription(moves[level].nombre)">
                  <div v-if="moves[level]" class="move-content">
                    <span class="move-name">{{ moves[level].nombre }}</span>
                    <span class="move-type" :class="`type-${normalizeType(moves[level].tipo)}`">{{ moves[level].tipo
                    }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Movimientos enseñables -->
      <div v-if="teachableMoves.length > 0" class="moves-group">
        <h4 class="moves-group-title" @click="showTeachableMoves = !showTeachableMoves"
          :class="{ 'expanded': showTeachableMoves }">
          <span>Movimientos enseñables</span>
          <span class="toggle-icon">{{ showTeachableMoves ? '▼' : '▶' }}</span>
        </h4>
        <div v-show="showTeachableMoves" class="moves-table-container">
          <div v-if="[203].includes(pokeID)">Mew puede aprender cualquier Movimiento que no tenga la Etiqueta de
            Legendario.</div>
          <table v-else class="moves-table">
            <tbody>
              <tr v-for="i in Math.ceil(teachableMoves.length / 3)" :key="i">
                <td v-for="j in 3" :key="j" class="move-cell"
                  @mouseenter="teachableMoves[(i - 1) * 3 + (j - 1)] && handleMouseEnter($event, teachableMoves[(i - 1) * 3 + (j - 1)].nombre)"
                  @mouseleave="handleMouseLeave"
                  @click="teachableMoves[(i - 1) * 3 + (j - 1)] && copyMoveDescription(teachableMoves[(i - 1) * 3 + (j - 1)].nombre)">
                  <div v-if="teachableMoves[(i - 1) * 3 + (j - 1)]" class="move-content">
                    <span class="move-name">{{ teachableMoves[(i - 1) * 3 + (j - 1)].nombre }}</span>
                    <span class="move-type"
                      :class="`type-${normalizeType(teachableMoves[(i - 1) * 3 + (j - 1)].tipo)}`">
                      {{ teachableMoves[(i - 1) * 3 + (j - 1)].tipo }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tooltip del movimiento -->
      <MoveTooltip v-if="hoveredMove && hoveredMoveDetails && hoveredMove === hoveredMoveDetails.nombre"
        :move-name="hoveredMove" :move-details="hoveredMoveDetails" :position="tooltipPosition" />

      <div v-if="levelMoves.length === 0 && teachableMoves.length === 0" class="no-moves">
        No se encontraron movimientos para este Pokémon
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { initDB, queryDB } from '@/services/dbWorkerService'

import MoveTooltip from './MoveTooltip.vue'

const props = defineProps(['pokeID']);

const levelMoves = ref([])
const teachableMoves = ref([])
const hoveredMove = ref(null)
const hoveredMoveDetails = ref(null)
const tooltipPosition = ref({ x: 0, y: 0 })
const groupedMovesByLevel = ref([])
const uniqueLevels = ref([])
const showLevelMoves = ref(false)
const showTeachableMoves = ref(false)

const isReady = ref(false)
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  try {
    await initDB()
    isReady.value = true
  } catch (err) {
    error.value = err.message || 'Error inicializando DB'
    console.warn(error.value)
  }
})

function normalizeType(type) {
  return type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

async function loadPokemonMoves(pokeID) {
  if (!props.pokeID || !isReady.value) return

  loading.value = true
  error.value = null

  let moves = []
  try {
    const res = await queryDB(`
            SELECT m.Nombre, m.Tipo, pm.NivelAprendizaje
            FROM pokemon_movimientos pm
            JOIN movimientos m ON pm.MovimientoID = m.ID
            WHERE pm.PokemonID = ?`,
      [pokeID]
    )
    const rows = res?.[0]?.values
    if (rows.length > 0) {
      for (const row of rows) {
        moves.push({
          nombre: row[0],
          tipo: row[1],
          nivel: row[2]
        })
      }
    }
    //Clasificar los movimientos y dejarlos ordenados
    levelMoves.value = moves
      .filter(move => move.nivel > 0)
      .sort((a, b) => a.nivel - b.nivel)

    teachableMoves.value = moves.sort((a, b) => a.nombre.localeCompare(b.nombre))

    //Crear lista por nivel
    const movesPerLevel = {}
    levelMoves.value.forEach(move => {
      if (!movesPerLevel[move.nivel]) {
        movesPerLevel[move.nivel] = []
      }
      movesPerLevel[move.nivel].push(move)
    })

    uniqueLevels.value = [...new Set(levelMoves.value.map(m => m.nivel))].sort((a, b) => a - b)

    const maxMoves = Math.max(...Object.values(movesPerLevel).map(m => m.length))

    groupedMovesByLevel.value = Array.from({ length: maxMoves }, (_, i) => {
      const column = {}
      uniqueLevels.value.forEach(level => {
        if (movesPerLevel[level] && movesPerLevel[level][i]) {
          column[level] = movesPerLevel[level][i]
        }
      })
      return column
    })
  } catch (err) {
    error.value = err.message || 'Error cargando movimientos '
    console.warn(error.value)
  } finally {
    loading.value = false
  }
}


async function handleMouseEnter(event, moveName) {
  if (!moveName) return

  const rect = event.target.getBoundingClientRect()
  const tooltipWidth = 300
  const tooltipHeight = 200
  const { innerWidth: windowWidth, innerHeight: windowHeight } = window

  let x
  const spaceRight = windowWidth - rect.right
  const spaceLeft = rect.left

  if (spaceRight >= tooltipWidth) {
    x = rect.right + 10
  } else if (spaceLeft >= tooltipWidth) {
    x = rect.left - tooltipWidth - 10
  } else {
    x = spaceRight > spaceLeft ? rect.right + 10 : rect.left - tooltipWidth - 10
  }

  let y = rect.top + rect.height / 2
  if (y + tooltipHeight / 2 > windowHeight) {
    y = windowHeight - tooltipHeight / 2
  } else if (y - tooltipHeight / 2 < 0) {
    y = tooltipHeight / 2
  }

  tooltipPosition.value = { x, y }

  if (moveName && hoveredMove.value !== moveName) {
    hoveredMove.value = moveName
    await cargarMovimiento(moveName)
  }
  else {
    console.error('Movimiento no encontrado: ', moveName)
    hoveredMoveDetails.value = null
    hoveredMove.value = null
  }
}

async function cargarMovimiento(movimiento) {
  error.value = null

  try {
    const res = await queryDB(`
      SELECT 
      Nombre, Tipo, Tiempo_de_uso, Coste, Dano, Rango, Etiquetas, Descripcion, 
      Stat_Asociado_1, Stat_Asociado_2, Stat_Asociado_3, Stat_Asociado_4,
      At, Salvacion, DC
      FROM movimientos
      WHERE Nombre = ?
      `,
      [movimiento]
    )
    const row = res?.[0]?.values?.[0]
    if (row) {
      hoveredMoveDetails.value = {
        nombre: row[0],
        tipo: row[1],
        accion: row[2],
        coste: row[3],
        danno: row[4] !== "" ? row[4] : null,
        rango: row[5] !== "" ? row[5] : null,
        etiquetas: row[6] !== "" ? row[6] : null,
        descripcion: row[7].split('\n'),
        statsAso: [row[8], row[9], row[10], row[11]].filter(stat => stat !== ""),
        ataque: (!row[12] || row[12] === 'False') ? false : true,
        salvacion: row[13],
        dc: row[14]
      }
    }
  } catch (err) {
    hoveredMoveDetails.value = null
    hoveredMove.value = null
    error.value = err.message || 'Error cargando movimiento ' + movimiento
    console.warn(error.value)
  } finally {
    loading.value = false
  }
}

function handleMouseLeave() {
  hoveredMove.value = null
  hoveredMoveDetails.value = null
  tooltipPosition.value = { x: 0, y: 0 }
}

async function copyMoveDescription(moveName) {
  if (!moveName || moveName !== hoveredMove.value) {
    return
  }

  if (hoveredMoveDetails.value && hoveredMoveDetails.value.descripcion) {
    await navigator.clipboard.writeText(hoveredMoveDetails.value.descripcion)

    const notification = document.createElement('div')
    notification.textContent = '¡Descripción copiada al portapapeles!'
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        transition: opacity 0.3s;
      `;
    document.body.appendChild(notification)
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => document.body.removeChild(notification), 300)
    }, 2000)
  }
}

//Rehacer cuando cambia el PokeID
watch(() => [
  props.pokeID,
  isReady
],
  async () => {
    if (props.pokeID && isReady.value) {
      hoveredMoveDetails.value = null;
      await loadPokemonMoves(props.pokeID);
    } else {
      levelMoves.value = [];
      teachableMoves.value = [];
    }
  }, { immediate: true, deep: true });
</script>

<style scoped>
.moves-section {
  margin-top: 20px;
}

.section-title {
  color: #ff6b6b;
  font-size: 1.6em;
  font-weight: bold;
  margin-bottom: 5px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 3px;
}

.moves-group {
  margin-bottom: 15px;
}

.moves-group-title {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.moves-group-title:hover {
  background-color: #e0e0e0;
}

.moves-group-title .toggle-icon {
  font-size: 0.8em;
  transition: transform 0.2s;
}

.moves-table-container {
  transition: all 0.3s ease-in-out;
}

.moves-table-container {
  overflow-x: auto;
  margin-top: 10px;
}

.moves-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border: 1px solid #e0e0e0;
}

.moves-table th,
.moves-table td {
  padding: 2px 4px;
  text-align: center;
  vertical-align: middle;
  border: 1px solid #e0e0e0;
  font-size: 0.85em;
}

.move-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.move-name {
  font-weight: 500;
  font-size: 0.85em;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.move-type {
  padding: 1px 4px;
  border-radius: 3px;
  color: white;
  font-weight: bold;
  font-size: 0.75em;
  text-transform: capitalize;
  min-width: 60px;
  text-align: center;
  flex-shrink: 0;
  border: 1px solid #000;
  /* Añadido: borde negro para todos los tipos */
}

.moves-group {
  margin-bottom: 10px;
}

.moves-group-title {
  font-size: 1.1em;
  margin-bottom: 5px;
}

.moves-table th {
  background-color: #f8f8f8;
  font-weight: 600;
  color: #333;
}

.level-cell {
  font-weight: 600;
  background-color: #f8f8f8;
  text-align: center;
}

.move-cell {
  cursor: pointer;
  transition: background-color 0.2s;
}

.move-cell:hover {
  background-color: #f0f0f0;
}

.move-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.move-name {
  font-weight: 500;
  font-size: 0.85em;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.move-name {
  font-weight: 500;
  flex-grow: 1;
}

.move-level {
  background-color: #e0e0e0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  margin-right: 8px;
}

.move-type {
  padding: 1px 4px;
  border-radius: 3px;
  color: white;
  font-weight: bold;
  font-size: 0.75em;
  text-transform: capitalize;
  min-width: 60px;
  text-align: center;
  flex-shrink: 0;
}

.loading-moves,
.error-message,
.no-moves {
  padding: 10px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-top: 10px;
}

.loading-moves {
  color: #666;
}

.error-message {
  color: #dc3545;
}

.no-moves {
  color: #666;
  font-style: italic;
}

/* Estilos para los tipos de Pokémon */
.type-normal {
  background-color: #A8A878;
}

.type-fuego {
  background-color: #F08030;
}

.type-agua {
  background-color: #6890F0;
}

.type-electrico {
  background-color: #F8D030;
}

.type-planta {
  background-color: #78C850;
}

.type-hielo {
  background-color: #98D8D8;
}

.type-lucha {
  background-color: #C03028;
}

.type-veneno {
  background-color: #A040A0;
}

.type-tierra {
  background-color: #E0C068;
}

.type-volador {
  background-color: #A890F0;
}

.type-psiquico {
  background-color: #F85888;
}

.type-bicho {
  background-color: #A8B820;
}

.type-roca {
  background-color: #B8A038;
}

.type-fantasma {
  background-color: #705898;
}

.type-dragon {
  background-color: #7038F8;
}

.type-siniestro {
  background-color: #705848;
}

.type-acero {
  background-color: #B8B8D0;
}

.type-hada {
  background-color: #EE99AC;
}

.type-situacional {
  color: black;
}
</style>