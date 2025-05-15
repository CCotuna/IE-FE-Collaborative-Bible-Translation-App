<script setup>
import { useBibleProjectStore } from '@/store/bibleProject';
import { useProjectStore } from '@/store/project';

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
}
</script>

<template>
    <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Selectează Versetele</h2>

        <div v-if="bibleProjectStore.bibleProject.selectedBooks.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="book in bibleProjectStore.bibleProject.selectedBooks" :key="book.name"
                class="bg-white rounded-lg border shadow-sm p-4">
                <h3 class="text-lg font-semibold mb-4">{{ book.name }} ({{ book.fullName }})</h3>

                <div v-for="selectedChapter in book.selectedChapters" :key="book.name + '-' + selectedChapter.chapter"
                    class="mb-6 p-4 border rounded">
                    <h4 class="text-md font-medium mb-3">Capitolul {{ selectedChapter.chapter }}</h4>

                    <button class="mb-4 w-full px-4 py-2 text-white rounded focus:outline-none transition text-sm"
                        :class="{
                            'bg-blue-500 hover:bg-blue-600': !selectedChapter.selectedVerses || selectedChapter.selectedVerses.length !== getTotalVerses(book, selectedChapter.chapter),
                            'bg-red-500 hover:bg-red-600': selectedChapter.selectedVerses && selectedChapter.selectedVerses.length === getTotalVerses(book, selectedChapter.chapter)
                        }" @click="toggleAllVerses(book.name, selectedChapter.chapter)">
                        {{ selectedChapter.selectedVerses && selectedChapter.selectedVerses.length ===
                            getTotalVerses(book, selectedChapter.chapter) ? 'Deselectează toate versetele' : 'Selectează toate versetele' }} ({{ getTotalVerses(book, selectedChapter.chapter) }})
                    </button>

                    <div class="grid grid-cols-8 gap-0.5">
                        <div v-for="verseNumber in getTotalVerses(book, selectedChapter.chapter)"
                            :key="book.name + '-' + selectedChapter.chapter + '-' + verseNumber"
                            :class="{
                                'w-7 h-7 flex items-center justify-center border rounded cursor-pointer text-xs transition': true,
                                'bg-brand-olivine text-white border-brand-olivine': isVerseSelected(selectedChapter, verseNumber), 'hover:bg-gray-200': !isVerseSelected(selectedChapter, verseNumber)
                            }"
                            @click="toggleVerse(book.name, selectedChapter.chapter, verseNumber)">
                            {{ verseNumber }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            Nu ați selectat nicio carte sau niciun capitol. Vă rugăm să vă întoarceți la pașii anteriori.
        </div>

        <div class="mt-6 text-right">
            <!-- <RouterLink
                  :to="{ name: 'home'}"
                  class="inline-block px-6 py-3 bg-brand-olivine text-white font-semibold rounded-md hover:bg-tea-green transition"
             >
                  Vezi Sumarul Importului
             </RouterLink> -->
            <button @click="addBibleProject()"
                class="inline-block px-6 py-3 bg-brand-olivine text-white font-semibold rounded-md hover:bg-tea-green transition">
                Trimite in store </button>
        </div>
    </div>
</template>

<style scoped></style>