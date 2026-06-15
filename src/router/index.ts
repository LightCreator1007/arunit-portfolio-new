import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: () => import('../views/BlogsView.vue'),
    },
    {
      path: '/blogs/:slug',
      name: 'post',
      component: () => import('../views/PostView.vue'),
      props: (route) => ({ slug: String(route.params.slug) }),
    },
  ],
})

export default router
