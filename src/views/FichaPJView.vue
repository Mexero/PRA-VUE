<template>
    <div class="character-sheet container">

        <section class="info-basica">
            <div><span class="label">Nombre:</span> <span class="value"></span></div>
            <div><span class="label">Especie:</span> <span class="value"></span></div>
            <div><span class="label">Nivel:</span> <span class="value"></span></div>
            <div><span class="label">Tipos:</span> <span class="value"></span></div>
        </section>
        <div class="principal">
            <section class="stats">
                <div class="item">FUE (+save)</div>
                <div class="item">AGI (+save)</div>
                <div class="item">RES (+save)</div>
                <div class="item">MEN</div>
                <div class="item">ESP (+save)</div>
                <div class="item">PRE</div>
            </section>
            <section class="info-principal">
                <section class="checks">
                    <h3>Tiradas de habilidad</h3>
                    <div class="checks-list">
                        <div class="item"></div>
                        <div class="item"></div>
                        <div class="item"></div>
                        <div class="item"></div>
                        <div class="item"></div>
                        <div class="item"></div>
                    </div>
                </section>
                <section class="destacados">
                    <div class="item">BC</div>
                    <div class="item">CA (Con su cálculo)</div>
                    <div class="item">Iniciativa</div>
                    <div class="item">Vitalidad</div>
                </section>

                <section class="info-dinamica">
                    <h3>Cosas que cambian</h3>
                    <div class="changing-grid">
                        <div class="item">PV/PV MAX</div>
                        <div class="item">Escudo</div>
                        <div class="item">PP / PP MAX</div>
                        <div class="item">Fatiga</div>
                    </div>
                </section>

                <section class="speeds">
                    <h3>Velocidades</h3>
                    <div class="speeds-list">
                        <div class="item"></div>
                        <div class="item"></div>
                        <div class="item"></div>
                        <div class="item"></div>
                        <div class="item"></div>
                        <div class="item"></div>
                    </div>
                </section>

            </section>
        </div>
        <section class="moves">
            <h3>Movimientos</h3>
            <div class="moves-grid">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </section>

        <section class="habsFeats">
            <section class="habilidades">
                <h3>Habilidades</h3>
                <div class="habilidades-list">
                    <div class="item"></div>
                    <div class="item"></div>
                    <div class="item"></div>
                    <div class="item"></div>
                    <div class="item"></div>
                </div>
            </section>

            <section class="feats">
                <h3>Dotes</h3>
                <div class="feats-list">
                    <div class="item"></div>
                    <div class="item"></div>
                    <div class="item"></div>
                    <div class="item"></div>
                    <div class="item"></div>
                </div>
            </section>
        </section>
        <section class="info-secundaria">


            <section class="others">
                <h3>Otros</h3>
                <div class="others-list">
                    <div class="item">Dieta</div>
                    <div class="item">Sexo</div>
                    <div class="item">Sentidos</div>
                    <div class="item"></div>
                </div>
            </section>
        </section>
    </div>






    <!--        <section>
            <h3>Buscar y añadir habilidades</h3>
            <input type="text" placeholder="Buscar habilidad..." v-model="busqueda" />
            <ul>
                <li v-for="hab in habilidadesFiltradas" :key="hab" style="cursor: pointer; user-select: none;"
                    @click="agregarHabilidad(hab)">
                    {{ hab }}
                </li>
            </ul>
        </section>

        <section class="row" v-if="habilidadesSeleccionadas.length">
            <h2>Habilidades Seleccionadas</h2>
            <TiradasHab />
        </section>

        <h2>Salvaciones</h2>
        <textarea v-model="ficha.salvaciones" />

        <h2>Rasgos</h2>
        <textarea v-model="ficha.rasgos" />

        <h2>Dotes</h2>
        <textarea v-model="ficha.dotes" />

        <h2>Escudo / Fatiga</h2>
        <section class="row">
            <div class="field">
                <label>Escudo</label>
                <input type="number" v-model.number="ficha.escudo" />
            </div>
            <div class="field">
                <label>Fatiga</label>
                <input type="number" v-model.number="ficha.fatiga" />
            </div>
        </section>

        <h2>Capacidad de Carga</h2>
        <section class="row">
            <div class="field">
                <label>FUE</label>
                <input type="number" v-model.number="ficha.fue" @input="actualizarCarga" />
            </div>
            <div class="field">
                <label>Carga</label>
                <input type="number" :value="ficha.carga" readonly />
            </div>
        </section>

        <h2>Biografía</h2>
        <textarea v-model="ficha.biografia" />

        <h2>Inventario</h2>
        <textarea v-model="ficha.inventario" />

        <h2>Trasfondo</h2>
        <textarea v-model="ficha.trasfondo" />

        <h2>Acciones y Ataques</h2>
        <section v-for="(atk, i) in ficha.ataques" :key="i" class="row">
            <div class="field" v-for="campo in ['nombre', 'tipo', 'accion', 'dano', 'rango', 'etiquetas']" :key="campo">
                <label>{{ campo }}</label>
                <input v-model="atk[campo]" />
            </div>
        </section>

        <button @click="descargarFicha">Descargar JSON</button>
    </div>-->
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'

//import TiradasHab from '@/components/Fichas/TiradasHabilidadView.vue'



/*
const habilidadesDisponibles = [
    'Acrobacias', 'Actuación', 'Atletismo', 'Combate', 'Empatía', 'Engaño', 'Intimidación',
    'Investigación', 'Juego de Manos', 'Percepción', 'Persuasión', 'Supervivencia', 'Trato Pokémon'
]

const ficha = reactive({
    nombre: '',
    clase: '',
    nivel: 1,
    habilidades: {},
    salvaciones: '',
    rasgos: '',
    dotes: '',
    escudo: 0,
    fatiga: 0,
    fue: 0,
    carga: 0,
    biografia: '',
    inventario: '',
    trasfondo: '',
    ataques: Array.from({ length: 5 }, () => ({
        nombre: '',
        tipo: '',
        accion: '',
        dano: '',
        rango: '',
        etiquetas: ''
    }))
})

// Estado para habilidades seleccionadas
const habilidadesSeleccionadas = reactive([])

// Inicialmente ninguna habilidad seleccionada
// Puedes inicializar así si quieres:
habilidadesSeleccionadas.push('Acrobacias', 'Actuación', 'Atletismo')

// Al añadir una habilidad nueva al formulario, la inicializamos en ficha.habilidades:
const inicializarHabilidad = (hab) => {
    if (!ficha.habilidades[hab]) {
        ficha.habilidades[hab] = { base: 0, gradoBono: 0, total: 0 }
    }
}

// Inicializamos las por defecto
habilidadesSeleccionadas.forEach(inicializarHabilidad)

// Búsqueda para el filtro
const busqueda = ref('')

// Computed para habilidades filtradas (disponibles menos seleccionadas, que contengan el texto)
const habilidadesFiltradas = computed(() => {
    const busq = busqueda.value.toLowerCase()
    return habilidadesDisponibles
        .filter(h => !habilidadesSeleccionadas.includes(h))
        .filter(h => h.toLowerCase().includes(busq))
})

// Función para añadir habilidad
const agregarHabilidad = (hab) => {
    habilidadesSeleccionadas.push(hab)
    inicializarHabilidad(hab)
    actualizarTotal(hab)
}

// Función para quitar habilidad
const quitarHabilidad = (hab) => {
    const idx = habilidadesSeleccionadas.indexOf(hab)
    if (idx !== -1) {
        habilidadesSeleccionadas.splice(idx, 1)
        delete ficha.habilidades[hab]
    }
}

// Actualizar total teniendo en cuenta que bono real = gradoBono * 2
const actualizarTotal = (hab) => {
    const base = ficha.habilidades[hab]?.base || 0
    const grado = ficha.habilidades[hab]?.gradoBono || 0
    ficha.habilidades[hab].total = base + grado * 2
}

// Actualizar carga
const actualizarCarga = () => {
    ficha.carga = 150 + ficha.fue * 50
}

watch(ficha, () => {
    localStorage.setItem('ficha_personaje_vue', JSON.stringify(ficha))
}, { deep: true })

const descargarFicha = () => {
    const blob = new Blob([JSON.stringify(ficha, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ficha_personaje.json'
    a.click()
    URL.revokeObjectURL(url)
}

const cargarFicha = () => {
    const data = localStorage.getItem('ficha_personaje_vue')
    if (data) {
        Object.assign(ficha, JSON.parse(data))
        // Inicializar habilidades seleccionadas desde la ficha
        habilidadesSeleccionadas.splice(0, habilidadesSeleccionadas.length) // limpiar
        Object.keys(ficha.habilidades).forEach(h => habilidadesSeleccionadas.push(h))
        habilidadesSeleccionadas.forEach(actualizarTotal)
        actualizarCarga()
    } else {
        // Si no hay datos, inicializa carga y totales
        habilidadesSeleccionadas.forEach(actualizarTotal)
        actualizarCarga()
    }
}

//Mover habilidades
let dragIndex = null

const dragStart = (index) => {
    dragIndex = index
}

const drop = (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) return
    // Reordenamos habilidadesSeleccionadas
    const dragged = habilidadesSeleccionadas[dragIndex]
    habilidadesSeleccionadas.splice(dragIndex, 1)
    habilidadesSeleccionadas.splice(dropIndex, 0, dragged)
    dragIndex = null
}



cargarFicha()*/
</script>




<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    color: #333;
}

/* Básicos */
.info-basica {
    display: flex;
    gap: 24px;
    justify-content: space-between;
    margin-bottom: 20px;
}

.info-item {
    flex: 1;
    font-size: 1rem;
}

.label {
    font-weight: 600;
    color: #34495e;
}

.value {
    margin-left: 6px;
    color: #555;
}

/* Sección principal */
.principal {
    display: flex;
    gap: 8px;
    height: fit-content;
}

.stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-auto-flow: column;
    gap: 8px;
}

/* PRICIPAL GRID */
.info-principal {
    width: 100%;
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(3, 1fr) 150px;
    grid-template-rows: repeat(1, 1fr);
    grid-template-areas:
        "checks destacados dinam vels";
}

/* Grid areas */
.info-dinamica {
    grid-area: dinam;
}

.checks {
    grid-area: checks;
}

.destacados {
    grid-area: destacados;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 20px;
}

.destacados div {
    width: 70px;
    height: 70px;
}

.speeds {
    grid-area: vels;
}


/* Secciones con títulos */
section {
    margin-bottom: 20px;
}

section h3 {
    font-size: 1.2rem;
    color: #34495e;
    margin-bottom: 10px;
    border-bottom: 2px solid #3498db;
    padding-bottom: 4px;
}



/* Habilidades y Feats */
.habsFeats {
    display: flex;
    gap: 4%;
}

.habilidades,
.feats {
    width: 48%;
}

/* Grillas generales */
.others-list {
    display: grid;
    gap: 10px;
}

.changing-grid {
    grid-template: repeat(2, 1fr) / repeat(2, 1fr);
}

.checks-list,
.speeds-list,
.habilidades-list,
.feats-list {
    display: flex;
    gap: 10px;
    flex-direction: column;
}


.others-list {
    grid-template-columns: repeat(4, 1fr);
}

/* Ítems */
.item {
    background: #ecf0f1;
    border-radius: 6px;
    padding: 8px;
    text-align: center;
    color: #2c3e50;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Base stats */
.base-stats {
    display: flex;
    gap: 16px;
    justify-content: space-around;
    margin-bottom: 20px;
}

.base-item {
    background: #d6eaf8;
    color: #21618c;
    font-weight: 700;
}

/* Movimientos */
.moves-grid {
    background: #d5f5e3;
    border-radius: 8px;
    padding: 12px;
    min-height: 80px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 8px;
    font-weight: 600;
    color: #196f3d;
    text-align: center;
}

.moves-grid div {
    background: #4eb67b;
    border-radius: 8px;
    min-height: 100px;

}
</style>