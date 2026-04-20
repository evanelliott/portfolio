import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PortfolioHome from '@/views/PortfolioHome.vue'

/**
 * Senior Portfolio Router
 * Uses dynamic routing to allow deep-linking into specific projects.
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: PortfolioHome,
    // Child route allows /project/1 to load the same component
    // but with a specific state.
    children: [
      {
        path: 'project/:id',
        name: 'project-detail',
        component: PortfolioHome,
        props: true,
      },
    ],
  },
  // 404 Redirect - essential for professional UX
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  // Use 'createWebHistory' for clean URLs.
  // Note: GitHub Pages requires a 404.html hack for this to work on refresh.
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    // Always scroll to top on change, or return to saved position on 'back'
    return savedPosition || { top: 0, behavior: 'smooth' }
  },
})

export default router
