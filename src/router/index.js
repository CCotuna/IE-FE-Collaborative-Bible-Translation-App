import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/user';
import HomeView from '../views/HomeView.vue';

const bookId = null;
const chapterId = null;

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/base-import',
    name: 'base-import',
    component: () => import('../views/ImportView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/base-import/new-project',
    name: 'new-project',
    component: () => import('../views/import/BaseImportView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/pdf-import',
    name: 'pdf-import',
    component: () => import('../views/import/docs/PDFImportView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/classified-import',
    name: 'classified-import',
    component: () => import('../views/import/ClassifiedImportView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/classified-import/bible',
    name: 'classified-import-bible',
    component: () => import('../views/import/bible/BibleImportView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/classified-import/bible/book',
    name: 'classified-import-bible-book',
    component: () => import('../views/import/bible/BookImportView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/classified-import/bible/book/chapter',
    name: 'classified-import-bible-book-chapter',
    component: () => import('../views/import/bible/ChapterImportView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/classified-import/bible/book/chapter/verse',
    name: 'classified-import-bible-book-chapter-verse',
    component: () => import('../views/import/bible/VerseImportView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../views/NotificationsView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/menu',
    name: 'menu',
    component: () => import('../views/MenuView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/menu/my-account',
    name: 'my-account',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/menu/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/menu/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/menu/help',
    name: 'help',
    component: () => import('../views/HelpView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/menu/share-profile',
    name: 'share-profile',
    component: () => import('../views/HelpView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/projects/search',
    name: 'projects-search',
    component: () => import('../views/ProjectsSearchView.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: () => import('../views/SignInView.vue'),
    
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: () => import('../views/SignUpView.vue'),
    
  },
  {
    path: '/:slug~:id',
    name: 'project-base',
    component: () => import('../components/ProjectFragments.vue'),
    props: true,
    meta: { requiresAuth: true } 
  },
  {
    path: '/:slug~:id/select-book',
    name: 'project-books',
    component: () => import('../components/ProjectBooks.vue'),
    props: true,
    meta: { requiresAuth: true } 
  },
  {
    path: '/:slug~:id/:bookTitle/select-chapter',
    name: 'project-chapters',
    component: () => import('../components/ProjectChapters.vue'),
    props: true,
    query: { bookId },
    meta: { requiresAuth: true } 
  },
  {
    path: '/:slug~:id/fragments',
    name: 'project-fragments',
    component: () => import('../components/ProjectFragments.vue'),
    props: true,
    query: { chapterId },
    meta: { requiresAuth: true } 
  },
  {
    path: '/:id/collaborators',
    name: 'collaborators-view',
    component: () => import('@/views/CollaboratorsView.vue'),
    props: true,
    meta: { requiresAuth: true } 
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  await userStore.checkAuth();
  if (requiresAuth && !userStore.isAuthenticated()) {
    try {
      userStore.isAuthenticated();
      console.log('Utilizatorul este autentificat:', userStore.user);
    } catch (err) {
      console.error('Eroare la verificare autentificare:', err);
      return next({ name: 'sign-in' });
    }
  }

  if (requiresAuth && !userStore.user) {
    return next({ name: 'sign-in' }); 
  }

  const isPublicRoute = !requiresAuth; 
  if (userStore.user && isPublicRoute && to.name !== 'home') {
    return next({ name: 'home' });
  }
  next();
});


export default router;
