<script setup>
import PokemonGrid from '@/components/Pokedex/PokemonGrid.vue'
import PokemonDetails from '@/components/Pokedex/PokemonDetails.vue'
import AdminIndex from '@/components/EditorDB/AdminIndex.vue'
import AdminPokemonEdit from '@/components/EditorDB/AdminPokemonEdit.vue'
import { ref, computed, onMounted } from 'vue'

const selectedPokemon = ref(null)

function handlePokemonSelect(pokemon) {
  selectedPokemon.value = pokemon
}

function findPokemonByName(name) {
  // Buscar el Pokémon por nombre en la lista de Pokémon cargados
  const pokemonGridComponent = document.querySelector('.pokedex-section').__vue__
  if (pokemonGridComponent && pokemonGridComponent.pokemons) {
    const foundPokemon = pokemonGridComponent.pokemons.find(p => p.Especie === name)
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

// Create a reactive reference to track the current hash
const currentHash = ref(window.location.hash)

// Computed property to determine the current view based on URL hash
const currentView = computed(() => {
  const hash = currentHash.value.toLowerCase()
  if (hash.startsWith('#/admin/edit/')) {
    return 'admin-edit'
  } else if (hash.startsWith('#/admin')) {
    return 'admin'
  } else {
    return 'pokedex'
  }
})

// Add event listener for hash changes to ensure the view updates
onMounted(() => {
  window.addEventListener('hashchange', () => {
    // Update the reactive reference when hash changes
    currentHash.value = window.location.hash
    console.log('Hash changed to:', window.location.hash)
  })
})
</script>

<template>
  <div class="app">
    <header>
      <h1>{{ currentView === 'admin' ? 'Admin Panel' : 'Pokédex' }}</h1>
      <nav class="main-nav">
        <a href="#/" :class="{ active: currentView === 'pokedex' }">Pokédex</a>
        <a href="#/admin" :class="{ active: currentView === 'admin' }">Admin</a>
      </nav>
    </header>
    <main>
      <!-- Pokédex View -->
      <div v-if="currentView === 'pokedex'" class="main-content">
        <div class="pokedex-section">
          <PokemonGrid @show-details="handlePokemonSelect" />
        </div>
        <div class="details-section">
          <PokemonDetails
            :pokemon="selectedPokemon"
            @show-ability="handleAbilityInfo"
            @show-pokemon-by-name="findPokemonByName"
          />
        </div>
      </div>
      
      <!-- Admin Views -->
      <AdminIndex v-if="currentView === 'admin'" />
      <AdminPokemonEdit v-if="currentView === 'admin-edit'" />
    </main>
  </div>
</template>

<style>
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
  background-image: url('../public/fondo.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
