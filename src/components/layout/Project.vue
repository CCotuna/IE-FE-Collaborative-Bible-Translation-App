<script setup>
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/store/project';
import { ref } from 'vue';
import Annotation from '../ui/Annotation.vue';

const route = useRoute();
const projectStore = useProjectStore();
const project = projectStore.projects.find(p => p.id === parseInt(route.params.id));

const openAnnotationsIndex = ref(null);
const openAddFormIndex = ref(null);
const newAnnotationText = ref('');

const toggleAnnotations = (index) => {
    openAnnotationsIndex.value = openAnnotationsIndex.value === index ? null : index;
};

const toggleAddForm = (index) => {
    openAddFormIndex.value = openAddFormIndex.value === index ? null : index;
};

const addAnnotation = (description) => {
    if (newAnnotationText.value.trim() === '') return;

    const newAnnotation = {
        id: Date.now(),
        content: newAnnotationText.value,
        createdAt: new Date().toISOString(),
    };

    description.annotations.push(newAnnotation);
    description.noAnnotations = description.annotations.length;
    newAnnotationText.value = '';
    openAddFormIndex.value = null;
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
                    <div v-if="description.annotations.length > 0"
                        class="absolute -bottom-9 -left-2 bg-white pt-1 rounded-e-full w-[5.9rem]">
                        <button @click="toggleAnnotations(index)"
                            class="rounded-e-full py-1 w-20 ms-2 flex items-center justify-center bg-brand-olivine text-white text-xl">
                            <span class="text-2xl">{{ description.noAnnotations }}</span>
                            <i :class="{
                                'bi-chevron-double-down': openAnnotationsIndex !== index,
                                'bi-chevron-double-down rotate-180 mb-1': openAnnotationsIndex === index
                            }" class="bi ms-4"></i>
                        </button>
                    </div>
                    <i v-if="!isOpen"
                        class="bi bi-bell-fill bg-white text-brand-gold-metallic rounded-full p-2 flex items-center justify-center absolute -bottom-10 left-24 w-12 h-12 text-3xl"></i>

                    <i class="bi bi-plus-circle-fill bg-white text-brand-olivine rounded-full p-2 flex items-center justify-center absolute -bottom-9 right-4 w-12 h-12 text-4xl cursor-pointer"
                        @click="toggleAddForm(index)">
                    </i>
                </div>
                <div v-if="openAnnotationsIndex === index"
                    class="border-s-8 border-brand-olivine -mt-12 -mb-10 pt-10 pb-10">
                    <div v-for="(annotation, aIndex) in description.annotations" :key="aIndex">
                        <Annotation :annotation="annotation" />
                    </div>
                </div>
                <div v-if="openAddFormIndex === index" :class="{
                    'border-s-8 border-brand-olivine -mb-10 pt-10 px-3': true,
                    'mt-5': openAnnotationsIndex !== null,
                    'mt-2': openAnnotationsIndex === null
                }">
                    <textarea v-model="newAnnotationText" class="w-full p-2 border border-gray-300 rounded-lg" rows="5"
                        placeholder="Adaugă textul adnotării"></textarea>
                    <button @click="addAnnotation(description)"
                        class="mt-2 px-4 py-2 bg-brand-olivine text-white rounded-lg hover:bg-brand-olivine-light">
                        Adaugă Adnotare
                    </button>
                </div>
            </div>
        </div>
        <div class="mt-12 p-3 relative">
            <p class="text-xl">
                <span class="text-sm text-gray-500">6 </span>
                Strig* către Tine, căci m-asculţi, Dumnezeule! Pleacă-Ţi urechea spre mine, ascultă cuvântul meu!
            </p>
            <div class="flex items-center absolute -bottom-8 space-x-2">
                <div class="rounded-full bg-gray-400 text-white text-base px-4">3</div>
                <i class="bi bi-bell-fill text-gray-400 text-base"></i>
            </div>
        </div>
    </div>
    <div v-else>
        <p>Project not found</p>
    </div>
</template>
