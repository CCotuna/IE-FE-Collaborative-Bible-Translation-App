<script setup>
import { useBibleProjectStore } from '@/store/bibleProject';
import { useProjectStore } from '@/store/project';
import { useRouter } from 'vue-router';

const router = useRouter();

const bibleProjectStore = useBibleProjectStore();
const projectStore = useProjectStore();

const toggleVerse = (bookName, chapterNumber, verseNumber) => {
    bibleProjectStore.toggleVerse(bookName, chapterNumber, verseNumber);
};

const toggleAllVerses = (bookName, chapterNumber) => {
    bibleProjectStore.toggleAllVerses(bookName, chapterNumber);
};

const isVerseSelected = (chapter, verseNumber) => {
    return chapter.selectedVerses?.includes(verseNumber);
};

const getTotalVerses = (book, chapterNumber) => {
    return book.chapters[chapterNumber - 1];
}

const addBibleProject = async () => {
    await projectStore.addProject(bibleProjectStore.bibleProject);
    bibleProjectStore.resetBibleProject();
    router.push({ name: 'home' });
}

const sortedSelectedChapters = (chapters) => {
    if (!chapters) return [];
    return [...chapters].sort((a, b) => a.chapter - b.chapter);
};
</script>

<template>
    <div class="p-4 sm:p-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 sm:mb-8">Selectează
            Versetele</h2>

        <div v-if="bibleProjectStore.bibleProject.selectedBooks.length > 0" class="space-y-8">

            <div v-for="book in bibleProjectStore.bibleProject.selectedBooks" :key="book.name"
                class="bg-brand-custom-white rounded-xl p-5 py-3 flex flex-col">

                <div class="w-16 h-1.5 bg-brand-gold-metallic rounded-full mb-5 mx-auto"></div>
                <h3 class="text-xl font-semibold text-slate-700 mb-6 text-center">{{
                    bibleProjectStore.getBookName(book.fullName) }}
                </h3>

                <div v-if="book.selectedChapters && book.selectedChapters.length > 0"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="selectedChapter in sortedSelectedChapters(book.selectedChapters)"
                        :key="book.name + '-' + selectedChapter.chapter"
                        class="bg-slate-50/70 rounded-lg p-4 shadow-md flex flex-col">

                        <h4 class="text-lg font-medium text-slate-700 mb-4">Capitolul {{ selectedChapter.chapter }}</h4>

                        <button
                            class="w-full px-4 py-2.5 text-sm font-medium rounded-md focus:outline-none transition-all duration-200 ease-in-out mb-5"
                            :class="{
                                'bg-brand-honeydew text-brand-olivine border border-brand-tea-green hover:bg-brand-tea-green hover:border-brand-olivine focus:ring-2 focus:ring-brand-olivine focus:ring-opacity-40 shadow-sm':
                                    !selectedChapter.selectedVerses || selectedChapter.selectedVerses.length !== getTotalVerses(book, selectedChapter.chapter),
                                'bg-brand-olivine text-white hover:bg-opacity-85 focus:ring-2 focus:ring-brand-olivine focus:ring-opacity-50 shadow-md':
                                    selectedChapter.selectedVerses && selectedChapter.selectedVerses.length === getTotalVerses(book, selectedChapter.chapter)
                            }" @click="toggleAllVerses(book.name, selectedChapter.chapter)">
                            {{ selectedChapter.selectedVerses && selectedChapter.selectedVerses.length ===
                                getTotalVerses(book, selectedChapter.chapter) ?
                                'Deselectează toate versetele' : 'Selectează toate versetele' }}
                            ({{ getTotalVerses(book, selectedChapter.chapter) }})
                        </button>

                        <div
                            class="grid grid-cols-7 xs:grid-cols-8 sm:grid-cols-10 gap-1.5 sm:gap-2 flex-grow content-start">
                            <div v-for="verseNumber in getTotalVerses(book, selectedChapter.chapter)"
                                :key="book.name + '-' + selectedChapter.chapter + '-' + verseNumber" class="aspect-square flex items-center justify-center border rounded-lg cursor-pointer 
                                        text-xs sm:text-sm font-medium transition-all duration-150 ease-in-out
                                        hover:scale-105 hover:shadow-md" :class="{
                                            'bg-brand-olivine text-white border-brand-olivine scale-100 shadow-lg': isVerseSelected(selectedChapter, verseNumber),
                                            'bg-brand-custom-white border-brand-honeydew text-slate-600 hover:bg-brand-honeydew hover:border-brand-tea-green hover:text-brand-olivine': !isVerseSelected(selectedChapter, verseNumber)
                                        }" @click="toggleVerse(book.name, selectedChapter.chapter, verseNumber)">
                                {{ verseNumber }}
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center text-slate-500 py-4">
                    Niciun capitol selectat pentru această carte.
                </div>
            </div>
        </div>

        <div v-else class="bg-brand-custom-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
            <i class="bi bi-info-circle-fill mx-auto text-6xl text-brand-olivine opacity-70 mb-4"></i>
            <p class="text-xl font-semibold text-slate-700 mb-2">Nicio carte sau niciun capitol selectat</p>
            <RouterLink :to="{ name: 'classified-import-bible-book' }"
                class="mt-6 inline-block px-6 py-2.5 bg-brand-tea-green text-brand-olivine font-semibold rounded-lg hover:bg-brand-olivine hover:text-white transition-colors duration-200 shadow-sm hover:shadow-md">
                Înapoi la selecția cărților
            </RouterLink>
        </div>

        <div class="mt-10 text-center" v-if="bibleProjectStore.bibleProject.selectedBooks.length > 0">
            <button @click="addBibleProject()" :class="['inline-flex items-center justify-center group px-8 py-3.5 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 transform hover:scale-105',
                'bg-brand-olivine text-white focus:ring-brand-olivine']">
                <span>Creează proiect</span>
                <i
                    class="bi bi-arrow-up-circle-fill text-xl ml-2 transform transition-transform duration-300 group-hover:translate-x-1"></i>
            </button>
        </div>
    </div>
</template>

<style scoped></style>