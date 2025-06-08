const worker = new Worker(new URL('./worker/sqlite.js', import.meta.url), {
    type: 'module',
});

export function exportDb() {
    worker.postMessage({ type: 'export' });
}

export default worker;