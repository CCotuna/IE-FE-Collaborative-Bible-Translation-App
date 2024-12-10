<script setup></script>
<template>
    <div class="flex flex-col space-y-5 p-10 pt-5">
        <RouterLink :to="{ name: 'classified-import-bible'}" class="flex space-x-4 items-center align-middle">
            <p class="border border-brand-gold-metallic rounded-full p-2 px-3"><i
                    class="bi bi-journal-text text-brand-gold-metallic text-2xl"></i></p>
            <span class="text-xl font-medium">Biblia</span>
            </RouterLink>
        <span  class="flex space-x-4 items-center align-middle">
            <p class="border border-brand-gold-metallic rounded-full p-2 px-3"><i
                    class="bi bi-journal-text text-brand-gold-metallic text-2xl"></i></p>
            <span class="text-xl font-medium">Imnuri creștine</span>
        </span>
        <span  class="flex space-x-4 items-center align-middle">
            <p class="border border-brand-gold-metallic rounded-full p-2 px-3"><i
                    class="bi bi-journal-text text-brand-gold-metallic text-2xl"></i></p>
            <span class="text-xl font-medium">Poezii creștine</span>
        </span>
        <span  class="flex space-x-4 items-center align-middle">
            <p class="border border-brand-gold-metallic rounded-full p-2 px-3"><i
                    class="bi bi-journal-text text-brand-gold-metallic text-2xl"></i></p>
            <span class="text-xl font-medium">Comentarii biblice</span>
        </span>
    </div>
</template>
<style scoped></style>