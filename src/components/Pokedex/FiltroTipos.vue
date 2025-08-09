<template>
  <div class="type-filters">
    <button v-for="type in types" :key="type" class="type-filter-button"
      :class="[`type-${normalizeType(type)}`, { active: tipos.includes(type) }]" @click="toggleType(type)"
      :disabled="isDisabled(type)">
      {{ type }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['selectedTypes'])

const types = ["Acero", "Agua", "Bicho", "Dragón", "Eléctrico", "Fantasma", "Fuego", "Hada", "Hielo", "Lucha", "Normal", "Planta", "Psíquico", "Roca", "Siniestro", "Tierra", "Veneno", "Volador"]


const tipos = ref(props.selectedTypes ?? [])

const emit = defineEmits(['cambiarTipos'])

watch(() => [props.selectedTypes
],
  () => {
    tipos.value = props.selectedTypes
  },
  { deep: true, immediate: true }
)

const normalizeType = (type) => {
  return type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function toggleType(type) {
  if (tipos.value.includes(type)) {
    tipos.value = tipos.value.filter(t => t !== type)
  }
  else if (tipos.value.length < 2) {
    tipos.value.push(type)
  }

  emit('cambiarTipos', tipos.value)
}

const isDisabled = (type) => {
  return tipos.value.length >= 2 && !tipos.value.includes(type);
};

</script>

<style scoped>
@import '../../css/typeColors.css';

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
  width: calc(16.66% - 5px);
  min-width: fit-content;
  margin-bottom: 5px;
}

.type-filter-button:nth-child(n+7):nth-child(-n+13) {
  width: calc(14.28% - 5px);
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
</style>