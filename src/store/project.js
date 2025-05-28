import { defineStore } from 'pinia';
import { useNotificationStore } from './notification';
import axios from "axios";

import { useUserStore } from './user';
import { books } from '@/constants/bibleBooks';

export const useProjectStore = defineStore("project", {
    state: () => ({
        projects: [],
        books: [],
        chapters: [],
        fragments: [],
    }),
    actions: {
        async fetchProjects() {
            const userStorage = useUserStore();

            const userId = userStorage.user.id;

            if (!userId) {
                this.projects = [];
                return;
            }

            try {
                const projects = await axios.get("http://localhost:3000/projects", {
                    params: { userId }
                });

                this.projects = projects.data;
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        },

        fetchProjectTitle(projectId) {
            const project = this.projects.find(p => p.id === projectId);
            if (project) {
                return project.title;
            } else {
                console.error("Project not found in store");
                return null;
            }
        },

        async fetchProjectById(projectId, userId) {
            const existing = this.projects.find(p => p.id === projectId);
            if (existing) return existing;

            try {
                const response = await axios.get("http://localhost:3000/projects/getProjectById", {
                    params: { projectId, userId }
                });

                if (response.data) {
                    this.projects.push(response.data);
                    return response.data;
                } else {
                    return null;
                }
            } catch (error) {
                console.error("Error fetching project:", error);
                return null;
            }
        },

        async fetchProjectBibleBooks(projectId) {
            try {
                const response = await axios.get(`http://localhost:3000/projects/biblebooks/${projectId}/books`);

                const existing = this.books.find(b => b.id === projectId);
                if (existing) {
                    existing.bibleBooks = response.data;
                } else {
                    this.books.push({
                        id: projectId,
                        bibleBooks: response.data,
                    });
                }

            } catch (error) {
                console.error(`Error fetching Bible Books for project ${projectId}:`, error);
            }
        },

        async fetchProjectBookChapters(projectId, bookId) {
            try {
                const response = await axios.get(`http://localhost:3000/projects/biblebooks/${bookId}/chapters`);

                const existing = this.chapters.find(c => c.id === projectId);
                if (existing) {
                    existing.bibleChapters = response.data;
                } else {
                    this.chapters.push({
                        id: projectId,
                        bibleChapters: response.data,
                    });
                }

            } catch (error) {
                console.error(`Error fetching Bible Chapters for project ${projectId}:`, error);
            }
        },

        async fetchProjectFragments(projectId, userId) {
            try {
                const response = await axios.get(`http://localhost:3000/projects/${projectId}/fragments`);

                const existing = this.fragments.find(f => f.id === projectId);
                if (existing) {
                    existing.fragments = response.data;
                } else {
                    this.fragments.push({
                        id: projectId,
                        fragments: response.data,
                    });
                }

            } catch (error) {
                console.error(`Error fetching Fragments for project ${projectId}:`, error);
            }
        },

        async fetchChapterFragments(projectId, chapterId) {
            try {
                const response = await axios.get(`http://localhost:3000/projects/biblechapters/${chapterId}/fragments`);

                const existing = this.fragments.find(f => f.id === projectId);
                if (existing) {
                    existing.bibleFragments = response.data;
                } else {
                    this.fragments.push({
                        id: projectId,
                        bibleFragments: response.data,
                    });
                }

            } catch (error) {
                console.error(`Error fetching Bible Fragments for project ${projectId}:`, error);
            }
        },

        async addProject(project) {
            const userStorage = useUserStore();
            const user = userStorage.user;

            const newProject = {
                title: project.title,
                type: project.type,
                hasUpdates: false,
                userId: user.id,
                ...(project.text != null && { text: project.text }),
                ...(project.version != null && { version: project.version }),
                ...(project.selectedBooks != null && { selectedBooks: project.selectedBooks })
            };

            try {
                const response = await axios.post("http://localhost:3000/projects", newProject, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                this.projects.push({
                    ...newProject,
                    id: response.data.id,
                    createdAt: response.data.createdAt,
                    updatedAt: response.data.updatedAt,
                });

                this.fetchProjects();

            } catch (error) {
                console.error("Error adding project:", error);
            }

        },

        async addComment({ fragmentId, content, status, projectId }) {
            const userStorage = useUserStore();
            const notificationStore = useNotificationStore();

            try {
                await axios.post("http://localhost:3000/comments", {
                    fragmentId,
                    content,
                    status,
                    userId: userStorage.user.id,
                    userEmail: userStorage.user.email,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (status === "public") {
                    const projectWithFragment = this.projects.find(p => p.id === projectId);

                    if (!projectWithFragment) {
                        console.warn('Project not found for projectId:', projectId);
                        return;
                    }
                    const projectTitle = projectWithFragment.title;

                    const receiverIds = projectWithFragment.collaborators
                        ?.map(c => c.id)
                        .filter(id => id !== userStorage.user.id) || [];

                    if (receiverIds.length > 0) {
                        await notificationStore.sendNotification({
                            receiverIds: receiverIds,
                            senderId: userStorage.user.id,
                            senderEmail: userStorage.user.email,
                            projectId: projectId,
                            projectTitle: projectTitle,
                            type: "comment",
                            status: "pending",
                            fragmentId: fragmentId,
                            message: `Utilizatorul ${userStorage.user.email} a adăugat un comentariu nou la proiectul "${projectTitle}".`,
                        });
                    } else {
                        console.log("No other collaborators to notify.");
                    }
                }
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        },

        deleteProject(projectId) {
            const projectIndex = this.projects.findIndex((project) => project.id === projectId);
            this.projects.splice(projectIndex, 1);

            axios.delete("http://localhost:3000/projects", {
                headers: {
                    "Content-Type": "application/json",
                },
                data: { projectId }
            })
        },

        async deleteComment(commentId) {
            try {
                for (const fragmentGroup of this.fragments) {
                    const fragment = fragmentGroup.bibleFragments.find(f => f.comments?.some(c => c.id === commentId));
                    if (fragment) {
                        const index = fragment.comments.findIndex(c => c.id === commentId);
                        if (index !== -1) {
                            fragment.comments.splice(index, 1);
                            break;
                        }
                    }
                }

                await axios.delete("http://localhost:3000/comments", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: { commentId }
                });

                socket.emit("deleteComment", { commentId });

            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        },

        async deleteBibleBook(bookId) {
            const projectId = this.books.find(b => b.bibleBooks.some(bb => bb.id === bookId)).id;

            const bookIndex = this.books.findIndex(b => b.id === projectId);
            if (bookIndex !== -1) {
                this.books[bookIndex].bibleBooks = this.books[bookIndex].bibleBooks.filter(b => b.id !== bookId);
            }

            try {
                await axios.delete("http://localhost:3000/projects/biblebooks", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: { bookId }
                });
                return true;
            } catch (error) {
                console.error("Error deleting Bible Book:", error);
                return false;
            }
        },

        async deleteBibleChapter(chapterId) {
            const chapterContainer = this.chapters.find(c => c.id === this.selectedProjectId);
            if (chapterContainer) {
                chapterContainer.bibleChapters = chapterContainer.bibleChapters.filter(ch => ch.id !== chapterId);
            }

            try {
                await axios.delete("http://localhost:3000/projects/biblechapters", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: { chapterId }
                });
                return true;
            } catch (error) {
                console.error("Error deleting Bible Chapter:", error);
                return false;
            }
        },

        async toggleCommentStatus(commentId) {
            try {
                await axios.post("http://localhost:3000/comments/toggle-status", {
                    commentId
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
            } catch (error) {
                console.error("Error toggling comment status:", error);
            }
        },

        async addCollaborator(email, projectId) {
            try {
                await axios.post("http://localhost:3000/projects/add-collaborator", {
                    email,
                    projectId
                });

                const project = this.projects.find(p => p.id === projectId);
                if (project) {
                    if (!project.collaborators) {
                        project.collaborators = [];
                    }
                    project.collaborators.push({ email });
                }

                this.fetchProjects();
            } catch (error) {
                console.error("Error adding collaborator:", error);
                throw new Error("Failed to add collaborator.");
            }
        },

    },
});
