<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useTippy } from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import 'tippy.js/themes/light.css';
import { useInlineFormStore } from '@/store/inlineForm';

const props = defineProps({
    contentHtml: {
        type: String,
        required: true
    },
    fragmentId: {
        type: [Number, String],
        required: true
    }
});

const inlineFormStore = useInlineFormStore();
const contentWrapperRef = ref(null);
const selectedTextContent = ref('');
let tippyApi = null;
let dummyElement = null;

const isWordChar = (character) => {
    if (!character) return false;
    return /[a-zA-Z0-9ăâîșțĂÂÎȘȚ]/.test(character);
};

const generateTooltipHtml = () => {
    const translateIconClass = "bi bi-translate";
    const synonymsIconClass = "bi bi-files";
    const expressionsIconClass = "bi bi-bookmark";

    return `
    <div class="bg-white p-2 rounded-xl w-auto">
        <div class="flex flex-col items-start space-y-1 md:space-y-1.5"> 
            <div class="flex items-center space-x-1 mb-1 w-full cursor-default text-xl">
                <span class="text-black font-bold">AI</span> 
                <i class="bi bi-stars text-brand-gold-metallic"></i>
            </div>
            <button data-action="translate" class="flex items-center space-x-2 text-xl">
                <i class="${translateIconClass} text-brand-gold-metallic text-2xl"></i>
                <span class="text-gray-800 hover:text-brand-gold-metallic">Traduceri</span>
            </button>
            <button data-action="synonyms" class="flex items-center space-x-2 text-xl">
                <i class="${synonymsIconClass} text-brand-gold-metallic text-2xl"></i>
                <span class="text-gray-800 hover:text-brand-gold-metallic">Sinonime</span>
            </button>
            <button data-action="expressions" class="flex items-center space-x-2 text-xl">
                <i class="${expressionsIconClass} text-brand-gold-metallic text-2xl"></i>
                <span class="text-gray-800 hover:text-brand-gold-metallic">Expresii</span>
            </button>
        </div>
    </div>
    `;
};
const createAndShowTippy = (rangeOrRect) => {
    if (tippyApi && typeof tippyApi.destroy === 'function') tippyApi.destroy();
    tippyApi = null;
    if (dummyElement && dummyElement.parentNode) dummyElement.parentNode.removeChild(dummyElement);
    dummyElement = null;

    let rect;
    if (rangeOrRect instanceof DOMRect) rect = rangeOrRect;
    else if (rangeOrRect instanceof Range) rect = rangeOrRect.getBoundingClientRect();
    else { console.error("Invalid argument for createAndShowTippy."); return; }

    const newDummyElement = document.createElement('div');
    newDummyElement.style.position = 'absolute';
    newDummyElement.style.top = `${rect.top + window.scrollY - 10}px`;
    newDummyElement.style.left = `${rect.left + window.scrollX + (rect.width / 2)}px`;
    newDummyElement.style.width = `1px`;
    newDummyElement.style.height = `1px`;
    newDummyElement.style.pointerEvents = 'none';
    document.body.appendChild(newDummyElement);
    dummyElement = newDummyElement;

    const instance = useTippy(dummyElement, {
        trigger: 'manual',
        allowHTML: true,
        interactive: true,
        animation: 'scale',
        placement: 'top',
        theme: 'light',
        appendTo: document.body,
        offset: [0, 12],
        content: generateTooltipHtml(),
        popperOptions: {
            modifiers: [
                { name: 'computeStyles', options: { adaptive: false, }, },
            ],
        },
        onShow: (tippyInstance) => {
            nextTick(() => {
                const tippyBox = tippyInstance.popper;
                if (!tippyBox) return;

                const allActionButtons = tippyBox.querySelectorAll('button.flex');
                allActionButtons.forEach(button => {
                    const actionType = button.dataset.action;
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);

                    newButton.addEventListener('click', (event) => {
                        event.stopPropagation();
                        if (tippyApi) tippyApi.hide();
                        inlineFormStore.openForm(actionType, selectedTextContent.value, props.fragmentId);
                    });
                });
            });
        },
        onHide: () => {
            if (dummyElement && dummyElement.parentNode) {
                dummyElement.parentNode.removeChild(dummyElement);
                dummyElement = null;
            }
        },
        onHidden: (tippyInstance) => {
            if (tippyApi && tippyApi.tippy === tippyInstance) tippyApi = null;
        },
    });

    if (instance && instance.tippy) {
        tippyApi = instance;
        tippyApi.show();
    } else {
        if (newDummyElement && newDummyElement.parentNode) {
            newDummyElement.parentNode.removeChild(newDummyElement);
            if (dummyElement === newDummyElement) dummyElement = null;
        }
    }
};

const processSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        if (tippyApi) tippyApi.hide();
        return;
    }

    let range = selection.getRangeAt(0);
    let originalSelectedText = selection.toString();

    if (!contentWrapperRef.value || !range.startContainer || !contentWrapperRef.value.contains(range.startContainer)) {
        if (tippyApi) tippyApi.hide();
        return;
    }

    if (originalSelectedText.trim().length > 0) {
        const startNode = range.startContainer;
        const endNode = range.endContainer;
        let startOffset = range.startOffset;
        let endOffset = range.endOffset;
        let modified = false;

        if (startNode && startNode.nodeType === Node.TEXT_NODE && startOffset > 0) {
            const textBeforeStart = startNode.textContent.substring(0, startOffset);
            if (isWordChar(textBeforeStart[startOffset - 1]) && isWordChar(startNode.textContent[startOffset])) {
                while (startOffset > 0 && isWordChar(startNode.textContent[startOffset - 1])) {
                    startOffset--;
                    modified = true;
                }
            }
        }

        if (endNode && endNode.nodeType === Node.TEXT_NODE && endOffset < endNode.textContent.length) {
            if (isWordChar(endNode.textContent[endOffset]) && isWordChar(endNode.textContent[endOffset - 1])) {
                while (endOffset < endNode.textContent.length && isWordChar(endNode.textContent[endOffset])) {
                    endOffset++;
                    modified = true;
                }
            }
        }

        if (modified && startNode === endNode && startNode.nodeType === Node.TEXT_NODE) {
            try {
                range.setStart(startNode, startOffset);
                range.setEnd(startNode, endOffset);
                selection.removeAllRanges();
                selection.addRange(range);
            } catch (e) {
                console.error("Error adjusting selection range:", e);
                range = selection.getRangeAt(0);
            }
        }
    }

    const finalSelectedText = selection.toString().trim();

    if (finalSelectedText.length === 0) {
        if (tippyApi) tippyApi.hide();
        return;
    }

    if (inlineFormStore.isFormOpen) {
        if (tippyApi) tippyApi.hide();
        return;
    }

    selectedTextContent.value = finalSelectedText;

    const finalRange = selection.getRangeAt(0);
    const rangeRect = finalRange.getBoundingClientRect();
    if (rangeRect.width > 0 || rangeRect.height > 0) {
        nextTick(() => {
            createAndShowTippy(rangeRect);
        });
    } else {
        if (tippyApi) tippyApi.hide();
    }
};
let lastClickTime = 0;
let clickSequenceCount = 0;

const handleMouseUp = (event) => {
    if (event.target.closest('.tippy-box') || inlineFormStore.isFormOpen) {
        return;
    }
    setTimeout(() => {
        processSelection();
    }, 50);
};

const handleClick = (event) => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 350) {
        clickSequenceCount++;
    } else {
        clickSequenceCount = 1;
    }
    lastClickTime = currentTime;

    if (clickSequenceCount === 3) {
        const selection = window.getSelection();
        if (contentWrapperRef.value && selection) {
            selection.selectAllChildren(contentWrapperRef.value);
            setTimeout(processSelection, 0);
        }
        clickSequenceCount = 0;
    }
};

const handleClickOutside = (event) => {
    const tippyBox = tippyApi && tippyApi.popper;
    const clickedElement = event.target;
    const isClickInsideContentWrapper = contentWrapperRef.value && contentWrapperRef.value.contains(clickedElement);
    const isClickInsideTippy = tippyBox && tippyBox.contains(clickedElement);
    const globalInlineForm = document.querySelector('.global-inline-form-active');
    const isClickInsideGlobalForm = globalInlineForm && globalInlineForm.contains(clickedElement);

    if (!isClickInsideContentWrapper && !isClickInsideTippy && !isClickInsideGlobalForm) {
        if (tippyApi && tippyApi.tippy && tippyApi.tippy.isVisible) {
            if (!inlineFormStore.isFormOpen || inlineFormStore.targetFragmentId !== props.fragmentId) {
                tippyApi.hide();
            }
        }
    }
};

onMounted(() => {
    if (contentWrapperRef.value) {
        contentWrapperRef.value.addEventListener('mouseup', handleMouseUp);
        contentWrapperRef.value.addEventListener('click', handleClick);
    }
    document.addEventListener('mousedown', handleClickOutside, true);
});

onBeforeUnmount(() => {
    if (contentWrapperRef.value) {
        contentWrapperRef.value.removeEventListener('mouseup', handleMouseUp);
        contentWrapperRef.value.removeEventListener('click', handleClick);
    }
    document.removeEventListener('mousedown', handleClickOutside, true);
    if (tippyApi && typeof tippyApi.destroy === 'function') tippyApi.destroy();
    if (dummyElement && dummyElement.parentNode) dummyElement.parentNode.removeChild(dummyElement);
    tippyApi = null;
    dummyElement = null;
});
</script>

<template>
    <span ref="contentWrapperRef" class="selectable-content" v-html="props.contentHtml"></span>
</template>

<style scoped>
.selectable-content::selection {
    background-color: #85B56F;
    color: #ffffff;
}
</style>