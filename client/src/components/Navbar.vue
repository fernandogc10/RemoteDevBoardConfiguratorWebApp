<template>
  <nav class="top-nav">
    <div class="nav-links">
      <router-link to="/dashboard" class="nav-item" exact>Dashboard</router-link>
      <router-link to="/log" class="nav-item" exact>Log</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
};
</script>

<style scoped>
.top-nav {
  width: 100%;
  background-color: #333; /* Color de fondo oscuro */
  height: 50px;
  display: flex;
  justify-content: center; /* Centra los elementos de navegación */
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
  border-bottom: 3px solid transparent; /* Borde transparente por defecto */
  transition: color 0.3s, border-bottom 0.3s;
}

.router-link-exact-active {
  border-bottom: 3px solid white; /* Borde blanco para el elemento activo */
  padding-bottom: calc(0.5rem - 3px); /* Ajusta el relleno para que el borde no aumente el tamaño del elemento */
}

/* Ajuste para que el borde no afecte el tamaño del elemento */
.nav-item {
  padding-bottom: calc(0.5rem - 3px); /* Ajusta el relleno para que sea el original menos el borde */
}

</style>
