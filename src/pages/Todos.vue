<template>
  <button @click="logout" class="btn btn-dark">Logout</button>

  <form class="row py-2 align-items-center" @submit.prevent="addTodo">
    <div class="col-auto">
      <label for="todo-content" class="visually-hidden">Password</label>
      <input id="todo-content" v-model="newTodo.content" class="form-control" />
    </div>
    <div class="col-auto">
      <button type="submit" class="btn btn-success">Add</button>
    </div>
  </form>

  <ul v-if="store.state.todos && store.state.todos.length" class="list-group list-group-flush">
    <div
      v-for="todo in store.state.todos"
      :key="todo.id"
      class="list-group-item"
    >
      <div class="d-flex justify-content-between align-items-center">
        <span>
          <input
            class="form-check-input"
            type="checkbox"
            v-model="todo.done"
            :id="todo.id"
            @click="toggleTodo(todo)"
          />
          <label class="form-check-label px-2" :for="todo.id">
            {{ todo.content }}
          </label>
        </span>
        <div class="btn-group" role="group">
          <button class="btn btn-danger" @click="deleteTodo(todo.id)">
            Delete
          </button>
        </div>
      </div>
    </div>
  </ul>
  <div v-else class="alert alert-warning">You don't have any tasks</div>
</template>

<script setup>
import { reactive } from "vue";
import { useStore } from "vuex";

const newTodo = reactive({
  content: "",
  done: false,
});

const store = useStore();

const getTodos = async () => {
  store.dispatch("getTodos");
};

const deleteTodo = async (id) => {
  await store.dispatch("deleteTodo", id);
};

const addTodo = async (id) => {
  await store.dispatch("addTodo", newTodo);
  newTodo.content = "";
};

const toggleTodo = async (todo) => {
  await store.dispatch("toggleTodo", todo);
};

const logout = async () => {
  await store.dispatch("logout");
};

if (!store.state.todos) getTodos();
</script>