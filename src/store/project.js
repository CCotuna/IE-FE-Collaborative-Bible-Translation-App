import { defineStore } from 'pinia';
import axios from "axios";

import { useUserStore } from './user';

export const useProjectStore = defineStore("project", {
    state: () => ({
        projects: [],
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

        async addProject(project) {
            const userStorage = useUserStore();
            const user = userStorage.user;

            const newProject = {
                title: project.title,
                text: project.text,
                type: project.type,
                hasUpdates: false,
                userId: user.id
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

                for (const project of this.projects) {
                    const fragment = project.fragments?.find(f => f.id === fragmentId);
                    if (fragment) {
                        if (!fragment.comments) {
                            fragment.comments = [];
                        }

                        fragment.comments.push(newComment);
                        break;
                    }
                }

            } catch (error) {
                console.error("Error adding comment:", error);
            }
        },

        async addCollaborator(email, projectId) {
            try {
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
