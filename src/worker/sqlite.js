//ESTE SCRIPT DA ERRORES PONIENDO CABECERAS EN EL SERVER QUE SE USE AL DESPLEGAR. En concreto, estas:
//Cross-Origin-Opener-Policy: same-origin
//Cross-Origin-Embedder-Policy: require-corp
import { ref } from 'vue'
import { sqlite3Worker1Promiser } from '@sqlite.org/sqlite-wasm'

const databaseConfig = {
    filename: ':memory:',
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
    const downloadUrl = ref(null)

    let promiser = null
    let dbId = null

    async function initialize(buffer = null) {
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

            const openArgs = {
                filename: databaseConfig.filename,
            }

            if (buffer instanceof Uint8Array) {
                openArgs.database = buffer
            }

            const openResponse = await promiser('open', openArgs)
            if (openResponse.type === 'error') {
                throw new Error(openResponse.result.message)
            }

            dbId = openResponse.result.dbId

            if (!buffer) {
                await promiser('exec', {
                    dbId,
                    sql: databaseConfig.tables.test.schema,
                })
            }

            isInitialized.value = true
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Unknown error')
            throw error.value
        } finally {
            isLoading.value = false
        }
    }

    async function executeQuery(sql, params = []) {
        if (!isInitialized.value) await initialize()

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

    async function loadDatabaseFromFile(file) {
        try {
            const arrayBuffer = await file.arrayBuffer()
            const uint8array = new Uint8Array(arrayBuffer)
            await initialize(uint8array)
            // Verificar tablas existentes
            const tables = await executeQuery("PRAGMA table_list;");
            console.log('Tablas PRAGMA:', tables);
            const allSchemas = await executeQuery("SELECT DISTINCT name FROM sqlite_schema");
            console.log('Schemas:', allSchemas);
        } catch (err) {
            console.error("❌ Error al cargar la base de datos:", err)
        }
    }

    async function exportDatabase() {
        if (!promiser || !dbId) return

        const exportResult = await promiser('export', { dbId })
        if (exportResult.type === 'error') {
            throw new Error(exportResult.result.message)
        }

        const blob = new Blob([exportResult.result.buffer], {
            type: 'application/octet-stream',
        })

        if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value)
        downloadUrl.value = URL.createObjectURL(blob)
    }

    return {
        isLoading,
        error,
        isInitialized,
        executeQuery,
        loadDatabaseFromFile,
        exportDatabase,
        downloadUrl,
    }
}