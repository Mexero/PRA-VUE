<script setup>
import PokemonGrid from '@/components/Pokedex/PokemonGrid.vue'
import PokemonDetails from '@/components/Pokedex/PokemonDetails.vue'

import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from "vue-router";

import worker from '../sqlWorker.js';

const selectedPokemon = ref(null)
const pokedexCargada = ref(null)
const pokedex = ref([])

const route = useRoute()
const router = useRouter()


function handlePokemonSelect(pokemon) {
  selectedPokemon.value = pokemon
}

function findPokemonByName(name) {
  // Buscar el Pokémon por nombre en la lista de Pokémon cargados
  const pokemonGridComponent = document.querySelector('.pokedex-section').__vue__
  if (pokemonGridComponent && pokemonGridComponent.pokemons) {
    const foundPokemon = pokemonGridComponent.pokemons.find(p => p.especie === name)
    if (foundPokemon) {
      handlePokemonSelect(foundPokemon)
    } else {
      console.warn(`No se encontró el Pokémon con nombre: ${name}`)
    }
  }
}

function handleAbilityInfo(abilityName) {
  // Pasar la información de la habilidad al componente PokemonGrid
  const pokemonGridComponent = document.querySelector('.pokedex-section').__vue__
  if (pokemonGridComponent) {
    pokemonGridComponent.showAbilityInfo(abilityName)
  }
}

// ========================= FILTROS ===========================
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
    selectedPokemon,
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
    seleccionado: selectedPokemon.value ?? undefined,
  };
}

function aplicarQuery(query) {
  searchTerm.value = query.busqueda ?? null
  selectedTypes.value = query.tipos ? query.tipos.split(',').slice(0, 2) : []
  selectedPokemon.value = query.seleccionado ?? null
}

function filtroTipo(poke) {
  let filtrado = true
  for (const tipo of selectedTypes.value) {
    if (!poke.tipos.find(t => t === tipo)) filtrado = false
  }
  return filtrado
}

// Aplicar filtros
const filteredPokedex = computed(() => {
  return pokedex.value.filter((poke) => {
    const especie = poke.especie.toLowerCase();

    return (
      filtroTipo(poke) &&
      (!searchTerm.value || searchTerm.value === '' || especie.includes(searchTerm.value.toLowerCase()))
    );
  });
});

// <================= CARGA INICIAL ==================>

function cargarPokedex() {
  worker.postMessage({
    type: 'query',
    query: 'SELECT Especie, Tipo_primario, Tipo_secundario, Numero_pokedex FROM pokemexe_pokedex',
    params: [],
    origin: 'cargarPokedex'
  })
}

onMounted(async () => {
  worker.postMessage({ type: 'init' })

  worker.onmessage = (e) => {
    if (e.data.type === 'ready') {
      if (!pokedexCargada.value) {
        cargarPokedex()
      }
    }
    if (e.data.type === 'result') {
      if (e.data.origin === 'cargarPokedex') {
        pokedex.value = (e.data.result?.[0]?.values || []).map((row) => ({
          especie: row[0],
          tipos: [row[1], row[2]],
          numPokedex: row[3]
        }))
        if (pokedex.value.length > 0) {
          pokedexCargada.value = true
        }
      }
    }
    if (e.data.type === 'error') {
      console.error("Error en SQLite:", e.data.error)
    }
  };
})

</script>

<template>
  <h1 class="titulo">Pokédex</h1>
  <div class="app">
    <main>
      <!-- Pokédex View -->
      <div class="main-content">
        <div class="pokedex-section">
          <PokemonGrid @show-details="handlePokemonSelect" @manejar-filtros="manejarFiltros" :pokedex="pokedex"
            :filteredPokedex="filteredPokedex" :pokedexCargada="pokedexCargada" :selectedPokemon="selectedPokemon"
            :searchTerm="searchTerm" :selectedTypes="selectedTypes" />
        </div>
        <div class="details-section">
          <!-- <PokemonDetails
            :pokemon="selectedPokemon"
            @show-ability="handleAbilityInfo"
            @show-pokemon-by-name="findPokemonByName"
          />-->
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.titulo {
  letter-spacing: 5px;
  font-family: "Staatliches", sans-serif;
  color: var(--color-texto);
  font-size: 50px;
  padding: 10px 0 0px 2%;
}

.app {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.app::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /*background-image: url('../public/fondo.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;*/
  filter: invert(100%);
  opacity: 0.8;
  z-index: -999;
  pointer-events: none;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #2c3e50;
  font-size: 2.5em;
}

.main-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.main-nav a {
  text-decoration: none;
  color: #555;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.main-nav a:hover {
  background-color: #f0f0f0;
}

.main-nav a.active {
  background-color: #4CAF50;
  color: white;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: calc(100vh - 150px);
}

.pokedex-section {
  overflow-y: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.details-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

main {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.main-content {
  display: flex;
  gap: 20px;
  min-height: 80vh;
}

.pokedex-section,
.details-section {
  flex: 1;
  overflow: auto;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .pokedex-section,
  .details-section {
    flex: none;
    height: 50vh;
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .pokedex-section,
  .details-section {
    flex: auto;
  }
}
</style>
