<template>
  <div class="filter">
    <button v-for="vel in velsData" :key="vel" class="filter-button"
      :class="{ active: velocidades.includes(vel.toLowerCase()) }" @click="toggleVel(vel.toLowerCase())">
      {{ vel }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const velsData = ['Caminado', 'Trepado', 'Excavado', 'Nado', 'Vuelo', 'Levitado']

const props = defineProps(['vels'])

const velocidades = ref(props.vels ?? [])

const emit = defineEmits(['cambiarVels'])

watch(() => [props.vels
],
  () => {
    velocidades.value = props.vels
  },
  { deep: true, immediate: true }
)

function toggleVel(vel) {
  if (velocidades.value.includes(vel)) {
    velocidades.value = velocidades.value.filter(t => t !== vel)
  }
  else {
    velocidades.value.push(vel)
  }

  emit('cambiarVels', velocidades.value)
}

</script>

<style scoped>
.filter {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  padding: 0 10px;
  max-width: 100%;
}

.filter-button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  font-size: 0.9em;
  width: calc(16.66% - 5px);
  min-width: fit-content;
  margin-bottom: 5px;
}

.filter-button.active {
  background-color: rgb(41, 98, 156);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>