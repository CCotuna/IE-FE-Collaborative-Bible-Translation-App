<script setup>
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/store/project';
import { useUserStore } from '@/store/user';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { timeSinceCreated } from '@/utils/timeSinceCreated';


import socket from '@/plugins/socket';

onMounted(() => {
    const projectId = parseInt(route.params.id)
    socket.emit('joinProjectRoom', projectId)

    socket.on('newComment', (newComment) => {
        const fragment = project.value?.fragments?.find(f => f.id === newComment.fragmentId)
        if (fragment) {
            if (!fragment.comments) fragment.comments = []
            const alreadyExists = fragment.comments.some(c => c.id === newComment.id)
            if (!alreadyExists) fragment.comments.push(newComment)
        }
    })
})

onBeforeUnmount(() => {
    const projectId = parseInt(route.params.id)
    socket.emit('leaveProjectRoom', projectId)
    socket.off('newComment')
})

const route = useRoute();
const projectStore = useProjectStore();
const userStore = useUserStore();

const project = computed(() => {
    const id = parseInt(route.params.id);
    return projectStore.projects.find(p => p.id === id);
});

const sortedFragments = computed(() => {
    return project.value?.fragments?.slice().sort((a, b) => a.verseNumber - b.verseNumber) || [];
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
</script>

<template>
    <!-- {{ project }} -->
    <div v-if="project">
        <div class="p-3">
            <ul class="space-y-6">
                <li v-for="fragment in sortedFragments" :key="fragment.id">
                    <p class="text-gray-900 cursor-pointer" @click="toggleForm(fragment.id)">
                        <span v-if="fragment.verseNumber != null">{{ fragment.verseNumber }}:</span> {{ fragment.content
                        }}
                    </p>

                    <div v-if="visibleComments(fragment).length > 0"
                        class="flex items-center space-x-2 mb-2 cursor-pointer"
                        :class="openCommentsForFragmentId === fragment.id ? 'ms-4' : 'ms-0'"
                        @click="toggleComments(fragment.id)">
                        <div class="rounded-full bg-gray-400 text-white text-sm px-3 py-0.5">
                            {{ visibleComments(fragment).length }}
                        </div>
                        <i class="bi bi-bell-fill text-gray-400 text-sm"></i>
                    </div>

                    <div v-if="openCommentsForFragmentId === fragment.id && fragment.comments?.length">
                        <ul class="border-s-8 border-brand-olivine -mt-8 -mb-12 pt-2" :class="{
                            'pb-12': true,
                            'pb-5': openFormForFragmentId !== index,
                        }">
                            <li v-for="comment in visibleComments(fragment)" :key="comment.id"
                                class="text-sm text-gray-700 relative mt-3">
                                <!-- <div class="flex flex-col">
                                    <p class="font-medium">{{ comment.userEmail }}</p>
                                    <p class="font-medium">{{ comment.userId }}</p>
                                    <p class="ml-2 italic">“{{ comment.content }}”</p>
                                    <p class="ml-2 italic">“{{ comment.status }}”</p>
                                </div> -->

                                <div class="py-3">
                                    <p :class="{
                                        'text-base p-4 rounded-md flex flex-col': true,
                                        'bg-brand-cornsilk': comment.userId === userStore.user.id,
                                        'bg-white border-b border-t rounded-none': comment.userId !== userStore.user.id
                                    }">
                                        <span class="text-sm font-light mb-1">{{ comment.userEmail }}</span>
                                        <span>{{ comment.content }}</span>
                                        <!-- {{ annotation.ownerId }} -->

                                    </p>
                                </div>

                                <div class="absolute -bottom-6 left-2 flex items-center">
                                    <div class="bg-white rounded-full w-12 h-12 flex items-center justify-center">
                                        <div
                                            class="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-brand-olivine">
                                            <span class="font-medium text-brand-olivine uppercase">
                                                CA
                                            </span>
                                        </div>
                                    </div>
                                    <p class="text-gray-400 text-md p-2 ps-1 pt-3">{{
                                        timeSinceCreated(comment.createdAt)
                                        }}</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div v-if="openFormForFragmentId === fragment.id" :class="{
                        'border-s-8 border-brand-olivine -mb-2 px-3': true,
                        'pt-14': (openCommentsForFragmentId === fragment.id ?? 0) > 0,
                        'pt-4': (openCommentsForFragmentId !== fragment.id ?? 0) === 0
                    }">
                        <textarea v-model="commentText" required class="w-full p-2 border border-gray-300 rounded-lg"
                            rows="4" placeholder="Scrie comentariul aici..."></textarea>

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
</template>
