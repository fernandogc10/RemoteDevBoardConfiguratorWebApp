<template>
  <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h2>Editar Parámetros de la Placa</h2>
      <form @submit.prevent="submitForm">
        <div v-for="(value, key) in board.parameters" :key="key" class="form-group">
          <label :for="key">{{ key }}</label>
          <input :id="key" v-model="board.parameters[key]" />
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    board: {
      type: Object,
      default: () => ({})
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submitForm() {
      this.$emit('save', this.board);
      this.close();
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 500px; /* Ajusta según tu preferencia */
}

.modal-content h2 {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.close {
  float: right;
  font-size: 1.5em;
  padding: 0;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  margin: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

</style>
