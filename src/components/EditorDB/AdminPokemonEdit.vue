<template>
  <div class="admin-pokemon-edit">
    <h2>Editar Pokémon</h2>
    <div v-if="loading" class="loading">Cargando datos del Pokémon...</div>
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-if="pokemon && !loading" class="edit-form-container">
      <form @submit.prevent="updatePokemon" class="pokemon-form">
        <!-- Columna 1: Información Básica -->
        <div class="form-column compact-column">
          <h3 class="compact-heading">Información Básica</h3>
          <div class="basic-info-table">
            <table>
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><label for="especie">Especie:</label></td>
                  <td><input type="text" id="especie" v-model="pokemon.Especie" required class="form-control compact-control"></td>
                </tr>
                <tr>
                  <td><label for="tipo_primario">Tipo 1:</label></td>
                  <td>
                    <select id="tipo_primario" v-model="pokemon.Tipo_primario" required class="form-control compact-control">
                      <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label for="tipo_secundario">Tipo 2:</label></td>
                  <td>
                    <select id="tipo_secundario" v-model="pokemon.Tipo_secundario" class="form-control compact-control">
                      <option value="">Ninguno</option>
                      <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label for="tamano">Tamaño:</label></td>
                  <td>
                    <select id="tamano" v-model="pokemon.Tamano" required class="form-control compact-control">
                      <option v-for="size in sizes" :key="size" :value="size">{{ size }}</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label for="vitalidad">Vitalidad:</label></td>
                  <td><input type="number" id="vitalidad" v-model.number="pokemon.Vitalidad" required class="form-control compact-control"></td>
                </tr>
                <tr>
                  <td><label for="ac1">AC 1:</label></td>
                  <td><input type="text" id="ac1" v-model="pokemon.AC1" required class="form-control compact-control"></td>
                </tr>
                <tr>
                  <td><label for="ac2">AC 2:</label></td>
                  <td><input type="text" id="ac2" v-model="pokemon.AC2" class="form-control compact-control"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Columna 2: Estadísticas -->
        <div class="form-column compact-column">
          <h3 class="compact-heading">Estadísticas</h3>
          <div class="stats-table">
            <table>
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>Valor</th>
                  <th>Bonus</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><label for="fue">FUE:</label></td>
                  <td><input type="number" id="fue" v-model.number="pokemon.FUE" required class="form-control compact-control"></td>
                  <td>
                    <select id="s_fue" v-model.number="pokemon.S_FUE" class="form-control compact-control">
                      <option :value="0">N</option>
                      <option :value="2">☆</option>
                      <option :value="4">★</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label for="agi">AGI:</label></td>
                  <td><input type="number" id="agi" v-model.number="pokemon.AGI" required class="form-control compact-control"></td>
                  <td>
                    <select id="s_agi" v-model.number="pokemon.S_AGI" class="form-control compact-control">
                      <option :value="0">N</option>
                      <option :value="2">☆</option>
                      <option :value="4">★</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label for="res">RES:</label></td>
                  <td><input type="number" id="res" v-model.number="pokemon.RES" required class="form-control compact-control"></td>
                  <td>
                    <select id="s_res" v-model.number="pokemon.S_RES" class="form-control compact-control">
                      <option :value="0">N</option>
                      <option :value="2">☆</option>
                      <option :value="4">★</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label for="esp">ESP:</label></td>
                  <td><input type="number" id="esp" v-model.number="pokemon.ESP" required class="form-control compact-control"></td>
                  <td>
                    <select id="s_esp" v-model.number="pokemon.S_ESP" class="form-control compact-control">
                      <option :value="0">N</option>
                      <option :value="2">☆</option>
                      <option :value="4">★</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label for="men">MEN:</label></td>
                  <td><input type="number" id="men" v-model.number="pokemon.MEN" required class="form-control compact-control"></td>
                  <td>-</td>
                </tr>
                <tr>
                  <td><label for="pre">PRE:</label></td>
                  <td><input type="number" id="pre" v-model.number="pokemon.PRE" required class="form-control compact-control"></td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Columna 3: Velocidades -->
        <div class="form-column compact-column">
          <h3 class="compact-heading">Velocidades</h3>
          <div class="speeds-table">
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><label for="v_caminado">Caminado:</label></td>
                  <td><input type="number" id="v_caminado" v-model.number="pokemon.V_Caminado" class="form-control compact-control"></td>
                </tr>
                <tr>
                  <td><label for="v_trepado">Trepado:</label></td>
                  <td><input type="number" id="v_trepado" v-model.number="pokemon.V_Trepado" class="form-control compact-control"></td>
                </tr>
                <tr>
                  <td><label for="v_excavado">Excavado:</label></td>
                  <td><input type="number" id="v_excavado" v-model.number="pokemon.V_Excavado" class="form-control compact-control"></td>
                </tr>
                <tr>
                  <td><label for="v_nado">Nado:</label></td>
                  <td><input type="number" id="v_nado" v-model.number="pokemon.V_Nado" class="form-control compact-control"></td>
                </tr>
                <tr>
                  <td><label for="v_vuelo">Vuelo:</label></td>
                  <td><input type="number" id="v_vuelo" v-model.number="pokemon.V_Vuelo" class="form-control compact-control"></td>
                </tr>
                <tr>
                  <td><label for="v_levitado">Levitado:</label></td>
                  <td><input type="number" id="v_levitado" v-model.number="pokemon.V_Levitado" class="form-control compact-control"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Columna 4: Habilidades -->
        <!-- Habilidades -->
        <div class="form-column">
          <AdminPokemonAbilities 
            v-if="pokemon && !loading" 
            :pokemonId="pokemonId"
            :initialRegularAbilities="selectedRegularAbilities"
            :initialHiddenAbilities="hiddenAbilities"
            @abilities-changed="handleAbilitiesChanged"
            ref="abilitiesEditor"
          />
        </div>
        
        <!-- Movimientos -->
        <div class="form-column full-width">
          <AdminPokemonMoves 
            v-if="pokemon && !loading" 
            :pokemonId="pokemonId" 
            ref="movesEditor"
            @moves-changed="onMovesChanged"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="save-button" :disabled="saving">{{ saving ? 'Guardando...' : 'Guardar Cambios' }}</button>
          <button type="button" @click="goBack" class="cancel-button">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AdminPokemonMoves from './AdminPokemonMoves.vue';
import AdminPokemonAbilities from './AdminPokemonAbilities.vue';

export default {
  name: 'AdminPokemonEdit',
  components: {
    AdminPokemonMoves,
    AdminPokemonAbilities
  },
  data() {
    return {
      pokemon: null,
      loading: false,
      saving: false,
      error: null,
      pokemonId: null,
      sizes: [], // Array to store available sizes from database
      types: [], // Array to store available types from database
      
      // Arrays for API compatibility (managed by AdminPokemonAbilities component)
      selectedRegularAbilities: [], 
      hiddenAbilities: [],
      
      // Arrays for API compatibility (managed by AdminPokemonMoves component)
      levelMoves: [],
      teachableMoves: []
    };
  },
  methods: {
    async fetchPokemon() {
      this.loading = true;
      this.error = null;
      
      try {
        // Extract ID from URL
        const urlParts = window.location.hash.split('/');
        this.pokemonId = urlParts[urlParts.length - 1];
        
        if (!this.pokemonId || isNaN(this.pokemonId)) {
          throw new Error('ID de Pokémon inválido');
        }
        
        const response = await fetch(`/api/pokemon/${this.pokemonId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        this.pokemon = data;
      } catch (error) {
        console.error('Error fetching pokemon:', error);
        this.error = 'Error al cargar los datos del Pokémon. Por favor, intente de nuevo.';
      } finally {
        this.loading = false;
      }
    },
    async updatePokemon() {
      this.saving = true;
      this.error = null;
      
      try {
        // Basic validation
        if (!this.pokemon.Especie || !this.pokemon.Tipo_primario) {
          throw new Error('Por favor complete todos los campos requeridos');
        }
        
        // Convert numeric fields
        const numericFields = ['Vitalidad', 'FUE', 'AGI', 'RES', 'ESP', 'MEN', 'PRE',
          'V_Caminado', 'V_Trepado', 'V_Excavado', 'V_Nado', 'V_Vuelo', 'V_Levitado'];
        
        numericFields.forEach(field => {
          if (this.pokemon[field]) {
            this.pokemon[field] = Number(this.pokemon[field]);
          }
        });

        // Convert special stats (S_) to numbers
        const specialStats = ['S_FUE', 'S_AGI', 'S_RES', 'S_ESP'];
        specialStats.forEach(stat => {
          this.pokemon[stat] = Number(this.pokemon[stat] || 0);
        });
        
        // Handle empty secondary type
        if (!this.pokemon.Tipo_secundario) {
          this.pokemon.Tipo_secundario = null;
        }
        
        // Step 1: Update the Pokemon's basic information
        const response = await fetch(`/api/pokemon/${this.pokemonId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.pokemon)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }
        
        // Step 2: Update the Pokemon's abilities
        // Prepare the abilities data
        const abilitiesData = {
          regularAbilities: this.selectedRegularAbilities,
          hiddenAbilities: this.hiddenAbilities
        };
        
        // Send the abilities update request
        const abilitiesResponse = await fetch(`/api/pokemon/${this.pokemonId}/abilities`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(abilitiesData)
        });
        
        if (!abilitiesResponse.ok) {
          // If updating abilities fails, we still consider the main update successful
          // but we show a warning
          console.warn('Error updating Pokemon abilities:', await abilitiesResponse.text());
          alert('Pokémon actualizado correctamente, pero hubo un problema al actualizar las habilidades.');
        } else {
          // Step 3: Update the Pokemon's moves
          const movesData = {
            levelMoves: this.levelMoves,
            teachableMoves: this.teachableMoves
          };
          
          // Send the moves update request
          const movesResponse = await fetch(`/api/pokemon/${this.pokemonId}/moves`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(movesData)
          });
          
          if (!movesResponse.ok) {
            // If updating moves fails, we still consider the main update successful
            // but we show a warning
            console.warn('Error updating Pokemon moves:', await movesResponse.text());
            alert('Pokémon actualizado correctamente, pero hubo un problema al actualizar los movimientos.');
          } else {
            // Show success message and redirect
            alert('Pokémon actualizado correctamente');
          }
        }
        
        this.goBack();
      } catch (error) {
        console.error('Error updating pokemon:', error);
        this.error = `Error al actualizar el Pokémon: ${error.message}`;
      } finally {
        this.saving = false;
      }
    },
    goBack() {
      window.location.href = '#/admin';
    },
    
    // Fetch distinct sizes from the database
    async fetchSizes() {
      try {
        const response = await fetch('/api/pokemon/sizes/distinct');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        this.sizes = data;
      } catch (error) {
        console.error('Error fetching sizes:', error);
        // If we can't fetch sizes, we'll fall back to the default hardcoded values
        this.sizes = ['Pequeño', 'Mediano', 'Grande'];
      }
    },
    
    // Fetch distinct types from the database
    async fetchTypes() {
      try {
        const response = await fetch('/api/pokemon/types/distinct');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        this.types = data;
      } catch (error) {
        console.error('Error fetching types:', error);
        // If we can't fetch types, we'll fall back to the default hardcoded values
        this.types = [
          'Acero', 'Agua', 'Bicho', 'Dragón', 'Eléctrico', 'Fantasma', 'Fuego', 'Hada',
          'Hielo', 'Lucha', 'Normal', 'Planta', 'Psíquico', 'Roca', 'Siniestro', 'Tierra', 'Veneno', 'Volador'
        ];
      }
    },
    

    
    // Handle abilities changes from AdminPokemonAbilities component
    handleAbilitiesChanged(abilitiesData) {
      this.selectedRegularAbilities = abilitiesData.regularAbilities;
      this.hiddenAbilities = abilitiesData.hiddenAbilities;
    },
    onMovesChanged(movesData) {
      this.levelMoves = movesData.levelMoves;
      this.teachableMoves = movesData.teachableMoves;
    },
    

  },
  mounted() {
    this.fetchPokemon();
    this.fetchSizes(); // Fetch available sizes when component mounts
    this.fetchTypes(); // Fetch available types when component mounts
  },
  
  beforeDestroy() {
    // Component cleanup if needed
  }
};
</script>

<style scoped>
.admin-pokemon-edit {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f5f5;
}

h2, h3 {
  text-align: center;
  color: #e3350d;
  font-family: 'Arial', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

h3 {
  margin-top: 10px;
  margin-bottom: 15px;
  border-bottom: 2px solid #e3350d;
  padding-bottom: 8px;
}

.compact-heading {
  margin-top: 5px;
  margin-bottom: 15px;
  font-size: 1.1rem;
  padding-bottom: 8px;
  color: #e3350d;
  border-bottom: 2px solid #e3350d;
  text-align: center;
  font-weight: 600;
}

.edit-form-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-top: 20px;
}

.pokemon-form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
}

.form-column {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.compact-column {
  min-width: 250px;
  gap: 8px;
  padding: 15px;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #eaeaea;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.compact-form-group {
  gap: 4px;
  margin-bottom: 5px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.compact-form-row {
  gap: 10px;
  margin-bottom: 5px;
}

.half-width {
  width: 48%;
}

.third-width {
  width: 31%;
}

label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.compact-column label {
  font-size: 0.85rem;
  margin-bottom: 0;
}

.form-control {
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.compact-control {
  padding: 6px 8px;
  font-size: 0.9rem;
  border-width: 1px;
}

.form-control:focus {
  border-color: #e3350d;
  outline: none;
  box-shadow: 0 0 0 2px rgba(227, 53, 13, 0.2);
}

select.form-control {
  height: 42px;
  background-color: white;
  cursor: pointer;
}

select.compact-control {
  height: 32px;
}

/* Stats Grid Styles */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.stat-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-inputs {
  display: flex;
  gap: 5px;
}

.stat-value {
  width: 60%;
}

.stat-bonus {
  width: 40%;
}

/* Speeds Grid Styles */
.speeds-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.speed-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.speeds-table {
  width: 100%;
}

.speeds-table table {
  width: 100%;
  border-collapse: collapse;
}

.speeds-table th {
  text-align: left;
  font-size: 0.8rem;
  color: #666;
  padding: 4px 8px;
  border-bottom: 1px solid #ddd;
}

.speeds-table td {
  padding: 4px 8px;
  vertical-align: middle;
}

.speeds-table label {
  margin: 0;
  white-space: nowrap;
}

.speeds-table input,
.stats-table input {
  width: 100%;
  text-align: center;
}

.stats-table select {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  width: 100%;
}

.save-button, .cancel-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.save-button {
  background-color: #e3350d;
  color: white;
}

.save-button:hover {
  background-color: #c62d0b;
  transform: translateY(-1px);
}

.save-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.cancel-button:hover {
  background-color: #5a6268;
  transform: translateY(-1px);
}

.loading, .error {
  text-align: center;
  margin: 20px 0;
  padding: 15px;
  border-radius: 8px;
}

.loading {
  background-color: #e9ecef;
  color: #2c3e50;
}

.error {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

/* Abilities Styles */
.abilities-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 15px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.abilities-section {
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.abilities-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.abilities-section h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ability-select-container {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.ability-select-container:hover {
  background: #f1f3f5;
}

.ability-select-container label {
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 5px;
}

.search-select {
  position: relative;
  margin-bottom: 3px;
  flex: 1;
  min-width: 150px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
  height: 36px;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus {
  border-color: #e3350d;
  outline: none;
  box-shadow: 0 0 0 3px rgba(227, 53, 13, 0.15);
}

.search-select {
  position: relative;
  width: 100%;
}

.dropdown-container {
  position: absolute;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  z-index: 10;
  margin-top: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  scrollbar-width: thin;
  scrollbar-color: #e3350d #f1f3f5;
  left: 0;
  right: 0;
}

.dropdown-container::-webkit-scrollbar {
  width: 8px;
}

.dropdown-container::-webkit-scrollbar-track {
  background: #f1f3f5;
  border-radius: 4px;
}

.dropdown-container::-webkit-scrollbar-thumb {
  background-color: #e3350d;
  border-radius: 4px;
  border: 2px solid #f1f3f5;
}

.dropdown-search-results {
  padding: 2px;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  border-bottom: 1px solid #f1f3f5;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  transform: translateX(4px);
}

.dropdown-item.selected {
  background: linear-gradient(145deg, #e3350d, #ff5252);
  color: white;
}

.dropdown-item[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f8f9fa;
}

.ability-name {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 0.95rem;
  color: #2c3e50;
}

.dropdown-item .ability-description {
  font-size: 0.85rem;
  color: #6c757d;
  line-height: 1.4;
  margin-top: 2px;
}

.dropdown-item.selected .ability-description {
  color: rgba(255, 255, 255, 0.9);
}

.selected-ability {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding: 8px 12px;
  background: linear-gradient(145deg, #e3350d15, #ff525215);
  border: 1px solid #e3350d30;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #2c3e50;
  transition: all 0.3s ease;
}

.selected-ability:hover {
  background: linear-gradient(145deg, #e3350d20, #ff525220);
}

.clear-button {
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  margin-left: 8px;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background-color: #ff1744;
  transform: scale(1.1);
}

.no-results {
  padding: 6px;
  text-align: center;
  font-size: 11px;
  color: #666;
  font-style: italic;
  font-size: 0.85rem;
}

.loading-abilities, .error-message {
  padding: 15px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.loading-abilities {
  background-color: #e9ecef;
  color: #2c3e50;
}

.error-message {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.full-width {
  width: 100%;
  flex-basis: 100%;
}

/* Unified Table Styles for all sections */
.basic-info-table,
.stats-table,
.speeds-table {
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow: hidden;
}

.basic-info-table table,
.stats-table table,
.speeds-table table {
  width: 100%;
  border-collapse: collapse;
}

.basic-info-table th,
.stats-table th,
.speeds-table th {
  text-align: left;
  font-size: 0.8rem;
  color: #666;
  padding: 6px 10px;
  border-bottom: 1px solid #ddd;
  background-color: #f5f5f5;
}

.basic-info-table td,
.stats-table td,
.speeds-table td {
  padding: 6px 10px;
  vertical-align: middle;
  border-bottom: 1px solid #f0f0f0;
}

.basic-info-table tr:last-child td,
.stats-table tr:last-child td,
.speeds-table tr:last-child td {
  border-bottom: none;
}

.basic-info-table label,
.stats-table label,
.speeds-table label {
  margin: 0;
  white-space: nowrap;
  font-weight: 600;
  color: #2c3e50;
}

.basic-info-table input,
.basic-info-table select {
  width: 100%;
}
</style>