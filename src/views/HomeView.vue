<script setup>
import ImportText from '@/components/layout/ImportText.vue';
import { useProjectStore} from '@/store/project'

const projectStore = useProjectStore();
console.log(projectStore.projects);

import { useRoute } from 'vue-router';
const route = useRoute();
console.log(route.path);

</script>
<template>
    <div v-if="route.path == '/'">
        <ImportText />
    </div>
    <div v-if="route.path == '/import-text'">
        hehe
    </div>
</template>
<style scoped></style>