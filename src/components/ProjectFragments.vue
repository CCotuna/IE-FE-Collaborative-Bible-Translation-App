<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '@/store/project';
import { useUserStore } from '@/store/user';
import { useWordAssistantStore } from '@/store/wordAssistant';
import { ref, watch, nextTick, computed, onMounted, onBeforeUnmount } from 'vue';
import { timeSinceCreated } from '@/utils/timeSinceCreated';
import socket from '@/plugins/socket';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const userStore = useUserStore();
const wordStore = useWordAssistantStore();

const fragments = ref([]);
const projectId = parseInt(route.params.id);
const chapterId = parseInt(route.query.chapterId);

const project = computed(() => projectStore.projects.find(p => p.id === projectId));

const isSearchActive = computed(() => projectStore.isProjectSearchOpen);
const localSearchQuery = ref('');
const searchInputRef = ref(null);

watch(isSearchActive, (newValue, oldValue) => {
    if (!newValue) {
        localSearchQuery.value = '';
    } else if (newValue && !oldValue) {
        nextTick(() => {
            searchInputRef.value?.focus();
        });
    }
});

const isLoadingProject = ref(true);

onMounted(async () => {
    isLoadingProject.value = true;

    let currentProject = projectStore.projects.find(p => p.id === projectId);

    if (!currentProject) {
        console.log(`Project ${projectId} not found in store on mount. Fetching...`);
        try {
            await projectStore.fetchProjectById(projectId);
            currentProject = projectStore.projects.find(p => p.id === projectId);

            if (!currentProject) {
                console.error(`Failed to fetch project ${projectId} after explicit fetch.`);
                triggerToast(`Proiectul cu ID ${projectId} nu a putut fi încărcat.`, 'error');
                isLoadingProject.value = false;
                return;
            }
        } catch (error) {
            console.error(`Error fetching project ${projectId} on mount:`, error);
            triggerToast(`Eroare la încărcarea proiectului ${projectId}.`, 'error');
            isLoadingProject.value = false;
            return;
        }
    }

    if (project.value.type === 'Biblia') {
        await projectStore.fetchChapterFragments(projectId, chapterId);
    } else {
        await projectStore.fetchProjectFragments(projectId);
    }

    const result = projectStore.fragments.find(c => c.id === projectId);
    if (project.value.type === 'Biblia') {
        fragments.value = result ? (result.bibleFragments || []) : [];
    } else {
        fragments.value = result ? (result.fragments || []) : [];
    }

    if (projectId) {
        socket.emit('joinProjectRoom', projectId);
    }

    socket.on('newComment', (newComment) => {
        const fragment = fragments.value?.find(f => f.id === newComment.fragmentId);
        if (fragment) {
            if (!fragment.comments) fragment.comments = [];
            const alreadyExists = fragment.comments.some(c => c.id === newComment.id);
            if (!alreadyExists) {
                fragment.comments.push(newComment);
            }
        }
    });

    socket.on('commentStatusUpdated', async (updatedComment) => {
        if (!updatedComment || typeof updatedComment.status === 'undefined' || typeof updatedComment.fragmentId === 'undefined') {
            console.error("commentStatusUpdated: Socket event did not return a valid updated comment with status and fragmentId.");
            return;
        }

        let foundAndUpdateInStore = false;
        for (const fragment of fragments.value) {
            if (fragment.comments) {
                const commentIndex = fragment.comments.findIndex(c => c.id === updatedComment.id);
                if (commentIndex !== -1) {
                    fragment.comments[commentIndex] = { ...fragment.comments[commentIndex], ...updatedComment };
                    foundAndUpdateInStore = true;
                    break;
                }
            }
        }

        if (!foundAndUpdateInStore) {
            console.warn(`commentStatusUpdated: Comment with ID ${updatedComment.id} not found in local fragments for update.`);
        }

        if (updatedComment.status === "public") {
            let finalProjectId = null;
            if (updatedComment.fragment && updatedComment.fragment.projectId) {
                finalProjectId = updatedComment.fragment.projectId;
            } else {
                if (project.value && project.value.id) {
                    finalProjectId = project.value.id;
                } else {
                    console.error("commentStatusUpdated: Could not determine projectId for notification.");
                }
            }

            if (finalProjectId && userStore.user) {
                await projectStore.sendCommentNotification({
                    projectId: finalProjectId,
                    fragmentId: updatedComment.fragmentId,
                    senderId: userStore.user.id,
                    senderEmail: userStore.user.email
                });
            } else if (!userStore.user) {
                console.warn("commentStatusUpdated: User not logged in, skipping notification send.");
            }
        }
    });

    socket.on('commentSuggestionUpdated', (updatedComment) => {
        const fragment = fragments.value?.find(f => f.id === updatedComment.fragmentId);
        if (fragment && fragment.comments) {
            const commentIndex = fragment.comments.findIndex(c => c.id === updatedComment.id);
            if (commentIndex !== -1) {
                fragment.comments[commentIndex] = { ...fragment.comments[commentIndex], ...updatedComment };
                fragment.content = updatedComment.content;
            }
        }
    });
});

onBeforeUnmount(() => {
    if (projectId) {
        socket.emit('leaveProjectRoom', projectId);
    }
    socket.off('newComment');
    socket.off('commentStatusUpdated');
    socket.off('commentSuggestionUpdated');
});

const sortedFragments = computed(() => {
    if (!fragments.value || fragments.value.length === 0) return [];

    let fragmentsToDisplay = [...fragments.value];

    if (isSearchActive.value && localSearchQuery.value.trim() !== '') {
        const query = localSearchQuery.value;

        fragmentsToDisplay = fragmentsToDisplay.filter(fragment => {
            if (fragment.content) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = fragment.content;
                const textContent = tempDiv.textContent || tempDiv.innerText || "";
                return textContent.toLowerCase().includes(query);
            }
            return false;
        });
    }

    const projectType = project.value ? project.value.type : null;
    return fragmentsToDisplay.sort((a, b) => {
        if (projectType === 'Biblia') {
            return a.verseNumber - b.verseNumber;
        } else {
            return a.id - b.id;
        }
    });
});

const editingCommentId = ref(null);
const editingCommentText = ref('');
const openEditCommentForm = (comment) => {
    editingCommentId.value = comment.id;
    editingCommentText.value = comment.content;
};
const closeEditCommentForm = () => {
    editingCommentId.value = null;
    editingCommentText.value = '';
};
const saveEditedComment = async (commentId) => {
    const newContent = editingCommentText.value.trim();

    if (!newContent) {
        console.warn("Edited comment content cannot be empty.");
        return;
    }

    try {
        await projectStore.updateComment(commentId, newContent);
    } catch (error) {
        console.error("Error saving edited comment in component:", error);
    } finally {
        closeEditCommentForm();
    }
};

const openFormForFragmentId = ref(null);
const toggleForm = (fragmentId) => {
    openFormForFragmentId.value = openFormForFragmentId.value === fragmentId ? null : fragmentId;
};

const commentText = ref('');
const commentStatus = ref('private');
const addComment = async (fragmentId) => {
    if (!commentText.value.trim()) return;
    let isSuggestion = null;
    if (commentStatus.value === 'public') {
        isSuggestion = 'suggestion';
    } else if (commentStatus.value === 'private') {
        isSuggestion = 'none';
    }
    await projectStore.addComment({
        fragmentId,
        content: commentText.value,
        status: commentStatus.value,
        isSuggestion,
        projectId: projectId,
    });
    commentText.value = '';
    commentStatus.value = 'private';
    openFormForFragmentId.value = null;
};

const openCommentsForFragmentId = ref(null);
const toggleComments = (fragmentId) => {
    openCommentsForFragmentId.value =
        openCommentsForFragmentId.value === fragmentId ? null : fragmentId;
};

const visibleComments = (fragment) => {
    if (!fragment.comments || !userStore.user) return [];
    return fragment.comments.filter(
        (comment) =>
            comment.status === 'public' || comment.userId === userStore.user.id
    );
};

const selectedCommentIdForStatus = ref(null);
const isToggleStatusModalOpen = ref(false);
const openCommentStatusModal = (commentId) => {
    selectedCommentIdForStatus.value = commentId;
    isToggleStatusModalOpen.value = true;
};
const closeCommentStatusModal = () => {
    isToggleStatusModalOpen.value = false;
    selectedCommentIdForStatus.value = null;
};
const toggleCommentStatus = async () => {
    if (!selectedCommentIdForStatus.value) return;
    try {
        await projectStore.toggleCommentStatus(selectedCommentIdForStatus.value);
    } catch (error) {
        console.error('Error toggling comment status:', error);
    } finally {
        closeCommentStatusModal();
    }
};

const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

const triggerToast = (message, type = 'success') => {
    toastMessage.value = message;
    toastType.value = type;
    showToast.value = true;

    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

const isCurrentUserProjectOwner = computed(() => {
    if (!userStore.user || !project.value) {
        return false;
    }
    return userStore.user.id === project.value.userId;
});

const selectedCommentIdForSuggestion = ref(null);
const commentToToggleSuggestion = ref(null);
const isToggleSuggestionModalOpen = ref(false);

const openToggleSuggestionModal = (comment) => {
    if (!isCurrentUserProjectOwner.value) {
        triggerToast("Doar proprietarul proiectului poate modifica sugestiile de comentarii.", 'error');
        return;
    }
    selectedCommentIdForSuggestion.value = comment.id;
    commentToToggleSuggestion.value = comment;
    isToggleSuggestionModalOpen.value = true;
};

const closeToggleSuggestionModal = () => {
    isToggleSuggestionModalOpen.value = false;
    selectedCommentIdForSuggestion.value = null;
    commentToToggleSuggestion.value = null;
};

const confirmToggleCommentSuggestion = async () => {
    if (!selectedCommentIdForSuggestion.value) return;
    try {
        await projectStore.toggleCommentSuggestion(selectedCommentIdForSuggestion.value);
        const actionText = commentToToggleSuggestion.value?.isSuggestion === 'accepted' ? "anulată ca adnotare" : "acceptată ca adnotare";
        triggerToast(`Sugestia a fost ${actionText} cu succes.`, 'success');
    } catch (error) {
        console.error('Error toggling comment suggestion from modal:', error);
        triggerToast('A apărut o eroare la modificarea sugestiei.', 'error');
    } finally {
        closeToggleSuggestionModal();
    }
};

const isDeleteCommentModalOpen = ref(false);
const commentToDeleteId = ref(null);
const fragmentOfCommentToDeleteId = ref(null);

const openDeleteCommentModal = (commentId, fragmentId) => {
    commentToDeleteId.value = commentId;
    fragmentOfCommentToDeleteId.value = fragmentId;
    isDeleteCommentModalOpen.value = true;
};

const closeDeleteCommentModal = () => {
    isDeleteCommentModalOpen.value = false;
    commentToDeleteId.value = null;
    fragmentOfCommentToDeleteId.value = null;
};

const confirmDeleteComment = async () => {
    if (commentToDeleteId.value && fragmentOfCommentToDeleteId.value) {
        try {
            await projectStore.deleteComment(commentToDeleteId.value, fragmentOfCommentToDeleteId.value);

            const fragment = fragments.value.find(f => f.id === fragmentOfCommentToDeleteId.value);
            if (fragment && fragment.comments) {
                const commentIndex = fragment.comments.findIndex(c => c.id === commentToDeleteId.value);
                if (commentIndex !== -1) {
                    fragment.comments.splice(commentIndex, 1);
                }
            }
            closeEditCommentForm();
        } catch (error) {
            console.error("Error deleting comment from component:", error);
        } finally {
            closeDeleteCommentModal();
        }
    }
};

const isTooltipVisible = ref(false);
const tooltipStyle = ref({});
const selectedTextForAI = ref('');

const expandSelectionToWord = (selection) => {
    const range = selection.getRangeAt(0);
    const text = range.commonAncestorContainer.textContent;
    let start = range.startOffset;
    let end = range.endOffset;

    while (start > 0 && /\w/.test(text[start - 1])) {
        start--;
    }

    while (end < text.length && /\w/.test(text[end])) {
        end++;
    }

    const newRange = document.createRange();
    newRange.setStart(range.commonAncestorContainer, start);
    newRange.setEnd(range.commonAncestorContainer, end);

    selection.removeAllRanges();
    selection.addRange(newRange);

    return newRange;
};


const showTooltip = (event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    const fragmentsContainer = document.querySelector('.fragments-list-container');
    if (!fragmentsContainer || !fragmentsContainer.contains(selection.anchorNode)) {
        isTooltipVisible.value = false;
        return;
    }

    if (selectedText) {
        const expandedRange = expandSelectionToWord(selection);
        selectedTextForAI.value = selection.toString().trim();

        isTooltipVisible.value = true;
        const rangeRect = expandedRange.getBoundingClientRect();

        tooltipStyle.value = {
            top: `${rangeRect.top + window.scrollY - 155}px`,
            left: `${rangeRect.left + window.scrollX + (rangeRect.width / 2) - 20}px`
        };
    } else {
        isTooltipVisible.value = false;
        selectedTextForAI.value = '';
    }
};

const handleClickOutside = (event) => {
    const tooltipElement = document.querySelector('.ai-tooltip');
    if (tooltipElement && !tooltipElement.contains(event.target)) {
        isTooltipVisible.value = false;
    }
};

onMounted(() => {
    document.addEventListener('mouseup', showTooltip);
    document.addEventListener('touchend', showTooltip);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('mouseup', showTooltip);
    document.removeEventListener('touchend', showTooltip);
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('touchstart', handleClickOutside);
});

watch(isTooltipVisible, (newValue) => {
    if (!newValue) {
        tooltipStyle.value = {};
    }
});
</script>

<template>
    <!-- Salut {{ sortedFragments}} -->
    <div>
        <div v-if="isSearchActive"
            class="p-3 bg-white border-b border-gray-200 sticky top-0 z-40 flex items-center space-x-3 shadow-sm">
            <div class="relative flex-grow">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <i class="bi bi-search text-gray-400"></i>
                </div>
                <input type="text" v-model="localSearchQuery" placeholder="Caută în fragmente (case-insensitive)..."
                    class="block w-full p-2 ps-10 text-sm text-gray-900 border-2 border-brand-olivine/50 rounded-lg 
                   focus:ring-brand-olivine focus:border-brand-olivine 
                   placeholder-gray-400 transition-colors duration-150" ref="searchInputRef" />
            </div>
        </div>
        <!-- {{ project }} -->
        <div v-if="sortedFragments" class="fragments-list-container">
            <div class="p-3">
                <ul class="space-y-6">
                    <li v-for="fragment in sortedFragments" :key="fragment.id">
                        <p class="flex items-center text-gray-900 mb-1 text-lg fragment-content">
                            <span
                                class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md transition-colors duration-200 cursor-pointer me-2"
                                :class="openFormForFragmentId === fragment.id ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-brand-olivine text-white hover:bg-brand-tea-green hover:text-black'"
                                @click="toggleForm(fragment.id)">
                                <i
                                    :class="openFormForFragmentId === fragment.id ? 'bi bi-dash-lg' : 'bi bi-plus-lg'"></i>
                            </span>
                            <span class="flex-grow">
                                <span v-if="fragment.verseNumber != null" class="font-bold me-1">{{ fragment.verseNumber
                                }}. </span>
                                <span v-html="fragment.content"></span>
                            </span>
                        </p>


                        <!-- {{ fragment }} -->
                        <div v-if="visibleComments(fragment).length > 0" class="flex items-center space-x-2 mb-1 ms-8"
                            :class="openCommentsForFragmentId === fragment.id ? 'ms-4' : 'ms-0'">
                            <div v-if="openCommentsForFragmentId !== fragment.id"
                                class="flex items-center space-x-2 cursor-pointer" @click="toggleComments(fragment.id)">
                                <span class="rounded-full bg-gray-400 text-white text-sm px-4 -ms-1 py-0.5">
                                    {{ visibleComments(fragment).length }}
                                </span>
                                <i class="bi bi-bell-fill text-gray-400 text-lg"></i>
                            </div>
                            <div v-else class="cursor-pointer" @click="toggleComments(fragment.id)">
                                <button
                                    class="rounded-e-full w-20 -ms-6 flex items-center justify-center bg-brand-olivine text-white text-xl">
                                    <span class="text-xl"> {{ visibleComments(fragment).length }}</span>
                                    <i class="bi bi-chevron-double-down text-xl ms-4"></i>
                                </button>
                            </div>
                        </div>

                        <div v-if="openCommentsForFragmentId === fragment.id && fragment.comments?.length">
                            <ul class="border-s-8 border-brand-olivine -mt-8 -mb-12 pt-2" :class="{
                                'pb-12': !editingCommentId && (openFormForFragmentId === fragment.id || (fragment.comments && fragment.comments.length > 0)),
                                'pb-5 mb-4': !editingCommentId && openFormForFragmentId !== fragment.id && fragment.comments && fragment.comments.length > 0,
                                'pb-0 mb-0': editingCommentId,
                            }">
                                <li v-for="comment in visibleComments(fragment)" :key="comment.id"
                                    class="text-sm text-gray-700 relative mt-3">

                                    <div class="py-4">
                                        <p :class="{
                                            'text-base p-4 rounded-md flex flex-col': true,
                                            'bg-brand-cornsilk': comment.userId === userStore.user.id,
                                            'bg-white': comment.userId !== userStore.user.id
                                        }">
                                            <span>{{ comment.content }}</span>
                                        </p>
                                    </div>

                                    <div v-if="editingCommentId === comment.id" class="ps-2 pe-0 pb-0 pt-6">
                                        <div class="flex justify-between items-center mb-2 border rounded-lg p-1 px-2">
                                            <div class="flex space-x-5 text-brand-olivine">
                                                <span @click="closeEditCommentForm()" class="text-2xl cursor-pointer">
                                                    <i class="bi bi-chevron-left text-brand-gold-metallic"></i>
                                                </span>
                                                <div class="flex space-x-2">
                                                    <i class="bi bi-type-bold px-2 text-2xl rounded-md"></i>
                                                    <i class="bi bi-type-underline px-2 text-2xl rounded-md"></i>
                                                    <i class="bi bi-type-italic px-2 text-2xl rounded-md"></i>
                                                </div>
                                            </div>
                                            <span class="text-2xl text-brand-olivine cursor-pointer"
                                                @click="openDeleteCommentModal(comment.id, fragment.id)">
                                                <i class="bi bi-trash"></i>
                                            </span>
                                        </div>
                                        <textarea v-model="editingCommentText" required
                                            class="w-full p-2 border border-gray-300 rounded-lg" rows="4"
                                            placeholder="Editează comentariul aici..."></textarea>

                                        <button
                                            class="mt-2 px-4 py-2 bg-brand-olivine text-white rounded-lg hover:bg-brand-olivine-light"
                                            @click="saveEditedComment(comment.id)">
                                            Salvează modificările
                                        </button>
                                    </div>

                                    <div class="absolute left-2 flex items-center"
                                        :class="editingCommentId === comment.id ? 'bottom-52' : '-bottom-6'">
                                        <div class="bg-white rounded-full w-12 h-12 flex items-center justify-center">
                                            <div
                                                class="bg-white rounded-full w-8 h-8 flex items-center justify-center border border-brand-olivine">
                                                <span class="font-medium text-brand-olivine uppercase">
                                                    CA
                                                </span>
                                            </div>
                                        </div>
                                        <p class="text-gray-400 text-md p-2 ps-0 pt-2">
                                            {{ timeSinceCreated(comment.createdAt) }}
                                        </p>
                                    </div>

                                    <div
                                        v-if="(comment.userId === userStore.user.id) || (isCurrentUserProjectOwner && comment.status === 'public' && editingCommentId !== comment.id)">
                                        <div v-if="comment.userId === userStore.user.id && comment.status === 'private' && editingCommentId !== comment.id"
                                            class="absolute -bottom-5 right-0 bg-white rounded-s-full w-[6.5rem] h-12">
                                            <i @click="openEditCommentForm(comment)"
                                                class="bi bi-pen bg-white shadow-md cursor-pointer text-brand-gold-metallic rounded-full p-2 flex items-center justify-center absolute bottom-1 right-28 w-10 h-10 text-2xl"></i>
                                            <button @click="openCommentStatusModal(comment.id)"
                                                class="absolute bottom-1 right-0 rounded-s-full py-1 w-24 bg-white border-brand-gold-metallic border text-brand-gold-metallic text-xl">
                                                Privat
                                            </button>
                                        </div>

                                        <div v-if="comment.status === 'public' && editingCommentId !== comment.id"
                                            class="absolute -bottom-4 right-0 bg-white rounded-s-full w-[6.5rem] h-12">
                                            <div
                                                class="bg-white rounded-s-full w-[6.5rem] h-12 flex items-center relative z-10">
                                                <div @click="openToggleSuggestionModal(comment)"
                                                    :class="['bg-white rounded-full w-12 h-12 flex items-center justify-center z-10 relative right-6 -bottom-1',
                                                        isCurrentUserProjectOwner ? 'cursor-pointer' : 'cursor-not-allowed']">
                                                    <i :class="[
                                                        'bi bi-repeat rounded-full p-2 flex items-center justify-center w-10 h-10 text-2xl',
                                                        comment.isSuggestion === 'accepted'
                                                            ? 'bg-brand-olivine text-white'
                                                            : 'bg-white text-brand-olivine'
                                                    ]">
                                                    </i>
                                                </div>

                                                <button
                                                    @click="comment.userId === userStore.user.id ? openCommentStatusModal(comment.id) : null"
                                                    :class="['absolute bottom-1 right-0 rounded-s-full py-1 w-28 bg-brand-gold-metallic text-white text-xl',
                                                        comment.userId === userStore.user.id ? 'cursor-pointer' : 'cursor-not-allowed opacity-75']">
                                                    <span class="ms-4">Public</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </li>
                            </ul>
                        </div>

                        <div v-if="openFormForFragmentId === fragment.id && editingCommentId === null" :class="{
                            'border-s-8 border-brand-olivine -mb-2 px-3': true,
                            'pt-8': openCommentsForFragmentId === fragment.id && fragment.comments && fragment.comments.length > 0,
                            'pt-0': openCommentsForFragmentId !== fragment.id || (fragment.comments && fragment.comments.length === 0)
                        }">
                            <textarea v-model="commentText" required
                                class="w-full p-2 border border-gray-300 rounded-lg" rows="4"
                                placeholder="Scrie un comentariu nou..."></textarea>

                            <select v-model="commentStatus" required
                                class="border border-gray-300 p-2 mb-4 md:mb-0 md:me-4 rounded-md w-full max-w-xs">
                                <option value="private">Privat</option>
                                <option value="public">Public</option>
                            </select>

                            <button
                                class="mt-2 px-4 py-2 bg-brand-olivine text-white rounded-lg hover:bg-brand-olivine-light"
                                @click="addComment(fragment.id)">
                                Creează comentariu
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div v-else>
            <p>Project not found</p>
        </div>

        <div v-if="isTooltipVisible"
            class="ai-tooltip fixed bg-white p-2 md:p-3 rounded-lg shadow-lg z-[100]
                before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2
                before:border-8 before:border-solid before:border-t-white before:border-x-transparent before:border-b-transparent"
            :style="tooltipStyle">
            <div class="flex flex-col items-start space-y-1 md:space-y-2">
                <div class="flex items-center space-x-2">
                    <span class="text-black text-lg md:text-xl font-extrabold">AI <i class="bi bi-stars"></i></span>
                </div>
                <div class="flex items-center space-x-2">
                    <i class="bi bi-translate text-orange-500"></i> <span
                        class="text-gray-800 text-sm md:text-base">Traduceri</span>
                </div>
                <div class="flex items-center space-x-2">
                    <i class="bi bi-files text-orange-500"></i> <span
                        class="text-gray-800 text-sm md:text-base">Sinonime</span>
                </div>
                <div class="flex items-center space-x-2">
                    <i class="bi bi-bookmark text-orange-500"></i> <span
                        class="text-gray-800 text-sm md:text-base">Expresii</span>
                </div>
            </div>
        </div>

        <div v-if="isToggleStatusModalOpen"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-8 shadow-lg text-center">
                <h2 class="text-lg mb-4">Ești sigur că dorești<br> să schimbi vizibilitatea acestui text<br> în modul
                    public?</h2>
                <div class="flex justify-around mt-4">
                    <button @click="toggleCommentStatus"
                        class="bg-brand-olivine text-white text-lg px-8 py-2 rounded-full">Confirm</button>
                    <button @click="closeCommentStatusModal"
                        class="bg-brand-honeydew text-brand-olivine text-lg px-8 py-2 rounded-full">Renunț</button>
                </div>
            </div>
        </div>

        <div v-if="isDeleteCommentModalOpen"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-8 shadow-lg text-center max-w-md w-full mx-4">
                <h2 class="text-xl font-semibold mb-2">Confirmare Ștergere</h2>
                <p class="text-gray-700 mb-6">Ești sigur că dorești să ștergi acest comentariu? Acțiunea este
                    ireversibilă.</p>
                <div class="flex justify-around mt-4">
                    <button @click="confirmDeleteComment"
                        class="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-2 rounded-full transition-colors">Șterge</button>
                    <button @click="closeDeleteCommentModal"
                        class="bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg px-8 py-2 rounded-full transition-colors">Anulează</button>
                </div>
            </div>
        </div>

        <div v-if="isToggleSuggestionModalOpen && commentToToggleSuggestion"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-8 shadow-lg text-center max-w-md w-full mx-4">
                <h2 class="text-xl font-semibold mb-2">Confirmare Modificare Adnotare</h2>
                <p v-if="!commentToToggleSuggestion.isSuggestion" class="text-gray-700 mb-6">
                    Ești sigur că dorești să accepți acest comentariu ca adnotare pentru fragment?
                    Conținutul fragmentului va fi actualizat cu textul comentariului.
                </p>
                <p v-else class="text-gray-700 mb-6">
                    Ești sigur că dorești să anulezi acest comentariu ca adnotare pentru fragment?
                    Conținutul fragmentului nu va mai fi cel al comentariului (dar nu va reveni automat la o stare
                    anterioară specifică prin această acțiune).
                </p>
                <div class="flex justify-around mt-4">
                    <button @click="confirmToggleCommentSuggestion"
                        class="bg-brand-olivine hover:bg-brand-olivine-dark text-white text-lg px-8 py-2 rounded-full transition-colors">Confirmă</button>
                    <button @click="closeToggleSuggestionModal"
                        class="bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg px-8 py-2 rounded-full transition-colors">Anulează</button>
                </div>
            </div>
        </div>

        <div v-if="showToast"
            class="fixed bottom-4 left-4 text-white px-6 py-3 rounded-lg shadow-lg z-[100] transition-all duration-300"
            :class="{
                'bg-red-600': toastType === 'error',
                'bg-brand-olivine': toastType === 'success',
            }">
            {{ toastMessage }}
        </div>
    </div>
</template>