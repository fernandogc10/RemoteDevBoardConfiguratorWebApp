<template>
  <div class="table-container">
    <v-card title="Dispositivos" flat class="table-title-component"></v-card>
    <v-card flat class="table-component">
      <template v-slot:text>
        <v-text-field
          v-model="search"
          label="Buscar.."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>

      <v-data-table :headers="headers" :items="filteredBoards" :items-per-page="5" class="data-table-component">
        <template v-slot:item.action="{ item }">
          <v-icon @click="openModal(item)">mdi-pencil</v-icon>
        </template>
      </v-data-table>

      <!-- Diálogo de edición -->
      <v-dialog v-model="showModal" max-width="600">
        <v-card>
          <v-card-title>Configurar Dispositivo</v-card-title>
          <v-card-text>
            <v-form ref="editForm">
              <v-text-field v-model="editedDevice.Device" label="Dispositivo" readonly=""</v-text-field>
              <v-text-field v-model="editedDevice.Ip" label="IP" required readonly=""</v-text-field>
              
              <!-- Crear campos de entrada para cada parámetro -->
              <v-row v-for="(value, key) in editedDevice.parameters" :key="key">
                <v-col cols="6">
                  <v-text-field v-model="editedDevice.parameters[key]" :label="key"></v-text-field>
                </v-col>
              </v-row>
              
            </v-form>
          </v-card-text>
          <v-card-actions class="modal-buttons">
            <v-btn color="primary" variant="tonal" @click="saveChanges">Guardar</v-btn>
            <v-btn variant="plain" @click="closeModal">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  data() {
    return {
      boards: [],
      search: '',
      showModal: false,
      currentBoard: null,
      editedDevice: null,
      entriesPerPage: 5,
      headers: [
        { text: 'Dispositivo', value: 'Device' },
        { text: 'IP', value: 'Ip' },
        { text: 'Parámetros', value: 'parameters' },
        { text: 'Acción', value: 'action', sortable: false }
      ]
    };
  },
  computed: {
    filteredBoards() {
      return this.boards.filter(board => {
        return (
          board.Device.toLowerCase().includes(this.search.toLowerCase()) ||
          board.Ip.toLowerCase().includes(this.search.toLowerCase()) ||
          Object.values(board.parameters).join(' ').toLowerCase().includes(this.search.toLowerCase())
        );
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
    openModal(item) {
      this.currentBoard = item;
      this.editedDevice = { ...item }; // Clonar el objeto para edición
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveChanges() {
      // Validar el formulario antes de guardar
      this.$refs.editForm.validate().then(valid => {
        if (valid) {
          console.log('Guardando cambios', this.editedDevice);
          // Aquí deberías enviar los datos actualizados a la API
          this.closeModal();
        }
      });
    }
  },
  mounted() {
    this.fetchBoards();
  }
};
</script>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: 70%;
  padding-top: 100px;
}

.table-component {
  width: 50%;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
}

.table-title-component {
  background-color: #242a30;
  color: white;
  width: 50%;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
}

.modal-buttons {
  margin-left: auto;
}
</style>
