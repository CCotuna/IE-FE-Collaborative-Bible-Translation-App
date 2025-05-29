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
            let payload = {
                fromUserId: notification.senderId,
                fromUserEmail: notification.senderEmail,
                projectId: notification.projectId,
                projectTitle: notification.projectTitle,
                type: notification.type,
                status: notification.status,
                ...(notification.fragmentId != null && { fragmentId: notification.fragmentId }),
                ...(notification.message != null && { message: notification.message }),
            };

            try {
                if (notification.email) {
                    const receiverUser = await userStore.getUserByEmail(notification.email);
                    payload.toUserId = receiverUser;
                } else if (notification.receiverIds && notification.receiverIds.length > 0) {
                    payload.toUserIds = notification.receiverIds;
                } else {
                    console.error('No receiver specified (email or receiverIds)');
                    return;
                }

                const response = await axios.post(`http://localhost:3000/notifications`, payload);
                console.log('Notification(s) sent successfully:', response.data);
                return response.data;

            } catch (error) {
                console.error('Error sending notification:', error);
                throw error;
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

        async markAsRead(notificationId) {
            try {
                await axios.patch(`http://localhost:3000/notifications/read/${notificationId}`, {
                    status: 'read'
                });
                const notification = this.notifications.find(n => n.id === notificationId);
                console.log("Notification marked as read:", notification);
                if (notification) notification.status = 'read';
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
        },

        hasUnreadUpdates(projectId, userId) {
            console.log("Checking for unread updates in notifications:", this.notifications);

            return this.notifications.some(notification =>
                notification.projectId === projectId &&
                notification.toUserId === userId &&
                notification.status === 'unread'
            );
        }
    }
})
