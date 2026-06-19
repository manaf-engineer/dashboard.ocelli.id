<script setup lang="ts">
interface Pagination {
  start_offset?: number
  list_length?: number
  total_items?: number
  total_page?: number
}

const model = defineModel()
const props = withDefaults(defineProps<Pagination>(), {
  start_offset: 0,
  list_length: 0,
  total_items: 0,
  total_page: 1,
})
</script>

<template>
  <VRow class="px-4 pb-4 pt-1 mt-1 border-t align-center">
    <VCol cols="8">
      <span>Tampilkan {{ start_offset + 1 }} sampai {{ start_offset + list_length }} dari {{ total_items }} data</span>
    </VCol>
    <VCol cols="4">
      <VPagination
        v-model="model"
        :length="total_page"
        class="table-pagination"
      />
    </VCol>
  </VRow>
</template>

<style lang="scss">
.table-pagination .v-pagination__list {
  justify-content: end !important;
}
</style>
