<script setup>
import { ref, watch, computed } from 'vue'
import busquedaMov from './busquedaMov.vue'

import worker from '../../sqlWorker.js';

const props = defineProps([
    'ficha',
    'movimientos',
    'movimientosCompletos',
    'movimientosCargados'
])

const isOpen = ref(false)
const añadirExtra = ref(false)
const movimientoSeleccionado = ref(null)
const tipoLista = ref('Nivel')

function togglePopup() {
    isOpen.value = !isOpen.value
}

function closePopup() {
    isOpen.value = false
    movimientoSeleccionado.value = null
}


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
function cargarMovimiento(movimiento, directo) {
    if (!props.movimientosCargados || !movimiento || !props.movimientos.find(mov => mov.nombre === movimiento)) return;

    if (!directo && props.movimientosCompletos.find(mov => mov.nombre === movimiento)) {
        movimientoSeleccionado.value = props.movimientosCompletos.find(mov => mov.nombre === movimiento);
        return;
    }

    worker.postMessage({
        type: 'query',
        query: `
            SELECT 
                Nombre, Tipo, Tiempo_de_uso, Coste, Dano, Rango, Etiquetas, Descripcion, 
                Stat_Asociado_1, Stat_Asociado_2, Stat_Asociado_3, Stat_Asociado_4,
                At, Salvacion, DC
            FROM movimientos
            WHERE Nombre = ?
        `,
        params: [movimiento],
        origin: "cargarMovimiento" + (directo ? 'Directo' : '')
    });
}

worker.addEventListener("message", (event) => {
    if (event.data.type === 'result' && event.data.origin === 'cargarMovimiento' ||
        (event.data.origin === 'cargarMovimientoDirecto')) {
        const row = event.data.result?.[0]?.values?.[0];
        let resultado;
        if (row) {
            resultado = {
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
                dc: row[14]
            };
            if (event.data.origin === 'cargarMovimiento') {
                movimientoSeleccionado.value = resultado;
            }
            else if (event.data.origin === 'cargarMovimientoDirecto' && !props.movimientosCompletos.find(mov => mov.nombre === resultado.nombre)) {
                props.movimientosCompletos.push(resultado);
            }
        }
    }
    if (event.data.type === 'error') {
        console.error("Error al seleccionar movimiento:", event.data.error);
    }
})

function añadirMovimiento() {
    const final = movimientoSeleccionado.value
    if (!final || !props.movimientosCargados) return

    if (!props.movimientosCompletos.find(mov => mov.nombre === final.nombre)) {
        props.movimientosCompletos.push(final)
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
    if (tipoLista.value === 'Nivel') return []
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

//Apoyo lista por nivel
function buscarNivel(mov) {
    return 2 * props.ficha.pokedex.movimientosNivel.findIndex(entry => {
        const movs = entry.split(',').map(m => m.trim());
        return movs.includes(mov);
    });
}

function UnMovFiltrado(movs) {
    const MOVS = movs.map(mov => mov.trim())
    const movsCompletos = props.movimientos.filter(m =>
        MOVS.find(nom => nom.trim() === m.nombre)
    );
    return movsCompletos.some(filtrar);
}

function comprobar(mov) {
    return filtrar(props.movimientos.find(movimiento => movimiento.nombre.toLowerCase() === mov.trim().toLowerCase()))
}

</script>

<template>
    <div>
        <button @click="togglePopup" class="btn">
            Añadir movimiento
        </button>

        <div v-if="isOpen" class="modal-overlay" @click="closePopup">
            <div class="modal-content" @click.stop>
                <label>
                    ¿Extra? <input type="checkbox" v-model="añadirExtra" />
                </label>
                <div>
                    <input v-model="filtroNombre" placeholder="Buscar movimiento..."
                        @keydown.enter.prevent="cargarMovimiento(filtrados[0].nombre)" />
                    <label>
                        <strong>Tipo: </strong>
                        <select v-model="filtroTipo">
                            <option value="">Todos los Tipos</option>
                            <option v-for="tipo of tipos" :value="tipo">{{ tipo }}</option>
                        </select>
                    </label>
                    <label>
                        <strong>Etiqueta: </strong>
                        <select v-model="filtroEtiqueta">
                            <option value="">Todas las Etiquetas</option>
                            <option v-for="et of etiquetas" :value="et">{{ et }}</option>
                        </select>
                    </label>
                    <label>
                        <strong>Coste: </strong>
                        <select v-model="filtroCoste">
                            <option value="">Cualquier coste</option>
                            <option value="A voluntad">A voluntad</option>
                            <option value="1">1 PP</option>
                            <option value="2">2 PP</option>
                            <option value="3">3 PP</option>
                            <option value="4">4 PP</option>
                            <option value="6">6 PP</option>
                        </select>
                    </label>

                    <button class="resetFiltros" @click="limpiarFiltros"> Limpiar filtros</button>
                </div>
                <div>
                    <div>
                        <label> <strong>Por nivel</strong> <input type="radio" v-model="tipoLista" name="lista"
                                value="Nivel"></label>
                        <label> <strong>Enseñables</strong> <input type="radio" v-model="tipoLista" name="lista"
                                value="Ensennables"></label>
                        <label> <strong>Todos</strong> <input type="radio" v-model="tipoLista" name="lista"
                                value="Todos"></label>
                    </div>
                </div>

                <div class="ventana">
                    <div class="cuerpo">

                        <template v-if="tipoLista === 'Nivel'">
                            <ul>
                                <template v-for="(movs, i) of ficha.pokedex.movimientosNivel">
                                    <li v-if="UnMovFiltrado(movs.split(', '))"
                                        :class="2 * i > ficha.nivel ? 'demasiado' : ''">
                                        <!--v-if="UnMovFiltrado(movs.split(', '))-->

                                        <h5>Nivel {{ i === 0 ? 1 : 2 * i }}</h5>
                                        <ul>
                                            <template v-for="mov of movs.split(', ')">
                                                <li v-if="comprobar(mov)" @click="cargarMovimiento(mov)">
                                                    {{ mov.trim() }}</li>
                                            </template>
                                        </ul>
                                    </li>
                                </template>
                            </ul>
                        </template>
                        <busquedaMov v-else :movimientos="filtrados" @seleccion="cargarMovimiento" />

                        <div class="preview">
                            <template v-if="movimientoSeleccionado">
                                <div class="tarjetaMov">
                                    <p><strong>{{ movimientoSeleccionado.nombre }}</strong></p>
                                    <p><strong>Tipo: </strong>{{ movimientoSeleccionado.tipo }}</p>
                                    <p><strong>Acción: </strong>{{ movimientoSeleccionado.accion }}</p>
                                    <p><strong>Coste: </strong>{{ movimientoSeleccionado.coste }}</p>
                                    <p><strong>Rango: </strong>{{ movimientoSeleccionado.rango }}</p>
                                    <p v-if="movimientoSeleccionado.danno"><strong>Daño: </strong>{{
                                        movimientoSeleccionado.danno }}</p>
                                    <p v-if="movimientoSeleccionado.etiquetas"><strong>Etiquetas: </strong>{{
                                        movimientoSeleccionado.etiquetas }}</p>
                                    <div class="descripcion">
                                        <p class="tituloDesc"><strong>Descripción:</strong></p>
                                        <p v-for="parrafo in movimientoSeleccionado.descripcion" v-html="parrafo"></p>
                                    </div>
                                    <div v-if="movimientoSeleccionado.statsAso"><strong>Estadísticas asociadas:
                                        </strong> {{ formatearStats(movimientoSeleccionado.statsAso) }}.
                                    </div>
                                </div>
                                <button @click="añadirMovimiento" :disabled="(!añadirExtra && ficha.derivados.cantidadMovs <= ficha.personaliz.movimientosAprendidos.length) ||
                                    (tipoLista === 'Nivel' && buscarNivel(movimientoSeleccionado.nombre) !== -1 && buscarNivel(movimientoSeleccionado.nombre) > ficha.nivel)

                                    ">Añadir</button>
                            </template>
                            <template v-else>
                                <span>Selecciona un movimiento</span>
                            </template>
                        </div>
                    </div>
                </div>

                <button @click="closePopup" class="close-btn">Cerrar</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn {
    padding: 10px 16px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.tarjetaMov {
    font-size: 10px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-content {
    background: white;
    width: 75vw;
    height: 75vh;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.ventana {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    overflow: hidden;
}

.cuerpo {
    display: flex;
    gap: 16px;
    height: 100%;
}

.preview {
    width: 200px;
    background: #f9f9f9;
    border: 1px solid #bbb;
    border-radius: 6px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
}

.preview button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    align-self: flex-end;
}

.preview button:hover {
    background-color: #3e9442;
}

.preview button[disabled] {
    background-color: red !important;
}

.close-btn {
    margin-top: 20px;
    padding: 8px 12px;
    background-color: #e11d48;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.demasiado {
    background-color: lightblue;
}
</style>
