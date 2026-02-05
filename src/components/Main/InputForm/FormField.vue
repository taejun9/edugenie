<template>
  <div :class="colSpanClass">
    <label v-if="label" class="mb-2 block text-sm font-bold text-gray-800">
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * @component FormField
 * @description Form field wrapper component
 * A layout component that wraps label and input field together.
 * Can specify column span for use in grid system.
 *
 * @example
 * <FormField label="Learning Topic" :col-span="12">
 *   <TextInputField v-model="topic" />
 * </FormField>
 */
const props = defineProps({
  /**
   * Field label text
   */
  label: {
    type: String,
    default: '',
  },
  /**
   * Grid column span (1-12)
   */
  colSpan: {
    type: [String, Number],
    default: 12,
    validator: (value) => {
      const num = Number(value)
      return num >= 1 && num <= 12
    },
  },
})

/**
 * CSS class calculation based on column span
 * Processed as computed for Tailwind CSS dynamic class generation.
 * @type {import('vue').ComputedRef<string>}
 */
const colSpanClass = computed(() => {
  const span = Number(props.colSpan)
  const colSpanMap = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
    5: 'md:col-span-5',
    6: 'md:col-span-6',
    7: 'md:col-span-7',
    8: 'md:col-span-8',
    9: 'md:col-span-9',
    10: 'md:col-span-10',
    11: 'md:col-span-11',
    12: 'md:col-span-12',
  }
  return colSpanMap[span] || 'md:col-span-12'
})
</script>
