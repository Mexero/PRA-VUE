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
    <main class="main-content">
      <!-- Pokédex View -->
      <div class="pokedex-wrapper">
        <button class="verFiltros" @click="verFiltros = true">Filtros</button>
        <div class="pokedex-section">
          <PokemonGrid @show-details="handlePokemonSelect" :pokedex="pokedexFiltrada" :pokedexCargada="pokedexCargada"
            :selectedPokemon="selectedPokemon" />
        </div>
      </div>
      <div class="details-section">
        <!-- Pokemon cargado-->
        <PokemonDetails :pokemon="selectedPokemonData" :pokedex="pokedex" @show-details="handlePokemonSelect" />
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
const pokedexFiltrada = ref([])
const pokedex = ref([])
const selectedPokemon = ref(route.query.seleccionado ?? null)
const selectedPokemonData = ref(null)

//Flags
const dbCargada = ref(false)
const pokedexCargada = ref(false)
const pokedexCompletaCargada = ref(false)
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

    //Cargar pokedex entera
    const lista = await cargarTodosPokes({})
    pokedex.value = lista
    pokedexCompletaCargada.value = true
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
      const lista = await cargarTodosPokes({
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
      pokedexFiltrada.value = lista
      pokedexCargada.value = true
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
  if (searchTerm.value !== (query.busqueda ?? null)) {
    searchTerm.value = query.busqueda ?? null
  }

  const tipos = query.tipos ? query.tipos.split(',').slice(0, 2) : []
  if (JSON.stringify(selectedTypes.value) !== JSON.stringify(tipos)) {
    selectedTypes.value = tipos
  }

  if (selectedPokemon.value !== (query.seleccionado ?? null)) {
    selectedPokemon.value = query.seleccionado ?? null
  }

  if (filtroHabilidad.value !== (query.habilidad ?? null)) {
    filtroHabilidad.value = query.habilidad ?? null
  }

  if (filtroTamano.value !== (query.tamano ?? null)) {
    filtroTamano.value = query.tamano ?? null
  }

  if (filtroSentido.value !== (query.sentido ?? null)) {
    filtroSentido.value = query.sentido ?? null
  }

  if (filtroNatHabil.value !== (query.nathab ?? null)) {
    filtroNatHabil.value = query.nathab ?? null
  }

  const vit = query.vit ? parseInt(query.vit) : null
  if (filtroVitalidad.value !== vit) {
    filtroVitalidad.value = vit
  }

  const nivmin = query.nivmin ? parseInt(query.nivmin) : null
  if (filtroNivelMin.value !== nivmin) {
    filtroNivelMin.value = nivmin
  }

  const vels = query.vels ? query.vels.split(',') : []
  if (JSON.stringify(filtroVelocidades.value) !== JSON.stringify(vels)) {
    filtroVelocidades.value = vels
  }

  const movs = query.movs ? query.movs.split(',') : []
  if (JSON.stringify(filtroMovimientos.value) !== JSON.stringify(movs)) {
    filtroMovimientos.value = movs
  }
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
}) {

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
    const condicionesMovs = filtroMovimientos.map(() => `
    EXISTS (
      SELECT 1 
      FROM pokemon_movimientos pm
      JOIN movimientos m ON m.ID = pm.MovimientoID
      WHERE pm.PokemonID = pokedex.ID
        AND m.Nombre = ?
    )
  `)

    condiciones.push(`(${condicionesMovs.join(' AND ')})`)

    filtroMovimientos.forEach(mov => params.push(mov))
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''

  const query = `
    SELECT Especie, Tipo_primario, Tipo_secundario, Numero_pokedex, Es_Alternativo
    FROM pokedex
    ${where}
  `

  let data = []

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
      }
    }
  } catch (err) {
    errorCargaPokemon.value = err.message || 'Error cargando especies Pokémon'
    console.warn(errorCargaPokemon.value)
  } finally {
    return data
  }
}


// <========= CAMBIAR SELECCIONADO =============>
watch([
  selectedPokemon,
  pokedexCompletaCargada
],
  () => {
    router.replace({ query: construirQuery() })
    if (pokedexCompletaCargada.value) {
      errorCargaPokemon.value = false
      if (!selectedPokemon.value) {
        selectedPokemon.value = pokedex.value[0].especie
      }
      else if (pokedex.value.find(p => p.especie === selectedPokemon.value)) {
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
  if (!pokedexCompletaCargada.value) return

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
        SELECT '[' || GROUP_CONCAT(
                 json_object(
                   'nombre', h.Nombre,
                   'esOptativa', ph.Es_Optativa
                 ), ',') || ']'
        FROM pokemon_habilidades ph
        JOIN habilidades h ON h.ID = ph.Habilidad_ID
        WHERE ph.Pokemon_ID = pokedex.ID AND ph.Es_Oculta = 0
      ) AS Habilidades,
      (
        SELECT '[' || GROUP_CONCAT(
                 json_object(
                   'nombre', h.Nombre,
                   'esOptativa', ph.Es_Optativa
                 ), ',') || ']'
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
        habilidades: JSON.parse(row[23] || '[]'),
        habilidadesOcultas: JSON.parse(row[24] || '[]'),
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
  if (evoEn === '' || evoEn === null) {
    if (evoOtros === '' || evoOtros === null) return null
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-fondo);
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


/* === Abrir filtro === */
.verFiltros {
  position: sticky;
  width: fit-content;
  background-color: var(--color-principal1);
  color: var(--color-texto);
  font-weight: bold;
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.verFiltros:hover {
  background-color: var(--color-secundario);
  transform: translateY(-2px);
}

.verFiltros:active {
  background-color: var(--color-secundario);
  transform: translateY(0);
}

/* === main === */
.main-content {
  margin: 20px;
  background-color: var(--color-fondoTexto);
  border-radius: 10px;
  display: grid;
  grid-template-columns: 55fr 45fr;
  gap: 20px;
  min-height: 75vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pokedex-wrapper {
  max-height: 75vh;
  display: flex;
  flex-direction: column;
}

.pokedex-section {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  border: 1px solid #999;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.details-section {
  max-height: 75vh;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 25px;
  background-color: var(--color-hoverBloque);
  border: 2px solid #999;
  border-top: 5px solid var(--color-principal1);
  font-size: 14px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

@media (max-width: 950px) {
  .main-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .pokedex-wrapper {
    max-height: 50vh;
  }

  .details-section {
    max-height: 70vh;
  }

}
</style>
