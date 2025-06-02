<script setup>
import { onMounted, computed } from 'vue'
import { useNotificationStore } from '@/store/notification'
import { useProjectStore } from '@/store/project'
import { useRouter } from 'vue-router'

import { timeSinceCreated } from '@/utils/timeSinceCreated'

const router = useRouter()

const projectStore = useProjectStore()
const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications)

const acceptInvitation = async (notificationId, userId, projectId) => {
    try {
        await notificationStore.acceptInvitation(notificationId, userId, projectId)
        await projectStore.fetchProjectById(projectId)
    } catch (error) {
        console.error('Error responding to invitation:', error)
    }
}

const declineInvitation = async (notificationId) => {
    try {
        await notificationStore.declineInvitation(notificationId)
    } catch (error) {
        console.error('Error declining invitation:', error)
    }
}

const markAsRead = async (notificationId) => {
    try {
        await notificationStore.markAsRead(notificationId)
    } catch (error) {
        console.error('Error marking notification as read:', error)
    }
}

onMounted(() => {
    notificationStore.listenForNotifications();
    notificationStore.fetchNotifications();
})

const navigateToProject = (notification) => {
    const project = projectStore.projects.find(p => p.id === notification.projectId);
    if (!project) {
        console.error('Project not found for notification:', notification);
        return;
    }
    const slug = project.title.toLowerCase().replace(/\s+/g, '-');
    if (project.type === 'Biblia') {
        router.push({ name: 'project-books', params: { id: project.id, slug } });
    } else {
        router.push({ name: 'project-default', params: { id: project.id, slug } });
    }
};

</script>

<template>
    <div v-if="notifications.length > 0">
        <!-- {{ notifications }} -->
        <ul>
            <li v-for="notification in notifications" :key="notification.id"
                class="flex flex-col border-b space-y-3 p-6" :class="{
                    'bg-brand-cornsilk': notification.type === 'invitation' && notification.status === 'pending',
                    'bg-white': !(notification.type === 'invitation' && notification.status === 'pending')
                }">

                <div v-if="notification.type === 'invitation'" class="flex flex-col space-y-2">
                    <span class="text-xl font-semibold">Proiect: {{ notification.projectTitle }}</span>
                    <div>Utilizatorul <span class="font-medium">{{ notification.fromUserEmail }}</span> te-a invitat să
                        devii colaborator la
                        acest proiect.</div>
                    <div class="flex space-x-2 items-center">
                        <div
                            class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden border border-brand-olivine bg-brand-custom-white rounded-full">
                            <span class="font-medium text-brand-olivine">{{
                                notification.fromUserEmail?.substring(0, 2).toUpperCase() || 'NA' }}</span>
                        </div>
                        <span class="text-gray-400 text-sm">{{ timeSinceCreated(notification.createdAt) }}</span>
                    </div>
                    <div v-if="notification.status === 'pending'" class="flex space-x-3 pt-2">
                        <button
                            @click="acceptInvitation(notification.id, notification.toUserId, notification.projectId)"
                            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                            Acceptă
                        </button>
                        <button @click="declineInvitation(notification.id)"
                            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm">
                            Refuză
                        </button>
                    </div>
                    <div v-else class="pt-1">
                        <span class="text-sm italic">Status: {{ notification.status }}</span>
                    </div>
                </div>

                <div v-if="notification.type === 'comment'" class="flex flex-col space-y-2">
                    <span @click="navigateToProject(notification)"
                        class="text-xl font-semibold cursor-pointer hover:text-brand-gold-metallic"
                        v-if="notification.projectTitle">Proiect: {{
                            notification.projectTitle }}</span>
                    <div>
                        Utilizatorul <span class="font-medium">{{ notification.fromUserEmail }}</span> a adăugat un
                        comentariu.
                    </div>
                    <div v-if="notification.message" class="bg-gray-100 p-3 rounded-md border border-gray-200">
                        <p class="text-sm text-gray-700"><strong>Mesaj:</strong> {{ notification.message }}</p>
                    </div>
                    <div v-if="notification.fromUserEmail" class="flex space-x-2 items-center">
                        <div
                            class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden border border-brand-olivine bg-brand-custom-white rounded-full">
                            <span class="font-medium text-brand-olivine">{{
                                notification.fromUserEmail?.substring(0, 2).toUpperCase() || 'NA' }}</span>
                        </div>
                        <span class="text-gray-400 text-sm">{{ timeSinceCreated(notification.createdAt) }}</span>
                    </div>
                    <div v-if="notification.status === 'pending'" class="pt-2">
                        <button @click="markAsRead(notification.id)"
                            class="bg-brand-olivine text-white px-4 py-2 rounded-md text-sm">
                            Marchează ca citit
                        </button>
                    </div>
                    <div v-else class="pt-1">
                        <span class="text-sm italic">Status: {{ notification.status }}</span>
                    </div>
                </div>

            </li>
        </ul>
    </div>
    <div v-else class="text-center mt-10">
        <img src="@/assets/emptyState/EmptyStateNotifications.svg" alt="No projects" class="mx-auto max-h-[28rem] mb-6">
        <p class="text-xl font-bold text-brand-olivine">Nu ai nicio notificare!</p>
    </div>
</template>