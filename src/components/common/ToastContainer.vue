<template>
    <div class="fixed bottom-6 left-6 z-[50] flex flex-col items-start pointer-events-none space-y-3">
        <TransitionGroup tag="div" enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-x-[-40px]" enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 translate-x-[-40px]" move-class="transition-transform duration-300 ease">
            <ToastBase v-for="toastItem in toasts" :key="toastItem.id" :id="toastItem.id" :text="toastItem.text"
                :status="toastItem.status" :timeout="toastItem.timeout" @close="removeToast(toastItem.id)" />
        </TransitionGroup>
    </div>
</template>

<script setup>
import ToastBase from '@/components/common/ToastBase.vue'
import { useToaster } from '@/utils/useToaster'

const { toasts, removeToast } = useToaster()
</script>