import { defineThemeConfig } from '@core'
import { Skins } from '@core/enums'
import { breakpointsVuetifyV3 } from '@vueuse/core'
import { VIcon } from 'vuetify/components/VIcon'

// ❗ Logo SVG must be imported with ?raw suffix
// import logo from '@images/logo.svg?raw'
// import logo from '@images/logo-umy.svg?raw'
import logo from '@images/logo-ocelli.svg?raw'

import { AppContentLayoutNav, ContentWidth, FooterType, NavbarType } from '@layouts/enums'

export const { themeConfig, layoutConfig } = defineThemeConfig({
  app: {
    title: 'Ocelli',
    logo: h('div', { innerHTML: logo, style: 'line-height:0; color: rgb(var(--v-global-theme-primary))' }),
    // contentWidth: ContentWidth.Boxed,
    contentWidth: ContentWidth.Fluid,
    contentLayoutNav: AppContentLayoutNav.Vertical,
    overlayNavFromBreakpoint: breakpointsVuetifyV3.lg - 1, // 1 for matching with vuetify breakpoint. Docs: https://next.vuetifyjs.com/en/features/display-and-platform/
    i18n: {
      enable: false,
      // enable: true,
      defaultLocale: 'en',
      langConfig: [
        {
          label: 'English',
          i18nLang: 'en',
          isRTL: false,
        },
        {
          label: 'French',
          i18nLang: 'fr',
          isRTL: false,
        },
        {
          label: 'Arabic',
          i18nLang: 'ar',
          isRTL: true,
        },
      ],
    },
    // theme: 'system',
    theme: 'light',
    skin: Skins.Default,
    iconRenderer: VIcon,
  },
  navbar: {
    type: NavbarType.Sticky,
    navbarBlur: true,
  },
  footer: { type: FooterType.Static },
  verticalNav: {
    isVerticalNavCollapsed: false,
    defaultNavItemIconProps: { icon: 'bx-bxs-circle', color: 'disabled' },
    // isVerticalNavSemiDark: false,
    isVerticalNavSemiDark: true,
  },
  horizontalNav: {
    type: 'sticky',
    transition: 'slide-y-reverse-transition',
    popoverOffset: 6,
  },

  /*
  // ℹ️  In below Icons section, you can specify icon for each component. Also you can use other props of v-icon component like `color` and `size` for each icon.
  // Such as: chevronDown: { icon: 'bx-chevron-down', color:'primary', size: '24' },
  */
  icons: {
    chevronDown: { icon: 'bx-chevron-down', size: 22 },
    chevronRight: { icon: 'bx-chevron-right', size: 22 },
    close: { icon: 'bx-chevron-left', size: 22 },
    verticalNavPinned: { icon: 'bx-chevron-left', size: 22, class: 'flip-in-rtl' },
    verticalNavUnPinned: { icon: 'bx-chevron-left', size: 22, class: 'flip-in-rtl' },
    sectionTitlePlaceholder: { icon: 'bx-minus', color: 'disabled' },
  },
})
