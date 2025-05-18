<script setup>
import { onMounted, ref } from 'vue';
import { useProjectStore } from '@/store/project';
import { useRouter, useRoute } from 'vue-router';

const projectStore = useProjectStore();
const router = useRouter();
const route = useRoute();

const books = ref([]);
const projectId = parseInt(route.params.id);

onMounted(async () => {
    await projectStore.fetchProjectBibleBooks(projectId);
    const result = projectStore.books.find(b => b.id === projectId);
    books.value = result ? result.bibleBooks : [];
});

const navigateToProjectChapters = (bookId, bookTitle) => {
    const project = projectStore.projects.find(p => p.id === projectId);

    if (project) {
        const slug = project.title.toLowerCase().replace(/\s+/g, '-');
        router.push({
            name: 'project-chapters',
            params: {
                id: projectId,
                slug,
                bookTitle: removeBookPrefix(bookTitle),
            },
            query: { bookId },
        });
    }
};

const removeBookPrefix = (title) => {
    return title.replace(/Book/g, '');
};

const navigateToCollaborators = () => {
    router.push({ name: 'collaborators-view', params: { projectId } });
};
</script>

<template>
    <div>
        <ul>
            <li v-for="book in books" :key="book.id"
                class="relative border border-brand-olivine rounded-lg mx-5 mt-4 p-3 px-7 flex justify-between items-center">
                <i
                    class="bi bi-bell-fill bg-white text-brand-gold-metallic rounded-full flex items-center justify-center w-12 h-12 text-3xl absolute -top-4 -left-4"></i>
                <span @click="navigateToProjectChapters(book.id, book.title)" class="text-2xl cursor-pointer">
                    {{ removeBookPrefix(book.title) }}
                </span>

                <div class="flex space-x-3 items-center text-3xl text-brand-olivine">
                    <i
                        class="bi bi-share-fill bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    <div @click="navigateToCollaborators()" class="cursor-pointer">
                        <i
                            class="bi bi-people bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    </div>
                    <div class="cursor-pointer">
                        <i
                            class="bi bi-trash3 bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>


<style scoped></style>
