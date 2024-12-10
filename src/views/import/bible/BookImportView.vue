<script setup>
import { ref } from 'vue';

const books = ref([
    { name: 'Gen', is_imported: false },
    { name: 'Exod', is_imported: false },
    { name: 'Lev', is_imported: false },
    { name: 'Num', is_imported: false },
    { name: 'Deut', is_imported: false },
    { name: 'Josh', is_imported: false },
    { name: 'Judg', is_imported: false },
    { name: 'Ruth', is_imported: false },
    { name: '1Sam', is_imported: false },
    { name: '2Sam', is_imported: false },
    { name: '1Kgs', is_imported: false },
    { name: '2Kgs', is_imported: false },
    { name: '1Chr', is_imported: false },
    { name: '2Chr', is_imported: false },
    { name: 'Ezra', is_imported: false },
    { name: 'Neh', is_imported: false },
    { name: 'Esth', is_imported: false },
    { name: 'Job', is_imported: false },
    { name: 'Ps', is_imported: false },
    { name: 'Prov', is_imported: false },
    { name: 'Eccl', is_imported: false },
    { name: 'Song', is_imported: false },
    { name: 'Isa', is_imported: false },
    { name: 'Jer', is_imported: false },
    { name: 'Lam', is_imported: false },
    { name: 'Ezek', is_imported: false },
    { name: 'Dan', is_imported: false },
    { name: 'Hos', is_imported: false },
    { name: 'Joel', is_imported: false },
    { name: 'Amos', is_imported: false },
    { name: 'Obad', is_imported: false },
    { name: 'Jonah', is_imported: false },
    { name: 'Mic', is_imported: false },
    { name: 'Nah', is_imported: false },
    { name: 'Hab', is_imported: false },
    { name: 'Zeph', is_imported: false },
    { name: 'Hag', is_imported: false },
    { name: 'Zech', is_imported: false },
    { name: 'Mal', is_imported: false },
    { name: 'Matt', is_imported: false },
    { name: 'Mark', is_imported: false },
    { name: 'Luke', is_imported: false },
    { name: 'John', is_imported: false },
    { name: 'Acts', is_imported: false },
    { name: 'Rom', is_imported: false },
    { name: '1Cor', is_imported: false },
    { name: '2Cor', is_imported: false },
    { name: 'Gal', is_imported: false },
    { name: 'Eph', is_imported: false },
    { name: 'Phil', is_imported: false },
    { name: 'Col', is_imported: false },
    { name: '1Thess', is_imported: false },
    { name: '2Thess', is_imported: false },
    { name: '1Tim', is_imported: false },
    { name: '2Tim', is_imported: false },
    { name: 'Titus', is_imported: false },
    { name: 'Phlm', is_imported: false },
    { name: 'Heb', is_imported: false },
    { name: 'Jas', is_imported: false },
    { name: '1Pet', is_imported: false },
    { name: '2Pet', is_imported: false },
    { name: '1John', is_imported: false },
    { name: '2John', is_imported: false },
    { name: '3John', is_imported: false },
    { name: 'Jude', is_imported: false },
    { name: 'Rev', is_imported: false },
]);

function toggleImportStatus(book) {
    book.is_imported = !book.is_imported;
}
</script>

<template>
    <div class="mx-5">
        <span class="font-bold">Alege cartea</span>
        <div class="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-7 gap-4 mt-4">
            <div v-for="book in books" :key="book.name" @click="toggleImportStatus(book)" :class="['border-2',
                book.is_imported ? 'bg-brand-olivine text-white' : 'bg-white text-black border-brand-olivine',
                'rounded-md p-2 px-0 text-center cursor-pointer']">
                {{ book.name }}
            </div>
        </div>
    </div>
</template>

<style scoped></style>
