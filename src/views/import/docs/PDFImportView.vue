<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/store/project';
import { useUserStore } from '@/store/user';

import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

import axios from 'axios';

const router = useRouter();
const projectStore = useProjectStore();
const userStore = useUserStore();

const title = ref('');
const projectType = ref('Custom');
const file = ref(null);

const loadPdfText = async (file) => {
  const fileReader = new FileReader();

  fileReader.onload = async function () {
    const typedArray = new Uint8Array(this.result);
    try {
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      let rawFullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const items = content.items;

        const pageRawText = items.map(item => item.str).join(' ');
        rawFullText += pageRawText;

        if (pageNum < pdf.numPages) {
          rawFullText += '\n\n';
        }
      }

      const editor = document.getElementById('description-editor');
      if (!editor) {
        alert("A apărut o eroare: Elementul editor nu a putut fi găsit.");
        return;
      }

      editor.innerText = 'Procesare text cu AI... vă rugăm așteptați...';

      const backendProcessUrl = 'http://localhost:3000/process-text/pdf';

      const response = await axios.post(backendProcessUrl, {
        rawText: rawFullText,
        withCredentials: true
      });

      const processedText = response.data?.processedText;

      if (processedText) {
        editor.innerText = processedText;
      } else {
        editor.innerText = rawFullText.trim();
        alert('Procesarea AI a returnat text gol. Se afișează textul brut din PDF.');
      }

    } catch (error) {
      alert(`A apărut o eroare la procesarea fișierului PDF: ${error.message}`);
      const editor = document.getElementById('description-editor');
      if (editor) editor.innerText = '';
    }
  };

  fileReader.readAsArrayBuffer(file);
};

const handleFileUpload = (e) => {
  const uploadedFile = e.target.files[0];
  if (uploadedFile && uploadedFile.type === 'application/pdf') {
    file.value = uploadedFile;
    loadPdfText(uploadedFile);
  } else {

    alert('Te rugăm să încarci un fișier PDF valid.');
    file.value = null;
    const editor = document.getElementById('description-editor');
    if (editor) editor.innerText = '';
    e.target.value = '';
  }
};

const submitForm = () => {

  const content = document.getElementById('description-editor')?.innerText?.trim();
  if (title.value && content) {
    const newProject = {
      title: title.value,
      text: content,
      type: projectType.value,
      userId: userStore.user?.id,
      hasUpdates: true,
    };

    if (!newProject.userId) {
      alert('Eroare: ID-ul utilizatorului autentificat lipsește.');
      console.error("Authenticated user ID is missing when submitting project.");
      return;
    }

    projectStore.addProject(newProject);

    title.value = '';
    const editor = document.getElementById('description-editor');
    if (editor) editor.innerText = '';
    file.value = null;
    projectType.value = 'Custom';
    router.push('/');

  } else {
    alert('Completează titlul și încarcă un PDF valid procesat pentru a crea proiectul.');
  }
};
</script>

<template>
  <form class="flex flex-col p-8 pt-2" @submit.prevent="submitForm">
    <input v-model="title" type="text" placeholder="Titlu" aria-label="Titlu proiect"
      class="border border-gray-300 p-2 mb-4 rounded-md w-full max-w-xs" />

    <select v-model="projectType" class="border border-gray-300 p-2 mb-4 rounded-md w-full max-w-xs">
      <option value="Custom">Personalizat</option>
      <option value="Translation">Traducere</option>
      <option value="Commentary">Comentariu</option>
      <option value="Notes">Notițe</option>
    </select>

    <input type="file" accept="application/pdf" @change="handleFileUpload"
      class="mb-4 border border-gray-300 rounded-md p-2 w-full max-w-xs" />

    <div id="description-editor" contenteditable="true"
      class="p-2 border border-gray-300 rounded-md w-full max-w-3xl min-h-[30rem] placeholder-gray-400 resize-none"
      placeholder="Conținutul din PDF va apărea aici după procesarea AI..."></div>

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
