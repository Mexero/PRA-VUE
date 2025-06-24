<template>
    <div v-if="datosCargados && mov" class="seleccionado">
        <h2>{{ mov.Nombre }}</h2>
        <div class="gridTarjeta">
            <p v-for="(item, i) in itemsGrid" :key="i"
                :class="{ 'span-2': itemsGrid.length % 2 !== 0 && i === itemsGrid.length - 1 }" v-html="item"></p>
        </div>

        <div class="descripcion">
            <p><strong>Descripción:</strong></p>
            <p v-for="parrafo of mov.Descripcion" v-html="parrafo"></p>
        </div>
        <p class="notaFinal"><strong>Armas recomendadas: </strong> {{ mov.ArmasRecomendadas }}.</p>
    </div>
    <div v-else class="seleccionado">
        <p>Cargando...</p>
    </div>


</template>

<script setup>
import { computed } from 'vue'

const props = defineProps([
    'datosCargados',
    'mov'
]);

function mostrarDato(dato) {
    if (dato.length === 1) return dato[0]
    return dato.slice(0, -1).join(', ') + ' y ' + dato[dato.length - 1];
}

// Computed para generar contenido del grid
const itemsGrid = computed(() => {
    const mov = props.mov
    const items = []

    if (!mov) return items

    items.push(`<strong>Tipo:</strong> ${mov.TipoAtaque}`)
    items.push(`<strong>Acción:</strong> ${mov.Accion}`)
    items.push(`<strong>Coste:</strong> ${mov.Coste}`)
    items.push(`<strong>Rango:</strong> ${mov.Rango}`)

    if (mov.Danno) items.push(`<strong>Daño:</strong> ${mov.Danno}`)
    if (mov.Tipo) items.push(`<strong>Tipo Elemental:</strong> ${mov.Tipo}`)
    if (mov.Etiquetas) items.push(`<strong>Etiquetas:</strong> ${mov.Etiquetas}`)
    if (mov.StatsAsociados?.length) {
        items.push(`<strong>Estadísticas asociadas:</strong> ${mostrarDato(mov.StatsAsociados)}`)
    }

    return items
})


</script>


<style scoped>
.seleccionado {
    margin-top: 40px;
    width: 40%;
    height: fit-content;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    box-shadow:
        -2px 2px 10px rgba(0, 0, 0, 0.1),
        2px -2px 10px rgba(0, 0, 0, 0.1),
        2px 2px 10px rgba(0, 0, 0, 0.1),
        -2px -2px 10px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
}

.descripcion p {
    text-align: justify;
}

.descripcion,
.notaFinal {
    margin-top: 10px;
}

.gridTarjeta {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem 1rem;
}

.span-2 {
    grid-column: span 2;
}

@media screen and (max-width: 890px) {
    .seleccionado {
        font-size: 15px;
        padding: 10px;
        margin: 30px 0 20px 0;
        width: 100%;
        box-sizing: border-box;
    }
}
</style>