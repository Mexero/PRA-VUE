<template>
  <div v-if="pokemon" class="pokemon-details">
    <div class="stat-block">
      <div class="stat-block-header">
        <div class="pokemon-title">
          <h2>#{{ pokemon.Numero_pokedex.substring(1) }} {{ pokemon.Especie }}</h2>
          <div class="types-container">
            <span class="type-badge" :class="`type-${normalizeType(pokemon.Tipo_primario)}`">{{ pokemon.Tipo_primario }}</span>
            <span v-if="pokemon.Tipo_secundario && pokemon.Tipo_secundario !== 'Ninguno'" 
                  class="type-badge" 
                  :class="`type-${normalizeType(pokemon.Tipo_secundario)}`">
              {{ pokemon.Tipo_secundario }}
            </span>
          </div>
        </div>
        <img 
          :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseInt(pokemon.Numero_pokedex.substring(1))}.png`"
          :alt="pokemon.Especie"
          class="pokemon-detail-image"
        />
      </div>

      <div class="stat-block-body">
        <div class="unified-stats-section">
          <div class="pokemon-size">Pokemon {{ pokemon.Tamano }}</div>
          <div class="vital-stat-row">
            <span class="vital-stat-label">{{ pokemon.AC2 ? 'AC 1' : 'AC' }}: </span>
            <span class="vital-stat-value">{{ pokemon.AC1 }}</span>
          </div>
          <div class="vital-stat-row" v-if="pokemon.AC2">
            <span class="vital-stat-label">AC 2: </span>
            <span class="vital-stat-value">{{ pokemon.AC2 }}</span>
          </div>
          <div class="vital-stat-row">
            <span class="vital-stat-label">Vitalidad: </span>
            <span class="vital-stat-value">{{ pokemon.Vitalidad }}</span>
          </div>
          <div class="speeds-inline">
            <span class="vital-stat-label">Velocidad: </span>
            <template v-if="pokemon.V_Caminado">{{ pokemon.V_Caminado }}m</template>
            <template v-if="pokemon.V_Trepado">
              <template v-if="pokemon.V_Caminado">, </template>
              Trepar {{ pokemon.V_Trepado }}m
            </template>
            <template v-if="pokemon.V_Excavado">
              <template v-if="pokemon.V_Caminado || pokemon.V_Trepado">, </template>
              Excavar {{ pokemon.V_Excavado }}m
            </template>
            <template v-if="pokemon.V_Nado">
              <template v-if="pokemon.V_Caminado || pokemon.V_Trepado || pokemon.V_Excavado">, </template>
              Nadar {{ pokemon.V_Nado }}m
            </template>
            <template v-if="pokemon.V_Vuelo">
              <template v-if="pokemon.V_Caminado || pokemon.V_Trepado || pokemon.V_Excavado || pokemon.V_Nado">, </template>
              Volar {{ pokemon.V_Vuelo }}m
            </template>
            <template v-if="pokemon.V_Levitado">
              <template v-if="pokemon.V_Caminado || pokemon.V_Trepado || pokemon.V_Excavado || pokemon.V_Nado || pokemon.V_Vuelo">, </template>
              Levitar {{ pokemon.V_Levitado }}m
            </template>
          </div>
        </div>

        <div class="stats-section">
          <div class="stats-table">
            <table>
              <tr>
                <td>FUE</td>
                <td>{{ pokemon.FUE }}{{ pokemon.S_FUE === 2 ? ' ☆' : pokemon.S_FUE === 4 ? ' ★' : '' }}</td>
              </tr>
              <tr>
                <td>AGI</td>
                <td>{{ pokemon.AGI }}{{ pokemon.S_AGI === 2 ? ' ☆' : pokemon.S_AGI === 4 ? ' ★' : '' }}</td>
              </tr>
            </table>
          </div>
          <div class="stats-table">
            <table>
              <tr>
                <td>RES</td>
                <td>{{ pokemon.RES }}{{ pokemon.S_RES === 2 ? ' ☆' : pokemon.S_RES === 4 ? ' ★' : '' }}</td>
              </tr>
              <tr>
                <td>MEN</td>
                <td>{{ pokemon.MEN }}</td>
              </tr>
            </table>
          </div>
          <div class="stats-table">
            <table>
              <tr>
                <td>ESP</td>
                <td>{{ pokemon.ESP }}{{ pokemon.S_ESP === 2 ? ' ☆' : pokemon.S_ESP === 4 ? ' ★' : '' }}</td>
              </tr>
              <tr>
                <td>PRE</td>
                <td>{{ pokemon.PRE }}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="abilities-section">
          <div class="section-title">Habilidades</div>
          <div v-if="loading" class="loading-abilities">Cargando habilidades...</div>
          <div v-else-if="error" class="error-message">{{ error }}</div>
          <div v-else class="abilities-container">
            <div v-for="ability in pokemonAbilities" :key="ability.ID" class="ability-group">
              <div class="ability-item" :class="{ 'hidden-ability': ability.Es_Oculta }" @click="toggleAbility(ability.Nombre)">
                <span class="ability-name">{{ ability.Nombre }}</span>
                <span v-if="ability.Es_Oculta" class="hidden-label">(Oculta)</span>
              </div>
              <AbilityDetails
                v-if="selectedAbility === ability.Nombre"
                :ability="ability.Nombre"
                :ability-details="abilityDetails"
              />
            </div>
            <div v-if="pokemonAbilities.length === 0" class="no-abilities">
              No se encontraron habilidades para este Pokémon
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pokemon-evolution detail-section">
      <h3>Línea Evolutiva</h3>
      <div v-if="evolutionLoading" class="loading-evolution">Cargando datos de evolución...</div>
      <div v-else-if="evolutionError" class="error-message">{{ evolutionError }}</div>
      <div v-else class="evolution-container">
        <div v-if="evolutionData && evolutionData.Evoluciona_de" class="evolution-group">
          <span class="evolution-label">Evoluciona de:</span>
          <div class="evolution-cards">
            <EvolutionCard 
              :pokemon-name="evolutionData.Evoluciona_de" 
              :pokemon-number="getPokemonNumberFromName(evolutionData.Evoluciona_de)" 
              @show-details="showPokemonByName"
            />
          </div>
        </div>
        <div v-if="evolutionData && (evolutionData.Evoluciona_a || (evolutionData.evoluciones && evolutionData.evoluciones.length > 0))" class="evolution-group">
          <span class="evolution-label">Evoluciona a:</span>
          <div class="evolution-cards">
            <!-- Si tenemos el array de evoluciones, mostramos una card por cada evolución -->
            <template v-if="evolutionData.evoluciones && evolutionData.evoluciones.length > 0">
              <EvolutionCard 
                v-for="(evolucion, index) in evolutionData.evoluciones" 
                :key="index"
                :pokemon-name="evolucion.Evoluciona_a" 
                :pokemon-number="getPokemonNumberFromName(evolucion.Evoluciona_a)" 
                @show-details="showPokemonByName"
              />
            </template>
            <!-- Compatibilidad con el formato anterior -->
            <template v-else>
              <EvolutionCard 
                :pokemon-name="evolutionData.Evoluciona_a" 
                :pokemon-number="getPokemonNumberFromName(evolutionData.Evoluciona_a)" 
                @show-details="showPokemonByName"
              />
            </template>
          </div>
        </div>
        <div v-if="(!evolutionData || (!evolutionData.Evoluciona_de && !evolutionData.Evoluciona_a))" class="evolution-item">
          <span class="evolution-value">No tiene evoluciones</span>
        </div>
      </div>
    </div>
    
    <!-- Sección de Movimientos -->
    <PokemonMoves :pokemon="pokemon" />
  </div>
  <div v-else class="no-pokemon-selected">
    <p>Selecciona un Pokémon para ver sus detalles</p>
  </div>
</template>

<script>
import AbilityDetails from './AbilityDetails.vue';
import PokemonMoves from './PokemonMoves.vue';
import EvolutionCard from './EvolutionCard.vue';

export default {
  name: 'PokemonDetails',
  components: {
    AbilityDetails,
    PokemonMoves,
    EvolutionCard
  },
  props: {
    pokemon: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selectedAbility: null,
      abilityDetails: null,
      pokemonAbilities: [],
      loading: false,
      error: null,
      evolutionData: null,
      evolutionLoading: false,
      evolutionError: null,
      evolutionNumbers: {}
    };
  },
  methods: {
    normalizeType(type) {
      return type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },
    getPokemonNumberFromName(name) {
      if (!name) {
        console.log(`No name provided for getPokemonNumberFromName`);
        return null;
      }
      
      // Return cached number if available
      if (this.evolutionNumbers[name] !== undefined) {
        return this.evolutionNumbers[name];
      }
      
      // Trigger async fetch but return null for now
      this.fetchPokemonNumber(name);
      return null;
    },
    
    async fetchPokemonNumber(name) {
      try {
        console.log('Fetching Pokemon number for:', name);
        // Direct API call to get Pokemon ID by name
        const response = await fetch(`/api/evolution/name/${name}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching Pokemon ID for ${name}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data && data.PokemonID) {
          console.log(`Found Pokemon ID for ${name}: ${data.PokemonID}`);
          // Extract the numeric ID from the Pokedex number if available, otherwise use PokemonID
          let pokemonNumber = data.PokemonID;
          if (data.Numero_pokedex) {
            // Extract numeric part from Pokedex number (e.g., "#001" -> 1)
            const numericPart = data.Numero_pokedex.substring(1);
            pokemonNumber = parseInt(numericPart, 10);
          }
          
          // Update the cache
          this.evolutionNumbers[name] = pokemonNumber;
          
          // Force a component update
          this.$forceUpdate();
          
          return pokemonNumber;
        } else {
          console.warn(`No data found for Pokemon: ${name}`);
          this.evolutionNumbers[name] = null;
          return null;
        }
      } catch (error) {
        console.error(`Error in fetchPokemonNumber for ${name}:`, error);
        this.evolutionNumbers[name] = null;
        return null;
      }
    },
    async fetchEvolutionData(pokemonId) {
      if (!pokemonId) {
        console.warn('No se proporcionó ID de Pokémon para consultar evolución');
        return;
      }
      
      this.evolutionLoading = true;
      this.evolutionError = null;
      this.evolutionNumbers = {}; // Reset the cache when loading new evolution data
      
      try {
        console.log(`Consultando evolución para el Pokémon ID: ${pokemonId}`);
        const response = await fetch(`/api/evolution/${pokemonId}`);
        
        if (!response.ok) {
          throw new Error(`Error al obtener datos de evolución: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Datos de evolución recibidos:', data);
        
        if (data) {
          // Store the current Pokemon's number in the cache immediately
          if (data.Nombre_Pokemon && data.PokemonID) {
            const currentPokemonNumber = parseInt(this.pokemon.Numero_pokedex.substring(1), 10);
            this.evolutionNumbers[data.Nombre_Pokemon] = currentPokemonNumber;
          }
          
          // Transform the data to match the component's expected format
          this.evolutionData = {
            PokemonID: data.PokemonID,
            Nombre_Pokemon: data.Nombre_Pokemon,
            Evoluciona_de: data.Evoluciona_de,
            Evoluciona_a: data.Evoluciona_a,
            Metodo_Evolucion: data.Metodo_Evolucion,
            Nivel_Evolucion: data.Nivel_Evolucion,
            Requisitos: data.requisitos,
            evoluciones: data.evoluciones || []
          };
          
          // Pre-fetch Pokemon numbers for all evolutions to improve user experience
          if (data.Evoluciona_de) {
            this.fetchPokemonNumber(data.Evoluciona_de);
          }
          
          if (data.evoluciones && data.evoluciones.length > 0) {
            // Pre-fetch all evolution Pokemon numbers
            data.evoluciones.forEach(evo => {
              if (evo.Evoluciona_a) {
                this.fetchPokemonNumber(evo.Evoluciona_a);
              }
            });
          } else if (data.Evoluciona_a) {
            // Fallback for single evolution
            this.fetchPokemonNumber(data.Evoluciona_a);
          }
        } else {
          console.warn('No se recibieron datos de evolución del servidor');
          this.evolutionData = null;
        }
      } catch (error) {
        console.error('Error al obtener datos de evolución:', error);
        this.evolutionError = 'Error al cargar los datos de evolución';
        this.evolutionData = null;
      } finally {
        this.evolutionLoading = false;
      }
    },

    async loadPokemonAbilities() {
      if (!this.pokemon) return;
      
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/abilities/pokemon/${this.pokemon.ID}/abilities`);
        const abilities = await response.json();
        this.pokemonAbilities = abilities;
        console.log('Loaded abilities for Pokemon:', abilities);
      } catch (error) {
        console.error('Error fetching Pokemon abilities:', error);
        this.error = 'Error al cargar las habilidades del Pokémon';
      } finally {
        this.loading = false;
      }
    },
    async toggleAbility(ability) {
      // Find the ability in the loaded Pokemon abilities
      const abilityInfo = this.pokemonAbilities.find(a => a.Nombre === ability);
      
      // Toggle the selected ability
      if (this.selectedAbility === ability) {
        this.selectedAbility = null;
        this.abilityDetails = null;
        return;
      }
      
      this.selectedAbility = ability;
      
      if (abilityInfo) {
        console.log('Ability info found:', abilityInfo);
        this.abilityDetails = {
          EST: abilityInfo.EST,
          Coste: abilityInfo.Coste,
          Transformacion: abilityInfo.Transformacion,
          Descripcion: abilityInfo.Descripcion
        };
        console.log('Set ability details:', this.abilityDetails);
      } else {
        // Fallback to the old method if the ability is not found in the loaded abilities
        this.loading = true;
        this.error = null;
        try {
          const response = await fetch('/api/abilities');
          const abilities = await response.json();
          const fallbackAbilityInfo = abilities.find(a => a.Nombre === ability);
          if (fallbackAbilityInfo) {
            this.abilityDetails = {
              EST: fallbackAbilityInfo.EST,
              Coste: fallbackAbilityInfo.Coste,
              Transformacion: fallbackAbilityInfo.Transformacion,
              Descripcion: fallbackAbilityInfo.Descripcion
            };
            console.log('Set fallback ability details:', this.abilityDetails);
          } else {
            this.error = 'No se encontró información para esta habilidad';
            this.abilityDetails = null;
          }
        } catch (error) {
          console.error('Error fetching ability info:', error);
          this.error = 'Error al cargar la información de la habilidad';
          this.abilityDetails = null;
        } finally {
          this.loading = false;
        }
      }
    },
    showPokemonByName(pokemonName) {
      this.$emit('show-pokemon-by-name', pokemonName);
    },
  },
  watch: {
    pokemon: {
      immediate: true,
      handler(newPokemon) {
        if (newPokemon) {
          this.selectedAbility = null;
          this.abilityDetails = null;
          this.loadPokemonAbilities();
          
          // Obtener datos de evolución usando el ID del Pokémon
          if (newPokemon.ID) {
            this.fetchEvolutionData(newPokemon.ID);
          } else {
            console.warn('No se pudo obtener el ID del Pokémon para consultar evolución');
            this.evolutionData = null;
          }
        } else {
          this.pokemonAbilities = [];
          this.evolutionData = null;
        }
      }
    }
  },
  emits: ['show-ability', 'show-pokemon-by-name']
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.type-badge.type-normal { background-color: #A8A878; }
.type-badge.type-fuego { background-color: #F08030; }
.type-badge.type-agua { background-color: #6890F0; }
.type-badge.type-planta { background-color: #78C850; }
.type-badge.type-electrico { background-color: #F8D030; }
.type-badge.type-hielo { background-color: #98D8D8; }
.type-badge.type-lucha { background-color: #C03028; }
.type-badge.type-veneno { background-color: #A040A0; }
.type-badge.type-tierra { background-color: #E0C068; }
.type-badge.type-volador { background-color: #A890F0; }
.type-badge.type-psiquico { background-color: #F85888; }
.type-badge.type-bicho { background-color: #A8B820; }
.type-badge.type-roca { background-color: #B8A038; }
.type-badge.type-fantasma { background-color: #705898; }
.type-badge.type-dragon { background-color: #7038F8; }
.type-badge.type-siniestro { background-color: #705848; }
.type-badge.type-acero { background-color: #B8B8D0; }
.type-badge.type-hada { background-color: #EE99AC; }
</style>