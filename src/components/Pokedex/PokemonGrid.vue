<template>
  <div class="pokemon-container">
    <div v-if="!pokedexCargada" class="loading-message">
      Cargando Pokémon...
    </div>
    <div v-else class="pokemon-grid">
      <PokemonCard v-for="pokemon in pokedex" :pokemon="pokemon" @show-details="showPokemonDetails"
        @image-error="handleImageError" />
      <div v-if="pokedex.length === 0" class="no-pokemon-message">
        No se encontraron Pokémon
      </div>
    </div>
  </div>
</template>

<script setup>
import PokemonCard from '@/components/Pokedex/PokemonCard.vue';

const props = defineProps([
  'pokedex',
  'pokedexCargada'
])

const emit = defineEmits(['show-details'])

const showPokemonDetails = (pokemon) => {
  emit('show-details', pokemon)
};

const handleImageError = () => {
  console.error('Error al cargar la imagen del Pokémon')
}

</script>


<style scoped>
.pokemon-container {
  padding: 20px;
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