<template>
  <div v-if="moveDetails" class="move-tooltip" :style="tooltipStyle">
    <div class="tooltip-header">
      <span class="move-name">{{ moveName }}</span>
      <span v-if="moveDetails.Tipo" class="move-type-badge" :class="`type-${normalizeType(moveDetails.Tipo)}`">{{ moveDetails.Tipo }}</span>
    </div>
    <div class="tooltip-content">
      <div v-if="moveDetails.Coste" class="tooltip-row">
          <span class="label">Coste:</span>
          <span>{{ moveDetails.Coste }}</span>
      </div>
      <div v-if="moveDetails.Dano" class="tooltip-row">
        <span class="label">Daño:</span>
        <span>{{ moveDetails.Dano }}</span>
      </div>
      <div v-if="moveDetails.Tiempo_de_uso" class="tooltip-row">
        <span class="label">Tiempo:</span>
        <span>{{ moveDetails.Tiempo_de_uso }}</span>
      </div>
      <div v-if="moveDetails.Rango" class="tooltip-row">
        <span class="label">Rango:</span>
        <span>{{ moveDetails.Rango }}</span>
      </div>
      <div v-if="moveDetails.Etiquetas" class="tooltip-row">
        <span class="label">Etiquetas:</span>
        <span>{{ moveDetails.Etiquetas }}</span>
      </div>
      <div class="tooltip-description">
        {{ moveDetails.Descripcion || 'Sin descripción disponible' }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MoveTooltip',
  props: {
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
  },
  computed: {
    tooltipStyle() {
      return {
        left: `${this.position.x}px`,
        top: `${this.position.y}px`
      };
    }
  },
  methods: {
    normalizeType(type) {
      if (!type) return '';
      return type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
  }
};
</script>

<style scoped>
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