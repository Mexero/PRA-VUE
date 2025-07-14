<template>
  <div class="pokemon-container">
    <div class="filters-container">
      <SearchFilter @manejar-filtros="manejarFiltros" :searchTerm="searchTerm" />
      <TypeFilter :types="tipos" :selected-types="selectedTypes" @manejar-filtros="manejarFiltros" />
    </div>
    <div v-if="!pokedexCargada" class="loading-message">
      Cargando Pokémon...
    </div>
    <div v-else class="pokemon-grid">
      <div v-if="filteredPokedex.length === 0" class="no-pokemon-message">
        No se encontraron Pokémon con ese nombre
      </div>
      <PokemonCard v-for="pokemon in filteredPokedex" :pokemon="pokemon" @show-details="showPokemonDetails"
        @image-error="handleImageError" />
      <div v-if="pokedex.length === 0" class="no-pokemon-message">
        No se encontraron Pokémon
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";

import SearchFilter from '@/components/Pokedex/SearchFilter.vue';
import TypeFilter from '@/components/Pokedex/TypeFilter.vue';
import PokemonCard from '@/components/Pokedex/PokemonCard.vue';

const route = useRoute();
const router = useRouter();

const props = defineProps([
  'pokedex',
  'pokedexCargada',
  'selectedPokemon'
])

const emit = defineEmits(['show-details'])

//Datos
const tipos = ["Acero", "Agua", "Bicho", "Dragón", "Eléctrico", "Fantasma", "Fuego", "Hada", "Hielo", "Lucha", "Normal", "Planta", "Psíquico", "Roca", "Siniestro", "Tierra", "Veneno", "Volador"]

// Filtros
const searchTerm = ref(route.query.busqueda ?? null)
const selectedTypes = ref(route.query.tipos ?? [])

//Modifica filtros
function manejarFiltros(clave, valor) {
  switch (clave) {
    case 'tipos':
      selectedTypes.value = valor
      break
    case 'busqueda':
      searchTerm.value = valor
      break
  }
}

// Limpia filtros
function limpiarFiltros() {
  searchTerm.value = null
  selectedTypes.value = []
}

//Cambia la ruta
watch(
  [
    () => props.selectedPokemon,
    searchTerm,
    selectedTypes,
  ],
  () => {
    router.replace({ query: construirQuery() });
  },
  { deep: true }
);

//Aplica filtros desde la ruta
watch(
  () => route.query,
  (query) => {
    aplicarQuery(query);
  },
  { immediate: true }
);

function construirQuery() {
  return {
    busqueda: searchTerm.value !== '' ? searchTerm.value : undefined,
    tipos: selectedTypes.value.length ? selectedTypes.value.join(',') : undefined,
    seleccionado: props.selectedPokemon ?? undefined,
  };
}

function aplicarQuery(query) {
  searchTerm.value = query.busqueda ?? null
  selectedTypes.value = query.tipos ? query.tipos.split(',').slice(0, 2) : []
  props.selectedPokemon = query.seleccionado ?? null
}

function filtroTipo(poke) {
  let filtrado = true
  for (const tipo of selectedTypes.value) {
    if (!poke.tipos.find(t => t === tipo)) filtrado = false
  }
  return filtrado
}

// ========================= APLICAR FILTROS ===========================
const filteredPokedex = computed(() => {
  return props.pokedex.filter((poke) => {
    const especie = poke.especie.toLowerCase();

    return (
      filtroTipo(poke) &&
      (!searchTerm.value || searchTerm.value === '' || especie.includes(searchTerm.value.toLowerCase()))
    );
  });
});


const showPokemonDetails = (pokemon) => {
  emit('show-details', pokemon)
};

const handleImageError = () => {
  console.error('Error loading Pokémon image')
}

</script>


<style scoped>
.pokemon-container {
  padding: 20px;
}

.filters-container {
  margin-bottom: 20px;
}

.error-message,
.loading-message,
.no-pokemon-message {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: #666;
  background: #f8f9fa;
  border-radius: 10px;
  margin: 20px;
}

.error-message {
  color: #dc3545;
  background: #fff5f5;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 15px;
}

@media (max-width: 1200px) {
  .pokemon-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .pokemon-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .pokemon-grid {
    grid-template-columns: 1fr;
  }
}

/* Estilos de paginación */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  gap: 8px;
}

.pagination-button {
  padding: 6px 12px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e3350d;
  color: white;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #666;
  margin: 0 8px;
}
</style>