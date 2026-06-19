<script setup lang="ts">
import NotFound from '@images/errors/data-not-found.svg';

interface DataNotFound {
  title?: string
  subtitle?: string
}

const props = withDefaults(defineProps<DataNotFound>(), {
  title: 'Data Tidak Ditemukan',
  subtitle: 'Silahkan periksa input Anda dan coba lagi',
})
</script>

<template>
  <div class="d-flex flex-column align-center data-not-found-container">
    <NotFound />
    <span class="title-not-found">{{ title }}</span>
    <span class="subtitle-not-found">{{ subtitle }}</span>
  </div>
</template>

<style lang="scss" scoped>
.data-not-found-container {
  padding: 10rem 0;
}

.title-not-found {
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  padding: 12px 0 4px;
}

.subtitle-not-found {
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 133.333% */
}
</style>
