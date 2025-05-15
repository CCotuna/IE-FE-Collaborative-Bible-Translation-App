<script setup>
import { useBibleProjectStore } from '@/store/bibleProject';

const bibleProjectStore = useBibleProjectStore();

const toggleChapter = (bookName, chapterNumber) => {
    bibleProjectStore.toggleChapter(bookName, chapterNumber);
};

const toggleAllChapters = (book) => {
    bibleProjectStore.toggleAllChapters(book);
};

const isChapterSelected = (book, chapterNumber) => {
    return book.selectedChapters?.some(c => c.chapter === chapterNumber);
};

</script>

<template>
    <div class="p-6 rounded-lg">
        <h2 class="text-xl font-bold mb-4">Selectează Capitolele</h2>

        <div v-if="bibleProjectStore.bibleProject.selectedBooks.length > 0"
             class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="book in bibleProjectStore.bibleProject.selectedBooks" :key="book.name"
                 class="bg-white rounded-lg border shadow-sm p-4">
                <h3 class="text-lg font-semibold mb-3">{{ book.name }} ({{ book.fullName }})</h3>

                <button
                    class="mb-4 w-full px-4 py-2 text-white rounded focus:outline-none transition"
                    :class="{
                         'bg-blue-500 hover:bg-blue-600': !book.selectedChapters || book.selectedChapters.length !== book.chapters.length,
                         'bg-red-500 hover:bg-red-600': book.selectedChapters && book.selectedChapters.length === book.chapters.length
                    }"
                    @click="toggleAllChapters(book)">
                    {{ book.selectedChapters && book.selectedChapters.length === book.chapters.length ? 'Deselectează toate capitolele' : 'Selectează toate capitolele' }}
                </button>


                <div class="grid grid-cols-7 gap-1">
                    <div v-for="chapterNumber in book.chapters.length" :key="chapterNumber"
                         :class="{
                             'w-8 h-8 flex items-center justify-center border rounded cursor-pointer text-sm transition': true,
                             'bg-brand-olivine text-white border-brand-olivine': isChapterSelected(book, chapterNumber),
                             'hover:bg-gray-200': !isChapterSelected(book, chapterNumber)
                         }"
                         @click="toggleChapter(book.name, chapterNumber)">
                        {{ chapterNumber }}
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            Nu ați selectat nicio carte. Vă rugăm să vă întoarceți la pasul anterior.
        </div>

        <div class="mt-6">
             <RouterLink
                  :to="{ name: 'classified-import-bible-book-chapter-verse'}"
                  class="inline-block px-6 py-3 bg-brand-olivine text-white font-semibold rounded-md hover:bg-tea-green transition"
             >
                  Următorul Pas (Selecție Versete)
             </RouterLink>
        </div>

    </div>
</template>

<style scoped>
</style>