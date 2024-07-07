<template>
    <div>
      <v-card
        class="mx-auto pa-12 pb-8 my-16"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <div class="text-subtitle-1 text-medium-emphasis">Usuario</div>
  
        <v-text-field
          v-model="username"
          density="compact"
          placeholder="Usuario"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
        ></v-text-field>
  
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Contraseña
          <a
            class="text-caption text-decoration-none"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            ¿Has olvidado la contraseña?
          </a>
        </div>
  
        <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Ingresa tu contraseña"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>
  
        <v-btn
          class="mb-8"
          color="#242a30"
          size="large"
          block
          @click="login"
        >
          Iniciar sesión
        </v-btn>
      </v-card>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        visible: false
      };
    },
    methods: {
      login() {
        console.log(JSON.stringify({ username: this.username, password: this.password }));
  
        axios.post('/users/login', {
          username: this.username,
          password: this.password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          localStorage.setItem('token', response.data.token);
          this.$router.push('/dashboard');
        })
        .catch(error => {
          console.error('Error logging in:', error);
          if (error.response) {
            console.error('Server response (error):');
            console.error(error.response.data);
            console.error('HTTP status:', error.response.status);
          }
  
          if (error.request) {
            console.error('Request not answered (error):', error.request);
          }
  
          if (error.response && error.response.status === 401) {
            alert('Credenciales inválidas. Por favor, verifica tu usuario y contraseña.');
          } else {
            alert('Error al iniciar sesión. Por favor, intenta de nuevo más tarde.');
          }
        });
      }
    }
  };
  </script>
  