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

const isModalOpen = ref(false);
const selectedChapterId = ref(null);

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

const askDeleteConfirmation = (chapterId) => {
    selectedChapterId.value = chapterId;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedChapterId.value = null;
};

const confirmDelete = async () => {
    if (selectedChapterId.value !== null) {
        const success = await projectStore.deleteBibleChapter(selectedChapterId.value);
        if (success) {
            chapters.value = chapters.value.filter(ch => ch.id !== selectedChapterId.value);
            triggerToast("Capitolul a fost șters cu succes.", false);
        } else {
            triggerToast("A apărut o eroare la ștergerea capitolului.", true);
        }
        closeModal();
    }
};
</script>

<template>
    <div>
        <ul>
            <li v-for="chapter in chapters" :key="chapter.id"
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
                    <div @click="askDeleteConfirmation(chapter.id)" class="cursor-pointer">
                        <i
                            class="bi bi-trash3 bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    </div>
                </div>
            </li>
        </ul>

        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-8 shadow-lg text-center max-w-md w-full">
                <h2 class="text-lg mb-4">Ești sigur că dorești <strong class="text-red-500">să ștergi</strong> acest
                    capitol? Această acțiune este permanentă.</h2>
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
