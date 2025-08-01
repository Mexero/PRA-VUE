<script setup>
import { ref, onMounted } from 'vue';
import { initDB, queryDB, exportDB } from '@/services/dbWorkerService';

const isReady = ref(false);
const results = ref([]);
const error = ref(null);
const loading = ref(false);

const query = ref('SELECT * FROM my_table LIMIT 10');

onMounted(async () => {
    try {
        await initDB();
        isReady.value = true;
    } catch (err) {
        error.value = err.message || 'Error inicializando DB';
    }
});

async function runQuery() {
    if (!isReady.value) return;
    loading.value = true;
    error.value = null;

    try {
        const res = await queryDB(query.value);
        results.value = res?.[0]?.values || [];
    } catch (err) {
        error.value = err.message || 'Error realizando query';
    } finally {
        loading.value = false;
    }
}

async function exportDatabase() {
    if (!isReady.value) return;
    loading.value = true;
    error.value = null;

    try {
        const buffer = await exportDB();
        const blob = new Blob([new Uint8Array(buffer)], {
            type: 'application/x-sqlite3'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exported_db.sqlite3';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        error.value = err.message || 'Error exportando DB';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div>
        <h2>Consulta SQLite</h2>

        <textarea v-model="query" rows="4" placeholder="Escribe una consulta SQL"></textarea>

        <button @click="runQuery" :disabled="!isReady || loading">
            Ejecutar Consulta
        </button>
        <button @click="exportDatabase" :disabled="!isReady || loading">
            Exportar Base de Datos
        </button>

        <p v-if="loading">Cargando...</p>
        <p v-if="error" style="color: red;">{{ error }}</p>

        <table v-if="results.length">
            <tbody>
                <tr v-for="(row, i) in results" :key="i">
                    <td v-for="(cell, j) in row" :key="j">
                        {{ cell }}
                    </td>
                </tr>
            </tbody>
        </table>

        <p v-if="!results.length && !loading && isReady">Sin resultados.</p>
    </div>
</template>
