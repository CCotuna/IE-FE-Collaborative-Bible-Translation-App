<script setup>
import { ref, computed } from 'vue';
import { useProjectStore } from '@/store/project';
import { timeSinceCreated } from '@/utils/timeSinceCreated';
import { useRouter } from 'vue-router';

const projectStore = useProjectStore();
const searchQuery = ref('');
const router = useRouter();

const filteredProjects = computed(() => {
    if (!searchQuery.value) return projectStore.projects;
    return projectStore.projects.filter(project => 
        project.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const navigateToProject = (id) => {
    const project = projectStore.projects.find(p => p.id === id);
    if (project) {
        const slug = project.title.toLowerCase().replace(/\s+/g, '-');
        router.push({ name: 'project', params: { id, slug } });
    }
};
</script>

<template>
    <div class="p-5">
        <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Caută un proiect..." 
            class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-olivine"
        />
        
        <div v-if="filteredProjects.length > 0" class="mt-4 space-y-3">
            <div v-for="project in filteredProjects" :key="project.id"
                class="flex justify-between p-3 border border-brand-olivine rounded-lg cursor-pointer hover:bg-gray-100"
                @click="navigateToProject(project.id)">
                <div class="flex flex-col">
                    <p class="text-lg font-medium">{{ project.title }}</p>
                <p class="text-sm text-gray-500">{{ timeSinceCreated(project.createdAt) }}</p>
                </div>
                <div class="flex flex-col">
                    <p class="bg-brand-honeydew p-2 px-5 rounded-lg">{{ project.type }}</p>
                </div>
            </div>
        </div>
        
        <p v-else class="text-center text-gray-500 mt-4">Nu s-au găsit proiecte.</p>
    </div>
</template>

<style scoped>
</style>