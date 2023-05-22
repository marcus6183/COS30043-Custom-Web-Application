import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/products/ProductView.vue'
import ProductDetails from '../views/products/ProductDetails.vue'
import Cart from '../views/Cart.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
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
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
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
