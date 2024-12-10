<script setup>
// when going to the next step only 1 book will be selected and the user will be redirected to the chapter selection page
import { ref } from 'vue';

import { books } from '@/constants/bible_books';
const bible_books = ref(books);

function toggleImportStatus(book) {
    book.is_imported = !book.is_imported;
}
</script>

<template>
    <div class="mx-5 mt-5">
        <span class="font-bold">Alege cartea</span>
        <div class="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-7 gap-4 mt-4">
            <div v-for="book in bible_books" :key="book.name" @click="toggleImportStatus(book)" :class="['border-2',
                book.is_imported ? 'bg-brand-olivine text-white' : 'bg-white text-black border-brand-olivine',
                'rounded-md p-2 px-0 text-center cursor-pointer']">
                {{ book.name }}
            </div>
        </div>
        <RouterLink :to="{ name: 'classified-import-bible-book-chapter' }"
            class="absolute bottom-4 right-4 bg-brand-olivine text-white px-4 py-2 rounded-full">
            Adaugǎ
        </RouterLink>
    </div>
</template>

<style scoped></style>
