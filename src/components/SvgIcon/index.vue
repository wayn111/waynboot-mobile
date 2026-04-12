<template>
  <svg
    :class="svgClass"
    aria-hidden="true"
    :width="width ? width : size"
    :height="height ? height : size"
  >
    <use :href="iconName" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'


const props = defineProps({iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '28px',
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },})

const iconName = computed(() => {
  return `#icon-${props.iconClass}`
})

const svgClass = computed(() => {
  if (props.className) {
        return 'svg-icon ' + props.className
      } else {
        return 'svg-icon'
      }
})
</script>

<style scoped>
.svg-icon {
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
