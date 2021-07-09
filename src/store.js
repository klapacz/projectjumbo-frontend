import { createStore } from 'vuex';
import axios from 'axios'

const { VITE_API_URL: API_URL } = import.meta.env;

console.log(API_URL)

export const store = createStore({
    state: () => ({
        token: window.localStorage.getItem('token'),
    }),

    mutations: {
        setTokens(state, token) {
            state.token = token;

            window.localStorage.setItem('token', token);
        },
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
        }
    },
});