<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

import { computed } from "vue"
const navbarTitle = computed(() => {
    if (route.path === '/')
        return 'Home'
    else if (route.path === '/import-text')
        return 'Import text'
    else if (route.path === '/import-clasificat')
        return 'Import clasificat'
    else if (route.path === '/biblia-import-clasificat')
        return 'Biblia'
    else if (route.path === '/biblioteca')
        return 'Biblioteca mea'
    else
        return 'NULL'
})

const goBack = () => {
    router.go(-1);
};
</script>
<template>
    <div class="p-3 w-full flex justify-between border-b ">
        <div>
            <button v-if="route.path != '/'" @click="goBack" class="text-lg text-gray-500 hover:text-gray-800">
            <i class="bi bi-chevron-left text-brand-olivine"></i>
        </button>
        <span class="p-3 text-xl font-medium">{{ navbarTitle }}</span>
        </div>
        <div>
            <RouterLink :to="{name: 'biblioteca'}">Biblioteca</RouterLink>
        </div>
    </div>
</template>
<style scoped></style>