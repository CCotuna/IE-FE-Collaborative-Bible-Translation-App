<script setup>
import { ref, onMounted } from 'vue';
import IntroView from './views/IntroView.vue';
import { RouterView } from 'vue-router';

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
    <RouterView v-else />
  </div>
</template>

<style scoped></style>
