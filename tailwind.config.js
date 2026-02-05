/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '360px',
        'xs-375': '375px', // 아이폰 시리즈 공통
        'xs-390': '390px', // 아이폰 Pro 계열
        'xs-412': '412px', // 갤럭시 시리즈
        'xs-430': '430px', // 최신 갤럭시 울트라
        'xs-480': '480px', // 대화면 폰/소형 태블릿
        'xs-640': '640px',
        'xs-720': '720px', // 대화면 폰/소형 태블릿
        sm: '768px',
        md: '840px',
        lg: '960px',
        xl: '1024px',
        '2xl': '1152px',
        '3xl': '1280px',
        '4xl': '1366px',
        '5xl': '1440px',
      },
      boxShadow: {
        'custom-light': '0px 0px 8px #e9e9e9, 0px 0px 12px #f5f5f5',
      },
      colors: {
        color: {
          main: '#2563EB', // Tailwind의 blue-600
          sub: '#7f22fe', // Tailwind의 violet-600
          genie: '#4C8FA7',
          book: '#0F8763',
          // sub: '#0084d1', // Tailwind의 sky-600
          // sub2: '#0092b8', // Tailwind의 cyan-600
          // testr: '#4f39f6', // Tailwind의 indigo-600
          // testrz: '#f6339a', // Tailwind의 pink-500
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  safelist: [
    // slide-in-from-top 패턴 (1자리 숫자만 허용)
    {
      pattern: /^slide-in-from-top-[0-9]$/,
    },
    // slide-in-from-bottom 패턴 (1자리 숫자만 허용)
    {
      pattern: /^slide-in-from-bottom-[0-9]$/,
    },
    // zoom-in 패턴 (1자리 또는 2자리 숫자 허용: 90, 95, 98 등)
    {
      pattern: /^zoom-in-[0-9]{1,2}$/,
    },
    // truncate-text 패턴 (1자리 또는 2자리 숫자 허용: 1-10)
    {
      pattern: /^truncate-text-[0-9]{1,2}$/,
    },
  ],
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.contents-container': {
          width: '100%',
          'max-width': '1440px',
          margin: '0 auto',
          padding: '0 16px',
        },
        '.contents-padding': {
          padding: '32px 4px',
        },

        '@screen xs-640': {
          '.contents-padding': {
            padding: '32px 8px',
          },
        },
        '@screen sm': {
          '.contents-padding': {
            padding: '40px 16px',
          },
        },
        '@screen lg': {
          '.contents-padding': {
            padding: '48px 32px',
          },
        },
        // 애니메이션 인 유틸리티 (기본값)
        '.animate-in': {
          animation: 'fadeIn 0.3s ease-out',
        },
        '.fade-in': {
          opacity: '0',
          animation: 'fadeIn 0.3s ease-out forwards',
        },
      })
    }),
    plugin(function ({ addUtilities, matchUtilities, theme }) {
      // 키프레임 정의
      addUtilities({
        '@keyframes fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        '@keyframes slideInFromTop': {
          '0%': {
            opacity: '0',
            transform: 'translateY(var(--slide-distance, -0.5rem))',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        '@keyframes slideInFromBottom': {
          '0%': {
            opacity: '0',
            transform: 'translateY(var(--slide-distance, 1rem))',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        '@keyframes zoomIn': {
          '0%': {
            opacity: '0',
            transform: 'scale(var(--zoom-scale, 0.95))',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      })

      // slide-in-from-top-[value] 유틸리티 (arbitrary values 및 일반 형식 지원)
      matchUtilities(
        {
          'slide-in-from-top': (value) => {
            // 숫자만 입력된 경우 rem 단위로 변환 (예: 2 -> 0.5rem, 4 -> 1rem)
            let distance = value || '0.5rem'
            if (/^\d+$/.test(distance)) {
              // 숫자만 있으면 rem으로 변환 (2 = 0.5rem, 4 = 1rem)
              distance = `${parseInt(distance) * 0.25}rem`
            }
            return {
              '--slide-distance': `-${distance}`,
              animation: 'slideInFromTop 0.3s ease-out forwards',
            }
          },
        },
        {
          // 일반 형식 지원: slide-in-from-top-2, slide-in-from-top-4 등
          values: {
            2: '2',
            4: '4',
            6: '6',
            8: '8',
          },
          supportsArbitraryValues: true,
        },
      )

      // slide-in-from-bottom-[value] 유틸리티 (arbitrary values 및 일반 형식 지원)
      matchUtilities(
        {
          'slide-in-from-bottom': (value) => {
            // 숫자만 입력된 경우 rem 단위로 변환 (예: 2 -> 0.5rem, 4 -> 1rem)
            let distance = value || '1rem'
            if (/^\d+$/.test(distance)) {
              // 숫자만 있으면 rem으로 변환 (2 = 0.5rem, 4 = 1rem)
              distance = `${parseInt(distance) * 0.25}rem`
            }
            return {
              '--slide-distance': distance,
              animation: 'slideInFromBottom 0.5s ease-out forwards',
            }
          },
        },
        {
          // 일반 형식 지원: slide-in-from-bottom-2, slide-in-from-bottom-4 등
          values: {
            2: '2',
            4: '4',
            6: '6',
            8: '8',
          },
          supportsArbitraryValues: true,
        },
      )

      // zoom-in-[value] 유틸리티 (arbitrary values 및 일반 형식 지원)
      matchUtilities(
        {
          'zoom-in': (value) => {
            let scale = value || '0.95'
            // 숫자만 입력된 경우 소수점으로 변환 (예: 95 -> 0.95)
            if (/^\d+$/.test(scale)) {
              scale = `${parseInt(scale) / 100}`
            }
            return {
              '--zoom-scale': scale,
              animation: 'zoomIn 0.3s ease-out forwards',
            }
          },
        },
        {
          // 일반 형식 지원: zoom-in-95, zoom-in-90 등
          values: {
            90: '90',
            95: '95',
            98: '98',
          },
          supportsArbitraryValues: true,
        },
      )

      // truncate-text-[lines] 유틸리티 (일반 형식과 arbitrary values 모두 지원)
      matchUtilities(
        {
          'truncate-text': (value) => {
            const lines = parseInt(value) || 2
            // 기본 줄 높이 24px (1.5rem) 가정
            const lineHeight = 24
            const maxHeight = lines * lineHeight

            return {
              display: '-webkit-box',
              '-webkit-line-clamp': lines.toString(),
              '-webkit-box-orient': 'vertical',
              overflow: 'hidden',
              'text-overflow': 'ellipsis',
              'max-height': `${maxHeight}px`,
            }
          },
        },
        {
          // 일반 형식 지원: truncate-text-1, truncate-text-2 등
          values: {
            1: '1',
            2: '2',
            3: '3',
            4: '4',
            5: '5',
            6: '6',
            7: '7',
            8: '8',
            9: '9',
            10: '10',
          },
          // arbitrary values도 지원: truncate-text-[15] 등
          supportsArbitraryValues: true,
        },
      )
    }),
  ],
}
