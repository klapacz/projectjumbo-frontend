import { createRouter, createWebHistory } from 'vue-router'
import { store } from './store'

import Login from './pages/Login.vue'
import Todos from './pages/Todos.vue'

const routes = [
    {
        path: '/',
        component: Todos,
        name: 'todos'
    },
    {
        path: '/login',
        component: Login,
        name: 'login',
        meta: {
            isUnprotected: true,
        },
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
	if (!to.meta.isUnprotected && !store.getters.isLoggedIn) next({ name: 'login' });
	else next();
});
