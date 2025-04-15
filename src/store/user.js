import { defineStore } from 'pinia'
import axios from 'axios'
import { useProjectStore } from './project'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {
            id: localStorage.getItem('userId') || '',
            email: localStorage.getItem('email') || '',
        }
    }),
    actions: {
        async signIn(user) {
            try {
                const response = await axios.post('http://localhost:3000/user/signin', user, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                this.user = response.data

                localStorage.setItem('userId', this.user.id)
                localStorage.setItem('email', this.user.email)

                const projectStore = useProjectStore()
                projectStore.fetchProjects()

                this.error = null // curăță eroarea dacă totul e ok
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to sign in'
                console.error('SignIn error:', this.error)
            }
        },
        async signUp(user) {
            console.log("user in pinia store", user)
            await axios.post('http://localhost:3000/user', user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        signOut() {
            this.user = { id: '', email: '' }

            const projectStore = useProjectStore()
            projectStore.projects = [];

            localStorage.removeItem('email')
            localStorage.removeItem('userId')
        }
    }
})
