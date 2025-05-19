<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()



// ======================== DATOS ========================

//Datos principales
const objetos = ref([])
const objetoSeleccionado = ref(route.query.seleccionado ? route.query.seleccionado : null)
const mostrarFiltros = ref(false)

//Filtros
const filtroTipos = ref(route.query.tipos ? route.query.tipos.split(',') : [])
const filtroRarezas = ref(route.query.rareza ? route.query.rareza.split(',') : [])
const filtroPrecioMin = ref(route.query.precioMin ? Number(route.query.precioMin) : null)
filtroPrecioMin.value = isNaN(filtroPrecioMin.value) ? null : filtroPrecioMin.value
const filtroPrecioMax = ref(route.query.precioMax ? Number(route.query.precioMax) : null)
filtroPrecioMax.value = isNaN(filtroPrecioMax.value) ? null : filtroPrecioMax.value
const filtroNombre = ref(route.query.nombre || '')

//Orden de tabla
const ordenColumna = ref(route.query.ordenColumna || '')
const ordenAscendente = ref(route.query.ordenAscendente !== 'false')



// =================== CARGAR DATOS AL ABRIR ==================

onMounted(async () => {
    try {
        const res = await fetch('/data/json/objetos/objetos.json');

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        objetos.value = await res.json();

        if (objetos.value.length > 0) {
            if (objetoSeleccionado.value) {
                seleccionarObjeto(objetos.value.find(obj => obj.Nombre === objetoSeleccionado.value))
            }
            else {
                seleccionarObjeto(objetos.value[0]);
            }
        } else {
            console.warn("El archivo JSON está vacío.");
        }
    } catch (error) {
        console.error("Error al cargar los objetos:", error);
    }
})


// ===================== SELECCIONAR OBJETOS PARA EL CUADRO ===================
function seleccionarObjeto(objeto) {
    objetoSeleccionado.value = objeto
}


// ======================== LIMPIAR FILTROS ============================
function limpiarFiltros() {
    filtroTipos.value = []
    filtroRarezas.value = []
    filtroPrecioMin.value = null
    filtroPrecioMax.value = null
    filtroNombre.value = ''
    ordenColumna.value = ''
    ordenAscendente.value = true
}



// ================ CREA LOS FILTROS DE RAREZA Y TIPOS MIRANDO LOS DE LA TABLA DIRECTAMENTE ===================
const tiposUnicos = computed(() => [...new Set(objetos.value.map(o => o.Tipo).filter(Boolean))])
const rarezasUnicas = computed(() => [...new Set(objetos.value.map(o => o.Rareza).filter(Boolean))])



// ========================= PONER FILTROS EN LA URL ===========================
watch([
    objetoSeleccionado,
    filtroTipos,
    filtroRarezas,
    filtroPrecioMin,
    filtroPrecioMax,
    filtroNombre,
    ordenColumna,
    ordenAscendente
], () => {
    const query = {
        tipos: filtroTipos.value.length ? filtroTipos.value.join(',') : undefined,
        rareza: filtroRarezas.value.length ? filtroRarezas.value.join(',') : undefined,
        precioMin: filtroPrecioMin.value !== null ? filtroPrecioMin.value : undefined,
        precioMax: filtroPrecioMax.value !== null ? filtroPrecioMax.value : undefined,
        nombre: filtroNombre.value || undefined,
        ordenColumna: ordenColumna.value || undefined,
        ordenAscendente: ordenColumna.value ? ordenAscendente.value : undefined,
        seleccionado: objetoSeleccionado.value.Nombre ? objetoSeleccionado.value.Nombre : undefined
    }
    router.replace({ query })
}, { deep: true })




// =============== LÓGICA DE CAMBIAR ORDENAMIENTO ==================
function ordenarPor(columna) {
    if (ordenColumna.value === columna) {
        ordenAscendente.value = !ordenAscendente.value;
    } else {
        ordenColumna.value = columna;
        ordenAscendente.value = true;
    }
}



// ========================= APLICAR FILTROS A TABLA Y ORDENAR ===========================
const objetosFiltrados = computed(() => {
    let resultado = objetos.value.filter(obj => {
        const coste = obj.Coste ?? null;
        const nombre = obj.Nombre.toLowerCase();


        //Expresión lógica infernal        
        return (
            (!filtroTipos.value.length || filtroTipos.value.includes(obj.Tipo)) &&
            (!filtroRarezas.value.length || filtroRarezas.value.includes(obj.Rareza)) &&
            (filtroPrecioMin.value === null || coste >= filtroPrecioMin.value) &&
            (filtroPrecioMax.value === null || coste <= filtroPrecioMax.value) &&
            (!filtroNombre.value || nombre.includes(filtroNombre.value.toLowerCase()))
        )
    })


    //ordenar
    if (ordenColumna.value) {
        resultado.sort((a, b) => {
            const aVal = a[ordenColumna.value];
            const bVal = b[ordenColumna.value];

            if (aVal === undefined || aVal === null) return 1
            if (bVal === undefined || bVal === null) return -1

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return ordenAscendente.value ? aVal - bVal : bVal - aVal
            }

            return ordenAscendente.value
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        })
    }

    return resultado
})
</script>

<template>

    <div class="cuerpo">


        <div id="flitroTabla">

            <!--FILTROS-->
            <div class="filtros">
                <div class="botones">
                    <div>
                        <button @click="mostrarFiltros = !mostrarFiltros">
                            {{ mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros' }}
                        </button>
                    </div>
                </div>
                <div v-if="mostrarFiltros" id="mostrarFiltros">

                    <input v-model="filtroNombre" type="text" placeholder="Buscar por nombre" />


                    <button @click="limpiarFiltros">
                        Limpiar filtros
                    </button>


                    <div id="flitroTipos">
                        <h3>Tipos</h3>
                        <div>
                            <label v-for="tipo in tiposUnicos" :key="tipo">
                                <input type="checkbox" :value="tipo" v-model="filtroTipos" /> {{ tipo }}
                            </label>
                        </div>
                    </div>

                    <h3>Rarezas</h3>
                    <div id="flitroRarezas">
                        <div>
                            <label v-for="rareza in rarezasUnicas" :key="rareza">
                                <input type="checkbox" :value="rareza" v-model="filtroRarezas" /> {{ rareza }}
                            </label>
                        </div>
                    </div>

                    <h3>Coste</h3>
                    <div id="flitroCostes">
                        <input type="number" v-model.number="filtroPrecioMin" placeholder="Precio mínimo" />
                        <input type="number" v-model.number="filtroPrecioMax" placeholder="Precio máximo" />
                    </div>
                </div>
            </div>


            <!--TABLA-->
            <div class="div-tabla">

                <table class="tabla">
                    <thead>
                        <tr>
                            <th @click="ordenarPor('Nombre')">Objeto <img src="../../assets/icons/filtroFelcha.svg" alt=""></th>
                            <th @click="ordenarPor('Tipo')">Tipo <img src="../../assets/icons/filtroFelcha.svg" alt=""></th>
                            <th @click="ordenarPor('Rareza')">Rareza <img src="../../assets/icons/filtroFelcha.svg" alt=""></th>
                            <th @click="ordenarPor('Coste')">Coste <img src="../../assets/icons/filtroFelcha.svg" alt=""></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(objeto, index) in objetosFiltrados" :key="index" @click="seleccionarObjeto(objeto)">
                            <td>{{ objeto.Nombre }}</td>
                            <td>{{ objeto.Tipo }}</td>
                            <td>{{ objeto.Rareza }}</td>
                            <td>{{ objeto.Coste ?? '—' }}$</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!--SELECCIONADO-->
        <div v-if="objetoSeleccionado" class="seleccionado">
            <h2>{{ objetoSeleccionado.Nombre }}</h2>
            <p><strong>Tipo:</strong> {{ objetoSeleccionado.Tipo }}</p>
            <p><strong>Rareza:</strong> {{ objetoSeleccionado.Rareza }}</p>
            <p><strong>Coste:</strong> {{ objetoSeleccionado.Coste ?? '—' }}$</p>
            <p><strong>Valor material:</strong> {{ objetoSeleccionado.ValorMaterial ?? '—' }}$</p>
            <p><strong>Descripción:</strong> {{ objetoSeleccionado.Descripcion }}</p>
        </div>
    </div>

</template>

<style scoped>
/* 
Todo 
Flechita para hedaer filtro tabla 
Min - max slider para coste (Paso de los formularios)
Responsivo
Marcado el objeto seleccionado
Filtro se cierra solo en movil

/* === "Main" contiene todo === */
.cuerpo {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    margin-top: 50px;
    width: 95%;
    margin-bottom: 50px;
    letter-spacing: 0.5px;
}

#flitroTabla {
    display: flex;
    flex-direction: column;
    width: 60%;
    margin-right: 30px;
}

/* === Filtro de la tabla === */
.filtros {
    width: 100%;
    display: flex;
    flex-direction: column;
}

#flitroTipos div {
    margin: 10px 5px;
    display: grid;
    grid-template-columns: repeat(4, auto);
    gap: 5px;
    flex-wrap: wrap;
}


input[type="text"] {
    padding: 7px;
    border-radius: 5px;
    font-size: 17px;
    outline: none;
    transition: border-color 0.3s ease;
    margin-right: 20px;
}

input[type="text"]:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}

#flitroCostes {
    display: flex;
    gap: 20px
}

input[type="number"] {
    padding: 7px;
    border-radius: 5px;
    font-size: 17px;
    outline: none;
    transition: border-color 0.3s ease;
}

.filtros button {
    border: none;
    padding: 10px;
    width: 150px;
    cursor: pointer;
    background-color: var(--color-principal1);
    color: var(--color-texto);
    font-size: 17px;
}

#mostrarFiltros {
    background-color: var(--color-fondoTexto);
    padding: 15px;
    width: 100%;
    font-size: 15px;
}

/*ontenedor de los botones*/
.botones {
    display: flex;
    gap: 5px;

}

.filtros button:hover {
    background-color: var(--color-secundario);
}


@media screen and (max-width: 1170px) {
    #flitroTipos div {
        grid-template-columns: repeat(3, auto);
    }
}

@media screen and (max-width: 960px) {
    #flitroTipos div {
        grid-template-columns: repeat(2, auto);
    }
}




/* === La Tabla de objetos === */
thead {
    background-color: var(--color-tituloTabla);
    position: sticky;
    top: 0;
    cursor: pointer;
    z-index: 1;
    font-size: 18px;
}

.div-tabla {
    max-height: 75vh;
    width: 100%;
    overflow-y: auto;
}

.tabla {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    color: var(--color-texto);
}

.tabla th,
.tabla td {
    font-size: 18px;
    padding: 10px 5px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
    width: 30%;

}

.tabla th img {
    transform: translateY(2px);
    width: 15px;
}

.tabla tbody tr:nth-child(even) {
    background-color: var(--color-tabla1);
}

.tabla tbody tr:nth-child(odd) {
    background-color: var(--color-tabla2);
}

.tabla tbody tr:hover {
    background-color: #8d8d8d;
    cursor: pointer;
}


/* === Mostrar la Info de la tabla === */
.seleccionado {
    margin-top: 40px;
    width: 40%;
    height: fit-content;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
}

</style>
