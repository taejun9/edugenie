/**
 * Vue Router 설정 파일
 * 애플리케이션의 라우팅을 관리합니다.
 */
import { createRouter, createWebHistory } from 'vue-router'

/**
 * 라우트 정의
 * 각 라우트는 경로와 해당 컴포넌트를 매핑합니다.
 */
const routes = [
  {
    path: '/login',
    redirect: '/',
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: 'EduGenie - Customized Learning Materials Generator',
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
  // 추가 라우트는 여기에 정의할 수 있습니다.
]

/**
 * Router 인스턴스 생성
 * createWebHistory를 사용하여 HTML5 History 모드를 활성화합니다.
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * 라우트 가드: 라우트 변경 전 메타 정보 업데이트
 * 각 라우트의 meta.title을 문서 제목으로 설정합니다.
 */
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
