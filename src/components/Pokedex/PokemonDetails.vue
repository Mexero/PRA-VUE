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
        <img :src="src" :alt="pokemon.especie" class="pokemon-detail-image" />
      </div>

      <div class="stat-block-body">
        <div class="unified-stats-section">
          <div class="pokemon-size">Pokemon {{ pokemon.otros.tamano }}
            {{ pokemon.natHabil[0] ? (', Naturalmente hábil en ' + pokemon.natHabil[0]) : '' }}
            {{ pokemon.natHabil[1] ? (' y ' + pokemon.natHabil[1]) : '' }}</div>
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
                  <td>{{ pokemon.stats.fue }}{{ pokemon.saves.fue === 2 ? ' ☆' : pokemon.saves.fue === 4 ? ' ★' : ''
                  }}</td>
                </tr>
                <tr>
                  <td>AGI</td>
                  <td>{{ pokemon.stats.agi }}{{ pokemon.saves.agi === 2 ? ' ☆' : pokemon.saves.agi === 4 ? ' ★' : ''
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
                  <td>{{ pokemon.stats.res }}{{ pokemon.saves.res === 2 ? ' ☆' : pokemon.saves.res === 4 ? ' ★' : ''
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
                  <td>{{ pokemon.stats.esp }}{{ pokemon.saves.esp === 2 ? ' ☆' : pokemon.saves.esp === 4 ? ' ★' : ''
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
        <h3 class="section-title">Habilidades</h3>
        <p v-if="pokemon.especie === 'Arceus'"> Arceus tiene todas las Habilidades como Habilidades Ocultas.</p>
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

      <div v-if="pokemon && (pokemon.evoDe || pokemon.evolucion)" class="pokemon-evolution detail-section">
        <h3 class="section-title">Línea Evolutiva</h3>
        <div class="evolution-container">
          <div v-if="pokemon.evoDe" class="evolution-group">
            <span class="evolution-label">Evoluciona de:</span>
            <div class="evolution-cards">
              <EvolutionCard v-if="pokemon.evoDe" :nombre="pokemon.evoDe"
                :numero="getPokemonNumberByName(pokemon.evoDe)" :nivel="null" :requisitos="null" :otros="null"
                :esAlternativo="IsAltByName(pokemon.evoDe)" @show-details="emitirEspecie" />
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
                :requisitos="evolucion.requisitos" :otros="evolucion.otros"
                :esAlternativo="IsAltByName(evolucion.nombre)" @show-details="emitirEspecie" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="pokemon && pokemon.otros" class="detail-section">
        <div class="detail-section otros">
          <h3 class="section-title">Información Secundaria</h3>
          <div class="otros-table">
            <span class="th">Nivel mínimo</span>
            <span class="td">{{ pokemon.otros.nivMinimo }}</span>
            <span class="th">Ratio de Captura</span>
            <span class="td">{{ pokemon.otros.ratioCaptura }}</span>
            <span class="th">Dieta</span>
            <span class="td">{{ pokemon.otros.dieta }}</span>
            <span class="th">Sexo</span>
            <span class="td">{{ pokemon.otros.sexo }}</span>
            <span class="th">Hábitat</span>
            <span class="td">{{ pokemon.otros.habitat.split('\n').join(', ') }}</span>
            <template v-if="pokemon.otros.sentidos">
              <span class="th">Sentidos</span>
              <span class="td">{{ pokemon.otros.sentidos.split('\n').join(', ') }}</span>
            </template>
          </div>
        </div>
      </div>
      <!-- Sección de Movimientos -->
      <div class="detail-section" v-if="pokemon && pokemon.id">
        <PokemonMoves :pokeID="pokemon.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { initDB, queryDB } from '@/services/dbWorkerService'
import { updateSprite } from '@/utils/updateSprite'

import abilityDetails from '../Pokedex/AbilityDetails.vue'
import PokemonMoves from '../Pokedex/PokemonMoves.vue'
import EvolutionCard from '../Pokedex/EvolutionCard.vue'

const { pokemon, pokedex } = defineProps(['pokemon', 'pokedex'])

const emit = defineEmits(['show-details']);

function emitirEspecie(e) {
  emit('show-details', e)
}

//flags DB
const isReady = ref(false)
const habilidadesLoading = ref(false)
const habilidadesError = ref(null)

const selectedAbility = ref(null)

const normalAbilities = ref(null)
const hiddenAbilities = ref(null)

const src = ref(null)

function normalizeType(type) {
  if (!type) return '';
  return type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
  async () => {
    if (!isReady.value) {
      try {
        await initDB()
        isReady.value = true
      } catch (err) {
        habilidadesError.value = err.message || 'Error inicializando DB'
        console.warn(habilidadesError.value)
      }
    }
    if (pokemon) {
      habilidadesError.value = false
      habilidadesLoading.value = true

      normalAbilities.value = await cargarHabilidades(pokemon.habilidades, 'Normales')
      hiddenAbilities.value = await cargarHabilidades(pokemon.habilidadesOcultas, 'Ocultas')

      src.value = await updateSprite(pokemon.especie, pokemon.esAlternativo, pokemon.numPokedex)

      habilidadesLoading.value = false
    }
  },
  { deep: true, immediate: true }
)

async function cargarHabilidades(habs, type) {
  const habilidades = habs.filter(Boolean)
  const placeholders = habilidades.map(() => '?').join(', ')

  let data = []
  try {
    const res = await queryDB(
      `SELECT Nombre, Descripcion, Legendaria, Transformacion
      FROM habilidades
      WHERE Nombre IN (${placeholders})`,
      habilidades)

    const rows = (res?.[0]?.values || [])
    if (rows.length > 0) {
      for (const row of rows) {
        data.push({
          nombre: row[0],
          descripcion: row[1],
          legendaria: row[2],
          transformacion: row[3],
          oculta: type === 'Ocultas'
        })
      }
    }
  } catch (err) {
    habilidadesError.value = err.message || 'Error cargando habilidades'
    console.warn(habilidadesError.value)
  } finally {
    return data
  }
}

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

function IsAltByName(especie) {
  if ((typeof especie) !== 'string') {
    console.warn('No es una especie: ' + especie)
    return 0
  }
  const resultado = pokedex.find(p => p.especie === especie)
  return resultado ? resultado.esAlternativo : 0
}
</script>


<style scoped>
@import '../../css/typeColors.css';

* {
  color: var(--color-texto)
}

/* === CONTENEDOR PRINCIPAL === */
.pokemon-details {
  padding: 25px;
  background-color: var(--color-hoverBloque);
  border: 2px solid #999;
  border-top: 5px solid var(--color-principal1);
  font-size: 14px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* === TITULO DEL POKEMON === */
.pokemon-title h2 {
  margin: 0;
  color: var(--color-texto);
  font-size: 2em;
  font-weight: 900;
  letter-spacing: 1px;
}

.pokemon-title {
  flex: 1;
}

/* === SECCIONES === */
.section-title {
  color: var(--color-secundario);
  font-size: 1.6em;
  font-weight: bold;
  margin-bottom: 8px;
  border-bottom: 2px solid var(--color-principal2);
  padding-bottom: 4px;
}

/* === TIPOS === */
.types-container {
  display: flex;
  gap: 8px;
  margin-top: 5px;
}

.type-badge {
  padding: 4px 10px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  text-transform: capitalize;
  font-size: 0.9em;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* === ABILIDADES === */
.abilities-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ability-item {
  background-color: var(--color-principal2);
  color: var(--color-texto);
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.ability-item:hover {
  background: var(--color-secundario);
  color: white;
  transform: translateY(-2px);
}

.hidden-ability {
  border: 2px dashed var(--color-principal1);
}

.hidden-label {
  color: #999;
  margin-left: 4px;
  font-style: italic;
}

/* === DETALLES DE HABILIDAD === */
.ability-details {
  background: var(--color-fondoTexto);
  border: 1px solid var(--color-principal2);
  border-radius: 8px;
  padding: 10px;
  margin-left: 20px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  animation: slideDown 0.4s ease-in-out;
}

/* === ANIMACION === */
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

/* === MENSAJES === */
.loading-abilities,
.error-message,
.no-abilities {
  padding: 10px;
  text-align: center;
  background: #fff0f0;
  border-radius: 6px;
  margin-top: 10px;
  font-weight: 500;
}

.error-message {
  color: #dc3545;
}

.loading-abilities {
  color: #888;
}

.no-abilities {
  color: #999;
  font-style: italic;
}

/* === BLOQUE DE STATS === */
.stat-block {
  background-color: var(--color-fondoTexto);
  padding: 20px;
  border-radius: 14px;
  border: 1px solid #b7b9bd;
}

.stat-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 15px;
  background-color: var(--color-principal1);
  border-radius: 10px;
}

.pokemon-detail-image {
  width: 120px;
  height: 120px;
  margin-left: 15px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
}

/* === STATS UNIFICADAS === */
.unified-stats-section {
  background: var(--color-fondoTexto);
  border: 1px solid var(--color-tabla1);
  border-radius: 8px;
  padding: 12px;
  text-align: left;
}

.pokemon-size {
  color: #aaa5a5;
  margin-bottom: 8px;
  font-style: italic;
  border-bottom: 1px solid var(--color-principal2);
  padding-bottom: 8px;
}

.vital-stat-row {
  margin-bottom: 4px;
}

.vital-stat-label {
  font-weight: bold;
}

.speeds-inline {
  text-align: left;
}

/* === TABLA DE STATS === */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 15px 0;
}

.stats-table table {
  width: 100%;
  border-collapse: collapse;
}

.stats-table td {
  padding: 8px;
  text-align: center;
  border: 1px solid var(--color-secundario);
}

.stats-table td:first-child {
  font-weight: bold;
}

.stats-table td:last-child {
  font-family: monospace;
}

/* === TABLA OTROS === */
.otros-table {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  padding: 20px;
  margin: auto;
}

.otros-table .th,
.otros-table .td {
  padding: 8px;
}

.otros-table .td {
  text-align: left;
}

.otros-table .th {
  font-weight: 700;
  text-align: right;
}

@media (max-width:1050px) and (min-width:950px) {
  .otros-table {
    grid-template-columns: repeat(2, 1fr);
    ;
  }
}

@media (max-width:950px) and (min-width:750px) {
  .otros-table {
    grid-template-columns: repeat(6, 1fr);
    ;
  }
}

@media (max-width:750px) and (min-width:550px) {
  .otros-table {
    grid-template-columns: repeat(4, 1fr);
    ;
  }
}

@media (max-width:550px) {
  .otros-table {
    grid-template-columns: repeat(2, 1fr);
    ;
  }
}

/* === EVOLUCIONES === */
.evolution-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  background-color: #fff;
  padding: 6px 10px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}
</style>