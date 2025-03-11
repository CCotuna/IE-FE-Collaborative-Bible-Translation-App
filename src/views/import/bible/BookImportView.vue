<script setup>
import { useBibleImportStore } from "@/store/bibleProject";
import { useRouter } from "vue-router";
import axios from "axios";
import { ref, onMounted } from "vue";

const store = useBibleImportStore();
const router = useRouter();

const books = ref([]);

const fetchBooks = async () => {
    try {
        const response = await axios.get("https://bible-api.com/data/web");
        books.value = response.data.books;
    } catch (error) {
        console.error("Error fetching books:", error);
    }
};

onMounted(() => {
    fetchBooks();
});

const nextStep = () => {
    router.push({ name: "classified-import-bible-book-chapter" });
};

</script>

<template>
    <div class="p-6">
        <h2>Alege Cărțile</h2>
        <!-- {{ store.selectedBooks }} -->
        <div class="grid grid-cols-5 xl:grid-cols-12 gap-4">
            <!-- {{ books }} -->
            <div v-for="book in books" :key="book.id" :class="['border p-2 rounded-md cursor-pointer',
                store.selectedBooks.some(b => b.bookId === book.id) ? 'bg-brand-olivine text-white' : 'bg-white']"
                @click="store.toggleBook(book)">
                {{ book.id }}
            </div>
        </div>

        <button @click="nextStep" class="bg-brand-olivine text-white p-2 rounded-md mt-4">Următorul Pas</button>
    </div>
</template>
