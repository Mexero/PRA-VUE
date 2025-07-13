<template>
  <div class="admin-container">
    <h1>Panel de Administración</h1>
    <div class="admin-content">
      <AdminPokemonList />
    </div>
  </div>
</template>

<script>
import AdminPokemonList from './AdminPokemonList.vue';

export default {
  name: 'AdminIndex',
  components: {
    AdminPokemonList
  }
};
</script>

<style scoped>
.admin-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.admin-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
</style>