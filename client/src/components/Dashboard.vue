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
        <template v-slot:item.Status="{ item }">
    <v-chip
      :color="item.Status === 'active' ? 'green' : 'red'"
      :text="item.Status === 'active' ? 'Activo' : 'Inactivo'"
      class="text-uppercase"
      size="small"
      label
    ></v-chip>
  </template>
  <template v-slot:item.action="{ item }">
    <v-icon @click="openModal(item)">mdi-file-edit</v-icon>
  </template>
      </v-data-table>

      <!-- Diálogo de edición -->
      <v-dialog v-model="showModal" max-width="600">
        
        <v-card>
          <v-card-title>Configurar {{editedDevice.Device}}</v-card-title>
          <v-card-text>
            <v-form ref="editForm">
              <v-text-field variant="outlined" v-model="editedDevice.Device" label="Dispositivo" readonly=""</v-text-field>
              <v-text-field variant="outlined" v-model="editedDevice.Ip" label="IP" required readonly=""</v-text-field>
              
              <!-- Crear campos de entrada para cada parámetro -->
              <v-row v-for="(value, key) in editedDevice.parameters" :key="key">
                <v-col cols="100" >
                  <template v-if="isBoolean(value)">
                    <v-autocomplete variant="outlined" :label="key"  v-model="editedDevice.parameters[key]" :items="['true', 'false']"/>
                </template>
                <template v-else-if="isNumber(value)">
                  <v-text-field variant="outlined" v-model="editedDevice.parameters[key]" :label="key" type="number"></v-text-field>
                </template>
                <template v-else>
                  <v-text-field variant="outlined" v-model="editedDevice.parameters[key]" :label="key" :rules="getValidationRules(value)"></v-text-field>
                </template>
                </v-col>
              </v-row>
              
            </v-form>
          </v-card-text>
          <v-card-actions class="modal-buttons">
            <v-btn color="primary" variant="tonal" @click="saveChanges" >Guardar</v-btn>
            <v-overlay v-model="overlay" class="align-center justify-center" :model-value="this.loading">
          <v-progress-circular
            color="primary"
            indeterminate
            :size="76"
            :width="9"
        ></v-progress-circular>
    </v-overlay>
            <v-btn variant="plain" @click="closeModal">Cancelar</v-btn>
          </v-card-actions>
        </v-card>

       
      </v-dialog>
      
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.text }}
    </v-snackbar>
    
    
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
      formIsValid: false,
      currentBoard: null,
      editedDevice: null,
      entriesPerPage: 5,
      loading: false,
      snackbar: {
      show: false,
      text: '',
      color: '',
      timeout: 3000
    },
      headers: [
        { key: 'Device', title: 'Dispositivo' },
        { key: 'Ip', title: 'Ip' },
        { key: 'Status', title: 'Estado' },
        { key: 'action', title: 'Configuración', sortable: false }
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
    },
    formIsValid() {
      let isValid = true;
      Object.values(this.$refs.editForm.fields).forEach(field => {
        if (!field.valid) {
          isValid = false;
        }
      });
      return isValid;
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
      this.editedDevice = { ...item };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveChanges() {
  console.log("Activando loading, estado previo:", this.loading);
  this.loading = true;
  console.log("Estado de loading activado:", this.loading);

  axios.patch(`http://localhost:8080/boards/${this.editedDevice._id}/update`, this.editedDevice)
    .then(response => {
      console.log('Datos actualizados:', response.data);
      this.showSnackbar('¡Cambios guardados con éxito!', 'success');
      this.closeModal();
    })
    .catch(error => {
      console.error('Error al actualizar los datos:', error);
      this.showSnackbar('Error al guardar los cambios. Por favor, inténtalo de nuevo.', 'error');
    })
    .finally(() => {
      console.log("Desactivando loading");
      this.loading = false;
      console.log("Estado de loading desactivado:", this.loading);
    });
    },
    showSnackbar(text, color) {
    this.snackbar.text = text;
    this.snackbar.color = color;
    this.snackbar.show = true;
  },

    isNumber(value) {
      return /^\d+(\.\d+)?$/.test(value);
    },

    isBoolean(value) {
      return value === 'true' || value === 'false';
    },
    getValidationRules() {
      return [
        v => !!v || 'Campo requerido',
        v => this.isTextValid(v) || 'No se permiten números'
      ];
    },

    isTextValid(value) {
      return /^\D+$/.test(value);
    },

    containsNumbers() {
      return Object.values(this.editedDevice.parameters).some(value => /^\d/.test(value));
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

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}



</style>
