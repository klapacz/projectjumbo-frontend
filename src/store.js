import { createStore } from 'vuex';
import axios from 'axios'

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
            } catch (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    return 'Bad login or password';
                }

                return 'Login error';
            }
        },

        async logout({ commit, state }) {
            commit('removeToken');
        },

        async getTodos({ commit }) {
            const response = await todosApi.get();

            commit('setTodos', response.data);
        },

        async deleteTodo({ dispatch }, id) {
            // TODO: check response
            await todosApi.delete(`${id}`)
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
