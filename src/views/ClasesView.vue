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



//=============FETCH Y MANIPULACIÓN DE DATOS===========
async function cargarClase(clase) {
    if (clase === claseCargada.value) {
        console.log("No se ha cargado la clase porque ya estaba cargada...");
        return 0;
    }
    console.time('fetchData');
    try {
        const res = await fetch(`data/json/${clase}/${clase}.json`);
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

        //Cambio ruta
        handleClassChange(claseCargada.value);
    } catch (err) {
        console.error("Error al cargar clase:", err);
    }

    console.timeEnd('fetchData');
}

async function toggleSubclase(ruta, e) {
    const existente = subclasesCargadas.value.find(s => s.ruta === ruta);

    if (existente) {
        existente.activo = !existente.activo;
        if (existente.activo) { e.target.className = "class-active" }
        else {
            e.target.className = "class-inactive"
        }
    } else {
        const datosSubclase = await fetch(`/data/json/${claseCargada.value}/subclases/${ruta}.json`)
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
            console.log(`Cargado ${ruta}`)
            e.target.className = "class-active"
        }
    }

}

//==============EN CARGA===========
onMounted(() => {
    cargarClase('entrenador');

});


//==============CAMBIO DE RUTA AL CAMBIAR CLASE===========
function handleClassChange(claseNueva) {
    router.push({ query: { clase: claseNueva } })
}


</script>


<template>
    <div class="container">
        <div class="top-section">
            <div class="classes">
                <div @click="cargarClase('entrenador')"
                    :class="claseCargada === 'entrenador' ? 'class-active' : 'class-inactive'">Entrenador
                    <div class="subclasses" v-if="claseCargada === 'entrenador'">
                        <div v-for="(subclase) in subclasesIndex" @click="e => (toggleSubclase(subclase.ruta, e))">{{
                            subclase.acortado }}</div>
                    </div>
                </div>
                <div @click="console.log(' pinga')"
                    :class="claseCargada === 'inventor' ? 'class-active' : 'class-inactive'">Inventor
                    <div class="subclasses" v-if="claseCargada === 'inventor'">
                        <div v-for="(subclase) in subclasesIndex" @click="e => (toggleSubclase(subclase.ruta, e))">{{
                            subclase.acortado }}</div>
                    </div>
                </div>
                <div @click="console.log(' pinga')"
                    :class="claseCargada === 'mentalista' ? 'class-active' : 'class-inactive'">Mentalista
                    <div class="subclasses" v-if="claseCargada === 'mentalista'">
                        <div v-for="(subclase) in subclasesIndex" @click="e => (toggleSubclase(subclase.ruta, e))">{{
                            subclase.acortado }}</div>
                    </div>
                </div>
                <div @click="cargarClase('luchador')"
                    :class="claseCargada === 'luchador' ? 'class-active' : 'class-inactive'">Luchador
                    <div class="subclasses" v-if="claseCargada === 'luchador'">
                        <div v-for="(subclase) in subclasesIndex" @click="e => (toggleSubclase(subclase.ruta, e))">{{
                            subclase.acortado }}</div>
                    </div>
                </div>
            </div>

            <div class="menu">


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
            <div>
                <p v-for="(parrafo) in Array.isArray(descripcion) ? descripcion : [descripcion]" class="description"
                    v-html="parrafo"></p>

                <details class="feature" open>
                    <summary>{{ tiradas.nombre }}</summary>
                    <div>
                        <p v-for="(parrafo) in Array.isArray(tiradas.descripcion) ? tiradas.descripcion : [tiradas.descripcion]"
                            v-html="parrafo"></p>
                    </div>
                </details>

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
                                                <p class="feature-origin">{{ rasgoSub.nombreSubclase }} {{ rasgo.nivel
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
            </div>
        </div>
    </div>
</template>


<style scoped>
* {
    font-size: 14px;
    color: var(--color-texto)
}

.container {
    display: flex;
    flex-direction: column;
    padding: 0 15%;
    font-family: sans-serif;
    min-height: 100vh;
    background-color: var(--color-fondo);
}

/*=========PARTE DE ARRIBA==========*/

.top-section {
    display: flex;
    justify-content: space-around;
    margin: 30px 0;
}


/*=========Subsección arriba (botones)==========*/
.classes {
    width: 150px;
    padding: 10px 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    gap: 5px;
}


.classes div {
    margin: none;
    border-radius: 5px;
    margin: 5px;
    background-color: var(--color-segundario);

}


.classes .class-active {
    background-color: var(--color-principal1);
}

/*=========Subsección arriba (tabla)==========*/
.table-div {
    width: 700px;
    overflow-x: auto;
}

table {
    border-radius: 2px;
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 2px 5px;
    text-align: center;
}

td:nth-child(2) {
    text-align: left;
}

th a,
td a {
    text-decoration: underline dotted lightgray;
}

tr {
    background-color: var(--color-hoverBloque);
}

thead tr {
    background-color: var(--color-tabla1);
}

tr:nth-of-type(2n) {
    background-color: var(--color-tabla2);
}






/*=========PARTE DE ABAJO==========*/
.bottom-section {
    background-color: var(--color-fondoTexto);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 15px 10px 0;
    text-align: justify;
    margin-bottom: 20px;
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
    padding: 5px 0 5px 5px;
    margin-top: 15px;
    border-radius: 5px;
    text-align: left;
    font-size: 20px;
    font-weight: bold;
    color: var(--color-texto);
    cursor: pointer;
}

.feature p {
    margin-left: 10px;
}


.featureSub summary {
    font-size: 16px;
    background-color: var(--color-principal2);
}

.featureSubSub {
    margin-left: 20px;
}

.featureSubSub summary {

    font-size: 16px;
    background-color: var(--color-segundario);
}

:deep(li) {
    margin-left: 20px;
}


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
</style>