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
    <div class="p-4 sm:p-6 ">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 sm:mb-8 text-center sm:text-left">Selectează Capitolele</h2>

        <div v-if="bibleProjectStore.bibleProject.selectedBooks.length > 0"
             class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            <div v-for="book in bibleProjectStore.bibleProject.selectedBooks" :key="book.name"
                 class="bg-brand-custom-white rounded-xl shadow-xl p-5 flex flex-col"> 
                
                <div class="w-16 h-1.5 bg-brand-gold-metallic rounded-full mb-5 mx-auto"></div> 

                <h3 class="text-lg font-semibold text-slate-700 mb-4 text-center">{{ bibleProjectStore.getBookName(book.fullName) }}</h3>

                <button
                    class="w-full px-4 py-2.5 text-sm font-medium rounded-md focus:outline-none transition-all duration-200 ease-in-out mb-6"
                    :class="{
                        'bg-brand-honeydew text-brand-olivine border border-brand-tea-green hover:bg-brand-olivine hover:text-white focus:ring-2 focus:ring-brand-olivine focus:ring-opacity-40 shadow-sm': 
                            !book.selectedChapters || book.selectedChapters.length !== book.chapters.length,
                        'bg-brand-olivine text-white hover:bg-opacity-85 focus:ring-2 focus:ring-brand-olivine focus:ring-opacity-50 shadow-md': 
                            book.selectedChapters && book.selectedChapters.length === book.chapters.length
                    }"
                    @click="toggleAllChapters(book)">
                    {{ book.selectedChapters && book.selectedChapters.length === book.chapters.length ? 'Deselectează toate' : 'Selectează toate' }}
                </button>

                <div class="grid grid-cols-5 gap-2 flex-grow content-start"> 
                    <div v-for="chapterNumber in book.chapters.length" :key="chapterNumber"
                         class="p-4 py-0 lg:py-2 flex items-center justify-center border rounded-lg cursor-pointer 
                                text-sm sm:text-base font-medium transition-all duration-150 ease-in-out
                                hover:scale-105 hover:shadow-md"
                         :class="{
                             'bg-brand-olivine text-white border-brand-olivine scale-100 shadow-lg': isChapterSelected(book, chapterNumber),
                             'bg-brand-custom-white border-brand-honeydew text-slate-600 hover:bg-brand-honeydew hover:border-brand-tea-green hover:text-brand-olivine': !isChapterSelected(book, chapterNumber)
                         }"
                         @click="toggleChapter(book.name, chapterNumber)">
                        {{ chapterNumber }}
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="bg-brand-custom-white rounded-xl shadow-lg p-8 text-center max-w-md">
            <svg class="mx-auto h-16 w-16 text-brand-olivine opacity-70 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <p class="text-xl font-semibold text-slate-700 mb-2">Nicio carte selectată</p>
            <p class="text-slate-500 text-sm">
                Pentru a continua, te rugăm să te întorci și să selectezi cel puțin o carte.
            </p>
            <RouterLink v-if="$route.name !== 'classified-import-bible-book'"
                 :to="{ name: 'classified-import-bible-book' }" 
                 class="mt-6 inline-block px-6 py-2.5 bg-brand-olivine text-white font-semibold rounded-lg hover:bg-white hover:text-brand-olivine transition-colors duration-200 shadow-sm hover:shadow-md">
                 Înapoi la selecția cărților
            </RouterLink>
        </div>

        <div class="mt-10">
             <RouterLink
                  :to="{ name: 'classified-import-bible-book-chapter-verse'}"
                  :class="['inline-flex items-center justify-center group px-8 py-3.5 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 transform hover:scale-105',
                           bibleProjectStore.bibleProject.selectedBooks.length > 0 ? 'bg-brand-olivine text-white focus:ring-brand-olivine' : 'bg-slate-300 text-slate-500 cursor-not-allowed']"
                  :is="bibleProjectStore.bibleProject.selectedBooks.length > 0 ? 'RouterLink' : 'span'"
             >
                  <span>Următorul Pas</span>
                  <svg v-if="bibleProjectStore.bibleProject.selectedBooks.length > 0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
             </RouterLink>
        </div>
    </div>
</template>

<style scoped>
</style>