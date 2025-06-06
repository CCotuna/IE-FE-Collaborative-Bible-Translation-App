<template>
    <transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="visible" :class="toastClasses"
            class="pointer-events-auto relative flex min-w-[250px] max-w-sm items-center gap-3 overflow-hidden rounded-md p-4 mt-2 shadow-lg"
            @mouseenter="pauseTimer" @mouseleave="resumeTimer">
            <span class="text-2xl">{{ icon }}</span>
            <span class="flex-1 text-sm font-medium">{{ props.text }}</span>
            <button @click="hideAndEmitClose" type="button" :class="closeButtonClasses"
                class="-m-1.5 inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2">
                <span class="sr-only">Close</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                        d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
            </button>
            <div class="absolute bottom-0 left-0 h-1 transition-[width] duration-100 ease-linear"
                :class="progressBackgroundClass" :style="{ width: progressWidthPercent + '%' }"></div>
        </div>
    </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    id: { type: [String, Number], required: true },
    text: { type: String, required: true },
    status: {
        type: String,
        default: 'info',
        validator: v => ['success', 'info', 'warning', 'error'].includes(v)
    },
    timeout: {
        type: Number,
        default: 5000
    }
})

const emit = defineEmits(['close'])

const visible = ref(true)
const progressWidthPercent = ref(100)

let timeoutId = null
let intervalId = null
let startTime = 0
let remainingTime = props.timeout

const statusConfig = {
    success: {
        icon: '✅',
        base: 'bg-green-950 text-white border-l-4 border-white',
        progress: 'bg-white',
        closeButton: 'text-green-500 hover:text-green-700 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50'
    },
    info: {
        icon: 'ℹ️',
        base: 'bg-blue-50 text-blue-800 border-l-4 border-blue-500',
        progress: 'bg-blue-500',
        closeButton: 'text-blue-500 hover:text-blue-700 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50'
    },
    warning: {
        icon: '⚠️',
        base: 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500',
        progress: 'bg-yellow-500',
        closeButton: 'text-yellow-500 hover:text-yellow-700 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50'
    },
    error: {
        icon: '❌',
        base: 'bg-red-50 text-red-800 border-l-4 border-red-500',
        progress: 'bg-red-500',
        closeButton: 'text-red-500 hover:text-red-700 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50'
    }
}

const currentConfig = computed(() => statusConfig[props.status] || statusConfig.info)
const icon = computed(() => currentConfig.value.icon)
const toastClasses = computed(() => currentConfig.value.base)
const progressBackgroundClass = computed(() => currentConfig.value.progress)
const closeButtonClasses = computed(() => currentConfig.value.closeButton)

function hideAndEmitClose() {
    visible.value = false
    emit('close', props.id)
}

function startTimer() {
    if (props.timeout <= 0) return
    clearExistingTimers()
    startTime = Date.now()
    remainingTime = props.timeout
    progressWidthPercent.value = 100
    timeoutId = setTimeout(hideAndEmitClose, remainingTime)
    intervalId = setInterval(() => {
        const elapsedTime = Date.now() - startTime
        progressWidthPercent.value = Math.max(0, 100 - (elapsedTime / props.timeout) * 100)
    }, 50)
}

function pauseTimer() {
    if (props.timeout <= 0) return
    clearTimeout(timeoutId)
    clearInterval(intervalId)
    remainingTime -= (Date.now() - startTime)
}

function resumeTimer() {
    if (props.timeout <= 0) return
    startTime = Date.now()
    clearExistingTimers()
    if (remainingTime > 0) {
        timeoutId = setTimeout(hideAndEmitClose, remainingTime)
        intervalId = setInterval(() => {
            const elapsedTimeSinceResume = Date.now() - startTime
            const totalElapsedTime = (props.timeout - remainingTime) + elapsedTimeSinceResume
            progressWidthPercent.value = Math.max(0, 100 - (totalElapsedTime / props.timeout) * 100)
        }, 50)
    } else {
        hideAndEmitClose()
    }
}

function clearExistingTimers() {
    clearTimeout(timeoutId)
    clearInterval(intervalId)
    timeoutId = null
    intervalId = null
}

onMounted(startTimer)
onUnmounted(clearExistingTimers)
</script>