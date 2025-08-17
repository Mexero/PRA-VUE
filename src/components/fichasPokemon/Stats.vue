<template>
    <section>
        <div class="puntosDisponibles">
            Puntos disponibles:
            <strong>{{ ficha.derivados.cantidadMejorasEST - ficha.personaliz.mejorasEst.length }}</strong>
        </div>
        <div class="statsYSaves">
            <div class="stats">
                <h3>Estadisticas</h3>
                <div class="item" v-for="stat in ['fue', 'agi', 'res', 'men', 'esp', 'pre']" :key="stat">
                    {{ stat.toUpperCase() + " " }}
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

<script setup>
const props = defineProps(['ficha'])
const ficha = props.ficha

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

<style scoped>
.stats {
    margin: 10px 0;
    padding: 5px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 10px;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
}

.stats h3 {
    grid-column: 1 / -1;
    text-align: center;
}

.item {
    display: flex;
    align-items: center;
    flex-direction: column;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 5px;
    padding: 5px;
    width: 100px;
}

.bonoStat {
    grid-column: 1;
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
