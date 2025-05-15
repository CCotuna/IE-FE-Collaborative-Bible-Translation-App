import { defineStore } from 'pinia';
import { useBibleProjectStore } from './bibleProject';
import axios from "axios";

import { useUserStore } from './user';

export const useProjectStore = defineStore("project", {
    state: () => ({
        projects: [],
    }),
    actions: {
        async fetchProjects() {
            const userStorage = useUserStore();

            console.log("User storage:", userStorage.user);
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

        testBibleProject() {
            const bibleProjectStore = useBibleProjectStore();
            const bibleProject = bibleProjectStore.bibleProject;

            console.log("In PROJECT Store, Bible Project:", bibleProject);
            return bibleProject;
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

        deleteProject(projectId) {
            const projectIndex = this.projects.findIndex((project) => project.id === projectId);
            this.projects.splice(projectIndex, 1);

            console.log("In PROJECT Store, deleting project with ID:", projectId);
            axios.delete("http://localhost:3000/projects", {
                headers: {
                    "Content-Type": "application/json",
                },
                data: { projectId }
            })
        },

        async addComment({ fragmentId, content, status }) {
            const userStorage = useUserStore();

            try {
                const response = await axios.post("http://localhost:3000/comments", {
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

                const newComment = response.data;
                console.log("Comment added:", newComment);

            } catch (error) {
                console.error("Error adding comment:", error);
            }
        },

        async deleteComment(commentId) {
            try {
                for (const project of this.projects) {
                    for (const fragment of project.fragments) {
                        const commentIndex = fragment.comments?.findIndex(c => c.id === commentId);
                        if (commentIndex !== -1) {
                            fragment.comments.splice(commentIndex, 1);
                            break;
                        }
                    }
                }
                const response = await axios.delete("http://localhost:3000/comments", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: { commentId }
                });

                console.log("Comment deleted:", response.data);

            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        },

        async toggleCommentStatus(commentId) {
            try {
                const response = await axios.post("http://localhost:3000/comments/toggle-status", {
                    commentId
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                const updatedComment = response.data;
                console.log("Comment status toggled:", updatedComment);

            } catch (error) {
                console.error("Error toggling comment status:", error);
            }
        },

        async addCollaborator(email, projectId) {
            try {
                console.log("Adding collaborator in PROJECT STORE:", email, projectId);
                const response = await axios.post("http://localhost:3000/projects/add-collaborator", {
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
