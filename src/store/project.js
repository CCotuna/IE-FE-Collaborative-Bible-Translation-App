import { defineStore } from 'pinia';

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
        projects: [
            {
                id: 1,
                name: "Traducere 2024 - DC 1931",
                descriptions: [
                    {
                        verseNumber: 1,
                        content: "Începutul înțelepciunii este frica de Domnul. Ea este temelia vieții spirituale și sociale.",
                        noAnnotations: 3,
                        annotations: [
                            {
                                id: 0,
                                content: "Această frază subliniază importanța relației cu Dumnezeu ca punct de plecare în viață.",
                            },
                            {
                                id: 1,
                                content: "Se poate interpreta și în sens practic, referindu-se la moralitate și etică.",
                            },
                            {
                                id: 2,
                                content: "Versetul este adesea folosit în predici despre începutul credinței.",
                            },
                        ],
                    },
                    {
                        verseNumber: 2,
                        content: "Cuvintele înțeleptului sunt un izvor de viață pentru cei ce le primesc cu smerenie.",
                        noAnnotations: 2,
                        annotations: [
                            {
                                id: 0,
                                content: "Conceptul de 'izvor de viață' este o metaforă pentru har și binecuvântare.",
                            },
                            {
                                id: 1,
                                content: "Aceasta arată importanța smereniei în creșterea spirituală.",
                            },
                        ],
                    },
                ],
                has_updates: true,
                type: "Biblia",
                last_update: formatDateTime("2024-10-01T10:15:30"),
            },
            {
                id: 2,
                name: "Scrisori spirituale - Fenelon",
                descriptions: [
                    {
                        verseNumber: 1,
                        content: "Îți scriu pentru a împărtăși gândurile mele despre pacea sufletului și căutarea liniștii.",
                        noAnnotations: 1,
                        annotations: [
                            {
                                id: 0,
                                content: "Tema centrală este pacea sufletească, un concept frecvent în scrierile lui Fenelon.",
                            },
                        ],
                    },
                    {
                        verseNumber: 2,
                        content: "Viața noastră interioară depinde de capacitatea noastră de a ne elibera de griji.",
                        noAnnotations: 2,
                        annotations: [
                            {
                                id: 0,
                                content: "Fenelon vorbește despre detașare ca practică spirituală.",
                            },
                            {
                                id: 1,
                                content: "Aceasta poate fi legată de rugăciunea zilnică și meditație.",
                            },
                        ],
                    },
                ],
                has_updates: false,
                type: "Epistole",
                last_update: formatDateTime("2024-09-25T12:30:45"),
            },
            {
                id: 3,
                name: "Traducere 2023 - Imnuri creștine",
                descriptions: [
                    {
                        verseNumber: 1,
                        content: "Domnul este tăria mea și scutul meu. Inima mea se încrede în El, și sunt ajutat.",
                        noAnnotations: 4,
                        annotations: [
                            {
                                id: 0,
                                content: "Versul reflectă dependența de Dumnezeu în toate aspectele vieții.",
                            },
                            {
                                id: 1,
                                content: "Expresia 'scutul meu' simbolizează protecția divină.",
                            },
                            {
                                id: 2,
                                content: "Acesta este un imn comun în momentele de încercare.",
                            },
                            {
                                id: 3,
                                content: "Este adesea folosit în slujbe de mulțumire.",
                            },
                        ],
                    },
                    {
                        verseNumber: 2,
                        content: "Lăudați pe Domnul, căci bunătatea Lui ține în veci.",
                        noAnnotations: 2,
                        annotations: [
                            {
                                id: 0,
                                content: "Tema este bunătatea constantă și eternă a lui Dumnezeu.",
                            },
                            {
                                id: 1,
                                content: "Este o chemare la închinare colectivă.",
                            },
                        ],
                    },
                ],
                has_updates: true,
                type: "Imnuri",
                last_update: formatDateTime("2023-12-15T09:20:00"),
            },
            {
                id: 4,
                name: "Comentarii teologice - Volumul 1",
                descriptions: [
                    {
                        verseNumber: 1,
                        content: "Interpretarea textului sacru necesită înțelegerea contextului cultural și istoric.",
                        noAnnotations: 3,
                        annotations: [
                            {
                                id: 0,
                                content: "Autorul subliniază importanța contextului pentru interpretare.",
                            },
                            {
                                id: 1,
                                content: "Acest aspect este central în exegeza modernă.",
                            },
                            {
                                id: 2,
                                content: "Se aplică în special textelor din Vechiul Testament.",
                            },
                        ],
                    },
                    {
                        verseNumber: 2,
                        content: "Fiecare text oferă multiple niveluri de semnificație care pot fi explorate.",
                        noAnnotations: 2,
                        annotations: [
                            {
                                id: 0,
                                content: "Nivelurile includ literal, alegoric, moral și anagogic.",
                            },
                            {
                                id: 1,
                                content: "Aceasta este o abordare hermeneutică tradițională.",
                            },
                        ],
                    },
                ],
                has_updates: false,
                type: "Comentarii",
                last_update: formatDateTime("2022-11-20T08:45:30"),
            },
        ],
    }),
    actions: {
        addProject(project) {
            const descriptions = project.bbdescriptions
                .split('\n')
                .filter(line => line.trim() !== '')
                .map((line) => ({
                    verseNumber: project.descriptions.length + 1,
                    content: line.trim(),
                    annotations: [],
                }));

            const newProject = {
                id: this.projects.length + 1,
                name: project.name,
                descriptions,
                has_updates: false,
                type: project.type || "Custom",
                last_update: formatDateTime(new Date()),
            };

            this.projects.push(newProject);
        },

        deleteProject(projectId) {
            this.projects = this.projects.filter((project) => project.id !== projectId);
        },
    },
});
