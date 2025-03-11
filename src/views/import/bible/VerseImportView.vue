<script setup>
import { useBibleImportStore } from "@/store/bibleProject";
import { useRouter } from "vue-router";
import axios from "axios";
import { ref, onMounted } from "vue";

const store = useBibleImportStore();
const router = useRouter();

const fetchVerses = async (bookId, chapterNumber) => {
    try {
        const response = await axios.get(`https://bible-api.com/data/web/${bookId}/${chapterNumber}`);
        return response.data.verses.map(verse => ({
            number: verse.verse,
            text: verse.text
        }));
    } catch (error) {
        console.error("Error fetching verses:", error);
        return [];
    }
};

const loadVerses = async (book) => {
    for (const chapter of book.chapters) {
        if (!chapter.verses || chapter.verses.length === 0) {
            chapter.verses = await fetchVerses(book.bookId, chapter.number);
        }
    }
};

const finishImport = async () => {
    await store.createProject();

    router.push("/");
};

onMounted(() => {
    store.selectedBooks.forEach(book => {
        loadVerses(book);
    });
});
</script>

<template>
    <div class="p-6">
        <h2>Alege Versete</h2>
        <div v-for="book in store.selectedBooks" :key="book.name">
            <h3 class="text-4xl font-extrabold text-brand-olivine">{{ book.name }}</h3>
            <div v-for="chapter in book.chapters" :key="chapter.number">
                <h4 class="text-2xl font-extrabold">Capitol {{ chapter.number }}</h4>
                <div class="grid grid-cols-8 lg:grid-cols-12 gap-2">
                    <div class="border p-2 rounded-md cursor-pointer bg-brand-olivine text-white">Integral</div>
                    <div v-for="verse in chapter.verses" :key="verse.number"
                        :class="['border p-2 rounded-md cursor-pointer',
                            chapter.selectedVerses?.includes(verse.number) ? 'bg-brand-olivine text-white' : 'bg-white']"
                        @click="store.toggleVerse(book.name, chapter.number, verse.number)">
                        {{ verse.number }}
                    </div>
                </div>
            </div>
        </div>

        <button @click="finishImport" class="bg-brand-olivine text-white p-2 rounded-md mt-4">Finalizează</button>
    </div>
</template>
