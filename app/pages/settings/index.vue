<template>
  <AdminShell title="Settings">
    <div class="max-w-2xl space-y-6">
      <!-- General info -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 class="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">General</h2>
        <div class="space-y-4 text-sm text-gray-600">
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Admin Panel Version</span>
            <span class="text-gray-400">1.0.0</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">API Base URL</span>
            <span class="text-gray-400 font-mono text-xs">{{ apiBase }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Logged in as</span>
            <span class="text-gray-400">{{ auth.user?.email }}</span>
          </div>
        </div>
      </div>

      <!-- Change password -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 class="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Change Password</h2>

        <div v-if="pwSuccess" class="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <i class="fas fa-check-circle mr-1"></i> Password updated successfully.
        </div>
        <div v-if="pwError" class="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {{ pwError }}
        </div>

        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
            <input v-model="pw.current" type="password" required class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand-400 outline-none transition-all" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
            <input v-model="pw.password" type="password" required minlength="8" class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand-400 outline-none transition-all" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
            <input v-model="pw.password_confirmation" type="password" required class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand-400 outline-none transition-all" />
          </div>
          <button type="submit" :disabled="pwSaving" class="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
            <i v-if="pwSaving" class="fas fa-circle-notch fa-spin mr-1"></i>
            Update Password
          </button>
        </form>
      </div>

      <!-- Danger zone -->
      <div class="bg-white rounded-2xl border border-red-200 p-6">
        <h2 class="font-semibold text-red-700 mb-3">Danger Zone</h2>
        <p class="text-sm text-gray-500 mb-4">Sign out of the admin panel.</p>
        <button
          class="px-6 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl transition-colors"
          @click="handleLogout"
        >
          <i class="fas fa-sign-out-alt mr-2"></i>Sign Out
        </button>
      </div>
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: 'admin', layout: false })
useHead({ title: 'Settings — NoorLet Admin' })

const auth = useAuthStore()
const router = useRouter()
const { $apiFetch } = useNuxtApp()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const pw = reactive({ current: '', password: '', password_confirmation: '' })
const pwSaving = ref(false)
const pwError = ref('')
const pwSuccess = ref(false)

async function changePassword() {
  pwError.value = ''
  pwSuccess.value = false
  pwSaving.value = true
  try {
    await $apiFetch('/profile/password', {
      method: 'POST',
      body: { current_password: pw.current, password: pw.password, password_confirmation: pw.password_confirmation },
    })
    pwSuccess.value = true
    pw.current = ''
    pw.password = ''
    pw.password_confirmation = ''
  } catch (e: any) {
    pwError.value = e?.data?.message ?? 'Failed to update password.'
  } finally {
    pwSaving.value = false
  }
}

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>
