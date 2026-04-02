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
            <th class="px-6 py-4">Category</th>
            <th class="px-6 py-4">Icon Preview</th>
            <th class="px-6 py-4">Slug</th>
            <th class="px-6 py-4">Products</th>
            <th class="px-6 py-4">Featured</th>
            <th class="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <div>
                <p class="font-medium text-gray-900">{{ cat.name }}</p>
                <p v-if="cat.description" class="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{{ cat.description }}</p>
              </div>
            </td>
            <td class="px-6 py-4">
              <div v-if="cat.icon" class="flex items-center gap-2">
                <div :class="['w-9 h-9 rounded-xl flex items-center justify-center', cat.icon_bg || 'bg-gray-100']">
                  <i :class="[cat.icon, cat.icon_color || 'text-gray-500', 'text-base']"></i>
                </div>
              </div>
              <span v-else class="text-gray-300 text-xs">—</span>
            </td>
            <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ cat.slug }}</td>
            <td class="px-6 py-4 text-gray-600">{{ cat.products_count }}</td>
            <td class="px-6 py-4">
              <button
                :class="cat.is_featured
                  ? 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'"
                class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                @click="toggleFeatured(cat)"
              >
                <i :class="cat.is_featured ? 'fas fa-star' : 'far fa-star'"></i>
                {{ cat.is_featured ? 'Featured' : 'Not Featured' }}
              </button>
            </td>
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
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">No categories yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="modal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="modal = false"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 class="font-bold text-gray-900 text-lg mb-5">{{ editing ? 'Edit Category' : 'New Category' }}</h2>

        <div v-if="formError" class="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {{ formError }}
        </div>

        <form @submit.prevent="saveCategory" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Name *</label>
            <input v-model="form.name" required type="text" class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand-400 outline-none transition-all" placeholder="e.g. Women" />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea v-model="form.description" rows="2" class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand-400 outline-none transition-all resize-none" placeholder="Optional short description..."></textarea>
          </div>

          <!-- Icon Class -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Icon</label>
            <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-brand-400 focus-within:bg-white transition-all">
              <div class="w-11 h-11 shrink-0 flex items-center justify-center bg-gray-100 border-r border-gray-200">
                <i :class="[form.icon || 'fas fa-tag', 'text-gray-500 text-base']"></i>
              </div>
              <select v-model="form.icon" class="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-gray-700 cursor-pointer">
                <option value="">— Select icon —</option>
                <optgroup v-for="group in iconOptions" :key="group.group" :label="group.group">
                  <option v-for="opt in group.items" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </optgroup>
              </select>
            </div>
          </div>

          <!-- Icon Color + Background -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Icon Color -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Icon Color</label>
              <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-brand-400 focus-within:bg-white transition-all">
                <div class="w-11 h-11 shrink-0 flex items-center justify-center border-r border-gray-200 bg-gray-100">
                  <span
                    class="w-5 h-5 rounded-full border-2 border-white shadow"
                    :style="{ background: selectedColor?.hex ?? '#9ca3af' }"
                  ></span>
                </div>
                <select v-model="form.icon_color" class="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-gray-700 cursor-pointer">
                  <option value="">— Select color —</option>
                  <option v-for="opt in colorOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
            </div>

            <!-- Icon Background -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Icon Background</label>
              <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-brand-400 focus-within:bg-white transition-all">
                <div class="w-11 h-11 shrink-0 flex items-center justify-center border-r border-gray-200 bg-gray-100">
                  <span
                    class="w-6 h-6 rounded-lg border border-gray-200"
                    :style="{ background: selectedBg?.hex ?? '#f3f4f6' }"
                  ></span>
                </div>
                <select v-model="form.icon_bg" class="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-gray-700 cursor-pointer">
                  <option value="">— Select background —</option>
                  <option v-for="opt in bgOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Icon preview -->
          <div v-if="form.icon" class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center shrink-0', form.icon_bg || 'bg-gray-200']">
              <i :class="[form.icon, form.icon_color || 'text-gray-500', 'text-2xl']"></i>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">{{ form.name || 'Category Name' }}</p>
              <p class="text-xs text-gray-400 mt-0.5">Homepage preview</p>
            </div>
          </div>

          <!-- Is Featured -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <p class="text-sm font-semibold text-gray-700">Featured on Homepage</p>
              <p class="text-xs text-gray-400 mt-0.5">Show in the Shop Categories section</p>
            </div>
            <button
              type="button"
              :class="form.is_featured ? 'bg-brand-600' : 'bg-gray-300'"
              class="relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
              @click="form.is_featured = !form.is_featured"
            >
              <span
                :class="form.is_featured ? 'translate-x-5' : 'translate-x-1'"
                class="inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 mt-1"
              ></span>
            </button>
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

// ─── Select options ───────────────────────────────────────────────────────────
const iconOptions = [
  {
    group: 'Fashion & Apparel',
    items: [
      { value: 'fas fa-tshirt',       label: '👕  T-Shirt' },
      { value: 'fas fa-user-tie',     label: '👔  Men\'s Suit' },
      { value: 'fas fa-shoe-prints',  label: '👟  Shoes' },
      { value: 'fas fa-socks',        label: '🧦  Socks' },
      { value: 'fas fa-hat-cowboy',   label: '🤠  Hat' },
      { value: 'fas fa-glasses',      label: '👓  Glasses' },
      { value: 'fas fa-mitten',       label: '🧤  Gloves' },
    ],
  },
  {
    group: 'Accessories & Beauty',
    items: [
      { value: 'fas fa-gem',          label: '💎  Gem / Jewellery' },
      { value: 'fas fa-ring',         label: '💍  Ring' },
      { value: 'fas fa-spa',          label: '🌸  Beauty / Spa' },
      { value: 'fas fa-shopping-bag', label: '🛍  Bags' },
      { value: 'fas fa-briefcase',    label: '💼  Briefcase' },
    ],
  },
  {
    group: 'People & Lifestyle',
    items: [
      { value: 'fas fa-child',        label: '🧒  Kids' },
      { value: 'fas fa-baby',         label: '👶  Baby' },
      { value: 'fas fa-dog',          label: '🐶  Pets' },
      { value: 'fas fa-dumbbell',     label: '🏋  Sports / Fitness' },
      { value: 'fas fa-bicycle',      label: '🚲  Outdoors' },
    ],
  },
  {
    group: 'Home & Electronics',
    items: [
      { value: 'fas fa-home',         label: '🏠  Home' },
      { value: 'fas fa-couch',        label: '🛋  Furniture' },
      { value: 'fas fa-laptop',       label: '💻  Electronics' },
      { value: 'fas fa-mobile-alt',   label: '📱  Mobile' },
      { value: 'fas fa-camera',       label: '📷  Camera' },
      { value: 'fas fa-headphones',   label: '🎧  Audio' },
      { value: 'fas fa-gamepad',      label: '🎮  Gaming' },
    ],
  },
  {
    group: 'Other',
    items: [
      { value: 'fas fa-book',         label: '📚  Books' },
      { value: 'fas fa-paint-brush',  label: '🎨  Art' },
      { value: 'fas fa-utensils',     label: '🍴  Food' },
      { value: 'fas fa-music',        label: '🎵  Music' },
      { value: 'fas fa-gift',         label: '🎁  Gift' },
      { value: 'fas fa-star',         label: '⭐  Star' },
      { value: 'fas fa-heart',        label: '❤️  Heart' },
      { value: 'fas fa-tag',          label: '🏷  Tag' },
      { value: 'fas fa-box',          label: '📦  Box' },
    ],
  },
]

const colorOptions = [
  { value: 'text-purple-500', label: 'Purple',      hex: '#a855f7' },
  { value: 'text-blue-500',   label: 'Blue',        hex: '#3b82f6' },
  { value: 'text-pink-500',   label: 'Pink',        hex: '#ec4899' },
  { value: 'text-rose-500',   label: 'Rose',        hex: '#f43f5e' },
  { value: 'text-red-500',    label: 'Red',         hex: '#ef4444' },
  { value: 'text-amber-500',  label: 'Amber',       hex: '#f59e0b' },
  { value: 'text-orange-500', label: 'Orange',      hex: '#f97316' },
  { value: 'text-yellow-500', label: 'Yellow',      hex: '#eab308' },
  { value: 'text-green-500',  label: 'Green',       hex: '#22c55e' },
  { value: 'text-teal-500',   label: 'Teal',        hex: '#14b8a6' },
  { value: 'text-cyan-500',   label: 'Cyan',        hex: '#06b6d4' },
  { value: 'text-indigo-500', label: 'Indigo',      hex: '#6366f1' },
  { value: 'text-gray-500',   label: 'Gray',        hex: '#6b7280' },
  { value: 'text-brand-500',  label: 'Brand',       hex: '#8b5cf6' },
]

const bgOptions = [
  { value: 'bg-purple-100', label: 'Purple',  hex: '#f3e8ff' },
  { value: 'bg-blue-100',   label: 'Blue',    hex: '#dbeafe' },
  { value: 'bg-pink-100',   label: 'Pink',    hex: '#fce7f3' },
  { value: 'bg-rose-100',   label: 'Rose',    hex: '#ffe4e6' },
  { value: 'bg-red-100',    label: 'Red',     hex: '#fee2e2' },
  { value: 'bg-amber-100',  label: 'Amber',   hex: '#fef3c7' },
  { value: 'bg-orange-100', label: 'Orange',  hex: '#ffedd5' },
  { value: 'bg-yellow-100', label: 'Yellow',  hex: '#fef9c3' },
  { value: 'bg-green-100',  label: 'Green',   hex: '#dcfce7' },
  { value: 'bg-teal-100',   label: 'Teal',    hex: '#ccfbf1' },
  { value: 'bg-cyan-100',   label: 'Cyan',    hex: '#cffafe' },
  { value: 'bg-indigo-100', label: 'Indigo',  hex: '#e0e7ff' },
  { value: 'bg-gray-100',   label: 'Gray',    hex: '#f3f4f6' },
  { value: 'bg-brand-100',  label: 'Brand',   hex: '#ede9fe' },
]

const { $apiFetch } = useNuxtApp()
const loading = ref(true)
const saving = ref(false)
const categories = ref<any[]>([])
const modal = ref(false)
const editing = ref<any>(null)
const formError = ref('')
const form = reactive({
  name: '', description: '', icon: '', icon_color: '', icon_bg: '', is_featured: false,
})

const selectedColor = computed(() => colorOptions.find(o => o.value === form.icon_color) ?? null)
const selectedBg    = computed(() => bgOptions.find(o => o.value === form.icon_bg) ?? null)

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
  form.name        = cat?.name ?? ''
  form.description = cat?.description ?? ''
  form.icon        = cat?.icon ?? ''
  form.icon_color  = cat?.icon_color ?? ''
  form.icon_bg     = cat?.icon_bg ?? ''
  form.is_featured = cat?.is_featured ?? false
  formError.value  = ''
  modal.value = true
}

async function saveCategory() {
  formError.value = ''
  saving.value = true
  try {
    const body = {
      name:        form.name,
      description: form.description || null,
      icon:        form.icon || null,
      icon_color:  form.icon_color || null,
      icon_bg:     form.icon_bg || null,
      is_featured: form.is_featured,
    }

    if (editing.value) {
      const res = await $apiFetch(`/admin/categories/${editing.value.id}`, { method: 'PATCH', body }) as any
      const idx = categories.value.findIndex(c => c.id === editing.value.id)
      if (idx !== -1) categories.value[idx] = { ...categories.value[idx], ...res.category }
    } else {
      const res = await $apiFetch('/admin/categories', { method: 'POST', body }) as any
      categories.value.push({ ...res.category, products_count: 0 })
    }
    modal.value = false
  } catch (e: any) {
    formError.value = e?.data?.message ?? 'Failed to save.'
  } finally {
    saving.value = false
  }
}

async function toggleFeatured(cat: any) {
  const res = await $apiFetch(`/admin/categories/${cat.id}`, {
    method: 'PATCH',
    body: { is_featured: !cat.is_featured },
  }) as any
  const idx = categories.value.findIndex(c => c.id === cat.id)
  if (idx !== -1) categories.value[idx] = { ...categories.value[idx], ...res.category }
}

async function deleteCategory(cat: any) {
  if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return
  await $apiFetch(`/admin/categories/${cat.id}`, { method: 'DELETE' })
  categories.value = categories.value.filter(c => c.id !== cat.id)
}

onMounted(load)
</script>
