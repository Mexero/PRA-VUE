<script setup>
import { computed } from 'vue'

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

// Computed para calcular mejoras de estadísticas disponibles
const mejorasEstDisponibles = computed(() => {
    const total = ficha.derivados.cantidadMejorasEST || 0
    const usadas = ficha.personaliz.mejorasEst.length
    return Math.max(0, total - usadas)
})

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
    <section class="stats-section">
        <div class="stats-header" v-if="mejorasEstDisponibles > 0">
            <div class="mejoras-disponibles" :title="`Mejoras de estadísticas disponibles: ${mejorasEstDisponibles}`">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-secundario)"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <span class="mejoras-numero">{{ mejorasEstDisponibles }}</span>
            </div>
        </div>
        <div class="statsYSaves">
            <div class="stats">
                <div class="item" v-for="stat in ['fue', 'agi', 'res', 'men', 'esp', 'pre']" :key="stat">
                    <span class="stat-title">{{ nombresStats[stat] }}</span>
                    <div class="statsContenido">
                        <span class="bonoStat" v-if="ficha.derivados.stats[stat] > ficha.pokedex.statsBase[stat]">
                            +{{ ficha.derivados.stats[stat] - ficha.pokedex.statsBase[stat] }}
                        </span>
                        <h3 class="numStat">{{ ficha.derivados.stats[stat] }}</h3>
                        <div class="botonMaxMenos botones-desktop">
                            <button class="btn-mas" @click="cambiarMejoraEST(stat, 1)">+</button>
                            <button class="btn-menos" @click="cambiarMejoraEST(stat, -1)">-</button>
                        </div>

                    </div>
                    <div class="botonMaxMenos botones-mobile">
                        <button class="btn-mas" @click="cambiarMejoraEST(stat, 1)">+</button>
                        <button class="btn-menos" @click="cambiarMejoraEST(stat, -1)">-</button>
                    </div>
                    <span v-if="['fue', 'agi', 'res', 'esp'].includes(stat)"></span>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.stats-section {
    position: relative;
    width: fit-content;
}

.stats-header {
    position: absolute;
    top: -14px;
    left: 80px;
    z-index: 3;
}

.mejoras-disponibles {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px;
    border: 1px solid var(--color-secundario);
    border-radius: 5px;
    background: var(--color-fondoTexto);
    cursor: default;
}

.mejoras-numero {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-secundario);
    min-width: 16px;
    text-align: center;
}

.statsYSaves {
    width: fit-content;
}

.stats {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid rgba(150, 150, 150, 0.798);
    border-radius: 10px;
    height: fit-content;
    justify-content: space-between;
    font-weight: bold;
}

.item {
    display: flex;
    align-items: center;
    flex-direction: column;
    border-bottom: 1px solid rgba(150, 150, 150, 0.798);
    padding: 10px 0;
    width: 120px;
    letter-spacing: 1px;
}

.item:last-child {
    border-bottom: none;
}

.stats div:first-child {
    border-radius: 10px 10px 0 0;
}

.stats div:last-child {
    border-radius: 0 0 10px 10px;
}

.numStat {
    grid-column: 2;
    font-weight: normal;
    display: flex;
    align-items: center;
    justify-content: center;
}

.statsContenido {
    font-weight: normal;
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 15px 20px 20px;
    gap: 5px;
    height: 25px;
}

.botonMaxMenos {
    grid-column: 3;
    display: flex;
    flex-direction: column;
    gap: 3px;

}

.botonMaxMenos button {
    width: 20px;
    height: 20px;
    background: var(--color-principal1);
    border: none;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    color: var(--color-texto);
}

/* Control de visibilidad de botones */
.botones-desktop {
    display: block;
}

.botones-mobile {
    display: none;
}

.btn-menos {
    grid-row: 2;
    grid-column: 2;
    cursor: pointer;
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


@media screen and (max-width: 750px) {
    .stats-section {
        position: relative;
        width: 100%;
    }

    .stats {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
        border: none;
        overflow: hidden;
    }

    .statsYSaves {
        width: 100%;
    }

    section {
        width: 100%;
        display: flex;
        flex-direction: column;
    }


    .stats div:first-child {
        border-radius: 0;
    }

    .stats div:last-child {
        border-radius: 0;
    }

    .stats .item:first-child {
        border: 1px solid rgba(150, 150, 150, 0.798);
        border-radius: 10px 0 0 0;
    }

    .stats .item:nth-child(2) {
        border: 1px solid rgba(150, 150, 150, 0.798);
        border-radius: 0 10px 0 0;
    }

    .stats .item:nth-child(3) {
        border-left: 1px solid rgba(150, 150, 150, 0.798);
        border-right: 1px solid rgba(150, 150, 150, 0.798);
    }

    .stats .item:nth-child(4) {
        border-left: 1px solid rgba(150, 150, 150, 0.798);
        border-right: 1px solid rgba(150, 150, 150, 0.798);
    }

    .stats .item:nth-child(5) {
        border: 1px solid rgba(150, 150, 150, 0.798);
        border-radius: 0 0 0 10px;
    }

    .stats .item:last-child {
        border: 1px solid rgba(150, 150, 150, 0.798);
        border-radius: 0 0 10px 0;
    }


    .botonMaxMenos {
        grid-column: 3;
        display: flex;
        flex-direction: column;
        gap: 3px;
        height: f;

    }

    .botonMaxMenos button {
        width: 30px;
        height: 30px;
        background: var(--color-principal1);
        border: none;
        border-radius: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        color: var(--color-texto);
    }

    .btn-menos {
        grid-row: 2;
        grid-column: 2;
        cursor: pointer;
    }



    .btn-mas {
        grid-row: 1;
        grid-column: 2;
        cursor: pointer;
    }

    /* Control de visibilidad de botones duplicados en móvil */
    .botones-desktop {
        display: none;
    }

    .botones-mobile {
        display: block;
    }

    .botones-mobile button {
        width: 40px;
        height: 40px;
        background: var(--color-principal1);
        border: none;
        border-radius: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 22px;
        font-weight: bold;
        color: var(--color-texto);

    }

    .statsContenido {
        font-weight: normal;
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: auto;
        gap: 10px;
        height: fit-content;
        font-size: 24px;
    }

    .item {
        display: grid;
        grid-template-columns: 1fr 40px;
        grid-template-rows: auto auto;
        grid-template-areas:
            "title buttons"
            "value buttons";
        font-size: 20px;
        padding: 0px;
        border: 1px solid rgba(150, 150, 150, 0.25);
        width: 100%;
        position: relative;
        align-items: center;


    }

    .stat-title {
        grid-area: title;
        text-align: center;
        font-size: 18px;

    }

    .bonoStat {
        text-align: right;

    }

    .statsContenido {
        grid-area: value;
        display: grid;
        grid-template-columns: 60px 20px;
        grid-template-rows: auto;
        align-items: center;
        font-size: 22px;
    }

    .botonMaxMenos.botones-mobile {
        grid-area: buttons;
        justify-self: end;
    }


    .botones-mobile .btn-mas {
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        border-left: 1px solid rgba(255, 255, 255, 0.5);
    }

    .botones-mobile .btn-menos {
        border-left: 1px solid rgba(255, 255, 255, 0.5);
    }

    .botones-mobile {
        overflow: hidden;
    }

    .stats-header {
    position: absolute;
    top: -16px;
    left: -15px;
  
    z-index: 3;
}
}

/*
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
*/
</style>
