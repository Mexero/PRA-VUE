<script setup>
const props = defineProps(['ficha'])
const ficha = props.ficha

const nombresStats = {
    fue: 'FUERZA',
    agi: 'AGILIDAD',
    res: 'RESISTENCIA',
    men: 'MENTE',
    esp: 'ESPIRITU',
    pre: 'PRESENCIA'
}

//cambiar Mejoras de EST
function cambiarMejoraEST(stat, delta) {
    const mejoras = ficha.personaliz.mejorasEst;
    const max = ficha.derivados.cantidadMejorasEST;

    if (delta > 0) {
        while (delta > 0 && mejoras.length < max) {
            mejoras.push(stat);
            delta--;
        }
    } else if (delta < 0) {
        let eliminadas = 0;
        for (let i = mejoras.length - 1; i >= 0 && eliminadas < -delta; i--) {
            if (mejoras[i] === stat) {
                mejoras.splice(i, 1);
                eliminadas++;
            }
        }
    }
}
</script>

<template>
    <section>
        <div class="puntosDisponibles">
            Mejoras:
            <strong>{{ ficha.derivados.cantidadMejorasEST - ficha.personaliz.mejorasEst.length }}</strong>
        </div>
        <div class="statsYSaves">
            <div class="stats">
                <div class="item" v-for="stat in ['fue', 'agi', 'res', 'men', 'esp', 'pre']" :key="stat">
                    {{ nombresStats[stat] + " " }}
                    <div class="statsContenido">
                        <span class="bonoStat" v-if="ficha.derivados.stats[stat] > ficha.pokedex.statsBase[stat]">
                            +{{ ficha.derivados.stats[stat] - ficha.pokedex.statsBase[stat] }}
                        </span>
                        <span class="numStat">{{ ficha.derivados.stats[stat] }}</span>
                        <div class="botonMaxMenos">
                            <button class="btn-mas" @click="cambiarMejoraEST(stat, 1)"></button>
                            <button class="btn-menos" @click="cambiarMejoraEST(stat, -1)"></button>
                        </div>
                    </div>
                    <span v-if="['fue', 'agi', 'res', 'esp'].includes(stat)"></span>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.statsYSaves{
    width: fit-content;
}

.stats {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
}

.item {
    display: flex;
    align-items: center;
    flex-direction: column;
    border: 1px solid rgba(150, 150, 150, 0.798);
    padding: 10px 0;
    width: 115px;
}

.stats div:first-child {
    border-radius: 10px 10px 0  0 ;
}
.stats div:last-child {
    border-radius: 0 0 10px 10px ;
}
.numStat {
    grid-column: 2;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}

.statsContenido {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 15px 20px 20px;
    gap: 5px;
}

.botonMaxMenos {
    grid-column: 3;
    display: flex;
    flex-direction: column;
    gap: 3px;

}

.botonMaxMenos button {
    width: 10px;
    height: 10px;
    background: var(--color-principal1);
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    border: none;
}

.btn-menos {
    grid-row: 2;
    grid-column: 2;
    cursor: pointer;
    transform: rotate(180deg);
}

.btn-mas {
    grid-row: 1;
    grid-column: 2;
    cursor: pointer;
}


.mejoras {
    display: flex;
    align-items: center;
}

.puntosDisponibles {
    margin-top: 10px;
}

@media screen and (max-width: 920px) {
    .stats {
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px 0;
    }

    .item {
        margin: 0 auto;
    }

    section {
        width: 100%;
        display: flex;
        flex-direction: column;

    }
}

@media screen and (max-width: 545px) {
    .stats {
        margin: 10px 0;
        padding: 5px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        gap: 10px;

    }






}
</style>
