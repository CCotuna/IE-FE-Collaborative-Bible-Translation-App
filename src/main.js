import './assets/main.css';

import "bootstrap-icons/font/bootstrap-icons.css";

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import VueTippy from 'vue-tippy';
import i18n from './plugins/i18n'

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n)

app.use(VueTippy, {
  directive: 'tippy',
  component: 'Tippy',
  defaultProps: {
    animation: 'scale',
    delay: [0, 0],
    allowHTML: true,
  },
});

app.mount('#app');