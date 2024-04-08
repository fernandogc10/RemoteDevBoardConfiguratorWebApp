<template>
  <div class="log-container">
    <div class="tabs">
      <span 
        v-for="(board, index) in boards" 
        :key="index" 
        :class="{ 'active': activeBoardIndex === index }"
        @click="fetchLogs(board._id)">
        {{ board.name }}
      </span>
    </div>
    <div class="log-console">
  <div v-if="logs.length > 0">
    <div v-for="(log, index) in logs" :key="index">{{ log.message }}</div>
  </div>
  <p v-else>No hay logs disponibles para {{ activeBoardName }}</p>
</div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      boards: [],
      activeBoardIndex: 0, 
      logs: [] 
    };
  },
  computed: {
    activeBoardName() {
      return this.boards[this.activeBoardIndex]?.name;
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
    this.logs = response.data;
    this.activeBoardIndex = this.boards.findIndex(board => board._id === boardId);
  } catch (error) {
    console.error('Error al obtener los logs:', error);
  }
}

  },
  mounted() {
    this.fetchBoards(); 
  }
};
</script>

<style>
.log-container {
  padding: 20px;
  background-color: white;
  width: 97,5%;
  height: 95.5%;

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
  border-top: 2px solid #5294e2;
}

.log-console {
  border: 1px solid #ccc;
  padding: 10px 10px 10px 20px; 
  width: calc(100% - 40px); 
  height: 800px;
  overflow-y: auto; 
  overflow-x: hidden; 
  font-family: 'Courier New', monospace;
  background-color: white; 
}

.log-console pre {
  padding-left: 5px;
  background-color: #f7f7f7;
  border-left: 3px solid #5294e2;
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
