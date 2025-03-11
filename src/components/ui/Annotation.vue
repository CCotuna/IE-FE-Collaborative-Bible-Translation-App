<script setup>
import { ref } from 'vue';
const isModalOpen = ref(false);

function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}

function confirmAction() {
    closeModal();
}
defineProps(['annotation']);
</script>
<template>
    <div class="relative mt-12">
        <p class="p-3">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam ducimus nulla odit aliquid, aspernatur laboriosam eveniet libero veritatis in, voluptate nostrum voluptatibus, atque sint neque sit obcaecati incidunt possimus quos!</p>

        <div class="absolute -bottom-9 left-2 flex items-center">
            <div class="bg-white rounded-full w-12 h-12 flex items-center justify-center">
                <div
                    class="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-brand-olivine">
                    <span class="font-medium text-brand-olivine">DR</span>
                </div>
            </div>
            <p class="text-gray-400 p-2 pt-4">Acum 3 h</p>
        </div>

        <div class="absolute -bottom-9 right-0 bg-white rounded-s-full w-[6.5rem] h-12">
            <i
                class="bi bi-pen bg-white shadow-md text-brand-gold-metallic rounded-full p-2 flex items-center justify-center absolute bottom-1 right-28 w-10 h-10 text-2xl"></i>
            <button @click="openModal"
                class="absolute bottom-1 right-0 rounded-s-full py-1 w-24 bg-white border-brand-gold-metallic border text-brand-gold-metallic text-xl">Privat</button>
        </div>

        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-8 shadow-lg text-center">
                <h2 class="text-lg mb-4">Ești sigur că dorești<br> să schimbi vizibilitatea acestui
                    text<br> în
                    modul public?</h2>
                <div class="flex justify-around mt-4">
                    <button @click="confirmAction"
                        class="bg-brand-olivine text-white text-lg px-8 py-2 rounded-full">Confirm</button>
                    <button @click="closeModal"
                        class=" bg-brand-honeydew text-brand-olivine text-lg px-8 py-2 rounded-full">Renunț</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped></style>