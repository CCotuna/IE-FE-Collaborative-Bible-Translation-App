<script setup>
import { useBibleImportStore } from "@/store/bibleProject";
import { useRouter } from "vue-router";

const store = useBibleImportStore();
const router = useRouter();

const finishImport = () => {
    console.log("Import Finalizat:", store.selectedBooks);
    router.push("/")
};
</script>

<template>
    <div class="p-6">
        <h2>Alege Versete</h2>
        <div v-for="book in store.selectedBooks" :key="book.name">
            <h3  class="text-4xl font-extrabold text-brand-olivine">{{ book.name }}</h3>
            <div v-for="chapter in book.chapters" :key="chapter.number">
                <h4 class="text-2xl font-extrabold">Capitol {{ chapter.number }}</h4>
                <div class="grid grid-cols-8 lg:grid-cols-12 gap-2">
                    <div class="border p-2 rounded-md cursor-pointer bg-brand-olivine text-white">Integral</div>
                    <div v-for="verse in 40" :key="verse"
                        :class="['border p-2 rounded-md cursor-pointer',
                        chapter.verses.includes(verse) ? 'bg-brand-olivine text-white' : 'bg-white']"
                        @click="store.toggleVerse(book.name, chapter.number, verse)">
                        {{ verse }}
                    </div>
                </div>
            </div>
        </div>

        <button @click="finishImport" class="bg-brand-olivine text-white p-2 rounded-md mt-4">Finalizează</button>
    </div>
</template>
