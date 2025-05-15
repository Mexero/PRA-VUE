<script setup>
import { useRoute, RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import DarkIcon from '@/assets/icons/DarkIcon.webp' //ModoNoche
import LightIcon from '@/assets/icons/LightIcon.webp' //ModoDia

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
    root.style.setProperty('--color-tabla1', oscuro.value ? '#a92e4d' : '#76aef1')
    root.style.setProperty('--color-tabla2', oscuro.value ? '#de4a54' : '#b7dbf4')
    root.style.setProperty('--color-fondoTexto', oscuro.value ? '#293141' : '#EEF5FF')
    root.style.setProperty('--color-BloqueDescargas', oscuro.value ? '#ff0051' : '#A1E3F9')
    root.style.setProperty('--color-hoverBloqueDescargas', oscuro.value ? '#293141' : '#EEF5FF')
}

</script>

<template>
    <header>
        <RouterLink to="/">
            <img src="../assets/img/logo.webp" alt="">
        </RouterLink>
        <h1>Pokémon Roleplaying Adventures</h1>

        <div id="modoNoche" @click="toggleModo">

            <img :src="icono" alt="Imagen modo oscuro">

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

header img {
    width: 80px;
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

@media screen and (max-width: 820px) {
    header h1 {
        font-size: 35px;
    }
}

@media screen and (max-width: 695px) {
    header h1 {
        font-size: 30px;
    }
}

@media screen and (max-width: 465px) {
    header h1 {
        font-size: 24px;
    }
}


/* ================== Icono cambio de modo ======================*/
#modoNoche {
    position: absolute;
    top: 5px;
    right: 0px;
    width: 30px;
    height: 30px;
}

#modoNoche:hover {
    cursor: pointer;
}

#modoNoche img {
    width: 30px;
    filter: var(--color-icon);
    transition: transform 0.1s ease-out;
}

#modoNoche:hover img {
    transform: scale(0.90);
}
</style>
