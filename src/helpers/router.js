import { useAuthStore } from '@/stores/auth.store.js'
import { createRouter, createWebHashHistory } from 'vue-router'

const publicRouteNames = ['Home', 'App', 'AuthCallback', 'Error']

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: 'EduGenie - AI Lesson Generator',
    },
  },
  {
    path: '/app',
    name: 'App',
    component: () => import('@/views/AppPage.vue'),
    meta: {
      title: 'Create Lesson - EduGenie',
    },
  },
  {
    path: '/app/:id',
    name: 'AppViewer',
    component: () => import('@/views/AppViewerPage.vue'),
    meta: {
      title: 'View Lesson - EduGenie',
      requiresAuth: true,
    },
  },
  {
    path: '/mypage',
    name: 'MyPageLayout',
    component: () => import('@/views/MyPage.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'MyContent',
        component: () => import('@/components/MyPage/MyContent.vue'),
        meta: {
          title: 'My Content - EduGenie',
          requiresAuth: true,
        },
      },
      {
        path: 'payment-history',
        name: 'PaymentHistory',
        component: () => import('@/components/MyPage/PaymentHistory.vue'),
        meta: {
          title: 'Payment History - EduGenie',
          requiresAuth: true,
        },
      },
      {
        path: 'delete-account',
        name: 'DeleteAccount',
        component: () => import('@/components/MyPage/DeleteAccount.vue'),
        meta: {
          title: 'Delete Account - EduGenie',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/pricing/checkout',
    name: 'Checkout',
    component: () => import('@/views/CheckoutPage.vue'),
    meta: {
      title: 'Checkout - EduGenie',
      requiresAuth: true,
    },
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('@/views/AuthCallback.vue'),
    meta: {
      title: 'Authentication - EduGenie',
    },
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('@/views/ErrorPage.vue'),
    meta: {
      title: 'Error - EduGenie',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/error',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  const authStore = useAuthStore()
  const isPublicRoute = publicRouteNames.includes(to.name)

  if (!isPublicRoute && to.meta.requiresAuth && !authStore.isAuthenticated.value) {
    return next('/')
  }

  next()
})

export default router
