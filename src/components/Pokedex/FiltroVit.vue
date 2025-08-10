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
  color: var(--color-texto);
}

label input[type="number"] {
  padding: 10px 14px;
  font-size: 0.95em;
  transition: all 0.25s ease;
  outline: none;
  border: none;
  border-bottom: 1px solid transparent;
  background-color: var(--color-fondo);
  color: var(--color-texto);
  -moz-appearance: textfield;
}

/* Quitar flechas en Chrome*/
label input[type="number"]::-webkit-inner-spin-button,
label input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

label input[type="number"]:hover {
  border-bottom: 1px solid #444;
}

label input[type="number"]:focus {
  border-bottom: 1px solid #999;
}

.range {
  width: 100%;
  cursor: pointer;
}
</style>