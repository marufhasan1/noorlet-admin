<template>
  <AdminShell :title="user ? user.name : 'User Detail'">
    <template #header-actions>
      <NuxtLink to="/users" class="text-sm text-gray-500 hover:text-gray-700">
        <i class="fas fa-arrow-left mr-1"></i> Back
      </NuxtLink>
    </template>

    <div v-if="loading" class="flex items-center justify-center h-64">
      <i class="fas fa-circle-notch fa-spin text-brand-500 text-2xl"></i>
    </div>

    <template v-else-if="user">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile & edit -->
        <div class="space-y-6">
          <div class="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <div class="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-bold uppercase mx-auto mb-3">
              {{ initials(user.name) }}
            </div>
            <h2 class="font-bold text-gray-900">{{ user.name }}</h2>
            <p class="text-sm text-gray-400">{{ user.email }}</p>
            <div class="mt-2"><StatusBadge :status="user.role ?? 'customer'" /></div>
          </div>

          <!-- Edit role -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Edit Role</h3>
            <select v-model="editRole" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-400 mb-3">
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
            <button
              :disabled="saving || editRole === user.role"
              class="w-full py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
              @click="saveRole"
            >
              <i v-if="saving" class="fas fa-circle-notch fa-spin mr-1"></i>
              Update Role
            </button>
          </div>
        </div>

        <!-- Orders -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 class="font-semibold text-gray-900 mb-4">Order History</h2>
          <div v-if="user.orders?.length" class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th class="pb-3 font-medium">Order #</th>
                  <th class="pb-3 font-medium">Status</th>
                  <th class="pb-3 font-medium">Total</th>
                  <th class="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="order in user.orders" :key="order.id">
                  <td class="py-3">
                    <NuxtLink :to="'/orders/' + order.id" class="text-brand-600 hover:underline font-medium">{{ order.order_number }}</NuxtLink>
                  </td>
                  <td class="py-3"><StatusBadge :status="order.status" /></td>
                  <td class="py-3 font-medium">${{ order.total }}</td>
                  <td class="py-3 text-gray-400">{{ formatDate(order.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-sm text-gray-400 py-8 text-center">No orders yet.</p>
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
const user = ref<any>(null)
const editRole = ref('')

onMounted(async () => {
  try {
    const res = await $apiFetch(`/admin/users/${route.params.id}`) as any
    user.value = res.user
    editRole.value = res.user.role ?? 'customer'
    useHead({ title: `${res.user.name} — NoorLet Admin` })
  } finally {
    loading.value = false
  }
})

async function saveRole() {
  saving.value = true
  try {
    const res = await $apiFetch(`/admin/users/${user.value.id}`, {
      method: 'PATCH',
      body: { role: editRole.value },
    }) as any
    user.value = { ...user.value, ...res.user }
  } finally {
    saving.value = false
  }
}

function initials(name: string) { return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() }
function formatDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
</script>
