<script setup>
import { ref, onMounted } from 'vue';
import IntroView from './views/IntroView.vue';
import { RouterView } from 'vue-router';
import NavigationBar from './components/NavigationBar.vue';

const showIntro = ref(true);

// onMounted(() => {
//   setTimeout(() => {
//     showIntro.value = false;
//   }, 2000);
// });
</script>

<template>
  <div>
    <NavigationBar />
    <!-- <IntroView v-if="showIntro" /> -->
    <RouterView />
  </div>
</template>

<style scoped></style>
