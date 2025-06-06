import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import ro from '@/locales/ro.json'

const messages = {
    en,
    ro
}

const i18n = createI18n({
    legacy: false,
    locale: 'ro',
    fallbackLocale: 'ro',
    messages
})

export default i18n