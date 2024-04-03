<template>
  <div id="app">
    <Navbar />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
};
</script>

<style>
#app {
  position: relative;
}

.content {
  padding-top: 60px; 
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; 
  background-color: #333;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.navbar-logo {
  font-weight: bold;
  font-size: 1.2rem;
}

.navbar-links {
  display: flex;
  align-items: center;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  margin-left: 16px;
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover,
.nav-link.active {
  background-color: #555;
}

@media (max-width: 768px) {
  .navbar {
      flex-direction: column;
      align-items: flex-start;
  }

  .navbar-logo {
      margin-bottom: 10px;
  }

  .navbar-links {
      margin-top: 10px;
  }

  .nav-link {
      margin: 0;
      margin-top: 8px;
  }
}
</style>
