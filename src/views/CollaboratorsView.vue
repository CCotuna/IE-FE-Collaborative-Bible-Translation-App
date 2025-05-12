<script setup>
import { ref, computed } from "vue";
import { useProjectStore } from "@/store/project"; 
import { useUserStore } from "@/store/user"; 
import { useRoute } from "vue-router"; 

const emailInput = ref("");
const errorMessage = ref(null);
const successMessage = ref(null);

const route = useRoute();
const projectId = route.params.id;

const userStore = useUserStore();
const projectStore = useProjectStore();

const project = computed(() => {
    const id = parseInt(projectId); 
    return projectStore.projects.find((p) => p.id === id);
});

const sendInvitation = async () => {
    if (!emailInput.value) {
        errorMessage.value = "Please enter a valid email address.";
        return;
    }

    console.log("Sending invitation to:", emailInput.value);

    try {
        await projectStore.addCollaborator(emailInput.value, projectId); 
        successMessage.value = "Invitation sent successfully!";
        errorMessage.value = null;
        emailInput.value = "";
    } catch (error) {
        console.log("Error sending invitation:", error);
        errorMessage.value = "There was an error sending the invitation.";
        successMessage.value = null;
    }
};
</script>

<template>
    <div v-if="project" class="p-6">
        {{ project }}
        <h3 class="text-xl font-semibold text-brand-olivine mb-4">Collaborators:</h3>
        <div class="pl-6 space-y-2 flex flex-col">
            <span v-for="(collaborator, index) in project.collaborators" :key="index" class="text-lg text-black">
                {{ index + 1 }} - {{ collaborator.email }} - {{ collaborator.UserAccess.role }}
            </span>
        </div>

        <h2
            class="text-2xl font-semibold text-brand-gold-metallic mt-6 mb-4">Invite Collaborator</h2>
        <div class="flex items-center space-x-4 mb-4">
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
