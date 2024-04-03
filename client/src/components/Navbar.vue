<template>
    <div class="navbar">
      <div class="navbar-logo">Remote Dev Board Controller</div>
      <div class="navbar-links">
        <router-link to="/" class="nav-link">Dashboard</router-link>
        <router-link to="/query-log" class="nav-link">Query Log</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
  };
  </script>
  
  <style scoped>
  .navbar {
    background-color: #333;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
  }
  
  .navbar-logo {
    font-weight: bold;
  }
  
  .navbar-links {
    display: flex;
  }
  
  .nav-link {
    color: #fff;
    text-decoration: none;
    margin-left: 16px;
    padding: 20px 0;
}
<style scoped>
.navbar {
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

.nav-link:hover {
    background-color: #555;
}

.nav-link.active {
    font-weight: bold;
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

  