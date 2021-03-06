import { createStore } from 'vuex';
import axios from 'axios'

import { router } from './router'

const { VITE_API_URL: API_URL } = import.meta.env;

console.log(API_URL)

const todosApi = axios.create({
	baseURL: `${API_URL}/todo`,
});

export const store = createStore({
    state: () => ({
        token: window.localStorage.getItem('token'),
        todos: null,
    }),

    mutations: {
        setTokens(state, token) {
            state.token = token;

            window.localStorage.setItem('token', token);
        },

        removeToken(state) {
            state.token = null;
            window.localStorage.removeItem('token');
        },

        setTodos(state, todos) {
            state.todos = todos;
        },

        removeTodos(state) {
            state.todos = null;
        }
    },

    getters: {
        isLoggedIn: (state) => !!state.token,
    },

    actions: {
        async login({ commit }, form) {
            try {
                const response = await axios.post(`${API_URL}/login`, form);

                commit('setTokens', response.data);
                router.push({ name: 'todos' })
            } catch (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    return 'Bad login or password';
                }

                return 'Login error';
            }
        },

        async logout({ commit, state }) {
            commit('removeToken');
            commit('removeTodos');
            router.push({ name: 'login' })
        },

        async getTodos({ commit }) {
            const response = await todosApi.get();

            commit('setTodos', response.data);
        },

        async deleteTodo({ dispatch }, id) {
            // TODO: check response
            await todosApi.delete(`${id}`)
            await dispatch('getTodos');
        },

        async addTodo({ dispatch }, newTodo) {
            // TODO: check response
            await todosApi.post('', newTodo);
            await dispatch('getTodos');
        },

        async toggleTodo({ dispatch, state }, todo) {
            // TODO: check response

            todo.done = !todo.done;

            await todosApi.put(`${todo.id}`, todo);
            await dispatch('getTodos');
        }
    },
});

const getAuthHeader = () => `Bearer ${store.state.token}`;

todosApi.interceptors.request.use((config) => {
	if(store.getters.isLoggedIn) {
		config.headers.Authorization = getAuthHeader();
	}

	return config;
});

todosApi.interceptors.response.use(undefined, async (error) => {
	if(error.response?.status !== 401) {
		return Promise.reject(error);
	}

    await store.dispatch('logout');
});
