<script setup>
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/store/project';

import Annotation from '../ui/Annotation.vue';

const route = useRoute();
const projectStore = useProjectStore();

const project = projectStore.projects.find(p => p.id === parseInt(route.params.id));

import { ref } from 'vue';
const openDescriptionIndex = ref(null);
const isOpen = ref(false);

const toggleContent = (index) => {
    openDescriptionIndex.value = openDescriptionIndex.value === index ? null : index;
    isOpen.value = !isOpen.value;
};


</script>

<template>
    <div v-if="project">
        <h1 class="text-xl font-bold text-center">{{ project.name }}</h1>

        <div class="flex flex-col space-y-16">
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
                <i
                    class="bi bi-plus-circle-fill bg-white text-brand-olivine rounded-full p-2 flex items-center justify-center absolute -bottom-9 right-4 w-12 h-12 text-3xl"></i>

               </div>
                <div v-if="openDescriptionIndex === index" class="border-s-8 border-brand-olivine -mt-12 -mb-10 pt-10 pb-10">
                    <div v-for="(annotation, aIndex) in description.annotations" :key="aIndex" class="">
                        <Annotation :annotation="annotation" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <p>Project not found</p>
    </div>
</template>



<style scoped></style>
