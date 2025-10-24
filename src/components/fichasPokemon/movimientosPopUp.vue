<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import busquedaMov from './busquedaMov.vue'
import { initDB, queryDB } from '@/services/dbWorkerService'

const props = defineProps([
    'ficha',
    'movimientos',
    'movimientosCompletos',
    'movimientosCargados'
])

const emit = defineEmits(['update:movimientosCompletos'])

const isOpen = ref(false)
const añadirExtra = ref(false)
const movimientoSeleccionado = ref(null)
const tipoLista = ref('Nivel')
const filtrosAbiertos = ref(false)
const tipoDropdownAbierto = ref(false)
const etiquetaDropdownAbierto = ref(false)
const costeDropdownAbierto = ref(false)

//flags DB
const isReady = ref(false)
const error = ref(null)
const loading = ref(false)


//check DB abierta al entrar
onMounted(async () => {
    try {
        await initDB()
        isReady.value = true
    } catch (err) {
        error.value = err.message || 'Error inicializando DB'
        console.warn(error.value)
    }

    // Cerrar dropdowns al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown')) {
            tipoDropdownAbierto.value = false
            etiquetaDropdownAbierto.value = false
            costeDropdownAbierto.value = false
        }
    })
})

//Abrir y cerrar pop up
function togglePopup() {
    isOpen.value = !isOpen.value
}

function closePopup() {
    isOpen.value = false
    movimientoSeleccionado.value = null
}

// Prevenir scroll del body cuando el modal está abierto
watch(isOpen, (newValue) => {
    if (newValue) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})


const formatearStats = (stats) => {
    if (!stats || stats.length === 0) return '';
    if (stats.length === 1) return stats[0];
    if (stats.length === 2) return `${stats[0]} y ${stats[1]}`;
    return `${stats.slice(0, -1).join(', ')} y ${stats[stats.length - 1]}`;
};

//Al abrir, se carga todo
watch(() => [
    props.movimientosCargados,
    props.ficha.personaliz.movimientosAprendidos,
    props.ficha.personaliz.movimientosExtra
],
    async () => {
        if (props.movimientosCargados) {
            for (const mov of props.ficha.personaliz.movimientosAprendidos) {
                cargarMovimiento(mov, 'directo')
            }
            for (const mov of props.ficha.personaliz.movimientosExtra) {
                cargarMovimiento(mov, 'directo')
            }
        }
    },
    { deep: true }
)


//Cargar movimiento
async function cargarMovimiento(movimiento, directo) {
    if (!props.movimientosCargados || !movimiento || !props.movimientos.find(mov => mov.nombre === movimiento) || !isReady.value) return;

    if (!directo && props.movimientosCompletos.find(mov => mov.nombre === movimiento)) {
        movimientoSeleccionado.value = props.movimientosCompletos.find(mov => mov.nombre === movimiento);
        return;
    }

    loading.value = true
    error.value = null

    let data = []
    try {
        const res = await queryDB(`SELECT 
                Nombre, Tipo, Tiempo_de_uso, Coste, Dano, Rango, Etiquetas, Descripcion, 
                Stat_Asociado_1, Stat_Asociado_2, Stat_Asociado_3, Stat_Asociado_4,
                At, Salvacion, DC
            FROM movimientos
            WHERE Nombre = ?
        `,
            [movimiento]
        )
        const row = res?.[0]?.values?.[0]
        if (row) {
            data = {
                nombre: row[0],
                tipo: row[1],
                accion: row[2],
                coste: row[3],
                danno: row[4] !== "" ? row[4] : null,
                rango: row[5] !== "" ? row[5] : null,
                etiquetas: row[6] !== "" ? row[6] : null,
                descripcion: row[7].split('\n'),
                statsAso: [row[8], row[9], row[10], row[11]].filter(stat => stat !== ""),
                ataque: (!row[12] || row[12] === 'False') ? false : true,
                salvacion: row[13],
                dificultad: row[14]
            }
            if (!directo) {
                movimientoSeleccionado.value = data;
            }
            else if (directo && !props.movimientosCompletos.find(mov => mov.nombre === data.nombre)) {
                const nuevosMovimientos = [...props.movimientosCompletos, data];
                emit('update:movimientosCompletos', nuevosMovimientos);
            }
        }
    } catch (err) {
        error.value = err.message || 'Error cargando el Movimiento ' + movimiento
        console.warn(error.value)
    } finally {
        loading.value = false
    }
}

function añadirMovimiento() {
    const final = movimientoSeleccionado.value
    if (!final || !props.movimientosCargados) return

    if (!props.movimientosCompletos.find(mov => mov.nombre === final.nombre)) {
        const nuevosMovimientos = [...props.movimientosCompletos, final];
        emit('update:movimientosCompletos', nuevosMovimientos);
    }

    if (!añadirExtra.value && !props.ficha.personaliz.movimientosAprendidos.includes(final.nombre)) {
        props.ficha.personaliz.movimientosAprendidos.push(final.nombre)
    }

    else if (añadirExtra.value && !props.ficha.personaliz.movimientosExtra.includes(final.nombre)) {
        props.ficha.personaliz.movimientosExtra.push(final.nombre)
    }

    movimientoSeleccionado.value = null
}


//Filtrar
const filtroNombre = ref('')
const filtroTipo = ref('')
const filtroEtiqueta = ref('')
const filtroCoste = ref('')

const tipos = ["Acero", "Agua", "Bicho", "Dragón", "Eléctrico", "Fantasma", "Fuego", "Hada", "Hielo", "Lucha", "Normal", "Planta", "Psíquico", "Roca", "Siniestro", "Tierra", "Veneno", "Volador"];
const etiquetas = ["Escudo", "Por Tierra", "Potenciación", "Sonido", "Restauración", "Terreno", "Polvo", "Puño", "Mordisco", "Patada", "Explosión", "Retroceso", "Bala", "Campo", "Clima", "Danza", "Golpea varias veces", "Golpea 2 veces", "Golpea 3 veces"]


function parsePP(coste) {
    if (!coste) return null;
    if (typeof coste === 'string' && coste.toLowerCase().includes('variable')) {
        return 'Variable';
    }
    if (typeof coste === 'string' && coste.toLowerCase().includes('a voluntad')) {
        return 'A voluntad';
    }
    const match = coste.match(/\d+/);
    return match ? match[0] : null;
}

const filtrados = computed(() => {
    if (tipoLista.value === 'Nivel') {
        return props.movimientos.filter(mov =>
            props.ficha.pokedex.movimientosNivel.some(entry =>
                entry.nombre === mov.nombre && filtrar(mov)
            )
        );
    }
    return props.movimientos.filter((mov) => filtrar(mov));
})

function filtrar(mov) {
    if (!mov) return
    const coste = parsePP(mov.coste);
    const etiquetas = mov.etiquetas ? mov.etiquetas.toLowerCase() : ''

    return (
        (['Todos', 'Nivel'].includes(tipoLista.value) || props.ficha.pokedex.movimientosEnseñables.find(movE => movE.toLowerCase() === mov.nombre.toLowerCase())) &&
        (!filtroTipo.value || filtroTipo.value.toLowerCase() === mov.tipo.toLowerCase()) &&
        (!filtroEtiqueta.value || etiquetas.toLowerCase().includes(filtroEtiqueta.value.toLowerCase())) &&
        (!filtroCoste.value || coste == filtroCoste.value || coste === "Variable") &&
        (!filtroNombre.value || mov.nombre.toLowerCase().includes(filtroNombre.value.toLowerCase()))
    );
}

// Limpia filtros
function limpiarFiltros() {
    filtroNombre.value = '';
    filtroTipo.value = '';
    filtroEtiqueta.value = '';
    filtroCoste.value = '';
}

// Funciones para dropdowns personalizados
function toggleTipoDropdown() {
    tipoDropdownAbierto.value = !tipoDropdownAbierto.value
    etiquetaDropdownAbierto.value = false
    costeDropdownAbierto.value = false
}

function toggleEtiquetaDropdown() {
    etiquetaDropdownAbierto.value = !etiquetaDropdownAbierto.value
    tipoDropdownAbierto.value = false
    costeDropdownAbierto.value = false
}

function toggleCosteDropdown() {
    costeDropdownAbierto.value = !costeDropdownAbierto.value
    tipoDropdownAbierto.value = false
    etiquetaDropdownAbierto.value = false
}

// Posicionamiento CSS: los menús se anclan al contenedor con position:absolute

function seleccionarTipo(tipo) {
    filtroTipo.value = tipo
    tipoDropdownAbierto.value = false
}

function seleccionarEtiqueta(etiqueta) {
    filtroEtiqueta.value = etiqueta
    etiquetaDropdownAbierto.value = false
}

function seleccionarCoste(coste) {
    filtroCoste.value = coste
    costeDropdownAbierto.value = false
}

//Apoyo lista por nivel
const nivelesConMovs = computed(() => {
    const encontrados = props.ficha.pokedex.movimientosNivel.filter(mov =>
        filtrados.value.some(f => f.nombre === mov.nombre))
    const niveles = encontrados
        .map(mov => mov.nivel)
        .filter(nivel => nivel !== undefined && nivel !== null)
        .filter(nivel => nivel === 1 || (nivel >= 2 && nivel <= 20 && nivel % 2 === 0))

    const nivelesUnicos = [...new Set(niveles)]
    nivelesUnicos.sort((a, b) => a - b)

    return nivelesUnicos
})


function buscarNivel(mov) {
    const encontrado = props.ficha.pokedex.movimientosNivel.find(m => m.nombre === mov)
    if (!encontrado) return -1
    return encontrado.nivel;
}

function filtradosNivel(nivel) {
    const encontrados = props.ficha.pokedex.movimientosNivel.filter(mov =>
        filtrados.value.some(f => f.nombre === mov.nombre))
    return encontrados.filter(mov => mov.nivel === nivel)
}

function comprobar(mov) {
    return filtrar(props.movimientos.find(movimiento => movimiento.nombre.toLowerCase() === mov.trim().toLowerCase()))
}

function checkDisabled() {
    return (!añadirExtra.value && props.ficha.derivados.cantidadMovs <= props.ficha.personaliz.movimientosAprendidos.length) ||
        (tipoLista.value === 'Nivel' && movimientoSeleccionado.value && (buscarNivel(movimientoSeleccionado.value.nombre) === -1 || buscarNivel(movimientoSeleccionado.value.nombre) > props.ficha.nivel))

}

</script>

<template>
    <div>
        <button @click="togglePopup" class="btn">
            Añadir movimiento
        </button>

        <div v-if="isOpen" class="modal-overlay" @click="closePopup">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h2 class="modal-title">Añadir Movimiento {{ añadirExtra ? 'Extra' : '' }}</h2>
                    <button @click="closePopup" class="close-btn">×</button>
                </div>

                <div class="modal-body">
                    <div class="filters-section">
                        <div class="filters-header">
                            <div class="filters-row-1">
                                <div class="search-bar">
                                    <input v-model="filtroNombre" placeholder="Buscar movimiento..."
                                        @keydown.enter.prevent="filtrados.length && cargarMovimiento(filtrados[0].nombre)"
                                        class="search-input" />
                                </div>

                                <button class="filters-toggle-btn" @click="filtrosAbiertos = !filtrosAbiertos">
                                    <span>Filtros</span>
                                    <span class="toggle-icon" :class="{ 'open': filtrosAbiertos }">▼</span>
                                </button>
                            </div>

                            <div class="filters-row-2">
                                <div class="extra-toggle">
                                    <button class="extra-toggle-btn" :class="{ 'active': añadirExtra }"
                                        @click="añadirExtra = !añadirExtra">
                                        Extra
                                    </button>
                                </div>

                                <div class="list-type-selector">
                                    <div class="tab-option" :class="{ 'active': tipoLista === 'Nivel' }"
                                        @click="tipoLista = 'Nivel'">
                                        Nivel
                                    </div>
                                    <div class="tab-option" :class="{ 'active': tipoLista === 'Ensennables' }"
                                        @click="tipoLista = 'Ensennables'">
                                        Enseñables
                                    </div>
                                    <div class="tab-option" :class="{ 'active': tipoLista === 'Todos' }"
                                        @click="tipoLista = 'Todos'">
                                        Todos
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="filters-dropdown" :class="{ 'open': filtrosAbiertos }">
                            <div class="filters-grid">
                                <div class="filter-group">
                                    <label class="filter-label">Tipo:</label>
                                    <div class="custom-dropdown">
                                        <button class="dropdown-button" @click="toggleTipoDropdown">
                                            <span>{{ filtroTipo || 'Todos los Tipos' }}</span>
                                            <span class="dropdown-arrow"
                                                :class="{ 'open': tipoDropdownAbierto }">▼</span>
                                        </button>
                                        <div class="dropdown-menu" :class="{ 'open': tipoDropdownAbierto }">
                                            <div class="dropdown-item" @click="seleccionarTipo('')">Todos los Tipos
                                            </div>
                                            <div class="dropdown-item" v-for="tipo of tipos" :key="tipo"
                                                @click="seleccionarTipo(tipo)">
                                                {{ tipo }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="filter-group">
                                    <label class="filter-label">Etiqueta:</label>
                                    <div class="custom-dropdown">
                                        <button class="dropdown-button" @click="toggleEtiquetaDropdown">
                                            <span>{{ filtroEtiqueta || 'Todas las Etiquetas' }}</span>
                                            <span class="dropdown-arrow"
                                                :class="{ 'open': etiquetaDropdownAbierto }">▼</span>
                                        </button>
                                        <div class="dropdown-menu" :class="{ 'open': etiquetaDropdownAbierto }">
                                            <div class="dropdown-item" @click="seleccionarEtiqueta('')">Todas las
                                                Etiquetas</div>
                                            <div class="dropdown-item" v-for="et of etiquetas" :key="et"
                                                @click="seleccionarEtiqueta(et)">
                                                {{ et }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="filter-group">
                                    <label class="filter-label">Coste:</label>
                                    <div class="custom-dropdown">
                                        <button class="dropdown-button" @click="toggleCosteDropdown">
                                            <span>{{ filtroCoste || 'Cualquier coste' }}</span>
                                            <span class="dropdown-arrow"
                                                :class="{ 'open': costeDropdownAbierto }">▼</span>
                                        </button>
                                        <div class="dropdown-menu" :class="{ 'open': costeDropdownAbierto }">
                                            <div class="dropdown-item" @click="seleccionarCoste('')">Cualquier coste
                                            </div>
                                            <div class="dropdown-item" @click="seleccionarCoste('A voluntad')">A
                                                voluntad</div>
                                            <div class="dropdown-item" @click="seleccionarCoste('1')">1 PP</div>
                                            <div class="dropdown-item" @click="seleccionarCoste('2')">2 PP</div>
                                            <div class="dropdown-item" @click="seleccionarCoste('3')">3 PP</div>
                                            <div class="dropdown-item" @click="seleccionarCoste('4')">4 PP</div>
                                            <div class="dropdown-item" @click="seleccionarCoste('6')">6 PP</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="filter-actions">
                                    <button class="reset-filters-btn" @click="limpiarFiltros">Limpiar filtros</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="content-section">
                        <div class="search-panel">
                            <template v-if="tipoLista === 'Nivel'">
                                <div class="movs-list">
                                    <template v-for="nivel of nivelesConMovs" :key="nivel">
                                        <div class="nivel-group" :class="nivel > ficha.nivel ? 'demasiado' : ''">
                                            <h3 class="nivel-title">Nivel {{ nivel }}</h3>
                                            <div class="movs-grid">
                                                <template v-for="mov of filtradosNivel(nivel)" :key="mov.nombre">
                                                    <div v-if="comprobar(mov.nombre)"
                                                        @click="cargarMovimiento(mov.nombre)" class="mov-item">
                                                        {{ mov.nombre.trim() }}
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </template>
                            <busquedaMov v-else :movimientos="filtrados" :seleccionado="movimientoSeleccionado?.nombre"
                                @seleccion="cargarMovimiento" />
                        </div>

                        <div class="info-panel">
                            <template v-if="movimientoSeleccionado">
                                <div class="movimiento-header">
                                    <h3 class="movimiento-nombre">{{ movimientoSeleccionado.nombre }}</h3>
                                </div>
                                <div class="movimiento-info-container">
                                    <div class="movimiento-info">
                                        <div class="info-grid">
                                            <p><strong>Tipo: </strong>{{ movimientoSeleccionado.tipo }}</p>
                                            <p><strong>Coste: </strong>{{ movimientoSeleccionado.coste }}</p>
                                        </div>
                                        <div class="info-grid">
                                            <p><strong>Acción: </strong>{{ movimientoSeleccionado.accion }}</p>
                                            <p><strong>Rango: </strong>{{ movimientoSeleccionado.rango }}</p>
                                        </div>
                                        <p v-if="movimientoSeleccionado.danno"><strong>Daño: </strong>{{
                                            movimientoSeleccionado.danno }}</p>
                                        <p v-if="movimientoSeleccionado.etiquetas"><strong>Etiquetas: </strong>{{
                                            movimientoSeleccionado.etiquetas }}</p>
                                        <div v-if="movimientoSeleccionado.statsAso">
                                            <strong>Estadísticas asociadas: </strong> {{
                                                formatearStats(movimientoSeleccionado.statsAso) }}.
                                        </div>
                                        <div class="descripcion">
                                            <p class="tituloDesc"><strong>Descripción:</strong></p>
                                            <p v-for="(parrafo, index) in movimientoSeleccionado.descripcion"
                                                :key="index" v-html="parrafo"></p>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="empty-state">
                                    <p>Selecciona un movimiento para ver su información</p>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                   
                    <button @click="closePopup" class="cancel-btn">Cerrar</button>
                    <button @click="añadirMovimiento" class="add-btn" :disabled="checkDisabled()">
                        Añadir Movimiento
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.btn {
    margin: 5px 0;
    padding: 8px 10px;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.btn:hover {
    background-color: var(--color-principal2);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-content {
    background-color: var(--color-fondoTexto);
    width: 90vw;
    max-width: 1000px;
    height: 80vh;
    border-radius: 8px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 15px;
    background: linear-gradient(135deg, var(--color-principal2), var(--color-principal1));
    border-bottom: 2px solid var(--color-principal1);
}

.modal-title {
    margin: 0;
    font-size: 1.4rem;
    color: var(--color-texto);
    letter-spacing: 0.5px;
}

.close-btn {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-texto);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

    .modal-body {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1;
        min-height: 0;
    }

    .filters-section {
        flex-shrink: 0;
        background: var(--color-fondoTexto);
        border-bottom: 2px solid var(--color-principal2);
        position: relative;
        z-index: 1000;
    }

.filters-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 20px;
}

.filters-row-1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}

.filters-row-2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}

.search-bar {
    
    min-width: 200px;
}

.filters-toggle-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
}

.filters-toggle-btn:hover {
    background-color: var(--color-principal2);
}

.toggle-icon {
    transition: transform 0.2s ease;
    font-size: 12px;
}

.toggle-icon.open {
    transform: rotate(180deg);
}

.extra-toggle {
    flex-shrink: 0;
}

.extra-toggle-btn {
    padding: 8px 10px;
    background-color: var(--color-fondoTexto);
    color: var(--color-texto);
    border: 2px solid var(--color-principal2);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
}

.extra-toggle-btn:hover {
    background-color: var(--color-principal2);
    border-color: var(--color-principal1);
}

.extra-toggle-btn.active {
    background-color: var(--color-principal1);
    color: var(--color-texto);
    border-color: var(--color-principal1);
}

.extra-toggle-btn.active:hover {
    background-color: var(--color-principal2);
}

.list-type-selector {
    display: flex;
    gap: 0;
    align-items: center;
}

.tab-option {
    padding: 8px 16px;
    cursor: pointer;

    color: var(--color-texto);
    font-size: 14px;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
    position: relative;
}

.tab-option:hover {
    background-color: var(--color-principal2);
    color: var(--color-texto);
}

.tab-option.active {
    color: var(--color-secundario);
    border-bottom-color: var(--color-principal1);
    background-color: rgba(var(--color-principal1-rgb, 0, 0, 0), 0.1);
}

.search-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--color-principal2);
    background-color: var(--color-fondoTexto);
    color: var(--color-texto);
    font-size: 14px;
    border-radius: 4px;
}

.search-input:focus {
    outline: none;
    border-color: var(--color-principal1);
}

.filters-dropdown {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    background: var(--color-fondoTexto);
    border: 1px solid var(--color-principal2);
    border-radius: 0 0 4px 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1001;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
}

.filters-dropdown.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.filters-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: 16px;
    padding: 20px;
    align-items: end;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.filter-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-texto);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.custom-dropdown {
    position: relative;
    width: 100%;
}

.dropdown-button {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--color-principal2);
    background-color: var(--color-fondoTexto);
    color: var(--color-texto);
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
}

.dropdown-button:hover {
    border-color: var(--color-principal1);
}

.dropdown-arrow {
    transition: transform 0.2s ease;
    font-size: 12px;
}

.dropdown-arrow.open {
    transform: rotate(180deg);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--color-fondoTexto);
    border: 1px solid var(--color-principal2);
    border-radius: 4px;
    max-height: 150px;
    overflow-y: auto;
    z-index: 10000;
    display: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dropdown-menu.open {
    display: block;
}

.dropdown-item {
    padding: 8px 12px;
    cursor: pointer;
    color: var(--color-texto);
    font-size: 14px;
    border-bottom: 1px solid var(--color-principal2);
}

.dropdown-item:last-child {
    border-bottom: none;
}

.dropdown-item:hover {
    background-color: var(--color-principal2);
}

.dropdown-menu::-webkit-scrollbar {
    width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
    background: var(--color-principal2);
    border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb {
    background: var(--color-principal1);
    border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
    background: var(--color-principal2);
}

.filter-actions {
    display: flex;
    align-items: end;
    justify-content: flex-end;
}

.reset-filters-btn {
    padding: 6px 12px;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
}

.reset-filters-btn:hover {
    background-color: var(--color-principal2);
}

.content-section {
    display: flex;
    overflow: hidden;
}

.search-panel {
    flex: 0 0 45%;
    display: flex;
    flex-direction: column;
    border-right: 2px solid var(--color-principal2);
    overflow: hidden;
}

    .movs-list {
        overflow-y: auto;
        padding: 6px;
        flex: 1;
        min-height: 0;
    }

.nivel-group {
    margin-bottom: 16px;
}

.nivel-group.demasiado {
    opacity: 0.6;
}

.nivel-title {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: var(--color-texto);
    border-bottom: 2px solid var(--color-principal2);
    padding-bottom: 4px;
}

.movs-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
}

.mov-item {
    padding: 8px 12px;
    background-color: var(--color-fondoTexto);
    border: 1px solid var(--color-principal2);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    color: var(--color-texto);
    transition: all 0.2s ease;
}

.mov-item:hover {
    background-color: var(--color-principal2);
    border-color: var(--color-principal1);
}

.info-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--color-fondoTexto);
}

.movimiento-header {
    flex-shrink: 0;
    padding: 8px 12px 0 12px;
    border-bottom: 2px solid var(--color-principal2);
    background: var(--color-fondoTexto);
}

.movimiento-nombre {
    margin-bottom: 10px;
    font-size: 20px;
    color: var(--color-texto);
    letter-spacing: 0.5px;
}

.movimiento-info-container {
    overflow-y: auto;
    min-height: 0;
    padding: 10px;
}

.movimiento-info {
    line-height: 1.6;
    color: var(--color-texto);
}

.movimiento-info p {
    margin: 0 0 8px 0;
    font-size: 14px;
}

.movimiento-info p:last-child {
    margin-bottom: 0;
}

.descripcion {
    margin-top: 16px;
}

.tituloDesc {
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--color-texto);
}

.descripcion p {
    margin: 0 0 8px 0;
    font-size: 14px;
    line-height: 1.5;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    
    text-align: center;
    color: var(--color-texto);
    opacity: 0.7;
    padding: 20px;
}

.empty-state p {
    margin: 0;
    font-size: 16px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 20px;
    background: var(--color-fondoTexto);
    border-top: 2px solid var(--color-principal2);
}

.add-btn {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
}

.add-btn:hover:not(:disabled) {
    background-color: #3e9442;
}

.add-btn:disabled {
    background-color: #9e9e9e !important;
    cursor: not-allowed;
}

.cancel-btn {
    background-color: var(--color-principal1);
    color: var(--color-texto);
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.cancel-btn:hover {
    background-color: var(--color-principal2);
}

@media screen and (max-width: 768px) {
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100dvh;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        width: 100vw;
        height: 100dvh;
        border-radius: 0;
        display: flex;
        flex-direction: column;
    }

    .modal-header {
        padding: 5px 10px;
    }

    .modal-title {
        font-size: 16px;
    }

    .filters-header {
        padding: 12px 10px;
    }

    .filters-row-1 {
        align-items: stretch;
        gap: 10px;
    }

    .filters-row-2 {
        align-items: stretch;
        gap: 8px;
    }

    .list-type-selector {
        justify-content: center;
        gap: 0;
        flex-wrap: wrap;
    }

    .tab-option {
        text-align: center;
        min-width: fit-content;
    }

    .filters-grid {
        grid-template-columns: 1fr;
        gap: 12px;
        padding: 16px;
    }

    .filter-select {
        max-height: 100px;
    }

    .content-section {
        flex-direction: column;
        gap: 4px;
    }

    .search-panel {
       flex: 1;
        border-right: none;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .info-panel {
        height: 300px;
        order: -1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border-bottom: 2px solid var(--color-principal2);
    }

    .movimiento-header {
        padding: 10px 10px 0 10px;
    }

    .movimiento-info-container {
        padding: 10px;
        flex: 1;
        overflow-y: auto;
        min-height: 0;
    }

    .modal-footer {
        padding: 8px 16px;
        flex-shrink: 0;
        background: var(--color-fondoTexto);
        border-top: 2px solid var(--color-principal2);
    }

    .add-btn,
    .cancel-btn {
        width: 100%;
        padding: 8px 16px;
        font-size: 14px;
    }
}

@media screen and (max-width: 480px) {
    .modal-overlay {
        height: 100dvh;
    }

    .modal-content {
        width: 100vw;
        height: 100dvh;
        border-radius: 0;
        display: flex;
        flex-direction: column;
    }

    .modal-body {
        flex: 1;
        overflow: hidden;
    }

    .search-panel {
        height: 25vh;
        min-height: 120px;
    }

    .info-panel {
        height: 25vh;
        min-height: 120px;
    }

    .filters-row {
        gap: 8px;
    }
}
</style>
