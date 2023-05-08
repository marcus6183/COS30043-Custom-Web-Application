import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Switches from '../views/Switches.vue'
import ProductView from '../views/products/ProductView.vue'
import ProductDetails from '../views/products/ProductDetails.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/switches',
    name: 'Switches',
    component: Switches
  },
  {
    path: '/products',
    name: 'ProductView',
    component: ProductView
  },
  {
    path: '/products/:id',
    name: 'ProductDetails',
    component: ProductDetails,
    props: true // Accept route parameters as props
  },
  // Catch all 404
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // Reset scroll position on view change
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  }
})

export default router
