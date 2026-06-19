<script setup lang="ts">
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@core/utils/colorConverter'
import { useTheme } from 'vuetify'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()

const is_show_message = ref(false)
const color = ref('primary')
const variant = ref('tonal')
const message = ref('')

onMounted(() => {
  $emitter.on('showNotif', (params: any) => {
    color.value = params?.color ?? 'primary'
    message.value = params?.message ?? ''
    is_show_message.value = true
  })
})
</script>

<template>
  <VSnackbar
    v-model="is_show_message"
    location="top end"
    :variant="variant"
    :color="color"
  >
    <VIcon
      icon="bx-bell"
    />&nbsp;
    <span class="">{{ message }}</span>
  </VSnackbar>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template>
