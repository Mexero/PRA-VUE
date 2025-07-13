<template>
  <div class="admin-pokemon-list">
    <h2>Administración de Pokémon</h2>
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchTerm" 
        placeholder="Buscar Pokémon..."
        class="search-input"
      />
    </div>
    <div class="pokemon-table-container">
      <table class="pokemon-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número</th>
            <th>Especie</th>
            <th>Tipo Primario</th>
            <th>Tipo Secundario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pokemon in filteredPokemons" :key="pokemon.ID">
            <td>{{ pokemon.ID }}</td>
            <td>{{ pokemon.Numero_pokedex }}</td>
            <td>{{ pokemon.Especie }}</td>
            <td>
              <span class="type-badge" :class="`type-${normalizeType(pokemon.Tipo_primario)}`">{{ pokemon.Tipo_primario }}</span>
            </td>
            <td>
              <span v-if="pokemon.Tipo_secundario && pokemon.Tipo_secundario !== 'Ninguno'" 
                    class="type-badge" 
                    :class="`type-${normalizeType(pokemon.Tipo_secundario)}`">
                {{ pokemon.Tipo_secundario }}
              </span>
            </td>
            <td>
              <button @click="editPokemon(pokemon)" class="edit-button">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="loading" class="loading">Cargando...</div>
    <div v-if="error" class="error">{{ error }}</div>
    
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
export default {
  name: 'AdminPokemonList',
  data() {
    return {
      pokemons: [],
      searchTerm: '',
      loading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    filteredPokemons() {
      let filtered = this.pokemons;
      
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = this.pokemons.filter(pokemon => {
          return pokemon.Especie.toLowerCase().includes(term) ||
                 pokemon.Numero_pokedex.toLowerCase().includes(term) ||
                 pokemon.Tipo_primario.toLowerCase().includes(term) ||
                 (pokemon.Tipo_secundario && pokemon.Tipo_secundario.toLowerCase().includes(term));
        });
      }
      
      // Calculate pagination
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return filtered.slice(startIndex, endIndex);
    },
    
    totalPages() {
      const filtered = this.searchTerm ? this.pokemons.filter(pokemon => {
        const term = this.searchTerm.toLowerCase();
        return pokemon.Especie.toLowerCase().includes(term) ||
               pokemon.Numero_pokedex.toLowerCase().includes(term) ||
               pokemon.Tipo_primario.toLowerCase().includes(term) ||
               (pokemon.Tipo_secundario && pokemon.Tipo_secundario.toLowerCase().includes(term));
      }) : this.pokemons;
      
      return Math.ceil(filtered.length / this.itemsPerPage);
    }
  },
  methods: {
    normalizeType(type) {
      return type.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/é/g, "e");
    },
    async fetchPokemons() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch('/api/pokemon');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        if (Array.isArray(data)) {
          this.pokemons = data;
        } else {
          console.error('API response is not an array:', data);
          this.pokemons = [];
          this.error = 'Error: La respuesta de la API no es válida';
        }
        this.currentPage = 1; // Reset to first page when loading new data
      } catch (error) {
        console.error('Error fetching pokemons:', error);
        this.error = 'Error al cargar los Pokémon. Por favor, intente de nuevo.';
        this.pokemons = [];
      } finally {
        this.loading = false;
      }
    },
    editPokemon(pokemon) {
      window.location.href = `#/admin/edit/${pokemon.ID}`;
    }
  },
  mounted() {
    this.fetchPokemons();
  },
  watch: {
    searchTerm() {
      // Reiniciar a la primera página cuando cambia el término de búsqueda
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>
.admin-pokemon-list {
  padding: 12px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  margin-bottom: 12px;
  color: #e3350d;
  font-family: 'Arial', sans-serif;
  font-size: 1.4em;
}

.search-container {
  margin-bottom: 12px;
}

.search-input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.pokemon-table-container {
  overflow-x: auto;
}

.pokemon-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 0.9em;
}

th, td {
  padding: 6px 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
  font-size: 0.9em;
}

tr:hover {
  background-color: #f8f9fa;
}

.edit-button {
  padding: 4px 8px;
  background-color: #e3350d;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.85em;
}

.edit-button:hover {
  background-color: #c62d0b;
}

.loading {
  text-align: center;
  padding: 10px;
  color: #666;
}

.error {
  color: #dc3545;
  background-color: #f8d7da;
  padding: 8px;
  border-radius: 4px;
  margin-top: 12px;
  font-size: 0.9em;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 4px;
  border-radius: 3px;
  color: white;
  font-size: 0.8em;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  min-width: 60px;
  height: 20px;
}

/* Type-based colors */
.type-fuego { background-color: #ff7b00; }
.type-agua { background-color: #6890f0; }
.type-planta { background-color: #78c850; }
.type-electrico { background-color: #f8d030; }
.type-hielo { background-color: #98d8d8; }
.type-lucha { background-color: #c03028; }
.type-veneno { background-color: #a040a0; }
.type-tierra { background-color: #e0c068; }
.type-volador { background-color: #a890f0; }
.type-psiquico { background-color: #f85888; }
.type-bicho { background-color: #a8b820; }
.type-roca { background-color: #b8a038; }
.type-fantasma { background-color: #705898; }
.type-dragon { background-color: #7038f8; }
.type-acero { background-color: #b8b8d0; }
.type-hada { background-color: #ee99ac; }
.type-normal { background-color: #a8a878; }
.type-siniestro { background-color: #705746; }
.type-variable { background-color: #9370DB; }

/* Pagination styles */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  gap: 6px;
}

.pagination-button {
  padding: 4px 8px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
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
  font-size: 12px;
  color: #666;
  margin: 0 6px;
}
</style>