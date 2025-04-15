<script setup>
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/store/project';
import { ref, computed } from 'vue';

const route = useRoute();
const projectStore = useProjectStore();

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
</script>

<template>
    <div v-if="project">
        <div class="p-3">
            <ul class="space-y-6">
                <li v-for="fragment in sortedFragments" :key="fragment.id">
                    <p class="text-gray-900 cursor-pointer" @click="toggleForm(fragment.id)">
                        <span v-if="fragment.verseNumber != null">{{ fragment.verseNumber }}:</span> {{ fragment.content }}
                    </p>

                    <div class="flex items-center space-x-2 mb-2 cursor-pointer" @click="toggleComments(fragment.id)">
                        <div class="rounded-full bg-gray-400 text-white text-sm px-3 py-0.5">
                            {{ fragment.comments?.length || 0 }}
                        </div>
                        <i class="bi bi-bell-fill text-gray-400 text-sm"></i>
                    </div>

                    <div v-if="openCommentsForFragmentId === fragment.id && fragment.comments?.length">
                        <ul class="pl-6 mt-2 border-l-2 border-gray-300 space-y-2">
                            <li v-for="comment in fragment.comments" :key="comment.id" class="text-sm text-gray-700">
                                <p class="font-medium">{{ comment.userEmail }}</p>
                                <p class="ml-2 italic">“{{ comment.content }}”</p>
                            </li>
                        </ul>
                    </div>

                    <div v-if="openFormForFragmentId === fragment.id"
                        class="bg-brand-honeydew p-4 rounded-lg space-y-3 mt-2">
                        <textarea v-model="commentText" required
                            class="w-full border border-brand-olivine rounded-md p-2"
                            placeholder="Scrie comentariul aici..."></textarea>

                        <select v-model="commentStatus" required
                            class="w-full border border-brand-olivine rounded-md p-2">
                            <option value="private">Privat</option>
                            <option value="public">Public</option>
                        </select>

                        <button class="bg-brand-olivine text-white px-4 py-2 rounded-full"
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
