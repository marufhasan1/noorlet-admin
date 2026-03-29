<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-gray-900 text-white transition-transform duration-200"
    :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
      <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
        <i class="fas fa-shield-alt text-white text-sm"></i>
      </div>
      <span class="font-bold text-lg tracking-tight">NoorLet <span class="text-brand-400">Admin</span></span>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
      <SidebarLink to="/dashboard" icon="fas fa-tachometer-alt" label="Dashboard" />

      <div class="pt-4 pb-1 px-3">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Commerce</p>
      </div>
      <SidebarLink to="/orders" icon="fas fa-shopping-bag" label="Orders" />
      <SidebarLink to="/users" icon="fas fa-users" label="Users" />
      <SidebarLink to="/agents" icon="fas fa-store" label="Agents / Sellers" />

      <div class="pt-4 pb-1 px-3">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">CMS</p>
      </div>
      <SidebarLink to="/categories" icon="fas fa-tags" label="Categories" />

      <div class="pt-4 pb-1 px-3">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">System</p>
      </div>
      <SidebarLink to="/settings" icon="fas fa-cog" label="Settings" />
    </nav>

    <!-- User -->
    <div class="px-4 py-4 border-t border-gray-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold uppercase">
          {{ initials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ auth.user?.name }}</p>
          <p class="text-xs text-gray-400 truncate">{{ auth.user?.email }}</p>
        </div>
        <button @click="handleLogout" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-sign-out-alt text-sm"></i>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

defineProps<{ open: boolean }>()

const auth = useAuthStore()
const router = useRouter()

const initials = computed(() => {
  const name = auth.user?.name ?? ''
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
})

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>
