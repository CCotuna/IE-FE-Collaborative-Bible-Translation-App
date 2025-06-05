<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { validateEmail } from '@/utils/validateUtil'
import AuthIcons from '@/components/design/AuthIcons.vue'

const router = useRouter()

const user = ref({
    email: '',
    password: ''
})

const userStore = useUserStore()
const error = computed(() => userStore.error)
const localError = ref('')

const handleSubmit = async () => {
    localError.value = ''

    if (!user.value.email || !user.value.password) {
        localError.value = 'All fields are required'
        return
    }

    if (!validateEmail(user.value.email)) {
        localError.value = 'Please enter a valid email address'
        return
    }

    try {
        await userStore.signUp(user.value)
        if (userStore.error) {
            console.error(userStore.error)
        } else {
            router.push("/")
        }
    } catch (err) {
        console.error('Error during sign-in:', err)
    }
}
</script>
<template>
    <div class="relative flex items-center justify-center overflow-hidden py-8">
        <AuthIcons />
        <div class="relative z-10 p-8 w-full max-w-md rounded-lg mx-4">
            <h2 class="text-3xl font-semibold text-gray-800 text-center mb-6">Sign Up</h2>
            <h1 class="text-sm font-semibold mb-6 text-gray-600 text-center">Creează-ți un cont nou</h1>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" v-model="user.email" placeholder="Introdu adresa ta de email"
                        required
                        class="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-olivine transition-colors duration-300" />
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-sm font-medium text-gray-700">Parolă</label>
                    <input type="password" id="password" v-model="user.password" placeholder="Creează o parolă" required
                        class="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-olivine transition-colors duration-300" />
                </div>
                <button type="submit"
                    class="w-full bg-brand-olivine text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-olivine focus:ring-offset-2 transition-colors duration-300">
                    Sign Up
                </button>
            </form>
            <div v-if="localError || error" class="mt-4 text-red-600 text-sm text-center">
                <p>{{ localError || error }}</p>
            </div>
            <div class="mt-4 text-sm text-gray-600 text-center">
                <p>Ai deja un cont? <RouterLink :to="{ name: 'sign-in' }"
                        class="text-brand-olivine hover:underline font-medium">
                        Conectează-te aici</RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>