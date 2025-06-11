<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const menuLinks = [
    {
        name: 'my-account',
        icon: 'bi-person-circle',
        text: t('menuView.profile.title'),
    },
    {
        name: 'settings',
        icon: 'bi-gear',
        text: t('menuView.settings.title'),
    },
    {
        name: 'share-profile',
        icon: 'bi-share-fill',
        text: t('menuView.share-profile.title'),
    },
    {
        name: 'about',
        icon: 'bi-info-circle',
        text: t('menuView.about.title'),
    },
    {
        name: 'help',
        icon: 'bi-question-circle',
        text: t('menuView.help.title'),
    },
];
</script>

<template>
    <div class="ps-7 pt-4 flex flex-col space-y-5">
        <div class="flex flex-col space-y-2 text-xl">
            <RouterLink v-for="link in menuLinks" :key="link.name" :to="{ name: link.name }"
                class="flex space-x-4 items-center first:mb-3">
                <i :class="link.icon" class="text-3xl text-brand-olivine"></i>
                <span>
                    {{ link.text }}
                </span>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped></style>