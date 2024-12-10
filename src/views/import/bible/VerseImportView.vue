<script setup>
import { ref } from 'vue';

const selectedVerse = ref(null);

const toggleVerse = (verse) => {
    if (selectedVerse.value === verse) {
        selectedVerse.value = null;
    } else {
        selectedVerse.value = verse;
    }
};
</script>

<template>
    <div class="mx-5 mt-5">
        <span class="font-bold">Alege versetul sau fragmentul</span>
        <div class="grid grid-cols-6 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-7 gap-4 mt-4">
            <div
                class="border-2 border-brand-olivine text-black p-2 px-0 w-full text-center cursor-pointer rounded-md col-span-2">
                Integral
            </div>

            <div v-for="i in 40" :key="i" :class="[
                'border-2 text-black p-2 px-0 text-center cursor-pointer rounded-md',
                selectedVerse === i ? 'bg-brand-olivine text-white' : 'border-brand-olivine text-black'
            ]" @click="toggleVerse(i)">
                {{ i }}
            </div>
        </div>
        <RouterLink :to="{ name: 'classified-import-bible-book-chapter-verse' }"
        class="fixed bottom-4 right-4 bg-brand-olivine text-white px-4 py-2 rounded-full">
        Adaugǎ
        </RouterLink>
    </div>
</template>

<style scoped></style>
