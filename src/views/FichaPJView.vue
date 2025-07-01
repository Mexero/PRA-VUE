<template>
    <div class="character-sheet">
        <FichaToolbar :fichaSeleccionada="fichaSeleccionada" :nuevaFichaNombre="nuevaFichaNombre"
            :ordenFichas="ordenFichas" :fichasGuardadas="fichasGuardadas"
            @update:fichaSeleccionada="fichaSeleccionada = $event" @update:nuevaFichaNombre="nuevaFichaNombre = $event"
            @crear="crearFicha" @borrar="borrarFicha" @exportar="exportarFicha" @importar="importarFicha"
            @moverFicha="moverFicha" />

        <FichaInfoBasica :ficha="ficha" :especiesPokes="especiesPokes" :especiesPokesCargadas="especiesPokesCargadas"
            @cambiarNombre="cambiarNombreFicha" @cambiarDatosEspecie="cambiarDatosEspecie" />

        <div class="info-principal">
            <FichaStats :ficha="ficha" />
            <FichaDestacados :ficha="ficha" />
            <FichaVelocidades :ficha="ficha" />
            <FichaChecks :ficha="ficha" :ChecksBase="ChecksBase" />
        </div>

        <FichaMovimientos :ficha="ficha" :movimientos="movimientos" :movimientosCargados="movimientosCargados" />
        <div class="HabsYDotes">
            <FichaHabilidades :ficha="ficha" :habilidades="habilidades" :habilidadesCargadas="habilidadesCargadas" />
            <FichaDotes :ficha="ficha" :dotes="dotes" :dotesCargadas="dotesCargadas" />
        </div>
        <FichaOtros :ficha="ficha" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

import FichaToolbar from '@/components/fichaPJ/Toolbar.vue'
import FichaInfoBasica from '@/components/fichaPJ/InfoBasica.vue'
import FichaStats from '@/components/fichaPJ/Stats.vue'
import FichaChecks from '@/components/fichaPJ/Checks.vue'
import FichaDestacados from '@/components/fichaPJ/Destacados.vue'
import FichaVelocidades from '@/components/fichaPJ/Velocidades.vue'
import FichaMovimientos from '@/components/fichaPJ/Movimientos.vue'
import FichaHabilidades from '@/components/fichaPJ/Habilidades.vue'
import FichaDotes from '@/components/fichaPJ/Dotes.vue'
import FichaOtros from '@/components/fichaPJ/Otros.vue'

import { crearFichaBase } from '@/utils/TemplateFicha.js'

import worker from '../sqlWorker.js';

import { guardarFichaIndexedDB, borrarFichaIndexedDB, obtenerTodasLasFichas, obtenerFicha, guardarOrdenFichas, cargarOrdenFichas } from '@/utils/FichasDB.js'

//Datos
const dotes = ref([])
const dotesCargadas = ref(false)
const especiesPokes = ref([])
const especiesPokesCargadas = ref(false)
const habilidades = ref([]);
const habilidadesCargadas = ref(false);
const movimientos = ref([]);
const movimientosCargados = ref(false);

//Ficha
const ficha = reactive(crearFichaBase());

const fichaSeleccionada = ref('')
const nuevaFichaNombre = ref('')
const fichasGuardadas = reactive({})
const ordenFichas = ref([])

const ChecksBase = [
    'Acrobacias', 'Actuación', 'Atletismo', 'Combate', 'Empatía', 'Engaño',
    'Intimidación', 'Investigación', 'Juego de Manos', 'Percepción',
    'Persuasión', 'Supervivencia', 'Trato Pokémon'
]

// <========= CAMBIAR DATOS ESPECIE =============>
function cambiarDatosEspecie(especie) {
    worker.postMessage({
        type: 'query',
        query: `
                SELECT Especie, Tipo_primario, Tipo_secundario, 
                FUE, AGI, RES, MEN, ESP, PRE, 
                S_FUE, S_AGI, S_RES, S_ESP,
                Vitalidad,
                V_Caminado, V_Trepado, V_Excavado, V_Nado, V_Vuelo, V_Levitado,
                Nat_Habil_1, Nat_Habil_2,
                Habilidad_1, Habilidad_2, Habilidad_3, Hab_oculta_1, Hab_oculta_2,
                AC1, AC2, 
                Dieta, Tamano, Sexo, Sentidos, Evoluciona_en_todo,
                Mov_Nivel_1, Mov_Nivel_2, Mov_Nivel_4, Mov_Nivel_6, Mov_Nivel_8, Mov_Nivel_10,
                Mov_Nivel_12, Mov_Nivel_14, Mov_Nivel_16, Mov_Nivel_18, Mov_Nivel_20,
                Mov_ensenables
                FROM pokemexe_pokedex
            WHERE Especie = ?
        `,
        params: [especie],
        origin: "CambiarDatosEspecie"
    })
}

worker.addEventListener('message', (e) => {
    if (e.data.type === 'result' && e.data.origin === 'CambiarDatosEspecie') {
        const row = e.data.result?.[0]?.values?.[0]
        if (row) {
            ficha.pokedex.especie = row[0]
            //Tipos
            ficha.pokedex.tipos[0] = row[1]
            ficha.pokedex.tipos[1] = row[2] ?? ""
            //stats base
            ficha.pokedex.statsBase.fue = parseInt(row[3])
            ficha.pokedex.statsBase.agi = parseInt(row[4])
            ficha.pokedex.statsBase.res = parseInt(row[5])
            ficha.pokedex.statsBase.men = parseInt(row[6])
            ficha.pokedex.statsBase.esp = parseInt(row[7])
            ficha.pokedex.statsBase.pre = parseInt(row[8])
            //saves
            ficha.pokedex.salvaciones.fue = parseInt(row[9])
            ficha.pokedex.salvaciones.agi = parseInt(row[10])
            ficha.pokedex.salvaciones.res = parseInt(row[11])
            ficha.pokedex.salvaciones.esp = parseInt(row[12])
            //VIT
            ficha.pokedex.vit = parseInt(row[13])
            //velocidades
            ficha.pokedex.velocidades.Caminado = parseInt(row[14]) || 0
            ficha.pokedex.velocidades.Trepado = parseInt(row[15]) || 0
            ficha.pokedex.velocidades.Excavado = parseInt(row[16]) || 0
            ficha.pokedex.velocidades.Nado = parseInt(row[17]) || 0
            ficha.pokedex.velocidades.Vuelo = parseInt(row[18]) || 0
            ficha.pokedex.velocidades.Levitado = parseInt(row[19]) || 0
            //Naturalmente Habil
            ficha.pokedex.natHabil = []
            if (row[20] && row[20] !== "") ficha.pokedex.natHabil.push(row[20])
            if (row[21] && row[21] !== "") ficha.pokedex.natHabil.push(row[21])
            //Habilidades
            ficha.pokedex.habilidades = []
            if (row[22] && row[22] !== "") ficha.pokedex.habilidades.push(row[22])
            if (row[23] && row[23] !== "") ficha.pokedex.habilidades.push(row[23])
            if (row[24] && row[24] !== "") ficha.pokedex.habilidades.push(row[24])
            ficha.pokedex.habilidadesOcultas = []
            if (row[25] && row[25] !== "") ficha.pokedex.habilidadesOcultas.push(row[25])
            if (row[26] && row[26] !== "") ficha.pokedex.habilidadesOcultas.push(row[26])
            //Clase Armadura
            ficha.pokedex.calculosCA = []
            ficha.pokedex.calculosCA.push(row[27])
            if (row[28] && row[28] !== "") ficha.pokedex.calculosCA.push(row[28])
            //Otros
            ficha.pokedex.otros.dieta = row[29]
            ficha.pokedex.otros.tamano = row[30]
            ficha.pokedex.otros.sexo = row[31]
            ficha.pokedex.otros.sentidos = row[32]
            ficha.pokedex.otros.evolucion = row[33]
            //Movs nivel
            ficha.pokedex.movimientosNivel = [row[34], row[35], row[36], row[37], row[38], row[39], row[40], row[41], row[42], row[43], row[44]]
            //Movs enseñables
            let temporal = row[45]
            if (temporal[temporal.length - 1] === ".") temporal = temporal.slice(0, -1);
            ficha.pokedex.movimientosEnseñables = temporal.split(', ')

            //Resets necesarios
            ficha.personaliz.habilidadesOcultasDesbloqueadas = []

            console.log("Datos cargados: " + row)
        }

    } else if (e.data.type === 'error') {
        console.error("Error al seleccionar especie:", e.data.error)
    }
});



//<========= ACTUALIZAR DATOS =============>
const grados = {
    no: 0,
    bueno: () => ficha.derivados.bh,
    experto: () => ficha.derivados.bh + 2,
    maestro: () => ficha.derivados.bh + 4,
    legendario: () => ficha.derivados.bh + 6
}

function updateCheck(check) {
    const statVal = ficha.derivados.stats[check.stat] || 0
    const bonoGrado = typeof grados[check.grado] === 'function' ? grados[check.grado]() : grados[check.grado]
    const nuevoTotal = statVal + bonoGrado - Math.max(ficha.derivados.fatiga, 0)
    check.total = nuevoTotal
    check.modificado = false
}

function calcularSentidos() {

    if (ficha.pokedex.otros.sentidos && ficha.pokedex.otros.sentidos !== '') {
        return ficha.pokedex.otros.sentidos + (ficha.personaliz.sentidos !== "" ? (", " + ficha.personaliz.sentidos) : "")
    }
    else return ficha.personaliz.sentidos
}

watch(ficha, () => {
    actualizar()
    guardarFicha()
}, { deep: true })

function actualizar() {
    // Valores derivados automáticos si no están definidos manualmente
    if (!ficha.manual.bh) {
        ficha.derivados.bh = Math.ceil(ficha.nivel / 2)
    }

    if (!ficha.manual.ppMax) {
        ficha.derivados.ppMax = ficha.derivados.stats.esp + ficha.nivel - Math.max(ficha.derivados.fatiga, 0)
    }

    if (!ficha.manual.cantidadMejorasEST) {
        ficha.derivados.cantidadMejorasEST = 1 + Math.floor((ficha.nivel - 2) / 3)
    }

    if (!ficha.manual.vit) {
        ficha.derivados.vit = ficha.pokedex.vit + ficha.personaliz.bonoVit
    }

    if (!ficha.manual.pvMax) {
        ficha.derivados.pvMax = 10 + ficha.nivel * (ficha.derivados.vit + ficha.derivados.stats.res)
    }

    if (!ficha.manual.cantidadDotes) {
        ficha.derivados.cantidadDotes = Math.floor((ficha.nivel + 1) / 4)
    }

    //Para tiradas de Habilidad
    const mejoraToValor = (mejoras) => {
        if (mejoras < 0) return 0
        if (mejoras <= 3) return mejoras
        if (mejoras === 4) return 3
        if (mejoras > 4) return 5
    }

    //Iniciativa
    if (!ficha.manual.init) {
        const bonoGrado = typeof grados[ficha.personaliz.initGrado] === 'function' ? grados[ficha.personaliz.initGrado]() : grados[ficha.personaliz.initGrado]
        ficha.derivados.init = Math.max(ficha.derivados.stats.agi, ficha.derivados.stats.esp) + bonoGrado - Math.max(ficha.derivados.fatiga, 0)
    }

    //Sentidos
    ficha.derivados.sentidos = calcularSentidos()

    // Recalcular checks personalizados
    ficha.derivados.checks.forEach(updateCheck)


    // Chequear mejoras de estadísticas no se pasan. Si lo hacen, quitar las últimas aplicadas
    while (ficha.nivel > 0 && ficha.derivados.cantidadMejorasEST < ficha.personaliz.mejorasEst.length) {
        ficha.personaliz.mejorasEst.pop()
    }

    // Chequear mejoras de estadísticas no se pasan. Si lo hacen, quitar las últimas aplicadas
    while (ficha.nivel > 0 && ficha.derivados.cantidadDotes < ficha.personaliz.dotes.length) {
        ficha.personaliz.dotes.pop()
    }

    // Actualizar estadísticas con mejoras de estadísticas
    for (const stat in ficha.derivados.stats) {
        const baseStat = ficha.pokedex.statsBase[stat] || 0
        const mejorasAplicadas = ficha.personaliz.mejorasEst.filter(s => s === stat).length
        ficha.derivados.stats[stat] = baseStat + mejoraToValor(mejorasAplicadas)
    }

    // Actualizar salvaciones con bonificaciones personalizadas
    for (const stat in ficha.derivados.salvaciones) {
        const statTotal = ficha.derivados.stats[stat] || 0
        ficha.derivados.salvaciones[stat] = statTotal
            + ficha.pokedex.salvaciones[stat] + ficha.personaliz.salvaciones[stat]
            - Math.max(ficha.derivados.fatiga, 0)
    }

    //Actualizar cantidad de Movimientos aprendidos
    ficha.derivados.cantidadMovs = Math.min(2 + ficha.derivados.bh, 8) + Math.max(Math.floor(ficha.derivados.stats.men / 4), 0)
    while (ficha.derivados.bh > 0 && ficha.derivados.cantidadMovs < ficha.personaliz.movimientosAprendidos.length) {
        ficha.personaliz.movimientosAprendidos.pop()
    }

    // Actualizar velocidades
    for (const vel in ficha.derivados.velocidades) {
        ficha.derivados.velocidades[vel] = ficha.pokedex.velocidades[vel] + ficha.personaliz.mejorasVelocidades[vel]
    }
}


// <============== MANIPULAR FICHAS ===============>

watch(fichaSeleccionada, (nuevoNombre) => {
    if (nuevoNombre && fichasGuardadas[nuevoNombre]) {
        cargarFicha(nuevoNombre)
    }
})

async function guardarFicha() {
    if (!fichaSeleccionada.value) return
    const fichaData = JSON.parse(JSON.stringify(ficha))
    await guardarFichaIndexedDB(fichaData)
    fichasGuardadas[fichaData.nombre] = fichaData
}

async function cargarFicha(nombre) {
    const data = await obtenerFicha(nombre)
    if (data) Object.assign(ficha, data || {})
}

function crearFicha() {
    let nombreFicha
    if (nuevaFichaNombre.value.trim()) {
        nombreFicha = nombreUnico(nuevaFichaNombre.value.trim())
    }
    else {
        nombreFicha = nombreUnico('Nueva Ficha')
    }

    const nueva = crearFichaBase(nombreFicha)

    fichaSeleccionada.value = nombreFicha
    Object.keys(ficha).forEach(k => delete ficha[k])
    Object.assign(ficha, JSON.parse(JSON.stringify(nueva)))

    fichasGuardadas[ficha.nombre] = JSON.parse(JSON.stringify(ficha))
    ordenFichas.value.push(ficha.nombre)

    guardarFicha()
    nuevaFichaNombre.value = ''
}

async function borrarFicha() {
    if (prompt("¿Estás seguro de que quieres borrar la ficha seleccionada? Si lo haces, no prodras recuperarla.\nEscribe 'BORRAR' para borrar permanentemente la ficha.") !== "BORRAR") return
    if (!fichaSeleccionada.value) return


    await borrarFichaIndexedDB(fichaSeleccionada.value)
    delete fichasGuardadas[fichaSeleccionada.value]
    ordenFichas.value = ordenFichas.value.filter(n => n !== fichaSeleccionada.value)

    if (ordenFichas.value.length) {
        fichaSeleccionada.value = ordenFichas.value[0]
    }
    else {
        crearFicha()
    }
}

function exportarFicha() {
    const blob = new Blob([JSON.stringify(ficha, null, 2)], { type: 'application/json' })
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
            if (data) Object.assign(ficha, data)

            if (!ficha.nombre) {
                ficha.nombre = 'Nueva Ficha'
            }
            ficha.nombre = nombreUnico(ficha.nombre)
            fichasGuardadas[ficha.nombre] = JSON.parse(JSON.stringify(ficha))
            ordenFichas.value.push(ficha.nombre)
            fichaSeleccionada.value = ficha.nombre
            guardarFicha()
        } catch (err) {
            console.error('Error al importar ficha:', err)
        }
    }
    reader.readAsText(file)
}

function nombreUnico(nombreBase) {
    let nombre = nombreBase
    let cont = 1
    while (fichasGuardadas[nombre]) {
        nombre = nombreBase + " (" + cont + ")"
        cont++
    }
    return nombre
}

function cambiarNombreFicha(nuevoNombre) {
    if (fichaSeleccionada.value === nuevoNombre.trim()) return
    if (!nuevoNombre.trim()) {
        ficha.nombre = ''
        return
    }
    if (fichasGuardadas[nuevoNombre]) {
        alert(`Ya existe una ficha guardada con el nombre "${nuevoNombre}"`)
        ficha.nombre = ''
        return
    }

    const nombreViejo = fichaSeleccionada.value

    if (!fichasGuardadas[nombreViejo]) {
        console.warn(`No existe ficha guardada con el nombre "${nombreViejo}"`)
        return
    }

    // Cambiar la key en fichasGuardadas
    fichasGuardadas[nuevoNombre] = fichasGuardadas[nombreViejo]
    delete fichasGuardadas[nombreViejo]

    //Cambiar la ficha en OrdenFichas
    const index = ordenFichas.value.indexOf(nombreViejo)
    if (index !== -1) ordenFichas.value[index] = nuevoNombre

    // Actualizar el nombre en la ficha reactiva y el seleccionado
    fichaSeleccionada.value = nuevoNombre

    guardarFicha()
}

//Mover Fichas de orden
function moverFicha(desplazamiento) {
    const index = ordenFichas.value.indexOf(fichaSeleccionada.value)
    let nuevoIndex
    switch (desplazamiento) {
        case 'principio':
            nuevoIndex = 0
            break
        case 'final':
            nuevoIndex = ordenFichas.value.length - 1
            break
        default:
            nuevoIndex = index + desplazamiento
    }

    if (index === -1 || nuevoIndex < 0 || nuevoIndex >= ordenFichas.value.length) return

    const temp = ordenFichas.value[nuevoIndex]
    ordenFichas.value[nuevoIndex] = ordenFichas.value[index]
    ordenFichas.value[index] = temp
}

//Guardar movimiento de fichas
watch(ordenFichas, async (nuevoOrden) => {
    await guardarOrdenFichas(nuevoOrden)
}, { deep: true })


// <============== INICIO ===============>
function cargarPokes() {
    worker.postMessage({
        type: 'query',
        query: 'SELECT Especie FROM pokemexe_pokedex',
        params: [],
        origin: 'cargarPokes'
    });
}

function cargarHabilidades() {
    worker.postMessage({
        type: 'query',
        query: 'SELECT Nombre, Descripcion FROM Pokemexe_Habilidades',
        params: [],
        origin: 'cargarHabilidades'
    });
}

function cargarMovimientos() {
    worker.postMessage({
        type: 'query',
        query: 'SELECT Nombre, Tipo, Coste, Etiquetas FROM Pokemexe_Movimientos',
        params: [],
        origin: 'cargarMovimientos'
    });
}


async function cargarFichasInicio() {
    //Cargar fichas
    const todas = await obtenerTodasLasFichas()
    todas.forEach(f => {
        fichasGuardadas[f.nombre] = f
    })

    //Cargar Orden fichas
    const ordenGuardado = await cargarOrdenFichas()
    if (ordenGuardado) {
        //Por si ha pasado algo raro con datos
        const nombresDisponibles = todas.map(f => f.nombre)
        ordenFichas.value = ordenGuardado.filter(n => nombresDisponibles.includes(n))
        const nuevos = nombresDisponibles.filter(n => !ordenFichas.value.includes(n))
        ordenFichas.value.push(...nuevos)
    }
    else {
        ordenFichas.value = todas.map(f => f.nombre)
    }

    if (ordenFichas.value.length > 0) {
        fichaSeleccionada.value = ordenFichas.value[0]
        await cargarFicha(fichaSeleccionada.value)
        console.log("Fichas cargadas...")
    }
}

async function cargarDotes() {
    try {
        const res = await fetch("/data/json/dotes/dotes.json")

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)

        const data = await res.json()

        dotes.value = data.filter(d => d.Tipo === "Elemental" || d.Tipo === "General")
        if (dotes.value.length) {
            dotesCargadas.value = true;
            console.log("Dotes cargadas...")
        }
        else {
            console.warn("El archivo JSON de dotes está vacío.")
        }
    } catch (error) {
        console.error("Error al cargar las dotes:", error)
    }
}

onMounted(async () => {

    cargarFichasInicio()

    cargarDotes()

    worker.postMessage({ type: 'init' });

    worker.onmessage = (e) => {
        if (e.data.type === 'ready') {
            //Peticiones a base de datos
            if (!especiesPokesCargadas.value) {
                cargarPokes();
            }
            if (!habilidadesCargadas.value) {
                cargarHabilidades();
            }
            if (!movimientosCargados.value) {
                cargarMovimientos();
            }
        }
        if (e.data.type === 'result') {
            //Especies Pokes
            if (e.data.origin === 'cargarPokes') {
                especiesPokes.value = (e.data.result?.[0]?.values || []).map((row) => row[0]);
                if (especiesPokes.value.length > 0) {
                    console.log("Especies Pokémon cargadas...")
                    especiesPokesCargadas.value = true;
                }
            }
            //Habs
            if (e.data.origin === 'cargarHabilidades') {
                habilidades.value = (e.data.result?.[0]?.values || []).map((row) => ({
                    nombre: row[0],
                    descripcion: row[1].split('\n')
                }));
                if (habilidades.value.length > 0) {
                    console.log("Habilidades cargadas...")
                    habilidadesCargadas.value = true;
                }
            }
            //Movs
            if (e.data.origin === 'cargarMovimientos') {
                movimientos.value = (e.data.result?.[0]?.values || []).map((row) => ({
                    nombre: row[0],
                    tipo: row[1],
                    coste: row[2],
                    etiquetas: row[3] !== "" ? row[3] : null
                }));
                if (movimientos.value.length > 0) {
                    console.log("Movimientos cargados...")
                    movimientosCargados.value = true;
                }
            }
        }
        if (e.data.type === 'error') {
            console.error("Error en SQLite:", e.data.error);
        }
    };
})

</script>


<style>
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

.item input {
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

/* Quitar flechitas de input number*/
.character-sheet input[type=number]::-webkit-inner-spin-button,
.character-sheet input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
.character-sheet input[type=number] {
    -moz-appearance: textfield;
}


/* Básicos */
.character-sheet {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    color: #333;
}

.character-sheet input {
    width: 50px;
}

.info-item {
    flex: 1;
    font-size: 1rem;
}

.value {
    margin-left: 6px;
    color: #555;
}

/* PRICIPAL GRID */
.info-principal {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr repeat(2, 2fr);
    grid-template-rows: 200px 240px;
    grid-template-areas:
        "stats central vels"
        "stats checks checks"
    ;
}

/* Grid areas */
.central {
    grid-area: central;
}

.stats {
    grid-area: stats;
}

.checks {
    grid-area: checks;
}

.speeds {
    grid-area: vels;
}

/* Secciones con títulos */

.character-sheet section h3 {
    font-size: 1.2rem;
    color: #34495e;
    margin-bottom: 10px;
    border-bottom: 2px solid #3498db;
    padding-bottom: 4px;
}

/* Habilidades y Feats */
.HabsYDotes {
    display: flex;
    justify-content: space-around;
}

.habilidades,
.feats {
    width: 48%;
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
</style>
