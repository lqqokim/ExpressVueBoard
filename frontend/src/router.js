import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
// import e404 from './views/e404.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/user',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/User.vue')
    },
    {
      path: '/header',
      name: '헤더',
      component: () => import('./views/Header.vue')
    },
    {
      path: '/sign',
      name: 'sign',
      component: () => import('./views/Sign.vue')
    },
    {
      path: '*',
      name: 'e404',
      component: () => import('./views/e404.vue')
    }
  ]
})
