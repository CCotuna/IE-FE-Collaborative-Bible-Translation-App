<script setup>
import { ref } from "vue";
import ImportOptions from "../ImportOptions.vue";

const isChecked = ref(false);
</script>
<template>
    <div class="flex flex-col space-y-5 items-center justify-center px-8 mt-5 text-center text-xl">
      <p class="px-8 text-gray-400 text-md italic">Adaugǎ primul tǎu text, prin una din cele trei metode</p>
      <div class="flex flex-col space-y-6 py-5 border border-green-700 rounded-md">
        <div class="flex flex-col space-y-6 px-10">
          <RouterLink :to="{name : 'import-text'}" class="flex items-center space-x-8 px-8 py-2 text-white bg-brand-olivine rounded-full">
            <i class="bi bi-pencil-square text-3xl"></i>
            <span class="text-xl">Import text</span>
          </RouterLink>
          <button class="flex items-center space-x-8 px-8 py-2 text-white bg-brand-olivine rounded-full">
            <i class="bi bi-file-earmark-arrow-up text-3xl"></i>
            <span class="text-xl">Import fișier</span>
          </button>
        </div>

        <div class="px-4">
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" v-model="isChecked">
            <div
              class="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-brand-olivine peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all">
            </div>
            <span class="ms-3 text-sm text-gray-900">Opțiuni predefinite de import</span>
          </label>

          <div v-if="isChecked" class="flex flex-col space-y-4 mt-4">
            <!-- {{ selectedOption }} -->
            <ImportOptions />
          </div>
        </div>
      </div>

      <RouterLink :to="{name: 'import-text'}" class="flex items-center space-x-8 px-5 py-2 text-white bg-brand-olivine rounded-full">
        <i class="bi bi-book text-3xl"></i>
        <span class="text-xl">Import clasificat</span>
      </RouterLink>
    </div>
</template>
<style scoped></style>