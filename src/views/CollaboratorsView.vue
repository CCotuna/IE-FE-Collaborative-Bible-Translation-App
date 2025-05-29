<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useProjectStore } from "@/store/project";
import { useNotificationStore } from "@/store/notification";
import { useUserStore } from "@/store/user";
import { useRoute } from "vue-router";
import socket from "@/plugins/socket";

const emailInput = ref("");
const errorMessage = ref(null);
const successMessage = ref(null);

const route = useRoute();
const projectId = parseInt(route.params.id);

const userStore = useUserStore();
const projectStore = useProjectStore();
const notificationStore = useNotificationStore();

const project = computed(() => {
    const id = parseInt(projectId);
    return projectStore.projects.find((p) => p.id === id);
});

const isOwner = computed(() => {
    if (!project.value || !userStore.user) return false;

    return project.value.userId === userStore.user.id;
});

onMounted(async () => {
    if (projectId) {
        socket.emit('joinProjectRoom', projectId.toString());
        console.log(`CollaboratorsView: Joined project room ${projectId}`);
    }

    socket.on('collaboratorAdded', (newCollaborator) => {
        console.log('Socket event: collaboratorAdded received', newCollaborator);

        if (newCollaborator.projectId === projectId && project.value) {
            const exists = project.value.collaborators.some(
                (c) => c.userId === newCollaborator.userId || c.email === newCollaborator.email
            );

            if (!exists) {
                project.value.collaborators.push({
                    email: newCollaborator.email,
                    userId: newCollaborator.userId,
                    UserAccess: { role: newCollaborator.role }
                });

            } else {
                console.log(`Collaborator ${newCollaborator.email} already in list for project ${projectId}.`);
            }
        }
    });
});

onBeforeUnmount(() => {
    if (projectId) {
        socket.emit('leaveProjectRoom', projectId.toString());
        console.log(`CollaboratorsView: Left project room ${projectId}`);
    }
    socket.off('collaboratorAdded');
});

const sendInvitation = async () => {
    if (!emailInput.value) {
        errorMessage.value = "Please enter a valid email address.";
        return;
    }

    try {
        const notification = {
            email: emailInput.value,
            projectId: parseInt(projectId),
            projectTitle: project.value.title,
            senderId: userStore.user.id,
            senderEmail: userStore.user.email,
            type: "invitation",
            status: "pending",
        };

        await notificationStore.sendNotification(notification);

        successMessage.value = "Invitation notification sent!";
        errorMessage.value = null;
        emailInput.value = "";
    } catch (error) {
        console.error("Error sending invitation:", error);
        errorMessage.value = "There was an error sending the invitation.";
        successMessage.value = null;
    }
};
</script>

<template>
    <div v-if="project" class="p-6">
        <!-- {{ project }} -->
        <h3 class="text-xl font-semibold text-brand-olivine mb-4">Collaborators:</h3>
        <div class="pl-6 space-y-2 flex flex-col">
            <span v-for="(collaborator, index) in project.collaborators" :key="index" class="text-lg text-black">
                {{ index + 1 }} - {{ collaborator.email }} - {{ collaborator.UserAccess.role }}
            </span>
        </div>

        <h2 v-if="isOwner" class="text-2xl font-semibold text-brand-gold-metallic mt-6 mb-4">Invite Collaborator</h2>
        <div v-if="isOwner" class="flex items-center space-x-4 mb-4">
            <input v-model="emailInput" type="email" placeholder="Enter email address"
                class="p-2 border-2 border-brand-olivine rounded-md w-96" />
            <button @click="sendInvitation"
                class="px-6 py-2 bg-brand-olivine text-white rounded-md hover:bg-brand-tea-green transition duration-300">
                Send Invitation
            </button>
        </div>

        <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-green-500 mt-2">{{ successMessage }}</p>
    </div>
</template>

<style scoped></style>
