<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '@/store/project';
import { useUserStore } from '@/store/user';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { timeSinceCreated } from '@/utils/timeSinceCreated';

import socket from '@/plugins/socket';

const route = useRoute();
const router = useRouter();

const projectStore = useProjectStore();
const userStore = useUserStore();

const fragments = ref([]);

const projectId = parseInt(route.params.id)
const chapterId = parseInt(route.query.chapterId)

onMounted(async () => {
    const project = projectStore.projects.find(p => p.id === projectId)

  if (!project) {
    return
  }

  if (project.type === 'Biblia') {
    await projectStore.fetchChapterFragments(projectId, chapterId)
     const result = projectStore.fragments.find(c => c.id === projectId);
    fragments.value = result ? result.bibleFragments : [];
  } else {

    await projectStore.fetchProjectFragments(projectId)
     const result = projectStore.fragments.find(c => c.id === projectId);
    fragments.value = result ? result.fragments : [];
  }

    socket.emit('joinProjectRoom', projectId)

    socket.on('newComment', (newComment) => {
        const fragment = fragments.value?.find(f => f.id === newComment.fragmentId)
        if (fragment) {
            if (!fragment.comments) fragment.comments = []
            const alreadyExists = fragment.comments.some(c => c.id === newComment.id)
            if (!alreadyExists) fragment.comments.push(newComment)
        }
    })

    socket.on('commentStatusUpdated', (updatedComment) => {
        const fragment = fragments.value?.find(f => f.id === updatedComment.fragmentId)
        if (fragment) {
            const commentIndex = fragment.comments.findIndex(c => c.id === updatedComment.id)
            if (commentIndex !== -1) {
                fragment.comments[commentIndex] = updatedComment
            }
        }
    })
})

onBeforeUnmount(() => {
    const projectId = parseInt(route.params.id)
    socket.emit('leaveProjectRoom', projectId)
    socket.off('newComment')
    socket.off('commentStatusUpdated')
    socket.off('commentDeleted')
})

const sortedFragments = computed(() => {
    return fragments.value?.slice().sort((a, b) => a.verseNumber - b.verseNumber) || [];
});

const openFormForFragmentId = ref(null);

const toggleForm = (fragmentId) => {
    openFormForFragmentId.value = openFormForFragmentId.value === fragmentId ? null : fragmentId;
};

const commentText = ref('');
const commentStatus = ref('private');

const addComment = async (fragmentId) => {
    if (!commentText.value.trim()) return;

    await projectStore.addComment({
        fragmentId,
        content: commentText.value,
        status: commentStatus.value
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
    if (!fragment.comments) return [];

    return fragment.comments.filter(
        (comment) =>
            comment.status === 'public' || comment.userId === userStore.user.id
    );
};

const selectedCommentId = ref(null);
const isToggleStatusModalOpen = ref(false);

const openCommentStatusModal = (commentId) => {
    selectedCommentId.value = commentId;
    isToggleStatusModalOpen.value = true;
}

const closeCommentStatusModal = () => {
    isToggleStatusModalOpen.value = false;
    selectedCommentId.value = null;
}

const toggleCommentStatus = async () => {
    if (!selectedCommentId.value) return;

    try {
        projectStore.toggleCommentStatus(selectedCommentId.value)
    } catch (error) {
        console.error('Error toggling comment status:', error);
    } finally {
        closeCommentStatusModal();
    }
}

const editingCommentId = ref(null);
const openEditCommentForm = (commentId) => {
    editingCommentId.value = commentId;
}

const closeEditCommentForm = () => {
    editingCommentId.value = null;
}
</script>

<template>
    <!-- Salut {{ sortedFragments}} -->
    <!-- {{ project }} -->
    <div>
        <div v-if="sortedFragments">
            <div class="p-3">
                <ul class="space-y-6">
                    <li v-for="fragment in sortedFragments" :key="fragment.id">
                        <p class="text-gray-900 cursor-pointer mb-1 text-lg" @click="toggleForm(fragment.id)">
                            <span v-if="fragment.verseNumber != null">{{ fragment.verseNumber }}.</span> {{
                                fragment.content
                            }}
                        </p>

                        <div v-if="visibleComments(fragment).length > 0"
                            class="flex items-center space-x-2 mb-1 cursor-pointer"
                            :class="openCommentsForFragmentId === fragment.id ? 'ms-4' : 'ms-0'"
                            @click="toggleComments(fragment.id)">
                            <div v-if="openCommentsForFragmentId !== fragment.id" class="flex items-center space-x-2">
                                <span class="rounded-full bg-gray-400 text-white text-sm px-4 -ms-1 py-0.5">
                                    {{ visibleComments(fragment).length }}
                                </span>
                                <i class="bi bi-bell-fill text-gray-400 text-lg"></i>
                            </div>
                            <div v-else>
                                <button
                                    class="rounded-e-full w-20 -ms-4 flex items-center justify-center bg-brand-olivine text-white text-xl">
                                    <span class="text-xl"> {{ visibleComments(fragment).length }}</span>
                                    <i class="bi bi-chevron-double-down text-xl ms-4"></i>
                                </button>
                            </div>
                        </div> 

                        <!-- <div v-if="item.annotations?.length ?? 0"
                        class="absolute -bottom-8 -left-2 bg-white pt-2 rounded-e-full w-[5.9rem]">
                        <button @click="toggleContent(index)"
                            class="rounded-e-full py-[0.10rem] w-20 ms-2 flex items-center justify-center bg-brand-olivine text-white text-xl">
                            <span class="text-2xl">{{item.annotations?.filter(a => !a.isPrivate).length ?? 0}}</span>
                            <i :class="{
                                'bi-chevron-double-down': openDescriptionIndex !== index,
                                'bi-chevron-double-down rotate-180 mb-1': openDescriptionIndex === index
                            }" class="bi ms-4"></i>
                        </button>
                    </div> -->

                         <div v-if="openCommentsForFragmentId === fragment.id && fragment.comments?.length">
                            <ul class="border-s-8 border-brand-olivine -mt-8 -mb-12 pt-2" :class="{
                                'pb-12': true,
                                'pb-5 mb-4': openFormForFragmentId !== fragment.id,
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

                                    <div v-if="editingCommentId === comment.id" class="p-2 pe-0 pt-6">
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
                                                @click="projectStore.deleteComment(comment.id)">
                                                <i class="bi bi-trash"></i>
                                            </span>
                                        </div>
                                        <textarea v-model="commentText" required
                                            class="w-full p-2 border border-gray-300 rounded-lg" rows="4"
                                            placeholder="Scrie comentariul aici..."></textarea>

                                        <button
                                            class="mt-2 px-4 py-2 bg-brand-olivine text-white rounded-lg hover:bg-brand-olivine-light"
                                            @click="addComment(comment.id)">
                                            Editează comentariul
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

                                    <div v-if="comment.userId === userStore.user.id">
                                        <div v-if="comment.status === 'private' && editingCommentId !== comment.id"
                                            class="absolute -bottom-5 right-0 bg-white rounded-s-full w-[6.5rem] h-12">
                                            <i @click="openEditCommentForm(comment.id)"
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
                                                <div
                                                    class="bg-white rounded-full cursor-pointer w-12 h-12 flex items-center justify-center z-10 relative right-6 -bottom-1">
                                                    <i
                                                        class="bi bi-repeat bg-brand-olivine text-white rounded-full p-2 flex items-center justify-center w-10 h-10 text-2xl"></i>
                                                </div>
                                                <button @click="openCommentStatusModal(comment.id)"
                                                    class="absolute bottom-1 right-0 rounded-s-full py-1 w-28 bg-brand-gold-metallic text-white text-xl"><span
                                                        class="ms-4">Public</span></button>
                                            </div>
                                        </div>
                                    </div>

                                </li>
                            </ul>
                        </div>

                        <div v-if="openFormForFragmentId === fragment.id" :class="{
                            'border-s-8 border-brand-olivine -mb-2 px-3': true,
                            'pt-8': (openCommentsForFragmentId === fragment.id ?? 0) > 0,
                            'pt-4': (openCommentsForFragmentId !== fragment.id ?? 0) === 0
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
    </div>
</template>
