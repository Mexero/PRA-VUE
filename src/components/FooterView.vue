<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer>

    <div id="redes">
      <h2>Redes:</h2>
      <RouterLink to=""><img src="../../public/assets/icons/discord.webp" alt="Icono discord" width="30"></RouterLink>

    </div>

    <div id="avisoLegal">
      <p>Pokémon® es una marca de Nintendo y no está asociada de ninguna forma a Pokémon Roleplaying Adventures. Pokémon
        Roleplaying Adventures es un sistema de rol de uso libre y gratuito diseñado por fans de los juegos de rol y de
        Pokémon®.
      </p>
    </div>

  </footer>
</template>


<style scoped>
/* ======================= FOOTER ======================= */
footer {
  z-index: 100;
  background-color: var(--color-footer);
  color: var(--color-textoFooter);
}

#redes {
  display: flex;
  padding: 20px 0 0 20px;
}

#avisoLegal {
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 20px;
}
</style>