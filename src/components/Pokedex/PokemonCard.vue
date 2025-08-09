<template>
  <div class="pokemon-card" @click="$emit('show-details', pokemon.especie)">
    <div class="pokemon-number">#{{ pokemon.numPokedex.substring(1) }}</div>
    <h4>{{ pokemon.especie }}</h4>
    <img loading="lazy" :src="src" :alt="pokemon.especie" class="pokemon-image" @error="$emit('image-error')" />
    <div class="pokemon-info">
      <div class="types">
        <span class="type-badge" :class="`type-${normalizeType(pokemon.tipos[0])}`">
          {{ pokemon.tipos[0] }}
        </span>
        <span v-if="pokemon.tipos[1] !== ''" class="type-badge" :class="`type-${normalizeType(pokemon.tipos[1])}`">
          {{ pokemon.tipos[1] }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

import { updateSprite } from '@/utils/updateSprite'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['show-details', 'image-error'])

const especie = ref(null)
const src = ref(null)

function normalizeType(type) {
  return type.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

onMounted(async () => {
  src.value = await updateSprite(props.pokemon.especie, props.pokemon.esAlternativo, props.pokemon.numPokedex)
  especie.value = props.pokemon.especie
})
watch(() => props.pokemon, async () => {
  if (especie.value !== props.pokemon.especie) {
    src.value = await updateSprite(props.pokemon.especie, props.pokemon.esAlternativo, props.pokemon.numPokedex)
    especie.value = props.pokemon.especie
  }
}
  , { deep: true })
</script>

<style scoped>
@import '../../css/typeColors.css';

.pokemon-card {
  background-color: var(--color-fondoTarjeta);
  border-radius: 14px;
  padding: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  cursor: pointer;
  text-align: center;
}

.pokemon-card:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.pokemon-number {
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 0.8em;
  color: rgba(0, 0, 0, 0.4);
  font-weight: bold;
}

.pokemon-card h4 {
  margin: 8px 0 6px;
  font-size: 1em;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Imagen del Pokémon */
.pokemon-image {
  width: 90px;
  height: 90px;
  display: block;
  margin: 6px auto;
  image-rendering: pixelated;
  transition: transform 0.3s ease;
}

.pokemon-card:hover .pokemon-image {
  transform: scale(1.08);
}

.pokemon-info {
  margin-top: 6px;
}

/* Tipos de Pokémon */
.types {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: nowrap;
}

.type-badge {
  padding: 3px 8px;
  border-radius: 6px;
  color: white;
  font-size: 0.75em;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  min-width: 48px;
  text-align: center;
  transition: transform 0.2s ease;
}

.type-badge:hover {
  transform: scale(1.05);
}

.types .type-badge:first-child:last-child {
  margin: 0 auto;
}
</style>
