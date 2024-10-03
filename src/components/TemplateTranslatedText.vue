<script setup>
import { ref } from "vue"
const isOpen = ref(false)
const toggleContent = () => {
    isOpen.value = !isOpen.value
}

defineProps({
    text: Object
})

import SimpleText from "@/components/SimpleText.vue";
import RecentlyAddedText from "@/components/RecentlyAddedText.vue";
import PublicText from "@/components/PublicText.vue";
</script>
<template>
    <div class="relative">
        <p class="text-xl bg-brand-honeydew p-3"><span class=" text-sm text-gray-500">4 </span>{{ text.text }}</p>

        <div class="absolute -bottom-9 -left-2 bg-white pt-1 rounded-e-full w-[5.9rem]">
            <button @click="toggleContent"
                class="rounded-e-full py-1 w-20 ms-2 flex items-center justify-center bg-brand-olivine text-white text-xl">
                <span class="text-2xl">{{ text.noTranslations }}</span>
                <i v-if="!isOpen" class="bi bi-chevron-double-down ms-4"></i>
                <i v-else class="bi bi-chevron-double-down ms-4 mb-1 rotate-180"></i></button>
        </div>
        <i v-if="!isOpen"
            class="bi bi-bell-fill bg-white text-brand-gold-metallic rounded-full p-2 flex items-center justify-center absolute -bottom-9 left-24 w-12 h-12 text-2xl"></i>
        <i
            class="bi bi-plus-circle-fill bg-white text-brand-olivine rounded-full p-2 flex items-center justify-center absolute -bottom-9 right-4 w-12 h-12 text-3xl"></i>
    </div>
    <div v-if="isOpen" class="border-s-8 border-brand-olivine -mt-12 -mb-10 pt-10 pb-10 ">

        <SimpleText />
        <RecentlyAddedText />
        <SimpleText />
        <PublicText />
        <SimpleText />
        <RecentlyAddedText />
        <PublicText />
        <PublicText />

    </div>
</template>
<style scoped></style>