import { defineStore } from 'pinia'
import axios from 'axios'
import { useProjectStore } from './project'
import socket from '@/plugins/socket'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {},
        error: null
    }),
    actions: {
        isAuthenticated() {
            return !!this.user;
        },
        
        async checkAuth() {
            try {
                const res = await axios.get('http://localhost:3000/user/me', {
                    withCredentials: true
                });

                this.user = {
                    id: res.data.id,
                    email: res.data.email
                };

                const projectStore = useProjectStore()
                projectStore.fetchProjects()

                socket.emit("registerUser", this.user.id);
            } catch (error) {
                console.error('Session check failed', error);
                this.user = null;
            }
        },

        async getUserByEmail(email) {
            try {
                const response = await axios.get('http://localhost:3000/user/getUserByEmail', {
                    params: { email },
                    withCredentials: true
                });
                return response.data.id;
            } catch (error) {
                console.error('Error finding user by email:', error);
            }
        },

        async getUserById(id) {
            try {
                const response = await axios.get('http://localhost:3000/user/getUserById', {
                    params: { id },
                    withCredentials: true
                });
                return response.data;
            } catch (error) {
                console.error('Error finding user by ID:', error);
            }
        },

        async signIn(user) {
            try {
                const response = await axios.post('http://localhost:3000/user/signin', user, {
                    withCredentials: true
                });
                this.user = {
                    id: response.data.user.id,
                    email: response.data.user.email
                }

                const projectStore = useProjectStore()
                projectStore.fetchProjects()

                socket.emit("registerUser", this.user.id);

                this.error = null
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to sign in'
                console.error('SignIn error:', this.error)
            }
        },

        async signUp(user) {
            try {
                const response = await axios.post('http://localhost:3000/user', user, {
                    withCredentials: true
                });
                this.user = {
                    id: response.data.user.id,
                    email: response.data.user.email
                }

                socket.emit("registerUser", this.user.id);

                const projectStore = useProjectStore()
                projectStore.fetchProjects()

                this.error = null
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to sign up'
                console.error('SignUp error:', this.error)
            }
        },

        async signOut() {
            try {
                await axios.post('http://localhost:3000/user/logout', {}, {
                    withCredentials: true
                });
            } catch (error) {
                console.error('Logout failed:', error);
            }

            this.user = null;

            const projectStore = useProjectStore()
            projectStore.projects = [];
        }
    }
})
