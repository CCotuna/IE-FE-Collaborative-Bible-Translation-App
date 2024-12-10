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
                    descriptions: [
                        {
                            verseNumber: 1,
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod non lectus eu vestibulum. Nunc bibendum placerat ante, eget interdum eros placerat sed. Integer non dictum lacus. Praesent vel ullamcorpe",
                            noAnnotations: 5,
                            annotations: [
                                {
                                    id: 0,
                                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod non lectus eu vestibulum. Nunc bibendum placerat ante, eget interdum eros placerat sed. Integer non dictum lacus. Praesent vel ullamcorpe",
                                },
                                {
                                    id: 1,
                                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod non lectus eu vestibulum. Nunc bibendum placerat ante, eget interdum eros placerat sed. Integer non dictum lacus. Praesent vel ullamcorpe",
                                },
                                {
                                    id: 2,
                                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod non lectus eu vestibulum. Nunc bibendum placerat ante, eget interdum eros placerat sed. Integer non dictum lacus. Praesent vel ullamcorpe",
                                }
                            ]
                        },
                        {
                            verseNumber: 2,
                            content: "r velit, in convallis mi. Integer venenatis pharetra magna, in suscipit nisl dapibus id. Praesent sit amet dignissim est. Nullam faucibus placerat magna, vel pellentesque dolor suscipit ut. Nulla facilisis euismod massa, ut posu",
                            noAnnotations: 3,
                            annotations: [
                                {
                                    id: 0,
                                    content: "r velit, in convallis mi. Integer venenatis pharetra magna, in suscipit nisl dapibus id. Praesent sit amet dignissim est. Nullam faucibus placerat magna, vel pellentesque dolor suscipit ut. Nulla facilisis euismod massa, ut posu",
                                }
                            ]
                        }
                    ],
                    has_updates: true,
                    type: "Biblia",
                    last_update: formatDateTime("2021-01-01T10:15:30")
                },
                // {
                //     id: 2,
                //     name: "Scrisori spirituale (fragment) - Fenelon",
                //     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod non lectus eu vestibulum. Nunc bibendum placerat ante, eget interdum eros placerat sed. Integer non dictum lacus. Praesent vel ullamcorper velit, in convallis mi. Integer venenatis pharetra magna, in suscipit nisl dapibus id. Praesent sit amet dignissim est. Nullam faucibus placerat magna, vel pellentesque dolor suscipit ut. Nulla facilisis euismod massa, ut posuere lectus facilisis ac. ",
                //     noAnnotations: 3,
                //     has_updates: false,
                //     type: null,
                //     last_update: formatDateTime("2024-10-10T14:05:45")
                // },
                // {
                //     id: 3,
                //     name: "Traducere 2023 - BTF  ",
                //     description: "Description of Project 3",
                //     noAnnotations: 5,
                //     has_updates: true,
                //     type: "Imnuri crestine",
                //     last_update: formatDateTime("2022-01-01T09:20:00")
                // },
                // {
                //     id: 4,
                //     name: "Traducere 2023 - BTF  ",
                //     description: "Description of Project 3",
                //     noAnnotations: 5,
                //     has_updates: false,
                //     type: "Biblia",
                //     last_update: formatDateTime("2021-01-01T08:45:30") 
                // }
            ]
        }
    },
    actions: {
        addProject(newProject) {
          newProject.id = this.projects.length + 1;
          newProject.last_update = formatDateTime(new Date());
          this.projects.push(newProject);
        },
        deleteProject(projectId) {
            this.projects = this.projects.filter(project => project.id !== projectId);
        }
    }
})
