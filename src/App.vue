<script setup>
import { RouterView } from 'vue-router';
import Navigation from './components/layout/navigation/Navigation.vue';
</script>

<template>
  <div>
      <Navigation />
      <RouterView />
  </div>
</template>

<style scoped></style>
