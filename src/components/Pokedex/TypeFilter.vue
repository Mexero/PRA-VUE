<template>
  <div class="type-filters">
    <button
      v-for="type in types"
      :key="type"
      class="type-filter-button"
      :class="[`type-${normalizeType(type)}`, { active: selectedTypes.includes(type) }]"
      @click="toggleType(type)"
      :disabled="isDisabled(type)"
    >
      {{ type }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'TypeFilter',
  props: {
    types: {
      type: Array,
      required: true
    },
    selectedTypes: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    normalizeType(type) {
      return type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },
    toggleType(type) {
      this.$emit('toggle-type', type);
    },
    isDisabled(type) {
      return this.selectedTypes.length >= 2 && !this.selectedTypes.includes(type);
    }
  }
};
</script>

<style scoped>
.type-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  padding: 0 10px;
  max-width: 100%;
}

.type-filter-button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  opacity: 0.7;
  font-size: 0.9em;
  width: calc(16.66% - 5px); /* 6 buttons per row (100% / 6) minus gap */
  min-width: fit-content;
  margin-bottom: 5px;
}

/* Adjust width for the middle row (7 buttons) */
.type-filter-button:nth-child(n+7):nth-child(-n+13) {
  width: calc(14.28% - 5px); /* 7 buttons per row (100% / 7) minus gap */
}

.type-filter-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.type-filter-button.active {
  opacity: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.type-filter-button:disabled {
  cursor: not-allowed;
  opacity: 0.3;
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
</style>