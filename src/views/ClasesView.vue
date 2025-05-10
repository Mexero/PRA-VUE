<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const claseCargada = ref('');
const tabla = ref({ titulos: [], filas: [] });
const descripcion = ref([]);
const tiradas = ref({ nombre: '', descripcion: [] });
const rasgos = ref([]);
const subclasesIndex = ref([]);
const subclasesCargadas = ref([]);

let ResetBotonesSubclasesAlCambiarClase = false; //Poner esta key a todo lo que quieras que se resetee del todo al cargar otra clase. SOLO IMPRESCINDIBLE


//=============FETCH Y MANIPULACIÓN DE DATOS===========
async function cargarClase(clase) {
    if (clase === claseCargada.value) {
        console.log("No se ha cargado la clase porque ya estaba cargada...");
        return 1;
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
    } catch (err) {
        console.error("Error al cargar clase:", err);
    }
    ResetBotonesSubclasesAlCambiarClase = !ResetBotonesSubclasesAlCambiarClase; //Al cargar

    console.timeEnd('fetchData');
}

async function toggleSubclase(ruta, e) {
    const existente = subclasesCargadas.value.find(s => s.ruta === ruta);

    if (existente) {
        existente.activo = !existente.activo;
        if (existente.activo) { e.target.className = "btn-active" }
        else {
            e.target.className = "btn-inactive"
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
            e.target.className = "btn-active"
        }
    }

}


//esto no funciona aun
function isSubclassLoaded(ruta) {
    const subclase = subclasesCargadas.value.find(s => s.ruta === ruta);
    if (subclase && subclase.activo)
        return true
    else {
        return false
    }

}



//==============EN CARGA===========
onMounted(() => {
    cargarClase('entrenador');

});

</script>


<template>
    <div class="container">
        <div class="top-section">
            <div class="buttons">
                <div class="class-buttons">
                    <button @click="cargarClase('entrenador')"
                        :class="claseCargada === 'entrenador' ? 'btn-active' : 'btn-inactive'">Entrenador</button><br>
                    <button @click="console.log(' pinga')"
                        :class="claseCargada === 'inventor' ? 'btn-active' : 'btn-inactive'">Inventor NO VA</button>
                    <button @click="console.log(' pinga')"
                        :class="claseCargada === 'mentalista' ? 'btn-active' : 'btn-inactive'">Mentalista NO VA</button>
                    <button @click="cargarClase('luchador')"
                        :class="claseCargada === 'luchador' ? 'btn-active' : 'btn-inactive'">Luchador</button>
                </div>
                <div class="subclass-buttons" :key="ResetBotonesSubclasesAlCambiarClase">
                    <button v-for="(subclase) in subclasesIndex" @click="e => (toggleSubclase(subclase.ruta, e))">{{
                        subclase.acortado }}</button>
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
            <div>
                <p v-for="(parrafo) in Array.isArray(descripcion) ? descripcion : [descripcion]" v-html="parrafo"></p>

                <details open>
                    <summary class="featureHead">{{ tiradas.nombre }}</summary>
                    <div class="detailsBlock">
                        <p v-for="(parrafo) in Array.isArray(tiradas.descripcion) ? tiradas.descripcion : [tiradas.descripcion]"
                            v-html="parrafo" class="classData"></p>
                    </div>
                </details>

                <details v-for="(rasgo, i) in rasgos" :key="i" open>
                    <summary :id="rasgo.nombre + rasgo.nivel" class="featureHead">
                        {{ rasgo.nombre }}
                    </summary>
                    <div class="detailsBlock">
                        <p class="classData">{{ rasgo.claseNombre }} {{ rasgo.nivel }}</p>
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
                                            <details open>
                                                <summary>{{ rasgoSub.nombre }}</summary>
                                                <p>{{ rasgoSub.nombreSubclase }} {{ rasgo.nivel }}</p>
                                                <!-- tiene más de 1 rasgo al nivel -->
                                                <template v-if="rasgoSub.tieneSubrasgos">
                                                    <div v-for="(subrasgo) in rasgoSub.contenido">
                                                        <details open>
                                                            <summary>{{ subrasgo.nombre }}</summary>
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
.container {
    display: flex;
    flex-direction: column;
    padding: 0 max(20px, 10%);
    font-family: sans-serif;
}

/*=========PARTE DE ARRIBA==========*/

.top-section {
    background-color: lightblue;
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}


/*=========Subsección arriba (botones)==========*/
.buttons {
    width: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    gap: 5px;
}


.buttons button {
    width: 100px;
}

.class-buttons {
    background-color: red;
    gap: 5px;
}

.subclass-buttons {
    background-color: orange;
    gap: 5px;
}


.btn-active {
    background-color: tomato;
}

/*=========Subsección arriba (tabla)==========*/
.table-div {
    width: 700px;
}

table {
    width: 100%;
    font-size: 14px;
    border-collapse: collapse;
}

th,
td {
    padding: 2px 5px;
    text-align: left;
}

tr {
    background-color: aqua;
}

thead tr {
    background-color: yellow;
}

tr:nth-of-type(2n) {
    background-color: blue;
}






/*=========PARTE DE ABAJO==========*/
.bottom-section {
    background-color: lightblue;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 15px;
}


details {
    padding-top: 15px;
}

.detailsBlock>p {
    font-style: italic;
    padding: 5px 0;
}

summary {
    border-radius: 5px;
    color: var(--color-texto);
    font-size: 25px;
    font-weight: bold;
    padding: 10px 0 10px 10px;
    cursor: pointer;
    background-color: var(--color-principal1);
}






@media (max-width:1100px) {
    .top-section {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .buttons {
        width: 400px;
        align-items: center;
    }
}
</style>