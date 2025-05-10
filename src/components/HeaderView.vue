<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { ref, watch, onMounted } from 'vue'

import DarkIcon from '@/assets/icons/DarkIcon.webp' //Modonoche
import LightIcon from '@/assets/icons/LightIcon.webp' //ModoNoche

import menu from '../localData/json/datosMenuHeader.json' //Info submenus

const oscuro = ref(false)
const icono = ref(LightIcon)

onMounted(() => {
    oscuro.value = localStorage.getItem('modoOscuro') === 'true'
    icono.value = oscuro.value ? DarkIcon : LightIcon
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
    root.style.setProperty('--color-segundario', oscuro.value ? '#ff8f8f' : '#529CE6')
    root.style.setProperty('--color-segundario2', oscuro.value ? '#ffffff' : '#73BDFF')
    root.style.setProperty('--color-tabla1', oscuro.value ? '#a92e4d' : '#76aef1')
    root.style.setProperty('--color-tabla2', oscuro.value ? '#de4a54' : '#b7dbf4')
    root.style.setProperty('--color-fondoTexto', oscuro.value ? '#293141' : '#EEF5FF')
    root.style.setProperty('--color-BloqueDescargas', oscuro.value ? '#ff0051' : '#A1E3F9')
    root.style.setProperty('--color-hoverBloqueDescargas', oscuro.value ? '#293141' : '#EEF5FF')
}

//METODOS PARA SUBMENUS


const openIndex = ref(null)
const route = useRoute()

//Cambia los menus al clicar otro o clicar para cerrar
function toggleSubmenu(index) {
    openIndex.value = openIndex.value === index ? null : index
}

// Cierra submenus al cambiar de ruta
watch(() => route.fullPath, () => {
    openIndex.value = null
})

</script>

<template>
    <header>
        <img src="../assets/img/logo.webp" alt="">

        <h1>Pokémon Roleplaying Adventures</h1>

        <div id="modoNoche" @click="toggleModo">
            <img src="../assets/icons/DarkIcon.webp" alt="Imagen modo oscuro">
        </div>
    </header>
    <nav id="menu">
        <!-- Menú principal -->
        <ul>
            <li>
                <RouterLink to="/">Inicio</RouterLink>
            </li>
            <!-- Elemento de menú con submenú -->
            <li v-for="(section, index) in menu" :key="index">
                <div @click="toggleSubmenu(index)">
                    {{ section.title }}
                </div>
                <ul v-if="openIndex === index">
                    <li v-for="(subsection, subindex) in section.submenu" :key="subindex">
                        <RouterLink :to=subsection.route>{{ subsection.name }}</RouterLink>
                    </li>
                </ul>
            </li>
            <!--buscador-->
            <li id="buscador">
                <form method="get" id="buscar">
                    <fieldset id="barraBuscar">
                        <input type="text" id="search-input" placeholder="Buscar" aria-label="Buscar" />
                        <button type="submit" class="search-button" aria-label="Buscar">
                            <img src="../assets/icons/lupa.svg" alt="Icono de búsqueda" />
                        </button>
                    </fieldset>
                </form>
            </li>
        </ul>
    </nav>
</template>


<style scoped>
/* ======================= HEADER ======================= */
header {
    background-color: var(--color-header);
    height: 110px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 20px;
}

header h1 {
    font-size: 23px;
    letter-spacing: 3px;
    margin-left: 30px;
    color: var(--color-texto);
    text-shadow: 1px 1px var(--color-sombraTexto);
    font-family: "Staatliches", sans-serif;
}

header img {
    width: 80px;
}

/* ================== Icono cambio de modo ======================*/
#modoNoche {
    position: absolute;
    top: 5px;
    right: 0px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}

#modoNoche:hover {
    cursor: pointer;
}

#modoNoche img {
    width: 35px;
    filter: var(--color-icon);
    transition: transform 0.1s ease-out;
}

#modoNoche:hover img {
    transform: scale(0.85);
}























/* ======================= BARRA DE BUSCAR DEL NAV PRINCIPAL ======================= */
#barraBuscar {
    display: flex;
    flex-direction: row;
    border: none;
}

#search-input {
    width: 100%;
    height: 45px;
    padding-left: 10px;
    border: none;
}

#search-input:focus {
    outline: none;
}

.search-button {
    height: 45px;
    background-color: var(--color-principal1);
    border: none;
    border-top: 1px solid black;
}

.search-button img {
    width: 45px;
    height: 45px;
    padding: 5px;
}
</style>
