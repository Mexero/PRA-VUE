<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

//Navegación
const router = useRouter();
const route = useRoute();


//Almacén de datos
const claseCargada = ref('');
const tabla = ref({ titulos: [], filas: [] });
const descripcion = ref([]);
const tiradas = ref({ nombre: '', descripcion: [] });
const rasgos = ref([]);
const subclasesIndex = ref([]);
const subclasesCargadas = ref([]);
const listaMovimientos = ref([]);




//=============FETCH Y MANIPULACIÓN DE DATOS===========
async function cargarClase(clase) {
    if (clase === claseCargada.value) {
        console.log("No se ha cargado la clase porque ya estaba cargada...");
        return 0;
    }
    console.time('fetchData');
    try {
        const res = await fetch(`data/json/clases/${clase}/${clase}.json`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        // Borro subclases anteriores
        subclasesCargadas.value = [];

        // Cargo clase
        claseCargada.value = clase;
        tabla.value = data.tablaClase;
        descripcion.value = data.descripcion;
        tiradas.value = data.tiradasSalvacion;
        rasgos.value = data.rasgos;
        subclasesIndex.value = data.subclases;
        listaMovimientos.value = data.ListaMovimientos ?? [];

        //Cambio ruta
        handleClassChange(claseCargada.value);
    } catch (err) {
        console.error("Error al cargar clase:", err);
    }

    console.timeEnd('fetchData');
}

async function toggleSubclase(ruta, e = null) {
    const existente = subclasesCargadas.value.find(s => s.ruta === ruta);

    if (existente) {
        existente.activo = !existente.activo;
    } else {
        const datosSubclase = await fetch(`/data/json/clases/${claseCargada.value}/subclases/${ruta}.json`)
            .then(res => res.json())
            .catch(err => {
                console.error("Error al cargar subclase:", err);
                return null;
            });

        if (datosSubclase) {
            subclasesCargadas.value.push({
                ruta,
                activo: true,
                subclase: datosSubclase
            });
        }
    }
    updateSubclasesQuery();
}

// =========== CHECHEA SI UNA SUBCLASE ESTÁ ACTIVA ==========
function isSubclaseActiva(ruta) {
    const sub = subclasesCargadas.value.find(s => s.ruta === ruta);
    return sub && sub.activo;
}



//=============== AÑADE A LA RUTAS LAS SUBCLASES CARGADAS =============
function updateSubclasesQuery() {
    const subclasesActivas = subclasesCargadas.value
        .filter(s => s.activo)
        .map(s => s.ruta);

    router.replace({
        query: {
            ...route.query,
            subclases: subclasesActivas.join(',')
        }
    });
}


//==============EN CARGA===========

onMounted(async () => {
    const claseURL = route.query.clase || 'entrenador';
    await cargarClase(claseURL);

    const subclasesURL = route.query.subclases;
    if (subclasesURL) {
        const rutas = subclasesURL.split(',');
        for (const ruta of rutas) {
            await toggleSubclase(ruta);
        }
    }
});


//==============CAMBIO DE RUTA AL CAMBIAR CLASE===========
function handleClassChange(claseNueva) {
    router.push({ query: { clase: claseNueva } })
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
                    <div class="subclasses" v-if="claseCargada === 'entrenador'">
                        <div v-for="(subclase) in subclasesIndex" :key="subclase.ruta"
                            :class="isSubclaseActiva(subclase.ruta) ? 'subclas-active' : 'subclas-inactive'"
                            @click="e => toggleSubclase(subclase.ruta, e)">
                            {{ subclase.acortado }}
                        </div>
                    </div>
                </div>
                <div @click="cargarClase('inventor')"
                    :class="claseCargada === 'inventor' ? 'class-active' : 'class-inactive'">
                    <div class="claseTitulo">Inventor</div>

                    <div class="subclasses" v-if="claseCargada === 'inventor'">
                        <div v-for="(subclase) in subclasesIndex" :key="subclase.ruta"
                            :class="isSubclaseActiva(subclase.ruta) ? 'subclas-active' : 'subclas-inactive'"
                            @click="e => toggleSubclase(subclase.ruta, e)">
                            {{ subclase.acortado }}
                        </div>
                    </div>
                </div>
                <div @click="cargarClase('mentalista')"
                    :class="claseCargada === 'mentalista' ? 'class-active' : 'class-inactive'">
                    <div class="claseTitulo">Mentalista</div>

                    <div class="subclasses" v-if="claseCargada === 'mentalista'">
                        <div v-for="(subclase) in subclasesIndex" :key="subclase.ruta"
                            :class="isSubclaseActiva(subclase.ruta) ? 'subclas-active' : 'subclas-inactive'"
                            @click="e => toggleSubclase(subclase.ruta, e)">
                            {{ subclase.acortado }}
                        </div>
                    </div>
                </div>
                <div @click="cargarClase('luchador')"
                    :class="claseCargada === 'luchador' ? 'class-active' : 'class-inactive'">
                    <div class="claseTitulo">Luchador</div>
                    <div class="subclasses" v-if="claseCargada === 'luchador'">
                        <div v-for="(subclase) in subclasesIndex" :key="subclase.ruta"
                            :class="isSubclaseActiva(subclase.ruta) ? 'subclas-active' : 'subclas-inactive'"
                            @click="e => toggleSubclase(subclase.ruta, e)">
                            {{ subclase.acortado }}
                        </div>
                    </div>
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
            <!-- Rasgos -->

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
                    <p class="feature-origin">{{ rasgo.claseNombre }} {{ rasgo.nivel }}</p>
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
                                            <p class="feature-origin">{{
                                                rasgoSub.nombreSubclase }} {{ rasgo.nivel
                                                }}</p>
                                            <!-- tiene más de 1 rasgo al nivel -->
                                            <template v-if="rasgoSub.tieneSubrasgos">
                                                <div v-for="(subrasgo) in rasgoSub.contenido">
                                                    <details class="featureSubSub" open>
                                                        <summary>{{ subrasgo.nombre }}
                                                        </summary>
                                                        <p v-for="(parrafo) in Array.isArray(subrasgo.descripcion) ? subrasgo.descripcion : [subrasgo.descripcion]"
                                                            v-html="parrafo">
                                                        </p>
                                                    </details>
                                                </div>
                                            </template>
                                            <!-- tiene sólo 1 rasgo al nivel -->
                                            <template v-else>
                                                <p v-for="(parrafo) in Array.isArray(rasgoSub.contenido) ? rasgoSub.contenido : [rasgoSub.contenido]"
                                                    v-html="parrafo"> </p>
                                            </template>
                                        </details>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </div>
                </div>
            </details>
            <!--Lista Movimientos-->
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
        <a href="#top">Arrow Up</a>
        <!-- Añadir icono flecha arriba -->
    </div>
</template>

<style>
html {
    scroll-behavior: smooth;
}
</style>
<style scoped>
#volverArriba {
    width: 50px;
    height: 50px;
    background-color: var(--color-principal1);
    border-radius: 5px;
    position: fixed;
    bottom: 5px;
    right:  5px;
}

.container {
    display: flex;
    flex-direction: column;
    width: 85%;
    margin: 0 auto;
    font-family: sans-serif;
    min-height: 100vh;
}

/*=========PARTE DE ARRIBA==========*/

.top-section {
    display: flex;
    justify-content: space-between;
    margin: 30px 0;
    background-color: var(--color-fondoTexto);
}


/*=========Subsección arriba (botones)==========*/
/* Mejora visual y responsiva para el selector de clases y subclases */
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
    margin: 0;
    font-weight: 500;
    display: flex;
    flex-direction: column;
}


.class-inactive:hover,
.subclas-inactive:hover {
    background-color: var(--color-secundario);
    cursor: pointer;
}

.subclas-active:hover {
    cursor: pointer;
    background-color: var(--color-sombraTexto);

}

.class-active {
    background-color: var(--color-principal1);
    font-weight: bold;
}

.class-inactive {
    background-color: var(--color-tituloTabla);
}

.subclasses {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    gap: 5px;
    background-color: var(--color-principal2);
    border-bottom: 1px solid;
}

.subclasses>div {
    padding: 10px;
    border-radius: 5px;
    width: fit-content;
}

.subclas-active {
    background-color: var(--color-principal1);
    font-weight: bold;

}

/*=========Subsección arriba (tabla)==========*/
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

th a,
td a {
    text-decoration: underline dotted lightgray;
}

th {
    background-color: var(--color-tituloTabla);
    height: 60px;
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

/*=========PARTE DE ABAJO==========*/
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


/*===========LISTA DE MOVIMIENTOS=============*/

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

/* 
@media (max-width:1100px) {
    .top-section {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .classes {
        width: 700px;
        align-items: center;
    }

}

@media (max-width:850px) {
    * {
        font-size: 12px;
    }

    table {
        font-size: 10px;
    }

    .feature summary {
        font-size: 16px;
    }

    .feaureSub summary,
    .featureSubSub summary {
        font-size: 14px;
    }

    .container {
        padding: 0 20px;
    }

}
    */
</style>