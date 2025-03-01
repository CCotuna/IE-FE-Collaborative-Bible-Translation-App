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

projectStore.fetchProjects();

const navbarTitle = computed(() => {
    const path = route.path;

    if (path === '/') {
        return projectStore.projects.length === 0 ? 'Import text' : 'Biblioteca mea';
    }

    if (route.params.id) {
        const projectId = parseInt(route.params.id);
        const project = projectStore.projects.find(p => p.id === projectId);
        return project ? project.name : 'Proiectul nu a fost găsit';
    }

    switch (path) {
        case '/base-import':
            return 'Import text';
        case '/base-import/new-project':
            return 'Import text';
        case '/classified-import':
            return 'Import clasificat';
        case '/classified-import/bible':
            return 'Biblia';
        case '/classified-import/bible/book':
            return 'Biblia Partial'
        case '/classified-import/bible/book/chapter':
            return 'Psalmi';
        case '/classified-import/bible/book/chapter/verse':
            return 'Psalmi 17';
        case '/notifications':
            return 'Notificări';
        case '/menu':
            return 'Meniu';
        case '/sign-in':
            return 'Autentificare';
        case '/sign-up':
            return 'Înregistrare';
        default:
            return '';
    }
});

const showGoBack = computed(() => {
    if (['/', '/library'].includes(route.path)) {
        return false;
    }
    return route.path === '/base-import' ? projectStore.projects.length > 0 : true;
});

const showMainIcons = computed(() => {
    return route.path === '/' && projectStore.projects.length > 0;
});
</script>

<template>
    <div class="p-3 w-full flex justify-between items-center border-b">
        <div class="flex items-center space-x-2">
            <button v-if="showGoBack" @click="goBack" class="text-lg text-gray-500 hover:text-gray-800">
                <i class="bi bi-chevron-left text-brand-olivine"></i>
            </button>
            <span :class="{
                'w-64 md:w-full ps-0': route.name === 'project',
            }" class="p-3 text-2xl font-medium truncate">
                {{ navbarTitle }}
            </span>
        </div>
        <div v-if="showMainIcons" class="flex space-x-3 text-3xl">
            <span><i class="bi bi-search"></i></span>
            <RouterLink :to="{ name: 'notifications' }"><i class="bi bi-bell-fill"></i></RouterLink>
            <RouterLink :to="{ name: 'base-import' }"><i class="bi bi-plus-circle-fill text-brand-olivine"></i>
            </RouterLink>
            <RouterLink :to="{ name: 'menu' }"><i class="bi bi-gear"></i></RouterLink>
        </div>
        <div v-if="route.name === 'project'" class="flex space-x-3 text-3xl">
            <span><i class="bi bi-search"></i></span>
            <span><i class="bi bi-people"></i></span>
            <RouterLink :to="{ name: 'menu' }"><i class="bi bi-gear"></i></RouterLink>
        </div>
    </div>
</template>

<style scoped></style>
