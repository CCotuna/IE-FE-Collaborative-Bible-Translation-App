<script setup>
import { useUserStore } from '@/store/user';
import { computed } from 'vue';

const userStore = useUserStore();

const isAuthenticated = computed(() => userStore.checkAuth());

const menuLinks = [
    {
        name: 'my-account',
        icon: 'bi-person-circle',
        text: 'Contul meu',
    },
    {
        name: 'settings',
        icon: 'bi-gear',
        text: 'Setări',
    },
    {
        name: 'share-profile',
        icon: 'bi-share-fill',
        text: 'Trimite',
    },
    {
        name: 'about',
        icon: 'bi-info-circle',
        text: 'Despre',
    },
    {
        name: 'help',
        icon: 'bi-question-circle',
        text: 'Ajutor',
    },
];
</script>

<template>
    <div class="ps-7 pt-4 flex flex-col space-y-5">
        <div v-if="!isAuthenticated" class="flex space-x-5">
            <RouterLink :to="{ name: 'sign-in' }"
                class="flex items-center space-x-8 px-4 py-2 text-white bg-brand-olivine rounded-full">
                <span class="text-xl">Intră în cont</span>
            </RouterLink>
            <RouterLink :to="{ name: 'sign-up' }"
                class="flex items-center space-x-8 px-4 py-2 text-brand-olivine bg-brand-honeydew rounded-full">
                <span class="text-xl">Creează cont</span>
            </RouterLink>
        </div>

        <div class="flex flex-col space-y-2 text-xl">
            <RouterLink v-for="link in menuLinks" :key="link.name" :to="{ name: link.name }"
                class="flex space-x-4 items-center first:mb-3">
                <i :class="link.icon" class="text-3xl text-brand-olivine"></i>
                <span>
                    {{ link.text }}
                </span>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped></style>