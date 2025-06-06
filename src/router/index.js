import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/user';
import HomeView from '../views/HomeView.vue';

const bookId = null;
const chapterId = null;

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
      component: () => import('../views/ImportView.vue')
    },
    {
      path: '/base-import/new-project',
      name: 'new-project',
      component: () => import('../views/import/BaseImportView.vue')
    },
    {
      path: '/pdf-import/new-project',
      name: 'new-project-pdf',
      component: () => import('../views/import/docs/PDFImportView.vue')
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
      path: '/menu/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/menu/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/menu/help',
      name: 'help',
      component: () => import('../views/HelpView.vue')
    },
    {
      path: '/menu/share-profile',
      name: 'share-profile',
      component: () => import('../views/HelpView.vue')
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
      path: '/:slug~:id',
      name: 'project-default',
      component: () => import('../components/ProjectFragments.vue'),
      props: true,
    },
    {
      path: '/:slug~:id/select-book',
      name: 'project-books',
      component: () => import('../components/ProjectBooks.vue'),
      props: true,
    },
    {
      path: '/:slug~:id/:bookTitle/select-chapter',
      name: 'project-chapters',
      component: () => import('../components/ProjectChapters.vue'),
      props: true,
      query: { bookId }
    },
    {
      path: '/:slug~:id/fragments',
      name: 'project-fragments',
      component: () => import('../components/ProjectFragments.vue'),
      props: true,
      query: { chapterId }
    },
    {
      path: '/:id/collaborators',
      name: 'collaborators-view',
      component: () => import('@/views/CollaboratorsView.vue'),
      props: true,
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  const publicPaths = ['/', '/sign-in', '/sign-up'];
  const authNotRequired = publicPaths.includes(to.path);

  if (!userStore.user) {
    try {
      await userStore.checkAuth();
    } catch (err) {
      console.error('Error checking auth:', err);
      if (!authNotRequired) {
        return next('/');
      }
    }
  }

  if (!userStore.user && !authNotRequired) {
    return next('/');
  }

  if (userStore.user && authNotRequired && to.path !== '/') {
    return next('/');
  }

  next();
});

export default router;
