<script setup>
import { ref } from 'vue'
import { useSQLite } from '@/worker/sqlite.js'

const {
    isLoading,
    error,
    executeQuery,
    loadDatabaseFromFile,
    exportDatabase,
    downloadUrl,
} = useSQLite()

const sqlQuery = ref('SELECT * FROM test_table')
const queryResult = ref([])
const queryError = ref(null)
const selectedFile = ref(null)

const exampleQueries = [
    { title: 'Select all', query: 'SELECT * FROM test_table' },
    { title: 'Insert', query: "INSERT INTO test_table (name) VALUES ('New Test Item')" },
    { title: 'Update', query: "UPDATE test_table SET name = 'Updated Item' WHERE name LIKE 'New%'" },
    { title: 'Delete', query: "DELETE FROM test_table WHERE name = 'Updated Item'" },
]

async function runQuery() {
    queryError.value = null
    queryResult.value = []

    try {
        const result = await executeQuery(sqlQuery.value)
        const isSelect = sqlQuery.value.trim().toLowerCase().startsWith('select')

        if (isSelect) {
            queryResult.value = result?.result?.resultRows || []
        } else {
            queryResult.value = (await executeQuery('SELECT * FROM test_table'))?.result?.resultRows || []
        }
    } catch (err) {
        queryError.value = err instanceof Error ? err.message : 'An error occurred'
    }
}

async function handleFileChange(event) {
    const file = event.target.files[0]
    if (!file) return
    await loadDatabaseFromFile(file)
    await runQuery()
}

async function exportDb() {
    await exportDatabase()
}
</script>

<template>
    <div>
        <h2>SQLite Playground</h2>

        <div>
            <label>📂 Cargar base de datos:</label>
            <input type="file" accept=".sqlite3,.db" @change="handleFileChange" />
        </div>

        <div>
            <h3>Example Queries:</h3>
            <div>
                <button v-for="example in exampleQueries" :key="example.title" @click="sqlQuery = example.query">
                    {{ example.title }}
                </button>
            </div>
        </div>

        <div>
            <textarea v-model="sqlQuery" rows="4" :disabled="isLoading"></textarea>
            <button :disabled="isLoading" @click="runQuery">
                {{ isLoading ? 'Running...' : 'Run Query' }}
            </button>
        </div>

        <div v-if="error || queryError">
            {{ error?.message || queryError }}
        </div>

        <div v-if="queryResult.length">
            <h3>Results:</h3>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th v-for="column in Object.keys(queryResult[0])" :key="column">
                                {{ column }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in queryResult" :key="index">
                            <td v-for="column in Object.keys(row)" :key="column">
                                {{ row[column] }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="downloadUrl">
            <a :href="downloadUrl" download="modificada.sqlite3">
                💾 Descargar base de datos modificada
            </a>
        </div>
        <button @click="exportDb">Exportar base modificada</button>
    </div>
</template>