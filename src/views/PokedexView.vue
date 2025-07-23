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

import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from "vue-router";

import { initDB, queryDB } from '@/services/dbWorkerService'

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

  //abrirDB
  try {
    await initDB()
    dbCargada.value = true //Esto dispara el watch que hace que se carguen los pokes y el watch que carga nombres de habs y de movs
  } catch (err) {
    errorCargaPokemon.value = err.message || 'Error inicializando DB'
    console.warn(errorCargaPokemon.value)
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
  async () => {
    router.replace({ query: construirQuery() })
    if (dbCargada.value) {
      const { lista, especie } = await cargarTodosPokes({
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
      },
        selectedPokemon.value)

      pokedex.value = lista
      pokedexCargada.value = true
      if (selectedPokemon.value !== especie) selectedPokemon.value = especie
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

async function cargarTodosPokes({
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
},
  selected) {

  const condiciones = []
  const params = []

  if (searchTerm) {
    condiciones.push(`Especie LIKE ?`)
    params.push(`%${searchTerm}%`)
  }

  // Tipos
  if (selectedTypes.length > 0) {
    const tipoCondiciones = selectedTypes.map(() => `(Tipo_primario = ? OR Tipo_secundario = ?)`)
    condiciones.push(`(${tipoCondiciones.join(' AND ')})`)
    selectedTypes.forEach(tipo => {
      params.push(tipo, tipo)
    })
  }

  // Habilidad (usando tabla relacional)
  if (filtroHabilidad) {
    condiciones.push(`
      EXISTS (
        SELECT 1 FROM pokemon_habilidades ph
        JOIN habilidades h ON h.ID = ph.Habilidad_ID
        WHERE ph.Pokemon_ID = pokedex.ID
          AND h.Nombre = ?
      )
    `)
    params.push(filtroHabilidad)
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

  if (filtroNatHabil) {
    condiciones.push(`(Nat_Habil_1 LIKE ? OR Nat_Habil_2 LIKE ?)`)
    params.push(`%${filtroNatHabil}%`, `%${filtroNatHabil}%`)
  }

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

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''

  const query = `
    SELECT Especie, Tipo_primario, Tipo_secundario, Numero_pokedex, Es_Alternativo
    FROM pokedex
    ${where}
  `

  let data = []
  let elegido = selected

  try {
    const res = await queryDB(query, params)
    const rows = res?.[0]?.values || []

    if (rows) {
      data = rows.map((row) => ({
        especie: row[0],
        tipos: [row[1], row[2]],
        numPokedex: row[3],
        esAlternativo: row[4]
      }))
      if (data.length > 0) {
        data = OrderPokedex(data)
        const encontrado = data.find(p => p.especie === selected)
        if (!selected || !encontrado) {
          elegido = data[0]?.especie
        }
      }
    }
  } catch (err) {
    errorCargaPokemon.value = err.message || 'Error cargando especies Pokémon'
    console.warn(errorCargaPokemon.value)
  } finally {
    return {
      lista: data,
      especie: elegido
    }
  }
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

async function cambiarPokeSeleccionado(especie) {
  if (!pokedexCargada.value) return

  cargandoPokemon.value = true
  errorCargaPokemon.value = null

  try {
    const res = await queryDB(`
      SELECT 
        pokedex.Numero_pokedex, pokedex.Especie, pokedex.Tipo_primario, pokedex.Tipo_secundario, 
        pokedex.FUE, pokedex.AGI, pokedex.RES, pokedex.MEN, pokedex.ESP, pokedex.PRE, 
        pokedex.S_FUE, pokedex.S_AGI, pokedex.S_RES, pokedex.S_ESP,
        pokedex.Vitalidad,
        pokedex.V_Caminado, pokedex.V_Trepado, pokedex.V_Excavado, pokedex.V_Nado, pokedex.V_Vuelo, pokedex.V_Levitado,
        pokedex.Nat_Habil_1, pokedex.Nat_Habil_2,
        (
          SELECT GROUP_CONCAT(h.Nombre)
          FROM pokemon_habilidades ph
          JOIN habilidades h ON h.ID = ph.Habilidad_ID
          WHERE ph.Pokemon_ID = pokedex.ID AND ph.Es_Oculta = 0
        ) AS Habilidades,
        (
          SELECT GROUP_CONCAT(h.Nombre)
          FROM pokemon_habilidades ph
          JOIN habilidades h ON h.ID = ph.Habilidad_ID
          WHERE ph.Pokemon_ID = pokedex.ID AND ph.Es_Oculta = 1
        ) AS Habilidades_Ocultas,
        pokedex.AC1, pokedex.AC2, 
        pokedex.Dieta, pokedex.Tamano, pokedex.Sexo, pokedex.Sentidos, pokedex.Niv_Minimo, pokedex.Habitat, pokedex.Ratio_de_captura,
        pokedex.Evoluciona_de, pokedex.EvoEn, pokedex.Nivel_Evo, pokedex.Tipo_requisito, pokedex.Requisitos_Evo, pokedex.Evo_otros,
        pokedex.ID, pokedex.Es_alternativo
      FROM pokedex
      WHERE pokedex.Especie = ?
    `, [especie])

    const row = res?.[0]?.values?.[0]
    if (row) {
      selectedPokemonData.value = {
        numPokedex: row[0],
        especie: row[1],
        tipos: [row[2], row[3]],
        stats: {
          fue: row[4], agi: row[5], res: row[6],
          men: row[7], esp: row[8], pre: row[9]
        },
        saves: {
          fue: row[10], agi: row[11],
          res: row[12], esp: row[13]
        },
        vit: row[14],
        velocidades: {
          caminado: row[15], trepado: row[16], excavado: row[17],
          nado: row[18], vuelo: row[19], levitado: row[20]
        },
        natHabil: [row[21], row[22]],
        habilidades: row[23]?.split(',') || [],
        habilidadesOcultas: row[24]?.split(',') || [],
        calculosCa: [row[25], row[26]],
        otros: {
          dieta: row[27], tamano: row[28], sexo: row[29],
          sentidos: row[30], nivMinimo: row[31],
          habitat: row[32], ratioCaptura: row[33]
        },
        evoDe: row[34]?.split(' (')[0] || null,
        evolucion: generarEvoluciones(row[35], row[36], row[37], row[38], row[39]),
        id: row[40],
        esAlternativo: row[41]
      }

      console.log("Datos cargados: ", selectedPokemonData.value.especie, selectedPokemonData.value)
    }
  } catch (err) {
    errorCargaPokemon.value = err.message || 'Error cargando la especie Pokémon ' + especie
    console.warn(errorCargaPokemon.value)
  } finally {
    cargandoPokemon.value = false
  }
}

// ==================== UTILIDAD =======================

function handlePokemonSelect(pokemon) {
  selectedPokemon.value = pokemon
}

function OrderPokedex(data) {
  if (data.length === 0) {
    console.warn('La Pokédex está vacía')
    return data
  }
  return data.sort((a, b) => a.numPokedex.localeCompare(b.numPokedex));

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
