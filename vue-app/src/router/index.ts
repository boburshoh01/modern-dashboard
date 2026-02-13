import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/pages/login.vue'
import OAuthCallback from '@/pages/oauth-callback.vue'
import Dashboard from '@/pages/dashboard.vue'
import ProductsIndex from '@/pages/products/index.vue'
import ProductDetails from '@/pages/products/[id].vue'
import UsersIndex from '@/pages/users/index.vue'
import UserDetails from '@/pages/users/[id].vue'
import Favorites from '@/pages/favorites.vue'
import DefaultLayout from '@/layouts/default.vue'

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { layout: 'empty', middleware: 'guest' },
    },
    {
        path: '/oauth/callback',
        name: 'OAuthCallback',
        component: OAuthCallback,
        meta: { layout: 'empty', middleware: 'guest' },
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { layout: DefaultLayout, middleware: 'auth' },
    },
    {
        path: '/products',
        name: 'Products',
        component: ProductsIndex,
        meta: { layout: DefaultLayout, middleware: 'auth' },
    },
    {
        path: '/products/add',
        name: 'AddProduct',
        component: ProductDetails, // Using [id].vue for add as well, consistent with Nuxt logic seen in component
        meta: { layout: DefaultLayout, middleware: 'auth' },
    },
    {
        path: '/products/:id',
        name: 'ProductDetails',
        component: ProductDetails,
        meta: { layout: DefaultLayout, middleware: 'auth' },
    },
    {
        path: '/users',
        name: 'Users',
        component: UsersIndex,
        meta: { layout: DefaultLayout, middleware: 'auth' },
    },
    {
        path: '/users/add',
        name: 'AddUser',
        component: UserDetails,
        meta: { layout: DefaultLayout, middleware: 'auth' },
    },
    {
        path: '/users/:id',
        name: 'UserDetails',
        component: UserDetails,
        meta: { layout: DefaultLayout, middleware: 'auth' },
    },
    {
        path: '/favorites',
        name: 'Favorites',
        component: Favorites,
        meta: { layout: DefaultLayout, middleware: 'auth' },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Initialize auth state from local storage if needed (pinia-plugin-persistedstate handles this usually, but good to be sure)
    // const token = localStorage.getItem('auth_token')
    // if (token && !authStore.token) {
    //    authStore.token = token
    //    await authStore.fetchUser() // If such method exists
    // }

    if (to.meta.middleware === 'auth' && !authStore.isAuthenticated) {
        next('/login')
    } else if (to.meta.middleware === 'guest' && authStore.isAuthenticated) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router
