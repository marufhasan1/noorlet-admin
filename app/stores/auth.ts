import { defineStore } from 'pinia'

interface AdminUser {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AdminUser | null,
    loaded: false,
  }),

  getters: {
    isLoggedIn: (s) => !!s.user,
    // All records in the admins table are admins — no role check needed
    isAdmin: (s) => !!s.user,
  },

  actions: {
    async fetchUser() {
      const { $apiFetch } = useNuxtApp()
      try {
        const res = await $apiFetch('/admin/auth/user') as any
        this.user = res.admin ?? null
      } catch {
        this.user = null
      } finally {
        this.loaded = true
      }
    },

    async login(email: string, password: string) {
      const { $apiFetch } = useNuxtApp()
      const res = await $apiFetch('/admin/auth/login', {
        method: 'POST',
        body: { email, password },
      }) as any
      this.user = res.admin ?? null
      this.loaded = true
    },

    async logout() {
      const { $apiFetch } = useNuxtApp()
      await $apiFetch('/admin/auth/logout', { method: 'POST' }).catch(() => {})
      this.user = null
    },
  },
})
