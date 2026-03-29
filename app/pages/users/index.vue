<template>
  <AdminShell title="Users">
    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <input
        v-model="search"
        type="text"
        placeholder="Search name or email..."
        class="flex-1 min-w-48 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
        @input="debouncedLoad"
      />
      <select v-model="roleFilter" class="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none" @change="load">
        <option value="">All Roles</option>
        <option value="customer">Customers</option>
        <option value="seller">Sellers</option>
        <option value="admin">Admins</option>
      </select>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center h-48">
        <i class="fas fa-circle-notch fa-spin text-brand-500 text-xl"></i>
      </div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr class="text-left text-xs text-gray-500 font-semibold uppercase tracking-wide">
            <th class="px-6 py-4">Name</th>
            <th class="px-6 py-4">Email</th>
            <th class="px-6 py-4">Role</th>
            <th class="px-6 py-4">Joined</th>
            <th class="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold uppercase">
                  {{ initials(user.name) }}
                </div>
                <span class="font-medium text-gray-900">{{ user.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-500">{{ user.email }}</td>
            <td class="px-6 py-4"><StatusBadge :status="user.role ?? 'customer'" /></td>
            <td class="px-6 py-4 text-gray-400">{{ formatDate(user.created_at) }}</td>
            <td class="px-6 py-4 text-right">
              <NuxtLink :to="'/users/' + user.id" class="text-brand-600 hover:underline text-xs font-medium">
                View <i class="fas fa-arrow-right ml-1"></i>
              </NuxtLink>
            </td>
          </tr>
          <tr v-if="!users.length">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">No users found.</td>
          </tr>
        </tbody>
      </table>

      <div v-if="meta && meta.last_page > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <p class="text-sm text-gray-400">Page {{ meta.current_page }} of {{ meta.last_page }}</p>
        <div class="flex gap-2">
          <button :disabled="meta.current_page === 1" class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50" @click="changePage(meta.current_page - 1)">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button :disabled="meta.current_page === meta.last_page" class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50" @click="changePage(meta.current_page + 1)">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: false })
useHead({ title: 'Users — NoorLet Admin' })

const { $apiFetch } = useNuxtApp()
const loading = ref(true)
const users = ref<any[]>([])
const meta = ref<any>(null)
const search = ref('')
const roleFilter = ref('')
const page = ref(1)

const debouncedLoad = useDebounceFn(() => { page.value = 1; load() }, 400)

async function load() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (search.value) params.set('search', search.value)
    if (roleFilter.value) params.set('role', roleFilter.value)
    params.set('page', String(page.value))
    const res = await $apiFetch(`/admin/users?${params}`) as any
    users.value = res.data
    meta.value = { current_page: res.current_page, last_page: res.last_page }
  } finally {
    loading.value = false
  }
}

function changePage(p: number) { page.value = p; load() }
function initials(name: string) { return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() }
function formatDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }

onMounted(load)
</script>
