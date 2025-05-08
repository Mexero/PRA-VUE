<script setup>
import {RouterLink, RouterView} from 'vue-router'
import HeaderView from './components/HeaderView.vue'
import FooterView from './components/FooterView.vue'
</script>

<template>
<HeaderView/>

<RouterView/>



<!--    <div class="wrapper">
      <HelloWorld msg="You did it!" />

<nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>-->

<FooterView/>

</template>


<style scoped>

</style>
