/**
 * Vue Router 설정 파일
 * 애플리케이션의 라우팅을 관리합니다.
 */
import { createRouter, createWebHashHistory } from 'vue-router'

/**
 * 라우트 정의
 * 각 라우트는 경로와 해당 컴포넌트를 매핑합니다.
 */
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
    path: '/mypage',
    name: 'MyPage',
    component: () => import('@/views/MyPage.vue'),
    meta: {
      title: 'My Page - EduGenie',
      requiresAuth: true,
    },
  },
  {
    path: '/mypage/contents',
    name: 'ContentsList',
    component: () => import('@/views/ContentsListPage.vue'),
    meta: {
      title: 'My Contents - EduGenie',
      requiresAuth: true,
    },
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
]

/**
 * Router 인스턴스 생성
 * createWebHistory를 사용하여 HTML5 History 모드를 활성화합니다.
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

/**
 * 라우트 가드: 인증 확인 및 메타 정보 업데이트
 */
router.beforeEach((to, from, next) => {
  // 문서 타이틀 설정
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 인증이 필요한 페이지 가드
  if (to.meta.requiresAuth) {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }
  }

  next()
})

export default router
