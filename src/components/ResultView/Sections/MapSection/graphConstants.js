/**
 * 그래프 시각화 관련 상수값
 */

/** 캔버스 기본 너비 */
export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 550

/** 노드 반지름 기본값 */
export const BASE_NODE_RADIUS = 25

/** 노드 반지름 증가 배수 (중요도당) */
export const RADIUS_PER_IMPORTANCE = 2.5

/**
 * 노드 수에 따른 캔버스 높이 계산
 * @param {number} nodeCount - 노드 개수
 * @returns {number} 캔버스 높이 (픽셀)
 */
export const getCanvasHeight = (nodeCount) => {
  return CANVAS_HEIGHT + (nodeCount - 5) * 10
}

/** 색상 상수 */
export const COLORS = {
  edge: {
    default: '#cbd5e1',
    active: '#4f46e5',
  },
  node: {
    stroke: {
      default: '#94a3b8',
      active: '#4f46e5',
    },
    fill: {
      default: '#f8fafc',
      active: '#eef2ff',
    },
    label: {
      default: '#334155',
      active: '#312e81',
    },
  },
  edgeLabel: {
    stroke: {
      default: '#94a3b8',
      active: '#4f46e5',
    },
    text: {
      default: '#64748b',
      active: '#4f46e5',
    },
  },
}
