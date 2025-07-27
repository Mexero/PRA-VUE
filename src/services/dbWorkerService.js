import SqlWorker from '../worker/sqlite.js?worker';

let dbWorker = null;
let callbacks = {};
let messageId = 0;
let dbReady = false;
let dbInitPromise = null;

function initWorker() {
    if (dbWorker) return dbWorker;

    dbWorker = new SqlWorker();

    dbWorker.onmessage = (event) => {
        const { type, origin, result, buffer, error } = event.data;

        if (error) {
            if (origin && callbacks[origin]) {
                callbacks[origin].reject(error);
                delete callbacks[origin];
            }
            return;
        }

        switch (type) {
            case 'ready':
                dbReady = true;
                if (origin && callbacks[origin]) {
                    callbacks[origin].resolve('DB ready');
                    delete callbacks[origin];
                }
                break;

            case 'result':
                if (origin && callbacks[origin]) {
                    callbacks[origin].resolve(result);
                    delete callbacks[origin];
                }
                break;

            case 'exported':
                if (origin && callbacks[origin]) {
                    callbacks[origin].resolve(buffer);
                    delete callbacks[origin];
                }
                break;

            default:
                console.warn(`Unknown message type from worker: ${type}`);
        }
    };

    return dbWorker;
}

export function initDB() {
    if (dbReady) return Promise.resolve('DB already initialized');
    if (dbInitPromise) return dbInitPromise;

    const worker = initWorker();
    const origin = `init_${messageId++}`;

    dbInitPromise = new Promise((resolve, reject) => {
        callbacks[origin] = { resolve, reject };
        worker.postMessage({ type: 'init', origin });
    });

    return dbInitPromise;
}

export async function queryDB(query, params = []) {
    await initDB();
    const worker = initWorker();
    const origin = `query_${messageId++}`;

    return new Promise((resolve, reject) => {
        callbacks[origin] = { resolve, reject };
        worker.postMessage({ type: 'query', query, params, origin });
    });
}

export async function exportDB() {
    await initDB();
    const worker = initWorker();
    const origin = `export_${messageId++}`;

    return new Promise((resolve, reject) => {
        callbacks[origin] = { resolve, reject };
        worker.postMessage({ type: 'export', origin });
    });
}
