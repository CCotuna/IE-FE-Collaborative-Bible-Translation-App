<script setup>
import { useI18n } from 'vue-i18n'
import { useToaster } from '@/utils/useToaster'

const { t, locale } = useI18n()
const { showToast } = useToaster()

function changeLang(lang) {
    if (locale.value === lang) {
        showToast({
            text: t('languageAlreadySet', { lang }),
            status: 'warning',
            timeout: 1500
        })
        return
    }
    locale.value = lang
    showToast({
        text: t('languageChanged', { lang }),
        status: 'success',
        timeout: 1500
    })
}
</script>

<template>
    <div class="p-4 space-x-2">
        <button @click="changeLang('en')"
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">English</button>
        <button @click="changeLang('ro')"
            class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Romana</button>
    </div>
</template>