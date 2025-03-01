<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../../store/user'

const user = ref({
  username: '',
  password: ''
})

const userStore = useUserStore()

const error = computed(() => userStore.error)

const handleSubmit = async () => {
  try {
    await userStore.signIn(user.value)
    if (userStore.error) {
      console.error(userStore.error)
    } else {
      console.log('User logged in successfully:', userStore.user)
    }
  } catch (err) {
    console.error('Error during sign-in:', err)
  }
}
</script>
<template>
    <div class="flex p-10">
      <div class="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 class="text-2xl font-semibold text-center mb-6">Sign In</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input 
              type="text" 
              id="username" 
              v-model="user.username" 
              placeholder="Enter your username" 
              required
              class="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-olivine"
            />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="user.password" 
              placeholder="Enter your password" 
              required
              class="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-olivine"
            />
          </div>
          <button 
            type="submit"
            class="w-full bg-brand-olivine text-white p-3 rounded-lg font-semibold hover:bg-brand-olivine focus:outline-none focus:ring-2 focus:ring-brand-olivine"
          >
            Sign In
          </button>
        </form>
        <div v-if="error" class="mt-4 text-red-500 text-sm text-center">
          <p>{{ error }}</p>
        </div>
      </div>
    </div>
  </template>
  
 

  