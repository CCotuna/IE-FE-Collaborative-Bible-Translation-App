<script setup>
import { computed } from 'vue';

import { useProjectStore } from '@/store/project';
import { timeSinceCreated } from '@/utils/time_since_created';
import { useRouter } from 'vue-router';

const projectStore = useProjectStore();
const projects = computed(() => projectStore.projects);
const router = useRouter();

const navigateToProject = (id) => {
    const project = projects.value.find(p => p.id === id);
    if (project) {
        const slug = project.title.toLowerCase().replace(/\s+/g, '-')
        router.push({ name: 'project', params: { id, slug } });
    }
};

const deleteProject = (id) => {
    projectStore.deleteProject(id);
};
</script>

<template>
    <div>
        <div v-for="project in projects" :key="project.id"
            class="relative border border-brand-olivine rounded-lg mx-3 mt-4 p-3 space-y-3">

            <i v-if="project.has_updates"
                class="bi bi-bell-fill bg-white text-brand-gold-metallic rounded-full p-2 flex items-center justify-center w-12 h-12 text-2xl absolute -top-4 -left-4"></i>

            <div class="flex justify-between items-center">
                <p class="text-xl cursor-pointer" @click="navigateToProject(project.id)">
                    {{ project.title }}
                </p>
                <p v-if="project.type" class="bg-brand-honeydew p-2 px-5 rounded-lg">
                    {{ project.type }}
                </p>
            </div>

            <div class="flex justify-between items-end">
                <div class="flex space-x-2 items-center">

                    <div
                        class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden border border-brand-olivine rounded-full">
                        <span class="font-medium text-brand-olivine">
                            {{ project.title.substring(0, 2).toUpperCase() }}
                        </span>
                    </div>
                    <span>{{ timeSinceCreated(project.last_update) }}</span>
                </div>
                <div class="flex space-x-2 items-center text-3xl text-brand-olivine">
                    <i
                        class="bi bi-share-fill bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    <i
                        class="bi bi-people bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    <i
                        class="bi bi-puzzle bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    <div @click="deleteProject(project.id)" class="cursor-pointer">
                        <i
                            class="bi bi-trash3 bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
