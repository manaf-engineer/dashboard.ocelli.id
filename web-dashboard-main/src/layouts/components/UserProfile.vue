<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const router = useRouter()
const ability = useAbility()

// TODO: Get type from backend
const userData = useCookie<any>('userData')
// const userData = computed(() => useCookie<any>('userData'))
// watch(userData, () => {})

const logout = async () => {
  // Remove "accessToken" from cookie
  useCookie('accessToken').value = null

  // Remove "userData" from cookie
  userData.value = null

  // // Redirect to login page
  // await router.push('/login')

  // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page
  // Remove "userAbilities" from cookie
  // useCookie('userAbilityRules').value = null
  // await router.push('/login')

  // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page
  // Remove "userAbilities" from cookie
  useCookie('userAbilityRules').value = null

  // Reset ability to initial ability
  ability.update([])

  setTimeout(async () => {
    window.location.href = '/login'
}, 50);
}

const userProfileList = [
  { type: 'divider' },
  { type: 'navItem', icon: 'bx-user', title: 'Profile', to: { name: 'profile' } },
  // { type: 'navItem', icon: 'bx-user', title: 'Profile', to: { name: 'apps-user-view-id', params: { id: 21 } } },
  // { type: 'navItem', icon: 'bx-cog', title: 'Settings', to: { name: 'pages-account-settings-tab', params: { tab: 'account' } } },
  // { type: 'navItem', icon: 'bx-credit-card', title: 'Billing Plan', to: { name: 'pages-account-settings-tab', params: { tab: 'billing-plans' } }, badgeProps: { color: 'error', content: '4' } },
  // { type: 'divider' },
  // { type: 'navItem', icon: 'bx-dollar', title: 'Pricing', to: { name: 'pages-pricing' } },
  // { type: 'navItem', icon: 'bx-help-circle', title: 'FAQ', to: { name: 'pages-faq' } },
]
</script>

<template>
  <VBadge
    v-if="userData"
    dot
    bordered
    location="bottom right"
    offset-x="1"
    offset-y="2"
    color="success"
  >
    <VAvatar
      size="38"
      class="cursor-pointer"
      :color="!(userData && userData.photo) ? 'primary' : undefined"
      :variant="!(userData && userData.photo) ? 'tonal' : undefined"
    >
      <VImg
        v-if="userData && userData.photo"
        :src="userData.photo"
      />
      <VIcon
        v-else
        icon="bx-user"
      />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="240"
        location="bottom end"
        offset="20px"
      >
        <VList>
          <VListItem>
            <div class="d-flex gap-2 align-center">
              <VListItemAction>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                  bordered
                >
                  <VAvatar
                    :color="!(userData && userData?.photo) ? 'primary' : undefined"
                    :variant="!(userData && userData?.photo) ? 'tonal' : undefined"
                  >
                    <VImg
                      v-if="userData && userData?.photo"
                      :src="userData?.photo"
                    />
                    <VIcon
                      v-else
                      icon="bx-user"
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
              <div>
                <VListItemTitle class="font-weight-medium">
                  {{ userData.name }}
                </VListItemTitle>
                <VListItemSubtitle class="text-disabled text-capitalize">
                  {{ userData?.role_data?.name || '-' }}
                </VListItemSubtitle>
              </div>
            </div>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template
              v-for="item in userProfileList"
              :key="item.title"
            >
              <VListItem
                v-if="item.type === 'navItem'"
                :to="item.to"
              >
                <template #prepend>
                  <VIcon
                    :icon="item.icon"
                    size="22"
                  />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>

                <template
                  v-if="item.badgeProps"
                  #append
                >
                  <VBadge
                    rounded
                    class="me-3"
                    v-bind="item.badgeProps"
                  />
                </template>
              </VListItem>

              <VDivider
                v-else
                class="my-1"
              />
            </template>
            <!-- <VDivider class="my-1" /> -->
            <VListItem
              prepend-icon="bx-power-off"
              @click="logout"
            >
              Logout
            </VListItem>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
