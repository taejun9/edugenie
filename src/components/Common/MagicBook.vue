<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const bookRef = ref(null)
const wandContainerRef = ref(null)
const spellTextRef = ref(null)
const particleOriginRef = ref(null)
const isMountedRef = ref(true)

let isAnimating = false
const LOOP_DELAY = 650

// ============================================
// 책 치수 및 스타일 변수 (기존 :root 변수 대체)
// ============================================
const bookWidth = ref(120)
const bookHeight = ref(140)
const coverColor = ref('#0F8763')
const coverDark = ref('#4C8FA7')

// ============================================
// Computed 스타일 객체들
// ============================================

/** 루트 컨테이너 스타일 */
const containerStyle = computed(() => ({
  width: `${bookWidth.value}px`,
  height: `${bookHeight.value}px`,
}))

/** 책 메인 컨테이너 스타일 */
const bookStyle = computed(() => ({
  width: `${bookWidth.value}px`,
  height: `${bookHeight.value}px`,
}))

/** 뒷표지 스타일 */
const backCoverStyle = computed(() => ({
  background: coverColor.value,
  transform: `translateZ(${36 * -0.5}px)`,
}))

/** 책등 스타일 */
const spineStyle = computed(() => ({
  width: `${36}px`,
  height: `${bookHeight.value}px`,
  background: `linear-gradient(to right, ${coverDark.value}, ${coverColor.value} 40%, ${coverDark.value})`,
  transform: `translateZ(${36 * -0.69}px) rotateY(-90deg)`,
}))

/** 종이 뭉치 스타일 */
const paperBlockStyle = computed(() => ({
  width: `${bookWidth.value - 10}px`,
  height: `${bookHeight.value - 8}px`,
  transform: `translateZ(${36 * -0.5 + 5}px)`,
}))

/** 종이 내용면 스타일 */
const paperContentStyle = computed(() => ({
  transform: `translateZ(${30}px)`,
}))

/** 종이 옆면 스타일 */
const paperRightStyle = computed(() => ({
  width: `${30}px`,
}))

/** 종이 윗면/아랫면 스타일 */
const paperEdgeStyle = computed(() => ({
  height: `${30}px`,
}))

/** 앞표지 스타일 (닫힌 상태) */
const frontCoverStyle = computed(() => ({
  height: `${bookHeight.value}px`,
  transition: `transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)`,
  transform: `translateZ(${36 * 0.5}px) rotateY(0deg)`,
}))

/** 앞표지 스타일 (열린 상태) - JS에서 동적으로 적용 */
const frontCoverOpenTransform = computed(() => `translateZ(${36 * 0.34}px) rotateY(-180deg)`)

/** 앞표지 겉면 스타일 */
const frontFaceStyle = computed(() => ({
  background: coverColor.value,
}))

onMounted(async () => {
  isMountedRef.value = true
  await wait(0)
  startAutoLoop()
})
onUnmounted(() => {
  isMountedRef.value = false
})

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const runAnimation = async () => {
  const book = bookRef.value
  const wandContainer = wandContainerRef.value
  const spellText = spellTextRef.value
  const particleOrigin = particleOriginRef.value

  if (!book || !wandContainer || !spellText || !particleOrigin) {
    console.error('MagicBook refs not ready', {
      book,
      wandContainer,
      spellText,
      particleOrigin,
    })
    return
  }

  // 앞표지 요소 참조
  const frontCover = book.querySelector('.front-cover')

  // 1. 책 펼치기 (동적 transform 적용)
  if (frontCover) {
    frontCover.style.transform = frontCoverOpenTransform.value
  }
  await wait(1200)

  // 2. 요술봉 등장
  wandContainer.style.opacity = '1'
  wandContainer.classList.add('wand-active')
  await wait(500)

  // 3. 마법 시전
  const wandSvg = wandContainer.querySelector('.wand')
  wandSvg.classList.add('animate-shake')
  await wait(200)

  createMagicSparkles(particleOrigin)

  spellText.classList.remove('scale-0')
  spellText.classList.add('scale-110')
  setTimeout(() => spellText.classList.remove('scale-110'), 200)

  await wait(2000)

  // 4. 정리
  wandContainer.style.opacity = '0'
  wandContainer.classList.remove('wand-active')
  wandSvg.classList.remove('animate-shake')
  spellText.classList.add('scale-0')

  await wait(500)

  // 5. 책 닫기 (원래 transform으로 복원)
  if (frontCover) {
    frontCover.style.transform = `translateZ(${36 * 0.5}px) rotateY(0deg)`
  }
  await wait(1500)

  isAnimating = false
}

const startAutoLoop = async () => {
  while (isMountedRef.value) {
    await runAnimation()
    await wait(LOOP_DELAY)
  }
}

const createMagicSparkles = (originElement) => {
  const colors = ['#fcd34d', '#60a5fa', '#f472b6', '#ffffff']
  const count = 40

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div')
    particle.classList.add('sparkle')

    const size = Math.random() * 8 + 4
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]

    particle.style.right = '-55px'
    particle.style.top = '10px'

    originElement.parentElement.appendChild(particle)

    const angle = Math.random() * Math.PI * 2
    const distance = 60 + Math.random() * 100
    const tx = Math.cos(angle) * distance
    const ty = Math.sin(angle) * distance

    const animation = particle.animate(
      [
        { transform: 'translate(0, 0) scale(0)', opacity: 1 },
        {
          transform: `translate(${tx}px, ${ty}px) scale(1)`,
          opacity: 1,
          offset: 0.6,
        },
        {
          transform: `translate(${tx * 1.2}px, ${ty * 1.2}px) scale(0)`,
          opacity: 0,
        },
      ],
      {
        duration: 600 + Math.random() * 600,
        easing: 'cubic-bezier(0, .9, .57, 1)',
      },
    )

    animation.onfinish = () => particle.remove()
  }
}
</script>
<template>
  <div
    class="mx-auto flex items-center justify-center font-sans text-slate-200"
    :style="containerStyle"
  >
    <!-- 3D Scene -->
    <div class="relative flex h-full w-full items-center justify-center">
      <div class="book-wrapper relative">
        <div ref="bookRef" class="book relative" :style="bookStyle">
          <!-- 1. 뒷표지 -->
          <div class="back-cover absolute h-full w-full rounded-r-md" :style="backCoverStyle"></div>

          <!-- 2. 책등 -->
          <div
            class="spine absolute -top-px left-0 origin-left rounded-sm"
            :style="spineStyle"
          ></div>

          <!-- 3. 종이 뭉치 -->
          <div class="paper-block absolute left-1 top-1" :style="paperBlockStyle">
            <div
              class="paper-top absolute left-0 top-0 w-full origin-top"
              :style="paperEdgeStyle"
            ></div>
            <div
              class="paper-bottom absolute bottom-0 left-0 w-full origin-bottom"
              :style="paperEdgeStyle"
            ></div>
            <div
              class="paper-right absolute right-0 top-0 h-full origin-right"
              :style="paperRightStyle"
            ></div>

            <div
              class="paper-content absolute flex h-full w-full items-center justify-center border border-slate-300 bg-gradient-to-r from-white to-[#f0f0f0]"
              :style="paperContentStyle"
            >
              <div
                class="flex h-full w-full flex-col items-center justify-center p-4 text-center text-slate-800"
              >
                <div
                  class="flex h-full w-full flex-col items-center justify-center rounded border-2 border-slate-300 bg-white/50 p-4"
                >
                  <span class="mb-2 font-serif text-xs tracking-widest text-slate-400">
                    MAGIC SPELL
                  </span>
                  <h2
                    ref="spellTextRef"
                    id="spell-text"
                    class="scale-0 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-4xl font-black text-transparent transition-transform duration-500 ease-out"
                  >
                    ✨
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. 앞표지 -->
          <div
            class="front-cover absolute left-[3px] top-0 w-full origin-left shadow-2xl"
            :style="frontCoverStyle"
          >
            <div
              class="front-face absolute flex h-full w-full items-center justify-center rounded-r-md border-l-4 border-indigo-900/20"
              :style="frontFaceStyle"
            >
              <div
                class="flex h-24 w-24 items-center justify-center rounded-full border-2 border-yellow-400/30 bg-[#12a377] bg-opacity-80 shadow-inner"
              >
                <!-- <span class="text-4xl">🔮</span> -->
                <img class="h-10 w-10" src="@/assets/images/genie_head.svg" alt="genie head" />
              </div>
            </div>
            <!-- 표지 안쪽 -->
            <div
              class="back-face absolute flex h-full w-full items-center justify-center rounded-l-md bg-color-book"
            >
              <div
                class="back-paper h-full w-full border border-slate-300 bg-gradient-to-l from-white to-[#f0f0f0] p-4"
              >
                <p class="text-center font-serif text-sm italic text-slate-500">
                  "The magic begins
                  <br />
                  where belief starts."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 요술봉 & 파티클 -->
      <div
        ref="wandContainerRef"
        class="pointer-events-none absolute right-[-10px] top-[50px] z-[100] h-20 w-20 opacity-0 transition-opacity duration-500"
      >
        <div class="wand h-full w-full -rotate-[30deg]">
          <div
            class="wand-stick absolute bottom-0 left-1/2 h-10 w-1 -translate-x-1/2 rounded-sm"
          ></div>
          <div
            class="wand-star absolute left-1/2 top-[25%] h-8 w-8 -translate-x-1/2 text-yellow-400"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2L12 16.8l-6.4 4.4 2.4-7.2-6-4.8h7.6z" />
            </svg>
          </div>
        </div>
        <!-- 파티클 생성 위치 -->
        <div
          ref="particleOriginRef"
          class="pointer-events-none absolute right-[-55px] top-[10px] h-0 w-0"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   MagicBook 스타일
   - Tailwind로 처리 불가능한 3D/애니메이션만 CSS로 유지
   ============================================ */

/* 3D 변환 필수 스타일 */
.book-wrapper {
  transform-style: preserve-3d;
  animation: floating 6s ease-in-out infinite;
}

.book {
  transform-style: preserve-3d;
}

.paper-block {
  transform-style: preserve-3d;
}

.front-cover {
  transform-style: preserve-3d;
}

/* 뒷표지 그림자 */
.back-cover {
  box-shadow: -20px 20px 50px rgba(0, 0, 0, 0.5);
}

/* 종이 옆면 (3D 회전 + 텍스처) */
.paper-right {
  background: #f1f5f9;
  transform: rotateY(90deg);
  background-image: repeating-linear-gradient(to right, #f8fafc 0px, #f8fafc 2px, #cbd5e1 3px);
  border-left: 1px solid #94a3b8;
}

/* 종이 윗면 (3D 회전 + 텍스처) */
.paper-top {
  background: #f8fafc;
  transform: rotateX(90deg);
  background-image: repeating-linear-gradient(to bottom, #f8fafc 0px, #f8fafc 2px, #cbd5e1 3px);
  border-bottom: 1px solid #94a3b8;
}

/* 종이 아랫면 (3D 회전 + 텍스처) */
.paper-bottom {
  background: #f8fafc;
  transform: rotateX(-90deg);
  background-image: repeating-linear-gradient(to bottom, #f8fafc 0px, #f8fafc 2px, #cbd5e1 3px);
  border-top: 1px solid #94a3b8;
}

/* 앞표지 겉면 (backface + 질감) */
.front-face {
  backface-visibility: hidden;
  transform: translateZ(2px);
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='rgba(255,255,255,0.03)'/%3E%3C/svg%3E");
  box-shadow: inset 5px 0 15px rgba(0, 0, 0, 0.3);
}

/* 앞표지 안쪽면 (backface + 3D 회전) */
.back-face {
  transform: rotateY(180deg);
  backface-visibility: hidden;
  padding: 4px 0 6px 6px;
}

/* 요술봉 그림자 */
.wand {
  filter: drop-shadow(0 0 10px rgba(253, 224, 71, 0.6));
}

/* 요술봉 막대 그라데이션 */
.wand-stick {
  background: linear-gradient(to top, #063f2e, #0f8763);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 요술봉 별 그림자 */
.wand-star {
  filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.9));
}

/* 파티클 스타일 */
.sparkle {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 10px white;
}

/* ============================================
   키프레임 애니메이션
   ============================================ */

@keyframes floating {
  0%,
  100% {
    transform: translateY(0) rotateX(15deg) rotateY(-20deg);
  }
  50% {
    transform: translateY(-20px) rotateX(20deg) rotateY(-10deg);
  }
}

.wand-active {
  animation: wand-float 2s ease-in-out infinite;
}

@keyframes wand-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-shake {
  animation: animate-shake 0.6s ease-in-out;
}

@keyframes animate-shake {
  0% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(-15deg);
  }
  40% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(-10deg);
  }
  80% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
