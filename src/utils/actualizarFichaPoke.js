export function actualizar(ficha) {
    calcularDerivadosBasicos(ficha)
    aplicarLimitadores(ficha)
    calcularStats(ficha)
    calcularSalvaciones(ficha)
    actualizarChecks(ficha)
    calcularOtrosDerivados(ficha)
    calcularEVA(ficha)
}

/* ===================== DERIVADOS BÁSICOS ===================== */

function calcularDerivadosBasicos(ficha) {
    const d = ficha.derivados
    const stats = d.stats

    d.bh = Math.ceil(ficha.nivel / 2)
    d.ppMax = stats.esp + ficha.nivel - Math.max(d.fatiga, 0)
    d.cantidadMejorasEST = 1 + Math.floor((ficha.nivel - 2) / 3)
    d.vit = ficha.pokedex.vit + ficha.personaliz.bonoVit
    d.pvMax = 10 + ficha.nivel * (d.vit + stats.res)
    d.cantidadDotes = Math.floor((ficha.nivel + 1) / 4)
    d.cantidadMejorasHab = Math.max(Math.floor(ficha.nivel / 6), 0)
}

/* ===================== LIMITADORES ===================== */

function aplicarLimitadores(ficha) {
    recortarArray(ficha.personaliz.mejorasEst, ficha.derivados.cantidadMejorasEST)
    recortarArray(ficha.personaliz.dotes, ficha.derivados.cantidadDotes)
    recortarArray(ficha.personaliz.mejorasHab, ficha.derivados.cantidadMejorasHab)
}

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
}

function mejoraToValor(m) {
    if (m < 0) return 0
    if (m <= 3) return m
    if (m === 4) return 3
    return 4
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
    construirChecksBase(ficha)
    construirChecksData(ficha)
    construirChecksActivos(ficha)
}

function construirChecksBase(ficha) {
    const base = [
        { check: 'Percepción', grado: 1 },
        { check: 'Init', grado: 1 }
    ]

    // Añadir los checks de "naturalmente habil"
    ficha.pokedex.natHabil.forEach(nombre => {
        const existing = base.find(c => c.check === nombre)
        if (existing) existing.grado++
        else base.push({ check: nombre, grado: 1 })
    })

    // Añadir el check de la naturaleza
    const natCheck = ficha.personaliz.naturaleza?.check
    if (natCheck) {
        const existing = base.find(c => c.check === natCheck)
        if (existing) existing.grado = Math.max(existing.grado, 1)
        else base.push({ check: natCheck, grado: 1 })
    }

    ficha.checks.checksBase = base
}

function construirChecksData(ficha) {
    const data = ficha.checks.checksData || {}

    const bh = ficha.derivados.bh || 0
    const fatiga = Math.max(ficha.derivados.fatiga || 0, 0)
    const stats = ficha.derivados.stats

    // Crear o actualizar los checks base
    ficha.checks.checksBase.forEach(c => {
        if (!data[c.check]) data[c.check] = {}
        data[c.check].grado = Math.max(data[c.check].grado || 0, c.grado)
        if (!data[c.check].stat) data[c.check].stat = 'fue'
        const statVal = stats[data[c.check].stat] || 0
        const bonoGrado = data[c.check].grado > 0 ? bh + Math.min(Math.max(0, (data[c.check].grado - 1) * 2), 6) : 0
        data[c.check].bono = statVal + bonoGrado - fatiga
    })

    ficha.checks.checksData = data
}


function construirChecksActivos(ficha) {
    // Activos = solo los checks base
    ficha.checks.checksActivos = ficha.checks.checksBase.map(c => c.check)
}

/* ===================== OTROS DERIVADOS ===================== */

function calcularOtrosDerivados(ficha) {
    const d = ficha.derivados

    d.sentidos = calcularSentidos(ficha)

    d.cantidadMovs =
        Math.min(2 + d.bh, 8) +
        Math.max(Math.floor(d.stats.men / 4), 0)

    recortarArray(
        ficha.personaliz.movimientosAprendidos,
        d.cantidadMovs
    )

    for (const vel in d.velocidades)
        d.velocidades[vel] =
            ficha.pokedex.velocidades[vel] +
            ficha.personaliz.mejorasVelocidades[vel]
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

    if (ficha.derivados.caElegida >= calculos.length)
        ficha.derivados.caElegida = 0

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

    ficha.derivados.cas = resultados

    const idx = ficha.derivados.caElegida ?? 0
    ficha.derivados.ca =
        (resultados[idx]?.valor ?? 0) +
        ficha.derivados.bh -
        Math.max(ficha.derivados.fatiga, 0)
}