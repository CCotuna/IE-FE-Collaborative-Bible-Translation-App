<script setup>
import { computed } from 'vue';
import ImportTextView from '@/views/ImportTextView.vue';
import NotAuthenticated from '@/components/design/NotAuthenticated.vue';
import Library from '@/views/LibraryView.vue';

import { useProjectStore } from '@/store/project'
const projectStore = useProjectStore();

import { useUserStore } from '@/store/user';
const userStore = useUserStore();

const isAuthenticated = computed(() => userStore.isAuthenticated());
</script>

<template>
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center p-4 sm:p-6 antialiased">
        <NotAuthenticated />
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