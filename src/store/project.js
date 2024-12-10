import { defineStore } from 'pinia'

const formatDateTime = (date) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    };
    
    // Convertim data într-un format standard ISO 8601
    const isoDate = new Date(date).toISOString();

    return isoDate;
}

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
                    last_update: formatDateTime("2021-01-01T10:15:30")
                },
                {
                    id: 2,
                    name: "Scrisori spirituale (fragment) - Fenelon",
                    description: "Description of Project 2",
                    has_updates: false,
                    type: null,
                    last_update: formatDateTime("2024-10-10T14:05:45")
                },
                {
                    id: 3,
                    name: "Traducere 2023 - BTF  ",
                    description: "Description of Project 3",
                    has_updates: true,
                    type: "Imnuri crestine",
                    last_update: formatDateTime("2022-01-01T09:20:00")
                },
                {
                    id: 4,
                    name: "Traducere 2023 - BTF  ",
                    description: "Description of Project 3",
                    has_updates: false,
                    type: "Biblia",
                    last_update: formatDateTime("2021-01-01T08:45:30") 
                }
            ]
        }
    },
    actions: {
        addProject(newProject) {
          newProject.id = this.projects.length + 1;
          newProject.last_update = formatDateTime(new Date());
          this.projects.push(newProject);
        }
    }
})
