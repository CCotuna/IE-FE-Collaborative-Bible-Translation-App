<script setup></script>
<template>
    <div class="relative mt-12">
            <p class="p-3">Duis ultrices accumsan lorem, non ultricies dolor dapibus sit amet. Praesent dignissim
                finibus tempus.</p>

            <div class="absolute -bottom-9 left-4 flex items-center">
                <div class="bg-white rounded-full w-12 h-12 flex items-center justify-center">
                    <div
                        class="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-brand-olivine">
                        <span class="font-medium text-brand-olivine">DR</span>
                    </div>
                </div>
                <p class="text-gray-400 p-2 pt-4">Acum 3 h</p>
            </div>

            <div class="absolute -bottom-9 right-0 flex flex-col items-center">
                <div class="bg-white rounded-full w-16 h-16 flex items-center justify-center absolute -bottom-4"></div>

                <div class="bg-white rounded-s-full w-[6.5rem] h-12 flex items-center relative z-10">
                    <div class="bg-white rounded-full w-12 h-12 flex items-center justify-center z-10 relative right-6 -bottom-1">
                        <i
                            class="bi bi-repeat bg-brand-olivine text-white rounded-full p-2 flex items-center justify-center w-10 h-10 text-2xl"></i>
                    </div>
                    <button
                        class="absolute bottom-1 right-0 rounded-s-full py-1 w-28 bg-brand-gold-metallic text-white text-xl"><span
                            class="ms-4">Public</span></button>
                </div>
            </div>
        </div>
</template>
<style scoped></style>