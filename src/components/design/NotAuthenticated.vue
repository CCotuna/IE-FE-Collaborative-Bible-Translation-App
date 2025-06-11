<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
</script>
<template>
    <div class="w-full max-w-lg bg-brand-custom-white rounded-xl p-6 sm:p-10 text-center">
        <div class="w-20 h-[5px] bg-brand-gold-metallic rounded-full mx-auto mb-6 sm:mb-8"></div>
        <img src="@/assets/emptyState/UserNotAuthenticated.svg" alt="Utilizator neautentificat"
            class="mx-auto h-48 sm:h-64 md:h-80 w-auto mb-6 sm:mb-8" />

        <h1 class="text-3xl sm:text-4xl font-bold text-slate-700 mb-4 leading-tight">
            {{ t('homepageGuest.signInPrompt') }}
        </h1>
        <p class="text-md sm:text-lg text-slate-500 mb-8 sm:mb-10">
            {{ t('homepageGuest.signInDescription') }}
        </p>

        <RouterLink :to="{ name: 'sign-in' }" class="w-full sm:w-auto bg-brand-olivine text-brand-custom-white font-semibold 
                       py-3 px-8 sm:px-10 rounded-lg shadow-lg
                       transform transition-all duration-300 ease-in-out 
                       hover:bg-opacity-85 hover:shadow-xl hover:scale-105 
                       focus:outline-none focus:ring-4 focus:ring-brand-olivine focus:ring-opacity-40">
            {{ t('menuView.signIn') }}
        </RouterLink>

        <div class="mt-10 text-sm text-slate-500">
            <p>
                {{ t('homepageGuest.signUpDescription')}}
                <RouterLink :to="{ name: 'sign-up' }"
                    class="font-semibold text-brand-gold-metallic hover:text-brand-olivine hover:underline focus:outline-none">
                    {{ t('homepageGuest.signUpPrompt') }}
                </RouterLink>
            </p>
        </div>
    </div>
</template>
<style scoped></style>