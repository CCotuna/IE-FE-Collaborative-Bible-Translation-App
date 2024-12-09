<script setup>
import { ref } from 'vue';
const selectedOption = ref(null);

const selectOption = (option) => {
  selectedOption.value = option;
}
</script>
<template>
    <span>Semnul pentru împǎrțirea textului:</span>
    <!-- {{ selectedOption }} -->
    <button @click="selectOption('Punct')"
        :class="selectedOption === 'Punct' ? 'border border-brand-olivine text-brand-olivine' : 'border border-gray-200 text-black'"
        class="py-2 rounded-md transition">
        Punct
    </button>

    <button @click="selectOption('Rand nou')"
        :class="selectedOption === 'Rand nou' ? 'border border-brand-olivine text-brand-olivine' : 'border border-gray-200 text-black'"
        class=" py-2 rounded-md transition">
        Rând nou
    </button>

    <button @click="selectOption('Text continuu')"
        :class="selectedOption === 'Text continuu' ? 'border border-brand-olivine text-brand-olivine' : 'border border-gray-200 text-black'"
        class="py-2 rounded-md transition">
        Text continuu
    </button>

    <button @click="selectOption('Paragrafe')"
        :class="selectedOption === 'Paragrafe' ? 'border border-brand-olivine text-brand-olivine' : 'border border-gray-200 text-black'"
        class=" py-2 rounded-md transition">
        Paragrafe
    </button>
</template>
<style scoped></style>