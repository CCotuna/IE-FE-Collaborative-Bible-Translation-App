<script setup>
import { ref } from "vue";

import { useBibleImportStore } from "@/store/bibleProject";
const store = useBibleImportStore();

const languages = ref(["English", "Romana", "French"]);
const versions = ref(["1.0", "1.1", "2.0"]);

const importBible = () => {
    alert('Successfully imported Bible');
}
</script>

<template>
    <div class="mx-6 mt-4 flex flex-col space-y-4 w-full max-w-xs">
        <!-- {{ store.language }}
        {{ store.version }}
        {{ store.title }} -->
        <div class="relative">
            <label class="text-black text-md font-semibold transition-all">
                Titlu Proiect
            </label>
            <input v-model="store.title" type="text" 
                class="peer border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none focus:border-brand-olivine" 
                placeholder="Traducere 2024 - DC 1931..." />
        </div>

        <div class="relative">
            <label class="text-black text-md font-semibold  transition-all">
                Limba
            </label>
            <select v-model="store.language" class="peer bg-white border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none focus:border-brand-olivine">
                <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
            </select>
        </div>

        <div class="relative">
            <label class="text-black text-md font-semibold  transition-all">
                Versiunea
            </label>
            <select v-model="store.version" class="peer bg-white border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none focus:border-brand-olivine">
                <option v-for="ver in versions" :key="ver" :value="ver">{{ ver }}</option>
            </select>
        </div>

        <div class="flex space-x-5">
            <button @click="importBible()" class="bg-brand-olivine text-white text-xl px-6 py-2 rounded-full">
            Integral
        </button>
        <RouterLink :to="{name: 'classified-import-bible-book'}" class="bg-brand-olivine text-white text-xl px-6 py-2 rounded-full">
            Parțial
        </RouterLink>
        </div>
    </div>
</template>