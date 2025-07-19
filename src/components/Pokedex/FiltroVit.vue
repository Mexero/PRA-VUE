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
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
}

input {
  width: 100%;
  max-width: 400px;
  padding: 12px 20px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 1em;
  transition: all 0.3s ease;
  outline: none;
}

input:focus {
  border-color: #6890f0;
  box-shadow: 0 0 5px rgba(104, 144, 240, 0.3);
}
</style>