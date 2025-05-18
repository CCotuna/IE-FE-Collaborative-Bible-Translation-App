// /store/notification.js
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useProjectStore } from './project'
import axios from 'axios'
import socket from '@/plugins/socket'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: []
    }),

    actions: {
        async fetchNotifications() {
            const user = useUserStore().user;
            if (!user?.id) return;

            try {
                const response = await axios.get(`http://localhost:3000/notifications`, {
                    params: { userId: user.id }
                });
                this.notifications = response.data;
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        },

        async sendNotification(notification) {
            const userStore = useUserStore();

            const receiverId = await userStore.getUserByEmail(notification.email);

            if (!receiverId) {
                console.error('Receiver ID not found');
                return;
            }

            try {
                const response = await axios.post(`http://localhost:3000/notifications`, {
                    fromUserId: notification.senderId,
                    fromUserEmail: notification.senderEmail,
                    toUserId: receiverId,
                    projectId: notification.projectId,
                    projectTitle: notification.projectTitle,
                    type: notification.type,
                    status: notification.status
                });

                return response.data;

            } catch (error) {
                console.error('Error sending notification:', error);
            }
        },

        async markAsAccepted(notificationId) {
            try {
                await axios.patch(`http://localhost:3000/notifications/accept/${notificationId}`, {
                    status: 'accepted'
                });
                const notification = this.notifications.find(n => n.id === notificationId);
                if (notification) notification.status = 'accepted';
            } catch (error) {
                console.error("Error marking notification as read:", error);
            }
        },

        async markAsDeclined(notificationId) {
            try {
                await axios.patch(`http://localhost:3000/notifications/decline/${notificationId}`, {
                    status: 'declined'
                });
                const notification = this.notifications.find(n => n.id === notificationId);
                if (notification) notification.status = 'declined';
            } catch (error) {
                console.error("Error marking notification as read:", error);
            }
        },

        receiveNotification(notification) {
            const alreadyExists = this.notifications.some(n => n.id === notification.id);
            if (!alreadyExists) {
                this.notifications.unshift(notification);
            }
        },

        async acceptInvitation(notificationId, userId, projectId) {
            const projectStore = useProjectStore();
            const userStore = useUserStore();

            const user = await userStore.getUserById(userId);

            try {
                await projectStore.addCollaborator(user.email, projectId);
                await this.markAsAccepted(notificationId);
                this.fetchNotifications();
            } catch (error) {
                console.error("Error adding collaborator:", error);
                throw new Error("Failed to add collaborator.");
            }
        },

        async declineInvitation(notificationId) {
            try {
                await this.markAsDeclined(notificationId);
                this.fetchNotifications();
            } catch (error) {
                console.error("Error declining invitation:", error);
                throw new Error("Failed to decline invitation.");
            }
        },

        listenForNotifications() {
            socket.on('newNotification', (newNotification) => {
                this.receiveNotification(newNotification); 
            });
        }
    }
})
