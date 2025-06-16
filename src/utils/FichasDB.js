const DB_NAME = 'FichasDB';
const DB_VERSION = 1;
const STORE_NAME = 'fichas';
const CONFIG_STORE_NAME = 'config';

// Abrir la base de datos
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = event => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'nombre' });
            }

            if (!db.objectStoreNames.contains(CONFIG_STORE_NAME)) {
                db.createObjectStore(CONFIG_STORE_NAME);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Guardar una ficha individual
export async function guardarFichaIndexedDB(ficha) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(ficha);

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// Borrar una ficha por nombre
export async function borrarFichaIndexedDB(nombre) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(nombre);

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// Obtener todas las fichas
export async function obtenerTodasLasFichas() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Obtener una ficha específica por nombre
export async function obtenerFicha(nombre) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(nombre);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Guardar el orden de fichas (como un array de strings)
export async function guardarOrdenFichas(orden) {
    const db = await openDB();
    const tx = db.transaction(CONFIG_STORE_NAME, 'readwrite');
    const store = tx.objectStore(CONFIG_STORE_NAME);

    const ordenPlano = Array.isArray(orden) ? [...orden] : [];

    store.put(ordenPlano, 'ordenFichas');

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// Cargar el orden de fichas
export async function cargarOrdenFichas() {
    const db = await openDB();
    const tx = db.transaction(CONFIG_STORE_NAME, 'readonly');
    const request = tx.objectStore(CONFIG_STORE_NAME).get('ordenFichas');

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            const resultado = request.result;
            resolve(Array.isArray(resultado) ? resultado : []);
        };
        request.onerror = () => reject(request.error);
    });
}
