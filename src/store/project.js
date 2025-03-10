import { defineStore } from 'pinia';
import axios from "axios";

import { useUserStore } from './user';

const formatDateTime = (date) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    const isoDate = new Date(date).toISOString();
    return isoDate;
};

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
                console.log("No active user, not fetching projects.");
                this.projects = [];
                return;
            }

            console.log(userStorage.user, "user storage")

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
                has_updates: false,
                userId: user.id
            };

            this.projects.push(newProject);

            const response  = await axios.post("http://localhost:3000/projects", newProject, {
                headers: {
                    "Content-Type": "application/json",
                }
            })

            this.projects[this.projects.length - 1].id = response.data.id;
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
