<template>
  <div class="container">
    <input type="text" v-model="filter" placeholder="Filtrar..." class="filter-input">

    <table class="table">
      <thead>
        <tr>
          <th>Id</th>
          <th>IP</th>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(board, index) in filteredBoards" :key="board.id">
          <td>{{ index + 1 }}</td>
          <td>{{ board.ip }}</td>
          <td>{{ board.name }}</td>
          <td>
            <button class="edit-button" @click="openModal(board)">
              <font-awesome-icon icon="pencil-alt" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="entries-per-page">
      <label for="entries">Entries per page:</label>
      <select id="entries">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal()">&times;</span>
        <h3>Editar Placa</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group" v-for="(value, key) in currentBoard.parameters" :key="key">
            <label :for="key">{{ key }}</label>
            <input :id="key" type="text" :value="value" @input="updateParameters(key, $event.target.value)">
          </div>
          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      boards: [],
      filter: '',
      showModal: false,
      currentBoard: null
    };
  },
  computed: {
    filteredBoards() {
      return this.boards.filter(board => {
        return Object.values(board).join(' ').toLowerCase().includes(this.filter.toLowerCase());
      });
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
      this.currentBoard = { ...board, parameters: {...board.parameters} };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    updateParameters(key, value) {
      this.$set(this.currentBoard.parameters, key, value);
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 20px;
}

.filter-input {
  padding: 8px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
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
  text-align: left;
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

.fa-pencil-alt {
  color: #4CAF50;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover, .close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
}

.form-group input {
  width: 100%;
  padding: 8px;
  margin: 6px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button[type="submit"] {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #45a049;
}
</style>
