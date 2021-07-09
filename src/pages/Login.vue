<template>
  <form @submit.prevent="login">
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div class="mb-3">
      <label for="name" class="form-label">Username</label>
      <input id="name" v-model="form.name" class="form-control" />
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        class="form-control"
      />
    </div>

    <button type="submit" class="btn btn-success">Login</button>
  </form>
</template>

<script setup>
import { reactive, ref } from "vue";

const form = reactive({
  name: "",
  password: "",
});

const error = ref("");

const login = () => {
  if (!form.name.length || !form.password.length) {
    error.value = "Password and login cannot be empty";
    return;
  }

  error.value = "";
};
</script>