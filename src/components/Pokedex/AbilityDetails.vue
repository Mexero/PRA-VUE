<template>
  <div v-if="ability && abilityDetails" class="ability-details">
    <div class="ability-info">
      <table class="ability-table">
        <tr v-if="abilityDetails.EST">
          <td class="ability-label">EST:</td>
          <td>{{ abilityDetails?.EST }}</td>
        </tr>
        <tr v-if="abilityDetails.Coste">
          <td class="ability-label">Coste:</td>
          <td>{{ abilityDetails?.Coste }}</td>
        </tr>
        <tr v-if="abilityDetails.Transformacion && abilityDetails.Transformacion !== 'No'">
          <td class="ability-label">Transformación:</td>
          <td>{{ abilityDetails.Transformacion }}</td>
        </tr>
      </table>
      <div class="ability-description">
        <p>{{ abilityDetails?.Descripcion || 'Descripción no disponible' }}</p>
      </div>
    </div>
  </div>
  <div v-else-if="ability && !abilityDetails" class="ability-details">
    <div class="ability-info">
      <p class="loading-message">Cargando detalles de la habilidad...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AbilityDetails',
  props: {
    ability: {
      type: String,
      required: true
    },
    abilityDetails: {
      type: Object,
      required: true
    }
  },
  mounted() {
    console.log('AbilityDetails mounted with:', {
      ability: this.ability,
      details: this.abilityDetails
    });
  }
};
</script>

<style scoped>
.ability-details {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
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
  color: #666;
  width: 120px;
}

.ability-description {
  margin-top: 8px;
  color: #333;
  line-height: 1.4;
}

.ability-description p {
  margin: 0;
}

.loading-message {
  color: #666;
  font-style: italic;
  text-align: center;
}
</style>