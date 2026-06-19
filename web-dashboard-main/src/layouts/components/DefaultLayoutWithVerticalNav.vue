<script lang="ts" setup>
import navItems from '@/navigation/vertical';

// Components
// import Footer from '@/layouts/components/Footer.vue'
// import NavBarNotifications from '@/layouts/components/NavBarNotifications.vue'
// import NavbarShortcuts from '@/layouts/components/NavbarShortcuts.vue'
// import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue';
// import NavBarI18n from '@core/components/I18n.vue'

// @layouts plugin
import { useConfigStore } from '@/@core/stores/config';
import { useProfileStore } from '@/pages/profile/stores/profile';
import { VerticalNavLayout } from '@layouts';

const profileStore = useProfileStore()
const configStore = useConfigStore()

// get detail profile on refresh
profileStore.detail()

// ℹ️ Provide animation name for vertical nav collapse icon.
const verticalNavHeaderActionAnimationName = ref<null | 'rotate-180' | 'rotate-back-180'>(null)

watch([
  () => configStore.isVerticalNavCollapsed,
  () => configStore.isAppRTL,
], val => {
  if (configStore.isAppRTL)
    verticalNavHeaderActionAnimationName.value = val[0] ? 'rotate-back-180' : 'rotate-180'
  else
    verticalNavHeaderActionAnimationName.value = val[0] ? 'rotate-180' : 'rotate-back-180'
}, { immediate: true })

const actionArrowInitialRotation = configStore.isVerticalNavCollapsed ? '180deg' : '0deg'

const route = useRoute()
const breadcrumb = computed(() => route?.meta?.breadcrumb)

let menus = computed(() => {
  let menus = [{
        title: 'Dashboard',
        icon: { icon: 'bx-home' },
        to: 'dashboard',
      }]
  setTimeout(() => {
    if ($checkAccess('dashboard', 'index'))
      menus.push({
        title: 'Dashboard',
        icon: { icon: 'bx-home' },
        to: 'dashboard',
      })
  }, 450)
  return menus
})
  
// setTimeout(() => {
//   console.log('$checkAccess() computed menus', $checkAccess('dashboard', 'index'))
//   if ($checkAccess('dashboard', 'index'))
//     menus.push({
//       title: 'Dashboard',
//       icon: { icon: 'bx-home' },
//       to: 'dashboard',
//     })
// }, 450);
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
  <!-- <VerticalNavLayout :nav-items="navItemsData"> -->
  <!-- <VerticalNavLayout :nav-items="menus"> -->
  <!-- <VerticalNavLayout :nav-items="profileStore.menus"> -->
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          id="vertical-nav-toggle-btn"
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon
            size="26"
            icon="bx-menu"
          />
        </IconBtn>

        <!-- <NavSearchBar class="ms-lg-n3" /> -->

        <v-breadcrumbs
          v-if="breadcrumb"
          class="p-0"
          :items="breadcrumb"
        />

        <VSpacer />

        <!-- <NavBarI18n
          v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
          :languages="themeConfig.app.i18n.langConfig"
        />
        <NavbarThemeSwitcher />
        <NavbarShortcuts /> -->
        <!-- <NavBarNotifications class="me-1" /> -->
        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <!-- <template #footer>
      <Footer />
    </template> -->

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>

<style lang="scss">
@use "@layouts/styles/mixins" as layoutsMixins;

.layout-vertical-nav {
  // ℹ️ Nav header circle on the right edge
  .nav-header {
    position: relative;
    overflow: visible !important;

    &::after {
      --diameter: 36px;

      position: absolute;
      z-index: -1;
      // border: 7px solid rgba(var(--v-theme-background), 1);
      border: 7px solid #fff;
      border-radius: 100%;
      // border-radius: 10%;
      aspect-ratio: 1;
      background: rgba(var(--v-theme-surface), 1);
      content: "";
      inline-size: var(--diameter);
      inset-block-start: calc(50% - var(--diameter) / 2);
      inset-inline-end: -18px;

      @at-root {
        // Change background color of nav header circle when vertical nav is in overlay mode
        .layout-overlay-nav {
          --app-header-container-bg: rgb(var(--v-theme-surface));

          // ℹ️ Only transition in overlay mode
          .nav-header::after {
            transition: opacity 0.2s ease-in-out;
          }
        }

        .layout-vertical-nav-collapsed .layout-vertical-nav:not(.hovered) {
          .nav-header::after,
          .nav-header .header-action {
            opacity: 0;
          }
        }
      }
    }
  }

  // Don't show nav header circle when vertical nav is in overlay mode and not visible
  &.overlay-nav:not(.visible) .nav-header::after {
    opacity: 0;
  }
}

// ℹ️ Nav header action buttons styles
@keyframes rotate-180 {
  from {
    transform: rotate(0deg) scaleX(var(--app-header-actions-scale-x));
  }

  to {
    transform: rotate(180deg) scaleX(var(--app-header-actions-scale-x));
  }
}

@keyframes rotate-back-180 {
  from {
    transform: rotate(180deg) scaleX(var(--app-header-actions-scale-x));
  }

  to {
    transform: rotate(0deg) scaleX(var(--app-header-actions-scale-x));
  }
}

/* stylelint-disable-next-line no-duplicate-selectors */
.layout-vertical-nav {
  /* stylelint-disable-next-line no-duplicate-selectors */
  .nav-header {
    .header-action {
      // ℹ️ We need to create this CSS variable for reusing value in animation
      --app-header-actions-scale-x: 1;

      position: absolute;
      border-radius: 100%;
      animation-duration: 0.35s;
      animation-fill-mode: forwards;
      animation-name: v-bind(verticalNavHeaderActionAnimationName);
      color: white;
      inset-inline-end: 0;
      inset-inline-end: -11px;
      /* stylelint-disable-next-line value-keyword-case */
      transform: rotate(v-bind(actionArrowInitialRotation)) scaleX(var(--app-header-actions-scale-x));
      transition: opacity 0.2s ease-in-out;

      @include layoutsMixins.rtl {
        --app-header-actions-scale-x: -1;
      }

      @at-root {
        .layout-nav-type-vertical.layout-overlay-nav .layout-vertical-nav:not(.visible) .nav-header .header-action {
          opacity: 0;
        }
      }
    }
  }
}

// custom style
.v-breadcrumbs {
  padding-left: 0 !important;
}
</style>
