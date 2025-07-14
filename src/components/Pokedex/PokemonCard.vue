<template>
  <div class="pokemon-card" @click="$emit('show-details', pokemon.especie)">
    <div class="pokemon-number">#{{ pokemon.numPokedex.substring(1) }}</div>
    <h4>{{ pokemon.especie }}</h4>
    <img loading="lazy"
      :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseInt(pokemon.numPokedex.substring(1))}.png`"
      :alt="pokemon.especie" class="pokemon-image" @error="$emit('image-error')" />
    <div class="pokemon-info">
      <div class="types">
        <span class="type-badge" :class="`type-${normalizeType(pokemon.tipos[0])}`">{{ pokemon.tipos[0] }}</span>
        <span v-if="pokemon.tipos.length > 1" class="type-badge" :class="`type-${normalizeType(pokemon.tipos[1])}`">{{
          pokemon.tipos[1] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['show-details', 'image-error']);

const normalizeType = (type) => {
  return type.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
};
</script>

<style scoped>
.pokemon-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.pokemon-number {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.8em;
  color: rgba(0, 0, 0, 0.5);
  font-weight: bold;
}

.pokemon-info {
  margin-top: 5px;
}

.types {
  display: flex;
  gap: 3px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
}

.type-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
  font-size: 0.75em;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  min-width: 50px;
  text-align: center;
  height: 18px;
  line-height: 14px;
}

.types:has(span:nth-child(2)) .type-badge {
  width: 40%;
  min-width: 40px;
}

.abilities {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 10px;
}

.regular-abilities {
  display: flex;
  gap: 8px;
  justify-content: center;
  width: 100%;
}

.ability-text {
  background-color: #f0f0f0;
  color: #333;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85em;
  border: 1px solid #ddd;
  flex: 1;
  text-align: center;
  max-width: 45%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ability-text.hidden {
  background-color: #e9ecef;
  border: 1px dashed #adb5bd;
  font-style: italic;
  width: 100%;
  max-width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ability-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pokemon-image {
  width: 80px;
  height: 80px;
  display: block;
  margin: 5px auto;
  image-rendering: pixelated;
}

/* Type-based colors */
.type-fuego {
  background-color: #ff7b00;
}

.type-agua {
  background-color: #6890f0;
}

.type-planta {
  background-color: #78c850 !important;
}

.type-electrico {
  background-color: #f8d030;
}

.type-hielo {
  background-color: #98d8d8;
}

.type-lucha {
  background-color: #c03028;
}

.type-veneno {
  background-color: #a040a0;
}

.type-tierra {
  background-color: #e0c068;
}

.type-volador {
  background-color: #a890f0;
}

.type-psiquico {
  background-color: #f85888;
}

.type-bicho {
  background-color: #a8b820;
}

.type-roca {
  background-color: #b8a038;
}

.type-fantasma {
  background-color: #705898;
}

.type-dragon {
  background-color: #7038f8;
}

.type-acero {
  background-color: #b8b8d0;
}

.type-hada {
  background-color: #ee99ac;
}

.type-normal {
  background-color: #a8a878;
}

.type-siniestro {
  background-color: #705746;
}

.type-variable {
  background-color: #9370DB;
}

/* Estilos para el nombre del Pokémon */
.pokemon-card h4 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>