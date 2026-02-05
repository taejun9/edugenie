<template>
  <div class="relative">
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900 outline-none focus:border-color-main focus:ring-2 focus:ring-color-main/70"
      :class="disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
    >
      <option
        v-for="option in options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
    <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  </div>
</template>

<script setup>
/**
 * @component SelectField
 * @description 드롭다운 선택 필드 컴포넌트
 * 학년, 지문 길이, 맵 복잡도, 언어 등 선택 옵션을 제공하는 재사용 가능한 드롭다운입니다.
 * 문자열 배열 또는 객체 배열을 옵션으로 받을 수 있습니다.
 *
 * @example
 * // 문자열 배열 사용
 * <SelectField
 *   v-model="gradeLevel"
 *   :options="['초등 2학년', '초등 3학년']"
 *   :disabled="false"
 * />
 *
 * // 객체 배열 사용
 * <SelectField
 *   v-model="passageLength"
 *   :options="[{id: 'short', label: '짧음'}, {id: 'medium', label: '보통'}]"
 *   option-value="id"
 *   option-label="label"
 * />
 */
const props = defineProps({
  /**
   * 선택된 값 (v-model)
   */
  modelValue: {
    type: [String, Number],
    required: true,
  },
  /**
   * 선택 옵션 배열
   * 문자열 배열 또는 객체 배열 가능
   */
  options: {
    type: Array,
    required: true,
  },
  /**
   * 옵션 객체에서 값을 추출할 속성명 (옵션 객체인 경우)
   * 기본값: 'value'
   */
  optionValue: {
    type: String,
    default: 'value',
  },
  /**
   * 옵션 객체에서 라벨을 추출할 속성명 (옵션 객체인 경우)
   * 기본값: 'label'
   */
  optionLabel: {
    type: String,
    default: 'label',
  },
  /**
   * 비활성화 여부
   */
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue'])

/**
 * 옵션에서 값을 추출합니다.
 * 문자열인 경우 그대로 반환하고, 객체인 경우 지정된 속성값을 반환합니다.
 * @param {string|object} option - 옵션 (문자열 또는 객체)
 * @returns {string|number} 옵션 값
 */
const getOptionValue = (option) => {
  if (typeof option === 'string' || typeof option === 'number') {
    return option
  }
  return option[props.optionValue] ?? option
}

/**
 * 옵션에서 라벨을 추출합니다.
 * 문자열인 경우 그대로 반환하고, 객체인 경우 지정된 속성값을 반환합니다.
 * @param {string|object} option - 옵션 (문자열 또는 객체)
 * @returns {string} 옵션 라벨
 */
const getOptionLabel = (option) => {
  if (typeof option === 'string' || typeof option === 'number') {
    return String(option)
  }
  return option[props.optionLabel] ?? String(option)
}
</script>
