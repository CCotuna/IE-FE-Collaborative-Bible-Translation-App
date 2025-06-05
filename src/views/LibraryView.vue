<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useProjectStore } from '@/store/project';
import { useNotificationStore } from '@/store/notification';
import { useUserStore } from '@/store/user';
import { timeSinceCreated } from '@/utils/timeSinceCreated';
import { useRouter } from 'vue-router';
import socket from '@/plugins/socket';

const userStore = useUserStore();
const notificationStore = useNotificationStore();

const projectStore = useProjectStore();
const projects = computed(() => {
    if (!projectStore.projects) return [];
    return [...projectStore.projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}); 

const router = useRouter();

const navigateToProject = (id) => {
    const project = projects.value.find(p => p.id === id);
    if (project) {
        const slug = project.title.toLowerCase().replace(/\s+/g, '-')
        if (project.type === 'Biblia') {
            router.push({ name: 'project-books', params: { id, slug } });
        } else {
            router.push({ name: 'project-default', params: { id, slug } });
        }
    }
};

const navigateToCollaborators = (id) => {
    router.push({ name: 'collaborators-view', params: { id } });
};

const isModalOpen = ref(false);
const selectedProjectId = ref(null);
const selectedOwnerId = ref(null);

const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

const triggerToast = (message, isNegative) => {
    toastMessage.value = message;
    showToast.value = true;
    if (isNegative) {
        toastType.value = 'success';
    } else {
        toastType.value = 'error';
    }
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

const askDeleteConfirmation = (project) => {
    selectedProjectId.value = project.id;
    selectedOwnerId.value = project.userId;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedProjectId.value = null;
};

const confirmDelete = async () => {
    if (selectedProjectId.value !== null && selectedOwnerId.value !== null) {
        if (selectedOwnerId.value === userStore.user.id) {
            try {
                await projectStore.deleteProject(selectedProjectId.value, userStore.user.id);
                triggerToast("Proiectul a fost șters cu succes.", 'success');
            } catch (error) {
                console.error("Error deleting project:", error);
                triggerToast("A apărut o eroare la ștergerea proiectului.", 'error');
            } finally {
                closeModal();
            }
        } else {
            triggerToast("Nu ai permisiunea de a șterge acest proiect.", 'error');
            closeModal();
        }
    }
};

const handleProjectDeleted = (data) => {
    const projectExistsInList = projectStore.projects.some(p => p.id === data.id);

    if (projectExistsInList) {
        projectStore.removeProjectById(data.id);
        if (selectedProjectId.value !== data.id) {
            triggerToast(`Proiectul "${data.title || 'ID: ' + data.id}" a fost șters de un alt utilizator.`, 'info');
        }
    }
};

onMounted(async () => {
    if (userStore.user && userStore.user.id) {
    }
    socket.on('projectDeleted', handleProjectDeleted);

    if (userStore.isAuthenticated() && projectStore.projects.length === 0) {
        projectStore.fetchProjects();
        await notificationStore.fetchNotifications();
    }
});

onBeforeUnmount(() => {
    socket.off('projectDeleted', handleProjectDeleted);
});

const isExporting = computed(() => projectStore.isExportingPdf);

// const exportProject = async (projectId) => {
//     isExporting.value = true;

//     const projectToExport = projects.value.find(p => p.id === projectId);
//     const projectTitle = projectToExport ? projectToExport.title : `Proiect ID ${projectId}`;
//     try {
//         await projectStore.exportProjectFragmentsToTXT(projectId);
//     } catch (error) {
//         console.error(`Failed to export project ${projectId} to PDF from component:`, error);
//         triggerToast(`Eroare la exportul PDF pentru "${projectTitle}": ${error.message}`, true);
//     } finally {
//         isExporting.value = false;
//     }
// };

const handleExportToPdf = async (projectId) => {
    await projectStore.exportProjectToPdf(projectId);
};
</script>

<template>

    <div v-if="projects.length > 0">
        <div v-for="project in projects" :key="project.id"
            class="relative border border-brand-olivine rounded-lg mx-5 mt-4 p-3 space-y-3">
            <!-- {{ project }} -->
            <i v-if="project.userId === userStore.user.id"
                class="bi bi-journal-text bg-white text-brand-gold-metallic rounded-full p-2 flex items-center justify-center w-12 h-12 text-3xl absolute -top-4 -left-4"></i>
            <i v-else
                class="bi bi-journal-arrow-down bg-white text-brand-gold-metallic rounded-full p-2 flex items-center justify-center w-12 h-12 text-3xl absolute -top-4 -left-4"></i>
            <div class="flex justify-between items-center">
                <p class="text-xl cursor-pointer" @click="navigateToProject(project.id)">
                    <!-- {{ project }} -->
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
                    <span>{{ timeSinceCreated(project.createdAt) }}</span>
                </div>
                <div class="flex space-x-2 items-center text-3xl text-brand-olivine">
                    <button @click="handleExportToPdf(project.id)" :disabled="isExporting"
                        title="Exportă fragmentele ca PDF" class="bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12 cursor-pointer
                       disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="bi bi-share-fill"></i>
                    </button>
                    <div class="cursor-pointer" @click="navigateToCollaborators(project.id)">
                        <i
                            class="bi bi-people bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    </div>
                    <i
                        class="bi bi-puzzle bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    <div @click="askDeleteConfirmation(project)" class="cursor-pointer">
                        <i
                            class="bi bi-trash3 bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-8 shadow-lg text-center max-w-md w-full">
                <h2 class="text-lg mb-4">Ești sigur că dorești <strong class="text-red-500">să ștergi</strong> acest
                    proiect?Această acțiune este
                    permanentă.</h2>
                <div class="flex justify-center space-x-4 mt-4">
                    <button @click="confirmDelete"
                        class="bg-brand-olivine hover:bg-red-600 text-white text-lg px-8 py-2 rounded-full">Confirm</button>
                    <button @click="closeModal"
                        class="bg-brand-honeydew hover:bg-brand-olivine hover:text-white text-brand-olivine text-lg px-8 py-2 rounded-full">Renunț</button>
                </div>
            </div>
        </div>
    </div>

    <div v-else>
        <img src="@/assets/emptyState/EmptyStateProjects.svg" alt="No projects" class="mx-auto mt-10 w-96 h-auto">
        <p class="text-center text-2xl font-bold text-brand-olivine">No projects yet</p>
        <p class="text-center text-lg text-black">Create a new project to get started</p>
    </div>

    <div v-if="showToast"
        class="fixed bottom-4 left-4 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300" :class="{
            'bg-red-600': toastType === 'error',
            'bg-brand-olivine': toastType === 'success',
        }">
        {{ toastMessage }}
    </div>

</template>
