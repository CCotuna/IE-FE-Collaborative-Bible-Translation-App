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
                console.log('Fetched notifications:', this.notifications);
                console.log("repsonse", response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        },

        async sendNotification(notification) {
            const userStore = useUserStore();

            const receiverId = await userStore.getUserByEmail(notification.email);

            console.log('Receiver ID:', receiverId);
            console.log('Notification:', notification);
            console.log("Notification receiver", notification.email);
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
                    type: notification.type,
                    status: notification.status
                });

                return response.data;

            } catch (error) {
                console.error('Error sending notification:', error);
            }
        },

        async markAsRead(notificationId) {
            try {
                await axios.patch(`http://localhost:3000/notifications/${notificationId}`, {
                    status: 'read'
                });
                const notification = this.notifications.find(n => n.id === notificationId);
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

        async respondToInvitation(userId, projectId) {
            const projectStore = useProjectStore();
            const userStore = useUserStore();

            const user = await userStore.getUserById(userId);

            console.log("User email:", user);
            console.log("Project ID in STORE:", projectId);
            try {
                await projectStore.addCollaborator(user.email, projectId);

            } catch (error) {
                console.error("Error adding collaborator:", error);
                throw new Error("Failed to add collaborator.");
            }


            // try {
            //     await axios.post(`http://localhost:3000/notifications/respond`, {
            //         notificationId,
            //         accepted
            //     });

            //     const notif = this.notifications.find(n => n.id === notificationId);
            //     if (notif) notif.status = accepted ? "accepted" : "declined";

            //     // Poți adăuga colaborator aici dacă acceptă
            // } catch (error) {
            //     console.error("Error responding to invitation:", error);
            // }
        },

        listenForNotifications() {
            socket.on('newNotification', (newNotification) => {
                console.log("Received new notification:", newNotification);
                this.receiveNotification(newNotification); 
            });
        }
    }
})
