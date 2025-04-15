<script setup>
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/store/project';
import { computed } from 'vue';

const route = useRoute();
const projectStore = useProjectStore();

const project = computed(() => {
  const id = parseInt(route.params.id);
  return projectStore.projects.find(p => p.id === id);
});

const sortedFragments = computed(() => {
    return project.value?.fragments?.slice().sort((a, b) => a.verseNumber - b.verseNumber) || [];
});
</script>

<template>
    <div v-if="project">
        <div class="p-3">
            <ul class="space-y-6">
                <li v-for="fragment in sortedFragments" :key="fragment.id">
                    <p class="text-gray-900">{{ fragment.verseNumber }}: {{ fragment.content }}</p>

                    <div class="flex items-center space-x-2 mb-2">
                        <div class="rounded-full bg-gray-400 text-white text-sm px-3 py-0.5">
                            Hehe
                        </div>
                        <i class="bi bi-bell-fill text-gray-400 text-sm"></i>
                    </div>

                </li>
            </ul>
        </div>
    </div>

    <div v-else>
        <p>Project not found</p>
    </div>
</template>
