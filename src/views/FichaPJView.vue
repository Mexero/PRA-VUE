<template>
    <div class="character-sheet container">
        <div class="toolbar">
            <select v-model="fichaSeleccionada">
                <option v-for="key in Object.keys(fichasGuardadas)" :key="key" :value="key">{{ key }}</option>
            </select>
            <input v-model="nuevaFichaNombre" placeholder="Nombre nueva ficha" />
            <button @click="crearFicha">Crear</button>
            <button @click="borrarFicha">Borrar</button>
            <button @click="exportarFicha">Exportar</button>
            <input type="file" accept="application/json" @change="importarFicha" />
        </div>
        <section class="info-basica">
            <div>
                <span class="label">Nombre:</span>
                <input v-model="ficha.nombre" />
            </div>
            <div>
                <span class="label">Especie:</span>
                <input v-model="ficha.especie" />
            </div>
            <div>
                <span class="label">Nivel:</span>
                <input type="number" v-model.number="ficha.nivel" />
            </div>
            <div>
                <span class="label">Tipos:</span>
                <input v-model="ficha.tipos" />
            </div>
        </section>

        <div class="principal">
            <section class="stats">
                <div class="item">
                    FUE: <input type="number" v-model.number="ficha.stats.fue" /> (+<input type="number"
                        v-model.number="ficha.salvaciones.fue" />)
                </div>
                <div class="item">
                    AGI: <input type="number" v-model.number="ficha.stats.agi" /> (+<input type="number"
                        v-model.number="ficha.salvaciones.agi" />)
                </div>
                <div class="item">
                    RES: <input type="number" v-model.number="ficha.stats.res" /> (+<input type="number"
                        v-model.number="ficha.salvaciones.res" />)
                </div>
                <div class="item">
                    MEN: <input type="number" v-model.number="ficha.stats.men" />
                </div>
                <div class="item">
                    ESP: <input type="number" v-model.number="ficha.stats.esp" /> (+<input type="number"
                        v-model.number="ficha.salvaciones.esp" />)
                </div>
                <div class="item">
                    PRE: <input type="number" v-model.number="ficha.stats.pre" />
                </div>
            </section>

            <section class="info-principal">
                <section class="checks">
                    <h3>Tiradas de habilidad</h3>
                    <div class="checks-list">
                        <div class="item" v-for="(check, i) in ficha.checks" :key="i">
                            <select v-model="check.stat">
                                <option v-for="(v, stat) in ficha.stats" :key="stat" :value="stat">{{ stat.toUpperCase()
                                    }}</option>
                            </select>
                            <select v-model="check.grado" @change="recalcularCheck(check)">
                                <option value="no">No entrenado</option>
                                <option value="bueno">Bueno</option>
                                <option value="experto">Experto</option>
                                <option value="maestro">Maestro</option>
                                <option value="legendario">Legendario</option>
                            </select>
                            <label>Total:</label>
                            <input type="number" v-model.number="check.total" />
                            <button @click="removeCheck(i)">✕</button>
                        </div>
                        <div class="item">
                            <select v-model="nuevaCheck">
                                <option disabled value="">Añadir nueva habilidad</option>
                                <option v-for="op in opcionesChecksDisponibles" :key="op" :value="op">{{ op }}</option>
                            </select>
                            <button @click="addCheck">Añadir</button>
                        </div>
                    </div>
                </section>

                <section class="destacados">
                    <div class="item">
                        <label><input type="checkbox" v-model="manual.bc" @change="updateStatsDerivadas()" />
                            BC:</label>
                        <input type="number" v-model.number="ficha.bc" :readonly="!manual.bc" />
                        <span v-if="manual.bc">({{ calculado.bc }})</span>
                    </div>
                    <div class="item">CA: <input v-model.number="ficha.ca" /></div>
                    <div class="item">INIT: <input v-model.number="ficha.init" /></div>
                    <div class="item">VIT: <input v-model.number="ficha.vit" /></div>
                </section>

                <section class="info-dinamica">
                    <h3>Cosas que cambian</h3>
                    <div class="changing-grid">
                        <div class="item">PV: <input v-model.number="ficha.pv" /> / <input
                                v-model.number="ficha.pvMax" /></div>
                        <div class="item">Escudo: <input v-model.number="ficha.escudo" /></div>
                        <div class="item">PP: <input v-model.number="ficha.pp" /> / <input
                                v-model.number="ficha.ppMax" /></div>
                        <div class="item">Fatiga: <input v-model.number="ficha.fatiga" /></div>
                    </div>
                </section>

                <section class="speeds">
                    <h3>Velocidades</h3>
                    <div class="speeds-list">
                        <div class="item" v-for="(val, tipo) in ficha.velocidades" :key="tipo">
                            {{ tipo }}: <input type="number" v-model.number="ficha.velocidades[tipo]" />
                        </div>
                    </div>
                </section>
            </section>
        </div>

        <section class="moves">
            <h3>Movimientos</h3>
            <div class="moves-grid">
                <div v-for="(mov, i) in ficha.movimientos" :key="i">
                    <input v-model="mov.nombre" placeholder="Nombre" />
                    <input v-model="mov.tipo" placeholder="Tipo" />
                    <input v-model="mov.dano" placeholder="Daño" />
                </div>
            </div>
        </section>

        <section class="habsFeats">
            <section class="habilidades">
                <h3>Habilidades</h3>
                <div class="habilidades-list">
                    <div class="item" v-for="(hab, i) in ficha.habilidades" :key="i">
                        <input v-model="hab.nombre" placeholder="Nombre" />: <input type="number"
                            v-model.number="hab.valor" />
                    </div>
                </div>
            </section>

            <section class="feats">
                <h3>Dotes</h3>
                <div class="feats-list">
                    <div class="item" v-for="(dote, i) in ficha.dotes" :key="i">
                        <input v-model="ficha.dotes[i]" placeholder="Nombre de dote" />
                    </div>
                </div>
            </section>
        </section>

        <section class="info-secundaria">
            <section class="others">
                <h3>Otros</h3>
                <div class="others-list">
                    <div class="item">Dieta: <input v-model="ficha.otros.dieta" /></div>
                    <div class="item">Tamaño: <input v-model="ficha.otros.tamano" /></div>
                    <div class="item">Sexo: <input v-model="ficha.otros.sexo" /></div>
                    <div class="item">Sentidos: <input v-model="ficha.otros.sentidos" /></div>
                    <div class="item">Teratipo: <input v-model="ficha.otros.teratipo" /></div>
                    <div class="item">Carga: <input type="number" :value="ficha.carga" readonly /></div>
                </div>
            </section>
        </section>
    </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'

const manual = reactive({ bc: false, pp: false })
const calculado = reactive({ bc: 0, pp: 0 })

const nuevaCheck = ref('')
const fichaSeleccionada = ref('')
const nuevaFichaNombre = ref('')
const fichasGuardadas = reactive({})

const ficha = reactive({
    nombre: '', especie: '', nivel: 1, tipos: '',
    stats: { fue: 0, agi: 0, res: 0, men: 0, esp: 0, pre: 0 },
    salvaciones: { fue: 0, agi: 0, res: 0, esp: 0 },
    checks: [],
    bc: 0, pp: 0,
    pv: 0, pvMax: 0, ppMax: 0, escudo: 0, fatiga: 0,
    velocidades: { base: 0, nado: 0, vuelo: 0, trepar: 0, cavar: 0, otros: 0 },
    movimientos: [], habilidades: [], dotes: [],
    otros: { dieta: '', tamano: '', sexo: '', sentidos: '', teratipo: '' },
    carga: 0
})

const opcionesChecksDisponibles = [
    'Acrobacias', 'Actuación', 'Atletismo', 'Combate', 'Empatía', 'Engaño',
    'Intimidación', 'Investigación', 'Juego de Manos', 'Percepción',
    'Persuasión', 'Supervivencia', 'Trato Pokémon'
]

const grados = {
    no: 0,
    bueno: () => ficha.bc,
    experto: () => ficha.bc + 2,
    maestro: () => ficha.bc + 4,
    legendario: () => ficha.bc + 6
}

function updateStatsDerivadas() {
    calculado.bc = Math.ceil(ficha.nivel / 2)
    calculado.pp = ficha.stats.esp + ficha.nivel
    if (!manual.bc) ficha.bc = calculado.bc
    if (!manual.pp) ficha.pp = calculado.pp
    for (let check of ficha.checks) recalcularCheck(check)
}

function recalcularCheck(check) {
    const statVal = ficha.stats[check.stat] || 0
    const bonoGrado = typeof grados[check.grado] === 'function' ? grados[check.grado]() : grados[check.grado]
    const nuevoTotal = statVal + bonoGrado
    check.total = nuevoTotal
    check.modificado = false
}

function addCheck() {
    if (!nuevaCheck.value) return
    ficha.checks.push({ nombre: nuevaCheck.value, stat: 'fue', grado: 'no', total: 0, modificado: false })
    nuevaCheck.value = ''
}

function removeCheck(index) {
    ficha.checks.splice(index, 1)
}

function guardarFicha() {
    if (!fichaSeleccionada.value) return
    fichasGuardadas[fichaSeleccionada.value] = JSON.parse(JSON.stringify({ ficha, manual }))
    localStorage.setItem('fichas_vue', JSON.stringify(fichasGuardadas))
}

function cargarFicha(nombre) {
    const data = fichasGuardadas[nombre]
    if (data) {
        Object.assign(ficha, data.ficha || {})
        Object.assign(manual, data.manual || {})
    }
}

onMounted(() => {
    const guardadas = localStorage.getItem('fichas_vue')
    if (guardadas) Object.assign(fichasGuardadas, JSON.parse(guardadas))
    if (Object.keys(fichasGuardadas).length > 0) {
        fichaSeleccionada.value = Object.keys(fichasGuardadas)[0]
        cargarFicha(fichaSeleccionada.value)
    }
})

watch(ficha, () => {
    updateStatsDerivadas()
    guardarFicha()
}, { deep: true })
</script>




<style scoped>
/* WARNING */

.modificado input {
    border: 2px dashed red;
}




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
input {
    width: 100%;
}

.toolbar {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    align-items: center;
}

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
    display: flex;
    gap: 10px;
}

.others-list div {
    width: 18%;
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