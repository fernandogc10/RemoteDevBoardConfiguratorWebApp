<template>
  <div class="container">
    <!-- Sección de la tabla -->
    <div class="section1">
      <h2>Tabla de Placas</h2>
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

    <!-- Sección de los logs -->
    <div class="section2">
      <h2>Logs de Placas</h2>
      <LogComponent :boards="boards" />
    </div>

    <!-- Modal -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h3>Editar Placa</h3>
        <form @submit.prevent="submitForm">
          <!-- Aquí tus campos de edición -->
          <input type="text" v-model="currentBoard.Ip">
          <input type="text" v-model="currentBoard.Device">
          <button type="submit">Guardar Cambios</button>
        </form>
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
  align-items: flex-start;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 20px;
  margin-top: 40px;
}

.section1 {
  flex: 1;
  margin: 20px;
}

.section1 h2 {
  margin-bottom: 10px;
}

.section2 {
  flex: 1;
  margin: 20px;
}

.section2 h2 {
  margin-bottom: 10px;
}

.filter-input {
  padding: 8px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
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
  background-color: #ddd; /* Color gris para los encabezados */
  color: black;
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

/* Estilos del modal */
.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 20% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
