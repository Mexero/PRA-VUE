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
      redirect: '/capitulos/introduccion',
      children: [{
        path: 'clases',
        component: () => import('../components/Capitulos/ClasesView.vue'),
      },
      {
        path: 'introduccion',
        component: () => import('../components/Capitulos/IntroduccionView.vue'),
      },
      {
        path: 'combate',
        component: () => import('../components/Capitulos/CombateView.vue'),
      },
      {
        path: 'comojugar',
        component: () => import('../components/Capitulos/ComoJugarView.vue'),
      },
      {
        path: 'concursos',
        component: () => import('../components/Capitulos/ConcursosView.vue'),
      },
      {
        path: 'creacionpj',
        component: () => import('../components/Capitulos/CreacionPJ.vue'),
      },
      {
        path: 'dirigir',
        component: () => import('../components/Capitulos/DirigirView.vue'),
      },
      {
        path: 'objetos',
        component: () => import('../components/Capitulos/EquipoYObjetosView.vue'),
      },
      {
        path: 'movhabdot',
        component: () => import('../components/Capitulos/MovHabDotView.vue'),
      },
      {
        path: 'otrasreglas',
        component: () => import('../components/Capitulos/OtrasReglasView.vue'),
      },
      {
        path: 'pokemon',
        component: () => import('../components/Capitulos/PokemonView.vue'),
      },

      ]
    },
    {
      path: '/dotes',
      name: 'dotes',
      component: () => import('../components/Tabulados/DotesView.vue'),
    },
    {
      path: '/movimientos',
      name: 'movimientos',
      component: () => import('../components/Tabulados/MovimientosView.vue'),
    },
    {
      path: '/habilidades',
      name: 'habilidades',
      component: () => import('../components/Tabulados/HabilidadesView.vue'),
    },
    {
      path: '/objetos',
      name: 'objetos',
      component: () => import('../components/Tabulados/ObjetosView.vue'),
    },
    {
      path: '/pokedex',
      name: 'pokedex',
      component: () => import('../views/PokedexView.vue'),
    },



    { //Este redirige si no hay una regla definida
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
  ],
})

export default router
