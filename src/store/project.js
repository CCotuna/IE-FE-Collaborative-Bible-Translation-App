import { defineStore } from 'pinia';
import axios from "axios";

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
            const projects = await axios.get("http://localhost:3000/projects");
            this.projects = projects.data
            // console.log("Functioneaza")
        },

        async addProject(project) {
            const text = project.content
                .split('\n')
                .filter(line => line.trim() !== '')
                .map((line) => ({
                    verseNumber: project.content.length + 1,
                    content: line.trim(),
                    annotations: [],
                }));

            const newProject = {
                title: project.title,
                text,
                has_updates: false,
                type: project.type || "Custom",
            };

            console.log(newProject, "new project");

            this.projects.push(newProject);

            const response  = await axios.post("http://localhost:3000/projects", newProject, {
                headers: {
                    "Content-Type": "application/json",
                }
            })

            console.log(response.data, "response data si ersponse id", response.data.id);

            this.projects[this.projects.length - 1].id = response.data.id;
        },

        deleteProject(projectId) {
            this.projects = this.projects.filter((project) => project.id !== projectId);
        },
    },
});
