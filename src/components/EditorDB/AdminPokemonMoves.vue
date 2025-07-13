<template>
  <div class="moves-editor">
    <h3>Movimientos</h3>
    <div v-if="loadingMoves" class="loading">Cargando movimientos...</div>
    <div v-if="movesError" class="error">{{ movesError }}</div>
    
    <div v-if="!loadingMoves && !movesError" class="moves-container">
      <!-- Movimientos por nivel -->
      <div class="moves-section">
        <h4>Movimientos por nivel</h4>
        <div class="level-moves-list">
          <div v-for="(move, index) in sortedLevelMoves" :key="`level-${index}`" class="level-move-item">
            <div class="move-info">
              <div class="move-level">
                <label>Nivel:</label>
                <input type="number" v-model.number="move.level" min="1" max="100" class="level-input" @input="emitMovesChange" />
              </div>
              <div class="move-name">
                <span>{{ getMoveNameById(move.moveId) }}</span>
                <span class="move-type" :class="`type-${normalizeType(getMoveTypeById(move.moveId))}`">
                  {{ getMoveTypeById(move.moveId) }}
                </span>
              </div>
            </div>
            <button @click.stop.prevent="removeLevelMove(index)" class="remove-button">×</button>
          </div>
          
          <!-- Formulario para añadir movimientos por nivel -->
          <div class="add-move-container">
            <div class="search-container">
              <div class="level-input-container">
                <label>Nivel:</label>
                <input 
                  type="number" 
                  v-model.number="newMoveLevel" 
                  min="1" 
                  max="100" 
                  class="level-input"
                />
              </div>
              <input
                type="text"
                ref="levelMoveInput"
                v-model="levelMoveSearch"
                placeholder="Buscar movimiento..."
                class="move-search"
                @focus="showLevelDropdown = true"
              />
            </div>
            
            <!-- Desplegable de resultados -->
            <div 
              v-if="showLevelDropdown && filteredLevelMoves.length > 0" 
              class="dropdown-results" 
              ref="levelDropdown"
            >
              <div 
                v-for="move in filteredLevelMoves" 
                :key="move.ID" 
                class="dropdown-item"
                @click="addLevelMove(move.ID)"
              >
                <span>{{ move.Nombre }}</span>
                <span class="move-type" :class="`type-${normalizeType(move.Tipo)}`">
                  {{ move.Tipo }}
                </span>
              </div>
            </div>
            
            <div v-if="showLevelDropdown && levelMoveSearch.trim() && filteredLevelMoves.length === 0" class="no-results">
              No se encontraron movimientos
            </div>
          </div>
        </div>
      </div>
      
      <!-- Movimientos enseñables -->
      <div class="moves-section">
        <h4>Movimientos enseñables</h4>
        <div class="teachable-moves-list">
          <div class="teachable-moves-grid">
            <div v-for="(moveId, index) in sortedTeachableMoves" :key="`teachable-${index}`" class="teachable-move-item">
              <div class="move-name">
                <span>{{ getMoveNameById(moveId) }}</span>
                <span class="move-type" :class="`type-${normalizeType(getMoveTypeById(moveId))}`">
                  {{ getMoveTypeById(moveId) }}
                </span>
              </div>
              <button @click.stop.prevent="removeTeachableMove(index)" class="remove-button">×</button>
            </div>
          </div>
          
          <!-- Formulario para añadir movimientos enseñables -->
          <div class="add-move-container">
            <div class="search-container">
              <input
                type="text"
                ref="teachableMoveInput"
                v-model="teachableMoveSearch"
                placeholder="Buscar movimiento enseñable..."
                class="move-search"
                @focus="showTeachableDropdown = true"
              />
            </div>
            
            <!-- Desplegable de resultados -->
            <div 
              v-if="showTeachableDropdown && filteredTeachableMoves.length > 0" 
              class="dropdown-results" 
              ref="teachableDropdown"
            >
              <div 
                v-for="move in filteredTeachableMoves" 
                :key="move.ID" 
                class="dropdown-item"
                @click="addTeachableMove(move.ID)"
              >
                <span>{{ move.Nombre }}</span>
                <span class="move-type" :class="`type-${normalizeType(move.Tipo)}`">
                  {{ move.Tipo }}
                </span>
              </div>
            </div>
            
            <div v-if="showTeachableDropdown && teachableMoveSearch.trim() && filteredTeachableMoves.length === 0" class="no-results">
              No se encontraron movimientos
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPokemonMoves',
  props: {
    pokemonId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      allMoves: [],
      levelMoves: [], // Array of {moveId, level}
      teachableMoves: [], // Array of moveIds
      loadingMoves: false,
      movesError: null,
      teachableMoveSearch: '', // Variable para la búsqueda de movimientos enseñables
      showTeachableDropdown: false, // Variable para mostrar/ocultar el desplegable
      levelMoveSearch: '', // Variable para la búsqueda de movimientos por nivel
      showLevelDropdown: false, // Variable para mostrar/ocultar el desplegable
      newMoveLevel: 1 // Nivel por defecto para nuevos movimientos
    };
  },
  computed: {
    sortedTeachableMoves() {
      // Ordenar los movimientos enseñables alfabéticamente por nombre
      return [...this.teachableMoves].sort((a, b) => {
        const nameA = this.getMoveNameById(a).toLowerCase();
        const nameB = this.getMoveNameById(b).toLowerCase();
        return nameA.localeCompare(nameB);
      });
    },
    filteredTeachableMoves() {
      if (!this.teachableMoveSearch.trim()) return [];
      
      const searchTerm = this.teachableMoveSearch.toLowerCase().trim();
      return this.allMoves
        .filter(move => {
          // Filtrar por nombre del movimiento
          const matchesName = move.Nombre.toLowerCase().includes(searchTerm);
          // Verificar que no esté ya seleccionado
          const isNotSelected = !this.teachableMoves.includes(move.ID);
          return matchesName && isNotSelected;
        })
        .slice(0, 10); // Limitar a 10 resultados para mejor rendimiento
    },
    filteredLevelMoves() {
      if (!this.levelMoveSearch.trim()) return [];
      
      const searchTerm = this.levelMoveSearch.toLowerCase().trim();
      return this.allMoves
        .filter(move => {
          // Filtrar por nombre del movimiento
          const matchesName = move.Nombre.toLowerCase().includes(searchTerm);
          // Verificar que no esté ya seleccionado como movimiento por nivel
          const isNotSelected = !this.levelMoves.some(m => m.moveId === move.ID);
          return matchesName && isNotSelected;
        })
        .slice(0, 10); // Limitar a 10 resultados para mejor rendimiento
    },
    sortedLevelMoves() {
      // Ordenar los movimientos por nivel según su nivel de aprendizaje (de menor a mayor)
      return [...this.levelMoves].sort((a, b) => a.level - b.level);
    }
  },
  mounted() {
    this.fetchAllMoves();
    this.fetchPokemonMoves();
    // Añadir event listeners para cerrar los desplegables al hacer clic fuera
    document.addEventListener('click', this.handleTeachableClickOutside);
    document.addEventListener('click', this.handleLevelClickOutside);
  },
  beforeDestroy() {
    // Eliminar event listeners al destruir el componente
    document.removeEventListener('click', this.handleTeachableClickOutside);
    document.removeEventListener('click', this.handleLevelClickOutside);
  },
  methods: {
    // Los métodos handleScroll y updateDropdownPosition han sido eliminados
    async fetchAllMoves() {
      this.loadingMoves = true;
      this.movesError = null;
      
      try {
        const response = await fetch('/api/moves');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        this.allMoves = data;
      } catch (error) {
        console.error('Error fetching moves:', error);
        this.movesError = 'Error al cargar los movimientos. Por favor, intente de nuevo.';
      } finally {
        this.loadingMoves = false;
      }
    },
    async fetchPokemonMoves() {
      if (!this.pokemonId) return;
      
      this.loadingMoves = true;
      this.movesError = null;
      
      try {
        const response = await fetch(`/api/pokemon/${this.pokemonId}/moves`);
        
        if (response.status === 404) {
          // No moves found for this Pokemon is not an error
          this.levelMoves = [];
          this.teachableMoves = [];
          this.emitMovesChange(); // Emit empty arrays
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Separate level and teachable moves
        this.levelMoves = data
          .filter(move => move.MetodoAprendizaje === 'Nivel')
          .map(move => ({
            moveId: move.ID,
            level: move.NivelAprendizaje
          }));
          
        this.teachableMoves = data
          .filter(move => move.MetodoAprendizaje === 'Aprendible')
          .map(move => move.ID);
          
        // Emit changes after loading moves
        this.emitMovesChange();
          
      } catch (error) {
        console.error('Error fetching Pokemon moves:', error);
        this.movesError = 'Error al cargar los movimientos del Pokémon. Por favor, intente de nuevo.';
      } finally {
        this.loadingMoves = false;
      }
    },
    getMoveNameById(moveId) {
      const move = this.allMoves.find(m => m.ID === moveId);
      return move ? move.Nombre : 'Movimiento desconocido';
    },
    getMoveTypeById(moveId) {
      const move = this.allMoves.find(m => m.ID === moveId);
      return move ? move.Tipo : 'Normal';
    },
    normalizeType(type) {
      if (!type) return 'normal';
      return type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },
    truncateDescription(description) {
      if (!description) return '';
      return description.length > 100 ? description.substring(0, 100) + '...' : description;
    },
    // El método filteredMoves ha sido eliminado
    addLevelMove(moveId) {
      // Verificar que el movimiento no esté ya en la lista
      if (!this.levelMoves.some(move => move.moveId === moveId)) {
        this.levelMoves.push({
          moveId: moveId,
          level: this.newMoveLevel
        });
        // Limpiar la búsqueda y cerrar el desplegable
        this.levelMoveSearch = '';
        this.showLevelDropdown = false;
        // Emitir cambios
        this.emitMovesChange();
      }
    },
    removeLevelMove(index) {
      // Obtener el movimiento de la lista ordenada
      const moveToRemove = this.sortedLevelMoves[index];
      // Encontrar el índice en la lista original
      const originalIndex = this.levelMoves.findIndex(move => 
        move.moveId === moveToRemove.moveId && move.level === moveToRemove.level
      );
      // Eliminar de la lista original
      if (originalIndex !== -1) {
        this.levelMoves.splice(originalIndex, 1);
        // Emit changes
        this.emitMovesChange();
      }
    },
    addTeachableMove(moveId) {
      // Verificar que el movimiento no esté ya en la lista
      if (!this.teachableMoves.includes(moveId)) {
        this.teachableMoves.push(moveId);
        // Limpiar la búsqueda y cerrar el desplegable
        this.teachableMoveSearch = '';
        this.showTeachableDropdown = false;
        // Emitir cambios
        this.emitMovesChange();
      }
    },
    removeTeachableMove(index) {
      // Obtener el moveId de la lista ordenada
      const moveIdToRemove = this.sortedTeachableMoves[index];
      // Encontrar el índice en la lista original
      const originalIndex = this.teachableMoves.indexOf(moveIdToRemove);
      // Eliminar de la lista original
      if (originalIndex !== -1) {
        this.teachableMoves.splice(originalIndex, 1);
        // Emit changes
        this.emitMovesChange();
      }
    },
    // El método isTeachableMoveSelected ha sido eliminado
    handleTeachableClickOutside(event) {
      const dropdown = this.$refs.teachableDropdown;
      const input = this.$refs.teachableMoveInput;
      
      if (dropdown && input && !dropdown.contains(event.target) && !input.contains(event.target)) {
        this.showTeachableDropdown = false;
      }
    },
    handleLevelClickOutside(event) {
      const dropdown = this.$refs.levelDropdown;
      const input = this.$refs.levelMoveInput;
      
      if (dropdown && input && !dropdown.contains(event.target) && !input.contains(event.target)) {
        this.showLevelDropdown = false;
      }
    },
    // Method to get moves data for saving
    getMovesData() {
      return {
        levelMoves: this.levelMoves,
        teachableMoves: this.teachableMoves
      };
    },
    // Method to emit moves change to parent component
    emitMovesChange() {
      this.$emit('moves-changed', this.getMovesData());
    },
    // Method to get current moves for external access
    getCurrentMoves() {
      return this.getMovesData();
    }
  }
};
</script>

<style scoped>
.moves-editor {
  margin-top: 10px;
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 8px;
}

h3 {
  color: #e3350d;
  font-size: 1rem;
  margin-bottom: 8px;
  border-bottom: 1px solid #e3350d;
  padding-bottom: 4px;
}

h4 {
  color: #333;
  font-size: 0.9rem;
  margin-top: 0;
  margin-bottom: 8px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
}

.moves-section {
  margin-bottom: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 8px;
  background-color: #fff;
}

.level-moves-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 6px;
}

.teachable-moves-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.level-move-item,
.teachable-move-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  font-size: 0.85rem;
}

.move-info {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-grow: 1;
}

.move-level {
  display: flex;
  align-items: center;
  gap: 3px;
  min-width: 80px;
  font-size: 0.8rem;
}

.level-input {
  width: 40px;
  padding: 2px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 0.8rem;
}

.move-name {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-grow: 1;
  font-size: 0.85rem;
}

.move-type {
  padding: 1px 4px;
  border-radius: 3px;
  color: white;
  font-weight: bold;
  font-size: 0.65rem;
  text-transform: capitalize;
  min-width: 50px;
  text-align: center;
}

.remove-button {
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 2px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 10px;
  transition: background-color 0.2s;
}

.remove-button:hover {
  background-color: #e74c3c;
}

/* Estilos para el formulario de búsqueda y el desplegable */
.add-move-container {
  margin-top: 10px;
  position: relative;
}

.search-container {
  display: flex;
  margin-bottom: 5px;
}

.level-input-container {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-right: 8px;
}

.move-search {
  flex-grow: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85rem;
}

.dropdown-results {
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.85rem;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.no-results {
  padding: 8px;
  text-align: center;
  color: #666;
  font-size: 0.85rem;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
}

.loading, .error {
  text-align: center;
  margin: 10px 0;
  padding: 8px;
  border-radius: 4px;
  font-size: 0.85rem;
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

.teachable-moves-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 6px;
}

/* Estilos para los tipos de Pokémon */
.type-normal { background-color: #A8A878; }
.type-fuego { background-color: #F08030; }
.type-agua { background-color: #6890F0; }
.type-electrico { background-color: #F8D030; }
.type-planta { background-color: #78C850; }
.type-hielo { background-color: #98D8D8; }
.type-lucha { background-color: #C03028; }
.type-veneno { background-color: #A040A0; }
.type-tierra { background-color: #E0C068; }
.type-volador { background-color: #A890F0; }
.type-psiquico { background-color: #F85888; }
.type-bicho { background-color: #A8B820; }
.type-roca { background-color: #B8A038; }
.type-fantasma { background-color: #705898; }
.type-dragon { background-color: #7038F8; }
.type-siniestro { background-color: #705848; }
.type-acero { background-color: #B8B8D0; }
.type-hada { background-color: #EE99AC; }
</style>