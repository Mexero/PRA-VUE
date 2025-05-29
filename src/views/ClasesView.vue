<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Router y estado
const router = useRouter();
const route = useRoute();
const claseCargada = ref('');
const claseCargando = ref(false);
const pendientes = ref([]);

// Datos de clase
const tabla = ref({ titulos: [], filas: [] });
const descripcion = ref([]);
const tiradas = ref({ nombre: '', descripcion: [] });
const rasgos = ref([]);
const subclasesIndex = ref([]);
const listaMovimientos = ref([]);
const subclasesCargadas = ref([]);

// ========== CARGA DE CLASE ==========
async function cargarClase(clase) {
    if (clase === claseCargada.value) return;

    claseCargando.value = true;
    try {
        const res = await fetch(`data/json/clases/${clase}/${clase}.json`);
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json();
        subclasesCargadas.value = [];
        claseCargada.value = clase;
        tabla.value = data.tablaClase;
        descripcion.value = data.descripcion;
        tiradas.value = data.tiradasSalvacion;
        rasgos.value = data.rasgos;
        subclasesIndex.value = data.subclases;
        listaMovimientos.value = data.ListaMovimientos ?? [];

        updateClaseQuery(clase);
    } catch (err) {
        console.error("Error al cargar clase:", err);
    }
    claseCargando.value = false;
}

// ========== CARGA Y TOGGLE DE SUBCLASE ==========
async function toggleSubclase(ruta) {
    if (claseCargando.value) {
        if (!pendientes.value.includes(ruta)) pendientes.value.push(ruta);
        return;
    }

    const existente = subclasesCargadas.value.find(s => s.ruta === ruta);
    if (existente) {
        existente.activo = !existente.activo;
    } else {
        try {
            const res = await fetch(`/data/json/clases/${claseCargada.value}/subclases/${ruta}.json`);
            const datos = await res.json();
            subclasesCargadas.value.push({ ruta, activo: true, subclase: datos });
        } catch (err) {
            console.error(`Error al cargar subclase "${ruta}":, err`);
        }
    }

    updateSubclasesQuery();
}

// ========== WATCHERS ==========
watch(() => route.query.clase, async (nuevaClase) => {
    const clase = nuevaClase || 'entrenador';
    await cargarClase(clase);

    const subclases = route.query.subclases
        ? Array.isArray(route.query.subclases)
            ? route.query.subclases
            : route.query.subclases.split(',')
        : [];

    await Promise.all(subclases.map(ruta => toggleSubclase(ruta)));
}, { immediate: true });

watch(() => route.query.subclases, async (nuevasSubclases) => {
    if (claseCargando.value) return;

    const rutasEnRuta = nuevasSubclases
        ? Array.isArray(nuevasSubclases)
            ? nuevasSubclases
            : nuevasSubclases.split(',')
        : [];

    await Promise.all(
        rutasEnRuta
            .filter(ruta => !subclasesCargadas.value.find(s => s.ruta === ruta && s.activo))
            .map(ruta => toggleSubclase(ruta))
    );

    for (const s of subclasesCargadas.value) {
        if (!rutasEnRuta.includes(s.ruta) && s.activo) {
            s.activo = false;
        }
    }
});

// ========== ACTUALIZA RUTA ==========
function updateClaseQuery(clase) {
    router.replace({ query: { ...route.query, clase } });
}

function updateSubclasesQuery() {
    const activas = subclasesCargadas.value.filter(s => s.activo).map(s => s.ruta);
    router.replace({
        query: {
            ...route.query,
            subclases: activas.length ? activas.join(',') : undefined
        }
    });
}

// ========== UTILIDAD ==========
function isSubclaseActiva(ruta) {
    return subclasesCargadas.value.find(s => s.ruta === ruta)?.activo;
}
</script>

<template>
    <h1 class="mainTitulo" id="top">Clases</h1>

    <div class="container">

        <div class="top-section">
            <div class="classes">
                <div @click="cargarClase('entrenador')"
                    :class="claseCargada === 'entrenador' ? 'class-active' : 'class-inactive'">
                    <div class="claseTitulo">Entrenador</div>
                    <Transition :name="'mostrarEntrenador'">
                        <div class="subclasses" v-if="claseCargada === 'entrenador'">
                            <div v-for="(subclase) in subclasesIndex" :key="subclase.ruta"
                                :class="isSubclaseActiva(subclase.ruta) ? 'subclas-active' : 'subclas-inactive'"
                                @click="e => toggleSubclase(subclase.ruta, e)">
                                {{ subclase.acortado }}
                            </div>
                        </div>
                    </Transition>
                </div>
                <div @click="cargarClase('inventor')"
                    :class="claseCargada === 'inventor' ? 'class-active' : 'class-inactive'">
                    <div class="claseTitulo">Inventor</div>
                    <Transition :name="'mostrarSubclases'">

                        <div class="subclasses" v-if="claseCargada === 'inventor'">
                            <div v-for="(subclase) in subclasesIndex" :key="subclase.ruta"
                                :class="isSubclaseActiva(subclase.ruta) ? 'subclas-active' : 'subclas-inactive'"
                                @click="e => toggleSubclase(subclase.ruta, e)">
                                {{ subclase.acortado }}
                            </div>
                        </div>
                    </Transition>
                </div>
                <div @click="cargarClase('mentalista')"
                    :class="claseCargada === 'mentalista' ? 'class-active' : 'class-inactive'">
                    <div class="claseTitulo">Mentalista</div>
                    <Transition :name="'mostrarSubclases'">

                        <div class="subclasses" v-if="claseCargada === 'mentalista'">
                            <div v-for="(subclase) in subclasesIndex" :key="subclase.ruta"
                                :class="isSubclaseActiva(subclase.ruta) ? 'subclas-active' : 'subclas-inactive'"
                                @click="e => toggleSubclase(subclase.ruta, e)">
                                {{ subclase.acortado }}
                            </div>
                        </div>
                    </Transition>
                </div>
                <div @click="cargarClase('luchador')"
                    :class="claseCargada === 'luchador' ? 'class-active' : 'class-inactive'">
                    <div class="claseTitulo">Luchador</div>
                    <Transition :name="'mostrarSubclases'">

                        <div class="subclasses" v-if="claseCargada === 'luchador'">
                            <div v-for="(subclase) in subclasesIndex" :key="subclase.ruta"
                                :class="isSubclaseActiva(subclase.ruta) ? 'subclas-active' : 'subclas-inactive'"
                                @click="e => toggleSubclase(subclase.ruta, e)">
                                {{ subclase.acortado }}
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>

            <div class="table-div">
                <!-- Tabla de clase -->
                <table v-if="tabla.titulos.length">
                    <thead>
                        <tr>
                            <th v-for="(titulo, i) in tabla.titulos" :key="i">
                                <template v-if="Array.isArray(titulo)">
                                    <a :href="titulo[1]" target="_blank">{{ titulo[0] }}</a>
                                </template>
                                <template v-else>
                                    {{ titulo }}
                                </template>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(fila, i) in tabla.filas" :key="i">
                            <td v-for="(celda, j) in fila" :key="j">
                                <template v-if="Array.isArray(celda)">
                                    <template v-for="(rasgo, k) in celda" :key="k">
                                        <span v-if="k > 0">, </span>
                                        <a :href="'#' + rasgo + fila[0]">{{ rasgo }}</a>
                                    </template>
                                </template>
                                <template v-else>
                                    {{ celda }}
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>



        <div class="bottom-section">

            <!--Descripción-->
            <details class="feature" open>
                <summary>Descripción</summary>
                <div>
                    <p v-for="(parrafo) in Array.isArray(descripcion) ? descripcion : [descripcion]" class="description"
                        v-html="parrafo"></p>
                    <!--Descripciones subclases-->
                    <div v-for="(subclase) in subclasesCargadas">
                        <details v-if="subclase.activo" class="featureSubSub" open>
                            <summary>{{ subclase.subclase.nombre }}</summary>
                            <p v-for="parrafo in subclase.subclase.descripcion">{{ parrafo }}
                            </p>
                        </details>
                    </div>
                </div>
            </details>
            <!--Tiradas de salvación-->
            <details class="feature" open>
                <summary>{{ tiradas.nombre }}</summary>
                <div>
                    <p v-for="(parrafo) in Array.isArray(tiradas.descripcion) ? tiradas.descripcion : [tiradas.descripcion]"
                        v-html="parrafo"></p>
                </div>
            </details>
            <!--Rasgos-->
            <details v-for="(rasgo, i) in rasgos" :key="i" class="feature" open>
                <summary :id="rasgo.nombre + rasgo.nivel">
                    {{ rasgo.nombre }}
                </summary>
                <div class="detailsBlock">
                    <p class="feature-origin">{{ rasgo.claseNombre }} - Nivel {{ rasgo.nivel }}</p>
                    <div>
                        <p v-for="(parrafo, j) in Array.isArray(rasgo.descripcion) ? rasgo.descripcion : [rasgo.descripcion]"
                            :key="j" v-html="parrafo">
                        </p>
                    </div>
                    <!-- subclase -->
                    <div v-if="rasgo.esSubclase" :id="'subclase' + rasgo.nivel">
                        <div v-for="(subclase) in subclasesCargadas">
                            <template v-if="subclase.activo">
                                <template v-for="(rasgoSub) in subclase.subclase.rasgos">
                                    <div v-if="rasgoSub.nivel === rasgo.nivel">
                                        <details class="featureSub" open>
                                            <summary>{{ rasgoSub.nombre }}</summary>
                                            <p class="feature-origin">

                                                {{ rasgoSub.nombreSubclase }} - Nivel {{ rasgo.nivel }}
                                            </p>
                                            <p v-if="rasgoSub.nivel == 2"><strong>Prerrequisito:</strong> {{
                                                subclase.subclase.prerrequisito }}</p>

                                            <!-- tiene más de 1 rasgo al nivel -->
                                            <template v-if="rasgoSub.tieneSubrasgos">
                                                <div v-for="(subrasgo, idx) in rasgoSub.contenido" :key="idx">
                                                    <details class="featureSubSub" open>
                                                        <summary>{{ subrasgo.nombre }}</summary>
                                                        <template
                                                            v-for="bloque in Array.isArray(subrasgo.descripcion) ? subrasgo.descripcion : [subrasgo.descripcion]">
                                                            <p v-if="!bloque.tipo" v-html="bloque"></p>
                                                            <ul v-else-if="bloque.tipo === 'listaU'" class="list">
                                                                <li v-for="(item, j) in bloque.contenido" :key="j"
                                                                    v-html="item">
                                                                </li>
                                                            </ul>
                                                            <ol v-else-if="bloque.tipo === 'listaO'" class="list">
                                                                <li v-for="(item, j) in bloque.contenido" :key="j"
                                                                    v-html="item"></li>
                                                            </ol>
                                                        </template>

                                                    </details>
                                                </div>
                                            </template>
                                            <!-- tiene sólo 1 rasgo al nivel -->
                                            <template v-else>
                                                <template
                                                    v-for="bloque in Array.isArray(rasgoSub.contenido) ? rasgoSub.contenido : [rasgoSub.contenido]">
                                                    <p v-if="!bloque.tipo" v-html="bloque"></p>
                                                    <ul v-else-if="bloque.tipo === 'listaU'" class="list">
                                                        <li v-for="(item, j) in bloque.contenido" :key="j"
                                                            v-html="item">
                                                        </li>
                                                    </ul>
                                                    <ol v-else-if="bloque.tipo === 'listaO'" class="list">
                                                        <li v-for="(item, j) in bloque.contenido" :key="j"
                                                            v-html="item"></li>
                                                    </ol>
                                                </template>
                                            </template>
                                        </details>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </div>
                </div>
            </details>
            <!-- Lista Movimientos -->
            <details v-if="listaMovimientos.length > 0" class="feature" open id="listaMovs">
                <summary>Lista de Movimientos de {{ claseCargada }}</summary>
                <div class="listaMovsContainer">
                    <div v-for="par in listaMovimientos" class="parListaMov">

                        <p class="listaMovsCoste">{{ par.coste }}</p>
                        <div>
                            <p v-for="mov in par.movimientos" class="movListaMov">
                                {{ mov }}
                            </p>
                        </div>
                    </div>
                </div>
            </details>
        </div>
    </div>
    <div id="volverArriba">
        <a href="#modoNoche"><img src="../assets/icons/arrowUpIcon.svg" alt=""></a>
    </div>
</template>
<style>
html {
    scroll-padding: 60px;
}
</style>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    width: 85%;
    margin: 0 auto;
    font-family: sans-serif;
    min-height: 100vh;
}

/* ========= PARTE DE ARRIBA ========== */

.top-section {
    display: flex;
    gap: 50px;
    margin: 30px 0;
}

/* ========= Menu Clases ========== */
.classes {
    width: 40%;
    display: flex;
    flex-direction: column;
    color: var(--color-texto)
}

.claseTitulo {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    padding-left: 10px;
}

.classes>div {
    border-top: 1px solid var(--color-secundario);
}

.classes>div:first-child {
    border: none;
}

.classes>div {
    margin: 0;
    display: flex;
    flex-direction: column;
}

.class-active {
    background-color: var(--color-tituloTabla);
}

.class-active .claseTitulo {
    font-weight: bold;
}

.class-inactive {
    background-color: var(--color-principal1);
}

.class-inactive:hover {
    background-color: var(--color-tituloTabla);
    cursor: pointer;
}

/* ========= Menu Subclases ========== */
.subclasses {
    display: flex;
    flex-wrap: wrap;
    background-color: var(--color-principal2);
}

.subclasses>div {
    margin: 5px;
    padding: 5px 10px;
    border-radius: 5px;
    text-align: center;
    max-width: fit-content;
}

.subclas-active,
.subclas-inactive {
    background-color: var(--color-tabla2);
}

.subclas-active {
    background-color: var(--color-tituloTabla);
    text-shadow: 0px 0px 1px var(--color-texto);
}

.subclas-active:hover,
.subclas-inactive:hover {
    background-color: var(--color-principal1);
    cursor: pointer;
}


/* ========= TABLA PRINCIPAL ========== */
.table-div {
    width: 80%;
    overflow-x: auto;
}

table {
    border-radius: 2px;
    width: 100%;
    border-collapse: collapse;
    color: var(--color-texto)
}

th,
td {
    padding: 2px 5px;
    text-align: center;
}

tr {
    height: 30px;
}

th a,
td a {
    text-decoration: underline dotted var(--color-texto);
}

th {
    background-color: var(--color-tituloTabla);
    height: 50px;
}

tbody tr:nth-child(even) {
    background-color: var(--color-tabla1);
}

tbody tr:nth-child(odd) {
    background-color: var(--color-tabla2);
}

td:nth-child(2) {
    text-align: left;
}

/* ========= PARTE DE ABAJO ========== */
.bottom-section {
    background-color: var(--color-fondoTexto);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: justify;
    margin: 20px 0;
    color: var(--color-texto)
}

.description {
    margin-left: 10px;
}

.feature-origin {
    font-style: italic;
    font-weight: bold;
    padding: 5px 0;
}

.feature summary,
.featureSub summary,
.featureSubSub summary {
    background-color: var(--color-principal1);
    text-align: left;
    font-size: 20px;
    font-weight: bold;
    color: var(--color-texto);
    cursor: pointer;
    padding: 10px;
}

.feature p {
    margin: 15px;
}


.featureSub,
.featureSubSub {
    margin: 0 20px 20px 20px;
    border: 1px solid var(--color-principal1);
}

.featureSub summary,
.featureSubSub summary {
    font-size: 16px;
    background-color: var(--color-principal2);
}

.list li {
    margin: 10px 35px 20px 35px;
}


/* ===========LISTA DE MOVIMIENTOS============= */

.listaMovsContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
}

.parListaMov {
    width: 125px;
}

.listaMovsCoste {
    font-size: 20px;
    font-weight: bold;
    color: var(--color-principal2);
}

/* ===== Flecha subir arriba  ===== */
#volverArriba {
    width: 40px;
    height: 40px;
    background-color: var(--color-principal1);
    border-radius: 8px;
    margin-bottom: 10px;
    position: sticky;
    bottom: 5px;
    left: 100%;
    margin-right: 5px;
    display: flex;
    justify-content: center;
}

#volverArriba img {
    margin-top: 5px;
    width: 30px;
    height: 30px;
}


.mostrarEntrenador-enter-active,
.mostrarEntrenador-leave-active {
    overflow: hidden;
    transition: all 0.3s ease;
}

.mostrarEntrenador-enter-from,
.mostrarEntrenador-leave-to {
    max-height: 0;
}

.mostrarEntrenador-enter-to,
.mostrarEntrenador-leave-from {
    max-height: 320px;
}

.mostrarSubclases-enter-active,
.mostrarSubclases-leave-active {
    overflow: hidden;
    transition: all 0.3s ease;
}

.mostrarSubclases-enter-from,
.mostrarSubclases-leave-to {
    max-height: 0;
}

.mostrarSubclases-enter-to,
.mostrarSubclases-leave-from {
    max-height: 270px;
}


@media (max-width:1100px) {
    .top-section {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .classes {
        width: 100%;
        align-items: center;
    }

    .class-inactive,
    .class-active {
        width: 100%;
    }

    .table-div {
        width: 100%;
    }
}

@media (max-width:600px) {

    

    table {
        font-size: 13px;
    }
    th {
        font-size: 12px;
        height: 30px;
    }

    .feature summary {
        font-size: 15px;
    }

    .feaureSub summary,
    .featureSubSub summary {
        font-size: 13px;
    }

    .feature summary {
        font-size: 15px;
    }

    .feaureSub summary,
    .featureSubSub summary {
        font-size: 13px;
    }
    p, li{
        font-size: 14px;
    }
    /*
*/
}
</style>