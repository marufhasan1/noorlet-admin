<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 mb-4">
          <i class="fas fa-shield-alt text-white text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-white">NoorLet Admin</h1>
        <p class="text-gray-400 text-sm mt-1">Sign in to your admin account</p>
      </div>

      <!-- Card -->
      <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800">
        <div v-if="errorMsg" class="mb-5 flex items-center gap-2 text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-xl px-4 py-3">
          <i class="fas fa-exclamation-circle"></i> {{ errorMsg }}
        </div>

        <form @submit.prevent="submit" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="admin@example.com"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <input
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <span v-if="loading"><i class="fas fa-circle-notch fa-spin mr-2"></i>Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })
useHead({ title: 'Admin Login — NoorLet' })

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref(route.query.error === 'forbidden' ? 'Access denied. Admin credentials required.' : '')

async function submit() {
  errorMsg.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e: any) {
    errorMsg.value = e?.data?.message ?? 'Invalid credentials.'
  } finally {
    loading.value = false
  }
}
</script>
