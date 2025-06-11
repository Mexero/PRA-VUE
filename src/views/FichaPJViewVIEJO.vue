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
                <input v-model="ficha.pokedex.especie" />
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
                <div class="item" v-for="stat in ['fue', 'agi', 'res', 'men', 'esp', 'pre']" :key="stat">
                    {{ stat.toUpperCase() }}:
                    <span>{{ ficha.derivados.stats[stat] }}</span>
                    (<span>{{ ficha.derivados.salvaciones[stat] || 0 }}</span>)
                    <button @click="cambiarMejora(stat, -1)">−</button>
                    <span> Mejora: {{ ficha.personaliz.mejorasEst[stat] }} </span>
                    <button @click="cambiarMejora(stat, 1)">+</button>
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
                            <select v-model="check.grado" @change="updateCheck(check)">
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
                                <option v-for="op in ChecksBase" :key="op" :value="op">{{ op }}</option>
                            </select>
                            <button @click="addCheck">Añadir</button>
                        </div>
                    </div>
                </section>

                <section class="destacados">
                    <div class="item">
                        <label><input type="checkbox" v-model="ficha.manual.bh" @change="update()" />
                            bh:</label>
                        <input type="number" v-model.number="ficha.derivados.bh" :readonly="!ficha.manual.bh" />
                    </div>
                    <div class="item">CA: <input v-model.number="ficha.derivados.ca" /></div>
                    <div class="item">INIT: <input v-model.number="ficha.derivados.init" /></div>
                    <div class="item">VIT: <input v-model.number="ficha.vit" /></div>
                </section>

                <section class="info-dinamica">
                    <h3>Cosas que cambian</h3>
                    <div class="changing-grid">
                        <div class="item">PV: <input v-model.number="ficha.pv" /> / <input
                                v-model.number="ficha.derivados.pvMax" /></div>
                        <div class="item">Escudo: <input v-model.number="ficha.escudo" /></div>
                        <div class="item">PP: <input v-model.number="ficha.derivados.ppMax" /> / <input
                                v-model.number="ficha.derivados.ppMax" /></div>
                        <div class="item">Fatiga: <input v-model.number="ficha.fatiga" /></div>
                    </div>
                </section>

                <section class="speeds">
                    <h3>Velocidades</h3>
                    <div class="speeds-list">
                        <div class="item" v-for="(tipo) in ficha.derivados.velocidades" :key="tipo">
                            {{ tipo }}: <input type="number" v-model.number="ficha.derivados.velocidades[tipo]" />
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
                    <div class="item">Dieta: <input v-model="ficha.pokedex.otros.dieta" readonly /></div>
                    <div class="item">Tamaño: <input v-model="ficha.pokedex.otros.tamano" readonly /></div>
                    <div class="item">Sexo: <input v-model="ficha.pokedex.otros.sexo" readonly /></div>
                    <div class="item">Sentidos: <input v-model="ficha.personaliz.sentidos" readonly /></div>
                    <div class="item">Teratipo: <input v-model="ficha.personaliz.teratipo" /></div>
                    <div class="item">Carga: <input type="number" :value="ficha.derivados.carga" readonly /></div>
                </div>
            </section>
        </section>
    </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'

const nuevaCheck = ref('')
const fichaSeleccionada = ref('')
const nuevaFichaNombre = ref('')
const fichasGuardadas = reactive({})


//Datos fichas
const ficha = reactive({})
Object.assign(ficha, crearFichaBase())
const ChecksBase = [
    'Acrobacias', 'Actuación', 'Atletismo', 'Combate', 'Empatía', 'Engaño',
    'Intimidación', 'Investigación', 'Juego de Manos', 'Percepción',
    'Persuasión', 'Supervivencia', 'Trato Pokémon'
]




//Generador ficha
function crearFichaBase(nombre) {
    return {
        nombre: nombre,
        nivel: 1,
        pokedex: {
            especie: '',
            tipos: ['', ''],
            statsBase: { fue: 0, agi: 0, res: 0, men: 0, esp: 0, pre: 0 },
            salvaciones: { fue: 0, agi: 0, res: 0, esp: 0 },
            natHabil: '',
            vit: 0,
            velocidades: { Caminado: 0, Trepado: 0, Excavado: 0, Nado: 0, Vuelo: 0, Levitado: 0 },
            movimientosDisponibles: [],
            Habilidades: [],
            HabilidadesOcultas: [],
            calculosCA: ['', ''],
            Evolución: [],
            otros: { dieta: '', tamano: '', sexo: '', sentidos: '' },
        },
        personaliz: {
            mejorasEst: [],
            movimientosAprendidos: [],
            habilidadesDisponibles: [],
            dotes: [],
            checksActivos: [],
            checksBonos: [],
            checksNuevos: ['TDA personalizadas'],
            mejorasHab: ['TDA', 'Numero de mejoras'],
            caDisponibles: ['', ''],
            bonosExtraEst: { fue: 0, agi: 0, res: 0, men: 0, esp: 0, pre: 0 },
            mejorasVelocidades: { Caminado: 0, Trepado: 0, Excavado: 0, Nado: 0, Vuelo: 0, Levitado: 0 },
            salvaciones: { fue: 0, agi: 0, res: 0, esp: 0 },
            bonoVit: 0,
            bonoPP: 0,
            bonoInit: 0,
            bonoCa: 0,
            teratipo: '',
            sentidos: ''
        },
        derivados: {
            bh: 0,
            stats: { fue: 0, agi: 0, res: 0, men: 0, esp: 0, pre: 0 },
            salvaciones: { fue: 0, agi: 0, res: 0, esp: 0 },
            checks: [{ check: 'nombreCheck', bono: 'bono' }],
            velocidades: { Caminado: 0, Trepado: 0, Excavado: 0, Nado: 0, Vuelo: 0, Levitado: 0 },
            cantidadMejorasEST: 0,
            init: 0,
            ca: 0,
            pp: 0,
            ppMax: 0,
            pv: 0,
            pvMax: 0,
            escudo: 0,
            fatiga: 0,
            carga: 0,
            vit: 0,
        },
        manual: {
            bh: false,
            ppMax: false,
            cantidadMejorasEST: false
        },
    }
}





//Utilidades de formulas
const grados = {
    no: 0,
    bueno: () => ficha.derivados.bh,
    experto: () => ficha.derivados.bh + 2,
    maestro: () => ficha.derivados.bh + 4,
    legendario: () => ficha.derivados.bh + 6
}

//mejoras stats
function mejoraToValor(mejoras) {
    if (mejoras > 0 && mejoras <= 3) return mejoras;
    if (mejoras === 4) return 3;
    if (mejoras >= 5) return 4;
    return 0;
}

//Actualizar
function updateCheck(check) {
    const statVal = ficha.stats[check.stat] || 0
    const bonoGrado = typeof grados[check.grado] === 'function' ? grados[check.grado]() : grados[check.grado]
    const nuevoTotal = statVal + bonoGrado
    check.total = nuevoTotal
    check.modificado = false
}

function updateStats() {
    for (const stat in ficha.derivados.stats) {
        const base = ficha.pokedex.statsBase[stat] || 0;
        const mejoras = ficha.personaliz.mejorasEst[stat] || 0; //Esto hay que corregirlo
        ficha.derivados.stats[stat] = base + mejoraToValor(mejora);
    }
}

function updateSaves() {
    for (const stat in ficha.derivados.salvaciones) {
        const statTotal = ficha.derivados.stats[stat] || 0;
        const bono = ficha.personaliz.salvaciones[stat] || 0;
        ficha.derivados.salvaciones[stat] = statTotal + bono;
    }
}

// Función que actualiza ambos
function actualizar() {
    updateStats();
    updateSaves();
    if (!ficha.manual.bh) ficha.derivados.bh = Math.ceil(ficha.nivel / 2)
    if (!ficha.manual.pp) ficha.derivados.ppMax = ficha.derivados.stats.esp + ficha.nivel
    if (!ficha.manual.cantidadMejorasEST) ficha.derivados.cantidadMejorasEST = 1 + (nivel - 2) / 3
    for (let check of ficha.derivados.checks) updateCheck(check)
}


//Cambiar mejora estadísticas
function cambiarMejora(stat, delta) {
    let mejoras = ficha.personaliz.mejorasEst
    const max = ficha.derivados.cantidadMejorasEST

    const actuales = mejoras.filter(s => s === stat).length ?? 0

    if (delta > 0) {
        if (mejoras.length >= max) {
            alert("No puedes tener más mejoras de estadísticas a este nivel");
            return;
        }
        let añadidas = 0;
        while (delta > 0 && mejoras.length < max && actuales + añadidas < 5) {
            mejoras.push(stat);
            delta--;
            añadidas++;
        }
    } else if (delta < 0) {
        let eliminadas = 0;
        for (let i = mejoras.length - 1; i >= 0 && eliminadas < -delta; i--) {
            if (mejoras[i] === stat) {
                mejoras.splice(i, 1);
                eliminadas++;
            }
        }
    }

    actualizar();
}



//COSAS DE CHECKS
function addCheck() {
    if (!nuevaCheck.value) return
    ficha.checks.push({ nombre: nuevaCheck.value, stat: 'fue', grado: 'no', total: 0, modificado: false })
    nuevaCheck.value = ''
}

function removeCheck(index) {
    ficha.checks.splice(index, 1)
}



//MANIP FICHAS
function guardarFicha() {
    if (!fichaSeleccionada.value) return
    fichasGuardadas[fichaSeleccionada.value] = JSON.parse(JSON.stringify({ ficha }))
    localStorage.setItem('fichas_vue', JSON.stringify(fichasGuardadas))
}

function cargarFicha(nombre) {
    const data = fichasGuardadas[nombre]
    if (data) {
        Object.assign(ficha, data.ficha || {})
    }
}

function crearFicha() {
    if (!nuevaFichaNombre.value || fichasGuardadas[nuevaFichaNombre.value]) return
    const nueva = crearFichaBase(nuevaFichaNombre.value)
    fichaSeleccionada.value = nuevaFichaNombre.value
    Object.assign(ficha, JSON.parse(JSON.stringify(nueva)))
    guardarFicha()
    nuevaFichaNombre.value = ''
}

function borrarFicha() {
    if (!fichaSeleccionada.value) return
    delete fichasGuardadas[fichaSeleccionada.value]
    localStorage.setItem('fichas_vue', JSON.stringify(fichasGuardadas))
    fichaSeleccionada.value = ''
    Object.assign(ficha, crearFichaBase())
}

function exportarFicha() {
    const blob = new Blob([JSON.stringify({ ficha }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${ficha.nombre || 'ficha'}.json`
    a.click()
    URL.revokeObjectURL(url)
}

function importarFicha(event) {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result)
            if (data.ficha) Object.assign(ficha, data.ficha)
            if (data.manual) Object.assign(manual, data.manual)
            if (ficha.nombre) {
                fichasGuardadas[ficha.nombre] = JSON.parse(JSON.stringify({ ficha, manual }))
                fichaSeleccionada.value = ficha.nombre
                guardarFicha()
            }
        } catch (err) {
            console.error('Error al importar ficha:', err)
        }
    }
    reader.readAsText(file)
}



//INICIO
onMounted(() => {
    const guardadas = localStorage.getItem('fichas_vue')
    if (guardadas) Object.assign(fichasGuardadas, JSON.parse(guardadas))
    if (Object.keys(fichasGuardadas).length > 0) {
        fichaSeleccionada.value = Object.keys(fichasGuardadas)[0]
        cargarFicha(fichaSeleccionada.value)
    }
})


//Actualizar Ficha
watch(ficha, () => {
    actualizar()
    guardarFicha()
    ficha.checks.forEach(updateCheck)
}, { deep: true })


watch(ficha.nivel, () => {
    ficha.personaliz.mejorasEst
})
</script>




<style scoped>
/* inputs */

.item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
}

.item label {
    margin-right: 0.25rem;
}

.item input[type="number"] {
    width: 5rem;
    padding: 0.25rem 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    transition: border-color 0.2s ease-in-out;
}

.item input[type="checkbox"] {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid #666;
    background-color: #fff;
    margin-left: auto;
    margin-right: 4px;
    cursor: pointer;
    position: relative;
}

.item input[type="checkbox"]:checked {
    background-color: #444;
    box-shadow: inset 0 0 0 2px #fff;
}

.item span {
    font-size: 0.8rem;
    color: #888;
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
    width: 50px;
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