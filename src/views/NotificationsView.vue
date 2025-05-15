<script setup>
import { onMounted, computed } from 'vue'
import { useNotificationStore } from '@/store/notification'
import { useProjectStore } from '@/store/project'

import { timeSinceCreated } from '@/utils/timeSinceCreated'

const projectStore = useProjectStore()
const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications)

const acceptInvitation = async (notificationId, userId, projectId) => {
    try {
        await notificationStore.acceptInvitation(notificationId, userId, projectId)
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

onMounted(() => {
    notificationStore.listenForNotifications();
    notificationStore.fetchNotifications();
})

</script>

<template>
    <!-- <div>
        <ul>
            <li v-for="notification in notifications" :key="notification.id">
                <div v-if="notification.type === 'invitation'">
                    <p><strong>{{ notification.fromUserEmail }}</strong></p>
                    <p>{{ notification.type }}</p>
                    <p>{{ notification.status }}</p>
                    <p>{{ notification }}</p>

                    <button @click="respondToInvitation(notification.toUserId, notification.projectId)"
                        class="bg-green-500 text-white px-4 py-2 rounded">
                        Accept
                    </button>
                    <button @click="respondToInvitation(notification.id, false)"
                        class="bg-red-500 text-white px-4 py-2 rounded">
                        Decline
                    </button>
                </div>
            </li>
        </ul>
    </div> -->

    <div v-if="notifications.length > 0">
        <ul>
            <li v-for="notification in notifications" :key="notification.id"
                class="flex flex-col border-b space-y-5 p-6"
                :class="notification.status === 'pending' ? 'bg-brand-cornsilk' : 'bg-white'">
                <!-- <div class="flex flex-col text-xl">
                <span>{{ notification.projectTitle }}</span>
                <span>{{ notification.fromUserEmail }}</span>
            </div> -->
                <div class="flex flex-col space-y-2">
                    <span class="text-xl">{{ notification.projectTitle }}</span>
                    <div>Utilizatorul <span>{{ notification.fromUserEmail }}</span> te-a invitat sa devii colaborator la
                        acest proiect.</div>
                    <div class="flex space-x-2 items-center">
                        <div
                            class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden border border-brand-olivine bg-brand-custom-white rounded-full">
                            <span class="font-medium text-brand-olivine">DC</span>
                        </div>
                        <span class="text-gray-400">{{ timeSinceCreated(notification.createdAt) }}</span>
                    </div>
                    <div v-if="notification.status === 'pending'" class="flex space-x-3">
                        <button
                            @click="acceptInvitation(notification.id, notification.toUserId, notification.projectId)"
                            class="bg-green-600 text-white px-4 py-2 rounded-md">
                            Accept
                        </button>
                        <button @click="declineInvitation(notification.id)"
                            class="bg-red-600 text-white px-4 py-2 rounded-md">
                            Decline
                        </button>
                    </div>
                    <div v-else>
                        <span class="text-sm">Status: {{ notification.status }}</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <div v-else class="text-center mt-10">
        <img src="@/assets/emptyState/EmptyStateNotifications.svg" alt="No projects" class="mx-auto mb-6">
        <p class="text-xl font-bold text-brand-olivine">You have no notifications</p>
    </div>

</template>
