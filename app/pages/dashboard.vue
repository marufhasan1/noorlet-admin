<template>
  <AdminShell title="Dashboard">
    <div v-if="loading" class="flex items-center justify-center h-64">
      <i class="fas fa-circle-notch fa-spin text-brand-500 text-2xl"></i>
    </div>

    <template v-else>
      <!-- Stats grid -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon="fas fa-users" label="Total Users" :value="stats.total_users" color="blue" />
        <StatCard icon="fas fa-store" label="Sellers" :value="stats.total_sellers" color="purple" />
        <StatCard icon="fas fa-box" label="Products" :value="stats.total_products" color="indigo" />
        <StatCard icon="fas fa-shopping-bag" label="Orders" :value="stats.total_orders" color="amber" />
        <StatCard icon="fas fa-dollar-sign" label="Revenue" :value="'$' + stats.total_revenue?.toLocaleString()" color="green" class="col-span-2 lg:col-span-1" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent orders -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="font-semibold text-gray-900">Recent Orders</h2>
            <NuxtLink to="/orders" class="text-xs text-brand-600 hover:underline">View all</NuxtLink>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th class="pb-3 font-medium">Order #</th>
                  <th class="pb-3 font-medium">Customer</th>
                  <th class="pb-3 font-medium">Status</th>
                  <th class="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50">
                  <td class="py-3">
                    <NuxtLink :to="'/orders/' + order.id" class="font-medium text-brand-600 hover:underline">
                      {{ order.order_number }}
                    </NuxtLink>
                  </td>
                  <td class="py-3 text-gray-600">{{ order.user?.name ?? '—' }}</td>
                  <td class="py-3"><StatusBadge :status="order.status" /></td>
                  <td class="py-3 text-right font-medium">${{ order.total }}</td>
                </tr>
                <tr v-if="!recentOrders.length">
                  <td colspan="4" class="py-8 text-center text-gray-400">No orders yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orders by status -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 class="font-semibold text-gray-900 mb-5">Orders by Status</h2>
          <div class="space-y-3">
            <div
              v-for="(count, status) in ordersByStatus"
              :key="status"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <StatusBadge :status="String(status)" />
              </div>
              <span class="font-semibold text-gray-800">{{ count }}</span>
            </div>
            <p v-if="!Object.keys(ordersByStatus).length" class="text-sm text-gray-400 text-center py-4">No data.</p>
          </div>
        </div>
      </div>
    </template>
  </AdminShell>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: false })
useHead({ title: 'Dashboard — NoorLet Admin' })

const { $apiFetch } = useNuxtApp()

const loading = ref(true)
const stats = ref({ total_users: 0, total_sellers: 0, total_products: 0, total_orders: 0, total_revenue: 0 })
const recentOrders = ref<any[]>([])
const ordersByStatus = ref<Record<string, number>>({})

onMounted(async () => {
  try {
    const res = await $apiFetch('/admin/dashboard') as any
    stats.value = res.stats
    recentOrders.value = res.recent_orders
    ordersByStatus.value = res.orders_by_status
  } finally {
    loading.value = false
  }
})
</script>
