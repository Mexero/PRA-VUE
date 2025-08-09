<template>
  <div v-if="moveName && moveDetails" class="move-details">
    <div class="move-info">
      <table class="move-table">
        <tr v-if="moveDetails.Tiempo_de_uso">
          <td class="move-label">Tiempo de uso:</td>
          <td>{{ moveDetails.Tiempo_de_uso }}</td>
        </tr>
        <tr v-if="moveDetails.Coste">
          <td class="move-label">Coste:</td>
          <td>{{ moveDetails.Coste }}</td>
        </tr>
        <tr v-if="moveDetails.Tipo">
          <td class="move-label">Tipo:</td>
          <td>
            <span class="move-type-badge" :class="`type-${normalizeType(moveDetails.Tipo)}`">{{ moveDetails.Tipo
            }}</span>
          </td>
        </tr>
        <tr v-if="moveDetails.Dano">
          <td class="move-label">Daño:</td>
          <td>{{ moveDetails.Dano }}</td>
        </tr>
        <tr v-if="moveDetails.Rango">
          <td class="move-label">Rango:</td>
          <td>{{ moveDetails.Rango }}</td>
        </tr>
        <tr v-if="moveDetails.Salvacion">
          <td class="move-label">Salvación:</td>
          <td>{{ moveDetails.Salvacion }}</td>
        </tr>
        <tr v-if="moveDetails.Etiquetas">
          <td class="move-label">Etiquetas:</td>
          <td>{{ moveDetails.Etiquetas }}</td>
        </tr>
      </table>
      <div class="move-description">
        <p>{{ moveDetails.Descripcion || 'Descripción no disponible' }}</p>
      </div>
      <div v-if="hasStats" class="move-stats">
        <div class="stats-title">Stats asociados:</div>
        <div class="stats-list">
          <span v-if="moveDetails.Stat_Asociado_1" class="stat-badge">{{ moveDetails.Stat_Asociado_1 }}</span>
          <span v-if="moveDetails.Stat_Asociado_2" class="stat-badge">{{ moveDetails.Stat_Asociado_2 }}</span>
          <span v-if="moveDetails.Stat_Asociado_3" class="stat-badge">{{ moveDetails.Stat_Asociado_3 }}</span>
          <span v-if="moveDetails.Stat_Asociado_4" class="stat-badge">{{ moveDetails.Stat_Asociado_4 }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="moveName && !moveDetails" class="move-details">
    <div class="move-info">
      <p class="loading-message">Cargando detalles del movimiento...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MoveDetails',
  props: {
    moveName: {
      type: String,
      required: true
    },
    moveDetails: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasStats() {
      return this.moveDetails && (
        this.moveDetails.Stat_Asociado_1 ||
        this.moveDetails.Stat_Asociado_2 ||
        this.moveDetails.Stat_Asociado_3 ||
        this.moveDetails.Stat_Asociado_4
      );
    }
  },
  methods: {
    normalizeType(type) {
      if (!type) return '';
      return type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
  },
  mounted() {
    console.log('MoveDetails mounted with:', {
      moveName: this.moveName,
      details: this.moveDetails
    });
  }
};
</script>

<style scoped>
@import '../../css/typeColors.css';

.move-details {
  margin-top: 15px;
  padding: 12px;
  background-color: var(--color-fondoTarjeta);
  color: var(--color-texto);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-in-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.move-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.move-table {
  width: 100%;
  border-collapse: collapse;
}

.move-table td {
  padding: 4px 8px;
}

.move-label {
  font-weight: bold;
  color: #666;
  width: 120px;
}

.move-type-badge {
  padding: 2px 8px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  font-size: 0.9em;
  text-transform: capitalize;
}

.move-description {
  margin-top: 8px;
  color: #333;
  line-height: 1.4;
}

.move-description p {
  margin: 0;
}

.loading-message {
  color: #666;
  font-style: italic;
  text-align: center;
}

.move-stats {
  margin-top: 8px;
}

.stats-title {
  font-weight: bold;
  color: #666;
  margin-bottom: 4px;
}

.stats-list {
  display: flex;
  gap: 8px;
}

.stat-badge {
  background-color: #e0e0e0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
}
</style>