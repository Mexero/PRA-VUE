<template>
  <div class="admin-pokemon-abilities">
    <h3 class="compact-heading">Habilidades</h3>
    
    <!-- Loading state -->
    <div v-if="loadingAbilities" class="loading-abilities">
      Cargando habilidades...
    </div>
    
    <!-- Error state -->
    <div v-if="abilitiesError" class="error-message">
      {{ abilitiesError }}
    </div>
    
    <!-- Abilities form -->
    <div v-if="!loadingAbilities && !abilitiesError" class="abilities-form">
      <!-- Regular Abilities -->
      <div class="ability-section">
        <h4>Habilidades Regulares</h4>
        
        <!-- Regular Ability 1 -->
        <div class="form-group">
          <label>Habilidad Regular 1:</label>
          <div class="search-select">
            <input
              type="text"
              v-model="abilitySearch.regular1"
              @focus="onInputFocus('regular1')"
              @input="onInputChange('regular1')"
              placeholder="Buscar habilidad..."
              class="search-input"
            />
            <div v-if="showDropdown.regular1" class="dropdown-wrapper">
              <div class="dropdown-container">
                <div class="dropdown-search-results">
                  <div
                    v-for="ability in filteredAbilities(abilitySearch.regular1)"
                    :key="ability.ID"
                    @click="selectAbility('regular1', ability.ID)"
                    class="dropdown-item"
                    :class="{ selected: isAbilitySelected(ability.ID, 'regular1') }"
                    :disabled="isAbilitySelected(ability.ID, 'regular1')"
                  >
                    <div class="ability-name">{{ ability.Nombre }}</div>
                    <div class="ability-description">{{ ability.Descripcion }}</div>
                  </div>
                  <div v-if="filteredAbilities(abilitySearch.regular1).length === 0" class="no-results">
                    No se encontraron habilidades
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="regularAbility1" class="selected-ability">
              <div class="ability-header">
                <span class="ability-name">{{ getAbilityName(regularAbility1) }}</span>
                <button @click="clearAbility('regular1')" class="clear-button">×</button>
              </div>
              <div class="ability-details">
                <div v-if="getAbilityDetails(regularAbility1)" class="ability-info">
                  <table class="ability-table">
                    <tr v-if="getAbilityDetails(regularAbility1).EST">
                      <td class="ability-label">EST:</td>
                      <td>{{ getAbilityDetails(regularAbility1).EST }}</td>
                    </tr>
                    <tr v-if="getAbilityDetails(regularAbility1).Coste">
                      <td class="ability-label">Coste:</td>
                      <td>{{ getAbilityDetails(regularAbility1).Coste }}</td>
                    </tr>
                    <tr v-if="getAbilityDetails(regularAbility1).Transformacion && getAbilityDetails(regularAbility1).Transformacion !== 'No'">
                      <td class="ability-label">Transformación:</td>
                      <td>{{ getAbilityDetails(regularAbility1).Transformacion }}</td>
                    </tr>
                  </table>
                  <div class="ability-description">
                    <p>{{ getAbilityDetails(regularAbility1).Descripcion || 'Descripción no disponible' }}</p>
                  </div>
                </div>
              </div>
            </div>
        </div>
        
        <!-- Regular Ability 2 -->
        <div class="form-group">
          <label>Habilidad Regular 2:</label>
          <div class="search-select">
            <input
              type="text"
              v-model="abilitySearch.regular2"
              @focus="showDropdown.regular2 = true"
              @input="showDropdown.regular2 = true"
              placeholder="Buscar habilidad..."
              class="search-input"
            />
            <div v-if="showDropdown.regular2" class="dropdown-wrapper">
              <div class="dropdown-container">
                <div class="dropdown-search-results">
                  <div
                    v-for="ability in filteredAbilities(abilitySearch.regular2)"
                    :key="ability.ID"
                    @click="selectAbility('regular2', ability.ID)"
                    class="dropdown-item"
                    :class="{ selected: isAbilitySelected(ability.ID, 'regular2') }"
                    :disabled="isAbilitySelected(ability.ID, 'regular2')"
                  >
                    <div class="ability-name">{{ ability.Nombre }}</div>
                    <div class="ability-description">{{ ability.Descripcion }}</div>
                  </div>
                  <div v-if="filteredAbilities(abilitySearch.regular2).length === 0" class="no-results">
                    No se encontraron habilidades
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="regularAbility2" class="selected-ability">
              <div class="ability-header">
                <span class="ability-name">{{ getAbilityName(regularAbility2) }}</span>
                <button @click="clearAbility('regular2')" class="clear-button">×</button>
              </div>
              <div class="ability-details">
                <div v-if="getAbilityDetails(regularAbility2)" class="ability-info">
                  <table class="ability-table">
                    <tr v-if="getAbilityDetails(regularAbility2).EST">
                      <td class="ability-label">EST:</td>
                      <td>{{ getAbilityDetails(regularAbility2).EST }}</td>
                    </tr>
                    <tr v-if="getAbilityDetails(regularAbility2).Coste">
                      <td class="ability-label">Coste:</td>
                      <td>{{ getAbilityDetails(regularAbility2).Coste }}</td>
                    </tr>
                    <tr v-if="getAbilityDetails(regularAbility2).Transformacion && getAbilityDetails(regularAbility2).Transformacion !== 'No'">
                      <td class="ability-label">Transformación:</td>
                      <td>{{ getAbilityDetails(regularAbility2).Transformacion }}</td>
                    </tr>
                  </table>
                  <div class="ability-description">
                    <p>{{ getAbilityDetails(regularAbility2).Descripcion || 'Descripción no disponible' }}</p>
                  </div>
                </div>
              </div>
            </div>
        </div>
        
        <!-- Regular Ability 3 -->
        <div class="form-group">
          <label>Habilidad Regular 3:</label>
          <div class="search-select">
            <input
              type="text"
              v-model="abilitySearch.regular3"
              @focus="showDropdown.regular3 = true"
              @input="showDropdown.regular3 = true"
              placeholder="Buscar habilidad..."
              class="search-input"
            />
            <div v-if="showDropdown.regular3" class="dropdown-wrapper">
              <div class="dropdown-container">
                <div class="dropdown-search-results">
                  <div
                    v-for="ability in filteredAbilities(abilitySearch.regular3)"
                    :key="ability.ID"
                    @click="selectAbility('regular3', ability.ID)"
                    class="dropdown-item"
                    :class="{ selected: isAbilitySelected(ability.ID, 'regular3') }"
                    :disabled="isAbilitySelected(ability.ID, 'regular3')"
                  >
                    <div class="ability-name">{{ ability.Nombre }}</div>
                    <div class="ability-description">{{ ability.Descripcion }}</div>
                  </div>
                  <div v-if="filteredAbilities(abilitySearch.regular3).length === 0" class="no-results">
                    No se encontraron habilidades
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="regularAbility3" class="selected-ability">
              <div class="ability-header">
                <span class="ability-name">{{ getAbilityName(regularAbility3) }}</span>
                <button @click="clearAbility('regular3')" class="clear-button">×</button>
              </div>
              <div class="ability-details">
                <div v-if="getAbilityDetails(regularAbility3)" class="ability-info">
                  <table class="ability-table">
                    <tr v-if="getAbilityDetails(regularAbility3).EST">
                      <td class="ability-label">EST:</td>
                      <td>{{ getAbilityDetails(regularAbility3).EST }}</td>
                    </tr>
                    <tr v-if="getAbilityDetails(regularAbility3).Coste">
                      <td class="ability-label">Coste:</td>
                      <td>{{ getAbilityDetails(regularAbility3).Coste }}</td>
                    </tr>
                    <tr v-if="getAbilityDetails(regularAbility3).Transformacion && getAbilityDetails(regularAbility3).Transformacion !== 'No'">
                      <td class="ability-label">Transformación:</td>
                      <td>{{ getAbilityDetails(regularAbility3).Transformacion }}</td>
                    </tr>
                  </table>
                  <div class="ability-description">
                    <p>{{ getAbilityDetails(regularAbility3).Descripcion || 'Descripción no disponible' }}</p>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      
      <!-- Hidden Abilities -->
      <div class="ability-section">
        <h4>Habilidades Ocultas</h4>
        
        <!-- Hidden Ability 1 -->
        <div class="form-group">
          <label>Habilidad Oculta 1:</label>
          <div class="search-select">
            <input
              type="text"
              v-model="abilitySearch.hidden1"
              @focus="showDropdown.hidden1 = true"
              @input="showDropdown.hidden1 = true"
              placeholder="Buscar habilidad..."
              class="search-input"
            />
            <div v-if="showDropdown.hidden1" class="dropdown-wrapper">
              <div class="dropdown-container">
                <div class="dropdown-search-results">
                  <div
                    v-for="ability in filteredAbilities(abilitySearch.hidden1)"
                    :key="ability.ID"
                    @click="selectAbility('hidden1', ability.ID)"
                    class="dropdown-item"
                    :class="{ selected: isAbilitySelected(ability.ID, 'hidden1') }"
                    :disabled="isAbilitySelected(ability.ID, 'hidden1')"
                  >
                    <div class="ability-name">{{ ability.Nombre }}</div>
                    <div class="ability-description">{{ ability.Descripcion }}</div>
                  </div>
                  <div v-if="filteredAbilities(abilitySearch.hidden1).length === 0" class="no-results">
                    No se encontraron habilidades
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="hiddenAbility1" class="selected-ability">
              <div class="ability-header">
                <span class="ability-name">{{ getAbilityName(hiddenAbility1) }}</span>
                <button @click="clearAbility('hidden1')" class="clear-button">×</button>
              </div>
              <div class="ability-details">
                <div v-if="getAbilityDetails(hiddenAbility1)" class="ability-info">
                  <table class="ability-table">
                    <tr v-if="getAbilityDetails(hiddenAbility1).EST">
                      <td class="ability-label">EST:</td>
                      <td>{{ getAbilityDetails(hiddenAbility1).EST }}</td>
                    </tr>
                    <tr v-if="getAbilityDetails(hiddenAbility1).Coste">
                      <td class="ability-label">Coste:</td>
                      <td>{{ getAbilityDetails(hiddenAbility1).Coste }}</td>
                    </tr>
                    <tr v-if="getAbilityDetails(hiddenAbility1).Transformacion && getAbilityDetails(hiddenAbility1).Transformacion !== 'No'">
                      <td class="ability-label">Transformación:</td>
                      <td>{{ getAbilityDetails(hiddenAbility1).Transformacion }}</td>
                    </tr>
                  </table>
                  <div class="ability-description">
                    <p>{{ getAbilityDetails(hiddenAbility1).Descripcion || 'Descripción no disponible' }}</p>
                  </div>
                </div>
              </div>
            </div>
        </div>
        
        <!-- Hidden Ability 2 -->
        <div class="form-group">
          <label>Habilidad Oculta 2:</label>
          <div class="search-select">
            <input
              type="text"
              v-model="abilitySearch.hidden2"
              @focus="showDropdown.hidden2 = true"
              @input="showDropdown.hidden2 = true"
              placeholder="Buscar habilidad..."
              class="search-input"
            />
            <div v-if="showDropdown.hidden2" class="dropdown-wrapper">
              <div class="dropdown-container">
                <div class="dropdown-search-results">
                  <div
                    v-for="ability in filteredAbilities(abilitySearch.hidden2)"
                    :key="ability.ID"
                    @click="selectAbility('hidden2', ability.ID)"
                    class="dropdown-item"
                    :class="{ selected: isAbilitySelected(ability.ID, 'hidden2') }"
                    :disabled="isAbilitySelected(ability.ID, 'hidden2')"
                  >
                    <div class="ability-name">{{ ability.Nombre }}</div>
                    <div class="ability-description">{{ ability.Descripcion }}</div>
                  </div>
                  <div v-if="filteredAbilities(abilitySearch.hidden2).length === 0" class="no-results">
                    No se encontraron habilidades
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="hiddenAbility2" class="selected-ability">
              <div class="ability-header">
                <span class="ability-name">{{ getAbilityName(hiddenAbility2) }}</span>
                <button @click="clearAbility('hidden2')" class="clear-button">×</button>
              </div>
              <div class="ability-details">
                <div v-if="getAbilityDetails(hiddenAbility2)" class="ability-info">
                  <table class="ability-table">
                    <tr v-if="getAbilityDetails(hiddenAbility2).EST">
                      <td class="ability-label">EST:</td>
                      <td>{{ getAbilityDetails(hiddenAbility2).EST }}</td>
                    </tr>
                    <tr v-if="getAbilityDetails(hiddenAbility2).Coste">
                      <td class="ability-label">Coste:</td>
                      <td>{{ getAbilityDetails(hiddenAbility2).Coste }}</td>
                    </tr>
                    <tr v-if="getAbilityDetails(hiddenAbility2).Transformacion && getAbilityDetails(hiddenAbility2).Transformacion !== 'No'">
                      <td class="ability-label">Transformación:</td>
                      <td>{{ getAbilityDetails(hiddenAbility2).Transformacion }}</td>
                    </tr>
                  </table>
                  <div class="ability-description">
                    <p>{{ getAbilityDetails(hiddenAbility2).Descripcion || 'Descripción no disponible' }}</p>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPokemonAbilities',
  props: {
    pokemonId: {
      type: [String, Number],
      required: true
    },
    // Props for initial values
    initialRegularAbilities: {
      type: Array,
      default: () => []
    },
    initialHiddenAbilities: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      allAbilities: [], // Array to store all available abilities
      
      // Individual ability selections
      regularAbility1: null,
      regularAbility2: null,
      regularAbility3: null,
      hiddenAbility1: null,
      hiddenAbility2: null,
      
      // Search inputs for each ability slot
      abilitySearch: {
        regular1: '',
        regular2: '',
        regular3: '',
        hidden1: '',
        hidden2: ''
      },
      
      // Control dropdown visibility
      showDropdown: {
        regular1: false,
        regular2: false,
        regular3: false,
        hidden1: false,
        hidden2: false
      },
      
      // Legacy arrays for API compatibility
      selectedRegularAbilities: [], 
      hiddenAbilities: [],
      
      loadingAbilities: false,
      abilitiesError: null
    };
  },
  watch: {
    // Watch for changes in pokemonId to fetch abilities
    pokemonId: {
      handler(newVal) {
        if (newVal) {
          this.fetchPokemonAbilities();
        }
      },
      immediate: false
    },
    // Watch for changes in props to update internal state
    initialRegularAbilities: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.regularAbility1 = newVal[0] || null;
          this.regularAbility2 = newVal[1] || null;
          this.regularAbility3 = newVal[2] || null;
          this.updateAbilityArrays();
        }
      },
      immediate: true
    },
    initialHiddenAbilities: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.hiddenAbility1 = newVal[0] || null;
          this.hiddenAbility2 = newVal[1] || null;
          this.updateAbilityArrays();
        }
      },
      immediate: true
    }
  },
  methods: {
    // Fetch all available abilities
    async fetchAllAbilities() {
      console.log('Fetching all abilities...');
      this.loadingAbilities = true;
      this.abilitiesError = null;
      
      try {
        const response = await fetch('/api/abilities');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        this.allAbilities = data;
        console.log('Abilities loaded successfully:', {
          count: data.length,
          firstFew: data.slice(0, 3)
        });
      } catch (error) {
        console.error('Error fetching abilities:', error);
        this.abilitiesError = 'Error al cargar las habilidades. Por favor, intente de nuevo.';
      } finally {
        this.loadingAbilities = false;
      }
    },
    
    // Fetch abilities for the specific Pokemon
    async fetchPokemonAbilities() {
      if (!this.pokemonId) return;
      
      this.loadingAbilities = true;
      this.abilitiesError = null;
      
      try {
        const response = await fetch(`/api/abilities/pokemon/${this.pokemonId}/abilities`);
        if (!response.ok) {
          if (response.status === 404) {
            // No abilities found for this Pokemon is not an error
            this.regularAbility1 = null;
            this.regularAbility2 = null;
            this.regularAbility3 = null;
            this.hiddenAbility1 = null;
            this.hiddenAbility2 = null;
            this.updateAbilityArrays(); // Update arrays before emitting
            this.emitAbilitiesChange(); // Emit empty arrays
            return;
          }
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Separate regular and hidden abilities
        const regularAbilities = data
          .filter(ability => !ability.Es_Oculta)
          .map(ability => ability.ID);
          
        const hiddenAbilitiesData = data
          .filter(ability => ability.Es_Oculta)
          .map(ability => ability.ID);
        
        // Assign to individual slots
        this.regularAbility1 = regularAbilities[0] || null;
        this.regularAbility2 = regularAbilities[1] || null;
        this.regularAbility3 = regularAbilities[2] || null;
        this.hiddenAbility1 = hiddenAbilitiesData[0] || null;
        this.hiddenAbility2 = hiddenAbilitiesData[1] || null;
        
        // Update arrays and emit changes
        this.updateAbilityArrays();
        this.emitAbilitiesChange();
          
      } catch (error) {
        console.error('Error fetching Pokemon abilities:', error);
        this.abilitiesError = 'Error al cargar las habilidades del Pokémon. Por favor, intente de nuevo.';
      } finally {
        this.loadingAbilities = false;
      }
    },
    
    // Filter abilities based on search input
    filteredAbilities(searchText) {
      console.log('Filtering abilities:', {
        searchText,
        allAbilitiesLength: this.allAbilities.length,
        allAbilities: this.allAbilities.slice(0, 3) // Show first 3 for debugging
      });
      
      if (!searchText || searchText.trim() === '') {
        return this.allAbilities.slice(0, 10); // Show first 10 by default
      }
      
      const searchLower = searchText.toLowerCase();
      const filtered = this.allAbilities.filter(ability => 
        ability.Nombre.toLowerCase().includes(searchLower) ||
        (ability.Descripcion && ability.Descripcion.toLowerCase().includes(searchLower))
      ).slice(0, 20); // Limit to 20 results for performance
      
      console.log('Filtered results:', filtered.length);
      return filtered;
    },
    
    // Select an ability for a specific slot
    selectAbility(slot, abilityId) {
      // Update the individual slot
      this[slot === 'regular1' ? 'regularAbility1' : 
           slot === 'regular2' ? 'regularAbility2' : 
           slot === 'regular3' ? 'regularAbility3' : 
           slot === 'hidden1' ? 'hiddenAbility1' : 'hiddenAbility2'] = abilityId;
      
      // Update the legacy arrays for API compatibility
      this.updateAbilityArrays();
      
      // Clear the search text and hide dropdown
      this.abilitySearch[slot] = '';
      this.showDropdown[slot] = false;
      
      // Emit change event to parent
      this.emitAbilitiesChange();
    },
    
    // Clear an ability from a specific slot
    clearAbility(slot) {
      // Clear the individual slot
      this[slot === 'regular1' ? 'regularAbility1' : 
           slot === 'regular2' ? 'regularAbility2' : 
           slot === 'regular3' ? 'regularAbility3' : 
           slot === 'hidden1' ? 'hiddenAbility1' : 'hiddenAbility2'] = null;
      
      // Update the legacy arrays for API compatibility
      this.updateAbilityArrays();
      
      // Clear the search text
      this.abilitySearch[slot] = '';
      
      // Emit change event to parent
      this.emitAbilitiesChange();
    },
    
    // Update the legacy arrays for API compatibility
    updateAbilityArrays() {
      // Update regular abilities array
      this.selectedRegularAbilities = [
        this.regularAbility1, 
        this.regularAbility2, 
        this.regularAbility3
      ].filter(id => id !== null && id !== undefined);
      
      // Update hidden abilities array
      this.hiddenAbilities = [
        this.hiddenAbility1, 
        this.hiddenAbility2
      ].filter(id => id !== null && id !== undefined);
    },
    
    // Emit abilities change to parent component
    emitAbilitiesChange() {
      this.$emit('abilities-changed', {
        regularAbilities: this.selectedRegularAbilities,
        hiddenAbilities: this.hiddenAbilities
      });
    },
    
    // Get ability name by ID
    getAbilityName(abilityId) {
      const ability = this.allAbilities.find(a => a.ID === abilityId);
      return ability ? ability.Nombre : 'Habilidad desconocida';
    },
    
    // Get ability details by ID
    getAbilityDetails(abilityId) {
      const ability = this.allAbilities.find(a => a.ID === abilityId);
      return ability || null;
    },
    
    // Check if an ability is already selected in another slot
    isAbilitySelected(abilityId, currentSlot) {
      // Check if the ability is selected in any other slot
      if (currentSlot !== 'regular1' && this.regularAbility1 === abilityId) return true;
      if (currentSlot !== 'regular2' && this.regularAbility2 === abilityId) return true;
      if (currentSlot !== 'regular3' && this.regularAbility3 === abilityId) return true;
      if (currentSlot !== 'hidden1' && this.hiddenAbility1 === abilityId) return true;
      if (currentSlot !== 'hidden2' && this.hiddenAbility2 === abilityId) return true;
      
      return false;
    },
    
    // Handle input focus event
    onInputFocus(slot) {
      console.log('Input focused:', slot);
      this.showDropdown[slot] = true;
      console.log('Dropdown state after focus:', this.showDropdown);
    },
    
    // Handle input change event
    onInputChange(slot) {
      console.log('Input changed:', slot, 'value:', this.abilitySearch[slot]);
      this.showDropdown[slot] = true;
      console.log('Dropdown state after input:', this.showDropdown);
    },

    // Handle clicks outside of dropdown elements
    handleClickOutside(event) {
      // Get all dropdown containers and their parent search-select elements
      const dropdownContainers = document.querySelectorAll('.dropdown-container');
      const searchSelects = document.querySelectorAll('.search-select');
      
      // Check if click is outside all dropdown containers and their parent search-select elements
      let clickedOutside = true;
      
      // Check if click is inside any dropdown container or search input
      for (let i = 0; i < searchSelects.length; i++) {
        if (searchSelects[i].contains(event.target)) {
          clickedOutside = false;
          break;
        }
      }
      
      // If clicked outside, close all dropdowns
      if (clickedOutside) {
        this.showDropdown.regular1 = false;
        this.showDropdown.regular2 = false;
        this.showDropdown.regular3 = false;
        this.showDropdown.hidden1 = false;
        this.showDropdown.hidden2 = false;
      }
    },
    
    // Public method to get current abilities (for parent component)
    getCurrentAbilities() {
      return {
        regularAbilities: this.selectedRegularAbilities,
        hiddenAbilities: this.hiddenAbilities
      };
    }
  },
  mounted() {
    this.fetchAllAbilities();
    
    // Fetch Pokemon abilities if pokemonId is provided
    if (this.pokemonId) {
      this.fetchPokemonAbilities();
    }
    
    // Add click event listener to handle clicks outside dropdowns
    document.addEventListener('click', this.handleClickOutside);
  },
  
  beforeDestroy() {
    // Remove event listener when component is destroyed
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style scoped>
/* CSS Compacto para AdminPokemonAbilities */
.admin-pokemon-abilities {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 24px;
  margin: 20px 0;
  border: 1px solid #e9ecef;
}

.compact-heading {
  margin: 0 0 15px;
  font-size: 1.1rem;
  color: #e3350d;
  border-bottom: 2px solid #e3350d;
  padding-bottom: 5px;
  text-align: center;
  font-weight: 600;
}

.loading-abilities, .error-message {
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  margin: 10px 0;
}

.loading-abilities {
  background: #f0f8ff;
  color: #0066cc;
}

.error-message {
  background: #ffe6e6;
  color: #cc0000;
}

.abilities-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ability-section {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 15px;
  border: 1px solid #e9ecef;
}

.ability-section h4 {
  margin: 0 0 12px;
  color: #e3350d;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
}

/* Layout en columnas para habilidades regulares y ocultas */
.ability-section .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.ability-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.ability-section h4 {
  grid-column: 1 / -1;
  margin-bottom: 0;
}

.ability-section .form-group {
  margin-bottom: 0;
}

/* Layout de columnas para pantallas medianas y grandes */
@media (min-width: 768px) {
  /* Habilidades regulares: 3 columnas */
  .ability-section:first-of-type {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  /* Habilidades ocultas: 2 columnas */
  .ability-section:nth-of-type(2) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* Layout de columnas para pantallas pequeñas */
@media (max-width: 767px) {
  .ability-section {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

.form-group {
  margin-bottom: 12px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.85rem;
  margin-bottom: 5px;
}

.search-select {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #e3350d;
  box-shadow: 0 0 0 3px rgba(227, 53, 13, 0.15);
  transform: translateY(-1px);
}

.dropdown-wrapper {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  margin-top: 2px;
}

.dropdown-container {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  max-height: 220px;
  overflow-y: auto;
  backdrop-filter: blur(10px);
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item.selected {
  background: #e9ecef;
  cursor: not-allowed;
  opacity: 0.6;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.ability-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.ability-description {
  font-size: 0.8rem;
  color: #666;
  margin-top: 2px;
  line-height: 1.3;
}

.no-results {
  padding: 12px;
  text-align: center;
  color: #666;
  font-style: italic;
  font-size: 0.85rem;
}

.selected-ability {
  margin-top: 10px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}

.ability-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.ability-header .ability-name {
  font-weight: 600;
  color: #e3350d;
  font-size: 0.9rem;
}

.clear-button {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  width: 22px;
  height: 22px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.clear-button:hover {
  background: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.ability-details {
  font-size: 0.85rem;
}

.ability-table {
  width: 100%;
  margin-bottom: 8px;
}

.ability-table td {
  padding: 2px 8px 2px 0;
  vertical-align: top;
}

.ability-label {
  font-weight: 600;
  color: #495057;
  min-width: 80px;
}

.ability-info .ability-description {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e9ecef;
}

.ability-info .ability-description p {
  margin: 0;
  line-height: 1.4;
  color: #495057;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-pokemon-abilities {
    padding: 15px;
    margin: 10px 0;
  }
  
  .ability-section {
    padding: 12px;
  }
  
  .compact-heading {
    font-size: 1rem;
  }
  
  .ability-section h4 {
    font-size: 0.9rem;
  }
}
</style>
