import { defineStore } from "pinia";
import axios from "axios";
import { useUserStore } from "./user";

export const useBibleImportStore = defineStore("bibleImport", {
    state: () => ({
        title: "",
        language: "Romana",
        version: "1.0",
        selectedBooks: [], // [{ bookId: "genesis", name: "Geneza", chapters: [], selectedChapters: [] }]
        projectId: null,
    }),
    actions: {
        setTitle(title) {
            this.title = title;
        },
        setLanguage(language) {
            this.language = language;
        },
        setVersion(version) {
            this.version = version;
        },
        toggleBook(book) {
            const index = this.selectedBooks.findIndex(b => b.bookId === book.id);
            if (index === -1) {
                this.selectedBooks.push({
                    bookId: book.id,
                    name: book.name,
                    chapters: [],
                    selectedChapters: [],
                });
            } else {
                this.selectedBooks.splice(index, 1);
            }
        },

        toggleChapter(bookName, chapterNumber) {
            const book = this.selectedBooks.find(b => b.name === bookName);
            if (!book) return;

            if (!book.selectedChapters) book.selectedChapters = [];

            const isSelected = book.selectedChapters.some(c => c.number === chapterNumber);
            if (isSelected) {
                book.selectedChapters = book.selectedChapters.filter(c => c.number !== chapterNumber);
            } else {
                book.selectedChapters.push({ number: chapterNumber, verses: [] });
            }
        },

        toggleVerse(bookName, chapterNumber, verseNumber) {
            const book = this.selectedBooks.find(b => b.name === bookName);
            if (!book) return;

            const chapter = book.selectedChapters.find(c => c.number === chapterNumber);
            if (!chapter) return;

            const verseIndex = chapter.verses.indexOf(verseNumber);
            if (verseIndex !== -1) {
                chapter.verses.splice(verseIndex, 1);
            } else {
                chapter.verses.push(verseNumber);
            }
        },
        async createProject() {
            const userStorage = useUserStore();
            const userId = userStorage.user.id;

            if (!userId) {
                console.error("User is not logged in.");
                return;
            }

            const projectData = {
                title: this.title,
                language: this.language,
                version: this.version,
                selectedBooks: this.selectedBooks.map(book => ({
                    bookId: book.bookId,
                    name: book.name,
                    selectedChapters: book.selectedChapters,
                })),
                userId,
            };

            try {
                const response = await axios.post("http://localhost:3000/projects", projectData, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                this.projectId = response.data.id;
            } catch (error) {
                console.error("Error creating project:", error);
            }
        },
    }
});
