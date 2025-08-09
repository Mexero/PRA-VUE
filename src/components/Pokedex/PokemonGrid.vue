<template>
  <div class="pokemon-container">
    <div v-if="!pokedexCargada" class="message loading">
      Cargando Pokémon...
    </div>
    <div v-else>
      <div v-if="pokedex.length === 0" class="message empty">
        No se encontraron Pokémon
      </div>
      <div v-else class="pokemon-grid">
        <PokemonCard v-for="pokemon in pokedex" :key="pokemon.id" :pokemon="pokemon" @show-details="showPokemonDetails"
          @image-error="handleImageError" />
      </div>
    </div>
  </div>
</template>

<script setup>
import PokemonCard from '@/components/Pokedex/PokemonCard.vue';

const props = defineProps(['pokedex', 'pokedexCargada']);
const emit = defineEmits(['show-details']);

const showPokemonDetails = (pokemon) => {
  emit('show-details', pokemon);
};

const handleImageError = () => {
  console.error('Error al cargar la imagen del Pokémon');
};
</script>

<style scoped>
.pokemon-container {
  padding: 20px;
}

/* Mensajes genéricos */
.message {
  text-align: center;
  padding: 18px;
  font-size: 1.1em;
  border-radius: 12px;
  margin: 20px auto;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.message.loading {
  background: linear-gradient(90deg, #fff3cd, #fff9e6);
  color: #856404;
}

.message.empty {
  background: linear-gradient(90deg, #f8d7da, #fcebea);
  color: #721c24;
}

/* Grid de Pokémon */
.pokemon-grid {
  display: grid;
  gap: 20px;
  padding: 15px;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
}
</style>
