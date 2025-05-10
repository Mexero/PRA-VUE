<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>


<template>

    <div id="capitulos">
        <RouterView />
    </div>
</template>

<style>
/* ======================= ASIDE CAPITULOS ======================= */

#menuCapitulos {
    grid-area: side-nav;
    width: 300px;
    height: fit-content;
    max-height: 85vh;
    position: sticky;
    top: 60px;
    z-index: 5;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    border-radius: 5px;
    margin: 40px 0 0 20px;
}

#menuCapitulos li,
#menuCapitulos2 li {
    background-color: var(--color-principal1);
}

#menuCapitulos li a,
#menuCapitulos2 li a {
    display: flex;
    padding: 10px 0;
    text-decoration: none;
    color: var(--color-texto);
    padding-left: 10px;
    font-size: 14px;
}

#menuCapitulos summary:hover,
#menuCapitulos a:hover,
#menuCapitulos2 summary:hover,
#menuCapitulos2 a:hover {
    background-color: var(--color-segundario);
}


.abrirMenuCapitulos summary {
    color: var(--color-texto);
    cursor: pointer;
    border-bottom: 1px solid var(--color-segundario2);
    border-top: 1px solid var(--color-segundario2);
}

.abrirMenuCapitulos:first-child summary {
    border-top: none;
}

.abrirMenuCapitulos details {
    color: var(--color-texto);
    cursor: pointer;
}

.abrirMenuCapitulos details a {
    background-color: var(--color-principal2);
    margin-left: 10px;
    border-left: 1px solid var(--color-segundario2);
    border-bottom: 1px solid var(--color-segundario2);
}

.abrirMenuCapitulos summary {
    padding: 10px 0px 10px 10px;
}

#iconoAbrirMenuCapitulos {
    display: none;
    cursor: pointer;
    background-color: var(--color-principal1);
    border-radius: 5px;
    height: fit-content;
    width: 35px;
    height: 35px;
}

#iconoAbrirMenuCapitulos img {
    width: 30px;
    margin: 0 auto;
    padding: 5px;
}

#menuCapitulos2 {
    display: none;
}

/* ======================= CAPITULOS ======================= */
#capitulos {
    display: flex;
    flex-direction: column;
    justify-self: flex-end;
    width: auto;
    min-height: 100vh;
    margin: 40px 20px 0 0;
    overflow: hidden;
    background-color: var(--color-fondoTexto);
    border-radius: 10px;
    padding: 20px;
}

#capitulos h2 {
    color: var(--color-texto);
}

#capitulos p {
    text-align: justify;
    color: var(--color-texto);
    letter-spacing: 1px;
    line-height: 22px;
    margin: 15px 0;
    font-size: 17px;
}

#capitulos strong {
    text-decoration: underline;
}

#capitulos li {
    margin-left: 15px;
    color: var(--color-texto);
}

.detailsBloque {
    padding: 0 15px;
}

#capitulos details {
    padding-top: 35px;
}

#capitulos summary {
    border-radius: 5px;
    color: var(--color-texto);
    font-size: 25px;
    font-weight: bold;
    padding: 10px 0 10px 10px;
    cursor: pointer;
    background-color: var(--color-principal1);
}

.consejoCapitulo {
    margin-top: 10px;
    color: var(--color-texto);
    background-color: var(--color-principal2);
    padding: 1px 20px;
    border-radius: 10px;
}

.consejoCapitulo p {
    padding: 0;
    margin: 0;
}

.centrarTiposImg {
    overflow: scroll;
    overflow-y: hidden;
    overflow-x: auto;
}

.centrarTiposImg img {
    display: block;
    margin: 0 auto;
}

/* Añadir otro media intermedio para el tamaño de letra*/
@media screen and (max-width:1000px) {
    body {
        display: flex;
        flex-direction: column;
    }

    #capitulos {
        width: 95%;
    }

    #iconoAbrirMenuCapitulos {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #menuCapitulos2 {
        display: flex;
        height: 0;
    }

    #desplegarMenu2 {
        display: flex;
        width: 0;
        height: fit-content;
        max-height: 92vh;
        position: sticky;
        left: 10;
        transition: top 0.3s ease;
    }

    #desplegarMenu2 ul {
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
    }

    #iconoAbrirMenuCapitulos,
    #menuCapitulos2 {
        position: sticky;
        top: 50px;
    }

    #menuCapitulos2 {
        margin-top: 10px;
    }

    #menuCapitulos {
        display: none;
    }

    #capitulos {
        margin: 30px auto;
    }

    #capitulos p {
        font-size: 13px;
    }

    #capitulos h1 {
        font-size: 20px;
    }

    #capitulos summary {
        font-size: 16px;
    }

    .rotar {
        transform: rotate(180deg);
        transition: transform 0.1s ease-in-out;
    }
}

/* ======================= TABLAS DE CAPITULOS ======================= */
.tablaCapitulos,
.tablaNaturaleza {
    text-align: center;
    margin: 0 auto;
    border-collapse: collapse;
    color: var(--color-texto);
}

.tablaAmistad {
    margin: 0 auto;
    border-collapse: collapse;
    color: var(--color-texto);
}

.tablaCapitulos td,
.tablaCapitulos th,
.tablaAmistad td,
.tablaAmistad th {
    padding: 8px;
}

/* APLICAR BORDES A LA DERECHA */
.tablaCapitulos tr td:first-child,
.tablaCapitulos th:first-child,
.tablaAmistad tr td:first-child,
.tablaAmistad th:first-child {
    border-right: 1px solid black;
}

.tablaCapitulos tr:nth-child(odd),
.tablaAmistad tr:nth-child(odd) {
    background-color: var(--color-tabla1);
}

.tablaCapitulos tr:nth-child(even),
.tablaAmistad tr:nth-child(even) {
    background-color: var(--color-tabla2);
}

.consejoCapitulo tr td {
    padding: 5px 10px;
}
</style>
