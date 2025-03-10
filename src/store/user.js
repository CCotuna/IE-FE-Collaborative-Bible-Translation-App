import { defineStore } from 'pinia'
import axios from 'axios'
import { useProjectStore } from './project'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {
            id: localStorage.getItem('userId') || '',
            username: localStorage.getItem('username') || '',
            password: ''
        }
    }),
    actions: {
        async signIn(user) {
            const response = await axios.post('http://localhost:3000/user/signin', user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            this.user = response.data

            localStorage.setItem('userId', this.user.id)
            localStorage.setItem('username', this.user.username)

            const projectStore = useProjectStore()
            projectStore.fetchProjects()
        },
        async signUp(user) {
            await axios.post('http://localhost:3000/user', user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        signOut() {
            this.user = { id: '', username: '', password: '' }

            const projectStore = useProjectStore()
            projectStore.projects = [];
            
            localStorage.removeItem('username')
            localStorage.removeItem('userId')
        }
    }
})
