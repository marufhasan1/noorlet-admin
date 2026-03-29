import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  if (!auth.loaded) {
    await auth.fetchUser()
  }

  if (!auth.isLoggedIn) {
    return navigateTo('/login')
  }

  if (!auth.isAdmin) {
    return navigateTo('/login?error=forbidden')
  }
})
