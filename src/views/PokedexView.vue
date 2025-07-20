<template>
  <div class="app">
    <div v-if="verFiltros" class="modal-overlay">
      <div class="modal-content">
        <button class="cerrar-filtros" @click="verFiltros = false">✖</button>
        <PokedexFilters v-if="verFiltros" @manejar-filtros="manejarFiltros" @cerrar-filtros="verFiltros = false"
          :searchTerm="searchTerm" :filtroHabilidad="filtroHabilidad" :selectedTypes="selectedTypes"
          :filtro-tamano="filtroTamano" :filtroNatHabil="filtroNatHabil" :filtroSentido="filtroSentido"
          :filtroNivelMin="filtroNivelMin" :filtroVitalidad="filtroVitalidad" :filtroVelocidades="filtroVelocidades"
          :filtroMovimientos=filtroMovimientos :dbCargada="dbCargada" />
      </div>
    </div>
    <main>
      <button @click="verFiltros = true">Filtros</button>
      <!-- Pokédex View -->
      <div class="main-content">
        <div class="pokedex-section">
          <PokemonGrid @show-details="handlePokemonSelect" :pokedex="pokedex" :pokedexCargada="pokedexCargada"
            :selectedPokemon="selectedPokemon" />
        </div>
        <div class="details-section">
          <!-- Pokemon cargado-->
          <PokemonDetails :pokemon="selectedPokemonData" :pokedex="pokedex" @show-details="handlePokemonSelect" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import PokemonGrid from '@/components/Pokedex/PokemonGrid.vue'
import PokemonDetails from '@/components/Pokedex/PokemonDetails.vue'
import PokedexFilters from '@/components/Pokedex/PokedexFilters.vue';

import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from "vue-router";

import worker from '../sqlWorker.js';

const route = useRoute()
const router = useRouter()

//Datos
const pokedex = ref([])
const selectedPokemon = ref(route.query.seleccionado ?? null)
const selectedPokemonData = ref(null)

//Flags
const dbCargada = ref(false)
const pokedexCargada = ref(false)
const cargandoPokemon = ref(false)
const errorCargaPokemon = ref(false)
const verFiltros = ref(false)


// ========================= INICIO ===========================
onMounted(async () => {
  aplicarQuery(route.query)
  worker.postMessage({ type: 'init' })

  worker.onmessage = (e) => {
    if (e.data.type === 'ready') {
      dbCargada.value = true //Esto activa el watch que hace que se carguen los pokes y el watch que carga nombres de habs y de movs
    }
    else if (e.data.type === 'error') {
      console.error("Error en SQLite:", e.data.error)
    }
    else if (e.data.type === 'result')
      if (e.data.origin === 'cargarTodosPokes') {
        pokedex.value = (e.data.result?.[0]?.values || []).map((row) => ({
          especie: row[0],
          tipos: [row[1], row[2]],
          numPokedex: row[3]
        }))
        if (pokedex.value.length > 0) {
          OrderPokedex()

          //  const nombresStr = pokedex.value.map(p => p.especie).join(', ')
          //  console.log('Pokémon encontrados:', nombresStr)

          const encontrado = pokedex.value.find(p => p.especie === selectedPokemon.value)
          if (!selectedPokemon.value || !encontrado) {
            selectedPokemon.value = pokedex.value[0]?.especie
          }
          pokedexCargada.value = true
        }
      }
  }
})

// ========================= FILTROS ===========================
const searchTerm = ref(route.query.busqueda || null)
const selectedTypes = ref(route.query.tipos || [])
const filtroHabilidad = ref(route.query.habilidad || null)
const filtroTamano = ref(route.query.tamano || null)
const filtroSentido = ref(route.query.sentido || null)
const filtroNatHabil = ref(route.query.nathab || null)
const filtroVitalidad = ref(route.query.vit ? parseInt(route.query.vit) : null)
const filtroNivelMin = ref(route.query.nivmin ? parseInt(route.query.nivmin) : null)
const filtroVelocidades = ref(route.query.vels ? route.query.vels.split(',') : [])
const filtroMovimientos = ref(route.query.movs ? route.query.movs.split(',') : [])

//Modifica filtros
function manejarFiltros(busqueda, tipos, habilidad, tamano, sentido, natHab, vit, nivMin, vels, movs) {
  searchTerm.value = busqueda
  selectedTypes.value = tipos
  filtroHabilidad.value = habilidad
  filtroTamano.value = tamano
  filtroSentido.value = sentido
  filtroNatHabil.value = natHab
  filtroVitalidad.value = vit
  filtroNivelMin.value = nivMin
  filtroVelocidades.value = vels
  filtroMovimientos.value = movs

  verFiltros.value = false
}

//Cambia la ruta y aplicar filtros si hay datos cargados
watch(
  [
    selectedPokemon,
    searchTerm,
    selectedTypes,
    filtroHabilidad,
    filtroTamano,
    filtroSentido,
    filtroNatHabil,
    filtroVitalidad,
    filtroNivelMin,
    filtroVelocidades,
    filtroMovimientos,
    dbCargada
  ],
  () => {
    router.replace({ query: construirQuery() })
    if (dbCargada.value) {
      cargarTodosPokes({
        searchTerm: searchTerm.value,
        selectedTypes: selectedTypes.value,
        filtroHabilidad: filtroHabilidad.value,
        filtroTamano: filtroTamano.value,
        filtroSentido: filtroSentido.value,
        filtroNatHabil: filtroNatHabil.value,
        filtroVitalidad: filtroVitalidad.value,
        filtroNivelMin: filtroNivelMin.value,
        filtroVelocidades: filtroVelocidades.value,
        filtroMovimientos: filtroMovimientos.value
      })
    }
  },
  { deep: true }
);

//Aplica filtros desde la ruta
watch(
  () => route.query,
  (query) => {
    aplicarQuery(query)
  }
);

function construirQuery() {
  return {
    busqueda: searchTerm.value !== '' ? searchTerm.value : undefined,
    tipos: selectedTypes.value.length ? selectedTypes.value.join(',') : undefined,
    seleccionado: selectedPokemon.value ?? undefined,
    habilidad: filtroHabilidad.value ?? undefined,
    tamano: filtroTamano.value ?? undefined,
    sentido: filtroSentido.value ?? undefined,
    nathab: filtroNatHabil.value ?? undefined,
    vit: filtroVitalidad.value ?? undefined,
    nivmin: filtroNivelMin.value ?? undefined,
    vels: filtroVelocidades.value.length ? filtroVelocidades.value.join(',') : undefined,
    movs: filtroMovimientos.value.length ? filtroMovimientos.value.join(',') : undefined

  };
}

function aplicarQuery(query) {
  searchTerm.value = query.busqueda ?? null
  selectedTypes.value = query.tipos ? query.tipos.split(',').slice(0, 2) : []
  selectedPokemon.value = query.seleccionado ?? null
  filtroHabilidad.value = query.habilidad ?? null
  filtroTamano.value = query.tamano ?? null
  filtroSentido.value = query.sentido ?? null
  filtroNatHabil.value = query.nathab ?? null
  filtroVitalidad.value = query.vit ? parseInt(query.vit) : null
  filtroNivelMin.value = query.nivmin ? parseInt(query.nivmin) : null
  filtroVelocidades.value = query.vels ? query.vels.split(',') : []
  filtroMovimientos.value = query.movs ? query.movs.split(',') : []

}

// <================= ESTÉTICA FILTROS ==================>

watch(() => verFiltros.value, (nuevoValor) => {
  document.body.style.overflow = nuevoValor ? 'hidden' : 'auto'
})

// <================= CARGAR DATOS ==================>

function cargarTodosPokes({
  searchTerm = '',
  selectedTypes = [],
  filtroHabilidad = null,
  filtroTamano = null,
  filtroSentido = null,
  filtroNatHabil = null,
  filtroNivelMin = null,
  filtroVitalidad = null,
  filtroVelocidades = [],
  filtroMovimientos = []
}) {
  const condiciones = []
  const params = []

  if (searchTerm) {
    condiciones.push(`Especie LIKE ?`)
    params.push(`%${searchTerm}%`)
  }

  // Tipos (ambos deben estar presentes, en primario o secundario)
  if (selectedTypes.length > 0) {
    const tipoCondiciones = selectedTypes.map(() => `(Tipo_primario = ? OR Tipo_secundario = ?)`)
    condiciones.push(`(${tipoCondiciones.join(' AND ')})`)
    selectedTypes.forEach(tipo => {
      params.push(tipo, tipo)
    })
  }

  if (filtroHabilidad) {
    condiciones.push(`(
      Habilidad_1 = ? OR
      Habilidad_2 = ? OR
      Habilidad_3 = ? OR
      Hab_oculta_1 = ? OR
      Hab_oculta_2 = ?
    )`)
    for (let i = 0; i < 5; i++) params.push(filtroHabilidad)
  }

  if (filtroTamano) {
    condiciones.push(`Tamano LIKE ?`)
    params.push(`%${filtroTamano}%`)
  }

  if (filtroSentido) {
    condiciones.push(`Sentidos LIKE ?`)
    params.push(`%${filtroSentido}%`)
  }

  if (filtroVitalidad !== null) {
    condiciones.push(`Vitalidad = ?`)
    params.push(filtroVitalidad)
  }

  if (filtroNivelMin !== null) {
    condiciones.push(`Niv_Minimo >= ?`)
    params.push(filtroNivelMin)
  }

  // Naturalmente Hábil en uno de los 2
  if (filtroNatHabil) {
    condiciones.push(`(Nat_Habil_1 LIKE ? OR Nat_Habil_2 LIKE ?)`)
    params.push(`%${filtroNatHabil}%`, `%${filtroNatHabil}%`)
  }

  // Velocidades
  const velocidadMap = {
    caminado: 'V_Caminado',
    excavado: 'V_Excavado',
    levitado: 'V_Levitado',
    nado: 'V_Nado',
    trepado: 'V_Trepado',
    vuelo: 'V_Vuelo'
  }

  filtroVelocidades.forEach(tipo => {
    const col = velocidadMap[tipo.toLowerCase()]
    if (col) {
      condiciones.push(`${col} > 0`)
    }
  })

  if (filtroMovimientos.length > 0) {
    filtroMovimientos.forEach(mov => {
      condiciones.push(`Mov_ensenables LIKE ?`)
      params.push(`%${mov}%`)
    })
  }

  // WHERE final
  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''

  const query = `
    SELECT Especie, Tipo_primario, Tipo_secundario, Numero_pokedex
    FROM pokedex
    ${where}
  `

  worker.postMessage({
    type: 'query',
    query,
    params,
    origin: 'cargarTodosPokes'
  })
}

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
  { deep: true }
)

function cambiarPokeSeleccionado(especie) {
  if (!pokedexCargada.value) return
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
                ID
                FROM pokedex
            WHERE Especie = ?
        `,
    //Mov_Nivel_1, Mov_Nivel_2, Mov_Nivel_4, Mov_Nivel_6, Mov_Nivel_8, Mov_Nivel_10,
    //Mov_Nivel_12, Mov_Nivel_14, Mov_Nivel_16, Mov_Nivel_18, Mov_Nivel_20,
    //Mov_ensenables,
    params: [especie],
    origin: "CambiarSeleccionado"
  })
}

worker.addEventListener('message', handlePokemonFetch);

//Quitar el listener de arriba al desmontar para no generar duplicados
onUnmounted(() => {
  worker.removeEventListener('message', handlePokemonFetch)
})

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
        evoDe: row[37].split(' (')[0],
        evolucion: generarEvoluciones(row[38], row[39], row[40], row[41], row[42]),
        //movimientosNivel: [row[43].split(', '), row[44].split(', '), row[45].split(', '), row[46].split(', '), row[47].split(', '), row[48].split(', '), row[49].split(', '), row[50].split(', '), row[51].split(', '), row[52].split(', '), row[53].split(', ')],
        //movimientosEnsenables: tratarEnsenables(row[54]),
        id: row[43]
      }
    }
    console.log("Datos cargados: ", selectedPokemonData.value.especie, selectedPokemonData.value)
  }
  else if (e.data.type === 'error') {
    errorCargaPokemon.value = true
    console.error("Error al seleccionar especie:", e.data.error)
  }
  cargandoPokemon.value = false
}

// ==================== UTILIDAD =======================

function handlePokemonSelect(pokemon) {
  selectedPokemon.value = pokemon
}

function OrderPokedex() {
  if (pokedex.value.length === 0) {
    console.warn('La Pokédex está vacía')
    return
  }
  pokedex.value = pokedex.value.sort((a, b) => a.numPokedex.localeCompare(b.numPokedex));

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
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  /* Fondo oscuro */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: white;
  width: 90vw;
  height: 90vh;
  overflow-y: auto;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

/* Botón de cerrar */
.cerrar-filtros {
  position: absolute;
  top: 10px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
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
