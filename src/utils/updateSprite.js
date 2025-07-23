function normalizePokemonName(displayName) {
    return displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-+|-+$)/g, '')
}

async function getSpriteUrl(displayName) {
    const apiName = normalizePokemonName(displayName)
    const url = `https://pokeapi.co/api/v2/pokemon-form/${apiName}`

    try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`No se encontró: ${apiName}`)
        const data = await res.json()
        return data.sprites.front_default
    } catch (error) {
        console.error(error.message)
        return null
    }
}

export async function updateSprite(propEspecie, propEsAlternativo, numPokedex) {
    let src
    if (propEsAlternativo === '1') {
        let especie = propEspecie.toLowerCase().trim()
        let nombre
        switch (true) {
            case especie.includes('tauros'):
                if (especie.includes('acu')) src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10252.png'
                else if (especie.includes('ard')) src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10251.png'
                else src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10250.png'
                break;
            case especie.includes('zygarde'):
                if (especie.includes('10%')) src = 'https://static.wikia.nocookie.net/pokemonwack/images/6/65/1327.png'
                else if (especie.includes('núcleo')) src = 'https://static.wikia.nocookie.net/pokemonwack/images/9/9c/1329.png'
                else if (especie.includes('completo')) nombre = 'zygarde complete'
                break;
            case especie.includes('wishiwashi'):
                nombre = 'wishiwashi school'
                break;
            case especie.includes('farfet'):
                nombre = 'farfetchd galar'
                break;
            case especie.includes('darmanitan'):
                src = 'https://pokeapi.co/api/v2/pokemon-form/10336/'
                break;
            case especie.includes(' de '):
                nombre = especie.replace(' de ', ' ')
                break;
            case especie.includes('mega'):
                nombre = especie.split(' ')[0] + ' mega' + (especie.includes(' x') ? ' x' : '') + (especie.includes(' y') ? ' y' : '')
                break;
            case especie.includes('primigenio'):
                nombre = especie.split(' ')[0] + ' primal'
                break;
            case especie.includes(' origen'):
                nombre = especie.split(' ')[0] + ' origin'
                break;
            case especie.includes(' tótem'):
                nombre = especie.split(' ')[0] + ' therian'
                break;
            case especie.includes('suprem'):
                if (especie.includes('zamazenta')) nombre = 'zamazenta crowned'
                else nombre = 'zacian crowned'
                break;
            case especie.includes('necrozma'):
                if (especie.includes('crepusc')) nombre = 'necrozma dusk'
                else if (especie.includes('alba')) nombre = 'necrozma dawn'
                else nombre = 'necrozma ultra'
                break;
            case especie.includes('wormadam'):
                const forma = especie.split(' ')[2]
                if (forma === 'arena') nombre = 'wormadam sandy'
                else nombre = 'wormadam trash'
                break;
            case especie.includes('kyurem'):
                if (especie.includes('negro')) nombre = 'kyurem black'
                else nombre = 'kyurem white'
                break;
            case especie.includes('lycanroc'):
                if (especie.includes('nocturno')) nombre = 'lycanroc midnight'
                else nombre = 'lycanroc dusk'
                break;
            case especie.includes('shaymin'):
                nombre = 'shaymin sky'
                break;
            case especie.includes('keldeo'):
                nombre = 'keldeo resolute'
                break;
            case especie.includes('meloetta'):
                nombre = 'meloetta pirouette '
                break;
            case especie.includes('meowstic'):
                nombre = 'meowstic female'
                break;
            case especie.includes('hoopa'):
                nombre = 'hoopa unbound'
                break;
            case especie.includes('toxtricity'):
                nombre = 'toxtricity low key'
                break;
            case especie.includes('eternatus'):
                nombre = 'eternatus eternamax'
                break;
            case especie.includes('indeedee'):
                nombre = 'indeedee female'
                break;
            case especie.includes('morpeko'):
                nombre = 'morpeko hangry'
                break;
            case especie.includes('urshifu'):
                nombre = 'urshifu rapid strike'
                break;
            case especie.includes('ursaluna'):
                nombre = 'ursaluna bloodmoon'
                break;
            case especie.includes('oinkologne'):
                src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10254.png'
                break;
            case especie.includes('palafin'):
                src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10256.png'
                break;
            case especie.includes('ogerpon'):
                if (especie.includes('fuente')) src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10273.png'
                else if (especie.includes('horno')) src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10274.png'
                else if (especie.includes('cimiento')) src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10275.png'
                else src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1017.png'
                break;
            case especie.includes('terapagos'):
                if (especie.includes('teracristal')) src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10276.png'
                else src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10277.png'
                break;
            default:
                console.warn('TONTO', propEspecie)
                nombre = 'pikachu'
        }

        if (nombre) {
            src = await getSpriteUrl(nombre)
        }
    } else {
        const num = parseInt(numPokedex.substring(1))
        src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${num}.png`
    }
    return src
}