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

html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%; 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}



.content {
  width: calc(100% - 20px);
  height: calc(100% - 100px);
}


</style>
