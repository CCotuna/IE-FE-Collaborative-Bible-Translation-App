<script setup>
import { useBibleImportStore } from "@/store/bibleProject";
import { useRouter } from "vue-router";
import axios from "axios";
import { ref, onMounted } from "vue";

const store = useBibleImportStore();
const router = useRouter();

const fetchChapters = async (bookId) => {
    try {
        const response = await axios.get(`https://bible-api.com/data/web/${bookId}`);
        return response.data.chapters.map((_, index) => ({
            number: index + 1,
            verses: []
        }));
    } catch (error) {
        console.error("Error fetching chapters:", error);
        return [];
    }
};

const loadChapters = async (book) => {
    if (!book.chapters || book.chapters.length === 0) {
        book.chapters = await fetchChapters(book.bookId);
    }
    if (!book.selectedChapters) {
        book.selectedChapters = [];
    }
};

const selectAllChapters = (book) => {
    if (book.selectedChapters.length === book.chapters.length) {
        book.selectedChapters = [];
    } else {
        book.selectedChapters = [...book.chapters];
    }
};

const nextStep = () => {
    router.push({ name: "classified-import-bible-book-chapter-verse" });
};

onMounted(() => {
    store.selectedBooks.forEach(book => {
        loadChapters(book);
    });
});
</script>

<template>
    <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Alege Capitole</h2>

        <div v-for="book in store.selectedBooks" :key="book.bookId">
            <h3 class="text-brand-olivine font-extrabold text-3xl my-4">
                {{ book.name }} - Capitole ({{ book.chapters?.length || 0 }})
            </h3>

            <div class="grid grid-cols-8 lg:grid-cols-12 gap-2">
                <div class="border p-2 rounded-md cursor-pointer bg-brand-olivine text-white"
                    @click="selectAllChapters(book)">
                    Integral
                </div>
                <div v-for="chapter in book.chapters" :key="chapter.number"
                    :class="['border p-2 rounded-md cursor-pointer',
                        book.selectedChapters.some(c => c.number === chapter.number) ? 'bg-brand-olivine text-white' : 'bg-white']"
                    @click="store.toggleChapter(book.name, chapter.number)">
                    {{ chapter.number }}
                </div>
            </div>
        </div>

        <button @click="nextStep" class="bg-brand-olivine text-white p-2 rounded-md mt-4">Următorul Pas</button>
    </div>
</template>
