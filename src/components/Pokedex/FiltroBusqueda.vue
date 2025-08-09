<template>
  <div class="search-container">
    <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Buscar Pokémon por nombre..." class="search-input" />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, null],
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>


<style scoped>
.search-container {
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 20px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 1em;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: var(--color-principal2);
  box-shadow: 0 0 5px rgba(104, 144, 240, 0.3);
}
</style>