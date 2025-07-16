<template>
  <div v-if="pokemon" class="pokemon-details">
    <div class="stat-block">
      <div class="stat-block-header">
        <div class="pokemon-title">
          <h2>#{{ pokemon.numPokedex.substring(1) }} {{ pokemon.especie }}</h2>
          <div class="types-container">
            <span class="type-badge" :class="`type-${normalizeType(pokemon.tipos[0])}`">{{ pokemon.tipos[0] }}</span>
            <span v-if="pokemon.tipos[1] && pokemon.tipos[1] !== ''" class="type-badge"
              :class="`type-${normalizeType(pokemon.tipos[1])}`">
              {{ pokemon.tipos[1] }}
            </span>
          </div>
        </div>
        <img
          :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseInt(pokemon.numPokedex.substring(1))}.png`"
          :alt="pokemon.especie" class="pokemon-detail-image" />
      </div>

      <div class="stat-block-body">
        <div class="unified-stats-section">
          <div class="pokemon-size">Pokemon {{ pokemon.otros.tamano }}</div>
          <div class="vital-stat-row">
            <span class="vital-stat-label">{{ pokemon.calculosCa[1] !== '' ? 'AC 1' : 'AC' }}: </span>
            <span class="vital-stat-value">{{ pokemon.calculosCa[0] }}</span>
          </div>
          <div class="vital-stat-row" v-if="pokemon.calculosCa[1] !== ''">
            <span class="vital-stat-label">AC 2: </span>
            <span class="vital-stat-value">{{ pokemon.calculosCa[1] }}</span>
          </div>
          <div class="vital-stat-row">
            <span class="vital-stat-label">Vitalidad: </span>
            <span class="vital-stat-value">{{ pokemon.vit }}</span>
          </div>
          <div class="speeds-inline">
            <span class="vital-stat-label">Velocidad: </span>
            <template v-if="pokemon.velocidades.caminado">{{ pokemon.velocidades.caminado }}m</template>
            <template v-if="pokemon.velocidades.trepado">
              <template v-if="pokemon.velocidades.caminado">, </template>
              Trepar {{ pokemon.velocidades.trepado }}m
            </template>
            <template v-if="pokemon.velocidades.excavado">
              <template v-if="pokemon.velocidades.caminado || pokemon.velocidades.trepado">, </template>
              Excavar {{ pokemon.velocidades.excavado }}m
            </template>
            <template v-if="pokemon.velocidades.nado">
              <template
                v-if="pokemon.velocidades.caminado || pokemon.velocidades.trepado || pokemon.velocidades.excavado">,
              </template>
              Nadar {{ pokemon.velocidades.nado }}m
            </template>
            <template v-if="pokemon.velocidades.vuelo">
              <template
                v-if="pokemon.velocidades.caminado || pokemon.velocidades.trepado || pokemon.velocidades.excavado || pokemon.velocidades.nado">,
              </template>
              Volar {{ pokemon.velocidades.vuelo }}m
            </template>
            <template v-if="pokemon.velocidades.levitado">
              <template
                v-if="pokemon.velocidades.caminado || pokemon.velocidades.trepado || pokemon.velocidades.excavado || pokemon.velocidades.nado || pokemon.velocidades.vuelo">,
              </template>
              Levitar {{ pokemon.velocidades.levitado }}m
            </template>
          </div>
        </div>


        <div class="stats-section">
          <div class="stats-table">
            <table>
              <tbody>
                <tr>
                  <td>FUE</td>
                  <td>{{ pokemon.stats.fue }}{{ pokemon.saves.fue === '2' ? ' ☆' : pokemon.saves.fue === '4' ? ' ★' : ''
                  }}</td>
                </tr>
                <tr>
                  <td>AGI</td>
                  <td>{{ pokemon.stats.agi }}{{ pokemon.saves.agi === '2' ? ' ☆' : pokemon.saves.agi === '4' ? ' ★' : ''
                  }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="stats-table">
            <table>
              <tbody>
                <tr>
                  <td>RES</td>
                  <td>{{ pokemon.stats.res }}{{ pokemon.saves.res === '2' ? ' ☆' : pokemon.saves.res === '4' ? ' ★' : ''
                  }}
                  </td>
                </tr>
                <tr>
                  <td>MEN</td>
                  <td>{{ pokemon.stats.men }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="stats-table">
            <table>
              <tbody>
                <tr>
                  <td>ESP</td>
                  <td>{{ pokemon.stats.esp }}{{ pokemon.saves.esp === '2' ? ' ☆' : pokemon.saves.esp === '4' ? ' ★' : ''
                  }}
                  </td>
                </tr>
                <tr>
                  <td>PRE</td>
                  <td>{{ pokemon.stats.pre }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="abilities-section">
        <div class="section-title">Habilidades</div>
        <div v-if="habilidadesLoading" class="loading-abilities">Cargando habilidades...</div>
        <div v-else-if="habilidadesError" class="error-message">Ha ocurrido un error. Recarga la página.</div>
        <div v-else class="abilities-container">
          <div v-for="ability in abilitiesDetails" class="ability-group">
            <div class="ability-item" :class="{ 'hidden-ability': ability.oculta }"
              @click="toggleAbility(ability.nombre)">
              <span class="ability-name">{{ ability.nombre }}</span>
              <span v-if="ability.oculta" class="hidden-label">(Oculta)</span>
            </div>
            <abilityDetails v-if="selectedAbility === ability.nombre" :ability="ability" />
          </div>
          <div v-if="abilitiesDetails.length === 0" class="no-abilities">
            No se encontraron habilidades para este Pokémon
          </div>
        </div>
      </div>
    </div>
  </div>



  <div v-if="pokemon && (pokemon.evoDe !== '' || pokemon.evolucion)" class="pokemon-evolution detail-section">
    <h3>Línea Evolutiva</h3>
    <div class="evolution-container">
      <div v-if="pokemon.evoDe !== ''" class="evolution-group">
        <span class="evolution-label">Evoluciona de:</span>
        <div class="evolution-cards">
          <EvolutionCard :nombre="pokemon.evoDe" :numero="getPokemonNumberByName(pokemon.evoDe)" :nivel="null"
            :requisitos="null" :otros="null" @show-details="emitirEspecie" />
        </div>
      </div>
      <div v-if="pokemon.evolucion && pokemon.evolucion.mensajeExtra" class="evolution-item">
        <span class="evolution-value">{{ pokemon.evolucion.mensajeExtra }}</span>
      </div>
      <div v-else-if="pokemon.evolucion" class="evolution-group">
        <span class="evolution-label">Evoluciona a:</span>
        <div class="evolution-cards">
          <EvolutionCard v-for="(evolucion, index) in pokemon.evolucion" :key="index" :nombre="evolucion.nombre"
            :numero="getPokemonNumberByName(evolucion.nombre)" :nivel="evolucion.nivel"
            :requisitos="evolucion.requisitos" :otros="evolucion.otros" @show-details="emitirEspecie" />
        </div>
      </div>
    </div>


    <!-- Sección de Movimientos -->
    <PokemonMoves :pokemon="pokemon" />
    <div class="no-pokemon-selected">
      <p>Selecciona un Pokémon para ver sus detalles</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'
import worker from '@/sqlWorker.js'

import abilityDetails from '../Pokedex/AbilityDetails.vue'
import PokemonMoves from '../Pokedex/PokemonMoves.vue'
import EvolutionCard from '../Pokedex/EvolutionCard.vue'

const { pokemon, pokedex } = defineProps(['pokemon', 'pokedex'])

const emit = defineEmits(['show-details']);

function emitirEspecie(e) {
  console.log('Emitido: ', e)
  emit('show-details', e)


}

const selectedAbility = ref(null)

const normalAbilities = ref(null)
const hiddenAbilities = ref(null)

const habilidadesLoading = ref(false)
const habilidadesError = ref(null)

function normalizeType(type) {
  return type.toLowerCase().normalize('NFD').replace(/\u0300-\u036f/g, '')
}


const abilitiesDetails = computed(() => {
  if (!normalAbilities.value && !hiddenAbilities.value) {
    return []
  }

  return [
    ...(normalAbilities.value || []),
    ...(hiddenAbilities.value || [])
  ]
})

// <========= CARGAR HABILIDADES =============>
watch([
  () => pokemon
],
  () => {
    if (pokemon) {
      habilidadesError.value = false
      habilidadesLoading.value = true
      cargarHabilidades(pokemon.habilidades, 'Normales')
      cargarHabilidades(pokemon.habilidadesOcultas, 'Ocultas')
    }
  },
  { deep: true, immediate: true }
)

function cargarHabilidades(habs, type) {
  const habilidades = habs.filter(Boolean)
  const placeholders = habilidades.map(() => '?').join(', ')
  worker.postMessage({
    type: 'query',
    query: `SELECT Nombre, Descripcion, Comun_o_Legendaria, Transformacion
          FROM pokemexe_habilidades
          WHERE Nombre IN (${placeholders})`,
    params: habilidades,
    origin: "CambiarHabilidades" + type
  })
}

worker.addEventListener('message', handleHabs);

function handleHabs(e) {
  if (e.data.type === 'result' && e.data.origin.includes('CambiarHabilidades')) {
    const rows = e.data.result?.[0]?.values
    if (rows.length > 0) {
      let habilidades = []
      for (const row of rows) {
        habilidades.push({
          nombre: row[0],
          descripcion: row[1],
          legendaria: row[2] === "Legendaria",
          transformacion: row[3] === "Transformación",
          oculta: e.data.origin.includes('Ocultas')
        })
      }
      if (e.data.origin.includes('Normales'))
        normalAbilities.value = habilidades
      if (e.data.origin.includes('Ocultas'))
        hiddenAbilities.value = habilidades
    }
  }
  else if (e.data.type === 'error') {
    habilidadesError.value = true
    console.error("Error al cargar las habilidades:", e.data.error)
  }
  habilidadesLoading.value = false

}

onUnmounted(() => {
  worker.removeEventListener('message', handleHabs)
})


function toggleAbility(nombre) {
  selectedAbility.value = selectedAbility.value === nombre ? null : nombre
}

function getPokemonNumberByName(especie) {
  if ((typeof especie) !== 'string') {
    console.warn('No es una especie: ' + especie)
    return '#0001'
  }
  const resultado = pokedex.find(p => p.especie === especie)
  return resultado ? resultado.numPokedex : '#0001'
}
</script>


<style scoped>
.pokemon-details {
  padding: 15px;
  height: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  border-top: 4px solid #ff6b6b;
  font-size: 14px;
}

.pokemon-title h2 {
  margin: 0;
  color: white;
  font-size: 1.8em;
  font-weight: bold;
  padding-bottom: 5px;
}

.section-title {
  color: #ff6b6b;
  font-size: 1.6em;
  font-weight: bold;
  margin-bottom: 5px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 3px;
}

.type-badge {
  padding: 3px 8px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  text-transform: capitalize;
}

.abilities-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ability-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ability-item {
  background-color: #f8f8f8;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #e0e0e0;
}

.ability-details {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  margin-left: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease-in-out;
  animation: slideDown 0.5s ease-in-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ability-info {
  color: #333;
  font-size: 0.9em;
}

.ability-table {
  width: 100%;
  margin-bottom: 10px;
  border-collapse: collapse;
}

.ability-table td {
  padding: 4px 8px;
  border-bottom: 1px solid #e0e0e0;
}

.ability-label {
  font-weight: bold;
  color: #666;
  width: 120px;
}

.ability-description {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}

.loading-abilities,
.loading-evolution,
.error-message,
.no-abilities {
  padding: 10px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-top: 10px;
}

.loading-abilities {
  color: #666;
}

.error-message {
  color: #dc3545;
}

.no-abilities {
  color: #666;
  font-style: italic;
}

.hidden-label {
  color: #666;
  margin-left: 4px;
}

.pokemon-size {
  text-align: left;
  color: #666;
  margin-bottom: 8px;
  font-style: italic;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}

.stat-block {
  background: #ffffff;
  padding: 20px;
  border: 1px solid #e0e0e0;
  margin: 10px;
}

.stat-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 15px;
  background-color: #ff6b6b;
  color: white;
}

.pokemon-title h2 {
  margin: 0;
  color: white;
  font-weight: bold;
  padding-bottom: 5px;
}

.pokemon-title {
  flex: 1;
}

.pokemon-detail-image {
  width: 120px;
  height: 120px;
  margin-left: 15px;
}

.section-title {
  color: #ff6b6b;
  font-weight: bold;
  margin-bottom: 5px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 3px;
}

.types-container {
  display: flex;
  gap: 8px;
  margin-top: 5px;
}

.type-badge {
  padding: 3px 8px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  text-transform: capitalize;
}

.abilities-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ability-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ability-item {
  background-color: #f8f8f8;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #e0e0e0;
}

.ability-details {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  margin-left: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease-in-out;
  animation: slideDown 0.5s ease-in-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ability-info {
  color: #333;
  font-size: 0.9em;
}

.ability-table {
  width: 100%;
  margin-bottom: 10px;
  border-collapse: collapse;
}

.ability-table td {
  padding: 4px 8px;
  border-bottom: 1px solid #e0e0e0;
}

.ability-label {
  font-weight: bold;
  color: #666;
  width: 120px;
}

.ability-description {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}

.loading-abilities,
.loading-evolution,
.error-message,
.no-abilities {
  padding: 10px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-top: 10px;
}

.loading-abilities {
  color: #666;
}

.error-message {
  color: #dc3545;
}

.no-abilities {
  color: #666;
  font-style: italic;
}

.ability-item:hover {
  background-color: #ff6b6b;
  color: white;
}

.hidden-ability {
  background-color: #f8f8f8;
  border: 1px dashed #ff6b6b;
}

.hidden-label {
  color: #666;
  margin-left: 4px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 15px 0;
}

.stats-table {
  width: 100%;
  margin: 0;
}

.stats-table table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e0e0e0;
}

.stats-table th,
.stats-table td {
  padding: 8px;
  text-align: center;
  border: 1px solid #e0e0e0;
  color: #333;
}

.stats-table td:first-child {
  font-weight: bold;
  color: #666;
}

.stats-table td:last-child {
  font-family: monospace;
  color: #ff6b6b;
}

.save-header {
  border: none !important;
  color: #666;
  text-align: center;
}

.vital-stats-section {
  margin-bottom: 10px;
  background: #f8f8f8;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  text-align: left;
}

.vital-stat-label {
  font-weight: bold;
}

.speeds-section {
  margin: 8px 0;
  padding: 8px;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  text-align: left;
}

.unified-stats-section {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px;
  margin: 0;
  text-align: left;
}

.pokemon-size {
  text-align: left;
  color: #666;
  margin-bottom: 8px;
  font-style: italic;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}

.vital-stat-row {
  margin-bottom: 4px;
  text-align: left;
}

.speeds-inline {
  text-align: left;
}

.speed-key {
  font-weight: bold;
  color: #ff6b6b;
  padding-right: 10px;
}

.speed-value {
  font-family: monospace;
}

.evolution-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.evolution-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.evolution-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 5px;
}

.evolution-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 6px 10px;
  border: 1px solid #e0e0e0;
}

.evolution-label {
  color: #666;
  font-weight: bold;
  margin-bottom: 5px;
}

.no-pokemon-selected {
  text-align: center;
  padding: 20px;
  color: #666;
}

.type-badge.type-normal {
  background-color: #A8A878;
}

.type-badge.type-fuego {
  background-color: #F08030;
}

.type-badge.type-agua {
  background-color: #6890F0;
}

.type-badge.type-planta {
  background-color: #78C850;
}

.type-badge.type-electrico {
  background-color: #F8D030;
}

.type-badge.type-hielo {
  background-color: #98D8D8;
}

.type-badge.type-lucha {
  background-color: #C03028;
}

.type-badge.type-veneno {
  background-color: #A040A0;
}

.type-badge.type-tierra {
  background-color: #E0C068;
}

.type-badge.type-volador {
  background-color: #A890F0;
}

.type-badge.type-psiquico {
  background-color: #F85888;
}

.type-badge.type-bicho {
  background-color: #A8B820;
}

.type-badge.type-roca {
  background-color: #B8A038;
}

.type-badge.type-fantasma {
  background-color: #705898;
}

.type-badge.type-dragon {
  background-color: #7038F8;
}

.type-badge.type-siniestro {
  background-color: #705848;
}

.type-badge.type-acero {
  background-color: #B8B8D0;
}

.type-badge.type-hada {
  background-color: #EE99AC;
}
</style>