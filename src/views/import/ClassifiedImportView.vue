<script setup>
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
</script>
<template>
    <div v-if="route.name === 'classified-import'" class="flex flex-col space-y-5 p-10 pt-5">
        <RouterLink :to="{ name: 'classified-import-bible' }" class="flex space-x-4 items-center align-middle">
            <p class="border border-brand-gold-metallic rounded-full p-2 px-3"><i
                    class="bi bi-journal-text text-brand-gold-metallic text-2xl"></i></p>
            <span class="text-xl font-medium">{{ t('classifiedImportView.bible.title') }}</span>
        </RouterLink>
        <span class="flex space-x-4 items-center align-middle">
            <p class="border border-brand-gold-metallic rounded-full p-2 px-3"><i
                    class="bi bi-journal-text text-brand-gold-metallic text-2xl"></i></p>
            <span class="text-xl font-medium">{{ t('classifiedImportView.christianHymns.title') }}</span>
        </span>
        <span class="flex space-x-4 items-center align-middle">
            <p class="border border-brand-gold-metallic rounded-full p-2 px-3"><i
                    class="bi bi-journal-text text-brand-gold-metallic text-2xl"></i></p>
            <span class="text-xl font-medium">{{ t('classifiedImportView.christianPoems.title') }}</span>
        </span>
        <span class="flex space-x-4 items-center align-middle">
            <p class="border border-brand-gold-metallic rounded-full p-2 px-3"><i
                    class="bi bi-journal-text text-brand-gold-metallic text-2xl"></i></p>
            <span class="text-xl font-medium">{{ t('classifiedImportView.christianCommentaries.title') }}</span>
        </span>
    </div>
    <RouterView />
</template>
<style scoped></style>