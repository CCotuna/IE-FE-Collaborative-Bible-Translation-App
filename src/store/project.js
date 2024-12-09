import { defineStore } from 'pinia'

export const useProjectStore = defineStore("project", {
    state: () => {
        return {
            projects: [
                {
                    id: 1,
                    name: "Traducere 2024 - DC 1931 ",
                    description: "Description of Project 1",
                    has_updates: true,
                    type: "Biblia",
                    last_update: "2021-01-01"
                },
                {
                    id: 2,
                    name: "Scrisori spirituale (fragment) - Fenelon",
                    description: "Description of Project 2",
                    has_updates: false,
                    type: null,
                    last_update: "2021-01-01"
                },
                {
                    id: 3,
                    name: "Traducere 2023 - BTF  ",
                    description: "Description of Project 3",
                    has_updates: true,
                    type: "Imnuri crestine",
                    last_update: "2021-01-01"
                },
                {
                    id: 4,
                    name: "Traducere 2023 - BTF  ",
                    description: "Description of Project 3",
                    has_updates: false,
                    type: "Biblia",
                    last_update: "2021-01-01"
                }
            ]
        }
    }
})