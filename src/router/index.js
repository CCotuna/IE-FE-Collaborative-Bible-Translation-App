import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/base-import',
      name: 'base-import',
      component: () => import('../views/ImportTextView.vue')
    },
    {
      path: '/classified-import',
      name: 'classified-import',
      component: () => import('../views/ClassifiedImportView.vue')
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationsView.vue')
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('../views/MenuView.vue')
    },
    {
      path: '/text-biblic-design',
      name: 'text-biblic-design',
      component: () => import('../views/HomeView.vue')
    },
  ],
});

export default router;
