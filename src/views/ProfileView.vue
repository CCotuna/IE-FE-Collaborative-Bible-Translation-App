<script setup>
import { useUserStore } from '@/store/user';
const userStore = useUserStore();

</script>
<template>
   <div class="flex flex-col p-2">
    <span class="text-brand-olivine font-bold">Profile</span>
    <span>email: {{ userStore.user.email }}</span>
   </div>
</template>
<style scoped></style>