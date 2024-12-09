<script setup>
import { useProjectStore } from '@/store/project';
import { formatDistanceToNow } from 'date-fns';

const projectStore = useProjectStore();

const timeSinceUpdate = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });

</script>

<template>
    <div>
        <div v-for="project in projectStore.projects" :key="project.id"
            class="relative border border-brand-olivine rounded-lg mx-3 mt-4 p-3 space-y-3">
            <i v-if="project.has_updates"
                class="bi bi-bell-fill bg-white text-brand-gold-metallic rounded-full p-2 flex items-center justify-center w-12 h-12 text-2xl absolute -top-4 -left-4"></i>
            <div class="flex justify-between items-center">
                <p class="text-xl">{{ project.name }}</p>
                <p v-if="project.type" class="bg-brand-honeydew p-2 px-5 rounded-lg">
                    {{ project.type }}
                </p>
            </div>

            <div class="flex justify-between items-end">
                <div class="flex space-x-2 items-center">
                    <div
                        class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden border border-brand-olivine rounded-full">
                        <span class="font-medium text-brand-olivine">
                            {{ project.name.substring(0, 2).toUpperCase() }}
                        </span>
                    </div>
                    <span>{{ timeSinceUpdate(project.last_update) }}</span>
                </div>
                <div class="flex space-x-2 items-center text-3xl text-brand-olivine">
                    <i
                        class="bi bi-share-fill bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    <i
                        class="bi bi-people bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    <i
                        class="bi bi-puzzle bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    <i
                        class="bi bi-trash3 bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
