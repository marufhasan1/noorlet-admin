<template>
  <AdminShell title="Agents / Sellers">
    <div class="flex flex-wrap gap-3 mb-6">
      <input
        v-model="search"
        type="text"
        placeholder="Search name, email or store..."
        class="flex-1 min-w-48 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
        @input="debouncedLoad"
      />
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center h-48">
        <i class="fas fa-circle-notch fa-spin text-brand-500 text-xl"></i>
      </div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr class="text-left text-xs text-gray-500 font-semibold uppercase tracking-wide">
            <th class="px-6 py-4">Seller</th>
            <th class="px-6 py-4">Store</th>
            <th class="px-6 py-4">Store Status</th>
            <th class="px-6 py-4">Joined</th>
            <th class="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="seller in sellers" :key="seller.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold uppercase">
                  {{ initials(seller.name) }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ seller.name }}</p>
                  <p class="text-xs text-gray-400">{{ seller.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span v-if="seller.store" class="font-medium text-gray-800">{{ seller.store.name }}</span>
              <span v-else class="text-gray-400">—</span>
            </td>
            <td class="px-6 py-4">
              <StatusBadge v-if="seller.store" :status="seller.store.status ?? 'pending'" />
              <span v-else class="text-gray-400 text-xs">—</span>
            </td>
            <td class="px-6 py-4 text-gray-400">{{ formatDate(seller.created_at) }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <!-- Approve/Suspend store -->
                <template v-if="seller.store">
                  <button
                    v-if="seller.store.status !== 'approved'"
                    class="text-xs px-2.5 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors font-medium"
                    @click="setStoreStatus(seller, 'approved')"
                  >Approve</button>
                  <button
                    v-if="seller.store.status !== 'suspended'"
                    class="text-xs px-2.5 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-medium"
                    @click="setStoreStatus(seller, 'suspended')"
                  >Suspend</button>
                </template>
                <!-- Revoke seller -->
                <button
                  class="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors font-medium"
                  @click="revoke(seller)"
                >Revoke</button>
              </div>
            </td>
          </tr>
          <tr v-if="!sellers.length">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">No sellers found.</td>
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
useHead({ title: 'Agents — NoorLet Admin' })

const { $apiFetch } = useNuxtApp()
const loading = ref(true)
const sellers = ref<any[]>([])
const meta = ref<any>(null)
const search = ref('')
const page = ref(1)

const debouncedLoad = useDebounceFn(() => { page.value = 1; load() }, 400)

async function load() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (search.value) params.set('search', search.value)
    params.set('page', String(page.value))
    const res = await $apiFetch(`/admin/sellers?${params}`) as any
    sellers.value = res.data
    meta.value = { current_page: res.current_page, last_page: res.last_page }
  } finally {
    loading.value = false
  }
}

function changePage(p: number) { page.value = p; load() }

async function setStoreStatus(seller: any, status: string) {
  await $apiFetch(`/admin/sellers/stores/${seller.store.id}/status`, {
    method: 'PATCH',
    body: { status },
  })
  seller.store.status = status
}

async function revoke(seller: any) {
  if (!confirm(`Revoke seller access for ${seller.name}?`)) return
  await $apiFetch(`/admin/sellers/${seller.id}/revoke`, { method: 'PATCH' })
  sellers.value = sellers.value.filter(s => s.id !== seller.id)
}

function initials(name: string) { return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() }
function formatDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }

onMounted(load)
</script>
