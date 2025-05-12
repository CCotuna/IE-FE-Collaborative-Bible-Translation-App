import { defineStore } from 'pinia'
import axios from 'axios'
import { useProjectStore } from './project'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {},
        error: null
    }),
    actions: {
        async checkAuth() {
            try {
                const res = await axios.get('http://localhost:3000/user/me', {
                    withCredentials: true
                });
                console.log('Response data from user/me:', res.data);
                this.user = {
                    id: res.data.id,
                    email: res.data.email
                };

                const projectStore = useProjectStore()
                projectStore.fetchProjects()

                console.log('User data:', this.user);
            } catch (error) {
                console.error('Session check failed', error);
                this.user = null;
            }
        },
        isAuthenticated() {
            return !!this.user;
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
                console.log('SignUp response:', response)
                this.user = {
                    id: response.data.user.id,
                    email: response.data.user.email
                }

                const projectStore = useProjectStore()
                projectStore.fetchProjects()
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
