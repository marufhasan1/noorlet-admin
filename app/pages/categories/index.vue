<template>
  <AdminShell title="Categories">
    <template #header-actions>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors"
        @click="openModal()"
      >
        <i class="fas fa-plus"></i> Add Category
      </button>
    </template>

    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center h-48">
        <i class="fas fa-circle-notch fa-spin text-brand-500 text-xl"></i>
      </div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr class="text-left text-xs text-gray-500 font-semibold uppercase tracking-wide">
            <th class="px-6 py-4">Name</th>
            <th class="px-6 py-4">Description</th>
            <th class="px-6 py-4">Products</th>
            <th class="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-900">{{ cat.name }}</td>
            <td class="px-6 py-4 text-gray-500 max-w-xs truncate">{{ cat.description ?? '—' }}</td>
            <td class="px-6 py-4 text-gray-600">{{ cat.products_count }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <button class="text-brand-600 hover:text-brand-700 text-xs font-medium" @click="openModal(cat)">
                  <i class="fas fa-pen mr-1"></i>Edit
                </button>
                <button class="text-red-500 hover:text-red-600 text-xs font-medium" @click="deleteCategory(cat)">
                  <i class="fas fa-trash mr-1"></i>Delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!categories.length">
            <td colspan="4" class="px-6 py-12 text-center text-gray-400">No categories yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="modal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="modal = false"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 class="font-bold text-gray-900 text-lg mb-5">{{ editing ? 'Edit Category' : 'New Category' }}</h2>

        <div v-if="formError" class="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {{ formError }}
        </div>

        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Name *</label>
            <input v-model="form.name" required type="text" class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand-400 outline-none transition-all" placeholder="e.g. Women" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand-400 outline-none transition-all resize-none" placeholder="Optional description..."></textarea>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors" @click="modal = false">
              Cancel
            </button>
            <button type="submit" :disabled="saving" class="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
              <i v-if="saving" class="fas fa-circle-notch fa-spin mr-1"></i>
              {{ editing ? 'Save Changes' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: false })
useHead({ title: 'Categories — NoorLet Admin' })

const { $apiFetch } = useNuxtApp()
const loading = ref(true)
const saving = ref(false)
const categories = ref<any[]>([])
const modal = ref(false)
const editing = ref<any>(null)
const formError = ref('')
const form = reactive({ name: '', description: '' })

async function load() {
  loading.value = true
  try {
    const res = await $apiFetch('/admin/categories') as any
    categories.value = res.categories
  } finally {
    loading.value = false
  }
}

function openModal(cat?: any) {
  editing.value = cat ?? null
  form.name = cat?.name ?? ''
  form.description = cat?.description ?? ''
  formError.value = ''
  modal.value = true
}

async function saveCategory() {
  formError.value = ''
  saving.value = true
  try {
    if (editing.value) {
      const res = await $apiFetch(`/admin/categories/${editing.value.id}`, {
        method: 'PATCH',
        body: { name: form.name, description: form.description || null },
      }) as any
      const idx = categories.value.findIndex(c => c.id === editing.value.id)
      if (idx !== -1) categories.value[idx] = { ...categories.value[idx], ...res.category }
    } else {
      const res = await $apiFetch('/admin/categories', {
        method: 'POST',
        body: { name: form.name, description: form.description || null },
      }) as any
      categories.value.push({ ...res.category, products_count: 0 })
    }
    modal.value = false
  } catch (e: any) {
    formError.value = e?.data?.message ?? 'Failed to save.'
  } finally {
    saving.value = false
  }
}

async function deleteCategory(cat: any) {
  if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return
  await $apiFetch(`/admin/categories/${cat.id}`, { method: 'DELETE' })
  categories.value = categories.value.filter(c => c.id !== cat.id)
}

onMounted(load)
</script>
