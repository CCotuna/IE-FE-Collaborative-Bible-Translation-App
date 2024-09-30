<script setup>
import { ref } from "vue"
const isOpen = ref(false)
const toggleContent = () => {
    isOpen.value = !isOpen.value
}
</script>
<template>
    Text biblic
    <div class="relative">
        <p class="text-xl bg-brand-honeydew p-3"><span class=" text-sm text-gray-500">4 </span>Cât priveşte legăturile
            cu oamenii, eu, după
            cuvântul buzelor Tale, mă feresc de calea celor
            asupritori;</p>

        <div class="absolute -bottom-9 -left-2 bg-white py-1 rounded-e-full w-[5.9rem]">
            <button @click="toggleContent"
                class="rounded-e-full py-1 w-20 ms-2 flex items-center justify-center bg-brand-olivine text-white text-2xl">
                <span>2</span>
                <i v-if="!isOpen" class="bi bi-chevron-double-down ms-4"></i>
                <i v-else class="bi bi-chevron-double-down ms-4 rotate-180"></i></button>
        </div>
        <i v-if="!isOpen"
            class="bi bi-bell-fill bg-white text-brand-gold-metallic rounded-full p-2 flex items-center justify-center absolute -bottom-9 left-24 w-12 h-12 text-2xl"></i>
        <i
            class="bi bi-plus-circle-fill bg-white text-brand-olivine rounded-full p-2 flex items-center justify-center absolute -bottom-9 right-4 w-12 h-12 text-3xl"></i>
    </div>
    <div v-if="isOpen" class="border-s-8 border-brand-olivine border-h mt-12  rounded">
        <div class="relative">
            <p class="bg-brand-cornsilk p-3">Duis ultrices accumsan lorem, non ultricies dolor dapibus sit amet.
                Praesent dignissim finibus tempus.</p>
            <div class="absolute -bottom-9 left-4 flex items-center">
                <div class="bg-white rounded-full w-12 h-12 flex items-center justify-center">
                    <div
                        class="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-brand-olivine">
                        <span class="font-medium text-brand-olivine">FG</span>
                    </div>

                </div>
                <p class="text-gray-400 p-2 pt-4">Acum 14 minute</p>
            </div>


            <div class="absolute -bottom-9 right-0 bg-white rounded-s-full w-[6.5rem] h-12">
                <button
                    class="absolute bottom-1 right-0 rounded-s-full py-1 w-24 bg-white border-brand-gold-metallic border text-brand-gold-metallic text-xl">Privat</button>
            </div>
        </div>

        <div class="relative mt-8">
            <p class="p-3">Duis ultrices accumsan lorem, non ultricies dolor dapibus sit amet. Praesent dignissim
                finibus tempus. </p>

            <div class="absolute -bottom-9 left-4 flex items-center">
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
                <button
                    class="absolute bottom-1 right-0 rounded-s-full py-1 w-24 bg-white border-brand-gold-metallic border text-brand-gold-metallic text-xl">Privat</button>
            </div>
        </div>
    </div>

    <div class="mt-16 p-3 relative">
        <p class="text-xl"><span class="text-sm text-gray-500">5 </span>paşii mei stau neclintiţi* pe cărările Tale şi
            nu mi se clatină picioarele.</p>
        <div class="rounded-full bg-gray-400 text-white text-base absolute -bottom-8 px-4">2</div>
    </div>

    <div class="mt-16 p-3 relative">
        <p class="text-xl">
            <span class="text-sm text-gray-500">6 </span>
            Strig* către Tine, căci m-asculţi, Dumnezeule! Pleacă-Ţi urechea spre mine, ascultă cuvântul meu!
        </p>
        <div class="flex items-center absolute -bottom-8 space-x-2">
            <div class="rounded-full bg-gray-400 text-white text-base px-4">3</div>
            <i class="bi bi-bell-fill text-gray-400 text-base"></i>
        </div>
    </div>
    <div class="mt-16 p-3">
        <p class="text-xl">
            <span class="text-sm text-gray-500">7</span>
            Arată-Ţi bunătatea Ta cea minunată*, Tu, care scapi pe cei ce caută adăpost şi-i izbăveşti de potrivnicii
            lor prin dreapta Ta!
        </p>
    </div>


</template>
<style scoped></style>