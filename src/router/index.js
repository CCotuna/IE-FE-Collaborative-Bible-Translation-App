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
      path: '/base-import/new-project',
      name: 'new-project',
      component: () => import('../views/import/BaseImportView.vue')
    },
    {
      path: '/classified-import',
      name: 'classified-import',
      component: () => import('../views/import/ClassifiedImportView.vue')
    },
    {
      path: '/classified-import/bible',
      name: 'classified-import-bible',
      component: () => import('../views/import/bible/BibleImportView.vue')
    },
    {
      path: '/classified-import/bible/book',
      name: 'classified-import-bible-book',
      component: () => import('../views/import/bible/BookImportView.vue')
    },
    {
      path: '/classified-import/bible/book/chapter',
      name: 'classified-import-bible-book-chapter',
      component: () => import('../views/import/bible/ChapterImportView.vue')
    },
    {
      path: '/classified-import/bible/book/chapter/verse',
      name: 'classified-import-bible-book-chapter-verse',
      component: () => import('../views/import/bible/VerseImportView.vue')
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
      path: '/menu/my-account',
      name: 'my-account',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/text-biblic-design',
      name: 'text-biblic-design',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/projects/search',
      name: 'projects-search',
      component: () => import('../views/ProjectsSearchView.vue')
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/SignInView.vue')
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('../views/SignUpView.vue')
    },
    {
      path: '/:slug-:id',
      name: 'project',
      component: () => import('@/components/layout/Project.vue'),
      props: true,
    }
  ],
});

export default router;
