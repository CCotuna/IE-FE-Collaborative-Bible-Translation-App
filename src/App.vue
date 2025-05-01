<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Navigation from './components/layout/navigation/Navigation.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

onMounted(() => {
    userStore.checkAuth()
})
</script>

<template>
    <div>
        <Navigation />
        <RouterView />
        <!-- <div>
          <footer class="bg-brand-olivine text-white text-center py-2 mt-10">
              <p>&copy; 2025 Bible Translate App</p>
              <p v-if="userStore.user.email">Welcome, {{ userStore.user.email }}!</p>
          </footer>
      </div> -->
    </div>
</template>

<style scoped></style>
