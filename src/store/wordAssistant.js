import { defineStore } from 'pinia';
import axios from "axios";

export const useWordAssistantStore = defineStore("wordAssistant", {
    state: () => ({
        selectedText: "",
        fragmentId: null,
        selectedFragmentId: null,
        isTranslatingFormOpen: false,
    }),
    actions: {
        toggleTranslatingForm() {
            this.isTranslatingFormOpen = !this.isTranslatingFormOpen;
        }
    },
});