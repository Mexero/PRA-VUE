import { promises as fs } from 'fs';
import path from 'path';

const DIST_DIR = './dist';
const OUTPUT_FILE = 'file-index.json';

/**
 * Recorre recursivamente todos los archivos dentro de un directorio.
 * Devuelve rutas relativas tipo "/assets/img.png"
 */
async function getAllFiles(dir, baseDir = dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    let files = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const subFiles = await getAllFiles(fullPath, baseDir);
            files = files.concat(subFiles);
        } else if (entry.isFile()) {
            const relative = path.relative(baseDir, fullPath).replace(/\\/g, '/');
            // Filtra los archivos que están en la raíz (no contienen "/")
            if (relative.includes('/')) {
                files.push('/' + relative);
            }
        }
    }

    return files;
}

async function generateFileIndex() {
    try {
        const allFiles = await getAllFiles(path.resolve(DIST_DIR));
        const outputPath = path.join(DIST_DIR, OUTPUT_FILE);

        await fs.writeFile(outputPath, JSON.stringify(allFiles, null, 2), 'utf-8');

        console.log(`✅ Índice generado con ${allFiles.length} archivos (sin raíz).`);
        console.log(`📄 Guardado en: ${outputPath}`);
    } catch (err) {
        console.error('❌ Error generando el índice:', err);
    }
}

generateFileIndex();