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
    <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Alege Cartea</h2>
        <div class="grid grid-cols-5 xl:grid-cols-12 gap-3 mb-4">
            <div v-for="book in books" :key="book.name" @click="toggleBook(book)" :class="[
                'border p-3 rounded-md text-center cursor-pointer transition',
                isSelected(book)
                    ? 'bg-brand-olivine text-white border-brand-olivine'
                    : 'hover:bg-brand-tea-green'
            ]">
                {{ book.name }}
            </div>
        </div>

        <RouterLink :to="{ name: 'classified-import-bible-book-chapter' }"
            class="bg-brand-olivine text-white p-2 rounded-md">
            Următorul Pas
        </RouterLink>
    </div>
</template>
