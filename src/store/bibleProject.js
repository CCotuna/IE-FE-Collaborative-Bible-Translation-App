import { defineStore } from 'pinia';
import axios from "axios";

import { books as allBibleBooks } from '@/constants/bibleBooks';


export const useBibleProjectStore = defineStore("bibleProject", {
    state: () => ({
        bibleProject: {
            title: null,
            language: "Română",
            version: "Dumitru Cornilescu",
            selectedBooks: [],
            type: "Biblia",
        }
    }),
    actions: {

        async resetBibleProject() {
            this.bibleProject = null;
        },

        getBookName(bookName) {
            if (bookName.startsWith("Book")) {
                return bookName.substring(4).trim();
            }
            return bookName;
        },

        toggleBook(book) {
            const index = this.bibleProject.selectedBooks.findIndex(b => b.name === book.name);
            if (index === -1) {

                this.bibleProject.selectedBooks.push({ ...book, selectedChapters: [] });
            } else {

                this.bibleProject.selectedBooks.splice(index, 1);
            }
        },

        toggleChapter(bookName, chapterNumber) {
            const book = this.bibleProject.selectedBooks.find(b => b.name === bookName);

            if (book) {
                if (!book.selectedChapters) {
                    book.selectedChapters = [];
                }

                const chapterIndex = book.selectedChapters.findIndex(c => c.chapter === chapterNumber);

                if (chapterIndex !== -1) {
                    book.selectedChapters.splice(chapterIndex, 1);
                } else {
                    book.selectedChapters.push({ chapter: chapterNumber, selectedVerses: [] });
                }
            }
        },

        toggleAllChapters(bookToToggle) {
            const book = this.bibleProject.selectedBooks.find(b => b.name === bookToToggle.name);

            if (book) {
                if (!book.selectedChapters) {
                    book.selectedChapters = [];
                }

                const allChaptersCount = book.chapters.length;
                const selectedChaptersCount = book.selectedChapters.length;
                const allSelected = selectedChaptersCount === allChaptersCount;

                if (allSelected) {

                    book.selectedChapters = [];
                } else {

                    book.selectedChapters = book.chapters.map((_, index) => ({ chapter: index + 1, selectedVerses: [] }));
                }
            }
        },


        toggleVerse(bookName, chapterNumber, verseNumber) {
            const book = this.bibleProject.selectedBooks.find(b => b.name === bookName);

            if (book) {
                const chapter = book.selectedChapters?.find(c => c.chapter === chapterNumber);
                if (chapter) {

                    if (!chapter.selectedVerses) {
                        chapter.selectedVerses = [];
                    }

                    const verseIndex = chapter.selectedVerses.indexOf(verseNumber);
                    if (verseIndex !== -1) {
                        chapter.selectedVerses.splice(verseIndex, 1);
                    } else {
                        chapter.selectedVerses.push(verseNumber);
                    }
                }
            }
        },


        toggleAllVerses(bookName, chapterNumber) {
            const book = this.bibleProject.selectedBooks.find(b => b.name === bookName);

            if (book) {
                const chapter = book.selectedChapters?.find(c => c.chapter === chapterNumber);

                if (chapter) {
                    if (!chapter.selectedVerses) {
                        chapter.selectedVerses = [];
                    }

                    const totalVersesInChapter = book.chapters[chapterNumber - 1];
                    const allSelected = chapter.selectedVerses.length === totalVersesInChapter;
                    if (allSelected) {
                        chapter.selectedVerses = [];
                    } else {
                        chapter.selectedVerses = Array.from({ length: totalVersesInChapter }, (_, i) => i + 1);
                    }
                }
            }
        },

        selectAllBible() {
            const fullySelectedBooks = [];
            for (const book of allBibleBooks) {

                const selectedBookData = {
                    ...book,
                    selectedChapters: [],
                };

                if (book.chapters && book.chapters.length > 0) {
                    for (let i = 0; i < book.chapters.length; i++) {
                        const chapterNumber = i + 1;
                        const totalVersesInChapter = book.chapters[i];

                        const allVerseNumbers = totalVersesInChapter > 0
                            ? Array.from({ length: totalVersesInChapter }, (_, vIndex) => vIndex + 1)
                            : [];

                        if (totalVersesInChapter > 0) {
                            selectedBookData.selectedChapters.push({
                                chapter: chapterNumber,
                                selectedVerses: allVerseNumbers,
                            });

                        } else {
                            console.warn(`Store Action: Book ${book.name}, Chapter ${chapterNumber} has 0 verses according to book.chapters data.`);
                        }
                    }
                } else {
                    console.warn(`Store Action: Book ${book.name} has no valid 'chapters' array with verse counts.`);
                }

                fullySelectedBooks.push(selectedBookData);
            }

            this.bibleProject.selectedBooks = fullySelectedBooks;
        },
    },
});