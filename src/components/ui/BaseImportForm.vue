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
  <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-center text-gray-700 mb-6">Create New Project</h2>

    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="title" class="block text-gray-600 font-medium mb-2">Title</label>
        <input
          type="text"
          id="title"
          v-model="title"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter project title"
          required
        />
      </div>

      <div class="mb-6">
        <label for="description" class="block text-gray-600 font-medium mb-2">Description</label>
        <textarea
          id="description"
          v-model="description"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter project description"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
      >
        Create Project
      </button>
    </form>
  </div>
</template>

<style scoped>
</style>
