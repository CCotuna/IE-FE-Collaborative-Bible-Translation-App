<script setup>
import { ref } from "vue";

const projectTitle = ref('');
const language = ref('Romana'); 
const version = ref('1.0');      

const languages = ref(["English", "Romana", "French"]);
const versions = ref(["1.0", "1.1", "2.0"]);

// const submitText = () => {
//     projectTitle.value = '';
//     language.value = '';
//     version.value = '';
// }
</script>

<template>
    <div class="mx-6 mt-4 flex flex-col space-y-4 w-full max-w-xs">
        <div class="relative">
            <label class="text-black text-md font-semibold transition-all">
                Titlu Proiect
            </label>
            <input v-model="projectTitle" type="text" 
                class="peer border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none focus:border-brand-olivine" 
                placeholder="Traducere 2024 - DC 1931..." />
        </div>

        <div class="relative">
            <label class="text-black text-md font-semibold  transition-all">
                Limba
            </label>
            <select v-model="language" class="peer bg-white border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none focus:border-brand-olivine">
                <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
            </select>
        </div>

        <div class="relative">
            <label class="text-black text-md font-semibold  transition-all">
                Versiunea
            </label>
            <select v-model="version" class="peer bg-white border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none focus:border-brand-olivine">
                <option v-for="ver in versions" :key="ver" :value="ver">{{ ver }}</option>
            </select>
        </div>

        <div class="flex space-x-5">
            <button class="bg-brand-olivine text-white text-xl px-6 py-2 rounded-full">
            Integral
        </button>
        <button class="bg-brand-olivine text-white text-xl px-6 py-2 rounded-full">
            Parțial
        </button>
        </div>
    </div>
</template>