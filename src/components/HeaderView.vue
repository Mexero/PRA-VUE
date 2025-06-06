<script setup>
import { useRoute, RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import DarkIcon from '../../public/assets/icons/DarkIcon.webp' //ModoNoche
import LightIcon from '../../public/assets/icons/LightIcon.webp' //ModoDia

const oscuro = ref(false)
const icono = ref(DarkIcon)

onMounted(() => {
    oscuro.value = localStorage.getItem('modoOscuro') === 'true';
    icono.value = oscuro.value ? DarkIcon : LightIcon;
})

//TOGGLE MODO OSCURO. TAMBIEN HAY UNA PARTE EN App.vue Y LOS COLORES ESTÁN ALLÍ DUPLICADOS
function toggleModo() {
    oscuro.value = !oscuro.value
    localStorage.setItem('modoOscuro', oscuro.value)
    icono.value = oscuro.value ? DarkIcon : LightIcon

    const root = document.documentElement
    root.style.setProperty('--color-texto', oscuro.value ? 'white' : 'black')
    root.style.setProperty('--color-icon', oscuro.value ? 'invert(100%)' : 'invert(0%)')
    root.style.setProperty('--color-fondo', oscuro.value ? '#17171e' : '#FCFCFC')
    root.style.setProperty('--color-header', oscuro.value ? '#202030' : '#B4D4FF')
    root.style.setProperty('--color-oscuro1', oscuro.value ? '#1B1B26' : '#F8F8F8')
    root.style.setProperty('--color-hoverBloque', oscuro.value ? '#293141' : '#EEF5FF')
    root.style.setProperty('--color-sombraTexto', oscuro.value ? '#ff0051' : '#F8F8F8')
    root.style.setProperty('--color-principal1', oscuro.value ? '#ff0051' : '#94c4ff')
    root.style.setProperty('--color-principal2', oscuro.value ? '#dd576d' : '#b2d7ff')
    root.style.setProperty('--color-secundario', oscuro.value ? '#ff8f8f' : '#529CE6')
    root.style.setProperty('--color-secundario2', oscuro.value ? '#ffffff' : '#badfff')
    root.style.setProperty('--color-tituloTabla', oscuro.value ? 'rgb(176, 28, 60)' : 'rgb(0, 174, 255)')
    root.style.setProperty('--color-tabla1', oscuro.value ? '#f96262' : '#a3cdff')
    root.style.setProperty('--color-tabla2', oscuro.value ? '#ef8181' : '#bae2ff')
    root.style.setProperty('--color-fondoTexto', oscuro.value ? '#293141' : '#EEF5FF')
    root.style.setProperty('--color-BloqueDescargas', oscuro.value ? '#ff0051' : '#A1E3F9')
    root.style.setProperty('--color-hoverBloqueDescargas', oscuro.value ? '#293141' : '#EEF5FF')
}


// Cache todo
function cacheAll() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CACHE_ALL_RESOURCES' });
    }
}


</script>

<template>
    <header>
        <RouterLink to="/">
            <img id="logo" src="../../public/assets/img/logo.webp" alt="Logo">
        </RouterLink>
        <h1>Pokémon Roleplaying Adventures</h1>

        <div id="iconosHeader">
            <div class="icono icono-cargar" title="Cargar toda la web">
                <img src="../../public/assets/icons/CargarTodoIcon.svg" alt="" @click="cacheAll">
            </div>
            <RouterLink to="/">
                <div class="icono icono-discord">
                    <img src="../../public/assets/icons/DiscordIcon.svg" alt="">
                </div>
            </RouterLink>
            <div id="modoNoche" class="icono icono-modo" @click="toggleModo">
                <img :src="icono" alt="Icono cambio de modo">
            </div>
        </div>
    </header>
</template>


<style scoped>
/* ======================= HEADER ======================= */
header {
    height: 100px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    background-color: var(--color-header);
}

#logo {
    width: 80px;
    transition: all 0.2s ease;
}

#logo:hover {
    margin-top: 2px;
        transform: scale(1.05);

}

header h1 {
    font-size: 45px;
    letter-spacing: 3px;
    margin-left: 20px;
    padding-right: 30px;
    color: var(--color-texto);
    text-shadow: 2px 1px 1px var(--color-sombraTexto);
    font-family: "Staatliches", sans-serif;
}

@media screen and (max-width: 920px) {
    header h1 {
        font-size: 35px;
    }
}

@media screen and (max-width: 800px) {
    header h1 {
        font-size: 30px;
    }

    .icono img {
        width: 25px;
        height: 25px;
    }
}

@media screen and (max-width: 550px) {
    header h1 {
        font-size: 24px;
        padding-right: 40px;

    }
}

/* ================== Icono cambio de modo ======================*/
#iconosHeader {
    display: flex;
    gap: 5px;
    position: absolute;
    top: 5px;
    right: 0px;
    height: 30px;
    margin-right: 5px;
}

.icono:hover img {
    transform: scale(0.90);
}

.icono {
    cursor: pointer;
    height: fit-content;
}

.icono img {
    width: 30px;
    height: 30px;
    aspect-ratio: 1/1;
    filter: var(--color-icon);
    transition: transform 0.1s ease-out;
}


@media screen and (max-width: 600px) {
    #iconosHeader {
        display: grid;
        grid-template-columns: repeat(2, auto);
        grid-template-areas:
            "discord modo"
            "cargar cargar";
        gap: 5px;
        max-width: 70px;
        height: fit-content;
    }

    .icono-cargar {
        grid-area: cargar;
        justify-self: end;
    }

    .icono-discord {
        grid-area: discord;
    }

    .icono-modo {
        grid-area: modo;
    }

    .icono img {
        width: 25px;
        height: 25px;
    }
}

@media screen and (max-width: 460px) {
    #iconosHeader {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column-reverse;
        width: 50px;
        height: fit-content;
    }

    .icono {
        display: flex;
        justify-content: end;
    }
}
</style>
