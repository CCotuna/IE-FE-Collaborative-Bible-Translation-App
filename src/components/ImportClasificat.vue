<script setup></script>
<template>
    <div class="flex flex-col space-y-5 p-10 pt-5">
        <RouterLink :to="{name:'biblia'}" class="flex space-x-4 items-center align-middle">
            <p class="border border-brand-gold-metallic rounded-full p-2 px-3"><i
                    class="bi bi-journal-text text-brand-gold-metallic text-2xl"></i></p>
            <span class="text-xl font-medium">Biblia</span>
        </RouterLink>
        <RouterLink :to="{name:'imnuri-crestine'}" class="flex space-x-4 items-center align-middle">
            <p class="border border-brand-gold-metallic rounded-full p-2 px-3"><i
                    class="bi bi-journal-text text-brand-gold-metallic text-2xl"></i></p>
            <span class="text-xl font-medium">Imnuri creștine</span>
        </RouterLink>
        <RouterLink :to="{name:'poezii-crestine'}" class="flex space-x-4 items-center align-middle">
            <p class="border border-brand-gold-metallic rounded-full p-2 px-3"><i
                    class="bi bi-journal-text text-brand-gold-metallic text-2xl"></i></p>
            <span class="text-xl font-medium">Poezii creștine</span>
        </RouterLink>
        <RouterLink :to="{name:'comentarii-biblice'}" class="flex space-x-4 items-center align-middle">
            <p class="border border-brand-gold-metallic rounded-full p-2 px-3"><i
                    class="bi bi-journal-text text-brand-gold-metallic text-2xl"></i></p>
            <span class="text-xl font-medium">Comentarii biblice</span>
        </RouterLink>
    </div>
</template>
<style scoped></style>