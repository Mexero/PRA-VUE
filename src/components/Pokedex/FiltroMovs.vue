<template>
  <div class="filter" ref="container">
    <label>Añadir movimiento:
      <input type="text" v-model="query" @input="filtrarMovimientos" @keydown.enter="seleccionarPrimero"
        @focus="entrarInput" placeholder="Busca un Movimiento..." />
    </label>
    <ul v-if="mostrarDropdown && todosMovsFiltrados.length" class="dropdown" @click.stop>
      <li v-for="(mov, index) in todosMovsFiltrados" :key="index" @click="seleccionar(mov)">
        {{ mov }}
      </li>
    </ul>
  </div>
  <div>
    <button v-for="mov in movimientos" :key="mov" class="filter-button" @click.stop="quitarMovimientos(mov)">
      {{ mov }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

import { initDB, queryDB } from '@/services/dbWorkerService'

//flags DB
const isReady = ref(false)
const error = ref(null)
const loading = ref(false)

const props = defineProps(['movs', 'dbCargada'])

const movimientos = ref([...props.movs])
const query = ref('')
const todosMovs = ref([])
const todosMovsFiltrados = ref([])
const mostrarDropdown = ref(false)
const container = ref(null)


//Añadir mov nuevo
const entrarInput = () => {
  mostrarDropdown.value = true
  filtrarMovimientos()

}

const filtrarMovimientos = () => {
  const texto = query.value?.toLowerCase().trim()
  if (!texto) {
    todosMovsFiltrados.value = todosMovs.value
    return
  }
  todosMovsFiltrados.value = todosMovs.value.filter((m) =>
    m.toLowerCase().includes(texto)
  )
}

const seleccionar = (mov) => {
  if (!movimientos.value.includes(mov)) {
    movimientos.value.push(mov)
    emit('cambiarMovs', movimientos.value)
  }
  query.value = ''
  mostrarDropdown.value = false
}

const seleccionarPrimero = () => {
  if (habilidadesFiltradas.value.length > 0) {
    seleccionar(habilidadesFiltradas.value[0])
  }
}


//Emitir cambios
const emit = defineEmits(['cambiarMovs'])

watch(() => [props.movs],
  () => {
    movimientos.value = [...props.movs]
  },
  { deep: true, immediate: true }
)

function quitarMovimientos(mov) {
  if (!movimientos.value.includes(mov)) return

  movimientos.value = movimientos.value.filter(m => m !== mov)
  emit('cambiarMovs', movimientos.value)
}

// Cerrar dropdown al hacer clic fuera
const handleClickOutside = (event) => {
  if (container.value && !container.value.contains(event.target)) {
    mostrarDropdown.value = false
  }
}

//Fetch de movimientos
watch(() => [props.dbCargada, isReady],
  async () => {
    if (props.dbCargada && isReady.value) todosMovs.value = await handleMovs()
  }, { immediate: true, deep: true })

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  try {
    await initDB()
    isReady.value = true
  } catch (err) {
    errorCargaPokemon.value = err.message || 'Error inicializando DB'
    console.warn(errorCargaPokemon.value)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

async function handleMovs() {
  loading.value = true
  error.value = null

  let data = []
  try {
    const res = await queryDB(`SELECT Nombre FROM movimientos`, [])

    data = (res?.[0]?.values || []).map((row) => row[0]);
  } catch (err) {
    error.value = err.message || 'Error cargando los movimientos'
    console.warn(error.value)
  } finally {
    loading.value = false
    return data
  }
}
</script>

<style scoped>
.filter {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding: 0 12px;
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.filter-button {
  padding: 6px 12px;
  border: none;
  margin: 0 5px;
  border-radius: 6px;
  background-color: var(--color-principal1);
  color: var(--color-texto);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
  font-size: 0.95em;
  flex: 1 1 calc(16.66% - 8px);
  min-width: 90px;
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.4);
}

.filter-button:hover,
.filter-button:focus {
  background-color: var(--color-principal2);
  outline: none;
  box-shadow: 0 0 8px rgba(21, 90, 156, 0.7);
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
  color: #333;
  user-select: none;
  color: var(--color-texto);
}

input[type="text"] {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #ccc;
  border-radius: 6px;
  font-size: 1em;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input[type="text"]:focus {
  border-color: var(--color-secundario1);
  box-shadow: 0 0 6px rgba(25, 118, 210, 0.5);
  outline: none;
}

.dropdown {
  position: absolute;
  top: 20px;
  left: 65%;
  margin-left: 8px;
  width: 200px;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 6px 14px rgba(25, 118, 210, 0.3);
  z-index: 1100;
  font-size: 0.95em;
}

.dropdown li {
  padding: 10px 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: none;
}

.dropdown li:hover,
.dropdown li:focus {
  background-color: var(--color-fondoTarjeta);
  outline: none;
}

@media (max-width:750px) {
  .dropdown {
    top: -180px;
    left: 40%;
  }
}
</style>