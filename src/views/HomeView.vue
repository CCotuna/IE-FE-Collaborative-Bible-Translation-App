<script setup>
import { computed } from 'vue';
import ImportTextView from '@/views/ImportTextView.vue';
import Library from '@/views/LibraryView.vue';

import { useProjectStore} from '@/store/project'
const projectStore = useProjectStore();

import { isAuthenticated } from '@/utils/auth';
const isLoggedIn = computed(() => isAuthenticated());

// import { useRoute } from 'vue-router';
// const route = useRoute();

</script>
<template>
    <div v-if="!isLoggedIn && projectStore.projects.length == 0">
        <ImportTextView />
    </div>
    <div v-else >
        <Library />
    </div>
</template>
<style scoped></style>