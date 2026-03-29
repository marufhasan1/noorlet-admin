<template>
  <AdminShell title="Orders">
    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <input
        v-model="search"
        type="text"
        placeholder="Search order # or customer..."
        class="flex-1 min-w-48 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
        @input="debouncedLoad"
      />
      <select v-model="statusFilter" class="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none" @change="load">
        <option value="">All Statuses</option>
        <option value="processing">Processing</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center h-48">
        <i class="fas fa-circle-notch fa-spin text-brand-500 text-xl"></i>
      </div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr class="text-left text-xs text-gray-500 font-semibold uppercase tracking-wide">
            <th class="px-6 py-4">Order</th>
            <th class="px-6 py-4">Customer</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4">Total</th>
            <th class="px-6 py-4">Date</th>
            <th class="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-brand-600">{{ order.order_number }}</td>
            <td class="px-6 py-4 text-gray-700">{{ order.user?.name ?? '—' }}</td>
            <td class="px-6 py-4"><StatusBadge :status="order.status" /></td>
            <td class="px-6 py-4 font-medium">${{ order.total }}</td>
            <td class="px-6 py-4 text-gray-400">{{ formatDate(order.created_at) }}</td>
            <td class="px-6 py-4 text-right">
              <NuxtLink :to="'/orders/' + order.id" class="text-brand-600 hover:underline text-xs font-medium">
                View <i class="fas fa-arrow-right ml-1"></i>
              </NuxtLink>
            </td>
          </tr>
          <tr v-if="!orders.length">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">No orders found.</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="meta && meta.last_page > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <p class="text-sm text-gray-400">Page {{ meta.current_page }} of {{ meta.last_page }}</p>
        <div class="flex gap-2">
          <button
            :disabled="meta.current_page === 1"
            class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            @click="changePage(meta.current_page - 1)"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            :disabled="meta.current_page === meta.last_page"
            class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            @click="changePage(meta.current_page + 1)"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: false })
useHead({ title: 'Orders — NoorLet Admin' })

const { $apiFetch } = useNuxtApp()

const loading = ref(true)
const orders = ref<any[]>([])
const meta = ref<any>(null)
const search = ref('')
const statusFilter = ref('')
const page = ref(1)

const debouncedLoad = useDebounceFn(() => { page.value = 1; load() }, 400)

async function load() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (search.value) params.set('search', search.value)
    if (statusFilter.value) params.set('status', statusFilter.value)
    params.set('page', String(page.value))
    const res = await $apiFetch(`/admin/orders?${params}`) as any
    orders.value = res.data
    meta.value = { current_page: res.current_page, last_page: res.last_page }
  } finally {
    loading.value = false
  }
}

function changePage(p: number) { page.value = p; load() }

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(load)
</script>
