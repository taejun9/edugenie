<template>
  <defs>
    <!-- 점선 그리드 패턴 -->
    <pattern id="dotGrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
    </pattern>

    <!-- 노드 그림자 필터 -->
    <filter id="nodeShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
      <feOffset dx="0" dy="2" result="offsetblur" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.2" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- 기본 화살표 마커 -->
    <marker
      id="arrowhead"
      markerWidth="8"
      markerHeight="6"
      refX="28"
      refY="3"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <polygon points="0 0, 8 3, 0 6" fill="#cbd5e1" />
    </marker>

    <!-- 활성화된 화살표 마커 -->
    <marker
      id="arrowhead-active"
      markerWidth="8"
      markerHeight="6"
      refX="28"
      refY="3"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <polygon points="0 0, 8 3, 0 6" fill="#4f46e5" />
    </marker>
  </defs>
</template>

<script setup>
/**
 * @component SVGDefs
 * @description SVG 정의 컴포넌트
 * 그래프 시각화에 필요한 SVG 패턴, 필터, 마커를 정의합니다.
 *
 * 포함 요소:
 * - dotGrid: 배경 점선 그리드 패턴
 * - nodeShadow: 노드 그림자 필터
 * - arrowhead: 기본 간선 화살표 마커
 * - arrowhead-active: 활성화된 간선 화살표 마커
 */
</script>
