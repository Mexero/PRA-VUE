import { SitemapStream, streamToPromise } from 'sitemap'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generateSitemap() {
    try {
        const hostname = 'https://tudominio.com'
        const sitemapStream = new SitemapStream({ hostname })

        const routes = [
            '/',
            '/clases',
            '/capitulos/introduccion',
            '/capitulos/clases',
            '/capitulos/combate',
            '/capitulos/comojugar',
            '/capitulos/concursos',
            '/capitulos/creacionpj',
            '/capitulos/dirigir',
            '/capitulos/objetos',
            '/capitulos/movhabdot',
            '/capitulos/otrasreglas',
            '/capitulos/pokemon',
            '/dotes',
            '/movimientos',
            '/habilidades',
            '/objetos',
            '/pokedex',
            '/reglas',
            '/utilidades/fichasPokemon',
            '/movarmas',
            '/movz',
            '/tablatipos'
        ]

        for (const url of routes) {
            sitemapStream.write({ url, changefreq: 'weekly', priority: 0.8 })
        }
        sitemapStream.end()

        const sitemapOutput = await streamToPromise(sitemapStream)

        const filepath = resolve(__dirname, '../public/sitemap.xml')
        writeFileSync(filepath, sitemapOutput)

        console.log('✅ Sitemap generado en public/sitemap.xml')
    } catch (error) {
        console.error('❌ Error generando sitemap:', error)
    }
}

generateSitemap()
