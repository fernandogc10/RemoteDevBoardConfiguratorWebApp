<template>
  <div class="container">
    <div class="top-container">

      <div class="stats">

        <div class="top-stats">
        <div class="stat-item sign-ins">
          <div class="stat-value">{{ filteredBoards.length}}</div>
          <div class="stat-label">Dispositivos</div>
        </div>

        <div class="stat-item organizations">
        <div class="stat-value">0</div>
        <div class="stat-label">Errores</div>
      </div>

    </div>

    <div class="bottom-stats">

      <div class="stat-item sites">
        <div class="stat-value">50%</div>
        <div class="stat-label">Uso de Memoria</div>
      </div>

      <div class="stat-item visitors">
        <div class="stat-value">10%</div>
        <div class="stat-label">Uso de CPU</div>
      </div>
    </div>
      </div>
      
      <div class="section2">
      <h2>Logs</h2>
      <LogComponent :boards="boards" />
    </div>
    </div>

      
    
    <div class="bottom-container">
      <!-- Sección de los logs -->
    
    <div class="section1">
      <h2>Dispositivos</h2>
        <input type="text" v-model="filter" placeholder="Filtrar..." class="filter-input">
      <table class="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>IP</th>
            <th>Nombre</th>
            <th>Configuración</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(board, index) in filteredBoards" :key="board.id">
            <td>{{ index + 1 }}</td>
            <td>{{ board.Ip }}</td>
            <td>{{ board.Device }}</td>
            <td>
              <i class="fas fa-edit" @click="openModal(board)"></i>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="entries-per-page">
        <label for="entries">Entradas por página:</label>
        <select id="entries" v-model="entriesPerPage">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
    </div>
    

  </div>
</template>

<script>
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import LogComponent from './Log.vue'; // Asegúrate de importar correctamente el componente de logs

export default {
  components: {
    LogComponent
  },
  data() {
    return {
      boards: [],
      filter: '',
      showModal: false,
      currentBoard: null,
      entriesPerPage: 10 // Número de entradas por página por defecto
    };
  },
  computed: {
    filteredBoards() {
      return this.boards.filter(board => {
        return Object.values(board).join(' ').toLowerCase().includes(this.filter.toLowerCase());
      });
    },
    paginatedBoards() {
      // Devuelve las placas según el número de entradas por página
      const startIndex = (this.currentPage - 1) * this.entriesPerPage;
      return this.filteredBoards.slice(startIndex, startIndex + this.entriesPerPage);
    }
  },
  methods: {
    fetchBoards() {
      axios.get('http://localhost:8080/boards')
        .then(response => {
          this.boards = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    openModal(board) {
      this.currentBoard = board;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    submitForm() {
      console.log('Saving changes', this.currentBoard);
      // Aquí la lógica para enviar los datos actualizados a la API
      this.closeModal();
    }
  },
  mounted() {
    this.fetchBoards();
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: flex-start;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 20px;
  margin-top: 40px;
}

.top-container {

  display: flex;
  align-self: flex-start;
  width: 100%;
  align-items: center;
}

.bottom-container {

  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
}

.section1 {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 60%;

}

.section1 h2 {
  margin-bottom: 10px;
  font-size: large;
}

.section2 {
  background-color: white;
  border-radius:  10px;
  padding: 20px;
  width: 55%;
  margin-left: auto;
}

.section2 h2 {
  margin-bottom: 10px;
  font-size: large;
}


.filter-input {
  padding: 8px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 2px solid #ccc;
}

.entries-per-page {
  display: flex;
  align-items: center;
}

.entries-per-page label {
  margin-top: 20px;
  margin-right: 5px;
}

.entries-per-page select {
  padding: 8px;
  margin-top: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
}

.table th, .table td {
  padding: 12px 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #242a30; /* Color gris para los encabezados */
  color: white;
}


.table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table tr:hover {
  background-color: #ddd;
}

.edit-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}


.stats {
  width: 40%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  justify-content: space-between;
  margin-left: 40px;
}

.top-stats,
.bottom-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  justify-content: center;
}
/* Estilos del modal */

.stat-item {
  background: #ccc;
  color: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 40%;
  margin-right: 30px;
}

.organizations { background-color: #e75a5a; }
.visitors { background-color: #5785e0; }
.sign-ins { background-color: #4d4d4d; }
.sites { background-color: #26b5b5;}


.stat-value {
  font-size: 3em;
  font-weight: bold;
}

.stat-label {
  margin-top: 10px;
  font-size: 1.2em;
}
</style>
