<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

import { computed } from "vue"
const navbarTitle = computed(() => {
    return route.path === '/import-text' ? 'Import text' : 'Home'
})

const goBack = () => {
    router.go(-1);
};
</script>
<template>
    <div class="p-3 w-full border-b">
        {{ router.path }}
        <button v-if="route.path != '/'" @click="goBack" class="text-lg text-gray-500 hover:text-gray-800">
            <i class="bi bi-chevron-left text-brand-olivine"></i>
        </button>
        <span class="p-3 text-xl font-medium">{{ navbarTitle }}</span>
    </div>
</template>
<style scoped></style>