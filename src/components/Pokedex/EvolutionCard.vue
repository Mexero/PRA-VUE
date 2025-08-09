<template>
  <div class="evolution-card" @click="handleClick">
    <img v-if="numero" :src="src" :alt="nombre" class="pokemon-image" />
    <div v-else class="pokemon-image-placeholder">
      <span>?</span>
    </div>
    <div class="pokemon-info">
      <h4 class="pokemon-name">{{ nombre }}</h4>
    </div>
    <div v-if="nivel !== null">Nivel {{ nivel }}<span v-if="requisitos">, {{ requisitos }}</span> <span v-if="otros">({{
      otros }})</span></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import { updateSprite } from '@/utils/updateSprite'

const src = ref(null)

const props = defineProps([
  'nombre',
  'numero',
  'nivel',
  'requisitos',
  'otros',
  'esAlternativo'
])

const emit = defineEmits(['show-details']);

function handleClick() {
  emit('show-details', props.nombre)
}

watch(() => props, async () => {
  src.value = await updateSprite(props.nombre, props.esAlternativo, props.numero)
}
  , { deep: true, immediate: true })
</script>


<style scoped>
.evolution-card {
  background-color: var(--color-fondoTarjeta);
  color: black;
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
  background-color: var(--color-fondoTexto);
  border-radius: 50%;
  margin: 0 auto;
}

.pokemon-image-placeholder span {
  font-size: 2em;
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