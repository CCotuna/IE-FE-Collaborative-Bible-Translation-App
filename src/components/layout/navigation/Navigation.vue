<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '@/store/project';
import { useUserStore } from '@/store/user';
import { useNotificationStore } from '@/store/notification';

const route = useRoute();
const router = useRouter();

const projectStore = useProjectStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

const filteredNotifications = ref([]);

watch(
    () => notificationStore.notifications,
    (newNotifications) => {
        filteredNotifications.value = newNotifications.filter(
            (notification) =>
                notification.toUserId === userStore.user.id &&
                notification.status === 'pending'
        );
    },
    { immediate: true, deep: true }
);


const goBack = () => {
    router.go(-1);
};

const logout = () => {
    userStore.signOut();
    router.push('/')
}

projectStore.fetchProjects();

const navbarTitle = computed(() => {
    const path = route.path;

    if (path === '/') {
        return projectStore.projects.length === 0 && !userStore.isAuthenticated() ? 'Import text' : 'Biblioteca mea';
    }

    if (route.params.id) {
        const projectId = parseInt(route.params.id);
        const project = projectStore.projects.find(p => p.id === projectId);
        return project ? project.title : 'Proiectul nu a fost găsit';
    }

    switch (path) {
        case '/base-import':
            return 'Import text';
        case '/base-import/new-project':
            return 'Import text';
        case '/pdf-import/new-project':
            return 'Extract PDF';
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
        case '/menu/my-account':
            return 'Contul meu'
        case '/menu/about':
            return 'Despre noi';
        case '/menu/help':
            return 'Ajutor';
        case '/menu/settings':
            return 'Setări';
        case '/projects/search':
            return 'Căutare proiecte';
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
    return route.path === '/' && userStore.isAuthenticated();
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
        <div v-if="route.path === '/' && projectStore.projects.length == 0 && !userStore.isAuthenticated()"
            class="flex space-x-5">
            <RouterLink :to="{ name: 'sign-in' }"
                class="flex items-center space-x-8 px-3 md:px-8 py-2 text-white bg-brand-olivine rounded-full">Sign in
            </RouterLink>
            <RouterLink :to="{ name: 'sign-up' }"
                class="flex items-center space-x-8 px-3 md:px-8 py-2 text-brand-olivine bg-brand-honeydew rounded-full">
                Sign
                up
            </RouterLink>
        </div>
        <div v-if="showMainIcons" class="flex space-x-3 text-3xl">
            <RouterLink :to="{ name: 'projects-search' }"><i class="bi bi-search"></i></RouterLink>
            <RouterLink :to="{ name: 'notifications' }" class="relative"
                :class="{ 'text-yellow-500': filteredNotifications.length > 0 }">
                <i class="bi bi-bell-fill"></i>
                <span v-if="filteredNotifications.length > 0"
                    class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {{ filteredNotifications.length }}
                </span>
            </RouterLink>
            <RouterLink :to="{ name: 'base-import' }"><i class="bi bi-plus-circle-fill text-brand-olivine"></i>
            </RouterLink>
            <RouterLink :to="{ name: 'menu' }"><i class="bi bi-gear"></i></RouterLink>
        </div>
        <div v-if="route.name === 'project'" class="flex space-x-3 text-3xl">
            <span><i class="bi bi-search"></i></span>
            <RouterLink :to="{ name: 'collaborators-view' }"><i class="bi bi-people"></i></RouterLink>
            <RouterLink :to="{ name: 'menu' }"><i class="bi bi-gear"></i></RouterLink>
        </div>
        <div v-if="route.name === 'menu'">
            <button @click="logout()" class="px-8 py-2 text-white rounded-full font-semibold relative overflow-hidden
             bg-red-600 group
             transition-all duration-300 ease-in-out
             focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-75">
                <span class="absolute inset-0 border-2 border-red-300 rounded-full
                   transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span
                    class="absolute inset-0 border-2 border-red-300 rounded-full
                   transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 delay-100 origin-top"></span>
                <span
                    class="absolute inset-0 border-2 border-red-300 rounded-full
                   transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-200 origin-right"></span>
                <span
                    class="absolute inset-0 border-2 border-red-300 rounded-full
                   transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 delay-300 origin-bottom"></span>
                <span class="relative z-10">Deconectare</span>
            </button>
        </div>
    </div>
</template>

<style scoped></style>
