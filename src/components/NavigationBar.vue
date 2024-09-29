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
    else if (route.path === '/imnuri-crestine-import-clasificat')
        return 'Imnuri crestine'
    else if (route.path === '/poezii-crestine-import-clasificat')
        return 'Poezii crestine'
    else if (route.path === '/comentarii-biblice-import-clasificat')
        return 'Comentarii biblice'
    else if (route.path === '/biblioteca')
        return 'Biblioteca mea'
    else if (route.path === '/menu')
        return 'Meniu'
    else if (route.path === '/notifications')
        return 'Notificari'
    else
        return 'NULL'
})

const goBack = () => {
    router.go(-1);
};
</script>
<template>
    <!-- <RouterLink :to="{name: 'biblioteca'}">Biblioteca</RouterLink> -->
    <div class="p-3 w-full flex justify-between items-center border-b ">
        <div>
            <button v-if="route.path !== '/' && route.path !== '/biblioteca'" @click="goBack"
                class="text-lg text-gray-500 hover:text-gray-800">
                <i class="bi bi-chevron-left text-brand-olivine"></i>
            </button>
            <span class="p-3 text-2xl font-medium">{{ navbarTitle }}</span>
        </div>
        <div v-if="route.path !== '/import-text' && route.path !== '/import-clasificat' " class="flex space-x-3 text-3xl">
            <RouterLink :to="{name:'biblioteca'}"><i class="bi bi-search"></i></RouterLink>
            <RouterLink :to="{name:'notifications'}"><i class="bi bi-bell-fill"></i></RouterLink>
            <RouterLink :to="{name: 'home'}"><i class="bi bi-plus-circle-fill text-brand-olivine"></i></RouterLink>
            <RouterLink :to="{name:'menu'}"><i class="bi bi-gear"></i></RouterLink>
        </div>
    </div>

</template>
<style scoped></style>