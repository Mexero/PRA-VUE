<template>
  <div v-if="ability" class="ability-details">
    <div class="ability-info">
      <table class="ability-table" v-if="ability.transformacion || ability.legendaria">
        <tbody>
          <tr>
            <td v-if="ability.transformacion" class="ability-label">Habilidad de Transformación </td>
            <td v-if="ability.legendaria" class="ability-label">Habilidad Legendaria </td>
          </tr>
        </tbody>
      </table>
      <div class="ability-description">
        <bloque-texto-complejo :dato="ability.descripcion?.split('\n') || 'Descripción no disponible'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import BloqueTextoComplejo from '../BloqueTextoComplejo.vue'

const { ability } = defineProps(['ability'])

</script>


<style scoped>
.ability-details {
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ability-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ability-table {
  width: 100%;
  border-collapse: collapse;
}

.ability-table td {
  padding: 4px 8px;
}

.ability-label {
  font-weight: bold;
  width: 120px;
}

.ability-description div {
  margin-top: 8px;
  line-height: 1.4;
}

.ability-description div p {
  margin: 0;
}

.loading-message {
  font-style: italic;
  text-align: center;
}
</style>