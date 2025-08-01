import initSqlJs from 'sql.js';

let db;
let isReady = false;

onmessage = async (e) => {
    const { type, query, params, origin } = e.data;

    try {
        if (type === 'init') {
            if (isReady) {
                postMessage({ type: 'ready', origin });
                return;
            }

            const SQL = await initSqlJs({
                locateFile: (file) => `/sqljs/${file}`
            });

            const response = await fetch('/data/mydata.sqlite3');
            const buffer = await response.arrayBuffer();

            db = new SQL.Database(new Uint8Array(buffer));
            isReady = true;

            postMessage({ type: 'ready', origin });
        }

        else if (type === 'query') {
            if (!isReady || !db) {
                throw new Error('Database not initialized');
            }

            const result = db.exec(query, params);
            db.exec("VACUUM;");

            postMessage({ type: 'result', origin, result });
        }

        else if (type === 'export') {
            if (!isReady || !db) {
                throw new Error('Database not initialized');
            }

            const data = db.export();
            postMessage({ type: 'exported', buffer: data.buffer }, [data.buffer]);
        }

        else {
            throw new Error(`Unknown message type: ${type}`);
        }

    } catch (err) {
        postMessage({ type: 'error', error: err.message });
    }
};
