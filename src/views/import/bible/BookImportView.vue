<script setup>
import { books } from '@/constants/bibleBooks';
import { useBibleProjectStore } from '@/store/bibleProject';
import { computed } from 'vue';

const bibleProjectStore = useBibleProjectStore();

const isSelected = (book) => {
    return bibleProjectStore.bibleProject.selectedBooks.some(b => b.name === book.name);
};

const toggleBook = (book) => {
    bibleProjectStore.toggleBook(book);
};
</script>

<template>
    <div class="p-4 sm:p-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 sm:mb-8">
            Alege Cartea
        </h1>
        <div class="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 sm:gap-3 mb-8">
            <div v-for="book in books" :key="book.name" @click="toggleBook(book)" class="flex items-center justify-center border rounded-lg cursor-pointer 
                        text-xs sm:text-sm py-4 font-medium transition-all duration-150 ease-in-out
                        hover:scale-105 hover:shadow-md" :class="[
                            isSelected(book)
                                ? 'bg-brand-olivine text-white border-brand-olivine scale-100 shadow-lg'
                                : 'bg-white border-brand-honeydew text-slate-600 hover:bg-brand-honeydew hover:border-brand-tea-green hover:text-brand-olivine'
                        ]">
                <span class="truncate px-1">{{ book.name }}</span>
            </div>
        </div>

        <div class="mt-10">
            <RouterLink :to="{ name: 'classified-import-bible-book-chapter' }"
                :class="['inline-flex items-center justify-center group px-8 py-3.5 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 transform hover:scale-105',
                    bibleProjectStore.bibleProject.selectedBooks.length > 0 ? 'bg-brand-olivine text-white focus:ring-brand-olivine' : 'bg-slate-300 text-slate-500 cursor-not-allowed']"
                :is="bibleProjectStore.bibleProject.selectedBooks.length > 0 ? 'RouterLink' : 'span'">
                <span>Următorul Pas</span>
                <svg v-if="bibleProjectStore.bibleProject.selectedBooks.length > 0" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                    class="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </RouterLink>
        </div>
    </div>
</template>
