<template>
  <nav class="top-nav" v-if="isAuthenticated">
    <div class="nav-links">
      <router-link to="/dashboard" class="nav-item" exact>Dispositivos</router-link>
       <!--<router-link to="/log" class="nav-item" exact>Registro de Logs</router-link>-->
      
      <button class="nav-item" @click="logout">Cerrar sesión</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token'); 
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.top-nav {
  width: 100%;
  background-color: #242a30;
  height: 50px;
  display: flex;
  justify-content: center;
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-item {
  color: white;
  text-decoration: none;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  border-bottom: 3px solid transparent;
  transition: color 0.3s, border-bottom 0.3s;
}

.router-link-exact-active {
  border-bottom: 3px solid white; 
  padding-bottom: calc(0.5rem - 3px); 
}

.nav-item {
  padding-bottom: calc(0.5rem - 3px); 
}

</style>
