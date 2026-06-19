<script setup lang="ts">
interface Loading {
  size?: number
  height?: string
}

const props = withDefaults(defineProps<Loading>(), {
  size: 40,
  height: 'large',
})
</script>

<template>
  <div
    class="d-flex flex-column align-center circle-loading-container"
    :class="`circle-loading-container-${height}`"
  >
    <VProgressCircular
      indeterminate
      color="primary"
      :size="size"
    />
  </div>
</template>

<style lang="scss" scoped>
.circle-loading-container-large {
  padding: 10rem 0;
}
.circle-loading-container-small {
  padding: 5rem 0;
}
</style>
