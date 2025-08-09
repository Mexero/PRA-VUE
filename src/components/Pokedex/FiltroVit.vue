<template>
  <div class="container">
    <label>Vitalidad: <input type="number" :value="modelValue"
        @input="$emit('update:modelValue', $event.target.valueAsNumber)" min="4" max="15" step="1" />
    </label>
    <input class="range" type="range" :value="modelValue"
      @input="$emit('update:modelValue', $event.target.valueAsNumber)" min="4" max="15" step="1" />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [Number, null],
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

label {
  font-weight: 600;
  font-size: 0.95em;
  display: flex;
  align-items: center;
  gap: 8px;
}

label input[type="number"] {
  flex: 1;
  padding: 10px 14px;
  border: 1.8px solid #ccc;
  border-radius: 8px;
  font-size: 0.95em;
  background-color: var(--color-fondoTarjeta);
  transition: all 0.25s ease;
  outline: none;
}

label input[type="number"]:hover {
  border-color: #999;
}

label input[type="number"]:focus {
  border-color: #444;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
}

.range {
  width: 100%;
  accent-color: #007bff;
  cursor: pointer;
}
</style>