<template>
  <div v-if="moveDetails" class="move-tooltip" :style="tooltipStyle">
    <div class="tooltip-header">
      <span class="move-name">{{ moveName }}</span>
      <span v-if="moveDetails.tipo" class="move-type-badge" :class="`type-${normalizeType(moveDetails.tipo)}`">{{
        moveDetails.tipo }}</span>
    </div>
    <div class="tooltip-content">
      <div v-if="moveDetails.coste" class="tooltip-row">
        <span class="label">Coste:</span>
        <span>{{ moveDetails.coste }}</span>
      </div>
      <div v-if="moveDetails.dano" class="tooltip-row">
        <span class="label">Daño:</span>
        <span>{{ moveDetails.dano }}</span>
      </div>
      <div v-if="moveDetails.tiempo_de_uso" class="tooltip-row">
        <span class="label">Tiempo:</span>
        <span>{{ moveDetails.tiempo_de_uso }}</span>
      </div>
      <div v-if="moveDetails.rango" class="tooltip-row">
        <span class="label">Rango:</span>
        <span>{{ moveDetails.rango }}</span>
      </div>
      <div v-if="moveDetails.etiquetas" class="tooltip-row">
        <span class="label">Etiquetas:</span>
        <span>{{ moveDetails.etiquetas }}</span>
      </div>
      <div class="tooltip-description">
        <BloqueTextoComplejo :dato="moveDetails.descripcion || 'Sin descripción disponible'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BloqueTextoComplejo from '../BloqueTextoComplejo.vue';

// Props
const { moveName, moveDetails, position } = defineProps({
  moveName: {
    type: String,
    required: true
  },
  moveDetails: {
    type: Object,
    required: true
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  }
});

const tooltipStyle = computed(() => {
  return {
    left: `${position.x}px`,
    top: `${position.y}px`
  };
});

function normalizeType(type) {
  if (!type) return '';
  return type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
</script>


<style scoped>
@import '../../css/typeColors.css';

.move-tooltip {
  position: fixed;
  z-index: 1000;
  background: rgba(40, 44, 52, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 12px;
  max-width: 300px;
  font-size: 0.9em;
  pointer-events: none;
  transform: translate(10px, -50%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  transition: opacity 0.2s ease-in-out;
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.move-name {
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.move-type-badge {
  padding: 3px 8px;
  border-radius: 4px;
  color: white;
  font-size: 0.8em;
  font-weight: bold;
  text-transform: capitalize;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
}

.label {
  color: #a8b1c2;
  font-weight: 500;
}

.tooltip-row span:not(.label) {
  color: #ffffff;
}

.tooltip-description {
  margin-top: 8px;
  padding-top: 8px;
  color: #e3e8f0;
  font-size: 0.9em;
  line-height: 1.4;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>