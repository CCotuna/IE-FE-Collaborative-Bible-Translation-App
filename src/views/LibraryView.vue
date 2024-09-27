<script setup></script>
<template>
    <!-- Card with notifications -->
    <div v-for="i in 2" class="relative border border-brand-olivine rounded-lg mx-3 mt-4 p-3 space-y-3">
        <i
            class="bi bi-bell-fill bg-white text-brand-gold-metallic rounded-full p-2 flex items-center justify-center w-12 h-12 text-2xl absolute -top-4 -left-4 "></i>
        <div class="flex justify-between items-center">
            <p class="text-xl">Traducere 2024 - DC 1931</p>
            <p class="bg-brand-honeydew p-2 px-5 rounded-lg">Biblia</p>
        </div>
        <div class="flex justify-between items-end">
            <div class="flex space-x-2 items-center">
                <div
                    class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden border border-brand-olivine rounded-full">
                    <span class="font-medium text-brand-olivine">AD</span>
                </div>
                <span>Acum 1 an</span>
            </div>
            <div class="flex space-x-2 items-center text-3xl text-brand-olivine">
                <i
                    class="bi bi-share-fill bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                <i
                    class="bi bi-people bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                <i
                    class="bi bi-puzzle bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                <i
                    class="bi bi-trash3 bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
            </div>
        </div>
    </div>

    <!-- Card without notifications -->
    <div class="border border-brand-olivine rounded-lg mx-3 mt-4 p-3 space-y-3">
        <div class="flex justify-between items-center">
            <p class="text-xl">Traducere 2023 - BTF</p>
            <p class=" bg-brand-honeydew p-2 px-5 rounded-lg">Biblia</p>
        </div>
        <div class="flex justify-between items-end">
            <div class="flex space-x-2 items-center">
                <div
                    class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden border border-brand-olivine rounded-full">
                    <span class="font-medium text-brand-olivine ">AD</span>
                </div>
                <span>Acum 1 an</span>
            </div>
            <div class="flex space-x-2 items-center text-3xl text-brand-olivine">
                <i
                    class="bi bi-share-fill bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                <i
                    class="bi bi-people bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                <i
                    class="bi bi-puzzle bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
                <i
                    class="bi bi-trash3 bg-white shadow-md rounded-full p-2 flex items-center justify-center w-12 h-12"></i>
            </div>
        </div>
    </div>
</template>
<style scoped></style>