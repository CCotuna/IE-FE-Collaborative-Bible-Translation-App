import { defineStore } from 'pinia';
import axios from "axios";

export const useInlineFormStore = defineStore("inlineForm", {
    state: () => ({
        isFormOpen: false,
        formType: '', // 'translate', 'synonyms', 'expressions'
        selectedTextForForm: '',
        targetFragmentId: null,
        responseData: null,
    }),
    actions: {
        openForm(type, text, fragmentId) {
            if (this.isFormOpen && (this.formType !== type || this.targetFragmentId !== fragmentId || this.selectedTextForForm !== text)) {
                this.resetFormFieldsOnClose();
            }

            this.formType = type;
            this.selectedTextForForm = text;
            this.targetFragmentId = fragmentId;
            this.isFormOpen = true;
            this.responseData = null;
        },

        closeForm() {
            this.isFormOpen = false;
            this.resetFormFieldsOnClose();
        },

        resetFormFieldsOnClose() {
            this.formType = '';
            this.selectedTextForForm = '';
            this.targetFragmentId = null;
            this.responseData = null;
        },

        async submitTranslation(payload) {
            try {
                const response = await axios.post('http://localhost:3000/process-text/translate', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        textToTranslate: payload.originalText,
                        targetLanguage: payload.targetLanguage,
                    }
                });

                this.responseData = response.data;
            }
            catch (error) {
                console.error("Error submitting translation:", error);
            }

        },

        async submitSynonyms(payload) {
            try {
                const response = await axios.post('http://localhost:3000/process-text/synonyms', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        textToFindSynonyms: payload.originalText,
                    }
                });

                this.responseData = response.data;
            }
            catch (error) {
                console.error("Error submitting synonyms:", error);
            }
            
        },

        async submitExpression(payload) {
            try {
                const response = await axios.post('http://localhost:3000/process-text/expressions', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        textToFindExpressions: payload.originalText,
                    }
                });

                this.responseData = response.data;
            }
            catch (error) {
                console.error("Error submitting expressions:", error);
            }
        },

        resetAllState() {
            this.isFormOpen = false;
            this.formType = '';
            this.selectedTextForForm = '';
            this.targetFragmentId = null;
            this.responseData = null;
        }
    },
});