<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()



// ======================== AQUÍ ESTÁ LA INFO DE LOS DATOS ========================
const objetos = ref([])
const objetoSeleccionado = ref(null)
const mostrarFiltros = ref(false)

// ================ SELECCIÓN FILTROS DESDE LA RUTA =====================
const filtroTipos = ref(route.query.tipos ? route.query.tipos.split(',') : [])
const filtroRarezas = ref(route.query.rareza ? route.query.rareza.split(',') : [])
const filtroCoste = ref(route.query.coste !== undefined ? route.query.coste === 'true' : null)
const filtroPrecioMin = ref(route.query.precioMin ? Number(route.query.precioMin) : null)
filtroPrecioMin.value = isNaN(filtroPrecioMin.value) ? null : filtroPrecioMin.value
const filtroPrecioMax = ref(route.query.precioMax ? Number(route.query.precioMax) : null)
filtroPrecioMax.value = isNaN(filtroPrecioMax.value) ? null : filtroPrecioMax.value
const filtroNombre = ref(route.query.nombre || '')
const filtroNombreInput = ref(filtroNombre.value)



// ============= GUARDA INFO DE CÓMO ESTÁ ORDENADA LA TABLA DESDE LA RUTA =================
const ordenColumna = ref(route.query.ordenColumna || '')
const ordenAscendente = ref(route.query.ordenAscendente !== 'false')



// =================== CARGAR DATOS AL ABRIR ==================

onMounted(async () => {
    const res = await fetch('/data/json/objetos/objetos.json')
    objetos.value = await res.json()
})


// ===================== SELECCIONAR OBJETOS PARA EL CUADRO ===================
function seleccionarObjeto(objeto) {
    objetoSeleccionado.value = objeto
}



// ======================== LIMPIAR FILTROS ============================
function limpiarFiltros() {
    filtroTipos.value = []
    filtroRarezas.value = []
    filtroCoste.value = null
    filtroPrecioMin.value = null
    filtroPrecioMax.value = null
    filtroNombre.value = ''
    filtroNombreInput.value = ''
    ordenColumna.value = ''
    ordenAscendente.value = true
    objetoSeleccionado.value = null
}



// ================ CREA LOS FILTROS DE RAREZA Y TIPOS MIRANDO LOS DE LA TABLA DIRECTAMENTE ===================
const tiposUnicos = computed(() => [...new Set(objetos.value.map(o => o.Tipo).filter(Boolean))])
const rarezasUnicas = computed(() => [...new Set(objetos.value.map(o => o.Rareza).filter(Boolean))])



// ========================= PONER FILTROS EN LA URL ===========================
watch([
    filtroTipos,
    filtroRarezas,
    filtroCoste,
    filtroPrecioMin,
    filtroPrecioMax,
    filtroNombre,
    ordenColumna,
    ordenAscendente
], () => {
    const query = {
        tipos: filtroTipos.value.length ? filtroTipos.value.join(',') : undefined,
        rareza: filtroRarezas.value.length ? filtroRarezas.value.join(',') : undefined,
        coste: filtroCoste.value !== null ? filtroCoste.value : undefined,
        precioMin: filtroPrecioMin.value !== null ? filtroPrecioMin.value : undefined,
        precioMax: filtroPrecioMax.value !== null ? filtroPrecioMax.value : undefined,
        nombre: filtroNombre.value || undefined,
        ordenColumna: ordenColumna.value || undefined,
        ordenAscendente: ordenColumna.value ? ordenAscendente.value : undefined
    }
    router.replace({ query })
}, { deep: true })




// =============== LÓGICA DE CAMBIAR ORDENAMIENTO ==================
function ordenarPor(columna) {
    if (ordenColumna.value === columna) {
        ordenAscendente.value = !ordenAscendente.value
    } else {
        ordenColumna.value = columna
        ordenAscendente.value = true
    }
}



// ========================= APLICAR FILTROS A TABLA Y ORDENAR ===========================
const objetosFiltrados = computed(() => {
    let resultado = objetos.value.filter(obj => {
        const coste = obj.Coste ?? null
        const nombre = obj.Nombre.toLowerCase()


        //Expresión lógica infernal        
        return (
            (!filtroTipos.value.length || filtroTipos.value.includes(obj.Tipo)) &&
            (!filtroRarezas.value.length || filtroRarezas.value.includes(obj.Rareza)) &&
            (filtroCoste.value === null || (filtroCoste.value ? coste !== null : coste === null)) &&
            (filtroPrecioMin.value === null || coste >= filtroPrecioMin.value) &&
            (filtroPrecioMax.value === null || coste <= filtroPrecioMax.value) &&
            (!filtroNombre.value || nombre.includes(filtroNombre.value.toLowerCase()))
        )
    })


    //ORDENAR
    if (ordenColumna.value) {
        resultado.sort((a, b) => {
            const aVal = a[ordenColumna.value]
            const bVal = b[ordenColumna.value]

            if (aVal === undefined || aVal === null) return 1
            if (bVal === undefined || bVal === null) return -1

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return ordenAscendente.value ? aVal - bVal : bVal - aVal
            }

            return ordenAscendente.value
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal))
        })
    }

    return resultado
})


</script>


<template>
    <div class="filtros">
        <div>
            <button @click="mostrarFiltros = !mostrarFiltros">
                {{ mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros' }}
            </button>
        </div>

        <div v-if="mostrarFiltros">
            <input v-model="filtroNombre" type="text" placeholder="Buscar por nombre" />

            <div>
                <p>Tipos</p>
                <div>
                    <label v-for="tipo in tiposUnicos" :key="tipo">
                        <input type="checkbox" :value="tipo" v-model="filtroTipos" /> {{ tipo }}
                    </label>
                </div>
            </div>

            <div>
                <p>Rarezas</p>
                <div>
                    <label v-for="rareza in rarezasUnicas" :key="rareza">
                        <input type="checkbox" :value="rareza" v-model="filtroRarezas" /> {{ rareza }}
                    </label>
                </div>
            </div>



            <input type="number" v-model.number="filtroPrecioMin" placeholder="Precio mínimo" />
            <input type="number" v-model.number="filtroPrecioMax" placeholder="Precio máximo" />
        </div>

        <div>
            <button @click="limpiarFiltros">
                Limpiar filtros
            </button>
        </div>


    </div>

    <div class="cuerpo">
        <div class="div-tabla">
            <table class="tabla">
                <thead>
                    <tr>
                        <th @click="ordenarPor('Nombre')">Objeto</th>
                        <th @click="ordenarPor('Tipo')">Tipo</th>
                        <th @click="ordenarPor('Rareza')">Rareza</th>
                        <th @click="ordenarPor('Coste')">Coste</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(objeto, index) in objetosFiltrados" :key="index" @click="seleccionarObjeto(objeto)">
                        <td>{{ objeto.Nombre }}</td>
                        <td>{{ objeto.Tipo }}</td>
                        <td>{{ objeto.Rareza }}</td>
                        <td>{{ objeto.Coste ?? '—' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="objetoSeleccionado" class="seleccionado">
            <h2>{{ objetoSeleccionado.Nombre }}</h2>
            <p><strong>Descripción:</strong> {{ objetoSeleccionado.Descripcion }}</p>
            <p><strong>Tipo:</strong> {{ objetoSeleccionado.Tipo }}</p>
            <p><strong>Rareza:</strong> {{ objetoSeleccionado.Rareza }}</p>
            <p><strong>Coste:</strong> {{ objetoSeleccionado.Coste ?? '—' }}</p>
            <p><strong>Valor material:</strong> {{ objetoSeleccionado.ValorMaterial ?? '—' }}</p>
        </div>
    </div>
</template>

<style scoped>
.cuerpo {
    padding: 40px 5%;
    display: flex;
    justify-content: space-between;

}

.div-tabla {
    max-height: 80vh;
    width: 60%;
    overflow-y: auto;

}

.tabla {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
}

.tabla th,
.tabla td {
    padding: 5px 2px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
}

.tabla thead {
    background-color: #f3f4f6;
    font-weight: 600;
    cursor: pointer;
}

.tabla tbody tr:hover {
    background-color: #f1f5f9;
}

.seleccionado {
    min-width: 250px;
    max-width: 100%;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
}
</style>
