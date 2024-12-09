import { defineStore } from 'pinia'

export const useProjectStore = defineStore("project", {
    state: () => {
        return {
            projects: [
                {
                    id: 1,
                    name: "Project 1",
                    description: "Description of Project 1"
                },
                {
                    id: 2,
                    name: "Project 2",
                    description: "Description of Project 2"
                },
                {
                    id: 3,
                    name: "Project 3",
                    description: "Description of Project 3"
                }
            ]
        }
    }
})