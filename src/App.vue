<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Navigation from './components/layout/navigation/Navigation.vue'
import ToastContainer from './components/common/ToastContainer.vue'
import { useUserStore } from '@/store/user'
import { useNotificationStore } from './store/notification'

const userStore = useUserStore()
const notificationStore = useNotificationStore()

onMounted(async () => {
    userStore.checkAuth()
    await notificationStore.fetchNotifications();
    notificationStore.listenForNotifications();
})
</script>

<template>
    <div>
        <Navigation />
        <RouterView />

        <ToastContainer />
    </div>
</template>

<style scoped></style>
