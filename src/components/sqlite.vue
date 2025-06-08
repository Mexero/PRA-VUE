<script setup>
import { ref, onMounted } from 'vue';
import worker from '../sqlWorker.js';

const isReady = ref(false);
const results = ref([]);
const error = ref(null);
const loading = ref(false);

const query = ref('SELECT * FROM my_table LIMIT 10');

onMounted(() => {
    worker.postMessage({ type: 'init' });

    worker.onmessage = (e) => {
        if (e.data.type === 'ready') {
            isReady.value = true;
        }

        if (e.data.type === 'result') {
            loading.value = false;
            results.value = e.data.result?.[0]?.values || [];
        }

        if (e.data.type === 'error') {
            loading.value = false;
            error.value = e.data.error;
        }

        if (e.data.type === 'exported') {
            loading.value = false;
            error.value = null;
            const blob = new Blob([new Uint8Array(e.data.buffer)], {
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
        }
    };
});


function runQuery() {
    if (!isReady.value) return;
    loading.value = true;
    error.value = null;

    worker.postMessage({
        type: 'query',
        query: query.value,
        params: []
    });
}

function exportDatabase() {
    if (!isReady.value) return;
    loading.value = true;
    error.value = null;
    worker.postMessage({ type: 'export' });
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
        <p v-if="error">{{ error }}</p>

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