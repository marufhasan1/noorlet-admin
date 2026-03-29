<template>
  <AdminShell :title="order ? 'Order ' + order.order_number : 'Order Detail'">
    <template #header-actions>
      <NuxtLink to="/orders" class="text-sm text-gray-500 hover:text-gray-700">
        <i class="fas fa-arrow-left mr-1"></i> Back
      </NuxtLink>
    </template>

    <div v-if="loading" class="flex items-center justify-center h-64">
      <i class="fas fa-circle-notch fa-spin text-brand-500 text-2xl"></i>
    </div>

    <template v-else-if="order">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Order info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Items -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 class="font-semibold text-gray-900 mb-4">Order Items</h2>
            <div class="space-y-4">
              <div v-for="item in order.items" :key="item.id" class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <i class="fas fa-box text-gray-400"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 truncate">{{ item.product_name }}</p>
                  <p class="text-xs text-gray-400">
                    <span v-if="item.size">Size: {{ item.size }}</span>
                    <span v-if="item.color"> · Color: {{ item.color }}</span>
                    · Qty: {{ item.quantity }}
                  </p>
                </div>
                <p class="font-semibold text-gray-800">${{ (item.unit_price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>
            <div class="mt-5 pt-4 border-t border-gray-100 space-y-1.5 text-sm">
              <div class="flex justify-between text-gray-500">
                <span>Subtotal</span><span>${{ order.subtotal }}</span>
              </div>
              <div class="flex justify-between text-gray-500">
                <span>Shipping</span><span>{{ order.shipping == 0 ? 'Free' : '$' + order.shipping }}</span>
              </div>
              <div class="flex justify-between font-bold text-gray-900 pt-1">
                <span>Total</span><span>${{ order.total }}</span>
              </div>
            </div>
          </div>

          <!-- Shipping address -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 class="font-semibold text-gray-900 mb-3">Shipping Address</h2>
            <p class="text-sm text-gray-600 whitespace-pre-line">{{ order.shipping_address }}</p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Status -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 class="font-semibold text-gray-900 mb-4">Status</h2>
            <StatusBadge :status="order.status" />

            <div class="mt-4">
              <label class="block text-xs font-medium text-gray-500 mb-2">Update Status</label>
              <select v-model="newStatus" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-400 mb-3">
                <option value="processing">Processing</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                :disabled="saving || newStatus === order.status"
                class="w-full py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
                @click="updateStatus"
              >
                <i v-if="saving" class="fas fa-circle-notch fa-spin mr-1"></i>
                Save Status
              </button>
            </div>
          </div>

          <!-- Customer -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 class="font-semibold text-gray-900 mb-3">Customer</h2>
            <p class="font-medium text-gray-800">{{ order.user?.name }}</p>
            <p class="text-sm text-gray-400">{{ order.user?.email }}</p>
            <NuxtLink v-if="order.user" :to="'/users/' + order.user.id" class="mt-3 inline-flex items-center gap-1 text-xs text-brand-600 hover:underline">
              View profile <i class="fas fa-arrow-right"></i>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </AdminShell>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: false })

const route = useRoute()
const { $apiFetch } = useNuxtApp()

const loading = ref(true)
const saving = ref(false)
const order = ref<any>(null)
const newStatus = ref('')

onMounted(async () => {
  try {
    const res = await $apiFetch(`/admin/orders/${route.params.id}`) as any
    order.value = res.order
    newStatus.value = res.order.status
    useHead({ title: `Order ${res.order.order_number} — NoorLet Admin` })
  } finally {
    loading.value = false
  }
})

async function updateStatus() {
  saving.value = true
  try {
    const res = await $apiFetch(`/admin/orders/${order.value.id}/status`, {
      method: 'PATCH',
      body: { status: newStatus.value },
    }) as any
    order.value = res.order
    newStatus.value = res.order.status
  } finally {
    saving.value = false
  }
}
</script>
