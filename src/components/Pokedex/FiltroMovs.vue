<template>
  <div class="filter contenedor" ref="container">
    <label>Añadir movimiento:
      <input type="text" v-model="query" @input="filtrarMovimientos" @keydown.enter="seleccionarPrimero"
        @focus="entrarInput" placeholder="Busca un Movimiento..." />
    </label>
    <ul v-if="mostrarDropdown && todosMovsFiltrados.length" class="dropdown" @click.stop>
      <li v-for="(mov, index) in todosMovsFiltrados" :key="index" @click="seleccionar(mov)">
        {{ mov }}
      </li>
    </ul>
    <div>
      <button v-for="mov in movimientos" :key="mov" class="filter-button" @click.stop="quitarMovimientos(mov)">
        {{ mov }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

import worker from '@/sqlWorker'

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
watch(() => props.dbCargada,
  () => {
    if (props.dbCargada) {
      worker.postMessage({
        type: 'query',
        query: 'SELECT Nombre FROM Pokemexe_Movimientos',
        params: [],
        origin: 'cargarMovsFiltros'
      })
    }
  }, { immediate: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  worker.addEventListener('message', handleMovs)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  worker.removeEventListener('message', handleMovs)
})

function handleMovs(e) {
  if (e.data.type === 'error') {
    console.warn('Error al cargar nombres de los Movimientos')
  }
  else if (e.data.type === 'result' && e.data.origin === 'cargarMovsFiltros') {
    todosMovs.value = (e.data.result?.[0]?.values || []).map(m => m[0])
    if (todosMovs.value.length === 0) {
      console.warn('Error al cargar nombres de Movimientos')
    }
  }
}
</script>

<style scoped>
.filter {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  padding: 0 10px;
  max-width: 100%;
}

.filter-button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  font-size: 0.9em;
  width: calc(16.66% - 5px);
  min-width: fit-content;
  margin-bottom: 5px;
}

.contenedor {
  position: relative;
  width: 300px;
  margin: 2rem;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: white;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin-top: 4px;
}

.dropdown li {
  padding: 0.5rem;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #f0f0f0;
}
</style>