//ESTE SCRIPT DA ERRORES PONIENDO CABECERAS EN EL SERVER QUE SE USE AL DESPLEGAR. En concreto, estas:
//Cross-Origin-Opener-Policy: same-origin
//Cross-Origin-Embedder-Policy: require-corp
import { ref } from 'vue'
import { sqlite3Worker1Promiser } from '@sqlite.org/sqlite-wasm'

const databaseConfig = {
    filename: 'file:mydb.sqlite3?vfs=opfs',
    tables: {
        test: {
            name: 'test_table',
            schema: `
        CREATE TABLE IF NOT EXISTS test_table (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
        },
    },
}

export function useSQLite() {
    const isLoading = ref(false)
    const error = ref(null)
    const isInitialized = ref(false)

    let promiser = null
    let dbId = null

    async function initialize() {
        console.log('Inicializando worker...');
        if (isInitialized.value) return true

        isLoading.value = true
        error.value = null

        try {
            promiser = await new Promise((resolve) => {
                const _promiser = sqlite3Worker1Promiser({
                    onready: () => resolve(_promiser),
                })
            })

            if (!promiser) throw new Error('Failed to initialize promiser')

            await promiser('config-get', {})
            const openResponse = await promiser('open', {
                filename: databaseConfig.filename,
            })

            if (openResponse.type === 'error') {
                throw new Error(openResponse.result.message)
            }

            dbId = openResponse.result.dbId

            await promiser('exec', {
                dbId,
                sql: databaseConfig.tables.test.schema,
            })

            isInitialized.value = true
            console.log('Worker inicializado:', promiser)
            return true
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Unknown error')
            throw error.value
        } finally {
            isLoading.value = false
        }
    }

    async function executeQuery(sql, params = []) {
        if (!dbId || !promiser) {
            await initialize()
        }

        isLoading.value = true
        error.value = null

        try {
            const result = await promiser('exec', {
                dbId,
                sql,
                bind: params,
                returnValue: 'resultRows',
            })

            if (result.type === 'error') {
                throw new Error(result.result.message)
            }

            return result
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Query execution failed')
            throw error.value
        } finally {
            isLoading.value = false
        }
    }

    async function clearDatabase() { //NO FUFA
        console.log("He entrao.");

        // Si el promiser no está inicializado, inicialízalo
        if (!promiser) {
            await initialize();
        }

        // Intenta cerrar la base de datos si está abierta
        if (dbId) {
            try {
                await promiser('close', { dbId });
            } catch (e) {
                // Ignora errores al cerrar
            }
            dbId = null;
            isInitialized.value = false;
        }

        // Intenta eliminar el archivo de la base de datos
        try {
            const unlinkResult = await promiser('unlink', {
                filename: databaseConfig.filename,
            });

            // Si hay error y no es "no such file", lanza el error
            if (unlinkResult.type === 'error' && !/no such file/i.test(unlinkResult.result?.message || '')) {
                throw new Error(unlinkResult.result?.message || 'Error al eliminar la base de datos');
            }
        } catch (err) {
            // Busca el mensaje en err.message o err.result?.message
            const msg = err?.message || err?.result?.message || '';
            if (!/no such file/i.test(msg)) {
                throw err;
            }
        }

        // Reinicia completamente el promiser y el estado
        promiser = null;
        dbId = null;
        isInitialized.value = false;

        // Vuelve a inicializar la base de datos vacía
        await initialize();
        console.log("Base recreada.");
    }


    return {
        isLoading,
        error,
        isInitialized,
        executeQuery,
        clearDatabase
    }
}