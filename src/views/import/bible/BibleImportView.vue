<script setup>
import { ref, computed } from "vue";
import { useBibleProjectStore } from "@/store/bibleProject";
import { useProjectStore } from "@/store/project";
import { useRouter } from 'vue-router';

const bibleProjectStore = useBibleProjectStore();
const projectStore = useProjectStore();
const router = useRouter();

const languages = ref(["English", "Romana", "French"]);
const versions = ref(["Dumitru Cornilescu", "Noua traducere romaneasca", "King James Version"]);

const isLoading = ref(false);

const handleIntegralImport = async () => {
    console.log("Component: 'Integral' button clicked.");
    if (!isTitleValid.value) {
        alert("Please enter a valid title (at least 3 characters).");
        return;
    }

    if (bibleProjectStore.bibleProject.selectedBooks.length > 0) {
        console.warn("Component: Existing book selection found. Overwriting with Integral selection.");
    }

    isLoading.value = true;

    try {
        await bibleProjectStore.selectAllBible();
        console.log("Component: Store populated with all Bible selection.");

        await projectStore.addProject(bibleProjectStore.bibleProject);

        console.log("Component: addProject action called successfully.");

        // alert('Successfully created project with integral Bible import!');
        router.push({ name: 'home' });

    } catch (error) {
        console.error("Component: Error during integral import process:", error);
        alert(`Failed to import Bible: ${error.response?.data?.message || error.message}`);
    } finally {
        isLoading.value = false;
    }
};

const isTitleValid = computed(() => {
    return bibleProjectStore.bibleProject.title?.trim().length >= 3;
});
</script>

<template>
    <div v-if="isLoading"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
        <div class="flex flex-col items-center p-8 bg-gray-800 text-white rounded-lg shadow-lg">
            <div class="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin mb-4"></div>
            <div class="text-base">Creating project...</div>
        </div>
    </div>

    <div class="mx-6 mt-4 flex flex-col space-y-4 w-full max-w-xs">
        <div class="relative">
            <label class="text-black text-md font-semibold transition-all">
                Titlu Proiect
            </label>
            <input v-model="bibleProjectStore.bibleProject.title" type="text"
                class="peer border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none focus:border-brand-olivine"
                placeholder="Traducere 2024 - DC 1931..." />
        </div>

        <div class="relative">
            <label class="text-black text-md font-semibold transition-all">
                Limba
            </label>
            <select v-model="bibleProjectStore.bibleProject.language"
                class="peer bg-white border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none focus:border-brand-olivine">
                <option disabled value="">Selectează o limbă</option>
                <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
            </select>
        </div>

        <div class="relative">
            <label class="text-black text-md font-semibold transition-all">
                Versiunea
            </label>
            <select v-model="bibleProjectStore.bibleProject.version"
                class="peer bg-white border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none focus:border-brand-olivine">
                <option disabled value="">Selectează o versiune</option>
                <option v-for="ver in versions" :key="ver" :value="ver">{{ ver }}</option>
            </select>
        </div>

        <div class="flex flex-col">
            <div class="flex space-x-5">
                <button @click="handleIntegralImport" :disabled="!isTitleValid || isLoading"
                    class="bg-brand-olivine text-white text-xl px-6 py-2 rounded-full transition-all"
                    :class="{ 'opacity-50 cursor-not-allowed': !isTitleValid || isLoading }">
                    Integral
                </button>

                <RouterLink :to="{ name: 'classified-import-bible-book' }"
                    :class="{ 'opacity-50 cursor-not-allowed pointer-events-none': !isTitleValid || isLoading }"
                    class="bg-brand-olivine text-white text-xl px-6 py-2 rounded-full transition-all">
                    Parțial
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>