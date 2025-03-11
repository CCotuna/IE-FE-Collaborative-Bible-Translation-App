<script setup>
import { ref } from 'vue';
import Annotation from './ui/Annotation.vue';

const project = ref({
    descriptions: [
        {
            verseNumber: 1,
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros tincidunt lacinia. Nullam nec purus nec eros tincidunt lacinia.",
            noAnnotations: 2,
            annotations: [
                { text: "First annotation for verse 1" },
                { text: "Second annotation for verse 1" }
            ]
        },
        // {
        //     verseNumber: 2,
        //     content: "This is the second description.",
        //     noAnnotations: 1,
        //     annotations: [
        //         { text: "First annotation for verse 2" }
        //     ]
        // }
    ]
});

const openDescriptionIndex = ref(null);
const openAddFormIndex = ref(null);
const newAnnotationText = ref('');

const toggleContent = (index) => {
    openDescriptionIndex.value = openDescriptionIndex.value === index ? null : index;
};

const toggleAddForm = (index) => {
    openAddFormIndex.value = openAddFormIndex.value === index ? null : index;
};

</script>
<template>
    <div v-if="project">
        <div class="flex flex-col space-y-12">
            <div v-for="(description, index) in project.descriptions" :key="index">
                <div class="relative">
                    <p class="text-xl bg-brand-honeydew p-3">
                        <span class="text-sm text-gray-500">
                            <span class="me-1">{{ description.verseNumber }}</span>
                        </span>
                        {{ description.content }}
                    </p>
                    <div class="absolute -bottom-9 -left-2 bg-white pt-1 rounded-e-full w-[5.9rem]">
                        <button @click="toggleContent(index)"
                            class="rounded-e-full py-1 w-20 ms-2 flex items-center justify-center bg-brand-olivine text-white text-xl">
                            <span class="text-2xl">{{ description.noAnnotations }}</span>
                            <i :class="{
                                'bi-chevron-double-down': openDescriptionIndex !== index,
                                'bi-chevron-double-down rotate-180 mb-1': openDescriptionIndex === index
                            }" class="bi ms-4"></i>
                        </button>
                    </div>
                    <i v-if="openDescriptionIndex !== index"
                        class="bi bi-bell-fill bg-white text-brand-gold-metallic rounded-full p-2 flex items-center justify-center absolute -bottom-9 left-24 w-12 h-12 text-2xl"></i>
                    <i class="bi bi-plus-circle-fill bg-white text-brand-olivine rounded-full p-2 flex items-center justify-center absolute -bottom-9 right-4 w-12 h-12 text-4xl cursor-pointer"
                        @click="toggleAddForm(index)">
                    </i>
                </div>
                <div v-if="openDescriptionIndex === index"
                    class="border-s-8 border-brand-olivine -mt-12 -mb-10 pt-10 pb-10">
                    <div v-for="(annotation, aIndex) in description.annotations" :key="aIndex" class="">
                        <Annotation :annotation="annotation" />
                    </div>
                </div>
                <div v-if="openAddFormIndex === index" class="border-s-8 border-brand-olivine mt-5 -mb-10 pt-10 px-3">
                    <textarea v-model="newAnnotationText" class="w-full p-2 border border-gray-300 rounded-lg" rows="3"
                        placeholder="Adaugă textul adnotării"></textarea>
                    <button
                        class="mt-2 px-4 py-2 bg-brand-olivine text-white rounded-lg hover:bg-brand-olivine-light">
                        Adaugă Adnotare
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped></style>