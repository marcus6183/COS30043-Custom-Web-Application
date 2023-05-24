import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/products/ProductView.vue'
import ProductDetails from '../views/products/ProductDetails.vue'
import Cart from '../views/Cart.vue'
import NotFound from '../views/NotFound.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Account from '../views/Account.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
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
    path: '/account',
    name: 'Account',
    component: Account,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: {
      requiresAuth: true
    }
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

router.beforeEach((to, from, next) => {
  if ((to.path === '/login' || to.path === '/register') && auth.currentUser) {
    next('/')
    return;
  }

  if (to.matched.some(record => record.meta.requiresAuth) && !auth.currentUser){
    next('/login')
    return;
  }

  next();
})

export default router
