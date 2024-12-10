<script setup>
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/store/project';

const route = useRoute();
const projectStore = useProjectStore();

const project = projectStore.projects.find(p => p.id === parseInt(route.params.id));
</script>

<template>
    <div v-if="project">
        <h1 class="text-xl font-bold">{{ project.name }}</h1>
        <div v-html="project.description"></div>
        <p>{{ project.last_update }} </p>
    </div>
    <div v-else>
        <p>Project not found</p>
    </div>
</template>

<style scoped></style>
