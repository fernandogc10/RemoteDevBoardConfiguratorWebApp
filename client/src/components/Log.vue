<template>
  <div class="log-container">
    <div class="tabs">
      <span 
        v-for="(board, index) in boards" 
        :key="index" 
        :class="{ 'active': activeBoardIndex === index }"
        @click="fetchLogs(board._id)">
        {{ board.Device }}
      </span>
    </div>
    <div class="log-console">
      <div v-if="logs && logs.length > 0">
        <div v-for="(log, index) in logs" :key="index">{{ log.message }}</div>
      </div>
      <p v-else>No hay logs disponibles para {{ activeBoardName }}</p>
    </div>
    <!-- Modal para editar los parámetros -->
    
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      boards: [],
      activeBoardIndex: 0,
      logs: [],
      showEditModal: false,
      editParams: {}
    };
  },
  computed: {
    activeBoardName() {
      return this.boards[this.activeBoardIndex]?.Device;
    }
  },
  methods: {
    async fetchBoards() {
      try {
        const response = await axios.get('http://localhost:8080/boards');
        this.boards = response.data;
      } catch (error) {
        console.error('Error al obtener las placas:', error);
      }
    },
    async fetchLogs(boardId) {
      try {
        const response = await axios.get(`http://localhost:8080/boards/${boardId}`);
        console.log('Hiciste clic en el tab con el ID:', boardId);
        console.log('Logs recibidos:', response.data);
        this.logs = response.data;
        this.activeBoardIndex = this.boards.findIndex(board => board._id === boardId);
      } catch (error) {
        console.error('Error al obtener los logs:', error);
      }
    },
    openEditModal(board) {
      this.editParams = { ...board.parameters };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    async updateParameters() {
      // Aquí se implementaría la lógica para actualizar los parámetros
      console.log('Parámetros actualizados:', this.editParams);
      // Cierra el modal después de la actualización
      this.closeEditModal();
    }
  },
  mounted() {
    this.fetchBoards();
  }
};
</script>

<style>
.log-container {
  width: 100%;
  background-color: white;

}


.tabs {
  text-align: left;
}

.tabs span {
  display: inline-block;
  padding: 5px 10px;
  cursor: pointer;
  color: #555;
  background-color: #f8f8f8;
  margin-right: 2px;
  border: 1px solid #ccc;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
  user-select: none;
}

.tabs span.active {
  background-color: #eee;
  border-top: 2px solid #242a30;
}

.log-console {
  border: 1px solid #ccc;
  padding: 10px 10px 10px 20px; 
  height: 300px;
  overflow-y: auto; 
  overflow-x: hidden; 
  font-family: 'Courier New', monospace;
  background-color: white; 
}

.log-console pre {
  padding-left: 10px;
  background-color: #f7f7f7;
  border-left: 3px solid #242a30;
  color: #333;
  white-space: pre-wrap; 
  word-break: break-word;
}

.log-console p {
  color: #888;
  background-color: #f7f7f7;
  margin: 0;
  padding: 5px;
  text-align: center;
}

</style>
