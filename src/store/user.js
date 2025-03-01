import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {
            username: '',
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
        },
        async signUp(user) {
            const response = await axios.post('http://localhost:3000/user', user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    }
})