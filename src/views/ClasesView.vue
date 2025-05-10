<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const claseCargada = ref('');
const tabla = ref({ titulos: [], filas: [] });
const descripcion = ref('');
const tiradas = ref({ nombre: '', descripcion: '' });
const rasgos = ref([]);
const subclasesIndex = ref([]);
const subclasesCargadas = ref([]);

function cargarClase(clase) {
    fetch(`data/json/${clase}/${clase}.json`)
        .then(res => res.json())
        .then(data => {
            //Borro subclases anteriores //ESTO A MEDIAS
            subclasesCargadas.value = [];

            //cargo clase
            claseCargada.value = clase;
            tabla.value = data.tablaClase;
            descripcion.value = data.descripcion;
            tiradas.value = data.tiradasSalvacion;
            rasgos.value = data.rasgos;
            subclasesIndex.value = data.subclases;
        })
        .catch(err => console.error("Error al cargar", err));
}

async function toggleSubclase(ruta) {
    const existente = subclasesCargadas.value.find(s => s.ruta === ruta);

    if (existente) {
        existente.activo = !existente.activo;
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
        }
    }
}




onMounted(() => {
    cargarClase('entrenador');
});

</script>


<template>
    <div class="container">
        <div class="top-section">
            <div class="buttons">
                <div class="class-buttons">
                    <button @click="cargarClase('entrenador')">Entrenador</button><br>
                    <button @click="console.log(' pinga')">Inventor NO VA</button>
                    <button @click="console.log(' pinga')">Mentalista NO VA</button>
                    <button @click="cargarClase('luchador')">Luchador</button>
                </div>
                <div class="subclass-buttons">
                    <button v-for="(subclase, i) in subclasesIndex" @click="toggleSubclase(subclase.ruta)">{{
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
                <p v-html="descripcion"></p>

                <details open>
                    <summary class="featureHead">{{ tiradas.nombre }}</summary>
                    <div class="detailsBlock">
                        <p class="classData">{{ tiradas.descripcion }}</p>
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
                        <div v-if="rasgo.esSubclase" :id="'subclase' + rasgo.nivel">
                            <div v-for="(subclase, index) in subclasesCargadas">
                                <p>{{ subclase.subclase.nombre }}</p>
                                <div v-for="(rasgoSub, index) in subclase.subclase.rasgos">
                                    <p v-if="rasgoSub.nivel === rasgo.nivel">{{ rasgoSub.nombre }}</p>
                                </div>
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


.subclass-buttons button.active {
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
    background-image: url("https://i.pinimg.com/474x/f4/1a/95/f41a95cba3b00c5b9d563400ddc58a26.jpg");
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