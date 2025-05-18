<script setup>
import { ref, onMounted } from 'vue';
import { useProjectStore } from '@/store/project';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();

const chapters = ref([]);

const projectId = parseInt(route.params.id);
const bookId = parseInt(route.query.bookId);

onMounted(async () => {
    await projectStore.fetchProjectBookChapters(projectId, bookId);
    const result = projectStore.chapters.find(c => c.id === projectId);
    chapters.value = result ? result.bibleChapters : [];
});

const navigateToChapterFragments = (chapterId) => {
    const project = projectStore.projects.find(p => p.id === projectId);

    if (project) {
        const slug = project.title.toLowerCase().replace(/\s+/g, '-');
        router.push({
            name: 'project-fragments',
            params: {
                id: projectId,
                slug,
            },
            query: { chapterId },
        });
    }
};

const navigateToCollaborators = () => {
    router.push({ name: 'collaborators-view', params: { projectId } });
};
</script>

<template>
    <div>
        <ul>
            <li v-for="chapter in chapters" :key="chapter"
                class="relative border border-brand-olivine rounded-lg mx-5 mt-4 p-3 px-7 flex justify-between items-center">
                <i
                    class="bi bi-journal-text bg-white text-brand-gold-metallic rounded-full flex items-center justify-center w-12 h-12 text-3xl absolute -top-4 -left-4"></i>

                <span @click="navigateToChapterFragments(chapter.id)" class="text-2xl cursor-pointer">
                    Capitolul {{ chapter.number }}
                </span>

                <div class="flex space-x-3 items-center text-3xl text-brand-olivine">
                    <div @click="navigateToCollaborators()" class="cursor-pointer">
                        <i
                            class="bi bi-people bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    </div>
                    <div @click="delete" class="cursor-pointer">
                        <i
                            class="bi bi-trash3 bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped></style>
