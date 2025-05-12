<script setup>
import { onMounted, computed } from 'vue'
import { useNotificationStore } from '@/store/notification'

const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications)

const respondToInvitation = async (userId, projectId) => {
    try {
        await notificationStore.respondToInvitation(userId, projectId)
        notificationStore.fetchNotifications()
    } catch (error) {
        console.error('Error responding to invitation:', error)
    }
}

onMounted(() => {
    notificationStore.listenForNotifications(); 
    notificationStore.fetchNotifications(); 
})
</script>

<template>
    <div>
        <!-- {{ notifications }} -->
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
    </div>
</template>

