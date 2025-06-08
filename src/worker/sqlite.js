import initSqlJs from 'sql.js';

let db;

onmessage = async (e) => {
    const { type, query, params } = e.data;

    if (type === 'init') {
        const SQL = await initSqlJs({
            locateFile: (file) => `/sqljs/${file}`
        });

        // Fetch .sqlite3 file
        const response = await fetch('/data/mydata.sqlite3');
        const buffer = await response.arrayBuffer();

        db = new SQL.Database(new Uint8Array(buffer));

        postMessage({ type: 'ready' });
    }

    if (type === 'query') {
        const result = db.exec(query, params);
        db.exec("VACUUM;"); //no borrar esto. Hace que si la consulta modifica datos estos no generen datos fantasma
        //por ejemplo: si cambio Absorbe agua de habilidades con Update y no hago VACUUM, al exportar tendré 2 resultados, en nuevo y el viejo
        //En despliegue, no será necesario pq no queremos poder modificar.
        postMessage({ type: 'result', result });
    }

    //exportar base de datos. Importante pq esta no se modifica, sino que solo hace los cambios en memoria en principio.
    if (type === 'export') {
        try {
            const data = db.export();

            postMessage({ type: 'exported', buffer: data.buffer }, [data.buffer]);
        } catch (err) {
            postMessage({ type: 'error', error: err.message });
        }
    }
};