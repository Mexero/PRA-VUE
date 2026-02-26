<script setup>
import { ref, reactive, onMounted, watch, computed, nextTick } from 'vue'

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
import LanzadorDados from '@/components/LanzadorDados.vue'
import tiraDado from '@/components/tiraDado.vue'

import { crearFichaBase } from '@/utils/TemplateFicha.js'
import { initDB, queryDB } from '@/services/dbWorkerService'
import { updateSprite } from '@/utils/updateSprite.js'

import { guardarFichaIndexedDB, borrarFichaIndexedDB, obtenerTodasLasFichas, obtenerFicha, guardarOrdenFichas, cargarOrdenFichas } from '@/utils/FichasDB.js'

import { actualizar } from "@/utils/actualizarFichaPoke.js"

//Datos
const dotes = ref([])
const dotesCargadas = ref(false)
const especiesPokes = ref([])
const especiesPokesCargadas = ref(false)
const habilidades = ref([]);
const habilidadesCargadas = ref(false);
const movimientos = ref([]);
const movimientosCargados = ref(false);
const movimientosCompletos = ref([]);

//Ficha
const ficha = reactive(crearFichaBase());

const fichaSeleccionada = ref('')
const fichasGuardadas = reactive({})
const ordenFichas = ref([])

//flags DB
const isReady = ref(false)
const error = ref(null)
const loading = ref(false)

const mostrarToolbar = ref(false)
const mostrarConfigIniciativa = ref(false)

//Flags
let actualizando = false

//Imagen del Pokémon
const pokemonImage = ref(null)

// <========= GRADOS HABS =============>
const grados = ['No', 'Bueno', 'Experto', 'Maestro', 'Legendario']


//Init
const initBonus = computed(() => ficha?.checks?.checksData?.find(c => c.check == 'Init')?.bono || 0);


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
    { check: 'Juego de manos', stat: 'agi' },
    { check: 'Percepción', stat: 'esp' },
    { check: 'Persuasión', stat: 'pre' },
    { check: 'Sigilo', stat: 'agi' },
    { check: 'Supervivencia', stat: 'esp' },
    { check: 'Trato Pokémon', stat: 'pre' },
]

const naturalezas = [
    { naturaleza: "Activa", check: "Atletismo" },
    { naturaleza: "Fuerte", check: "Combate" },
    { naturaleza: "Agitada", check: "Acrobacias" },
    { naturaleza: "Tímida", check: "Sigilo" },
    { naturaleza: "Pícara", check: "Juego de manos" },
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
        EVA1, EVA2, 
        Dieta, Tamano, Sexo, Sentidos, 
        EvoEn, Nivel_Evo, Tipo_requisito, Requisitos_Evo, Evo_otros,
        Es_Alternativo, Numero_pokedex
      FROM pokedex
      WHERE Especie = ?
    `, [especie])

        const row = res?.[0]?.values?.[0]
        if (!row) return

        const id = row[0]

        ficha.pokedex.especie = row[1]
        ficha.pokedex.numPokedex = row[35]
        ficha.pokedex.esAlternativo = row[34]
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
        if (row[21]) {
            const stat1 = (ChecksBase.find(check => check.check === row[21]) || {}).stat || 'fue';
            ficha.pokedex.natHabil.push({ check: row[21], stat: stat1 });
        }

        if (row[22]) {
            const stat2 = (ChecksBase.find(check => check.check === row[22]) || {}).stat || 'fue';
            ficha.pokedex.natHabil.push({ check: row[22], stat: stat2 });
        }

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

        // Evasión
        ficha.pokedex.calculosEva = []
        if (row[23]) ficha.pokedex.calculosEva.push(row[23])
        if (row[24]) ficha.pokedex.calculosEva.push(row[24])

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

        // Actualizar imagen del Pokémon
        await actualizarImagenPokemon()

        actualizar(ficha)
        ficha.derivados.pp = ficha.derivados.ppMax
        ficha.derivados.pv = ficha.derivados.pvMax

    } catch (err) {
        error.value = err.message || 'Error cargando la especie Pokémon ' + especie
        console.warn(error.value)
    } finally {
        loading.value = false
    }
}

// Función para actualizar la imagen del Pokémon
async function actualizarImagenPokemon() {
    if (ficha.pokedex.especie) {
        console.log('Actualizando imagen para:', ficha.pokedex.especie, ficha.pokedex.esAlternativo, ficha.pokedex.numPokedex)
        try {
            pokemonImage.value = await updateSprite(
                ficha.pokedex.especie,
                ficha.pokedex.esAlternativo || '0',
                ficha.pokedex.numPokedex || '#0001'
            )
            console.log('Imagen actualizada:', pokemonImage.value)
        } catch (err) {
            console.warn('Error cargando imagen del Pokémon:', err)
            pokemonImage.value = null
        }
    }
    else pokemonImage.value = null
}

//<========= ACTUALIZAR FICHA =============>

watch(
    ficha,
    async () => {
        if (actualizando) return
        if (ficha.nombre !== fichaSeleccionada.value) return

        actualizando = true

        actualizar(ficha)
        guardarFicha()

        await nextTick()

        actualizando = false
    },
    { deep: true }
)
// Watcher para actualizar la imagen cuando cambie la especie
watch(() => ficha.pokedex.especie, async () => {
    await actualizarImagenPokemon()
})

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




// Funciones para los botones del Pokémon
function nuevaEscena() {
    ficha.derivados.pp = ficha.derivados.ppMax
}

function descansar() {
    ficha.derivados.pp = ficha.derivados.ppMax
    ficha.derivados.pv = ficha.derivados.pvMax

    // Reducir fatiga: si es > 5, reduce en 1; si es ≤ 5, se vuelve 0
    if (ficha.derivados.fatiga > 5) {
        ficha.derivados.fatiga -= 1
    } else {
        ficha.derivados.fatiga = 0
    }
    nuevaEscena()
}



// COSAS DE INICIATIVA
const iniciativaCheck = computed(() =>
    ficha.checks.checksData.find(c => c.check === 'Init')
)

const iniciativaStat = computed({
    get() {
        return iniciativaCheck.value?.stat ?? 'agi'
    },
    set(v) {
        if (iniciativaCheck.value) iniciativaCheck.value.stat = v
    }
})

const iniciativaGrado = computed({
    get() {
        return iniciativaCheck.value?.grado ?? 0
    },
    set(v) {
        if (iniciativaCheck.value) iniciativaCheck.value.grado = Number(v)
    }
})

function cambiarGrado(nombre, gradoNuevo) {
    // Si no está en checksData, hay que meterlo
    let check = ficha.checks.checksData.find(c => c.check === nombre)
    if (!check) {
        const base = todosLosChecks.value.find(c => c.nombre === nombre)
        check = {
            check: nombre,
            stat: base?.stat ?? 'fue',
            grado: base?.grado ?? 0,
            bono: 0,
            visible: true
        }
        ficha.checks.checksData.push(check)
    }

    //Ajustar las mejoras de habilidad
    const mejoras = ficha.personaliz.mejorasHab
    const gradosBase = ficha.checks.checksBase.find(c => c.check == nombre)?.grado || 0
    const mejorasNecesarias = gradoNuevo - gradosBase

    const mejorasActuales = mejoras.filter(x => x === nombre).length
    const diferencia = mejorasNecesarias - mejorasActuales
    if (diferencia > 0) { for (let i = 0; i < diferencia; i++) { mejoras.push(nombre) } }

    if (diferencia < 0) {
        let porQuitar = Math.abs(diferencia)

        for (let i = mejoras.length - 1; i >= 0 && porQuitar > 0; i--) {
            if (mejoras[i] == nombre) {
                mejoras.splice(i, 1)
                porQuitar--
            }
        }
    }
    check.grado = gradoNuevo
}

function desactivarOpcionGrado(nombre, optionIndex) {
    const min = ficha.checks.checksBase.find(c => c.check == nombre)?.grado || 0
    const actual = ficha.checks.checksData.find(c => c.check == nombre)?.grado || 0
    const max = (ficha.derivados.cantidadMejorasHab - ficha.personaliz.mejorasHab.length) + actual
    if (optionIndex < min) return true
    if (optionIndex > max) return true
}

</script>


<template>
    <div class="center">
        <div class="fichaPokemon">
            <div class="character-sheet">
                <!-- Botón de toolbar posicionado en la esquina superior izquierda -->
                <div class="sheet-managing">
                    <div class="toolbar-buttons">
                        <button class="toolbar-toggle" @click="mostrarToolbar = !mostrarToolbar"
                            :aria-expanded="mostrarToolbar.toString()" title="Mostrar opciones de fichas">
                            ☰
                        </button>
                        <button class="toolbar-settings" @click="abrirMenuConfiguracion" title="Editar datos rápidos">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                                focusable="false">
                                <circle cx="12" cy="12" r="3" />
                                <path
                                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 9 3.09V3a2 2 0 0 1 4 0v.09c0 .66.39 1.25 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82c.22.63.85 1.05 1.51 1.05H21a2 2 0 0 1 0 4h-.09c-.66 0-1.25.39-1.51 1z" />
                            </svg>
                        </button>
                    </div>

                    <transition name="slide" mode="out-in">
                        <div v-if="mostrarToolbar" class="toolbar-container" key="toolbar">
                            <FichaToolbar :fichaSeleccionada="fichaSeleccionada" :ordenFichas="ordenFichas"
                                :fichasGuardadas="fichasGuardadas"
                                @update:fichaSeleccionada="(v) => fichaSeleccionada = v" @crear="crearFicha"
                                @borrar="borrarFicha" @exportar="exportarFicha" @importar="importarFicha"
                                @update:ordenFichas="actualizarOrdenFichas" />
                        </div>
                    </transition>
                </div>

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
                                <span class="numero">{{ ficha.derivados.salvaciones[stat] || 0 }}
                                    <tiraDado :tirada='"1d20+" + (ficha.derivados.salvaciones[stat] || 0)'
                                        :origin='"Salvación de " + stat.toLocaleUpperCase()' />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="pokemon-image-area">
                        <div class="pokemon-image-container">
                            <img v-if="pokemonImage" :src="pokemonImage" :alt="ficha.pokedex.especie || 'Pokémon'"
                                class="pokemon-image" />
                            <div v-else class="pokemon-placeholder">
                                <span>Sin imagen</span>
                            </div>
                        </div>
                    </div>

                    <div class="rest-buttons">
                        <button @click="nuevaEscena" class="pokemon-btn">Nueva escena</button>
                        <button @click="descansar" class="pokemon-btn">Descansar</button>
                    </div>

                    <div class="estadisticas-derivadas-area">
                        <!-- BH -->
                        <div class="BH">
                            <h3>BH </h3>
                            <input type="number" v-model.number="ficha.derivados.bh" readonly />
                        </div>

                        <!-- Iniciativa -->
                        <div class="Iniciativa">
                            <div class="iniciativa-header">
                                <h3>Iniciativa</h3>
                                <button class="settings-btn" @click="mostrarConfigIniciativa = true"
                                    title="Configurar iniciativa">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="3" />
                                        <path
                                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 9 3.09V3a2 2 0 0 1 4 0v.09c0 .66.39 1.25 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82c.22.63.85 1.05 1.51 1.05H21a2 2 0 0 1 0 4h-.09c-.66 0-1.25.39-1.51 1z" />
                                    </svg>
                                </button>
                            </div>
                            <span class="grado">{{grados[ficha?.checks?.checksData?.find(c => c.check == 'Init')?.grado
                                || 0]}}</span>
                            <div class="iniciativa-input-container">
                                <p> {{ initBonus }}</p>
                                <tiraDado :tirada='"1d20+" + initBonus' :origin='"Iniciativa"' />
                            </div>
                        </div>

                        <!-- Evasión -->
                        <div class="Evasion">
                            <h3>Evasión</h3>
                            <input v-model.number="ficha.derivados.ca" readonly />
                            <select v-if="ficha.pokedex.calculosEva && ficha.pokedex.calculosEva.length > 1"
                                v-model="ficha.derivados.caElegida">
                                <option v-for="(calculo, i) in ficha.pokedex.calculosEva" :value="i">{{ calculo }}
                                </option>
                            </select>
                            <p v-else>
                                {{ ficha.pokedex.calculosEva ? ficha.pokedex.calculosEva[0] || 0 : 0 }}
                            </p>
                        </div>

                        <!-- PP -->
                        <div class="pp-box">
                            <h3>PP</h3>
                            <div class="pp-inputs">
                                <input v-model.number="ficha.derivados.pp" /> /
                                <input v-model.number="ficha.derivados.ppMax" readonly />
                            </div>
                        </div>

                        <!-- Fatiga -->
                        <div class="fatiga">
                            <h3>Fatiga</h3>
                            <input type="number" v-model.number="ficha.derivados.fatiga" />
                        </div>
                    </div>

                    <div class="destacados-area">
                        <FichaDestacados :ficha="ficha" :grados="grados" />
                    </div>

                    <div class="checks-area">
                        <FichaChecks :ficha="ficha" :checksBase="ChecksBase" :grados="grados" />
                    </div>

                    <div class="velocidades-area">
                        <FichaVelocidades :ficha="ficha" />
                    </div>

                    <div class="otros-area">
                        <FichaOtros :ficha="ficha" :naturalezas="naturalezas" :checksBase="ChecksBase" />
                    </div>

                    <div class="pv-escudo-area">
                        <div class="pv-box">
                            <div class="pv-row">
                                <h3>PV:</h3>
                                <input v-model.number="ficha.derivados.pv" /> /
                                <input class="pv-max" v-model.number="ficha.derivados.pvMax" readonly />
                            </div>
                            <div class="pv-row vit">
                                <h3>Vitalidad</h3>
                                <input v-model.number="ficha.derivados.vit" readonly />
                            </div>
                        </div>
                        <div class="escudo-box">
                            <h3>Escudo</h3>
                            <input v-model.number="ficha.derivados.escudo" />
                        </div>
                    </div>
                </div>

                <div class="HabsDotesMovs">
                    <div class="col-izq">
                        <div class="habs">
                            <FichaHabilidades :ficha="ficha" :habilidades="habilidades"
                                :habilidadesCargadas="habilidadesCargadas" />
                        </div>
                        <div class="dotes1">
                            <FichaDotes :ficha="ficha" :dotes="dotes" :dotesCargadas="dotesCargadas" />
                        </div>
                    </div>

                    <div class="col-der">
                        <div class="movs">
                            <FichaMovimientos :ficha="ficha" :movimientos="movimientos"
                                :movimientosCargados="movimientosCargados" :movimientosCompletos="movimientosCompletos"
                                @update:movimientosCompletos="movimientosCompletos = $event" />
                        </div>
                        <div class="dotes2">
                            <FichaDotes :ficha="ficha" :dotes="dotes" :dotesCargadas="dotesCargadas" />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </div>
    <LanzadorDados />

    <transition name="fade">
        <div v-if="mostrarMenuConfiguracion && configuracionDerivados" class="config-panel-overlay"
            @click.self="cerrarMenuConfiguracion">
            <div class="config-panel">
                <div class="config-panel-header">
                    <h3>Configuración del Pokémon</h3>
                    <button class="close-btn" @click="cerrarMenuConfiguracion" aria-label="Cerrar">×</button>
                </div>

                <div class="config-panel-body">
                    <section class="config-section">
                        <h4>Vitalidad y Recursos</h4>
                        <div class="config-list">
                            <label class="config-field-list">
                                <span>PV Max</span>
                                <span class="valor-actual">{{ configuracionDerivados.pvMax }}</span>
                                <input type="number" v-model.number="ajustesConfiguracion.pvMax"
                                    @input="aplicarAjustePVMax(ajustesConfiguracion.pvMax)" placeholder="0">
                            </label>
                            <label class="config-field-list">
                                <span>PP Max</span>
                                <span class="valor-actual">{{ configuracionDerivados.ppMax }}</span>
                                <input type="number" v-model.number="ajustesConfiguracion.ppMax"
                                    @input="aplicarAjustePPMax(ajustesConfiguracion.ppMax)" placeholder="0">
                            </label>
                            <label class="config-field-list">
                                <span>Vitalidad</span>
                                <span class="valor-actual">{{ configuracionDerivados.vit }}</span>
                                <input type="number" v-model.number="ajustesConfiguracion.vit"
                                    @input="aplicarAjusteVitalidad(ajustesConfiguracion.vit)" placeholder="0">
                            </label>
                            <label class="config-field-list">
                                <span>BH</span>
                                <span class="valor-actual">{{ configuracionDerivados.bh }}</span>
                                <input type="number" v-model.number="ajustesConfiguracion.bh"
                                    @input="aplicarAjusteBH(ajustesConfiguracion.bh)" placeholder="0">
                            </label>
                        </div>
                    </section>

                    <section class="config-section">
                        <h4>Cálculo de Evasión</h4>
                        <div class="config-list">
                            <label class="config-field-list">
                                <span>CA</span>
                                <span class="valor-actual">{{ configuracionDerivados.ca }}</span>
                                <input type="number" v-model.number="ajustesConfiguracion.ca"
                                    @input="aplicarAjusteCA(ajustesConfiguracion.ca)" placeholder="0">
                            </label>
                            <label class="config-field-list" v-if="ficha.pokedex.calculosEva?.length">
                                <span>Fórmula base</span>
                                <select v-model.number="configuracionDerivados.caElegida">
                                    <option v-for="(calculo, i) in ficha.pokedex.calculosEva" :key="calculo" :value="i">
                                        {{ calculo }}
                                    </option>
                                </select>
                            </label>
                        </div>
                    </section>

                    <section class="config-section">
                        <h4>Stats Derivados</h4>
                        <div class="config-list">
                            <label v-for="(label, key) in statLabels" :key="key" class="config-field-list">
                                <span>{{ label }}</span>
                                <span class="valor-actual">{{ configuracionDerivados.stats[key] }}</span>
                                <input type="number" v-model.number="ajustesConfiguracion.stats[key]"
                                    @input="aplicarAjusteStat(key, ajustesConfiguracion.stats[key])" placeholder="0">
                            </label>
                        </div>
                    </section>

                    <section class="config-section">
                        <h4>Velocidades</h4>
                        <div class="config-list">
                            <label v-for="vel in velocidadKeys" :key="vel" class="config-field-list">
                                <span>{{ vel }}</span>
                                <span class="valor-actual">{{ configuracionDerivados.velocidades[vel] }}</span>
                                <input type="number" v-model.number="ajustesConfiguracion.velocidades[vel]"
                                    @input="aplicarAjusteVelocidad(vel, ajustesConfiguracion.velocidades[vel])"
                                    placeholder="0">
                            </label>
                        </div>
                    </section>
                </div>
                <div class="config-panel-actions">
                    <button class="btn-reset" @click="reiniciarCambiosConfiguracion">Reiniciar</button>
                    <button class="btn-save" @click="guardarCambiosConfiguracion">Guardar cambios</button>
                </div>
            </div>
        </div>
    </transition>

    <!-- Modal configuración de iniciativa -->
    <div v-if="mostrarConfigIniciativa" class="config-modal-overlay" @click.self="mostrarConfigIniciativa = false">
        <div class="config-modal">
            <h4>Configurar Iniciativa</h4>
            <button class="close-btn" @click="mostrarConfigIniciativa = false" aria-label="Cerrar">×</button>
            <div class="config-checks-list">
                <label class="config-check-item">
                    Iniciativa

                    <select v-model="iniciativaStat" class="stat-select">
                        <option value="fue">Fuerza</option>
                        <option value="agi">Agilidad</option>
                        <option value="res">Resistencia</option>
                        <option value="men">Mente</option>
                        <option value="esp">Espíritu</option>
                        <option value="pre">Presencia</option>
                    </select>

                    <select :value="iniciativaGrado" class="rango-select" title="Rango de Iniciativa"
                        @change="cambiarGrado('Init', $event.target.value)">
                        <option v-for="(g, i) in grados" :key="g" :value="i"
                            :disabled="desactivarOpcionGrado('Init', i)">
                            {{ g }}
                        </option>
                    </select>
                </label>
            </div>
        </div>
    </div>

</template>

<style scoped>
.sheet-managing {
    position: absolute;
    top: -20px;
    left: 10px;
    z-index: 10;
    height: fit-content;
    display: flex;
    align-items: center;
    gap: 8px;
}

.toolbar-buttons {
    display: flex;
    gap: 6px;
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
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.toolbar-settings {
    width: fit-content;
    height: fit-content;
    background-color: var(--color-principal2);
    color: var(--color-texto);
    border: none;
    border-radius: 4px;
    padding: 6px 8px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
}

.toolbar-settings svg {
    pointer-events: none;
}

.toolbar-container {
    position: absolute;
    top: 0px;
    left: 32px;
    z-index: 4;
    border: 1px solid var(--color-principal1);
}

.config-panel-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 900;
    padding: 20px;
    color: var(--color-texto);
}

.config-panel {
    width: min(900px, 95vw);
    max-height: 90vh;
    background: var(--color-fondoTexto);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: hidden;
}

.config-panel-header {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
    background: var(--color-fondoTexto);
    z-index: 1;
    color: var(--color-texto);
}

.config-panel-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    padding-right: 8px;
}

.config-section h4 {
    margin: 0 0 10px 0;
    color: var(--color-principal1);
}

.config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
}

.config-list {
    display: grid;
    grid-template-columns: auto auto;
    gap: 8px;
}

.config-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
}

.config-field input,
.config-field select,
.config-field textarea {
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.15);
    color: var(--color-texto);
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 14px;
}

.config-field textarea {
    min-height: 60px;
    resize: vertical;
}

.config-field-list {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    padding: 6px 8px;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.1);
}

.config-field-list>span:first-child {
    min-width: 100px;
    font-weight: 500;
}

.config-field-list .valor-actual {
    min-width: 50px;
    text-align: center;
    font-size: 12px;
    color: var(--color-secundario);
    font-weight: 500;
}

.config-field-list input {
    width: 60px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.15);
    color: var(--color-texto);
    border-radius: 4px;
    padding: 4px 6px;
    font-size: 13px;
    text-align: center;
}

.config-field-list select {
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.15);
    color: var(--color-texto);
    border-radius: 4px;
    padding: 4px 6px;
    font-size: 13px;

}

.dual-input {
    display: flex;
    align-items: center;
    gap: 6px;
}

.dual-input span {
    font-weight: bold;
    color: var(--color-principal1);
}

.config-panel-actions {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 10px;
    background: linear-gradient(180deg, transparent 0%, var(--color-fondoTexto) 40%);
}

.btn-reset,
.btn-save {
    border: none;
    border-radius: 6px;
    padding: 8px 14px;
    cursor: pointer;
    font-weight: 600;
}

.btn-reset {
    background: rgba(255, 255, 255, 0.12);
    color: var(--color-texto);
}

.btn-save {
    background: var(--color-principal1);
    color: var(--color-texto);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.center {
    display: flex;
    width: 100%;
    justify-content: center;
    align-self: center;
    position: relative;
}

.fichaPokemon {
    display: flex;
    margin: 0 20px;
    justify-content: center;
    width: 0px;
    color: var(--color-texto);
}

.character-sheet {
    position: relative;
    margin: 50px auto;
    background-color: var(--color-fondoTexto);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2), -3px 0px 5px rgba(0, 0, 0, 0.2);
}

.info-principal {
    margin-top: 20px;
    width: fit-content;
    display: grid;
    grid-template-areas:
        "stats saves pokemon derivadas checks"
        "stats velocidades rest derivadas checks"
        "stats velocidades pv-escudo derivadas checks"
        "otros otros otros otros otros";
    grid-template-columns: auto 140px auto 150px auto;
    grid-template-rows: 150px 80px auto auto;
    gap: 15px;
}


.pv-box {
    font-weight: bold;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 8px 8px 0 0;
    padding: 10px 10px 5px 10px;
    grid-area: PV;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.Iniciativa {
    grid-area: Iniciativa;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    height: fit-content;
    padding: 8px 8px 0 8px;
}

.Iniciativa .grado {
    font-size: 12px;
    color: var(--color-secundario);
}

.Iniciativa input {
    border: none;
    text-align: right;
}

.iniciativa-input-container {
    display: flex;
    justify-content: center;
    margin-left: 20px;
    gap: 20px;
    margin-bottom: 5px;
}

.iniciativa-header {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
}

.iniciativa-header>h3 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

h3 {
    letter-spacing: 1px;
}

.iniciativa-header .settings-btn {
    margin-left: auto;
    color: var(--color-secundario);
}

.config-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    color: var(--color-texto);
}

.config-modal {
    background: var(--color-fondoTexto);
    padding: 10px;
    border-radius: 10px;
    min-width: 320px;
    position: relative;
}

.config-checks-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
}

.config-check-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
}

.stat-select {
    margin-left: 6px;
    padding: 2px 6px;
    border-radius: 5px;
    border: 1px solid var(--color-principal2);
    background: var(--color-fondoTexto);
    color: var(--color-texto);
    font-size: 0.95em;
}

.rango-select {
    margin-left: 6px;
    padding: 2px 6px;
    border-radius: 5px;
    border: 1px solid var(--color-principal1);
    background: var(--color-fondoTexto);
    color: var(--color-texto);
    font-size: 0.95em;
}

.close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    color: var(--color-texto);
    font-size: 20px;
    cursor: pointer;
    line-height: 1;
}

.settings-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    color: var(--color-principal2);

}

.Evasion {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    grid-area: Evasion;
    font-weight: bold;
    padding: 8px;
}

.init {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 5px;
}

.init label {
    font-size: 14px;
    font-weight: bold;
}

.init span {
    font-size: 12px;
    color: var(--color-principal1);
}


.Evasion select {
    background-color: transparent;
    color: var(--color-texto);
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 6px;
    padding: 2px 4px;
    margin-bottom: 2px;
    font-size: 14px;
    cursor: pointer;
}

.Evasion select:focus {
    background-color: var(--color-fondoTexto);
}

.pv-row {
    display: flex;
    align-items: center;
}

.vit input,
.pv-max,
.Evasion input {
    border: none;
}

.escudo-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 0 0 8px 8px;
    padding: 8px;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-top: none;
    font-weight: bold;
}

.pp-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
    font-weight: bold;
}

.pp-inputs {
    display: flex;
    align-items: center;
    gap: 5px;
}

.pp-inputs input {
    width: 40px;
    border-bottom: 1px solid rgba(150, 150, 150, 0.798);
    background-color: transparent;
    border: none;
    border-bottom: 1px solid rgba(150, 150, 150, 0.798);
    color: var(--color-texto);
    text-align: center;
    font-size: 18px;
}

.pp-inputs input:last-child {
    border-bottom: none;
}

.fatiga {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: fit-content;
    grid-area: fatiga;
    padding: 5px;
    font-weight: bold;
}

.BH {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    grid-area: BH;
    font-weight: bold;
    padding: 5px;
}

.BH input {
    border: none;
    width: 40px;
    text-align: center;
    background-color: transparent;
    color: var(--color-texto);
}

input {
    font-size: 18px;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid rgba(150, 150, 150, 0.798);
    color: var(--color-texto);
    width: 40px;
    text-align: center;
    box-shadow: none;
}

input:focus {
    outline: none;
    cursor: none;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
}


.stats-area {
    grid-area: stats;
}

.checks-area {
    grid-area: checks;
}

.velocidades-area {
    grid-area: velocidades;
}

.otros-area {
    grid-area: otros;
}

.estadisticas-derivadas-area {
    grid-area: derivadas;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.pv-escudo-area {
    grid-area: pv-escudo;
}

.salvaciones-area {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    text-align: center;
    height: fit-content;
    grid-area: saves;
    padding: 5px;
}

.bonosSalvacion {
    align-items: center;
    justify-content: center;
    display: flex;
    gap: 10px;
    padding: 4px 0;
}

.numero {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.pokemon-image-area {
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    text-align: center;
    grid-area: pokemon;
}

.pokemon-image-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.pokemon-image {
    width: 150px;
    height: 150px;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.pokemon-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    background-color: rgba(150, 150, 150, 0.2);
    border: 2px dashed rgba(150, 150, 150, 0.5);
    border-radius: 8px;
    color: rgba(150, 150, 150, 0.8);
    text-align: center;
}

.rest-buttons {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    grid-area: rest;
}

.pokemon-btn {
    background-color: var(--color-principal1);
    color: var(--color-texto);
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
}

.pokemon-btn:hover {
    background-color: var(--color-principal2, #555);
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
    gap: 20px;
}

.dotes1 {
    display: block;
}

.dotes2 {
    display: none !important;
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



@media screen and (max-width: 1040px) {
    .dotes1 {
        display: block;
    }

    .dotes2 {
        display: none;
    }

    .fichaPokemon {
        display: flex;
        margin: 0 20px;
        justify-content: center;
        width: 370px;
        color: var(--color-texto);
    }

    .info-principal {
        margin-top: 20px;
        width: fit-content;
        display: grid;
        grid-template-areas:
            "stats saves pokemon derivadas"
            "stats velocidades rest derivadas"
            "stats velocidades pv-escudo derivadas"
            "checks checks otros otros";
        grid-template-columns: 140px auto auto auto;
        grid-template-rows: auto auto auto auto;
        gap: 15px;
    }

    .HabsDotesMovs {
        padding-top: 25px;
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
    }



    .HabsDotesMovs .col-der {

        display: flex;
        flex-direction: column;
        gap: 20px;
    }



    .center {
        display: flex;
        flex-direction: column;
        width: 100%;
        justify-content: center;
    }

    .fichaPokemon {
        display: flex;
        margin: 0px;
        justify-content: center;
        width: 98%;
        color: var(--color-texto);
    }

    .character-sheet {
        position: relative;
        margin: 50px auto;
        background-color: var(--color-fondoTexto);
        border-radius: 10px;
        padding: 20px;
        max-width: 750px;
        box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2), -3px 0px 5px rgba(0, 0, 0, 0.2);
    }
}


@media screen and (max-width: 750px) {
    .center {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0;
        margin: 0;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .character-sheet {
        position: relative;
        justify-self: center;
        max-width: 370px;
    }

    .fichaPokemon {
        display: flex;
        margin: 0;
        width: 100%;
    }

    .info-principal {
        margin-top: 40px;
        width: fit-content;
        display: grid;
        grid-template-areas:
            "stats"
            "saves"
            "pokemon"
            "rest"
            "derivadas"
            "pv-escudo"
            "velocidades"
            "checks"
            "otros";
        grid-template-columns: 1fr;
        grid-template-rows: none;

        width: 100%;
        gap: 20px;

    }

    .estadisticas-derivadas-area {
        display: grid;
        grid-template-areas:
            "BH BH"
            "Evasion  Iniciativa "
            "Fatiga PP";
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: auto;
        gap: 10px;
        grid-area: derivadas;
    }

    .BH {
        grid-area: BH;
        height: auto;

    }

    .Iniciativa {
        grid-area: Iniciativa;
        height: auto;
    }

    .Evasion {
        grid-area: Evasion;
        height: auto;
    }

    .pp-box {
        grid-area: PP;
        height: auto;
    }

    .fatiga {
        grid-area: Fatiga;
        height: auto;
    }

    .rest-buttons {
        display: flex;
        gap: 10px;
    }

    .estatSave {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        font-size: 20px;
    }

    .numero {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    h3,
    .velocidades-area {
        font-size: 20px;
    }

    input {
        font-size: 20px;
    }

    .pokemon-btn {
        font-size: 20px;
    }

    .Iniciativa .grado {
        font-size: 18px;
    }

}
</style>
