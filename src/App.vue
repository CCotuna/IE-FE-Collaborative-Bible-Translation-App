<script setup>
import { RouterView } from 'vue-router';
import Navigation from './components/layout/navigation/Navigation.vue';

// import { useUserStore } from '../src/store/user'
// const userStore = useUserStore()

// import { useBibleImportStore } from './store/bibleProject';
// const bibleStore = useBibleImportStore()

// import { computed } from 'vue'
// const user = computed(() => userStore.user)
</script>

<template>
  <div>
      <Navigation />
      <RouterView />
      <!-- <div>
          <footer class="bg-brand-olivine text-white text-center py-4 mt-10">
              <p>&copy; 2025 Bible Translate App</p>
              <p v-if="user.username">Welcome, {{ user.username }}!</p>
              <div v-if="bibleStore.title || bibleStore.language || bibleStore.version || bibleStore.selectedBooks.length" class="text-left ms-5 text-xl">
                    <p v-if="bibleStore.title" class="text-white">Title: {{ bibleStore.title }}</p>
                    <p v-if="bibleStore.language" class="text-white">Language: {{ bibleStore.language }}</p>
                    <p v-if="bibleStore.version" class="text-white">Version: {{ bibleStore.version }}</p>
                    <p v-if="bibleStore.selectedBooks.length" class="text-white">Selected Books: {{ bibleStore.selectedBooks.map(b => b.name).join(', ') }}</p>
              </div>
          </footer>
      </div> -->
  </div>
</template>

<style scoped></style>
