import { defineStore } from "pinia";

export const useBibleImportStore = defineStore("bibleImport", {
    state: () => ({
        title: "",
        language: "Romana",
        version: "1.0",
        selectedBooks: [], // [{ name: "Geneza", chapters: [{ number: 1, verses: [1,2,3] }] }]
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
        toggleBook(bookName) {
            const index = this.selectedBooks.findIndex(b => b.name === bookName);
            if (index !== -1) {
                this.selectedBooks.splice(index, 1); // Deselectează cartea
            } else {
                this.selectedBooks.push({ name: bookName, chapters: [] });
            }
        },
        toggleChapter(bookName, chapterNumber) {
            const book = this.selectedBooks.find(b => b.name === bookName);
            if (!book) return;

            const chapterIndex = book.chapters.findIndex(c => c.number === chapterNumber);
            if (chapterIndex !== -1) {
                book.chapters.splice(chapterIndex, 1); // Deselectează capitolul
            } else {
                book.chapters.push({ number: chapterNumber, verses: [] });
            }
        },
        toggleVerse(bookName, chapterNumber, verseNumber) {
            const book = this.selectedBooks.find(b => b.name === bookName);
            if (!book) return;

            const chapter = book.chapters.find(c => c.number === chapterNumber);
            if (!chapter) return;

            const verseIndex = chapter.verses.indexOf(verseNumber);
            if (verseIndex !== -1) {
                chapter.verses.splice(verseIndex, 1); // Deselectează versetul
            } else {
                chapter.verses.push(verseNumber);
            }
        }
    }
});
