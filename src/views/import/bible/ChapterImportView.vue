<script setup>
import { useBibleImportStore } from "@/store/bibleProject";
import { useRouter } from "vue-router";

const store = useBibleImportStore();
const router = useRouter();

const nextStep = () => {
    router.push({ name: "classified-import-bible-book-chapter-verse" });
};
</script>

<template>
    <div class="p-6">
        <h2>Alege Capitole</h2>
        <div v-for="book in store.selectedBooks" :key="book.name">
            <h3 class="text-brand-olivine font-extrabold text-3xl my-4">{{ book.name }}</h3>
            <div class="grid grid-cols-8 lg:grid-cols-12 gap-2">
                <div class="border p-2 rounded-md cursor-pointer bg-brand-olivine text-white">Integral</div>
                <div v-for="chapter in 50" :key="chapter"
                    :class="['border p-2 rounded-md cursor-pointer',
                    book.chapters.some(c => c.number === chapter) ? 'bg-brand-olivine text-white' : 'bg-white']"
                    @click="store.toggleChapter(book.name, chapter)">
                    {{ chapter }}
                </div>
            </div>
        </div>

        <button @click="nextStep" class="bg-brand-olivine text-white p-2 rounded-md mt-4">Următorul Pas</button>
    </div>
</template>