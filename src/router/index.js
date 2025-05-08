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
      path: '/clases',
      name: 'clases',
      component: () => import('../views/ClasesView.vue'),
    },
    {
      path: '/capitulos',
      name: 'capitulos',
      component: () => import('../views/CapitulosView.vue'),
      children: [{
        path: 'introduccion',
        component: () => import('../components/Capitulos/IntroduccionView.vue'),
      },

      ]
    },
    { //Este redirige si no hay una regla definida
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
  ],
})

export default router
