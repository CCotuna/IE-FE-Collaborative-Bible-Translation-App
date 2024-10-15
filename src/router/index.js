import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: "/import-text",
      name: 'import-text',
      component: () => import('../views/ImportTextView.vue')
    },
    {
      path: "/import-clasificat",
      name: 'import-clasificat',
      component: () => import('../components/ImportClasificat.vue')
    },
    {
      path: "/biblia-import-clasificat",
      name: 'biblia',
      component: () => import('../components/ImportClasificat/Biblia.vue')
    },
    {
      path: "/imnuri-crestine-import-clasificat",
      name: 'imnuri-crestine',
      component: () => import('../components/ImportClasificat/ImnuriCrestine.vue')
    },
    {
      path: "/poezii-crestine-import-clasificat",
      name: 'poezii-crestine',
      component: () => import('../components/ImportClasificat/PoeziiCrestine.vue')
    },
    {
      path: "/comentarii-biblice-import-clasificat",
      name: 'comentarii-biblice',
      component: () => import('../components/ImportClasificat/ComentariiBiblice.vue')
    },
    {
      path: "/biblioteca",
      name: 'biblioteca',
      component: () => import('../views/LibraryView.vue')
    },
    {
      path: "/menu",
      name: 'menu',
      component: () => import('../views/MenuView.vue')
    },
    {
      path: "/notifications",
      name: 'notifications',
      component: () => import('../views/NotificationsView.vue')
    },
    {
      path: "/text-biblic-design",
      name: 'text-biblic-design',
      component: () => import('../views/BibleText.vue')
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})


export default router
