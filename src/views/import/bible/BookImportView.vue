<script setup>
import { useBibleImportStore } from "@/store/bibleProject";
import { books } from "@/constants/bible_books";
import { useRouter } from "vue-router";

const store = useBibleImportStore();
const router = useRouter();

const nextStep = () => {
    router.push({ name: "classified-import-bible-book-chapter" });
};
</script>

<template>
    <div class="p-6">
        <!-- {{ store.title }}
        {{ store.language }}
        {{ store.version }}
        {{ store.selectedBooks }} -->
        <h2>Alege Cărțile</h2>
        <div class="grid grid-cols-5 xl:grid-cols-12 gap-4">
            <div v-for="book in books" :key="book.name"
                :class="['border p-2 rounded-md cursor-pointer',
                store.selectedBooks.some(b => b.name === book.name) ? 'bg-green-500 text-white' : 'bg-white']"
                @click="store.toggleBook(book.name)">
                {{ book.name }}
            </div>
        </div>

        <button @click="nextStep" class="bg-green-500 text-white p-2 rounded-md mt-4">Următorul Pas</button>
    </div>
</template>