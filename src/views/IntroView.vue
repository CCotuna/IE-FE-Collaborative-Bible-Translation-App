<script setup>
</script>

<template>
  <div
    class="intro-animation flex flex-col items-center justify-center bg-brand-cornsilk h-screen overflow-hidden">
    <img src="https://logodix.com/logo/1931236.png" alt="Logo" class="w-20 h-20 mb-4" />
    <h1 class="text-2xl text-center">Numele <br /> Aplicatiei</h1>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.intro-animation {
  animation: fadeIn 1s ease-out;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
</style>
