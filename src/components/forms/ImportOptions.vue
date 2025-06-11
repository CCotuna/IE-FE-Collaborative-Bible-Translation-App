<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const props = defineProps({
    currentSelectedOption: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['option-selected']);

const selectOption = (optionValue) => {
    emit('option-selected', optionValue);
}
</script>
<template>
    <span>{{ t('importView.textSplitter.label') }}</span>
    <button @click="selectOption('Punct')"
        :class="currentSelectedOption === 'Punct' ? 'border border-brand-olivine text-brand-olivine' : 'border border-gray-200 text-black'"
        class="py-2 rounded-md transition">
        {{ t('importView.textSplitter.options.period') }}
    </button>

    <button @click="selectOption('Rand nou')"
        :class="currentSelectedOption === 'Rand nou' ? 'border border-brand-olivine text-brand-olivine' : 'border border-gray-200 text-black'"
        class=" py-2 rounded-md transition">
        {{ t('importView.textSplitter.options.newline') }}
    </button>

    <button @click="selectOption('Text continuu')"
        :class="currentSelectedOption === 'Text continuu' ? 'border border-brand-olivine text-brand-olivine' : 'border border-gray-200 text-black'"
        class="py-2 rounded-md transition">
        {{ t('importView.textSplitter.options.continuousText') }}
    </button>

    <button @click="selectOption('Paragrafe')"
        :class="currentSelectedOption === 'Paragrafe' ? 'border border-brand-olivine text-brand-olivine' : 'border border-gray-200 text-black'"
        class=" py-2 rounded-md transition">
        {{ t('importView.textSplitter.options.paragraphs') }}
    </button>
</template>
<style scoped></style>