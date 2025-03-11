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
            const username = userStorage.user.username;

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
            // const text = project.text
            //     .split('\n')
            //     .filter(line => line.trim() !== '')
            //     .map((line) => ({
            //         verseNumber: project.content.length + 1,
            //         content: line.trim(),
            //         annotations: [],
            //     }));

            const userStorage = useUserStore();
            const user = userStorage.user;

            const newProject = {
                title: project.title,
                text: project.text,
                type: project.type || "Custom",
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

    },
});
