<template>
  <div class="evolution-card" @click="handleClick">
    <img 
      v-if="pokemonNumber"
      :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonNumber}.png`"
      :alt="pokemonName"
      class="pokemon-image"
    />
    <div v-else class="pokemon-image-placeholder">
      <span>?</span>
    </div>
    <div class="pokemon-info">
      <h4 class="pokemon-name">{{ pokemonName }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EvolutionCard',
  props: {
    pokemonName: {
      type: String,
      required: true
    },
    pokemonNumber: {
      type: Number,
      default: null
    }
  },
  methods: {
    handleClick() {
      console.log('Clic en tarjeta de evolución:', this.pokemonName);
      this.$emit('show-details', this.pokemonName);
    }
  },
  emits: ['show-details']
};
</script>

<style scoped>
.evolution-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  cursor: pointer;
}

.evolution-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.pokemon-image {
  width: 80px;
  height: 80px;
  display: block;
  margin: 0 auto;
  image-rendering: pixelated;
}

.pokemon-image-placeholder {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 50%;
  margin: 0 auto;
}

.pokemon-image-placeholder span {
  font-size: 2em;
  color: #999;
}

.pokemon-info {
  text-align: center;
  margin-top: 8px;
  width: 100%;
}

.pokemon-name {
  margin: 5px 0;
  font-size: 0.9em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>