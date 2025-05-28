import { defineStore } from 'pinia';
import { useNotificationStore } from './notification';
import axios from "axios";

import { useUserStore } from './user';
import { books } from '@/constants/bibleBooks';

async function sendCommentNotification(commentData) {
    const { projectId, fragmentId, senderId, senderEmail } = commentData;
    const projectStore = useProjectStore();
    const notificationStore = useNotificationStore();

    const project = projectStore.projects.find(p => p.id === projectId);
    if (!project) {
        console.warn('sendCommentNotification: Project not found for projectId:', projectId);
        return;
    }
    const projectTitle = project.title;

    const receiverIds = project.collaborators
        ?.filter(c => c && typeof c.id !== 'undefined')
        .map(c => c.id)
        .filter(id => id !== senderId) || [];

    if (receiverIds.length > 0) {
        await notificationStore.sendNotification({
            receiverIds: receiverIds,
            senderId: senderId,
            senderEmail: senderEmail,
            projectId: projectId,
            projectTitle: projectTitle,
            type: "comment",
            status: "pending",
            fragmentId: fragmentId,
            message: `Utilizatorul ${senderEmail} a adăugat/modificat un comentariu public la proiectul "${projectTitle}".`,
        });
        console.log(`Notification sent for comment on project "${projectTitle}" to ${receiverIds.length} users.`);
    } else {
        console.log("No other collaborators to notify for comment.");
    }
}

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
            const userStore = useUserStore();
            try {
                const response = await axios.post("http://localhost:3000/comments", {
                    fragmentId,
                    content,
                    status,
                    userId: userStore.user.id,
                    userEmail: userStore.user.email,
                }, {
                    headers: { "Content-Type": "application/json" }
                });

                const newComment = response.data;

                if (newComment.status === "public") {
                    await sendCommentNotification({
                        projectId: projectId,
                        fragmentId: newComment.fragmentId,
                        senderId: userStore.user.id,
                        senderEmail: userStore.user.email
                    });
                }
            } catch (error) {
                console.error("Error adding comment:", error);
                throw error;
            }
        },

        async deleteProject(projectId, emittingUserId) {
            const projectIndex = this.projects.findIndex((project) => project.id === projectId);
            let originalProjects = [...this.projects];

            if (projectIndex !== -1) {
                this.projects.splice(projectIndex, 1);
            }

            try {
                await axios.delete("http://localhost:3000/projects", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: { projectId, emittingUserId }
                });
            } catch (error) {
                this.projects = originalProjects;
                console.error("Error deleting project via API:", error);
                throw error;
            }
        },

        removeProjectById(projectId) {
            const projectIndex = this.projects.findIndex((project) => project.id === projectId);
            if (projectIndex !== -1) {
                this.projects.splice(projectIndex, 1);
            }
        },
        async deleteComment(commentId, fragmentIdPassedFromComponent) {
            try {
                await axios.delete("http://localhost:3000/comments", {
                    headers: { "Content-Type": "application/json" },
                    data: { commentId }
                });

                let foundAndRemoved = false;
                for (const fragmentGroup of this.fragments) {
                    let fragsArray = [];
                    if (fragmentGroup.bibleFragments && fragmentGroup.bibleFragments.length > 0) {
                        fragsArray = fragmentGroup.bibleFragments;
                    } else if (fragmentGroup.fragments && fragmentGroup.fragments.length > 0) {
                        fragsArray = fragmentGroup.fragments;
                    }

                    const fragment = fragsArray.find(f => f.id === fragmentIdPassedFromComponent);
                    if (fragment && fragment.comments) {
                        const index = fragment.comments.findIndex(c => c.id === commentId);
                        if (index !== -1) {
                            fragment.comments.splice(index, 1);
                            foundAndRemoved = true;
                            break;
                        }
                    }
                }
                if (!foundAndRemoved) {
                    console.warn(`Store: Comment ${commentId} in fragment ${fragmentIdPassedFromComponent} not found for local removal.`);
                }
            } catch (error) {
                console.error("Error deleting comment in store:", error);
                throw error;
            }
        },

        async updateComment(commentId, newContent) {
            try {
                const response = await axios.post("http://localhost:3000/comments/update", {
                    commentId,
                    content: newContent
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                const updatedCommentFromAPI = response.data;

                let foundAndUpdateInStore = false;
                for (const fragmentGroup of this.fragments) {
                    let fragsArray = [];
                    if (fragmentGroup.bibleFragments && fragmentGroup.bibleFragments.length > 0) {
                        fragsArray = fragmentGroup.bibleFragments;
                    } else if (fragmentGroup.fragments && fragmentGroup.fragments.length > 0) {
                        fragsArray = fragmentGroup.fragments;
                    }

                    for (const fragment of fragsArray) {
                        if (fragment.comments) {
                            const commentIndex = fragment.comments.findIndex(c => c.id === commentId);
                            if (commentIndex !== -1) {
                                fragment.comments[commentIndex] = { ...fragment.comments[commentIndex], ...updatedCommentFromAPI };
                                foundAndUpdateInStore = true;
                                break;
                            }
                        }
                    }
                    if (foundAndUpdateInStore) {
                        break;
                    }
                }
                if (!foundAndUpdateInStore) {
                    console.warn(`Store: Comment ${commentId} not found for local update after API success.`);
                }
                return updatedCommentFromAPI;
            } catch (error) {
                console.error("Error updating comment in store (POST):", error);
                throw error;
            }
        },

        async toggleCommentStatus(commentId) {
            const userStore = useUserStore();

            try {
                const response = await axios.post("http://localhost:3000/comments/toggle-status", {
                    commentId
                }, {
                    headers: { "Content-Type": "application/json" }
                });

                const updatedComment = response.data;

                if (!updatedComment || typeof updatedComment.status === 'undefined' || typeof updatedComment.fragmentId === 'undefined') {
                    console.error("toggleCommentStatus: API did not return a valid updated comment with status and fragmentId.");
                    return;
                }

                let foundAndUpdateInStore = false;
                for (const fragmentGroup of this.fragments) {
                    let fragsArray = fragmentGroup.bibleFragments || fragmentGroup.fragments || [];
                    for (const fragment of fragsArray) {
                        if (fragment.comments) {
                            const commentIndex = fragment.comments.findIndex(c => c.id === updatedComment.id);
                            if (commentIndex !== -1) {
                                fragment.comments[commentIndex] = { ...fragment.comments[commentIndex], ...updatedComment };
                                foundAndUpdateInStore = true;
                                break;
                            }
                        }
                    }
                    if (foundAndUpdateInStore) break;
                }

                if (updatedComment.status === "public") {
                    let finalProjectId = null;
                    if (updatedComment.fragment && updatedComment.fragment.projectId) {
                        finalProjectId = updatedComment.fragment.projectId;
                    } else {
                        console.warn("toggleCommentStatus: projectId not directly available on updatedComment. Attempting to find it.");
                        outerLoop: for (const fg of this.fragments) {
                            const frags = fg.bibleFragments || fg.fragments || [];
                            for (const frag of frags) {
                                if (frag.id === updatedComment.fragmentId) {
                                    finalProjectId = fg.id; // fg.id este projectId-ul grupului
                                    break outerLoop;
                                }
                            }
                        }
                    }

                    if (finalProjectId) {
                        await sendCommentNotification({
                            projectId: finalProjectId,
                            fragmentId: updatedComment.fragmentId,
                            senderId: userStore.user.id,
                            senderEmail: userStore.user.email
                        });
                    } else {
                        console.error("toggleCommentStatus: Could not determine projectId for notification.");
                    }
                }
            } catch (error) {
                console.error("Error toggling comment status:", error);
                throw error;
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
