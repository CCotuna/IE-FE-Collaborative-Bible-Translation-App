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

const removeBookPrefix = (title) => title.replace(/Book/g, '');

const navigateToCollaborators = () => {
    router.push({ name: 'collaborators-view', params: { projectId } });
};

const isModalOpen = ref(false);
const selectedBookId = ref(null);

const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

const triggerToast = (message, isNegative) => {
    toastMessage.value = message;
    showToast.value = true;
    toastType.value = isNegative ? 'error' : 'success';

    setTimeout(() => {
        showToast.value = false;
        toastMessage.value = '';
        toastType.value = '';
    }, 3000);
};

const askDeleteConfirmation = (bookId) => {
    selectedBookId.value = bookId;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedBookId.value = null;
};

const confirmDelete = async () => {
    if (selectedBookId.value !== null) {
        const success = await projectStore.deleteBibleBook(selectedBookId.value, projectId);
        console.log("Delete response:", success);
        if (success) {
            books.value = books.value.filter(book => book.id !== selectedBookId.value);
            triggerToast("Cartea a fost ștearsă cu succes.", false);
        } else {
            triggerToast("A apărut o eroare la ștergerea cărții.", true);
        }
        closeModal();
    }
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
                    <div @click="askDeleteConfirmation(book.id)" class="cursor-pointer">
                        <i
                            class="bi bi-trash3 bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    </div>
                </div>
            </li>
        </ul>
        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-8 shadow-lg text-center max-w-md w-full">
                <h2 class="text-lg mb-4">Ești sigur că dorești <strong class="text-red-500">să ștergi</strong> această
                    carte? Această acțiune este permanentă.</h2>
                <div class="flex justify-around mt-4">
                    <button @click="confirmDelete"
                        class="bg-brand-olivine text-white text-lg px-8 py-2 rounded-full">Confirm</button>
                    <button @click="closeModal"
                        class="bg-brand-honeydew text-brand-olivine text-lg px-8 py-2 rounded-full">Renunț</button>
                </div>
            </div>
        </div>

        <div v-if="showToast"
            class="fixed bottom-4 left-4 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300"
            :class="{
                'bg-red-600': toastType === 'error',
                'bg-brand-olivine': toastType === 'success'
            }">
            {{ toastMessage }}
        </div>
    </div>
</template>


<style scoped></style>
