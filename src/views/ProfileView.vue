<script setup>
import { useUserStore } from '@/store/user';
const userStore = useUserStore();

</script>
<template>
   <div class="flex flex-col p-2">
    <span class="text-brand-olivine font-bold">Profile</span>
    <span>id: {{ userStore.user.id }}</span>
    <span>username: {{ userStore.user.username }}</span>
   </div>
</template>
<style scoped></style>