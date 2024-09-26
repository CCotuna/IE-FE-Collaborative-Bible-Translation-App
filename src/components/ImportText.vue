<script setup>
import { ref } from "vue";

const title = ref('');
const newText = ref('');

const submitText = () => {
    console.log('Title:', title.value);
    console.log('New Text:', newText.value);
    title.value = '';
    newText.value = '';
}
</script>

<template>
    <div class="flex flex-col p-8 pt-2 ">
        <div class="flex space-x-2 mb-4">
            <button class="px-2 py-1 text-xl bg-gray-200 rounded-md">
                <i class="bi bi-type-bold"></i>
            </button>
            <button class="px-2 py-1 text-xl bg-gray-200 rounded-md">
                <i class="bi bi-type-underline"></i>
            </button>
            <button class="px-2 py-1 text-xl bg-gray-200 rounded-md">
                <i class="bi bi-type-italic"></i>
            </button>
        </div>

        <input v-model="title" type="text" placeholder="Titlu"
            class="border border-gray-300 p-2 mb-4 rounded-md w-full max-w-xs" />

        <textarea v-model="newText" placeholder="Adaugă un text nou..."
            class="p-2 rounded-md w-full max-w-xs min-h-[30rem] placeholder-gray-400 resize-none"></textarea>

        <button @click="submitText"
            class="absolute bottom-4 right-4 bg-brand-olivine text-white px-4 py-2 rounded-full">
            Adaugǎ
        </button>
    </div>
</template>

<style scoped></style>