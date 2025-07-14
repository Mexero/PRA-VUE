<script setup>
import { ref } from 'vue'

const tooltip = ref({
    visible: false,
    text: '',
    color: '',
    x: 0,
    y: 10
})
const tablaTipos = [
    {
        tipo: 'steel',
        nombre: 'Acero',
        efectivo: ['ice', 'rock', 'fairy'],
        pocoEfectivo: ['fire', 'water', 'electric', 'steel'],
        debil: ['fire', 'fighting', 'ground'],
        inmune: ['poison']
    },
    {
        tipo: 'flying',
        nombre: 'Volador',
        efectivo: ['grass', 'bug', 'fighting'],
        pocoEfectivo: ['electric', 'rock', 'steel'],
        debil: ['rock', 'ice', 'electric'],
        inmune: []
    },
    {
        tipo: 'water',
        nombre: 'Agua',
        efectivo: ['fire', 'rock', 'ground'],
        pocoEfectivo: ['water', 'grass', 'dragon'],
        debil: ['grass', 'electric'],
        inmune: []
    },
    {
        tipo: 'ice',
        nombre: 'Hielo',
        efectivo: ['grass', 'ground', 'flying', 'dragon'],
        pocoEfectivo: ['fire', 'water', 'ice', 'steel'],
        debil: ['fire', 'fighting', 'rock', 'steel'],
        inmune: []
    },
    {
        tipo: 'grass',
        nombre: 'Planta',
        efectivo: ['water', 'rock', 'ground'],
        pocoEfectivo: ['fire', 'grass', 'dragon', 'bug', 'poison', 'flying', 'steel'],
        debil: ['ice', 'poison', 'flying', 'bug'],
        inmune: []
    },
    {
        tipo: 'bug',
        nombre: 'Bicho',
        efectivo: ['grass', 'psychic', 'dark'],
        pocoEfectivo: ['fire', 'fighting', 'flying', 'ghost', 'fairy', 'steel'],
        debil: ['fire', 'flying', 'rock'],
        inmune: []
    },
    {
        tipo: 'electric',
        nombre: 'Eléctrico',
        efectivo: ['water', 'flying'],
        pocoEfectivo: ['electric', 'grass', 'dragon'],
        debil: ['ground'],
        inmune: []
    },
    {
        tipo: 'normal',
        nombre: 'Normal',
        efectivo: [],
        pocoEfectivo: ['rock', 'steel'],
        debil: ['fighting'],
        inmune: ['ghost']
    },
    {
        tipo: 'rock',
        nombre: 'Roca',
        efectivo: ['fire', 'ice', 'flying', 'bug'],
        pocoEfectivo: ['fighting', 'ground', 'steel'],
        debil: ['water', 'grass', 'fighting', 'ground', 'steel'],
        inmune: []
    },
    {
        tipo: 'ground',
        nombre: 'Tierra',
        efectivo: ['fire', 'electric', 'poison', 'rock', 'steel'],
        pocoEfectivo: ['grass', 'bug', 'flying'],
        debil: ['water', 'grass', 'ice'],
        inmune: ['electric']
    },
    {
        tipo: 'fire',
        nombre: 'Fuego',
        efectivo: ['grass', 'ice', 'bug', 'steel'],
        pocoEfectivo: ['fire', 'water', 'rock', 'dragon'],
        debil: ['water', 'ground', 'rock'],
        inmune: []
    },
    {
        tipo: 'fighting',
        nombre: 'Lucha',
        efectivo: ['normal', 'rock', 'ice', 'dark', 'steel'],
        pocoEfectivo: ['flying', 'poison', 'bug', 'fairy', 'psychic'],
        debil: ['flying', 'psychic', 'fairy'],
        inmune: []
    },
    {
        tipo: 'fairy',
        nombre: 'Hada',
        efectivo: ['fighting', 'dragon', 'dark'],
        pocoEfectivo: ['fire', 'poison', 'steel'],
        debil: ['steel', 'poison'],
        inmune: ['dragon']
    },
    {
        tipo: 'psychic',
        nombre: 'Psíquico',
        efectivo: ['fighting', 'poison'],
        pocoEfectivo: ['psychic', 'steel'],
        debil: ['bug', 'ghost', 'dark'],
        inmune: []
    },
    {
        tipo: 'poison',
        nombre: 'Veneno',
        efectivo: ['grass', 'fairy'],
        pocoEfectivo: ['poison', 'ground', 'rock', 'ghost'],
        debil: ['ground', 'psychic'],
        inmune: []
    },
    {
        tipo: 'dragon',
        nombre: 'Dragón',
        efectivo: ['dragon'],
        pocoEfectivo: ['steel'],
        debil: ['ice', 'dragon', 'fairy'],
        inmune: []
    },
    {
        tipo: 'ghost',
        nombre: 'Fantasma',
        efectivo: ['psychic', 'ghost'],
        pocoEfectivo: ['dark'],
        debil: ['ghost', 'dark'],
        inmune: ['normal', 'fighting']
    },
    {
        tipo: 'dark',
        nombre: 'Siniestro',
        efectivo: ['psychic', 'ghost'],
        pocoEfectivo: ['fighting', 'dark', 'fairy'],
        debil: ['bug', 'fairy', 'fighting'],
        inmune: ['psychic']
    }
]

const tipos = {
    steel: { nombre: 'Acero', color: '#5695a3' },
    fire: { nombre: 'Fuego', color: '#fba54c' },
    water: { nombre: 'Agua', color: '#539ddf' },
    grass: { nombre: 'Planta', color: '#5fbd58' },
    electric: { nombre: 'Eléctrico', color: '#f2d94e', textColor: '#333' },
    ice: { nombre: 'Hielo', color: '#75d0c1', textColor: '#333' },
    fighting: { nombre: 'Lucha', color: '#d3425f' },
    poison: { nombre: 'Veneno', color: '#b763cf' },
    ground: { nombre: 'Tierra', color: '#da7c4d' },
    flying: { nombre: 'Volador', color: '#a1bbec', textColor: '#333' },
    psychic: { nombre: 'Psíquico', color: '#fa8581' },
    bug: { nombre: 'Bicho', color: '#92bc2c', textColor: '#333' },
    rock: { nombre: 'Roca', color: '#c9bb8a', textColor: '#333' },
    ghost: { nombre: 'Fantasma', color: '#5f6dbc' },
    dragon: { nombre: 'Dragón', color: '#0c69c8' },
    dark: { nombre: 'Siniestro', color: '#595761' },
    fairy: { nombre: 'Hada', color: '#ee90e6', textColor: '#333' },
    normal: { nombre: 'Normal', color: '#a0a29f', textColor: '#333' }
}

function showTooltip(tipo, event, mostrar = true) {
    if (!mostrar) return
    tooltip.value.visible = true
    tooltip.value.text = tipos[tipo].nombre
    tooltip.value.color = tipos[tipo].color
    tooltip.value.textColor = tipos[tipo].textColor || '#fff'
    tooltip.value.x = event.clientX - 30
    tooltip.value.y = event.clientY + 23
}

function hideTooltip() {
    tooltip.value.visible = false
}
</script>

<template>

    <div class="scrollTabla">
        <table id="tablaTipos">
            <thead>
                <tr>
                    <th>Tipo</th>
                    <th>Efectivo contra</th>
                    <th>Poco efectivo contra</th>
                    <th>Débil contra</th>
                    <th>Inmune a</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="fila in tablaTipos" :key="fila.tipo">
                    <td class="tipo-nombre" :class="fila.tipo">
                        <div>
                            <img class="icono-tipo" :class="fila.tipo" :src="`/assets/icons/${fila.tipo}.svg`"
                                @mouseenter="showTooltip(fila.tipo, $event, false)"
                                @mousemove="showTooltip(fila.tipo, $event, false)" @mouseleave="hideTooltip" />
                            {{ fila.nombre }}
                        </div>
                    </td>
                    <td class="grupo-iconos">
                        <img v-for="t in fila.efectivo" :key="t" class="icono-tipo" :class="t"
                            :src="`/assets/icons/${t}.svg`" @mouseenter="showTooltip(t, $event)"
                            @mousemove="showTooltip(t, $event)" @mouseleave="hideTooltip" />
                    </td>
                    <td class="grupo-iconos">
                        <img v-for="t in fila.pocoEfectivo" :key="t" class="icono-tipo" :class="t"
                            :src="`/assets/icons/${t}.svg`" @mouseenter="showTooltip(t, $event)"
                            @mousemove="showTooltip(t, $event)" @mouseleave="hideTooltip" />
                    </td>
                    <td class="grupo-iconos">
                        <img v-for="t in fila.debil" :key="t" class="icono-tipo" :class="t"
                            :src="`/assets/icons/${t}.svg`" @mouseenter="showTooltip(t, $event)"
                            @mousemove="showTooltip(t, $event)" @mouseleave="hideTooltip" />
                    </td>
                    <td class="grupo-iconos">
                        <img v-for="t in fila.inmune" :key="t" class="icono-tipo" :class="t"
                            :src="`/assets/icons/${t}.svg`" @mouseenter="showTooltip(t, $event)"
                            @mousemove="showTooltip(t, $event)" @mouseleave="hideTooltip" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="tooltip.visible" :style="{
        position: 'fixed',
        left: tooltip.x + 'px',
        top: tooltip.y + 'px',
        background: tooltip.color,
        color: tooltip.textColor,
        padding: '6px 16px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '16px',
        whiteSpace: 'nowrap',
        zIndex: 9999,
        pointerEvents: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }">
        {{ tooltip.text }}
    </div>
</template>

<style scoped>
#tablaTipos {
    text-align: center;
    margin: 0 auto;
    border-collapse: collapse;
    color: var(--color-texto);
    background-color: var(--color-fondoTexto);
    overflow-y: scroll;
    min-width: 1000px;
    border: 1px solid var(--color-texto);
}

.scrollTabla {

    margin: 80px ;
    overflow-x: auto;
    overflow-y: hidden;
}

.tipo-nombre {
    width: 120px;
}

.tipo-nombre div {
    display: flex;
    margin-left: 15px;
    gap: 5px;
}

.icono-tipo {
    width: 20px;
    height: 20px;
}

.grupo-iconos {
    padding-top: 5px;
    background-color: rgba(136, 151, 192, 0.5);
}

.grupo-iconos:first-child {
    height: 50px;
}

.grupo-iconos:last-child {
    width: 95px;
}

.grupo-iconos img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    margin: 0 2px;
    padding: 8px;
    border-radius: 50%;
    overflow: visible;
    user-drag: none;
    -webkit-user-drag: none;
}

#tablaTipos th {
    height: 40px;
    border: 1px solid var(--color-texto);
    background-color: var(--color-tituloTabla);

}

#tablaTipos tr {
    border-bottom: 1px solid var(--color-texto);
}

#tablaTipos td {
    border-right: 1px solid var(--color-texto);

}

@media screen and (max-width: 1000px) {
    #tablaTipos {

        min-width: 700px;
    }

    .grupo-iconos img {
        width: 25px;
        height: 25px;
        padding: 4px;
    }

    .grupo-iconos:last-child {
        width: 70px;
    }

}

.bug {
    background: #92bc2c;
}

.dark {
    background: #595761;
}

.dragon {
    background: #0c69c8;
}

.electric {
    background: #f2d94e;
}

.fire {
    background: #fba54c;
}

.fairy {
    background: #ee90e6;
}

.fighting {
    background: #d3425f;
}

.flying {
    background: #a1bbec;
}

.ghost {
    background: #5f6dbc;
}

.grass {
    background: #5fbd58;
}

.ground {
    background: #da7c4d;
}

.ice {
    background: #75d0c1;
}

.normal {
    background: #a0a29f;
}

.poison {
    background: #b763cf;
}

.psychic {
    background: #fa8581;
}

.rock {
    background: #c9bb8a;
}

.steel {
    background: #5695a3;
}

.water {
    background: #539ddf;
}
</style>
