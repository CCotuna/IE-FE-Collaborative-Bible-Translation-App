<script setup>
import { RouterView } from 'vue-router';
import Navigation from './components/layout/navigation/Navigation.vue';

import { useUserStore } from '../src/store/user'
const userStore = useUserStore()

import { computed } from 'vue'
const user = computed(() => userStore.user)
</script>

<template>
  <div>
      <Navigation />
      <RouterView />
      <div>
          <footer class="bg-brand-olivine text-white text-center py-4 mt-10">
              <p>&copy; 2025 Bible Translate App</p>
              <p v-if="user.username">Welcome, {{ user.username }}!</p>
          </footer>
      </div>
  </div>
</template>

<style scoped></style>
