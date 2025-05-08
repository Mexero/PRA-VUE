

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
            <a href="../inicio" class="textoMenu">Inicio</a>
        </li>
        <li class="abrirMenu" aria-haspopup="true">
            <div class="textoMenu"> Capítulos </div>
            <ul class="subMenu" role="menu">
                <li><a href="../capitulos/capitulos.php?filtro=introduccion">Introducción</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=comoJugar">Cómo Jugar</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=creacionPJ">Creación de Personaje</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=clases">Clases</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=movHabDot"><span class="ajustarTamañoLetra">Movimientos, Habilidades y Dotes</span></a></li>
                <li><a href="../capitulos/capitulos.php?filtro=pokemon">Pokémon</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=combate">Combate</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=concursos">Concursos Pokémon</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=equiObje">Equipo y Objetos</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=otrasReglas">Otras Reglas Menores</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=dirigir">Dirigiendo el juego</a></li>
            </ul>
        </li>

        <li class="abrirMenu" aria-haspopup="true">
            <div class="textoMenu">Jugador</div>
            <ul class="subMenu" role="menu">
                <li><a href="../clases/clases.php">Clases</a></li>
                <li><a href="../dotes/dotes.php">Dotes</a></li>
                <li><a href="../objetos/objetos.php">Objetos</a></li>
            </ul>
        </li>

        <li class="abrirMenu" aria-haspopup="true">
            <div class="textoMenu"> Pokémon</div>
            <ul class="subMenu" role="menu">
                <li><a href="../pokedex/pokedex.php">Pokédex</a></li>
                <li><a href="../movimientos/movimientos.php">Movimientos</a></li>
                <li><a href="..habilidades/habilidades.php">Habilidades</a></li>
                <li><a href="../tablaTipos/tablaTipos.php">Tabla de Tipos</a></li>

            </ul>
        </li>

        <li class="abrirMenu" aria-haspopup="true">
            <div class="textoMenu">Reglas</div>
            <ul class="subMenu" role="menu">
                <li><a href="">Índice</a></li>
            </ul>
        </li>

        <li class="abrirMenu" aria-haspopup="true">
            <div class="textoMenu"> Utilidades</div>
            <ul class="subMenu" role="menu">
                <li><a href="../utilidades/generarPoke.php">Generar Pokémon</a></li>
                <li><a href="../utilidades/dados.php">Dados</a></li>

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

            <a href="../inicio/index.php" class="textoMenu">Inicio</a>

        </li>

        <li class="abrirMenu" aria-haspopup="true">
            <div class="textoMenu">Capítulos</div>
            <ul class="subMenu" role="menu">
                <li><a href="../capitulos/capitulos.php?filtro=introduccion">Introducción</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=comoJugar">Cómo Jugar</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=creacionPJ">Creación de Personaje</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=clases">Clases</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=movHabDot"><span class="ajustarTamañoLetra">Movimientos, Habilidades y Dotes</span></a></li>
                <li><a href="../capitulos/capitulos.php?filtro=pokemon">Pokémon</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=combate">Combate</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=concursos">Concursos Pokémon</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=equiObje">Equipo y Objetos</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=otrasReglas">Otras Reglas Menores</a></li>
                <li><a href="../capitulos/capitulos.php?filtro=dirigir">Dirigiendo el juego</a></li>
            </ul>
        </li>

        <li class="abrirMenu" aria-haspopup="true">
            <div class="textoMenu"> Jugador</div>
            <ul class="subMenu" role="menu">
                <li><a href="../clases/clases.php">Clases</a></li>
                <li><a href="../dotes/dotes.php">Dotes</a></li>
                <li><a href="../objetos/objetos.php">Objetos</a></li>
            </ul>
        </li>

        <li class="abrirMenu" aria-haspopup="true">
            <div class="textoMenu"> Pokémon</div>
            <ul class="subMenu" role="menu">
                <li><a href="../pokedex/pokedex.php">Pokédex</a></li>
                <li><a href="../movimientos/movimientos.php">Movimientos</a></li>
                <li><a href="../habilidades/habilidades.php">Habilidades</a></li>
                <li><a href="../tablaTipos/tablaTipos.php">Tabla de Tipos</a></li>
            </ul>
        </li>

        <li class="abrirMenu" aria-haspopup="true">
            <div class="textoMenu">Reglas </div>
            <ul class="subMenu" role="menu">
                <li><a href="">Índice</a></li>
            </ul>
        </li>

        <li class="abrirMenu borde" aria-haspopup="true">
            <div class="textoMenu"> Utilidades</div>
            <ul class="subMenu" role="menu">
                <li><a href="../utilidades/generarPoke.php">Generar Pokémon</a></li>
                <li><a href="../utilidades/dados.php">Dados</a></li>

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