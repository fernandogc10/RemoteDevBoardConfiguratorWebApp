<template>
  <div>
    <div class="container">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Device</th>
              <th>Ip</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" @click="openModal(item)">
              <td>{{ item.name }}</td>
              <td>{{ item.ip }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal" v-if="selectedItem">
      <div class="modal-content">
        <h2>Detalles y edición del dispositivo</h2>
        <div>
          <label for="name">Nombre:</label>
          <input type="text" id="name" v-model="selectedItem.name" disabled>
        </div>
        <div>
          <label for="ip">IP:</label>
          <input type="text" id="ip" v-model="selectedItem.ip" disabled>
        </div>
        <div v-for="(value, key) in selectedItem.parameters" :key="key">
          <label :for="key">{{ key }}:</label>
          <input type="text" :id="key" v-model="selectedItem.parameters[key]">
        </div>
        <button @click="updateParameters">Actualizar</button>
        <button @click="closeModal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'MyTable',
  data() {
    return {
      items: [],
      selectedItem: null
    };
  },
  mounted() {
    axios.get('http://localhost:8080/boards')
      .then(response => {
        this.items = response.data;
      })
      .catch(error => {
        console.error('Error al obtener las placas desde el backend:', error);
      });
  },
  methods: {
    openModal(item) {
      this.selectedItem = item;
    },
    closeModal() {
      this.selectedItem = null;
    },
    updateParameters() {
      axios.patch(`http://localhost:8080/boards/update/${this.selectedItem._id}`, { parameters: this.selectedItem.parameters })
        .then(response => {
          console.log('Parámetros actualizados:', response.data);
          this.items = this.items.map(item => (item._id === this.selectedItem._id ? response.data : item));
        })
        .catch(error => {
          console.error('Error al actualizar los parámetros:', error);
        });
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.table-container {
  width: 60%;
  margin-right: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #f2f2f2;
  cursor: pointer;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
}

.modal-content h2 {
  margin-bottom: 10px;
}

.modal-content div {
  margin-bottom: 10px;
}

.modal-content label {
  display: block;
}

.modal-content input {
  width: 100%;
  padding: 5px;
  margin-top: 5px;
  border-radius: 5px;
}

.modal-content button {
  padding: 8px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

</style>
