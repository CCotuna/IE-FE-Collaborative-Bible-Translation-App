<script setup>
import { ref, onMounted } from 'vue';
import IntroView from './views/IntroView.vue';
import { RouterView } from 'vue-router';
import NavigationBar from './components/Navigation/NavigationBar.vue';

const showIntro = ref(true);

onMounted(() => {
  setTimeout(() => {
    showIntro.value = false;
  }, 2000);
});
</script>

<template>
  <div>
    <IntroView v-if="showIntro" />
    <div v-else>
      <NavigationBar />
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
