<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../../store/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref({
  email: '',
  password: ''
})

const userStore = useUserStore()
const error = computed(() => userStore.error)
const localError = ref('')

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

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
      console.log('User logged in successfully:', userStore.user)
      router.push('/')
    }
  } catch (err) {
    console.error('Error during sign-in:', err)
  }
}
</script>
<template>
  <div class="flex p-10">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-semibold text-center mb-6">Sign up</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="user.email" placeholder="Enter your email" required
            class="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-olivine" />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="password" v-model="user.password" placeholder="Enter your password" required
            class="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-olivine" />
        </div>
        <button type="submit"
          class="w-full bg-brand-olivine text-white p-3 rounded-lg font-semibold hover:bg-brand-olivine focus:outline-none focus:ring-2 focus:ring-brand-olivine">
          Sign Up
        </button>
      </form>
      <div v-if="localError || error" class="mt-4 text-red-500 text-sm text-center">
        <p>{{ localError || error }}</p>
      </div>
    </div>
  </div>
</template>