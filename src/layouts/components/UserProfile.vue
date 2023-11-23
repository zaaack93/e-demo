<script setup lang="ts">
import { useUserStore } from '@/store/useUserStore'

const userStore = useUserStore()
const { setCurrentUser } = userStore
const { currentUser } = storeToRefs(userStore)

const logout = () => {
  // keycloak.logout({ redirectUri: `${location.origin}/login` })

}

onMounted(() => {
})
</script>

<template>
  <div class="container-profil">
    <div class="d-flex flex-column">
      <span class="text-h5 align-self-end" />
      <span class="text-caption font-weight-thin align-self-end" />
    </div>
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VIcon
        icon="tabler-logout"
        @click="$router.push({ name: 'login' })"
      />
    </VAvatar>
  </div>
</template>

<style scoped>
.container-profil {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 15px;
}
</style>
