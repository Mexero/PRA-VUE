<template>
  <div class="search-container">
    <input type="text" placeholder="Buscar Pokémon por nombre..." v-model="busqueda"
      @input="emitirNombreDebounced(busqueda)" class="search-input" />
  </div>
</template>

<script setup>
import { debounce } from 'lodash';
import { ref } from 'vue';

const props = defineProps(['searchTerm']);
const emit = defineEmits(['manejarFiltros'])

const busqueda = ref(props.searchTerm ?? '')

const emitirNombreDebounced = debounce((valor) => {
  const limpio = valor.trim();
  emit('manejarFiltros', 'busqueda', limpio);
}, 100);

</script>


<style scoped>
.search-container {
  margin-bottom: 15px;
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
  border-color: #6890f0;
  box-shadow: 0 0 5px rgba(104, 144, 240, 0.3);
}
</style>