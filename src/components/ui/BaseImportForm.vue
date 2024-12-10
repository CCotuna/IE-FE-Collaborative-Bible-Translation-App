<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/store/project';

const projectStore = useProjectStore();
const router = useRouter();

const title = ref('');
const description = ref('');

const submitForm = () => {
  if (title.value && description.value) {
    const newProject = {
      name: title.value,
      description: description.value,
      has_updates: false,
      type: null,
      last_update: new Date().toISOString(),
    };

    projectStore.addProject(newProject);

    title.value = '';
    description.value = '';

    router.push('/');
  } else {
    alert("Please fill out both the title and description fields.");
  }
};
</script>

<template>
  <form class="flex flex-col p-8 pt-2 " @submit.prevent="submitForm">
    <div class="flex space-x-2 mb-4">
      <span class="px-2 py-1 text-xl bg-gray-200 rounded-md">
        <i class="bi bi-type-bold"></i>
      </span>
      <span class="px-2 py-1 text-xl bg-gray-200 rounded-md">
        <i class="bi bi-type-underline"></i>
      </span>
      <span class="px-2 py-1 text-xl bg-gray-200 rounded-md">
        <i class="bi bi-type-italic"></i>
      </span>
    </div>

    <input v-model="title" type="text" placeholder="Titlu"
      class="border border-gray-300 p-2 mb-4 rounded-md w-full max-w-xs" />

    <textarea v-model="description" placeholder="Adaugă un text nou..."
      class="p-2 rounded-md w-full max-w-xs min-h-[30rem] placeholder-gray-400 resize-none"></textarea>

    <button type="submit" class="absolute bottom-4 right-4 bg-brand-olivine text-white px-4 py-2 rounded-full">
      Adaugǎ
    </button>
  </form>
</template>

<style scoped></style>
