export function actualizar(ficha) {
    calcularDerivadosBasicos(ficha)

    //Stats
    ficha.derivados.cantidadMejorasEST = 1 + Math.floor((ficha.nivel - 2) / 3)
    recortarArray(ficha.personaliz.mejorasEst, ficha.derivados.cantidadMejorasEST)
    calcularStats(ficha)

    //Combate
    calcularPVyPP(ficha)
    calcularSalvaciones(ficha)
    calcularEVA(ficha)

    //Recalcular y aplicar limitador de mejoras de habilidad
    ficha.derivados.cantidadMejorasHab = Math.max(Math.floor(ficha.nivel / 6), 0) + ficha.modificadores.mejorasHab
    recortarArray(ficha.personaliz.mejorasHab, ficha.derivados.cantidadMejorasHab)
    actualizarChecks(ficha)

    //limitar dotes
    recortarArray(ficha.personaliz.dotes, ficha.derivados.cantidadDotes)

    //Otros
    calcularOtrosDerivados(ficha)
    aplicarOtrosMods(ficha)
}

/* ===================== DERIVADOS BÁSICOS ===================== */

function calcularDerivadosBasicos(ficha) {
    const d = ficha.derivados

    d.bh = Math.ceil(ficha.nivel / 2) + ficha.modificadores.bh
    d.vit = ficha.pokedex.vit + ficha.modificadores.vit
    d.cantidadDotes = Math.floor((ficha.nivel + 1) / 4)
}

/* ===================== LIMITADORES ===================== */

function recortarArray(arr, max) {
    while (arr.length > max) arr.pop()
}

/* ===================== STATS ===================== */

function calcularStats(ficha) {
    for (const stat in ficha.derivados.stats) {
        const base = ficha.pokedex.statsBase[stat] || 0
        const mejoras = ficha.personaliz.mejorasEst.filter(s => s === stat).length
        ficha.derivados.stats[stat] = base + mejoraToValor(mejoras)
    }

    // --- Mods extra ---
    for (const stat in ficha.derivados.stats) {
        const mod = ficha.modificadores.stats[stat] || 0
        ficha.derivados.stats[stat] += mod
    }
}

function mejoraToValor(m) {
    if (m < 0) return 0
    if (m <= 3) return m
    if (m === 4) return 3
    return 4
}

function calcularPVyPP(ficha) {
    const d = ficha.derivados
    const stats = d.stats
    d.pvMax = 10 + ficha.nivel * (d.vit + stats.res) + ficha.modificadores.pvMax
    d.ppMax = stats.esp + ficha.nivel - Math.max(d.fatiga, 0) + ficha.modificadores.ppMax
}

/* ===================== SALVACIONES ===================== */

function calcularSalvaciones(ficha) {
    const d = ficha.derivados

    for (const stat in d.salvaciones) {
        d.salvaciones[stat] =
            (d.stats[stat] || 0) +
            d.bh +
            ficha.pokedex.salvaciones[stat] +
            ficha.personaliz.salvaciones[stat] -
            Math.max(d.fatiga, 0)
    }
}

/* ===================== CHECKS ===================== */
function actualizarChecks(ficha) {
    quitarMejorasInutiles(ficha)
    construirChecksBase(ficha)
    construirChecksData(ficha)
}

function quitarMejorasInutiles(ficha) {
    ficha.personaliz.mejorasHab = ficha.personaliz.mejorasHab.filter(m => {
        const check = ficha.checks.checksData.find(c => c.check === m)
        return check && check.visible === true
    })
}

function construirChecksBase(ficha) {
    const base = [
        { check: 'Percepción', grado: 1, stat: 'esp' },
        { check: 'Init', grado: 1, stat: 'agi' }
    ]

    // Añadir los checks de "naturalmente habil"
    ficha.pokedex.natHabil.forEach(buscado => {
        const existe = base.find(c => c.check === buscado.check)
        if (existe) existe.grado++
        else base.push({ check: buscado.check, grado: 1, stat: buscado.stat })
    })

    // Añadir el check de la naturaleza
    const naturaleza = ficha.personaliz.naturaleza
    if (naturaleza.check) {
        const existe = base.find(c => c.check === naturaleza.check)
        if (existe) existe.grado++
        else base.push({ check: naturaleza.check, grado: 1, stat: naturaleza.stat })
    }

    ficha.checks.checksBase = base
}


function construirChecksData(ficha) {
    let data = ficha.checks.checksData || []
    const bh = ficha.derivados.bh || 0
    const fatiga = Math.max(ficha.derivados.fatiga || 0, 0)
    const stats = ficha.derivados.stats || {}
    const checksBase = ficha.checks.checksBase || []
    const mejoras = ficha.personaliz?.mejorasHab || []

    //limpiamos grados
    data.forEach(d => { d.grado = 0 });

    const checksMap = new Map()
    data.forEach(d => checksMap.set(d.check, d))


    //Metemos los base
    checksBase.forEach(c => {
        let checkData = checksMap.get(c.check)
        if (!checkData) {
            checkData = { check: c.check, stat: c.stat, grado: c.grado, bono: 0, visible: true }
            checksMap.set(c.check, checkData)
        }
        else {
            checkData.grado = c.grado
            checkData.visible = true
        }
    })

    // Aplicar mejorasHab
    mejoras.forEach(nombreCheck => {
        let checkData = checksMap.get(nombreCheck)
        if (!checkData) {
            const base = checksBase.find(c => c.check === nombreCheck)
            checkData = {
                check: nombreCheck,
                grado: 0,
                bono: 0,
                stat: base?.stat || 'fue',
                visible: true
            }
            checksMap.set(nombreCheck, checkData)
        }
        checkData.grado = (checkData.grado || 0) + 1
    })

    // Calcular bono para todos los checks
    checksMap.forEach(checkData => {
        const statVal = stats[checkData.stat] || 0
        const bonoGrado = checkData.grado > 0
            ? bh + Math.min(Math.max(0, (checkData.grado - 1) * 2), 6)
            : 0
        checkData.bono = statVal + bonoGrado - fatiga
    })


    // Guardar de nuevo como array
    ficha.checks.checksData = Array.from(checksMap.values())
}



/* ===================== OTROS DERIVADOS ===================== */

function calcularOtrosDerivados(ficha) {
    const d = ficha.derivados

    d.sentidos = calcularSentidos(ficha)

    d.cantidadMovs = Math.min(2 + d.bh, 6)

    recortarArray(
        ficha.personaliz.movimientosAprendidos,
        d.cantidadMovs
    )

    for (const vel in d.velocidades)
        d.velocidades[vel] =
            ficha.pokedex.velocidades[vel]
}

function calcularSentidos(ficha) {
    const base = ficha.pokedex.otros.sentidos || ''
    const extra = ficha.personaliz.sentidos || ''
    return base ? base + (extra ? ', ' + extra : '') : extra
}

/* ===================== EVA ===================== */

function calcularEVA(ficha) {
    const calculos = ficha.pokedex.calculosEva
    const stats = ficha.derivados.stats
    if (!Array.isArray(calculos) || !calculos.length) return

    if (ficha.derivados.evaElegida >= calculos.length)
        ficha.derivados.evaElegida = 0

    const calcularValor = formula =>
        formula.split('+').reduce((acc, partRaw) => {
            const part = partRaw.trim()
            if (!isNaN(part)) return acc + parseInt(part)
            return acc + (stats[part.toLowerCase()] ?? 0)
        }, 0)

    const resultados = calculos.map(f => ({
        formula: f,
        valor: calcularValor(f)
    }))

    ficha.derivados.evasiones = resultados

    const idx = ficha.derivados.evaElegida ?? 0
    ficha.derivados.evasion =
        (resultados[idx]?.valor ?? 0) +
        ficha.derivados.bh -
        Math.max(ficha.derivados.fatiga, 0) +
        (ficha.modificadores.evasion || 0)
}


/* ===================== EVA ===================== */

function aplicarOtrosMods(ficha) {
    const mods = ficha.modificadores
    const velocidadesMods = mods.velocidades



    // --- Velocidades ---
    for (const vel in ficha.derivados.velocidades) {
        const mod = velocidadesMods[vel] || 0
        ficha.derivados.velocidades[vel] += mod
    }
}