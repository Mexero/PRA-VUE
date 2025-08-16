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
function generarEvoluciones(evoEn, nivelEvo, tipoRequisito, requisitosEvo, evoOtros) {
    if (evoEn === '' || evoEn === null) {
        if (evoOtros === '' || evoOtros === null) return null
        return evoOtros
    }
    let evoEnArray = evoEn.split(';')
    let nivelEvoArray = nivelEvo.split(';')
    let tipoRequisitoArray = tipoRequisito.split(';')
    let requisitosEvoArray = requisitosEvo.split(';')
    let evoOtrosArray = evoOtros.split(';')

    let evoluciones = []
    for (let i = 0; i < evoEnArray.length; i++) {
        evoluciones.push({
            nombre: evoEnArray[i],
            nivel: nivelEvoArray[i],
            tipoRequisito: tipoRequisitoArray[i],
            requisitos: requisitosEvoArray[i],
            otros: evoOtrosArray[i] ?? null
        })
    }
    let stringFinal = evoluciones.map(evo => {
        let partes = [evo.nivel];
        if (evo.requisitos && evo.requisitos.trim() !== '') {
            partes.push(evo.requisitos.trim());
        }
        if (evo.otros && evo.otros.trim() !== '') {
            partes.push(evo.otros.trim());
        }
        return `${evo.nombre} (${partes.join(', ')})`;
    }).join('. ');
    return stringFinal
}

async function cambiarDatosEspecie(especie) {
    if (!isReady.value) return

    loading.value = true
    error.value = null

    try {
        const res = await queryDB(`
      SELECT 
        pokedex.ID, Especie, Tipo_primario, Tipo_secundario, 
        FUE, AGI, RES, MEN, ESP, PRE, 
        S_FUE, S_AGI, S_RES, S_ESP,
        Vitalidad,
        V_Caminado, V_Trepado, V_Excavado, V_Nado, V_Vuelo, V_Levitado,
        Nat_Habil_1, Nat_Habil_2,
        AC1, AC2, 
        Dieta, Tamano, Sexo, Sentidos, 
        EvoEn, Nivel_Evo, Tipo_requisito, Requisitos_Evo, Evo_otros
      FROM pokedex
      WHERE Especie = ?
    `, [especie])

        const row = res?.[0]?.values?.[0]
        if (!row) return

        const id = row[0]

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
      SELECT h.Nombre, ph.Es_Oculta, ph.Es_Optativa
      FROM pokemon_habilidades ph
      JOIN habilidades h ON h.ID = ph.Habilidad_ID
      WHERE ph.Pokemon_ID = ?
    `, [id])

        ficha.pokedex.habilidades = []
        ficha.pokedex.habilidadesOcultas = []

        habilidadesRes?.[0]?.values?.forEach(([nombre, esOculta, esOpcional]) => {
            if (esOculta) ficha.pokedex.habilidadesOcultas.push({ nombre: nombre, esOpcional: esOpcional })
            else ficha.pokedex.habilidades.push({ nombre: nombre, esOpcional: esOpcional })
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
            evolucion: generarEvoluciones(row[29], row[30], row[31], row[32], row[33])
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

function calcularBonoGrado(grado) {
    return grado > 0 ? ficha.derivados.bh + Math.min(Math.max(0, (grado - 1) * 2), 6) : 0
}

function updateCheck(check) {
    const statVal = ficha.derivados.stats[check.stat] || 0
    const nuevoTotal = statVal + calcularBonoGrado(check.grado) - Math.max(ficha.derivados.fatiga, 0)
    check.total = nuevoTotal
    check.modificado = false
}

function checksBaseIguales(a, b) {
    if (a.length !== b.length) return false
    return a.every((item, i) => item.check === b[i].check && item.grado === b[i].grado)
}

function construirChecksBase() {
    const checksBaseNuevo = [{ check: 'Percepción', grado: 1, stat: 'esp' }, { check: 'Init', grado: 1, stat: 'esp' }]

    ficha.pokedex.natHabil.forEach(natCheck => {
        const index = checksBaseNuevo.findIndex(c => c.check === natCheck)
        if (index !== -1) {
            checksBaseNuevo[index].grado++
        } else {
            checksBaseNuevo.push({ check: natCheck, grado: 1 })
        }
    })
    if (ficha.personaliz.naturaleza.naturaleza) {
        const index = checksBaseNuevo.findIndex(c => c.check === ficha.personaliz.naturaleza.check)
        if (index !== -1) {
            checksBaseNuevo[index].grado++
        } else {
            checksBaseNuevo.push({ check: ficha.personaliz.naturaleza.check, grado: 1, stat: 'fue' })
        }
    }

    if (!checksBaseIguales(ficha.derivados.checksBase, checksBaseNuevo)) {
        ficha.derivados.checksBase = checksBaseNuevo
    }
}

function ActualizarChecks() {
    const checks = [];

    // 1. Meter los base
    ficha.derivados.checksBase.forEach(checkBase => {
        checks.push({
            check: checkBase.check,
            stat: checkBase.stat || 'fue',
            grado: checkBase.grado
        });
    });

    // 2. Aplicar Mejoras de Habilidad
    ficha.personaliz.mejorasHab.forEach(checkMejorado => {
        const index = checks.findIndex(c => c.check === checkMejorado);
        if (index !== -1) {
            checks[index].grado++;
        } else {
            checks.push({
                check: checkMejorado,
                stat: 'fue',
                grado: 1
            });
        }
    });

    // 3. Aplicar cambios
    checks.forEach(chk => {
        const index = ficha.personaliz.checks.findIndex(c => c.check === chk.check);
        if (index !== -1) {
            // Si ya existe actualiza grado y stat
            ficha.personaliz.checks[index].grado = chk.grado;
        } else {
            // Si no existe lo agrega
            ficha.personaliz.checks.push({
                check: chk.check,
                stat: chk.stat,
                grado: chk.grado,
                total: 0
            });
        }
    });

    //4. Recalcular bonos
    ficha.personaliz.checks.forEach(updateCheck)
}

function calcularSentidos() {

    if (ficha.pokedex.otros.sentidos && ficha.pokedex.otros.sentidos !== '') {
        return ficha.pokedex.otros.sentidos + (ficha.personaliz.sentidos !== "" ? (", " + ficha.personaliz.sentidos) : "")
    }
    else return ficha.personaliz.sentidos
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
    const result = (resultados[idx]?.valor ?? 0) + ficha.derivados.bh - Math.max(ficha.derivados.fatiga, 0)

    if (ficha.derivados.ca !== result) {
        ficha.derivados.ca = result
    }
}

watch(ficha, () => {
    if (ficha.nombre === fichaSeleccionada.value) {
        actualizar()
        guardarFicha()
    }
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

    //Iniciativa
    if (!ficha.manual.init) {
        const initCheck = ficha.personaliz.checks.find(ch => ch.check === "Init")
        ficha.derivados.init = (initCheck ? initCheck.total : 0)
    }

    //Sentidos
    ficha.derivados.sentidos = calcularSentidos()

    //checks Base
    construirChecksBase()

    //actualizar checks
    ActualizarChecks()

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
    const mejoraToValor = (mejoras) => {
        if (mejoras < 0) return 0
        if (mejoras <= 3) return mejoras
        if (mejoras === 4) return 3
        if (mejoras > 4) return 4
    }

    for (const stat in ficha.derivados.stats) {
        const baseStat = ficha.pokedex.statsBase[stat] || 0
        const mejorasAplicadas = ficha.personaliz.mejorasEst.filter(s => s === stat).length
        ficha.derivados.stats[stat] = baseStat + mejoraToValor(mejorasAplicadas)
    }

    // Actualizar salvaciones con bonificaciones personalizadas
    for (const stat in ficha.derivados.salvaciones) {
        const statTotal = ficha.derivados.stats[stat] || 0
        ficha.derivados.salvaciones[stat] = statTotal + ficha.derivados.bh
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
    const nombreFicha = nombreUnico('Nueva Ficha')
    const nueva = crearFichaBase(nombreFicha)

    fichaSeleccionada.value = nombreFicha
    Object.keys(ficha).forEach(k => delete ficha[k])
    Object.assign(ficha, JSON.parse(JSON.stringify(nueva)))

    fichasGuardadas[ficha.nombre] = JSON.parse(JSON.stringify(ficha))
    ordenFichas.value.push(ficha.nombre)

    guardarFicha()
}

async function borrarFicha() {
    const confirmacion = confirm("¿Estás seguro de que quieres borrar la ficha seleccionada? Si lo haces, no podrás recuperarla.");
    if (!confirmacion) return
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

async function cambiarNombreFicha(nuevoNombre) {
    nuevoNombre = nuevoNombre.trim()
    if (nuevoNombre === '') {
        alert("¡No puedes guardar una ficha con nombre vacío!")
        return
    }

    let nombreOriginal = fichaSeleccionada.value

    if (fichaSeleccionada.value === nuevoNombre) return

    if (fichasGuardadas[nuevoNombre]) {
        alert(`Ya existe una ficha guardada con el nombre "${nuevoNombre}"`)
        ficha.nombre = ''
        return
    }
    if (fichasGuardadas[nombreOriginal]) {
        delete fichasGuardadas[nombreOriginal]
        await borrarFichaIndexedDB(nombreOriginal)
    }

    // Guardar nueva ficha
    fichasGuardadas[nuevoNombre] = { ...ficha }

    // Cambiar en el orden
    const index = ordenFichas.value.indexOf(nombreOriginal)
    if (index !== -1) ordenFichas.value[index] = nuevoNombre

    // Actualizar reactivos
    fichaSeleccionada.value = nuevoNombre
    ficha.nombre = nuevoNombre

    guardarFicha()
}

//Guardar movimiento de fichas
watch(ordenFichas, async (nuevoOrden) => {
    await guardarOrdenFichas(nuevoOrden)
}, { deep: true })


function actualizarOrdenFichas(nuevoOrden) {
    ordenFichas.value = nuevoOrden;
    if (!ordenFichas.value.includes(fichaSeleccionada.value)) {
        fichaSeleccionada.value = ordenFichas.value[0] || null;
    }
}

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
    } catch (err) {
        error.value = err.message || 'Error cargando los movimientos'
        console.warn(error.value)
    } finally {
        loading.value = false
        return data
    }
}


async function cargarFichasInicio() {
    const todas = await obtenerTodasLasFichas()
    todas.forEach(f => {
        fichasGuardadas[f.nombre] = f
    })

    const ordenGuardado = await cargarOrdenFichas()
    if (ordenGuardado) {
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
    else {
        crearFicha()
        console.warn("No se encontraron fichas, así que se creó una ficha nueva.")
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
    if (habilidades.value.length > 0) {
        console.log("Habilidades cargadas...")
        habilidadesCargadas.value = true;
    }

    movimientos.value = await cargarMovimientos()
    if (movimientos.value.length > 0) {
        console.log("Movimientos cargados...")
        movimientosCargados.value = true;
    }
})


const mostrarToolbar = ref(false)
</script>


<template>
    <div class="center">
        <div class="fichaPokemon">

            <div class="sheet-managing">

                <button class="toolbar-toggle" @click="mostrarToolbar = !mostrarToolbar"
                    :aria-expanded="mostrarToolbar.toString()">
                    ☰
                </button>

                <transition name="slide" mode="out-in">
                    <div v-if="mostrarToolbar" class="toolbar-container" key="toolbar">
                        <FichaToolbar :fichaSeleccionada="fichaSeleccionada" :ordenFichas="ordenFichas"
                            :fichasGuardadas="fichasGuardadas" @update:fichaSeleccionada="(v) => fichaSeleccionada = v"
                            @crear="crearFicha" @borrar="borrarFicha" @exportar="exportarFicha"
                            @importar="importarFicha" @update:ordenFichas="actualizarOrdenFichas" />
                    </div>
                </transition>
            </div>
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
                        <div class="estatSave">
                            <div class="bonosSalvacion" v-for="stat in ['fue', 'agi', 'res', 'esp']" :key="stat">
                                {{ stat.toUpperCase() }}
                                <span class="numero">{{ ficha.derivados.salvaciones[stat] || 0 }}</span>
                            </div>
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
                    <div class="otros-area">

                        <FichaOtros :ficha="ficha" :naturalezas="naturalezas" />
                    </div>
                </div>

                <div class="HabsDotesMovs">
                    <div class="col-izq">
                        <div class="habs">
                            <FichaHabilidades :ficha="ficha" :habilidades="habilidades"
                                :habilidadesCargadas="habilidadesCargadas" />
                        </div>
                        <div class="dotes">
                            <FichaDotes :ficha="ficha" :dotes="dotes" :dotesCargadas="dotesCargadas" />
                        </div>
                    </div>

                    <div class="col-der">
                        <div class="movs">
                            <FichaMovimientos :ficha="ficha" :movimientos="movimientos"
                                :movimientosCargados="movimientosCargados" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

</template>

<style scoped>
.center {
    display: flex;
    width: 100%;
    justify-content: center;
}

.fichaPokemon {
    display: flex;
    margin: 0 20px;
    justify-content: center;
    width: fit-content;
    color: var(--color-texto);
}

.character-sheet {
    margin: 50px auto;
    background-color: var(--color-fondoTexto);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2), -3px 0px 5px rgba(0, 0, 0, 0.2);
}

.info-principal {
    width: fit-content;
    display: grid;
    grid-template-areas:
        "stats destacados destacados velocidades"
        "stats saves checks velocidades"
        "otros otros otros otros";
    grid-template-columns: auto auto 1fr auto;
    grid-template-rows: auto auto auto;
    gap: 10px;
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
    margin-top: 40px;
}

.otros-area {
    grid-area: otros;
}

.salvaciones-area {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
    padding: 5px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 10px;
}

.bonosSalvacion {
    border-radius: 5px;
    padding: 3px;
    align-items: center;
    justify-content: center;
    display: flex;
    gap: 10px;
}

.HabsDotesMovs {
    padding-top: 25px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.col-izq {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.col-der {
    display: flex;
    flex-direction: column;
}

/* transición (name="slide") */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
    width: 0;

}

.slide-enter-to,
.slide-leave-from {
    width: 200px;
}

.sheet-managing {
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: end;
    margin-top: 60px;
    position: relative;
    left: 0;
}

.toolbar-toggle {
    width: fit-content;
    height: fit-content;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    cursor: pointer;
    font-size: 20px;
    z-index: 10;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.toolbar-container {
    position: absolute;
    top: auto;
    left: 38px;
    z-index: 4;
    border: 1px solid var(--color-principal1);
}



@media screen and (max-width: 1460px) {
    .info-principal {
        width: fit-content;
        display: grid;
        grid-template-areas:
            "stats destacados destacados"
            "stats velocidades checks"
            "saves velocidades checks"
            "otros otros otros";
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto auto 1fr auto;
    }

    .velocidades-area {
        grid-area: velocidades;
        margin-top: 0px;
    }

    .salvaciones-area {
        text-align: center;
    }

    .salvaciones-area div {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: normal;
        justify-content: normal;
        gap: 10px;
    }

    .HabsDotesMovs {
        padding-top: 25px;
        display: grid;
        grid-template-columns: fit-content;
        gap: 20px;
        grid-template-areas:
            "habs "
            "dotes"
            "movs";
    }

    .HabsDotesMovs {
        padding-top: 25px;
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .col-izq {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .col-der {
        display: flex;
        flex-direction: column;
    }
}

@media screen and (max-width: 920px) {
    .info-principal {
        grid-template-areas:
            "destacados"
            "stats"
            "saves"
            "velocidades"
            "checks"
            "otros ";
        grid-template-columns: min-content;
        grid-template-rows: auto;
        gap: 15px 0;
    }

    .info-principal div {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .salvaciones-area {
        margin: 0 auto;
        width: 100%;
    }

    .bonosSalvacion {
        border: 1px solid rgba(150, 150, 150, 0.798);
        width: 100px;
    }

}

@media screen and (max-width: 545px) {
    .center {
        margin: 0 auto;
    }

    .fichaPokemon {
        display: flex;
        flex-direction: column;
        margin: 40px 10px;
    }

    .character-sheet {
        margin: 0;
        padding: 10px;
    }

    .info-principal {
        width: 340px;
    }

    .slide-enter-active,
    .slide-leave-active {
        transition: all 0.3s ease;
        overflow: hidden;
    }

    .slide-enter-from,
    .slide-leave-to {
        height: 0;
    }

    .slide-enter-to,
    .slide-leave-from {
        height: 200px;
    }

    .sheet-managing {
        margin: 0;
        align-items: start;
    }

    .toolbar-container {
        left: 0;
        top: 40px;
    }

    .salvaciones-area {
        margin: 0 auto;
        width: 100%;
    }

    .bonosSalvacion {
        border: 1px solid rgba(150, 150, 150, 0.798);
        width: auto;
    }
}
</style>
