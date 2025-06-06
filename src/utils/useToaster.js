import { ref, readonly } from 'vue'

const toasts = ref([])

function showToast(options) {
    const id = Math.random().toString(36).substring(2, 9)
    const defaultOptions = {
        status: 'info',
        timeout: 5000,
    }

    const toast = {
        ...defaultOptions,
        ...options,
        id,
    }
    toasts.value.push(toast)
}

function removeToast(id) {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
}

export function useToaster() {
    return {
        toasts: readonly(toasts),
        showToast,
        removeToast,
    }
}