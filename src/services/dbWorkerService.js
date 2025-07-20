// src/services/dbWorkerService.js
import SqlWorker from '../worker/sqlite.js?worker';

let dbWorker = null;
let callbacks = {};
let messageId = 0;
let dbInitialized = false;

function initWorker() {
    if (dbWorker) return dbWorker;

    dbWorker = new SqlWorker();

    dbWorker.onmessage = (event) => {
        const { type, origin, result, buffer, error } = event.data;

        if (type === 'ready') {
            dbInitialized = true;
            if (callbacks['init']) {
                callbacks['init'].resolve('DB ready');
                delete callbacks['init'];
            }
        } else if (type === 'result') {
            if (origin && callbacks[origin]) {
                callbacks[origin].resolve(result);
                delete callbacks[origin];
            }
        } else if (type === 'exported') {
            if (callbacks['export']) {
                callbacks['export'].resolve(buffer);
                delete callbacks['export'];
            }
        } else if (type === 'error') {
            Object.keys(callbacks).forEach(key => {
                callbacks[key].reject(error);
                delete callbacks[key];
            });
        }
    };

    return dbWorker;
}

export function initDB() {
    if (dbInitialized) return Promise.resolve('DB already initialized');

    const worker = initWorker();
    return new Promise((resolve, reject) => {
        callbacks['init'] = { resolve, reject };
        worker.postMessage({ type: 'init' });
    });
}

export function queryDB(query, params = []) {
    const worker = initWorker();
    const origin = `msg_${messageId++}`;

    return new Promise((resolve, reject) => {
        callbacks[origin] = { resolve, reject };
        worker.postMessage({ type: 'query', query, params, origin });
    });
}

export function exportDB() {
    const worker = initWorker();

    return new Promise((resolve, reject) => {
        callbacks['export'] = { resolve, reject };
        worker.postMessage({ type: 'export' });
    });
}
