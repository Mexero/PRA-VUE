<script setup>
import { RouterView } from 'vue-router'
import { onMounted, onBeforeUnmount } from 'vue'
import HeaderView from './components/HeaderView.vue'
import FooterView from './components/FooterView.vue'
import NavView from './components/NavView.vue'
import sqlite from './components/sqlite.vue'


const mostarSqlite = true;

//MODO OSCURO. TAMBIEN HAY UNA PARTE EN HEADER VIEW Y LOS COLORES ESTÁN ALLÍ DUPLICADOS
function aplicarModo() {
  const oscuro = localStorage.getItem('modoOscuro') === 'true'
  const root = document.documentElement

  root.style.setProperty('--color-texto', oscuro ? 'white' : 'black')
  root.style.setProperty('--color-icon', oscuro ? 'invert(100%)' : 'invert(0%)')
  root.style.setProperty('--color-fondo', oscuro ? '#17171e' : '#FCFCFC')
  root.style.setProperty('--color-header', oscuro ? '#202030' : '#B4D4FF')
  root.style.setProperty('--color-oscuro1', oscuro ? '#1B1B26' : '#F8F8F8')
  root.style.setProperty('--color-hoverBloque', oscuro ? '#293141' : '#EEF5FF')
  root.style.setProperty('--color-sombraTexto', oscuro ? '#ff0051' : '#F8F8F8')
  root.style.setProperty('--color-principal1', oscuro ? '#ff0051' : '#94c4ff')
  root.style.setProperty('--color-principal2', oscuro ? '#dd576d' : '#b2d7ff')
  root.style.setProperty('--color-secundario', oscuro ? '#ff8f8f' : '#529CE6')
  root.style.setProperty('--color-secundario2', oscuro ? '#ffffff' : '#e3f1fc')
  root.style.setProperty('--color-tituloTabla', oscuro ? 'rgb(176, 28, 60)' : 'rgb(0, 174, 255)')
  root.style.setProperty('--color-tabla1', oscuro ? '#f96262' : '#a3cdff')
  root.style.setProperty('--color-tabla2', oscuro ? '#ef8181' : '#bae2ff')
  root.style.setProperty('--color-fondoTexto', oscuro ? '#293141' : '#EEF5FF')
  root.style.setProperty('--color-BloqueDescargas', oscuro ? '#ff0051' : '#A1E3F9')
  root.style.setProperty('--color-hoverBloqueDescargas', oscuro ? '#293141' : '#EEF5FF')
}

function manejarCambioStorage(e) {
  if (e.key === 'modoOscuro') {
    aplicarModo()
  }
}

onMounted(() => {
  aplicarModo()
  window.addEventListener('storage', manejarCambioStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', manejarCambioStorage)
})

</script>

<template>
  <HeaderView />

  <NavView />

  <sqlite v-if="mostarSqlite" />

  <RouterView />

  <FooterView />
</template>
