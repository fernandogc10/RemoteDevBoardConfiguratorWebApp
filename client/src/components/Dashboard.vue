<template>
  <div class="table-container">
    <v-card title="Dispositivos" flat class="table-title-component">
      <v-icon @click="refreshData" class="mr-4 ml-auto">mdi-refresh</v-icon>
    </v-card>
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

      <v-data-table
        :headers="headers"
        :items="filteredBoards"
        :items-per-page="5"
        class="data-table-component ml-1 "
      >
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
          <v-icon
            icon="mdi-file-edit"
            class="mr-1"
            color="#059c98"
            size="large"
            @click="openModal(item)"
          ></v-icon>
          <v-icon 
            icon="mdi-trash-can"
            size="x-large"
            color="#f45043"
            :disabled="item.Status !== 'inactive'"
            @click="deleteConfirmation(item)"
          ></v-icon>
        </template>
      </v-data-table>

      <v-dialog v-model="deleteDialog" max-width="550">
        <v-card>
          <v-card-title>
            ¿Estás seguro de que quieres eliminar este dispositivo?
          </v-card-title>
          <v-card-actions>
            <v-btn color="error" variant="flat" @click="deleteDevice(selectedItem)"
              >Eliminar</v-btn
            >
            <v-btn @click="cancelDelete" variant="tonal">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <v-dialog v-model="showModal" max-width="600">
        <v-card>
          <v-card-title>Configurar {{editedDevice.Device}}</v-card-title>
          <v-card-text>
            <v-form ref="editForm">
              <v-text-field
                variant="outlined"
                v-model="editedDevice.Device"
                label="Dispositivo"
                readonly
              ></v-text-field>
              <v-text-field
                variant="outlined"
                v-model="editedDevice.Ip"
                label="IP"
                required
                readonly
              ></v-text-field>

              <v-row v-for="(value, key) in editedDevice.parameters" :key="key">
                <v-col cols="100">
                  <template v-if="isBoolean(value)">
                    <v-autocomplete
                      variant="outlined"
                      :label="key"
                      v-model="editedDevice.parameters[key]"
                      :items="['true', 'false']"
                    />
                  </template>
                  <template v-else-if="isNumber(value)">
                    <v-text-field
                      variant="outlined"
                      v-model="editedDevice.parameters[key]"
                      :label="key"
                      type="number"
                    ></v-text-field>
                  </template>
                  <template v-else>
                    <v-text-field
                      variant="outlined"
                      v-model="editedDevice.parameters[key]"
                      :label="key"
                      :rules="getValidationRules(value)"
                    ></v-text-field>
                  </template>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="modal-buttons">
            <v-btn variant="flat" color="#242a30" @click="saveChanges">Guardar</v-btn>
            <v-overlay v-model="overlay" class="align-center justify-center" :model-value="this.loading">
              <v-progress-circular
                color="primary"
                indeterminate
                :size="76"
                :width="9"
              ></v-progress-circular>
            </v-overlay>
            <v-btn variant="tonal" @click="closeModal">Cancelar</v-btn>
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
      currentBoard: null,
      editedDevice: null,
      deleteDialog: false,
      loading: false,
      snackbar: {
        show: false,
        text: '',
        color: '',
        timeout: 3000,
      },
      headers: [
        { key: 'Device', title: 'Dispositivo' },
        { key: 'Protocol', title: 'Protocolo' },
        { key: 'Ip', title: 'Ip' },
        { key: 'Status', title: 'Estado' },
        { key: 'action', title: 'Configuración', sortable: false },
      ],
    };
  },
  computed: {
    filteredBoards() {
      return this.boards.filter((board) => {
        return (
          board.Device.toLowerCase().includes(this.search.toLowerCase()) ||
          board.Ip.toLowerCase().includes(this.search.toLowerCase()) ||
          Object.values(board.parameters)
            .join(' ')
            .toLowerCase()
            .includes(this.search.toLowerCase())
        );
      });
    },
  },
  methods: {
    fetchBoards() {
      axios
        .get('/boards')
        .then((response) => {
          this.boards = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    refreshData() {
      this.fetchBoards();
      this.showSnackbar('Datos actualizados', 'success');
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
      console.log('Activando loading, estado previo:', this.loading);
      this.loading = true;
      console.log('Estado de loading activado:', this.loading);

      axios
        .patch(
          `boards/${this.editedDevice._id}/update`,
          this.editedDevice
        )
        .then((response) => {
          console.log('Datos actualizados:', response.data);
          this.showSnackbar('¡Cambios guardados con éxito!', 'success');
          this.closeModal();
        })
        .catch((error) => {
          console.error('Error al actualizar los datos:', error);
          this.showSnackbar(
            'Error al guardar los cambios. Por favor, inténtalo de nuevo.',
            'error'
          );
        })
        .finally(() => {
          console.log('Desactivando loading');
          this.loading = false;
          console.log('Estado de loading desactivado:', this.loading);
        });
    },
    deleteConfirmation(item) {
      this.selectedItem = item;
      this.deleteDialog = true;
    },
    cancelDelete() {
      this.deleteDialog = false;
    },
    deleteDevice(item) {
      const id = item._id;

      axios
        .delete(`/boards/${id}`)
        .then((response) => {
          console.log('Placa eliminada con éxito:', response.data);
          this.fetchBoards();
          this.showSnackbar('Placa eliminada con éxito', 'success');
        })
        .catch((error) => {
          console.error('Error al eliminar la placa:', error);
          this.showSnackbar('Error al eliminar la placa', 'error');
        })
        .finally(() => {
          this.deleteDialog = false;
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
        (v) => !!v || 'Campo requerido',
        (v) => this.isTextValid(v) || 'No se permiten números',
      ];
    },
    isTextValid(value) {
      return /^\D+$/.test(value);
    },
    containsNumbers() {
      return Object.values(this.editedDevice.parameters).some((value) =>
        /^\d/.test(value)
      );
    },
  },
  mounted() {
    this.fetchBoards();
  },
};
</script>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
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
  display: flex;
  padding: 5px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  align-items: center;
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
