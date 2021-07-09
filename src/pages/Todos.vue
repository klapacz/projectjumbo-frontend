<template>
  <ul v-if="store.state.todos" class="list-group list-group-flush">
    <div
      v-for="todo in store.state.todos"
      :key="todo.id"
      class="list-group-item"
    >
      <div class="d-flex justify-content-between align-items-center">
        <span>
          {{ todo.content }}
        </span>
        <div class="btn-group" role="group">
          <button class="btn btn-primary">Edit</button>
          <button class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </ul>
</template>

<script setup>
import { useStore } from "vuex";
import { RouterLink } from "vue-router";

const store = useStore();

const getTodos = async () => {
  store.dispatch("getTodos");
};

if (!store.state.todos) getTodos();
</script>