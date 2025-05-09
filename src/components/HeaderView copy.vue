<script setup>
import { RouterLink } from 'vue-router'

//COSA PARA PROBAR
import { ref } from 'vue'

const openIndex = ref(null)

const menuItems = [
    {
        title: 'Capitulos',
        route: 'capitulos',
        submenu: [{ name: 'Subitem 1.1', route: '/ruta1' },
        { name: 'Subitem 1.2', route: '/ruta2' }]
    },
    {
        title: 'Item 2',
        submenu: ['Subitem 2.1', 'Subitem 2.2']
    },
    {
        title: 'Item 3',
        submenu: ['Subitem 3.1', 'Subitem 3.2']
    }
]

function toggleSubmenu(index) {
    openIndex.value = openIndex.value === index ? null : index
}
</script>

<!--//TEMPLATE A MEDIAS
<template>

  <ul>
    <li v-for="(item, index) in menuItems" :key="index">
      <div @click="toggleSubmenu(index)" class="cursor-pointer">
        {{ item.title }}
      </div>
      <ul v-if="openIndex === index" class="ml-4">
        <li v-for="(subitem, subindex) in item.submenu" :key="subindex">
          <RouterLink to="">{{ subitem.name }}</RouterLink>
            
        </li>
      </ul>
    </li>
  </ul>
</template>

-->




<template>
    <header>
        <img src="../assets/img/logo.webp" alt="">

        <h1>Pokémon Roleplaying Adventures</h1>

        <div id="modoNoche">
            <img src="../assets/icons/DarkIcon.webp" alt="Imagen modo oscuro">
        </div>
    </header>


    <nav class="sticky" id="menu1">
        <!-- Botón de menú accesible -->
        <div id="botonMenu" aria-label="Abrir menú">
            <img src="../assets/icons/menu.svg" alt="">
        </div>

        <!-- Menú principal -->
        <ul id="menuPrincipal">

            <!-- Elemento de menú con submenú -->
            <li class="abrirMenu">
                <RouterLink to="../inicio" class="textoMenu">Inicio</RouterLink>
            </li>
            <li class="abrirMenu" aria-haspopup="true">
                <div class="textoMenu"> Capítulos </div>
                <ul class="subMenu" role="menu">
                    <li>
                        <RouterLink to="/capitulos/introduccion">Introducción</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/capitulos/comojugar">Cómo Jugar</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/capitulos/creacionpj">Creación de Personaje</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/capitulos/clases">Clases</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/capitulos/movhabdot"><span class="ajustarTamañoLetra">Movimientos, Habilidades
                                y Dotes</span></RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/capitulos/pokemon">Pokémon</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/capitulos/combate">Combate</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/capitulos/concursos">Concursos Pokémon</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/capitulos/objetos">Equipo y Objetos</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/capitulos/otrasreglas">Otras Reglas Menores</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/capitulos/dirigir">Dirigiendo el juego</RouterLink>
                    </li>
                </ul>
            </li>

            <li class="abrirMenu" aria-haspopup="true">
                <div class="textoMenu">Jugador</div>
                <ul class="subMenu" role="menu">
                    <li>
                        <RouterLink to="../clases">Clases</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../dotes">Dotes</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../objetos">Objetos</RouterLink>
                    </li>
                </ul>
            </li>

            <li class="abrirMenu" aria-haspopup="true">
                <div class="textoMenu"> Pokémon</div>
                <ul class="subMenu" role="menu">
                    <li>
                        <RouterLink to="/pokedex">Pokédex</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/movimientos">Movimientos</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/habilidades">Habilidades</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/recursos/tablatipos">Tabla de Tipos</RouterLink>
                    </li>

                </ul>
            </li>

            <li class="abrirMenu" aria-haspopup="true">
                <div class="textoMenu">Reglas</div>
                <ul class="subMenu" role="menu">
                    <li>
                        <RouterLink to="">Índice</RouterLink>
                    </li>
                </ul>
            </li>

            <li class="abrirMenu" aria-haspopup="true">
                <div class="textoMenu"> Utilidades</div>
                <ul class="subMenu" role="menu">
                    <li>
                        <RouterLink to="/utilidades">Generar Pokémon</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/utilidades">Dados</RouterLink>
                    </li>

                </ul>
            </li>

            <!-- Buscador -->
            <li id="buscador">
                <form method="get" id="buscar" role="search">
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


    <!--======================== MENU 2 ==================================-->
    <nav class="sticky" id="menu2">

        <!-- Menú principal -->
        <ul id="menuPrincipal2">

            <!-- Elemento de menú con submenú -->
            <li class="abrirMenu">

                <RouterLink to="/" class="textoMenu">Inicio</RouterLink>

            </li>

            <li class="abrirMenu" aria-haspopup="true">
                <div class="textoMenu">Capítulos</div>
                <ul class="subMenu" role="menu">
                    <li>
                        <RouterLink to="../capitulos/capitulos.php?filtro=introduccion">Introducción</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../capitulos/capitulos.php?filtro=comoJugar">Cómo Jugar</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../capitulos/capitulos.php?filtro=creacionPJ">Creación de Personaje</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../capitulos/capitulos.php?filtro=clases">Clases</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../capitulos/capitulos.php?filtro=movHabDot"><span
                                class="ajustarTamañoLetra">Movimientos, Habilidades y Dotes</span></RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../capitulos/capitulos.php?filtro=pokemon">Pokémon</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../capitulos/capitulos.php?filtro=combate">Combate</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../capitulos/capitulos.php?filtro=concursos">Concursos Pokémon</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../capitulos/capitulos.php?filtro=equiObje">Equipo y Objetos</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../capitulos/capitulos.php?filtro=otrasReglas">Otras Reglas Menores</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../capitulos/capitulos.php?filtro=dirigir">Dirigiendo el juego</RouterLink>
                    </li>
                </ul>
            </li>

            <li class="abrirMenu" aria-haspopup="true">
                <div class="textoMenu"> Jugador</div>
                <ul class="subMenu" role="menu">
                    <li>
                        <RouterLink to="../clases/clases.php">Clases</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../dotes/dotes.php">Dotes</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../objetos/objetos.php">Objetos</RouterLink>
                    </li>
                </ul>
            </li>

            <li class="abrirMenu" aria-haspopup="true">
                <div class="textoMenu"> Pokémon</div>
                <ul class="subMenu" role="menu">
                    <li>
                        <RouterLink to="../pokedex/pokedex.php">Pokédex</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../movimientos/movimientos.php">Movimientos</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../habilidades/habilidades.php">Habilidades</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../tablaTipos/tablaTipos.php">Tabla de Tipos</RouterLink>
                    </li>
                </ul>
            </li>

            <li class="abrirMenu" aria-haspopup="true">
                <div class="textoMenu">Reglas </div>
                <ul class="subMenu" role="menu">
                    <li>
                        <RouterLink to="">Índice</RouterLink>
                    </li>
                </ul>
            </li>

            <li class="abrirMenu borde" aria-haspopup="true">
                <div class="textoMenu"> Utilidades</div>
                <ul class="subMenu" role="menu">
                    <li>
                        <RouterLink to="../utilidades/generarPoke.php">Generar Pokémon</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="../utilidades/dados.php">Dados</RouterLink>
                    </li>

                </ul>
            </li>

            <!-- Buscador -->
            <li id="buscador">
                <form method="get" id="buscar" role="search">
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