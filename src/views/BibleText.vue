<script setup>
import TemplateTranslatedText from '@/components/TemplateTranslatedText.vue';

const newObject = {
    text: "Cât priveşte legăturile cu oamenii, eu, după cuvântul buzelor Tale, mă feresc de calea celor asupritori;",
    noTranslations: 2
}
const newObject2 = {
    text: "Strig* către Tine, căci m-asculţi, Dumnezeule! Pleacă-Ţi urechea spre mine, ascultă cuvântul meu!",
    noTranslations: 3
}
</script>
<template>
    <TemplateTranslatedText  :text="newObject"/>
    <div class="mt-12">
        <TemplateTranslatedText :text="newObject2" />
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