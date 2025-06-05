<script setup>
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
</script>

<template>
    <div class="ps-7 pt-4 flex flex-col space-y-5">
        <div v-if="!userStore.checkAuth()" class="flex space-x-5">
            <RouterLink :to="{ name: 'sign-in' }"
                class="flex items-center space-x-8 px-4 py-2 text-white bg-brand-olivine rounded-full">
                <span class="text-xl">Intra in cont</span>
            </RouterLink>
            <RouterLink :to="{ name: 'sign-up' }"
                class="flex items-center space-x-8 px-4 py-2 text-brand-olivine bg-brand-honeydew rounded-full">
                <span class="text-xl">Creaza cont</span>
            </RouterLink>
        </div>

        <div class="flex flex-col space-y-5 text-xl">
            <RouterLink :to="{ name: 'my-account'}" class="flex space-x-4 items-center">
                <i class="bi bi-person-circle text-3xl text-brand-olivine"></i>
                <span>
                    Contul meu
                </span>
            </RouterLink>
            <div class="flex flex-col space-y-2">
                <RouterLink :to="{name : 'settings'}" class="flex space-x-4 items-center">
                    <i class="bi bi-gear text-3xl text-brand-olivine"></i>
                    <span>
                        Setari
                    </span>
                </RouterLink>
                <div class="flex space-x-4 items-center">
                    <i class="bi bi-share-fill text-3xl text-brand-olivine"></i>
                    <span>
                        Trimite
                    </span>
                </div>
                <RouterLink :to="{name: 'about'}" class="flex space-x-4 items-center">
                    <i class="bi bi-info-circle text-3xl text-brand-olivine"></i>
                    <span>
                        Despre
                    </span>
                </RouterLink>
                <RouterLink :to="{name: 'help'}" class="flex space-x-4 items-center">
                    <i class="bi bi-question-circle text-3xl text-brand-olivine"></i>
                    <span>
                        Ajutor
                    </span>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
<style scoped></style>