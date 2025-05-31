<script setup>
import { computed } from 'vue';
import ImportTextView from '@/views/ImportTextView.vue';
import Library from '@/views/LibraryView.vue';

import { useProjectStore } from '@/store/project'
const projectStore = useProjectStore();

import { useUserStore } from '@/store/user';
const userStore = useUserStore();

const isAuthenticated = computed(() => userStore.isAuthenticated());

</script>
<template>
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center p-4 sm:p-6 antialiased">
        <div class="w-full max-w-lg bg-brand-custom-white rounded-xl p-6 sm:p-10 text-center">
            <div class="w-20 h-[5px] bg-brand-gold-metallic rounded-full mx-auto mb-6 sm:mb-8"></div>
            <img src="@/assets/emptyState/UserNotAuthenticated.svg" alt="Utilizator neautentificat"
                class="mx-auto h-48 sm:h-64 md:h-80 w-auto mb-6 sm:mb-8" />

            <h1 class="text-3xl sm:text-4xl font-bold text-slate-700 mb-4 leading-tight">
                Conectează-te pentru a continua
            </h1>
            <p class="text-md sm:text-lg text-slate-500 mb-8 sm:mb-10">
                Contul tău îți oferă acces la toate instrumentele și proiectele tale.
            </p>

            <RouterLink :to="{ name: 'sign-in' }" class="w-full sm:w-auto bg-brand-olivine text-brand-custom-white font-semibold 
                       py-3 px-8 sm:px-10 rounded-lg shadow-lg
                       transform transition-all duration-300 ease-in-out 
                       hover:bg-opacity-85 hover:shadow-xl hover:scale-105 
                       focus:outline-none focus:ring-4 focus:ring-brand-olivine focus:ring-opacity-40">
                Autentificare
            </RouterLink>

            <div class="mt-10 text-sm text-slate-500">
                <p>
                    Nu ai încă un cont?
                    <RouterLink :to="{ name: 'sign-up' }"
                        class="font-semibold text-brand-gold-metallic hover:text-brand-olivine hover:underline focus:outline-none">
                        Creează unul acum
                    </RouterLink>
                </p>
            </div>
        </div>
    </div>
    <div v-else>
        <div v-if="projectStore.projects.length == 0">
            <ImportTextView />
        </div>
        <div v-else>
            <Library />
        </div>
    </div>
</template>
<style scoped></style>