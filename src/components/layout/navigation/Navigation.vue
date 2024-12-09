<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '@/store/project';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();

const goBack = () => {
    router.go(-1);
};

const navbarTitle = computed(() => {
    const path = route.path;

    if (path === '/') {
        return projectStore.projects.length === 0 ? 'Import text' : 'Biblioteca mea';
    }

    switch (path) {
        case '/base-import':
            return 'Import text';
        case '/classified-import':
            return 'Import clasificat';
        case '/notifications':
            return 'Notificări';
        case '/menu':
            return 'Meniu';
        default:
            return '';
    }
});

const showGoBack = computed(() => {
    return !['/', '/library', '/base-import'].includes(route.path);
});

const showMainIcons = computed(() => {
    return route.path === '/' && projectStore.projects.length > 0;
});
</script>

<template>
    <div class="p-3 w-full flex justify-between items-center border-b">
        <div>
            <button v-if="showGoBack" @click="goBack" class="text-lg text-gray-500 hover:text-gray-800">
                <i class="bi bi-chevron-left text-brand-olivine"></i>
            </button>
            <span class="p-3 text-2xl font-medium">{{ navbarTitle }}</span>
        </div>
        <div v-if="showMainIcons" class="flex space-x-3 text-3xl">
            <RouterLink ><i class="bi bi-search"></i></RouterLink>
            <RouterLink :to="{ name: 'notifications' }"><i class="bi bi-bell-fill"></i></RouterLink>
            <RouterLink :to="{ name: 'base-import' }"><i class="bi bi-plus-circle-fill text-brand-olivine"></i></RouterLink>
            <RouterLink :to="{ name: 'menu' }"><i class="bi bi-gear"></i></RouterLink>
        </div>
        <RouterLink v-if="route.path === '/text-biblic-design'" :to="{ name: 'text-biblic-design' }">
            <i class="bi bi-file-earmark-text text-3xl"></i>
        </RouterLink>
    </div>
</template>

<style scoped></style>
