<script setup>
import ImportText from '@/components/layout/ImportText.vue';
import Library from '@/components/layout/Library.vue';
import { useProjectStore} from '@/store/project'

const projectStore = useProjectStore();

// import { useRoute } from 'vue-router';
// const route = useRoute();
// console.log(route.path);

</script>
<template>
    <div v-if="projectStore.projects.length == 0">
        <ImportText />
    </div>
    <div v-else>
        <Library />
    </div>
</template>
<style scoped></style>