<template>
  <div class="pokemon-container">
    <div class="filters-container">
      <SearchFilter v-model="searchTerm" />
      <TypeFilter 
        :types="availableTypes"
        :selected-types="selectedTypes"
        @toggle-type="toggleTypeFilter"
      />
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-else-if="loading" class="loading-message">
      Cargando Pokémon...
    </div>
    <div v-else class="pokemon-grid">
      <div v-if="filteredPokemons.length === 0" class="no-pokemon-message">
        No se encontraron Pokémon con ese nombre
      </div>
      <PokemonCard
        v-for="pokemon in filteredPokemons"
        :key="pokemon.numero_pokedex"
        :pokemon="pokemon"
        @show-details="showPokemonDetails"
        @show-ability="showAbilityInfo"
        @image-error="handleImageError"
      />
      <div v-if="pokemons.length === 0" class="no-pokemon-message">
        No se encontraron Pokémon
      </div>
    </div>
    
    <!-- Controles de paginación -->
    <div class="pagination-controls" v-if="totalPages > 1">
      <button 
        @click="currentPage = 1" 
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        &laquo;
      </button>
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        &lsaquo;
      </button>
      <span class="pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="pagination-button"
      >
        &rsaquo;
      </button>
      <button 
        @click="currentPage = totalPages" 
        :disabled="currentPage === totalPages"
        class="pagination-button"
      >
        &raquo;
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SearchFilter from './SearchFilter.vue';
import TypeFilter from './TypeFilter.vue';
import PokemonCard from './PokemonCard.vue';

export default {
  name: 'PokemonGrid',
  components: {
    SearchFilter,
    TypeFilter,
    PokemonCard
  },
  data() {
    return {
      pokemons: [],
      loading: true,
      error: null,
      showModal: false,
      selectedAbility: '',
      abilityInfo: null,
      searchTerm: '',
      selectedTypes: [],
      currentPage: 1,
      itemsPerPage: 12
    };
  },
  created() {
    this.fetchPokemons();
  },
  watch: {
    searchTerm() {
      // Reiniciar a la primera página cuando cambia el término de búsqueda
      this.currentPage = 1;
    },
    selectedTypes: {
      handler() {
        // Reiniciar a la primera página cuando cambian los tipos seleccionados
        this.currentPage = 1;
      },
      deep: true
    }
  },
  computed: {
    filteredPokemons() {
      if (!Array.isArray(this.pokemons)) {
        return [];
      }
      
      // Filtrar por nombre y tipos
      const filtered = this.pokemons.filter(pokemon => {
        const matchesName = !this.searchTerm || 
          pokemon.Especie.toLowerCase().includes(this.searchTerm.toLowerCase().trim());

        if (this.selectedTypes.length === 0) {
          return matchesName;
        }

        const pokemonTypes = [
          pokemon.Tipo_primario,
          pokemon.Tipo_secundario
        ].filter(type => type && type !== 'Ninguno');

        const matchesTypes = this.selectedTypes.every(type => pokemonTypes.includes(type));

        return matchesName && matchesTypes;
      });
      
      // Aplicar paginación
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return filtered.slice(startIndex, endIndex);
    },
    totalPages() {
      if (!Array.isArray(this.pokemons)) {
        return 0;
      }
      
      // Calcular el total de páginas basado en los Pokémon filtrados
      const filtered = this.pokemons.filter(pokemon => {
        const matchesName = !this.searchTerm || 
          pokemon.Especie.toLowerCase().includes(this.searchTerm.toLowerCase().trim());

        if (this.selectedTypes.length === 0) {
          return matchesName;
        }

        const pokemonTypes = [
          pokemon.Tipo_primario,
          pokemon.Tipo_secundario
        ].filter(type => type && type !== 'Ninguno');

        const matchesTypes = this.selectedTypes.every(type => pokemonTypes.includes(type));

        return matchesName && matchesTypes;
      });
      
      return Math.ceil(filtered.length / this.itemsPerPage);
    },
    availableTypes() {
      const types = new Set();
      if (Array.isArray(this.pokemons)) {
        this.pokemons.forEach(pokemon => {
          types.add(pokemon.Tipo_primario);
          if (pokemon.Tipo_secundario && pokemon.Tipo_secundario !== 'Ninguno') {
            types.add(pokemon.Tipo_secundario);
          }
        });
      }
      return Array.from(types).sort();
    }
  },
  methods: {
    async fetchPokemons() {
      try {
        const response = await axios.get('/api/pokemon');
        if (Array.isArray(response.data)) {
          this.pokemons = response.data;
        } else {
          console.error('API response is not an array:', response.data);
          this.pokemons = [];
          this.error = 'Error: La respuesta de la API no es válida';
        }
        this.loading = false;
      } catch (error) {
        this.pokemons = [];
        this.error = 'Error al cargar los Pokémon';
        this.loading = false;
        console.error('Error fetching pokemon:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
      }
    },
    async showAbilityInfo(abilityName) {
      this.selectedAbility = abilityName;
      this.showModal = true;
      this.abilityInfo = null;
      this.error = null;
      
      try {
        const response = await axios.get('/api/abilities');
        if (Array.isArray(response.data)) {
          const ability = response.data.find(a => a.Nombre === abilityName);
          this.abilityInfo = ability;
          if (!ability) {
            this.error = 'No se encontró información para esta habilidad';
          }
        } else {
          console.error('API response is not an array:', response.data);
          this.error = 'Error: La respuesta de la API no es válida';
        }
      } catch (error) {
        console.error('Error fetching ability info:', error);
        this.error = 'Error al cargar la información de la habilidad';
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
      }
    },
    closeModal() {
      this.showModal = false;
      this.selectedAbility = '';
      this.abilityInfo = null;
    },
    showPokemonDetails(pokemon) {
      this.$emit('show-details', pokemon);
    },
    toggleTypeFilter(type) {
      const normalizedType = type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const index = this.selectedTypes.findIndex(t => 
        t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === normalizedType
      );
      
      if (index !== -1) {
        this.selectedTypes = this.selectedTypes.filter((_, i) => i !== index);
      } else if (this.selectedTypes.length < 2) {
        if (!this.selectedTypes.includes(type)) {
          this.selectedTypes = [...this.selectedTypes, type];
        }
      }
    },
    handleImageError() {
      console.error('Error loading Pokemon image');
    }
  }
};
</script>

<style scoped>
.pokemon-container {
  padding: 20px;
}

.filters-container {
  margin-bottom: 20px;
}

.error-message,
.loading-message,
.no-pokemon-message {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: #666;
  background: #f8f9fa;
  border-radius: 10px;
  margin: 20px;
}

.error-message {
  color: #dc3545;
  background: #fff5f5;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 15px;
}

@media (max-width: 1200px) {
  .pokemon-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .pokemon-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .pokemon-grid {
    grid-template-columns: 1fr;
  }
}

/* Estilos de paginación */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  gap: 8px;
}

.pagination-button {
  padding: 6px 12px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e3350d;
  color: white;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #666;
  margin: 0 8px;
}
</style>