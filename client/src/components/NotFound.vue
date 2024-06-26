<template>
    <v-container class="fill-height d-flex flex-column align-center justify-center">
      <v-icon size="128px" color="grey">mdi-alert-circle-outline</v-icon>
      <h1>Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <v-btn color="#242a30" class="mt-2" @click="goHome">Volver a la página principal</v-btn>
    </v-container>
  </template>
  
  <script>
  export default {
    methods: {
      goHome() {
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  </style>
  