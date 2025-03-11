<script setup>
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/store/project';
import Annotation from '../ui/Annotation.vue';
import TextDesign from '../TextDesign.vue';

const route = useRoute();
const projectStore = useProjectStore();
const project = projectStore.projects.find(p => p.id === parseInt(route.params.id));

</script>

<template>
    <div v-if="project">
        <!-- {{ project }} -->
        <TextDesign />
        <Annotation />
        <div class="mt-12 p-3 relative">
            <p class="text-xl">
                <span class="text-sm text-gray-500"></span>
                <span v-if="project.type === 'Custom'" v-html="project.text.replace(/\n/g, '<br>')"></span>
                <span v-else>{{ project.text }}</span>
            </p>
            <div class="flex items-center absolute -bottom-8 space-x-2">
                <div class="rounded-full bg-gray-400 text-white text-base px-4">3</div>
                <i class="bi bi-bell-fill text-gray-400 text-base"></i>
            </div>
        </div>
    </div>
    <div v-else>
        <p>Project not found</p>
    </div>
</template>
