<template>
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
          <!-- Pokemon cargado-->
          <PokemonDetails :pokemon="selectedPokemonData" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import PokemonGrid from '@/components/Pokedex/PokemonGrid.vue'
import PokemonDetails from '@/components/Pokedex/PokemonDetails.vue'

import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from "vue-router";

import worker from '../sqlWorker.js';

const route = useRoute()
const router = useRouter()

//Datos
const pokedex = ref([])
const selectedPokemon = ref(route.query.seleccionado ?? null)
const selectedPokemonData = ref(null)

//Flags
const pokedexCargada = ref(false)
const cargandoPokemon = ref(false)
const errorCargaPokemon = ref(false)

function handlePokemonSelect(pokemon) {
  selectedPokemon.value = pokemon
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
          if (!selectedPokemon.value) {
            selectedPokemon.value = pokedex.value[0].especie
          }
          pokedexCargada.value = true
        }
      }
    }
    if (e.data.type === 'error') {
      console.error("Error en SQLite:", e.data.error)
    }
  };
})

// <========= CAMBIAR SELECCIONADO =============>
watch([
  selectedPokemon,
  pokedexCargada
],
  () => {
    if (pokedexCargada.value) {
      errorCargaPokemon.value = false
      if (pokedex.value.find(p => p.especie === selectedPokemon.value)) {
        cargandoPokemon.value = true
        cambiarPokeSeleccionado(selectedPokemon.value)
      }
      else {
        errorCargaPokemon.value = true
        console.warn('No existe ' + selectedPokemon.value)
      }
    }
  },
  { deep: true, immediate: true }
)

function cambiarPokeSeleccionado(especie) {
  worker.postMessage({
    type: 'query',
    query: `
                SELECT Numero_pokedex, Especie, Tipo_primario, Tipo_secundario, 
                FUE, AGI, RES, MEN, ESP, PRE, 
                S_FUE, S_AGI, S_RES, S_ESP,
                Vitalidad,
                V_Caminado, V_Trepado, V_Excavado, V_Nado, V_Vuelo, V_Levitado,
                Nat_Habil_1, Nat_Habil_2,
                Habilidad_1, Habilidad_2, Habilidad_3, Hab_oculta_1, Hab_oculta_2,
                AC1, AC2, 
                Dieta, Tamano, Sexo, Sentidos, Niv_Minimo, Habitat, Ratio_de_captura,
                Evoluciona_de, EvoEn,	Nivel_Evo, Tipo_requisito, Requisitos_Evo, Evo_otros,
                Mov_Nivel_1, Mov_Nivel_2, Mov_Nivel_4, Mov_Nivel_6, Mov_Nivel_8, Mov_Nivel_10,
                Mov_Nivel_12, Mov_Nivel_14, Mov_Nivel_16, Mov_Nivel_18, Mov_Nivel_20,
                Mov_ensenables
                FROM pokemexe_pokedex
            WHERE Especie = ?
        `,
    params: [especie],
    origin: "CambiarSeleccionado"
  })
}

worker.addEventListener('message', handlePokemonFetch);

function handlePokemonFetch(e) {
  if (e.data.type === 'result' && e.data.origin === 'CambiarSeleccionado') {
    const row = e.data.result?.[0]?.values?.[0]
    if (row) {
      selectedPokemonData.value = {
        numPokedex: row[0],
        especie: row[1],
        tipos: [row[2], row[3]],
        stats: { fue: row[4], agi: row[5], res: row[6], men: row[7], esp: row[8], pre: row[9] },
        saves: { fue: row[10], agi: row[11], res: row[12], esp: row[13] },
        vit: row[14],
        velocidades: { caminado: row[15], trepado: row[16], excavado: row[17], nado: row[18], vuelo: row[19], levitado: row[20] },
        natHabil: [row[21], row[22]],
        habilidades: [row[23], row[24], row[25]],
        habilidadesOcultas: [row[26], row[27]],
        calculosCa: [row[28], row[29]],
        otros: { dieta: row[30], tamano: row[31], sexo: row[32], sentidos: row[33], nivMinimo: row[34], habitat: row[35], ratioCaptura: row[36] },
        evoDe: row[37],
        evolucion: generarEvoluciones(row[38], row[39], row[40], row[41], row[42]),
        movimientosNivel: [row[43].split(', '), row[44].split(', '), row[45].split(', '), row[46].split(', '), row[47].split(', '), row[48].split(', '), row[49].split(', '), row[50].split(', '), row[51].split(', '), row[52].split(', '), row[53].split(', ')],
        movimientosEnsenables: tratarEnsenables(row[54])
      }
    }
    console.log("Datos cargados: ", selectedPokemonData.value)
  }
  else if (e.data.type === 'error') {
    errorCargaPokemon.value = true
    console.error("Error al seleccionar especie:", e.data.error)
  }
  cargandoPokemon.value = false
}

function tratarEnsenables(array) {
  let temporal = array
  if (temporal[temporal.length - 1] === ".") temporal = temporal.slice(0, -1);
  return temporal.split(', ')
}

function generarEvoluciones(evoEn, nivelEvo, tipoRequisito, requisitosEvo, evoOtros) {
  if (evoEn === '') {
    if (evoOtros === '') return null
    return { mensajeExtra: evoOtros }
  }
  let evoEnArray = evoEn.split(';')
  let nivelEvoArray = nivelEvo.split(';')
  let tipoRequisitoArray = tipoRequisito.split(';')
  let requisitosEvoArray = requisitosEvo.split(';')
  let evoOtrosArray = evoOtros.split(';')

  let evoluciones = []
  for (let i = 0; i < evoEnArray.length; i++) {
    evoluciones.push({
      nombre: evoEnArray[i],
      nivel: nivelEvoArray[i],
      tipoRequisito: tipoRequisitoArray[i],
      requisitos: requisitosEvoArray[i],
      otros: evoOtrosArray[i] ?? null
    })
  }
  return evoluciones
}

onUnmounted(() => {
  worker.removeEventListener('message', handlePokemonFetch)
})
</script>

<style scoped>
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
