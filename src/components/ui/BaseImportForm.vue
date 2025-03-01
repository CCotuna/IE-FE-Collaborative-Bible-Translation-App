<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/store/project';

const projectStore = useProjectStore();
const router = useRouter();

const title = ref('');
const isBoldActive = ref(false);
const isItalicActive = ref(false);
const isUnderlineActive = ref(false);

const toggleFormat = (command) => {
  document.execCommand(command);

  if (command === 'bold') {
    isBoldActive.value = true;
    setTimeout(() => {
      isBoldActive.value = false;
    }, 500);
  }

  if (command === 'italic') {
    isItalicActive.value = true;
    setTimeout(() => {
      isItalicActive.value = false;
    }, 500);
  }

  if (command === 'underline') {
    isUnderlineActive.value = true;
    setTimeout(() => {
      isUnderlineActive.value = false;
    }, 500);
  }
};

const submitForm = () => {
    const content = document.getElementById('description-editor').innerText.trim();

    if (title.value && content) {
        const newProject = {
            title: title.value,
            text: content,
            type: null, 
        };

        projectStore.addProject(newProject);

        title.value = '';
        document.getElementById('description-editor').innerHTML = '';

        router.push('/');
    } else {
        alert('Please fill out both the title and description fields.');
    }
};

</script>

<template>
  <form class="flex flex-col p-8 pt-2" @submit.prevent="submitForm">
    <div class="flex space-x-2 mb-4">
      <button type="button"
        :class="['px-2 py-1 text-xl rounded-md', isBoldActive ? 'bg-brand-olivine text-white' : 'bg-gray-200']"
        @click="toggleFormat('bold')">
        <i class="bi bi-type-bold"></i>
      </button>
      <button type="button"
        :class="['px-2 py-1 text-xl rounded-md', isUnderlineActive ? 'bg-brand-olivine text-white' : 'bg-gray-200']"
        @click="toggleFormat('underline')">
        <i class="bi bi-type-underline"></i>
      </button>
      <button type="button"
        :class="['px-2 py-1 text-xl rounded-md', isItalicActive ? 'bg-brand-olivine text-white' : 'bg-gray-200']"
        @click="toggleFormat('italic')">
        <i class="bi bi-type-italic"></i>
      </button>
    </div>

    <input v-model="title" type="text" placeholder="Titlu" aria-label="Titlu proiect"
      class="border border-gray-300 p-2 mb-4 rounded-md w-full max-w-xs" />

    <div id="description-editor" contenteditable="true"
      class="p-2 border border-gray-300 rounded-md w-full max-w-xs min-h-[30rem] placeholder-gray-400 resize-none"
      placeholder="Adaugă un text nou..."></div>

    <button type="submit" class="absolute bottom-4 right-4 bg-brand-olivine text-white px-4 py-2 rounded-full">
      Adaugǎ
    </button>
  </form>
</template>

<style scoped>
[contenteditable]:empty:before {
  content: attr(placeholder);
  color: #9ca3af;
  pointer-events: none;
  display: block;
}
</style>
