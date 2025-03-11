<!-- <template>
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Cărțile Bibliei</h1>
  
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(book, index) in bible"
          :key="index"
          class="p-4 border rounded-lg cursor-pointer hover:bg-gray-200"
          @click="showChapters(book)"
        >
          <p class="text-center text-lg font-semibold">{{ book.abbreviation }}</p>
        </div>
      </div>
  
      <div v-if="selectedBook" class="mt-6">
        <h2 class="text-xl font-bold">Numărul de capitole din {{ selectedBook.name }}:</h2>
        <p>{{ selectedBook.chapters.length }} capitole</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { bible } from '@/constants/biblia_dumitru_cornilescu.js';
  
  const selectedBook = ref(null);
  
  const showChapters = (book) => {
    selectedBook.value = book;
  };
  </script>
  
  <style scoped>
  </style>
   -->

   <script setup></script>
   <template></template>
   <style scoped></style>