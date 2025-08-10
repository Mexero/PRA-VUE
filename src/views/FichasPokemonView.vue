<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

import FichaToolbar from '@/components/fichasPokemon/Toolbar.vue'
import FichaInfoBasica from '@/components/fichasPokemon/InfoBasica.vue'
import FichaStats from '@/components/fichasPokemon/Stats.vue'
import FichaChecks from '@/components/fichasPokemon/Checks.vue'
import FichaDestacados from '@/components/fichasPokemon/Destacados.vue'
import FichaVelocidades from '@/components/fichasPokemon/Velocidades.vue'
import FichaMovimientos from '@/components/fichasPokemon/Movimientos.vue'
import FichaHabilidades from '@/components/fichasPokemon/Habilidades.vue'
import FichaDotes from '@/components/fichasPokemon/Dotes.vue'
import FichaOtros from '@/components/fichasPokemon/Otros.vue'

import { crearFichaBase } from '@/utils/TemplateFicha.js'
import { initDB, queryDB } from '@/services/dbWorkerService'

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

//flags DB
const isReady = ref(false)
const error = ref(null)
const loading = ref(false)

// <========= DATOS CHECKS =============>
const ChecksBase = [
    { check: 'Acrobacias', stat: 'agi' },
    { check: 'Actuación', stat: 'pre' },
    { check: 'Atletismo', stat: 'fue' },
    { check: 'Combate', stat: 'fue' },
    { check: 'Empatía', stat: 'esp' },
    { check: 'Engaño', stat: 'pre' },
    { check: 'Intimidación', stat: 'pre' },
    { check: 'Investigación', stat: 'men' },
    { check: 'Juego de Manos', stat: 'agi' },
    { check: 'Percepción', stat: 'esp' },
    { check: 'Persuasión', stat: 'pre' },
    { check: 'Supervivencia', stat: 'esp' },
    { check: 'Trato Pokémon', stat: 'pre' },
]

const naturalezas = [
    { naturaleza: "Activa", check: "Atletismo" },
    { naturaleza: "Fuerte", check: "Combate" },
    { naturaleza: "Agitada", check: "Acrobacias" },
    { naturaleza: "Tímida", check: "Sigilo" },
    { naturaleza: "Pícara", check: "J. de manos" },
    { naturaleza: "Cauta", check: "Investigación" },
    { naturaleza: "Amable", check: "Empatía" },
    { naturaleza: "Serena", check: "Percepción" },
    { naturaleza: "Audaz", check: "Actuación" },
    { naturaleza: "Alocada", check: "Actuación" },
    { naturaleza: "Oblicua", check: "Engaño" },
    { naturaleza: "Firme", check: "Intimidación" },
    { naturaleza: "Alegre", check: "Persuasión" }
]


// <========= CAMBIAR DATOS ESPECIE =============>
async function cambiarDatosEspecie(especie) {
    if (!isReady.value) return

    loading.value = true
    error.value = null

    try {
        // Datos base de pokedex
        const res = await queryDB(`
      SELECT 
        pokedex.ID, Especie, Tipo_primario, Tipo_secundario, 
        FUE, AGI, RES, MEN, ESP, PRE, 
        S_FUE, S_AGI, S_RES, S_ESP,
        Vitalidad,
        V_Caminado, V_Trepado, V_Excavado, V_Nado, V_Vuelo, V_Levitado,
        Nat_Habil_1, Nat_Habil_2,
        AC1, AC2, 
        Dieta, Tamano, Sexo, Sentidos, Evoluciona_en_todo
      FROM pokedex
      WHERE Especie = ?
    `, [especie])

        const row = res?.[0]?.values?.[0]
        if (!row) return

        const id = row[0] // pokedex.ID

        // Asignación de datos
        ficha.pokedex.especie = row[1]
        ficha.pokedex.tipos = [row[2], row[3] ?? ""]
        ficha.pokedex.statsBase = {
            fue: row[4], agi: row[5], res: row[6],
            men: row[7], esp: row[8], pre: row[9]
        }
        ficha.pokedex.salvaciones = {
            fue: row[10], agi: row[11],
            res: row[12], esp: row[13]
        }
        ficha.pokedex.vit = row[14]
        ficha.pokedex.velocidades = {
            Caminado: row[15], Trepado: row[16], Excavado: row[17],
            Nado: row[18], Vuelo: row[19], Levitado: row[20]
        }

        ficha.pokedex.natHabil = []
        if (row[21]) ficha.pokedex.natHabil.push(row[21])
        if (row[22]) ficha.pokedex.natHabil.push(row[22])

        // Habilidades (relacional)
        const habilidadesRes = await queryDB(`
      SELECT h.Nombre, ph.Es_Oculta
      FROM pokemon_habilidades ph
      JOIN habilidades h ON h.ID = ph.Habilidad_ID
      WHERE ph.Pokemon_ID = ?
    `, [id])

        ficha.pokedex.habilidades = []
        ficha.pokedex.habilidadesOcultas = []

        habilidadesRes?.[0]?.values?.forEach(([nombre, esOculta]) => {
            if (esOculta) ficha.pokedex.habilidadesOcultas.push(nombre)
            else ficha.pokedex.habilidades.push(nombre)
        })

        // CA
        ficha.pokedex.calculosCA = []
        if (row[23]) ficha.pokedex.calculosCA.push(row[23])
        if (row[24]) ficha.pokedex.calculosCA.push(row[24])

        // Otros
        ficha.pokedex.otros = {
            dieta: row[25],
            tamano: row[26],
            sexo: row[27],
            sentidos: row[28],
            evolucion: row[29]
        }

        // Movimientos (relacional)
        const movimientosRes = await queryDB(`
      SELECT m.Nombre, pm.NivelAprendizaje
      FROM pokemon_movimientos pm
      JOIN movimientos m ON m.ID = pm.MovimientoID
      WHERE pm.PokemonID = ?
    `, [id])

        const movimientosNivel = movimientosRes?.[0]?.values?.filter(move => move[1] > 0)
            .sort((a, b) => a[0] - b[0]).map(m => ({
                nombre: m[0],
                nivel: m[1]
            }))

        const movimientosEnseñables = movimientosRes?.[0]?.values?.sort((a, b) => a[0] - b[0]).map(m => m[0])

        ficha.pokedex.movimientosNivel = movimientosNivel
            .sort((a, b) => a.nivel - b.nivel)

        ficha.pokedex.movimientosEnseñables = movimientosEnseñables

        // Reset
        ficha.personaliz.habilidadesOcultasDesbloqueadas = []

        console.log(`Datos de ${especie} cargados:`, ficha.pokedex)

    } catch (err) {
        error.value = err.message || 'Error cargando la especie Pokémon ' + especie
        console.warn(error.value)
    } finally {
        loading.value = false
    }
}

//<========= ACTUALIZAR DATOS =============>

const grados = ['no', 'bueno', 'experto', 'maestro', 'legendario']

function subirGrado(grado) {
    const index = grados.indexOf(grado)
    if (index === -1 || index >= grados.length - 1) return grado
    return grados[index + 1]
}

function gradoValor(grado) {
    const orden = ['no', 'bueno', 'experto', 'maestro', 'legendario']
    return orden.indexOf(grado)
}

function calcularBonoGrado(grado) {
    switch (grado) {
        case ('no'):
            return 0
        case ('bueno'):
            return ficha.derivados.bh
        case ('experto'):
            return ficha.derivados.bh + 2
        case ('maestro'):
            return ficha.derivados.bh + 4
        case ('legendario'):
            return ficha.derivados.bh + 6
        default:
            return -10
    }
}

function updateCheck(check) {
    const statVal = ficha.derivados.stats[check.stat] || 0
    const nuevoTotal = statVal + calcularBonoGrado(check.grado) - Math.max(ficha.derivados.fatiga, 0)
    check.total = nuevoTotal
    check.modificado = false
}

function calcularSentidos() {

    if (ficha.pokedex.otros.sentidos && ficha.pokedex.otros.sentidos !== '') {
        return ficha.pokedex.otros.sentidos + (ficha.personaliz.sentidos !== "" ? (", " + ficha.personaliz.sentidos) : "")
    }
    else return ficha.personaliz.sentidos
}

function checksBaseIguales(a, b) {
    if (a.length !== b.length) return false
    return a.every((item, i) => item.check === b[i].check && item.grado === b[i].grado)
}

function construirChecksBase() {
    const checksBaseNuevo = [{ check: 'Percepción', grado: 'bueno' }, { check: 'Init', grado: 'bueno' }]

    ficha.pokedex.natHabil.forEach(natCheck => {
        const index = checksBaseNuevo.findIndex(c => c.check === natCheck)
        if (index !== -1) {
            checksBaseNuevo[index].grado = subirGrado(checksBaseNuevo[index].grado)
        } else {
            checksBaseNuevo.push({ check: natCheck, grado: 'bueno' })
        }
    })
    const index = checksBaseNuevo.findIndex(c => c.check === ficha.personaliz.naturaleza.check)
    if (index !== -1) {
        checksBaseNuevo[index].grado = subirGrado(checksBaseNuevo[index].grado)
    } else {
        checksBaseNuevo.push({ check: ficha.personaliz.naturaleza.check, grado: 'bueno' })
    }

    if (!checksBaseIguales(ficha.derivados.checksBase, checksBaseNuevo)) {
        ficha.derivados.checksBase = checksBaseNuevo
    }
}

function validarChecks() {
    ficha.derivados.checksBase.forEach(checkBase => {
        const index = ficha.personaliz.checks.findIndex(c => c.check === checkBase.check)
        if (index === -1) {
            ficha.personaliz.checks.push({
                check: checkBase.check,
                stat: 'fue',
                grado: checkBase.grado,
                total: 0
            })
        } else {
            const checkPers = ficha.personaliz.checks[index]
            if (gradoValor(checkPers.grado) < gradoValor(checkBase.grado)) {
                checkPers.grado = checkBase.grado
            }
        }
    })
}

function calcularCA() {
    const calculos = ficha.pokedex.calculosCA
    const stats = ficha.derivados.stats

    if (!Array.isArray(calculos) || calculos.length === 0) return;

    if (ficha.derivados.caElegida >= ficha.pokedex.calculosCA.length) {
        ficha.derivados.caElegida = 0
    }

    const calcularValor = (formula) => {
        return formula.split('+').reduce((acc, partRaw) => {
            const part = partRaw.trim()
            if (!isNaN(part)) return acc + parseInt(part)
            const statKey = part.toLowerCase()
            const statValor = stats[statKey] ?? 0
            return acc + statValor
        }, 0)
    }

    const resultados = calculos.map((formula) => ({
        formula,
        valor: calcularValor(formula)
    }));

    const casIguales = JSON.stringify(ficha.derivados.cas) === JSON.stringify(resultados)
    if (!casIguales) {
        ficha.derivados.cas = resultados
    }

    const idx = ficha.derivados.caElegida ?? 0
    const result = (resultados[idx]?.valor ?? 0) + ficha.derivados.bh - ficha.derivados.fatiga

    if (ficha.derivados.ca !== result) {
        ficha.derivados.ca = result
    }
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

    if (!ficha.manual.cantidadMejorasHab)
        ficha.derivados.cantidadMejorasHab = Math.max(Math.floor(ficha.nivel / 6), 0)

    //Para tiradas de Habilidad
    const mejoraToValor = (mejoras) => {
        if (mejoras < 0) return 0
        if (mejoras <= 3) return mejoras
        if (mejoras === 4) return 3
        if (mejoras > 4) return 5
    }

    //Iniciativa
    if (!ficha.manual.init) {
        const initCheck = ficha.personaliz.checks.find(ch => ch.check === "Init")
        ficha.derivados.init = (initCheck ? initCheck.total : 0)
    }

    //Sentidos
    ficha.derivados.sentidos = calcularSentidos()

    //checks Base
    construirChecksBase()

    //comprobar checks validos
    validarChecks()

    // Recalcular checks personalizados
    ficha.personaliz.checks.forEach(updateCheck)


    // Chequear mejoras de estadísticas no se pasan. Si lo hacen, quitar las últimas aplicadas
    while (ficha.nivel > 0 && ficha.derivados.cantidadMejorasEST < ficha.personaliz.mejorasEst.length) {
        ficha.personaliz.mejorasEst.pop()
    }

    // Chequear cantidad dotes
    while (ficha.nivel > 0 && ficha.derivados.cantidadDotes < ficha.personaliz.dotes.length) {
        ficha.personaliz.dotes.pop()
    }

    // Chequear mejoras de habilidades
    while (ficha.nivel > 0 && ficha.derivados.cantidadMejorasHab < ficha.personaliz.mejorasHab.length) {
        ficha.personaliz.mejorasHab.pop()
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

    //Actualizar CA
    if (!ficha.manual.ca) {
        calcularCA()
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
async function cargarPokes() {
    loading.value = true
    error.value = null

    let data = []
    try {
        const res = await queryDB(`SELECT Especie FROM pokedex`, [])

        data = (res?.[0]?.values || []).map((row) => row[0]);
        if (data.length > 0) {
            console.log("Especies Pokémon cargadas...")
            especiesPokesCargadas.value = true;
        }
    } catch (err) {
        error.value = err.message || 'Error cargando las especies Pokémon'
        console.warn(error.value)
    } finally {
        loading.value = false
        return data
    }
}

async function cargarHabilidades() {
    loading.value = true
    error.value = null

    let data = []
    try {
        const res = await queryDB(`SELECT Nombre, Descripcion FROM habilidades`, [])

        data = (res?.[0]?.values || []).map((row) => ({
            nombre: row[0],
            descripcion: row[1].split('\n')
        }));

        if (data.length > 0) {
            console.log("Habilidades cargadas...")
            habilidadesCargadas.value = true;
        }
    } catch (err) {
        error.value = err.message || 'Error cargando las habilidades'
        console.warn(error.value)
    } finally {
        loading.value = false
        return data
    }
}

async function cargarMovimientos() {
    loading.value = true
    error.value = null

    let data = []
    try {
        const res = await queryDB(`SELECT Nombre, Tipo, Coste, Etiquetas FROM movimientos`, [])

        data = (res?.[0]?.values || []).map((row) => ({
            nombre: row[0],
            tipo: row[1],
            coste: row[2],
            etiquetas: row[3] !== "" ? row[3] : null
        }));
        if (data.length > 0) {
            console.log("Movimientos cargados...")
            movimientosCargados.value = true;
        }
    } catch (err) {
        error.value = err.message || 'Error cargando los movimientos'
        console.warn(error.value)
    } finally {
        loading.value = false
        return data
    }
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

    //abrirDB
    try {
        await initDB()
        isReady.value = true
    } catch (err) {
        error.value = err.message || 'Error inicializando DB'
        console.warn(error.value)
    }

    //Cargar datos
    especiesPokes.value = await cargarPokes()
    habilidades.value = await cargarHabilidades()
    movimientos.value = await cargarMovimientos()
})

</script>


<template>

    <div class="fichaPokemon">
        <!-- 
        <FichaToolbar ... />
        -->
        <div class="character-sheet">

            <FichaInfoBasica :ficha="ficha" :especiesPokes="especiesPokes"
                :especiesPokesCargadas="especiesPokesCargadas" @cambiarNombre="cambiarNombreFicha"
                @cambiarDatosEspecie="cambiarDatosEspecie" />

            <div class="info-principal">
                <div class="stats-area">
                    <FichaStats :ficha="ficha" />
                </div>

                <div class="salvaciones-area">
                    <h3>Salvaciones</h3>
                    <div class="bonosSalvacion" v-for="stat in ['fue', 'agi', 'res', 'esp']" :key="stat">
                        {{ stat.toUpperCase() }}
                        <span class="numero">{{ ficha.derivados.salvaciones[stat] || 0 }}</span>
                    </div>
                </div>

                <div class="destacados-area">
                    <FichaDestacados :ficha="ficha" :grados="grados" />
                </div>
                <div class="checks-area">
                    <FichaChecks :ficha="ficha" :ChecksBase="ChecksBase" />
                </div>
                <div class="velocidades-area">
                    <FichaVelocidades :ficha="ficha" />
                </div>
            </div>
            <FichaOtros :ficha="ficha" :naturalezas="naturalezas" />


            <div class="HabsDotesMovs">
                <div class="habs"><FichaHabilidades :ficha="ficha" :habilidades="habilidades" :habilidadesCargadas="habilidadesCargadas" /></div>
                <div class="dotes"><FichaDotes :ficha="ficha" :dotes="dotes" :dotesCargadas="dotesCargadas" /></div>
                <div class="movs"><FichaMovimientos :ficha="ficha" :movimientos="movimientos" :movimientosCargados="movimientosCargados" /></div>
            </div>



        </div>
    </div>
</template>



<style scoped>
.fichaPokemon {
    display: flex;
    justify-content: center;
    margin: auto;
    width: fit-content;
    color: var(--color-texto);
}

.character-sheet {
    margin: 50px auto;
    background-color: var(--color-fondoTexto);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2), -3px 3px 5px rgba(0, 0, 0, 0.2);
}

.info-principal {
    width: fit-content;
    display: grid;
    grid-template-areas:
        "stats destacados destacados velocidades"
        "stats saves checks velocidades";
    grid-template-columns: auto 120px 1fr auto;
    grid-template-rows: 110px auto;
    gap: 0px 20px;
}

.stats-area {
    grid-area: stats;
}

.salvaciones-area {
    grid-area: saves;
}

.destacados-area {
    grid-area: destacados;
}

.checks-area {
    grid-area: checks;
}

.velocidades-area {
    grid-area: velocidades;
}

.salvaciones-area {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
    padding: 5px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.bonosSalvacion {
    border-radius: 5px;
    padding: 3px;
    align-items: center;
    display: flex;
    gap: 10px
}

.HabsDotesMovs {
    padding-top: 25px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
    gap: 20px;
    grid-template-areas:
        "habs movs"
        "dotes movs";
}
.habs {
    grid-area: habs;
}
.dotes {
    grid-area: dotes;
}
.movs {
    grid-area: movs;
}

</style>
